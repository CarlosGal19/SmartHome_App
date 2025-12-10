import { mqttClient } from "@/scripts/mqttClient";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function AlarmButton() {
  const [alarmStatus, setAlarmStatus] = useState<"0" | "1">("0");

  useEffect(() => {
    const topic = "smarthome/buzzer/status";

    mqttClient.subscribe(topic);

    const handler = (t: string, msg: Buffer) => {
      if (t === topic) {
        const val = msg.toString();
        if (val === "0" || val === "1") setAlarmStatus(val);
      }
    };

    mqttClient.on("message", handler);

    return () => {
      mqttClient.off("message", handler);
      mqttClient.unsubscribe(topic);
    };
  }, []);

  const toggleAlarm = useCallback(() => {
    mqttClient.publish("smarthome/door_1/set", "0");
    mqttClient.publish("smarthome/door_2/set", "0");
    mqttClient.publish("smarthome/window_1/set", "0");
    mqttClient.publish("smarthome/window_2/set", "0");

    mqttClient.publish("smarthome/buzzer/set", "0");
  }, [alarmStatus]);

  // ⛔ Si quieres que el botón *solo* aparezca cuando esté encendida:
  if (alarmStatus !== "1") return null;

  return (
    <TouchableOpacity style={styles.btn} onPress={toggleAlarm}>
      <Icon name="alert-circle" size={24} color="white" />
      <Text style={styles.text}>Alarma Encendida — Apagar</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C62828",
    padding: 15,
    borderRadius: 12,
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
});
