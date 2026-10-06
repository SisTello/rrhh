import { useEffect, useState } from "react";
import {
    Link,
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";

import "./../styles/_layout.scss";

const MainLayout = ({ children }) => {
    // ==================================================
    // ESTADOS
    // ==================================================

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // ==================================================
    // ROUTER
    // ==================================================

    const location = useLocation();
    const navigate = useNavigate();

    // ==================================================
    // MENÚ PRINCIPAL
    // ==================================================

    const menuItems = [
        {
            label: "Inicio",
            icon: "bi-house",
            to: "/dashboard",
        },
        {
            label: "Soporte",
            icon: "bi-tools",
            to: "/soporte",
        },
        {
            label: "Noticias",
            icon: "bi-newspaper",
            to: "/noticias",
        },
        {
            label: "Comunicados",
            icon: "bi-megaphone",
            to: "#",
        },
        {
            label: "Documentos",
            icon: "bi-folder2-open",
            to: "/documentos",
        },
        {
            label: "Directorio",
            icon: "bi-people",
            to: "#",
        },
        {
            label: "Solicitudes",
            icon: "bi-file-earmark-check",
            to: "/solicitudes",
        },
        {
            label: "Calendario",
            icon: "bi-calendar3",
            to: "/calendario",
        },
    ];

    // ==================================================
    // ALTERNAR SIDEBAR
    // ==================================================

    const handleSidebarToggle = () => {
        const isMobile = window.matchMedia(
            "(max-width: 767.98px)"
        ).matches;

        if (isMobile) {
            setMobileSidebarOpen((current) => !current);
            return;
        }

        setSidebarCollapsed((current) => !current);
    };

    // ==================================================
    // CERRAR SIDEBAR MÓVIL
    // ==================================================

    const closeMobileSidebar = () => {
        setMobileSidebarOpen(false);
    };

    // ==================================================
    // CERRAR MENÚ DE USUARIO
    // ==================================================

    const closeUserMenu = () => {
        setUserMenuOpen(false);
    };

    // ==================================================
    // CERRAR SIDEBAR AL CAMBIAR DE RUTA
    // ==================================================

    useEffect(() => {
        setMobileSidebarOpen(false);
        setUserMenuOpen(false);
    }, [location.pathname]);

    // ==================================================
    // CERRAR SIDEBAR AL PASAR DE MÓVIL A ESCRITORIO
    // ==================================================

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 767.98) {
                setMobileSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // ==================================================
    // CERRAR SESIÓN
    // ==================================================

    const handleLogout = () => {
        setUserMenuOpen(false);

        // Actualmente solamente regresamos al Login.
        // Posteriormente aquí se limpiará:
        // - token
        // - sesión
        // - información del usuario
        // - permisos
        // - etc.

        navigate("/login");
    };

    // ==================================================
    // TÍTULO DEL HEADER
    // ==================================================

    const getPageTitle = () => {
        const currentItem = menuItems.find(
            (item) => item.to === location.pathname
        );

        return currentItem?.label || "Inicio";
    };

    // ==================================================
    // RENDER
    // ==================================================

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
                className={`main-sidebar ${
                    sidebarCollapsed ? "collapsed" : ""
                } ${
                    mobileSidebarOpen ? "mobile-open" : ""
                }`}
            >
                {/* ==================================================
                    BRAND
                ================================================== */}

                <div className="sidebar-brand">
                    <Link
                        to="/dashboard"
                        onClick={closeMobileSidebar}
                    >
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
                    {/* --------------------------------------------------
                        PRINCIPAL
                    -------------------------------------------------- */}

                    <div className="sidebar-section-title">
                        PRINCIPAL
                    </div>

                    {menuItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                                `sidebar-item ${
                                    isActive &&
                                    item.to !== "#"
                                        ? "active"
                                        : ""
                                }`
                            }
                            onClick={(event) => {
                                if (item.to === "#") {
                                    event.preventDefault();
                                    return;
                                }

                                closeMobileSidebar();
                            }}
                        >
                            <i
                                className={`bi ${item.icon}`}
                            ></i>

                            <span>{item.label}</span>
                        </NavLink>
                    ))}

                    {/* --------------------------------------------------
                        ADMINISTRACIÓN
                    -------------------------------------------------- */}

                    <div className="sidebar-section-title sidebar-section-admin">
                        ADMINISTRACIÓN
                    </div>

                    <NavLink
                        to="/talento-humano"
                        className={({ isActive }) =>
                            `sidebar-item ${
                                isActive ? "active" : ""
                            }`
                        }
                        onClick={closeMobileSidebar}
                        title={
                            sidebarCollapsed
                                ? "Talento Humano"
                                : ""
                        }
                    >
                        <i className="bi bi-person-badge"></i>

                        <span>Talento Humano</span>
                    </NavLink>
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
                OVERLAY MÓVIL
            ================================================== */}

            {mobileSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeMobileSidebar}
                ></div>
            )}

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
                            onClick={handleSidebarToggle}
                            aria-label="Abrir o cerrar menú"
                        >
                            <i className="bi bi-list"></i>
                        </button>

                        <span className="main-header-title">
                            {getPageTitle()}
                        </span>
                    </div>

                    {/* --------------------------------------------------
                        DERECHA
                    -------------------------------------------------- */}

                    <div className="main-header-right">
                        {/* ==================================================
                            NOTIFICACIONES
                        ================================================== */}

                        <button
                            type="button"
                            className="header-action"
                            aria-label="Notificaciones"
                            onClick={() => {
                                // Funcionalidad futura
                            }}
                        >
                            <i className="bi bi-bell"></i>

                            <span className="notification-badge">
                                3
                            </span>
                        </button>

                        {/* ==================================================
                            USUARIO
                        ================================================== */}

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
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </button>

                            {/* ==================================================
                                MENÚ DEL USUARIO
                            ================================================== */}

                            {userMenuOpen && (
                                <div className="user-dropdown">
                                    {/* --------------------------------------------------
                                        CABECERA
                                    -------------------------------------------------- */}

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

                                    {/* --------------------------------------------------
                                        EDITAR PERFIL
                                    -------------------------------------------------- */}

                                    <button
                                        type="button"
                                        className="user-dropdown-item"
                                        onClick={() => {
                                            closeUserMenu();
                                            navigate("/perfil");
                                        }}
                                    >
                                        <i className="bi bi-pencil-square"></i>

                                        <span>
                                            Editar perfil
                                        </span>
                                    </button>

                                    {/* --------------------------------------------------
                                        CERRAR SESIÓN
                                    -------------------------------------------------- */}

                                    <button
                                        type="button"
                                        className="user-dropdown-item user-dropdown-logout"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right"></i>

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