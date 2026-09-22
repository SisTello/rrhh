import "./Login.scss";

const Login = () => {
    return (
        <main className="login-page">
            <div className="animated-background" aria-hidden="true">
                <span className="animated-square square-blue"></span>
                <span className="animated-square square-red"></span>
                <span className="animated-square square-yellow"></span>
                <span className="animated-square square-green"></span>

                <span className="animated-square square-blue square-2"></span>
                <span className="animated-square square-red square-2"></span>
                <span className="animated-square square-yellow square-2"></span>
                <span className="animated-square square-green square-2"></span>

                <span className="animated-square square-blue"></span>
                <span className="animated-square square-red"></span>
                <span className="animated-square square-yellow"></span>
                <span className="animated-square square-green"></span>

                <span className="animated-square square-blue square-2"></span>
                <span className="animated-square square-red square-2"></span>
                <span className="animated-square square-yellow square-2"></span>
                <span className="animated-square square-green square-2"></span>
            </div>

            <div className="container">

                <div className="row justify-content-center align-items-center min-vh-100">

                    <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">

                        <div className="login-card">

                            {/* HEADER */}

                            <div className="login-header">

                                <div className="login-logo-image">
                                    <img
                                        src="/logo_tello.png"
                                        alt="LogoTELLO"
                                    />
                                </div>
                                <div className="login-logo">
                                    <span className="logo-blue">
                                        Intranet
                                    </span>

                                    <span className="logo-red">
                                        TELLO
                                    </span>
                                </div>
                            </div>


                            {/* FORMULARIO */}

                            <div className="login-body">

                                <form>

                                    <div className="mb-3">

                                        <label
                                            htmlFor="username"
                                            className="form-label"
                                        >
                                            Usuario
                                        </label>

                                        <input
                                            type="text"
                                            id="username"
                                            className="form-control"
                                            placeholder="Ingrese su usuario"
                                        />

                                    </div>


                                    <div className="mb-3">

                                        <label
                                            htmlFor="password"
                                            className="form-label"
                                        >
                                            Contraseña
                                        </label>

                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            placeholder="Ingrese su contraseña"
                                        />

                                    </div>


                                    <div className="login-options">

                                        <div className="form-check">

                                            <input
                                                type="checkbox"
                                                id="remember"
                                                className="form-check-input"
                                            />

                                            <label
                                                htmlFor="remember"
                                                className="form-check-label"
                                            >
                                                Recordarme
                                            </label>

                                        </div>


                                        <a
                                            href="#"
                                            className="forgot-password"
                                        >
                                            ¿Olvidó su contraseña?
                                        </a>

                                    </div>


                                    <button
                                        type="submit"
                                        className="btn login-button w-100"
                                    >
                                        Iniciar sesión
                                    </button>

                                </form>

                            </div>


                            {/* COLORES CORPORATIVOS */}

                            <div className="login-footer">

                                <span className="footer-blue"></span>
                                <span className="footer-red"></span>
                                <span className="footer-yellow"></span>
                                <span className="footer-green"></span>

                            </div>

                        </div>


                        <div className="login-copyright">
                            © 2026 WebTELLO — Intranet Corporativa
                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
};

export default Login;