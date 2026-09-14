import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { DEPLOY_OUTCOMES, EXCUSES, QUIZ, STACK } from '../data.js'

const GravityPit = lazy(() => import('./GravityPit.jsx'))
const asset = (p) => `${import.meta.env.BASE_URL}${p}`
const PIT_ICONS = STACK.filter((t) => t.icon).map((t) => ({ name: t.name, src: asset(t.icon) }))

const pop = (opts = {}) =>
  confetti({ particleCount: 90, spread: 75, origin: { y: 0.7 }, ...opts })

/* ---------------- PIPELINE PANIC (30s fix-the-grid game) ---------------- */
function Panic({ onScore }) {
  const [cells, setCells] = useState(Array(9).fill(false))
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(30)
  const [running, setRunning] = useState(false)
  const [best, setBest] = useState(() => Number(localStorage.getItem('panic-best') || 0))
  const [msg, setMsg] = useState('Fix red pipelines before Finance notices. 30 seconds. Go.')
  const timer = useRef(null)
  const spawner = useRef(null)

  const stop = (finalScore = score) => {
    setRunning(false)
    clearInterval(timer.current)
    clearInterval(spawner.current)
    setCells(Array(9).fill(false))
    if (finalScore > best) {
      setBest(finalScore)
      localStorage.setItem('panic-best', String(finalScore))
      setMsg(`NEW HIGH SCORE: ${finalScore} fixed! Finance almost trusts you.`)
      pop({ particleCount: 160, spread: 100 })
    } else {
      setMsg(`Shift over. You fixed ${finalScore}. Best: ${Math.max(best, finalScore)}. ${finalScore < 8 ? 'The vendor sends its regards.' : 'Solid. Promotion to "person who gets paged"!'}`)
    }
    onScore?.(finalScore)
  }

  const start = () => {
    setScore(0); setTime(30); setRunning(true)
    setMsg('PIPELINES ARE FAILING. CLICK THE RED ONES.')
    timer.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) { stop(); return 0 }
        return t - 1
      })
    }, 1000)
    spawner.current = setInterval(() => {
      setCells(() => {
        const next = Array(9).fill(false)
        const n = 1 + Math.floor(Math.random() * 2)
        for (let k = 0; k < n; k++) next[Math.floor(Math.random() * 9)] = true
        return next
      })
    }, 800)
  }

  useEffect(() => () => { clearInterval(timer.current); clearInterval(spawner.current) }, []) // eslint-disable-line

  const whack = (i) => {
    if (!running || !cells[i]) return
    const s = score + 1
    setScore(s)
    setCells((c) => c.map((v, j) => (j === i ? false : v)))
    if (s % 10 === 0) pop({ particleCount: 40, spread: 60 })
    if (s === score + 1 && time > 0 && s >= 25) setMsg('25+ fixes?! Stop showing off, the interns are watching.')
  }

  return (
    <div>
      <div className="panic-top">
        <div className="panic-stats">
          <div>{score}<small>FIXED</small></div>
          <div>{time}s<small>LEFT</small></div>
          <div>{best}<small>BEST</small></div>
        </div>
        {!running
          ? <button className="btn btn-p" style={{ padding: '6px 6px 6px 24px' }} onClick={start}>Start shift <span className="arr">▶</span></button>
          : <button className="mini-btn" onClick={() => stop()}>End shift</button>}
      </div>
      <div className="pgrid">
        {cells.map((bad, i) => (
          <div key={i} className={`pcell ${bad ? 'bad' : 'good'}`} onClick={() => whack(i)}>
            {bad ? <><span style={{ fontSize: 22 }}>🔥</span><span>IF_{String(i + 1).padStart(2, '0')} FAILED</span><span>click to fix</span></> : <><span>IF_{String(i + 1).padStart(2, '0')}</span><span>● healthy</span></>}
          </div>
        ))}
      </div>
      <div className="panic-msg">{msg}</div>
    </div>
  )
}

/* ---------------- DEPLOY ROULETTE ---------------- */
function Deploy() {
  const [log, setLog] = useState(['$ ready. one button. what could go wrong?', '$ tip: production is just staging with consequences.'])
  const [busy, setBusy] = useState(false)
  const [deploys, setDeploys] = useState(0)
  const [wins, setWins] = useState(0)

  const fire = () => {
    if (busy) return
    setBusy(true)
    const steps = ['$ git push origin main --force (kidding. mostly.)', '$ building 21 interfaces…', '$ running reconciliation…', '$ asking Finance for approval…']
    setLog((l) => [...l, ...steps.map((s) => `› ${s}`)])
    setTimeout(() => {
      const r = DEPLOY_OUTCOMES[Math.floor(Math.random() * DEPLOY_OUTCOMES.length)]
      setDeploys((d) => d + 1)
      if (r.ok) {
        setWins((w) => w + 1)
        setLog((l) => [...l, `✓ ${r.msg}`])
        pop({ particleCount: 180, spread: 110 })
      } else {
        setLog((l) => [...l, `› ${r.msg}`])
      }
      setBusy(false)
    }, 1400)
  }

  return (
    <div>
      <p style={{ color: 'var(--paper-dim)', fontSize: 14, lineHeight: 1.7, maxWidth: 560 }}>
        The big red button. Success rate calibrated to real enterprise life (~17%).
        Deploys: <b style={{ color: 'var(--paper)' }}>{deploys}</b> · Miracles: <b style={{ color: '#4ade80' }}>{wins}</b>
      </p>
      <div style={{ marginTop: 22 }}>
        <button className="big-red" disabled={busy} onClick={fire}>{busy ? 'DEPLOYING…' : 'PUSH TO PROD'}<span className="arr">🚀</span></button>
      </div>
      <div className="deploy-log">
        {log.slice(-9).map((l, i) => (
          <div key={i} className={l.startsWith('✓') ? 'ok' : l.startsWith('✗') ? 'err' : l.startsWith('›') ? 'inf' : ''}>{l}</div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- QUIZ ---------------- */
function Quiz({ notify }) {
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState(null)
  const [right, setRight] = useState(0)
  const [done, setDone] = useState(false)
  const q = QUIZ[idx]

  const pick = (i) => {
    if (picked !== null) return
    setPicked(i)
    if (i === q.answer) {
      setRight((r) => r + 1)
      pop({ particleCount: 45, spread: 60 })
    }
  }
  const next = () => {
    if (idx + 1 >= QUIZ.length) {
      setDone(true)
      const titles = ['Excel Intern 📊', 'Pipeline Padawan 🔧', 'Certified Data Menace ⚡', 'Finance Whisperer 🧾', 'Trusted Number Dealer 🎰']
      const t = titles[Math.min(right + (picked === q.answer ? 1 : 0), 4)] || titles[0]
      notify?.(`Quiz complete: ${right + (picked === q.answer ? 1 : 0)}/5 - rank: ${t}`)
      if (right >= 3) pop({ particleCount: 140, spread: 100 })
    } else { setIdx(idx + 1); setPicked(null) }
  }
  const reset = () => { setIdx(0); setPicked(null); setRight(0); setDone(false) }

  if (done) {
    const finalScore = right
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 56 }}>🏆</div>
        <div className="quiz-q">{finalScore}/5 correct</div>
        <p style={{ color: 'var(--paper-dim)', fontSize: 14 }}>
          {finalScore === 5 ? 'Flawless. You either do this for a living or you ARE Soubhik Chakraborty.' : finalScore >= 3 ? 'Employable. Finance would only double-check you twice.' : 'The vendor sends its regards. Retake encouraged.'}
        </p>
        <button className="mini-btn" onClick={reset}>Retake quiz</button>
      </div>
    )
  }
  return (
    <div>
      <div style={{ fontSize: 12, letterSpacing: '.15em', color: 'var(--cop)', marginBottom: 12 }}>QUESTION {idx + 1}/{QUIZ.length} · SCORE {right}</div>
      <div className="quiz-q">{q.q}</div>
      <div className="quiz-opts">
        {q.options.map((o, i) => (
          <button key={i} disabled={picked !== null} onClick={() => pick(i)}
            className={`quiz-opt ${picked !== null && i === q.answer ? 'right' : ''} ${picked === i && i !== q.answer ? 'wrong' : ''}`}>
            {picked !== null && i === q.answer ? '✓ ' : ''}{o}
          </button>
        ))}
      </div>
      <div className="quiz-snark">{picked !== null ? (picked === q.answer ? `Correct. ${q.snark}` : `Nope. ${q.snark}`) : ''}</div>
      {picked !== null && <button className="mini-btn" onClick={next}>{idx + 1 >= QUIZ.length ? 'See rank →' : 'Next →'}</button>}
    </div>
  )
}

/* ---------------- PLAYGROUND ---------------- */
export default function Playground({ notify }) {
  const [tab, setTab] = useState('panic')
  const [excuse, setExcuse] = useState(EXCUSES[0])
  const [spinning, setSpinning] = useState(false)

  const spinExcuse = () => {
    if (spinning) return
    setSpinning(true)
    let n = 0
    const iv = setInterval(() => {
      setExcuse(EXCUSES[Math.floor(Math.random() * EXCUSES.length)])
      if (++n > 8) { clearInterval(iv); setSpinning(false) }
    }, 90)
  }

  return (
    <>
      <div className="tabs">
        {[['panic', 'Pipeline Panic'], ['deploy', 'Deploy Roulette'], ['quiz', 'Data Quiz'], ['excuse', 'Excuse Generator'], ['gravity', 'Gravity Pit']].map(([k, label], i) => (
          <button key={k} className={`tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>
            <span className="n">0{i + 1}</span>{label}
          </button>
        ))}
      </div>
      <div className="shell"><div className="core stage">
        {tab === 'panic' && <Panic onScore={(s) => s >= 15 && notify?.(`Pipeline Panic: ${s} fixed! Put that on a resume.`)} />}
        {tab === 'deploy' && <Deploy />}
        {tab === 'quiz' && <Quiz notify={notify} />}
        {tab === 'gravity' && (
          <Suspense fallback={<div className="panic-msg">loading physics engine…</div>}>
            <GravityPit items={PIT_ICONS} notify={notify} />
          </Suspense>
        )}
        {tab === 'excuse' && (
          <div>
            <div style={{ fontSize: 12, letterSpacing: '.15em', color: 'var(--cop)', marginBottom: 18 }}>WHY DID THE PIPELINE FAIL TODAY?</div>
            <div className="excuse-box">“{excuse}”</div>
            <button className="btn btn-p" style={{ marginTop: 26 }} onClick={spinExcuse} disabled={spinning}>
              {spinning ? 'Consulting the vendor…' : 'Generate excuse'} <span className="arr">🎲</span>
            </button>
            <p className="snark-line">All excuses certified 100% real. Names withheld to protect the guilty (vendors).</p>
          </div>
        )}
      </div></div>
    </>
  )
}
