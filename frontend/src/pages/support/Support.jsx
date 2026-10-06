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

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </section>

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