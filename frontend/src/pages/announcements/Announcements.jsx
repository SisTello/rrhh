import { useEffect, useMemo, useState } from "react";

import { categories, initialAnnouncements } from "./announcementsData";
import CommunicationsWorkspace from "./CommunicationWorkspace";
import { addLocalCalendarEvent, removeLocalCalendarEvent } from "../../data/localCalendarEvents";
import "./announcements.scss";

const statusOptions = ["Publicado", "Borrador", "Programado", "Archivado"];
const priorities = ["Normal", "Alta", "Urgente"];
const emptyForm = {
    title: "",
    category: categories[0],
    summary: "",
    content: "",
    priority: "Normal",
    featured: false,
    expiresAt: "",
    attachments: [],
    alsoInCalendar: false,
    calendarDate: "",
    calendarStartTime: "",
    calendarEndTime: "",
    calendarLocation: "",
    calendarCategory: "empresa",
    calendarAudience: "",
    calendarDescription: "",
};

const formatDate = (value) => {
    if (!value) return "—";
    return new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(`${value}T12:00:00`));
};

const dateToday = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const makeAnnouncementId = (items) => {
    const latest = items.reduce((max, item) => Math.max(max, Number(item.id.split("-")[1]) || 0), 0);
    return `COM-${String(latest + 1).padStart(3, "0")}`;
};

const Announcements = () => {
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [dialog, setDialog] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const [toast, setToast] = useState("");
    const [section, setSection] = useState("news");
    const pageSize = 6;

    useEffect(() => {
        const timer = window.setTimeout(() => setLoading(false), 220);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = window.setTimeout(() => setToast(""), 3000);
        return () => window.clearTimeout(timer);
    }, [toast]);

    const metrics = useMemo(() => ({
        total: announcements.length,
        published: announcements.filter((item) => item.status === "Publicado").length,
        drafts: announcements.filter((item) => item.status === "Borrador").length,
        scheduled: announcements.filter((item) => item.status === "Programado").length,
    }), [announcements]);

    const filtered = useMemo(() => {
        const query = search.trim().toLocaleLowerCase("es");
        return announcements.filter((item) => {
            const matchesSearch = !query || `${item.title} ${item.summary} ${item.author} ${item.category}`.toLocaleLowerCase("es").includes(query);
            const matchesStatus = !statusFilter || item.status === statusFilter;
            const matchesCategory = !categoryFilter || item.category === categoryFilter;
            const date = item.publishedAt || item.scheduledAt;
            const matchesFrom = !dateFrom || (date && date >= dateFrom);
            const matchesTo = !dateTo || (date && date <= dateTo);
            return matchesSearch && matchesStatus && matchesCategory && matchesFrom && matchesTo;
        });
    }, [announcements, search, statusFilter, categoryFilter, dateFrom, dateTo]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

    const openCreate = () => {
        setForm({ ...emptyForm });
        setFormError("");
        setDialog({ mode: "form" });
    };

    const openEdit = (announcement) => {
        setForm({ ...announcement, attachments: [...announcement.attachments] });
        setFormError("");
        setDialog({ mode: "form", item: announcement });
    };

    const openSchedule = (announcement) => {
        setFormError("");
        setDialog({ mode: "schedule", item: announcement, date: announcement.scheduledAt || "" });
    };

    const changeStatus = (item, status, date = "") => {
        setAnnouncements((current) => current.map((announcement) => announcement.id === item.id ? {
            ...announcement,
            status,
            publishedAt: status === "Publicado" ? date || dateToday() : announcement.publishedAt,
            scheduledAt: status === "Programado" ? date : "",
        } : announcement));
        setToast(status === "Publicado" ? "El comunicado se publicó correctamente." : status === "Archivado" ? "El comunicado se archivó." : "El comunicado se programó correctamente.");
        setDialog(null);
    };

    const submitForm = (event) => {
        event.preventDefault();
        if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
            setFormError("Completa el título, el resumen y el contenido.");
            return;
        }
        if (form.alsoInCalendar && (
            !form.calendarDate ||
            !form.calendarStartTime ||
            !form.calendarEndTime ||
            form.calendarEndTime <= form.calendarStartTime ||
            !form.calendarLocation.trim() ||
            !form.calendarCategory ||
            !form.calendarAudience.trim() ||
            !form.calendarDescription.trim()
        )) {
            setFormError("Completa todos los campos del evento y verifica que la hora de término sea posterior a la de inicio.");
            return;
        }
        const calendarEventId = `announcement-${dialog.item?.id || makeAnnouncementId(announcements)}`;
        if (dialog.item) {
            setAnnouncements((current) => current.map((item) => item.id === dialog.item.id ? { ...item, ...form, title: form.title.trim(), author: item.author } : item));
            setToast("Los cambios se guardaron correctamente.");
        } else {
            const item = {
                ...form,
                id: makeAnnouncementId(announcements),
                author: "Mariana Flores",
                status: "Borrador",
                publishedAt: "",
                scheduledAt: "",
            };
            setAnnouncements((current) => [item, ...current]);
            setPage(1);
            setToast("El comunicado se guardó como borrador.");
        }
        if (form.alsoInCalendar) {
            addLocalCalendarEvent({
                id: calendarEventId,
                title: form.title.trim(),
                date: form.calendarDate,
                time: form.calendarStartTime,
                endTime: form.calendarEndTime,
                location: form.calendarLocation.trim(),
                category: form.calendarCategory,
                audience: form.calendarAudience.trim(),
                description: form.calendarDescription.trim(),
                visibility: form.calendarCategory,
            });
        } else if (dialog.item) {
            removeLocalCalendarEvent(`announcement-${dialog.item.id}`);
        }
        setDialog(null);
    };

    const handleAttachments = (event) => {
        const files = [...event.target.files].map((file) => file.name);
        setForm((current) => ({
            ...current,
            attachments: [...new Set([...current.attachments, ...files])],
        }));
        event.target.value = "";
    };

    const updateFilter = (setter, value) => {
        setter(value);
        setPage(1);
    };

    const statusClass = (status) => ({
        Publicado: "published",
        Borrador: "draft",
        Programado: "scheduled",
        Archivado: "archived",
    }[status] || "");

    return (
        <main className="announcements-page">
            <header className="announcements-header">
                <div>
                    <span className="announcements-eyebrow">COMUNICACIÓN INTERNA</span>
                    <h1>Comunicados</h1>
                    <p>Redacta, programa y administra las novedades para el equipo.</p>
                </div>
                {section === "news" && <button type="button" className="btn btn-primary announcements-primary" onClick={openCreate}>
                    <i className="bi bi-plus-lg" aria-hidden="true"></i>
                    Crear comunicado
                </button>}
            </header>

            <section className="announcements-metrics" aria-label="Resumen de comunicados">
                {[
                    { label: "Total de comunicados", value: metrics.total, icon: "bi-megaphone", tone: "blue" },
                    { label: "Publicados", value: metrics.published, icon: "bi-check-circle", tone: "green" },
                    { label: "Borradores", value: metrics.drafts, icon: "bi-pencil-square", tone: "yellow" },
                    { label: "Programados", value: metrics.scheduled, icon: "bi-calendar-event", tone: "red" },
                ].map((metric) => (
                    <article className="announcements-metric" key={metric.label}>
                        <span className={`announcements-metric__icon ${metric.tone}`}><i className={`bi ${metric.icon}`} aria-hidden="true"></i></span>
                        <div><span>{metric.label}</span><strong>{metric.value}</strong></div>
                    </article>
                ))}
            </section>

            <nav className="announcements-section-tabs" aria-label="Secciones de comunicados">
                <button type="button" className={section === "news" ? "active" : ""} aria-current={section === "news" ? "page" : undefined} onClick={() => setSection("news")}><i className="bi bi-megaphone"></i>Comunicados</button>
                <button type="button" className={section === "direct" ? "active" : ""} aria-current={section === "direct" ? "page" : undefined} onClick={() => setSection("direct")}><i className="bi bi-envelope"></i>Comunicaciones directas y memorándums</button>
                <button type="button" className={section === "pending" ? "active" : ""} aria-current={section === "pending" ? "page" : undefined} onClick={() => setSection("pending")}><i className="bi bi-clipboard-check"></i>Acciones pendientes</button>
            </nav>

            <div hidden={section !== "news"}>
            <section className="announcements-panel">
                <div className="announcements-filters">
                    <label className="announcements-search">
                        <i className="bi bi-search" aria-hidden="true"></i>
                        <span className="visually-hidden">Buscar comunicados</span>
                        <input type="search" value={search} onChange={(event) => updateFilter(setSearch, event.target.value)} placeholder="Buscar por título, autor o categoría..." />
                    </label>
                    <label><span>Estado</span><select value={statusFilter} onChange={(event) => updateFilter(setStatusFilter, event.target.value)}><option value="">Todos</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label>
                    <label><span>Categoría</span><select value={categoryFilter} onChange={(event) => updateFilter(setCategoryFilter, event.target.value)}><option value="">Todas</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                    <label><span>Desde</span><input type="date" value={dateFrom} onChange={(event) => updateFilter(setDateFrom, event.target.value)} /></label>
                    <label><span>Hasta</span><input type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => updateFilter(setDateTo, event.target.value)} /></label>
                </div>

                {loading ? (
                    <div className="announcements-state" role="status"><span className="spinner-border spinner-border-sm"></span>Cargando comunicados...</div>
                ) : visible.length === 0 ? (
                    <div className="announcements-state"><i className="bi bi-inbox" aria-hidden="true"></i><strong>No se encontraron comunicados</strong><span>Prueba con otros filtros o crea un nuevo comunicado.</span></div>
                ) : (
                    <div className="announcements-table-wrap">
                        <table className="announcements-table">
                            <thead><tr><th>Comunicado</th><th>Categoría</th><th>Fecha</th><th>Autor</th><th>Estado</th><th><span className="visually-hidden">Acciones</span></th></tr></thead>
                            <tbody>{visible.map((item) => (
                                <tr key={item.id}>
                                    <td className="announcement-title-cell"><button type="button" onClick={() => setDialog({ mode: "detail", item })}>{item.featured && <i className="bi bi-star-fill announcement-featured" aria-label="Destacado"></i>}{item.priority === "Urgente" && <i className="bi bi-exclamation-triangle-fill announcement-urgent" aria-label="Prioridad urgente"></i>}{item.title}</button><small>{item.id}{item.attachments.length > 0 && <><span> · </span><i className="bi bi-paperclip" aria-label="Adjuntos"></i> {item.attachments.length}</>}</small></td>
                                    <td>{item.category}</td>
                                    <td>{formatDate(item.publishedAt || item.scheduledAt)}</td>
                                    <td>{item.author}</td>
                                    <td><span className={`announcement-status ${statusClass(item.status)}`}>{item.status}</span></td>
                                    <td><div className="announcement-actions">
                                        <button type="button" title="Ver detalle" aria-label={`Ver detalle de ${item.title}`} onClick={() => setDialog({ mode: "detail", item })}><i className="bi bi-eye"></i></button>
                                        <button type="button" title="Vista previa" aria-label={`Vista previa de ${item.title}`} onClick={() => setDialog({ mode: "preview", item })}><i className="bi bi-card-text"></i></button>
                                        <button type="button" title="Editar" aria-label={`Editar ${item.title}`} onClick={() => openEdit(item)}><i className="bi bi-pencil"></i></button>
                                        {item.status === "Borrador" && <button type="button" title="Publicar" aria-label={`Publicar ${item.title}`} onClick={() => setDialog({ mode: "publish", item })}><i className="bi bi-send"></i></button>}
                                        {item.status !== "Archivado" && item.status !== "Publicado" && <button type="button" title="Programar" aria-label={`Programar ${item.title}`} onClick={() => openSchedule(item)}><i className="bi bi-calendar-plus"></i></button>}
                                        {item.status !== "Archivado" && <button type="button" className="is-archive" title="Archivar" aria-label={`Archivar ${item.title}`} onClick={() => setDialog({ mode: "archive", item })}><i className="bi bi-archive"></i></button>}
                                    </div></td>
                                </tr>
                            ))}</tbody>
                        </table>
                        <footer className="announcements-pagination"><span>Mostrando {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} de {filtered.length}</span><div><button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Anterior</button><span>Página {page} de {pageCount}</span><button type="button" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)}>Siguiente</button></div></footer>
                    </div>
                )}
                <p className="announcements-demo-note"><i className="bi bi-info-circle" aria-hidden="true"></i> Los cambios se guardan únicamente en el estado de esta demostración.</p>
            </section>
            </div>

            <div hidden={section === "news"}>
                <CommunicationsWorkspace view={section} />
            </div>

            {toast && <div className="announcements-toast" role="status"><i className="bi bi-check-circle-fill" aria-hidden="true"></i>{toast}</div>}

            {dialog && (
                <div className="announcement-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
                    <section className="announcement-dialog" role="dialog" aria-modal="true" aria-labelledby="announcement-dialog-title">
                        <header><h2 id="announcement-dialog-title">{dialog.mode === "form" ? dialog.item ? "Editar comunicado" : "Crear comunicado" : dialog.mode === "detail" ? "Detalle del comunicado" : dialog.mode === "preview" ? "Vista previa" : dialog.mode === "schedule" ? "Programar comunicado" : dialog.mode === "publish" ? "Publicar comunicado" : "Archivar comunicado"}</h2><button type="button" aria-label="Cerrar" onClick={() => setDialog(null)}><i className="bi bi-x-lg"></i></button></header>
                        {dialog.mode === "form" ? (
                            <form className="announcement-form" onSubmit={submitForm}>
                                <label><span>Título *</span><input required maxLength="120" value={form.title} onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))} /></label>
                                <div className="announcement-form-row">
                                    <label><span>Categoría *</span><select value={form.category} onChange={(event) => setForm((value) => ({ ...value, category: event.target.value }))}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                                    <label><span>Prioridad</span><select value={form.priority} onChange={(event) => setForm((value) => ({ ...value, priority: event.target.value }))}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
                                </div>
                                <label><span>Resumen *</span><textarea required rows="2" maxLength="220" value={form.summary} onChange={(event) => setForm((value) => ({ ...value, summary: event.target.value }))} /></label>
                                <label><span>Contenido *</span><textarea required rows="6" value={form.content} onChange={(event) => setForm((value) => ({ ...value, content: event.target.value }))} /></label>
                                <label className="announcement-check"><input type="checkbox" checked={Boolean(form.alsoInCalendar)} onChange={(event) => setForm((value) => ({ ...value, alsoInCalendar: event.target.checked }))} /><span>¿Deseas que este comunicado también aparezca en el calendario?</span></label>
                                {form.alsoInCalendar && (
                                    <fieldset className="announcement-calendar-fields">
                                        <legend>Datos del evento en el calendario</legend>
                                        <div className="announcement-form-row">
                                            <label><span>Fecha *</span><input type="date" required value={form.calendarDate || ""} onChange={(event) => setForm((value) => ({ ...value, calendarDate: event.target.value }))} /></label>
                                            <label><span>Horario de inicio *</span><input type="time" required value={form.calendarStartTime || ""} onChange={(event) => setForm((value) => ({ ...value, calendarStartTime: event.target.value }))} /></label>
                                            <label><span>Horario de término *</span><input type="time" required min={form.calendarStartTime || undefined} value={form.calendarEndTime || ""} onChange={(event) => setForm((value) => ({ ...value, calendarEndTime: event.target.value }))} /></label>
                                        </div>
                                        <div className="announcement-form-row">
                                            <label><span>Lugar *</span><input required value={form.calendarLocation || ""} onChange={(event) => setForm((value) => ({ ...value, calendarLocation: event.target.value }))} /></label>
                                            <label><span>Categoría *</span><select required value={form.calendarCategory || "empresa"} onChange={(event) => setForm((value) => ({ ...value, calendarCategory: event.target.value }))}>{["empresa", "departamento", "sucursal", "reunion", "capacitacion", "actividad"].map((category) => <option key={category} value={category}>{({ empresa: "Empresa", departamento: "Departamento", sucursal: "Sucursal", reunion: "Reunión", capacitacion: "Capacitación", actividad: "Actividad" })[category]}</option>)}</select></label>
                                        </div>
                                        <label><span>Dirigido a *</span><input required value={form.calendarAudience || ""} onChange={(event) => setForm((value) => ({ ...value, calendarAudience: event.target.value }))} /></label>
                                        <label><span>Descripción *</span><textarea required rows="3" value={form.calendarDescription || ""} onChange={(event) => setForm((value) => ({ ...value, calendarDescription: event.target.value }))} /></label>
                                    </fieldset>
                                )}
                                <div className="announcement-form-row">
                                    <label><span>Fecha de expiración</span><input type="date" min={dateToday()} value={form.expiresAt} onChange={(event) => setForm((value) => ({ ...value, expiresAt: event.target.value }))} /></label>
                                    <label className="announcement-check"><input type="checkbox" checked={form.featured} onChange={(event) => setForm((value) => ({ ...value, featured: event.target.checked }))} /><span>Destacar comunicado</span></label>
                                </div>
                                <label><span>Adjuntos</span><input type="file" multiple onChange={handleAttachments} /><small>Los nombres se conservan localmente; no se cargan archivos a un servidor.</small></label>
                                {form.attachments.length > 0 && <ul className="announcement-attachments">{form.attachments.map((name) => <li key={name}><i className="bi bi-paperclip"></i>{name}<button type="button" aria-label={`Quitar ${name}`} onClick={() => setForm((value) => ({ ...value, attachments: value.attachments.filter((file) => file !== name) }))}><i className="bi bi-x-lg"></i></button></li>)}</ul>}
                                {formError && <p className="announcement-error" role="alert"><i className="bi bi-exclamation-circle"></i>{formError}</p>}
                                <footer><button type="button" className="btn btn-outline-secondary" onClick={() => setDialog({ mode: "preview", item: { ...form, author: dialog.item?.author || "Mariana Flores", status: "Borrador" }, returnToForm: true })}>Vista previa</button><button type="button" className="btn btn-outline-secondary" onClick={() => setDialog(null)}>Cancelar</button><button type="submit" className="btn btn-primary announcements-primary">Guardar borrador</button></footer>
                            </form>
                        ) : dialog.mode === "detail" || dialog.mode === "preview" ? (
                            <article className="announcement-detail">
                                <div className="announcement-detail__meta"><span className="announcement-category">{dialog.item.category}</span><span className={`announcement-status ${statusClass(dialog.item.status)}`}>{dialog.item.status}</span>{dialog.item.featured && <span className="announcement-featured-label"><i className="bi bi-star-fill"></i> Destacado</span>}</div>
                                <h3>{dialog.item.title || "Comunicado sin título"}</h3>
                                <p className="announcement-detail__summary">{dialog.item.summary}</p>
                                <div className="announcement-detail__byline"><span><i className="bi bi-person"></i> {dialog.item.author}</span><span><i className="bi bi-calendar3"></i> {formatDate(dialog.item.publishedAt || dialog.item.scheduledAt) === "—" ? "Sin publicar" : formatDate(dialog.item.publishedAt || dialog.item.scheduledAt)}</span><span><i className="bi bi-flag"></i> Prioridad {dialog.item.priority}</span></div>
                                <div className="announcement-detail__content">{dialog.item.content}</div>
                                {dialog.item.expiresAt && <p className="announcement-expiration"><i className="bi bi-clock"></i> Expira el {formatDate(dialog.item.expiresAt)}</p>}
                                {dialog.item.attachments?.length > 0 && <div className="announcement-detail-files"><strong>Archivos adjuntos</strong>{dialog.item.attachments.map((file) => <span key={file}><i className="bi bi-paperclip"></i>{file}</span>)}</div>}
                                <footer>{dialog.returnToForm && <button type="button" className="btn btn-outline-secondary" onClick={() => { setForm(dialog.item); setDialog({ mode: "form", item: dialog.item.id ? dialog.item : undefined }); }}>Volver a edición</button>}<button type="button" className="btn btn-outline-secondary" onClick={() => setDialog(null)}>Cerrar</button></footer>
                            </article>
                        ) : dialog.mode === "schedule" ? (
                            <form className="announcement-confirm" onSubmit={(event) => { event.preventDefault(); if (dialog.date < dateToday()) { setFormError("La fecha debe ser hoy o posterior."); return; } changeStatus(dialog.item, "Programado", dialog.date); }}>
                                <p>Selecciona la fecha en que se publicará «{dialog.item.title}».</p><label><span>Fecha de publicación *</span><input type="date" min={dateToday()} required value={dialog.date} onChange={(event) => { setDialog((value) => ({ ...value, date: event.target.value })); setFormError(""); }} /></label>{formError && <p className="announcement-error" role="alert">{formError}</p>}<footer><button type="button" className="btn btn-outline-secondary" onClick={() => setDialog(null)}>Cancelar</button><button type="submit" className="btn btn-primary announcements-primary">Programar</button></footer>
                            </form>
                        ) : (
                            <div className="announcement-confirm"><i className={`bi ${dialog.mode === "publish" ? "bi-send-check" : "bi-archive"}`}></i><p>{dialog.mode === "publish" ? `¿Publicar ahora «${dialog.item.title}»?` : `¿Archivar «${dialog.item.title}»? El comunicado dejará de estar activo, pero conservará su historial.`}</p><footer><button type="button" className="btn btn-outline-secondary" onClick={() => setDialog(null)}>Cancelar</button><button type="button" className={`btn ${dialog.mode === "publish" ? "btn-primary announcements-primary" : "btn-danger"}`} onClick={() => changeStatus(dialog.item, dialog.mode === "publish" ? "Publicado" : "Archivado")}>{dialog.mode === "publish" ? "Publicar ahora" : "Archivar"}</button></footer></div>
                        )}
                    </section>
                </div>
            )}
        </main>
    );
};

export default Announcements;
