/*
 * Renders every design-system preview with the freshly built bundle, in the light theme and
 * again in the dark one (data-theme="dark" on <html>). It fails if one throws, draws nothing,
 * or no longer looks like its baseline picture in design-system/baselines/ (light) or
 * design-system/baselines/dark/ (dark). Run after `npm run design-system:build`:
 *
 *   node scripts/design-system/check-previews.cjs            compare with the baselines
 *   node scripts/design-system/check-previews.cjs --update   accept what is drawn now as the baselines
 *   node scripts/design-system/check-previews.cjs --shots <dir>   also save what was drawn (and a diff for each failure)
 *
 * A baseline is the picture of a component as it is meant to look. When a change to the kit
 * moves a pixel it should not (a control a few pixels lower than its neighbour, a lost border),
 * this fails and says which component. When the change is intended, look at the new picture,
 * then run with --update and commit the baselines with the change.
 *
 * Needs Playwright with Chromium (not a project dependency; available in Claude sessions).
 * Baselines depend on the machine's fonts, so make and compare them in the same environment.
 */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const dist = path.resolve(__dirname, '../../.design-system-dist/project');
const baselines = path.resolve(__dirname, '../../design-system/baselines');
const args = process.argv.slice(2);
const update = args.includes('--update');
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : args.find((a) => !a.startsWith('--'));
/** A pixel differs when a colour channel is off by more than this (anti-aliasing noise is below it). */
const CHANNEL_TOLERANCE = 24;
/** A preview fails when more than this share of its pixels differ. */
const MAX_DIFF_RATIO = 0.001;

/** Compares two PNGs in the browser (no image library needed). Returns the share of pixels that differ and a diff picture. */
async function compare(page, a, b) {
  return page.evaluate(
    async ({ a, b, tolerance }) => {
      const load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = 'data:image/png;base64,' + src; });
      const [ia, ib] = await Promise.all([load(a), load(b)]);
      if (ia.width !== ib.width || ia.height !== ib.height) return { ratio: 1, sizeChanged: `${ia.width}x${ia.height} -> ${ib.width}x${ib.height}` };
      const data = (img) => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, img.width, img.height); };
      const da = data(ia), db = data(ib);
      const out = document.createElement('canvas'); out.width = ia.width; out.height = ia.height; const ox = out.getContext('2d'); const od = ox.createImageData(ia.width, ia.height);
      let diff = 0;
      for (let i = 0; i < da.data.length; i += 4) {
        const d = Math.max(Math.abs(da.data[i] - db.data[i]), Math.abs(da.data[i + 1] - db.data[i + 1]), Math.abs(da.data[i + 2] - db.data[i + 2]));
        const changed = d > tolerance; if (changed) diff++;
        // The diff picture: the new drawing faded, changed pixels in red.
        od.data[i] = changed ? 220 : 255 - (255 - db.data[i]) / 4; od.data[i + 1] = changed ? 0 : 255 - (255 - db.data[i + 1]) / 4; od.data[i + 2] = changed ? 0 : 255 - (255 - db.data[i + 2]) / 4; od.data[i + 3] = 255;
      }
      ox.putImageData(od, 0, 0);
      return { ratio: diff / (da.data.length / 4), diff: out.toDataURL('image/png').split(',')[1] };
    },
    { a: a.toString('base64'), b: b.toString('base64'), tolerance: CHANNEL_TOLERANCE },
  );
}

(async () => {
  const css = fs.readFileSync(path.join(dist, 'components/bundle.css'), 'utf8');
  const js = fs.readFileSync(path.join(dist, 'components/bundle.js'), 'utf8');
  const names = fs.readdirSync(path.join(dist, 'components'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 420 } });
  let failed = 0;
  // Every preview is drawn twice: light (baselines/NAME.png) and dark, with data-theme="dark" on
  // <html> as the app's Settings switch sets it (baselines/dark/NAME.png).
  for (const theme of ['light', 'dark']) {
    const themeBaselines = theme === 'light' ? baselines : path.join(baselines, theme);
    for (const name of names) {
      const label = theme === 'light' ? name : `${name} (dark)`;
      const file = path.join(dist, 'components', name, 'preview.html');
      if (!fs.existsSync(file)) { console.log(`- ${label}: no preview`); continue; }
      const errors = [];
      const onError = (e) => errors.push(String(e).split('\n')[0]);
      const onConsole = (m) => { if (m.type() === 'error') errors.push(m.text().split('\n')[0]); };
      page.on('pageerror', onError); page.on('console', onConsole);
      let html = fs.readFileSync(file, 'utf8').replace('<head>', () => `<head><style>${css}</style><script>${js}</script>`); // a function: the bundle holds `$&`-like sequences
      if (theme === 'dark') html = html.replace(/<html(\s|>)/, (m, end) => `<html data-theme="dark"${end}`);
      await page.setContent(html, { waitUntil: 'load' });
      await page.waitForTimeout(250);
      const drawn = await page.evaluate(() => { const r = document.getElementById('root'); return r ? r.childElementCount : document.body.childElementCount; });
      const themed = await page.evaluate(() => document.documentElement.dataset.theme || 'light');
      page.off('pageerror', onError); page.off('console', onConsole);
      let ok = errors.length === 0 && drawn > 0 && themed === theme;
      let note = errors.length ? ': ' + errors[0].slice(0, 160) : !drawn ? ': drew nothing' : themed !== theme ? `: drawn in ${themed}` : '';
      // Spinners and skeletons move: freeze them so two runs draw the same picture.
      await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }' });
      const picture = await page.screenshot();
      const shotName = theme === 'light' ? name : `dark-${name}`;
      if (shots) { fs.mkdirSync(shots, { recursive: true }); fs.writeFileSync(path.join(shots, `${shotName}.png`), picture); }
      const baseline = path.join(themeBaselines, `${name}.png`);
      if (ok && update) {
        fs.mkdirSync(themeBaselines, { recursive: true }); fs.writeFileSync(baseline, picture);
      } else if (ok && !fs.existsSync(baseline)) {
        ok = false; note = ': no baseline picture (run with --update after looking at it)';
      } else if (ok) {
        await page.setContent('<html><body></body></html>');
        const result = await compare(page, fs.readFileSync(baseline), picture);
        if (result.ratio > MAX_DIFF_RATIO) {
          ok = false;
          note = `: looks different from its baseline (${result.sizeChanged ?? (result.ratio * 100).toFixed(2) + '% of pixels'})`;
          if (shots && result.diff) fs.writeFileSync(path.join(shots, `${shotName}.diff.png`), Buffer.from(result.diff, 'base64'));
        }
      }
      if (!ok) failed++;
      console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${note}`);
    }
  }
  await browser.close();
  if (failed) { console.error(`${failed} preview(s) failed`); process.exit(1); }
  console.log(update ? `Baselines updated for ${names.length} previews, light and dark.` : `All ${names.length} previews render and match their baselines, light and dark (${names.length * 2} pictures).`);
})();
