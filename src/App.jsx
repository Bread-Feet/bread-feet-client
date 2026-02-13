import "./App.css";
import { GlobalStyle } from "../GlobalStyle";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import LoginPopupCallbackPage from "./pages/login/LoginPopupCallbackPage";
import BakeryAdminPage from "./pages/bakery/BakeryAdminPage";
import AppLayout from "./pages/layouts/AppLayout";
import HomePage from "./pages/home/HomePage";
import BakeryFormPage from "./pages/bakery/form/BakeryFormPage";

import BakeryPage from "./pages/bakery-user/BakeryPage";
import BakeryDetailPage from "./pages/bakery-user/BakeryDetailPage";
import BakeryReviewPage from "./pages/bakery-user/BakeryReviewPage";

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
        <Route path="/bakery/:id/addreview" element={<BakeryReviewPage />} />
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
