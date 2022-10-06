import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css';
import "./app.css"
import { Footer } from './component/Footer/Footer';
import { Header } from './component/Header/Header';
import { Sidebar } from './component/Sidebar/Sidebar';
import { Home } from './component/Home/Home';
import { Routes, Route, useParams, Navigate } from 'react-router-dom'
import { UserDetail } from './component/UserDetail/UserDetail';
import { GigDetail } from './component/GigDetail.js/GigDetail';
import { io } from "socket.io-client";
import { Login } from './component/Login/Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Inbox } from './component/Inbox/Inbox';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import { Test } from './component/Test/Test';
import { CurrentlySelectedClientChat } from './component/CurrentlySelectedClientChat/CurrentlySelectedClientChat';


const App = () => {
	let { id } = useParams();
	const dispatch = useDispatch();

	const { user, isAuthenticated } = useSelector(state => state.loggedUser);


	const dimBackground = useSelector(state => state.dimBackground);
	let height = document.documentElement.offsetHeight;
	let width = document.documentElement.offsetWidth;
	const pageheight = window.innerHeight;
	height = Math.max(pageheight, height);

	const { loading, error, gigs, gigsCount } = useSelector(state => state.gigs);
	
	return (
		<Fragment>
			<Header></Header>
			<ToastContainer />
			<Routes>
				<Route exact path='/get/client/seller/chat:id' element={<CurrentlySelectedClientChat />}></Route>
				<Route exact path='/get/all/messages/for/current/user' element={<Inbox />}></Route>
				<Route exact path='/' element={<Home />} />
				<Route exact path='/login' element={<Login />} />
				{/* {
					gigs && gigs.map(gig => (
						<Sidebar gig={gig} key={gig._id} />
					))
				} */}
				{/* <div style={{ height: height - (width > 600 ? 81 : 143) }} className={'search-bar-dim-background ' + (dimBackground ? "visible" : null)}></div> */}

				<Route exact path='/user/:id' element={<UserDetail />} />
				<Route exact path='/gig/details/:id' element={<GigDetail />} />
			</Routes>
			{/* <Footer /> */}
		</Fragment>
	);
}

export default App;