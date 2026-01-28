import "./App.css";
import { GlobalStyle } from "../GlobalStyle";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import BakeryAdminPage from "./pages/bakery/BakeryAdminPage";
import AppLayout from "./pages/layouts/AppLayout";

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/mybakery" element={<BakeryAdminPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
