import { mqttClient } from "@/scripts/mqttClient";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface SensorCardProps {
    label: string;
    topic: string;       // topic MQTT de lectura
    icon_name: string;
}

export default function SensorCard({ label, topic, icon_name }: SensorCardProps) {
    const [value, setValue] = useState<string>("--");

    useEffect(() => {
        mqttClient.subscribe(topic, (err) => {
            if (err) {
                Alert.alert("Subscription error", "Failed to subscribe to topic");
                return;
            }
        });

        const handler = (receivedTopic: string, message: Buffer) => {
            if (receivedTopic === topic) {
                setValue(message.toString());
            }
        };

        mqttClient.on("message", handler);

        return () => {
            mqttClient.off("message", handler);
            mqttClient.unsubscribe(topic);
        };
    }, [topic]);

    return (
        <View style={styles.card}>
            <View style={styles.iconWrapper}>
                <Icon name={icon_name} size={35} color="white" />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#28a745",
        padding: 16,
        borderRadius: 16,
        marginVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },

    iconWrapper: {
        width: 55,
        height: 55,
        borderRadius: 55,
        backgroundColor: "rgba(255,255,255,0.25)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },

    infoBox: {
        flex: 1,
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 4,
    },

    value: {
        fontSize: 28,
        fontWeight: "700",
        color: "#fff",
    },
});
