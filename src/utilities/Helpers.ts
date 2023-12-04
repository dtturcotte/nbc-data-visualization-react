import pako from 'pako'

class Helpers {
	/*
		Decompress data using pako.inflate
	*/
	public static parseCompressedData(result: any) {
		const decompressedData = pako.inflate(result.data, { to: 'string' })
		result.data = JSON.parse(decompressedData)
		return result
	}

	/*
		Parse Websocket data
	*/
	public static parseWebSocketData(data: any) {
		let result = null

		// 1) Check if data is JSON data
		try {
			result = JSON.parse(data)
		} catch (error) {
			throw error
		}

		if (!result.data) {
			return result
		}

		// 2) If not, check if data is compressed binary data
		try {
			return this.parseCompressedData(result)
		} catch (decompressionError) {
			console.error('parseWebSocketData: failed to decompress and parse the data:', decompressionError)
			// Handle the case where the data is neither JSON nor compressed
			return data
		}
	}

	/*
		Add new data to array if not exists, otherwise update
	*/
	public static upsertArrayData(oldData: any[], newData: any[]) {
		newData.forEach((datum: any) => {
			const index = oldData.findIndex((obj) => obj.id === datum.id)
			if (index > -1) {
				// Update existing record
				oldData[index] = datum
			} else {
				// Add new record
				oldData.push(datum)
			}
		})

		return oldData
	}
}

export default Helpers
