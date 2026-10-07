import { Link, useParams } from "react-router-dom";

import { talentProcesses } from "../../data/talentData";

const ProcessDetail = () => {
    const { processId } = useParams();

    const process = talentProcesses.find((item) => item.id === processId);

    if (!process) {
        return (
            <section className="recruitment-page">
                <div className="recruitment-panel">
                    <h1>Proceso no encontrado</h1>
                    <p>El proceso solicitado no existe en la lista actual.</p>

                    <Link to="/talento-humano" className="btn btn-primary">
                        Volver a Talento Humano
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="recruitment-page">
            <div className="recruitment-topbar">
                <div>
                    <span className="page-eyebrow">TALENTO HUMANO</span>
                    <h1>{process.position}</h1>
                    <p>
                        {process.department} · {process.branch} · {process.vacancies} vacante(s)
                    </p>
                </div>

                <div className="recruitment-actions">
                    <Link to="/talento-humano" className="btn btn-outline-primary">
                        <i className="bi bi-arrow-left"></i>
                        Volver
                    </Link>
                    <Link to="/talento-humano/seleccion" className="btn btn-primary">
                        Ver selección
                    </Link>
                </div>
            </div>

            <div className="recruitment-grid">
                <div className="recruitment-stat">
                    <span>Postulantes</span>
                    <strong>{process.applicants}</strong>
                </div>
                <div className="recruitment-stat">
                    <span>Preseleccionados</span>
                    <strong>{process.preselected}</strong>
                </div>
                <div className="recruitment-stat">
                    <span>Evaluados</span>
                    <strong>{process.evaluated}</strong>
                </div>
                <div className="recruitment-stat">
                    <span>Finalistas</span>
                    <strong>{process.finalists}</strong>
                </div>
            </div>

            <div className="recruitment-panel">
                <h3>Detalle del proceso</h3>
                <div className="detail-columns">
                    <div>
                        <strong>Código</strong>
                        {process.id}
                    </div>
                    <div>
                        <strong>Estado</strong>
                        {process.status}
                    </div>
                    <div>
                        <strong>Etapa actual</strong>
                        {process.currentStage}
                    </div>
                    <div>
                        <strong>Fecha de cierre</strong>
                        {process.deadline}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessDetail;
