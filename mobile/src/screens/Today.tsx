import { useState } from "react";
import { Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { type SpokenSync } from "../listen";
import { isSaved, toggleSaved } from "../saved";
import { theme, type } from "../theme";
import { verseForDate } from "../verse";
import { ListenButton } from "./ListenButton";
import { MeaningBlock } from "./MeaningBlock";
import { SpokenLines } from "./SpokenLines";

type Props = {
  streakDays: number;
  onOpenFestivals: () => void;
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

export function Today({ streakDays, onOpenFestivals, onOpenStories }: Props) {
  const now = new Date();
  const verse = verseForDate(now);
  const [saved, setSaved] = useState(() => isSaved(verse.ref));
  const [listenNote, setListenNote] = useState("");
  const [sync, setSync] = useState<SpokenSync | null>(null);

  async function onShare() {
    const meaning = verse.simple?.simpleEnglish || verse.english;
    const message = meaning
      ? `${verse.sanskrit.join("\n")}\n\n${meaning}\n\n${verse.ref}`
      : `${verse.sanskrit.join("\n")}\n\n${verse.ref}`;
    try {
      await Share.share({ message });
    } catch {
      setListenNote("Sharing did not open on this device.");
    }
  }

  return (
    <ScrollView style={styles.list} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>SetuHome</Text>
      <View style={styles.greetRow}>
        <View style={styles.greetCopy}>
          <Text style={styles.title}>{greeting(now)}</Text>
          <Text style={styles.meta}>{todayLabel(now)}</Text>
        </View>
        <View style={styles.streak}>
          <Text style={styles.streakText}>{streakDays} days</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Image source={require("../../assets/dawn.jpg")} style={styles.art} />
        <Text style={styles.label}>Verse of the day · {verse.ref}</Text>
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
        <Pressable style={styles.moment} onPress={onOpenFestivals}>
          <Text style={styles.momentKicker}>Festival</Text>
          <Text style={styles.momentTitle}>Diwali</Text>
          <Text style={styles.momentBody}>Five days at home. The date comes from your city.</Text>
        </Pressable>
        <Pressable style={styles.moment} onPress={onOpenStories}>
          <Text style={styles.momentKicker}>Bedtime</Text>
          <Text style={styles.momentTitle}>A story</Text>
          <Text style={styles.momentBody}>The monkey and the crocodile, for the end of the day.</Text>
        </Pressable>
      </View>
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
  momentBody: {
    marginTop: 4,
    fontFamily: type.sans,
    fontSize: 13,
    lineHeight: 18,
    color: theme.plum,
  },
});
