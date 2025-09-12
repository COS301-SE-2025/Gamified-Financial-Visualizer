import React, { useState } from 'react'
import GameLobby from './GameLobby'

const ME = { id: 'me', name: 'kevin_park', characterKey: 'Cowboy', ready: false }

export default function MockLobbyContainer() {
  const [me, setMe] = useState(ME)
  const [players, setPlayers] = useState([{ id: 'u1', name: 'lily_rose', ready: true, characterKey: 'Green_girl' }])
  const [rooms, setRooms] = useState([
    { id: 'r1', code: 'ABCD', name: 'Public Room', players: 2, maxPlayers: 6, laps: 10 },
    { id: 'r2', code: 'PQRS', name: 'Speed Run',  players: 4, maxPlayers: 4, laps: 5  },
  ])
  const [inRoom, setInRoom] = useState(null)

  const ensureMe = () => setPlayers(ps => ps.some(p => p.id === 'me') ? ps : [...ps, { ...me }])

  const onCreateRoom = ({ name, maxPlayers, laps, code }) => {
    const newRoom = { id: `r${Date.now()}`, code, name, players: 1, maxPlayers, laps }
    setRooms(rs => [newRoom, ...rs])
    setInRoom(code)
    ensureMe()
  }

  const onJoinWithCode = (code) => {
    const r = rooms.find(x => x.code === code)
    if (!r) { alert('Room not found'); return }
    setInRoom(code)
    ensureMe()
    setRooms(rs => rs.map(x => x.code === code ? { ...x, players: Math.min(x.players + 1, x.maxPlayers) } : x))
  }

  const onRefreshGames = () => new Promise(res => {
    setTimeout(() => {
      setRooms(rs => rs.map(r => ({ ...r, players: Math.max(0, Math.min(r.maxPlayers, r.players + (Math.random()<0.5?-1:1))) })))
      res(rooms)
    }, 600)
  })

  const onLeaveLobby = () => { setInRoom(null); setPlayers(ps => ps.filter(p => p.id !== 'me')) }
  const onLeaveGame  = onLeaveLobby

  const onSaveCharacter = (characterKey) => {
    setMe(m => ({ ...m, characterKey }))
    setPlayers(ps => ps.map(p => p.id === 'me' ? { ...p, characterKey } : p))
  }

  const onStart = (settings, characterKey) => {
    alert(`Starting mock game:\nMode: ${settings.mode}\nPlayers: ${settings.players}\nLaps: ${settings.laps}\nCharacter: ${characterKey}\nRoom: ${inRoom ?? 'solo'}`)
  }

  return (
    <GameLobby
      highestScore={12345}
      totalPoints={420}
      currentPlayers={players}
      availableGames={rooms}
      onCreateRoom={onCreateRoom}
      onJoinWithCode={onJoinWithCode}
      onRefreshGames={onRefreshGames}
      onLeaveLobby={onLeaveLobby}
      onLeaveGame={onLeaveGame}
      onSaveCharacter={onSaveCharacter}
      onStart={onStart}
    />
  )
}
