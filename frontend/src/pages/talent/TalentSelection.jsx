import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    recruitmentStages,
    recruitmentStatusOptions,
    recruitmentVacancyStatusOptions,
    talentCandidates,
    talentInterviews,
    talentOverviewStats,
    talentVacancies,
    talentEvaluations,
} from "../../data/talentData";

const stageOrder = recruitmentStages.map((stage) => stage.label);

const TalentSelection = () => {
    const [search, setSearch] = useState("");
    const [selectedVacancy, setSelectedVacancy] = useState(talentVacancies[0]?.id || "");
    const [selectedCandidateId, setSelectedCandidateId] = useState(talentCandidates[0]?.id || "");
    const [stageFilter, setStageFilter] = useState("Todos");
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [vacancyStatusFilter, setVacancyStatusFilter] = useState("Todos");

    const displayVacancies = talentVacancies.filter((vacancy) => {
        if (vacancyStatusFilter === "Todos") {
            return true;
        }

        return vacancy.status === vacancyStatusFilter;
    });

    const activeVacancy =
        talentVacancies.find((vacancy) => vacancy.id === selectedVacancy) || talentVacancies[0];

    const filteredCandidates = useMemo(() => {
        return talentCandidates.filter((candidate) => {
            const matchesVacancy =
                !selectedVacancy || candidate.vacancyId === selectedVacancy;

            const matchesSearch =
                !search ||
                candidate.name.toLowerCase().includes(search.toLowerCase()) ||
                candidate.position.toLowerCase().includes(search.toLowerCase()) ||
                candidate.email.toLowerCase().includes(search.toLowerCase());

            const matchesStage =
                stageFilter === "Todos" || candidate.currentStage === stageFilter;

            const matchesStatus =
                statusFilter === "Todos" || candidate.status === statusFilter;

            return matchesVacancy && matchesSearch && matchesStage && matchesStatus;
        });
    }, [search, selectedVacancy, stageFilter, statusFilter]);

    const activeCandidate =
        filteredCandidates.find((candidate) => candidate.id === selectedCandidateId) ||
        filteredCandidates[0] ||
        talentCandidates.find((candidate) => candidate.vacancyId === selectedVacancy) ||
        talentCandidates[0];

    const pipelineStats = recruitmentStages.map((stage) => ({
        ...stage,
        count: talentCandidates.filter((candidate) => candidate.currentStage === stage.label).length,
    }));

    return (
        <section className="recruitment-page">
            <div className="recruitment-topbar">
                <div>
                    <span className="page-eyebrow">TALENTO HUMANO</span>
                    <h1>Selección y personal</h1>
                    <p>
                        Seguimiento de vacantes, postulantes, etapas del proceso y evaluación.
                    </p>
                </div>

                <div className="recruitment-actions">
                    <Link to="/talento-humano" className="btn btn-outline-primary">
                        <i className="bi bi-arrow-left"></i>
                        Volver
                    </Link>
                    <button type="button" className="btn btn-primary" disabled aria-disabled="true">
                        <i className="bi bi-plus-lg"></i>
                        Crear vacante
                    </button>
                </div>
            </div>

            <div className="recruitment-grid">
                {talentOverviewStats.map((item) => (
                    <div key={item.label} className="recruitment-stat">
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                    </div>
                ))}
            </div>

            <div className="recruitment-panel">
                <h2>Vacantes abiertas</h2>

                <div className="recruitment-filters">
                    <div className="search-box">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Buscar postulante o cargo..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>

                    <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}>
                        <option value="Todos">Etapa: Todas</option>
                        {stageOrder.map((stage) => (
                            <option key={stage} value={stage}>
                                {stage}
                            </option>
                        ))}
                    </select>

                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                        <option value="Todos">Estado: Todos</option>
                        {recruitmentStatusOptions
                            .filter((option) => option !== "Todos")
                            .map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="pipeline-grid">
                    {pipelineStats.map((stage) => (
                        <div
                            key={stage.id}
                            className={`pipeline-step ${
                                activeVacancy && activeCandidate && activeCandidate.currentStage === stage.label ? "active" : ""
                            }`}
                        >
                            <strong>{stage.label}</strong>
                            <span>{stage.count} candidatos</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="selection-layout">
                <div className="recruitment-panel vacancy-list">
                    <h3>Vacantes</h3>

                    <div className="recruitment-filters">
                        <select
                            value={vacancyStatusFilter}
                            onChange={(event) => setVacancyStatusFilter(event.target.value)}
                        >
                            <option value="Todos">Estado: Todos</option>
                            {recruitmentVacancyStatusOptions
                                .filter((option) => option !== "Todos")
                                .map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {displayVacancies.map((vacancy) => (
                        <button
                            key={vacancy.id}
                            type="button"
                            className={`vacancy-card ${selectedVacancy === vacancy.id ? "active" : ""}`}
                            onClick={() => {
                                setSelectedVacancy(vacancy.id);
                                const firstCandidate = talentCandidates.find(
                                    (candidate) => candidate.vacancyId === vacancy.id
                                );

                                if (firstCandidate) {
                                    setSelectedCandidateId(firstCandidate.id);
                                }
                            }}
                        >
                            <div className="vacancy-card-header">
                                <h3>{vacancy.title}</h3>
                                <span className={`tag ${vacancy.status === "Open" ? "success" : "warning"}`}>
                                    {vacancy.status}
                                </span>
                            </div>

                            <div className="vacancy-meta">
                                {vacancy.department} · {vacancy.branch} · {vacancy.positions} puesto(s)
                            </div>

                            <ul>
                                <li>{vacancy.employmentType}</li>
                                <li>{vacancy.schedule}</li>
                                <li>{vacancy.applicants} postulantes</li>
                            </ul>
                        </button>
                    ))}
                </div>

                <div className="recruitment-panel candidate-list">
                    <h3>Postulantes</h3>

                    {filteredCandidates.length > 0 ? (
                        filteredCandidates.map((candidate) => (
                            <button
                                key={candidate.id}
                                type="button"
                                className={`candidate-row ${activeCandidate?.id === candidate.id ? "active" : ""}`}
                                onClick={() => setSelectedCandidateId(candidate.id)}
                            >
                                <div className="candidate-info">
                                    <strong>{candidate.name}</strong>
                                    <small>
                                        {candidate.position} · {candidate.city}
                                    </small>
                                </div>

                                <span className="candidate-stage">{candidate.currentStage}</span>
                            </button>
                        ))
                    ) : (
                        <div className="empty-state">No hay postulantes para los filtros actuales.</div>
                    )}
                </div>
            </div>

            <div className="recruitment-panel">
                <h3>Detalle del candidato</h3>

                {activeCandidate ? (
                    <>
                        <div className="detail-card">
                            <div className="vacancy-card-header">
                                <h3>{activeCandidate.name}</h3>
                                <span className="tag">{activeCandidate.status}</span>
                            </div>

                            <div className="detail-meta">
                                {activeCandidate.position} · {activeCandidate.currentStage}
                            </div>

                            <div className="detail-columns">
                                <div>
                                    <strong>Información personal</strong>
                                    <ul>
                                        <li>Email: {activeCandidate.email}</li>
                                        <li>Teléfono: {activeCandidate.phone}</li>
                                        <li>Ciudad: {activeCandidate.city}</li>
                                    </ul>
                                </div>

                                <div>
                                    <strong>Formación y experiencia</strong>
                                    <ul>
                                        <li>Educación: {activeCandidate.education}</li>
                                        <li>Experiencia: {activeCandidate.experience} años</li>
                                        <li>Habilidades: {activeCandidate.skills.join(", ")}</li>
                                    </ul>
                                </div>

                                <div>
                                    <strong>Reclutamiento</strong>
                                    <ul>
                                        <li>Vacante: {activeCandidate.position}</li>
                                        <li>Fecha de postulación: {activeCandidate.applicationDate}</li>
                                        <li>Reclutador: {activeCandidate.recruiter}</li>
                                        <li>Etapa actual: {activeCandidate.currentStage}</li>
                                    </ul>
                                </div>

                                <div>
                                    <strong>Notas</strong>
                                    <ul>
                                        <li>{activeCandidate.notes}</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="detail-footer">
                                <button type="button" className="btn btn-outline-primary" disabled aria-disabled="true">
                                    Ver CV
                                </button>
                                <button type="button" className="btn btn-primary" disabled aria-disabled="true">
                                    Descargar CV
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">Selecciona un postulante para ver el detalle.</div>
                )}
            </div>

            <div className="selection-layout">
                <div className="recruitment-panel">
                    <h3>Entrevistas</h3>
                    <div className="candidate-list">
                        {talentInterviews.map((interview) => (
                            <div key={interview.id} className="vacancy-card">
                                <div className="vacancy-card-header">
                                    <h3>{interview.candidate}</h3>
                                    <span className="tag warning">{interview.status}</span>
                                </div>
                                <div className="vacancy-meta">
                                    {interview.position} · {interview.type}
                                </div>
                                <ul>
                                    <li>{interview.date} · {interview.time}</li>
                                    <li>Entrevistador: {interview.interviewer}</li>
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="recruitment-panel">
                    <h3>Evaluaciones</h3>
                    <div className="candidate-list">
                        {talentEvaluations.map((evaluation) => (
                            <div key={evaluation.id} className="vacancy-card">
                                <div className="vacancy-card-header">
                                    <h3>{evaluation.candidate}</h3>
                                    <span className="tag success">{evaluation.result}</span>
                                </div>
                                <div className="vacancy-meta">
                                    {evaluation.position} · {evaluation.type}
                                </div>
                                <ul>
                                    <li>Fecha: {evaluation.date}</li>
                                    <li>Evaluador: {evaluation.evaluator}</li>
                                    <li>Puntaje: {evaluation.score}</li>
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TalentSelection;
