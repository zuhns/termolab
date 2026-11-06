// @vitest-environment jsdom
import { Activity, act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { Simulation } from "./Simulations";
import { MotionContext } from "./Shared";
import { useExperimentClock } from "../lib/useExperimentClock";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;
let root: Root, host: HTMLDivElement;
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  vi.stubGlobal("scrollTo", vi.fn());
  Element.prototype.scrollIntoView = vi.fn();
  window.history.replaceState({}, "", "/#/lezione/lineare");
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
const shown = (e: Element) => !e.closest('[style*="display: none"]');
function find<T extends Element>(selector: string): T {
  const node = [...host.querySelectorAll<T>(selector)].find(shown);
  if (!node) throw new Error(`Controllo non trovato: ${selector}`);
  return node;
}
async function click(text: string, role?: string) {
  const candidates = [
    ...host.querySelectorAll<HTMLButtonElement>(
      role ? `[role="${role}"]` : "button",
    ),
  ];
  const node = candidates.find(
    (e) => shown(e) && e.textContent?.trim().endsWith(text),
  );
  if (!node) throw new Error(`Pulsante non trovato: ${text}`);
  await act(async () => node.click());
}
async function input(label: string, value: string) {
  const node = find<HTMLInputElement>(`input[aria-label="${label}"]`);
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!.call(node, value);
    node.dispatchEvent(new Event("input", { bubbles: true }));
    node.dispatchEvent(new Event("change", { bubbles: true }));
  });
}
async function select(value: string) {
  const node = find<HTMLSelectElement>("select");
  await act(async () => {
    node.value = value;
    node.dispatchEvent(new Event("change", { bubbles: true }));
  });
}
async function renderApp(id = "lineare") {
  window.history.replaceState({}, "", `/#/lezione/${id}`);
  await act(async () => root.render(<App />));
}
describe("Regressioni degli esperimenti", () => {
  it("conserva parametri, materiale e vista grafica passando alla matematica", async () => {
    await renderApp();
    await input("Lunghezza iniziale", "5");
    await select("rame");
    await click("ΔL in funzione di ΔT");
    await click("La matematica", "tab");
    await click("Esplora", "tab");
    expect(
      find<HTMLInputElement>('input[aria-label="Lunghezza iniziale"]').value,
    ).toBe("5");
    expect(find<HTMLSelectElement>("select").value).toBe("rame");
    expect(find<SVGElement>(".chart svg").getAttribute("aria-label")).toContain(
      "Allungamento",
    );
  });
  it("mantiene la previsione quando si torna alla lezione", async () => {
    await renderApp();
    await click("Quella da 2 m, circa il doppio");
    await click("Comprendi", "tab");
    await click("Esplora", "tab");
    expect(
      find<HTMLElement>('.quiz [aria-pressed="true"]').textContent,
    ).toContain("Quella da 2 m");
  });
  it("mantiene gli esperimenti distinti nel laboratorio finale", async () => {
    await renderApp("laboratorio");
    await input("Lunghezza iniziale", "5");
    await select("acqua");
    await input("Temperatura dell’acqua liquida", "12");
    await select("lineare");
    expect(
      find<HTMLInputElement>('input[aria-label="Lunghezza iniziale"]').value,
    ).toBe("5");
    await select("acqua");
    expect(
      find<HTMLInputElement>(
        'input[aria-label="Temperatura dell’acqua liquida"]',
      ).value,
    ).toBe("12");
  });
  it("ripristina realmente i valori dopo un cambio di parametro", async () => {
    await act(async () => root.render(<Simulation id="lineare" />));
    await input("Lunghezza iniziale", "5");
    await select("rame");
    await click("Ripristina");
    expect(
      find<HTMLInputElement>('input[aria-label="Lunghezza iniziale"]').value,
    ).toBe("2");
    expect(find<HTMLSelectElement>("select").value).toBe("alluminio");
    expect(find<HTMLElement>(".stats").textContent).toContain("2,500 mm");
  });
  it("rende visibile la diversa pendenza senza riadattare gli assi al materiale", async () => {
    await act(async () => root.render(<Simulation id="lineare" />));
    const endY = () =>
      Number(
        find<SVGPolylineElement>(".chart polyline")
          .getAttribute("points")!
          .trim()
          .split(" ")
          .at(-1)!
          .split(",")[1],
      );
    const original = endY();
    await select("acciaio");
    expect(Math.abs(endY() - original)).toBeGreaterThan(10);
  });
  it("mostra le contrazioni del liquido e del recipiente con segno negativo", async () => {
    await act(async () => root.render(<Simulation id="volumica" />));
    await input("Variazione di temperatura", "-40");
    expect(find<HTMLElement>(".liquid-lab .stats").textContent).toContain(
      "-44,00 mL",
    );
    expect(find<HTMLElement>(".liquid-lab .stats").textContent).toContain(
      "-1,20 mL",
    );
  });
  it("converte senza sostituire il campo che l’utente sta usando", async () => {
    await act(async () => root.render(<Simulation id="conversioni" />));
    const c = find<HTMLInputElement>(".numeric-inputs input");
    await act(async () => c.focus());
    await act(async () => {
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )!.set!.call(c, "30,5");
      c.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => c.blur());
    expect(find<HTMLInputElement>(".numeric-inputs input")).toBe(c);
    expect(c.value).toBe("30,50");
    expect(
      find<HTMLElement>(".numeric-inputs").querySelectorAll("input")[1].value,
    ).toBe("303,65");
  });
  it("rifiuta un kelvin negativo senza lasciare letture incoerenti", async () => {
    await act(async () => root.render(<Simulation id="conversioni" />));
    const k = find<HTMLElement>(".numeric-inputs").querySelectorAll("input")[1];
    await act(async () => k.focus());
    await act(async () => {
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )!.set!.call(k, "-1");
      k.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => k.blur());
    expect(host.querySelector('[role="alert"]')?.textContent).toContain(
      "ultimo valore valido",
    );
    expect(k.value).toBe("293,15");
    expect(
      find<HTMLInputElement>('input[aria-label="Punto sulla retta"]').value,
    ).toBe("20");
  });
});
function ClockProbe() {
  const clock = useExperimentClock();
  return (
    <>
      <output>{clock.time}</output>
      <button onClick={clock.toggle}>
        {clock.complete ? "Ripeti" : clock.running ? "Pausa" : "Avvia"}
      </button>
    </>
  );
}
describe("Avvio, pausa e completamento", () => {
  it("avanza anche quando le particelle sono sospese", async () => {
    vi.useFakeTimers();
    await act(async () =>
      root.render(
        <MotionContext.Provider value={false}>
          <ClockProbe />
        </MotionContext.Provider>,
      ),
    );
    await click("Avvia");
    await act(async () => vi.advanceTimersByTime(1000));
    expect(host.querySelector("output")!.textContent).toBe("1");
    await click("Pausa");
    await act(async () => vi.advanceTimersByTime(1000));
    expect(host.querySelector("output")!.textContent).toBe("1");
  });
  it("termina esattamente al limite e riparte con un solo clic", async () => {
    vi.useFakeTimers();
    await act(async () => root.render(<ClockProbe />));
    await click("Avvia");
    await act(async () => vi.advanceTimersByTime(20000));
    expect(host.querySelector("output")!.textContent).toBe("18");
    await click("Ripeti");
    expect(host.querySelector("output")!.textContent).toBe("0");
    await act(async () => vi.advanceTimersByTime(500));
    expect(host.querySelector("output")!.textContent).toBe("0.5");
  });
  it("conserva il tempo e sospende il timer quando il pannello è nascosto", async () => {
    vi.useFakeTimers();
    await act(async () =>
      root.render(
        <Activity mode="visible">
          <ClockProbe />
        </Activity>,
      ),
    );
    await click("Avvia");
    await act(async () => vi.advanceTimersByTime(1000));
    await act(async () =>
      root.render(
        <Activity mode="hidden">
          <ClockProbe />
        </Activity>,
      ),
    );
    await act(async () => vi.advanceTimersByTime(5000));
    expect(host.querySelector("output")!.textContent).toBe("1");
    await act(async () =>
      root.render(
        <Activity mode="visible">
          <ClockProbe />
        </Activity>,
      ),
    );
    await act(async () => vi.advanceTimersByTime(500));
    expect(host.querySelector("output")!.textContent).toBe("1.5");
  });
});
