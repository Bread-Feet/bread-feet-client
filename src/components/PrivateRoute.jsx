import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, hasHydrated } = useUserStore();
  const location = useLocation();

  if (!hasHydrated) return null;

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?returnUrl=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  return children;
}
