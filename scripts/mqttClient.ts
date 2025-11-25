import mqtt from "mqtt";

export const mqttClient = mqtt.connect('ws://89.116.191.188:9001', {
    reconnectPeriod: 2000
})

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
})

mqttClient.on('error', () => {
    console.log('Failed to connected to MQTT broker');
})
