import test from 'node:test';
import assert from 'node:assert/strict';
import { profile } from '../dist/logic.js';
import { resolveDeadline, remainingSeconds } from '../dist/offer-clock.js';
test('Different routines generate different four-week plans, within available time', () => {
  const slow = profile({ experience:'beginner',activity:'none',duration:'auto',rhythm:'auto',goals:['weight'],weight:81,target:60 });
  const active = profile({ experience:'advanced',activity:'daily',duration:'30',rhythm:'auto',goals:['dance','fitness'],focus:['legs','arms'],weight:65,target:65 });
  assert.equal(slow.startMinutes,5); assert.equal(slow.days,2); assert.equal(slow.rhythmKey,'light');
  assert.equal(active.startMinutes,30); assert.equal(active.days,4); assert.equal(active.rhythmKey,'energetic');
  assert.equal(active.goals.length,2); assert.equal(active.direction,'maintain');
  assert.notDeepEqual(slow.weeks,active.weeks);
  assert.equal(active.weeks[0].focus,'Brazos'); assert.equal(active.weeks[1].focus,'Piernas');
  assert.ok(slow.weeks.every(w=>w.minutes<=slow.minutes)); assert.equal(slow.weeks.length,4);
});
test('Explicit preferences and limitations are retained, with no automatic progression for pain', () => {
  const p=profile({experience:'advanced',activity:'daily',duration:'30',rhythm:'light',limitations:['knees','back'],goals:['weight'],weight:65,target:80});
  assert.equal(p.rhythmKey,'light'); assert.equal(p.needsReview,true);
  assert.match(p.care,/rodillas/); assert.match(p.care,/espalda/);
  assert.ok(p.weeks.every(w=>w.minutes===5 && w.sessions===2));
  assert.match(p.weightNote,/mayor/);
});
function memory(){ const data=new Map(); return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}; }
test('Deadline persists across visits, never renews after expiration, and uses earliest copy', () => {
  const a=memory(),b=memory(); const base={stores:[a,b],key:'offer',durationMs:600000};
  assert.equal(resolveDeadline({...base,now:1000}),601000);
  assert.equal(resolveDeadline({...base,now:5000}),601000);
  assert.equal(remainingSeconds(601000,1000),600);
  assert.equal(resolveDeadline({...base,now:900000}),601000);
  assert.equal(remainingSeconds(601000,900000),0);
  a.setItem('offer','999999'); assert.equal(resolveDeadline({...base,now:900000}),601000);
  assert.equal(resolveDeadline({...base,stores:[],now:1000}),null);
});
