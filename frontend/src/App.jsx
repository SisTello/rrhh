import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";

function App() {
    return (
        <AuthLayout>
            <Login />
        </AuthLayout>
    );
}

export default App;