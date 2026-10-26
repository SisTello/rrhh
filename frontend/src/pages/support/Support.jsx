import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supportRequests as initialSupportRequests } from "./supportData";
import "./support.scss";

const Support = () => {
    const navigate = useNavigate();

    const [supportRequests, setSupportRequests] = useState(
        initialSupportRequests
    );

    const [closingRequest, setClosingRequest] = useState(null);
    const [detailRequest, setDetailRequest] = useState(null);

    const [closureComment, setClosureComment] = useState("");

    const handleCloseSupport = () => {
        if (!closingRequest) {
            return;
        }

        setSupportRequests((current) =>
            current.map((request) =>
                request.id === closingRequest.id
                    ? {
                          ...request,
                          status: "Cerrada",
                          statusClass: "closed",
                          closureComment,
                      }
                    : request
            )
        );

        setClosingRequest(null);
        setClosureComment("");
    };

    return (
        <div className="support-page">

            <div className="support-page__header">
                <h1>SOPORTE TÉCNICO</h1>
            </div>

            <section className="support-page__content">

                {/* SOLICITAR SOPORTE */}

                <div className="support-request-card">

                    <div className="support-request-card__icon">
                        <i className="bi bi-tools"></i>
                    </div>

                    <h2>
                        ¿Necesitas asistencia técnica?
                    </h2>

                    <p>
                        Reporta problemas con equipos,
                        sistemas, accesos, red, impresoras
                        y otros servicios.
                    </p>

                    <button
                        type="button"
                        className="btn btn-primary support-request-card__button"
                        onClick={() =>
                            navigate(
                                "/soporte/nueva-solicitud"
                            )
                        }
                    >
                        <i className="bi bi-plus-lg"></i>
                        SOLICITAR SOPORTE
                    </button>

                </div>

                {/* HISTORIAL */}

                <div className="support-history">

                    <div className="support-history__header">

                        <div>
                            <h2>
                                MIS SOLICITUDES DE SOPORTE
                            </h2>

                            <p>
                                Consulta el estado de tus
                                solicitudes realizadas.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() =>
                                navigate(
                                    "/soporte/nueva-solicitud"
                                )
                            }
                        >
                            <i className="bi bi-plus-lg"></i>
                            Nueva solicitud
                        </button>

                    </div>

                    <div className="support-table-wrapper">

                        <table className="support-table">

                            <thead>
                                <tr>
                                    <th>N.º</th>
                                    <th>Asunto</th>
                                    <th>Categoría</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Acción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {supportRequests.map(
                                    (request) => (
                                        <tr key={request.id}>

                                            <td>
                                                <strong>
                                                    {request.id}
                                                </strong>
                                            </td>

                                            <td>
                                                {request.subject}
                                            </td>

                                            <td>
                                                {request.category}
                                            </td>

                                            <td>
                                                {request.date}
                                            </td>

                                            <td>
                                                <span
                                                    className={`support-status support-status--${request.statusClass}`}
                                                >
                                                    {request.status}
                                                </span>
                                            </td>

                                            <td>

                                                {request.status ===
                                                    "Resuelta" && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() =>
                                                            setClosingRequest(
                                                                request
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-check-circle"></i>
                                                        Cerrar soporte
                                                    </button>
                                                )}

                                                {request.status ===
                                                    "En atención" && (
                                                    <span className="support-action-text">
                                                        En atención
                                                    </span>
                                                )}

                                                {request.status ===
                                                    "Cerrada" && (
                                                    <span className="support-action-text support-action-text--closed">
                                                        Cerrada
                                                    </span>
                                                )}

                                            </td>

                                            <td>
                                                <div className="support-request-actions">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => setDetailRequest(request)}
                                                    >
                                                        <i className="bi bi-eye" aria-hidden="true"></i> Ver detalle
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => {
                                                            if (window.confirm(`¿Eliminar la solicitud ${request.id}? Esta acción solo la quitará de la lista local.`)) {
                                                                setSupportRequests((current) => current.filter((item) => item.id !== request.id));
                                                            }
                                                        }}
                                                    >
                                                        <i className="bi bi-trash" aria-hidden="true"></i> Eliminar
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </section>

            {detailRequest && (
                <div className="support-modal" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailRequest(null); }}>
                    <div className="support-modal__overlay"></div>
                    <section className="support-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="support-detail-title">
                        <div className="support-modal__header">
                            <h3 id="support-detail-title">Detalle de la solicitud {detailRequest.id}</h3>
                            <button type="button" className="support-modal__close" aria-label="Cerrar" onClick={() => setDetailRequest(null)}><i className="bi bi-x-lg" aria-hidden="true"></i></button>
                        </div>
                        <div className="support-modal__body support-detail-body">
                            <p><strong>Asunto:</strong> {detailRequest.subject}</p>
                            <p><strong>Categoría:</strong> {detailRequest.category}</p>
                            <p><strong>Fecha:</strong> {detailRequest.date}</p>
                            <p><strong>Estado:</strong> {detailRequest.status}</p>
                            <p><strong>Prioridad:</strong> {detailRequest.priority || "No especificada"}</p>
                            <p><strong>Solicitante:</strong> {detailRequest.requester || "No especificado"}</p>
                            <p><strong>Descripción:</strong> {detailRequest.description || "No se proporcionó una descripción."}</p>
                            {detailRequest.closureComment && <p><strong>Comentario de cierre:</strong> {detailRequest.closureComment}</p>}
                        </div>
                        <div className="support-modal__footer"><button type="button" className="btn btn-secondary" onClick={() => setDetailRequest(null)}>Cerrar</button></div>
                    </section>
                </div>
            )}

            {/* MODAL CIERRE */}

            {closingRequest && (
                <div className="support-modal">

                    <div className="support-modal__overlay">
                    </div>

                    <div className="support-modal__dialog">

                        <div className="support-modal__header">

                            <h3>
                                Cerrar solicitud
                            </h3>

                            <button
                                type="button"
                                className="support-modal__close"
                                onClick={() =>
                                    setClosingRequest(null)
                                }
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                        </div>

                        <div className="support-modal__body">

                            <p>
                                ¿Confirmas que la atención de la
                                solicitud{" "}
                                <strong>
                                    {closingRequest.id}
                                </strong>{" "}
                                fue realizada satisfactoriamente?
                            </p>

                            <div className="form-check">

                                <input
                                    id="serviceSatisfied"
                                    type="checkbox"
                                    className="form-check-input"
                                />

                                <label
                                    htmlFor="serviceSatisfied"
                                    className="form-check-label"
                                >
                                    Estoy conforme con la
                                    atención recibida.
                                </label>

                            </div>

                            <div className="mb-3 mt-3">

                                <label
                                    htmlFor="closureComment"
                                    className="form-label"
                                >
                                    Comentario de cierre
                                    <span>
                                        {" "}
                                        (opcional)
                                    </span>
                                </label>

                                <textarea
                                    id="closureComment"
                                    className="form-control"
                                    rows="3"
                                    value={closureComment}
                                    onChange={(event) =>
                                        setClosureComment(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Escribe un comentario sobre la atención recibida..."
                                />

                            </div>

                        </div>

                        <div className="support-modal__footer">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    setClosingRequest(null)
                                }
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={
                                    handleCloseSupport
                                }
                            >
                                <i className="bi bi-check-lg"></i>
                                Confirmar cierre
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Support;