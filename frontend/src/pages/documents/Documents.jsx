import { useMemo, useState } from "react";
import "./documents.scss";


const categories = [
    {
        id: 1,
        name: "Solicitudes",
        count: 24,
        icon: "📄",
    },
    {
        id: 2,
        name: "Cartas",
        count: 12,
        icon: "✉",
    },
    {
        id: 3,
        name: "Manuales",
        count: 8,
        icon: "📘",
    },
    {
        id: 4,
        name: "Instructivos",
        count: 15,
        icon: "📑",
    },
    {
        id: 5,
        name: "Formularios",
        count: 18,
        icon: "📋",
    },
    {
        id: 6,
        name: "Reglamentos",
        count: 7,
        icon: "⚖",
    },
];


const documents = [
    {
        id: 1,
        name: "Solicitud de vacaciones",
        area: "RRHH",
        branch: "Todas",
        type: "Solicitud",
        category: "Solicitudes",
        date: "24/09/2026",
        icon: "📄",
    },
    {
        id: 2,
        name: "Manual de usuario",
        area: "Sistemas",
        branch: "Todas",
        type: "Manual",
        category: "Manuales",
        date: "22/09/2026",
        icon: "📘",
    },
    {
        id: 3,
        name: "Carta laboral",
        area: "RRHH",
        branch: "Central",
        type: "Carta",
        category: "Cartas",
        date: "20/09/2026",
        icon: "✉",
    },
    {
        id: 4,
        name: "Instructivo de asistencia",
        area: "RRHH",
        branch: "Todas",
        type: "Instructivo",
        category: "Instructivos",
        date: "18/09/2026",
        icon: "📑",
    },
];

const isValidFileUrl = (value) => {
    if (!value) return false;
    try {
        const url = new URL(value, window.location.origin);
        return ["http:", "https:", "blob:"].includes(url.protocol);
    } catch {
        return false;
    }
};

const Documents = () => {

    const [search, setSearch] = useState("");
    const [selectedDocument, setSelectedDocument] = useState(null);
    const fileAvailable = isValidFileUrl(selectedDocument?.fileUrl);

    const [filters, setFilters] = useState({
        category: "",
        area: "",
        branch: "",
        type: "",
    });


    const handleFilterChange = (event) => {

        const { name, value } = event.target;

        setFilters((current) => ({
            ...current,
            [name]: value,
        }));
    };


    const filteredDocuments = useMemo(() => {

        return documents.filter((document) => {

            const searchValue = search.toLowerCase();

            const matchesSearch =
                document.name
                    .toLowerCase()
                    .includes(searchValue);


            const matchesCategory =
                !filters.category ||
                document.category === filters.category;


            const matchesArea =
                !filters.area ||
                document.area === filters.area;


            const matchesBranch =
                !filters.branch ||
                document.branch === filters.branch ||
                document.branch === "Todas";


            const matchesType =
                !filters.type ||
                document.type === filters.type;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesArea &&
                matchesBranch &&
                matchesType
            );
        });

    }, [search, filters]);


    return (
        <div className="documents-page">

            {/* ========================================= */}
            {/* CABECERA */}
            {/* ========================================= */}

            <div className="documents-page__header">

                <h1>
                    Documentos
                </h1>

                <p>
                    Biblioteca documental empresarial
                </p>

            </div>


            {/* ========================================= */}
            {/* BUSCADOR */}
            {/* ========================================= */}

            <div className="documents-search">

                <span className="documents-search__icon">
                    🔎
                </span>

                <input
                    type="search"
                    placeholder="Buscar documentos..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />

            </div>


            {/* ========================================= */}
            {/* FILTROS */}
            {/* ========================================= */}

            <div className="documents-filters">

                <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                >
                    <option value="">
                        Categoría
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.name}
                        >
                            {category.name}
                        </option>
                    ))}

                </select>


                <select
                    name="area"
                    value={filters.area}
                    onChange={handleFilterChange}
                >
                    <option value="">
                        Área
                    </option>

                    <option value="RRHH">
                        RRHH
                    </option>

                    <option value="Sistemas">
                        Sistemas
                    </option>

                    <option value="Administración">
                        Administración
                    </option>

                </select>


                <select
                    name="branch"
                    value={filters.branch}
                    onChange={handleFilterChange}
                >
                    <option value="">
                        Sucursal
                    </option>

                    <option value="Central">
                        Central
                    </option>

                    <option value="Norte">
                        Norte
                    </option>

                    <option value="Sur">
                        Sur
                    </option>

                </select>


                <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                >
                    <option value="">
                        Tipo
                    </option>

                    <option value="Solicitud">
                        Solicitud
                    </option>

                    <option value="Carta">
                        Carta
                    </option>

                    <option value="Manual">
                        Manual
                    </option>

                    <option value="Instructivo">
                        Instructivo
                    </option>

                </select>

            </div>


            {/* ========================================= */}
            {/* CATEGORÍAS */}
            {/* ========================================= */}

            <div className="documents-categories">

                {categories.map((category) => (

                    <button
                        type="button"
                        className="document-category"
                        key={category.id}
                        onClick={() =>
                            setFilters((current) => ({
                                ...current,
                                category:
                                    current.category === category.name
                                        ? ""
                                        : category.name,
                            }))
                        }
                    >

                        <span className="document-category__icon">
                            {category.icon}
                        </span>

                        <span className="document-category__name">
                            {category.name}
                        </span>

                        <span className="document-category__count">
                            {category.count}
                        </span>

                    </button>

                ))}

            </div>


            {/* ========================================= */}
            {/* DOCUMENTOS RECIENTES */}
            {/* ========================================= */}

            <section className="documents-recent">

                <div className="documents-recent__header">

                    <div>
                        <h2>
                            Documentos recientes
                        </h2>

                        <span>
                            Últimos documentos disponibles
                        </span>
                    </div>

                </div>


                <div className="documents-table-wrapper">

                    <table className="documents-table">

                        <thead>
                            <tr>
                                <th>
                                    Documento
                                </th>

                                <th>
                                    Área
                                </th>

                                <th>
                                    Fecha
                                </th>

                                <th>
                                    Acciones
                                </th>
                            </tr>
                        </thead>


                        <tbody>

                            {filteredDocuments.length > 0 ? (

                                filteredDocuments.map((document) => (

                                    <tr key={document.id}>

                                        <td>

                                            <div className="document-name">

                                                <span>
                                                    {document.icon}
                                                </span>

                                                <div>
                                                    <strong>
                                                        {document.name}
                                                    </strong>

                                                    <small>
                                                        {document.category}
                                                    </small>
                                                </div>

                                            </div>

                                        </td>


                                        <td>
                                            {document.area}
                                        </td>


                                        <td>
                                            {document.date}
                                        </td>


                                        <td>

                                            <div className="document-actions">

                                                <button
                                                    type="button"
                                                    className="document-action document-action--view"
                                                    title="Vista previa"
                                                    aria-label={`Vista previa de ${document.name}`}
                                                    onClick={() => setSelectedDocument(document)}
                                                >
                                                    <i className="bi bi-eye" aria-hidden="true"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="document-action document-action--download"
                                                    title={isValidFileUrl(document.fileUrl) ? "Descargar documento" : "Descarga no disponible"}
                                                    aria-label={`Descargar ${document.name}`}
                                                    onClick={() => setSelectedDocument({ ...document, showDownloadMessage: true })}
                                                >
                                                    <i className="bi bi-download" aria-hidden="true"></i>
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="documents-empty"
                                    >
                                        No se encontraron documentos.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </section>

            {selectedDocument && (
                <div className="document-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedDocument(null); }}>
                    <section className="document-modal" role="dialog" aria-modal="true" aria-labelledby="document-preview-title">
                        <header>
                            <div><h2 id="document-preview-title">{selectedDocument.showDownloadMessage ? "Descargar documento" : "Vista previa del documento"}</h2><p>{selectedDocument.name}</p></div>
                            <button type="button" aria-label="Cerrar" onClick={() => setSelectedDocument(null)}><i className="bi bi-x-lg" aria-hidden="true"></i></button>
                        </header>
                        {fileAvailable ? (
                            <>
                                {!selectedDocument.showDownloadMessage && <iframe title={`Vista previa de ${selectedDocument.name}`} src={selectedDocument.fileUrl}></iframe>}
                                <div className="document-modal__actions">
                                    <a className="btn btn-primary" href={selectedDocument.fileUrl} download={selectedDocument.name} target={selectedDocument.fileUrl.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                                        <i className="bi bi-download" aria-hidden="true"></i> Descargar archivo
                                    </a>
                                </div>
                            </>
                        ) : (
                            <p className="document-unavailable" role="status">
                                <i className="bi bi-file-earmark-x" aria-hidden="true"></i>
                                {selectedDocument.showDownloadMessage
                                    ? "No hay un archivo adjunto disponible para descargar."
                                    : "La vista previa no está disponible porque este documento de ejemplo no tiene un archivo adjunto."}
                            </p>
                        )}
                        <footer><button type="button" className="btn btn-outline-secondary" onClick={() => setSelectedDocument(null)}>Cerrar</button></footer>
                    </section>
                </div>
            )}

        </div>
    );
};


export default Documents;