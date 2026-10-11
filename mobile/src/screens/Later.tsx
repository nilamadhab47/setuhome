import { StyleSheet, Text, View } from "react-native";
import { theme, type } from "../theme";

export function Later({ title, issue }: { title: string; issue: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>SetuHome</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{issue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  kicker: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: theme.marigold,
  },
  title: {
    marginTop: 4,
    fontFamily: type.serif,
    fontSize: 32,
    lineHeight: 38,
    color: theme.ink,
  },
  body: {
    marginTop: 12,
    fontFamily: type.sans,
    fontSize: 16,
    lineHeight: 24,
    color: theme.plum,
    width: "100%",
  },
});
