import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("krishi_token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("krishi_token");
      if (storedToken) {
        try {
          const res = await api.getCurrentUser();
          setUser(res.user);
        } catch (err) {
          console.warn("Stored auth token invalid or expired. Logging out.");
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const saveAuthSession = (newToken, newUser) => {
    localStorage.setItem("krishi_token", newToken);
    setToken(newToken);
    setUser(newUser);
    setError(null);
  };

  const farmerRegister = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.farmerRegister(formData);
      saveAuthSession(res.token, res.user);
      return res.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const farmerLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.farmerLogin(credentials);
      saveAuthSession(res.token, res.user);
      return res.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const labourRegister = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.labourRegister(formData);
      saveAuthSession(res.token, res.user);
      return res.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const labourLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.labourLogin(credentials);
      saveAuthSession(res.token, res.user);
      return res.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("krishi_token");
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = (updatedProfile) => {
    setUser(prev => ({ ...prev, ...updatedProfile }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!user,
        isFarmer: user?.role === "FARMER",
        isLabour: user?.role === "LABOUR",
        loading,
        error,
        farmerRegister,
        farmerLogin,
        labourRegister,
        labourLogin,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
