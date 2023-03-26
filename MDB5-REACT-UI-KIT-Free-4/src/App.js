import React, { Component } from 'react';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
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



class App extends Component {
render() {
	return (
	<Router>
		<Routes>
				<Route exact path='/login' element={< My_login />}></Route>
				<Route exact path='/My_user_profile' element={< The_user_profile />}></Route>
				<Route exact path='/' element={< Home />}></Route>
				<Route exact path='/popup_profile' element={< My_popup_profile />}></Route>
				<Route exact path='/wfriend_profile' element={< My_wfriend_profile />}></Route>
				<Route exact path='/wfpopup_profile' element={< WF_popup_profile />}></Route>
				<Route exact path='/Calendar' element={< My_Calendar />}></Route>
				<Route exact path='/error' element={< My_Error />}></Route>
				<Route exact path='/search' element={< My_Search />}></Route>
				<Route exact path='/Notifications' element={< My_Notifications />}></Route>


		</Routes>
	</Router>
);
}
}

export default App;