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

                        </div>

                    </article>

                ))}

            </div>

        </div>
    );
};

export default News;