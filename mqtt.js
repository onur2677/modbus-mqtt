const mqtt = require('mqtt')
const EventEmitter = require('events')

class Mqtt extends EventEmitter {
    constructor(options) {
        super()
        this.client = options.clientOptions ? mqtt.connect(options.brokerUrl, options.clientOptions) : mqtt.connect(options.brokerUrl)
        this.client.on('connect', () => {
            this.emit('mqtt-connect')
        })
        this.client.on('error', err => {
            this.emit('mqtt-error', err)
        })
    }
}

module.exports = Mqtt