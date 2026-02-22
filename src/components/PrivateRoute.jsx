import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../lib/token-storage";

export default function PrivateRoute({ children }) {
  const [status, setStatus] = useState("checking"); // "checking" | "ok" | "no-token"
  const location = useLocation();

  useEffect(() => {
    getAccessToken().then((token) => {
      setStatus(token ? "ok" : "no-token");
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
