# Verifica TermoLab — 6 novembre 2026

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
