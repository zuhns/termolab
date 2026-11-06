import { Activity, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Atom,
  Beaker,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  ExternalLink,
  FlaskConical,
  GitBranch,
  Lightbulb,
  Menu,
  MoveRight,
  Pause,
  Play,
  Search,
  Sparkles,
  Thermometer,
  X,
} from "lucide-react";
import { lessons, sources } from "./data/lessons";
import type { Lesson } from "./data/lessons";
import { conceptById, glossary } from "./data/glossary";
import {
  Disclosure,
  Formula,
  GlossaryContext,
  MotionContext,
  Quiz,
  Rich,
} from "./components/Shared";
import { Simulation, ThermometerDrawing } from "./components/Simulations";

function loadProgress(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem("termolab-progress") || "[]");
    return Array.isArray(v)
      ? v.filter(
          (x: unknown) =>
            typeof x === "string" && lessons.some((l) => l.id === x),
        )
      : [];
  } catch {
    return [];
  }
}
function getRoute() {
  return window.location.hash.slice(1) || "/";
}
export default function App() {
  const [route, setRoute] = useState(getRoute),
    [progress, setProgress] = useState<string[]>(loadProgress),
    [menu, setMenu] = useState(false),
    [history, setHistory] = useState<string[]>([]),
    [motion, setMotion] = useState(
      () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [storageWarning, setStorageWarning] = useState(false);
  const glossaryTrigger = useRef<HTMLElement | null>(null),
    main = useRef<HTMLElement>(null);
  useEffect(() => {
    const change = () => {
      setRoute(getRoute());
      setMenu(false);
      setHistory([]);
      window.scrollTo(0, 0);
      window.setTimeout(() => main.current?.focus(), 0);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  const mark = (id: string) => {
    setProgress((p) => {
      const next = p.includes(id) ? p : [...p, id];
      try {
        localStorage.setItem("termolab-progress", JSON.stringify(next));
      } catch {
        setStorageWarning(true);
      }
      return next;
    });
  };
  const open = (id: string, trigger?: HTMLElement) => {
    if (!conceptById[id]) return;
    if (history.length === 0)
      glossaryTrigger.current =
        trigger || (document.activeElement as HTMLElement);
    setHistory((h) => [...h.slice(-4), id]);
  };
  useEffect(() => {
    if (history.length === 0) glossaryTrigger.current?.focus();
  }, [history.length]);
  const close = () => {
    setHistory([]);
  };
  const current = route.startsWith("/lezione/")
    ? lessons.find((l) => l.id === route.split("/")[2])
    : undefined;
  const count = progress.length,
    percent = Math.round((count / lessons.length) * 100);
  const resetProgress = () => {
    try {
      localStorage.removeItem("termolab-progress");
      setProgress([]);
    } catch {
      setStorageWarning(true);
    }
  };
  return (
    <MotionContext.Provider value={motion}>
      <GlossaryContext.Provider value={open}>
        <a
          className="skip-link"
          href="#main-content"
          onClick={(e) => {
            e.preventDefault();
            main.current?.focus();
          }}
        >
          Vai al contenuto
        </a>
        <div className="app-shell">
          <aside
            className={"sidebar " + (menu ? "mobile-open" : "")}
            aria-label="Navigazione principale"
            onKeyDown={(e) => {
              if (e.key === "Escape") setMenu(false);
            }}
          >
            <a className="brand" href="#/">
              <span className="brand-mark">
                <FlaskConical size={22} />
              </span>
              termo<span>lab</span>
            </a>
            <button
              className="mobile-close icon-button"
              aria-label="Chiudi navigazione"
              onClick={() => setMenu(false)}
            >
              <X size={20} />
            </button>
            <p className="sidebar-caption">
              PICCOLE DOMANDE.
              <br />
              GRANDI SCOPERTE.
            </p>
            <nav>
              <a
                href="#/"
                className={"nav-main " + (route === "/" ? "active" : "")}
              >
                <Compass size={18} />
                Il tuo percorso
              </a>
              <a
                href="#/mappa"
                className={"nav-main " + (route === "/mappa" ? "active" : "")}
              >
                <GitBranch size={18} />
                Mappa delle idee
              </a>
              <a
                href="#/glossario"
                className={
                  "nav-main " + (route === "/glossario" ? "active" : "")
                }
              >
                <BookOpen size={18} />
                Dizionario dei concetti
              </a>
              <div className="nav-divider" />
              <p className="nav-label">IL PERCORSO</p>
              {lessons.map((l, i) => (
                <a
                  key={l.id}
                  href={`#/lezione/${l.id}`}
                  className={
                    "lesson-link " + (current?.id === l.id ? "active" : "")
                  }
                  aria-current={current?.id === l.id ? "page" : undefined}
                >
                  <span
                    className={
                      "lesson-number " + (progress.includes(l.id) ? "done" : "")
                    }
                  >
                    {progress.includes(l.id) ? (
                      <Check size={12} />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  <span>{l.short}</span>
                  {current?.id === l.id && <i />}
                </a>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="progress-caption">
                <span>La tua esplorazione</span>
                <strong>{count}/10</strong>
              </div>
              <div
                className="progress-bar"
                role="progressbar"
                aria-label="Lezioni completate"
                aria-valuemin={0}
                aria-valuemax={10}
                aria-valuenow={count}
              >
                <i style={{ width: `${percent}%` }} />
              </div>
              <p>Un concetto alla volta.</p>
              <a href="#/fonti" className="source-link">
                Fonti e modelli <ExternalLink size={12} />
              </a>
            </div>
          </aside>
          {menu && (
            <button
              className="sidebar-shade"
              aria-label="Chiudi navigazione"
              onClick={() => setMenu(false)}
            />
          )}
          <div className="main-shell">
            <header className="topbar">
              <div>
                <button
                  className="icon-button menu-button"
                  onClick={() => setMenu(true)}
                  aria-label="Apri navigazione"
                  aria-expanded={menu}
                >
                  <Menu size={21} />
                </button>
                <span>IL LABORATORIO DELLA COMPRENSIONE</span>
              </div>
              <div className="topbar-right">
                <button
                  className="motion-toggle"
                  title="Controlla il moto delle particelle. Il tempo dell’esperimento ha comandi Avvia e Pausa nel laboratorio."
                  aria-pressed={motion}
                  onClick={() => setMotion((v) => !v)}
                >
                  {motion ? <Pause size={14} /> : <Play size={14} />}
                  <span>
                    {motion ? "Pausa particelle" : "Attiva particelle"}
                  </span>
                </button>
                <span className="italian-label">
                  <i />
                  100% in italiano
                </span>
              </div>
            </header>
            <main id="main-content" tabIndex={-1} ref={main}>
              {storageWarning && (
                <p className="storage-warning" role="status">
                  Il browser non consente il salvataggio locale. Puoi continuare
                  a esplorare; i progressi restano in questa sessione.
                </p>
              )}
              {route === "/" ? (
                <Home progress={progress} />
              ) : current ? (
                <LessonPage
                  key={current.id}
                  lesson={current}
                  index={lessons.indexOf(current)}
                  complete={progress.includes(current.id)}
                  onComplete={() => mark(current.id)}
                />
              ) : route === "/glossario" ? (
                <Dictionary />
              ) : route === "/mappa" ? (
                <ConceptMap />
              ) : route === "/fonti" ? (
                <Sources onReset={resetProgress} progressCount={count} />
              ) : (
                <div className="page">
                  <h1>Questo banco non esiste.</h1>
                  <a href="#/" className="btn primary">
                    Torna al percorso
                  </a>
                </div>
              )}
            </main>
            <footer className="footer">
              <a className="footer-brand" href="#/">
                termo<span>lab</span>
              </a>
              <p>La curiosità è già un buon punto di partenza.</p>
              <a
                href="https://github.com/zuhns/termolab"
                target="_blank"
                rel="noreferrer"
              >
                Il progetto su GitHub <ExternalLink size={12} />
              </a>
            </footer>
          </div>
        </div>
        {history.length > 0 && (
          <GlossaryPanel
            history={history}
            open={open}
            back={() => setHistory((h) => h.slice(0, -1))}
            close={close}
          />
        )}
      </GlossaryContext.Provider>
    </MotionContext.Provider>
  );
}
function Home({ progress }: { progress: string[] }) {
  const next = lessons.find((l) => !progress.includes(l.id)) || lessons[9];
  return (
    <div className="page home">
      <div className="page-kicker">
        <span className="tiny-line" />
        BENVENUTA NEL TUO LABORATORIO
      </div>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-badge">
            <span />
            LA FISICA, FINALMENTE, HA SENSO.
          </span>
          <h1>
            Non una formula
            <br />
            da ricordare.
            <br />
            <em>Un mondo da capire.</em>
          </h1>
          <p>
            Perché il liquido sale nel termometro?
            <br />
            Perché una barra si allunga? Parti da una domanda,
            <br className="wide-only" /> sperimenta e trova il tuo «ah, ecco
            perché!».
          </p>
          <a href={`#/lezione/${next.id}`} className="btn hero-button">
            {progress.length
              ? "Continua a esplorare"
              : "Comincia da una domanda"}
            <ArrowRight size={18} />
          </a>
          <div className="hero-foot">
            <span>
              <Beaker size={14} />
              Esperimenti interattivi
            </span>
            <span>
              <BookOpen size={14} />
              Nessun prerequisito
            </span>
          </div>
        </div>
        <div className="hero-art">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <span className="art-index">ESPERIMENTO N° 02</span>
          <ThermometerDrawing hero temperature={35} />
          <div className="floating-reading">
            <i />
            <strong>
              35,0 <small>°C</small>
            </strong>
            <span>
              un piccolo cambiamento,
              <br />
              reso visibile.
            </span>
          </div>
          <span className="art-note">OSSERVA. DOMANDATI. COMPRENDI.</span>
          <span className="art-cross cross-a">+</span>
          <span className="art-cross cross-b">+</span>
        </div>
      </section>
      <div className="approach-strip">
        <span>
          <i>01</i>Prima, <strong>prevedi.</strong>
        </span>
        <MoveRight size={19} />
        <span>
          <i>02</i>Poi, <strong>sperimenta.</strong>
        </span>
        <MoveRight size={19} />
        <span>
          <i>03</i>Infine, <strong>collega le idee.</strong>
        </span>
      </div>
      <section className="path-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DALLA CURIOSITÀ ALLA COMPRENSIONE</p>
            <h2>Un percorso, dieci scoperte.</h2>
          </div>
          <span className="lesson-count">10 lezioni · al tuo ritmo</span>
        </div>
        <div className="lesson-cards">
          {lessons.map((l, i) => (
            <a
              href={`#/lezione/${l.id}`}
              key={l.id}
              className={
                "lesson-card " + (progress.includes(l.id) ? "completed" : "")
              }
            >
              <div className="card-top">
                <span className="card-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`card-icon type-${i % 4}`}>
                  {i < 2 ? (
                    <Thermometer size={27} />
                  ) : i < 6 ? (
                    <Compass size={27} />
                  ) : i < 8 ? (
                    <Atom size={27} />
                  ) : i === 8 ? (
                    <Beaker size={27} />
                  ) : (
                    <FlaskConical size={27} />
                  )}
                </span>
                {progress.includes(l.id) && (
                  <CheckCircle2 size={18} className="card-check" />
                )}
              </div>
              <p className="card-tag">{l.tag}</p>
              <h3>{l.short}</h3>
              <p className="card-question">{l.question}</p>
              <div className="card-bottom">
                <span>{l.minutes} min circa</span>
                <span className="card-arrow">
                  <ArrowRight size={18} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="why-banner">
        <span className="why-symbol">?</span>
        <div>
          <p className="eyebrow">LA DOMANDA PIÙ IMPORTANTE</p>
          <h2>Qui puoi sempre chiedere: «Ma perché?»</h2>
          <p>
            Ogni concetto apre una porta. Esplora le parole, segui i
            collegamenti
            <br className="wide-only" /> e torna alla lezione senza perdere il
            filo.
          </p>
        </div>
        <a className="btn secondary" href="#/glossario">
          Esplora il dizionario <ArrowRight size={16} />
        </a>
      </section>
      <div className="bottom-note">
        <Sparkles size={16} />
        <p>
          Il tuo progresso si salva su questo dispositivo. Nessun account,
          nessuna fretta.
        </p>
      </div>
    </div>
  );
}
const stages = ["Esplora", "Comprendi", "La matematica", "Mettiti alla prova"];
function LessonPage({
  lesson: l,
  index,
  complete,
  onComplete,
}: {
  lesson: Lesson;
  index: number;
  complete: boolean;
  onComplete: () => void;
}) {
  const [stage, setStage] = useState(0),
    [level, setLevel] = useState(0),
    [why, setWhy] = useState(false),
    [step, setStep] = useState(0);
  const stageTop = useRef<HTMLDivElement>(null);
  const changeStage = (n: number) => {
    setStage(n);
    window.setTimeout(
      () =>
        stageTop.current?.scrollIntoView({
          block: "start",
          behavior: "instant",
        }),
      0,
    );
  };
  return (
    <article className="page lesson-page">
      <div className="breadcrumb">
        <a href="#/">Il tuo percorso</a>
        <ChevronRight size={13} />
        <span>Scoperta {String(index + 1).padStart(2, "0")}</span>
        {complete && (
          <span className="completed-badge">
            <Check size={12} />
            Esplorata
          </span>
        )}
      </div>
      <div className="lesson-intro">
        <p className="eyebrow">
          {l.tag} <span>· {l.minutes} MIN CIRCA</span>
        </p>
        <h1>{l.title}</h1>
        <p className="guide-question">{l.question}</p>
        <p className="intro-text">
          <Rich text={l.intro} />
        </p>
      </div>
      <div
        className="lesson-stages"
        ref={stageTop}
        role="tablist"
        aria-label="Fasi della lezione"
      >
        {stages.map((s, i) => (
          <button
            key={s}
            id={`stage-tab-${i}`}
            role="tab"
            aria-selected={stage === i}
            aria-controls={`stage-panel-${i}`}
            tabIndex={stage === i ? 0 : -1}
            onKeyDown={(e) => {
              if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const n =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 3
                      : (i + (e.key === "ArrowRight" ? 1 : 3)) % 4;
                setStage(n);
                document.getElementById(`stage-tab-${n}`)?.focus();
              }
            }}
            onClick={() => setStage(i)}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {s}
          </button>
        ))}
      </div>
      <div className="lesson-panels">
        <Activity mode={stage === 0 ? "visible" : "hidden"}>
          <div id="stage-panel-0" role="tabpanel" aria-labelledby="stage-tab-0">
            <>
              <Quiz key={l.id + "prediction"} question={l.prediction} small />
              <div className="experiment-heading">
                <div>
                  <p className="eyebrow">POI, SPERIMENTA</p>
                  <h2>Che cosa succede se…?</h2>
                </div>
                <span>
                  <Beaker size={16} />
                  Tocca, cambia, osserva.
                </span>
              </div>
              <Simulation id={l.id} />
              <div className="post-sim">
                <Lightbulb size={21} />
                <div>
                  <strong>Prima i risultati, poi il perché.</strong>
                  <p>
                    Prova almeno due condizioni diverse. Che cosa è rimasto
                    uguale? Quale grandezza è cambiata?
                  </p>
                </div>
                <button
                  className="btn secondary"
                  onClick={() => {
                    setStage(1);
                    setWhy(true);
                    setLevel(1);
                  }}
                >
                  Ma perché? <ArrowRight size={15} />
                </button>
              </div>
            </>
          </div>
        </Activity>
        <Activity mode={stage === 1 ? "visible" : "hidden"}>
          <div id="stage-panel-1" role="tabpanel" aria-labelledby="stage-tab-1">
            <div className="reading-panel">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">ORA, COLLEGA LE IDEE</p>
                  <h2>Dal «che cosa» al «perché».</h2>
                </div>
                <span className="micro-badge">
                  <Atom size={15} />
                  Dal macro al micro
                </span>
              </div>
              <div
                className="explanation-levels"
                aria-label="Profondità della spiegazione"
              >
                {["Intuizione", "Comprensione", "Approfondimento"].map(
                  (s, i) => (
                    <button
                      key={s}
                      aria-pressed={level === i}
                      onClick={() => setLevel(i)}
                    >
                      <span>{i + 1}</span>
                      {s}
                    </button>
                  ),
                )}
              </div>
              <div className="reading-prose">
                {[l.intuition, l.understanding, l.advanced][level].map(
                  (p, i) => (
                    <p key={i}>
                      <Rich text={p} />
                    </p>
                  ),
                )}
              </div>
              <button
                className="btn why-button"
                aria-expanded={why}
                onClick={() => setWhy((v) => !v)}
              >
                <Lightbulb size={18} />
                Ma perché?
              </button>
              {why && (
                <div className="why-explanation">
                  <p className="eyebrow">UN PASSO PIÙ A FONDO</p>
                  <p>
                    <Rich
                      text={level === 0 ? l.understanding[0] : l.advanced[0]}
                    />
                  </p>
                  <p className="muted">
                    Le parole evidenziate aprono il dizionario. Puoi seguire i
                    collegamenti e poi tornare qui.
                  </p>
                </div>
              )}
              <Disclosure title="Quale ipotesi stiamo facendo?" open>
                <Rich text={l.limits} />
              </Disclosure>
              <div className="takeaway">
                <span>IL FILO DA TENERE</span>
                <p>{l.takeaway}</p>
              </div>
            </div>
          </div>
        </Activity>
        <Activity mode={stage === 2 ? "visible" : "hidden"}>
          <div id="stage-panel-2" role="tabpanel" aria-labelledby="stage-tab-2">
            <section className="math-panel">
              <p className="eyebrow">NESSUN PASSAGGIO È SCONTATO</p>
              <h2>La formula nasce da un ragionamento.</h2>
              <p className="intro-text">
                Cerchiamo una relazione fra le grandezze che hai osservato. Apri
                un passaggio alla volta, oppure leggili tutti.
              </p>
              <div className="math-step-list">
                {l.math.slice(0, step + 1).map((s, i) => (
                  <div className="math-step" key={i}>
                    <span className="step-index">{i + 1}</span>
                    <div>
                      <h3>{s.title}</h3>
                      <Formula formula={s.formula} />
                      <p>{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="math-actions">
                {step < l.math.length - 1 && (
                  <button
                    className="btn primary"
                    onClick={() => setStep((n) => n + 1)}
                  >
                    Il prossimo passaggio <ArrowDown size={16} />
                  </button>
                )}
                <button
                  className="btn secondary"
                  onClick={() =>
                    setStep(step === l.math.length - 1 ? 0 : l.math.length - 1)
                  }
                >
                  {step === l.math.length - 1
                    ? "Ricomincia dal primo"
                    : "Mostra tutti i passaggi"}
                </button>
                <span>
                  {Math.min(step + 1, l.math.length)}/{l.math.length} passaggi
                </span>
              </div>
              <Disclosure title="Che cosa significa ogni simbolo?" open>
                <p>{l.symbols}</p>
              </Disclosure>
              <Disclosure title="Mostrami un esempio numerico" open>
                <p>{l.example}</p>
              </Disclosure>
              <Disclosure title="Quando vale? Le ipotesi del modello">
                <p>{l.limits}</p>
              </Disclosure>
              <Disclosure title="Quando questa relazione non è appropriata?">
                <p>{l.counter}</p>
              </Disclosure>
              <button className="btn text-link" onClick={() => changeStage(0)}>
                Ritorna al laboratorio e verifica <ArrowRight size={16} />
              </button>
            </section>
          </div>
        </Activity>
        <Activity mode={stage === 3 ? "visible" : "hidden"}>
          <div id="stage-panel-3" role="tabpanel" aria-labelledby="stage-tab-3">
            <section className="practice-panel">
              <p className="eyebrow">NON RICORDARE: PROVA A SPIEGARE</p>
              <h2>Una situazione nuova. La tua comprensione.</h2>
              <p className="intro-text">
                Scegli una previsione, leggi il ragionamento e prova a dirlo con
                parole tue. Puoi cambiare risposta senza perdere il tuo
                percorso.
              </p>
              {l.questions.map((q, i) => (
                <Quiz key={l.id + i} question={q} />
              ))}
              <div className="takeaway">
                <span>COLLEGHIAMO I PUNTI</span>
                <p>{l.takeaway}</p>
              </div>
              <button
                className="btn primary complete-button"
                onClick={onComplete}
              >
                <CheckCircle2 size={17} />
                {complete
                  ? "Scoperta segnata come esplorata"
                  : "Ho capito: segna come esplorata"}
              </button>
              {complete && (
                <p role="status" className="saved">
                  Questa scoperta è nel tuo percorso. Puoi tornare a
                  sperimentare quando vuoi.
                </p>
              )}
            </section>
          </div>
        </Activity>
      </div>
      <div className="stage-navigation">
        {stage > 0 ? (
          <button
            className="btn secondary"
            onClick={() => changeStage(stage - 1)}
          >
            <ArrowLeft size={15} />
            {stages[stage - 1]}
          </button>
        ) : (
          <a className="text-link" href="#/">
            Torna al percorso
          </a>
        )}
        {stage < 3 ? (
          <button
            className="btn primary"
            onClick={() => changeStage(stage + 1)}
          >
            {stages[stage + 1]}
            <ArrowRight size={16} />
          </button>
        ) : index < 9 ? (
          <a
            className="btn primary"
            href={`#/lezione/${lessons[index + 1].id}`}
          >
            La prossima scoperta <ArrowRight size={16} />
          </a>
        ) : (
          <a className="btn primary" href="#/mappa">
            La mappa delle tue idee <GitBranch size={16} />
          </a>
        )}
      </div>
      <div className="lesson-sources">
        <span>Per approfondire:</span>
        {l.sources.map((id) => {
          const s = sources.find((s) => s.id === id);
          return (
            s && (
              <a key={id} href={s.url} target="_blank" rel="noreferrer">
                {s.name}
                <ExternalLink size={11} />
              </a>
            )
          );
        })}
      </div>
    </article>
  );
}
function GlossaryPanel({
  history,
  open,
  back,
  close,
}: {
  history: string[];
  open: (id: string) => void;
  back: () => void;
  close: () => void;
}) {
  const c = conceptById[history[history.length - 1]],
    panel = useRef<HTMLDivElement>(null),
    closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeButton.current?.focus();
  }, [c.id]);
  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, []);
  return (
    <div className="glossary-overlay" onClick={close}>
      <div
        className="glossary-panel"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="concept-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            close();
          }
          if (e.key === "Tab") {
            const focus =
              panel.current?.querySelectorAll<HTMLElement>("button,a[href]");
            if (!focus?.length) return;
            const first = focus[0],
              last = focus[focus.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <header>
          <span>
            <BookOpen size={16} />
            IL DIZIONARIO, QUI ACCANTO
          </span>
          <button
            className="icon-button"
            aria-label="Chiudi definizione"
            ref={closeButton}
            onClick={close}
          >
            <X size={20} />
          </button>
        </header>
        <div className="glossary-body">
          {history.length > 1 && (
            <button className="text-link back-definition" onClick={back}>
              <ArrowLeft size={15} />
              Torna a {conceptById[history[history.length - 2]].name}
            </button>
          )}
          <p className="eyebrow">UN CONCETTO, TRE PUNTI DI VISTA</p>
          <h2 id="concept-title">{c.name}</h2>
          <div className="simple-definition">
            <span>IN PAROLE SEMPLICI</span>
            <p>{c.simple}</p>
          </div>
          <h3>Guardiamo più da vicino</h3>
          <p>{c.deeper}</p>
          <div className="concept-example">
            <Lightbulb size={20} />
            <div>
              <strong>Un esempio concreto</strong>
              <p>{c.example}</p>
            </div>
          </div>
          <h3>Questo concetto si collega a…</h3>
          <div className="related-concepts">
            {c.related.map((id) => (
              <button key={id} onClick={() => open(id)}>
                {conceptById[id].name}
                <ArrowRight size={14} />
              </button>
            ))}
          </div>
          <p className="muted">
            Manteniamo al massimo cinque tappe nel filo. Chiudi il pannello per
            tornare esattamente al punto della lezione.
          </p>
          <button className="btn primary" onClick={close}>
            Ho capito, torno alla lezione <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
function Dictionary() {
  const [query, setQuery] = useState("");
  const filtered = glossary.filter((c) =>
    `${c.name} ${c.simple}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="page dictionary">
      <p className="eyebrow">LE PAROLE SONO STRUMENTI</p>
      <h1>Il dizionario dei concetti.</h1>
      <p className="intro-text">
        Parti da una parola, trova un esempio e segui i collegamenti. Puoi
        aprire queste stesse definizioni anche dentro le lezioni.
      </p>
      <label className="search-box">
        <Search size={19} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca un concetto, per esempio «densità»"
          aria-label="Cerca nel dizionario"
        />
        <span>{filtered.length} concetti</span>
      </label>
      <div className="dictionary-grid">
        {filtered.map((c) => (
          <ConceptCard key={c.id} id={c.id} />
        ))}
        {filtered.length === 0 && (
          <p>Nessun concetto trovato. Prova con una parola più breve.</p>
        )}
      </div>
    </div>
  );
}
function ConceptCard({ id }: { id: string }) {
  const c = conceptById[id];
  return (
    <GlossaryContext.Consumer>
      {(open) => (
        <button className="concept-card" onClick={() => open(id)}>
          <div>
            <h3>{c.name}</h3>
            <ArrowRight size={17} />
          </div>
          <p>{c.simple}</p>
          <span>{c.related.length} collegamenti da esplorare</span>
        </button>
      )}
    </GlossaryContext.Consumer>
  );
}
function ConceptMap() {
  const groups = [
    {
      title: "Confrontare e misurare",
      copy: "L’equilibrio rende confrontabili gli stati; una proprietà e una procedura permettono la lettura.",
      ids: [
        "temperatura",
        "equilibrio",
        "termometrica",
        "calibrazione",
        "operativa",
      ],
    },
    {
      title: "Assegnare e collegare i numeri",
      copy: "Due origini diverse, la stessa ampiezza dell’unità. Distingui lo stato dalla differenza.",
      ids: ["scala", "celsius", "kelvin", "zero", "funzione"],
    },
    {
      title: "Spiegare e prevedere un cambiamento",
      copy: "Le interazioni microscopiche spiegano la risposta macroscopica. I modelli hanno condizioni di validità.",
      ids: [
        "anarmonicita",
        "dilatazione",
        "coefficiente",
        "volume",
        "densita",
        "idrogeno",
      ],
    },
  ];
  return (
    <div className="page concept-map">
      <p className="eyebrow">LE IDEE NON VIVONO DA SOLE</p>
      <h1>Segui il filo della fisica.</h1>
      <p className="intro-text">
        Ogni misura nasce da un confronto. Ogni formula collega grandezze. Tocca
        un nodo per esplorare definizioni e prerequisiti senza lasciare la
        mappa.
      </p>
      {groups.map((g, i) => (
        <section className="map-group" key={g.title}>
          <span className="map-index">0{i + 1}</span>
          <div>
            <h2>{g.title}</h2>
            <p>{g.copy}</p>
            <div className="map-nodes">
              {g.ids.map((id, j) => (
                <GlossaryContext.Consumer key={id}>
                  {(open) => (
                    <>
                      <button onClick={() => open(id)}>
                        {conceptById[id].name}
                      </button>
                      {j < g.ids.length - 1 && <ArrowRight size={16} />}
                    </>
                  )}
                </GlossaryContext.Consumer>
              ))}
            </div>
          </div>
          {i < 2 && <ArrowDown className="map-down" size={22} />}
        </section>
      ))}
      <div className="map-cross-links">
        <h3>Tre ponti fra le idee</h3>
        <p>
          <Rich text="La [[calibrazione]] unisce il fenomeno fisico alla [[scala]]. La [[temperatura]] collega lo stato termico alla [[dilatazione]]. La [[densita]] collega il [[volume]] dell’acqua alla sua struttura [[micro|microscopica]]." />
        </p>
      </div>
      <a className="btn primary" href="#/lezione/laboratorio">
        Metti alla prova i collegamenti <ArrowRight size={16} />
      </a>
    </div>
  );
}
function Sources({
  onReset,
  progressCount,
}: {
  onReset: () => void;
  progressCount: number;
}) {
  const [reset, setReset] = useState(false);
  return (
    <div className="page sources-page">
      <p className="eyebrow">UN BUON MODELLO DICHIARA I SUOI LIMITI</p>
      <h1>Fonti, ipotesi e trasparenza.</h1>
      <p className="intro-text">
        Le simulazioni di TermoLab sono strumenti didattici. Le cifre
        visualizzate sono risultati dei modelli dichiarati: non equivalgono alla
        precisione di strumenti reali.
      </p>
      <div className="source-cards">
        {sources.map((s) => (
          <a key={s.id} href={s.url} target="_blank" rel="noreferrer">
            <div>
              <h3>{s.name}</h3>
              <ExternalLink size={16} />
            </div>
            <p>{s.note}</p>
          </a>
        ))}
      </div>
      <h2>Che cosa è esatto, che cosa è idealizzato?</h2>
      <Disclosure title="Definizioni e convenzioni" open>
        <p>
          L’offset Celsius–kelvin 273,15 e l’uguale ampiezza delle unità sono
          esatti. Anche il valore SI di kB è fissato. I punti storici dell’acqua
          richiedono condizioni specificate e non sono la definizione moderna.
        </p>
      </Disclosure>
      <Disclosure title="Leggi empiriche e approssimazioni" open>
        <p>
          Le dilatazioni sono trattate al primo ordine, con coefficienti
          costanti indicativi, corpi liberi e temperature uniformi. β = 3α è
          calcolato nel modello isotropo. Le espansioni del liquido e del
          recipiente nel laboratorio volumico usano parametri ipotetici,
          identificati come tali.
        </p>
      </Disclosure>
      <Disclosure title="Animazioni e curve qualitative" open>
        <p>
          Le distanze atomiche, il capillare e le variazioni geometriche sono
          amplificati come indicato. I tempi esponenziali sono illustrativi. La
          curva della densità dell’acqua è una parabola concettuale: non
          contiene misure sperimentali. Le particelle non sono fotografie e il
          moto classico non descrive 0 K.
        </p>
      </Disclosure>
      <Disclosure title="Dati sul tuo dispositivo">
        <p>
          Salviamo in localStorage solo gli identificativi delle lezioni segnate
          come esplorate e l’ipotesi del laboratorio finale. Nessun account è
          necessario. Non sono presenti servizi analitici né invii di queste
          informazioni a un server.
        </p>
        <button
          className="btn secondary"
          onClick={() => {
            onReset();
            setReset(true);
          }}
        >
          Azzera il progresso delle lezioni ({progressCount}/10)
        </button>
        {reset && (
          <p role="status">
            Il progresso è stato azzerato. L’ipotesi scritta nel laboratorio
            finale resta disponibile.
          </p>
        )}
      </Disclosure>
      <p className="muted">
        Riferimenti consultati durante lo sviluppo, novembre 2026. Per risultati
        di precisione occorre usare dati e strumenti adatti alle condizioni
        reali.
      </p>
    </div>
  );
}
