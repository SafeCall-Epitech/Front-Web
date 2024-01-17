import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/profile';
import The_user_profile from './pages/the_user_profile';
import My_popup_profile from './pages/popup_profile';
import My_wfriend_profile from './pages/wfriend_profile';
import WF_popup_profile from './pages/wfpopup_profile';
import My_Calendar from './pages/Calendar/Calendar';
import My_Error from './pages/error';
import My_login from './pages/login';
import My_Search from './pages/searchbar';
import My_Notifications from './pages/notification';
import My_Messages from './pages/Chat_part/Selection';
import My_Form from './pages/popupForm';
import My_Register from './pages/register';
import My_Call from './pages/call_popup';
import My_Mobile_Call from './pages/mobile_call';

class App extends Component {
  
  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/login" element={<My_login />} />
          <Route exact path="/My_user_profile" element={<The_user_profile />} />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/popup_profile" element={<My_popup_profile />} />
          <Route exact path="/wfriend_profile" element={<My_wfriend_profile />} />
          <Route exact path="/wfpopup_profile" element={<WF_popup_profile />} />
          <Route exact path="/Calendar" element={<My_Calendar />} />
          <Route exact path="/error" element={<My_Error />} />
          <Route exact path="/search" element={<My_Search />} />
          <Route exact path="/Notifications" element={<My_Notifications />} />
          <Route exact path="/messages" element={<My_Messages />} />
          <Route exact path="/Form" element={<My_Form />} />
          <Route exact path="/Register" element={<My_Register />} />
          <Route exact path="/Call" element={<My_Call />} />
		      <Route exact path="/My_user_profile/:username" element={<The_user_profile />} />
		      <Route exact path="/My_wfriend_profile/:username" element={<My_wfriend_profile />} /> 
          <Route exact path="/Call/:username" element={<My_Call />} />
          <Route exact path="/Call/:Guest" element={<My_Call />} />
          <Route exact path="/phonecall/:username/:user" element={<My_Mobile_Call />} />
          
        </Routes>
      </Router>
    );
  }
}

export default App;