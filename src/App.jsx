import "./App.css";
import { GlobalStyle } from "../GlobalStyle";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import LoginPopupCallbackPage from "./pages/login/LoginPopupCallbackPage";
import BakeryAdminPage from "./pages/bakery/BakeryAdminPage";
import AppLayout from "./pages/layouts/AppLayout";
import HomePage from "./pages/home/HomePage";
import BakeryCreatePage from "./pages/bakery/form/BakeryCreatePage";
import BakeryModifyPage from "./pages/bakery/form/BakeryModifyPage";

import BakeryPage from "./pages/bakery-user/BakeryPage";
import BakeryDetailPage from "./pages/bakery-user/BakeryDetailPage";

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/login/oauth2/code/kakao"
          element={<LoginPopupCallbackPage />}
        />
        <Route path="/oauth/callback" element={<LoginPopupCallbackPage />} />
        <Route path="/mybakery/register" element={<BakeryCreatePage />} />
        <Route path="/mybakery/modify" element={<BakeryModifyPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/mybakery" element={<BakeryAdminPage />} />
          <Route path="/bakery" element={<BakeryPage />} />
          <Route path="/bakery/:id" element={<BakeryDetailPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
