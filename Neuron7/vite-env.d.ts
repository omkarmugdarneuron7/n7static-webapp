/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_FUNC_ENDPOINT: string; // Define your environment variable here
    // Add other environment variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }