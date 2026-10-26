import { useState } from "react";
import {
    requestTypes,
    requestFormConfig,
    myRequests,
} from "./requestsData";
import mockCurrentUser from "../../data/mockCurrentUser";
import { downloadRequestPdf } from "../../utils/downloadRequestPdf";
import "./requests.scss";

const Requests = () => {

    const [selectedRequestType, setSelectedRequestType] =
        useState(null);

    const [formData, setFormData] = useState({});
    const [submittedRequests, setSubmittedRequests] = useState(() => myRequests.map((request) => ({ ...request })));
    const [editingRequest, setEditingRequest] = useState(null);
    const [detailRequest, setDetailRequest] = useState(null);
    const [requestMessage, setRequestMessage] = useState("");

    const openRequestModal = (type, request = null) => {

        const config = requestFormConfig[type];

        const initialData = {};

        config.fields.forEach((field) => {
            initialData[field.name] = request?.details?.[field.name] || "";
        });

        setFormData(initialData);
        setEditingRequest(request);
        setSelectedRequestType(type);
    };

    const closeRequestModal = () => {
        setSelectedRequestType(null);
        setFormData({});
        setEditingRequest(null);
    };

    const handleChange = (event) => {

        const { name, value, files } =
            event.target;

        setFormData((current) => ({
            ...current,
            [name]:
                event.target.type === "file"
                    ? files?.[0] || null
                    : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const type = requestTypes.find((request) => request.id === selectedRequestType);
        const submittedAt = editingRequest?.submittedAt || new Date().toISOString().slice(0, 10);
        if (editingRequest) {
            setSubmittedRequests((current) => current.map((request) => request.id === editingRequest.id
                ? { ...request, type: type.title, status: request.status || "Pendiente", details: formData }
                : request));
            setRequestMessage("Los cambios se guardaron en esta sesión.");
        } else {
            setSubmittedRequests((current) => [{
                id: `REQ-${Date.now()}`,
                type: type.title,
                date: new Intl.DateTimeFormat("es-MX").format(new Date()),
                submittedAt,
                status: "Pendiente",
                statusClass: "pending",
                details: formData,
            }, ...current]);
            setRequestMessage("La solicitud se agregó a la lista local. No se envió a un servidor.");
        }
        closeRequestModal();
    };

    const downloadRequest = (request) => {
        try {
            const type = requestTypes.find((item) => item.title === request.type);
            const fieldLabels = Object.fromEntries(
                (requestFormConfig[type?.id]?.fields || []).map((field) => [field.name, field.label]),
            );
            const filename = downloadRequestPdf(request, mockCurrentUser, fieldLabels);
            setRequestMessage(`Se generó la descarga local «${filename}».`);
        } catch (error) {
            console.error("No se pudo generar el PDF de la solicitud.", error);
            setRequestMessage("No se pudo generar el PDF. Verifica los datos de la solicitud e inténtalo nuevamente.");
        }
    };

    return (
        <div className="requests-page">

            <div className="requests-page__header">

                <div>
                    <h1>SOLICITUDES</h1>

                    <p>
                        Selecciona el tipo de solicitud
                        que deseas realizar.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                        document
                            .getElementById("request-types")
                            ?.scrollIntoView({
                                behavior: "smooth",
                            })
                    }
                >
                    <i className="bi bi-plus-lg"></i>
                    Nueva solicitud
                </button>

            </div>

            <section
                id="request-types"
                className="request-types"
            >

                <div className="request-types__grid">

                    {requestTypes.map((request) => (

                        <div
                            key={request.id}
                            className="request-type-card"
                        >

                            <div className="request-type-card__icon">

                                <i
                                    className={`bi ${request.icon}`}
                                ></i>

                            </div>

                            <h3>
                                {request.title}
                            </h3>

                            <p>
                                {request.description}
                            </p>

                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() =>
                                    openRequestModal(
                                        request.id
                                    )
                                }
                            >
                                Solicitar
                            </button>

                        </div>

                    ))}

                </div>

            </section>

            <section className="my-requests">
                <div className="my-requests__header">
                    <div><h2>Mis solicitudes</h2><p>Consulta y administra las solicitudes registradas en esta sesión.</p></div>
                </div>
                {requestMessage && <p className="my-requests__notice" role="status">{requestMessage}</p>}
                <div className="my-requests__table-wrap">
                    <table className="my-requests__table">
                        <thead><tr><th>Fecha de solicitud</th><th>Tipo de permiso</th><th>Estado</th><th>Acciones</th></tr></thead>
                        <tbody>
                            {submittedRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.date}</td>
                                    <td>{request.type}</td>
                                    <td><span className={`request-status-badge request-status-badge--${request.statusClass || "pending"}`}>{request.status}</span></td>
                                    <td>
                                        <div className="my-requests__actions">
                                            <button type="button" className="btn btn-sm btn-outline-primary" title="Ver solicitud" aria-label={`Ver solicitud ${request.id}`} onClick={() => setDetailRequest(request)}><i className="bi bi-eye" aria-hidden="true"></i> Ver</button>
                                            <button type="button" className="btn btn-sm btn-outline-secondary" title="Editar solicitud" aria-label={`Editar solicitud ${request.id}`} onClick={() => {
                                                const type = requestTypes.find((item) => item.title === request.type);
                                                if (type) openRequestModal(type.id, request);
                                            }}><i className="bi bi-pencil" aria-hidden="true"></i> Editar</button>
                                            <button type="button" className="btn btn-sm btn-outline-danger" title="Eliminar solicitud" aria-label={`Eliminar solicitud ${request.id}`} onClick={() => {
                                                if (window.confirm(`¿Eliminar la solicitud ${request.id} de la lista local?`)) {
                                                    setSubmittedRequests((current) => current.filter((item) => item.id !== request.id));
                                                    setRequestMessage("La solicitud se eliminó de la lista local.");
                                                }
                                            }}><i className="bi bi-trash" aria-hidden="true"></i> Eliminar</button>
                                            <button type="button" className="btn btn-sm btn-primary" title="Descargar PDF" aria-label={`Descargar PDF de la solicitud ${request.id}`} onClick={() => downloadRequest(request)}><i className="bi bi-file-earmark-pdf" aria-hidden="true"></i> Descargar PDF</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {submittedRequests.length === 0 && <tr><td colSpan="4" className="my-requests__empty">No tienes solicitudes registradas.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* MODAL */}

            {selectedRequestType && (
                <div className="request-modal">

                    <div
                        className="request-modal__overlay"
                        onClick={closeRequestModal}
                    />

                    <div className="request-modal__dialog">

                        <div className="request-modal__header">

                            <div>

                                <h2>
                                    {
                                        requestFormConfig[
                                            selectedRequestType
                                        ].title
                                    }
                                </h2>

                                <p>
                                    Completa la información
                                    requerida.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="request-modal__close"
                                onClick={closeRequestModal}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="request-modal__body">

                                <div className="row g-3">

                                    {requestFormConfig[
                                        selectedRequestType
                                    ].fields.map(
                                        (field) => (

                                            <div
                                                key={
                                                    field.name
                                                }
                                                className={
                                                    field.col ||
                                                    "col-12"
                                                }
                                            >

                                                <label
                                                    htmlFor={
                                                        field.name
                                                    }
                                                    className="form-label"
                                                >
                                                    {
                                                        field.label
                                                    }

                                                    {field.required && (
                                                        <span className="text-danger">
                                                            {" "}
                                                            *
                                                        </span>
                                                    )}
                                                </label>

                                                {field.type ===
                                                    "textarea" && (
                                                    <textarea
                                                        id={
                                                            field.name
                                                        }
                                                        name={
                                                            field.name
                                                        }
                                                        rows="4"
                                                        className="form-control"
                                                        required={
                                                            field.required
                                                        }
                                                        value={
                                                            formData[
                                                                field.name
                                                            ] ||
                                                            ""
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    />
                                                )}

                                                {field.type ===
                                                    "select" && (
                                                    <select
                                                        id={
                                                            field.name
                                                        }
                                                        name={
                                                            field.name
                                                        }
                                                        className="form-select"
                                                        required={
                                                            field.required
                                                        }
                                                        value={
                                                            formData[
                                                                field.name
                                                            ] ||
                                                            ""
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    >
                                                        <option value="">
                                                            Seleccionar...
                                                        </option>

                                                        {field.options.map(
                                                            (
                                                                option
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        option
                                                                    }
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {
                                                                        option
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                )}

                                                {field.type !==
                                                    "textarea" &&
                                                    field.type !==
                                                        "select" && (
                                                        <input
                                                            id={
                                                                field.name
                                                            }
                                                            name={
                                                                field.name
                                                            }
                                                            type={
                                                                field.type
                                                            }
                                                            min={
                                                                field.min
                                                            }
                                                            className="form-control"
                                                            required={
                                                                field.required
                                                            }
                                                            {...(field.type === "file"
                                                                ? {}
                                                                : { value: formData[field.name] || "" })}
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                    )}

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                            <div className="request-modal__footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={
                                        closeRequestModal
                                    }
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    <i className={`bi ${editingRequest ? "bi-check-lg" : "bi-send"}`}></i>
                                    {editingRequest ? "Guardar cambios" : "Enviar solicitud"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {detailRequest && (
                <div className="request-modal" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailRequest(null); }}>
                    <div className="request-modal__overlay"></div>
                    <section className="request-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="request-detail-title">
                        <div className="request-modal__header">
                            <div><h2 id="request-detail-title">{detailRequest.type}</h2><p>Detalle de la solicitud {detailRequest.id} · {detailRequest.status}</p></div>
                            <button type="button" className="request-modal__close" aria-label="Cerrar" onClick={() => setDetailRequest(null)}><i className="bi bi-x-lg"></i></button>
                        </div>
                        <div className="request-modal__body">
                            <p><strong>Fecha de solicitud:</strong> {detailRequest.date}</p>
                            {Object.entries(detailRequest.details || {}).map(([key, value]) => {
                                const field = requestFormConfig[requestTypes.find((item) => item.title === detailRequest.type)?.id]?.fields.find((item) => item.name === key);
                                if (!value || typeof value !== "string") return null;
                                return <p key={key}><strong>{field?.label || key}:</strong> {value}</p>;
                            })}
                            {!Object.keys(detailRequest.details || {}).length && <p>Esta solicitud de ejemplo no incluye más detalles.</p>}
                        </div>
                        <div className="request-modal__footer"><button type="button" className="btn btn-secondary" onClick={() => setDetailRequest(null)}>Cerrar</button></div>
                    </section>
                </div>
            )}

        </div>
    );
};

export default Requests;