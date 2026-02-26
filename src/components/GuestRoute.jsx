import AuthGuard from "./AuthGuard";

export default function GuestRoute({ children }) {
  return (
    <AuthGuard requireAuth allowSkipLogin>
      {children}
    </AuthGuard>
  );
}
