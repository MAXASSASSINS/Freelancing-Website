import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css';
import "./app.css"
import { Footer } from './component/Footer/Footer';
import { Header } from './component/Header/Header';
import { Sidebar } from './component/Sidebar/Sidebar';
import { Home } from './component/Home/Home';
import { Routes, Route, useParams } from 'react-router-dom'
import { UserDetail } from './component/UserDetail/UserDetail';
import { GigDetail } from './component/GigDetail.js/GigDetail';
const App = () => {
	let { id } = useParams();

	const dimBackground = useSelector(state => state.dimBackground);
	let height = document.documentElement.offsetHeight;
	let width = document.documentElement.offsetWidth;
	const pageheight = window.innerHeight;
	height = Math.max(pageheight, height);

	const { loading, error, gigs, gigsCount } = useSelector(state => state.gigs);

	return (
		<Fragment>
			<Header></Header>
			<Routes>
				<Route exact path='/' element={<Home />} />
				{/* {
						gigs && gigs.map(gig => (
							<Sidebar gig={gig} key={gig._id} />
						))
					}
					<div style={{ height: height - (width > 600 ? 81 : 143) }} className={'search-bar-dim-background ' + (dimBackground ? "visible" : null)}></div> */}
				<Route exact path='/user/:id' element={<UserDetail />} />
				<Route exact path='/gig/details/:id' element={<GigDetail />} />
			</Routes>
			<Footer />
		</Fragment>
	);
}

export default App;