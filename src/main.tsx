
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import { AuthProvider } from "./context/AuthContext.tsx";
  import React from "react";
  import ReactDOM from 'react-dom/client';

  createRoot(document.getElementById("root")!).render(<App />);
  ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
  