import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import LoginSuccessPage from "./pages/login/LoginSuccessPage";
import LoginPopupCallbackPage from "./pages/login/LoginPopupCallbackPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logins" element={<LoginSuccessPage />} />
      <Route path="/logine" element={<LoginPopupCallbackPage />} />
    </Routes>
  );
}

export default App;
