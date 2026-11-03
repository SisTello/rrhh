import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    emailAreas,
    emailBranches,
    emailContacts,
    emailCurrentUser,
    emailDepartments,
    initialEmailMessages,
} from "./emailData";
import { getUserPermissions, useRolePermissions } from "../../utils/rolePermissions";
import "./email.scss";

const storageKey = "tello-correo-corporativo";
const createMessageId = () => `email-${Date.now()}`;
const folderNames = {
    recibidos: "Recibidos",
    enviados: "Enviados",
    borradores: "Borradores",
    importantes: "Importantes",
    papelera: "Papelera",
};

const emptyForm = () => ({
    toIds: [],
    ccIds: [],
    subject: "",
    body: "",
    priority: "normal",
    attachments: [],
});

const readMessages = () => {
    try {
        const storedMessages = window.localStorage.getItem(storageKey);
        if (!storedMessages) return initialEmailMessages;

        const parsedMessages = JSON.parse(storedMessages);
        if (!Array.isArray(parsedMessages)) {
            throw new Error("El contenido guardado no es una lista de mensajes.");
        }
        return parsedMessages;
    } catch (error) {
        console.error("No se pudieron cargar los mensajes de demostración.", error);
        return initialEmailMessages;
    }
};

const getContact = (id) => emailContacts.find((contact) => contact.id === id);
const contactName = (id) => getContact(id)?.name || "Usuario interno";

const formatDate = (value) => {
    if (!value) return "Borrador";
    return new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
};

const formatSize = (size = 0) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const uniqueIds = (ids) => [...new Set(ids)];
const isMessageRecipient = (message, userId) =>
    message.toIds.includes(userId) || message.ccIds.includes(userId);
const isMessageDeleted = (message, userId) => message.deletedBy.includes(userId);
const isMessageUnread = (message, userId) => {
    if (message.senderId === userId) {
        return [...message.toIds, ...message.ccIds].some((id) => !message.readBy?.[id]);
    }
    return isMessageRecipient(message, userId) && !message.readBy?.[userId];
};

const Email = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const folder = location.pathname.split("/")[2] || "recibidos";
    const currentUserId = emailCurrentUser.id;
    const roles = useRolePermissions();
    const permissions = getUserPermissions(roles, emailCurrentUser.email);
    const hasPermission = (permission) => permissions.has(permission);
    const canCompose = hasPermission("email.send") || hasPermission("email.drafts.manage");
    const [messages, setMessages] = useState(readMessages);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [search, setSearch] = useState("");
    const [readFilter, setReadFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [form, setForm] = useState(emptyForm);
    const [editingDraftId, setEditingDraftId] = useState(null);
    const [replyingToId, setReplyingToId] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const canManageRecipients = canCompose || (Boolean(replyingToId) && hasPermission("email.reply"));

    useEffect(() => {
        if (!feedback) return undefined;
        const timeout = window.setTimeout(() => setFeedback(null), 4200);
        return () => window.clearTimeout(timeout);
    }, [feedback]);

    const updateMessages = (update) => {
        const nextMessages = update(messages);
        setMessages(nextMessages);
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(nextMessages));
        } catch (error) {
            console.error("No se pudieron guardar los mensajes de demostración.", error);
            setFeedback({
                type: "error",
                text: "Los cambios se aplicaron en esta sesión, pero no se pudieron guardar en este navegador.",
            });
        }
    };

    const folderMessages = useMemo(() => messages.filter((message) => {
        if (folder === "papelera") return isMessageDeleted(message, currentUserId);
        if (isMessageDeleted(message, currentUserId)) return false;
        if (folder === "borradores") {
            return message.status === "draft" && message.senderId === currentUserId;
        }
        if (message.status !== "sent") return false;
        if (folder === "enviados") return message.senderId === currentUserId;
        if (folder === "importantes") {
            return message.importantBy.includes(currentUserId) &&
                (message.senderId === currentUserId || isMessageRecipient(message, currentUserId));
        }
        return message.senderId !== currentUserId && isMessageRecipient(message, currentUserId);
    }), [messages, folder, currentUserId]);

    const filteredMessages = useMemo(() => {
        const query = search.trim().toLocaleLowerCase("es");
        return folderMessages.filter((message) => {
            const sender = contactName(message.senderId);
            const recipients = [...message.toIds, ...message.ccIds].map(contactName).join(" ");
            const matchesSearch = !query ||
                `${sender} ${message.subject} ${message.body} ${recipients}`
                    .toLocaleLowerCase("es")
                    .includes(query);
            const unread = isMessageUnread(message, currentUserId);
            const matchesRead = !readFilter ||
                (readFilter === "unread" ? unread : !unread);
            const matchesPriority = !priorityFilter || message.priority === priorityFilter;
            return matchesSearch && matchesRead && matchesPriority;
        });
    }, [folderMessages, search, readFilter, priorityFilter, currentUserId]);

    const selectedMessage = folderMessages.find((message) => message.id === selectedMessageId);
    const unreadCount = messages.filter((message) =>
        message.status === "sent" &&
        message.senderId !== currentUserId &&
        isMessageRecipient(message, currentUserId) &&
        !isMessageDeleted(message, currentUserId) &&
        isMessageUnread(message, currentUserId),
    ).length;

    const setFolder = (nextFolder) => navigate(`/correo-corporativo/${nextFolder}`);

    const openCompose = (draft = null, allowReply = false) => {
        if (!canCompose && !allowReply) return;
        setSelectedMessageId(null);
        setReplyingToId(null);
        setEditingDraftId(draft?.id || null);
        setForm(draft ? {
            toIds: [...draft.toIds],
            ccIds: [...draft.ccIds],
            subject: draft.subject,
            body: draft.body,
            priority: draft.priority,
            attachments: [...draft.attachments],
        } : emptyForm());
        setFeedback(null);
        navigate("/correo-corporativo/redactar");
    };

    const openMessage = (message) => {
        if (message.status === "draft" && folder !== "papelera") {
            openCompose(message);
            return;
        }
        setSelectedMessageId(message.id);
        if (isMessageRecipient(message, currentUserId) && !message.readBy?.[currentUserId]) {
            updateMessages((current) => current.map((item) =>
                item.id === message.id
                    ? { ...item, readBy: { ...item.readBy, [currentUserId]: true } }
                    : item,
            ));
        }
    };

    const toggleImportant = (message) => {
        if (!hasPermission("email.important.manage")) return;
        const important = message.importantBy.includes(currentUserId);
        updateMessages((current) => current.map((item) => item.id === message.id
            ? {
                ...item,
                importantBy: important
                    ? item.importantBy.filter((id) => id !== currentUserId)
                    : [...item.importantBy, currentUserId],
            }
            : item,
        ));
        setFeedback({
            type: "success",
            text: important ? "El mensaje se quitó de Importantes." : "El mensaje se marcó como importante.",
        });
    };

    const moveToTrash = (message) => {
        if (!hasPermission("email.messages.delete")) return;
        if (!window.confirm(`¿Mover "${message.subject || "este borrador"}" a Papelera?`)) return;
        updateMessages((current) => current.map((item) => item.id === message.id
            ? { ...item, deletedBy: uniqueIds([...item.deletedBy, currentUserId]) }
            : item,
        ));
        setSelectedMessageId(null);
        setFeedback({ type: "success", text: "El mensaje se movió a Papelera." });
    };

    const restoreMessage = (message) => {
        if (!hasPermission("email.messages.delete")) return;
        updateMessages((current) => current.map((item) => item.id === message.id
            ? { ...item, deletedBy: item.deletedBy.filter((id) => id !== currentUserId) }
            : item,
        ));
        setSelectedMessageId(null);
        setFeedback({ type: "success", text: "El mensaje se restauró." });
    };

    const permanentlyDelete = (message) => {
        if (!hasPermission("email.messages.delete")) return;
        if (!window.confirm("¿Eliminar este mensaje permanentemente? Esta acción no se puede deshacer.")) return;
        updateMessages((current) => current.filter((item) => item.id !== message.id));
        setSelectedMessageId(null);
        setFeedback({ type: "success", text: "El mensaje se eliminó permanentemente." });
    };

    const addRecipients = (target, option) => {
        if (!option) return;
        const [type, ...valueParts] = option.split(":");
        const value = valueParts.join(":");
        let recipientIds = [];

        if (type === "person") {
            recipientIds = [value];
        } else if (type === "department") {
            recipientIds = emailContacts
                .filter((contact) => contact.department === value)
                .map((contact) => contact.id);
        } else if (type === "area") {
            const area = emailAreas.find((item) => item.name === value);
            recipientIds = emailContacts
                .filter((contact) => area?.departments.includes(contact.department))
                .map((contact) => contact.id);
        } else if (type === "branch") {
            recipientIds = emailContacts
                .filter((contact) => contact.branch === value)
                .map((contact) => contact.id);
        }

        recipientIds = recipientIds.filter((id) => id !== currentUserId);
        if (!recipientIds.length) {
            setFeedback({ type: "error", text: "No hay destinatarios disponibles en esa selección." });
            return;
        }

        setForm((current) => {
            const existing = target === "to" ? current.toIds : current.ccIds;
            const other = target === "to" ? current.ccIds : current.toIds;
            const updated = uniqueIds([...existing, ...recipientIds])
                .filter((id) => !other.includes(id));
            return target === "to"
                ? { ...current, toIds: updated }
                : { ...current, ccIds: updated };
        });
    };

    const removeRecipient = (target, id) => {
        setForm((current) => target === "to"
            ? { ...current, toIds: current.toIds.filter((recipientId) => recipientId !== id) }
            : { ...current, ccIds: current.ccIds.filter((recipientId) => recipientId !== id) },
        );
    };

    const readAttachment = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
            id: `attachment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
            dataUrl: reader.result,
        });
        reader.onerror = () => reject(new Error(`No se pudo leer el archivo ${file.name}.`));
        reader.readAsDataURL(file);
    });

    const addAttachments = async (event) => {
        const files = Array.from(event.target.files || []);
        event.target.value = "";
        if (!files.length) return;

        try {
            const attachments = await Promise.all(files.map(readAttachment));
            setForm((current) => ({
                ...current,
                attachments: [...current.attachments, ...attachments],
            }));
            setFeedback({ type: "success", text: "Los archivos se adjuntaron al mensaje." });
        } catch (error) {
            console.error("No se pudieron adjuntar los archivos.", error);
            setFeedback({ type: "error", text: error.message });
        }
    };

    const removeAttachment = (id) => {
        setForm((current) => ({
            ...current,
            attachments: current.attachments.filter((attachment) => attachment.id !== id),
        }));
    };

    const persistMessage = (status) => {
        if (status === "sent" && !(
            hasPermission("email.send") ||
            (replyingToId && hasPermission("email.reply"))
        )) {
            setFeedback({ type: "error", text: "No tienes permiso para enviar este mensaje." });
            return;
        }
        if (status === "draft" && !hasPermission("email.drafts.manage")) {
            setFeedback({ type: "error", text: "No tienes permiso para gestionar borradores." });
            return;
        }
        if (status === "sent" && !form.toIds.length) {
            setFeedback({ type: "error", text: "Selecciona al menos un destinatario en Para." });
            return;
        }
        if (status === "sent" && (!form.subject.trim() || !form.body.trim())) {
            setFeedback({ type: "error", text: "Completa el asunto y la descripción antes de enviar." });
            return;
        }
        if (status === "draft" && !form.subject.trim() && !form.body.trim() && !form.toIds.length && !form.attachments.length) {
            setFeedback({ type: "error", text: "Agrega contenido antes de guardar el borrador." });
            return;
        }
        if (status === "sent" && !window.confirm("¿Enviar este mensaje a los destinatarios seleccionados?")) return;

        const timestamp = new Date().toISOString();
        const previous = messages.find((message) => message.id === editingDraftId);
        const message = {
            id: editingDraftId || createMessageId(),
            status,
            senderId: currentUserId,
            toIds: uniqueIds(form.toIds),
            ccIds: uniqueIds(form.ccIds),
            subject: form.subject.trim(),
            body: form.body.trim(),
            sentAt: status === "sent" ? timestamp : null,
            priority: form.priority,
            attachments: form.attachments,
            readBy: status === "sent" ? Object.fromEntries(
                uniqueIds([...form.toIds, ...form.ccIds]).map((id) => [id, false]),
            ) : {},
            importantBy: previous?.importantBy || [],
            deletedBy: previous?.deletedBy || [],
        };
        updateMessages((current) => {
            const existingIndex = current.findIndex((item) => item.id === message.id);
            if (existingIndex < 0) return [message, ...current];
            return current.map((item) => item.id === message.id ? message : item);
        });
        setSelectedMessageId(null);
        setEditingDraftId(null);
        setReplyingToId(null);
        setForm(emptyForm());
        setFolder(status === "sent" ? "enviados" : "borradores");
        setFeedback({
            type: "success",
            text: status === "sent" ? "El mensaje se envió correctamente." : "El borrador se guardó correctamente.",
        });
    };

    const replyToMessage = (message) => {
        if (!hasPermission("email.reply")) return;
        openCompose({
            id: null,
            toIds: [message.senderId],
            ccIds: [],
            subject: message.subject.startsWith("Re:") ? message.subject : `Re: ${message.subject}`,
            body: "",
            priority: "normal",
            attachments: [],
        }, true);
        setReplyingToId(message.id);
    };

    const renderRecipientPicker = (target, ids, label) => (
        <div className="email-form-field">
            <label htmlFor={`email-${target}`}>{label}</label>
            <select
                id={`email-${target}`}
                value=""
                onChange={(event) => addRecipients(target, event.target.value)}
            >
                <option value="">Selecciona personas o grupos...</option>
                <optgroup label="Personas">
                    {emailContacts
                        .filter((contact) => contact.id !== currentUserId)
                        .map((contact) => (
                            <option key={contact.id} value={`person:${contact.id}`}>
                                {contact.name} · {contact.email}
                            </option>
                        ))}
                </optgroup>
                <optgroup label="Departamentos">
                    {emailDepartments.map((department) => (
                        <option key={department} value={`department:${department}`}>
                            Departamento: {department}
                        </option>
                    ))}
                </optgroup>
                <optgroup label="Áreas">
                    {emailAreas.map((area) => (
                        <option key={area.name} value={`area:${area.name}`}>
                            Área: {area.name}
                        </option>
                    ))}
                </optgroup>
                <optgroup label="Sucursales">
                    {emailBranches.map((branch) => (
                        <option key={branch} value={`branch:${branch}`}>
                            Sucursal: {branch}
                        </option>
                    ))}
                </optgroup>
            </select>
            <div className="email-recipient-chips" aria-live="polite">
                {ids.map((id) => {
                    const contact = getContact(id);
                    return (
                        <span className="email-recipient-chip" key={id}>
                            <span>{contact?.name || "Usuario interno"} · {contact?.email}</span>
                            {canManageRecipients && <button
                                type="button"
                                onClick={() => removeRecipient(target, id)}
                                aria-label={`Quitar a ${contact?.name || "este destinatario"}`}
                            >
                                <i className="bi bi-x" aria-hidden="true"></i>
                            </button>}
                        </span>
                    );
                })}
                {!ids.length && <span className="email-recipient-empty">Aún no hay destinatarios.</span>}
            </div>
        </div>
    );

    const renderAttachments = (attachments, editable = false) => (
        <div className="email-attachments">
            {attachments.map((attachment) => (
                <div className="email-attachment" key={attachment.id}>
                    <i className="bi bi-paperclip" aria-hidden="true"></i>
                    <span className="email-attachment__info">
                        <strong>{attachment.name}</strong>
                        <small>{formatSize(attachment.size)}</small>
                    </span>
                    {attachment.dataUrl && hasPermission("email.attachments.download") ? (
                        <a
                            href={attachment.dataUrl}
                            download={attachment.name}
                            aria-label={`Descargar ${attachment.name}`}
                        >
                            <i className="bi bi-download" aria-hidden="true"></i>
                        </a>
                    ) : (
                        <button
                            type="button"
                            disabled
                            title={hasPermission("email.attachments.download")
                                ? "Archivo no disponible en esta demostración"
                                : "No tienes permiso para descargar adjuntos"}
                            aria-label={hasPermission("email.attachments.download")
                                ? `${attachment.name} no disponible`
                                : `Sin permiso para descargar ${attachment.name}`}
                        >
                            <i className="bi bi-download" aria-hidden="true"></i>
                        </button>
                    )}
                    {editable && (
                        <button
                            type="button"
                            onClick={() => removeAttachment(attachment.id)}
                            aria-label={`Quitar ${attachment.name}`}
                        >
                            <i className="bi bi-x-lg" aria-hidden="true"></i>
                        </button>
                    )}
                </div>
            ))}
        </div>
    );

    const renderComposer = () => (
        <section className="email-panel email-compose">
            <div className="email-panel__heading">
                <div>
                    <span className="email-eyebrow">MENSAJE INTERNO</span>
                    <h2>{editingDraftId ? "Editar borrador" : "Redactar mensaje"}</h2>
                    <p>Comunícate con personas de la organización TELLO.</p>
                </div>
                <button className="email-button email-button--secondary" type="button" onClick={() => setFolder("recibidos")}>
                    <i className="bi bi-arrow-left" aria-hidden="true"></i>
                    Volver a Recibidos
                </button>
            </div>

            <form
                className="email-compose-form"
                onSubmit={(event) => {
                    event.preventDefault();
                    persistMessage("sent");
                }}
            >
                <div className="email-form-field">
                    <label htmlFor="email-from">De</label>
                    <input
                        id="email-from"
                        type="text"
                        value={`${emailCurrentUser.name} · ${emailCurrentUser.email}`}
                        readOnly
                    />
                </div>
                {renderRecipientPicker("to", form.toIds, "Para")}
                {renderRecipientPicker("cc", form.ccIds, "CC")}
                <div className="email-form-field">
                    <label htmlFor="email-subject">Asunto</label>
                    <input
                        id="email-subject"
                        type="text"
                        maxLength={180}
                        value={form.subject}
                        onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                        placeholder="Escribe el asunto"
                    />
                </div>
                <div className="email-form-field">
                    <label htmlFor="email-body">Descripción</label>
                    <textarea
                        id="email-body"
                        rows="9"
                        value={form.body}
                        onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
                        placeholder="Escribe tu mensaje..."
                    ></textarea>
                </div>
                <div className="email-compose-options">
                    <div className="email-form-field">
                        <label htmlFor="email-priority">Prioridad</label>
                        <select
                            id="email-priority"
                            value={form.priority}
                            onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
                        >
                            <option value="normal">Normal</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>
                    <label className="email-file-picker">
                        <input type="file" multiple onChange={addAttachments} />
                        <span className="email-button email-button--secondary">
                            <i className="bi bi-paperclip" aria-hidden="true"></i>
                            Adjuntar archivos
                        </span>
                    </label>
                </div>
                {form.attachments.length > 0 && renderAttachments(form.attachments, true)}
                <div className="email-compose-actions">
                    {(hasPermission("email.send") || (replyingToId && hasPermission("email.reply"))) && <button className="email-button email-button--primary" type="submit">
                        <i className="bi bi-send" aria-hidden="true"></i>
                        {replyingToId ? "Enviar respuesta" : "Enviar"}
                    </button>}
                    {hasPermission("email.drafts.manage") && <button
                        className="email-button email-button--secondary"
                        type="button"
                        onClick={() => persistMessage("draft")}
                    >
                        <i className="bi bi-save" aria-hidden="true"></i>
                        Guardar borrador
                    </button>}
                </div>
            </form>
        </section>
    );

    const renderMessageDetail = (message) => {
        const isSender = message.senderId === currentUserId;
        const recipientIds = uniqueIds([...message.toIds, ...message.ccIds]);
        const important = message.importantBy.includes(currentUserId);
        return (
            <article className="email-panel email-detail">
                <div className="email-detail-toolbar">
                    <button
                        type="button"
                        className="email-icon-button"
                        onClick={() => setSelectedMessageId(null)}
                        aria-label="Volver a la lista de mensajes"
                    >
                        <i className="bi bi-arrow-left" aria-hidden="true"></i>
                    </button>
                    <div>
                        {hasPermission("email.important.manage") && <button
                            type="button"
                            className={`email-icon-button ${important ? "is-important" : ""}`}
                            onClick={() => toggleImportant(message)}
                            aria-label={important ? "Quitar de Importantes" : "Marcar como importante"}
                        >
                            <i className={`bi ${important ? "bi-star-fill" : "bi-star"}`} aria-hidden="true"></i>
                        </button>}
                        {folder === "papelera" ? (
                            hasPermission("email.messages.delete") ? <>
                                <button type="button" className="email-icon-button" onClick={() => restoreMessage(message)} aria-label="Restaurar mensaje">
                                    <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
                                </button>
                                <button type="button" className="email-icon-button is-danger" onClick={() => permanentlyDelete(message)} aria-label="Eliminar permanentemente">
                                    <i className="bi bi-trash3" aria-hidden="true"></i>
                                </button>
                            </> : null
                        ) : hasPermission("email.messages.delete") ? (
                            <button type="button" className="email-icon-button is-danger" onClick={() => moveToTrash(message)} aria-label="Mover a Papelera">
                                <i className="bi bi-trash3" aria-hidden="true"></i>
                            </button>
                        ) : null}
                    </div>
                </div>
                <div className="email-detail-content">
                    <div className="email-detail-subject">
                        <h2>{message.subject || "Sin asunto"}</h2>
                        {message.priority === "high" && <span className="email-priority email-priority--high">Prioridad alta</span>}
                    </div>
                    <div className="email-detail-meta">
                        <div className="email-sender-avatar">{contactName(message.senderId).charAt(0)}</div>
                        <div className="email-detail-addresses">
                            <strong>{contactName(message.senderId)}</strong>
                            <span>De: {getContact(message.senderId)?.email || "Usuario interno"}</span>
                            <span>Para: {message.toIds.map(contactName).join(", ") || "Sin destinatarios"}</span>
                            {message.ccIds.length > 0 && <span>CC: {message.ccIds.map(contactName).join(", ")}</span>}
                        </div>
                        <time>{formatDate(message.sentAt)}</time>
                    </div>
                    <div className="email-detail-body">{message.body || "Este mensaje no tiene descripción."}</div>
                    {message.attachments.length > 0 && (
                        <section className="email-detail-attachments" aria-label="Archivos adjuntos">
                            <h3>Archivos adjuntos ({message.attachments.length})</h3>
                            {renderAttachments(message.attachments)}
                        </section>
                    )}
                    <div className="email-detail-actions">
                            {!isSender && message.status === "sent" && folder !== "papelera" && hasPermission("email.reply") && (
                            <button className="email-button email-button--primary" type="button" onClick={() => replyToMessage(message)}>
                                <i className="bi bi-reply" aria-hidden="true"></i>
                                Responder
                            </button>
                        )}
                        {isSender && recipientIds.length > 0 && hasPermission("email.sent.view") && (
                            <span className="email-read-status">
                                Leído por {recipientIds.filter((id) => message.readBy?.[id]).length} de {recipientIds.length} destinatarios
                            </span>
                        )}
                    </div>
                </div>
            </article>
        );
    };

    const folderTitle = folderNames[folder] || "Recibidos";
    const isCompose = folder === "redactar";
    const folderPermission = {
        recibidos: hasPermission("email.inbox.view"),
        enviados: hasPermission("email.sent.view"),
        borradores: hasPermission("email.drafts.manage"),
        importantes: hasPermission("email.important.manage"),
        papelera: hasPermission("email.messages.delete"),
        redactar: canCompose || (replyingToId && hasPermission("email.reply")),
    }[folder] ?? hasPermission("email.inbox.view");

    return (
        <main className="email-page">
            <div className="email-page-header">
                <div>
                    <span className="email-eyebrow">TELLO · COMUNICACIÓN INTERNA</span>
                    <h1>Email Corporativo</h1>
                    <p>Mensajería interna para conectar con tu equipo.</p>
                </div>
                {!isCompose && canCompose && (
                    <button className="email-button email-button--primary" type="button" onClick={() => openCompose()}>
                        <i className="bi bi-pencil-square" aria-hidden="true"></i>
                        Redactar mensaje
                    </button>
                )}
            </div>

            {feedback && (
                <div className={`email-feedback email-feedback--${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
                    <i className={`bi ${feedback.type === "error" ? "bi-exclamation-circle" : "bi-check-circle"}`} aria-hidden="true"></i>
                    {feedback.text}
                    <button type="button" onClick={() => setFeedback(null)} aria-label="Cerrar aviso">
                        <i className="bi bi-x-lg" aria-hidden="true"></i>
                    </button>
                </div>
            )}

            {!permissions.has("email.access") ? (
                <section className="email-panel email-access-denied" role="alert">
                    <i className="bi bi-shield-lock" aria-hidden="true"></i>
                    <strong>Acceso no disponible</strong>
                    <span>No tienes permisos para acceder a Email Corporativo.</span>
                </section>
            ) : !folderPermission ? (
                <section className="email-panel email-access-denied" role="alert">
                    <i className="bi bi-shield-lock" aria-hidden="true"></i>
                    <strong>Permiso no disponible</strong>
                    <span>Tu rol no tiene permiso para ver esta carpeta o realizar esta acción.</span>
                </section>
            ) : isCompose ? renderComposer() : (
                <>
                    <div className="email-overview">
                        <article className="email-overview-card">
                            <span className="email-overview-icon"><i className="bi bi-inbox" aria-hidden="true"></i></span>
                            <div><small>Mensajes recibidos</small><strong>{messages.filter((message) => message.status === "sent" && isMessageRecipient(message, currentUserId) && !isMessageDeleted(message, currentUserId)).length}</strong></div>
                        </article>
                        <article className="email-overview-card">
                            <span className="email-overview-icon email-overview-icon--yellow"><i className="bi bi-envelope" aria-hidden="true"></i></span>
                            <div><small>Sin leer</small><strong>{unreadCount}</strong></div>
                        </article>
                        <article className="email-overview-card">
                            <span className="email-overview-icon email-overview-icon--green"><i className="bi bi-send" aria-hidden="true"></i></span>
                            <div><small>Enviados</small><strong>{messages.filter((message) => message.status === "sent" && message.senderId === currentUserId && !isMessageDeleted(message, currentUserId)).length}</strong></div>
                        </article>
                    </div>
                    <section className="email-panel email-mailbox">
                        <div className="email-mailbox-heading">
                            <div>
                                <h2>{folderTitle}</h2>
                                <p>{filteredMessages.length} {filteredMessages.length === 1 ? "mensaje" : "mensajes"}</p>
                            </div>
                        </div>
                        <div className="email-toolbar">
                            <label className="email-search">
                                <i className="bi bi-search" aria-hidden="true"></i>
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Buscar por remitente, asunto o contenido"
                                    aria-label="Buscar mensajes"
                                />
                            </label>
                            <label>
                                <span className="visually-hidden">Filtrar por lectura</span>
                                <select value={readFilter} onChange={(event) => setReadFilter(event.target.value)}>
                                    <option value="">Todos los mensajes</option>
                                    <option value="unread">No leídos</option>
                                    <option value="read">Leídos</option>
                                </select>
                            </label>
                            <label>
                                <span className="visually-hidden">Filtrar por prioridad</span>
                                <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
                                    <option value="">Todas las prioridades</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">Alta</option>
                                </select>
                            </label>
                        </div>

                        <div className={`email-mailbox-content ${selectedMessage ? "has-selection" : ""}`}>
                            <div className="email-message-list">
                                {filteredMessages.length ? filteredMessages.map((message) => {
                                    const unread = isMessageUnread(message, currentUserId);
                                    const isSender = message.senderId === currentUserId;
                                    const summary = message.status === "draft"
                                        ? "Borrador"
                                        : isSender
                                            ? `Para: ${message.toIds.map(contactName).join(", ")}`
                                            : contactName(message.senderId);
                                    const important = message.importantBy.includes(currentUserId);
                                    return (
                                        <article className={`email-message-row ${unread ? "is-unread" : ""} ${selectedMessageId === message.id ? "is-selected" : ""}`} key={message.id}>
                                            <button className="email-message-open" type="button" onClick={() => openMessage(message)}>
                                                <span className="email-message-avatar">{contactName(message.senderId).charAt(0)}</span>
                                                <span className="email-message-main">
                                                    <span className="email-message-topline">
                                                        <strong>{summary}</strong>
                                                        <time>{formatDate(message.sentAt)}</time>
                                                    </span>
                                                    <span className="email-message-subject">{message.subject || "Sin asunto"}</span>
                                                    <span className="email-message-preview">{message.body.replace(/\s+/g, " ").slice(0, 130) || "Sin descripción"}</span>
                                                    <span className="email-message-indicators">
                                                        {unread && <span className="email-unread-label">No leído</span>}
                                                        {message.priority === "high" && <span className="email-priority email-priority--high">Alta</span>}
                                                        {message.attachments.length > 0 && <span><i className="bi bi-paperclip" aria-hidden="true"></i> {message.attachments.length}</span>}
                                                    </span>
                                                </span>
                                            </button>
                                            {hasPermission("email.important.manage") && (
                                                <button
                                                    type="button"
                                                    className={`email-icon-button email-row-star ${important ? "is-important" : ""}`}
                                                    onClick={() => toggleImportant(message)}
                                                    aria-label={important ? "Quitar de Importantes" : "Marcar como importante"}
                                                >
                                                    <i className={`bi ${important ? "bi-star-fill" : "bi-star"}`} aria-hidden="true"></i>
                                                </button>
                                            )}
                                            {folder !== "papelera" && hasPermission("email.messages.delete") && (
                                                <button type="button" className="email-icon-button email-row-delete" onClick={() => moveToTrash(message)} aria-label="Mover a Papelera">
                                                    <i className="bi bi-trash3" aria-hidden="true"></i>
                                                </button>
                                            )}
                                            {folder === "papelera" && hasPermission("email.messages.delete") && (
                                                <button type="button" className="email-icon-button email-row-delete" onClick={() => restoreMessage(message)} aria-label="Restaurar mensaje">
                                                    <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
                                                </button>
                                            )}
                                        </article>
                                    );
                                }) : (
                                    <div className="email-empty-state">
                                        <i className="bi bi-envelope-open" aria-hidden="true"></i>
                                        <strong>{search || readFilter || priorityFilter ? "No hay resultados" : `No hay mensajes en ${folderTitle.toLocaleLowerCase("es")}`}</strong>
                                        <span>{search || readFilter || priorityFilter ? "Prueba con otros términos o filtros." : "Los mensajes de esta carpeta aparecerán aquí."}</span>
                                    </div>
                                )}
                            </div>
                            {selectedMessage ? renderMessageDetail(selectedMessage) : (
                                <div className="email-detail-placeholder">
                                    <i className="bi bi-envelope-paper" aria-hidden="true"></i>
                                    <strong>Selecciona un mensaje</strong>
                                    <span>El contenido del mensaje aparecerá aquí.</span>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}
        </main>
    );
};

export default Email;
