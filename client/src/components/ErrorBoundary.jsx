import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          textAlign: "center",
        }}>
          <h1 className="display" style={{ fontSize: 48, marginBottom: 20 }}>ОШИБКА</h1>
          <p className="mono" style={{ color: "var(--muted)", maxWidth: 400 }}>
            Что-то пошло не так. Попробуй перезагрузить страницу.
          </p>
          <button
            className="btn-accent"
            style={{ marginTop: 28 }}
            onClick={() => window.location.reload()}
          >
            ПЕРЕЗАГРУЗИТЬ ↻
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
