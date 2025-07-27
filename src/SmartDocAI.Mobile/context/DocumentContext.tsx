import React, { createContext, useContext, useState } from "react";

type DocumentContextType = {
  docId: string | null;
  setDocId: (id: string | null) => void;
  fileName: string | null;
  setFileName: (name: string | null) => void;
};

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [docId, setDocId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <DocumentContext.Provider
      value={{ docId, setDocId, fileName, setFileName }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error(
      "useDocumentContext must be used within a DocumentProvider"
    );
  }
  return context;
};

export { DocumentProvider, useDocument };
//export type { DocumentContextType };
