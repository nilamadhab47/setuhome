import { useEffect, useState } from "react";
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { type SpokenSync } from "../listen";
import { isSaved, toggleSaved } from "../saved";
import { theme, type } from "../theme";
import { adjacentVerse, placeOf, verseByRef, versesInGroup } from "../verse";
import { ListenButton } from "./ListenButton";
import { MeaningBlock } from "./MeaningBlock";
import { SpokenLines } from "./SpokenLines";

type Props = {
  verseRef: string;
  onBack: () => void;
  onChangeVerse: (ref: string) => void;
};

export function Reader({ verseRef, onBack, onChangeVerse }: Props) {
  const verse = verseByRef(verseRef);
  const [saved, setSaved] = useState(isSaved(verseRef));
  const [note, setNote] = useState("");
  const [sync, setSync] = useState<SpokenSync | null>(null);
  useEffect(() => {
    setSaved(isSaved(verseRef));
    setNote("");
    setSync(null);
  }, [verseRef]);
  if (!verse) {
    return (
      <View style={styles.wrap}>
        <Pressable onPress={onBack} accessibilityLabel="Back">
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.missing}>This verse is not in the local file.</Text>
      </View>
    );
  }
  const row = verse;
  const place = placeOf(row);
  const group = versesInGroup(place.group);
  const previous = adjacentVerse(row.ref, -1);
  const next = adjacentVerse(row.ref, 1);

  async function onShare() {
    const meaning = row.simple?.simpleEnglish || row.english;
    const message = meaning
      ? `${row.sanskrit.join("\n")}\n\n${meaning}\n\n${row.ref}`
      : `${row.sanskrit.join("\n")}\n\n${row.ref}`;
    try {
      await Share.share({ message });
    } catch {
      setNote("Sharing did not open on this device.");
    }
  }

  return (
    <ScrollView style={styles.list} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.top}>
        <Pressable onPress={onBack} accessibilityLabel="Back" style={styles.backBtn}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.kicker} numberOfLines={1}>
          {row.book === "gita" ? `Chapter ${place.chapter}` : `${place.kanda} · Sarga ${place.chapter}`}
        </Text>
      </View>
      <Text style={styles.title}>Verse {place.verse}</Text>
      <Text style={styles.meta}>
        of {group.length} · {row.ref}
      </Text>
      <View style={styles.card}>
        {row.sanskrit.map((line, index) => (
          <Text key={`${index}-${line}`} style={styles.sanskrit}>
            {line}
          </Text>
        ))}
        <Text style={styles.ornament}>✦</Text>
        <SpokenLines
          lines={row.transliteration}
          style={styles.iast}
          highlightStyle={styles.iastOn}
          sync={sync?.part === "chant" ? sync : null}
        />
        <MeaningBlock key={row.ref} verse={row} sync={sync} />
        <View style={styles.actions}>
          <ListenButton key={row.ref} verse={row} onSync={setSync} />
          <Pressable style={styles.round} onPress={onShare} accessibilityLabel="Share verse">
            <Text style={styles.roundText}>Share</Text>
          </Pressable>
          <Pressable
            style={[styles.round, saved && styles.roundSaved]}
            onPress={() => setSaved(toggleSaved(row.ref))}
            accessibilityLabel={saved ? "Verse saved" : "Save verse"}
          >
            <Text style={[styles.roundText, saved && styles.roundTextSaved]}>{saved ? "Saved" : "Save"}</Text>
          </Pressable>
        </View>
        {note ? <Text style={styles.note}>{note}</Text> : null}
      </View>
      <View style={styles.pager}>
        <Pressable
          style={[styles.pageBtn, !previous && styles.pageOff]}
          disabled={!previous}
          onPress={() => previous && onChangeVerse(previous.ref)}
        >
          <Text style={styles.pageLabel}>Previous</Text>
          <Text style={styles.pageRef}>{previous ? previous.ref.replace(/^(Bhagavad Gita|Valmiki Ramayana) /, "") : "—"}</Text>
        </Pressable>
        <Pressable
          style={[styles.pageBtn, !next && styles.pageOff]}
          disabled={!next}
          onPress={() => next && onChangeVerse(next.ref)}
        >
          <Text style={[styles.pageLabel, styles.pageRight]}>Next</Text>
          <Text style={[styles.pageRef, styles.pageRight]}>
            {next ? next.ref.replace(/^(Bhagavad Gita|Valmiki Ramayana) /, "") : "—"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  list: {
    flex: 1,
    width: "100%",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    minHeight: 40,
    justifyContent: "center",
  },
  back: {
    fontFamily: type.sansMedium,
    fontSize: 14,
    color: theme.plum,
  },
  kicker: {
    flex: 1,
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.marigold,
  },
  title: {
    marginTop: 8,
    fontFamily: type.serif,
    fontSize: 32,
    lineHeight: 38,
    color: theme.ink,
  },
  meta: {
    marginTop: 4,
    fontFamily: type.sans,
    fontSize: 13,
    color: theme.plum,
  },
  missing: {
    marginTop: 16,
    fontFamily: type.sans,
    fontSize: 15,
    color: theme.plum,
  },
  card: {
    marginTop: 16,
    backgroundColor: theme.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.line,
    paddingBottom: 16,
    overflow: "hidden",
  },
  sanskrit: {
    marginTop: 16,
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
    color: theme.plum,
  },
  pager: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
  },
  pageBtn: {
    flex: 1,
    minWidth: 0,
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 12,
  },
  pageOff: {
    opacity: 0.45,
  },
  pageLabel: {
    fontFamily: type.sans,
    fontSize: 11,
    color: theme.plum,
  },
  pageRight: {
    textAlign: "right",
  },
  pageRef: {
    marginTop: 4,
    fontFamily: type.serif,
    fontSize: 16,
    color: theme.ink,
  },
});
