import React from 'react';
import { calculateNet } from '../core';

export default function Results({ players = [], onRestart, onLobby }) {
  const sorted = [...players].sort((a, b) => calculateNet(b) - calculateNet(a));
  const winner = sorted[0];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto space-y-6 bg-white p-8 rounded-3xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Game Results</h1>
          {winner && (
            <p className="mt-2 text-lg">
              🏆 <strong>{winner.name}</strong> wins with net worth{' '}
              <strong>R{calculateNet(winner).toLocaleString()}</strong>
            </p>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-right">Cash</th>
                <th className="px-4 py-3 text-right">Assets</th>
                <th className="px-4 py-3 text-right">Loans</th>
                <th className="px-4 py-3 text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-right">R{(p.cash||0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">R{(p.assetsValue||0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">R{(p.loanBalance||0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-semibold">R{calculateNet(p).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={onRestart} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Play again</button>
          <button onClick={onLobby} className="px-4 py-2 rounded-xl border">Back to Lobby</button>
        </div>
      </div>
    </div>
  );
}
