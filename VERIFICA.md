# Verifica TermoLab — 6 novembre 2026

## Revisione: modalità scura e correzione degli esperimenti

- Tema scuro completo: navigazione, lezioni, glossario, formule, controlli e superfici dei grafici; fondo scuro già nel documento iniziale.
- Test automatici: **31/31** (16 fisici, 4 contenuti/formule, 11 regressioni dell’interfaccia e del timer).
- Riprodotti sulla precedente versione: parametri che tornavano ai valori iniziali cambiando scheda; tempo bloccato da «Pausa animazioni» anche dopo l’avvio.
- Corretti: conservazione di parametri e risposte nelle schede e nei banchi del laboratorio finale; pausa delle particelle indipendente dal tempo; completamento esatto e ripetizione con un clic; grafico trascinabile e coordinate SVG; scale verticali confrontabili; contrazioni del liquido e del recipiente; campi di conversione stabili; colori dei corpi coerenti con l’ordine delle temperature.
- Browser desktop: tutti i cursori dei dieci moduli provati a inizio e fine intervallo, senza geometrie NaN/Infinity o overflow della pagina.
- Viewport mobile 390 × 844: tutti i dieci moduli conservano i parametri dopo il passaggio alla matematica e il ritorno; nessun errore KaTeX o overflow della pagina.
- Trascinamento effettivo del grafico provato nel browser: da −82,78 °C a 35,73 °C, con campi sincronizzati a 35,73 °C e 308,88 K.
- Con particelle sospese, il modello dei due corpi raggiunge 18,0 s e temperature circa 50,1 e 49,9 °C. La pausa delle particelle non impedisce l’esperimento.

## Verifica della prima pubblicazione

- Controllo TypeScript: superato.
- Build Vite di produzione: superata.
- Test automatici: 20/20 superati (16 sui motori numerici, 4 su contenuti, formule e collegamenti).
- Browser desktop: tutti i 10 laboratori accessibili; tutte le 35 formule delle derivazioni renderizzate senza errori KaTeX; nessun overflow della pagina.
- Browser con viewport 390 × 844: tutti i 10 laboratori accessibili e derivazioni renderizzate senza errori. I grafici hanno scorrimento interno per mantenere leggibili gli assi.
- Barra: passaggio da 2 m a 5 m d’alluminio con ΔT = 50 K aggiorna ΔL da 2,500 a 6,250 mm; passando al rame il risultato diventa 4,250 mm; ripristino a 2 m e 2,500 mm.
- Acqua: a 4 °C densità relativa e volume relativo sono 1; a 20 °C il modello produce 0,998464 e circa 1,001538. Scenario invernale del lago verificato.
- Glossario: apertura contestuale, passaggio da distanza media ad anarmonicità, ritorno e chiusura con Escape verificati.
- Progresso: completamento di una lezione conservato dopo ricaricamento.

Le animazioni e le curve qualitative restano soggette ai limiti dichiarati nel sito e nel README. Le verifiche non costituiscono una validazione sperimentale né un audit formale di conformità WCAG.

## Pubblicazione e controlli online

- Repository pubblica: https://github.com/zuhns/termolab
- Sito pubblico: https://zuhns.github.io/termolab/
- Commit dell’applicazione: `a8e249c962e194a6c5181b693a50b0d1b937516a`.
- GitHub Pages: branch `main`, cartella `/docs`, HTTPS attivo.
- Distribuzione verificata: workflow `42296736865`, job build e deploy conclusi con esito `success`.
- Sul sito pubblico: home caricata, variazione del materiale della barra coerente (rame, 2 m, 50 K → 1,700 mm); glossario aperto e richiuso con ritorno del focus alla parola.
- Termometro online: lettura iniziale di 20 °C che si avvicina a 70 °C; pausa, scala, ingrandimento e vista combinata provati.
- Ipotesi del laboratorio finale: salvataggio e recupero dopo ricaricamento provati; testo di prova poi svuotato.
- Viewport mobile online: conversione 0 K → −273,15 °C verificata; grafico con scorrimento interno, senza overflow della pagina.
