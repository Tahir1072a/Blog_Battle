import { useState, useMemo } from "react";
import { useAuth } from "./useAuth";
import {
  useGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
} from "@/store/api/notificationApi";

export const useNotification = () => {
  const { isAuthenticated } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: notifications = [] } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 60000,
  });

  const [markNotificationsAsRead] = useMarkNotificationsAsReadMutation();

  const toggleNotifications = () => {
    if (!showNotifications && unreadCount > 0) {
      markNotificationsAsRead()
        .unwrap()
        .catch((err) => {
          console.error("Bildirimler okundu olarak işaretlenemedi:", err);
        });
    }
    setShowNotifications((prev) => !prev);
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  return { notifications, showNotifications, toggleNotifications, unreadCount };
};
