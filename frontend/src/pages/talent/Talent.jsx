import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    talentProcesses,
} from "../../data/talentData";

import "./Talent.scss";

const Talent = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("Todos");

    const filteredProcesses = useMemo(() => {
        return talentProcesses.filter((process) => {
            const matchesSearch =
                process.id
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                process.position
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                process.department
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                status === "Todos" ||
                process.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [search, status]);

    return (
        <section className="talent-page">

            <div className="page-header">
                <div>
                    <span className="page-eyebrow">
                        TALENTO HUMANO
                    </span>

                    <h1>Procesos de selección</h1>

                    <p>
                        Gestiona y realiza seguimiento a los
                        procesos de selección de personal.
                    </p>
                </div>

                <Link
                    to="/talento-humano/nuevo"
                    className="btn btn-primary"
                >
                    <i className="bi bi-plus-lg"></i>
                    Crear proceso
                </Link>
            </div>

            <div className="talent-summary">

                <div className="summary-card">
                    <span>Procesos activos</span>
                    <strong>2</strong>
                </div>

                <div className="summary-card">
                    <span>Postulantes</span>
                    <strong>42</strong>
                </div>

                <div className="summary-card">
                    <span>En evaluación</span>
                    <strong>1</strong>
                </div>

                <div className="summary-card">
                    <span>Procesos cerrados</span>
                    <strong>1</strong>
                </div>

            </div>

            <div className="talent-panel">

                <div className="panel-toolbar">

                    <div className="search-box">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            placeholder="Buscar proceso..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value)
                        }
                    >
                        <option>Todos</option>
                        <option>En evaluación</option>
                        <option>En entrevistas</option>
                        <option>Cerrado</option>
                    </select>

                </div>

                <div className="process-table-wrapper">

                    <table className="process-table">

                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Cargo</th>
                                <th>Área</th>
                                <th>Sucursal</th>
                                <th>Postulantes</th>
                                <th>Etapa</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredProcesses.map((process) => (
                                <tr key={process.id}>

                                    <td>
                                        <strong>
                                            {process.id}
                                        </strong>
                                    </td>

                                    <td>
                                        {process.position}
                                    </td>

                                    <td>
                                        {process.department}
                                    </td>

                                    <td>
                                        {process.branch}
                                    </td>

                                    <td>
                                        {process.applicants}
                                    </td>

                                    <td>
                                        {process.currentStage}
                                    </td>

                                    <td>
                                        <span
                                            className={`status-badge ${process.status
                                                .toLowerCase()
                                                .replaceAll(
                                                    " ",
                                                    "-"
                                                )}`}
                                        >
                                            {process.status}
                                        </span>
                                    </td>

                                    <td>
                                        <Link
                                            to={`/talento-humano/proceso/${process.id}`}
                                            className="table-action"
                                        >
                                            Ver
                                        </Link>
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </section>
    );
};

export default Talent;