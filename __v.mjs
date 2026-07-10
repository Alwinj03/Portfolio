import { chromium } from 'playwright-core'
const OUT = '/tmp/claude-0/-home-user-Portfolio/b3a3ea33-3879-5ca7-9c5d-56f0a7894994/scratchpad'
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const ctx = await browser.newContext({ viewport: { width: 1366, height: 850 } })
const page = await ctx.newPage()
await page.addInitScript(() => Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 }))
await page.goto(process.env.URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4000)
await page.screenshot({ path: `${OUT}/hero-text.png` })
await browser.close()
