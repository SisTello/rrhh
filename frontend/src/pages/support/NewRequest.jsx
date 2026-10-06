import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./support.scss";

const NewRequest = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        category: "Hardware",
        subject: "",
        description: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log("Solicitud:", formData);

        // Posteriormente:
        // enviarSolicitud(formData)
    };

    return (
        <div className="support-page new-request-page">

            <div className="support-page__header">
                <h1>NUEVA SOLICITUD</h1>
            </div>

            <div className="new-request-card">

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label
                            htmlFor="category"
                            className="form-label"
                        >
                            Categoría
                        </label>

                        <select
                            id="category"
                            name="category"
                            className="form-select"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="Hardware">
                                Hardware
                            </option>

                            <option value="Software">
                                Software
                            </option>

                            <option value="Accesos">
                                Accesos
                            </option>

                            <option value="Red">
                                Red
                            </option>

                            <option value="Impresoras">
                                Impresoras
                            </option>

                            <option value="Otros">
                                Otros
                            </option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="subject"
                            className="form-label"
                        >
                            Asunto
                        </label>

                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            className="form-control"
                            placeholder="Computadora no enciende"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="description"
                            className="form-label"
                        >
                            Descripción
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            rows="6"
                            placeholder="Describe detalladamente el problema..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="new-request-card__actions">

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => navigate("/soporte")}
                        >
                            CANCELAR
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            ENVIAR
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default NewRequest;