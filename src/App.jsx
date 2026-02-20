import "./App.css";
import { GlobalStyle } from "../GlobalStyle";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import DiaryEditorPage from "./pages/diary/DiaryEditorPage";
import DiaryCalenderPage from "./pages/diary/DiaryCalendarPage";
import LoginPopupCallbackPage from "./pages/login/LoginPopupCallbackPage";
import BakeryAdminPage from "./pages/bakery-admin/BakeryAdminPage";
import AppLayout from "./pages/layouts/AppLayout";
import HomePage from "./pages/home/HomePage";
import BakeryCreatePage from "./pages/bakery-admin/form/BakeryCreatePage";
import BakeryModifyPage from "./pages/bakery-admin/form/BakeryModifyPage";

import BakeryPage from "./pages/bakery/BakeryPage";
import BakeryDetailPage from "./pages/bakery/BakeryDetailPage";
import BakeryReviewPage from "./pages/bakery/BakeryReviewPage";

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
        <Route path="/bakery/:id/addreview" element={<BakeryReviewPage />} />
        <Route element={<AppLayout />}>
          <Route path="/mydiary" element={<DiaryCalenderPage />} />
          <Route path="/diaryEditor" element={<DiaryEditorPage />} />
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
