/* Featured build inside a pure-CSS browser frame (mockup-generator style).
   Content comes from src/data.js — no fabricated metrics. */
import { PROJECTS } from '../data.js'

const DOTS = ['#e04848', '#e0a848', '#4ade80']

export function BrowserMockup({ url, children }) {
  return (
    <div className="mock-browser">
      <div className="mock-bar">
        <span className="mock-dots" aria-hidden="true">
          {DOTS.map((c) => <i key={c} style={{ background: c }} />)}
        </span>
        <span className="mock-url">{url}</span>
        <span style={{ width: 52 }} aria-hidden="true" />
      </div>
      <div className="mock-screen">{children}</div>
    </div>
  )
}

export function FeaturedBuild() {
  const p = PROJECTS.find((x) => x.title === 'Chargeback Tracker') || PROJECTS[0]
  return (
    <BrowserMockup url="portfolio / chargeback-tracker">
      <span className="eyebrow"><span className="pulse" /> Featured build</span>
      <h3 className="disp" style={{ marginTop: 16, fontSize: 'clamp(1.5rem,3vw,2.2rem)' }}>{p.title}</h3>
      <p style={{ marginTop: 10, color: 'var(--dim)', fontSize: 15, maxWidth: '60ch' }}>{p.use}</p>
      <div className="mock-stats">
        <div className="mock-stat"><b>5</b><span>Vendors held to terms</span></div>
        <div className="mock-stat"><b>21</b><span>Feeds watched</span></div>
        <div className="mock-stat"><b>✓</b><span>Paper trail attached</span></div>
      </div>
      <p className="stk" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--faint)' }}>{p.stack}</p>
      <div style={{ marginTop: 18 }}>
        <a className="uv-btn-glow" href={p.link} target="_blank" rel="noopener noreferrer">
          Open case study <span aria-hidden="true">→</span>
        </a>
      </div>
    </BrowserMockup>
  )
}
