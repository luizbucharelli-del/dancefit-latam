import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const { chromium } = await import(pathToFileURL(process.argv[2]).href);
const browser = await chromium.launch({ channel:'chrome', headless:true });
const page = await browser.newPage({ viewport:{width:390,height:844} });
await page.addInitScript(() => sessionStorage.setItem('dancefit-latam-session-v1', JSON.stringify({ index:0,maxVisited:24,startedAt:Date.now(),answers:{},units:{} })));
try {
  for (const id of ['history','experience','weightStory','proof','duration','event']) {
    await page.goto(`http://127.0.0.1:4173/#${id}`, { waitUntil:'networkidle' });
    await page.locator(`.screen[data-step="${id}"]`).waitFor();
    await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
    if (id === 'history') assert.deepEqual(await page.locator('.choice-icon').allTextContents(), ['🤔','😅','🥹','😌','❌']);
    if (id === 'weightStory') assert.equal(await page.locator('.mini-curve linearGradient').count(), 4);
    if (id === 'proof') {
      assert.match(await page.locator('.news-clipping-image').getAttribute('src'), /etapa09-es/);
      assert.equal(await page.locator('.editorial-image').count(), 0);
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,id);
    await page.screenshot({path:`test-results/referencia-${id}.png`,fullPage:true,animations:'disabled'});
  }
  console.log('Etapa de notícia em espanhol, emojis e quatro traços coloridos verificados em celular.');
} finally { await browser.close(); }
