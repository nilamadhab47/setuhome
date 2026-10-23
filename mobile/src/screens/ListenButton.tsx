import {
  setAudioModeAsync,
  setIsAudioActiveAsync,
  useAudioPlaylist,
  useAudioPlaylistStatus,
} from "expo-audio";
import * as Speech from "expo-speech";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  LISTEN_FAILED,
  LISTEN_MISSING,
  LISTEN_WAIT,
  hasListenClip,
  listenLabel,
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
  const [deck, setDeck] = useState(0);
  const [speechOn, setSpeechOn] = useState(false);
  const playAfter = useRef(false);
  const deaths = useRef(0);
  const speechGen = useRef(0);
  const onSyncRef = useRef(onSync);
  onSyncRef.current = onSync;
  const ready = hasListenClip(verse);

  useEffect(() => {
    let alive = true;
    setNote("");
    setClip(undefined);
    setBusy(false);
    setSpeechOn(false);
    playAfter.current = false;
    deaths.current = 0;
    speechGen.current += 1;
    onSyncRef.current?.(null);
    void Speech.stop();
    if (!ready) {
      console.log("[listen] no bundled clip", verse.ref);
      return () => {
        alive = false;
        onSyncRef.current?.(null);
        void Speech.stop();
      };
    }
    resolveListenClip(verse)
      .then((next) => {
        if (!alive) return;
        if (!next) {
          console.log("[listen] resolve empty", verse.ref);
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
      });
    return () => {
      alive = false;
      onSyncRef.current?.(null);
      void Speech.stop();
    };
  }, [verse.ref, ready]);

  async function speakFallback() {
    const chant = (verse.transliteration.join(" ") || verse.sanskrit.join(" ")).trim();
    if (!chant) {
      setNote(LISTEN_MISSING);
      return;
    }
    const gen = ++speechGen.current;
    const english = verse.simple?.simpleEnglish?.trim();
    await Speech.stop();
    setSpeechOn(true);
    setNote("");
    Speech.speak(chant, {
      language: "en-IN",
      rate: 0.78,
      onDone: () => {
        if (gen !== speechGen.current) return;
        if (!english) {
          setSpeechOn(false);
          return;
        }
        Speech.speak(english, {
          language: "en-IN",
          onDone: () => {
            if (gen === speechGen.current) setSpeechOn(false);
          },
          onStopped: () => {
            if (gen === speechGen.current) setSpeechOn(false);
          },
          onError: () => {
            if (gen === speechGen.current) {
              setSpeechOn(false);
              setNote(LISTEN_FAILED);
            }
          },
        });
      },
      onStopped: () => {
        if (gen === speechGen.current) setSpeechOn(false);
      },
      onError: () => {
        if (gen === speechGen.current) {
          setSpeechOn(false);
          setNote(LISTEN_FAILED);
        }
      },
    });
  }

  if (!clip) {
    return (
      <ListenChrome
        playing={speechOn}
        busy={busy}
        part="chant"
        progress={0}
        note={note}
        caption={speechOn ? listenLabel(verse) : ""}
        onPress={() => {
          if (busy) return;
          if (speechOn) {
            speechGen.current += 1;
            setSpeechOn(false);
            void Speech.stop();
            return;
          }
          playAfter.current = true;
          setBusy(true);
          setNote(LISTEN_WAIT);
          void resolveListenClip(verse)
            .then(async (next) => {
              if (next) {
                console.log("[listen] loaded on tap", verse.ref);
                setClip(next);
                setNote("");
                return;
              }
              console.log("[listen] fallback speech", verse.ref);
              await speakFallback();
            })
            .catch(async (error) => {
              console.log("[listen] tap resolve failed", verse.ref, String(error));
              await speakFallback();
            })
            .finally(() => setBusy(false));
        }}
      />
    );
  }

  return (
    <ListenDeck
      key={`${verse.ref}-${deck}`}
      verse={verse}
      clip={clip}
      autoPlay={playAfter.current}
      onSync={onSync}
      onNote={setNote}
      onBusy={setBusy}
      note={note}
      busy={busy}
      onDead={() => {
        if (deaths.current >= 2) {
          setNote(LISTEN_FAILED);
          return;
        }
        deaths.current += 1;
        playAfter.current = true;
        setNote("");
        setDeck((value) => value + 1);
      }}
    />
  );
}

function ListenDeck({
  verse,
  clip,
  autoPlay,
  onSync,
  onNote,
  onBusy,
  note,
  busy,
  onDead,
}: {
  verse: Verse;
  clip: ListenClip;
  autoPlay: boolean;
  onSync?: (sync: SpokenSync | null) => void;
  onNote: (value: string) => void;
  onBusy: (value: boolean) => void;
  note: string;
  busy: boolean;
  onDead: () => void;
}) {
  const onSyncRef = useRef(onSync);
  const lastTrack = useRef(-1);
  const started = useRef(false);
  const session = useRef(false);
  const origin = useRef({ index: -1, at: 0, native: 0, stall: 0 });
  const [over, setOver] = useState(false);
  const [tick, setTick] = useState({ index: 0, time: 0, duration: 0, playing: false, tracks: 0 });
  onSyncRef.current = onSync;

  const sources = useMemo(() => {
    const list: Array<number | { uri: string }> = [];
    const chant = partSource(clip.chant);
    if (chant) list.push(chant);
    const english = clip.english ? partSource(clip.english) : null;
    if (english) list.push(english);
    return list;
  }, [clip]);

  const playlist = useAudioPlaylist({ sources, updateInterval: 50, loop: "none" });
  const status = useAudioPlaylistStatus(playlist);
  const statusRef = useRef(status);
  statusRef.current = status;

  const index = tick.tracks > 0 ? tick.index : status.currentIndex;
  const part = index > 0 && clip.english ? "english" : "chant";
  const playing = session.current && (tick.playing || status.playing) && !over;
  const duration = tick.duration || status.duration || 0;
  const time = tick.time || 0;
  const progress = duration > 0 ? Math.min(1, time / duration) : 0;
  const active = part === "english" ? clip.english : clip.chant;
  const caption = clip.english
    ? active?.label ?? ""
    : clip.chant.label;

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true, interruptionMode: "doNotMix" });
    void setIsAudioActiveAsync(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      let nativeTime = 0;
      let nativeIndex = 0;
      let nativeDuration = 0;
      let nativePlaying = false;
      let tracks = 0;
      try {
        nativeTime = playlist.currentTime || 0;
        nativeIndex = playlist.currentIndex || 0;
        nativeDuration = playlist.duration || 0;
        nativePlaying = Boolean(playlist.playing);
        tracks = playlist.trackCount || 0;
      } catch {
        return;
      }
      if (origin.current.index !== nativeIndex) {
        origin.current = { index: nativeIndex, at: Date.now(), native: nativeTime, stall: 0 };
        const rate = nativeIndex > 0 ? 1 : clip.chant.rate;
        if (lastTrack.current !== nativeIndex) {
          lastTrack.current = nativeIndex;
          try {
            if (playlist.playbackRate !== rate) playlist.playbackRate = rate;
          } catch {
            /* native player can be missing after a reload */
          }
          console.log("[listen] track", nativeIndex, "of", tracks, verse.ref, "rate", rate);
        }
      }
      if (Math.abs(nativeTime - origin.current.native) < 0.03) origin.current.stall += 1;
      else {
        origin.current.native = nativeTime;
        origin.current.stall = 0;
      }
      const wall = (Date.now() - origin.current.at) / 1000;
      const stalled = origin.current.stall > 4 && nativePlaying;
      const useWall = stalled && nativeTime < 0.25;
      const nextTime = useWall ? wall : nativeTime;
      const last = tracks > 0 && nativeIndex >= tracks - 1;
      const finished =
        last && nativeDuration > 0 && nextTime >= nativeDuration - 0.12 && (stalled || !nativePlaying);
      setTick({
        index: nativeIndex,
        time: nextTime,
        duration: nativeDuration,
        playing: nativePlaying && !finished,
        tracks,
      });
      if (finished && session.current) {
        session.current = false;
        setOver(true);
        try {
          playlist.pause();
        } catch {
          /* already ended */
        }
      }
    }, 50);
    return () => clearInterval(id);
  }, [playlist, clip.chant.rate, verse.ref]);

  useEffect(() => {
    const last = status.trackCount > 0 && status.currentIndex >= status.trackCount - 1;
    if (status.didJustFinish && last && session.current) {
      session.current = false;
      setOver(true);
      try {
        playlist.pause();
      } catch {
        /* already ended */
      }
    }
  }, [status.didJustFinish, status.currentIndex, status.trackCount, playlist]);

  useEffect(() => {
    if (!playing) {
      onSyncRef.current?.(null);
      return;
    }
    onSyncRef.current?.({
      part,
      time,
      duration,
      words: active?.words ?? [],
      playing: true,
    });
  }, [playing, part, active?.words, time, duration]);

  async function waitForTracks() {
    for (let i = 0; i < 25; i += 1) {
      try {
        if (playlist.trackCount > 0) return true;
      } catch {
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    try {
      return playlist.trackCount > 0;
    } catch {
      return false;
    }
  }

  async function startChant() {
    await setIsAudioActiveAsync(true);
    const readyTracks = await waitForTracks();
    if (!readyTracks) throw new Error("playlist empty");
    setOver(false);
    session.current = true;
    origin.current = { index: -1, at: Date.now(), native: 0, stall: 0 };
    let index = 0;
    let t = 0;
    let dur = 0;
    try {
      index = playlist.currentIndex || 0;
      t = playlist.currentTime || 0;
      dur = playlist.duration || 0;
    } catch {
      throw new Error("playlist dead");
    }
    if (index > 0 || (dur > 0 && t > 0.15)) {
      playlist.skipTo(0);
      await playlist.seekTo(0);
    }
    playlist.playbackRate = clip.chant.rate;
    playlist.play();
    console.log("[listen] play", verse.ref, "tracks", playlist.trackCount);
  }

  useEffect(() => {
    if (!autoPlay || started.current) return;
    started.current = true;
    void startChant().catch((error) => {
      console.log("[listen] autoplay failed", verse.ref, String(error));
      onNote(LISTEN_FAILED);
    });
  }, [autoPlay]);

  async function onPress() {
    if (busy) return;
    try {
      if (playing) {
        session.current = false;
        playlist.pause();
        setTick((value) => ({ ...value, playing: false }));
        return;
      }
      onBusy(true);
      await startChant();
      onNote("");
    } catch (error) {
      console.log("[listen] play failed", verse.ref, String(error));
      onBusy(false);
      onDead();
      return;
    }
    onBusy(false);
  }

  return (
    <ListenChrome
      playing={playing}
      busy={busy}
      part={part}
      progress={over ? 0 : progress}
      note={note}
      caption={note ? "" : caption}
      onPress={onPress}
    />
  );
}

function ListenChrome({
  playing,
  busy,
  part,
  progress,
  note,
  caption,
  onPress,
}: {
  playing: boolean;
  busy: boolean;
  part: "chant" | "english";
  progress: number;
  note: string;
  caption: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.listen, playing && styles.listenOn]}
        onPress={onPress}
        accessibilityLabel={playing ? "Pause verse" : "Listen to verse"}
      >
        <Text style={[styles.listenText, playing && styles.listenTextOn]}>
          {playing ? "Pause" : busy ? "Please wait" : part === "english" ? "English" : "Listen"}
        </Text>
      </Pressable>
      {playing || progress > 0 ? (
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
      ) : null}
      {note ? <Text style={styles.note}>{note}</Text> : null}
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
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
    pointerEvents: "none",
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
