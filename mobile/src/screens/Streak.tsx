import { Image, Modal, Pressable, Share, StyleSheet, Text, View } from "react-native";
import { PATH, markCopy, type Mark } from "../streak";
import { theme, type } from "../theme";

type Props = {
  count: number;
  city?: string;
  celebrated?: Mark | null;
  onClose: () => void;
};

export function Streak({ count, city, celebrated, onClose }: Props) {
  async function onShare() {
    try {
      await Share.share({ message: `${count} mornings on setuHome.` });
    } catch {
      // The sheet was dismissed.
    }
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <View style={styles.card} accessibilityViewIsModal>
          <View style={styles.top}>
            <Text style={styles.kicker}>setuHome</Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close streak">
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>
          <Image source={require("../../assets/dawn.jpg")} style={styles.art} />
          <Text style={styles.badge}>✦ Morning streak ✦</Text>
          <Text style={styles.title}>
            {count} <Text style={styles.titleSoft}>mornings</Text>
          </Text>
          <Text style={styles.sub}>{markCopy(celebrated ?? count)}</Text>
          <Text style={styles.ornament}>❋</Text>
          <Text style={styles.pathLabel}>The path</Text>
          {PATH.map((item) => {
            const done = count >= item.mark;
            const nextOpen = item.mark === PATH.find((row) => count < row.mark)?.mark;
            return (
              <View key={item.mark} style={[styles.row, !done && styles.rowWait]}>
                <View style={[styles.dot, done && styles.dotOn, nextOpen && styles.dotNext]}>
                  <Text style={[styles.dotText, done && styles.dotTextOn]}>{done ? "✓" : item.mark}</Text>
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowNote}>{item.note}</Text>
                </View>
                <Text style={styles.rowMark}>{done ? "Done" : nextOpen ? "Next" : ""}</Text>
              </View>
            );
          })}
          <Pressable style={styles.primary} onPress={onClose} accessibilityRole="button" accessibilityLabel="Continue">
            <Text style={styles.primaryText}>Continue</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={onShare} accessibilityRole="button" accessibilityLabel="Share streak">
            <Text style={styles.secondaryText}>Share</Text>
          </Pressable>
          <Text style={styles.foot}>{city ? `Kept on this phone · ${city}` : "Kept on this phone."}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: "rgba(30, 27, 58, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.surface,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  kicker: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: theme.marigold,
  },
  close: {
    fontFamily: type.sansMedium,
    fontSize: 14,
    color: theme.plum,
  },
  art: {
    width: "100%",
    height: 140,
    borderRadius: 14,
  },
  badge: {
    marginTop: 14,
    textAlign: "center",
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: theme.marigold,
  },
  title: {
    marginTop: 6,
    textAlign: "center",
    fontFamily: type.serif,
    fontSize: 36,
    lineHeight: 42,
    color: theme.ink,
  },
  titleSoft: {
    fontFamily: type.serifItalic,
    fontSize: 22,
    color: theme.marigold,
  },
  sub: {
    marginTop: 6,
    textAlign: "center",
    fontFamily: type.serifItalic,
    fontSize: 16,
    lineHeight: 22,
    color: theme.plum,
  },
  ornament: {
    textAlign: "center",
    color: theme.marigold,
    marginVertical: 10,
  },
  pathLabel: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.plum,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  rowWait: {
    opacity: 0.72,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 99,
    backgroundColor: theme.sunk,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: "center",
    justifyContent: "center",
  },
  dotOn: {
    backgroundColor: theme.marigold,
    borderColor: theme.marigold,
  },
  dotNext: {
    borderColor: theme.marigold,
  },
  dotText: {
    fontFamily: type.sansSemibold,
    fontSize: 10,
    color: theme.plum,
  },
  dotTextOn: {
    color: theme.ink,
  },
  rowCopy: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    fontFamily: type.sansSemibold,
    fontSize: 13,
    color: theme.ink,
  },
  rowNote: {
    marginTop: 1,
    fontFamily: type.sans,
    fontSize: 12,
    color: theme.plum,
  },
  rowMark: {
    fontFamily: type.sansMedium,
    fontSize: 11,
    color: theme.marigold,
  },
  primary: {
    marginTop: 14,
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
  secondary: {
    marginTop: 8,
    minHeight: 44,
    borderRadius: 99,
    backgroundColor: theme.sunk,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  secondaryText: {
    fontFamily: type.sansMedium,
    fontSize: 15,
    color: theme.ink,
    pointerEvents: "none",
  },
  foot: {
    marginTop: 12,
    textAlign: "center",
    fontFamily: type.sans,
    fontSize: 12,
    color: theme.plum,
  },
});
