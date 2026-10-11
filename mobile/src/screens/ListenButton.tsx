import {
  setAudioModeAsync,
  setIsAudioActiveAsync,
  useAudioPlaylist,
  useAudioPlaylistStatus,
} from "expo-audio";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  LISTEN_FAILED,
  LISTEN_MISSING,
  hasListenClip,
  partSource,
  resolveListenClip,
  type ListenClip,
  type SpokenSync,
} from "../listen";
import { theme, type } from "../theme";
import type { Verse } from "../verse";

export function ListenButton({
  verse,
  onSync,
}: {
  verse: Verse;
  onSync?: (sync: SpokenSync | null) => void;
}) {
  const [clip, setClip] = useState<ListenClip | undefined>();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const onSyncRef = useRef(onSync);
  const lastTrack = useRef(-1);
  onSyncRef.current = onSync;
  const ready = hasListenClip(verse);

  const sources = useMemo(() => {
    if (!clip) return [];
    const list: Array<number | { uri: string }> = [];
    const chant = partSource(clip.chant);
    if (chant) list.push(chant);
    const english = clip.english ? partSource(clip.english) : null;
    if (english) list.push(english);
    return list;
  }, [clip]);

  const playlist = useAudioPlaylist({ sources, updateInterval: 80, loop: "none" });
  const status = useAudioPlaylistStatus(playlist);
  const part = status.currentIndex > 0 && clip?.english ? "english" : "chant";
  const playing = Boolean(status.playing);
  const duration = status.duration || 0;
  const progress = duration > 0 ? Math.min(1, (status.currentTime || 0) / duration) : 0;
  const active = part === "english" ? clip?.english : clip?.chant;
  const caption = !clip
    ? ""
    : clip.english
      ? active?.label
      : `${clip.chant.label} The everyday-words voice is not on the phone for this verse.`;

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true, interruptionMode: "doNotMix" });
    void setIsAudioActiveAsync(true);
  }, []);

  useEffect(() => {
    let alive = true;
    setNote("");
    setClip(undefined);
    setBusy(false);
    onSyncRef.current?.(null);
    if (!ready) {
      console.log("[listen] no clip", verse.ref);
      return;
    }
    resolveListenClip(verse)
      .then((next) => {
        if (!alive) return;
        if (!next) {
          console.log("[listen] resolve empty", verse.ref);
          setNote(LISTEN_FAILED);
          return;
        }
        console.log("[listen] loaded", verse.ref, {
          chant: next.chant.uri ? "recording" : "file",
          english: Boolean(next.english),
        });
        setClip(next);
      })
      .catch((error) => {
        console.log("[listen] resolve failed", verse.ref, String(error));
        if (alive) setNote(LISTEN_FAILED);
      });
    return () => {
      alive = false;
      onSyncRef.current?.(null);
    };
  }, [verse.ref, ready]);

  useEffect(() => {
    if (status.currentIndex === lastTrack.current) return;
    lastTrack.current = status.currentIndex;
    const rate = status.currentIndex > 0 ? 1 : clip?.chant.rate ?? 1;
    playlist.playbackRate = rate;
    console.log("[listen] track", status.currentIndex, "of", status.trackCount, verse.ref, "rate", rate);
  }, [status.currentIndex, status.trackCount, clip, playlist, verse.ref]);

  useEffect(() => {
    if (!playing) {
      onSyncRef.current?.(null);
      return;
    }
    onSyncRef.current?.({
      part,
      time: status.currentTime || 0,
      duration,
      words: active?.words ?? [],
      playing: true,
    });
  }, [playing, part, active?.words, status.currentTime, duration]);

  async function onPress() {
    if (!ready) {
      setNote(note ? "" : LISTEN_MISSING);
      return;
    }
    if (busy) return;
    try {
      if (playing) {
        playlist.pause();
        return;
      }
      let next = clip;
      if (!next) {
        setBusy(true);
        next = await resolveListenClip(verse);
        setBusy(false);
        if (next) setClip(next);
      }
      if (!next) {
        setNote(LISTEN_FAILED);
        return;
      }
      await setIsAudioActiveAsync(true);
      const atEnd =
        status.trackCount > 0 &&
        status.currentIndex >= status.trackCount - 1 &&
        duration > 0 &&
        (status.currentTime || 0) >= duration - 0.2;
      if (status.currentIndex !== 0 || atEnd || (status.currentTime || 0) > duration - 0.2) {
        playlist.skipTo(0);
        await playlist.seekTo(0);
      }
      playlist.playbackRate = next.chant.rate;
      playlist.play();
      console.log("[listen] play", verse.ref, "tracks", status.trackCount || sources.length);
      setNote("");
    } catch (error) {
      console.log("[listen] play failed", verse.ref, String(error));
      setBusy(false);
      setNote(LISTEN_FAILED);
    }
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.listen, playing && styles.listenOn]}
        onPress={onPress}
        accessibilityLabel={playing ? "Pause verse" : "Listen to verse"}
      >
        <Text style={[styles.listenText, playing && styles.listenTextOn]}>
          {playing ? "Pause" : busy ? "Loading" : part === "english" ? "English" : "Listen"}
        </Text>
      </Pressable>
      {playing || progress > 0 ? (
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
      ) : null}
      {note ? <Text style={styles.note}>{note}</Text> : null}
      {clip && !note ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  listen: {
    minHeight: 44,
    borderRadius: 999,
    backgroundColor: theme.marigold,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  listenOn: {
    backgroundColor: theme.ink,
  },
  listenText: {
    fontFamily: type.sansSemibold,
    fontSize: 14,
    color: theme.ink,
  },
  listenTextOn: {
    color: theme.surface,
  },
  track: {
    marginTop: 8,
    height: 3,
    borderRadius: 99,
    backgroundColor: theme.line,
    overflow: "hidden",
  },
  fill: {
    height: 3,
    backgroundColor: theme.marigold,
  },
  note: {
    marginTop: 6,
    textAlign: "center",
    fontFamily: type.sans,
    fontSize: 12,
    color: theme.plum,
  },
  caption: {
    marginTop: 6,
    textAlign: "center",
    fontFamily: type.sans,
    fontSize: 11,
    lineHeight: 15,
    color: theme.plum,
  },
});
