// TODO: Look into https://www.npmjs.com/package/react-use-websocket and https://legacy.reactjs.org/docs/context.html

// Initialize the WebSocket connection here
let ws = new WebSocket('ws://localhost:3011')
// Note: Websockets can send text (UTF8 data) and binary data (Blob and ArrayBuffer). We'll be receiving binary data
// 		This sets the websocket to handle / interpret binary data it sends / receives
ws.binaryType = 'arraybuffer'

ws.onerror = (error) => {
	console.error('WebSocket Provider: error:', error)
}

ws.onclose = () => {
	console.log('WebSocket Provider: connection closed')
}

ws.onopen = () => {
	console.log('WebSocket Provider: connected to server')
	if (ws.readyState === WebSocket.OPEN) {
		console.log('Safe to send messages')
	}
}

ws.onmessage = (event) => {}

export default ws
