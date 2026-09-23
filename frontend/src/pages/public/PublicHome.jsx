import { Link } from "react-router-dom";
import "./PublicHome.scss";

const PublicHome = () => {
    return (
        <main className="public-home">

            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="public-header">

                <div className="container">

                    <div className="public-header-content">

                        <div className="public-brand">

                            <img
                                src="/logo_tello.png"
                                alt="Logo TELLO"
                            />

                            <div className="public-brand-name">
                                <span className="brand-blue">
                                    Intranet
                                </span>

                                <span className="brand-red">
                                    TELLO
                                </span>
                            </div>

                        </div>


                        <Link
                            to="/login"
                            className="public-login-button"
                        >
                            Ingresar a la intranet
                        </Link>

                    </div>

                </div>

            </header>


            {/* ==================================================
                HERO
            ================================================== */}

            <section className="public-hero">

                <div className="container">

                    <div className="row align-items-center">

                        <div className="col-lg-7">

                            <span className="public-eyebrow">
                                INTRANET CORPORATIVA
                            </span>

                            <h1>
                                Información, comunicación
                                <span> y conexión.</span>
                            </h1>

                            <p>
                                Un espacio centralizado para mantener
                                informados a nuestros colaboradores y
                                facilitar el acceso a la información
                                institucional.
                            </p>

                            <Link
                                to="/login"
                                className="public-primary-button"
                            >
                                Acceder a la intranet
                            </Link>

                        </div>


                        <div className="col-lg-5">

                            <div className="public-hero-card">

                                <div className="hero-card-icon">
                                    ✓
                                </div>

                                <h3>
                                    Todo en un solo lugar
                                </h3>

                                <p>
                                    Noticias, comunicados, documentos,
                                    eventos e información institucional
                                    para nuestros colaboradores.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================================
                NOTICIAS DESTACADAS
            ================================================== */}

            <section className="public-section">

                <div className="container">

                    <div className="section-heading">

                        <span>
                            INFORMACIÓN DESTACADA
                        </span>

                        <h2>
                            Noticias y comunicados
                        </h2>

                        <p>
                            Mantente informado sobre las novedades
                            y actividades de nuestra organización.
                        </p>

                    </div>


                    <div className="row g-4">

                        <div className="col-md-4">

                            <article className="news-card">

                                <div className="news-card-top news-blue">
                                    COMUNICADO
                                </div>

                                <div className="news-card-body">

                                    <span className="news-date">
                                        23 de septiembre de 2026
                                    </span>

                                    <h3>
                                        Información institucional
                                    </h3>

                                    <p>
                                        Consulta información importante
                                        para todos nuestros colaboradores.
                                    </p>

                                </div>

                            </article>

                        </div>


                        <div className="col-md-4">

                            <article className="news-card">

                                <div className="news-card-top news-red">
                                    NOTICIA
                                </div>

                                <div className="news-card-body">

                                    <span className="news-date">
                                        22 de septiembre de 2026
                                    </span>

                                    <h3>
                                        Novedades de la empresa
                                    </h3>

                                    <p>
                                        Conoce las últimas novedades,
                                        actividades y acontecimientos
                                        de nuestra organización.
                                    </p>

                                </div>

                            </article>

                        </div>


                        <div className="col-md-4">

                            <article className="news-card">

                                <div className="news-card-top news-green">
                                    INFORMACIÓN
                                </div>

                                <div className="news-card-body">

                                    <span className="news-date">
                                        20 de septiembre de 2026
                                    </span>

                                    <h3>
                                        Actividades y eventos
                                    </h3>

                                    <p>
                                        Revisa las próximas actividades
                                        y eventos institucionales.
                                    </p>

                                </div>

                            </article>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================================
                MISIÓN / VISIÓN
            ================================================== */}

            <section className="public-section public-section-gray">

                <div className="container">

                    <div className="row g-4">

                        <div className="col-md-6">

                            <div className="institutional-card">

                                <span className="institutional-label">
                                    NUESTRA MISIÓN
                                </span>

                                <h2>
                                    Misión
                                </h2>

                                <p>
                                    Aquí podremos presentar posteriormente
                                    la misión oficial de la empresa para
                                    conocimiento de todos los colaboradores.
                                </p>

                            </div>

                        </div>


                        <div className="col-md-6">

                            <div className="institutional-card">

                                <span className="institutional-label">
                                    NUESTRA VISIÓN
                                </span>

                                <h2>
                                    Visión
                                </h2>

                                <p>
                                    Aquí podremos presentar posteriormente
                                    la visión oficial de la empresa y los
                                    objetivos institucionales.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================================
                INFORMACIÓN GENERAL
            ================================================== */}

            <section className="public-section">

                <div className="container">

                    <div className="section-heading">

                        <span>
                            INFORMACIÓN PARA COLABORADORES
                        </span>

                        <h2>
                            Conoce nuestra organización
                        </h2>

                    </div>


                    <div className="row g-4">

                        <div className="col-md-4">

                            <div className="info-card">

                                <div className="info-icon">
                                    👥
                                </div>

                                <h3>
                                    Nuestra gente
                                </h3>

                                <p>
                                    Información relacionada con nuestros
                                    colaboradores y equipos de trabajo.
                                </p>

                            </div>

                        </div>


                        <div className="col-md-4">

                            <div className="info-card">

                                <div className="info-icon">
                                    📄
                                </div>

                                <h3>
                                    Documentos
                                </h3>

                                <p>
                                    Próximamente podrás consultar documentos,
                                    políticas y procedimientos institucionales.
                                </p>

                            </div>

                        </div>


                        <div className="col-md-4">

                            <div className="info-card">

                                <div className="info-icon">
                                    📅
                                </div>

                                <h3>
                                    Eventos
                                </h3>

                                <p>
                                    Conoce las actividades y eventos
                                    programados por la organización.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <footer className="public-footer">

                <div className="public-footer-colors">
                    <span className="footer-blue"></span>
                    <span className="footer-red"></span>
                    <span className="footer-yellow"></span>
                    <span className="footer-green"></span>
                </div>

                <div className="container">

                    <div className="public-footer-content">

                        <div>
                            © 2026 TELLO — Intranet Corporativa
                        </div>

                        <Link to="/login">
                            Acceso de colaboradores
                        </Link>

                    </div>

                </div>

            </footer>

        </main>
    );
};

export default PublicHome;