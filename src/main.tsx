
  //import { createRoot } from "react-dom/client";
  import App from "./App";
  import "./index.css";
  import { AuthProvider } from "./context/AuthContext";
  import React from "react";
  import ReactDOM from 'react-dom/client';

  const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

  //createRoot(document.getElementById("root")!).render(<App />);
  //ReactDOM.createRoot(document.getElementById('root')!).render(
  root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
  