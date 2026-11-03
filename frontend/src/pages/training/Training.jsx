import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { demoCurrentUser } from "../announcements/announcementsData";
import { initialRoles } from "../administrator/administratorData";

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

const resourceById = new Map(trainingResources.map((resource) => [resource.id, resource]));
const allowedResourceExtensions = new Set(["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "jpg", "jpeg", "png", "gif", "webp"]);

const createInitialCategories = () => [
    ...trainingCategories.map((name, index) => ({
        id: `category-${index}`,
        name,
        description: "",
        icon: "bi-folder2",
        parentId: "",
    })),
    { id: "subcategory-policy-internal", name: "Reglamentos internos", description: "", icon: "bi-file-earmark-text", parentId: "category-1" },
    { id: "subcategory-policy-external", name: "Reglamentos externos", description: "", icon: "bi-file-earmark-text", parentId: "category-1" },
    { id: "subcategory-general-procedures", name: "Procedimientos generales", description: "", icon: "bi-list-check", parentId: "category-1" },
    { id: "subcategory-maintenance", name: "Mantenimiento de equipo X", description: "", icon: "bi-tools", parentId: "category-3" },
    { id: "subcategory-inventory", name: "Control de inventario Y", description: "", icon: "bi-box-seam", parentId: "category-3" },
    { id: "subcategory-cleaning", name: "Limpieza general", description: "", icon: "bi-stars", parentId: "category-3" },
];

const demoPermissions = new Set(
    initialRoles
        .filter((role) => demoCurrentUser.roleIds.includes(role.id) && role.status === "Activo")
        .flatMap((role) => role.permissions),
);
const hasPermission = (permission) => demoPermissions.has(permission);
const isSafeHttpUrl = (value) => {
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch {
        return false;
    }
};

const formatDate = (date) =>
    new Intl.DateTimeFormat("es", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(`${date}T12:00:00`));

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
    const [libraryCategories, setLibraryCategories] = useState(createInitialCategories);
    const [libraryResources, setLibraryResources] = useState(trainingResources);
    const [activeCategoryId, setActiveCategoryId] = useState("");
    const [contentDialog, setContentDialog] = useState(null);
    const [contentForm, setContentForm] = useState({ kind: "Categoría", name: "", title: "", description: "", icon: "bi-folder2", parentId: "", categoryId: "", type: "Documento", url: "", file: null, tags: "", publishedAt: "", status: "Publicado" });
    const [contentError, setContentError] = useState("");
    const libraryResourcesRef = useRef(libraryResources);

    const canViewLibrary = hasPermission("training.library.view");
    const canManageCategories = hasPermission("training.categories.create") || hasPermission("training.categories.edit");
    const canManageCategoryStructure = canManageCategories || hasPermission("training.categories.delete") || hasPermission("training.subcategories.manage");
    const canUploadDocuments = hasPermission("training.documents.upload");
    const canManageVideos = hasPermission("training.videos.manage");
    const canManageLinks = hasPermission("training.links.manage");
    const canManageResources = hasPermission("training.resources.create") || canUploadDocuments || canManageVideos || canManageLinks;
    const canCreateCategory = hasPermission("training.categories.create");
    const canCreateSubcategory = hasPermission("training.subcategories.manage");
    const activeCategory = libraryCategories.find((category) => category.id === activeCategoryId);
    const categoryDialogCategoryId = contentForm.kind !== "Recurso" ? contentDialog?.item?.id : "";
    const invalidParentIds = useMemo(() => {
        const invalidIds = new Set(categoryDialogCategoryId ? [categoryDialogCategoryId] : []);
        let changed = true;
        while (changed) {
            changed = false;
            libraryCategories.forEach((category) => {
                if (invalidIds.has(category.parentId) && !invalidIds.has(category.id)) {
                    invalidIds.add(category.id);
                    changed = true;
                }
            });
        }
        return invalidIds;
    }, [categoryDialogCategoryId, libraryCategories]);
    const activeCategoryPath = useMemo(() => {
        const path = [];
        let current = activeCategory;
        while (current) {
            path.unshift(current);
            current = libraryCategories.find((category) => category.id === current.parentId);
        }
        return path;
    }, [activeCategory, libraryCategories]);

    useEffect(() => {
        libraryResourcesRef.current = libraryResources;
    }, [libraryResources]);

    useEffect(() => () => {
        libraryResourcesRef.current.forEach((resource) => {
            if (resource.url?.startsWith("blob:")) URL.revokeObjectURL(resource.url);
        });
    }, []);

    const visibleResources = useMemo(() => {
        const normalizedSearch = search.trim().toLocaleLowerCase("es");
        const descendantIds = new Set([activeCategoryId]);
        let changed = true;
        while (changed) {
            changed = false;
            libraryCategories.forEach((category) => {
                if (descendantIds.has(category.parentId) && !descendantIds.has(category.id)) {
                    descendantIds.add(category.id);
                    changed = true;
                }
            });
        }
        const categoryNames = new Set(libraryCategories.filter((category) => descendantIds.has(category.id)).map((category) => category.name));

        return libraryResources.filter((resource) => {
            const allowedByConfidentiality =
                trainingAccess.canViewConfidential || !resource.confidential;
            const matchesCategory =
                (!activeCategoryId || categoryNames.has(resource.category)) &&
                (!categoryFilter || resource.category === categoryFilter);
            const matchesSearch =
                !normalizedSearch ||
                `${resource.title} ${resource.description} ${resource.category} ${resource.type}`
                    .toLocaleLowerCase("es")
                    .includes(normalizedSearch);

            const allowedByPublication = resource.status !== "Borrador" || canManageResources;
            return allowedByConfidentiality && allowedByPublication && matchesCategory && matchesSearch;
        });
    }, [activeCategoryId, canManageResources, categoryFilter, libraryCategories, libraryResources, search]);

    const completedCount = completedModules.length;
    const totalModules = mockOnboardingProgram.modules.length;
    const progress = Math.round((completedCount / totalModules) * 100);

    const toggleModuleCompletion = (moduleId) => {
        setCompletedModules((current) =>
            current.includes(moduleId)
                ? current.filter((id) => id !== moduleId)
                : [...current, moduleId],
        );
        setNotice("Progreso de demostración actualizado. No se ha guardado en el servidor.");
    };

    const openContentForm = (kind = "Categoría", mode = "create", item = null) => {
        const categoryType = kind === "Recurso"
            ? item?.type === "Video" ? "Video" : item?.type === "Enlace externo" ? "Enlace externo" : "Documento"
            : "Documento";
        setContentForm({
            kind,
            name: item?.name || "",
            title: item?.title || "",
            description: item?.description || "",
            icon: item?.icon || "bi-folder2",
            parentId: item?.parentId || (kind === "Subcategoría" ? activeCategoryId : ""),
            categoryId: item?.categoryId || activeCategoryId || libraryCategories[0]?.id || "",
            type: categoryType,
            url: item?.url?.startsWith("blob:") ? "" : item?.url || "",
            file: null,
            tags: Array.isArray(item?.tags) ? item.tags.join(", ") : "",
            publishedAt: item?.publishedAt || "",
            status: item?.status || "Publicado",
        });
        setContentError("");
        setContentDialog({ kind, mode, item });
    };

    const saveLibraryItem = (event) => {
        event.preventDefault();
        const { mode, item } = contentDialog;
        const kind = contentForm.kind;
        const name = contentForm.name.trim();
        const title = contentForm.title.trim();
        if (kind !== "Recurso") {
            if (mode === "create" && kind === "Categoría" && !hasPermission("training.categories.create")) {
                setContentError("Tu rol no tiene permiso para crear categorías.");
                return;
            }
            if (mode === "create" && kind === "Subcategoría" && !canCreateSubcategory) {
                setContentError("Tu rol no tiene permiso para crear subcategorías.");
                return;
            }
            if (mode === "edit" && !hasPermission("training.categories.edit")) {
                setContentError("Tu rol no tiene permiso para editar categorías.");
                return;
            }
            const duplicate = libraryCategories.some((category) =>
                category.id !== item?.id &&
                category.parentId === contentForm.parentId &&
                category.name.trim().toLocaleLowerCase("es") === name.toLocaleLowerCase("es"),
            );
            if (!name || duplicate) {
                setContentError(duplicate ? "Ya existe una categoría con ese nombre en este nivel." : "Ingresa el nombre de la categoría.");
                return;
            }
            if (contentForm.parentId && invalidParentIds.has(contentForm.parentId)) {
                setContentError("No puedes mover una categoría dentro de sí misma o de una subcategoría.");
                return;
            }
            if (mode === "edit") {
                setLibraryCategories((current) => current.map((category) =>
                    category.id === item.id ? { ...category, name, description: contentForm.description.trim(), icon: contentForm.icon, parentId: contentForm.parentId } : category,
                ));
            } else {
                if (mode === "create" && !hasPermission("training.resources.create") && !canUploadDocuments && !canManageVideos && !canManageLinks) {
                    setContentError("Tu rol no tiene permiso para crear recursos.");
                    return;
                }
                if (mode === "edit" && !hasPermission("training.resources.edit")) {
                    setContentError("Tu rol no tiene permiso para editar recursos.");
                    return;
                }
                const id = `category-${Date.now()}`;
                setLibraryCategories((current) => [...current, { id, name, description: contentForm.description.trim(), icon: contentForm.icon, parentId: contentForm.parentId }]);
                setActiveCategoryId(id);
            }
        } else {
            const selectedCategory = libraryCategories.find((category) => category.id === contentForm.categoryId);
            if (!title || !contentForm.description.trim() || !selectedCategory) {
                setContentError("Completa el título, la descripción y la categoría.");
                return;
            }
            if (contentForm.type === "Video" || contentForm.type === "Enlace externo") {
                if (!isSafeHttpUrl(contentForm.url)) {
                    setContentError("Ingresa una URL válida que comience con http:// o https://.");
                    return;
                }
            }
            if (contentForm.type === "Documento" && !canUploadDocuments && !hasPermission("training.resources.create") && mode !== "edit") {
                setContentError("Tu rol no tiene permiso para cargar documentos.");
                return;
            }
            if (contentForm.type === "Video" && !canManageVideos && !hasPermission("training.resources.create") && mode !== "edit") {
                setContentError("Tu rol no tiene permiso para gestionar videos.");
                return;
            }
            if (contentForm.type === "Enlace externo" && !canManageLinks && !hasPermission("training.resources.create") && mode !== "edit") {
                setContentError("Tu rol no tiene permiso para gestionar enlaces externos.");
                return;
            }
            if (contentForm.type === "Documento" && !contentForm.file && (
                mode === "create" || !item?.url || item.type === "Video" || item.type === "Enlace externo"
            )) {
                setContentError("Selecciona el documento que deseas agregar.");
                return;
            }
            const extension = contentForm.file?.name.split(".").pop()?.toLowerCase();
            if (contentForm.file && !allowedResourceExtensions.has(extension)) {
                setContentError("El formato del documento no es compatible.");
                return;
            }
            if (contentForm.file && contentForm.file.size > 10 * 1024 * 1024) {
                setContentError("El archivo no puede superar 10 MB.");
                return;
            }
            const url = contentForm.file ? URL.createObjectURL(contentForm.file) : contentForm.url.trim() || item?.url || "";
            const resource = {
                ...item,
                id: item?.id || `library-${Date.now()}`,
                title,
                description: contentForm.description.trim(),
                category: selectedCategory.name,
                categoryId: selectedCategory.id,
                type: contentForm.type === "Documento" && (contentForm.file?.type === "application/pdf" || (!contentForm.file && item?.type === "PDF")) ? "PDF" : contentForm.type,
                size: contentForm.file ? `${(contentForm.file.size / 1024 / 1024).toFixed(2)} MB` : contentForm.type === "Video" ? "Video externo" : item?.size || "Enlace externo",
                url,
                mimeType: contentForm.file?.type || item?.mimeType || (contentForm.type === "Video" ? "video/*" : ""),
                authorized: true,
                confidential: false,
                tags: contentForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
                publishedAt: contentForm.publishedAt,
                status: contentForm.status,
            };
            if (mode === "edit" && item.url?.startsWith("blob:") && contentForm.file && item.url !== url) URL.revokeObjectURL(item.url);
            setLibraryResources((current) => mode === "edit"
                ? current.map((entry) => entry.id === resource.id ? resource : entry)
                : [resource, ...current]);
        }
        setContentDialog(null);
        setContentError("");
        setNotice(`${mode === "edit" ? "Los cambios se guardaron" : "El elemento se creó"} únicamente en esta sesión de demostración.`);
    };

    const deleteCategory = (category) => {
        const hasChildren = libraryCategories.some((item) => item.parentId === category.id);
        const hasResources = libraryResources.some((resource) => resource.categoryId === category.id || resource.category === category.name);
        if (hasChildren || hasResources) {
            setNotice("No se puede eliminar una categoría que contiene subcategorías o recursos.");
            return;
        }
        if (!window.confirm(`¿Eliminar la categoría "${category.name}" de esta sesión local?`)) return;
        setLibraryCategories((current) => current.filter((item) => item.id !== category.id));
        setActiveCategoryId(category.parentId || "");
    };

    const renderResourceActions = (resource) => {
        const hasApprovedUrl = resource.authorized && (
            isSafeHttpUrl(resource.url) || resource.url?.startsWith("blob:")
        );

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
                        target={resource.type === "Enlace externo" || resource.type === "Video" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        download={resource.type !== "Enlace externo" && resource.type !== "Video" ? resource.title : undefined}
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
                {hasPermission("training.resources.edit") && <button type="button" className="training-button training-button--secondary" onClick={() => openContentForm("Recurso", "edit", resource)}>Editar</button>}
                {hasPermission("training.resources.delete") && <button type="button" className="training-button training-button--secondary" onClick={() => {
                    if (!window.confirm(`¿Eliminar el recurso "${resource.title}" de esta sesión local?`)) return;
                    if (resource.url?.startsWith("blob:")) URL.revokeObjectURL(resource.url);
                    setLibraryResources((current) => current.filter((entry) => entry.id !== resource.id));
                    setNotice("Recurso eliminado de la demostración local.");
                }}>Eliminar</button>}
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
                {sections.filter((item) =>
                    (item.id !== "library" || canViewLibrary) &&
                    (item.id !== "administration" || canManageCategoryStructure || canManageResources),
                ).map((item) => (
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
                        {(canManageResources || canCreateCategory || canCreateSubcategory) && <button type="button" className="training-button training-button--primary" onClick={() => openContentForm(canCreateCategory ? "Categoría" : canCreateSubcategory ? "Subcategoría" : "Recurso")}><i className="bi bi-plus-lg" aria-hidden="true"></i> Crear nuevo</button>}
                    </div>

                    {!canViewLibrary ? <div className="training-empty-callout" role="alert"><i className="bi bi-lock"></i><p>Tu rol de demostración no tiene permiso para consultar la biblioteca.</p></div> : (
                    <>
                    <div className="training-category-toolbar">
                        <div className="training-category-breadcrumbs">
                            <button type="button" onClick={() => setActiveCategoryId("")}>Biblioteca</button>
                            {activeCategoryPath.map((category, index) => <Fragment key={category.id}><span aria-hidden="true">/</span>{index < activeCategoryPath.length - 1 ? <button type="button" onClick={() => setActiveCategoryId(category.id)}>{category.name}</button> : <strong>{category.name}</strong>}</Fragment>)}
                        </div>
                        <div className="training-category-toolbar__actions">
                            {activeCategory && hasPermission("training.categories.edit") && <button type="button" className="training-button training-button--secondary" onClick={() => openContentForm(activeCategory.parentId ? "Subcategoría" : "Categoría", "edit", activeCategory)}>Editar categoría</button>}
                            {activeCategory && hasPermission("training.categories.delete") && <button type="button" className="training-button training-button--secondary" onClick={() => deleteCategory(activeCategory)}>Eliminar categoría</button>}
                            {activeCategory && <button type="button" className="training-button training-button--secondary" onClick={() => setActiveCategoryId(activeCategory.parentId || "")}><i className="bi bi-arrow-left" aria-hidden="true"></i> Volver</button>}
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
                                {libraryCategories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {libraryCategories.filter((category) => category.parentId === activeCategoryId).length > 0 && (
                        <div className="training-category-list" aria-label="Categorías">
                            {libraryCategories.filter((category) => category.parentId === activeCategoryId).map((category) => (
                                <div className="training-category-list__item" key={category.id}>
                                    <button type="button" onClick={() => setActiveCategoryId(category.id)}><i className={`bi ${category.icon || "bi-folder2"}`} aria-hidden="true"></i><span><strong>{category.name}</strong><small>{category.description || "Abrir categoría"}</small></span><i className="bi bi-chevron-right" aria-hidden="true"></i></button>
                                    {hasPermission("training.categories.edit") && <button type="button" aria-label={`Editar ${category.name}`} onClick={() => openContentForm(category.parentId ? "Subcategoría" : "Categoría", "edit", category)}><i className="bi bi-pencil"></i></button>}
                                    {hasPermission("training.categories.delete") && <button type="button" aria-label={`Eliminar ${category.name}`} onClick={() => deleteCategory(category)}><i className="bi bi-trash"></i></button>}
                                </div>
                            ))}
                        </div>
                    )}
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
                                    <div className="training-resource__details">{resource.tags?.length > 0 && <span>Etiquetas: {resource.tags.join(", ")}</span>}{resource.publishedAt && <span>Publicado: {formatDate(resource.publishedAt)}</span>}{resource.status && <span>Estado: {resource.status}</span>}</div>
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
                    </>
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

            {contentDialog && (
                <div className="training-modal" onClick={(event) => { if (event.target === event.currentTarget) setContentDialog(null); }}>
                    <section className="training-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="training-content-dialog-title">
                        <header className="training-modal__header"><h2 id="training-content-dialog-title">{contentDialog.mode === "edit" ? `Editar ${contentForm.kind.toLocaleLowerCase("es")}` : "Crear nuevo"}</h2><button type="button" aria-label="Cerrar" onClick={() => setContentDialog(null)}><i className="bi bi-x-lg"></i></button></header>
                        <form className="training-admin-form" onSubmit={saveLibraryItem}>
                            {contentDialog.mode === "create" && <label>Tipo de contenido *<select value={contentForm.kind} onChange={(event) => setContentForm((current) => ({ ...current, kind: event.target.value }))}>{canCreateCategory && <option>Categoría</option>}{canCreateSubcategory && <option>Subcategoría</option>}{canManageResources && <option>Recurso</option>}</select></label>}
                            {contentForm.kind === "Recurso" ? (
                                <>
                                    <label>Título *<input required maxLength="140" value={contentForm.title} onChange={(event) => setContentForm((current) => ({ ...current, title: event.target.value }))} /></label>
                                    <label>Descripción *<textarea required rows="3" value={contentForm.description} onChange={(event) => setContentForm((current) => ({ ...current, description: event.target.value }))} /></label>
                                    <label>Categoría o subcategoría *<select required value={contentForm.categoryId} onChange={(event) => setContentForm((current) => ({ ...current, categoryId: event.target.value }))}><option value="">Selecciona una categoría</option>{libraryCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
                                    <label>Tipo de recurso *<select value={contentForm.type} onChange={(event) => setContentForm((current) => ({ ...current, type: event.target.value, url: "", file: null }))}>{(canUploadDocuments || hasPermission("training.resources.create") || contentDialog.mode === "edit") && <option>Documento</option>}{(canManageVideos || hasPermission("training.resources.create") || contentDialog.mode === "edit") && <option>Video</option>}{(canManageLinks || hasPermission("training.resources.create") || contentDialog.mode === "edit") && <option>Enlace externo</option>}</select></label>
                                    {contentForm.type === "Documento" ? <label>Documento {contentDialog.mode === "create" ? "*" : "(opcional)"}<input type="file" required={contentDialog.mode === "create"} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,image/*" onChange={(event) => setContentForm((current) => ({ ...current, file: event.target.files?.[0] || null }))} /><small>Archivo local de demostración; máximo 10 MB. No se carga a un servidor.</small></label> : <label>{contentForm.type === "Video" ? "URL del video *" : "URL externa *"}<input type="url" required placeholder="https://..." value={contentForm.url} onChange={(event) => setContentForm((current) => ({ ...current, url: event.target.value }))} /><small>Solo se aceptan enlaces HTTP o HTTPS.</small></label>}
                                    <label>Etiquetas<input value={contentForm.tags} onChange={(event) => setContentForm((current) => ({ ...current, tags: event.target.value }))} placeholder="Inducción, políticas" /></label>
                                    <div className="training-admin-form__row"><label>Fecha de publicación<input type="date" value={contentForm.publishedAt} onChange={(event) => setContentForm((current) => ({ ...current, publishedAt: event.target.value }))} /></label><label>Estado<select value={contentForm.status} onChange={(event) => setContentForm((current) => ({ ...current, status: event.target.value }))}><option>Publicado</option><option>Borrador</option></select></label></div>
                                </>
                            ) : (
                                <>
                                    <label>Nombre {contentForm.kind === "Categoría" ? "de categoría" : "de subcategoría"} *<input required maxLength="100" value={contentForm.name} onChange={(event) => setContentForm((current) => ({ ...current, name: event.target.value }))} /></label>
                                    <label>Descripción<textarea rows="3" value={contentForm.description} onChange={(event) => setContentForm((current) => ({ ...current, description: event.target.value }))} /></label>
                                    {contentForm.kind === "Categoría" && <label>Icono (opcional)<input placeholder="bi-folder2" value={contentForm.icon} onChange={(event) => setContentForm((current) => ({ ...current, icon: event.target.value }))} /></label>}
                                    <label>Categoría superior{contentForm.kind === "Subcategoría" ? " *" : ""}<select required={contentForm.kind === "Subcategoría"} value={contentForm.parentId} onChange={(event) => setContentForm((current) => ({ ...current, parentId: event.target.value }))}><option value="">Sin categoría superior</option>{libraryCategories.filter((category) => !invalidParentIds.has(category.id)).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
                                </>
                            )}
                            {contentError && <p className="training-admin-form__error" role="alert">{contentError}</p>}
                            <footer><button type="button" className="training-button training-button--secondary" onClick={() => setContentDialog(null)}>Cancelar</button><button type="submit" className="training-button training-button--primary">Guardar</button></footer>
                        </form>
                    </section>
                </div>
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
                            {activeResource.authorized && (isSafeHttpUrl(activeResource.url) || activeResource.url?.startsWith("blob:")) ? (
                                activeResource.type === "Video" ? (
                                    <video controls src={activeResource.url}>
                                        Tu navegador no puede reproducir este video.
                                    </video>
                                ) : activeResource.type === "Imagen" || activeResource.mimeType?.startsWith("image/") ? (
                                    <img src={activeResource.url} alt={activeResource.title} />
                                ) : activeResource.type === "PDF" || activeResource.mimeType === "application/pdf" ? (
                                    <iframe
                                        title={activeResource.title}
                                        src={activeResource.url}
                                    ></iframe>
                                ) : (
                                    <a
                                        href={activeResource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
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
                            {activeResource.type === "Video" && isSafeHttpUrl(activeResource.url) && <p><a href={activeResource.url} target="_blank" rel="noopener noreferrer">Abrir video en una pestaña nueva</a></p>}
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
};

export default Training;
