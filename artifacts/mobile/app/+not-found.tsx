import { Link, Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/home" style={styles.link}>
          <Text style={styles.linkText}>Go home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.background },
  text: { color: Colors.textSecondary, fontSize: 16 },
  link: { marginTop: 16 },
  linkText: { color: Colors.primary, fontSize: 16 },
});
