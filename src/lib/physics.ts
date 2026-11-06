export const OFFSET = 273.15;
function finite(...values: number[]) { if (values.some(v => !Number.isFinite(v))) throw new RangeError('Inserisci numeri finiti.'); }
export function celsiusToKelvin(t: number) { finite(t); if(t < -OFFSET) throw new RangeError('Sotto lo zero assoluto.'); return t + OFFSET; }
export function kelvinToCelsius(t: number) { finite(t); if(t < 0) throw new RangeError('Kelvin negativo nel modello.'); return t - OFFSET; }
export function temperatureDifference(start: number, end: number) { finite(start, end); return end - start; }
export const materials = {
  alluminio: { name: 'Alluminio', alpha: 25e-6, color: '#8ca2a5' },
  acciaio: { name: 'Ferro / acciaio', alpha: 12e-6, color: '#7f929b' },
  rame: { name: 'Rame', alpha: 17e-6, color: '#be805f' },
};
export type Material = keyof typeof materials;
export function linearExpansion(l0: number, alpha: number, dt: number) {
  finite(l0, alpha, dt); if(l0 <= 0 || 1 + alpha * dt <= 0) throw new RangeError('Geometria non fisica.');
  const delta = l0 * alpha * dt; return { delta, length: l0 + delta };
}
export function volumeExpansion(v0: number, beta: number, dt: number) {
  finite(v0, beta, dt); if(v0 <= 0 || 1 + beta * dt <= 0) throw new RangeError('Volume non fisico.');
  const delta = v0 * beta * dt; return { delta, volume: v0 + delta };
}
export function isotropicBeta(alpha: number) { finite(alpha); return 3 * alpha; }
export function equilibrium(a: number, b: number, time: number) {
  finite(a,b,time); if(time < 0 || a < -OFFSET || b < -OFFSET) throw new RangeError('Stato non fisico.');
  const mean = (a+b)/2, decay = Math.exp(-time/3);
  return { a: mean + (a-mean)*decay, b: mean + (b-mean)*decay, mean };
}
export function thermometer(initial: number, bath: number, time: number) {
  finite(initial,bath,time); if(time < 0) throw new RangeError('Tempo negativo.');
  return bath + (initial-bath)*Math.exp(-time/3);
}
// Curva concettuale: NON un adattamento a misure sperimentali. Massimo posto a 4 °C.
export function waterState(t: number) {
  finite(t); if(t<0 || t>20) throw new RangeError('Modello qualitativo valido solo tra 0 e 20 °C.');
  const density = 1 - 0.000006 * (t-4)**2;
  return { density, volume: 1 / density };
}
export function calibrate(level: number, low: number, high: number) {
  finite(level,low,high); if(high <= low) throw new RangeError('Riferimenti non distinti o invertiti.');
  return 100 * (level-low)/(high-low);
}
export function instrumentSignals(t: number) {
  finite(t); return { height: 20+0.8*t, resistance: 100*(1+0.00385*t), pressure: 100*(t+OFFSET)/OFFSET };
}
export const fmt = (v: number, digits = 2) => v.toLocaleString('it-IT', {minimumFractionDigits: digits, maximumFractionDigits: digits});
