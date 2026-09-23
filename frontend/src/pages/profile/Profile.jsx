import { useState } from "react";
import "./profile.scss";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        fullName: "Evert Limber Cuevas",
        position: "Analista de Sistemas",
        department: "Tecnología",
        employeeCode: "EMP-00125",

        document: "XXXXXXXX",
        birthDate: "XX/XX/XXXX",
        phone: "XXXXXXXX",
        personalEmail: "correo@gmail.com",
        address: "XXXXX",

        entryDate: "XX/XX/XXXX",
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

        /*
         * Por el momento solamente actualizamos el estado local.
         *
         * Posteriormente aquí conectaremos:
         * frontend → backend → PostgreSQL
         */
        setIsEditing(false);
    };

    return (
        <div className="profile-page">

            {/* TÍTULO */}
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
                        Editar perfil
                    </button>
                )}
            </div>

            <form onSubmit={handleSave}>

                {/* ============================= */}
                {/* RESUMEN DEL PERFIL */}
                {/* ============================= */}

                <section className="profile-card profile-summary">

                    <div className="profile-summary__photo">
                        <div className="profile-photo">
                            <span>FOTO</span>
                        </div>
                    </div>

                    <div className="profile-summary__information">

                        {isEditing ? (
                            <div className="profile-summary__name-edit">
                                <label htmlFor="fullName">
                                    Nombre completo
                                </label>

                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    value={profile.fullName}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        ) : (
                            <h2>{profile.fullName}</h2>
                        )}

                        <p className="profile-position">
                            {profile.position}
                        </p>

                        <p className="profile-department">
                            {profile.department}
                        </p>

                        <p className="profile-code">
                            Código: <strong>{profile.employeeCode}</strong>
                        </p>

                    </div>

                    <div className="profile-summary__completion">

                        <div className="completion-header">
                            <span>Perfil completo</span>
                            <strong>85%</strong>
                        </div>

                        <div className="progress">
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: "85%" }}
                                aria-valuenow="85"
                                aria-valuemin="0"
                                aria-valuemax="100"
                            />
                        </div>

                    </div>

                </section>

                {/* ============================= */}
                {/* INFORMACIÓN PERSONAL */}
                {/* ============================= */}

                <section className="profile-section">

                    <div className="profile-section__title">
                        <h2>Información personal</h2>
                        <span>
                            Datos personales del colaborador
                        </span>
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
                        />

                        <ProfileField
                            label="Fecha de nacimiento"
                            name="birthDate"
                            value={profile.birthDate}
                            editing={isEditing}
                            onChange={handleChange}
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

                {/* ============================= */}
                {/* INFORMACIÓN LABORAL */}
                {/* ============================= */}

                <section className="profile-section">

                    <div className="profile-section__title">
                        <h2>Información laboral</h2>
                        <span>
                            Información relacionada con tu vínculo laboral
                        </span>
                    </div>

                    <div className="profile-card profile-grid">

                        <ProfileField
                            label="Cargo"
                            name="position"
                            value={profile.position}
                            editing={isEditing}
                            onChange={handleChange}
                        />

                        <ProfileField
                            label="Departamento"
                            name="department"
                            value={profile.department}
                            editing={isEditing}
                            onChange={handleChange}
                        />

                        <ProfileField
                            label="Fecha de ingreso"
                            name="entryDate"
                            value={profile.entryDate}
                            editing={isEditing}
                            onChange={handleChange}
                        />

                        <ProfileField
                            label="Supervisor"
                            name="supervisor"
                            value={profile.supervisor}
                            editing={isEditing}
                            onChange={handleChange}
                        />

                    </div>

                </section>

                {/* ============================= */}
                {/* DOCUMENTACIÓN */}
                {/* ============================= */}

                <section className="profile-section">

                    <div className="profile-section__title">
                        <h2>Documentación</h2>
                        <span>
                            Documentos asociados a tu perfil
                        </span>
                    </div>

                    <div className="profile-card document-card">

                        <div className="document-card__icon">
                            📄
                        </div>

                        <div className="document-card__information">

                            <h3>Currículum Vitae</h3>

                            <p>
                                {profile.cv}
                            </p>

                            <small>
                                Actualizado: {profile.cvUpdated}
                            </small>

                        </div>

                        <div className="document-card__actions">

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                            >
                                Ver
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-primary"
                            >
                                Descargar
                            </button>

                            {isEditing && (
                                <button
                                    type="button"
                                    className="btn btn-outline-success"
                                >
                                    Actualizar CV
                                </button>
                            )}

                        </div>

                    </div>

                </section>

                {/* ============================= */}
                {/* BOTONES DE EDICIÓN */}
                {/* ============================= */}

                {isEditing && (
                    <div className="profile-actions">

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setIsEditing(false)}
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


/*
 * Componente reutilizable para los campos
 * del perfil.
 */
const ProfileField = ({
    label,
    name,
    value,
    editing,
    onChange,
    type = "text",
}) => {
    return (
        <div className="profile-field">

            <div className="profile-field__label">
                {label}
            </div>

            <div className="profile-field__value">

                {editing ? (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className="form-control"
                    />
                ) : (
                    <span>{value || "No registrado"}</span>
                )}

            </div>

        </div>
    );
};

export default Profile;