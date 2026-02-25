import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getValidAccessToken } from "../lib/token-storage";

export default function AuthGuard({
  children,
  requireAuth = true,
  allowSkipLogin = false,
}) {
  const [status, setStatus] = useState("checking"); // "checking" | "ok" | "redirect"
  const location = useLocation();

  useEffect(() => {
    if (!requireAuth) {
      setStatus("ok");
      return;
    }

    if (allowSkipLogin && sessionStorage.getItem("skipLogin") === "true") {
      setStatus("ok");
      return;
    }

    getValidAccessToken()
      .then((token) => {
        setStatus(token ? "ok" : "redirect");
      })
      .catch(() => {
        setStatus("redirect");
      });
  }, [requireAuth, allowSkipLogin]);

  if (status === "checking") return null;

  if (status === "redirect") {
    return (
      <Navigate
        to={`/login?returnUrl=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  return children;
}

