import "./news.scss";

const newsItems = [
    {
        id: 1,
        category: "IMPORTANTE",
        title: "Actualización del horario de atención",
        description:
            "Se informa al personal que a partir del 01 de octubre se aplicará el nuevo horario de atención.",
        area: "Administración",
        date: "24 septiembre 2026",
        icon: "🏢",

        attachment: {
            name: "Comunicado_Horario_2026.pdf",
            type: "PDF",
        },
    },

    {
        id: 2,
        category: "",
        title: "Mantenimiento programado de sistemas",
        description:
            "Se realizará mantenimiento de los servicios internos durante el día viernes.",
        area: "Sistemas",
        date: "23 septiembre 2026",
        icon: "🖥️",

        attachment: {
            name: "Mantenimiento_Sistemas.pdf",
            type: "PDF",
        },
    },
];

const News = () => {
    return (
        <div className="news-page">

            {/* ========================================= */}
            {/* CABECERA */}
            {/* ========================================= */}

            <div className="news-page__header">

                <div>
                    <h1>Comunicados internos</h1>

                    <p>
                        Información y novedades para todos los colaboradores.
                    </p>
                </div>

                <button
                    type="button"
                    className="news-page__view-all"
                >
                    Ver todos
                    <span>→</span>
                </button>

            </div>


            {/* ========================================= */}
            {/* LISTADO */}
            {/* ========================================= */}

            <div className="news-list">

                {newsItems.map((news) => (

                    <article
                        className="news-card"
                        key={news.id}
                    >

                        {/* IMAGEN / ICONO */}

                        <div className="news-card__media">

                            <div className="news-card__media-icon">
                                {news.icon}
                            </div>

                        </div>


                        {/* INFORMACIÓN */}

                        <div className="news-card__content">

                            {news.category && (
                                <span className="news-card__category">
                                    {news.category}
                                </span>
                            )}

                            <h2>
                                {news.title}
                            </h2>

                            <p>
                                {news.description}
                            </p>

                            <div className="news-card__meta">

                                <span>
                                    {news.area}
                                </span>

                                <span className="news-card__separator">
                                    ·
                                </span>

                                <span>
                                    {news.date}
                                </span>

                            </div>
                            {news.attachment && (
                                <div className="news-card__attachment">


                                    <div className="news-card__attachment-info">
                                        
                                        <strong>
                                            {news.attachment.name}
                                        </strong>

                                        <small>
                                            _Documento adjunto · {news.attachment.type}
                                        </small>

                                    </div>

                                    <div className="news-card__attachment-actions">

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                        >
                                            Ver
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            ↓
                                        </button>

                                    </div>

                                </div>
                            )}

                        </div>

                    </article>

                ))}

            </div>

        </div>
    );
};

export default News;