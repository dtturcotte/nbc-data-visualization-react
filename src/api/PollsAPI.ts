import React from 'react'
import config from '../config'

const endpoint = 'polls'

class PollsAPI extends React.Component {
	static async getPollsGoogleSheets() {
		try {
			const result = await fetch(`${config.apiPath}/${endpoint}/google_sheets`, {
				method: 'GET',
			})

			if (!result.ok) {
				throw new Error(`getPollsGoogleSheets Error: responded with status: ${result.status}`)
			}

			const responseData = await result.json()

			console.log(`getPollsGoogleSheets Success: `, responseData)
			return responseData
		} catch (error) {
			console.error(`getPollsGoogleSheets Error: `, error)
			throw new Error(error)
		}
	}

	static async createPollDB(poll: any) {
		try {
			const result = await fetch(`${config.apiPath}/${endpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(poll),
			})

			if (!result.ok) {
				throw new Error(`createPollDB Error: responded with status: ${result.status}`)
			}

			console.log(`createPollDB Success: `, result)
			return result
		} catch (error) {
			console.error(`createPollDB Error: `, error)
			throw new Error(error)
		}
	}
}

export default PollsAPI
