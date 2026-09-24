import { useState } from "react";
import "./profile.scss";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        fullName: "Evert Limber Cuevas",
        position: "Analista de Sistemas",
        department: "Tecnología",
        branch: "Sucursal Central",
        employeeCode: "EMP-00125",

        document: "XXXXXXXX",
        birthDate: "1990-01-01",
        phone: "XXXXXXXX",
        personalEmail: "correo@gmail.com",
        address: "Cochabamba, Bolivia",

        entryDate: "2024-01-15",
        supervisor: "XXXXX XXXXX",

        cv: "CV_Evert_Cuevas_2026.pdf",
        cvUpdated: "23/09/2026",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setProfile((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSave = (event) => {
        event.preventDefault();

        // Posteriormente:
        // frontend → API → backend → PostgreSQL

        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="profile-page">

            {/* ========================================= */}
            {/* CABECERA */}
            {/* ========================================= */}

            <div className="profile-page__header">

                <div>
                    <h1>Mi perfil</h1>

                    <p>
                        Consulta y administra tu información personal y laboral.
                    </p>
                </div>

                {!isEditing && (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setIsEditing(true)}
                    >
                        ✎ Editar perfil
                    </button>
                )}

            </div>


            <form onSubmit={handleSave}>

                {/* ========================================= */}
                {/* RESUMEN */}
                {/* ========================================= */}

                <section className="profile-card profile-summary">

                    <div className="profile-summary__photo">

                        <div className="profile-photo">
                            <span>FOTO</span>
                        </div>

                        {isEditing && (
                            <button
                                type="button"
                                className="profile-photo__button"
                            >
                                Cambiar foto
                            </button>
                        )}

                    </div>


                    <div className="profile-summary__information">

                        <h2>
                            {profile.fullName}
                        </h2>

                        <p className="profile-position">
                            {profile.position}
                        </p>

                        <p className="profile-department">
                            {profile.department}
                        </p>

                        <p className="profile-code">
                            Código empleado:
                            <strong>
                                {profile.employeeCode}
                            </strong>
                        </p>

                    </div>


                    <div className="profile-summary__completion">

                        <div className="completion-header">

                            <span>
                                Perfil completo
                            </span>

                            <strong>
                                85%
                            </strong>

                        </div>

                        <div className="progress">

                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: "85%" }}
                            />

                        </div>

                    </div>

                </section>


                {/* ========================================= */}
                {/* INFORMACIÓN PERSONAL */}
                {/* ========================================= */}

                <section className="profile-section">

                    <div className="profile-section__title">

                        <div>
                            <h2>
                                Información personal
                            </h2>

                            <span>
                                Datos personales del colaborador
                            </span>
                        </div>

                        {isEditing && (
                            <span className="editable-badge">
                                ✎ Campos editables
                            </span>
                        )}

                    </div>


                    <div className="profile-card profile-grid">

                        <ProfileField
                            label="Nombre completo"
                            name="fullName"
                            value={profile.fullName}
                            editing={isEditing}
                            onChange={handleChange}
                        />

                        <ProfileField
                            label="Documento"
                            name="document"
                            value={profile.document}
                            editing={isEditing}
                            onChange={handleChange}
                            locked
                        />

                        <ProfileField
                            label="Fecha de nacimiento"
                            name="birthDate"
                            value={profile.birthDate}
                            editing={isEditing}
                            onChange={handleChange}
                            type="date"
                        />

                        <ProfileField
                            label="Teléfono"
                            name="phone"
                            value={profile.phone}
                            editing={isEditing}
                            onChange={handleChange}
                        />

                        <ProfileField
                            label="Correo personal"
                            name="personalEmail"
                            value={profile.personalEmail}
                            editing={isEditing}
                            onChange={handleChange}
                            type="email"
                        />

                        <ProfileField
                            label="Dirección"
                            name="address"
                            value={profile.address}
                            editing={isEditing}
                            onChange={handleChange}
                        />

                    </div>

                </section>


                {/* ========================================= */}
                {/* INFORMACIÓN LABORAL */}
                {/* ========================================= */}

                <section className="profile-section">

                    <div className="profile-section__title">

                        <div>
                            <h2>
                                Información laboral
                            </h2>

                            <span>
                                Información administrada por Recursos Humanos
                            </span>
                        </div>

                    </div>


                    <div className="profile-card profile-grid">

                        <ProfileField
                            label="Código empleado"
                            name="employeeCode"
                            value={profile.employeeCode}
                            editing={isEditing}
                            onChange={handleChange}
                            locked
                        />

                        <ProfileField
                            label="Cargo"
                            name="position"
                            value={profile.position}
                            editing={isEditing}
                            onChange={handleChange}
                            locked
                        />

                        <ProfileField
                            label="Sucursal"
                            name="branch"
                            value={profile.branch}
                            editing={isEditing}
                            onChange={handleChange}
                            locked
                        />

                        <ProfileField
                            label="Departamento"
                            name="department"
                            value={profile.department}
                            editing={isEditing}
                            onChange={handleChange}
                            locked
                        />

                        <ProfileField
                            label="Fecha de ingreso"
                            name="entryDate"
                            value={profile.entryDate}
                            editing={isEditing}
                            onChange={handleChange}
                            locked
                            type="date"
                        />

                        <ProfileField
                            label="Supervisor"
                            name="supervisor"
                            value={profile.supervisor}
                            editing={isEditing}
                            onChange={handleChange}
                            locked
                        />

                    </div>

                </section>


                {/* ========================================= */}
                {/* DOCUMENTACIÓN */}
                {/* ========================================= */}

                <section className="profile-section">

                    <div className="profile-section__title">

                        <div>
                            <h2>
                                Documentación
                            </h2>

                            <span>
                                Documentos asociados a tu perfil
                            </span>
                        </div>

                    </div>


                    <div className="profile-card document-card">

                        <div className="document-card__icon">
                            📄
                        </div>


                        <div className="document-card__information">

                            <h3>
                                Currículum Vitae
                            </h3>

                            <p>
                                {profile.cv}
                            </p>

                            <small>
                                Actualizado: {profile.cvUpdated}
                            </small>

                        </div>


                        <div className="document-card__actions">

                            {/* VER */}
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                            >
                                Ver
                            </button>


                            {/* DESCARGAR */}
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                            >
                                Descargar
                            </button>


                            {/* ACTUALIZAR CV */}
                            {isEditing && (

                                <label className="btn btn-outline-success">

                                    Actualizar CV

                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        hidden
                                    />

                                </label>

                            )}

                        </div>

                    </div>

                </section>
                {/* ========================================= */}
                {/* ACCIONES DE EDICIÓN */}
                {/* ========================================= */}

                {isEditing && (

                    <div className="profile-actions">

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Guardar cambios
                        </button>

                    </div>

                )}

            </form>

        </div>
    );
};


/* ===================================================== */
/* CAMPO REUTILIZABLE */
/* ===================================================== */

const ProfileField = ({
    label,
    name,
    value,
    editing,
    onChange,
    type = "text",
    locked = false,
}) => {

    return (

        <div className="profile-field">

            <div className="profile-field__label">

                <span>
                    {label}
                </span>

                {locked && (
                    <span
                        className="profile-field__locked"
                        title="Campo administrado por Recursos Humanos"
                    >
                        🔒 RRHH
                    </span>
                )}

            </div>


            <div className="profile-field__value">

                {editing ? (

                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        disabled={locked}
                        className={`form-control ${
                            locked
                                ? "profile-field__input--locked"
                                : ""
                        }`}
                    />

                ) : (

                    <span>
                        {type === "date" && value
                            ? formatDate(value)
                            : value || "No registrado"
                        }
                    </span>

                )}

            </div>

        </div>

    );
};


/* ===================================================== */
/* FORMATO DE FECHA */
/* ===================================================== */

const formatDate = (date) => {

    if (!date) {
        return "No registrado";
    }

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
};


export default Profile;