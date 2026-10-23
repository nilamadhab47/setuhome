import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PREP, diwaliDays, pickDiwaliDay, readPrep, writePrep, type DiwaliDayId } from "../diwali";
import type { Household } from "../household";
import { calendarForHousehold } from "../panchang";
import { theme, type } from "../theme";

type Props = {
  household: Household;
  onBack: () => void;
};

export function Diwali({ household, onBack }: Props) {
  const calendar = useMemo(() => calendarForHousehold(household, new Date(), false), [household]);
  const days = useMemo(() => diwaliDays(household), [household]);
  const [open, setOpen] = useState<DiwaliDayId>(() => pickDiwaliDay(days, calendar.phoneDay));
  const [prep, setPrep] = useState(() => readPrep());
  const selected = days.find((row) => row.id === open) ?? days[2];
  const ready = prep.filter(Boolean).length;
  const window = selected.timings.find((row) => row.start || row.end);

  function toggle(index: number) {
    setPrep((current) => writePrep(current.map((on, i) => (i === index ? !on : on))));
  }

  return (
    <ScrollView style={styles.list} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.top}>
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back">
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.kicker}>Diwali guide</Text>
      </View>
      <View style={styles.artWrap}>
        <Image source={require("../../assets/dawn.jpg")} style={styles.art} />
      </View>
      <Text style={styles.title}>Diwali · Deepavali</Text>
      <Text style={styles.lead}>Five days at home in {household.city}. A temple may keep another day.</Text>

      <Text style={styles.section}>Five days</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
        {days.map((row) => {
          const on = row.id === selected.id;
          return (
            <Pressable
              key={row.id}
              onPress={() => setOpen(row.id)}
              style={[styles.chip, on && styles.chipOn]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Text style={[styles.chipName, on && styles.chipNameOn]}>
                {row.n}. {row.name}
              </Text>
              {row.when ? (
                <Text style={[styles.chipWhen, on && styles.chipWhenOn]}>{row.when}</Text>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.card}>
        <Text style={styles.tiny}>{selected.when ?? `Day ${selected.n}`}</Text>
        <Text style={styles.cardTitle}>{selected.name}</Text>
        <Text style={styles.body}>{selected.line}</Text>
        {window ? (
          <View style={styles.window}>
            <Text style={styles.windowLabel}>{window.name || "Puja window"}</Text>
            <Text style={styles.windowTime}>{[window.start, window.end].filter(Boolean).join(" – ")}</Text>
          </View>
        ) : null}
        {!window && selected.sunset ? (
          <View style={styles.window}>
            <Text style={styles.windowLabel}>Sunset</Text>
            <Text style={styles.windowTime}>{selected.sunset}</Text>
          </View>
        ) : null}
        {!window && !selected.sunset ? (
          <Text style={styles.empty}>A clock is shown only when the calendar returns one.</Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Text style={styles.cardTitle}>At home</Text>
          <Text style={styles.local}>
            {ready} / {PREP.length}
          </Text>
        </View>
        <Text style={styles.body}>What to set out. This is not a temple vidhi.</Text>
        {PREP.map((item, index) => {
          const on = prep[index];
          return (
            <Pressable
              key={item}
              onPress={() => toggle(index)}
              style={styles.check}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
            >
              <View style={[styles.box, on && styles.boxOn]} />
              <Text style={styles.checkText}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.note}>A temple may keep Lakshmi puja on another evening. The host can move the household date on Festivals.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: "100%",
  },
  scroll: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
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
  artWrap: {
    marginTop: 12,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: theme.sunk,
  },
  art: {
    width: "100%",
    height: 168,
  },
  title: {
    marginTop: 16,
    fontFamily: type.serif,
    fontSize: 32,
    lineHeight: 38,
    color: theme.ink,
  },
  lead: {
    marginTop: 8,
    fontFamily: type.sans,
    fontSize: 15,
    lineHeight: 22,
    color: theme.plum,
  },
  section: {
    marginTop: 22,
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.plum,
  },
  strip: {
    paddingTop: 10,
    gap: 8,
  },
  chip: {
    minWidth: 118,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    cursor: "pointer",
  },
  chipOn: {
    backgroundColor: theme.marigold,
    borderColor: theme.marigold,
  },
  chipWhen: {
    marginTop: 4,
    fontFamily: type.sansSemibold,
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: theme.plum,
    pointerEvents: "none",
  },
  chipWhenOn: {
    color: theme.ink,
  },
  chipName: {
    fontFamily: type.serifSemibold,
    fontSize: 15,
    color: theme.ink,
    pointerEvents: "none",
  },
  chipNameOn: {
    color: theme.ink,
  },
  card: {
    marginTop: 16,
    backgroundColor: theme.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 16,
  },
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  tiny: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.marigold,
  },
  cardTitle: {
    marginTop: 6,
    fontFamily: type.serifSemibold,
    fontSize: 22,
    lineHeight: 28,
    color: theme.ink,
  },
  body: {
    marginTop: 8,
    fontFamily: type.sans,
    fontSize: 14,
    lineHeight: 20,
    color: theme.plum,
  },
  local: {
    fontFamily: type.sansMedium,
    fontSize: 12,
    color: theme.marigold,
  },
  window: {
    marginTop: 14,
    backgroundColor: theme.sunk,
    borderRadius: 12,
    padding: 12,
  },
  windowLabel: {
    fontFamily: type.sansSemibold,
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: theme.plum,
  },
  windowTime: {
    marginTop: 4,
    fontFamily: type.serifSemibold,
    fontSize: 22,
    color: theme.ink,
  },
  empty: {
    marginTop: 10,
    fontFamily: type.sans,
    fontSize: 13,
    lineHeight: 18,
    color: theme.plum,
  },
  check: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  box: {
    width: 20,
    height: 20,
    marginTop: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.line,
    backgroundColor: theme.sunk,
  },
  boxOn: {
    backgroundColor: theme.marigold,
    borderColor: theme.marigold,
  },
  checkText: {
    flex: 1,
    minWidth: 0,
    fontFamily: type.sans,
    fontSize: 15,
    lineHeight: 22,
    color: theme.ink,
  },
  note: {
    marginTop: 16,
    fontFamily: type.serifItalic,
    fontSize: 14,
    lineHeight: 20,
    color: theme.plum,
    textAlign: "center",
  },
});
