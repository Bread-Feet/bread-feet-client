import "./App.css";
import { GlobalStyle } from "../GlobalStyle";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import LoginPopupCallbackPage from "./pages/login/LoginPopupCallbackPage";
import BakeryAdminPage from "./pages/bakery-admin/BakeryAdminPage";
import AppLayout from "./pages/layouts/AppLayout";
import HomePage from "./pages/home/HomePage";
import BakeryCreatePage from "./pages/bakery-admin/form/BakeryCreatePage";
import BakeryModifyPage from "./pages/bakery-admin/form/BakeryModifyPage";
import PrivateRoute from "./components/PrivateRoute";
import GuestRoute from "./components/GuestRoute";

import BakeryPage from "./pages/bakery/BakeryPage";
import BakeryDetailPage from "./pages/bakery/BakeryDetailPage";
import BakeryReviewPage from "./pages/bakery/BakeryReviewPage";
import BakeryEditReviewPage from "./pages/bakery/BakeryEditReviewPage";

import DiaryCalenderPage from "./pages/diary/DiaryCalendarPage";
import DiaryEditorPage from "./pages/diary/DiaryEditorPage";
import DiaryBakeryPage from "./pages/diary/BakeryPage";
import DiaryDetailPage from "./pages/diary/DiaryDetailPage";
import DiaryModifyPage from "./pages/diary/DiaryModifyPage";

import CommunityPage from "./pages/community/CommunityPage";
import MapPage from "./pages/map/MapPage";

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
          element={
            <PrivateRoute>
              <BakeryCreatePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mybakery/:id/modify"
          element={
            <PrivateRoute>
              <BakeryModifyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/bakery/:id/addreview"
          element={
            <PrivateRoute>
              <BakeryReviewPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/bakery/:id/editreview/:reviewId"
          element={
            <PrivateRoute>
              <BakeryEditReviewPage />
            </PrivateRoute>
          }
        />
        <Route path="/diary/new" element={<DiaryEditorPage />} />
        <Route path="/diary/modify/:diaryId" element={<DiaryModifyPage />} />
        <Route element={<AppLayout />}>
          <Route path="/mydiary" element={<DiaryCalenderPage />} />
          <Route path="/diary/:diaryId" element={<DiaryDetailPage />} />
          <Route path="/diary/bakery" element={<DiaryBakeryPage />} />
        </Route>
        <Route
          element={
            <GuestRoute>
              <AppLayout />
            </GuestRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route
            path="/mybakery"
            element={
              <PrivateRoute>
                <BakeryAdminPage />
              </PrivateRoute>
            }
          />
          <Route path="/bakery" element={<BakeryPage />} />
          <Route path="/bakery/:id" element={<BakeryDetailPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/diary/:diaryId" element={<DiaryDetailPage />} />
          <Route path="/map" element={<MapPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
