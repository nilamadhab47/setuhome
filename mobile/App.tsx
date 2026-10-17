import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold } from "@expo-google-fonts/dm-sans";
import { EBGaramond_500Medium, EBGaramond_500Medium_Italic, EBGaramond_600SemiBold } from "@expo-google-fonts/eb-garamond";
import { NotoSerifDevanagari_400Regular } from "@expo-google-fonts/noto-serif-devanagari";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { formatMorning, readHousehold, writeHousehold, type Household } from "./src/household";
import { wantOnboard } from "./src/preview";
import { syncMorningReminder, type ReminderState } from "./src/remind";
import { Diwali } from "./src/screens/Diwali";
import { Festivals } from "./src/screens/Festivals";
import { Later } from "./src/screens/Later";
import { Onboarding } from "./src/screens/Onboarding";
import { Read } from "./src/screens/Read";
import { Today } from "./src/screens/Today";
import { hydrateStore } from "./src/store";
import { theme, type } from "./src/theme";

const tabs = ["Today", "Guidance", "Stories", "Festivals", "Read"] as const;
type Tab = (typeof tabs)[number];

function tabFromUrl(): Tab {
  const search = typeof window === "undefined" ? undefined : window.location?.search;
  if (!search) return "Today";
  const value = new URLSearchParams(search).get("tab");
  return tabs.includes(value as Tab) ? (value as Tab) : "Today";
}

function onboardFromUrl() {
  return wantOnboard();
}

const laterCopy: Record<Exclude<Tab, "Today" | "Read" | "Festivals">, string> = {
  Guidance: "The conversation is free. An answer cites a verse from the Gita or the Ramayana and does not speak as a deity.",
  Stories: "Little Setu and the bedtime player come next. Stories are for listening at home.",
};

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    EBGaramond_500Medium,
    EBGaramond_500Medium_Italic,
    EBGaramond_600SemiBold,
    NotoSerifDevanagari_400Regular,
  });
  const [tab, setTab] = useState<Tab>(tabFromUrl);
  const [booted, setBooted] = useState(false);
  const [household, setHousehold] = useState<Household | null>(null);
  const [forceOnboard, setForceOnboard] = useState(onboardFromUrl);
  const [reminder, setReminder] = useState<ReminderState>("off");
  const [guide, setGuide] = useState<"diwali" | null>(null);

  useEffect(() => {
    let cancelled = false;
    void hydrateStore().then(() => {
      if (cancelled) return;
      setForceOnboard(wantOnboard());
      setHousehold(wantOnboard() ? null : readHousehold());
      setBooted(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!booted) return;
    void syncMorningReminder(household).then(setReminder);
  }, [booted, household]);

  if (!fontsLoaded || !booted) {
    return <View style={styles.loading} />;
  }

  if (forceOnboard || !household) {
    return (
      <SafeAreaView style={styles.root}>
        <StatusBar style="dark" />
        <Onboarding
          onDone={(next) => {
            setHousehold(writeHousehold(next) ?? next);
            setForceOnboard(false);
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.body}>
        {guide === "diwali" ? (
          <Diwali household={household} onBack={() => setGuide(null)} />
        ) : tab === "Today" ? (
          <Today
            household={household}
            morningLabel={formatMorning(household.morningHour, household.morningMinute)}
            reminder={reminder}
            onOpenDiwali={() => setGuide("diwali")}
            onOpenStories={() => setTab("Stories")}
          />
        ) : tab === "Festivals" ? (
          <Festivals
            household={household}
            onShiftDay={(day) => {
              const next = writeHousehold({ ...household, observeDay: day });
              if (next) setHousehold(next);
            }}
            onOpenDiwali={() => setGuide("diwali")}
          />
        ) : tab === "Read" ? (
          <Read />
        ) : (
          <Later title={tab} issue={laterCopy[tab]} />
        )}
      </View>
      <View style={styles.tabBar}>
        {tabs.map((item) => {
          const active = item === tab;
          return (
            <Pressable
              key={item}
              style={styles.tab}
              onPress={() => {
                setGuide(null);
                setTab(item);
              }}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: theme.canvas,
  },
  root: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    overflow: "hidden",
    backgroundColor: theme.canvas,
  },
  body: {
    flex: 1,
    width: "100%",
    minWidth: 0,
  },
  tabBar: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: theme.line,
    backgroundColor: theme.surface,
  },
  tab: {
    flex: 1,
    flexBasis: 0,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontFamily: type.sansMedium,
    fontSize: 10,
    color: theme.plum,
  },
  tabLabelActive: {
    color: theme.ink,
  },
});
