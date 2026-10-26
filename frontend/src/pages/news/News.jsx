import { useEffect, useRef, useState } from "react";
import "./news.scss";

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
const allowedAttachmentExtensions = new Set(["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv"]);

const initialNews = [
    {
        id: 1,
        category: "IMPORTANTE",
        title: "Actualización del horario de atención",
        description: "Se informa al personal que a partir del 01 de octubre se aplicará el nuevo horario de atención.",
        area: "Administración",
        date: "2026-09-24",
        icon: "bi-building",
        attachments: ["Comunicado_Horario_2026.pdf"],
        url: "",
        image: "",
    },
    {
        id: 2,
        category: "SISTEMAS",
        title: "Mantenimiento programado de sistemas",
        description: "Se realizará mantenimiento de los servicios internos durante el día viernes.",
        area: "Sistemas",
        date: "2026-09-23",
        icon: "bi-pc-display",
        attachments: ["Mantenimiento_Sistemas.pdf"],
        url: "",
        image: "",
    },
];

const emptyForm = { title: "", description: "", image: "", attachments: [], url: "", category: "General", date: "" };

const formatDate = (date) => date
    ? new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`))
    : "Sin fecha";

const isValidExternalUrl = (value) => {
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch {
        return false;
    }
};

const News = () => {
    const [newsItems, setNewsItems] = useState(initialNews);
    const [dialog, setDialog] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const newsItemsRef = useRef(newsItems);

    useEffect(() => {
        newsItemsRef.current = newsItems;
    }, [newsItems]);

    useEffect(() => () => {
        const urls = new Set(newsItemsRef.current.flatMap((news) => [
            ...(news.attachments || []).map((attachment) => typeof attachment === "object" ? attachment.url : ""),
            news.image,
        ]).filter((url) => typeof url === "string" && url.startsWith("blob:")));
        urls.forEach((url) => URL.revokeObjectURL(url));
    }, []);

    const openCreate = () => {
        setForm({ ...emptyForm });
        setFormError("");
        setDialog({ mode: "form" });
    };

    const openEdit = (news) => {
        setForm({ ...news, attachments: [...(news.attachments || [])], image: news.image || "" });
        setFormError("");
        setDialog({ mode: "form", item: news });
    };

    const submitNews = (event) => {
        event.preventDefault();
        if (!form.title.trim() || !form.description.trim() || !form.category || !form.date) {
            setFormError("Completa el título, el contenido, la categoría y la fecha de publicación.");
            return;
        }
        if (form.url.trim() && !isValidExternalUrl(form.url.trim())) {
            setFormError("Ingresa una URL válida que comience con http:// o https://.");
            return;
        }
        if (form.attachments.some((attachment) => attachment instanceof File && (
            attachment.size > MAX_ATTACHMENT_SIZE ||
            !allowedAttachmentExtensions.has(attachment.name.split(".").pop()?.toLowerCase())
        ))) {
            setFormError("Revisa los adjuntos: solo se aceptan PDF, Word, Excel, PowerPoint, TXT o CSV de hasta 10 MB por archivo.");
            return;
        }
        const attachments = form.attachments.map((attachment) => {
            if (!(attachment instanceof File)) return attachment;
            return {
                name: attachment.name,
                size: attachment.size,
                type: attachment.type,
                url: URL.createObjectURL(attachment),
            };
        });
        const image = form.image instanceof File ? URL.createObjectURL(form.image) : form.image;
        const item = {
            ...form,
            attachments,
            image,
            title: form.title.trim(),
            description: form.description.trim(),
            url: form.url.trim(),
            area: "Recursos Humanos",
            icon: "bi-megaphone",
        };
        if (dialog.item) {
            const retainedUrls = new Set(attachments.filter((attachment) => typeof attachment === "object").map((attachment) => attachment.url));
            (dialog.item.attachments || []).forEach((attachment) => {
                if (typeof attachment === "object" && attachment.url && !retainedUrls.has(attachment.url)) {
                    URL.revokeObjectURL(attachment.url);
                }
            });
            if (dialog.item.image?.startsWith("blob:") && dialog.item.image !== image) {
                URL.revokeObjectURL(dialog.item.image);
            }
            setNewsItems((current) => current.map((news) => news.id === dialog.item.id ? { ...news, ...item } : news));
        } else {
            setNewsItems((current) => [{ ...item, id: Date.now() }, ...current]);
        }
        setDialog(null);
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setFormError("Selecciona un archivo de imagen válido.");
            event.target.value = "";
            return;
        }
        setForm((current) => ({ ...current, image: file }));
        setFormError("");
    };

    const handleAttachmentsChange = (event) => {
        const files = Array.from(event.target.files || []);
        const invalidFiles = files.filter((file) => (
            !allowedAttachmentExtensions.has(file.name.split(".").pop()?.toLowerCase()) ||
            file.size > MAX_ATTACHMENT_SIZE
        ));
        if (invalidFiles.length) {
            setFormError(`No se agregaron ${invalidFiles.map((file) => file.name).join(", ")}. Solo se aceptan PDF, Word, Excel, PowerPoint, TXT o CSV de hasta 10 MB por archivo.`);
        } else {
            setForm((current) => {
                const existing = new Set(current.attachments.map((file) => `${file.name}-${file.size ?? 0}`));
                const additions = files.filter((file) => !existing.has(`${file.name}-${file.size}`));
                return { ...current, attachments: [...current.attachments, ...additions] };
            });
            setFormError("");
        }
        event.target.value = "";
    };

    const removeAttachment = (index) => {
        setForm((current) => ({ ...current, attachments: current.attachments.filter((_, fileIndex) => fileIndex !== index) }));
    };

    return (
        <div className="news-page">
            <div className="news-page__header">
                <div>
                    <h1>Noticias</h1>
                    <p>Información y novedades para todos los colaboradores.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openCreate}>
                    <i className="bi bi-plus-lg" aria-hidden="true"></i> Crear noticia
                </button>
            </div>
            <div className="news-list">
                {newsItems.map((news) => (
                    <article className="news-card" key={news.id}>
                        <div className="news-card__media">
                            {news.image
                                ? <img src={news.image} alt="" />
                                : <i className={`bi ${news.icon}`} aria-hidden="true"></i>}
                        </div>
                        <div className="news-card__content">
                            {news.category && <span className="news-card__category">{news.category}</span>}
                            <h2>{news.title}</h2>
                            <p>{news.description}</p>
                            <div className="news-card__meta">
                                <span>{news.area}</span><span className="news-card__separator">·</span><span>{formatDate(news.date)}</span>
                            </div>
                            {news.url && isValidExternalUrl(news.url) && (
                                <a className="news-external-link" href={news.url} target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-box-arrow-up-right" aria-hidden="true"></i> Abrir enlace externo
                                </a>
                            )}
                            {news.attachments?.length > 0 && (
                                <ul className="news-attachments" aria-label="Archivos adjuntos">
                                    {news.attachments.map((attachment, index) => {
                                        const available = typeof attachment === "object" && attachment.url;
                                        const filename = typeof attachment === "object" ? attachment.name : attachment;
                                        return (
                                            <li key={`${filename}-${index}`}>
                                                <span><i className="bi bi-paperclip" aria-hidden="true"></i> {filename}</span>
                                                {available
                                                    ? <a className="btn btn-sm btn-outline-primary" href={attachment.url} download={attachment.name} rel="noreferrer"><i className="bi bi-download" aria-hidden="true"></i> Descargar</a>
                                                    : <small>Archivo de ejemplo no disponible</small>}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                            <button type="button" className="news-edit-button" onClick={() => openEdit(news)}>
                                <i className="bi bi-pencil" aria-hidden="true"></i> Editar noticia
                            </button>
                        </div>
                    </article>
                ))}
                {newsItems.length === 0 && <p className="news-empty">Todavía no hay noticias publicadas.</p>}
            </div>

            {dialog && (
                <div className="news-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
                    <section className="news-dialog" role="dialog" aria-modal="true" aria-labelledby="news-dialog-title">
                        <header>
                            <h2 id="news-dialog-title">{dialog.item ? "Editar noticia" : "Crear noticia"}</h2>
                            <button type="button" aria-label="Cerrar" onClick={() => setDialog(null)}><i className="bi bi-x-lg" aria-hidden="true"></i></button>
                        </header>
                        <form onSubmit={submitNews}>
                            <label>Título *
                                <input required maxLength="140" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
                            </label>
                            <label>Contenido *
                                <textarea required rows="5" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
                            </label>
                            <div className="news-dialog__row">
                                <label>Categoría *
                                    <select required value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
                                        {["General", "Importante", "IMPORTANTE", "SISTEMAS", "Recursos Humanos", "Tecnología", "Eventos"].map((category) => <option key={category} value={category}>{category}</option>)}
                                    </select>
                                </label>
                                <label>Fecha de publicación *
                                    <input type="date" required value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
                                </label>
                            </div>
                            <label>URL (opcional)
                                <input type="url" inputMode="url" placeholder="https://ejemplo.com" value={form.url} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} />
                            </label>
                            <label>Imagen (opcional)
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                                <small>La imagen solo se conserva en esta sesión; no se carga a un servidor.</small>
                            </label>
                            <label>Documentos adjuntos (opcional)
                                <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv" onChange={handleAttachmentsChange} />
                                <small>PDF, Word, Excel, PowerPoint, TXT o CSV · máximo 10 MB por archivo. Los archivos solo están disponibles durante esta sesión.</small>
                            </label>
                            {form.attachments.length > 0 && (
                                <ul className="news-form-attachments">
                                    {form.attachments.map((attachment, index) => {
                                        const name = typeof attachment === "object" ? attachment.name : attachment;
                                        const size = typeof attachment === "object" ? attachment.size : null;
                                        const available = typeof attachment === "object" && attachment.url;
                                        return (
                                            <li key={`${name}-${index}`}>
                                                <span><i className="bi bi-paperclip" aria-hidden="true"></i> {name}{size !== null && ` · ${(size / 1024 / 1024).toFixed(2)} MB`}</span>
                                                {available && <a className="btn btn-sm btn-outline-primary" href={attachment.url} download={attachment.name} rel="noreferrer"><i className="bi bi-download" aria-hidden="true"></i> Descargar</a>}
                                                <button type="button" className="btn btn-sm btn-outline-danger" aria-label={`Quitar ${name}`} onClick={() => removeAttachment(index)}><i className="bi bi-trash" aria-hidden="true"></i> Quitar</button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                            {formError && <p className="news-form-error" role="alert">{formError}</p>}
                            <footer>
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setDialog(null)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Guardar noticia</button>
                            </footer>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
};

export default News;
