export default function HomePage() {
  return (
    <div
      style={{
        width: "100%",
        minHeight:
          "calc(var(--app-100vh) - var(--tabbar-height) - env(safe-area-inset-bottom))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>홈페이지</h1>
      <div>breadfeet</div>
    </div>
  );
}
