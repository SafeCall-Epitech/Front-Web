import React, { useState, useEffect } from "react";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support system notifications");
      return;
    }
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const addNotification = (newNotification) => {
    setNotifications([...notifications, newNotification]);
    if (Notification.permission === "granted") {
      new Notification(newNotification.title);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(newNotification.title);
        }
      });
    }
  };

  const handleRemoveNotificationClick = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
  };

  return (
    <div>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        notifications.map((notification, index) => (
          <div
            key={index}
            style={{
              position: "fixed",
              bottom: "10px",
              right: "10px",
              backgroundColor: "white",
              padding: "10px",
              border: "1px solid black",
              boxShadow: "1px 1px 5px grey",
              cursor: "pointer",
            }}
            onClick={() => handleRemoveNotificationClick(index)}
          >
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default NotificationPage;
