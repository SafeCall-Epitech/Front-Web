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


export default function NotificationPage() {

  const [intervalId, setIntervalId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState(JSON.parse(localStorage.getItem("notifications")) || []);
  const [Subject, setSubject] = useState(''); // State variable for the subject in the modal
  const [friendsList, setFriendsList] = useState([]);

  const friendRequestNotifications = notifications.filter(
    (notification) =>
      notification.type === "friendRequest" && !notification.removed
  );
  const newMessageNotifications = notifications.filter(
    (notification) => notification.type === "message" && !notification.removed
  );

  useEffect(() => {
    const id = setInterval(handleNewFriendRequestClick, 2500);
    setIntervalId(id);

    return () => {
      // clear the interval when the component unmounts
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleAcceptFriendRequest = async (event, friendName, index, Subject) => {
    event.stopPropagation();
    console.log("before Accept");
    console.log("FriendName : ", friendName);
    console.log("subject :", Subject);
    try {
      const form = JSON.stringify({
        UserID: user,
        Friend: friendName,
        Subject: Subject,
        Action: "accept",
      });
      console.log("before ApiCall");
      console.log(form);
      const response = await axios.post(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/replyFriend`, form, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log("FriendName After Call :", friendName);
      console.log("After Post");
      // Remove this block from handleDeclineFriendRequest function
      const updatedNotifications = [...notifications];
      updatedNotifications[index].removed = true;
      setNotifications(updatedNotifications);
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));


    } catch (err) {
      console.log("ERROR");
      console.error(err);
    }

    // Update the notifications state and localStorage
    const updatedNotifications = [...notifications];
    updatedNotifications[index].removed = true;
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const handleDeclineFriendRequest = async (event, notificationId, friendName, Subject) => {
    event.stopPropagation();
    try {
      const form = JSON.stringify({
        UserID: user,
        Friend: friendName,
        Subject: Subject,
        Action: "reject",
      });
      console.log(form);
      const response = await axios.post(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/replyFriend`, form, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log("Declined");
      console.log(response);
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, removed: true };
        } else {
          return notification;
        }
      });
        console.log("UPDATE", updatedNotifications);
      setNotifications(updatedNotifications);
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    } catch (err) {
      console.error(err);
    }
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
      const response = await axios.get(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/listFriends/${user}`);
      const fetchedData = response.data.fetched;

      if (fetchedData) {
        const pendingFriendRequests = fetchedData.filter(item => typeof item.Id === 'string' && item.Id.startsWith('?'));
        const subjectArray = fetchedData
          .filter(item => typeof item.Subject === 'string')
          .map(item => item.Subject);

        // Set Subject to the first non-empty value in subjectArray, or to a default value if none are found
        setSubject(subjectArray.find(subject => subject !== '') || 'DefaultSubject');


        // Now you can use pendingFriendRequests within this scope
        if (pendingFriendRequests.length > 0) {
          const newNotifications = pendingFriendRequests
            .map((request) => {
              const friendName = request.Id.substring(1);
              return {
                title: `${friendName} added you`,
                message: `${friendName} wants to be friend with you`,
                subject: `${Subject}`,
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
      } else {
        console.error("fetchedData is null or undefined");
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
                              onClick={(event) => handleAcceptFriendRequest(event, notification.title.split(" ")[0], index, Subject)}
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
                              onClick={(event) => handleDeclineFriendRequest(event, notification.id, notification.title.split(" ")[0], Subject)}
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