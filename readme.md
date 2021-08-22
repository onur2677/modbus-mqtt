# Modbus-IoT

This module sends Modbus data to MQTT protocol

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Supported Modbus Functions
<table>
<thead>
<tr>
<th>Class</th>
<th>Function</th>
</tr>
</thead>
<tbody>
<tr>
<td>FC1 "Read Coil Status"</td>
<td><code>readCoils(coil, len)</code></td>
</tr>
<tr>
<td>FC2 "Read Input Status"</td>
<td><code>readDiscreteInputs(addr, arg)</code></td>
</tr>
<tr>
<td>FC3 "Read Holding Registers"</td>
<td><code>readHoldingRegisters(addr, len) </code></td>
</tr>
<tr>
<td>FC4 "Read Input Registers"</td>
<td><code>readInputRegisters(addr, len) </code></td>
</tr>
<tr>
<td>FC43/14 "Read Device Identification" (supported ports: TCP, RTU)</td>
<td><code>readDeviceIdentification(id, obj)</code></td>
</tr>
</tbody>
</table>

## MQTT Subscribe Topic Structure

```modbus-iot/{modbusId}/{functionName}```

Example; ```modbus-iot/12/readInputRegisters```


## Example 

```js
const ModbusMqtt = require('./index')

const options = {
  mqttOptions: {
    brokerUrl: 'mqtt://broker.mqttdashboard.com'
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
  }, 1000)

  setInterval(() => {
    modbusMqtt.modbusClient.readInputRegisters(20, 10)
  }, 2000)
})
```

![image](https://user-images.githubusercontent.com/23284052/130330770-ae1fa856-e32d-4298-83a2-002659b081b6.png)
