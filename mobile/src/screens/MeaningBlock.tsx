import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { type SpokenSync } from "../listen";
import { theme, type } from "../theme";
import {
  ENGLISH_UNAVAILABLE,
  SIMPLE_UNAVAILABLE,
  originalWork,
  type Verse,
} from "../verse";
import { SpokenLines } from "./SpokenLines";

export function MeaningBlock({ verse, sync }: { verse: Verse; sync?: SpokenSync | null }) {
  const [showOriginal, setShowOriginal] = useState(false);
  const meaningSync = sync?.playing && sync.part === "english" ? sync : null;
  return (
    <>
      <View style={styles.meaning}>
        <Text style={styles.simpleKicker}>In everyday words</Text>
        {verse.simple?.simpleEnglish ? (
          <>
            <SpokenLines
              lines={[verse.simple.simpleEnglish]}
              style={styles.meaningText}
              highlightStyle={styles.spokenWord}
              sync={meaningSync}
            />
            <Text style={styles.aiNote}>An AI explanation of this verse, not a translator’s words.</Text>
          </>
        ) : (
          <Text style={styles.meaningText}>{verse.english ? SIMPLE_UNAVAILABLE : ENGLISH_UNAVAILABLE}</Text>
        )}
      </View>
      {verse.english ? (
        <>
          <Pressable
            style={styles.originalToggle}
            onPress={() => setShowOriginal((open) => !open)}
            accessibilityRole="button"
            accessibilityState={{ expanded: showOriginal }}
            accessibilityLabel={showOriginal ? "Hide original translation" : "Show original translation"}
          >
            <Text style={styles.originalToggleText}>
              {showOriginal ? "Hide Original Translation" : "Show Original Translation"}
            </Text>
          </Pressable>
          {showOriginal ? (
            <View style={styles.original}>
              <Text style={styles.originalBy}>
                Original translation by {verse.englishSource || "a sourced translator"}
              </Text>
              <Text style={styles.originalWork}>{originalWork(verse)}</Text>
              <Text style={styles.meaningText}>{verse.english}</Text>
            </View>
          ) : null}
        </>
      ) : null}
      {verse.simple?.contextNote ? (
        <View style={styles.contextBox}>
          <Text style={styles.whatKicker}>What does this mean?</Text>
          <Text style={styles.contextText}>{verse.simple.contextNote}</Text>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  meaning: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: theme.sunk,
    borderRadius: 12,
    padding: 12,
  },
  simpleKicker: {
    marginBottom: 8,
    textAlign: "center",
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 0.6,
    color: theme.ink,
  },
  meaningText: {
    textAlign: "center",
    fontFamily: type.sans,
    fontSize: 15,
    lineHeight: 22,
    color: theme.ink,
  },
  spokenWord: {
    color: theme.ink,
    backgroundColor: "rgba(232, 163, 61, 0.32)",
  },
  aiNote: {
    marginTop: 8,
    textAlign: "center",
    fontFamily: type.sans,
    fontSize: 11,
    lineHeight: 16,
    color: theme.plum,
  },
  originalToggle: {
    marginTop: 10,
    marginHorizontal: 16,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  originalToggleText: {
    fontFamily: type.sansMedium,
    fontSize: 13,
    color: theme.plum,
    textDecorationLine: "underline",
  },
  original: {
    marginTop: 4,
    marginHorizontal: 16,
    backgroundColor: theme.sunk,
    borderRadius: 12,
    padding: 12,
  },
  originalBy: {
    textAlign: "center",
    fontFamily: type.sansSemibold,
    fontSize: 12,
    lineHeight: 18,
    color: theme.ink,
  },
  originalWork: {
    marginTop: 2,
    marginBottom: 8,
    textAlign: "center",
    fontFamily: type.sans,
    fontSize: 11,
    lineHeight: 16,
    color: theme.plum,
  },
  contextBox: {
    marginTop: 8,
    marginHorizontal: 16,
    backgroundColor: theme.sunk,
    borderRadius: 12,
    padding: 12,
  },
  whatKicker: {
    textAlign: "center",
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 0.6,
    color: theme.ink,
  },
  contextText: {
    marginTop: 6,
    textAlign: "center",
    fontFamily: type.sans,
    fontSize: 14,
    lineHeight: 20,
    color: theme.plum,
  },
});
