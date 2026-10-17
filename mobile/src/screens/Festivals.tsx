import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Household } from "../household";
import { calendarForHousehold, formatFestivalWhen, tithiLine } from "../panchang";
import { noonOnYmd, shiftYmd } from "../place";
import { theme, type } from "../theme";

type Props = {
  household: Household;
  onShiftDay: (day: string | null) => void;
  onOpenDiwali: () => void;
};

const STRIP = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];

function uniqueHits<T extends { name: string; day: string }>(rows: T[]) {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = `${row.day}|${row.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function weekday(ymd: string, timeZone: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short" }).format(noonOnYmd(ymd, timeZone));
  } catch {
    return "";
  }
}

function dayNumber(ymd: string) {
  return ymd.slice(8, 10).replace(/^0/, "") || ymd;
}

export function Festivals({ household, onShiftDay, onOpenDiwali }: Props) {
  const calendar = calendarForHousehold(household);
  const zone = calendar.place?.tz || "UTC";
  const marked = new Set(calendar.upcoming.map((row) => row.day));
  for (const row of calendar.panchang?.festivals ?? []) marked.add(row.day);
  const tithi = tithiLine(calendar.panchang);
  const todayFestivals = uniqueHits(calendar.panchang?.festivals ?? []);
  const later = uniqueHits(
    calendar.upcoming.filter((row) => row.day > calendar.day && row.category === "major")
  ).slice(0, 12);

  return (
    <ScrollView style={styles.list} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>SetuHome</Text>
      <View style={styles.head}>
        <Text style={styles.title}>Festivals</Text>
        <Text style={styles.city}>{household.city}</Text>
      </View>
      <Text style={styles.lead}>
        Sunrise, tithi, and festival days for this city. A temple may keep another day. A time is
        shown only when the calendar returns one.
      </Text>

      <Pressable style={styles.fest} onPress={onOpenDiwali} accessibilityRole="button" accessibilityLabel="Open Diwali guide">
        <Text style={styles.festName}>Diwali · five days at home</Text>
        <Text style={styles.festTime}>Dates and a clock only when the calendar returns them.</Text>
      </Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
        {STRIP.map((offset) => {
          const ymd = shiftYmd(calendar.day, offset);
          const on = ymd === calendar.day;
          const has = marked.has(ymd);
          return (
            <Pressable
              key={ymd}
              onPress={() => onShiftDay(ymd === calendar.phoneDay ? null : ymd)}
              style={[styles.day, on && styles.dayOn]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={ymd}
            >
              <Text style={[styles.dow, on && styles.dowOn]}>{weekday(ymd, zone)}</Text>
              <Text style={[styles.dom, on && styles.domOn]}>{dayNumber(ymd)}</Text>
              <View style={[styles.dot, has ? styles.dotOn : styles.dotOff, on && has && styles.dotOnSelected]} />
            </Pressable>
          );
        })}
      </ScrollView>

      {calendar.shifted ? (
        <Pressable style={styles.reset} onPress={() => onShiftDay(null)} accessibilityRole="button">
          <Text style={styles.resetText}>Use this phone’s today</Text>
        </Pressable>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.tiny}>{calendar.shifted ? "Household date" : "Today"}</Text>
        <Text style={styles.cardTitle}>{calendar.dayLabel}</Text>
        {calendar.panchang?.masa ? (
          <Text style={styles.meta}>
            {calendar.panchang.masa}
            {calendar.panchang.paksha ? ` · ${calendar.panchang.paksha} paksha` : ""}
          </Text>
        ) : null}
        {tithi ? <Text style={styles.tithi}>{tithi}</Text> : null}
        <View style={styles.times}>
          {calendar.panchang?.sunrise ? (
            <View style={styles.time}>
              <Text style={styles.timeLabel}>Sunrise</Text>
              <Text style={styles.timeValue}>{calendar.panchang.sunrise}</Text>
            </View>
          ) : null}
          {calendar.panchang?.sunset ? (
            <View style={styles.time}>
              <Text style={styles.timeLabel}>Sunset</Text>
              <Text style={styles.timeValue}>{calendar.panchang.sunset}</Text>
            </View>
          ) : null}
        </View>
        {!calendar.place ? (
          <Text style={styles.empty}>This city has no coordinates on the phone yet, so clocks stay blank.</Text>
        ) : !calendar.panchang ? (
          <Text style={styles.empty}>The calendar did not return a time for this day.</Text>
        ) : null}
      </View>

      <Text style={styles.section}>On this day</Text>
      {todayFestivals.length ? (
        todayFestivals.map((row) => (
          <View key={`${row.name}-${row.day}`} style={styles.fest}>
            <Text style={styles.festName}>{row.name}</Text>
            {row.timings.map((timing) => (
              <Text key={`${timing.name}-${timing.start}`} style={styles.festTime}>
                {timing.name}
                {timing.start || timing.end ? ` · ${[timing.start, timing.end].filter(Boolean).join(" – ")}` : ""}
              </Text>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.empty}>No festival returned for this day.</Text>
      )}

      <Text style={styles.section}>Coming up</Text>
      {later.length ? (
        later.map((row) => (
          <Pressable
            key={`${row.name}-${row.day}`}
            style={styles.fest}
            onPress={() => onShiftDay(row.day === calendar.phoneDay ? null : row.day)}
          >
            <Text style={styles.festName}>{row.name}</Text>
            <Text style={styles.festTime}>{formatFestivalWhen(row, zone)}</Text>
          </Pressable>
        ))
      ) : (
        <Text style={styles.empty}>No upcoming festival returned for this city.</Text>
      )}
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
  kicker: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: theme.marigold,
  },
  head: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontFamily: type.serif,
    fontSize: 32,
    lineHeight: 38,
    color: theme.ink,
  },
  city: {
    fontFamily: type.sansMedium,
    fontSize: 12,
    color: theme.plum,
    maxWidth: "42%",
    textAlign: "right",
  },
  lead: {
    marginTop: 8,
    fontFamily: type.sans,
    fontSize: 15,
    lineHeight: 22,
    color: theme.plum,
  },
  strip: {
    paddingTop: 16,
    paddingBottom: 4,
    gap: 8,
  },
  day: {
    width: 52,
    minHeight: 72,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    cursor: "pointer",
  },
  dayOn: {
    backgroundColor: theme.ink,
    borderColor: theme.ink,
  },
  dow: {
    fontFamily: type.sansSemibold,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: theme.plum,
    pointerEvents: "none",
  },
  dowOn: {
    color: theme.marigold,
  },
  dom: {
    marginTop: 4,
    fontFamily: type.serifSemibold,
    fontSize: 18,
    color: theme.ink,
    pointerEvents: "none",
  },
  domOn: {
    color: theme.canvas,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    marginTop: 6,
  },
  dotOn: {
    backgroundColor: theme.marigold,
  },
  dotOff: {
    backgroundColor: "transparent",
  },
  dotOnSelected: {
    backgroundColor: theme.marigold,
  },
  reset: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: theme.line,
    backgroundColor: theme.surface,
  },
  resetText: {
    fontFamily: type.sansMedium,
    fontSize: 12,
    color: theme.ink,
    pointerEvents: "none",
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
  cardTitle: {
    marginTop: 6,
    fontFamily: type.serifSemibold,
    fontSize: 22,
    lineHeight: 28,
    color: theme.ink,
  },
  meta: {
    marginTop: 4,
    fontFamily: type.sans,
    fontSize: 13,
    lineHeight: 18,
    color: theme.plum,
  },
  tithi: {
    marginTop: 8,
    fontFamily: type.serifItalic,
    fontSize: 16,
    lineHeight: 22,
    color: theme.ink,
  },
  times: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  time: {
    flex: 1,
    minWidth: 0,
    backgroundColor: theme.sunk,
    borderRadius: 12,
    padding: 12,
  },
  timeLabel: {
    fontFamily: type.sansSemibold,
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: theme.plum,
  },
  timeValue: {
    marginTop: 4,
    fontFamily: type.serifSemibold,
    fontSize: 18,
    color: theme.ink,
  },
  empty: {
    marginTop: 10,
    fontFamily: type.sans,
    fontSize: 13,
    lineHeight: 18,
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
  fest: {
    marginTop: 8,
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 14,
  },
  festName: {
    fontFamily: type.serifSemibold,
    fontSize: 18,
    lineHeight: 24,
    color: theme.ink,
  },
  festTime: {
    marginTop: 4,
    fontFamily: type.sans,
    fontSize: 13,
    lineHeight: 18,
    color: theme.plum,
  },
});
