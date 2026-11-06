import { describe, it, expect } from 'vitest';
import { celsiusToKelvin, kelvinToCelsius, temperatureDifference, linearExpansion, volumeExpansion, isotropicBeta, materials, waterState, equilibrium, thermometer, calibrate, instrumentSignals } from './physics';
describe('Scale di temperatura', () => {
  it('converte i riferimenti e lo zero assoluto', () => { expect(celsiusToKelvin(0)).toBe(273.15); expect(celsiusToKelvin(-273.15)).toBe(0); expect(kelvinToCelsius(0)).toBe(-273.15); });
  it('conserva gli intervalli senza offset', () => { expect(temperatureDifference(20,30)).toBe(10); expect(temperatureDifference(celsiusToKelvin(20),celsiusToKelvin(30))).toBe(10); });
  it('inverte la conversione anche con valori negativi Celsius', () => { for(const t of [-273.15,-100,0,20,100]) expect(kelvinToCelsius(celsiusToKelvin(t))).toBeCloseTo(t,10); });
  it('rifiuta temperature e numeri fuori modello', () => { expect(()=>celsiusToKelvin(-274)).toThrow(); expect(()=>kelvinToCelsius(-1)).toThrow(); expect(()=>celsiusToKelvin(NaN)).toThrow(); });
});
describe('Dilatazione libera al primo ordine', () => {
  it('calcola 2,5 mm per 2 m di alluminio e 50 K', () => { const r=linearExpansion(2,materials.alluminio.alpha,50); expect(r.delta).toBeCloseTo(.0025,10); expect(r.length).toBeCloseTo(2.0025,10); });
  it('raddoppia con lunghezza e intervallo, dipende dal materiale', () => { expect(linearExpansion(2,12e-6,50).delta).toBeCloseTo(2*linearExpansion(1,12e-6,50).delta); expect(linearExpansion(1,12e-6,100).delta).toBeCloseTo(2*linearExpansion(1,12e-6,50).delta); expect(linearExpansion(1,25e-6,50).delta).toBeGreaterThan(linearExpansion(1,12e-6,50).delta); });
  it('gestisce raffreddamento e variazione nulla', () => { expect(linearExpansion(1,17e-6,0).delta).toBe(0); expect(linearExpansion(1,17e-6,-20).length).toBeLessThan(1); expect(volumeExpansion(1,51e-6,-20).volume).toBeLessThan(1); });
  it('collega beta e alfa solo nel modello isotropo', () => { expect(isotropicBeta(17e-6)).toBeCloseTo(51e-6); const x=17e-6*50; expect(Math.abs((1+x)**3-(1+3*x))).toBeLessThan(3e-6); });
  it('calcola volume e conserva le unità scelte', () => { expect(volumeExpansion(1000,75e-6,50).delta).toBeCloseTo(3.75); });
  it('rifiuta dimensioni impossibili', () => { expect(()=>linearExpansion(0,12e-6,10)).toThrow(); expect(()=>volumeExpansion(-1,1,2)).toThrow(); expect(()=>volumeExpansion(1,1,-2)).toThrow(); });
});
describe('Motori delle simulazioni', () => {
  it('conserva la media con due capacità uguali e converge', () => { for(const t of [0,1,5,12]) { const r=equilibrium(80,20,t); expect(r.a+r.b).toBeCloseTo(100); expect(r.a).toBeGreaterThanOrEqual(50); expect(r.b).toBeLessThanOrEqual(50); } expect(equilibrium(80,20,60).a).toBeCloseTo(50,5); });
  it('il termometro parte dal proprio stato e non supera il bagno', () => { expect(thermometer(20,80,0)).toBe(20); expect(thermometer(20,80,3)).toBeGreaterThan(20); expect(thermometer(20,80,3)).toBeLessThan(80); expect(thermometer(20,0,60)).toBeCloseTo(0,5); });
  it('calibra due punti e il punto medio', () => { expect(calibrate(20,20,120)).toBe(0); expect(calibrate(120,20,120)).toBe(100); expect(calibrate(70,20,120)).toBe(50); expect(()=>calibrate(1,2,2)).toThrow(); });
  it('i tre segnali restituiscono la medesima temperatura', () => { const t=35,s=instrumentSignals(t); expect((s.height-20)/.8).toBeCloseTo(t); expect((s.resistance/100-1)/.00385).toBeCloseTo(t); expect(273.15*(s.pressure/100-1)).toBeCloseTo(t); });
  it('la densità qualitativa cresce fino a 4 e poi diminuisce', () => { expect(waterState(3).density).toBeGreaterThan(waterState(1).density); expect(waterState(4).density).toBe(1); expect(waterState(10).density).toBeLessThan(waterState(4).density); expect(waterState(0).volume).toBeGreaterThan(waterState(4).volume); });
  it('conserva la massa relativa e controlla gli estremi', () => { for(const t of [0,4,20]) { const s=waterState(t); expect(s.density*s.volume).toBeCloseTo(1,12); } expect(()=>waterState(-1)).toThrow(); expect(()=>waterState(21)).toThrow(); expect(()=>equilibrium(0,20,-1)).toThrow(); });
});
