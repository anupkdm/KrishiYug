import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("krishi_user");
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("krishi_token") || null);
  const [loading, setLoading] = useState(!localStorage.getItem("krishi_token"));
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("krishi_token");
      if (storedToken) {
        try {
          const res = await api.getCurrentUser();
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem("krishi_user", JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn("Stored auth token invalid or expired. Keeping local session if available.");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const saveAuthSession = (newToken, newUser) => {
    const userObj = newUser?.user || newUser?.farmer || newUser?.labour || newUser;
    if (newToken) {
      localStorage.setItem("krishi_token", newToken);
      setToken(newToken);
    }
    if (userObj) {
      localStorage.setItem("krishi_user", JSON.stringify(userObj));
      setUser(userObj);
    }
    setError(null);
  };

  const farmerRegister = async (formData) => {
    setError(null);
    try {
      const res = await api.farmerRegister(formData);
      const userObj = res?.user || res?.farmer || res;
      saveAuthSession(res?.token, userObj);
      return userObj;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const farmerLogin = async (credentials) => {
    setError(null);
    try {
      const res = await api.farmerLogin(credentials);
      const userObj = res?.user || res?.farmer || res;
      saveAuthSession(res?.token, userObj);
      return userObj;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const labourRegister = async (formData) => {
    setError(null);
    try {
      const res = await api.labourRegister(formData);
      const userObj = res?.user || res?.labour || res;
      saveAuthSession(res?.token, userObj);
      return userObj;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const labourLogin = async (credentials) => {
    setError(null);
    try {
      const res = await api.labourLogin(credentials);
      const userObj = res?.user || res?.labour || res;
      saveAuthSession(res?.token, userObj);
      return userObj;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("krishi_token");
    localStorage.removeItem("krishi_user");
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = (updatedProfile) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedProfile };
      localStorage.setItem("krishi_user", JSON.stringify(updated));
      return updated;
    });
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
