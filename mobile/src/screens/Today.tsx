import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import type { Household } from "../household";
import { type SpokenSync } from "../listen";
import { calendarForHousehold, formatFestivalWhen, tithiLine } from "../panchang";
import { type ReminderState } from "../remind";
import { isSaved, toggleSaved } from "../saved";
import { MARKS, markStreakSeen, reachedMark, touchStreak, type Mark } from "../streak";
import { theme, type } from "../theme";
import { verseForDate, verseLabel } from "../verse";
import { ListenButton } from "./ListenButton";
import { MeaningBlock } from "./MeaningBlock";
import { SpokenLines } from "./SpokenLines";
import { Streak } from "./Streak";

type Props = {
  household: Household;
  morningLabel?: string;
  reminder?: ReminderState;
  onOpenDiwali: () => void;
  onOpenCeremony: () => void;
  onOpenStories: () => void;
};

function greeting(now: Date) {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function todayLabel(now: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);
}

function previewMark(): Mark | null {
  const search = typeof window === "undefined" ? undefined : window.location?.search;
  if (!search) return null;
  const value = Number(new URLSearchParams(search).get("streak"));
  return MARKS.includes(value as Mark) ? (value as Mark) : null;
}

export function Today({ household, morningLabel, reminder, onOpenDiwali, onOpenCeremony, onOpenStories }: Props) {
  const now = new Date();
  const calendar = useMemo(
    () => calendarForHousehold(household, new Date(), false),
    [household.city, household.lat, household.lng, household.tz]
  );
  const city = household.city;
  const verse = verseForDate(now);
  const tithi = tithiLine(calendar.panchang);
  const diwali = calendar.diwali;
  const diwaliWhen = diwali && calendar.place ? formatFestivalWhen(diwali, calendar.place.tz) : null;
  const preview = previewMark();
  const [streak, setStreak] = useState(() => touchStreak(now));
  const [saved, setSaved] = useState(() => isSaved(verse.ref));
  const [listenNote, setListenNote] = useState("");
  const [sync, setSync] = useState<SpokenSync | null>(null);
  const hit = preview ?? reachedMark(streak);
  const [showStreak, setShowStreak] = useState(() => hit !== null);
  const days = preview ?? streak.count;

  function closeStreak() {
    if (hit && !preview) setStreak(markStreakSeen(hit));
    setShowStreak(false);
  }

  async function onShare() {
    const meaning = verse.simple?.simpleEnglish || verse.english;
    const message = meaning
      ? `${verse.sanskrit.join("\n")}\n\n${meaning}\n\n${verseLabel(verse)}`
      : `${verse.sanskrit.join("\n")}\n\n${verseLabel(verse)}`;
    try {
      await Share.share({ message });
    } catch {
      setListenNote("Sharing did not open on this device.");
    }
  }

  return (
    <View style={styles.list}>
    <ScrollView style={styles.list} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>SetuHome</Text>
      <View style={styles.greetRow}>
        <View style={styles.greetCopy}>
          <Text style={styles.title}>{greeting(now)}</Text>
          <Text style={styles.meta}>{todayLabel(now)}</Text>
          {tithi ? <Text style={styles.meta}>{tithi}</Text> : null}
          {reminder === "set" && morningLabel ? (
            <Text style={styles.meta}>Reminder at {morningLabel}</Text>
          ) : reminder === "denied" ? (
            <Text style={styles.meta}>Morning reminder needs permission on this phone.</Text>
          ) : null}
        </View>
        <Pressable
          style={styles.streak}
          onPress={() => setShowStreak(true)}
          accessibilityRole="button"
          accessibilityLabel={`Morning streak, ${days} days`}
        >
          <Text style={styles.streakText}>{days} days</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Image source={require("../../assets/dawn.jpg")} style={styles.art} />
        <Text style={styles.label}>Verse of the day · {verseLabel(verse)}</Text>
        {verse.sanskrit.map((line) => (
          <Text key={line} style={styles.sanskrit}>
            {line}
          </Text>
        ))}
        <Text style={styles.ornament}>✦</Text>
        <SpokenLines
          lines={verse.transliteration}
          style={styles.iast}
          highlightStyle={styles.iastOn}
          sync={sync?.part === "chant" ? sync : null}
        />
        <MeaningBlock verse={verse} sync={sync} />
        <View style={styles.actions}>
          <ListenButton key={verse.ref} verse={verse} onSync={setSync} />
          <Pressable style={styles.round} onPress={onShare} accessibilityLabel="Share verse">
            <Text style={styles.roundText}>Share</Text>
          </Pressable>
          <Pressable
            style={[styles.round, saved && styles.roundSaved]}
            onPress={() => setSaved(toggleSaved(verse.ref))}
            accessibilityLabel={saved ? "Verse saved" : "Save verse"}
          >
            <Text style={[styles.roundText, saved && styles.roundTextSaved]}>{saved ? "Saved" : "Save"}</Text>
          </Pressable>
        </View>
        {listenNote ? <Text style={styles.note}>{listenNote}</Text> : null}
      </View>

      <View style={styles.pair}>
        <Pressable style={styles.moment} onPress={onOpenDiwali}>
          <Text style={styles.momentKicker}>Festival</Text>
          <Text style={styles.momentTitle}>Diwali</Text>
          <Text style={styles.momentBody}>
            {diwaliWhen
              ? `Five days at home. ${diwaliWhen} in ${city}.`
              : `Five days at home. The date comes from ${city ? city : "your city"}.`}
          </Text>
        </Pressable>
        <Pressable style={styles.moment} onPress={onOpenStories}>
          <Text style={styles.momentKicker}>Bedtime</Text>
          <Text style={styles.momentTitle}>A story</Text>
          <Text style={styles.momentBody}>The monkey and the crocodile, for the end of the day.</Text>
        </Pressable>
      </View>
      <Pressable
        style={styles.ceremony}
        onPress={onOpenCeremony}
        accessibilityRole="button"
        accessibilityLabel="Open Home Satyanarayan"
      >
        <Text style={styles.momentKicker}>Ceremony</Text>
        <Text style={styles.momentTitle}>Home Satyanarayan</Text>
        <Text style={styles.momentBody}>Six steps at home. Next and previous always work.</Text>
      </Pressable>
    </ScrollView>
      {showStreak ? <Streak count={days} city={city} celebrated={hit} onClose={closeStreak} /> : null}
    </View>
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
  greetRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 6,
    marginBottom: 16,
  },
  greetCopy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: type.serif,
    fontSize: 32,
    lineHeight: 38,
    color: theme.ink,
  },
  meta: {
    marginTop: 4,
    fontFamily: type.sans,
    fontSize: 13,
    lineHeight: 18,
    color: theme.plum,
  },
  streak: {
    backgroundColor: theme.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.line,
    cursor: "pointer",
  },
  streakText: {
    fontFamily: type.sansSemibold,
    fontSize: 12,
    color: theme.ink,
  },
  card: {
    width: "100%",
    backgroundColor: theme.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.line,
    overflow: "hidden",
    paddingBottom: 16,
  },
  art: {
    width: "100%",
    height: 168,
  },
  label: {
    marginTop: 14,
    textAlign: "center",
    fontFamily: type.sansMedium,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: theme.plum,
    paddingHorizontal: 16,
  },
  sanskrit: {
    marginTop: 8,
    textAlign: "center",
    fontFamily: type.deva,
    fontSize: 18,
    lineHeight: 30,
    color: theme.ink,
    paddingHorizontal: 16,
  },
  ornament: {
    textAlign: "center",
    color: theme.marigold,
    marginTop: 8,
  },
  iast: {
    textAlign: "center",
    fontFamily: type.serifItalic,
    fontSize: 15,
    lineHeight: 22,
    color: theme.plum,
    paddingHorizontal: 18,
  },
  iastOn: {
    color: theme.ink,
    backgroundColor: "rgba(232, 163, 61, 0.32)",
  },
  actions: {
    marginTop: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  round: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface,
  },
  roundSaved: {
    borderColor: theme.marigold,
    backgroundColor: theme.sunk,
  },
  roundText: {
    fontFamily: type.sansMedium,
    fontSize: 12,
    color: theme.plum,
  },
  roundTextSaved: {
    color: theme.ink,
  },
  note: {
    marginTop: 10,
    marginHorizontal: 16,
    textAlign: "center",
    fontFamily: type.sans,
    fontSize: 13,
    lineHeight: 18,
    color: theme.plum,
  },
  pair: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
  },
  moment: {
    flex: 1,
    minWidth: 0,
    backgroundColor: theme.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 14,
  },
  momentKicker: {
    fontFamily: type.sansSemibold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.marigold,
  },
  momentTitle: {
    marginTop: 8,
    fontFamily: type.serifSemibold,
    fontSize: 18,
    lineHeight: 24,
    color: theme.ink,
  },
  ceremony: {
    marginTop: 10,
    backgroundColor: theme.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 14,
  },
  momentBody: {
    marginTop: 4,
    fontFamily: type.sans,
    fontSize: 13,
    lineHeight: 18,
    color: theme.plum,
  },
});
