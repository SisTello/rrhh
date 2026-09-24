import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import PublicHome from "./pages/public/PublicHome";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import News from "./pages/news/News";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ==================================================
                    PÁGINA PÚBLICA
                ================================================== */}

                <Route path="/" element={<PublicHome />} />


                {/* ==================================================
                    AUTENTICACIÓN
                ================================================== */}

                <Route
                    path="/login"
                    element={
                        <AuthLayout>
                            <Login />
                        </AuthLayout>
                    }
                />


                {/* ==================================================
                    INTRANET
                ================================================== */}

                <Route
                    path="/dashboard"
                    element={
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    }
                />

                <Route
                    path="/perfil"
                    element={
                        <MainLayout>
                            <Profile />
                        </MainLayout>
                    }
                />
                <Route
                    path="/noticias"
                    element={
                    <MainLayout>
                            <News />
                        </MainLayout>
                    }
                />


                {/* ==================================================
                    RUTA NO ENCONTRADA
                ================================================== */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;