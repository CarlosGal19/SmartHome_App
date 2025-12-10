import AlarmButton from "@/components/AlarmButton";
import LedCard from "@/components/cards/LedCard";
import SensorCard from "@/components/cards/WeatherCard";
import { ScrollView, StyleSheet, View } from "react-native";

function TabTwoScreen() {

  const leds = [
    { name: "Puerta 1", value: "door_1", icon_name: "lock-closed" },
    { name: "Puerta 2", value: "door_2", icon_name: "lock-closed" },
    { name: "Ventana 1", value: "window_1", icon_name: "grid-outline" },
    { name: "Ventana 2", value: "window_2", icon_name: "grid-outline" },
    { name: "Sala", value: "living_room", icon_name: "tv-outline" },
    { name: "Cuarto", value: "room_1", icon_name: "bed" },
    { name: "Armario", value: "room_2", icon_name: "bed" },
    { name: "Baño", value: "bathroom", icon_name: "water-outline" },
    { name: "Patio", value: "patio", icon_name: "leaf" }
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <AlarmButton />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ width: "48%" }}>
          <SensorCard
            label="Temp"
            topic="smarthome/temperature/status"
            icon_name="thermometer-outline"
          />
        </View>

        <View style={{ width: "48%" }}>
          <SensorCard
            label="Humedad"
            topic="smarthome/humidity/status"
            icon_name="water-outline"
          />
        </View>
      </View>


      <View style={styles.grid}>
        {leds.map((led, index) => (
          <View key={index} style={styles.cardWrapper}>
            <LedCard
              name={led.name}
              value={led.value}
              icon_name={led.icon_name}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default TabTwoScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 30,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardWrapper: {
    width: "48%",
    marginBottom: 15,
  },
});
