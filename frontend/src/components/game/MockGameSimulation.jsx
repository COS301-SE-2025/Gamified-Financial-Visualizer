// src/pages/game/MockGameSimulation.jsx
import React, { useEffect, useState } from "react";
import GameBoardViewer from "../game/GameBoardViewer";
import GameHUD from "../game/hud/GameHUD";
import HUDPortal from "../game/hud/HUDPortal";
import GameLobby from "../game/lobby/GameLobby";
import BoardTileModal from "./BoardTileModal";
import { BOARD_TILES, BOARD_ORDER } from "../../components/game/data/boardTiles";

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const currency = "R";
const HUMAN_ID = "p2"; // You control this player

// quick helpers
const net = (p) => (p.cash ?? 0) + (p.assetsValue ?? 0) - (p.loanBalance ?? 0);
const calcNet = net;

/* ---------------- Tile effects ---------------- */
function applyTileEffect(player, tile) {
  if (!tile || !tile.action) return { text: "Nothing happens.", delta: 0 };
  const a = tile.action;

  switch (a.type) {
    case "noop":
      return { text: "Nothing happens.", delta: 0 };

    case "move_to": {
      const targetIdx = BOARD_ORDER.indexOf(a.target);
      if (targetIdx >= 0) {
        player.pos = targetIdx;
        if (a.skipTurns) player.flags.skipTurn = (player.flags.skipTurn ?? 0) + a.skipTurns;
      }
      return { text: `Moved to ${BOARD_TILES[a.target]?.label}.`, delta: 0 };
    }

    case "earn": {
      const amt = a.amount ?? 0;
      player.cash += amt;
      return { text: `Earned ${currency}${amt.toLocaleString()} from ${tile.label}`, delta: +amt };
    }

    case "pay": {
      const amt = a.cost ?? 0;
      player.cash -= amt;
      return { text: `Paid ${currency}${amt.toLocaleString()} for ${tile.label}`, delta: -amt };
    }

    case "buy": {
      const cost = a.cost ?? 0;
      if (player.cash >= cost) {
        player.cash -= cost;
        player.assetsValue += Math.round(cost * 0.8);
        player.businesses.push(tile.id);
        return { text: `Bought ${tile.label} for ${currency}${cost.toLocaleString()}`, delta: -cost };
      }
      return { text: `Couldn't afford ${tile.label}`, delta: 0 };
    }

    case "pay_percent_salary": {
      const salary = player.salary ?? 2000;
      const cost = Math.round((a.percent ?? 0.15) * salary);
      player.cash -= cost;
      return { text: `Paid ${currency}${cost.toLocaleString()} tax`, delta: -cost };
    }

    case "advance_roll":
      player.flags.extraRoll = true;
      return { text: `Advance roll from ${tile.label}!`, delta: 0 };

    case "random_payout": {
      const amt = randInt(a.min ?? 100, a.max ?? 2500);
      player.cash += amt;
      return { text: `Random payout ${currency}${amt.toLocaleString()}`, delta: +amt };
    }

    case "stock_random": {
      const amt = randInt(a.min ?? -1500, a.max ?? 3000);
      player.cash += amt;
      return {
        text: `Stock swing ${amt >= 0 ? "up" : "down"} ${currency}${Math.abs(amt).toLocaleString()}`,
        delta: amt,
      };
    }

    case "halve_salary":
      player.flags.halfSalary = 1;
      return { text: "Salary halved next payout", delta: 0 };

    case "reduce_business_income_one_round":
      player.flags.reduceBusiness = 1;
      return { text: "Business income reduced this round", delta: 0 };

    case "skip_business_payments_one_round":
      player.flags.skipBizPayments = 1;
      return { text: "Skip business payments this round", delta: 0 };

    case "skip_turn":
      player.flags.skipTurn = 1;
      return { text: "Skipping next turn", delta: 0 };

    // NOTE: This adds a card to the human inventory (right-side drawer).
    case "insurance_then_draw_community": {
      const invest = a.invest ?? 500;
      player.cash -= invest;
      player.inventory.insurance = true;
      (player.inventory.cards ||= []).push({
        deck: "Community",
        title: "Community Bonus",
        desc: "Small stipend",
        effect: "+R500",
      });
      return { text: `Insurance purchased (${currency}${invest}) & drew a community card`, delta: -invest };
    }

    default:
      return { text: `Landed on ${tile.label}`, delta: 0 };
  }
}

/* ---------------- Results ---------------- */
function Results({ players, restart }) {
  const sorted = [...players].sort((a, b) => calcNet(b) - calcNet(a));
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto space-y-6 bg-white p-8 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center text-sky-700">Game Results</h1>
        <p className="text-gray-600 text-center">Leaderboard after 5 laps each.</p>
        <div className="rounded-3xl overflow-hidden border bg-white shadow">
          <table className="w-full">
            <thead className="bg-sky-100">
              <tr>
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">Player</th>
                <th className="text-left p-3">Laps</th>
                <th className="text-right p-3">Cash</th>
                <th className="text-right p-3">Assets</th>
                <th className="text-right p-3">Loans</th>
                <th className="text-right p-3">Businesses</th>
                <th className="text-right p-3">Net Worth</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={p.id} className={`${i === 0 ? "bg-amber-50 font-bold" : "odd:bg-gray-50"}`}>
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.laps}</td>
                  <td className="p-3 text-right">
                    {currency}
                    {p.cash.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    {currency}
                    {p.assetsValue.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-rose-600">
                    {currency}
                    {p.loanBalance.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">{p.businesses.length}</td>
                  <td className="p-3 text-right font-bold">
                    {currency}
                    {calcNet(p).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center">
          <button
            onClick={restart}
            className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Main ---------------- */
export default function MockGameSimulation() {
  const [phase, setPhase] = useState("playing");
  const [settings, setSettings] = useState({ players: 4, laps: 5 });
  const [movingKey, setMovingKey] = useState(null);

  const [players, setPlayers] = useState(() => [
    {
      id: "p1",
      name: "lily_rose",
      characterKey: "Green_girl",
      pos: 0,
      laps: 0,
      cash: 6000,
      assetsValue: 1500,
      loanBalance: 500,
      salary: 2000,
      businesses: [],
      flags: {},
      inventory: { cards: [] },
    },
    {
      id: "p2",
      name: "kevin_park",
      characterKey: "Cowboy",
      pos: 0,
      laps: 0,
      cash: 5000,
      assetsValue: 2000,
      loanBalance: 1000,
      salary: 2200,
      businesses: [],
      flags: {},
      inventory: { cards: [] },
    },
    {
      id: "p3",
      name: "nile_waters",
      characterKey: "Mr_suit",
      pos: 0,
      laps: 0,
      cash: 7000,
      assetsValue: 1200,
      loanBalance: 0,
      salary: 1800,
      businesses: [],
      flags: {},
      inventory: { cards: [] },
    },
    {
      id: "p4",
      name: "man_person",
      characterKey: "Kimono_girl",
      pos: 0,
      laps: 0,
      cash: 5500,
      assetsValue: 1800,
      loanBalance: 800,
      salary: 2100,
      businesses: [],
      flags: {},
      inventory: { cards: [] },
    },
  ]);

  const [log, setLog] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [dice, setDice] = useState(null);
  const [showDiceToast, setShowDiceToast] = useState(false);
  const [tilePopup, setTilePopup] = useState({ open: false, data: null });

  const everyoneDone = players.every((p) => p.laps >= settings.laps);
  const active = players[activeIdx];
  const isHumanTurn = active.id === HUMAN_ID;

  const nextIndex = (i) => (i + 1) % settings.players;

  // Roll + move (shared by human & bots)
  const doRollAndMove = (p, base) => {
    let roll = base ?? randInt(1, 6);
    if (p.businesses.length >= 2 && Math.random() < 0.5) roll += 1;

    const oldPos = p.pos;
    const newPos = (p.pos + roll) % BOARD_ORDER.length;
    p.pos = newPos;

    if (oldPos + roll >= BOARD_ORDER.length) {
      p.laps += 1;
      let gain = p.salary;
      if (p.flags.halfSalary) {
        gain = Math.floor(gain / 2);
        p.flags.halfSalary = 0;
      }
      p.cash += gain;
      setLog((l) => [`${p.name} completed a lap (+${currency}${gain.toLocaleString()} salary).`, ...l]);
    }

    const tileId = BOARD_ORDER[newPos];
    const tile = BOARD_TILES[tileId];
    const res = applyTileEffect(p, tile);
    setLog((l) => [`${p.name} rolled ${roll} → ${tile?.label}. ${res.text}`, ...l]);

    if (!p.flags.skipBizPayments && p.businesses.length) {
      let income = 300 * p.businesses.length;
      if (p.flags.reduceBusiness) {
        income = Math.floor(income / 2);
        p.flags.reduceBusiness = 0;
      }
      p.cash += income;
      setLog((l) => [`${p.name} earned ${currency}${income.toLocaleString()} from businesses.`, ...l]);
    }
    if (p.flags.skipBizPayments) p.flags.skipBizPayments = 0;

    return { roll, tile };
  };

  /* ---------- Human turn ---------- */
  const handleHumanRoll = () => {
    if (!isHumanTurn || everyoneDone) return;

    const r = randInt(1, 6);
    setDice(r);
    setShowDiceToast(true);
    setTimeout(() => setShowDiceToast(false), 1600);

    setPlayers((prev) => {
      // deep-ish copy so inventory arrays are not mutated directly
      const ps = prev.map((p) => ({
        ...p,
        flags: { ...p.flags },
        inventory: { ...p.inventory, cards: [...(p.inventory?.cards || [])] },
      }));
      const me = ps[activeIdx];
      const { tile } = doRollAndMove(me, r);

      // Human sees tile modal only
      setTilePopup({ open: true, data: tile });

      if (me.flags.extraRoll) {
        me.flags.extraRoll = 0;
        return ps;
      }
      setActiveIdx(nextIndex(activeIdx));
      return ps;
    });
  };

  /* ---------- Bot autoplay (no popups) ---------- */
  useEffect(() => {
    if (phase !== "playing" || everyoneDone) return;
    if (isHumanTurn) return;

    const t = setTimeout(() => {
      setPlayers((prev) => {
        const ps = prev.map((p) => ({
          ...p,
          flags: { ...p.flags },
          inventory: { ...p.inventory, cards: [...(p.inventory?.cards || [])] },
        }));
        const bot = ps[activeIdx];

        if (bot.flags.skipTurn) {
          bot.flags.skipTurn = 0;
          setActiveIdx(nextIndex(activeIdx));
          return ps;
        }

        doRollAndMove(bot, randInt(1, 6));
        if (bot.flags.extraRoll) {
          bot.flags.extraRoll = 0;
          return ps;
        }

        setActiveIdx(nextIndex(activeIdx));
        return ps;
      });
    }, 700);

    return () => clearTimeout(t);
  }, [phase, activeIdx, isHumanTurn, everyoneDone, settings.players]);

  // Go to results when everyone finished
  useEffect(() => {
    if (phase === "playing" && everyoneDone) {
      const t = setTimeout(() => setPhase("results"), 600);
      return () => clearTimeout(t);
    }
  }, [phase, everyoneDone]);

  // Optional lobby support (prevents the undefined function crash)
  const startFromLobby = ({ laps = 5 }) => {
    setSettings((s) => ({ ...s, laps }));
    setPhase("playing");
  };

  const restart = () => {
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        pos: 0,
        laps: 0,
        cash: 6000,
        assetsValue: 1500,
        loanBalance: 500,
        businesses: [],
        flags: {},
        inventory: { cards: [] },
      }))
    );
    setActiveIdx(0);
    setDice(null);
    setPhase("playing");
  };

  /* ---------- Phase: lobby ---------- */
  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <GameLobby
          highestScore={12345}
          totalPoints={420}
          currentPlayers={[
            { id: "p1", name: "lily_rose", ready: true, characterKey: "Green_girl" },
            { id: "p2", name: "kevin_park", ready: true, characterKey: "Cowboy" },
            { id: "p3", name: "nile_waters", ready: true, characterKey: "Mr_suit" },
            { id: "p4", name: "man_person", ready: true, characterKey: "Kimono_girl" },
          ]}
          availableGames={[{ id: "r2", code: "MOCK", name: "Mock Demo Room", players: 4, maxPlayers: 4, laps: 5 }]}
          defaultPlayers={4}
          defaultLaps={5}
          onStart={startFromLobby}
          onRefreshGames={() =>
            Promise.resolve([{ id: "r2", code: "MOCK", name: "Mock Demo Room", players: 4, maxPlayers: 4, laps: 5 }])
          }
        />
      </div>
    );
  }

  /* ---------- Phase: results ---------- */
  if (phase === "results") return <Results players={players} restart={restart} />;

  /* ---------- Phase: playing ---------- */
  const pawns = players.map((p) => ({ key: p.id, character: p.characterKey, index: p.pos }));
  const me = players.find((p) => p.id === HUMAN_ID) || players[0];
  const myNet = calcNet(me);
  const myTileLabel = BOARD_TILES[BOARD_ORDER[me.pos]]?.label ?? "—";

  // footer list for HUDs that still expect it
  const playersSummary = players.map((p) => ({
    id: p.id,
    name: p.name,
    laps: p.laps,
    cash: p.cash,
    position: p.pos,
  }));

  return (
    <div className="relative min-h-screen">
      {/* 3D board */}
      <div className="h-[72vh]">
        <GameBoardViewer
          selectedCharacter={players[activeIdx].characterKey}
          pawns={pawns}
          movingKey={movingKey}
          showLocalUI={false}
        />
      </div>

      {/* HUD */}
      <HUDPortal>
        <GameHUD
          /* Top strip */
          playerName={me.name}
          playerNumber={players.findIndex((p) => p.id === HUMAN_ID) + 1}
          currency={currency}
          netWorth={myNet}
          businesses={me.businesses.length}
          timePlaying={"demo"}
          goalLaps={me.laps}
          totalLaps={settings.laps}
          salary={me.salary}
          /* Current tile labels */
          currentBusiness={BOARD_TILES[BOARD_ORDER[me.pos]]?.label ?? "—"}
          currentTileLabel={myTileLabel}
          /* Controls */
          onRoll={handleHumanRoll}
          canRoll={isHumanTurn}
          /* Balance sheet */
          cardsCount={(me.inventory.cards || []).length}
          businessWorth={me.assetsValue}
          loanBalance={me.loanBalance}
          assetsValue={me.assetsValue}
          /* Inventory drawer */
          inventoryCards={me.inventory.cards}
          /* Footer (legacy) */
          playersSummary={playersSummary}
          activePlayerId={players[activeIdx].id}
          /* Dice toast */
          diceToast={showDiceToast ? dice : null}
        />
      </HUDPortal>

      {/* Human-only tile modal */}
      <BoardTileModal
        open={tilePopup.open}
        data={tilePopup.data}
        onClose={() => setTilePopup({ open: false, data: null })}
        onAction={() => setTilePopup({ open: false, data: null })}
      />
    </div>
  );
}
