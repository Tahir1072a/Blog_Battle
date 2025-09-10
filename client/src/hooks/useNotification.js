import { useState, useEffect } from "react";
import api from "@/utils/api";
import { useAuth } from "./useAuth";

export const useNotification = () => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const { data } = await api.get("/notifications");
          setNotifications(data);
        } catch (error) {
          console.error("Bildirimler alınamadı:", error);
        }
      };
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  const toggleNotifications = async () => {
    if (!showNotifications) {
      try {
        await api.post("/notifications/read");

        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (error) {
        console.error("Bildirimler okundu olarak işaretlenemedi.");
      }
    }
    setShowNotifications((prev) => !prev);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, showNotifications, toggleNotifications, unreadCount };
};
