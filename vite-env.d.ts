/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Agrega aquí otras variables de entorno si las usas
  // Por ejemplo:
  // readonly VITE_SOME_OTHER_VARIABLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}