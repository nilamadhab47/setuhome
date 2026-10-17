import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  formatMorning,
  fromTwelveHour,
  phoneTimeZone,
  toTwelveHour,
  withPlace,
  type Household,
} from "../household";
import { hasListenClip } from "../listen";
import { geocodeCity, searchPlaces } from "../place";
import { theme, type } from "../theme";
import { verseForDate, verseLabel } from "../verse";

type Step = 1 | 2 | 3;

type Props = {
  onDone: (household: Household) => void;
};

const presets = [
  { label: "6:00 AM", hour: 6, minute: 0 },
  { label: "7:00 AM", hour: 7, minute: 0 },
  { label: "8:00 AM", hour: 8, minute: 0 },
  { label: "6:30 PM", hour: 18, minute: 30 },
] as const;

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
}

export function Onboarding({ onDone }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [city, setCity] = useState("");
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [kids, setKids] = useState(true);
  const [looking, setLooking] = useState(false);
  const [lookupNote, setLookupNote] = useState("");
  const zone = phoneTimeZone();
  const clock = toTwelveHour(hour, minute);
  const sample = useMemo(() => verseForDate(tomorrow()), []);

  function setTwelve(nextHour12: number, nextMinute: number, meridiem: "AM" | "PM") {
    const next = fromTwelveHour(nextHour12, nextMinute, meridiem);
    setHour(next.hour);
    setMinute(next.minute);
  }

  if (step === 1) {
    return (
      <View style={styles.root}>
        <ScrollView style={styles.flex} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <StepHeader step={1} label="Welcome" />
          <View style={styles.artWrap}>
            <Image source={require("../../assets/dawn.jpg")} style={styles.art} />
            <View style={styles.artBadge}>
              <Text style={styles.artBadgeText}>Dawn · Usha</Text>
            </View>
          </View>
          <Text style={styles.badge}>Setu · the sacred bridge</Text>
          <Text style={styles.title}>Welcome to setuHome</Text>
          <Text style={styles.quote}>“A quiet morning with the Gita and the Ramayana.”</Text>
          <Text style={styles.ornament}>✤</Text>
          <Text style={styles.body}>
            A daily verse from the Bhagavad Gita and the Valmiki Ramayana.
          </Text>
          <View style={styles.pills}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Daily shlokas</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Tithi & utsav</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Family rites</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Pressable style={styles.primary} onPress={() => setStep(2)} accessibilityRole="button" accessibilityLabel="Begin onboarding">
            <Text style={styles.primaryText}>Begin</Text>
          </Pressable>
          <Text style={styles.footNote}>Private & self-paced · Ad-free</Text>
        </View>
      </View>
    );
  }

  if (step === 2) {
    const chips = searchPlaces(city);
    const ready = city.trim().length > 0;
    return (
      <View style={styles.root}>
        <ScrollView style={styles.flex} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <StepHeader step={2} label="Your city" onBack={() => setStep(1)} />
          <Text style={styles.pageTitle}>Where do you live?</Text>
          <Text style={styles.lead}>So sunrise, tithi, and festival days can be calculated for this city. A time is shown only when the calendar returns one.</Text>
          <View style={styles.search}>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Search your city, state or country"
              placeholderTextColor={theme.plum}
              autoCorrect={false}
              autoCapitalize="words"
              style={styles.input}
              accessibilityLabel="City"
            />
            {city ? (
              <Pressable onPress={() => setCity("")} accessibilityLabel="Clear city">
                <Text style={styles.clear}>Clear</Text>
              </Pressable>
            ) : null}
          </View>
          {zone ? <Text style={styles.zone}>This phone’s time zone is {zone}.</Text> : null}
          <Text style={styles.section}>Cities</Text>
          <View style={styles.chips}>
            {chips.map((item) => {
              const on = city.trim().toLowerCase() === item.name.toLowerCase();
              return (
                <Pressable
                  key={item.name}
                  onPress={() => setCity(item.name)}
                  style={[styles.chip, on && styles.chipOn]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{item.name}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Why this matters</Text>
            <Text style={styles.cardBody}>
              Tithi and sunrise depend on where you are. A temple may keep another day. The city stays on this phone.
            </Text>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Pressable
            style={[styles.primary, !ready && styles.primaryOff]}
            disabled={!ready}
            onPress={() => setStep(3)}
            accessibilityRole="button"
            accessibilityLabel="Continue"
          >
            <Text style={[styles.primaryText, !ready && styles.primaryTextOff]}>Continue</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const listenLabel = hasListenClip(sample) ? "Recording" : null;

  return (
    <View style={styles.root}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.scrollWide} showsVerticalScrollIndicator={false}>
        <StepHeader step={3} label="Morning time" onBack={() => setStep(2)} />
        <Text style={styles.pageTitle}>When should we send your daily verse?</Text>
        <Text style={styles.lead}>A quiet moment before the morning noise. The reminder uses this time on this phone.</Text>
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.tiny}>Morning time</Text>
            <Text style={styles.local}>Local time</Text>
          </View>
          <View style={styles.clock}>
            <View style={styles.clockRow}>
              <Pressable onPress={() => setTwelve(clock.hour12 >= 12 ? 1 : clock.hour12 + 1, clock.minute, clock.meridiem)} accessibilityLabel="Increase hour">
                <Text style={styles.caret}>▲</Text>
              </Pressable>
              <View style={styles.clockGap} />
              <Pressable onPress={() => setTwelve(clock.hour12, (clock.minute + 15) % 60, clock.meridiem)} accessibilityLabel="Increase minute">
                <Text style={styles.caret}>▲</Text>
              </Pressable>
              <View style={styles.meridiemPad} />
            </View>
            <View style={styles.clockRow}>
              <Text style={styles.digits}>{String(clock.hour12).padStart(2, "0")}</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.digits}>{String(clock.minute).padStart(2, "0")}</Text>
              <View style={styles.meridiem}>
                <Pressable
                  style={[styles.meridiemBtn, clock.meridiem === "AM" && styles.meridiemOn]}
                  onPress={() => setTwelve(clock.hour12, clock.minute, "AM")}
                >
                  <Text style={[styles.meridiemText, clock.meridiem === "AM" && styles.meridiemTextOn]}>AM</Text>
                </Pressable>
                <Pressable
                  style={[styles.meridiemBtn, clock.meridiem === "PM" && styles.meridiemOn]}
                  onPress={() => setTwelve(clock.hour12, clock.minute, "PM")}
                >
                  <Text style={[styles.meridiemText, clock.meridiem === "PM" && styles.meridiemTextOn]}>PM</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.clockRow}>
              <Pressable onPress={() => setTwelve(clock.hour12 <= 1 ? 12 : clock.hour12 - 1, clock.minute, clock.meridiem)} accessibilityLabel="Decrease hour">
                <Text style={styles.caret}>▼</Text>
              </Pressable>
              <View style={styles.clockGap} />
              <Pressable onPress={() => setTwelve(clock.hour12, clock.minute === 0 ? 45 : clock.minute - 15, clock.meridiem)} accessibilityLabel="Decrease minute">
                <Text style={styles.caret}>▼</Text>
              </Pressable>
              <View style={styles.meridiemPad} />
            </View>
          </View>
          <View style={styles.chips}>
            {presets.map((item) => {
              const on = hour === item.hour && minute === item.minute;
              return (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    setHour(item.hour);
                    setMinute(item.minute);
                  }}
                  style={[styles.chip, on && styles.chipDark]}
                >
                  <Text style={[styles.chipText, on && styles.chipDarkText]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <Pressable style={styles.card} onPress={() => setKids((value) => !value)} accessibilityRole="switch" accessibilityState={{ checked: kids }}>
          <View style={styles.kidsRow}>
            <View style={styles.kidsCopy}>
              <Text style={styles.cardTitle}>Kids in the family</Text>
              <Text style={styles.cardBody}>Keep Little Setu bedtime stories when that tab ships.</Text>
            </View>
            <View style={[styles.switchTrack, kids && styles.switchOn]}>
              <View style={[styles.switchKnob, kids && styles.switchKnobOn]} />
            </View>
          </View>
        </Pressable>
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.tiny}>Tomorrow morning</Text>
            <Text style={styles.local}>{formatMorning(hour, minute)}</Text>
          </View>
          <Text style={styles.previewRef}>
            {verseLabel(sample)}
            {listenLabel ? ` · ${listenLabel}` : ""}
          </Text>
          <Text style={styles.previewSanskrit}>{sample.sanskrit[0]}</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          style={[styles.primary, looking && styles.primaryOff]}
          disabled={looking}
          onPress={() => {
            const draft: Household = {
              city: city.trim(),
              morningHour: hour,
              morningMinute: minute,
              kids,
            };
            setLooking(true);
            setLookupNote("");
            void geocodeCity(draft.city).then((place) => {
              onDone(withPlace(draft, place));
            }).catch(() => {
              setLooking(false);
              setLookupNote("This city could not be looked up. You can still continue.");
              onDone(draft);
            });
          }}
          accessibilityRole="button"
          accessibilityLabel="Start my journey"
        >
          <Text style={[styles.primaryText, looking && styles.primaryTextOff]}>{looking ? "Looking up this city…" : "Start my journey"}</Text>
        </Pressable>
        <Text style={styles.footNote}>{lookupNote || "City and time stay on this phone."}</Text>
      </View>
    </View>
  );
}

function StepHeader({ step, label, onBack }: { step: Step; label: string; onBack?: () => void }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {onBack ? (
          <Pressable onPress={onBack} accessibilityLabel="Back" style={styles.backBtn}>
            <Text style={styles.back}>Back</Text>
          </Pressable>
        ) : (
          <Text style={styles.kicker}>Step {step} of 3</Text>
        )}
        <Text style={styles.kickerGold}>{label}</Text>
      </View>
      {onBack ? <Text style={styles.kicker}>Step {step} of 3</Text> : null}
      <View style={styles.bars}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={[styles.bar, item <= step && styles.barOn]} />
        ))}
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
  scrollWide: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    width: "100%",
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingRight: 44,
  },
  kicker: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: theme.plum,
  },
  kickerGold: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: theme.marigold,
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
  backBtn: {
    minHeight: 32,
    justifyContent: "center",
  },
  back: {
    fontFamily: type.sansMedium,
    fontSize: 14,
    color: theme.plum,
  },
  artWrap: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: theme.sunk,
  },
  art: {
    width: "100%",
    height: 168,
  },
  artBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(251, 246, 238, 0.9)",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  artBadgeText: {
    fontFamily: type.sansSemibold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.ink,
  },
  badge: {
    textAlign: "center",
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: theme.marigold,
    marginBottom: 10,
  },
  title: {
    fontFamily: type.serif,
    fontSize: 32,
    lineHeight: 38,
    color: theme.ink,
    textAlign: "center",
  },
  pageTitle: {
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
  quote: {
    marginTop: 12,
    fontFamily: type.serifItalic,
    fontSize: 17,
    lineHeight: 26,
    color: theme.marigold,
    textAlign: "center",
  },
  ornament: {
    textAlign: "center",
    color: theme.marigold,
    marginTop: 12,
    fontSize: 16,
  },
  body: {
    marginTop: 12,
    fontFamily: type.sans,
    fontSize: 15,
    lineHeight: 22,
    color: theme.plum,
    textAlign: "center",
  },
  pills: {
    flexDirection: "row",
    gap: 8,
    marginTop: 22,
  },
  pill: {
    flex: 1,
    minWidth: 0,
    backgroundColor: theme.sunk,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  pillText: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    textAlign: "center",
    color: theme.ink,
  },
  search: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.line,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontFamily: type.sans,
    fontSize: 15,
    color: theme.ink,
    paddingVertical: 10,
  },
  clear: {
    fontFamily: type.sansMedium,
    fontSize: 12,
    color: theme.plum,
    paddingLeft: 8,
  },
  zone: {
    marginTop: 10,
    fontFamily: type.sans,
    fontSize: 13,
    lineHeight: 18,
    color: theme.plum,
    textAlign: "center",
  },
  section: {
    marginTop: 18,
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.plum,
  },
  tiny: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.plum,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    cursor: "pointer",
  },
  chipOn: {
    backgroundColor: theme.marigold,
    borderColor: theme.marigold,
  },
  chipDark: {
    backgroundColor: theme.ink,
    borderColor: theme.ink,
  },
  chipText: {
    fontFamily: type.sansMedium,
    fontSize: 14,
    color: theme.ink,
    pointerEvents: "none",
  },
  chipTextOn: {
    color: theme.ink,
  },
  chipDarkText: {
    color: theme.canvas,
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
  cardTitle: {
    fontFamily: type.serifSemibold,
    fontSize: 18,
    lineHeight: 24,
    color: theme.ink,
  },
  cardBody: {
    marginTop: 8,
    fontFamily: type.sans,
    fontSize: 13,
    lineHeight: 18,
    color: theme.plum,
  },
  local: {
    fontFamily: type.sansMedium,
    fontSize: 11,
    color: theme.marigold,
  },
  clock: {
    marginTop: 12,
    backgroundColor: theme.sunk,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  clockRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  clockGap: {
    width: 28,
  },
  meridiemPad: {
    width: 52,
  },
  caret: {
    width: 36,
    textAlign: "center",
    fontSize: 12,
    color: theme.plum,
    paddingVertical: 4,
  },
  digits: {
    width: 72,
    textAlign: "center",
    fontFamily: type.serif,
    fontSize: 36,
    lineHeight: 42,
    color: theme.ink,
  },
  colon: {
    fontFamily: type.serif,
    fontSize: 28,
    color: theme.marigold,
    marginHorizontal: 2,
  },
  meridiem: {
    marginLeft: 8,
    backgroundColor: theme.line,
    borderRadius: 99,
    padding: 3,
  },
  meridiemBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  meridiemOn: {
    backgroundColor: theme.marigold,
  },
  meridiemText: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    color: theme.plum,
  },
  meridiemTextOn: {
    color: theme.ink,
  },
  kidsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  kidsCopy: {
    flex: 1,
    minWidth: 0,
  },
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 99,
    backgroundColor: theme.line,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  switchOn: {
    backgroundColor: theme.marigold,
  },
  switchKnob: {
    width: 22,
    height: 22,
    borderRadius: 99,
    backgroundColor: theme.surface,
  },
  switchKnobOn: {
    marginLeft: "auto",
  },
  previewRef: {
    marginTop: 10,
    fontFamily: type.sansMedium,
    fontSize: 12,
    color: theme.plum,
  },
  previewSanskrit: {
    marginTop: 8,
    fontFamily: type.deva,
    fontSize: 16,
    lineHeight: 26,
    color: theme.ink,
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
  primary: {
    minHeight: 48,
    borderRadius: 99,
    backgroundColor: theme.marigold,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  primaryOff: {
    backgroundColor: theme.line,
  },
  primaryText: {
    fontFamily: type.sansSemibold,
    fontSize: 16,
    color: theme.ink,
    pointerEvents: "none",
  },
  primaryTextOff: {
    color: theme.plum,
  },
  footNote: {
    marginTop: 8,
    textAlign: "center",
    fontFamily: type.sans,
    fontSize: 12,
    color: theme.plum,
  },
});
