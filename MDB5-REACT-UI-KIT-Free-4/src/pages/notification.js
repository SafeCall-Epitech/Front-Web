import React, { useState, useEffect } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';
import { fr } from "date-fns/locale";
import axios from 'axios';

// add friend : http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/manageFriend/:user/:?friend/add
// rm friend : http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/manageFriend/:user/:?friend/rm

// Je veux parser la friend list et chercher un profil avec "?" (ex : "?Julien") et là je peux accepter ou deny

// accept request : http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/replyFriend/:userID/:?friend/:accept
// deny request : http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/replyFriend/:userID/:?friend/:deny

export default function NotificationPage() {

  const [intervalId, setIntervalId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState(JSON.parse(localStorage.getItem("notifications")) || []);

  const friendRequestNotifications = notifications.filter(notification => notification.type === "friendRequest");
  const newMessageNotifications = notifications.filter(notification => notification.type === "message");

  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    // start checking for new friend requests every 10 seconds
    const id = setInterval(handleNewFriendRequestClick, 10000);
    setIntervalId(id);

    return () => {
      // clear the interval when the component unmounts
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleAcceptFriendRequest = async (friendName) => {
    const userID = JSON.parse(localStorage.getItem('user'));
    const response = await axios.put(`http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/replyFriend/${userID}/:${friendName}/accept`);
  }

  const handleShowNotificationClick = () => {
    setShowNotification(!showNotification);
  };

  const handleDeclineFriendRequest = async (friendName) => {
    const userID = JSON.parse(localStorage.getItem('user'));
    const response = await axios.put(`http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/replyFriend/${userID}/:${friendName}/deny`);
  }

  useEffect(() => {
    const checkForNewFriendRequests = async () => {
      await handleNewFriendRequestClick();
    };

    const startInterval = () => {
      const interval = setInterval(checkForNewFriendRequests, 10000);
      setIntervalId(interval);
      return interval;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Restart the interval when the tab becomes visible
        startInterval();
      } else {
        // Clear the interval when the tab is not visible
        clearInterval(intervalId);
      }
    };
    // Start the interval initially
    startInterval();

    // Add event listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);


  const addNotification = (newNotification) => {
    const updatedNotifications = [{ ...newNotification, read: false }, ...notifications];
    const unreadNotifications = updatedNotifications.filter(notification => !notification.read);
    setNotifications(unreadNotifications);

    localStorage.setItem("notifications", JSON.stringify(unreadNotifications));

    if (Notification.permission === "granted") {
      new Notification(newNotification.title);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(newNotification.title);
        }
      });
    }
  };

  const handleRemoveNotificationClick = (event, index) => {
    event.stopPropagation();
    const updatedNotifications = [...notifications];
    updatedNotifications[index] = { ...updatedNotifications[index], removed: true }; // set removed property to true
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };



  const handleNotificationClick = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index] = { ...updatedNotifications[index], read: true };
    setNotifications(updatedNotifications);

    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const handleClearAllNotificationsClick = () => {
    setNotifications([]);
    localStorage.setItem("notifications", JSON.stringify([])); // Update local storage with an empty array
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      handleNewFriendRequestClick();
    }
  };

  // Create a new message notification and add it to the list
  const handleNewMessageClick = () => {
    addNotification({
      title: "New Message",
      message: "You have a new message!",
      type: "message",
      timestamp: new Date().toLocaleString()
    });
  };

  // Create a new friend request notification and add it to the list
  const handleNewFriendRequestClick = async () => {
    if (document.visibilityState === "visible") {
      const response = await axios.get(`http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/listFriends/${user}`);
      const fetchedData = response.data.fetched;
      const pendingFriendRequests = fetchedData.filter(name => name.startsWith("?"));
      console.log("pendingFriendRequests:", pendingFriendRequests);
      if (pendingFriendRequests.length > 0) {
        pendingFriendRequests.forEach((request) => {
          const friendName = request.substring(1);
          const newNotification = {
            title: `New Friend Request!`,
            message: `${friendName} wants to be your friend`,
            type: "friendRequest",
            timestamp: new Date().toLocaleString(),
            removed: false
          };
          const isExistingNotification = notifications.some(notification =>
            notification.title === newNotification.title &&
            notification.message === newNotification.message &&
            !notification.removed
          );
          if (!isExistingNotification) {
            addNotification(newNotification);
          }
        });
      }
    }
  };

  return (
    <section style={{ top: '0', bottom: '0', right: '0', left: '0', backgroundColor: '#E6E6E6' }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "flex-start", width: "80%", marginBottom: "10px" }}>
          <button onClick={() => setNotifications([])} style={{ position: "static", top: "100px", left: "10px" }}>Clear all Notifications</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
          {/* New message notifications */}
          <div style={{ width: "100%", marginRight: "5px" }}>
            <h2>New Messages</h2>
            {newMessageNotifications.length === 0 ? (
              <p style={{ fontSize: "24px", textAlign: "left", marginTop: "40px" }}>No new messages</p>
            ) : (
              <div style={{ overflowY: "scroll", maxHeight: "500px", width: "100%" }}>
                {newMessageNotifications.map((notification, index) => (
                  <MDBCard
                    key={index}
                    style={{
                      marginBottom: "7px",
                      backgroundColor: notification.read ? "#fff" : "#FFCDD2",
                      border: notification.read ? "none" : "1px solid #F44336",
                      cursor: "pointer"
                    }}
                    onClick={() => handleNotificationClick(index)}
                  >
                    <button
                      onClick={(event) => handleRemoveNotificationClick(event, index)}
                      style={{ position: "absolute", top: "5px", right: "5px", backgroundColor: "transparent", border: "none" }}
                    >
                      Clear
                    </button>
                    <MDBCardBody>
                      <MDBCardText>
                        <h3>{notification.title}</h3>
                        <p>{notification.message}</p>
                        <p style={{ fontSize: "12px", color: "#808080" }}>{notification.timestamp}</p>
                      </MDBCardText>
                    </MDBCardBody>
                  </MDBCard>
                ))}
              </div>
            )}
          </div>
          {/* Friend request notifications */}
          <div style={{ width: "50%", marginLeft: "5px" }}>
            <h2>Friend Requests</h2>
            {friendRequestNotifications.length === 0 ? (
              <p style={{ fontSize: "24px", textAlign: "center", marginTop: "-330px" }}>No new friend requests</p>
            ) : (
              <div style={{ overflowY: "scroll", maxHeight: "500px", width: "100%" }}>
                {friendRequestNotifications.map((notification, index) => (
                  <MDBCard
                    key={index}
                    style={{
                      marginBottom: "7px",
                      backgroundColor: notification.read ? "#fff" : "#FFCDD2",
                      border: notification.read ? "none" : "1px solid #F44336",
                      cursor: "pointer"
                    }}
                    onClick={() => handleNotificationClick(index)}
                  >
                    <button
                      onClick={(event) => handleRemoveNotificationClick(event, index)}
                      style={{ position: "absolute", top: "5px", right: "5px", backgroundColor: "transparent", border: "none" }}
                    >
                      Clear
                    </button>
                    <MDBCardBody>
                      <MDBCardText>
                        <h3>{notification.title}</h3>
                        <p>{notification.message}</p>
                        <p style={{ fontSize: "12px", color: "#808080" }}>{notification.timestamp}</p>
                        {notification.type === "friendRequest" && (
                          <div>
                            <button onClick={() => handleAcceptFriendRequest(notification.message)}>Accept</button>
                            <button onClick={() => handleDeclineFriendRequest(notification.message)}>Decline</button>
                          </div>
                        )}
                      </MDBCardText>
                    </MDBCardBody>
                  </MDBCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
