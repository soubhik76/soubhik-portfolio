import { createContext, useContext, useEffect, useState } from 'react'
import { LINKS } from '../data.js'

const KEY = 'sc-portfolio-settings-v1'

export const ACCENTS = {
  emerald: { label: 'Emerald', em: '#57b894', deep: '#1E6B54' },
  copper: { label: 'Copper', em: '#D29A73', deep: '#8A5A33' },
  violet: { label: 'Violet', em: '#A78BFA', deep: '#5B4BC4' },
}

export const SECTION_LABELS = {
  stack: 'Stack strip',
  work: 'Selected work',
  play: 'Playground games',
  trust: 'Trust widgets',
  how: 'Approach',
  where: 'Track record',
  quotes: 'Quote line',
}

export const DEFAULTS = {
  name: 'Soubhik Chakraborty',
  role: 'Data · Analytics · Automation',
  lede: "I build scalable systems and web applications from scratch, the kind of tech that moves business forward. At HRI my apps strengthened our IT posture, and my SAP plus Fabric pipelines earned Finance's trust. Constantly up for innovation.",
  location: 'Mumbai',
  availability: 'open to senior and lead roles',
  pipelineNote: '21/21 pipelines green',
  email: LINKS.email,
  linkedin: LINKS.linkedin,
  phone: LINKS.phone,
  resumeFile: 'Soubhik-Chakraborty-Resume.pdf',
  trustStart: 72,
  accent: 'emerald',
  sections: { stack: true, work: true, play: true, trust: true, how: true, where: true, quotes: true },
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULTS,
      ...parsed,
      sections: { ...DEFAULTS.sections, ...(parsed.sections || {}) },
    }
  } catch {
    return DEFAULTS
  }
}

const Ctx = createContext(null)

export function SettingsProvider({ children }) {
  const [s, setS] = useState(load)

  useEffect(() => {
    const a = ACCENTS[s.accent] || ACCENTS.emerald
    const root = document.documentElement.style
    root.setProperty('--em', a.em)
    root.setProperty('--em-deep', a.deep)
    try {
      localStorage.setItem(KEY, JSON.stringify(s))
    } catch {
      /* private mode: run without persisting */
    }
  }, [s])

  const set = (key, value) => setS((prev) => ({ ...prev, [key]: value }))
  const setSection = (key, value) =>
    setS((prev) => ({ ...prev, sections: { ...prev.sections, [key]: value } }))
  const reset = () => setS(DEFAULTS)

  return <Ctx.Provider value={{ s, set, setSection, reset, setAll: setS }}>{children}</Ctx.Provider>
}

export function useSettings() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
