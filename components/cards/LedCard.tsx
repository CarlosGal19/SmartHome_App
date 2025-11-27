import { mqttClient } from "@/scripts/mqttClient";
import { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

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
        }

        mqttClient.on("message", handler);

        return () => {
            mqttClient.off("message", handler);
            mqttClient.unsubscribe(topic);
        }

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
        <View style={styles.infoBox}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.status}>
                Estado:{" "}
                <Text style={status === "1" ? styles.on : styles.off}>
                    {status === "1" ? "Encendido" : "Apagado"}
                </Text>
            </Text>
        </View>

        <TouchableOpacity
            style={[styles.button, status === "1" ? styles.btnOn : styles.btnOff]}
            onPress={onPress}
        >
            <Icon
                name={icon_name}
                size={24}
                color={status === "1" ? "white" : "black"}
            />
        </TouchableOpacity>
    </View>
);


}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        margin: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },

    infoBox: {
        flex: 1,
        paddingRight: 10,
    },

    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
        marginBottom: 4,
    },

    status: {
        fontSize: 14,
        color: "#555",
    },

    on: {
        fontWeight: "700",
        color: "#28a745",
    },

    off: {
        fontWeight: "700",
        color: "#dc3545",
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },

    btnOn: {
        backgroundColor: "#28a745",
    },

    btnOff: {
        backgroundColor: "#eaeaea",
        borderWidth: 1,
        borderColor: "#ccc",
    },
});
