import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function formatStat(val, suffix = '') {
  if (val === 0 || val === undefined || val === null) return '—'
  if (typeof val === 'number' && suffix === 's') return val.toFixed(1) + 's'
  if (val >= 1000) return (val / 1000).toFixed(1) + 'K'
  return String(val)
}

export default function Background3D({ stats }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width = W
    canvas.height = H

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setClearColor(0x00050a, 1)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200)
    camera.position.set(0, 6, 18)
    camera.lookAt(0, 0, 0)

    scene.fog = new THREE.FogExp2(0x00050a, 0.04)

    const grid = new THREE.GridHelper(60, 40, 0x003322, 0x001a10)
    grid.position.y = -4
    scene.add(grid)

    const ambient = new THREE.AmbientLight(0x002211, 2)
    scene.add(ambient)

    const light1 = new THREE.PointLight(0x00ff88, 3, 30)
    light1.position.set(0, 6, 0)
    scene.add(light1)

    const light2 = new THREE.PointLight(0x00cc66, 1.5, 20)
    light2.position.set(-8, 2, 4)
    scene.add(light2)

    const light3 = new THREE.PointLight(0x004422, 1, 20)
    light3.position.set(8, 2, 4)
    scene.add(light3)

    const particles = []
    const pGeo = new THREE.SphereGeometry(0.06, 4, 4)
    const pMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 })
    for (let i = 0; i < 120; i++) {
      const p = new THREE.Mesh(pGeo, pMat.clone())
      p.material.opacity = Math.random() * 0.8 + 0.2
      p.material.transparent = true
      p.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 30
      )
      p.userData.speed = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.008,
        z: (Math.random() - 0.5) * 0.006,
      }
      scene.add(p)
      particles.push(p)
    }

    const nodes3d = []
    const nodePositions = [
      [-7, 2, -3], [-7, -1, 2], [7, 2, -3],
      [7, -1, 2], [-4, -2, -6], [4, -2, -6],
    ]
    const nodeGeo = new THREE.OctahedronGeometry(0.3)
    const nodeMat = new THREE.MeshPhongMaterial({
      color: 0x00ff88, emissive: 0x003311, wireframe: false,
    })
    nodePositions.forEach((pos) => {
      const n = new THREE.Mesh(nodeGeo, nodeMat.clone())
      n.position.set(...pos)
      n.userData.rotSpeed = (Math.random() - 0.5) * 0.04
      scene.add(n)
      nodes3d.push(n)
    })

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00ff44, opacity: 0.3, transparent: true,
    })
    nodes3d.forEach((n) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        n.position.clone(),
        new THREE.Vector3(0, 0, 0),
      ])
      scene.add(new THREE.Line(geo, lineMat))
    })

    const ringGeo = new THREE.RingGeometry(3.5, 3.55, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88, side: THREE.DoubleSide,
      opacity: 0.2, transparent: true,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.y = -3.9
    scene.add(ring)

    let frame
    let t = 0
    function animate() {
      frame = requestAnimationFrame(animate)
      t += 0.01

      camera.position.x = Math.sin(t * 0.2) * 2
      camera.position.y = 6 + Math.sin(t * 0.15) * 1
      camera.lookAt(0, 0, 0)

      light1.position.x = Math.sin(t) * 5
      light1.position.z = Math.cos(t) * 5
      light1.intensity = 2.5 + Math.sin(t * 2) * 0.8

      particles.forEach((p) => {
        p.position.x += p.userData.speed.x
        p.position.y += p.userData.speed.y
        p.position.z += p.userData.speed.z
        if (Math.abs(p.position.x) > 20) p.userData.speed.x *= -1
        if (Math.abs(p.position.y) > 10) p.userData.speed.y *= -1
        if (Math.abs(p.position.z) > 15) p.userData.speed.z *= -1
      })

      nodes3d.forEach((n, i) => {
        n.rotation.y += n.userData.rotSpeed
        n.position.y += Math.sin(t + i) * 0.005
        n.material.emissiveIntensity = 0.5 + Math.sin(t * 2 + i) * 0.3
      })

      ring.rotation.z += 0.005
      renderer.render(scene, camera)
    }
    animate()

    function handleResize() {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  return (
    <div className="bg3d">
      <canvas ref={canvasRef} />
      <div className="bg3d-overlay">
        <div className="bg3d-scanline" />
        <div className="bg3d-vignette" />

        <svg className="bg3d-lines" viewBox="0 0 680 600" preserveAspectRatio="none">
          <line x1="60" y1="140" x2="340" y2="300" stroke="#00ff88" strokeWidth=".5" opacity=".6" />
          <line x1="620" y1="155" x2="340" y2="300" stroke="#00ff88" strokeWidth=".5" opacity=".6" />
          <line x1="30" y1="290" x2="340" y2="300" stroke="#00ff88" strokeWidth=".5" opacity=".4" />
          <line x1="650" y1="300" x2="340" y2="300" stroke="#00ff88" strokeWidth=".5" opacity=".4" />
          <line x1="80" y1="430" x2="340" y2="300" stroke="#00ff88" strokeWidth=".5" opacity=".4" />
          <line x1="600" y1="415" x2="340" y2="300" stroke="#00ff88" strokeWidth=".5" opacity=".4" />
        </svg>

        <div className="bg3d-ring" />
        <div className="bg3d-ring" />
        <div className="bg3d-ring" />

        <div className="bg3d-title">
          <div className="bg3d-title-main">SEO Audit</div>
          <div className="bg3d-title-sub">deep analysis engine</div>
        </div>

        <div className="bg3d-gem">
          <div className="bg3d-gem-inner" />
        </div>

        <div className="bg3d-node" style={{ top: '18%', left: '6%' }}>On-page SEO</div>
        <div className="bg3d-node" style={{ top: '22%', right: '5%' }}>Backlinks</div>
        <div className="bg3d-node" style={{ top: '44%', left: '3%' }}>Core Web Vitals</div>
        <div className="bg3d-node" style={{ top: '48%', right: '4%' }}>Crawlability</div>
        <div className="bg3d-node" style={{ top: '68%', left: '8%' }}>Keyword Rank</div>
        <div className="bg3d-node" style={{ top: '66%', right: '7%' }}>Schema Markup</div>

        <div className="bg3d-stats">
          <div className="bg3d-stat">
            <div className="bg3d-stat-val">{stats ? formatStat(stats.seoScore) : '98'}</div>
            <div className="bg3d-stat-lbl">SEO Score</div>
          </div>
          <div className="bg3d-stat">
            <div className="bg3d-stat-val">{stats ? formatStat(stats.keywords) : '1.2K'}</div>
            <div className="bg3d-stat-lbl">Keywords</div>
          </div>
          <div className="bg3d-stat">
            <div className="bg3d-stat-val">{stats ? formatStat(stats.backlinks) : '247'}</div>
            <div className="bg3d-stat-lbl">Backlinks</div>
          </div>
          <div className="bg3d-stat">
            <div className="bg3d-stat-val">{stats ? formatStat(stats.loadTime, 's') : '0.9s'}</div>
            <div className="bg3d-stat-lbl">Load Time</div>
          </div>
          <div className="bg3d-stat">
            <div className="bg3d-stat-val">{stats ? formatStat(stats.pagespeed) : '100'}</div>
            <div className="bg3d-stat-lbl">PageSpeed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
