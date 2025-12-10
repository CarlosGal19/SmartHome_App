import { mqttClient } from "@/scripts/mqttClient";
import { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface LedCardProps {
  name: string;
  value: string;
  icon_name: string;
}

export default function LedCard({ name, value, icon_name }: LedCardProps) {
  const [status, setStatus] = useState<"0" | "1">("0");

  useEffect(() => {
    const topic = `smarthome/${value}/status`;

    mqttClient.subscribe(topic, (err) => {
      if (err) {
        Alert.alert("Subscription error", "Failed to subscribe to topic");
        return;
      }
    });

    const handler = (receivedTopic: string, message: Buffer) => {
      if (receivedTopic === topic) {
        const val = message.toString();
        if (val === "0" || val === "1") {
          setStatus(val);
        }
      }
    };

    mqttClient.on("message", handler);

    return () => {
      mqttClient.off("message", handler);
      mqttClient.unsubscribe(topic);
    };
  }, [value]);

  const onPress = useCallback(() => {
    const topic = `smarthome/${value}/set`;
    const newStatus = status === "0" ? "1" : "0";

    mqttClient.publish(topic, newStatus, (err) => {
      if (err) {
        Alert.alert("Publish error", "Failed to update status");
      }
    });
  }, [status, value]);

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View
          style={[
            styles.iconWrapper,
            status === "1" ? styles.iconOn : styles.iconOff,
          ]}
        >
          <Icon
            name={icon_name}
            size={22}
            color={status === "1" ? "#fff" : "#6c757d"}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.title}>{name}</Text>
          <Text
            style={[
              styles.statusText,
              status === "1" ? styles.textOn : styles.textOff,
            ]}
          >
            {status === "1" ? "Encendido" : "Apagado"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.circleBtn,
          status === "1" ? styles.btnOn : styles.btnOff,
        ]}
        onPress={onPress}
      >
        <Icon
          name={status === "1" ? "power" : "power-outline"}
          size={20}
          color={status === "1" ? "#fff" : "#333"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,

    borderWidth: 1,
    borderColor: "#f1f1f1",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  iconOn: {
    backgroundColor: "#28a745",
  },

  iconOff: {
    backgroundColor: "#e9ecef",
  },

  infoBox: {
    flexDirection: "column",
    flexShrink: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    marginBottom: 2,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  textOn: {
    color: "#28a745",
  },

  textOff: {
    color: "#dc3545",
  },

  // Botón pequeño circular
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  btnOn: {
    backgroundColor: "#28a745",
  },

  btnOff: {
    backgroundColor: "#f1f1f1",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
