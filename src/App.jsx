import "./App.css";
import { GlobalStyle } from "../GlobalStyle";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import DiaryPage from "./pages/diary/DiaryPage";
import BakeryAdminPage from "./pages/bakery/BakeryAdminPage";
import AppLayout from "./pages/layouts/AppLayout";

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/diary" element={<DiaryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/diary" element={<DiaryPage />} />
          <Route path="/mybakery" element={<BakeryAdminPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
