import { useRef } from 'react'
import { ACCENTS, DEFAULTS, SECTION_LABELS, useSettings } from './settings.jsx'

function Field({ label, value, onChange, textarea, type = 'text' }) {
  return (
    <label className="ad-field">
      <span>{label}</span>
      {textarea ? (
        <textarea value={value} rows={4} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} />
      )}
    </label>
  )
}

export default function AdminPanel({ open, onClose, notify }) {
  const { s, set, setSection, reset, setAll } = useSettings()
  const fileRef = useRef(null)

  if (!open) return null

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'portfolio-settings.json'
    a.click()
    URL.revokeObjectURL(a.href)
    notify?.('Settings exported. Keep this file safe.')
  }

  const importJSON = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        setAll({ ...DEFAULTS, ...parsed, sections: { ...DEFAULTS.sections, ...(parsed.sections || {}) } })
        notify?.('Settings imported and applied.')
      } catch {
        notify?.('That file is not valid settings JSON.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="ad-ov" onClick={onClose}>
      <div className="ad-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="ad-head">
          <div>
            <b>Site admin</b>
            <span>Local only. Visitors never see this.</span>
          </div>
          <button className="ad-x" onClick={onClose} aria-label="Close admin">✕</button>
        </div>

        <div className="ad-body">
          <div className="ad-group">
            <h5>Content</h5>
            <Field label="Full name" value={s.name} onChange={(v) => set('name', v)} />
            <Field label="Role line (hero badge)" value={s.role} onChange={(v) => set('role', v)} />
            <Field label="Hero paragraph" value={s.lede} onChange={(v) => set('lede', v)} textarea />
            <Field label="Location" value={s.location} onChange={(v) => set('location', v)} />
            <Field label="Availability note" value={s.availability} onChange={(v) => set('availability', v)} />
            <Field label="Pipeline status note" value={s.pipelineNote} onChange={(v) => set('pipelineNote', v)} />
            <Field label="Starting trust %" value={s.trustStart} type="number" onChange={(v) => set('trustStart', Math.max(0, Math.min(100, v || 0)))} />
          </div>

          <div className="ad-group">
            <h5>Links</h5>
            <Field label="Email" value={s.email} onChange={(v) => set('email', v)} />
            <Field label="LinkedIn URL" value={s.linkedin} onChange={(v) => set('linkedin', v)} />
            <Field label="GitHub URL" value={s.github || ''} onChange={(v) => set('github', v)} />
            <Field label="Website URL (canonical for SEO)" value={s.website || ''} onChange={(v) => set('website', v)} />
            <Field label="Phone" value={s.phone} onChange={(v) => set('phone', v)} />
            <Field label="Resume file (in public/)" value={s.resumeFile} onChange={(v) => set('resumeFile', v)} />
          </div>

          <div className="ad-group">
            <h5>Sections</h5>
            {Object.keys(SECTION_LABELS).map((k) => (
              <label className="ad-toggle" key={k}>
                <span>{SECTION_LABELS[k]}</span>
                <button
                  className={`ad-switch ${s.sections[k] ? 'on' : ''}`}
                  onClick={() => setSection(k, !s.sections[k])}
                  aria-label={`Toggle ${SECTION_LABELS[k]}`}
                >
                  <i />
                </button>
              </label>
            ))}
          </div>

          <div className="ad-group">
            <h5>Appearance</h5>
            <div className="ad-row" role="group" aria-label="Color theme">
              {['system', 'light', 'dark'].map((t) => (
                <button
                  key={t}
                  className={`mini-btn${s.theme === t || (!s.theme && t === 'system') ? ' on' : ''}`}
                  onClick={() => set('theme', t)}
                  aria-pressed={s.theme === t}
                  style={s.theme === t ? { background: 'var(--ink)', color: 'var(--void)', borderColor: 'var(--ink)' } : undefined}
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <p className="ad-note">System follows the visitor's OS. The ☀/◐ button in the nav does the same.</p>
          </div>

          <div className="ad-group">
            <h5>Accent theme</h5>
            <div className="ad-swatches">
              {Object.entries(ACCENTS).map(([k, a]) => (
                <button
                  key={k}
                  className={`ad-sw ${s.accent === k ? 'on' : ''}`}
                  onClick={() => set('accent', k)}
                  aria-label={`${a.label} theme`}
                >
                  <i style={{ background: `linear-gradient(135deg, ${a.em}, ${a.deep})` }} />
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ad-group">
            <h5>Backup</h5>
            <div className="ad-row">
              <button className="mini-btn" onClick={exportJSON}>Export JSON</button>
              <button className="mini-btn" onClick={() => fileRef.current?.click()}>Import JSON</button>
              <button className="mini-btn" onClick={() => { reset(); notify?.('Settings reset to defaults.') }}>Reset all</button>
            </div>
            <input
              ref={fileRef} type="file" accept="application/json" hidden
              onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])}
            />
            <p className="ad-note">Stored in this browser only. Export a backup before switching devices.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
