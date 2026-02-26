import AuthGuard from "./AuthGuard";

export default function PrivateRoute({ children }) {
  return <AuthGuard requireAuth>{children}</AuthGuard>;
}
