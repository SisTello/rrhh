import { useEffect, useMemo, useState } from "react";

import mockEmployees from "../../data/mockEmployees";
import "./directory.scss";

const normalizeText = (value) =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es");

const EmployeePhoto = ({ employee, compact = false }) => {
    const [imageUnavailable, setImageUnavailable] = useState(false);
    const initials = employee.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("");

    return (
        <div
            className={`directory-avatar ${compact ? "directory-avatar--compact" : ""}`}
            role="img"
            aria-label={`Foto de ${employee.name}`}
        >
            {employee.photo && !imageUnavailable ? (
                <img
                    src={employee.photo}
                    alt=""
                    onError={() => setImageUnavailable(true)}
                />
            ) : (
                <span aria-hidden="true">{initials}</span>
            )}
        </div>
    );
};

const Directory = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [branchFilter, setBranchFilter] = useState("");
    const [view, setView] = useState("cards");
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const departments = useMemo(
        () =>
            [...new Set(mockEmployees.map((employee) => employee.department))]
                .sort((a, b) => a.localeCompare(b, "es")),
        [],
    );
    const branches = useMemo(
        () =>
            [...new Set(mockEmployees.map((employee) => employee.branch))]
                .sort((a, b) => a.localeCompare(b, "es")),
        [],
    );

    const filteredEmployees = useMemo(() => {
        const query = normalizeText(searchTerm.trim());

        return mockEmployees.filter((employee) => {
            const matchesSearch =
                !query ||
                [
                    employee.name,
                    employee.jobTitle,
                    employee.department,
                    employee.branch,
                ].some((value) => normalizeText(value).includes(query));

            return (
                matchesSearch &&
                (!departmentFilter || employee.department === departmentFilter) &&
                (!branchFilter || employee.branch === branchFilter)
            );
        });
    }, [searchTerm, departmentFilter, branchFilter]);

    useEffect(() => {
        if (!selectedEmployee) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSelectedEmployee(null);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [selectedEmployee]);

    const clearFilters = () => {
        setSearchTerm("");
        setDepartmentFilter("");
        setBranchFilter("");
    };

    return (
        <main className="directory-page">
            <header className="directory-page__header">
                <div>
                    <span className="directory-eyebrow">PERSONAS TELLO</span>
                    <h1>Directorio</h1>
                    <p>Encuentra a tus compañeros y sus datos de contacto.</p>
                </div>
                <div className="directory-total" aria-live="polite">
                    <strong>{filteredEmployees.length}</strong>
                    <span>
                        {filteredEmployees.length === 1
                            ? "colaborador"
                            : "colaboradores"}
                    </span>
                </div>
            </header>

            <section className="directory-toolbar" aria-label="Buscar y filtrar colaboradores">
                <label className="directory-search">
                    <i className="bi bi-search" aria-hidden="true"></i>
                    <span className="visually-hidden">Buscar colaboradores</span>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Buscar por nombre, cargo, departamento o sucursal..."
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="directory-search__clear"
                            aria-label="Limpiar búsqueda"
                            onClick={() => setSearchTerm("")}
                        >
                            <i className="bi bi-x-lg" aria-hidden="true"></i>
                        </button>
                    )}
                </label>

                <div className="directory-controls">
                    <label className="directory-filter">
                        <span>Departamento</span>
                        <select
                            value={departmentFilter}
                            onChange={(event) => setDepartmentFilter(event.target.value)}
                            aria-label="Filtrar por departamento"
                        >
                            <option value="">Todos</option>
                            {departments.map((department) => (
                                <option key={department} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="directory-filter">
                        <span>Sucursal</span>
                        <select
                            value={branchFilter}
                            onChange={(event) => setBranchFilter(event.target.value)}
                            aria-label="Filtrar por sucursal"
                        >
                            <option value="">Todas</option>
                            {branches.map((branch) => (
                                <option key={branch} value={branch}>
                                    {branch}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="directory-view-toggle" role="group" aria-label="Vista del directorio">
                        <button
                            type="button"
                            className={view === "cards" ? "active" : ""}
                            aria-pressed={view === "cards"}
                            aria-label="Vista de tarjetas"
                            onClick={() => setView("cards")}
                        >
                            <i className="bi bi-grid-3x3-gap" aria-hidden="true"></i>
                            <span>Tarjetas</span>
                        </button>
                        <button
                            type="button"
                            className={view === "table" ? "active" : ""}
                            aria-pressed={view === "table"}
                            aria-label="Vista de tabla"
                            onClick={() => setView("table")}
                        >
                            <i className="bi bi-list-ul" aria-hidden="true"></i>
                            <span>Tabla</span>
                        </button>
                    </div>
                </div>
            </section>

            {filteredEmployees.length === 0 ? (
                <section className="directory-empty" role="status">
                    <span className="directory-empty__icon">
                        <i className="bi bi-person-x" aria-hidden="true"></i>
                    </span>
                    <h2>No encontramos colaboradores</h2>
                    <p>Prueba otra búsqueda o cambia los filtros seleccionados.</p>
                    <button type="button" onClick={clearFilters}>
                        Limpiar búsqueda y filtros
                    </button>
                </section>
            ) : view === "cards" ? (
                <section className="directory-cards" aria-label="Colaboradores">
                    {filteredEmployees.map((employee) => (
                        <article className="directory-card" key={employee.id}>
                            <div className="directory-card__identity">
                                <EmployeePhoto employee={employee} />
                                <div>
                                    <h2>{employee.name}</h2>
                                    <p>{employee.jobTitle}</p>
                                </div>
                            </div>
                            <div className="directory-card__details">
                                <span>
                                    <i className="bi bi-diagram-3" aria-hidden="true"></i>
                                    {employee.department}
                                </span>
                                <span>
                                    <i className="bi bi-geo-alt" aria-hidden="true"></i>
                                    {employee.branch}
                                </span>
                            </div>
                            <button
                                type="button"
                                className="directory-card__action"
                                onClick={() => setSelectedEmployee(employee)}
                                aria-label={`Ver perfil de ${employee.name}`}
                            >
                                Ver perfil
                                <i className="bi bi-arrow-right" aria-hidden="true"></i>
                            </button>
                        </article>
                    ))}
                </section>
            ) : (
                <div className="directory-table-wrapper">
                    <table className="directory-table">
                        <thead>
                            <tr>
                                <th scope="col">Colaborador</th>
                                <th scope="col">Cargo</th>
                                <th scope="col">Departamento</th>
                                <th scope="col">Sucursal</th>
                                <th scope="col">
                                    <span className="visually-hidden">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>
                                        <div className="directory-table__person">
                                            <EmployeePhoto employee={employee} compact />
                                            <strong>{employee.name}</strong>
                                        </div>
                                    </td>
                                    <td>{employee.jobTitle}</td>
                                    <td>{employee.department}</td>
                                    <td>{employee.branch}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="directory-table__action"
                                            onClick={() => setSelectedEmployee(employee)}
                                            aria-label={`Ver perfil de ${employee.name}`}
                                        >
                                            Ver perfil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedEmployee && (
                <div
                    className="directory-modal"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedEmployee(null);
                        }
                    }}
                >
                    <section
                        className="directory-modal__dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="directory-modal-title"
                    >
                        <header className="directory-modal__header">
                            <h2 id="directory-modal-title">Perfil del colaborador</h2>
                            <button
                                type="button"
                                className="directory-modal__close"
                                onClick={() => setSelectedEmployee(null)}
                                aria-label="Cerrar perfil"
                            >
                                <i className="bi bi-x-lg" aria-hidden="true"></i>
                            </button>
                        </header>
                        <div className="directory-modal__body">
                            <div className="directory-modal__profile">
                                <EmployeePhoto employee={selectedEmployee} />
                                <div>
                                    <h3>{selectedEmployee.name}</h3>
                                    <p>{selectedEmployee.jobTitle}</p>
                                </div>
                            </div>
                            <dl className="directory-contact-list">
                                <div>
                                    <dt>Departamento</dt>
                                    <dd>{selectedEmployee.department}</dd>
                                </div>
                                <div>
                                    <dt>Sucursal</dt>
                                    <dd>{selectedEmployee.branch}</dd>
                                </div>
                                <div>
                                    <dt>Correo corporativo</dt>
                                    <dd>
                                        <a href={`mailto:${selectedEmployee.email}`}>
                                            {selectedEmployee.email}
                                        </a>
                                    </dd>
                                </div>
                                <div>
                                    <dt>Extensión</dt>
                                    <dd>{selectedEmployee.extension}</dd>
                                </div>
                                <div>
                                    <dt>Reporta a</dt>
                                    <dd>{selectedEmployee.manager}</dd>
                                </div>
                            </dl>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
};

export default Directory;
