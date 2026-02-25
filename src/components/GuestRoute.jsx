import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getValidAccessToken } from "../lib/token-storage";

export default function GuestRoute({ children }) {
  const [status, setStatus] = useState("checking");
  const location = useLocation();

  useEffect(() => {
    const skipped = sessionStorage.getItem("skipLogin") === "true";
    if (skipped) {
      setStatus("ok");
      return;
    }
    getValidAccessToken()
      .then((token) => setStatus(token ? "ok" : "redirect"))
      .catch(() => setStatus("redirect"));
  }, []);

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
