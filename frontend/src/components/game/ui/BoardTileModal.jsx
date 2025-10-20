import React from "react"
import { FaCoins, FaTimes } from "react-icons/fa"

/**
 * BoardTileModal
 * Uniform tooltip/modal for board tiles.
 * Works with objects from /game/boardTiles.js
 */

export default function BoardTileModal({ open, data, onClose, onAction }) {
  if (!open || !data) return null

  const hasAction = !!data.action
  const actionLabel =
    data.action?.label ||
    (data.type === "business" && data.cost ? `Buy for ${data.cost.toLocaleString()} Bucks` : "OK")

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      {/* Card */}
      <div className="relative z-10 w-[95%] max-w-[780px] rounded-3xl overflow-hidden shadow-2xl border border-black/10 bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-500 text-white px-5 py-3 flex items-center justify-between">
          <div className="text-lg font-extrabold tracking-wide">{data.label}</div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/15 hover:bg-white/25"
            aria-label="Close tooltip"
            title="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="bg-[#f6f3ea] p-5">
          <div className="grid gap-4 md:grid-cols-[260px_1fr]">
            {/* Image/Icon */}
            <div className="bg-white rounded-2xl border border-black/5 shadow p-3">
              <div className="h-44 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center">
                {data.image ? (
                  <img
                    src={data.image}
                    alt={data.label}
                    className="h-full w-full object-cover select-none"
                    draggable="false"
                  />
                ) : (
                  <div className="text-5xl text-gray-600">{data.icon}</div>
                )}
              </div>

              {/* Meta */}
              <div className="mt-3 text-[12px] text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold capitalize">{data.type || "tile"}</span>
                  {typeof data.cost === "number" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700">
                      <FaCoins /> {data.cost.toLocaleString()}
                    </span>
                  )}
                  {typeof data.amount === "number" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                      <FaCoins /> +{data.amount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Text + CTA */}
            <div className="space-y-4">
              <p className="text-sm text-gray-800 leading-relaxed">{data.description}</p>

              {typeof data.percent === "number" && (
                <div className="text-[13px] text-gray-600 bg-white rounded-xl border border-black/5 shadow px-3 py-2">
                  You will pay <span className="font-semibold">{Math.round(data.percent * 100)}%</span> of your current salary.
                </div>
              )}
              {data.action?.type?.includes?.("random") && (
                <div className="text-[13px] text-gray-600 bg-white rounded-xl border border-black/5 shadow px-3 py-2">
                  Random range:{" "}
                  <span className="font-semibold">
                    {data.action.min?.toLocaleString?.() ?? "-"} to {data.action.max?.toLocaleString?.() ?? "-"} Bucks
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
                {hasAction && (
                  <button
                    onClick={() => onAction?.(data)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow"
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
