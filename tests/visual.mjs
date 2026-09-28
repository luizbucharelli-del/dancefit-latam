import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const { chromium } = await import(pathToFileURL(process.argv[2]).href);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const steps = ['age','goals','body','dream','welcome','focus','history','experience','weightStory','proof','activity','duration','rhythm','loading1','event','limitations','height','weight','target','summary','name','loading2','projection','plan','offer'];
await page.addInitScript(() => sessionStorage.setItem('dancefit-latam-session-v1', JSON.stringify({ index: 0, maxVisited: 24, startedAt: Date.now(), units: {}, answers: { age:'40-49',goals:['weight','dance'],body:'extra',dream:'defined',focus:['belly','legs'],history:'three-plus',experience:'intermediate',weightStory:'varies',activity:'weekly',duration:'30',rhythm:'energetic',event:'beach',limitations:['knees'],height:174,weight:81,target:60,name:'Ana' } })));
try {
  for (const id of ['age','goals','body','welcome','proof','height','summary','projection','plan','offer']) {
    await page.goto(`http://127.0.0.1:4173/#${id}`, { waitUntil:'networkidle' });
    await page.locator(`.screen[data-step="${id}"]`).waitFor();
    await page.screenshot({ path:`test-results/${id}-mobile.png`, fullPage:true, animations:'disabled' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, id);
  }
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await page.screenshot({ path:`test-results/offer-${width}.png`, fullPage:true, animations:'disabled' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `offer-${width}`);
  }
  await page.setViewportSize({ width:390, height:844 });
  for (const id of ['age', 'goals', 'height', 'summary', 'offer']) {
    await page.goto(`http://127.0.0.1:4173/#${id}`, { waitUntil:'networkidle' });
    await page.addStyleTag({ content: ':root{font-size:32px!important}' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    if (overflow) {
      const nodes = await page.locator('body *').evaluateAll(nodes => nodes.filter(n => n.getBoundingClientRect().right > innerWidth + 1).map(n => ({ tag:n.tagName, cls:n.className, width:n.getBoundingClientRect().width })).slice(0,15));
      console.log(JSON.stringify({ zoomOverflow:id,nodes }));
    }
    assert.equal(overflow, false, `${id} 200% fonte`);
  }
  console.log('Visual: capturas atualizadas, 320/390/1440 px e texto a 200% sem overflow.');
} finally { await browser.close(); }
