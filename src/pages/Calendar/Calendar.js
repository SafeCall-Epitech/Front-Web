import { Center, Text, Box, Button, Flex, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverFooter, PopoverArrow, PopoverCloseButton, Input } from '@chakra-ui/react';
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
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalBody,
    MDBModalTitle,  // Add this line
    MDBModalFooter,
    MDBModalHeader,  // Add this line

    MDBTypography,
    MDBListGroupItem

} from 'mdb-react-ui-kit';
import axios from 'axios';


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import Calendar from 'react-calendar';
import "./Calendar.css";

export default function CalendarPage() {


    const user = JSON.parse(localStorage.getItem('user'));
    sessionStorage.setItem("user_name", JSON.parse(localStorage.getItem('user')).toLowerCase())
    const [date, setDate] = useState(new Date());
    const [agenda, setAgenda] = useState([]);
    const [eventDate, setEventDate] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [showTime, setShowTime] = useState(false);
    const initRef = React.useRef();
    const [modalShow, setModalShow] = useState(false); // State to manage modal visibility
    const [selectedEvent, setSelectedEvent] = useState(null); // State to hold the selected event
    const navigate = useNavigate();



    useEffect(() => {
        const fetchAgenda = async () => {
            try {
                const res2 = await axios.get(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/listEvent/${user}`)

                const data = res2.data["Success "];

                if (data && data.length > 0) {
                    setAgenda(data); // Set agenda with the fetched data initially
                }
            } catch (error) {
                console.log("error : ");
                console.error(error);
            }
        };

        fetchAgenda();
    }, [user]);


    useEffect(() => {
        // Filter events when the component first loads with the initial date
        filterEventsByDate(date);
    }, [date, agenda]);

    function isToday(eventDate) {
        const eventDateObj = new Date(eventDate);
        const currentDate = new Date();
        return (
            eventDateObj.getDate() === currentDate.getDate() &&
            eventDateObj.getMonth() === currentDate.getMonth() &&
            eventDateObj.getFullYear() === currentDate.getFullYear()
        );
    }

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        console.log("Selected Event:", event); // Add this line for debugging
        setModalShow(true);
    };

    const handleDateClick = (date) => {
        setDate(date); // Update the selected date
        filterEventsByDate(date); // Filter events for the selected date
    };

    const filterEventsByDate = (selectedDate) => {
        const selectedDateString = selectedDate.toDateString();
        const filtered = agenda.filter((event) => {
            const eventDateString = new Date(event.Date).toDateString();
            return eventDateString === selectedDateString;
        });
        setFilteredEvents(filtered);
    };

    const handleJoinCall = (guests) => {
        const guestArray = guests.split('+');
        const firstGuest = guestArray[0];
        const secondGuest = guestArray[1];
        let guestName = (firstGuest === user) ? secondGuest : firstGuest;
        navigate(`/Call/${guestName}`);
    };

    return (
        <>
            <Flex>
                {/* Calendar on the left */}
                <Box p={-20} m={50}>
                    <Box pb={20}></Box>
                    <Center>
                        <Calendar
                            locale="en-GB"
                            onChange={setDate}
                            value={date}
                            onClickDay={handleDateClick}
                            tileContent={({ date, view }) => {
                                if (view === 'month') {
                                    const selectedDate = date.toDateString();
                                    const hasEvent = agenda.some((event) => {
                                        const eventDateString = new Date(event.Date).toDateString();
                                        return eventDateString === selectedDate;
                                    });
                                    return hasEvent ? <div className="dot"></div> : null;
                                }
                            }}
                        />
                    </Center>
                </Box>

                {/* Event list on the right */}
                <Box flex="1" p={4}>
                    <Center m={20}>
                        <Text as='em' color="#FC6976" fontSize='lg'>{date.toLocaleDateString()}</Text>
                    </Center>

                    {/* Display filtered events */}
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event, index) => (
                            <div key={index} onClick={() => handleEventClick(event)}>
                                <strong>Guests:</strong> {event.Guests.replace(/\+/g, ' and ')} <br />
                                <strong>Subject:</strong> {event.Subject} <br />
                                <strong>Date:</strong> {event.Date.split('T')[0]}

                                {/* Add the "Join Call" button */}
                                {isToday(event.Date) && (
                                    <MDBBtn
                                        color="dark"
                                        onClick={() => handleJoinCall(event.Guests)}
                                    >
                                        <i className="fas fa-phone"></i> Join Call
                                    </MDBBtn>
                                )}

                                <hr /> {/* Add a horizontal line to separate events */}
                            </div>
                        ))
                    ) : (
                        "No events for this day"
                    )}

                </Box>
            </Flex>
        </>
    );
}