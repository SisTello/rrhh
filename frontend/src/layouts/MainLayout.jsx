import { useEffect, useRef, useState } from "react";
import {
    Link,
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";

import "./../styles/_layout.scss";

const routeTitles = {
    "/": "Inicio",
    "/login": "Iniciar sesión",
    "/dashboard": "Inicio",
    "/soporte": "Soporte",
    "/soporte/nueva-solicitud": "Nueva solicitud",
    "/perfil": "Perfil",
    "/noticias": "Noticias",
    "/comunicados": "Comunicados",
    "/documentos": "Documentos",
    "/directorio": "Directorio",
    "/capacitacion-induccion": "Capacitación e Inducción",
    "/solicitudes": "Solicitudes",
    "/calendario": "Calendario",
    "/talento-humano": "Talento Humano",
    "/administrator/dashboard": "Panel de control",
    "/administrator/users": "Usuarios y cuentas",
    "/administrator/employees": "Empleados",
    "/administrator/departments": "Departamentos",
    "/administrator/branches": "Sucursales",
    "/administrator/positions": "Cargos y posiciones",
    "/administrator/roles-permissions": "Roles y permisos",
    "/administrator/audit": "Auditoría y actividad",
    "/administrator/settings": "Configuración general",
};

const administratorGroups = [
    {
        title: "GENERAL",
        items: [
            { label: "Panel de control", icon: "bi-speedometer2", to: "/administrator/dashboard" },
        ],
    },
    {
        title: "ORGANIZACIÓN Y PERSONAL",
        items: [
            { label: "Usuarios y cuentas", icon: "bi-person-gear", to: "/administrator/users" },
            { label: "Empleados", icon: "bi-person-badge", to: "/administrator/employees" },
            { label: "Departamentos", icon: "bi-diagram-3", to: "/administrator/departments" },
            { label: "Sucursales", icon: "bi-building", to: "/administrator/branches" },
            { label: "Cargos y posiciones", icon: "bi-briefcase", to: "/administrator/positions" },
        ],
    },
    {
        title: "SEGURIDAD Y CONTROL",
        items: [
            { label: "Roles y permisos", icon: "bi-shield-lock", to: "/administrator/roles-permissions" },
            { label: "Auditoría y actividad", icon: "bi-journal-text", to: "/administrator/audit" },
        ],
    },
    {
        title: "SISTEMA",
        items: [
            { label: "Configuración general", icon: "bi-gear", to: "/administrator/settings" },
        ],
    },
];

const MainLayout = ({ children }) => {
    // ==================================================
    // ESTADOS
    // ==================================================

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [userMenuRoute, setUserMenuRoute] = useState(null);
    const [notificationsRoute, setNotificationsRoute] = useState(null);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Nuevo comunicado",
            message: "Se publicó una actualización para el personal.",
            date: "Hoy, 09:30",
            read: false,
        },
        {
            id: 2,
            title: "Solicitud actualizada",
            message: "Tu solicitud de permiso está en revisión.",
            date: "Ayer, 16:15",
            read: false,
        },
        {
            id: 3,
            title: "Documento disponible",
            message: "Se agregó un nuevo documento a la biblioteca.",
            date: "22 oct. 2026, 11:00",
            read: true,
        },
    ]);
    const [administratorOpen, setAdministratorOpen] = useState(null);
    const userMenuRef = useRef(null);
    const notificationsRef = useRef(null);

    // ==================================================
    // ROUTER
    // ==================================================

    const location = useLocation();
    const navigate = useNavigate();
    const isAdministratorRoute = location.pathname.startsWith("/administrator/");
    const administratorExpanded = administratorOpen ?? isAdministratorRoute;
    const userMenuOpen = userMenuRoute === location.pathname;
    const notificationsOpen = notificationsRoute === location.pathname;
    const unreadNotifications = notifications.filter((notification) => !notification.read).length;

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
            to: "/comunicados",
        },
        {
            label: "Documentos",
            icon: "bi-folder2-open",
            to: "/documentos",
        },
        {
            label: "Directorio",
            icon: "bi-people",
            to: "/directorio",
        },
        {
            label: "Capacitación e Inducción",
            icon: "bi-mortarboard",
            to: "/capacitacion-induccion",
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
        setUserMenuRoute(null);
    };

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

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!userMenuRef.current?.contains(event.target)) {
                setUserMenuRoute(null);
            }
            if (!notificationsRef.current?.contains(event.target)) {
                setNotificationsRoute(null);
            }
        };
        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, []);

    // ==================================================
    // CERRAR SESIÓN
    // ==================================================

    const handleLogout = () => {
        setUserMenuRoute(null);

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
        return routeTitles[location.pathname] || "Inicio";
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

                    {menuItems.map((item) => {
                        if (item.disabled || !item.to) {
                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    className="sidebar-item disabled"
                                    disabled
                                    aria-disabled="true"
                                    title={item.unavailableText || "Próximamente"}
                                    onClick={closeMobileSidebar}
                                >
                                    <i className={`bi ${item.icon}`}></i>
                                    <span>{item.label}</span>
                                </button>
                            );
                        }

                        return (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                className={({ isActive }) =>
                                    `sidebar-item ${
                                        isActive ? "active" : ""
                                    }`
                                }
                                onClick={closeMobileSidebar}
                            >
                                <i className={`bi ${item.icon}`}></i>
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}

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

                    <button
                        type="button"
                        className={`sidebar-item sidebar-admin-button ${
                            isAdministratorRoute ? "active" : ""
                        }`}
                        onClick={() =>
                            setAdministratorOpen((current) => !(current ?? isAdministratorRoute))
                        }
                        aria-expanded={administratorExpanded}
                        aria-controls="administrator-navigation"
                        title={sidebarCollapsed ? "ADMINISTRADOR" : ""}
                    >
                        <i className="bi bi-shield-lock"></i>
                        <span>ADMINISTRADOR</span>
                        <i
                            className={`bi bi-chevron-down sidebar-admin-chevron ${
                                administratorExpanded ? "open" : ""
                            }`}
                            aria-hidden="true"
                        ></i>
                    </button>

                    <div
                        id="administrator-navigation"
                        className={`sidebar-admin-links ${
                            administratorExpanded ? "open" : ""
                        }`}
                        hidden={!administratorExpanded}
                    >
                        {administratorGroups.map((group) => (
                            <div className="sidebar-admin-group" key={group.title}>
                                <div className="sidebar-admin-group-title">
                                    {group.title}
                                </div>
                                {group.items.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end
                                        className={({ isActive }) =>
                                            `sidebar-item sidebar-admin-link ${
                                                isActive ? "active" : ""
                                            }`
                                        }
                                        onClick={() => {
                                            setAdministratorOpen(true);
                                            closeMobileSidebar();
                                        }}
                                        title={sidebarCollapsed ? item.label : ""}
                                    >
                                        <i className={`bi ${item.icon}`}></i>
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        ))}
                    </div>
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

                        <div className="header-notifications" ref={notificationsRef}>
                            <button
                                type="button"
                                className="header-action"
                                aria-label="Notificaciones"
                                aria-expanded={notificationsOpen}
                                aria-haspopup="true"
                                onClick={() => setNotificationsRoute(notificationsOpen ? null : location.pathname)}
                            >
                                <i className={`bi ${notificationsOpen ? "bi-bell-fill" : "bi-bell"}`} aria-hidden="true"></i>
                                {unreadNotifications > 0 && <span className="notification-badge">{unreadNotifications}</span>}
                            </button>
                            {notificationsOpen && (
                                <section className="notification-dropdown" aria-label="Notificaciones recientes">
                                    <header>
                                        <strong>Notificaciones</strong>
                                        {unreadNotifications > 0 && (
                                            <button type="button" onClick={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))}>
                                                Marcar todas como leídas
                                            </button>
                                        )}
                                    </header>
                                    {notifications.length ? notifications.map((notification) => (
                                        <button
                                            className={`notification-item ${notification.read ? "is-read" : "is-unread"}`}
                                            key={notification.id}
                                            type="button"
                                            onClick={() => setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, read: true } : item))}
                                        >
                                            <span className="notification-item__dot" aria-hidden="true"></span>
                                            <span className="notification-item__content">
                                                <strong>{notification.title}</strong>
                                                <span>{notification.message}</span>
                                                <small>{notification.date} · {notification.read ? "Leída" : "No leída"}</small>
                                            </span>
                                        </button>
                                    )) : (
                                        <p className="notification-empty">No tienes notificaciones por el momento.</p>
                                    )}
                                    <p className="notification-demo-note">Notificaciones de demostración; no están sincronizadas.</p>
                                </section>
                            )}
                        </div>

                        {/* ==================================================
                            USUARIO
                        ================================================== */}

                        <div className="header-user-container" ref={userMenuRef}>
                            <button
                                type="button"
                                className="header-user"
                                onClick={() => setUserMenuRoute(userMenuOpen ? null : location.pathname)}
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
                                    <i className="bi bi-chevron-down" aria-hidden="true"></i>
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