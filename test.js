const ModbusMqtt = require('./index')

const options = {
    mqttOptions: {
        brokerUrl: 'mqtt://broker.mqttdashboard.com',
    },
    modbusOptions: {
        type: 'TCP',
        tcp: {
            ip: '127.0.0.1',
            port: 802
        },
        id: 1
    }
}

const modbusMqtt = new ModbusMqtt(options)

modbusMqtt.on('modbus-connect', () => {

    setInterval(() => {
        modbusMqtt.modbusClient.readInputRegisters(0, 10, (err, response) => {
            if (err) return console.log('Err ', err.message)
            console.log('READ INPUT REGISTERS ', response)
        })
    }, 1000);


    setInterval(() => {
        modbusMqtt.modbusClient.readInputRegisters(20, 10)
    }, 2000);

})