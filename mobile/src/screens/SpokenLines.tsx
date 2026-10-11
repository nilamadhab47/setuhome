import { StyleSheet, Text, type StyleProp, type TextStyle } from "react-native";
import { spokenWordCount, spokenWordIndex, splitSpoken, type SpokenSync } from "../listen";
import { theme } from "../theme";

export function SpokenLines({
  lines,
  style,
  highlightStyle,
  sync,
}: {
  lines: string[];
  style: StyleProp<TextStyle>;
  highlightStyle?: StyleProp<TextStyle>;
  sync?: SpokenSync | null;
}) {
  const count = spokenWordCount(lines);
  const active =
    sync?.playing ? spokenWordIndex(sync.words, sync.time, sync.duration, count) : -1;
  let wordAt = 0;
  return (
    <>
      {lines.map((line, lineIndex) => {
        const parts = splitSpoken(line);
        return (
          <Text key={`${lineIndex}-${line}`} style={style}>
            {parts.map((part, i) => {
              if (part.kind !== "word") return part.text;
              const index = wordAt;
              wordAt += 1;
              return (
                <Text key={`${i}-${part.text}`} style={index === active ? highlightStyle ?? styles.mark : undefined}>
                  {part.text}
                </Text>
              );
            })}
          </Text>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  mark: {
    color: theme.ink,
    backgroundColor: "rgba(232, 163, 61, 0.32)",
  },
});
