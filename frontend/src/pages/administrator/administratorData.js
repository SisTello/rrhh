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

/**
 * @typedef {{ id: string, label: string }} PermissionDefinition
 * @typedef {{ id: string, name: string, route: string, permissions: PermissionDefinition[] }} PermissionModule
 * @typedef {{ id: string, name: string, modules: PermissionModule[] }} PermissionGroup
 */

/** @param {string} id @param {string} label @returns {PermissionDefinition} */
const permission = (id, label) => ({ id, label });

/** @param {string} id @param {string} name @param {string} route @param {PermissionDefinition[]} permissions @returns {PermissionModule} */
const module = (id, name, route, permissions) => ({ id, name, route, permissions });

/** @type {PermissionGroup[]} */
export const permissionGroups = [
    {
        id: "principal",
        name: "PRINCIPAL",
        modules: [
            module("dashboard", "Inicio", "/dashboard", [
                permission("dashboard.view", "Ver / acceder"),
                permission("dashboard.metrics.view", "Ver métricas"),
            ]),
            module("support", "Soporte", "/soporte", [
                permission("support.view", "Ver solicitudes"),
                permission("support.details.view", "Ver detalle"),
                permission("support.requests.create", "Crear solicitudes"),
                permission("support.status.change", "Cambiar estado"),
                permission("support.close", "Cerrar solicitudes"),
                permission("support.delete", "Eliminar solicitudes"),
            ]),
            module("news", "Noticias", "/noticias", [
                permission("news.view", "Ver / acceder"),
                permission("news.create", "Crear"),
                permission("news.edit", "Editar"),
                permission("news.delete", "Eliminar"),
                permission("news.attachments.manage", "Gestionar adjuntos"),
                permission("news.external-links.open", "Abrir enlaces externos"),
            ]),
            module("announcements", "Comunicados", "/comunicados", [
                permission("announcements.view", "Ver / acceder"),
                permission("announcements.create", "Crear"),
                permission("announcements.edit", "Editar"),
                permission("announcements.delete", "Eliminar"),
                permission("announcements.publish", "Publicar / despublicar"),
                permission("announcements.calendar.manage", "Gestionar visibilidad en calendario"),
                permission("announcements.events.manage", "Gestionar datos del evento"),
            ]),
            module("documents", "Documentos", "/documentos", [
                permission("documents.view", "Ver / acceder"),
                permission("documents.preview", "Previsualizar"),
                permission("documents.download", "Descargar archivos"),
            ]),
            module("directory", "Directorio", "/directorio", [
                permission("directory.view", "Ver / acceder"),
            ]),
            module("training", "Capacitación e Inducción", "/capacitacion-induccion", [
                permission("training.view", "Ver contenido"),
                permission("training.create", "Crear"),
                permission("training.edit", "Editar"),
                permission("training.publish", "Publicar / despublicar"),
                permission("training.delete", "Eliminar"),
                permission("training.attachments.manage", "Gestionar archivos adjuntos"),
            ]),
            module("requests", "Solicitudes", "/solicitudes", [
                permission("requests.view", "Ver / acceder"),
                permission("requests.create", "Crear"),
                permission("requests.edit", "Editar"),
                permission("requests.delete", "Eliminar"),
                permission("requests.pdf.download", "Descargar PDF"),
                permission("requests.approve", "Aprobar"),
                permission("requests.reject", "Rechazar"),
            ]),
            module("calendar", "Calendario", "/calendario", [
                permission("calendar.view", "Ver eventos"),
                permission("calendar.events.create", "Crear eventos"),
                permission("calendar.events.edit", "Editar eventos"),
                permission("calendar.events.delete", "Eliminar eventos"),
            ]),
        ],
    },
    {
        id: "administration",
        name: "ADMINISTRACIÓN",
        modules: [
            module("talent", "Talento Humano", "/talento-humano", [
                permission("talent.view", "Ver / acceder"),
                permission("talent.create", "Crear"),
                permission("talent.edit", "Editar"),
                permission("talent.delete", "Eliminar"),
                permission("talent.approve", "Aprobar"),
                permission("talent.reject", "Rechazar"),
            ]),
        ],
    },
    {
        id: "administrator-general",
        name: "ADMINISTRADOR · GENERAL",
        modules: [
            module("adminDashboard", "Panel de control", "/administrator/dashboard", [
                permission("adminDashboard.view", "Ver / acceder"),
                permission("adminDashboard.metrics.view", "Ver métricas"),
            ]),
        ],
    },
    {
        id: "administrator-organization",
        name: "ADMINISTRADOR · ORGANIZACIÓN Y PERSONAL",
        modules: [
            module("users", "Usuarios y cuentas", "/administrator/users", [
                permission("users.view", "Ver / acceder"),
                permission("users.create", "Crear"),
                permission("users.edit", "Editar"),
                permission("users.status.manage", "Activar / desactivar"),
                permission("users.roles.assign", "Asignar roles"),
            ]),
            module("employees", "Empleados", "/administrator/employees", [
                permission("employees.view", "Ver / acceder"),
                permission("employees.create", "Crear"),
                permission("employees.edit", "Editar"),
                permission("employees.delete", "Eliminar"),
            ]),
            module("departments", "Departamentos", "/administrator/departments", [
                permission("departments.view", "Ver / acceder"),
                permission("departments.create", "Crear"),
                permission("departments.edit", "Editar"),
                permission("departments.delete", "Eliminar"),
            ]),
            module("branches", "Sucursales", "/administrator/branches", [
                permission("branches.view", "Ver / acceder"),
                permission("branches.create", "Crear"),
                permission("branches.edit", "Editar"),
                permission("branches.delete", "Eliminar"),
            ]),
            module("positions", "Cargos y posiciones", "/administrator/positions", [
                permission("positions.view", "Ver / acceder"),
                permission("positions.create", "Crear"),
                permission("positions.edit", "Editar"),
                permission("positions.delete", "Eliminar"),
            ]),
        ],
    },
    {
        id: "administrator-security",
        name: "ADMINISTRADOR · SEGURIDAD Y CONTROL",
        modules: [
            module("roles", "Roles y permisos", "/administrator/roles-permissions", [
                permission("roles.view", "Ver roles"),
                permission("roles.create", "Crear roles"),
                permission("roles.edit", "Editar roles"),
                permission("roles.permissions.manage", "Asignar permisos"),
                permission("roles.delete", "Eliminar roles"),
            ]),
            module("audit", "Auditoría y actividad", "/administrator/audit", [
                permission("audit.view", "Ver registros"),
                permission("audit.details.view", "Ver detalles de actividad"),
            ]),
        ],
    },
    {
        id: "administrator-system",
        name: "ADMINISTRADOR · SISTEMA",
        modules: [
            module("settings", "Configuración general", "/administrator/settings", [
                permission("settings.view", "Ver configuración"),
                permission("settings.edit", "Editar configuración"),
                permission("settings.manage", "Gestionar configuración"),
            ]),
        ],
    },
];

export const permissionModules = permissionGroups.flatMap((group) =>
    group.modules.map((item) => ({ ...item, groupId: group.id, groupName: group.name })),
);

const allPermissions = permissionModules.flatMap((item) =>
    item.permissions.map(({ id }) => id),
);
const permissionsFor = (moduleId, actionIds) => actionIds.map((actionId) => `${moduleId}.${actionId}`);

export const initialRoles = [
    { id: "ROL-01", name: "Super Admin", description: "Rol protegido con privilegios máximos sobre todos los módulos.", status: "Activo", protected: true, permissions: allPermissions },
    { id: "ROL-02", name: "Recursos Humanos", description: "Gestión del personal y estructura organizacional.", status: "Activo", permissions: [
        ...permissionsFor("dashboard", ["view"]),
        ...permissionsFor("talent", ["view", "create", "edit", "approve"]),
        ...permissionsFor("employees", ["view", "create", "edit"]),
        ...permissionsFor("departments", ["view", "create", "edit"]),
        ...permissionsFor("branches", ["view"]),
        ...permissionsFor("positions", ["view"]),
        ...permissionsFor("requests", ["view", "approve", "reject"]),
        ...permissionsFor("announcements", ["view", "create", "edit", "publish", "calendar.manage", "events.manage"]),
    ] },
    { id: "ROL-03", name: "Supervisor", description: "Consulta general y seguimiento de su equipo asignado.", status: "Activo", permissions: [
        ...permissionsFor("dashboard", ["view"]),
        ...permissionsFor("support", ["view", "details.view", "status.change", "close"]),
        ...permissionsFor("announcements", ["view"]),
        ...permissionsFor("employees", ["view"]),
        ...permissionsFor("requests", ["view", "approve", "reject"]),
        ...permissionsFor("calendar", ["view"]),
        ...permissionsFor("talent", ["view"]),
    ] },
    { id: "ROL-04", name: "Colaborador", description: "Acceso a funciones generales de la intranet.", status: "Activo", permissions: [
        ...permissionsFor("dashboard", ["view"]),
        ...permissionsFor("support", ["view", "details.view", "requests.create"]),
        ...permissionsFor("news", ["view", "external-links.open"]),
        ...permissionsFor("documents", ["view", "preview", "download"]),
        ...permissionsFor("directory", ["view"]),
        ...permissionsFor("training", ["view"]),
        ...permissionsFor("requests", ["view", "create", "edit", "delete", "pdf.download"]),
        ...permissionsFor("calendar", ["view"]),
    ] },
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
