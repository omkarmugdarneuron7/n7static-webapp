import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  baseUrl: string | null;
  fetchToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const DEFAULT_EXPIRY_MS = 60 * 60 * 1000; 
  const [expiresAt , setExpiresAt]=useState<number>()

  const fetchToken = async () => {
    try {
      // Determine the base URL dynamically based on the environment
      const functionBaseUrl = import.meta.env.VITE_FUNC_ENDPOINT || "http://localhost:7071";

      if (!functionBaseUrl) {
        throw new Error("VITE_FUNC_ENDPOINT is not defined in the environment variables.");
      }
  // Call your backend API (Azure Function) to fetch the bearer token
  const res = await fetch(`https://neudesic-function-app-cjh7dwb0fsgpg4f2.westus2-01.azurewebsites.net/api/getBearerToken`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch bearer token: ${res.status} ${res.statusText}`);
  }
  
      const data = await res.json();
      setToken(data.bearerToken);
      setBaseUrl(data.baseUrl);
      setExpiresAt(Date.now() + DEFAULT_EXPIRY_MS);
    } catch (error) {
      console.error("Failed to fetch token:", error);
      alert("Failed to authenticate. Please try again.");
    }
  };
  useEffect(() => {
    fetchToken(); // Fetch the token when the app initializes
  }, []);

  useEffect(() => {
    if (!expiresAt) return;
    const refreshIn = expiresAt - Date.now() - 5 * 60 * 1000; // 5 min before expiry
    if (refreshIn <= 0) {
      fetchToken();
      return;
    }
    const timeoutId = setTimeout(fetchToken, refreshIn);
    return () => clearTimeout(timeoutId);
  }, [expiresAt]);


  return (
    <AuthContext.Provider value={{ token, baseUrl, fetchToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};