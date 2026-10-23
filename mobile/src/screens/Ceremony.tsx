import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { STEPS, TRADITION, readCeremonyStep, wrapStep, writeCeremonyStep } from "../ceremony";
import type { Household } from "../household";
import { theme, type } from "../theme";

type Props = {
  household: Household;
  onBack: () => void;
};

export function Ceremony({ household, onBack }: Props) {
  const [index, setIndex] = useState(readCeremonyStep);
  const step = STEPS[index] ?? STEPS[0];
  const n = STEPS.length;
  const last = index === n - 1;

  function go(delta: -1 | 1) {
    setIndex((current) => writeCeremonyStep(wrapStep(current, delta)));
  }

  return (
    <View style={styles.root}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back">
            <Text style={styles.back} pointerEvents="none">
              Back
            </Text>
          </Pressable>
          <Text style={styles.kicker}>{TRADITION}</Text>
        </View>
        <Text style={styles.meta}>Step {index + 1} of {n}</Text>
        <View style={styles.bars}>
          {STEPS.map((item, i) => (
            <View key={item.title} style={[styles.bar, i <= index && styles.barOn]} />
          ))}
        </View>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.meaning}>{step.meaning}</Text>
        {step.sanskrit ? (
          <>
            <Text style={styles.ornament}>✦</Text>
            <Text style={styles.sanskrit}>{step.sanskrit}</Text>
            <Text style={styles.iast}>{step.iast}</Text>
          </>
        ) : null}
        <View style={styles.card}>
          <Text style={styles.tiny}>What to do</Text>
          <Text style={styles.body}>{step.doing}</Text>
        </View>
        {household.kids ? (
          <View style={styles.card}>
            <Text style={styles.tiny}>For a child</Text>
            <Text style={styles.body}>{step.child}</Text>
          </View>
        ) : null}
        <Text style={styles.note}>
          One named tradition: {TRADITION}. Another house may keep another order. Mantras and the full katha stay in the book at home until a reviewed text is filed.
        </Text>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.row}>
          <Pressable
            style={styles.secondary}
            onPress={() => go(-1)}
            accessibilityRole="button"
            accessibilityLabel="Previous step"
          >
            <Text style={styles.secondaryText}>Previous</Text>
          </Pressable>
          <Pressable
            style={styles.primary}
            onPress={() => go(1)}
            accessibilityRole="button"
            accessibilityLabel={last ? "Begin again" : "Next step"}
          >
            <Text style={styles.primaryText}>{last ? "Begin again" : "Next"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.canvas,
  },
  flex: {
    flex: 1,
    width: "100%",
  },
  scroll: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingRight: 44,
  },
  back: {
    fontFamily: type.sansMedium,
    fontSize: 14,
    color: theme.plum,
  },
  kicker: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: theme.marigold,
  },
  meta: {
    marginTop: 14,
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.plum,
  },
  bars: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 99,
    backgroundColor: theme.line,
  },
  barOn: {
    backgroundColor: theme.marigold,
  },
  title: {
    marginTop: 18,
    fontFamily: type.serif,
    fontSize: 32,
    lineHeight: 38,
    color: theme.ink,
  },
  meaning: {
    marginTop: 10,
    fontFamily: type.sans,
    fontSize: 16,
    lineHeight: 24,
    color: theme.plum,
  },
  ornament: {
    marginTop: 16,
    textAlign: "center",
    color: theme.marigold,
  },
  sanskrit: {
    marginTop: 8,
    textAlign: "center",
    fontFamily: type.deva,
    fontSize: 18,
    lineHeight: 30,
    color: theme.ink,
  },
  iast: {
    marginTop: 4,
    textAlign: "center",
    fontFamily: type.serifItalic,
    fontSize: 15,
    lineHeight: 22,
    color: theme.plum,
  },
  card: {
    marginTop: 16,
    backgroundColor: theme.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 16,
  },
  tiny: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.marigold,
  },
  body: {
    marginTop: 8,
    fontFamily: type.sans,
    fontSize: 15,
    lineHeight: 22,
    color: theme.ink,
  },
  note: {
    marginTop: 18,
    fontFamily: type.serifItalic,
    fontSize: 14,
    lineHeight: 20,
    color: theme.plum,
  },
  footer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: theme.line,
    backgroundColor: theme.canvas,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  secondary: {
    flex: 1,
    minHeight: 48,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: theme.line,
    backgroundColor: theme.surface,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  secondaryText: {
    fontFamily: type.sansSemibold,
    fontSize: 16,
    color: theme.ink,
    pointerEvents: "none",
  },
  primary: {
    flex: 1,
    minHeight: 48,
    borderRadius: 99,
    backgroundColor: theme.marigold,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  primaryText: {
    fontFamily: type.sansSemibold,
    fontSize: 16,
    color: theme.ink,
    pointerEvents: "none",
  },
});
