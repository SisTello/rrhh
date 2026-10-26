import { useState } from "react";

import { demoCurrentUser, initialPendingActions, initialDirectCommunications } from "./announcementsData";
import { initialEmployees, initialRoles } from "../administrator/administratorData";

const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const displayDate = (value) => value
    ? new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`))
    : "—";

const CommunicationsWorkspace = ({ view }) => {
    const [communications, setCommunications] = useState(initialDirectCommunications);
    const [tasks, setTasks] = useState(initialPendingActions);
    const [communicationSearch, setCommunicationSearch] = useState("");
    const [communicationStatus, setCommunicationStatus] = useState("");
    const [communicationType, setCommunicationType] = useState("");
    const [taskSearch, setTaskSearch] = useState("");
    const [taskStatus, setTaskStatus] = useState("");
    const [dialog, setDialog] = useState(null);
    const [form, setForm] = useState({});
    const [toast, setToast] = useState("");
    const [error, setError] = useState("");
    const [actionFilter, setActionFilter] = useState("");

    const roles = initialRoles.filter((role) => demoCurrentUser.roleIds.includes(role.id) && role.status === "Activo");
    const permissions = new Set(roles.flatMap((role) => role.permissions));
    const allowed = (module, action) => permissions.has(`${module}:${action}`);
    const directReports = initialEmployees.filter((employee) => demoCurrentUser.directReportIds.includes(employee.id));
    const allowedEmployeeIds = new Set([demoCurrentUser.employeeId, ...directReports.map((employee) => employee.id)]);
    const visibleCommunications = communications.filter((item) =>
        (item.type !== "Notificación de Recursos Humanos" || allowed("directCommunications", "verNotificacionesRH")) &&
        (item.recipientId === demoCurrentUser.employeeId ||
        (item.type === "Mensaje interno" && item.sender === demoCurrentUser.name && allowedEmployeeIds.has(item.recipientId))),
    );
    const visibleTasks = tasks.filter((task) =>
        task.owner === "self"
            ? task.employeeId === demoCurrentUser.employeeId && allowed("pendingActions", "autoevaluar")
            : directReports.some((employee) => employee.id === task.employeeId) && allowed("pendingActions", "evaluarEquipo"),
    );
    const unreadCount = visibleCommunications.filter((item) => !item.read && item.recipientId === demoCurrentUser.employeeId).length;
    const memoCount = visibleCommunications.filter((item) => item.type === "Memorándum" && item.recipientId === demoCurrentUser.employeeId).length;
    const approvalCount = visibleTasks.filter((task) => task.owner === "manager" && task.status === "Pendiente").length;
    const evaluationCount = visibleTasks.filter((task) => task.type.includes("Evaluación") && task.status === "Pendiente").length;

    const filteredCommunications = (() => {
        const query = communicationSearch.trim().toLocaleLowerCase("es");
        return visibleCommunications.filter((item) => {
            const matchesSearch = !query || `${item.subject} ${item.reference} ${item.sender} ${item.recipient} ${item.type}`.toLocaleLowerCase("es").includes(query);
            const receivedByCurrentUser = item.recipientId === demoCurrentUser.employeeId;
            const matchesStatus = !communicationStatus || (communicationStatus === "Sin leer" ? receivedByCurrentUser && !item.read : communicationStatus === "Leído" ? receivedByCurrentUser && item.read : item.status === communicationStatus);
            const matchesType = !communicationType || item.type === communicationType;
            return matchesSearch && matchesStatus && matchesType;
        });
    })();

    const filteredTasks = (() => {
        const query = taskSearch.trim().toLocaleLowerCase("es");
        return visibleTasks.filter((task) =>
            (!query || `${task.type} ${task.employee} ${task.id}`.toLocaleLowerCase("es").includes(query)) &&
            (!taskStatus || task.status === taskStatus) &&
            (!actionFilter || task.type === actionFilter),
        );
    })();

    const notify = (message) => {
        setToast(message);
        window.setTimeout(() => setToast(""), 2600);
    };

    const changeReadStatus = (item, read, keepDialog = false) => {
        setCommunications((current) => current.map((entry) => entry.id === item.id ? { ...entry, read, ...(read && entry.status === "Recibido" ? { status: "Leído" } : {}) } : entry));
        setDialog(keepDialog
            ? { mode: "communication-detail", item: { ...item, read, ...(read && item.status === "Recibido" ? { status: "Leído" } : {}) } }
            : null);
        notify(read ? "La comunicación se marcó como leída." : "Se registró el acuse de recibo.");
    };

    const saveCommunication = (event) => {
        event.preventDefault();
        if (!form.subject?.trim() || !form.body?.trim() || !form.recipientId) {
            setError("Completa el asunto, el destinatario y el mensaje.");
            return;
        }
        const recipient = initialEmployees.find((employee) => employee.id === form.recipientId);
        const newItem = {
            id: `${form.kind === "Memorándum" ? "MEM" : "MSG"}-${String(communications.length + 20).padStart(3, "0")}`,
            type: form.kind,
            subject: form.subject.trim(),
            reference: `${form.kind === "Memorándum" ? "MEM" : "MSG"}-OPS-${Date.now().toString().slice(-5)}`,
            recipient: recipient.name,
            recipientId: recipient.id,
            sender: demoCurrentUser.name,
            date: today(),
            priority: form.priority,
            status: "Enviado",
            read: false,
            attachments: form.attachments || [],
            body: form.body.trim(),
        };
        setCommunications((current) => [newItem, ...current]);
        setDialog(null);
        notify(form.kind === "Memorándum" ? "El memorándum se envió al colaborador seleccionado." : "El mensaje interno se envió correctamente.");
    };

    const resolveTask = (task, decision, details = {}) => {
        setTasks((current) => current.map((item) => item.id === task.id ? { ...item, ...details, status: decision } : item));
        setDialog(null);
        notify(decision === "Aprobada" ? "La solicitud se aprobó." : decision === "Rechazada" ? "La solicitud se rechazó." : "La evaluación se completó y quedó registrada localmente.");
    };

    const submitEvaluation = (event) => {
        event.preventDefault();
        if (!form.rating || !form.comments?.trim()) {
            setError("Selecciona una calificación y agrega comentarios.");
            return;
        }
        resolveTask(dialog.task, "Completada", { evaluation: { rating: form.rating, comments: form.comments } });
    };

    return (
        <section className="communication-workspace">
            {view === "direct" ? (
                <>
                    <div className="announcements-metrics communication-metrics" aria-label="Resumen de comunicaciones directas">
                        <article className="announcements-metric"><span className="announcements-metric__icon blue"><i className="bi bi-envelope" aria-hidden="true"></i></span><div><span>Comunicaciones sin leer</span><strong>{unreadCount}</strong></div></article>
                        <article className="announcements-metric"><span className="announcements-metric__icon yellow"><i className="bi bi-file-earmark-text" aria-hidden="true"></i></span><div><span>Memorándums recibidos</span><strong>{memoCount}</strong></div></article>
                    </div>
                    <div className="announcements-filters communication-filters">
                        <label className="announcements-search"><i className="bi bi-search" aria-hidden="true"></i><span className="visually-hidden">Buscar comunicaciones</span><input type="search" value={communicationSearch} onChange={(event) => setCommunicationSearch(event.target.value)} placeholder="Buscar asunto, referencia o remitente..." /></label>
                        <label><span>Tipo</span><select value={communicationType} onChange={(event) => setCommunicationType(event.target.value)}><option value="">Todos</option><option>Memorándum</option><option>Notificación de Recursos Humanos</option><option>Mensaje interno</option></select></label>
                        <label><span>Estado</span><select value={communicationStatus} onChange={(event) => setCommunicationStatus(event.target.value)}><option value="">Todos</option><option>Sin leer</option><option>Leído</option><option>Aprobada</option><option>Rechazada</option><option>Enviado</option></select></label>
                        {(allowed("directCommunications", "crearMemo") || allowed("directCommunications", "enviarMensaje")) && <button type="button" className="btn btn-primary announcements-primary" onClick={() => { setForm({ kind: allowed("directCommunications", "crearMemo") ? "Memorándum" : "Mensaje interno", priority: "Normal", attachments: [] }); setError(""); setDialog({ mode: "compose" }); }}><i className="bi bi-send"></i>Redactar comunicación</button>}
                    </div>
                    {!allowed("directCommunications", "acceso") ? <div className="announcements-state"><i className="bi bi-lock"></i><strong>Acceso no asignado</strong><span>Tu rol de demostración no tiene acceso a esta sección.</span></div> : filteredCommunications.length === 0 ? <div className="announcements-state"><i className="bi bi-inbox"></i><strong>No hay comunicaciones</strong><span>No hay resultados con los filtros seleccionados.</span></div> : (
                        <div className="announcements-table-wrap"><table className="announcements-table"><thead><tr><th>Asunto y referencia</th><th>Tipo</th><th>Destinatario</th><th>Remitente</th><th>Fecha</th><th>Prioridad</th><th>Estado</th><th><span className="visually-hidden">Acciones</span></th></tr></thead><tbody>
                            {filteredCommunications.map((item) => <tr key={item.id} className={!item.read && item.recipientId === demoCurrentUser.employeeId ? "communication-unread" : ""}>
                                <td className="announcement-title-cell"><button type="button" onClick={() => { if (!item.read && item.recipientId === demoCurrentUser.employeeId && allowed("directCommunications", "leer")) changeReadStatus(item, true, true); else setDialog({ mode: "communication-detail", item }); }}>{item.subject}</button><small>{item.reference}{item.attachments.length > 0 && ` · ${item.attachments.length} archivo(s)`}</small></td><td>{item.type}</td><td>{item.recipient}</td><td>{item.sender}</td><td>{displayDate(item.date)}</td><td><span className={`communication-priority ${item.priority.toLocaleLowerCase("es")}`}>{item.priority}</span></td><td><span className={`announcement-status ${item.read || item.recipientId !== demoCurrentUser.employeeId ? "published" : "scheduled"}`}>{item.recipientId !== demoCurrentUser.employeeId ? "Enviado" : item.read ? item.status === "Recibido" ? "Leído" : item.status : "Sin leer"}</span></td>
                                <td><div className="announcement-actions"><button type="button" aria-label={`Ver ${item.subject}`} title="Ver detalle" onClick={() => setDialog({ mode: "communication-detail", item })}><i className="bi bi-eye"></i></button>{!item.read && item.recipientId === demoCurrentUser.employeeId && allowed("directCommunications", "leer") && <button type="button" aria-label={`Marcar como leído: ${item.subject}`} title="Marcar como leído" onClick={() => changeReadStatus(item, true)}><i className="bi bi-envelope-open"></i></button>}{!item.read && item.recipientId === demoCurrentUser.employeeId && allowed("directCommunications", "acuse") && <button type="button" aria-label={`Acusar recibo: ${item.subject}`} title="Acusar recibo" onClick={() => changeReadStatus(item, true)}><i className="bi bi-check2-circle"></i></button>}</div></td>
                            </tr>)}
                        </tbody></table></div>
                    )}
                    <p className="announcements-demo-note"><i className="bi bi-person-badge"></i> Sesión de demostración: {demoCurrentUser.name} · rol Supervisor · destinatarios limitados a su cuenta y equipo asignado.</p>
                </>
            ) : (
                <>
                    <div className="announcements-metrics communication-metrics">
                        <article className="announcements-metric"><span className="announcements-metric__icon red"><i className="bi bi-clipboard-check"></i></span><div><span>Aprobaciones pendientes</span><strong>{approvalCount}</strong></div></article>
                        <article className="announcements-metric"><span className="announcements-metric__icon yellow"><i className="bi bi-graph-up"></i></span><div><span>Evaluaciones pendientes</span><strong>{evaluationCount}</strong></div></article>
                    </div>
                    <div className="announcements-filters communication-filters">
                        <label className="announcements-search"><i className="bi bi-search" aria-hidden="true"></i><span className="visually-hidden">Buscar acciones pendientes</span><input type="search" value={taskSearch} onChange={(event) => setTaskSearch(event.target.value)} placeholder="Buscar por tipo o colaborador..." /></label>
                        <label><span>Tipo de acción</span><select value={actionFilter} onChange={(event) => setActionFilter(event.target.value)}><option value="">Todos</option>{[...new Set(visibleTasks.map((task) => task.type))].map((taskType) => <option key={taskType}>{taskType}</option>)}</select></label>
                        <label><span>Estado</span><select value={taskStatus} onChange={(event) => setTaskStatus(event.target.value)}><option value="">Todos</option><option>Pendiente</option><option>Aprobada</option><option>Rechazada</option><option>Completada</option></select></label>
                    </div>
                    {!allowed("pendingActions", "acceso") ? <div className="announcements-state"><i className="bi bi-lock"></i><strong>Acceso no asignado</strong><span>Tu rol de demostración no tiene acceso a esta sección.</span></div> : filteredTasks.length === 0 ? <div className="announcements-state"><i className="bi bi-inbox"></i><strong>No hay acciones pendientes</strong><span>No hay resultados con los filtros seleccionados.</span></div> : (
                        <div className="announcements-table-wrap"><table className="announcements-table pending-actions-table"><thead><tr><th>Tipo de tarea</th><th>Colaborador</th><th>Fecha límite</th><th>Prioridad</th><th>Estado</th><th><span className="visually-hidden">Acciones</span></th></tr></thead><tbody>
                            {filteredTasks.map((task) => <tr key={task.id}><td className="announcement-title-cell"><button type="button" onClick={() => setDialog({ mode: "task-detail", task })}>{task.type}</button><small>{task.id}</small></td><td>{task.employee}{task.employeeId === demoCurrentUser.employeeId && <small> · Autoevaluación</small>}</td><td>{displayDate(task.deadline)}</td><td><span className={`communication-priority ${task.priority.toLocaleLowerCase("es")}`}>{task.priority}</span></td><td><span className={`announcement-status ${task.status === "Pendiente" ? "scheduled" : task.status === "Aprobada" || task.status === "Completada" ? "published" : "archived"}`}>{task.status}</span></td><td><div className="announcement-actions"><button type="button" aria-label={`Ver detalle: ${task.type}, ${task.employee}`} title="Ver detalle" onClick={() => setDialog({ mode: "task-detail", task })}><i className="bi bi-eye"></i></button>{task.status === "Pendiente" && task.owner === "manager" && allowed("pendingActions", "aprobar") && <button type="button" aria-label={`Resolver solicitud de ${task.employee}`} title="Revisar solicitud" onClick={() => setDialog({ mode: "review", task })}><i className="bi bi-clipboard-check"></i></button>}{task.status === "Pendiente" && task.type === "Autoevaluación" && allowed("pendingActions", "autoevaluar") && <button type="button" aria-label="Completar autoevaluación" title="Completar autoevaluación" onClick={() => { setForm({ rating: "", comments: "" }); setError(""); setDialog({ mode: "evaluation", task }); }}><i className="bi bi-pencil-square"></i></button>}{task.status === "Pendiente" && task.owner === "manager" && allowed("pendingActions", "evaluarEquipo") && <button type="button" aria-label={`Evaluar a ${task.employee}`} title="Evaluar colaborador" onClick={() => { setForm({ rating: "", comments: "" }); setError(""); setDialog({ mode: "evaluation", task }); }}><i className="bi bi-graph-up"></i></button>}</div></td></tr>)}
                        </tbody></table></div>
                    )}
                    <p className="announcements-demo-note"><i className="bi bi-person-badge"></i> Las solicitudes y evaluaciones del equipo se limitan a colaboradores asignados a {demoCurrentUser.name} en esta demostración.</p>
                </>
            )}
            {toast && <div className="announcements-toast" role="status"><i className="bi bi-check-circle-fill"></i>{toast}</div>}
            {dialog && <div className="announcement-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}><section className="announcement-dialog" role="dialog" aria-modal="true" aria-labelledby="communication-dialog-title">
                <header><h2 id="communication-dialog-title">{dialog.mode === "compose" ? "Redactar comunicación" : dialog.mode === "communication-detail" ? dialog.item.subject : dialog.mode === "task-detail" ? "Detalle de acción pendiente" : dialog.mode === "evaluation" ? dialog.task.type : "Revisar solicitud"}</h2><button type="button" aria-label="Cerrar" onClick={() => setDialog(null)}><i className="bi bi-x-lg"></i></button></header>
                {dialog.mode === "compose" ? <form className="announcement-form" onSubmit={saveCommunication}>
                    <label><span>Tipo de comunicación *</span><select value={form.kind} onChange={(event) => setForm((current) => ({ ...current, kind: event.target.value }))}>{allowed("directCommunications", "crearMemo") && <option>Memorándum</option>}{allowed("directCommunications", "enviarMensaje") && <option>Mensaje interno</option>}</select></label>
                    <div className="announcement-form-row"><label><span>Destinatario *</span><select required value={form.recipientId || ""} onChange={(event) => setForm((current) => ({ ...current, recipientId: event.target.value }))}><option value="">Selecciona un colaborador</option>{directReports.map((employee) => <option key={employee.id} value={employee.id}>{employee.name} · {employee.department}</option>)}</select><small>Solo se muestran colaboradores del equipo asignado.</small></label><label><span>Prioridad</span><select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}><option>Normal</option><option>Alta</option><option>Urgente</option></select></label></div>
                    <label><span>Asunto *</span><input required maxLength="120" value={form.subject || ""} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} /></label>
                    {form.kind === "Memorándum" && <label><span>Número de referencia</span><input readOnly value="Se asignará al enviar" /></label>}
                    <label><span>Mensaje *</span><textarea rows="5" required value={form.body || ""} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} /></label>
                    <label><span>Adjuntos</span><input type="file" multiple onChange={(event) => { const names = [...event.target.files].map((file) => file.name); setForm((current) => ({ ...current, attachments: [...new Set([...(current.attachments || []), ...names]) ] })); event.target.value = ""; }} /><small>Los nombres se guardan localmente; no se cargan archivos.</small></label>
                    {(form.attachments || []).map((file) => <span className="announcement-attachment-chip" key={file}><i className="bi bi-paperclip"></i>{file}<button type="button" aria-label={`Quitar ${file}`} onClick={() => setForm((current) => ({ ...current, attachments: current.attachments.filter((item) => item !== file) }))}><i className="bi bi-x"></i></button></span>)}
                    {error && <p className="announcement-error" role="alert">{error}</p>}
                    <footer><button type="button" className="btn btn-outline-secondary" onClick={() => setDialog(null)}>Cancelar</button><button type="submit" className="btn btn-primary announcements-primary">Enviar</button></footer>
                </form> : dialog.mode === "communication-detail" ? <article className="announcement-detail">
                    <div className="announcement-detail__meta"><span className="announcement-category">{dialog.item.type}</span><span className={`communication-priority ${dialog.item.priority.toLocaleLowerCase("es")}`}>{dialog.item.priority}</span><span className={`announcement-status ${dialog.item.read || dialog.item.recipientId !== demoCurrentUser.employeeId ? "published" : "scheduled"}`}>{dialog.item.recipientId !== demoCurrentUser.employeeId ? "Enviado" : dialog.item.read ? dialog.item.status : "Sin leer"}</span></div>
                    <div className="announcement-detail__byline"><span>Referencia: {dialog.item.reference}</span><span>Para: {dialog.item.recipient}</span><span>De: {dialog.item.sender}</span><span>{displayDate(dialog.item.date)}</span></div>
                    <div className="announcement-detail__content">{dialog.item.body}</div>
                    {dialog.item.attachments.length > 0 && <div className="announcement-detail-files"><strong>Archivos adjuntos</strong>{dialog.item.attachments.map((file) => <span key={file}><i className="bi bi-paperclip"></i>{file}</span>)}</div>}
                    <footer>{!dialog.item.read && dialog.item.recipientId === demoCurrentUser.employeeId && allowed("directCommunications", "acuse") && <button type="button" className="btn btn-primary announcements-primary" onClick={() => changeReadStatus(dialog.item, true)}>Acusar recibo</button>}<button type="button" className="btn btn-outline-secondary" onClick={() => setDialog(null)}>Cerrar</button></footer>
                </article> : dialog.mode === "task-detail" ? <article className="announcement-detail"><div className="announcement-detail__meta"><span className="announcement-category">{dialog.task.type}</span><span className={`announcement-status ${dialog.task.status === "Pendiente" ? "scheduled" : "published"}`}>{dialog.task.status}</span></div><h3>{dialog.task.employee}</h3><div className="announcement-detail__byline"><span>Identificador: {dialog.task.id}</span><span>Fecha límite: {displayDate(dialog.task.deadline)}</span><span>Prioridad: {dialog.task.priority}</span></div><div className="announcement-detail__content">{dialog.task.details}</div><footer><button type="button" className="btn btn-outline-secondary" onClick={() => setDialog(null)}>Cerrar</button></footer></article> : dialog.mode === "review" ? <div className="announcement-confirm"><i className="bi bi-clipboard-check"></i><p><strong>{dialog.task.type}</strong><br />Colaborador: {dialog.task.employee}<br />Fecha límite: {displayDate(dialog.task.deadline)}<br />{dialog.task.details}</p><footer><button type="button" className="btn btn-outline-secondary" onClick={() => setDialog(null)}>Cancelar</button><button type="button" className="btn btn-danger" disabled={!allowed("pendingActions", "rechazar")} onClick={() => resolveTask(dialog.task, "Rechazada")}>Rechazar</button><button type="button" className="btn btn-primary announcements-primary" onClick={() => resolveTask(dialog.task, "Aprobada")}>Aprobar</button></footer></div> : <form className="announcement-confirm" onSubmit={submitEvaluation}><p>Completa la evaluación de <strong>{dialog.task.employee}</strong> antes del {displayDate(dialog.task.deadline)}.</p><label><span>Calificación *</span><select required value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}><option value="">Selecciona una calificación</option><option>Supera las expectativas</option><option>Cumple las expectativas</option><option>Requiere acompañamiento</option></select></label><label><span>Comentarios *</span><textarea required rows="4" value={form.comments} onChange={(event) => setForm((current) => ({ ...current, comments: event.target.value }))} /></label>{error && <p className="announcement-error" role="alert">{error}</p>}<footer><button type="button" className="btn btn-outline-secondary" onClick={() => setDialog(null)}>Cancelar</button><button type="submit" className="btn btn-primary announcements-primary">Completar evaluación</button></footer></form>}
            </section></div>}
        </section>
    );
};

export default CommunicationsWorkspace;
