import "./App.css";
import { GlobalStyle } from "../GlobalStyle";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import LoginPopupCallbackPage from "./pages/login/LoginPopupCallbackPage";
import BakeryAdminPage from "./pages/bakery/BakeryAdminPage";
import AppLayout from "./pages/layouts/AppLayout";
import HomePage from "./pages/home/HomePage";
import BakeryFormPage from "./pages/bakery/form/BakeryFormPage";

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
        <Route
          path="/mybakery/register"
          element={<BakeryFormPage title="빵집 등록하기" />}
        />
        <Route
          path="/mybakery/modify"
          element={<BakeryFormPage title="수정하기" />}
        />
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/mybakery" element={<BakeryAdminPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
