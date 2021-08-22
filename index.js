const Mqtt = require('./mqtt')
const Modbus = require('./modbus')
const EventEmitter = require('events')

class ModbusMqtt extends EventEmitter {
  constructor (options) {
    super()
    this.mqttClient = new Mqtt(options.mqttOptions)
    this.publishOptions = options.mqttOptions.publishOptions

    this.mqttClient.on('mqtt-connect', () => {
      options.modbusOptions.publisher = this.publish.bind(this)
      this.modbusClient = new Modbus(options.modbusOptions)
      this.emit('mqtt-connect')
      this.modbusClient.on('modbus-initialized', () => {
        this.emit('modbus-connect')
      })
      this.modbusClient.on('modbus-error', err => {
        this.emit('modbus-error', err)
      })
      this.modbusClient.on('modbus-socket-error', err => {
        this.emit('modbus-socket-error', err)
      })
      this.modbusClient.on('modbus-close', () => {
        this.emit('modbus-close')
      })

      this.modbusClient.initialize()
    })

    this.mqttClient.on('mqtt-error', err => {
      this.emit('mqtt-error', err)
    })
  }

  publish (topic, data) {
    if (this.publishOptions) {
      this.mqttClient.client.publish(topic, JSON.stringify(data), this.publishOptions)
    } else {
      this.mqttClient.client.publish(topic, JSON.stringify(data))
    }
  }
}

module.exports = ModbusMqtt
