import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

const SimulationContext = createContext(null);

export const SimulationProvider = ({ children }) => {
  const [telemetry, setTelemetry] = useState({
    temperature: 28.5,
    humidity: 74,
    rainfallProbNext24h: 65,
    recentRainfallMm: 12,
    soilMoisture: 42,
    windSpeedKmh: 14.2,
    sunlightHours: 6.8,
    airQualityIndex: 48,
    lastUpdated: new Date().toISOString()
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSimulating, setIsSimulating] = useState(true);
  const [isTicking, setIsTicking] = useState(false);
  const [lastTickTime, setLastTickTime] = useState(new Date());

  const fetchSimulationState = useCallback(async () => {
    try {
      const data = await api.getSimulationState();
      if (data && data.telemetry) {
        setTelemetry(data.telemetry);
        setLastTickTime(new Date());
      }
    } catch (err) {
      console.warn("Telemetry fetch error:", err.message);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await api.getNotifications();
      if (data && data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.warn("Notifications fetch error:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchSimulationState();
    fetchNotifications();

    if (!isSimulating) return;

    // Periodic polling every 8 seconds
    const interval = setInterval(() => {
      fetchSimulationState();
      fetchNotifications();
    }, 8000);

    return () => clearInterval(interval);
  }, [isSimulating, fetchSimulationState, fetchNotifications]);

  const triggerManualTick = async () => {
    setIsTicking(true);
    try {
      await api.triggerSimulationTick();
      await fetchSimulationState();
      await fetchNotifications();
    } catch (err) {
      console.error("Manual tick error:", err);
    } finally {
      setIsTicking(false);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const toggleSimulation = () => {
    setIsSimulating(prev => !prev);
  };

  return (
    <SimulationContext.Provider
      value={{
        telemetry,
        notifications,
        unreadCount,
        isSimulating,
        isTicking,
        lastTickTime,
        triggerManualTick,
        toggleSimulation,
        markNotificationRead,
        markAllNotificationsRead,
        refreshState: fetchSimulationState
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
};
