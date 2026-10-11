import { useEffect, useState } from "react";

type StitchScreen = {
  id: string;
  label: string;
  group: string;
  file: string;
  frame?: "desktop";
};

const screens: StitchScreen[] = [
  { id: "landing-mobile", label: "Mobile", group: "Site", file: "landing-mobile.html" },
  { id: "landing-desktop", label: "Desktop", group: "Site", file: "landing-desktop.html", frame: "desktop" },
  { id: "landing-desktop-extended", label: "Desktop, extended", group: "Site", file: "landing-desktop-extended.html", frame: "desktop" },
  { id: "landing-desktop-short", label: "Desktop, first cut", group: "Site", file: "landing-desktop-short.html", frame: "desktop" },
  { id: "welcome", label: "Welcome", group: "Onboarding", file: "welcome.html" },
  { id: "city", label: "Your city", group: "Onboarding", file: "city.html" },
  { id: "focus", label: "Your focus · later", group: "Later", file: "focus.html" },
  { id: "morning", label: "Morning verse", group: "Onboarding", file: "morning.html" },
  { id: "today", label: "Today", group: "Home", file: "today.html" },
  { id: "verse-playing", label: "Verse playing", group: "Home", file: "verse-playing.html" },
  { id: "verse-reader", label: "Verse reader", group: "Home", file: "verse-reader.html" },
  { id: "read", label: "Read", group: "Library", file: "read.html" },
  { id: "stories", label: "Stories", group: "Library", file: "stories.html" },
  { id: "story", label: "Story player", group: "Library", file: "story.html" },
  { id: "festivals", label: "Festivals", group: "Festivals", file: "festivals.html" },
  { id: "diwali", label: "Diwali guide", group: "Festivals", file: "diwali.html" },
  { id: "guidance", label: "Guidance", group: "Guidance", file: "guidance.html" },
  { id: "guidance-chat", label: "Guidance thread", group: "Guidance", file: "guidance-chat.html" },
  { id: "profile", label: "Profile", group: "You", file: "profile.html" },
  { id: "family", label: "Family plan", group: "You", file: "family.html" },
  { id: "streak", label: "Seven mornings", group: "You", file: "streak.html" },
];

const groups = ["Site", "Onboarding", "Home", "Library", "Festivals", "Guidance", "You", "Later"];

function screenFromHash(): string {
  const value = window.location.hash.replace("#", "");
  return screens.some((item) => item.id === value) ? value : "today";
}

export function App() {
  const [screenId, setScreenId] = useState(screenFromHash);
  const screen = screens.find((item) => item.id === screenId) ?? screens[4];

  useEffect(() => {
    function onHash() {
      setScreenId(screenFromHash());
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function open(id: string) {
    setScreenId(id);
    if (window.location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
  }

  return (
    <div className="studio" data-theme="light">
      <aside className="panel">
        <div className="mark">
          <div className="lamp" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5c2 2.2 3 3.8 3 5.4a3 3 0 1 1-6 0c0-1.6 1-3.2 3-5.4Z" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          <div>
            <strong>Sacred Editorial</strong>
            <span>SetuHome · Stitch screens</span>
          </div>
        </div>
        {groups.map((group) => (
          <div key={group}>
            <div className="nav-label">{group}</div>
            {screens
              .filter((item) => item.group === group)
              .map((item) => (
                <button
                  key={item.id}
                  className="nav-btn"
                  aria-current={screen.id === item.id ? "page" : undefined}
                  onClick={() => open(item.id)}
                >
                  {item.label}
                </button>
              ))}
          </div>
        ))}
        <p className="quiet" style={{ marginTop: 28 }}>
          The Site group is the setuHome landing page. Desktop and Mobile are the pages to build. The other two desktops are earlier cuts. “Your focus” waits for a customer yes or no. The work order is in ISSUES.md.
        </p>
      </aside>
      <main className="stage">
        <div className={screen.frame === "desktop" ? "browser" : "phone"} aria-label={screen.label}>
          <iframe className="stitch-frame" title={screen.label} src={`/stitch/${screen.file}`} key={screen.file} />
        </div>
      </main>
    </div>
  );
}
