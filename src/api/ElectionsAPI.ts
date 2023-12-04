import React from 'react'
import config from '../config'

const endpoint = 'elections'

class ElectionsAPI extends React.Component {
	static async getStateElectionsJSON() {
		try {
			const result = await fetch(`${config.apiPath}/${endpoint}/nyt2020_json`, {
				method: 'GET',
			})

			if (!result.ok) {
				throw new Error(`getStateElectionsJSON Error: responded with status: ${result.status}`)
			}

			const responseData = await result.json()

			console.log(`getStateElectionsJSON Success: `, responseData)
			return responseData
		} catch (error) {
			console.error(`getStateElectionsJSON Error: `, error)
			throw error
		}
	}

	static async getNYCElectionsJSON() {
		try {
			const result = await fetch(`${config.apiPath}/${endpoint}/nyc_districts_geojson`, {
				method: 'GET',
			})

			if (!result.ok) {
				throw new Error(`getNYCElectionsJSON Error: responded with status: ${result.status}`)
			}

			const responseData = await result.json()

			console.log(`getNYCElectionsJSON Success: `, responseData)
			return responseData
		} catch (error) {
			console.error(`getNYCElectionsJSON Error: `, error)
			throw error
		}
	}

	static async startEmitElectionRace() {
		try {
			const result = await fetch(`${config.apiPath}/${endpoint}/start_emit_election_race`, {
				method: 'GET',
			})

			if (!result.ok) {
				throw new Error(`startEmitElectionRace Error: responded with status: ${result.status}`)
			}

			console.log(`startEmitElectionRace Success: `, result)
			return result
		} catch (error) {
			console.error(`startEmitElectionRace Error: `, error)
			throw error
		}
	}

	static async stopEmitElectionRace() {
		try {
			const result = await fetch(`${config.apiPath}/${endpoint}/stop_emit_election_race`, {
				method: 'GET',
			})

			if (!result.ok) {
				throw new Error(`stopEmitElectionRace Error: responded with status: ${result.status}`)
			}

			console.log(`stopEmitElectionRace Success: `, result)
			return result
		} catch (error) {
			console.error(`stopEmitElectionRace Error: `, error)
			throw error
		}
	}
}

export default ElectionsAPI
