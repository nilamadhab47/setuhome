import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { formatMorning, type Household } from "./household";

const id = "setuhome-morning-verse";
const channel = "morning";

export type ReminderState = "off" | "denied" | "set";

let last: ReminderState = "off";

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export function reminderState() {
  return last;
}

async function ensureChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(channel, {
    name: "Morning verse",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function syncMorningReminder(household: Household | null): Promise<ReminderState> {
  if (Platform.OS === "web") {
    last = "off";
    return last;
  }
  try {
    if (!household) {
      await Notifications.cancelScheduledNotificationAsync(id);
      last = "off";
      return last;
    }
    await ensureChannel();
    const current = await Notifications.getPermissionsAsync();
    const asked =
      current.status === "granted"
        ? current
        : await Notifications.requestPermissionsAsync({
            ios: { allowAlert: true, allowBadge: true, allowSound: true },
          });
    if (asked.status !== "granted") {
      last = "denied";
      return last;
    }
    await Notifications.cancelScheduledNotificationAsync(id);
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: "Your morning verse",
        body: `Open Today. The shloka is waiting · ${formatMorning(household.morningHour, household.morningMinute)}.`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: household.morningHour,
        minute: household.morningMinute,
        channelId: channel,
      },
    });
    last = "set";
    return last;
  } catch {
    last = "off";
    return last;
  }
}
