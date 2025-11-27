import LedCard from "@/components/cards/LedCard";
import { StyleSheet, View } from "react-native";

export default function TabTwoScreen() {

  const leds = [
    { name: "Door", value: "door", icon_name: "lock-closed" },
    { name: "Living Room", value: "living_room", icon_name: "tv-outline" },
    { name: "Room 1", value: "room_1", icon_name: "bed" },
    { name: "Room 2", value: "room_2", icon_name: "bed" },
    { name: "Hallway", value: "hallway", icon_name: "walk" },
    { name: "Bathroom", value: "bathroom", icon_name: "water-outline" },
    { name: "Kitchen", value: "kitchen", icon_name: "restaurant" },
    { name: "Patio", value: "patio", icon_name: "leaf" }
  ];

  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },

  cardWrapper: {
    width: "48%",
    marginBottom: 15,
  },
});
