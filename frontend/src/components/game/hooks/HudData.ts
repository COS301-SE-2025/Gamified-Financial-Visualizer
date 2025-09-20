import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type BalanceSheet = {
  cash: number;
  assetValue: number;
  debtValue: number;
  netWorth: number;
  lapsCompleted: number;
  salary: number;
};

type PositionItem = {
  id: number | string;
  name: string;
  position: number;
  laps: number;
  cash?: number;
  isBankrupt?: boolean;
};

type CardItem = {
  deck: 'Chance' | 'Community' | 'Business' | string;
  title: string;
  desc?: string;
};

type AssetItem = {
  id: string;
  name: string;
  type: 'business' | 'investment';
  purchasePrice: number;
  incomePerLap?: number;
  blockPosition?: number;
  sellbackMultiplier: number;
};

type GameStateLite = {
  id: string;
  gamePhase: 'waiting' | 'playing' | 'finished';
  currentPlayerId: number;
  gameMode: 'laps' | 'elimination';
  maxLaps?: number;
  players: Array<{
    id: number;
    username: string;
    position: number;
    cash: number;
    lapsCompleted: number;
    salary: number;
    isActive: boolean;
    isBankrupt: boolean;
  }>;
  startedAt?: string;
  finishedAt?: string;
};

const API = (path: string) => `http://localhost:5000/api/game${path}`;

const getJSON = async (url: string, token: string) => {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Request failed');
  return data;
};

export function useHudData(gameId: string | null, socket?: any) {
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  }, []);
  const token: string | undefined = user?.token;
  const userId: number | undefined = user?.id;

  const [gameState, setGameState] = useState<GameStateLite | null>(null);
  const [balance, setBalance] = useState<BalanceSheet | null>(null);
  const [positions, setPositions] = useState<PositionItem[]>([]);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [businesses, setBusinesses] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [diceToast, setDiceToast] = useState<number | null>(null);
  const toastTimer = useRef<number | null>(null);

  const refreshGameState = useCallback(async () => {
    if (!gameId || !token) return;
    const data = await getJSON(API(`/state/${encodeURIComponent(gameId)}?user_id=${encodeURIComponent(user.id)}`),
    token);
    if (data.success) setGameState(data.gameState as GameStateLite);
  }, [gameId, token]);

  const refreshBalance = useCallback(async () => {
    if (!gameId || !userId || !token) return;
    const qs = `?gameId=${encodeURIComponent(gameId)}&user_id=${userId}`;
    const data = await getJSON(API(`/game/balance-sheet${qs}`), token);
    if (data.success) setBalance(data.balanceSheet as BalanceSheet);
  }, [gameId, userId, token]);

  const refreshPositions = useCallback(async () => {
    if (!gameId || !token) return;
    const qs = `?gameId=${encodeURIComponent(gameId)}`;
    const data = await getJSON(API(`/game/positions${qs}`), token);
    if (data.success) setPositions(data.players as PositionItem[]);
  }, [gameId, token]);

  const refreshCards = useCallback(async () => {
    if (!gameId || !userId || !token) return;
    const qs = `?gameId=${encodeURIComponent(gameId)}&user_id=${userId}`;
    const data = await getJSON(API(`/game/cards${qs}`), token);
    if (data.success) setCards((data.cards || []) as CardItem[]);
  }, [gameId, userId, token]);

  const refreshBusinesses = useCallback(async () => {
    if (!gameId || !userId || !token) return;
    const qs = `?gameId=${encodeURIComponent(gameId)}&user_id=${userId}`;
    const data = await getJSON(API(`/game/businesses${qs}`), token);
    if (data.success) setBusinesses((data.businesses || []) as AssetItem[]);
  }, [gameId, userId, token]);

  const refresh = useCallback(async () => {
    if (!gameId || !token) return;
    setLoading(true);
    try {
      await Promise.all([
        refreshGameState(),
        refreshBalance(),
        refreshPositions(),
        refreshCards(),
        refreshBusinesses(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [gameId, token, refreshGameState, refreshBalance, refreshPositions, refreshCards, refreshBusinesses]);

  // initial + whenever gameId changes
  useEffect(() => {
    if (!gameId || !token) return;
    refresh();
  }, [gameId, token, refresh]);

  // Socket-driven updates (optional but recommended)
  useEffect(() => {
    if (!socket || !gameId) return;

    const rerun = () => refresh();

    socket.on('game:player-moved', rerun);
    socket.on('game:turn-changed', rerun);
    socket.on('game:card-drawn', (payload: any) => {
      // show a tiny dice toast if card effect caused a roll-like move (optional)
      rerun();
    });
    socket.on('game:dice-rolled', (payload: { diceRoll: number }) => {
      setDiceToast(payload?.diceRoll ?? null);
      rerun();
      // auto-hide dice toast
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setDiceToast(null), 1500);
    });
    socket.on('asset-purchased', rerun);
    socket.on('asset-sold', rerun);
    socket.on('loan-taken', rerun);
    socket.on('player-bankrupt', rerun);
    socket.on('game:ended', rerun);

    return () => {
      socket.off('game:player-moved', rerun);
      socket.off('game:turn-changed', rerun);
      socket.off('game:card-drawn', rerun);
      socket.off('game:dice-rolled');
      socket.off('asset-purchased', rerun);
      socket.off('asset-sold', rerun);
      socket.off('loan-taken', rerun);
      socket.off('player-bankrupt', rerun);
      socket.off('game:ended', rerun);

      if (toastTimer.current) {
        window.clearTimeout(toastTimer.current);
        toastTimer.current = null;
      }
    };
  }, [socket, gameId, refresh]);

  // Derived HUD props
  const you = useMemo(() => {
    if (!gameState || !userId) return null;
    return gameState.players.find(p => p.id === userId) || null;
  }, [gameState, userId]);

  const playersSummary = useMemo(() => {
    if (!positions || !gameState) return [];
    // merge positions + current cash from state (fallback if missing)
    const idToCash = new Map(gameState.players.map(p => [p.id, p.cash]));
    return positions.map(p => ({
      id: p.id,
      name: p.name,
      laps: p.laps,
      position: p.position,
      cash: p.cash ?? idToCash.get(Number(p.id)) ?? 0,
      isBankrupt: p.isBankrupt ?? false,
    }));
  }, [positions, gameState]);

  // Helpers for actions you might wire to the HUD buttons
  const rollDice = useCallback(() => {
    if (!socket || !gameId) return;
    socket.emit('game:roll-dice', { gameId });
  }, [socket, gameId]);

  const endTurn = useCallback(() => {
    if (!socket || !gameId) return;
    socket.emit('game:end-turn', { gameId });
  }, [socket, gameId]);

  // Map into GameHUD prop names
  const hud = useMemo(() => {
    const currency = 'R'; // adjust if you want per-locale
    const totalLaps = gameState?.maxLaps ?? 0;

    return {
      // top strip
      playerName: you?.username || '',
      currency,
      netWorth: balance?.netWorth ?? 0,
      businesses: businesses.length,
      timePlaying: '—', // you can compute from startedAt if you wish
      goalLaps: you?.lapsCompleted ?? 0,
      totalLaps,
      currentTileLabel: (() => {
        // if you want the name of the tile, you can fetch board from /state and map index->label
        return `#${you?.position ?? '–'}`;
      })(),

      // control
      canRoll: Boolean(gameState && you && gameState.currentPlayerId === you.id),

      // balance sheet
      salary: balance?.salary ?? 0,
      cardsCount: cards.length,
      businessWorth: businesses.reduce((sum, b) => sum + Math.floor(b.purchasePrice * (b.sellbackMultiplier ?? 1)), 0),
      loanBalance: balance?.debtValue ?? 0,
      assetsValue: balance?.assetValue ?? 0,

      // footer
      playersSummary,
      activePlayerId: gameState?.currentPlayerId ?? null,

      // drawer
      inventoryCards: cards,

      // dice toast
      diceToast,
    };
  }, [you, balance, businesses, cards, gameState, playersSummary, diceToast]);

  return {
    loading,
    hud,
    refresh,
    rollDice,
    endTurn,
    // raw pieces if you need them
    gameState,
    balance,
    positions,
    cards,
    businesses,
  };
}
