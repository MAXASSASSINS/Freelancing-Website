import React, { Fragment, useEffect, createContext, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css';
import "./app.css"
import { Footer } from './component/Footer/Footer';
import { Header } from './component/Header/Header';
import { Sidebar } from './component/Sidebar/Sidebar';
import { Home } from './component/Home/Home';
import { Routes, Route, useParams, Navigate, useNavigate } from 'react-router-dom'
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
import { loadUser } from './actions/userAction';
import store from './store';
import { NotFoundPage } from './component/NotFoundPage/NotFoundPage';
import { CreateGig } from './component/CreateGig/CreateGig';

import { SocketContext } from './context/socket/socket';
import { socket } from './context/socket/socket';

export const windowContext = createContext();

// export const socket = io.connect("http://localhost:4000");

const App = () => {
	let { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, isAuthenticated } = useSelector(state => state.user);

	const [windowWidth, setWindowWidth] = useState(0);
	const [windowHeight, setWindowHeight] = useState(0);

	const dimBackground = useSelector(state => state.dimBackground);
	let height = document.documentElement.offsetHeight;
	let width = document.documentElement.offsetWidth;
	const pageheight = window.innerHeight;
	height = Math.max(pageheight, height);


	useEffect(() => {
		// i have put .then to resolve the promise and lead us to the page where we come from this is working now
		store.dispatch(loadUser()).then(() => {
			// console.log("app navigate is running");
			navigate();
		});
	}, [])





	let resizeWindow = () => {
		setWindowWidth(window.innerWidth);
		setWindowHeight(window.innerHeight);
	};

	useEffect(() => {
		// console.log(windowWidth);
		resizeWindow();
		window.addEventListener("resize", resizeWindow);
		return () => window.removeEventListener("resize", resizeWindow);
	}, [resizeWindow]);







	return (

		<>
			<windowContext.Provider value={{ windowWidth, windowHeight }}>
				<SocketContext.Provider value={socket}>
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
						<Route path='*' element={<NotFoundPage />} />
						<Route exact path='/gig/create/new/gig' element={<CreateGig />}></Route>
					</Routes>
					{/* <Footer /> */}
				</SocketContext.Provider>
			</windowContext.Provider>
		</>
	);
}

export default App;