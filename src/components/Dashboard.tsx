import React from 'react'
import WebSocketProvider from '../services/WebSocketProvider'
import Helpers from '../utilities/Helpers'
import Stories from './partials/Stories'
import D3Bar from './charts/D3Bar'
import D3Geo from './charts/D3Geo'
import ElectionsAPI from '../api/ElectionsAPI'
import MapLibre from './charts/MapLibre'
import '../scss/map-libre.scss'
import '../scss/global.scss'

interface Props {}

interface State {
	electionData: any
	pollData: any
	emitRaceStarted: boolean
}

class Dashboard extends React.Component<Props, State> {
	constructor(props: {}) {
		super(props)

		this.state = {
			electionData: null,
			pollData: null,
			emitRaceStarted: false,
		}
	}

	handleWebSocketOpen(): void {}

	handleWebSocketMessage(event: any): void {
		const parsedData = Helpers.parseWebSocketData(event.data)
		console.log('handleWebSocketMessage: parsedData: ', parsedData)

		if (parsedData.data && parsedData.description) {
			const description = parsedData.description.toLowerCase()
			if (description === 'electionrace') {
				this.setState({
					emitRaceStarted: true,
					electionData: parsedData.data,
				})
			} else if (description === 'polls') {
				this.setState({
					pollData: parsedData.data,
				})
			}
		}
	}

	async startServerElectionTimer(): Promise<void> {
		await ElectionsAPI.startEmitElectionRace()
		this.setState({
			emitRaceStarted: true,
		})
	}

	async stopServerElectionTimer(): Promise<void> {
		await ElectionsAPI.stopEmitElectionRace()
		this.setState({
			emitRaceStarted: false,
		})
	}

	addWebSocketListeners(): void {
		WebSocketProvider.addEventListener('open', this.handleWebSocketOpen.bind(this))
		WebSocketProvider.addEventListener('message', this.handleWebSocketMessage.bind(this))
	}

	removeWebSocketListeners(): void {
		WebSocketProvider.removeEventListener('open', this.handleWebSocketOpen.bind(this))
		WebSocketProvider.removeEventListener('message', this.handleWebSocketMessage.bind(this))
	}

	componentDidMount(): void {
		this.addWebSocketListeners()
	}

	componentWillUnmount(): void {
		this.removeWebSocketListeners()
	}

	render() {
		return (
			<>
				<div className="section bg-white">
					<div className="row gx-0 heading-row">
						<div className="col-md-12">
							<h1>Real-Time Data Visualization</h1>
						</div>
					</div>
					<div className="container py-4">
						<h4 className="text-center pb-3">MapLibre</h4>
						<div className="row gx-5">
							<div className="col-md-12">
								<MapLibre />
							</div>
						</div>
					</div>
					<hr className="style-one" />
					<div className="container py-4">
						<h4 className="text-center pb-3">D3</h4>
						<div className="row gx-5">
							<div className="col-md-9">
								<D3Geo electionData={this.state.electionData} />
							</div>
							<div className="col-md-3">
								<div className="p-3 border bg-light">
									<div className="d-grid gap-2">
										<button
											type="button"
											className="btn dark-border my-3"
											onClick={() => {
												if (this.state.emitRaceStarted) {
													this.stopServerElectionTimer()
												} else {
													this.startServerElectionTimer()
												}
											}}
										>
											{this.state.emitRaceStarted ? 'Stop Live Results' : 'Get Live Results'}
										</button>
									</div>

									<p style={{ textAlign: 'center' }}>Presidential Race Data (WebSockets)</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Stories />
				<div className="section bg-dark-gradient">
					<div className="container py-4">
						<h4 className="text-center pb-3">D3</h4>
						<div className="row gx-5">
							<div className="col-md-3">
								<div className="card min-height-lg">
									<img src="assets/channels4_profile.jpeg" className="card-img-top p-3" style={{ width: '50%' }} />
									<div className="card-body">
										<h5 className="card-title">See Live Broadcast Tonight at 9ET!</h5>
										<p className="card-text">
											Bacon ipsum dolor amet beef ground round hamburger swine, pork belly ham hock pastrami. Cupim beef ribs short ribs tenderloin. Beef pork loin brisket
											bresaola, leberkas burgdoggen t-bone prosciutto doner sirloin jerky.
										</p>
									</div>
								</div>
							</div>
							<div className="col-md-9">
								<div className="card min-height-lg">
									<div className="card-body">
										<h5 className="card-title">Polling Data (Google Sheets Kinesis Stream)</h5>
										<p className="card-text">Manipulate data in Google Sheets, and watch it update here via WebSockets and Kinesis.</p>
										<D3Bar pollData={this.state.pollData} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}
}

export default Dashboard
