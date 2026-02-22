import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getValidAccessToken } from "../lib/token-storage";

export default function PrivateRoute({ children }) {
  const [status, setStatus] = useState("checking"); // "checking" | "ok" | "no-token"
  const location = useLocation();

  useEffect(() => {
    getValidAccessToken()
      .then((token) => {
        setStatus(token ? "ok" : "no-token");
      })
      .catch(() => {
        setStatus("no-token");
      });
  }, []);

  if (status === "checking") return null;

  if (status === "no-token") {
    return (
      <Navigate
        to={`/login?returnUrl=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  return children;
}
