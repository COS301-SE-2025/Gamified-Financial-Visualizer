// src/components/game/hud/HUDPortal.jsx
import { createPortal } from 'react-dom'
export default function HUDPortal({ children, target = '#hud-root' }) {
  if (typeof document === 'undefined') return null
  const el = document.querySelector(target) || document.body
  return createPortal(children, el)
}
