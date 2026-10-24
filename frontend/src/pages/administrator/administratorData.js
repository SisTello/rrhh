export const initialEmployees = [
    { id: "EMP-001", name: "Valeria Mendoza", code: "EMP-001", email: "valeria.mendoza@tello.example", phone: "+52 55 5555 1204", position: "Analista de Recursos Humanos", department: "Talento Humano", branch: "Casa Matriz", status: "Activo" },
    { id: "EMP-002", name: "Diego Vargas", code: "EMP-002", email: "diego.vargas@tello.example", phone: "+52 55 5555 1312", position: "Especialista de Sistemas", department: "Tecnología", branch: "Casa Matriz", status: "Activo" },
    { id: "EMP-003", name: "Gabriela Rojas", code: "EMP-003", email: "gabriela.rojas@tello.example", phone: "+52 55 5555 1201", position: "Jefa de Talento Humano", department: "Talento Humano", branch: "Casa Matriz", status: "Activo" },
    { id: "EMP-004", name: "Andrés Salvatierra", code: "EMP-004", email: "andres.salvatierra@tello.example", phone: "+52 55 5555 1301", position: "Coordinador de Tecnología", department: "Tecnología", branch: "Casa Matriz", status: "Activo" },
    { id: "EMP-005", name: "Lucía Paredes", code: "EMP-005", email: "lucia.paredes@tello.example", phone: "+52 55 5555 2210", position: "Ejecutiva de Atención al Cliente", department: "Servicio al Cliente", branch: "Sucursal Norte", status: "Activo" },
    { id: "EMP-006", name: "Javier Quiroga", code: "EMP-006", email: "javier.quiroga@tello.example", phone: "+52 55 5555 2201", position: "Jefe de Sucursal", department: "Operaciones", branch: "Sucursal Norte", status: "Activo" },
    { id: "EMP-007", name: "Mateo Castillo", code: "EMP-007", email: "mateo.castillo@tello.example", phone: "+52 55 5555 3105", position: "Analista Financiero", department: "Finanzas", branch: "Sucursal Sur", status: "Activo" },
];

export const initialDepartments = [
    { id: "DEP-01", code: "DEP-01", name: "Talento Humano", description: "Gestión de personas, cultura y desarrollo.", manager: "Gabriela Rojas", branch: "Casa Matriz", status: "Activo" },
    { id: "DEP-02", code: "DEP-02", name: "Tecnología", description: "Plataformas, infraestructura y soporte tecnológico.", manager: "Andrés Salvatierra", branch: "Casa Matriz", status: "Activo" },
    { id: "DEP-03", code: "DEP-03", name: "Finanzas", description: "Planeación y control financiero.", manager: "Sofía Delgado", branch: "Sucursal Sur", status: "Activo" },
    { id: "DEP-04", code: "DEP-04", name: "Operaciones", description: "Coordinación operativa de sucursales.", manager: "Javier Quiroga", branch: "Sucursal Norte", status: "Activo" },
    { id: "DEP-05", code: "DEP-05", name: "Servicio al Cliente", description: "Atención y acompañamiento a clientes.", manager: "Lucía Paredes", branch: "Sucursal Norte", status: "Activo" },
];

export const initialBranches = [
    { id: "SUC-01", code: "SUC-01", name: "Casa Matriz", location: "Ciudad de México", address: "Av. Reforma 120, Centro", status: "Activo" },
    { id: "SUC-02", code: "SUC-02", name: "Sucursal Norte", location: "Monterrey, Nuevo León", address: "Av. Universidad 450, Anáhuac", status: "Activo" },
    { id: "SUC-03", code: "SUC-03", name: "Sucursal Sur", location: "Puebla, Puebla", address: "Blvd. Atlixco 890, Las Ánimas", status: "Activo" },
];

export const initialPositions = [
    { id: "PUE-01", title: "Analista de Recursos Humanos", department: "Talento Humano", description: "Apoya los procesos de personal y atención interna.", status: "Activo" },
    { id: "PUE-02", title: "Especialista de Sistemas", department: "Tecnología", description: "Administra herramientas y servicios tecnológicos.", status: "Activo" },
    { id: "PUE-03", title: "Jefa de Talento Humano", department: "Talento Humano", description: "Coordina las políticas y operaciones de personal.", status: "Activo" },
    { id: "PUE-04", title: "Coordinador de Tecnología", department: "Tecnología", description: "Coordina proyectos y soporte de tecnología.", status: "Activo" },
    { id: "PUE-05", title: "Ejecutiva de Atención al Cliente", department: "Servicio al Cliente", description: "Atiende consultas y solicitudes de clientes.", status: "Activo" },
    { id: "PUE-06", title: "Jefe de Sucursal", department: "Operaciones", description: "Dirige la operación diaria de una sucursal.", status: "Activo" },
    { id: "PUE-07", title: "Analista Financiero", department: "Finanzas", description: "Analiza información financiera y presupuestos.", status: "Activo" },
];

const readOnly = ["acceso"];
const editable = ["acceso", "crear", "editar", "eliminar"];

export const permissionGroups = [
    {
        id: "intranet",
        name: "INTRANET",
        modules: [
            { id: "dashboard", name: "Inicio", route: "/dashboard", actions: readOnly },
            { id: "support", name: "Soporte", route: "/soporte", actions: ["acceso", "crear", "editar", "eliminar", "aprobar"] },
            { id: "supportRequest", name: "Nueva solicitud de soporte", route: "/soporte/nueva-solicitud", actions: ["acceso", "crear"] },
            { id: "news", name: "Noticias", route: "/noticias", actions: [...editable, "exportar"] },
            { id: "announcements", name: "Comunicados", route: null, routeLabel: "Sin ruta implementada", actions: [...editable, "exportar"] },
            { id: "documents", name: "Documentos", route: "/documentos", actions: [...editable, "exportar"] },
            { id: "directory", name: "Directorio", route: "/directorio", actions: ["acceso", "exportar"] },
            { id: "training", name: "Capacitación e Inducción", route: "/capacitacion-induccion", actions: ["acceso", "crear", "editar", "eliminar", "aprobar", "exportar"] },
            { id: "requests", name: "Solicitudes", route: "/solicitudes", actions: ["acceso", "crear", "editar", "eliminar", "aprobar", "exportar"] },
            { id: "calendar", name: "Calendario", route: "/calendario", actions: ["acceso", "crear", "editar", "eliminar", "exportar"] },
            { id: "profile", name: "Perfil", route: "/perfil", actions: ["acceso", "editar"] },
        ],
    },
    {
        id: "administration",
        name: "ADMINISTRACIÓN",
        modules: [
            { id: "talent", name: "Talento Humano", route: "/talento-humano", actions: ["acceso", "crear", "editar", "eliminar", "aprobar", "exportar"] },
            { id: "talentSelection", name: "Selección de talento", route: "/talento-humano/seleccion", actions: ["acceso", "crear", "editar", "eliminar", "aprobar", "exportar"] },
            { id: "talentProcess", name: "Detalle de proceso de talento", route: "/talento-humano/proceso/:processId", routeLabel: "/talento-humano/proceso/:processId", actions: ["acceso", "editar", "aprobar"] },
        ],
    },
    {
        id: "administrator",
        name: "ADMINISTRADOR",
        modules: [
            { id: "adminDashboard", name: "Panel de control", route: "/administrator/dashboard", actions: readOnly },
            { id: "users", name: "Usuarios y cuentas", route: "/administrator/users", actions: [...editable, "exportar"] },
            { id: "employees", name: "Empleados", route: "/administrator/employees", actions: [...editable, "exportar"] },
            { id: "departments", name: "Departamentos", route: "/administrator/departments", actions: [...editable, "exportar"] },
            { id: "branches", name: "Sucursales", route: "/administrator/branches", actions: [...editable, "exportar"] },
            { id: "positions", name: "Cargos y posiciones", route: "/administrator/positions", actions: [...editable, "exportar"] },
            { id: "roles", name: "Roles y permisos", route: "/administrator/roles-permissions", actions: ["acceso", "crear", "editar", "eliminar", "administrar"] },
            { id: "audit", name: "Auditoría y actividad", route: "/administrator/audit", actions: ["acceso", "exportar"] },
            { id: "settings", name: "Configuración general", route: "/administrator/settings", actions: ["acceso", "editar", "administrar"] },
        ],
    },
];

export const permissionModules = permissionGroups.flatMap((group) =>
    group.modules.map((module) => ({ ...module, groupId: group.id, groupName: group.name })),
);

const allPermissions = permissionModules.flatMap((module) =>
    module.actions.map((action) => `${module.id}:${action}`),
);

export const initialRoles = [
    { id: "ROL-01", name: "Super Admin", description: "Rol protegido con privilegios máximos sobre todos los módulos.", status: "Activo", protected: true, permissions: allPermissions },
    { id: "ROL-02", name: "Recursos Humanos", description: "Gestión del personal y estructura organizacional.", status: "Activo", permissions: ["dashboard", "employees", "departments", "branches", "positions", "talent", "talentSelection", "talentProcess"].flatMap((id) => (permissionModules.find((module) => module.id === id)?.actions || []).filter((action) => ["acceso", "crear", "editar"].includes(action)).map((action) => `${id}:${action}`)) },
    { id: "ROL-03", name: "Supervisor", description: "Consulta de información y seguimiento operativo.", status: "Activo", permissions: ["dashboard", "support", "requests", "calendar", "employees", "talent"].map((id) => `${id}:acceso`) },
    { id: "ROL-04", name: "Colaborador", description: "Acceso a funciones generales de la intranet.", status: "Activo", permissions: ["dashboard", "support", "news", "documents", "directory", "training", "requests", "calendar", "profile"].map((id) => `${id}:acceso`) },
];

export const initialUsers = [
    { id: "USR-001", name: "Mariana Flores", email: "mariana.flores@tello.example", employeeId: "", status: "Activo", roleIds: ["ROL-01"], access: "Acceso reciente: hoy, 09:42" },
    { id: "USR-002", name: "Valeria Mendoza", email: "valeria.mendoza@tello.example", employeeId: "EMP-001", status: "Activo", roleIds: ["ROL-02"], access: "Acceso reciente: hoy, 08:15" },
    { id: "USR-003", name: "Diego Vargas", email: "diego.vargas@tello.example", employeeId: "EMP-002", status: "Activo", roleIds: ["ROL-03", "ROL-04"], access: "Acceso reciente: ayer, 17:30" },
    { id: "USR-004", name: "Gabriela Rojas", email: "gabriela.rojas@tello.example", employeeId: "EMP-003", status: "Activo", roleIds: ["ROL-02"], access: "Acceso reciente: ayer, 16:04" },
    { id: "USR-005", name: "Cuenta de capacitación", email: "capacitacion@tello.example", employeeId: "", status: "Inactivo", roleIds: ["ROL-04"], access: "Sin acceso registrado" },
];

export const initialAudit = [
    { id: "AUD-1005", user: "Mariana Flores", action: "Actualizó permisos", resource: "Rol: Recursos Humanos", timestamp: "23/10/2026, 09:42", details: "Se modificaron permisos de consulta del módulo de empleados." },
    { id: "AUD-1004", user: "Gabriela Rojas", action: "Actualizó empleado", resource: "Empleado: Valeria Mendoza", timestamp: "23/10/2026, 08:15", details: "Se actualizó la información de contacto." },
    { id: "AUD-1003", user: "Mariana Flores", action: "Creó una cuenta", resource: "Usuario: Diego Vargas", timestamp: "22/10/2026, 17:30", details: "Se creó una cuenta asociada a un empleado." },
    { id: "AUD-1002", user: "Valeria Mendoza", action: "Consultó información", resource: "Departamento: Tecnología", timestamp: "22/10/2026, 16:04", details: "Se consultó la ficha del departamento." },
    { id: "AUD-1001", user: "Mariana Flores", action: "Actualizó configuración", resource: "Seguridad de cuenta", timestamp: "21/10/2026, 12:22", details: "Se revisó la configuración de sesiones." },
];

export const initialSettings = {
    organization: "TELLO",
    legalName: "TELLO Servicios Integrales, S.A. de C.V.",
    contactEmail: "contacto@tello.example",
    timezone: "America/Mexico_City",
    language: "Español",
    dateFormat: "DD/MM/AAAA",
    sessionMinutes: "30",
    requireStrongPassword: true,
    notifyAccountChanges: true,
};
