import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { LINKS } from '../data.js'

export function useKonami(onFire) {
  useEffect(() => {
    const seq = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
    let pos = 0
    const h = (e) => {
      const k = e.key.toLowerCase()
      pos = k === seq[pos] ? pos + 1 : k === seq[0] ? 1 : 0
      if (pos === seq.length) { pos = 0; onFire?.() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onFire])
}

const HELP = `available commands:
  help ......... this list (you're welcome)
  whoami ....... a short, honest answer
  trust ........ current trust metrics
  excel ........ check Excel-export status
  hire ......... make a great decision
  sudo hire .... make it official
  party ........ toggle data-party mode
  deploy ....... push to prod (brave)
  clear ........ wipe the evidence`

export default function Terminal({ open, setOpen, notify, party, setParty }) {
  const [lines, setLines] = useState([
    { t: 'soubhikchakraborty@fabric:~$ ssh portfolio', c: 'cmd' },
    { t: 'Welcome. Type "help" - there are jokes in here. Press ` anytime to toggle.', c: '' },
  ])
  const [val, setVal] = useState('')
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 99999 })
  }, [lines, open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60)
  }, [open ])

  const print = useCallback((t, c = '') => setLines((l) => [...l, { t, c }]), [])

  const run = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase()
    print(`soubhikchakraborty@fabric:~$ ${raw}`, 'cmd')
    if (!cmd) return
    if (cmd === 'clear') return setLines([])
    if (cmd === 'help') return print(HELP)
    if (cmd === 'whoami') return print('data engineer. pipeline therapist. vendor negotiator. excel-export eradicator.')
    if (cmd === 'trust') return print('time-to-trust: improving ↓ · excel exports: approaching zero · finance nods: 1 (framed)')
    if (cmd === 'excel') return print('Excel export detected... just kidding. Nobody exported anything today. Growth. 🌱')
    if (cmd === 'hire') return (print('Excellent choice. Email: ' + LINKS.email), notify?.('Inbox zero is a myth, but do email anyway 📧'))
    if (cmd === 'sudo hire') {
      print('Offer letter compiling… ██████████ 100% ✔')
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } })
      return notify?.('Offer accepted (in this terminal, at least) 🎉')
    }
    if (cmd === 'party') {
      setParty(!party)
      return print(!party ? '🪩 DATA PARTY MODE: ON. Hue rotation engaged.' : 'party mode off. back to serious ETL.')
    }
    if (cmd === 'deploy') return print('✗ FAILED: did you really deploy from a fake terminal? Bold. Wrong, but bold.')
    if (cmd === 'exit' || cmd === 'quit') return setOpen(false)
    print(`command not found: ${cmd} - try "help" (it has jokes)`)
  }, [print, notify, party, setParty, setOpen])

  // backtick toggles terminal
  useEffect(() => {
    const h = (e) => {
      if (e.key === '`' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [setOpen])

  if (!open) return null
  return (
    <div className="term-ov" onClick={() => setOpen(false)}>
      <div className="term-win" onClick={(e) => e.stopPropagation()}>
        <div className="term-bar">
          <span className="dot" style={{ background: '#e04848' }} />
          <span className="dot" style={{ background: '#e0a848' }} />
          <span className="dot" style={{ background: '#4ade80' }} />
          <span style={{ marginLeft: 10 }}>soubhikchakraborty@fabric - zsh (definitely prod)</span>
        </div>
        <div className="term-body" ref={bodyRef}>
          {lines.map((l, i) => (
            <div key={i} className={l.c === 'cmd' ? 'cmd' : ''}>
              {l.c === 'cmd' ? <span className="in">{l.t}</span> : l.t}
            </div>
          ))}
        </div>
        <form className="term-input" onSubmit={(e) => { e.preventDefault(); run(val); setVal('') }}>
          <span>➜ ~</span>
          <input ref={inputRef} value={val} onChange={(e) => setVal(e.target.value)} placeholder='try "hire"…' autoComplete="off" spellCheck="false" />
        </form>
      </div>
    </div>
  )
}
