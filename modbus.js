const ModbusRTU = require("modbus-serial");
const EventEmitter = require('events')

const operations = {
    'readCoils': ['coil', 'len'],
    'readDiscreteInputs': ['addr', 'arg'],
    'readHoldingRegisters': ['addr', 'len'],
    'readInputRegisters': ['addr', 'len'],
    'readDeviceIdentification': ['id', 'obj']
}

class Modbus extends EventEmitter {
    constructor(options) {
        super()
        this.options = options
        this.client = new ModbusRTU()
    }

    publish(topic, data) {
        const topicName = `modbus-iot/${this.options.id}/${topic}`
        this.options.publisher(topicName, data)
    }

    initialize() {
        this.client.setID(this.options.id)
        const initialized = () => {
            this.emit('modbus-initialized')
        }
        switch (this.options.type) {
            case 'TCP':
                this.client.connectTCP(this.options.tcp.ip, this.options.tcp, initialized)
                break;
            case 'UDP':
                this.client.connectUDP(this.options.udp.ip, this.options.udp, initialized)
                break;
            case 'SERIAL':
                this.client.connectRTUBuffered(this.options.serialPort.port, this.options.serialPort, initialized)
        }

        this.client.on('error', err => {
            this.emit('modbus-error', err)
        })
        this.client.on('socketError', err => {
            this.emit('modbus-socket-error', err)
        })
        this.client.on('close', () => {
            this.emit('modbus-close')
        })

        for (const [key, value] of Object.entries(operations)) {
            this[key] = (param1, param2, cb) => {
                this.client[key](param1, param2, (err, data) => {
                    const response = {
                        [value[0]]: param1,
                        [value[1]]: param2
                    }
                    if (err) {
                        response.err = err.message
                    } else {
                        response.data = data.data
                    }
                    this.publish(key, response)
                    if (typeof cb === 'function') cb(err, data)
                })
            }
        }
    }

    close(cb) {
        if (typeof cb === 'function') {
            this.client.close(cb)
        } else {
            this.client.close()
        }
    }
}

module.exports = Modbus