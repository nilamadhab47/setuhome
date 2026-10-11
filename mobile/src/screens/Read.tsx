import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  GITA_THEMES,
  catalogFor,
  itemById,
  sargasFor,
  searchVerses,
  sortedCatalog,
  type Book,
  type CatalogItem,
  type SortMode,
} from "../library";
import { continueLabel, readContinue, readOpens, recordOpen } from "../progress";
import { theme, type } from "../theme";
import { placeOf, verseByRef, versesInGroup, type Verse } from "../verse";
import { Reader } from "./Reader";

type Path =
  | { view: "library" }
  | { view: "sargas"; kandaId: string }
  | { view: "verses"; chapterId: string }
  | { view: "reader"; chapterId: string; ref: string };

export function Read() {
  const [path, setPath] = useState<Path>({ view: "library" });
  const [book, setBook] = useState<Book>("gita");
  const [sort, setSort] = useState<SortMode>("popular");
  const [query, setQuery] = useState("");
  const [themeFilter, setThemeFilter] = useState<string | null>(null);
  const [opens, setOpens] = useState(readOpens);
  const [resume, setResume] = useState(readContinue);
  const items = useMemo(() => {
    const base = catalogFor(book);
    const themed = themeFilter && book === "gita" ? base.filter((item) => item.themes.includes(themeFilter)) : base;
    return sortedCatalog(themed, sort, opens);
  }, [book, themeFilter, sort, opens]);
  const hits = query.trim().length >= 2 ? searchVerses(query, book) : [];
  const continued = resume ? verseByRef(resume.ref) : undefined;

  function openVerse(chapterId: string, ref: string) {
    const next = recordOpen(chapterId, ref);
    setOpens(readOpens());
    setResume(next);
    setPath({ view: "reader", chapterId, ref });
  }

  if (path.view === "reader") {
    return (
      <Reader
        verseRef={path.ref}
        onBack={() => setPath({ view: "verses", chapterId: path.chapterId })}
        onChangeVerse={(ref) => openVerse(path.chapterId, ref)}
      />
    );
  }

  if (path.view === "verses") {
    return (
      <VerseList
        chapterId={path.chapterId}
        onBack={() => {
          const item = itemById(path.chapterId);
          if (item?.kanda && item.id.split(":").length === 3) setPath({ view: "sargas", kandaId: `ramayana:${item.kanda}` });
          else setPath({ view: "library" });
        }}
        onOpen={(ref) => openVerse(path.chapterId, ref)}
      />
    );
  }

  if (path.view === "sargas") {
    const kanda = itemById(path.kandaId);
    const items = sortedCatalog(sargasFor(path.kandaId), sort, opens);
    return (
      <View style={styles.flex}>
        <View style={styles.pad}>
          <Pressable onPress={() => setPath({ view: "library" })} accessibilityLabel="Back" style={styles.backBtn}>
            <Text style={styles.back}>Back</Text>
          </Pressable>
          <Text style={styles.kicker}>{kanda?.titleSa}</Text>
          <Text style={styles.title}>{kanda?.titleEn}</Text>
          <Text style={styles.sub}>{items.length} sargas</Text>
          <Pressable onPress={() => setSort(sort === "popular" ? "order" : "popular")} style={styles.sortBtn}>
            <Text style={styles.sortText}>{sort === "popular" ? "Sorted by what is opened" : "Sorted in order"}</Text>
          </Pressable>
        </View>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPad}
          renderItem={({ item }) => (
            <ChapterRow item={item} active={resume?.chapterId === item.id} onPress={() => setPath({ view: "verses", chapterId: item.id })} />
          )}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>Scripture</Text>
      <Text style={styles.title}>Read</Text>
      <View style={styles.toggle}>
        <Pressable
          style={[styles.pill, book === "gita" && styles.pillOn]}
          onPress={() => {
            setBook("gita");
            setThemeFilter(null);
            setQuery("");
          }}
        >
          <Text style={[styles.pillText, book === "gita" && styles.pillTextOn]}>Bhagavad Gita</Text>
        </Pressable>
        <Pressable
          style={[styles.pill, book === "ramayana" && styles.pillOn]}
          onPress={() => {
            setBook("ramayana");
            setThemeFilter(null);
            setQuery("");
          }}
        >
          <Text style={[styles.pillText, book === "ramayana" && styles.pillTextOn]}>Valmiki Ramayana</Text>
        </Pressable>
      </View>
      <View style={styles.search}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={book === "gita" ? "Search Gita verses" : "Search Ramayana verses"}
          placeholderTextColor={theme.plum}
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      {continued && resume ? (
        <Pressable
          style={styles.continue}
          onPress={() => openVerse(resume.chapterId, resume.ref)}
        >
          <Text style={styles.continueKicker}>Continue reading · {continueLabel(resume.at)}</Text>
          <Text style={styles.continueTitle}>{continued.ref}</Text>
          <Text style={styles.continueBody} numberOfLines={2}>
            {continued.sanskrit[0] || continued.simple?.simpleEnglish || continued.english}
          </Text>
          <Text style={styles.resume}>Resume verse</Text>
        </Pressable>
      ) : null}
      {book === "gita" ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {GITA_THEMES.map((name) => {
            const on = themeFilter === name;
            return (
              <Pressable
                key={name}
                style={[styles.chip, on && styles.chipOn]}
                onPress={() => setThemeFilter(on ? null : name)}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}
      {query.trim().length >= 2 ? (
        <View>
          <Text style={styles.section}>Search</Text>
          {hits.length ? (
            hits.map((verse) => (
              <Pressable
                key={verse.ref}
                style={styles.row}
                onPress={() => openVerse(placeOf(verse).group, verse.ref)}
              >
                <Text style={styles.rowTitle}>{verse.ref}</Text>
                <Text style={styles.rowMeta} numberOfLines={2}>
                  {verse.simple?.simpleEnglish || verse.english || verse.sanskrit[0]}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={styles.sub}>No verses match those words.</Text>
          )}
        </View>
      ) : (
        <View>
          <View style={styles.sectionRow}>
            <View>
              <Text style={styles.section}>{book === "gita" ? `All ${items.length} chapters` : "Seven kāṇḍas"}</Text>
              <Text style={styles.sub}>
                {sort === "popular" ? "Opened most, then well-known chapters" : "Canonical order"}
              </Text>
            </View>
            <Pressable onPress={() => setSort(sort === "popular" ? "order" : "popular")} style={styles.sortBtn}>
              <Text style={styles.sortText}>{sort === "popular" ? "Popular" : "In order"}</Text>
            </Pressable>
          </View>
          {items.map((item) => (
            <ChapterRow
              key={item.id}
              item={item}
              active={resume?.chapterId === item.id || resume?.chapterId.startsWith(`${item.id}:`)}
              onPress={() =>
                item.book === "ramayana" && item.id.split(":").length === 2
                  ? setPath({ view: "sargas", kandaId: item.id })
                  : setPath({ view: "verses", chapterId: item.id })
              }
            />
          ))}
        </View>
      )}
      <Text style={styles.note}>
        Sanskrit is from sourced recensions. English is Telang and Dutt. Simple English is an
        explanation of those lines, not a new translation.
      </Text>
    </ScrollView>
  );
}

function ChapterRow({
  item,
  active,
  onPress,
}: {
  item: CatalogItem;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.chapter, active && styles.chapterOn]} onPress={onPress}>
      <View style={[styles.num, active && styles.numOn]}>
        <Text style={[styles.numText, active && styles.numTextOn]}>{item.chapter}</Text>
      </View>
      <View style={styles.chapterCopy}>
        <Text style={styles.chapterSa} numberOfLines={1}>
          {item.titleSa}
        </Text>
        <Text style={styles.chapterEn} numberOfLines={1}>
          {item.titleEn} · {item.verseCount} verses
        </Text>
      </View>
    </Pressable>
  );
}

function VerseList({
  chapterId,
  onBack,
  onOpen,
}: {
  chapterId: string;
  onBack: () => void;
  onOpen: (ref: string) => void;
}) {
  const item = itemById(chapterId);
  const rows = versesInGroup(chapterId);
  return (
    <View style={styles.flex}>
      <View style={styles.pad}>
        <Pressable onPress={onBack} accessibilityLabel="Back" style={styles.backBtn}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.kicker}>{item?.titleEn}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item?.titleSa}
        </Text>
        <Text style={styles.sub}>{rows.length} verses</Text>
      </View>
      <FlatList
        data={rows}
        keyExtractor={(row) => row.ref}
        contentContainerStyle={styles.listPad}
        renderItem={({ item: verse }) => <VerseRow verse={verse} onPress={() => onOpen(verse.ref)} />}
      />
    </View>
  );
}

function VerseRow({ verse, onPress }: { verse: Verse; onPress: () => void }) {
  const place = placeOf(verse);
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.rowTitle}>Verse {place.verse}</Text>
      <Text style={styles.rowMeta} numberOfLines={2}>
        {verse.simple?.simpleEnglish || verse.english || verse.sanskrit[0] || verse.ref}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    width: "100%",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
  },
  pad: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  listPad: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 8,
    gap: 8,
  },
  kicker: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: theme.marigold,
  },
  title: {
    marginTop: 4,
    fontFamily: type.serif,
    fontSize: 32,
    lineHeight: 38,
    color: theme.ink,
  },
  sub: {
    marginTop: 4,
    fontFamily: type.sans,
    fontSize: 13,
    color: theme.plum,
  },
  toggle: {
    marginTop: 14,
    flexDirection: "row",
    backgroundColor: theme.sunk,
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  pill: {
    flex: 1,
    minHeight: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  pillOn: {
    backgroundColor: theme.surface,
  },
  pillText: {
    fontFamily: type.sansMedium,
    fontSize: 12,
    color: theme.plum,
  },
  pillTextOn: {
    color: theme.ink,
  },
  search: {
    marginTop: 12,
    backgroundColor: theme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.line,
    paddingHorizontal: 12,
    minHeight: 48,
    justifyContent: "center",
  },
  input: {
    fontFamily: type.sans,
    fontSize: 15,
    color: theme.ink,
    minHeight: 44,
  },
  continue: {
    marginTop: 14,
    backgroundColor: theme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 14,
  },
  continueKicker: {
    fontFamily: type.sansSemibold,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: theme.marigold,
  },
  continueTitle: {
    marginTop: 8,
    fontFamily: type.serif,
    fontSize: 20,
    color: theme.ink,
  },
  continueBody: {
    marginTop: 4,
    fontFamily: type.deva,
    fontSize: 16,
    lineHeight: 24,
    color: theme.ink,
  },
  resume: {
    marginTop: 10,
    fontFamily: type.sansSemibold,
    fontSize: 13,
    color: theme.ink,
  },
  chips: {
    gap: 8,
    paddingVertical: 12,
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: "center",
    justifyContent: "center",
  },
  chipOn: {
    backgroundColor: theme.ink,
    borderColor: theme.ink,
  },
  chipText: {
    fontFamily: type.sansMedium,
    fontSize: 12,
    color: theme.ink,
  },
  chipTextOn: {
    color: theme.surface,
  },
  sectionRow: {
    marginTop: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
  },
  section: {
    marginTop: 8,
    fontFamily: type.serif,
    fontSize: 22,
    color: theme.ink,
  },
  sortBtn: {
    minHeight: 36,
    justifyContent: "center",
  },
  sortText: {
    fontFamily: type.sansMedium,
    fontSize: 12,
    color: theme.plum,
  },
  chapter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 12,
    marginBottom: 8,
  },
  chapterOn: {
    backgroundColor: theme.sunk,
    borderColor: theme.marigold,
  },
  num: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.sunk,
    alignItems: "center",
    justifyContent: "center",
  },
  numOn: {
    backgroundColor: theme.marigold,
  },
  numText: {
    fontFamily: type.serif,
    fontSize: 16,
    color: theme.ink,
  },
  numTextOn: {
    color: theme.ink,
  },
  chapterCopy: {
    flex: 1,
    minWidth: 0,
  },
  chapterSa: {
    fontFamily: type.deva,
    fontSize: 17,
    color: theme.ink,
  },
  chapterEn: {
    marginTop: 2,
    fontFamily: type.sans,
    fontSize: 13,
    color: theme.plum,
  },
  row: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 12,
    marginBottom: 8,
  },
  rowTitle: {
    fontFamily: type.serif,
    fontSize: 16,
    color: theme.ink,
  },
  rowMeta: {
    marginTop: 4,
    fontFamily: type.sans,
    fontSize: 13,
    lineHeight: 18,
    color: theme.plum,
  },
  backBtn: {
    minHeight: 40,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  back: {
    fontFamily: type.sansMedium,
    fontSize: 14,
    color: theme.plum,
  },
  note: {
    marginTop: 8,
    fontFamily: type.sans,
    fontSize: 13,
    lineHeight: 18,
    color: theme.plum,
  },
});
