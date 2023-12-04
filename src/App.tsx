import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom'
import Header from './components/partials/Header'
import Dashboard from './components/Dashboard'

function Routing() {
	const { pathname } = useLocation()
	return (
		<>
			<Header pathname={pathname} />
			<Routes>
				<Route path="/" element={<Dashboard />} />
			</Routes>
		</>
	)
}

function App() {
	return (
		<div className="App">
			<Router>
				<Routing />
			</Router>
		</div>
	)
}

export default App
