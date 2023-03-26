import React, { useState } from 'react';
import NotificationPage from "./NotificationPage";

function Notification({ notification, onClick }) {
  return (
    <div
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
      onClick={() => onClick(notification)}
    >
      <h3>New Notification</h3>
      <p>{notification.message}</p>
    </div>
  );
}

function App() {
  const [notifications, setNotifications] = useState([]);

  function addNotification(message) {
    const newNotification = { message };
    setNotifications([...notifications, newNotification]);
  }

  function handleNotificationClick(notification) {
    setNotifications(notifications.filter(n => n !== notification));
  }

  function createNotification() {
    if (Notification.permission === "granted") {
      var notification = new Notification("New Notification", {
        body: "You have a new message or friend invitation.",
      });

      notification.onclick = function () {
        window.focus();
        notification.close();
      };
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          var notification = new Notification("New Notification", {
            body: "You have a new message or friend invitation.",
          });

          notification.onclick = function () {
            window.focus();
            notification.close();
          };
        }
      });
    }
  }

  // Your existing search functionality goes here...

  return (
    <div>
      {notifications.map((notification, index) => (
        <Notification
          key={index}
          notification={notification}
          onClick={handleNotificationClick}
        />
      ))}
      {/* Your search input and results go here... */}
    </div>
  );
}

export default App;
