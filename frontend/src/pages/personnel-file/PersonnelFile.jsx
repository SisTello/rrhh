import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { initialEmployees } from "../administrator/administratorData";
import mockEmployees from "../../data/mockEmployees";
import "./personnel-file.scss";

const categories = [
    { id: "performance", label: "Calificación de Desempeño", types: ["Calificación de desempeño"] },
    { id: "recruitment", label: "Reclutamiento y selección", types: ["Hoja de vida", "Fotocopia de Cédula de Identidad", "Certificado de nacimiento", "Libreta de Servicio Militar", "Certificados de estudios y títulos", "Certificado de buena salud o examen médico", "Declaración jurada de bienes y rentas"] },
    { id: "contractual", label: "Documentos contractuales y de seguridad social", types: ["Contrato de trabajo y adendas", "Memorándum de designación", "Registro de afiliación a la Gestora", "Aseguramiento en la Caja de Salud", "Declaración de derechohabientes"] },
    { id: "development", label: "Desarrollo y movilidad laboral", types: ["Memorándum de ascenso o transferencia", "Asignación de funciones", "Certificado de capacitación", "Evaluación de desempeño", "Solicitud o registro de vacaciones"] },
    { id: "disciplinary", label: "Sanciones y reconocimientos", types: ["Memorándum de reconocimiento", "Reporte de incentivos", "Llamada de atención", "Acta de descargo o amonestación"] },
    { id: "separation", label: "Desvinculación o cese", types: ["Carta de renuncia o despido", "Acta de entrega de cargo"] },
];
const maxFileSize = 10 * 1024 * 1024;
const allowedFileExtensions = new Set(["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "jpg", "jpeg", "png", "gif", "webp"]);
const initialDocuments = [
    { id: "demo-file-1", employeeId: "EMP-001", categoryId: "recruitment", name: "Hoja_de_vida.pdf", type: "Hoja de vida", description: "Currículum entregado durante el proceso de selección.", issueDate: "2023-02-01", uploadedAt: "2023-02-03", expirationDate: "", status: "Vigente", observations: "Documento de demostración; archivo no disponible.", fileUrl: "", mimeType: "", file: null },
    { id: "demo-file-2", employeeId: "EMP-001", categoryId: "recruitment", name: "Certificado_estudios.pdf", type: "Certificados de estudios y títulos", description: "Copia de respaldo de formación académica.", issueDate: "2022-11-18", uploadedAt: "2023-02-03", expirationDate: "", status: "Vigente", observations: "Documento de demostración; archivo no disponible.", fileUrl: "", mimeType: "", file: null },
    { id: "demo-file-3", employeeId: "EMP-001", categoryId: "contractual", name: "Contrato_laboral.pdf", type: "Contrato de trabajo y adendas", description: "Contrato de trabajo inicial.", issueDate: "2023-03-01", uploadedAt: "2023-03-01", expirationDate: "", status: "Vigente", observations: "Documento de demostración; archivo no disponible.", fileUrl: "", mimeType: "", file: null },
    { id: "demo-file-4", employeeId: "EMP-001", categoryId: "development", name: "Certificado_capacitacion.pdf", type: "Certificado de capacitación", description: "Participación en capacitación institucional.", issueDate: "2025-08-14", uploadedAt: "2025-08-20", expirationDate: "", status: "Vigente", observations: "Documento de demostración; archivo no disponible.", fileUrl: "", mimeType: "", file: null },
    { id: "demo-file-5", employeeId: "EMP-001", categoryId: "disciplinary", name: "Reconocimiento.pdf", type: "Memorándum de reconocimiento", description: "Reconocimiento institucional de ejemplo.", issueDate: "2025-12-10", uploadedAt: "2025-12-11", expirationDate: "", status: "Vigente", observations: "Documento de demostración; archivo no disponible.", fileUrl: "", mimeType: "", file: null },
    { id: "demo-file-6", employeeId: "EMP-001", categoryId: "separation", name: "Entrega_de_cargo.pdf", type: "Acta de entrega de cargo", description: "Categoría disponible para registros cuando corresponda.", issueDate: "2026-01-05", uploadedAt: "2026-01-05", expirationDate: "", status: "Archivado", observations: "Registro ilustrativo; archivo no disponible.", fileUrl: "", mimeType: "", file: null },
];
const initialRatings = [
    { id: "demo-rating-1", employeeId: "EMP-001", score: "4", evaluationDate: "2024-12-18", evaluator: "Gabriela Rojas", comments: "Buen cumplimiento de objetivos del periodo." },
    { id: "demo-rating-2", employeeId: "EMP-001", score: "5", evaluationDate: "2025-12-16", evaluator: "Gabriela Rojas", comments: "Desempeño destacado y colaboración constante." },
];

const formatDate = (value) => value
    ? new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(new Date(`${value}T12:00:00`))
    : "—";
const initialsFor = (name) => name.split(" ").slice(0, 2).map((part) => part[0]).join("");

const PersonnelFile = () => {
    const { employeeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState(location.state?.search || "");
    const [categoryId, setCategoryId] = useState(categories[0].id);
    const [documents, setDocuments] = useState(initialDocuments);
    const [ratings, setRatings] = useState(initialRatings);
    const [dialog, setDialog] = useState("");
    const [form, setForm] = useState({ type: "", fileName: "", description: "", issueDate: "", uploadedAt: "", expirationDate: "", status: "Vigente", observations: "", file: null, score: "", evaluationDate: "", evaluator: "", comments: "" });
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [preview, setPreview] = useState(null);
    const [ratingEditing, setRatingEditing] = useState("");
    const documentsRef = useRef(documents);
    const nextRecordId = useRef(0);

    const employees = useMemo(() => initialEmployees.map((employee) => ({
        ...employee,
        jobTitle: employee.position || employee.jobTitle || "Puesto no disponible",
        identityNumber: employee.identityNumber || "",
        photo: mockEmployees.find((item) => item.name === employee.name)?.photo || "",
    })), []);
    const normalizedSearch = search.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
    const matches = employees.filter((employee) =>
        !normalizedSearch || `${employee.name} ${employee.code} ${employee.id} ${employee.identityNumber}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").includes(normalizedSearch),
    );
    const employee = employees.find((item) => item.id === employeeId);
    const category = categories.find((item) => item.id === categoryId) || categories[0];
    const categoryDocuments = documents.filter((item) => item.employeeId === employeeId && item.categoryId === category.id);

    useEffect(() => {
        documentsRef.current = documents;
    }, [documents]);

    useEffect(() => () => {
        documentsRef.current.forEach((item) => {
            if (item.fileUrl?.startsWith("blob:")) URL.revokeObjectURL(item.fileUrl);
        });
    }, []);

    const openForm = (mode, document = null) => {
        setForm(document
            ? { type: document.type, fileName: document.name, description: document.description || "", issueDate: document.issueDate || "", uploadedAt: document.uploadedAt || "", expirationDate: document.expirationDate || "", status: document.status || "Vigente", observations: document.observations || "", file: document.file, score: "", evaluationDate: "", evaluator: "", comments: "" }
            : { type: category.types[0], fileName: "", description: "", issueDate: "", uploadedAt: new Date().toISOString().slice(0, 10), expirationDate: "", status: "Vigente", observations: "", file: null, score: "", evaluationDate: "", evaluator: "", comments: "" });
        setError("");
        setDialog(mode);
    };

    const saveDocument = (event) => {
        event.preventDefault();
        const existingDocument = dialog === "edit" ? preview : null;
        if (!form.type || (dialog !== "edit" && !form.file) || (!form.file && !existingDocument?.name)) {
            setError("Completa el tipo de documento y selecciona un archivo.");
            return;
        }
        const extension = form.file?.name.split(".").pop()?.toLowerCase();
        if (form.file && (!allowedFileExtensions.has(extension) || form.file.size > maxFileSize)) {
            setError("El archivo debe ser PDF, Office, TXT, CSV o imagen y no superar 10 MB.");
            return;
        }
        const fileUrl = form.file instanceof File ? URL.createObjectURL(form.file) : existingDocument?.fileUrl || "";
        if (dialog !== "edit") nextRecordId.current += 1;
        const nextDocument = {
            id: dialog === "edit" ? existingDocument?.id : `file-${nextRecordId.current}`,
            employeeId,
            categoryId: category.id,
            name: form.file?.name || form.fileName || existingDocument?.name,
            type: form.type,
            description: form.description.trim(),
            issueDate: form.issueDate,
            uploadedAt: form.file ? new Date().toISOString().slice(0, 10) : form.uploadedAt,
            expirationDate: form.expirationDate,
            status: form.expirationDate && form.expirationDate < new Date().toISOString().slice(0, 10) ? "Vencido" : form.status,
            observations: form.observations.trim(),
            fileUrl,
            mimeType: form.file?.type || existingDocument?.mimeType || "",
            file: form.file || existingDocument?.file || null,
        };
        setDocuments((current) => dialog === "edit"
            ? current.map((item) => item.id === nextDocument.id ? nextDocument : item)
            : [...current, nextDocument]);
        setDialog("");
        setPreview(null);
        if (dialog === "edit" && preview?.fileUrl?.startsWith("blob:") && preview.fileUrl !== fileUrl) {
            URL.revokeObjectURL(preview.fileUrl);
        }
        setNotice(dialog === "edit" ? "Documento actualizado solo en esta sesión de demostración." : "Documento agregado únicamente a esta sesión de demostración.");
    };

    const saveRating = (event) => {
        event.preventDefault();
        if (!form.score || !form.evaluationDate || !form.evaluator.trim()) {
            setError("Completa la calificación, la fecha y el nombre de quien evalúa.");
            return;
        }
        const rating = {
            id: ratingEditing || `rating-${++nextRecordId.current}`,
            employeeId,
            score: form.score,
            evaluationDate: form.evaluationDate,
            evaluator: form.evaluator.trim(),
            comments: form.comments.trim(),
        };
        setRatings((current) => ratingEditing
            ? current.map((item) => item.id === rating.id ? rating : item)
            : [...current, rating]);
        setDialog("");
        setRatingEditing("");
        setNotice("Calificación registrada solo en esta sesión de demostración.");
    };

    const removeDocument = (document) => {
        if (!window.confirm(`¿Eliminar el documento "${document.name}" de esta sesión local?`)) return;
        if (document.fileUrl?.startsWith("blob:")) URL.revokeObjectURL(document.fileUrl);
        setDocuments((current) => current.filter((item) => item.id !== document.id));
        setNotice("Documento retirado de la demostración local.");
    };

    const closeForm = () => {
        setDialog("");
        setPreview(null);
        setRatingEditing("");
        setError("");
    };

    if (!employeeId) {
        return (
            <main className="personnel-file-page">
                <header className="personnel-file-header"><span>RECURSOS HUMANOS</span><h1>File Personal</h1><p>Busca un empleado por nombre, código de empleado o CI disponible.</p></header>
                <>
                    <label className="personnel-file-search"><i className="bi bi-search" aria-hidden="true"></i><span className="visually-hidden">Buscar empleado por nombre, código o CI</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre, código de empleado o CI..." /></label>
                    <p className="personnel-file-note">Modo de demostración frontend: puedes probar el módulo con los datos locales disponibles. Los cambios no se guardan en un servidor.</p>
                    {search && matches.length === 0 ? <section className="personnel-file-state"><i className="bi bi-person-x"></i><strong>No se encontraron empleados</strong><span>Verifica el nombre, código o CI ingresado.</span></section> : (
                        <div className="personnel-employee-grid">{matches.map((item) => (
                                <article className="personnel-employee-card" key={item.id}>
                                    <span className="personnel-employee-card__avatar">{item.photo && <img src={item.photo} alt="" onError={(event) => event.currentTarget.remove()} />}<span aria-hidden="true">{initialsFor(item.name)}</span></span>
                                    <div><h2>{item.name}</h2><p>{item.code} · {item.department} · {item.branch}</p><small>{item.jobTitle} · Estado laboral: {item.status}</small><small>CI: {item.identityNumber || "No disponible"}</small></div>
                                    <button type="button" className="btn btn-primary" onClick={() => navigate(`/file-personal/${item.id}`, { state: { search } })}>Abrir expediente</button>
                                </article>
                        ))}</div>
                    )}
                </>
            </main>
        );
    }

    if (!employee) {
        return <main className="personnel-file-page"><section className="personnel-file-state" role="alert"><i className="bi bi-exclamation-circle"></i><strong>Empleado no disponible</strong><span>El registro solicitado no está en los datos de demostración.</span><Link to="/file-personal" state={{ search }}>Volver a la búsqueda</Link></section></main>;
    }

    return (
        <main className="personnel-file-page">
            <Link className="personnel-file-back" to="/file-personal" state={{ search }}><i className="bi bi-arrow-left"></i> Volver a empleados</Link>
            <header className="personnel-file-header personnel-file-employee"><span className="personnel-employee-card__avatar">{employee.photo && <img src={employee.photo} alt="" onError={(event) => event.currentTarget.remove()} />}<span aria-hidden="true">{initialsFor(employee.name)}</span></span><div><span>EXPEDIENTE CONFIDENCIAL · DATOS DE DEMOSTRACIÓN</span><h1>{employee.name}</h1><p>{employee.code} · {employee.jobTitle} · {employee.department} · {employee.branch} · Estado laboral: {employee.status}</p><p>CI: {employee.identityNumber || "No disponible en los datos de demostración"}</p></div></header>
            <div className="personnel-file-sensitive"><i className="bi bi-shield-lock"></i> Este expediente puede contener información personal, médica, contractual y disciplinaria. El control de esta interfaz no sustituye la autorización del servidor.</div>
            {notice && <p className="personnel-file-note" role="status">{notice}</p>}
            <nav className="personnel-file-tabs" aria-label="Categorías del expediente">
                {categories.map((item) => <button key={item.id} type="button" className={category.id === item.id ? "active" : ""} aria-current={category.id === item.id ? "page" : undefined} onClick={() => setCategoryId(item.id)}>{item.label}</button>)}
            </nav>
            {category.id === "performance" ? (
                <section className="personnel-file-panel">
                    <header><div><h2>Historial de calificaciones</h2><p>Registros de demostración editables en esta sesión local.</p></div><button type="button" className="btn btn-primary" onClick={() => { setRatingEditing(""); openForm("rating"); }}><i className="bi bi-plus-lg"></i> Registrar calificación</button></header>
                    {ratings.filter((item) => item.employeeId === employeeId).length === 0 ? <div className="personnel-file-state"><i className="bi bi-clipboard2-check"></i><strong>Sin evaluaciones registradas</strong><span>No hay calificaciones de ejemplo para este empleado.</span></div> : <div className="personnel-rating-list">{ratings.filter((item) => item.employeeId === employeeId).map((item) => <article key={item.id}><strong>{item.score}/5</strong><div><h3>Evaluación · {formatDate(item.evaluationDate)}</h3><span>Evaluador: {item.evaluator}</span><p>{item.comments || "Sin comentarios"}</p></div><button type="button" onClick={() => { setRatingEditing(item.id); setForm({ ...form, score: item.score, evaluationDate: item.evaluationDate, evaluator: item.evaluator, comments: item.comments }); setError(""); setDialog("rating"); }}>Editar</button></article>)}</div>}
                </section>
            ) : (
                <section className="personnel-file-panel">
                    <header><div><h2>{category.label}</h2><p>Documentos registrados: {categoryDocuments.length}</p></div><button type="button" className="btn btn-primary" onClick={() => openForm("create")}><i className="bi bi-upload"></i> Agregar documento</button></header>
                    {categoryDocuments.length === 0 ? <div className="personnel-file-state"><i className="bi bi-folder2-open"></i><strong>Esta categoría no tiene documentos</strong><span>Los archivos de ejemplo no se cargan ni persisten en un servidor.</span></div> : <div className="personnel-document-list">{categoryDocuments.map((item) => <article key={item.id}><div><strong>{item.name}</strong><span>{item.type} · {item.description || "Sin descripción"} · Emisión: {formatDate(item.issueDate)} · Cargado: {formatDate(item.uploadedAt)} · Vence: {formatDate(item.expirationDate)} · {item.status}</span>{item.observations && <small>Observaciones: {item.observations}</small>}</div><div className="personnel-document-actions"><button type="button" onClick={() => setPreview(item)}>Ver</button>{(item.mimeType === "application/pdf" || item.mimeType.startsWith("image/")) && item.fileUrl && <button type="button" onClick={() => setPreview({ ...item, showPreview: true })}>Vista previa</button>}{item.fileUrl ? <a href={item.fileUrl} download={item.name}>Descargar</a> : <span className="personnel-file-unavailable">Archivo no disponible</span>}<button type="button" onClick={() => { setPreview(item); openForm("edit", item); }}>Editar</button><button type="button" className="is-danger" onClick={() => removeDocument(item)}>Eliminar</button></div></article>)}</div>}
                </section>
            )}
            {dialog && <div className="personnel-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}><section className="personnel-dialog" role="dialog" aria-modal="true" aria-labelledby="personnel-dialog-title"><header><h2 id="personnel-dialog-title">{dialog === "rating" ? ratingEditing ? "Editar calificación" : "Registrar calificación" : dialog === "edit" ? "Editar documento" : "Agregar documento"}</h2><button type="button" aria-label="Cerrar" onClick={closeForm}>×</button></header>{dialog === "rating" ? <form onSubmit={saveRating}><label>Calificación (1 a 5) *<input type="number" min="1" max="5" required value={form.score} onChange={(event) => setForm((current) => ({ ...current, score: event.target.value }))} /></label><label>Fecha de evaluación *<input type="date" required value={form.evaluationDate} onChange={(event) => setForm((current) => ({ ...current, evaluationDate: event.target.value }))} /></label><label>Evaluador *<input required value={form.evaluator} onChange={(event) => setForm((current) => ({ ...current, evaluator: event.target.value }))} /></label><label>Comentarios<textarea value={form.comments} onChange={(event) => setForm((current) => ({ ...current, comments: event.target.value }))} /></label>{error && <p role="alert">{error}</p>}<footer><button type="button" onClick={closeForm}>Cancelar</button><button type="submit">Guardar calificación</button></footer></form> : <form onSubmit={saveDocument}><label>Tipo de documento *<select required value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}>{category.types.map((type) => <option key={type}>{type}</option>)}</select></label><label>Nombre del documento *<input required maxLength="160" value={form.fileName} onChange={(event) => setForm((current) => ({ ...current, fileName: event.target.value }))} /></label><label>Descripción<textarea rows="2" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></label><label>Archivo {dialog === "create" ? "*" : "(opcional)"}<input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp" required={dialog === "create"} onChange={(event) => setForm((current) => ({ ...current, file: event.target.files?.[0] || null, fileName: event.target.files?.[0]?.name || current.fileName }))} /></label><label>Fecha de emisión<input type="date" value={form.issueDate} onChange={(event) => setForm((current) => ({ ...current, issueDate: event.target.value }))} /></label><label>Fecha de carga<input type="date" value={form.uploadedAt} onChange={(event) => setForm((current) => ({ ...current, uploadedAt: event.target.value }))} /></label><label>Fecha de vencimiento<input type="date" value={form.expirationDate} onChange={(event) => setForm((current) => ({ ...current, expirationDate: event.target.value }))} /></label><label>Estado<select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}><option>Vigente</option><option>Pendiente</option><option>Vencido</option><option>Archivado</option></select></label><label>Observaciones<textarea rows="2" value={form.observations} onChange={(event) => setForm((current) => ({ ...current, observations: event.target.value }))} /></label>{error && <p role="alert">{error}</p>}<footer><button type="button" onClick={closeForm}>Cancelar</button><button type="submit">Guardar documento</button></footer><small>El archivo permanece solo en esta sesión y no se envía a ningún servidor.</small></form>}</section></div>}
            {preview && !dialog && <div className="personnel-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreview(null); }}><section className="personnel-dialog personnel-preview" role="dialog" aria-modal="true" aria-labelledby="personnel-preview-title"><header><h2 id="personnel-preview-title">{preview.name}</h2><button type="button" aria-label="Cerrar detalle" onClick={() => setPreview(null)}>×</button></header><div className="personnel-preview-details"><p><strong>Tipo:</strong> {preview.type}</p><p><strong>Descripción:</strong> {preview.description || "No disponible"}</p><p><strong>Fecha de emisión:</strong> {formatDate(preview.issueDate)}</p><p><strong>Fecha de carga:</strong> {formatDate(preview.uploadedAt)}</p><p><strong>Vencimiento:</strong> {formatDate(preview.expirationDate)}</p><p><strong>Estado:</strong> {preview.status}</p><p><strong>Observaciones:</strong> {preview.observations || "Sin observaciones"}</p></div>{preview.fileUrl && preview.mimeType.startsWith("image/") ? <img src={preview.fileUrl} alt={preview.name} /> : preview.fileUrl && (preview.mimeType === "application/pdf" || preview.showPreview) ? <iframe title={`Vista previa de ${preview.name}`} src={preview.fileUrl} /> : <p className="personnel-file-unavailable">{preview.fileUrl ? "La vista previa no está disponible para este formato." : "El archivo de este registro de demostración no está disponible."}</p>}</section></div>}
        </main>
    );
};

export default PersonnelFile;
