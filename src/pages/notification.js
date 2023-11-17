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

// add friend : http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/manageFriend/user/friend/add
// rm friend : http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/manageFriend/user/friend/rm

export default function NotificationPage() {

  const [intervalId, setIntervalId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState(JSON.parse(localStorage.getItem("notifications")) || []);

  const friendRequestNotifications = notifications.filter(
    (notification) =>
      notification.type === "friendRequest" && !notification.removed
  );
  const newMessageNotifications = notifications.filter(
    (notification) => notification.type === "message" && !notification.removed
  );


  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    const id = setInterval(handleNewFriendRequestClick, 2500);
    setIntervalId(id);

    return () => {
      // clear the interval when the component unmounts
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);


  const handleAcceptFriendRequest = async (event, friendName, index) => {
    event.stopPropagation();
    const userID = JSON.parse(localStorage.getItem('user'));
    
      try {
        const form = JSON.stringify({
          UserID: user,
          Friend: friendName,
          Action: "accept",
        });
    
        const response = await axios.post(`http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/manageFriend`, form, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
    
        console.log("accepted");
    
        const updatedNotifications = [...notifications];
        updatedNotifications[index].removed = true;
        setNotifications(updatedNotifications);
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    
      } catch (err) {
        console.error(err);
      }

    

    // Update the notifications state and localStorage
    const updatedNotifications = [...notifications];
    updatedNotifications[index].removed = true;
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const handleDeclineFriendRequest = async (event, friendName, index) => {
    event.stopPropagation();
    const userID = JSON.parse(localStorage.getItem('user'));
    
      try {
        const form = JSON.stringify({
          UserID: user,
          Friend: friendName,
          Action: "deny",
        });
    
        const response = await axios.post(`http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/manageFriend`, form, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
    
        console.log("declined");
    
        const updatedNotifications = [...notifications];
        updatedNotifications[index].removed = true;
        setNotifications(updatedNotifications);
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    
      } catch (err) {
        console.error(err);
      }
    

    // Update the notifications state and localStorage
    const updatedNotifications = [...notifications];
    updatedNotifications[index].removed = true;
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const handleShowNotificationClick = () => {
    setShowNotification(!showNotification);
  };

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
        startInterval();
      } else {
        clearInterval(intervalId);
      }
    };
    startInterval();
    document.addEventListener("visibilitychange", handleVisibilityChange);
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

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      handleNewFriendRequestClick();
    }
  };

  const handleNewFriendRequestClick = async () => {
    if (document.visibilityState === "visible") {
      const response = await axios.get(`http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/listFriends/${user}`);
      const fetchedData = response.data.fetched;
      const pendingFriendRequests = fetchedData.filter(name => name.startsWith("?"));
      console.log("pendingFriendRequests:", pendingFriendRequests);
      if (pendingFriendRequests.length > 0) {
        const newNotifications = pendingFriendRequests
          .map((request) => {
            const friendName = request.substring(1);
            return {
              title: `${friendName} added you`,
              message: `${friendName} wants to be friend with you`,
              type: "friendRequest",
              timestamp: new Date().toLocaleString(),
              removed: false
            };
          })
          .filter(newNotification => {
            const isExistingNotification = notifications.some(notification =>
              notification.title.includes(newNotification.title.split(" ")[0]) &&
              !notification.removed
            );
            return !isExistingNotification;
          });
        
        if (newNotifications.length > 0) {
          const updatedNotifications = [...newNotifications, ...notifications];
          setNotifications(updatedNotifications);
          localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  
          if (Notification.permission === "granted") {
            newNotifications.forEach(newNotification => {
              new Notification(newNotification.title);
            });
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
              if (permission === "granted") {
                newNotifications.forEach(newNotification => {
                  new Notification(newNotification.title);
                });
              }
            });
          }
        }
      } else {
        // Clear all friend request notifications
        const updatedNotifications = notifications.filter(notification => notification.type !== "friendRequest");
        setNotifications(updatedNotifications);
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
      }
    }
  };  

  return (
    <section style={{ top: '0', bottom: '0', right: '0', left: '0', backgroundColor: '#E6E6E6' }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
          {/* New message notifications */}
          <div style={{ width: "100%", marginRight: "5px", marginTop: "-250px" }}>
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
                      backgroundColor: "#fff",
                      border: "1px solid #F44336",
                      cursor: "pointer",
                      padding: "10px",
                      borderRadius: "5px",
                      fontSize: "8px",
                      lineHeight: "1.2"
                    }}
                  >
                    <MDBCardBody>
                      <MDBCardText>
                        <h4 style={{ marginBottom: "5px" }}>{notification.title}</h4>
                        <p style={{ marginBottom: "5px" }}>{notification.message}</p>
                        <p style={{ fontSize: "12px", color: "#808080", margin: "0" }}>{notification.timestamp}</p>
                      </MDBCardText>
                    </MDBCardBody>
                  </MDBCard>
                ))}
              </div>
            )}
          </div>
          {/* Contact request notifications */}
          <div style={{ width: "60%", marginLeft: "5px", marginTop: "-250px" }}>
            <h2>Contact Requests</h2>
            {friendRequestNotifications.length === 0 ? (
              <p style={{ fontSize: "24px", textAlign: "left", marginTop: "40px" }}>No new friend requests</p>
            ) : (
              <div style={{ overflowY: "scroll", maxHeight: "500px", width: "100%" }}>
                {friendRequestNotifications.map((notification, index) => (
                  <MDBCard
                    key={index}
                    style={{
                      marginBottom: "7px",
                      backgroundColor: "#FFF",
                      border: "1px solid #F44336",
                      cursor: "pointer"
                    }}
                  >
                    <MDBCardBody>
                      <MDBCardText>
                        <h3>{notification.title}</h3>
                        <p>{notification.message}</p>
                        {notification.type === "friendRequest" && (
                          <div>
                            <button
                              onClick={(event) => handleAcceptFriendRequest(event, notification.title.split(" ")[0], index)}
                              style={{
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "5px 10px",
                                marginRight: "5px",
                                cursor: "pointer"
                              }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={(event) => handleDeclineFriendRequest(event, notification.title.split(" ")[0], index)}
                              style={{
                                backgroundColor: "#F44336",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "5px 10px",
                                cursor: "pointer"
                              }}
                            >
                              Decline
                            </button>
                          </div>
                        )}
                        <p style={{ fontSize: "12px", color: "#808080" }}>{notification.timestamp}</p>
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