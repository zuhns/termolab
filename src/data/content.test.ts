import { describe, it, expect } from 'vitest';
import katex from 'katex';
import { lessons, sources } from './lessons';
import { glossary, conceptById } from './glossary';
describe('Integrità del percorso e delle formule',()=>{
 it('espone dieci moduli con esperimenti, ragionamenti e limiti',()=>{
  expect(lessons).toHaveLength(10);expect(new Set(lessons.map(l=>l.id)).size).toBe(10);
  for(const l of lessons){expect(l.intuition.length).toBeGreaterThanOrEqual(3);expect(l.understanding.length).toBeGreaterThanOrEqual(3);expect(l.advanced.length).toBeGreaterThanOrEqual(2);expect(l.math.length).toBeGreaterThanOrEqual(2);expect(l.questions.length).toBeGreaterThan(0);expect(l.limits.length).toBeGreaterThan(60);for(const id of l.sources)expect(sources.some(s=>s.id===id)).toBe(true);}
 });
 it('renderizza ogni formula KaTeX senza recupero silenzioso',()=>{
  for(const l of lessons)for(const s of l.math)expect(()=>katex.renderToString(s.formula,{throwOnError:true})).not.toThrow();
 });
 it('risolve tutti i rimandi del glossario',()=>{
  expect(glossary.length).toBeGreaterThanOrEqual(31);
  for(const c of glossary)for(const id of c.related)expect(conceptById[id]).toBeDefined();
  for(const l of lessons)for(const p of [...l.intuition,...l.understanding,...l.advanced])for(const m of p.matchAll(/\[\[(.*?)(?:\|.*?)?\]\]/g))expect(conceptById[m[1]]).toBeDefined();
 });
 it('rende valido ogni feedback con una risposta ragionata',()=>{
  for(const l of lessons)for(const q of [l.prediction,...l.questions]){expect(q.correct).toBeGreaterThanOrEqual(0);expect(q.correct).toBeLessThan(q.options.length);expect(q.feedback.length).toBeGreaterThan(60);}
 });
});
