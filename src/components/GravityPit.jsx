import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'

/* rasterize an SVG icon so canvas drawImage behaves everywhere */
function loadIcon(src, size = 128) {
  return fetch(src)
    .then((r) => r.text())
    .then(
      (txt) =>
        new Promise((resolve) => {
          const sized = txt.replace('<svg', `<svg width="${size}" height="${size}"`)
          const url = URL.createObjectURL(new Blob([sized], { type: 'image/svg+xml' }))
          const img = new Image()
          img.onload = () => resolve({ img, url })
          img.onerror = () => resolve(null)
          img.src = url
        })
    )
    .catch(() => null)
}

export default function GravityPit({ items, notify }) {
  const host = useRef(null)
  const engineRef = useRef(null)
  const [flipped, setFlipped] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let engine, render, runner, mouseConstraint
    const urls = []

    const boot = async () => {
      const el = host.current
      if (!el) return
      const W = Math.max(el.clientWidth, 280)
      const H = W < 560 ? 360 : 440
      const R = W < 560 ? 26 : 32

      const loaded = await Promise.all(items.map((t) => loadIcon(t.src)))
      if (cancelled) return
      loaded.forEach((l) => l && urls.push(l.url))

      engine = Matter.Engine.create({ enableSleeping: false })
      engine.gravity.y = 1
      const world = engine.world

      const wallOpts = { isStatic: true, render: { visible: false } }
      const walls = [
        Matter.Bodies.rectangle(W / 2, H + 40, W + 200, 80, wallOpts),
        Matter.Bodies.rectangle(W / 2, -60, W + 200, 80, wallOpts),
        Matter.Bodies.rectangle(-40, H / 2, 80, H + 200, wallOpts),
        Matter.Bodies.rectangle(W + 40, H / 2, 80, H + 200, wallOpts),
      ]

      const bodies = items.map((t, i) => {
        const icon = loaded[i]
        const col = (i % 4) + 1
        const row = Math.floor(i / 4)
        const x = (W / 5) * col + (Math.random() * 20 - 10)
        const y = 70 + row * (R * 2 + 26)
        const scale = (R * 1.25) / 128
        return Matter.Bodies.circle(x, y, R, {
          restitution: 0.82,
          friction: 0.08,
          frictionAir: 0.011,
          density: 0.0012,
          label: t.name,
          render: {
            fillStyle: '#101413',
            strokeStyle: 'rgba(210,154,115,.55)',
            lineWidth: 1.5,
            ...(icon ? { sprite: { texture: icon.url, xScale: scale, yScale: scale } } : {}),
          },
        })
      })
      bodies.forEach((b) =>
        Matter.Body.setVelocity(b, { x: Math.random() * 4 - 2, y: Math.random() * 2 })
      )

      Matter.Composite.add(world, [...walls, ...bodies])

      render = Matter.Render.create({
        element: el,
        engine,
        options: {
          width: W,
          height: H,
          wireframes: false,
          background: 'transparent',
          pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        },
      })

      /* name tags under each icon */
      Matter.Events.on(render, 'afterRender', () => {
        const ctx = render.context
        ctx.save()
        ctx.textAlign = 'center'
        ctx.font = '600 10px Satoshi, system-ui, sans-serif'
        ctx.fillStyle = 'rgba(245,241,233,.55)'
        bodies.forEach((b) => {
          ctx.fillText(b.label.toUpperCase().slice(0, 12), b.position.x, b.position.y + R + 15)
        })
        ctx.restore()
      })

      const mouse = Matter.Mouse.create(render.canvas)
      mouseConstraint = Matter.MouseConstraint.create({
        engine,
        mouse,
        constraint: { stiffness: 0.25, damping: 0.08, render: { visible: false } },
      })
      Matter.Composite.add(world, mouseConstraint)
      /* never hijack page scroll */
      render.mouse = mouse
      mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)

      Matter.Render.run(render)
      runner = Matter.Runner.create()
      Matter.Runner.run(runner, engine)
      engineRef.current = engine
      setReady(true)
    }

    boot()
    return () => {
      cancelled = true
      try {
        if (render) {
          Matter.Render.stop(render)
          render.canvas?.remove()
          render.textures = {}
        }
        if (runner) Matter.Runner.stop(runner)
        if (engine) {
          Matter.Events.off(engine)
          Matter.Composite.clear(engine.world, false)
          Matter.Engine.clear(engine)
        }
      } catch {
        /* teardown is best-effort */
      }
      urls.forEach((u) => URL.revokeObjectURL(u))
      engineRef.current = null
    }
  }, [items])

  const shake = () => {
    const engine = engineRef.current
    if (!engine) return
    Matter.Composite.allBodies(engine.world)
      .filter((b) => !b.isStatic)
      .forEach((b) =>
        Matter.Body.applyForce(b, b.position, {
          x: (Math.random() - 0.5) * 0.09 * b.mass,
          y: -Math.random() * 0.11 * b.mass,
        })
      )
    notify?.('Gravity pit agitated. HR has been notified.')
  }

  const flip = () => {
    const engine = engineRef.current
    if (!engine) return
    engine.gravity.y = flipped ? 1 : -1
    setFlipped(!flipped)
  }

  return (
    <div>
      <p style={{ color: 'var(--dim)', fontSize: 14, lineHeight: 1.7, maxWidth: 560 }}>
        The stack, obeying physics. Drag the icons, shake the box, or flip gravity entirely.
        Just like prod, but prettier.
      </p>
      <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
        <button className="mini-btn" style={{ marginTop: 0 }} onClick={shake} disabled={!ready}>Shake it</button>
        <button className="mini-btn" style={{ marginTop: 0 }} onClick={flip} disabled={!ready}>
          {flipped ? 'Restore gravity' : 'Anti-gravity'}
        </button>
      </div>
      <div ref={host} className="pit" style={{ marginTop: 20 }} />
      <p className="snark-line">No icons were harmed. The vendor sends its regards.</p>
    </div>
  )
}
