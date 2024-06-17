import React, { createContext, useState, useContext } from 'react';

// Créez le contexte d'authentification
const AuthContext = createContext();

// Créez un fournisseur pour le contexte d'authentification
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Créez un hook pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);
