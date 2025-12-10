import { SERVER_URL } from "@env";
import mqtt from "mqtt";

export const mqttClient = mqtt.connect(SERVER_URL || '', {
    reconnectPeriod: 2000
})

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
})

mqttClient.on('error', () => {
    console.log('Failed to connected to MQTT broker');
})
