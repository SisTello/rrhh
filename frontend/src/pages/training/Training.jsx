import { useMemo, useState } from "react";

import {
    mockOnboardingProgram,
    trainingCategories,
    trainingResources,
} from "../../data/mockTrainingData";
import trainingAccess from "./trainingAccess";
import "./training.scss";

const sections = [
    { id: "onboarding", label: "Mi inducción", icon: "bi-person-check" },
    { id: "courses", label: "Capacitaciones", icon: "bi-journal-bookmark" },
    { id: "library", label: "Biblioteca de recursos", icon: "bi-collection" },
    { id: "administration", label: "Administrador", icon: "bi-gear" },
];

const resourceIcons = {
    PDF: "bi-filetype-pdf",
    Presentación: "bi-file-slides",
    Documento: "bi-file-earmark-text",
    Imagen: "bi-file-image",
    Video: "bi-play-btn",
    "Enlace externo": "bi-box-arrow-up-right",
};

const formatDate = (date) =>
    new Intl.DateTimeFormat("es", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(`${date}T12:00:00`));

const isSafeHttpUrl = (url) => {
    if (!url) {
        return false;
    }

    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
    } catch {
        return false;
    }
};

const Training = () => {
    const [section, setSection] = useState("onboarding");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [search, setSearch] = useState("");
    const [completedModules, setCompletedModules] = useState([]);
    const [activeResource, setActiveResource] = useState(null);
    const [notice, setNotice] = useState("");
    const [publishedItems, setPublishedItems] = useState([]);
    const [trainingForm, setTrainingForm] = useState({ title: "", description: "", category: trainingCategories[0], type: "Capacitación", status: "Borrador", attachment: "" });
    const [trainingFormError, setTrainingFormError] = useState("");

    const visibleResources = useMemo(() => {
        const normalizedSearch = search.trim().toLocaleLowerCase("es");

        return trainingResources.filter((resource) => {
            const allowedByConfidentiality =
                trainingAccess.canViewConfidential || !resource.confidential;
            const matchesCategory =
                !categoryFilter || resource.category === categoryFilter;
            const matchesSearch =
                !normalizedSearch ||
                `${resource.title} ${resource.description} ${resource.category} ${resource.type}`
                    .toLocaleLowerCase("es")
                    .includes(normalizedSearch);

            return allowedByConfidentiality && matchesCategory && matchesSearch;
        });
    }, [categoryFilter, search]);

    const completedCount = completedModules.length;
    const totalModules = mockOnboardingProgram.modules.length;
    const progress = Math.round((completedCount / totalModules) * 100);
    const resourceById = new Map(
        trainingResources.map((resource) => [resource.id, resource]),
    );

    const toggleModuleCompletion = (moduleId) => {
        setCompletedModules((current) =>
            current.includes(moduleId)
                ? current.filter((id) => id !== moduleId)
                : [...current, moduleId],
        );
        setNotice("Progreso de demostración actualizado. No se ha guardado en el servidor.");
    };

    const renderResourceActions = (resource) => {
        const hasApprovedUrl = resource.authorized && isSafeHttpUrl(resource.url);

        return (
            <div className="training-resource__actions">
                <button
                    type="button"
                    className="training-button training-button--secondary"
                    onClick={() => setActiveResource(resource)}
                >
                    <i className="bi bi-eye" aria-hidden="true"></i>
                    Ver detalles
                </button>
                {hasApprovedUrl ? (
                    <a
                        className="training-button training-button--primary"
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        download={resource.type !== "Enlace externo" ? "" : undefined}
                    >
                        <i
                            className={`bi ${
                                resource.type === "Enlace externo"
                                    ? "bi-box-arrow-up-right"
                                    : "bi-download"
                            }`}
                            aria-hidden="true"
                        ></i>
                        {resource.type === "Enlace externo" ? "Abrir enlace" : "Descargar"}
                    </a>
                ) : (
                    <span className="training-resource__unavailable">
                        <i className="bi bi-cloud-slash" aria-hidden="true"></i>
                        Recurso no disponible
                    </span>
                )}
            </div>
        );
    };

    return (
        <main className="training-page">
            <header className="training-page__header">
                <div>
                    <span className="training-eyebrow">DESARROLLO DE PERSONAS</span>
                    <h1>Capacitación e Inducción</h1>
                    <p>
                        Acompañamos tu incorporación y aprendizaje continuo en TELLO.
                    </p>
                </div>
                <div className="training-header-badge">
                    <i className="bi bi-mortarboard" aria-hidden="true"></i>
                    <span>Aprendizaje continuo</span>
                </div>
            </header>

            <div className="training-demo-notice" role="status">
                <i className="bi bi-info-circle" aria-hidden="true"></i>
                <span>
                    Vista de demostración: el progreso y los recursos son datos de ejemplo y no se sincronizan.
                </span>
            </div>

            <nav className="training-tabs" aria-label="Secciones de capacitación">
                {sections.map((item) => (
                    <button
                        type="button"
                        key={item.id}
                        className={`training-tab ${section === item.id ? "active" : ""}`}
                        aria-current={section === item.id ? "page" : undefined}
                        onClick={() => {
                            setSection(item.id);
                            setNotice("");
                        }}
                    >
                        <i className={`bi ${item.icon}`} aria-hidden="true"></i>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            {notice && (
                <div className="training-inline-notice" role="status">
                    <i className="bi bi-info-circle" aria-hidden="true"></i>
                    {notice}
                </div>
            )}

            {section === "onboarding" && (
                <section className="training-section">
                    <div className="training-section__heading">
                        <div>
                            <span className="training-eyebrow">TU RECORRIDO</span>
                            <h2>Mi inducción</h2>
                            <p>Completa los módulos asignados a tu inducción.</p>
                        </div>
                        <span className="training-status-pill">
                            <i className="bi bi-calendar-event" aria-hidden="true"></i>
                            Fecha límite: {formatDate(mockOnboardingProgram.dueDate)}
                        </span>
                    </div>

                    <div className="training-progress-card">
                        <div className="training-progress-card__summary">
                            <div>
                                <span className="training-eyebrow">PROGRAMA ACTIVO</span>
                                <h3>{mockOnboardingProgram.name}</h3>
                                <p>
                                    {completedCount} de {totalModules} módulos completados
                                </p>
                            </div>
                            <strong>{progress}%</strong>
                        </div>
                        <div
                            className="training-progress"
                            role="progressbar"
                            aria-label="Progreso de inducción"
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            <span style={{ width: `${progress}%` }}></span>
                        </div>
                    </div>

                    <div className="training-module-list">
                        {mockOnboardingProgram.modules.map((module, index) => {
                            const completed = completedModules.includes(module.id);
                            const resource = resourceById.get(module.resourceId);

                            return (
                                <article
                                    className={`training-module ${completed ? "is-complete" : ""}`}
                                    key={module.id}
                                >
                                    <div className="training-module__number">
                                        {completed ? (
                                            <i className="bi bi-check-lg" aria-hidden="true"></i>
                                        ) : (
                                            String(index + 1).padStart(2, "0")
                                        )}
                                    </div>
                                    <div className="training-module__content">
                                        <div className="training-module__title">
                                            <h3>{module.title}</h3>
                                            <span className={`training-completion ${completed ? "complete" : ""}`}>
                                                {completed ? "Completado" : "Pendiente"}
                                            </span>
                                        </div>
                                        <p>{module.description}</p>
                                        <span className="training-module__duration">
                                            <i className="bi bi-clock" aria-hidden="true"></i>
                                            {module.duration}
                                        </span>
                                        {resource && renderResourceActions(resource)}
                                    </div>
                                    <button
                                        type="button"
                                        className={`training-module__complete ${completed ? "complete" : ""}`}
                                        onClick={() => toggleModuleCompletion(module.id)}
                                        aria-pressed={completed}
                                    >
                                        <i
                                            className={`bi ${completed ? "bi-arrow-counterclockwise" : "bi-check2"}`}
                                            aria-hidden="true"
                                        ></i>
                                        {completed ? "Deshacer" : "Marcar completado"}
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                    <p className="training-future-note">
                        <i className="bi bi-lightbulb" aria-hidden="true"></i>
                        Evaluaciones y certificados se habilitarán en una fase posterior.
                    </p>
                </section>
            )}

            {section === "courses" && (
                <section className="training-section">
                    <div className="training-section__heading">
                        <div>
                            <span className="training-eyebrow">APRENDIZAJE CONTINUO</span>
                            <h2>Capacitaciones</h2>
                            <p>Cursos disponibles y asignados para tu desarrollo.</p>
                        </div>
                    </div>
                    <div className="training-course-card">
                        <span className="training-course-card__icon">
                            <i className="bi bi-journal-bookmark" aria-hidden="true"></i>
                        </span>
                        <div className="training-course-card__body">
                            <span className="training-course-card__tag">INDUCCIÓN GENERAL</span>
                            <h3>{mockOnboardingProgram.name}</h3>
                            <p>
                                {totalModules} módulos · Fecha límite {formatDate(mockOnboardingProgram.dueDate)}
                            </p>
                            <div className="training-course-card__progress">
                                <span>
                                    {completedCount}/{totalModules} módulos completados
                                </span>
                                <strong>{progress}%</strong>
                            </div>
                            <div className="training-progress" aria-hidden="true">
                                <span style={{ width: `${progress}%` }}></span>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="training-button training-button--primary"
                            onClick={() => setSection("onboarding")}
                        >
                            Ver programa
                            <i className="bi bi-arrow-right" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="training-empty-callout">
                        <i className="bi bi-info-circle" aria-hidden="true"></i>
                        <p>
                            Los cursos y asignaciones adicionales aparecerán aquí cuando se conecte el servicio de capacitación.
                        </p>
                    </div>
                    {publishedItems.filter((item) => item.status === "Publicado").map((item) => (
                        <article className="training-course-card" key={item.id}>
                            <span className="training-course-card__icon"><i className={`bi ${item.attachment?.type?.startsWith("image/") ? "bi-file-image" : "bi-journal-bookmark"}`} aria-hidden="true"></i></span>
                            <div className="training-course-card__body">
                                <span className="training-course-card__tag">{item.type.toLocaleUpperCase("es")} · {item.category}</span>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                {item.attachment?.name && <small>Adjunto: {item.attachment.name}</small>}
                            </div>
                        </article>
                    ))}
                </section>
            )}

            {section === "library" && (
                <section className="training-section">
                    <div className="training-section__heading">
                        <div>
                            <span className="training-eyebrow">MATERIALES DE APRENDIZAJE</span>
                            <h2>Biblioteca de recursos</h2>
                            <p>Consulta los materiales organizados por categoría y formato.</p>
                        </div>
                    </div>

                    <div className="training-library-toolbar">
                        <label className="training-search">
                            <i className="bi bi-search" aria-hidden="true"></i>
                            <span className="visually-hidden">Buscar recursos</span>
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Buscar recursos..."
                            />
                        </label>
                        <label className="training-category-filter">
                            <span className="visually-hidden">Filtrar por categoría</span>
                            <select
                                value={categoryFilter}
                                onChange={(event) => setCategoryFilter(event.target.value)}
                            >
                                <option value="">Todas las categorías</option>
                                {trainingCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {visibleResources.length > 0 ? (
                        <div className="training-resource-grid">
                            {visibleResources.map((resource) => (
                                <article className="training-resource" key={resource.id}>
                                    <div className="training-resource__icon">
                                        <i
                                            className={`bi ${resourceIcons[resource.type] || "bi-file-earmark"}`}
                                            aria-hidden="true"
                                        ></i>
                                    </div>
                                    <div className="training-resource__meta">
                                        <span>{resource.type}</span>
                                        <span>{resource.category}</span>
                                    </div>
                                    <h3>{resource.title}</h3>
                                    <p>{resource.description}</p>
                                    <span className="training-resource__size">{resource.size}</span>
                                    {renderResourceActions(resource)}
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="training-empty-callout" role="status">
                            <i className="bi bi-search" aria-hidden="true"></i>
                            <p>No hay recursos que coincidan con la búsqueda seleccionada.</p>
                        </div>
                    )}
                </section>
            )}

            {section === "administration" && (
                <section className="training-section">
                    <div className="training-section__heading">
                        <div>
                            <span className="training-eyebrow">GESTIÓN DEL APRENDIZAJE</span>
                            <h2>Administrador</h2>
                            <p>Publica secciones de capacitación e inducción con datos locales de demostración.</p>
                        </div>
                    </div>
                    <form className="training-admin-form" onSubmit={(event) => {
                        event.preventDefault();
                        if (!trainingForm.title.trim() || !trainingForm.description.trim() || !trainingForm.category || !trainingForm.type) {
                            setTrainingFormError("Completa el título, la descripción, la categoría y el tipo.");
                            return;
                        }
                        const item = { ...trainingForm, id: `training-${Date.now()}`, title: trainingForm.title.trim(), description: trainingForm.description.trim(), attachment: trainingForm.attachment || null };
                        setPublishedItems((current) => [item, ...current]);
                        setTrainingForm({ title: "", description: "", category: trainingCategories[0], type: "Capacitación", status: "Borrador", attachment: "" });
                        setTrainingFormError("");
                        setNotice(item.status === "Publicado" ? "La sección se publicó en esta sesión de demostración." : "El borrador se guardó localmente.");
                    }}>
                        <label>Título *
                            <input required maxLength="140" value={trainingForm.title} onChange={(event) => setTrainingForm((current) => ({ ...current, title: event.target.value }))} />
                        </label>
                        <label>Descripción *
                            <textarea required rows="4" value={trainingForm.description} onChange={(event) => setTrainingForm((current) => ({ ...current, description: event.target.value }))} />
                        </label>
                        <div className="training-admin-form__row">
                            <label>Categoría *
                                <select required value={trainingForm.category} onChange={(event) => setTrainingForm((current) => ({ ...current, category: event.target.value }))}>
                                    {trainingCategories.map((category) => <option key={category}>{category}</option>)}
                                </select>
                            </label>
                            <label>Tipo *
                                <select required value={trainingForm.type} onChange={(event) => setTrainingForm((current) => ({ ...current, type: event.target.value }))}>
                                    <option>Capacitación</option><option>Inducción</option>
                                </select>
                            </label>
                            <label>Estado de publicación *
                                <select required value={trainingForm.status} onChange={(event) => setTrainingForm((current) => ({ ...current, status: event.target.value }))}>
                                    <option>Publicado</option><option>Borrador</option>
                                </select>
                            </label>
                        </div>
                        <label>Imagen o archivo adjunto (opcional)
                            <input type="file" accept="image/*,.pdf,.doc,.docx,.ppt,.pptx" onChange={(event) => setTrainingForm((current) => ({ ...current, attachment: event.target.files?.[0] ? { name: event.target.files[0].name, type: event.target.files[0].type } : "" }))} />
                            <small>Solo se conserva el nombre y el tipo del archivo; no se realiza ninguna carga.</small>
                        </label>
                        {trainingFormError && <p className="training-admin-form__error" role="alert">{trainingFormError}</p>}
                        <button type="submit" className="training-button training-button--primary"><i className="bi bi-send" aria-hidden="true"></i> Guardar sección</button>
                    </form>
                    <div className="training-admin-list">
                        <h3>Secciones creadas en esta sesión</h3>
                        {publishedItems.length ? publishedItems.map((item) => (
                            <article key={item.id}>
                                <div><strong>{item.title}</strong><span>{item.type} · {item.category}</span></div>
                                <span className={`training-status-pill ${item.status === "Publicado" ? "is-published" : ""}`}>{item.status}</span>
                            </article>
                        )) : <p>Aún no se han creado secciones.</p>}
                    </div>
                    <div className="training-admin-roadmap">
                        <p>Esta administración es solo de frontend. Los datos no se guardan en un servidor y los archivos no se cargan.</p>
                    </div>
                </section>
            )}

            {activeResource && (
                <div
                    className="training-modal"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setActiveResource(null);
                        }
                    }}
                >
                    <section
                        className="training-modal__dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="training-resource-title"
                    >
                        <header className="training-modal__header">
                            <div>
                                <span className="training-eyebrow">{activeResource.category}</span>
                                <h2 id="training-resource-title">{activeResource.title}</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveResource(null)}
                                aria-label="Cerrar recurso"
                            >
                                <i className="bi bi-x-lg" aria-hidden="true"></i>
                            </button>
                        </header>
                        <div className="training-modal__body">
                            <span className="training-modal__type">
                                <i
                                    className={`bi ${resourceIcons[activeResource.type] || "bi-file-earmark"}`}
                                    aria-hidden="true"
                                ></i>
                                {activeResource.type}
                            </span>
                            <p>{activeResource.description}</p>
                            {activeResource.authorized && isSafeHttpUrl(activeResource.url) ? (
                                activeResource.type === "Video" ? (
                                    <video controls src={activeResource.url}>
                                        Tu navegador no puede reproducir este video.
                                    </video>
                                ) : activeResource.type === "Imagen" ? (
                                    <img src={activeResource.url} alt={activeResource.title} />
                                ) : activeResource.type === "PDF" ? (
                                    <iframe
                                        title={activeResource.title}
                                        src={activeResource.url}
                                    ></iframe>
                                ) : (
                                    <a
                                        href={activeResource.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Abrir recurso
                                    </a>
                                )
                            ) : (
                                <div className="training-modal__unavailable">
                                    <i className="bi bi-cloud-slash" aria-hidden="true"></i>
                                    <strong>Archivo o enlace no configurado</strong>
                                    <span>
                                        El recurso se muestra como contenido de ejemplo. No se ha cargado ni descargado ningún archivo.
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
};

export default Training;
