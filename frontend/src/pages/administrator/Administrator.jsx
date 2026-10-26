import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
    initialAudit,
    initialBranches,
    initialDepartments,
    initialEmployees,
    initialPositions,
    initialRoles,
    initialSettings,
    initialUsers,
    permissionGroups,
    permissionModules,
} from "./administratorData";
import "./administrator.scss";

const pageDefinitions = {
    "/administrator/dashboard": { title: "Panel de control", group: "GENERAL", icon: "bi-speedometer2" },
    "/administrator/users": { title: "Usuarios y cuentas", group: "ORGANIZACIÓN Y PERSONAL", icon: "bi-person-gear", entity: "users" },
    "/administrator/employees": { title: "Empleados", group: "ORGANIZACIÓN Y PERSONAL", icon: "bi-person-badge", entity: "employees" },
    "/administrator/departments": { title: "Departamentos", group: "ORGANIZACIÓN Y PERSONAL", icon: "bi-diagram-3", entity: "departments" },
    "/administrator/branches": { title: "Sucursales", group: "ORGANIZACIÓN Y PERSONAL", icon: "bi-building", entity: "branches" },
    "/administrator/positions": { title: "Cargos y posiciones", group: "ORGANIZACIÓN Y PERSONAL", icon: "bi-briefcase", entity: "positions" },
    "/administrator/roles-permissions": { title: "Roles y permisos", group: "SEGURIDAD Y CONTROL", icon: "bi-shield-lock" },
    "/administrator/audit": { title: "Auditoría y actividad", group: "SEGURIDAD Y CONTROL", icon: "bi-journal-text", entity: "audit" },
    "/administrator/settings": { title: "Configuración general", group: "SISTEMA", icon: "bi-gear" },
};

const createEntityDefinitions = (data) => ({
    users: {
        singular: "usuario",
        data: data.users,
        fields: [
            { key: "name", label: "Nombre completo", required: true },
            { key: "email", label: "Correo electrónico", type: "email", required: true },
            { key: "employeeId", label: "Empleado asociado", type: "select", options: [{ value: "", label: "Sin asociación" }, ...data.employees.map((employee) => ({ value: employee.id, label: `${employee.name} (${employee.code})` }))] },
            { key: "roleIds", label: "Roles asignados", type: "multiselect", options: data.roles.filter((role) => !role.protected && role.status === "Activo").map((role) => ({ value: role.id, label: role.name })) },
            { key: "status", label: "Estado", type: "select", options: statusOptions },
        ],
        columns: [["name", "Nombre"], ["email", "Correo electrónico"], ["employeeId", "Empleado asociado"], ["roleIds", "Roles"], ["status", "Estado"]],
    },
    employees: {
        singular: "empleado",
        data: data.employees,
        fields: [
            { key: "name", label: "Nombre completo", required: true },
            { key: "code", label: "Código de empleado", required: true },
            { key: "email", label: "Correo electrónico", type: "email", required: true },
            { key: "phone", label: "Teléfono", type: "tel" },
            { key: "position", label: "Cargo", type: "select", options: data.positions.map((position) => ({ value: position.title, label: position.title })) },
            { key: "department", label: "Departamento", type: "select", options: data.departments.map((department) => ({ value: department.name, label: department.name })) },
            { key: "branch", label: "Sucursal", type: "select", options: data.branches.map((branch) => ({ value: branch.name, label: branch.name })) },
            { key: "status", label: "Estado laboral", type: "select", options: statusOptions },
        ],
        columns: [["code", "Código"], ["name", "Nombre"], ["position", "Cargo"], ["department", "Departamento"], ["branch", "Sucursal"], ["status", "Estado"]],
    },
    departments: {
        singular: "departamento",
        data: data.departments,
        fields: [
            { key: "code", label: "Identificador", required: true },
            { key: "name", label: "Nombre", required: true },
            { key: "description", label: "Descripción", type: "textarea" },
            { key: "manager", label: "Responsable", type: "select", options: data.employees.map((employee) => ({ value: employee.name, label: employee.name })) },
            { key: "branch", label: "Sucursal", type: "select", options: data.branches.map((branch) => ({ value: branch.name, label: branch.name })) },
            { key: "status", label: "Estado", type: "select", options: statusOptions },
        ],
        columns: [["code", "Identificador"], ["name", "Departamento"], ["manager", "Responsable"], ["branch", "Sucursal"], ["status", "Estado"]],
    },
    branches: {
        singular: "sucursal",
        data: data.branches,
        fields: [
            { key: "code", label: "Identificador", required: true },
            { key: "name", label: "Nombre", required: true },
            { key: "location", label: "Ciudad y estado", required: true },
            { key: "address", label: "Dirección", type: "textarea" },
            { key: "status", label: "Estado", type: "select", options: statusOptions },
        ],
        columns: [["code", "Identificador"], ["name", "Sucursal"], ["location", "Ubicación"], ["address", "Dirección"], ["status", "Estado"]],
    },
    positions: {
        singular: "cargo",
        data: data.positions,
        fields: [
            { key: "title", label: "Nombre del cargo", required: true },
            { key: "department", label: "Departamento", type: "select", options: data.departments.map((department) => ({ value: department.name, label: department.name })) },
            { key: "description", label: "Descripción", type: "textarea" },
            { key: "status", label: "Estado", type: "select", options: statusOptions },
        ],
        columns: [["title", "Cargo"], ["department", "Departamento"], ["description", "Descripción"], ["status", "Estado"]],
    },
    audit: {
        singular: "registro",
        data: data.audit,
        readOnly: true,
        columns: [["timestamp", "Fecha y hora"], ["user", "Usuario"], ["action", "Acción"], ["resource", "Recurso"]],
    },
    roles: {
        singular: "rol",
        data: data.roles,
        fields: [
            { key: "name", label: "Nombre del rol", required: true },
            { key: "description", label: "Descripción", type: "textarea" },
        ],
        columns: [["name", "Rol"], ["description", "Descripción"]],
    },
});

const statusOptions = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
];

const makeId = (prefix, rows) => {
    const highestId = rows.reduce((highest, row) => {
        const number = Number(row.id.match(/(\d+)$/)?.[1] || 0);
        return Math.max(highest, number);
    }, 0);
    return `${prefix}-${String(highestId + 1).padStart(3, "0")}`;
};

const Administrator = () => {
    const { pathname } = useLocation();
    const page = pageDefinitions[pathname] || pageDefinitions["/administrator/dashboard"];
    const [users, setUsers] = useState(initialUsers);
    const [employees, setEmployees] = useState(initialEmployees);
    const [departments, setDepartments] = useState(initialDepartments);
    const [branches, setBranches] = useState(initialBranches);
    const [positions, setPositions] = useState(initialPositions);
    const [roles, setRoles] = useState(initialRoles);
    const [audit, setAudit] = useState(initialAudit);
    const [settings, setSettings] = useState(initialSettings);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [dialog, setDialog] = useState(null);
    const [form, setForm] = useState({});
    const [formError, setFormError] = useState("");
    const [toast, setToast] = useState("");
    const [roleId, setRoleId] = useState(initialRoles[0].id);
    const [pendingRoleId, setPendingRoleId] = useState("");
    const [permissionDraft, setPermissionDraft] = useState(initialRoles[0].permissions);
    const [permissionSearch, setPermissionSearch] = useState("");
    const [expandedPermissionGroups, setExpandedPermissionGroups] = useState(() =>
        Object.fromEntries(permissionGroups.map((group) => [group.id, true])),
    );
    const [settingsSaved, setSettingsSaved] = useState(false);
    const [auditQuery, setAuditQuery] = useState("");
    const [auditAction, setAuditAction] = useState("");

    const data = useMemo(
        () => ({ users, employees, departments, branches, positions, roles, audit }),
        [users, employees, departments, branches, positions, roles, audit],
    );
    const definitions = useMemo(() => createEntityDefinitions(data), [data]);
    const entity = page.entity ? definitions[page.entity] : null;
    const rows = entity ? entity.data : data.users;
    const pageSize = 5;

    useEffect(() => {
        const timer = window.setTimeout(() => setLoading(false), 180);
        return () => window.clearTimeout(timer);
    }, [pathname]);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = window.setTimeout(() => setToast(""), 2800);
        return () => window.clearTimeout(timer);
    }, [toast]);

    const recordAudit = (action, resource) => {
        const timestamp = new Intl.DateTimeFormat("es-MX", {
            dateStyle: "short",
            timeStyle: "short",
        }).format(new Date());
        setAudit((current) => [
            {
                id: makeId("AUD", current),
                user: "Mariana Flores",
                action,
                resource,
                timestamp,
                details: `${action}: ${resource}. Cambio realizado en la demostración local.`,
            },
            ...current,
        ]);
    };

    const filteredRows = useMemo(() => {
        const query = search.trim().toLocaleLowerCase("es");
        return rows.filter((row) => {
            const textMatches =
                !query || Object.values(row).flat().join(" ").toLocaleLowerCase("es").includes(query);
            const statusMatches = !statusFilter || row.status === statusFilter;
            const auditMatches =
                page.entity !== "audit" ||
                (!auditQuery || `${row.user} ${row.resource} ${row.details}`.toLocaleLowerCase("es").includes(auditQuery.toLocaleLowerCase("es"))) &&
                (!auditAction || row.action === auditAction);
            return textMatches && statusMatches && auditMatches;
        });
    }, [rows, search, statusFilter, page.entity, auditQuery, auditAction]);

    const visibleRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
    const selectedRole = roles.find((role) => role.id === roleId) || roles[0];
    const rolePermissionsChanged = selectedRole && permissionDraft.length !== selectedRole.permissions.length ||
        selectedRole && permissionDraft.some((permission) => !selectedRole.permissions.includes(permission));

    const getEffectivePermissions = (user) => {
        const activeRoles = user.roleIds
            .map((id) => roles.find((role) => role.id === id))
            .filter((role) => role?.status === "Activo");
        return permissionModules.map((module) => ({
            ...module,
            permissions: module.permissions.filter(({ id }) =>
                activeRoles.some((role) => role.permissions.includes(id)),
            ),
            roleNames: activeRoles
                .filter((role) => module.permissions.some(({ id }) => role.permissions.includes(id)))
                .map((role) => role.name),
        })).filter((module) => module.permissions.length);
    };

    const savePermissionChanges = () => {
        setRoles((current) => current.map((role) =>
            role.id === roleId ? { ...role, permissions: permissionDraft } : role,
        ));
        recordAudit("Actualizó permisos", `Rol: ${selectedRole?.name}`);
        setDialog(null);
        setToast("Los permisos del rol se guardaron localmente.");
    };

    const requestPermissionSave = () => {
        if (permissionDraft.length < (selectedRole?.permissions.length || 0) ||
            selectedRole?.permissions.some((permission) => !permissionDraft.includes(permission))) {
            setDialog({ mode: "permission-removal", row: selectedRole });
            return;
        }
        savePermissionChanges();
    };

    const openCreate = () => {
        setForm(Object.fromEntries((entity.fields || []).map((field) => [field.key, field.type === "multiselect" ? [] : ""])));
        setFormError("");
        setDialog({ mode: "create" });
    };

    const openEdit = (row) => {
        setForm({ ...row, roleIds: row.roleIds || [] });
        setFormError("");
        setDialog({ mode: "edit", row });
    };

    const openDetail = (row) => setDialog({ mode: "detail", row });
    const openRoleForm = (mode, role) => {
        setForm(role
            ? { name: role.name, description: role.description, status: role.status }
            : { name: "", description: "", status: "Activo" });
        setFormError("");
        setDialog({ mode, row: role });
    };

    const selectRole = (role) => {
        if (role.id === roleId) return;
        const hasUnsavedChanges = selectedRole && (
            permissionDraft.length !== selectedRole.permissions.length ||
            permissionDraft.some((permission) => !selectedRole.permissions.includes(permission))
        );
        if (hasUnsavedChanges) {
            setPendingRoleId(role.id);
            setDialog({ mode: "discard-permissions", row: role });
            return;
        }
        setRoleId(role.id);
        setPermissionDraft([...role.permissions]);
    };

    const saveRoleDetails = (event) => {
        event.preventDefault();
        const duplicate = roles.some((role) =>
            role.id !== dialog.row?.id &&
            role.name.trim().toLocaleLowerCase("es") === form.name.trim().toLocaleLowerCase("es"),
        );
        if (duplicate) {
            setFormError("Ya existe un rol con ese nombre.");
            return;
        }
        if (dialog.mode === "role-create") {
            const newRole = { ...form, id: makeId("ROL", roles), status: "Activo", permissions: [], protected: false };
            setRoles((current) => [...current, newRole]);
            setRoleId(newRole.id);
            setPermissionDraft([]);
            recordAudit("Creó un rol", `Rol: ${newRole.name}`);
            setToast("El rol se creó correctamente.");
        } else {
            setRoles((current) => current.map((role) =>
                role.id === dialog.row.id ? { ...role, ...form } : role,
            ));
            recordAudit("Actualizó un rol", `Rol: ${form.name}`);
            setToast("El rol se actualizó correctamente.");
        }
        setDialog(null);
    };

    const handleDelete = () => {
        const setters = {
            users: setUsers,
            employees: setEmployees,
            departments: setDepartments,
            branches: setBranches,
            positions: setPositions,
        };
        setters[page.entity]((current) => current.filter((item) => item.id !== dialog.row.id));
        recordAudit("Eliminó un registro", `${entity.singular}: ${dialog.row.name || dialog.row.title || dialog.row.code}`);
        setDialog(null);
        setToast("El registro se eliminó correctamente.");
    };

    const handleRoleDelete = () => {
        const remainingRoles = roles.filter((role) => role.id !== dialog.row.id);
        setRoles(remainingRoles);
        if (roleId === dialog.row.id) {
            const nextRole = remainingRoles[0];
            setRoleId(nextRole.id);
            setPermissionDraft([...nextRole.permissions]);
        }
        recordAudit("Eliminó un rol", `Rol: ${dialog.row.name}`);
        setDialog(null);
        setToast("El rol se eliminó correctamente.");
    };

    const saveEntity = (event) => {
        event.preventDefault();
        const duplicateField = entity.fields.find((field) => {
            if (!["email", "code", "name", "title"].includes(field.key)) return false;
            return entity.data.some((row) =>
                row.id !== dialog.row?.id &&
                row[field.key]?.trim().toLocaleLowerCase("es") === form[field.key]?.trim().toLocaleLowerCase("es"),
            );
        });
        if (duplicateField) {
            setFormError(`Ya existe un registro con ese valor en «${duplicateField.label}».`);
            return;
        }
        const setterByEntity = {
            users: setUsers,
            employees: setEmployees,
            departments: setDepartments,
            branches: setBranches,
            positions: setPositions,
            roles: setRoles,
        };
        const wasEdit = dialog.mode === "edit";
        const newRow = {
            ...form,
            id: wasEdit ? dialog.row.id : makeId(page.entity === "users" ? "USR" : page.entity === "employees" ? "EMP" : page.entity === "departments" ? "DEP" : page.entity === "branches" ? "SUC" : page.entity === "positions" ? "PUE" : "ROL", entity.data),
            ...(page.entity === "users" ? { access: wasEdit ? dialog.row.access : "Sin acceso registrado" } : {}),
        };
        setterByEntity[page.entity]((current) =>
            wasEdit
                ? current.map((row) => row.id === dialog.row.id ? newRow : row)
                : [newRow, ...current],
        );
        recordAudit(wasEdit ? "Actualizó un registro" : "Creó un registro", `${entity.singular}: ${form.name || form.title || form.code}`);
        setDialog(null);
        setToast(`El ${entity.singular} se ${wasEdit ? "actualizó" : "creó"} correctamente.`);
    };

    const displayValue = (key, value) => {
        if (key === "employeeId") return employees.find((employee) => employee.id === value)?.name || "Sin asociación";
        if (key === "roleIds") return (value || []).map((id) => roles.find((role) => role.id === id)?.name).filter(Boolean).join(", ") || "Sin roles";
        return value || "—";
    };

    const renderField = (field) => (
        <label className="admin-field" key={field.key}>
            <span>{field.label}{field.required && <b aria-hidden="true"> *</b>}</span>
            {field.type === "textarea" ? (
                <textarea
                    rows="3"
                    value={form[field.key] || ""}
                    required={field.required}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                />
            ) : field.type === "multiselect" ? (
                <div className="admin-role-checkboxes">
                    {data.roles.map((role) => {
                        const checked = (form[field.key] || []).includes(role.id);
                        const protectedRole = Boolean(role.protected);
                        const unavailable = protectedRole || (role.status !== "Activo" && !checked);
                        return (
                            <label className={`admin-role-checkbox ${protectedRole ? "is-protected" : ""}`} key={role.id}>
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    disabled={unavailable}
                                    onChange={() => setForm((current) => ({
                                        ...current,
                                        [field.key]: current[field.key].includes(role.id)
                                            ? current[field.key].filter((id) => id !== role.id)
                                            : [...current[field.key], role.id],
                                    }))}
                                />
                                <span><strong>{role.name}{protectedRole ? " · protegido" : role.status === "Inactivo" ? " · inactivo" : ""}</strong><small>{role.description}</small></span>
                            </label>
                        );
                    })}
                    <p className="admin-panel-note">El rol Super Admin protegido no puede asignarse ni retirarse desde este formulario. Los roles inactivos no se pueden asignar.</p>
                </div>
            ) : field.type === "select" ? (
                <select
                    value={form[field.key] ?? ""}
                    required={field.required}
                    disabled={page.entity === "users" && field.key === "status" && (form.roleIds || []).some((id) => roles.find((role) => role.id === id)?.protected)}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                >
                    {field.options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            ) : (
                <input
                    type={field.type || "text"}
                    value={form[field.key] || ""}
                    required={field.required}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                />
            )}
            {page.entity === "users" && field.key === "status" && (form.roleIds || []).some((id) => roles.find((role) => role.id === id)?.protected) && (
                <small className="admin-protected-field-note">La cuenta vinculada a Super Admin no se puede desactivar desde esta demostración.</small>
            )}
        </label>
    );

    const renderCrudPage = () => (
        <>
            <section className="admin-toolbar" aria-label="Buscar y filtrar">
                <label className="admin-search">
                    <i className="bi bi-search" aria-hidden="true"></i>
                    <input value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} placeholder={`Buscar ${entity.singular}...`} aria-label={`Buscar ${entity.singular}`} />
                </label>
                {page.entity !== "audit" && <label className="admin-filter">
                    <span>Estado</span>
                    <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }}>
                        <option value="">Todos</option>
                        {statusOptions.map((option) => <option key={option.value}>{option.value}</option>)}
                    </select>
                </label>}
                {!entity.readOnly && <button type="button" className="admin-button admin-button--primary" onClick={openCreate}><i className="bi bi-plus-lg"></i>Agregar {entity.singular}</button>}
            </section>
            {page.entity === "audit" && (
                <section className="admin-toolbar admin-toolbar--audit">
                    <label className="admin-search">
                        <i className="bi bi-search" aria-hidden="true"></i>
                        <input value={auditQuery} onChange={(event) => { setAuditQuery(event.target.value); setCurrentPage(1); }} placeholder="Buscar usuario, recurso o detalle..." aria-label="Buscar en auditoría" />
                    </label>
                    <label className="admin-filter"><span>Acción</span>
                        <select value={auditAction} onChange={(event) => { setAuditAction(event.target.value); setCurrentPage(1); }}>
                            <option value="">Todas</option>
                            {[...new Set(audit.map((row) => row.action))].map((action) => <option key={action}>{action}</option>)}
                        </select>
                    </label>
                </section>
            )}
            {loading ? (
                <div className="admin-state" role="status"><span className="spinner-border spinner-border-sm"></span>Cargando información...</div>
            ) : filteredRows.length === 0 ? (
                <div className="admin-state"><i className="bi bi-inbox"></i><strong>No hay resultados</strong><span>Ajusta la búsqueda o los filtros para ver registros.</span></div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr>{entity.columns.map(([, label]) => <th key={label}>{label}</th>)}<th>Acciones</th></tr></thead>
                        <tbody>{visibleRows.map((row) => (
                            <tr key={row.id}>
                                {entity.columns.map(([key]) => (
                                    <td key={key}>
                                        {key === "status" ? <span className={`admin-badge ${row.status === "Activo" ? "admin-badge--success" : "admin-badge--muted"}`}>{row.status}</span> : key === "description" ? <span className="admin-cell-description">{displayValue(key, row[key])}</span> : displayValue(key, row[key])}
                                    </td>
                                ))}
                                <td><div className="admin-row-actions">
                                    <button type="button" onClick={() => openDetail(row)} aria-label={`Ver detalle de ${row.name || row.title || row.code}`} title="Ver detalle"><i className="bi bi-eye"></i></button>
                                    {!entity.readOnly && <button type="button" onClick={() => openEdit(row)} aria-label={`Editar ${row.name || row.title || row.code}`} title="Editar"><i className="bi bi-pencil"></i></button>}
                                    {!entity.readOnly && <button type="button" className="is-danger" disabled={page.entity === "users" && row.roleIds.some((id) => roles.find((role) => role.id === id)?.protected)} onClick={() => setDialog({ mode: "delete", row })} aria-label={`Eliminar ${row.name || row.title || row.code}`} title={page.entity === "users" && row.roleIds.some((id) => roles.find((role) => role.id === id)?.protected) ? "No se puede eliminar la cuenta protegida de Super Admin" : "Eliminar"}><i className="bi bi-trash"></i></button>}
                                </div></td>
                            </tr>
                        ))}</tbody>
                    </table>
                    <footer className="admin-pagination">
                        <span>Mostrando {Math.min((currentPage - 1) * pageSize + 1, filteredRows.length)}–{Math.min(currentPage * pageSize, filteredRows.length)} de {filteredRows.length}</span>
                        <div><button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((current) => current - 1)}>Anterior</button><span>Página {currentPage} de {pageCount}</span><button type="button" disabled={currentPage >= pageCount} onClick={() => setCurrentPage((current) => current + 1)}>Siguiente</button></div>
                    </footer>
                </div>
            )}
        </>
    );

    const renderDashboard = () => (
        <>
            <section className="admin-welcome">
                <div><h2>Resumen de administración</h2><p>Consulta el estado general de las cuentas y la estructura organizacional.</p></div>
                <span><i className="bi bi-shield-check"></i> Vista de demostración</span>
            </section>
            <section className="admin-stat-grid" aria-label="Resumen de indicadores">
                {[
                    ["Usuarios registrados", users.length, "bi-people", "/administrator/users"],
                    ["Empleados", employees.length, "bi-person-badge", "/administrator/employees"],
                    ["Departamentos", departments.length, "bi-diagram-3", "/administrator/departments"],
                    ["Sucursales", branches.length, "bi-building", "/administrator/branches"],
                ].map(([label, value, icon, path]) => (
                    <Link className="admin-stat-card" to={path} key={label}>
                        <span className="admin-stat-icon"><i className={`bi ${icon}`}></i></span><span>{label}</span><strong>{value}</strong>
                    </Link>
                ))}
            </section>
            <section className="admin-dashboard-grid">
                <div className="admin-panel"><div className="admin-panel__heading"><h2>Accesos recientes</h2><span>{audit.length} actividades</span></div>
                    <ul className="admin-activity-list">{audit.slice(0, 4).map((entry) => <li key={entry.id}><span className="admin-activity-icon"><i className="bi bi-clock-history"></i></span><div><strong>{entry.action}</strong><span>{entry.user} · {entry.resource}</span></div><time>{entry.timestamp}</time></li>)}</ul>
                </div>
                <div className="admin-panel"><div className="admin-panel__heading"><h2>Cuentas por estado</h2></div>
                    <div className="admin-status-summary"><div><span className="admin-badge admin-badge--success">Activas</span><strong>{users.filter((user) => user.status === "Activo").length}</strong></div><div><span className="admin-badge admin-badge--muted">Inactivas</span><strong>{users.filter((user) => user.status === "Inactivo").length}</strong></div></div>
                    <p className="admin-panel-note">Los indicadores utilizan únicamente datos de demostración locales.</p>
                </div>
            </section>
        </>
    );

    const renderRoles = () => {
        const query = permissionSearch.trim().toLocaleLowerCase("es");
        const selectedPermissionCount = permissionDraft.filter((permissionId) =>
            permissionModules.some((item) => item.permissions.some((permission) => permission.id === permissionId)),
        ).length;
        const allPermissionIds = permissionModules.flatMap((item) => item.permissions.map(({ id }) => id));
        const permissionsDisabled = selectedRole?.protected || selectedRole?.status !== "Activo";

        return (
            <div className="admin-roles-layout">
                <section className="admin-panel admin-role-list">
                    <div className="admin-panel__heading">
                        <div><h2>Roles definidos</h2><span>{roles.length} roles · demostración local</span></div>
                        <button type="button" className="admin-button admin-button--primary" onClick={() => openRoleForm("role-create")}><i className="bi bi-plus-lg"></i>Crear rol</button>
                    </div>
                    {roles.map((role) => {
                        const moduleCount = permissionModules.filter((item) =>
                            item.permissions.some(({ id }) => role.permissions.includes(id)),
                        ).length;
                        const assignedUsers = users.filter((user) => user.roleIds.includes(role.id)).length;
                        return (
                            <article className={`admin-role-entry ${role.id === roleId ? "selected" : ""}`} key={role.id}>
                                <button type="button" className="admin-role-option" onClick={() => selectRole(role)}>
                                    <span>
                                        <strong>{role.name}{role.protected && <span className="admin-protected-badge"><i className="bi bi-lock-fill"></i> Protegido</span>}</strong>
                                        <small>{role.description}</small>
                                        <small>{moduleCount} módulos · {assignedUsers} cuentas asignadas</small>
                                    </span>
                                    <span className={`admin-badge ${role.status === "Activo" ? "admin-badge--success" : "admin-badge--muted"}`}>{role.status}</span>
                                </button>
                                <div className="admin-role-entry__actions">
                                    <button type="button" onClick={() => setDialog({ mode: "role-detail", row: role })} aria-label={`Ver rol ${role.name}`} title="Ver detalle"><i className="bi bi-eye"></i></button>
                                    <button type="button" disabled={role.protected} onClick={() => openRoleForm("role-edit", role)} aria-label={`Editar rol ${role.name}`} title={role.protected ? "El rol protegido no se puede modificar" : "Editar rol"}><i className="bi bi-pencil"></i></button>
                                    <button type="button" disabled={role.protected} onClick={() => setDialog({ mode: "role-status", row: role })} aria-label={`${role.status === "Activo" ? "Desactivar" : "Activar"} rol ${role.name}`} title={role.protected ? "El rol protegido no se puede desactivar" : role.status === "Activo" ? "Desactivar rol" : "Activar rol"}><i className={`bi ${role.status === "Activo" ? "bi-person-slash" : "bi-person-check"}`}></i></button>
                                    <button type="button" className="is-danger" disabled={role.protected || assignedUsers > 0} onClick={() => setDialog({ mode: "role-delete", row: role })} aria-label={`Eliminar rol ${role.name}`} title={role.protected ? "El rol protegido no se puede eliminar" : assignedUsers > 0 ? "Retira las asignaciones antes de eliminar el rol" : "Eliminar rol"}><i className="bi bi-trash"></i></button>
                                </div>
                            </article>
                        );
                    })}
                    <p className="admin-panel-note">Un rol con cuentas asignadas no se puede eliminar. Desasigna primero las cuentas correspondientes.</p>
                </section>
                <section className="admin-panel admin-permission-panel">
                    <div className="admin-panel__heading admin-permission-heading">
                        <div><h2>Asignación de permisos</h2><span>{selectedRole?.name || "Selecciona un rol"} · {selectedPermissionCount} de {allPermissionIds.length} permisos seleccionados</span></div>
                        <div className="admin-permission-actions">
                            {!selectedRole?.protected && rolePermissionsChanged && <button type="button" className="admin-button" onClick={() => setPermissionDraft([...selectedRole.permissions])}>Cancelar cambios</button>}
                            {!selectedRole?.protected && <button type="button" className="admin-button admin-button--primary" disabled={!selectedRole || permissionsDisabled || !rolePermissionsChanged} onClick={requestPermissionSave}>Guardar permisos</button>}
                        </div>
                    </div>
                    <div className="admin-permission-tools">
                        <span><i className="bi bi-info-circle"></i> Selecciona solo las acciones necesarias. Cada rol conserva sus propias asignaciones.</span>
                        <div>
                            <button type="button" disabled={permissionsDisabled} onClick={() => setPermissionDraft(allPermissionIds)}>Seleccionar todos</button>
                            <button type="button" disabled={permissionsDisabled} onClick={() => setPermissionDraft([])}>Limpiar todos</button>
                        </div>
                    </div>
                    {selectedRole?.protected && <p className="admin-protected-notice"><i className="bi bi-shield-lock-fill"></i> Super Admin conserva todos sus permisos y está protegido contra edición, desactivación, eliminación y cambios de permisos. No se puede asignar desde el formulario de cuentas.</p>}
                    <label className="admin-search admin-permission-search">
                        <i className="bi bi-search" aria-hidden="true"></i>
                        <input value={permissionSearch} onChange={(event) => setPermissionSearch(event.target.value)} placeholder="Buscar módulo, acción o identificador..." aria-label="Buscar módulos y permisos" />
                    </label>
                    {permissionGroups.map((group) => {
                        const groupMatches = group.name.toLocaleLowerCase("es").includes(query);
                        const modules = group.modules.map((item) => {
                            const moduleMatches = `${item.name} ${item.route}`.toLocaleLowerCase("es").includes(query);
                            const permissions = !query || groupMatches || moduleMatches
                                ? item.permissions
                                : item.permissions.filter(({ id, label }) => `${id} ${label}`.toLocaleLowerCase("es").includes(query));
                            return { ...item, visiblePermissions: permissions };
                        }).filter((item) => item.visiblePermissions.length > 0);
                        if (modules.length === 0) return null;

                        const categoryPermissionIds = group.modules.flatMap((item) => item.permissions.map(({ id }) => id));
                        const selectedInCategory = categoryPermissionIds.filter((id) => permissionDraft.includes(id)).length;
                        const allSelected = selectedInCategory === categoryPermissionIds.length;
                        const partiallySelected = selectedInCategory > 0 && !allSelected;
                        const expanded = Boolean(query) || Boolean(expandedPermissionGroups[group.id]);

                        return (
                            <section className="admin-permission-category" key={group.id}>
                                <header>
                                    <label>
                                        <input
                                            type="checkbox"
                                            aria-label={`Seleccionar todos los permisos: ${group.name}`}
                                            aria-checked={partiallySelected ? "mixed" : allSelected}
                                            checked={allSelected}
                                            ref={(input) => { if (input) input.indeterminate = partiallySelected; }}
                                            disabled={permissionsDisabled}
                                            onChange={() => setPermissionDraft((current) => {
                                                const withoutCategory = current.filter((id) => !categoryPermissionIds.includes(id));
                                                return allSelected ? withoutCategory : [...withoutCategory, ...categoryPermissionIds];
                                            })}
                                        />
                                        <span><strong>{group.name}</strong><small>{selectedInCategory} de {categoryPermissionIds.length} permisos</small></span>
                                    </label>
                                    <button type="button" aria-expanded={expanded} onClick={() => setExpandedPermissionGroups((current) => ({ ...current, [group.id]: !current[group.id] }))}>
                                        <i className={`bi ${expanded ? "bi-chevron-up" : "bi-chevron-down"}`} aria-hidden="true"></i>
                                        {expanded ? "Contraer" : "Expandir"}
                                    </button>
                                </header>
                                {expanded && <div className="admin-permission-category__content">
                                    {modules.map((item) => (
                                        <article className="admin-permission-module" key={item.id}>
                                            <div className="admin-permission-module__heading"><strong>{item.name}</strong><span>{item.route}</span></div>
                                            <div className="admin-permission-options">
                                                {item.visiblePermissions.map((permission) => {
                                                    const checked = permissionDraft.includes(permission.id);
                                                    return (
                                                        <label className={`admin-permission-choice ${checked ? "is-selected" : ""}`} key={permission.id}>
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                disabled={permissionsDisabled}
                                                                aria-label={`${item.name}: ${permission.label}`}
                                                                onChange={() => setPermissionDraft((current) => checked
                                                                    ? current.filter((id) => id !== permission.id)
                                                                    : [...current, permission.id])}
                                                            />
                                                            <span><strong>{permission.label}</strong><small>{permission.id}</small></span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </article>
                                    ))}
                                </div>}
                            </section>
                        );
                    })}
                    {query && !permissionGroups.some((group) =>
                        group.modules.some((item) => `${group.name} ${item.name} ${item.route} ${item.permissions.map(({ id, label }) => `${id} ${label}`).join(" ")}`.toLocaleLowerCase("es").includes(query)),
                    ) && <div className="admin-state"><i className="bi bi-search"></i><strong>No hay permisos coincidentes</strong><span>Prueba con otro módulo, acción o identificador.</span></div>}
                    <p className="admin-panel-note">Estos cambios solo modifican la demostración local. La autorización efectiva requiere validación del servidor en cada ruta y acción.</p>
                </section>
            </div>
        );
    };

    const renderSettings = () => (
        <form className="admin-settings-grid" onSubmit={(event) => { event.preventDefault(); setSettingsSaved(true); recordAudit("Actualizó configuración", "Configuración general"); setToast("La configuración se guardó en la demostración local."); }}>
            <section className="admin-panel"><div className="admin-panel__heading"><div><h2>Información de la organización</h2><span>Datos generales del espacio de trabajo</span></div></div>
                <label className="admin-field"><span>Nombre de la organización *</span><input required value={settings.organization} onChange={(event) => setSettings((current) => ({ ...current, organization: event.target.value }))} /></label>
                <label className="admin-field"><span>Razón social</span><input value={settings.legalName} onChange={(event) => setSettings((current) => ({ ...current, legalName: event.target.value }))} /></label>
                <label className="admin-field"><span>Correo de contacto</span><input type="email" value={settings.contactEmail} onChange={(event) => setSettings((current) => ({ ...current, contactEmail: event.target.value }))} /></label>
            </section>
            <section className="admin-panel"><div className="admin-panel__heading"><div><h2>Preferencias y seguridad</h2><span>Valores utilizados en esta demostración</span></div></div>
                <label className="admin-field"><span>Zona horaria</span><select value={settings.timezone} onChange={(event) => setSettings((current) => ({ ...current, timezone: event.target.value }))}><option value="America/Mexico_City">Ciudad de México (UTC−06:00)</option><option value="America/Monterrey">Monterrey (UTC−06:00)</option><option value="America/Tijuana">Tijuana (UTC−08:00)</option></select></label>
                <label className="admin-field"><span>Idioma</span><select value={settings.language} onChange={(event) => setSettings((current) => ({ ...current, language: event.target.value }))}><option>Español</option><option>Inglés</option></select></label>
                <label className="admin-field"><span>Formato de fecha</span><select value={settings.dateFormat} onChange={(event) => setSettings((current) => ({ ...current, dateFormat: event.target.value }))}><option>DD/MM/AAAA</option><option>AAAA-MM-DD</option></select></label>
                <label className="admin-field"><span>Duración de sesión (minutos)</span><input type="number" min="5" max="480" required value={settings.sessionMinutes} onChange={(event) => setSettings((current) => ({ ...current, sessionMinutes: event.target.value }))} /></label>
                <label className="admin-toggle"><input type="checkbox" checked={settings.requireStrongPassword} onChange={(event) => setSettings((current) => ({ ...current, requireStrongPassword: event.target.checked }))} /><span><strong>Solicitar contraseñas seguras</strong><small>Preferencia demostrativa; requiere validación del servidor en producción.</small></span></label>
                <label className="admin-toggle"><input type="checkbox" checked={settings.notifyAccountChanges} onChange={(event) => setSettings((current) => ({ ...current, notifyAccountChanges: event.target.checked }))} /><span><strong>Notificar cambios de cuenta</strong><small>Mostrar avisos para cambios de cuentas y permisos.</small></span></label>
            </section>
            <div className="admin-settings-actions">{settingsSaved && <span role="status"><i className="bi bi-check-circle"></i> Cambios guardados localmente</span>}<button type="submit" className="admin-button admin-button--primary"><i className="bi bi-check2"></i>Guardar configuración</button></div>
        </form>
    );

    return (
        <main className="administrator-page">
            <header className="administrator-page__header">
                <div><span className="administrator-page__eyebrow">{page.group}</span><h1><i className={`bi ${page.icon}`} aria-hidden="true"></i> {page.title}</h1><p>Administra la información institucional desde una vista de demostración local.</p></div>
                <span className="administrator-page__status"><i className="bi bi-laptop" aria-hidden="true"></i> Datos de demostración</span>
            </header>

            {loading && !page.entity ? <div className="admin-state" role="status"><span className="spinner-border spinner-border-sm"></span>Cargando información...</div> : (
                page.entity ? renderCrudPage() : pathname === "/administrator/roles-permissions" ? renderRoles() : pathname === "/administrator/settings" ? renderSettings() : renderDashboard()
            )}

            {toast && <div className="admin-toast" role="status"><i className="bi bi-check-circle-fill"></i>{toast}</div>}

            {dialog && (
                <div className="admin-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
                    <section className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title">
                        <header className="admin-dialog__header"><h2 id="admin-dialog-title">{dialog.mode === "detail" ? "Detalle del registro" : dialog.mode === "role-detail" ? `Detalle del rol: ${dialog.row.name}` : dialog.mode === "delete" || dialog.mode === "role-delete" ? "Confirmar eliminación" : dialog.mode === "role-status" ? `${dialog.row.status === "Activo" ? "Desactivar" : "Activar"} rol` : dialog.mode === "permission-removal" ? "Confirmar reducción de permisos" : dialog.mode === "discard-permissions" ? "Descartar cambios sin guardar" : dialog.mode === "role-create" ? "Crear rol" : `${dialog.mode === "edit" || dialog.mode === "role-edit" ? "Editar" : "Agregar"} ${entity?.singular || "rol"}`}</h2><button type="button" onClick={() => setDialog(null)} aria-label="Cerrar"><i className="bi bi-x-lg"></i></button></header>
                        {dialog.mode === "role-detail" ? (
                            <div className="admin-role-detail">
                                <div className="admin-detail-grid"><div><span>Nombre del rol</span><strong>{dialog.row.name}</strong></div><div><span>Estado</span><strong>{dialog.row.status}</strong></div><div className="admin-detail-grid__wide"><span>Descripción</span><strong>{dialog.row.description}</strong></div><div><span>Protección</span><strong>{dialog.row.protected ? "Super Admin protegido" : "Rol estándar"}</strong></div><div><span>Cuentas asignadas</span><strong>{users.filter((user) => user.roleIds.includes(dialog.row.id)).length}</strong></div></div>
                                <h3>Permisos asignados</h3>
                                <ul>{permissionGroups.map((group) => {
                                    const modules = group.modules.filter((item) => item.permissions.some(({ id }) => dialog.row.permissions.includes(id)));
                                    return modules.length > 0 && <li key={group.id}><strong>{group.name}</strong><span>{modules.map((item) => `${item.name}: ${item.permissions.filter(({ id }) => dialog.row.permissions.includes(id)).map(({ label }) => label).join(", ")}`).join(" · ")}</span></li>;
                                })}</ul>
                            </div>
                        ) : dialog.mode === "detail" ? (
                            <>
                                <div className="admin-detail-grid">{(entity?.fields || (entity?.columns || []).map(([key, label]) => ({ key, label }))).map((field) => <div key={field.key}><span>{field.label}</span><strong>{displayValue(field.key, dialog.row[field.key])}</strong></div>)}{dialog.row.details && <div className="admin-detail-grid__wide"><span>Detalle de actividad</span><strong>{dialog.row.details}</strong></div>}</div>
                                {page.entity === "users" && (
                                    <section className="admin-user-effective">
                                        <h3>Permisos efectivos por roles activos</h3>
                                        {(dialog.row.roleIds || []).map((id) => roles.find((role) => role.id === id)).filter(Boolean).map((role) => (
                                            <div className="admin-user-role-detail" key={role.id}>
                                                <strong>{role.name} <span className={`admin-badge ${role.status === "Activo" ? "admin-badge--success" : "admin-badge--muted"}`}>{role.status}</span></strong>
                                                <span>{role.status === "Activo"
                                                    ? getEffectivePermissions({ ...dialog.row, roleIds: [role.id] }).map((item) => `${item.name}: ${item.permissions.map(({ label }) => label).join(", ")}`).join(" · ") || "Sin permisos asignados"
                                                    : "Este rol está inactivo y no aporta permisos efectivos."}</span>
                                            </div>
                                        ))}
                                        <p className="admin-panel-note">Las capacidades se suman entre roles activos asignados; esta vista es solo una demostración local.</p>
                                    </section>
                                )}
                            </>
                        ) : dialog.mode === "delete" ? (
                            <div className="admin-delete-confirm"><i className="bi bi-exclamation-triangle"></i><p>¿Deseas eliminar este registro? Esta acción solo afecta los datos locales de demostración.</p><div><button type="button" className="admin-button" onClick={() => setDialog(null)}>Cancelar</button><button type="button" className="admin-button admin-button--danger" onClick={handleDelete}>Eliminar registro</button></div></div>
                        ) : dialog.mode === "role-delete" ? (
                            <div className="admin-delete-confirm">
                                <i className="bi bi-exclamation-triangle"></i>
                                <p>¿Deseas eliminar el rol «{dialog.row.name}»? Esta acción solo afecta la demostración local y no se puede deshacer.</p>
                                <div><button type="button" className="admin-button" onClick={() => setDialog(null)}>Cancelar</button><button type="button" className="admin-button admin-button--danger" onClick={handleRoleDelete}>Eliminar rol</button></div>
                            </div>
                        ) : dialog.mode === "role-status" ? (
                            <div className="admin-delete-confirm">
                                <i className={`bi ${dialog.row.status === "Activo" ? "bi-exclamation-triangle" : "bi-person-check"}`}></i>
                                <p>{dialog.row.status === "Activo"
                                    ? `Al desactivar «${dialog.row.name}», sus permisos dejarán de ser efectivos para ${users.filter((user) => user.roleIds.includes(dialog.row.id)).length} cuenta(s) asignada(s). Las cuentas conservarán la asignación, pero no recibirán permisos de este rol.`
                                    : `¿Deseas volver a activar «${dialog.row.name}»? Sus permisos volverán a aplicarse a las cuentas asignadas.`}</p>
                                <div><button type="button" className="admin-button" onClick={() => setDialog(null)}>Cancelar</button><button type="button" className={`admin-button ${dialog.row.status === "Activo" ? "admin-button--danger" : "admin-button--primary"}`} onClick={() => { const nextStatus = dialog.row.status === "Activo" ? "Inactivo" : "Activo"; setRoles((current) => current.map((role) => role.id === dialog.row.id ? { ...role, status: nextStatus } : role)); recordAudit(`${nextStatus === "Activo" ? "Activó" : "Desactivó"} un rol`, `Rol: ${dialog.row.name}`); setDialog(null); setToast(`El rol se ${nextStatus === "Activo" ? "activó" : "desactivó"} correctamente.`); }}>{dialog.row.status === "Activo" ? "Desactivar rol" : "Activar rol"}</button></div>
                            </div>
                        ) : dialog.mode === "permission-removal" ? (
                            <div className="admin-delete-confirm">
                                <i className="bi bi-shield-exclamation"></i>
                                <p>Estás quitando permisos al rol «{dialog.row.name}». Los cambios afectarán a {users.filter((user) => user.roleIds.includes(dialog.row.id)).length} cuenta(s) asignada(s). ¿Deseas continuar?</p>
                                <div><button type="button" className="admin-button" onClick={() => setDialog(null)}>Seguir editando</button><button type="button" className="admin-button admin-button--danger" onClick={savePermissionChanges}>Confirmar cambios</button></div>
                            </div>
                        ) : dialog.mode === "discard-permissions" ? (
                            <div className="admin-delete-confirm">
                                <i className="bi bi-exclamation-triangle"></i>
                                <p>Hay cambios de permisos sin guardar en «{selectedRole?.name}». Si cambias de rol, se descartarán.</p>
                                <div><button type="button" className="admin-button" onClick={() => { setPendingRoleId(""); setDialog(null); }}>Seguir editando</button><button type="button" className="admin-button admin-button--danger" onClick={() => { const nextRole = roles.find((role) => role.id === pendingRoleId); if (nextRole) { setRoleId(nextRole.id); setPermissionDraft([...nextRole.permissions]); } setPendingRoleId(""); setDialog(null); }}>Descartar y continuar</button></div>
                            </div>
                        ) : (
                            <form className="admin-dialog__form" onSubmit={dialog.mode === "role-create" || dialog.mode === "role-edit" ? saveRoleDetails : saveEntity}>
                                {(dialog.mode === "role-create" || dialog.mode === "role-edit" ? definitions.roles.fields : entity.fields).map(renderField)}
                                {formError && <p className="admin-form-error" role="alert"><i className="bi bi-exclamation-circle"></i>{formError}</p>}
                                <footer><button type="button" className="admin-button" onClick={() => setDialog(null)}>Cancelar</button><button type="submit" className="admin-button admin-button--primary">Guardar cambios</button></footer>
                            </form>
                        )}
                    </section>
                </div>
            )}
        </main>
    );
};

export default Administrator;
