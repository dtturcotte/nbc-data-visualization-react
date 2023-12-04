import React from 'react'
import * as d3 from 'd3'
import Helpers from '../../utilities/Helpers'
import PollsAPI from '../../api/PollsAPI'

interface Props {
	pollData: any
}

interface State {
	pollData: any[]
	chart: {
		svg: any
		x: any
		xAxis: any
		y: any
		yAxis: any
		width: number
		height: number
	}
}

class Bar extends React.Component<Props, State> {
	private barDOMRef: React.RefObject<HTMLDivElement>

	constructor(props: Props) {
		super(props)
		// Access DOM elements via typical React flow (virtual DOM)
		this.barDOMRef = React.createRef()
		this.state = {
			pollData: [],
			chart: {
				svg: null,
				x: null,
				xAxis: null,
				y: null,
				yAxis: null,
				width: 0,
				height: 0,
			},
		}
	}

	/*
		Merge or add new data record
	*/
	updateData(callback: any) {
		// Clone the original arrays
		const oldData = [...this.state.pollData]
		const newData = [...this.props.pollData]

		const upsertedData = Helpers.upsertArrayData(oldData, newData)

		this.setState({ pollData: upsertedData }, callback.bind(this))
	}

	/*
		Update D3 chart with new data
	*/
	updateD3Chart(data: any, chart: any) {
		const { svg, x, y, xAxis, yAxis, width, height } = chart

		// Update X axis
		x.domain(data.map((d: any) => d.name))
		xAxis.call(d3.axisBottom(x))

		// Update Y axis
		y.domain([0, d3.max(data, (d: any) => d.value)])
		yAxis.transition().duration(1000).call(d3.axisLeft(y))

		// D3 selection of all "rect" elements
		const rects = svg.selectAll('rect').data(data)

		// Enter: find all elements without a corresponding element... enter() represents the new data points
		rects
			.enter()
			// Add a new rectangle for each new elements
			.append('rect')
			// Combines "enter()" selection (new elements) with existing elements (selected by "rect")
			.merge(rects)
			// Apply changes to all existing elements
			.transition()
			.duration(1000)
			.attr('x', (d: any) => x(d.name))
			.attr('y', (d: any) => y(d.value))
			.attr('width', x.bandwidth())
			.attr('height', (d: any) => height - y(d.value))
			.attr('fill', '#69b3a2')

		// Exit(): find elements no longer needed, then remove() them
		rects.exit().remove()
	}

	/*
		Create initial D3 chart
	*/
	createD3Chart() {
		let width = 600
		let height = 400

		const margin = { top: 30, right: 30, bottom: 70, left: 60 }

		width = width - margin.left - margin.right
		height = height - margin.top - margin.bottom

		const svg = d3
			.select(this.barDOMRef.current)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

		const x = d3.scaleBand().range([0, width]).padding(0.2)
		const xAxis = svg.append('g').attr('transform', 'translate(0,' + height + ')')

		const y = d3.scaleLinear().range([height, 0])
		const yAxis = svg.append('g')

		this.setState({
			chart: {
				svg,
				x,
				xAxis,
				y,
				yAxis,
				width,
				height,
			},
		})
	}

	async initializeData(): Promise<void> {
		const pollData = await PollsAPI.getPollsGoogleSheets()

		this.setState({ pollData }, () => {
			this.updateD3Chart(this.state.pollData, this.state.chart)
		})
	}

	componentDidUpdate(prevProps: any): void {
		// Check if pollData prop has changed
		if (this.props.pollData !== prevProps.pollData) {
			this.updateData(() => {
				this.updateD3Chart(this.state.pollData, this.state.chart)
			})
		}
	}

	componentDidMount(): void {
		this.initializeData()
		this.createD3Chart()
	}

	componentWillUnmount(): void {}

	render() {
		// prettier-ignore
		return (
			<>
				{this.state.pollData && <div ref={this.barDOMRef} id="chart_poll_data"></div>}
			</>
		)
	}
}

export default Bar
