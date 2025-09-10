import React from 'react'

/* ----------------------------- Image imports ----------------------------- */
import imgBusiness       from '../../../assets/hud/Business Card.png'
import imgBuy        from '../../../assets/hud/Business Card.png'
import imgLoan       from '../../../assets/hud/Business Card.png'
import imgRepay      from '../../../assets/hud/Business Card.png'
import imgDraw       from '../../../assets/hud/Business Card.png'
import imgBank       from '../../../assets/hud/Business Card.png'
import imgOverview   from '../../../assets/hud/Business Card.png'
import imgExplore    from '../../../assets/hud/Business Card.png'

import imgCash       from '../../../assets/hud/Business Card.png'
import imgFlag       from '../../../assets/hud/Business Card.png'
import imgAssets     from '../../../assets/hud/Business Card.png'
import imgLoans      from '../../../assets/hud/Business Card.png'
import imgClock      from '../../../assets/hud/Business Card.png'

import imgInventory  from '../../../assets/hud/Business Card.png'

// --- Card art (right panel + popup) ---
import artBusiness   from '../../../assets/hud/Business Card.png'
import artChance     from '../../../assets/hud/Chance Card.png'
import artCommunity  from '../../../assets/hud/Community Card.png'


/* Small helper for consistent icon images */
function IconImg({ src, alt = '', className = 'w-5 h-5' }) {
  return <img src={src} alt={alt} className={`inline-block object-contain ${className}`} aria-hidden="true" />
}

function getCardArt({ tile, card }) {
  // Priority: explicit deck in popup, otherwise infer from tile type
  if (card?.type === 'deck') {
    if (card.deck === 'Chance') return artChance
    return artCommunity // default deck art if not chance
  }
  if (tile?.type === 'business') return artBusiness
  if (tile?.type === 'card') return artChance // generic when landing on a card tile
  return null
}


export default function GameHUD({
  currency = 'R',

  // --- Turn / totals ---
  turn = { name: 'Sam', cash: 5200, assetValue: 6300, loanBalance: 1500, laps: 2, timer: 20 },
  netWorth,
  mode = { type: 'laps', target: 12 }, // or { type:'networth', target: 50000 }

  // --- Current tile (always visible as a badge) ---
  tile = {
    id: 'Quantum_Business',
    type: 'business',              // business | fee | bank | loan_shark | card | start
    title: 'Quantum Circuit',
    subtitle: 'Business — Software',
    price: 3000,
    incomePerLap: 300,
    fee: null,
  },

  // --- Context panel on right (optional extra info/actions) ---
  context = null, // if null we’ll mirror "tile"

  // --- Card popup (shows when you draw or land on a tile that requires a resolution) ---
  showCard = false,
  card = {
    type: 'deck',                  // deck | tile
    deck: 'Chance',                // Chance | Community (when type === 'deck')
    title: 'Big Recession',
    body: 'Salary payout reduced this round.',
    delta: -3000,
  },
  onResolveCard = () => {},

  // --- Actions (left rail) ---
  onAction = () => {},
  disabled = {},

  // --- Players ribbon ---
  players = [
    { id: 'p1', name: 'Alex', cash: 4200, assetValue: 3000, loanBalance: 0, piece: '🚗' },
    { id: 'p2', name: 'Sam', cash: 5200, assetValue: 6300, loanBalance: 1500, piece: '🐶', active: true },
    { id: 'p3', name: 'Charlie', cash: 1900, assetValue: 800, loanBalance: 500, piece: '🛶' },
  ],

  // --- Inventory pill ---
  inventorySummary = { insurance: true, getOutOfBankruptcy: false, cards: 1 },
}) {
  const computedNetWorth = (turn.cash ?? 0) + (turn.assetValue ?? 0) - (turn.loanBalance ?? 0)
  const _netWorth = typeof netWorth === 'number' ? netWorth : computedNetWorth
  const modeLabel =
    mode?.type === 'networth'
      ? `Goal: Net Worth ≥ ${currency}${Number(mode.target || 0).toLocaleString()}`
      : `Goal: ${Number(mode?.target || 0)} Laps`

  const actions = [
    { id: 'roll',    label: 'Roll Dice',  img: imgBusiness },
    { id: 'buy',     label: 'Buy Asset',  img: imgBuy,    accent: 'bg-emerald-600 text-white', disabled: disabled.buy || !(tile?.type === 'business') },
    { id: 'loan',    label: 'Take Loan',  img: imgLoan,   disabled: disabled.loan },
    { id: 'repay',   label: 'Repay Loan', img: imgRepay,  disabled: disabled.repay || (turn.loanBalance ?? 0) <= 0 },
    { id: 'draw',    label: 'Draw Card',  img: imgDraw,   disabled: disabled.draw || !(tile?.type === 'card') },
    { id: 'bank',    label: 'Visit Bank', img: imgBank,   disabled: disabled.bank || !(tile?.type === 'bank' || tile?.type === 'loan_shark') },
    { id: 'overview',label: 'Board Overview', img: imgOverview },
    { id: 'explore', label: 'Explore',    img: imgExplore, hotkey: 'C' },
  ]

  const info = context || tile || {}
  const tileHeaderColor = {
    business: 'bg-sky-50',
    bank: 'bg-amber-50',
    loan_shark: 'bg-rose-50',
    fee: 'bg-lime-50',
    start: 'bg-emerald-50',
    card: 'bg-indigo-50',
  }[info.type || 'business']

  return (
    <>
      {/* ===== Top strip + tiny tile badge ===== */}
      <div className="pointer-events-auto fixed top-4 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="flex items-center gap-6 px-5 py-2 rounded-2xl bg-white/95 dark:bg-gray-900/90 border shadow">
          <div className="font-bold">Turn: {turn.name}</div>

          <div className="flex items-center gap-2">
            <IconImg src={imgCash} alt="Cash" />
            <span>Cash: {currency}{Number(turn.cash ?? 0).toLocaleString()}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <IconImg src={imgFlag} alt="Net Worth" />
            <span>Net Worth: {currency}{Number(_netWorth).toLocaleString()}</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <IconImg src={imgAssets} alt="Assets" />
            <span>Assets: {currency}{Number(turn.assetValue ?? 0).toLocaleString()}</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <IconImg src={imgLoans} alt="Loans" />
            <span>Loans: {currency}{Number(turn.loanBalance ?? 0).toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <IconImg src={imgClock} alt="Timer" />
            <span>{turn.timer}s</span>
          </div>

          <div className="ml-2 text-xs text-gray-600 dark:text-gray-300">{modeLabel}</div>
        </div>

        {/* Tile badge */}
        {tile?.title && (
          <div className="mt-2 mx-auto w-max px-3 py-1 rounded-xl border bg-white/95 dark:bg-gray-900/90 shadow text-xs text-gray-700 dark:text-gray-200">
            <span className="font-semibold">{tile.title}</span>
            {tile.subtitle ? <span className="opacity-70"> — {tile.subtitle}</span> : null}
          </div>
        )}
      </div>

      {/* ===== Left action rail ===== */}
      <div className="pointer-events-auto fixed bottom-44 left-6 z-[1000]">
        <div className="space-y-2">
          {actions.map((a) => {
            const base = 'flex items-center gap-3 px-4 py-2 rounded-2xl border shadow text-gray-800 dark:text-gray-100 bg-white/95 dark:bg-gray-900/90'
            const state = a.disabled ? 'opacity-50 cursor-not-allowed' : 'border-black/10 hover:bg-black/5 dark:hover:bg-white/10'
            return (
              <button
                key={a.id}
                disabled={a.disabled}
                onClick={() => !a.disabled && onAction(a.id)}
                className={`${base} ${a.accent || ''} ${a.accent ? '' : state}`}
              >
                <IconImg src={a.img} alt="" />
                <span className="font-semibold">{a.label}</span>
                {a.hotkey && (
                  <span className="ml-auto text-[11px] bg-white/80 dark:bg-gray-800/80 border px-1.5 py-0.5 rounded">
                    {a.hotkey}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ===== Right stack: Balance Sheet + Tile/Context ===== */}
      <div className="pointer-events-auto fixed bottom-32 right-6 z-[1000] w-[360px] space-y-3">
        {/* Balance Sheet */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white">
          <div className="px-4 py-2 bg-emerald-50 border-b text-gray-800">
            <div className="text-sm font-extrabold tracking-wide">Balance Sheet</div>
          </div>
          <div className="p-4 bg-[#f6f7f8]">
            <Row k="Cash" v={`${currency}${Number(turn.cash ?? 0).toLocaleString()}`} />
            <Row k="Assets Value" v={`${currency}${Number(turn.assetValue ?? 0).toLocaleString()}`} />
            <Row k="Loan Balance" v={`${currency}${Number(turn.loanBalance ?? 0).toLocaleString()}`} />
            <div className="mt-3 border-t pt-2 flex items-center justify-between text-sm">
              <span className="text-gray-500">Net Worth</span>
              <span className="font-extrabold">{currency}{Number(_netWorth).toLocaleString()}</span>
            </div>
            <div className="mt-2 text-xs text-gray-600 flex items-center justify-between">
              <span>Laps: {Number(turn.laps ?? 0)}</span>
              <span>{modeLabel}</span>
            </div>
          </div>
        </div>

        {/* Tile/Context Panel */}
        {info?.type && (
          <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white">
            <div className={`px-4 py-2 ${tileHeaderColor} border-b text-gray-800`}>
              <div className="text-sm font-extrabold tracking-wide">{info.title}</div>
              {info.subtitle && <div className="text-[11px] text-gray-600">{info.subtitle}</div>}
            </div>
            <div className="p-4 bg-[#f6f3ea] text-sm space-y-2">
              {info.type === 'business' && (
                <>
                  <Row k="Price" v={`${currency}${Number(info.price || 0).toLocaleString()}`} />
                  <Row k="Income / Lap" v={`${currency}${Number(info.incomePerLap || 0).toLocaleString()}`} />
                  <button
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border shadow-sm bg-emerald-600 text-white"
                    onClick={() => onAction('buy')}
                  >
                    <IconImg src={imgBuy} alt="" className="w-4 h-4" />
                    Buy for {currency}{Number(info.price || 0).toLocaleString()}
                  </button>
                </>
              )}

              {info.type === 'fee' && (
                <>
                  <Row k="Fee Due" v={`${currency}${Number(info.fee || 0).toLocaleString()}`} />
                  <button className="w-full px-3 py-2 rounded-xl border hover:bg-black/5" onClick={() => onAction('pay')}>
                    Pay Now
                  </button>
                </>
              )}

              {(info.type === 'bank' || info.type === 'loan_shark') && (
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 rounded-xl border hover:bg-black/5 inline-flex items-center justify-center gap-2"
                          onClick={() => onAction('loan')}>
                    <IconImg src={imgLoan} alt="" className="w-4 h-4" /> Loan
                  </button>
                  <button className="px-3 py-2 rounded-xl border hover:bg-black/5 inline-flex items-center justify-center gap-2"
                          onClick={() => onAction('repay')} disabled={(turn.loanBalance ?? 0) <= 0}>
                    <IconImg src={imgRepay} alt="" className="w-4 h-4" /> Repay
                  </button>
                </div>
              )}

              {info.type === 'card' && (
                <button className="w-full px-3 py-2 rounded-xl border hover:bg-black/5 inline-flex items-center justify-center gap-2"
                        onClick={() => onAction('draw')}>
                  <IconImg src={imgDraw} alt="" className="w-4 h-4" /> Draw a card
                </button>
              )}

              {info.type === 'start' && (
                <div className="text-gray-700">Collect salary when passing this tile.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===== Bottom player ribbon ===== */}
      <div className="pointer-events-auto fixed bottom-3 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="flex items-end gap-4">
          {players.map((p) => {
            const pNet = (p.cash ?? 0) + (p.assetValue ?? 0) - (p.loanBalance ?? 0)
            return (
              <div key={p.id}
                   className={`px-4 py-2 rounded-2xl border shadow bg-white/95 dark:bg-gray-900/90 ${p.active ? 'ring-4 ring-indigo-400' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="text-2xl leading-none">{p.piece}</div>
                  <div>
                    <div className={`font-extrabold ${p.active ? 'text-indigo-700 dark:text-indigo-300' : ''}`}>{p.name}</div>
                    <div className="text-[13px] text-gray-600 dark:text-gray-300">
                      Cash {currency}{Number(p.cash ?? 0).toLocaleString()} · Net {currency}{Number(pNet).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ===== Inventory pill ===== */}
      <div className="pointer-events-auto fixed top-4 right-6 z-[1000]">
        <button className="px-3 py-2 rounded-xl border bg-white/95 dark:bg-gray-900/90 shadow text-sm hover:bg-black/5"
                onClick={() => onAction('inventory')}
                title="Open inventory">
          <span className="inline-flex items-center gap-2">
            <IconImg src={imgInventory} alt="" />
            Inventory
          </span>
          <span className="ml-2 text-xs text-gray-600">
            {inventorySummary.insurance ? '• Insurance' : ''}
            {inventorySummary.getOutOfBankruptcy ? ' • G.O.O.B' : ''}
            {inventorySummary.cards ? ` • ${inventorySummary.cards} card${inventorySummary.cards > 1 ? 's' : ''}` : ''}
          </span>
        </button>
      </div>

      {/* ===== Card Popup (deck or tile mirror) ===== */}
      {showCard && (
        <div className="fixed inset-0 z-[1100] grid place-items-center bg-black/50">
          <div className="w-[420px] rounded-2xl overflow-hidden shadow-2xl border bg-white">
            {/* header */}
            <div className={`px-4 py-2 ${card.type === 'deck'
              ? (card.deck === 'Chance' ? 'bg-amber-50' : 'bg-rose-50')
              : tileHeaderColor} border-b`}>
              <div className="text-sm font-extrabold tracking-wide">
                {card.type === 'deck' ? `${card.deck} Card` : `${tile?.title || 'Tile'}`}
              </div>
              {card.type !== 'deck' && tile?.subtitle && (
                <div className="text-[11px] text-gray-600">{tile.subtitle}</div>
              )}
            </div>

            {/* body */}
            <div className="p-4 bg-[#f7f7f7] space-y-3 text-sm">
              {card.type === 'deck' ? (
                <>
                  <div className="font-bold text-gray-800">{card.title}</div>
                  {card.body && <p className="text-gray-700">{card.body}</p>}
                  {typeof card.delta === 'number' && (
                    <div className={`mt-1 text-sm font-semibold ${card.delta >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {card.delta >= 0 ? '+' : ''}{currency}{Math.abs(card.delta).toLocaleString()}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {tile?.type === 'business' && (
                    <>
                      <Row k="Price" v={`${currency}${Number(tile.price || 0).toLocaleString()}`} />
                      <Row k="Income / Lap" v={`${currency}${Number(tile.incomePerLap || 0).toLocaleString()}`} />
                    </>
                  )}
                  {tile?.type === 'fee' && <Row k="Fee" v={`${currency}${Number(tile.fee || 0).toLocaleString()}`} />}
                  {tile?.type === 'start' && <div>Collect salary when passing.</div>}
                  {(tile?.type === 'bank' || tile?.type === 'loan_shark') && <div>Banking actions available.</div>}
                </>
              )}
            </div>

            {/* footer buttons */}
            <div className="p-3 bg-white border-t flex gap-2 justify-end">
              {card.type === 'deck' ? (
                <button className="px-3 py-2 rounded-lg border hover:bg-black/5" onClick={() => onResolveCard('ok')}>OK</button>
              ) : (
                <>
                  {tile?.type === 'business' && (
                    <button className="px-3 py-2 rounded-lg border bg-emerald-600 text-white"
                            onClick={() => onResolveCard('buy')}>
                      Buy
                    </button>
                  )}
                  {tile?.type === 'fee' && (
                    <button className="px-3 py-2 rounded-lg border"
                            onClick={() => onResolveCard('pay')}>
                      Pay
                    </button>
                  )}
                  {(tile?.type === 'bank' || tile?.type === 'loan_shark') && (
                    <>
                      <button className="px-3 py-2 rounded-lg border"
                              onClick={() => onResolveCard('loan')}>Loan</button>
                      <button className="px-3 py-2 rounded-lg border"
                              onClick={() => onResolveCard('repay')}>Repay</button>
                    </>
                  )}
                  <button className="px-3 py-2 rounded-lg border hover:bg-black/5" onClick={() => onResolveCard('close')}>Close</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* tiny helper */
function Row({ k, v }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-gray-600">{k}</span>
      <span className="font-semibold text-gray-800">{v}</span>
    </div>
  )
}
