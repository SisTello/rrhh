import "./Dashboard.scss";
import { employeeRequestStatus } from "../../data/mockRequests";

const Dashboard = () => {

    return (
        <div className="dashboard">

            {/* ==================================================
                BIENVENIDA
            ================================================== */}

            <section className="dashboard-welcome">

                <div>

                    <span className="dashboard-eyebrow">
                        INTRANET CORPORATIVA
                    </span>

                    <h1>
                        ¡Bienvenido!
                    </h1>

                    <p>
                        Este es tu espacio de trabajo dentro de la
                        intranet corporativa.
                    </p>

                </div>

            </section>


            {/* ==================================================
                INDICADORES
            ================================================== */}

            <section className="dashboard-stats">

                <div className="dashboard-stat">

                    <div className="stat-icon stat-blue">
                        3
                    </div>

                    <div>
                        <span>
                            Comunicados
                        </span>

                        <strong>
                            Nuevos
                        </strong>
                    </div>

                </div>


                <div className="dashboard-stat">

                    <div className="stat-icon stat-green">
                        5
                    </div>

                    <div>
                        <span>
                            Documentos
                        </span>

                        <strong>
                            Actualizados
                        </strong>
                    </div>

                </div>


                <div className="dashboard-stat">

                    <div className="stat-icon stat-yellow">
                        2
                    </div>

                    <div>
                        <span>
                            Solicitudes
                        </span>

                        <strong>
                            Pendientes
                        </strong>
                    </div>

                </div>


                <div className="dashboard-stat">

                    <div className="stat-icon stat-red">
                        1
                    </div>

                    <div>
                        <span>
                            Evento
                        </span>

                        <strong>
                            Hoy
                        </strong>
                    </div>

                </div>

            </section>


            {/* ==================================================
                CONTENIDO
            ================================================== */}

            <section className="row g-4 dashboard-content">

                {/* ==================================================
                    NOTICIAS
                ================================================== */}

                <div className="col-xl-6">

                    <div className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <span className="panel-eyebrow">
                                    INFORMACIÓN
                                </span>

                                <h2>
                                    Noticias recientes
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="dashboard-link-button"
                                disabled
                                aria-disabled="true"
                            >
                                Ver todas
                            </button>

                        </div>


                        <div className="news-list">

                            <article className="dashboard-news">

                                <div className="news-date-box">
                                    <strong>
                                        23
                                    </strong>

                                    <span>
                                        SEP
                                    </span>
                                </div>

                                <div>
                                    <span className="news-category">
                                        COMUNICADO
                                    </span>

                                    <h3>
                                        Información institucional
                                    </h3>

                                    <p>
                                        Revisa las últimas novedades
                                        de nuestra organización.
                                    </p>
                                </div>

                            </article>


                            <article className="dashboard-news">

                                <div className="news-date-box">
                                    <strong>
                                        22
                                    </strong>

                                    <span>
                                        SEP
                                    </span>
                                </div>

                                <div>
                                    <span className="news-category news-category-red">
                                        NOTICIA
                                    </span>

                                    <h3>
                                        Novedades de la empresa
                                    </h3>

                                    <p>
                                        Conoce las actividades y
                                        acontecimientos recientes.
                                    </p>
                                </div>

                            </article>


                            <article className="dashboard-news">

                                <div className="news-date-box">
                                    <strong>
                                        20
                                    </strong>

                                    <span>
                                        SEP
                                    </span>
                                </div>

                                <div>
                                    <span className="news-category news-category-green">
                                        ACTIVIDAD
                                    </span>

                                    <h3>
                                        Próximas actividades
                                    </h3>

                                    <p>
                                        Revisa el calendario de eventos
                                        institucionales.
                                    </p>
                                </div>

                            </article>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    EVENTOS
                ================================================== */}

                <div className="col-xl-3 col-md-6">

                    <div className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <span className="panel-eyebrow">
                                    AGENDA
                                </span>

                                <h2>
                                    Próximos eventos
                                </h2>
                            </div>

                        </div>


                        <div className="event-list">

                            <div className="event-item">

                                <div className="event-dot event-blue"></div>

                                <div>
                                    <strong>
                                        Reunión de gerencia
                                    </strong>

                                    <span>
                                        25/09/2026 · 09:00
                                    </span>
                                </div>

                            </div>


                            <div className="event-item">

                                <div className="event-dot event-yellow"></div>

                                <div>
                                    <strong>
                                        Capacitación
                                    </strong>

                                    <span>
                                        26/09/2026 · 14:00
                                    </span>
                                </div>

                            </div>


                            <div className="event-item">

                                <div className="event-dot event-red"></div>

                                <div>
                                    <strong>
                                        Evaluación institucional
                                    </strong>

                                    <span>
                                        30/09/2026 · 08:30
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    ACCESOS RÁPIDOS
                ================================================== */}
                
                 <div className="col-xl-3 col-md-6">

                    <div className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <span className="panel-eyebrow">
                                    SOLICITUDES
                                </span>

                                <h2>
                                    Estado Solicitud
                                </h2>
                            </div>

                        </div>


                        <div className="request-status-table-wrapper">

                    <table className="request-status-table">


                        <tbody>

                            {employeeRequestStatus
                                .slice(0, 4)
                                .map((request) => (
                                    <tr key={request.id}>

                                        <td>
                                            {request.type}
                                        </td>

                                        <td>
                                            {request.date}
                                        </td>

                                        <td>
                                            <span
                                                className={`request-status-badge request-status-badge--${request.statusClass}`}
                                            >
                                                {request.status}
                                            </span>
                                        </td>

                                    </tr>
                                ))}

                        </tbody>

                    </table>

                </div>

                    </div>

                </div>






            </section>

        </div>
    );
};

export default Dashboard;