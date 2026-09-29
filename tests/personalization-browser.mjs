import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL(process.argv[2]).href);
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base={age:'50+',experience:'beginner',activity:'none',duration:'10',rhythm:'auto',goals:['weight'],focus:['belly'],body:'extra',dream:'defined',weight:81,target:60,height:174,name:'Elena',limitations:['none']};
async function seed(answers,index=23){await page.evaluate(({answers,index})=>sessionStorage.setItem('dancefit-latam-session-v1',JSON.stringify({index,maxVisited:24,answers,units:{},startedAt:Date.now()})),{answers,index});}
try{
  await page.clock.install();
  await page.goto('http://127.0.0.1:4173'); await seed(base); await page.evaluate(()=>history.replaceState(null,'','#plan')); await page.reload();
  await page.locator('.plan-facts').waitFor(); assert.equal(await page.locator('.plan-facts > div').count(),5); assert.equal(await page.locator('.weekly-plan').count(),0); const beginner=await page.locator('.plan-facts').innerText();
  assert.match(beginner,/5 min/); assert.match(beginner,/Principiante/);
  await page.screenshot({path:'test-results/personal-plan-mobile.png',fullPage:true});
  await seed({...base,experience:'advanced',activity:'daily',duration:'30',rhythm:'energetic',goals:['dance','fitness'],weight:65,target:65}); await page.reload();
  const advanced=await page.locator('.plan-facts').innerText(); assert.notEqual(beginner,advanced); assert.match(advanced,/30 min/);assert.match(advanced,/Aprender a bailar/);
  await page.locator('[data-action=next]').click(); await page.locator('#timer-minutes').waitFor();
  const deadline=await page.evaluate(()=>localStorage.getItem('dancefit-offer-deadline:dancefit-usd990-v1'));
  assert.equal(await page.locator('[data-action=checkout]').first().isEnabled(),true);
  await page.clock.fastForward(120000); await page.reload();
  assert.equal(await page.evaluate(()=>localStorage.getItem('dancefit-offer-deadline:dancefit-usd990-v1')),deadline);
  assert.ok(Number(await page.locator('#timer-minutes').innerText())<=8);
  await page.screenshot({path:'test-results/personal-offer-mobile.png',fullPage:true});
  await page.clock.fastForward(481000);
  assert.equal(await page.locator('#timer-minutes').innerText(),'00');assert.equal(await page.locator('#timer-seconds').innerText(),'00');
  for(const button of await page.locator('[data-action=checkout]').all()) assert.equal(await button.isDisabled(),true);
  await page.reload();assert.equal(await page.locator('[data-action=checkout]').first().isDisabled(),true);
  await page.locator('#back').click();await page.locator('[data-action=next]').click();assert.equal(await page.locator('[data-action=checkout]').last().isDisabled(),true);
  await page.setViewportSize({width:320,height:740});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  await page.screenshot({path:'test-results/offer-expired.png',fullPage:true});
  await seed(base,21);await page.evaluate(()=>history.replaceState(null,'','#loading2'));await page.reload();
  assert.match(await page.locator('.testimonials').innerText(),/A tu ritmo/); assert.doesNotMatch(await page.locator('.testimonials').innerText(),/ficticio|Lucía|Carmen/); assert.equal(await page.locator('.stars').count(),0);
  assert.deepEqual(errors,[]); console.log('PASS: distinct profiles, five compact cards, benefit cards, persistence, real expiry, reload/back, mobile layout');
}finally{await browser.close();}
