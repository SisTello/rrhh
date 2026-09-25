import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

const MainLayout = ({ children }) => {

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navigate = useNavigate();


    // ==================================================
    // MENÚ PRINCIPAL
    // ==================================================

    const menuItems = [
        {
            label: "Inicio",
            icon: "⌂",
            to: "/dashboard",
        },
        {
            label: "Noticias", 
            icon: "▣", 
            to: "/noticias",
        },
        {
            label: "Comunicados",
            icon: "◈",
            to: "#",
        },
        {
            label: "Documentos",
            icon: "▤",
            to: "/documentos",
        },
        {
            label: "Directorio",
            icon: "♙",
            to: "#",
        },
        {
            label: "Solicitudes",
            icon: "▢",
            to: "#",
        },
        {
            label: "Calendario",
            icon: "□",
            to: "#",
        },
    ];


    // ==================================================
    // COLAPSAR SIDEBAR
    // ==================================================

    const handleSidebarToggle = () => {
        setSidebarCollapsed((current) => !current);
    };


    // ==================================================
    // CERRAR SESIÓN
    // ==================================================

    const handleLogout = () => {

        // ==================================================
        // ETAPA ACTUAL
        // --------------------------------------------------
        // Por ahora solamente regresamos al Login.
        //
        // Posteriormente aquí podremos:
        //
        // - eliminar token
        // - limpiar sesión
        // - limpiar datos del usuario
        // - invalidar sesión
        // ==================================================

        setUserMenuOpen(false);

        navigate("/login");
    };


    return (
        <div
            className={`main-layout ${
                sidebarCollapsed ? "sidebar-collapsed" : ""
            }`}
        >

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <aside
                className={`main-sidebar
                    ${sidebarCollapsed ? "collapsed" : ""}
                    ${mobileSidebarOpen ? "mobile-open" : ""}
                `}
            >
            {mobileSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

                {/* ==================================================
                    BRAND
                ================================================== */}

                <div className="sidebar-brand">

                    <Link to="/dashboard">

                        <img
                            src="/logo_tello.png"
                            alt="Logo TELLO"
                        />

                        <div className="sidebar-brand-text">

                            <span className="sidebar-brand-intranet">
                                INTRANET
                            </span>

                            <span className="sidebar-brand-company">
                                TELLO
                            </span>

                        </div>

                    </Link>

                </div>


                {/* ==================================================
                    NAVEGACIÓN
                ================================================== */}

                <nav className="sidebar-navigation">

                    <div className="sidebar-section-title">
                        PRINCIPAL
                    </div>


                    {menuItems.map((item) => {

                        // --------------------------------------------------
                        // OPCIONES TODAVÍA SIN RUTA
                        // --------------------------------------------------

                        if (item.to === "#") {

                            return (
                                <a
                                    href="#"
                                    className="sidebar-link"
                                    key={item.label}
                                    onClick={(event) => {
                                        event.preventDefault();
                                    }}
                                    title={
                                        sidebarCollapsed
                                            ? item.label
                                            : ""
                                    }
                                >

                                    <span className="sidebar-icon">
                                        {item.icon}
                                    </span>

                                    <span className="sidebar-link-text">
                                        {item.label}
                                    </span>

                                </a>
                            );
                        }


                        // --------------------------------------------------
                        // OPCIONES CON RUTA
                        // --------------------------------------------------

                        return (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                className={({ isActive }) =>
                                    `sidebar-link ${
                                        isActive ? "active" : ""
                                    }`
                                }
                                onClick={() => setMobileSidebarOpen(false)}
                                title={
                                    sidebarCollapsed
                                        ? item.label
                                        : ""
                                }
                            >

                                <span className="sidebar-icon">
                                    {item.icon}
                                </span>

                                <span className="sidebar-link-text">
                                    {item.label}
                                </span>

                            </NavLink>
                        );
                    })}


                    {/* ==================================================
                        ADMINISTRACIÓN
                    ================================================== */}

                    <div className="sidebar-section-title sidebar-section-admin">
                        ADMINISTRACIÓN
                    </div>


                    <a
                        href="#"
                        className="sidebar-link"
                        onClick={(event) => {
                            event.preventDefault();
                        }}
                        title={
                            sidebarCollapsed
                                ? "Administración"
                                : ""
                        }
                    >

                        <span className="sidebar-icon">
                            ⚙
                        </span>

                        <span className="sidebar-link-text">
                            Administración
                        </span>

                    </a>

                </nav>


                {/* ==================================================
                    SIDEBAR FOOTER
                ================================================== */}

                <div className="sidebar-footer">

                    <div
                        className="sidebar-status"
                        title={
                            sidebarCollapsed
                                ? "Sistema operativo"
                                : ""
                        }
                    >

                        <span className="status-dot"></span>

                        <span className="sidebar-status-text">
                            Sistema operativo
                        </span>

                    </div>

                </div>

            </aside>


            {/* ==================================================
                CONTENIDO PRINCIPAL
            ================================================== */}

            <div className="main-content-wrapper">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <header className="main-header">

                    {/* --------------------------------------------------
                        IZQUIERDA
                    -------------------------------------------------- */}

                    <div className="main-header-left">

                        <button
                            type="button"
                            className="sidebar-toggle"
                            onClick={() => {
                                setSidebarCollapsed((current) => !current);
                                setMobileSidebarOpen((current) => !current);
                            }}
                            aria-label="Mostrar u ocultar menú"
                        >
                            ☰
                        </button>

                        <span className="main-header-title">
                            Inicio
                        </span>

                    </div>


                    {/* ==================================================
                        DERECHA
                    ================================================== */}

                    <div className="main-header-right">

                        {/* --------------------------------------------------
                            NOTIFICACIONES
                        -------------------------------------------------- */}

                        <button
                            type="button"
                            className="header-action"
                            aria-label="Notificaciones"
                        >

                            🔔

                            <span className="notification-badge">
                                3
                            </span>

                        </button>


                        {/* --------------------------------------------------
                            USUARIO
                        -------------------------------------------------- */}

                        <div className="header-user-container">

                            <button
                                type="button"
                                className="header-user"
                                onClick={() =>
                                    setUserMenuOpen(
                                        (current) => !current
                                    )
                                }
                                aria-expanded={userMenuOpen}
                            >

                                <div className="header-user-avatar">
                                    E
                                </div>

                                <div className="header-user-info">

                                    <strong>
                                        Usuario
                                    </strong>

                                    <small>
                                        Colaborador
                                    </small>

                                </div>

                                <span
                                    className={`header-user-arrow ${
                                        userMenuOpen
                                            ? "open"
                                            : ""
                                    }`}
                                >
                                    ▾
                                </span>

                            </button>


                            {/* ==================================================
                                MENÚ DEL USUARIO
                            ================================================== */}

                            {userMenuOpen && (

                                <div className="user-dropdown">

                                    <div className="user-dropdown-header">

                                        <div className="user-dropdown-avatar">
                                            E
                                        </div>

                                        <div>

                                            <strong>
                                                Usuario
                                            </strong>

                                            <span>
                                                Colaborador
                                            </span>

                                        </div>

                                    </div>


                                    <div className="user-dropdown-divider"></div>


                                    <button
                                        type="button"
                                        className="user-dropdown-item"
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            navigate("/perfil");
                                        }}
                                    >

                                        <span>
                                            ✎
                                        </span>

                                        <span>
                                            Editar perfil
                                        </span>

                                    </button>


                                    <button
                                        type="button"
                                        className="user-dropdown-item user-dropdown-logout"
                                        onClick={handleLogout}
                                    >

                                        <span>
                                            ⇥
                                        </span>

                                        <span>
                                            Cerrar sesión
                                        </span>

                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </header>


                {/* ==================================================
                    CONTENIDO
                ================================================== */}

                <main className="main-content">

                    {children}

                </main>

            </div>

        </div>
    );
};

export default MainLayout;