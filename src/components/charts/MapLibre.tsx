import React from 'react'
import maplibregl from 'maplibre-gl'
import '../../scss/map-libre.scss'
import ElectionsAPI from '../../api/ElectionsAPI'
import * as topojson from 'topojson-client'

interface Props {}

interface State {}

interface MapValues {
	lat: number
	lng: number
	zoom: number
	hoveredStateId: number
}

class MapLibre extends React.Component<Props, State> {
	private map: any
	private mapContainerDOMRef: React.RefObject<HTMLDivElement>
	private apiKey: string
	private mapValues: MapValues

	constructor(props: Props) {
		super(props)

		this.apiKey = 'HRvoOKbvZ1qVWHa4PRWx'
		this.map = null
		this.mapContainerDOMRef = React.createRef()

		this.mapValues = {
			lat: 40.7128,
			lng: -74.006,
			zoom: 2,
			hoveredStateId: null,
		}
	}

	/*
		Create a Maplibre map and populate it with precinct data
	*/
	async createMap(): Promise<void> {
		if (this.map) {
			return
		}

		const geoData = await ElectionsAPI.getNYCElectionsJSON()
		const nycElectionsData = topojson.feature(geoData, geoData.objects.eds)

		this.map = new maplibregl.Map({
			container: this.mapContainerDOMRef.current,
			style: `https://api.maptiler.com/maps/streets/style.json?key=${this.apiKey}`,
			center: [this.mapValues.lng, this.mapValues.lat],
			zoom: 10,
		})

		// Wait for the map to load
		await new Promise((resolve, reject) => {
			this.map.on('load', resolve)
		})

		// Now that the map is loaded, add the source and layer
		// prettier-ignore
		this.map.addSource(
			'states', 
			{
				type: 'geojson',
				data: nycElectionsData,
			}
		)

		this.map.addLayer({
			id: 'state-fills',
			type: 'fill',
			source: 'states',
			layout: {},
			paint: {
				// prettier-ignore
				'fill-color': [
					'interpolate',
					['linear'],
					// use ['get', 'propertyName'] within a MapLibre expression when I need to access a property of the properties object within a GeoJSON feature
					// 		if the property is directly in the "feature" object, you can use the attr directly
					['to-number', ['id']],
					0, 'blue',
					2500, 'purple',
					5000, 'red'
				],
				// prettier-ignore
				'fill-opacity': 
				[
					'case', 
					[
						'boolean', 
						[
							'feature-state', 
							'hover'
						], 
						false
					], 
					1, 
					0.75
				],
			},
		})

		this.map.addLayer({
			id: 'state-borders',
			type: 'line',
			source: 'states',
			layout: {},
			paint: {
				'line-color': 'black',
				'line-width': 1,
			},
		})

		// When mouse moves over the state-fills layer, update the state color
		this.map.on('mousemove', 'state-fills', (e: any) => {
			if (e.features.length > 0) {
				if (this.mapValues.hoveredStateId) {
					this.map.setFeatureState({ source: 'states', id: this.mapValues.hoveredStateId }, { hover: false })
				}
				this.mapValues.hoveredStateId = e.features[0].id
				this.map.setFeatureState({ source: 'states', id: this.mapValues.hoveredStateId }, { hover: true })
			}
		})

		this.map.on('mouseleave', 'state-fills', () => {
			if (this.mapValues.hoveredStateId) {
				// prettier-ignore
				this.map.setFeatureState(
                    {source: 'states', id: this.mapValues.hoveredStateId},
                    {hover: false}
                )
				this.mapValues.hoveredStateId = null
			}
		})
	}

	componentDidUpdate(prevProps: any): void {}

	componentDidMount(): void {
		this.createMap()
	}

	componentWillUnmount(): void {}

	render() {
		// prettier-ignore
		return (
			<>
				<div className="map-wrap">
					<div ref={this.mapContainerDOMRef} className="map" />
				</div>
			</>
		)
	}
}

export default MapLibre
