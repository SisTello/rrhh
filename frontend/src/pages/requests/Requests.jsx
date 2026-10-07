import { useState } from "react";
import {
    requestTypes,
    requestFormConfig,
} from "./requestsData";
import "./requests.scss";

const Requests = () => {

    const [selectedRequestType, setSelectedRequestType] =
        useState(null);

    const [formData, setFormData] = useState({});

    const openRequestModal = (type) => {

        const config = requestFormConfig[type];

        const initialData = {};

        config.fields.forEach((field) => {
            initialData[field.name] = "";
        });

        setFormData(initialData);

        setSelectedRequestType(type);
    };

    const closeRequestModal = () => {
        setSelectedRequestType(null);
        setFormData({});
    };

    const handleChange = (event) => {

        const { name, value, files } =
            event.target;

        setFormData((current) => ({
            ...current,
            [name]:
                event.target.type === "file"
                    ? files?.[0] || null
                    : value,
        }));
    };

    const handleSubmit = (event) => {

        event.preventDefault();

        closeRequestModal();
    };

    return (
        <div className="requests-page">

            <div className="requests-page__header">

                <div>
                    <h1>SOLICITUDES</h1>

                    <p>
                        Selecciona el tipo de solicitud
                        que deseas realizar.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                        document
                            .getElementById("request-types")
                            ?.scrollIntoView({
                                behavior: "smooth",
                            })
                    }
                >
                    <i className="bi bi-plus-lg"></i>
                    Nueva solicitud
                </button>

            </div>

            <section
                id="request-types"
                className="request-types"
            >

                <div className="request-types__grid">

                    {requestTypes.map((request) => (

                        <div
                            key={request.id}
                            className="request-type-card"
                        >

                            <div className="request-type-card__icon">

                                <i
                                    className={`bi ${request.icon}`}
                                ></i>

                            </div>

                            <h3>
                                {request.title}
                            </h3>

                            <p>
                                {request.description}
                            </p>

                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() =>
                                    openRequestModal(
                                        request.id
                                    )
                                }
                            >
                                Solicitar
                            </button>

                        </div>

                    ))}

                </div>

            </section>

            {/* MODAL */}

            {selectedRequestType && (
                <div className="request-modal">

                    <div
                        className="request-modal__overlay"
                        onClick={closeRequestModal}
                    />

                    <div className="request-modal__dialog">

                        <div className="request-modal__header">

                            <div>

                                <h2>
                                    {
                                        requestFormConfig[
                                            selectedRequestType
                                        ].title
                                    }
                                </h2>

                                <p>
                                    Completa la información
                                    requerida.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="request-modal__close"
                                onClick={closeRequestModal}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="request-modal__body">

                                <div className="row g-3">

                                    {requestFormConfig[
                                        selectedRequestType
                                    ].fields.map(
                                        (field) => (

                                            <div
                                                key={
                                                    field.name
                                                }
                                                className={
                                                    field.col ||
                                                    "col-12"
                                                }
                                            >

                                                <label
                                                    htmlFor={
                                                        field.name
                                                    }
                                                    className="form-label"
                                                >
                                                    {
                                                        field.label
                                                    }

                                                    {field.required && (
                                                        <span className="text-danger">
                                                            {" "}
                                                            *
                                                        </span>
                                                    )}
                                                </label>

                                                {field.type ===
                                                    "textarea" && (
                                                    <textarea
                                                        id={
                                                            field.name
                                                        }
                                                        name={
                                                            field.name
                                                        }
                                                        rows="4"
                                                        className="form-control"
                                                        required={
                                                            field.required
                                                        }
                                                        value={
                                                            formData[
                                                                field.name
                                                            ] ||
                                                            ""
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    />
                                                )}

                                                {field.type ===
                                                    "select" && (
                                                    <select
                                                        id={
                                                            field.name
                                                        }
                                                        name={
                                                            field.name
                                                        }
                                                        className="form-select"
                                                        required={
                                                            field.required
                                                        }
                                                        value={
                                                            formData[
                                                                field.name
                                                            ] ||
                                                            ""
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    >
                                                        <option value="">
                                                            Seleccionar...
                                                        </option>

                                                        {field.options.map(
                                                            (
                                                                option
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        option
                                                                    }
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {
                                                                        option
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                )}

                                                {field.type !==
                                                    "textarea" &&
                                                    field.type !==
                                                        "select" && (
                                                        <input
                                                            id={
                                                                field.name
                                                            }
                                                            name={
                                                                field.name
                                                            }
                                                            type={
                                                                field.type
                                                            }
                                                            min={
                                                                field.min
                                                            }
                                                            className="form-control"
                                                            required={
                                                                field.required
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                    )}

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                            <div className="request-modal__footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={
                                        closeRequestModal
                                    }
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    <i className="bi bi-send"></i>
                                    Enviar solicitud
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Requests;