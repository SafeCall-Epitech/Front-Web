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
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

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


    useEffect(() => {
        const fetchAgenda = async () => {
            try {
                const res2 = await axios.get(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/listEvent/${user}`)

                const data = res2.data["Success "];


                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const event = data[i];
                        const guests = user + event.Guests;
                        const date = event.Date;
                        const subject = event.Subject;
                        const Event = event.Guests + " / " + event.Date + " / " + event.Subject;
                    }
                }
                setAgenda(data);


            } catch (error) {
                console.log("error : ");

                console.error(error);
            }
        };

        fetchAgenda();
    }, []);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        console.log("Selected Event:", event); // Add this line for debugging
        setModalShow(true);
    };

    const filterEventsByDate = () => {
        const selectedDateString = date.toDateString();
        const filtered = agenda.filter((event) => {
            const eventDateString = new Date(event.Date).toDateString();
            if (eventDateString === selectedDateString) {
                return true;
            }
            return false;
        });
        setFilteredEvents(filtered);

    };
    return (
        <>
            <Box p={-20} m={50}>
                <Box pb={20}></Box>
                <Center>
                    <Calendar
                        locale="en-GB"
                        onChange={setDate}
                        value={date}
                        onClickDay={() => setShowTime(true)}
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
            <Center m={2}>
                <Text as='em' color="#FC6976" fontSize='lg'>{date.toLocaleDateString()}</Text>
            </Center>
            <Center>
                    <Popover>
                        <PopoverTrigger>
                            <Center>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        className="ripple ripple-surface btn btn-dark btn-rounded btn-mg btn-block"
                                        width={'160px'}
                                        onClick={() => {
                                            filterEventsByDate();
                                            setModalShow(true);
                                        }}
                                    >
                                        Daily Events
                                    </Button>
                                </div>
                            </Center>
                        </PopoverTrigger>
                    </Popover>
                    {/* Other Popover components, if any */}
            </Center>

            {/* Modal for displaying event details */}
            <MDBModal show={modalShow} setShow={setModalShow} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Event Details</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={() => setModalShow(false)}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event, index) => (
                                    <div key={index}>
                                        <strong>Guests:</strong> {event.Guests.replace(/\+/g, ' and ')} <br />
                                        <strong>Subject:</strong> {event.Subject} <br />
                                        <strong>Date:</strong> {event.Date.split('T')[0]}

                                        <hr /> {/* Add a horizontal line to separate events */}
                                    </div>
                                ))
                            ) : (
                                "No events for this day"
                            )}
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn rounded className='mx-2' color='dark' onClick={() => setModalShow(false)}>
                                Close
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}    