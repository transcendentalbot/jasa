import React, { createContext, useContext, useState, ReactNode } from "react";

// Define Theme Context Type
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// Define dark and light theme objects
const darkTheme = {
  card: { backgroundColor: "#1e1e1e", padding: 16, borderRadius: 10 },
  input: { backgroundColor: "#2a2a2a", color: "#fff", borderColor: "#444", borderWidth: 1 },
  text: { color: "#fff" },
  button: { backgroundColor: "#f57c00", padding: 12, borderRadius: 6 },
  buttonText: { color: "#fff", fontWeight: "bold" },
};

const lightTheme = {
  card: { backgroundColor: "#f5f5f5", padding: 16, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" },
  input: { backgroundColor: "#fff", color: "#000", borderColor: "#ccc", borderWidth: 1 },
  text: { color: "#000" },
  button: { backgroundColor: "#ff9800", padding: 12, borderRadius: 6 },
  buttonText: { color: "#000", fontWeight: "bold" },
};

// Create Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("dark"); // Default to dark mode

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook to use Theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
