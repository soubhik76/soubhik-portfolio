import { Component, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import confetti from 'canvas-confetti'
import Playground from './components/Playground.jsx'
import Terminal, { useKonami } from './components/Terminal.jsx'
import { SettingsProvider, useSettings } from './admin/settings.jsx'
import AdminPanel from './admin/AdminPanel.jsx'
import { CATS, HOW, JOBS, PROJECTS, QUOTES, STACK } from './data.js'

const EASE = [0.32, 0.72, 0, 1]
const asset = (p) => `${import.meta.env.BASE_URL}${p}`

/* ---------- org logo tile with monogram fallback ---------- */
function OrgLogo({ job }) {
  const [err, setErr] = useState(false)
  if (err) return <span className="org-fallback" aria-hidden="true">{job.short}</span>
  return <img className="org-img" src={asset(job.logo)} alt={`${job.co} logo`} loading="lazy" onError={() => setErr(true)} />
}

const Arrow = () => (
  <span className="arr" aria-hidden="true">
    <svg viewBox="0 0 16 16"><path d="M4 12L12 4M12 4H6M12 4v6" /></svg>
  </span>
)
const GoArrow = () => (
  <span className="go" aria-hidden="true">
    <svg viewBox="0 0 16 16"><path d="M4 12L12 4M12 4H6M12 4v6" /></svg>
  </span>
)

/* ---------- dotted name: Soubhik.Chakraborty ---------- */
function Dotted({ name }) {
  const parts = name.split(' ')
  if (parts.length < 2) return <>{name}</>
  return (
    <>{parts[0]}<i className="dot-sep" aria-hidden="true">.</i>{parts.slice(1).join(' ')}</>
  )
}

/* ---------- crash safety: never a black void ---------- */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { err: null }
  }
  static getDerivedStateFromError(err) {
    return { err }
  }
  componentDidCatch(err) {
    console.error('Section crashed:', err)
  }
  render() {
    if (this.state.err) {
      return (
        <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: 32, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 40 }}>🧯</div>
            <h2 className="disp" style={{ fontSize: 24, margin: '16px 0 8px' }}>This bit glitched.</h2>
            <p style={{ opacity: 0.6, fontSize: 14 }}>The pipeline failed loudly, as designed. Everything else still works.</p>
            <button className="mini-btn" onClick={() => window.location.reload()}>Reload page</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

/* ---------- scroll entry (FM-driven only) ---------- */
function Reveal({ children, delay = 0, y = 48, className = '', style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ y, opacity: 0, filter: 'blur(10px)' }}
      whileInView={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- typewriter ---------- */
const PHRASES = [
  '> reconciling AR ageing to the rupee… ✓',
  '> automating somebody\'s dreaded morning task… ✓',
  '> detecting row-cap truncation before the board does… ✓',
]
function Typer() {
  const [text, setText] = useState('')
  useEffect(() => {
    let pi = 0, ci = 0, del = false, t
    const tick = () => {
      const full = PHRASES[pi]
      ci += del ? -2 : 1
      setText(full.slice(0, Math.max(0, ci)))
      let wait = del ? 26 : 46
      if (!del && ci >= full.length) { wait = 1700; del = true }
      else if (del && ci <= 0) { del = false; pi = (pi + 1) % PHRASES.length; wait = 350 }
      t = setTimeout(tick, wait)
    }
    t = setTimeout(tick, 500)
    return () => clearTimeout(t)
  }, [])
  return <div className="typer">{text}<span className="caret" /></div>
}

/* ---------- manifesto scrub (FM useScroll, no window listeners) ---------- */
const MANIFESTO = [
  ['Most', ''], ['data', ''], ['problems', ''], ['are', ''], ['not', ''],
  ['modelling', ''], ['problems.', ''], ['They', ''], ['are', ''],
  ['trust', 'cop'], ['problems.', ''], ['The', ''], ['pipeline', ''],
  ['ran,', ''], ['the', ''], ['dashboard', ''], ['loaded,', ''],
  ['and', ''], ['the', ''], ['stakeholder', ''], ['still', ''],
  ['opened', ''], ['Excel', 'eml'], ['to', ''], ['check.', ''],
]
function Manifesto() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.42'] })
  const [on, setOn] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setOn(Math.floor(v * MANIFESTO.length)))
  return (
    <section style={{ paddingTop: 0 }}>
      <div className="wrap manifesto" ref={ref}>
        <Reveal>
          <span className="eyebrow"><span className="pulse" /> The thesis</span>
        </Reveal>
        <p className="line" style={{ marginTop: 30 }}>
          {MANIFESTO.map(([w, c], i) => (
            <span key={i} className={`w ${c} ${i < on ? 'on' : ''}`}>{w}</span>
          ))}
        </p>
      </div>
    </section>
  )
}

/* ---------- filterable showcase ---------- */
function Showcase() {
  const [cat, setCat] = useState('all')
  const items = PROJECTS.filter((p) => cat === 'all' || p.cat === cat)
  return (
    <>
      <div className="tabs">
        {CATS.map(([k, label], i) => (
          <button key={k} className={`tab ${cat === k ? 'on' : ''}`} onClick={() => setCat(k)}>
            <span className="n">0{i + 1}</span>{label}
          </button>
        ))}
      </div>
      <motion.div className="proj-list" layout transition={{ duration: 0.6, ease: EASE }}>
        <AnimatePresence initial={false}>
          {items.map((p, i) => (
            <motion.div key={p.title} layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: EASE }}
              className={`prow ${p.cat}`}>
              <span className="idx">0{i + 1}</span>
              <h3>{p.title}<span>{p.use}</span></h3>
              <span className="stk">{p.stack}</span>
              <span className="met">{p.metric}</span>
              <GoArrow />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

const MENU_LINKS = [
  ['Work', '#work'], ['Playground', '#play'], ['Approach', '#how'],
  ['Track record', '#where'], ['Contact', '#contact'],
]

/* ---------- resume preview modal ---------- */
function ResumeModal({ open, onClose, file, name }) {
  useEffect(() => {
    if (!open) return
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="term-ov" onClick={onClose}>
      <div className="resume-win" onClick={(e) => e.stopPropagation()}>
        <div className="term-bar">
          <span className="dot" style={{ background: '#e04848' }} />
          <span className="dot" style={{ background: '#e0a848' }} />
          <span className="dot" style={{ background: '#4ade80' }} />
          <span style={{ marginLeft: 10 }}>{name} - Resume</span>
          <span className="resume-actions" style={{ marginLeft: 'auto' }}>
            <a href={file} download style={{ color: 'var(--cop-lite)', fontSize: 12 }}>Download PDF</a>
            <button className="ad-x" style={{ width: 30, height: 30, fontSize: 12 }} onClick={onClose} aria-label="Close resume">✕</button>
          </span>
        </div>
        <iframe src={file} title={`${name} resume preview`} />
      </div>
    </div>
  )
}

/* ================= APP ================= */
function Site() {
  const { s } = useSettings()
  const resumeUrl = asset(s.resumeFile)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [qi, setQi] = useState(0)
  const [slice, setSlice] = useState(0)
  const [toast, setToast] = useState('')
  const [menu, setMenu] = useState(false)
  const [termOpen, setTermOpen] = useState(false)
  const [party, setParty] = useState(false)
  const [excel, setExcel] = useState(0)
  const [trust, setTrust] = useState(s.trustStart)
  const toastT = useRef(null)
  const orb = useRef(null)
  const taps = useRef([])

  const notify = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastT.current)
    toastT.current = setTimeout(() => setToast(''), 3400)
  }, [])

  const fireParty = useCallback(() => {
    setParty((p) => {
      if (!p) {
        confetti({ particleCount: 220, spread: 130, origin: { y: 0.6 } })
        notify('Konami accepted - data-party mode engaged. Press ` for the terminal.')
      } else notify('Party mode off. Back to serious ETL.')
      return !p
    })
  }, [notify])
  useKonami(fireParty)
  useEffect(() => { document.body.classList.toggle('party', party) }, [party])

  useEffect(() => {
    console.log('%c👋 Hi, curious dev.', 'font-size:16px;font-weight:bold')
    console.log('%cSecrets:\n→ Konami code = party\n→ Press ` for a terminal (try "sudo hire")\n→ Site owner: Ctrl+Shift+A or #admin opens the hidden settings panel.', 'font-size:12px')
  }, [])

  const unlock = useCallback(() => {
    setAdmin(true)
    notify('Admin unlocked. Visitors cannot see this panel.')
  }, [notify])

  /* hidden admin: shortcut, hash, triple-tap */
  useEffect(() => {
    const keys = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        unlock()
      }
      if (e.key === 'Escape') setAdmin(false)
    }
    const hash = () => { if (window.location.hash === '#admin') unlock() }
    window.addEventListener('keydown', keys)
    window.addEventListener('hashchange', hash)
    hash()
    return () => { window.removeEventListener('keydown', keys); window.removeEventListener('hashchange', hash) }
  }, [unlock])

  const footTap = () => {
    const now = Date.now()
    taps.current = [...taps.current, now].slice(-3)
    if (taps.current.length === 3 && now - taps.current[0] < 700) unlock()
  }

  /* cursor aura - transform only */
  useEffect(() => {
    let raf = 0, x = -600, y = -600, tx = x, ty = y
    const move = (e) => { tx = e.clientX; ty = e.clientY }
    const loop = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08
      orb.current?.style.setProperty('transform', `translate3d(${x - 280}px,${y - 280}px,0)`)
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menu])

  const excelSnark = [
    'Counter armed. Every click is a trust incident report.',
    '1 export. Somewhere, a DAX measure cried.',
    '2 exports. The pipeline felt that.',
    '3 exports. Calling an emergency governance meeting.',
    '5+ exports. This is now a SharePoint shop. Congratulations.',
  ]

  return (
    <>
      <div className="orbs" aria-hidden="true"><i className="orb-a" /><i className="orb-b" /><i className="orb-c" /></div>
      <div className="grain" aria-hidden="true" />
      <div className="cursor-orb" ref={orb} aria-hidden="true" />

      <nav className="nav">
        <button className="mark" onClick={() => { confetti({ particleCount: 60, spread: 70 }); notify('You clicked the name. The name appreciates it.') }}>
          <Dotted name={s.name} />
        </button>
        <div className="lk">
          <a href="#work">Work</a>
          <a href="#play">Playground</a>
          <a href="#how">Approach</a>
          <a href="#where">Track record</a>
        </div>
        <a href="#contact" className="btn btn-p"><span className="txt">Get in touch</span><Arrow /></a>
        <button className={`burger ${menu ? 'open' : ''}`} aria-label="Menu" onClick={() => setMenu((m) => !m)}>
          <i /><i />
        </button>
      </nav>

      <div className={`menu ${menu ? 'open' : ''}`}>
        {MENU_LINKS.map(([label, href], i) => (
          <a key={href} className="mlink" href={href} onClick={() => setMenu(false)}>
            <span style={{ transitionDelay: menu ? `${120 + i * 70}ms` : '0ms' }}>
              <span style={{ fontSize: '.35em', color: 'var(--cop-lite)', marginRight: 18 }}>0{i + 1}</span>{label}
            </span>
          </a>
        ))}
        <a className="mlink" href={resumeUrl} download onClick={() => setMenu(false)}>
          <span style={{ transitionDelay: menu ? `${120 + MENU_LINKS.length * 70}ms` : '0ms' }}>
            <span style={{ fontSize: '.35em', color: 'var(--cop-lite)', marginRight: 18 }}>06</span>Resume ↓
          </span>
        </a>
        <div className="mfoot">{s.name.toLowerCase().replace(/ /g, '')}@fabric - all pipelines green · tap a link to close</div>
      </div>

      <main>
        {/* HERO - fits one viewport */}
        <div className="hero">
          <div className="wrap hero-grid">
            <div>
              <motion.div initial={{ y: 32, opacity: 0, filter: 'blur(10px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.9, ease: EASE }}>
                <span className="eyebrow"><span className="pulse" /> <Dotted name={s.name} /> · {s.role}</span>
              </motion.div>
              <motion.h1 className="disp"
                initial={{ y: 56, opacity: 0, filter: 'blur(14px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 0.1, ease: EASE }}>
                I make the<br />number <span className="thin">people</span><br />
                <span className="serif-it">stop arguing</span> about.
              </motion.h1>
              <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, delay: 0.22, ease: EASE }}>
                <p className="lede">{s.lede}</p>
                <Typer />
                <div className="btns">
                  <a href={resumeUrl} download className="btn btn-p">Resume <span className="arr">↓</span></a>
                  <a href="#work" className="btn btn-g">See the work <Arrow /></a>
                </div>
                <div style={{ marginTop: 16 }}>
                  <button onClick={() => setResumeOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'ui-monospace,monospace', fontSize: 12, color: 'var(--faint)', textDecoration: 'underline', textUnderlineOffset: 4, padding: 0 }}>
                    preview resume first →
                  </button>
                </div>
              </motion.div>
            </div>

            <motion.button className="mini-term" onClick={() => setTermOpen(true)}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: EASE }} aria-label="Open terminal">
              <span className="mt-in" style={{ display: 'block' }}>
                <span className="mt-bar"><span className="dot" style={{ background: '#e04848' }} /><span className="dot" style={{ background: '#e0a848' }} /><span className="dot" style={{ background: '#4ade80' }} /></span>
                <pre>{'$ whoami\n'}<span className="w">data engineer. excel-export eradicator.</span>{'\n$ ./rebuild-trust.sh\n'}<span className="g">✓ 21/21 feeds green · finance nodded once</span></pre>
                <span className="mt-open"><span>live from the warehouse</span><span>open terminal →</span></span>
              </span>
            </motion.button>
          </div>
          <div className="wrap">
            <div className="hero-strip">
              <span><b>●</b> {s.location} - {s.availability}</span>
              <span><b>●</b> {s.pipelineNote}</span>
              <span className="cue">scroll ↓</span>
            </div>
          </div>
        </div>

        {/* STACK - logo strip */}
        {s.sections.stack && (
        <div className="stack-strip" aria-label="Tech stack">
          <div className="stack-in">
            {[0, 1].map((k) => (
              <span className="stack-set" key={k}>
                {STACK.map((t) => (
                  <span className="stack-item" key={`${k}-${t.name}`}>
                    {t.icon
                      ? <img src={asset(t.icon)} alt={`${t.name} logo`} loading="lazy" />
                      : <span className="stack-chip">{t.name}</span>}
                    <span className="stack-name">{t.name}</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>)}

        {/* WORK - showcase */}
        {s.sections.work && (
        <section id="work">
          <div className="wrap">
            <div className="shead">
              <Reveal>
                <span className="eyebrow"><span className="pulse" /> Selected work</span>
                <h2 className="disp">Web apps. Automations.<br /><span className="serif-it">FMCG outcomes.</span></h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="side">Nine things I built that solved real business usecases. Filter by craft.</p>
              </Reveal>
            </div>
            <Reveal><Showcase /></Reveal>
          </div>
        </section>)}

        <Manifesto />

        {/* PLAYGROUND */}
        {s.sections.play && (
        <section id="play" className="play">
          <div className="wrap">
            <div className="shead">
              <Reveal>
                <span className="eyebrow"><span className="pulse" /> Playground</span>
                <h2 className="disp">Break things here,<br /><span className="serif-it">not in prod.</span></h2>
              </Reveal>
            </div>
            <Reveal><ErrorBoundary><Playground notify={notify} /></ErrorBoundary></Reveal>
            {s.sections.trust && (
            <div className="trust">
              <Reveal>
                <div className="shell"><div className="core">
                  <h3>Excel-export incidents</h3>
                  <p>Every “just double-check” export gets one click below.</p>
                  <div className="excel-count">{excel}</div>
                  <button className="mini-btn" onClick={() => { setExcel((e) => e + 1); setTrust((t) => Math.max(4, t - 3)) }}>
                    +1 export - it happened again
                  </button>
                  <div className="snark-line">{excelSnark[Math.min(excel, excelSnark.length - 1)]}</div>
                </div></div>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="shell"><div className="core">
                  <h3>Time-to-trust</h3>
                  <p>How long before someone quotes your number without hedging.</p>
                  <div className="meter"><div style={{ transform: `scaleX(${trust / 100})` }} /></div>
                  <div style={{ fontFamily: '"Clash Display",sans-serif', fontWeight: 600, fontSize: 28 }}>{trust}% <span style={{ fontSize: 11, color: 'var(--cop-lite)', letterSpacing: '.18em' }}>TRUSTED</span></div>
                  <button className="mini-btn" onClick={() => {
                    setTrust((t) => {
                      const n = Math.min(100, t + 4)
                      if (n >= 100) { confetti({ particleCount: 150, spread: 100 }); notify('100% trust! Finance quoted your number in a meeting.') }
                      return n
                    })
                  }}>
                    Ship a reconciliation (+4)
                  </button>
                  <div className="snark-line">{trust >= 100 ? 'Maximum trust. Do not touch anything.' : 'Earned in reconciliations, lost in silent failures.'}</div>
                </div></div>
              </Reveal>
            </div>)}
          </div>
        </section>)}

        {/* HOW */}
        {s.sections.how && (
        <section id="how">
          <div className="wrap">
            <div className="shead">
              <Reveal>
                <span className="eyebrow"><span className="pulse" /> Approach</span>
                <h2 className="disp">Five habits, <span className="em">no fluff.</span></h2>
              </Reveal>
            </div>
            <Reveal>
              <div>
                {HOW.map((h) => (
                  <div className="hrow" key={h.no}>
                    <span className="no">{h.no}</span>
                    <h4>{h.h}</h4>
                    <p>{h.p} <b>In practice - {h.pf}</b></p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>)}

        {/* WHERE */}
        {s.sections.where && (
        <section id="where" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="shead">
              <Reveal>
                <span className="eyebrow"><span className="pulse" /> Track record</span>
                <h2 className="disp">Three companies. <span className="em">One brief.</span></h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="side">Hover or tap each era to expand. No NDAs were harmed.</p>
              </Reveal>
            </div>
            <Reveal>
              <div className="acc">
                {JOBS.map((j, i) => (
                  <div key={j.co} className={`slice ${slice === i ? 'active' : ''}`}
                    onMouseEnter={() => setSlice(i)} onClick={() => setSlice(i)}>
                    <div className="sin">
                      <div className="sbg" style={{ backgroundImage: `url('${j.img}')` }} />
                      <div className="txt">
                        <span className="org-tile org-sm"><OrgLogo job={j} /></span>
                        <div className="yr">{j.yr}</div>
                        <div className="co">{j.co}</div>
                        <div className="ro">{j.ro}</div>
                        <div className="dd">{j.dd}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>)}

        {/* CTA */}
        <section className="cta-sec" id="contact" style={{ paddingTop: 0 }}>
          <div className="wrap cta-in">
            {s.sections.quotes && (
            <>
            <Reveal>
              <span className="eyebrow"><span className="pulse" /> The measure that matters</span>
              <h2 className="disp" style={{ marginTop: 26 }}>Time to <span className="em">trust.</span></h2>
            </Reveal>
            <div className="quotes">
              <div className="q-track" style={{ transform: `translateX(-${qi * 100}%)` }}>
                {QUOTES.map((q, i) => (
                  <div className="q-item" key={i}>
                    <div className="q-av" style={{ backgroundImage: `url('https://picsum.photos/seed/portrait${i}/300/300')` }} />
                    <div>
                      <blockquote>"{q.big}"</blockquote>
                      <cite>{q.small}</cite>
                    </div>
                  </div>
                ))}
              </div>
              <div className="q-nav">
                <button aria-label="Previous" onClick={() => setQi((qi - 1 + QUOTES.length) % QUOTES.length)}>←</button>
                <button aria-label="Next" onClick={() => setQi((qi + 1) % QUOTES.length)}>→</button>
              </div>
            </div>
            </>
            )}
            <Reveal delay={0.05}>
              <h2 className="disp" style={{ marginTop: 56 }}>The <span className="serif-it">number</span> that's not moving?</h2>
              <div className="btns">
                <a href={`mailto:${s.email}`} className="btn btn-p">{s.email} <Arrow /></a>
                <a href={s.linkedin} target="_blank" rel="noreferrer" className="btn btn-g">LinkedIn <Arrow /></a>
                <a href={resumeUrl} download className="btn btn-g">Resume <span className="arr">↓</span></a>
              </div>
              <div style={{ marginTop: 18 }}>
                <button onClick={() => setResumeOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'ui-monospace,monospace', fontSize: 12, color: 'var(--faint)', textDecoration: 'underline', textUnderlineOffset: 4, padding: 0 }}>
                  preview resume without downloading →
                </button>
              </div>
              <p className="hint">Konami code · press ` for terminal · click the logo dot</p>
            </Reveal>
          </div>
        </section>

        <footer>
          <div className="wrap f-in">
            <button className="fm" onClick={footTap} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }} aria-label={s.name}><Dotted name={s.name} /></button>
            <div className="fl">
              <a href={`mailto:${s.email}`}>Email</a>
              <a href={s.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={resumeUrl} download>Resume</a>
              <a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a>
            </div>
          </div>
        </footer>
      </main>

      <button className="term-fab" aria-label="Open terminal" onClick={() => setTermOpen(true)}>&gt;_</button>
      <Terminal open={termOpen} setOpen={setTermOpen} notify={notify} party={party} setParty={setParty} />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} file={resumeUrl} name={s.name} />
      <AdminPanel open={admin} onClose={() => setAdmin(false)} notify={notify} />
      <div className={`toast ${toast ? 'show' : ''}`}><span>{toast}</span><span className="arr">✓</span></div>
    </>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <ErrorBoundary>
        <Site />
        <Analytics />
      </ErrorBoundary>
    </SettingsProvider>
  )
}
