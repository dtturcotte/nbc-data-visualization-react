import React from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

interface Props {
	electionData: any
}

interface State {
	data: any
	states: any
}

class Geo extends React.Component<Props, State> {
	private mapDOMRef: React.RefObject<HTMLDivElement>

	constructor(props: Props) {
		super(props)
		// Access DOM elements via typical React flow (virtual DOM)
		this.mapDOMRef = React.createRef()
		this.state = {
			data: null,
			states: null,
		}
	}

	/*
		Update D3 states map with new data
	*/
	updateD3StatesMap(data: any) {
		const states = this.state.states
		let matchingState = states.find((state: any) => state.properties.name.toLowerCase() === data.state_name.toLowerCase())

		if (!matchingState) {
			return
		}

		matchingState.winner = data.leader_party_id === 'republican' ? 'rep' : 'dem'
		matchingState.margin = data.leader_margin_value

		// The upper range of the scale
		const maxMargin = d3.max(states, (d: any) => d.margin)
		// The lower range of the scale will be the opposite of the maxMargin (e.g., [-86, 86])
		const minMargin = -maxMargin
		const colorA = 'blue'
		const colorB = 'red'
		const colorInterpolation = d3.interpolate(colorA, colorB)
		const colorScale = d3.scaleSequential().interpolator(colorInterpolation).domain([minMargin, maxMargin])

		// Bind the updated states data to the paths
		// prettier-ignore
		const paths = d3
			.select(this.mapDOMRef.current)
			.selectAll('path')
			.data(states, (d: any) => d.properties.name)

		// Update the fill color based on the new data
		// prettier-ignore
		paths.transition()
         	.duration(500)
        	.style('fill', (d: any) => (d.winner === 'dem' ? colorScale(-d.margin) : colorScale(d.margin)));
	}

	/*
		Create map with data to be filled by WebSocket
	*/
	async createD3Map(mapType: string, isStroke: boolean) {
		const width = 975
		const height = 610
		let geoPath: any
		let geoJSONPath: string
		let attr: string
		if (mapType === 'states') {
			geoPath = d3.geoPath()
			geoJSONPath = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json'
			attr = 'states'
		} else {
			geoPath = d3.geoPath().projection(d3.geoNaturalEarth1())
			geoJSONPath = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
			attr = 'countries'
		}
		const geoData = await d3.json(geoJSONPath)
		const states = topojson.feature(geoData, geoData.objects[attr]).features

		// Create SVG
		// prettier-ignore
		const svg = d3
			.select(this.mapDOMRef.current)
			// .select('#map')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', [0, 0, width, height])
			.attr('style', 'width: 100%; height: auto; height: intrinsic;')

		// Append states path
		// prettier-ignore
		svg
			.append('g')
			.attr('stroke', '#444')
			.attr('fill', '#eee')
			.selectAll('path')
			.data(states)
			.join('path')
			.attr('d', geoPath)

		if (isStroke) {
			svg.attr('vector-effect', 'non-scaling-stroke')
		} else {
			svg.style('fill', 'lightgray').style('stroke', 'white')
		}

		this.setState({
			states: states,
		})
	}

	componentDidUpdate(prevProps: any): void {
		// Has electionData prop changed?
		if (this.props.electionData !== prevProps.electionData) {
			this.updateD3StatesMap(this.props.electionData)
		}
	}

	componentDidMount(): void {
		// 'states' or 'countries'
		this.createD3Map('states', true)
	}

	componentWillUnmount(): void {}

	render() {
		// prettier-ignore
		return (
			<>
                <div ref={this.mapDOMRef} id="map"></div>
			</>
		)
	}
}

export default Geo
