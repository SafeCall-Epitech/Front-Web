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

  const user = JSON.parse(localStorage.getItem('user'));
  const [friendsList, setFriendsList] = useState([]);
  const [notifications, setNotifications] = useState([
    { title: "New Message", message: "You have a new message!", type: "message", timestamp: new Date().toLocaleString(), read: false },
    { title: "New Friend Request", message: "You have a new friend request!", type: "friendRequest", timestamp: new Date().toLocaleString(), read: false }
  ]);

  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const response = await axios.get(`http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/listFriends/${user}`);
        const fetchedData = response.data.fetched;
        const friendsListData = fetchedData.map((name) => ({ name }));
        setFriendsList(friendsListData);
      } catch (error) {
        console.error(error);
      }
    };

    if (!("Notification" in window)) {
      console.log("This browser does not support system notifications");
      return;
    }
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    const savedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(savedNotifications);
    fetchFriendsList();
  }, []);


  const addNotification = (newNotification) => {
    const updatedNotifications = [{ ...newNotification, read: false }, ...notifications];
    setNotifications(updatedNotifications);

    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

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
    const notification = updatedNotifications[index];
    if (!notification.read) {
      notification.read = true;
    } else {
      updatedNotifications.splice(index, 1); // remove the notification from the array
    }
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
    localStorage.setItem("notifications", JSON.stringify([]));
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
  const handleNewFriendRequestClick = () => {
    addNotification({
      title: "New Friend Request",
      message: "You have a new friend request!",
      type: "friendRequest",
      timestamp: new Date().toLocaleString()
    });
  };

  return (

    <section style={{ top: '0', bottom: '0', right: '0', left: '0', backgroundColor: '#E6E6E6' }}>
      <MDBCard className="mb-4">
        <MDBCardBody>
          <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Friends List</span></MDBCardText>
          <MDBListGroup>
            {friendsList.map((friend) => (
              <MDBListGroupItem key={friend.id}>
                {friend.name}
              </MDBListGroupItem>
            ))}
          </MDBListGroup>
        </MDBCardBody>
      </MDBCard>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "flex-start", width: "80%", marginBottom: "10px" }}>
          <button onClick={() => setNotifications([])} style={{ position: "static", top: "100px", left: "10px" }}>Clear all Notifications</button>
        </div>
        <button onClick={handleNewMessageClick}>New Message Notification</button>
        <button onClick={handleNewFriendRequestClick}>New Friend Request Notification</button>
        {notifications.length === 0 ? (
          <p style={{ fontSize: "24px", textAlign: "center", marginTop: "-330px" }}>No new notifications</p>
        ) : (
          <div style={{ overflowY: "scroll", maxHeight: "500px", width: "80%" }}>
            {notifications.map((notification, index) => (

              <MDBCard
                key={index}
                style={{
                  marginBottom: "7px",
                  backgroundColor: notification.read ? "#fff" : "#FFCDD2",
                  border: notification.read ? "none" : "1px solid #F44336",
                  cursor: "pointer" // add cursor style to show the notification is clickable
                }}
                onClick={() => handleNotificationClick(index)} // add onClick event to change the color of the notification
              >
                <button
                  onClick={() => handleRemoveNotificationClick(index)}
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
    </section>
  );
}
