# TermoLab

**Capire la fisica, non memorizzarla.** Un laboratorio didattico in italiano, per una prima esplorazione di temperatura e dilatazione termica alle superiori.

Sito: [zuhns.github.io/termolab](https://zuhns.github.io/termolab/)

## Avvio

Richiede Node.js 22 o successivo e pnpm (usato nello sviluppo: 11.25.0).

```sh
pnpm install
pnpm dev
```

Il server stampa l’indirizzo locale. La navigazione usa hash URL, compatibili con GitHub Pages e con l’apertura diretta di una lezione.

```sh
pnpm test           # modelli fisici, limiti numerici, contenuti, formule e collegamenti
pnpm build          # controllo TypeScript e build Vite
pnpm prepare:pages  # build e copia riproducibile in docs/
```

Se Windows impedisce i collegamenti simbolici creati dal package manager, si può usare `pnpm install --package-import-method=copy --store-dir=./node_modules/.store`. La configurazione `nodeLinker: hoisted` è inclusa.

## Percorso

1. Misurare la temperatura ed equilibrio termico.
2. Il termometro a liquido e la sua risposta nel tempo.
3. La scala Celsius e la calibrazione ideale a due riferimenti.
4. La misura come procedura operativa e tre proprietà termometriche.
5. Il kelvin e lo zero assoluto.
6. Conversioni, traslazione fra scale e intervalli.
7. Dilatazione lineare, materiali e grafici L(T) e ΔL(ΔT).
8. Dilatazione volumica, cubo del binomio e recipiente pieno.
9. Anomalia dell’acqua, densità e lago invernale.
10. Laboratorio finale, ipotesi personale e collegamenti.

Ogni lezione ha quattro fasi: previsione ed esperimento; spiegazioni a tre profondità; derivazione progressiva con simboli, unità, esempio e limiti; domande di ragionamento con feedback. Le formule sono renderizzate con KaTeX e includono MathML.

Il glossario contestuale contiene 37 concetti collegati. Permette ritorno fra definizioni, chiusura con Escape e ripresa della lezione. La mappa rende navigabili i legami del percorso. Il completamento è una scelta della studentessa, non un punteggio automatico.

## Struttura

```text
src/data/lessons.ts         contenuti, derivazioni, esempi, domande e fonti
src/data/glossary.ts        definizioni, esempi e collegamenti
src/lib/physics.ts          modelli numerici indipendenti dall’interfaccia
src/lib/physics.test.ts     verifiche delle leggi e degli estremi
src/data/content.test.ts    integrità di lezioni, formule e rimandi
src/components/Shared.tsx   controlli accessibili, grafici, particelle e formule
src/components/Simulations.tsx  esperimenti SVG e controlli sincronizzati
src/App.tsx                routing, lezioni, glossario, mappa e progresso
src/styles.css             design system, responsive e reduced motion
docs/                      build pubblicata su GitHub Pages
scripts/prepare-pages.mjs   copia controllata della build
```

Per aggiungere un modulo: aggiungere i dati tipizzati in `lessons.ts`, registrare il suo componente in `SimulationContent` e aggiungere gli eventuali prerequisiti al glossario. I modelli numerici e i relativi test restano in `src/lib/`. La navigazione si genera dai contenuti. Se si amplia il corso oltre dieci moduli, aggiornare i conteggi espliciti nell’interfaccia e il test del numero di lezioni.

## Modelli e rigore

- Celsius–kelvin: offset esatto 273,15; i valori numerici delle differenze coincidono. Kelvin sotto zero e Celsius sotto −273,15 sono rifiutati dal modello ordinario.
- Equilibrio: due corpi isolati dall’esterno, con capacità termiche uguali e costanti. Avvicinamento esponenziale illustrativo con costante di tempo di 3 s del modello. La media non vale per corpi arbitrari.
- Termometro: bagno a temperatura costante, bulbo inizialmente a 20 °C, risposta esponenziale illustrativa. Il livello rende visibile la dilatazione apparente del liquido rispetto al vetro. La scala è ideale.
- Dilatazioni: primo ordine, coefficienti indicativi, temperatura uniforme, corpo libero, nessun cambiamento di fase. α (× 10⁻⁶ K⁻¹): alluminio 25; ferro/acciaio 12; rame 17. Per il cubo isotropo β è calcolato come 3α; i termini geometrici trascurati sono confrontabili nel pannello.
- Disegni della barra e del cubo: variazioni amplificate ×100. I numeri non sono amplificati. Le particelle sono schemi, non filmati realistici.
- Recipiente: parametri β esplicitamente ipotetici; trabocco come differenza delle dilatazioni positive. Non è una previsione per un liquido identificato.
- Acqua: parabola **qualitativa**, non dati sperimentali: ρrel = 1 − 0,000006(t − 4)² per 0–20 °C; Vrel = 1/ρrel. La massa relativa si conserva. Il massimo posto a 4 °C è un’idealizzazione. Il cambiamento del livello è amplificato ×100. Il lago è uno scenario ideale di acqua dolce.
- I decimali dei risultati rappresentano il calcolo, non l’accuratezza di una misura reale. Approfondimenti distinguono anarmonicità, energia di punto zero e temperature negative di sistemi speciali.

Le fonti sono consultabili nel sito e alla fine di ciascuna lezione: BIPM, NIST, Università di Uppsala, OpenStax e USGS. Testi e diagrammi dell’interfaccia sono realizzati per questo progetto. Le fonti servono a verificare i concetti, non sono riproduzioni di pagine di manuale.

## Accessibilità e dati

Layout responsive, controlli nativi da tastiera, nomi accessibili e unità per i cursori, tab con frecce/Home/End, focus nel pannello contestuale, supporto a `prefers-reduced-motion`, comando di pausa, alternative numeriche alle rappresentazioni. I grafici piccoli scorrono dentro il loro pannello per mantenere leggibili gli assi.

Nessun backend, login o tracciamento analitico. `localStorage` conserva `termolab-progress` e `termolab-hypothesis`. I progressi si azzerano da **Fonti e modelli**; l’ipotesi si può modificare o svuotare dal laboratorio finale. Se il browser impedisce il salvataggio, la navigazione resta utilizzabile.

## Pubblicazione

La repository pubblica è `zuhns/termolab`. GitHub Pages deve usare **Deploy from a branch**, branch **main**, directory **/docs**. La build pubblicata è inclusa per consentire l’hosting senza credenziali di deploy nel progetto.

Dopo modifiche: eseguire `pnpm test`, `pnpm prepare:pages`, poi includere sorgenti e `docs/` nello stesso commit. Il push su `main` attiva il processo Pages di GitHub. Nessuna chiave o variabile segreta è necessaria.

## Verifiche

20 test automatici sui modelli, limiti, formule KaTeX, domande e rimandi. Controllo TypeScript e build di produzione. Verifica browser dei dieci moduli su desktop e viewport mobile 390 × 844, senza overflow della pagina; i grafici mobili possono scorrere internamente. Provati cambio di materiale e lunghezza, ripristino, glossario collegato, persistenza del completamento e massimo qualitativo della densità. Vedere `VERIFICA.md` per gli esiti di pubblicazione.
