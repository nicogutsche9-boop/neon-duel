"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Swords,
  Trophy,
  ShoppingBag,
  UserRound,
  Target,
  Coins,
  Flame,
  ChevronRight,
  Zap,
  Shield,
  Sparkles,
  RotateCcw
} from "lucide-react";

type Tab =
  | "home"
  | "play"
  | "shop"
  | "profile";

type Item = {
  id: string;
  name: string;
  type: string;
  price: number;
  rarity: string;
  owned: boolean;
};

const starterItems: Item[] = [
  {
    id: "void",
    name: "VOID RUNNER",
    type: "Skin",
    price: 1200,
    rarity: "EPIC",
    owned: true
  },
  {
    id: "plasma",
    name: "PLASMA TRAIL",
    type: "Trail",
    price: 800,
    rarity: "RARE",
    owned: false
  },
  {
    id: "crown",
    name: "CYBER CROWN",
    type: "Frame",
    price: 2000,
    rarity: "LEGENDARY",
    owned: false
  },
  {
    id: "pulse",
    name: "PULSE CORE",
    type: "Skin",
    price: 950,
    rarity: "RARE",
    owned: false
  },
  {
    id: "ghost",
    name: "GHOST SIGNAL",
    type: "Emote",
    price: 500,
    rarity: "COMMON",
    owned: false
  },
  {
    id: "neon",
    name: "NEON GRID",
    type: "Theme",
    price: 1500,
    rarity: "EPIC",
    owned: false
  }
];

const daily = [
  {
    id: "win",
    title: "Win 3 Duels",
    reward: 350,
    goal: 3
  },
  {
    id: "score",
    title: "Score 1,500 points",
    reward: 250,
    goal: 1500
  },
  {
    id: "play",
    title: "Play 5 rounds",
    reward: 200,
    goal: 5
  }
];

export default function Home() {
  const [tab, setTab] =
    useState<Tab>("home");

  const [coins, setCoins] =
    useState(2450);

  const [score, setScore] =
    useState(1240);

  const [best, setBest] =
    useState(4820);

  const [wins, setWins] =
    useState(183);

  const [items, setItems] =
    useState(starterItems);

  const [progress, setProgress] =
    useState({
      win: 2,
      score: 420,
      play: 3
    });

  const [energy, setEnergy] =
    useState(100);

  const [time, setTime] =
    useState(60);

  const [running, setRunning] =
    useState(false);

  const [message, setMessage] =
    useState("READY");

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "neon-duel"
      );

    if (!saved) return;

    try {
      const data =
        JSON.parse(saved);

      if (
        typeof data.coins ===
        "number"
      ) {
        setCoins(data.coins);
      }

      if (
        typeof data.best ===
        "number"
      ) {
        setBest(data.best);
      }

      if (
        typeof data.wins ===
        "number"
      ) {
        setWins(data.wins);
      }

      if (data.items) {
        setItems(data.items);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "neon-duel",
      JSON.stringify({
        coins,
        best,
        wins,
        items
      })
    );
  }, [
    coins,
    best,
    wins,
    items
  ]);

  useEffect(() => {
    if (!running) return;

    if (time <= 0) {
      setRunning(false);

      const won =
        score > 1500;

      if (score > best) {
        setBest(score);
      }

      if (won) {
        setWins(
          value => value + 1
        );
      }

      setCoins(
        value =>
          value +
          (won ? 150 : 50)
      );

      setMessage(
        won
          ? "VICTORY +150 🪙"
          : "ROUND OVER +50 🪙"
      );

      return;
    }

    const timer =
      setInterval(() => {
        setTime(
          value => value - 1
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    running,
    time,
    score,
    best
  ]);

  const rank =
    useMemo(() => {
      if (score >= 5000)
        return "DIAMOND I";

      if (score >= 3500)
        return "PLATINUM II";

      if (score >= 2000)
        return "GOLD III";

      return "SILVER I";
    }, [score]);

  function startGame() {
    setTab("play");

    setScore(0);

    setTime(60);

    setEnergy(100);

    setMessage(
      "TAP THE CORE"
    );

    setRunning(true);

    setProgress(
      value => ({
        ...value,
        play: Math.min(
          5,
          value.play + 1
        )
      })
    );
  }

  function hit() {
    if (
      !running ||
      energy <= 0
    ) {
      return;
    }

    const gain =
      Math.floor(
        35 +
        Math.random() * 65
      );

    setScore(
      value => value + gain
    );

    setEnergy(
      value =>
        Math.max(
          0,
          value - 4
        )
    );

    setProgress(
      value => ({
        ...value,
        score: Math.min(
          1500,
          value.score + gain
        )
      })
    );

    setMessage(
      `+${gain} PERFECT HIT`
    );
  }

  function buy(item: Item) {
    if (item.owned)
      return;

    if (coins < item.price)
      return;

    setCoins(
      value =>
        value - item.price
    );

    setItems(
      value =>
        value.map(
          current =>
            current.id ===
            item.id
              ? {
                  ...current,
                  owned: true
                }
              : current
        )
    );

    setMessage(
      `${item.name} UNLOCKED`
    );
  }

  function claim(id: string) {
    const task =
      daily.find(
        item => item.id === id
      );

    if (!task) return;

    const current =
      progress[
        id as keyof typeof progress
      ];

    if (
      current < task.goal
    ) {
      return;
    }

    setCoins(
      value =>
        value + task.reward
    );

    setProgress(
      value => ({
        ...value,
        [id]: 0
      })
    );

    setMessage(
      `+${task.reward} 🪙 CLAIMED`
    );
  }

  return (
    <main className="app">

      <div className="noise" />

      <header className="topbar">

        <button
          className="logo"
          onClick={() =>
            setTab("home")
          }
        >
          NEON
          <span>DUEL</span>
        </button>

        <div className="wallet">

          <Coins size={16} />

          <b>
            {coins.toLocaleString(
              "de-DE"
            )}
          </b>

        </div>

      </header>

      <section className="content">

        {tab === "home" && (
          <>
            <div className="hero card">

              <div>

                <p className="eyebrow">

                  <Zap size={13} />

                  ARENA ONLINE

                </p>

                <h1>

                  READY TO
                  <br />

                  <span>
                    DUEL?
                  </span>

                </h1>

                <p className="muted">
                  60 Sekunden.
                  Maximale
                  Punktzahl.
                  Keine Gnade.
                </p>

                <button
                  className="primary"
                  onClick={
                    startGame
                  }
                >

                  <Swords
                    size={20}
                  />

                  SPIELEN

                  <ChevronRight />

                </button>

              </div>

              <div className="orb">

                <div className="orb-core">
                  ⚡
                </div>

              </div>

            </div>

            <div className="stats">

              <Stat
                icon={<Trophy />}
                label="RANG"
                value={rank}
              />

              <Stat
                icon={<Target />}
                label="SCORE"
                value={best.toLocaleString(
                  "de-DE"
                )}
              />

              <Stat
                icon={<Flame />}
                label="STREAK"
                value="7 TAGE"
              />

            </div>

            <div className="sectionHead">

              <h2>
                DAILY MISSIONS
              </h2>

              <span>
                DAILY
              </span>

            </div>

            <div className="missions">

              {daily.map(
                task => {

                  const value =
                    progress[
                      task.id as keyof typeof progress
                    ];

                  const percent =
                    Math.min(
                      100,
                      (value /
                        task.goal) *
                        100
                    );

                  return (
                    <div
                      className="mission card"
                      key={
                        task.id
                      }
                    >

                      <div className="missionIcon">
                        <Target />
                      </div>

                      <div className="missionBody">

                        <b>
                          {task.title}
                        </b>

                        <div className="bar">

                          <i
                            style={{
                              width:
                                `${percent}%`
                            }}
                          />

                        </div>

                        <small>
                          {value}
                          {" / "}
                          {task.goal}
                          {" · +"}
                          {task.reward}
                          {" 🪙"}
                        </small>

                      </div>

                      <button
                        className="claim"
                        disabled={
                          value <
                          task.goal
                        }
                        onClick={() =>
                          claim(
                            task.id
                          )
                        }
                      >
                        CLAIM
                      </button>

                    </div>
                  );
                }
              )}

            </div>
          </>
        )}

        {tab === "play" && (
          <div className="gameWrap">

            <div className="gameTop">

              <div>

                <small>
                  YOU
                </small>

                <strong>
                  {score.toLocaleString()}
                </strong>

              </div>

              <div className="timer">
                {String(
                  time
                ).padStart(2, "0")}
              </div>

              <div className="opponent">

                <small>
                  OPPONENT
                </small>

                <strong>
                  {(
                    Math.floor(
                      score * 0.86
                    ) + 680
                  ).toLocaleString()}
                </strong>

              </div>

            </div>

            <div
              className="arena card"
              onClick={hit}
            >

              <div className="scanlines" />

              <div className="crosshair">
                +
              </div>

              <div className="coreRing">

                <div className="tapCore">
                  ⚡
                </div>

              </div>

              <p>
                {message}
              </p>

              <small>
                TAP / CLICK THE CORE
              </small>

            </div>

            <div className="energy">

              <span>
                ENERGY
              </span>

              <div className="bar">

                <i
                  style={{
                    width:
                      `${energy}%`
                  }}
                />

              </div>

            </div>

            <button
              className="secondary"
              onClick={() => {
                setRunning(
                  false
                );

                setTab(
                  "home"
                );
              }}
            >

              <RotateCcw />

              ABORT ROUND

            </button>

          </div>
        )}

        {tab === "shop" && (
          <>

            <div className="pageTitle">

              <p className="eyebrow">

                <ShoppingBag
                  size={13}
                />

                COSMETICS

              </p>

              <h1>

                NEON
                <br />

                <span>
                  SHOP
                </span>

              </h1>

              <p className="muted">
                Nur kosmetisch.
                Dein Skill
                bleibt dein
                Vorteil.
              </p>

            </div>

            <div className="shopGrid">

              {items.map(
                item => (

                  <div
                    className={`item card ${
                      item.owned
                        ? "owned"
                        : ""
                    }`}
                    key={item.id}
                  >

                    <div className="itemVisual">

                      <Sparkles />

                      <span>
                        {item.type}
                      </span>

                    </div>

                    <small>
                      {item.rarity}
                    </small>

                    <h3>
                      {item.name}
                    </h3>

                    <button
                      className={
                        item.owned
                          ? "ownedBtn"
                          : "buy"
                      }
                      disabled={
                        item.owned ||
                        coins <
                          item.price
                      }
                      onClick={() =>
                        buy(item)
                      }
                    >
                      {item.owned
                        ? "OWNED"
                        : `${item.price.toLocaleString()} 🪙`}
                    </button>

                  </div>

                )
              )}

            </div>

          </>
        )}

        {tab === "profile" && (
          <div className="profile">

            <div className="avatar">
              ND
            </div>

            <p className="eyebrow">
              PLAYER PROFILE
            </p>

            <h1>
              NEON_PLAYER
            </h1>

            <p className="muted">
              Arena level 27
              · Member since
              today
            </p>

            <div className="profileStats">

              <Stat
                icon={<Trophy />}
                label="SIEGE"
                value={wins}
              />

              <Stat
                icon={<Target />}
                label="BEST"
                value={best}
              />

              <Stat
                icon={<Shield />}
                label="WINRATE"
                value="68%"
              />

            </div>

            <div className="card loadout">

              <h2>
                ACTIVE LOADOUT
              </h2>

              {items
                .filter(
                  item =>
                    item.owned
                )
                .slice(0, 3)
                .map(
                  item => (

                    <div
                      className="loadRow"
                      key={
                        item.id
                      }
                    >

                      <Sparkles />

                      <span>
                        {item.name}
                      </span>

                      <small>
                        {item.type}
                      </small>

                    </div>

                  )
                )}

            </div>

            <button
              className="secondary"
              onClick={() => {
                localStorage.removeItem(
                  "neon-duel"
                );

                location.reload();
              }}
            >
              RESET LOCAL DATA
            </button>

          </div>
        )}

      </section>

      <nav className="nav">

        <NavButton
          active={
            tab === "home"
          }
          icon={<Zap />}
          label="HOME"
          onClick={() =>
            setTab("home")
          }
        />

        <NavButton
          active={
            tab === "play"
          }
          icon={<Swords />}
          label="DUEL"
          onClick={
            startGame
          }
        />

        <NavButton
          active={
            tab === "shop"
          }
          icon={
            <ShoppingBag />
          }
          label="SHOP"
          onClick={() =>
            setTab("shop")
          }
        />

        <NavButton
          active={
            tab === "profile"
          }
          icon={
            <UserRound />
          }
          label="PROFILE"
          onClick={() =>
            setTab("profile")
          }
        />

      </nav>

    </main>
  );
}

function Stat({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="stat card">

      <div className="statIcon">
        {icon}
      </div>

      <small>
        {label}
      </small>

      <strong>
        {value}
      </strong>

    </div>
  );
}

function NavButton({
  active,
  icon,
  label,
  onClick
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={
        active
          ? "navBtn active"
          : "navBtn"
      }
      onClick={onClick}
    >

      {icon}

      <small>
        {label}
      </small>

    </button>
  );
}
