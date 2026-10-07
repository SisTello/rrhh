import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import PublicHome from "./pages/public/PublicHome";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import News from "./pages/news/News";
import Documents from "./pages/documents/Documents";
import Support from "./pages/support/Support";
import NewRequest from "./pages/support/NewRequest";
import Requests from "./pages/requests/Requests";
import Calendar from "./pages/calendar/Calendar";
import Talent from "./pages/talent/Talent";
import TalentSelection from "./pages/talent/TalentSelection";
import ProcessDetail from "./pages/talent/ProcessDetail";

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
                    path="/soporte" 
                    element={
                        <MainLayout>
                            <Support />
                        </MainLayout>
                        } 
                />
                <Route
                    path="/soporte/nueva-solicitud"
                    element={
                        <MainLayout>
                            <NewRequest />
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
                <Route
                    path="/documentos"
                    element={
                        <MainLayout>
                            <Documents />
                        </MainLayout>
                    }
                />
                <Route 
                    path="/solicitudes" 
                    element={
                        <MainLayout>
                            <Requests />
                        </MainLayout>
                        } 
                />
                <Route 
                    path="/calendario" 
                    element={
                        <MainLayout>
                            <Calendar  />
                        </MainLayout>
                        } 
                />
                <Route
                    path="/talento-humano"
                    element={
                        <MainLayout>
                            <Talent />
                        </MainLayout>
                    }
                />
                <Route
                    path="/talento-humano/seleccion"
                    element={
                        <MainLayout>
                            <TalentSelection />
                        </MainLayout>
                    }
                />
                <Route
                    path="/talento-humano/proceso/:processId"
                    element={
                        <MainLayout>
                            <ProcessDetail />
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