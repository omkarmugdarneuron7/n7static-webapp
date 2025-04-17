declare module "react-pdf" {
    import React from "react";
  
    export const Document: React.FC<{ file: string | File }>;
    export const Page: React.FC<{ pageNumber: number }>;
  }