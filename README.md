# Kapitalerträge-Rechner — IBKR Flex → deutsche Anlage KAP

Ein kleines, **lokal im Browser** laufendes Werkzeug, das aus deinem Interactive-Brokers-Export
(Flex Query, XML) die Werte für die deutsche **Anlage KAP** ausrechnet: FIFO nach § 20 Abs. 4 EStG,
Umrechnung zu **EZB-Tagesreferenzkursen**, getrennt nach den richtigen Verlustverrechnungstöpfen.

> **Keine Steuerberatung. Nutzung auf eigene Gefahr.** Dieses Werkzeug bereitet nur deine eigenen
> Daten auf. Prüfe jedes Ergebnis selbst und bewahre die IBKR-Reports als Nachweis auf.

## Datenschutz
Alles passiert **in deinem Browser**. Es gibt keinen Server, keine Uploads, keine Tracker. Du kannst
`index.html` offline per Doppelklick öffnen. Deine Steuerdaten verlassen dein Gerät nicht.

## Los geht's
1. `index.html` im Browser öffnen (oder auf einer statischen Seite wie GitHub Pages hosten).
2. Bei IBKR eine **Activity Flex Query** (XML) je Kalenderjahr exportieren — Abschnitte
   **Trades** (Level *Execution*), **Statement of Funds**, **Cash Report**.
3. Datei(en) hineinziehen. Für Altbestände die Vorjahres-Dateien mit hochladen.
4. Steuerjahr wählen → die fünf KAP-Zeilen erscheinen, jede mit aufklappbarer Herleitung.

## Was unterstützt wird
- **Einzelaktien** (Aktien-Verlusttopf, Zeile 20/23)
- **CFDs** und **Optionen/Stillhaltergeschäfte** als Termingeschäfte (allgemeiner Topf)
- **Fremdwährungs-FIFO** (§ 20, Guthaben vs. nicht steuerbare Verbindlichkeiten)
- **Dividenden**, **Ersatzdividenden (PIL)**, **Zinsen**, **CFD-Finanzierungskosten**
- **Anrechenbare Quellensteuer** (PIL-Quellensteuer korrekt als nicht anrechenbar behandelt)
- Währungen **USD/EUR**, Jahre mit hinterlegten EZB-Kursen (aktuell **2024–2026**)

## Was (noch) NICHT unterstützt wird
Fonds/ETFs (Anlage KAP-INV mit Teilfreistellung/Vorabpauschale), Futures, Anleihen, weitere Währungen.
Findet das Tool solche Positionen, **blockt** es mit einem klaren Hinweis, statt still falsch zu rechnen.
Die **Options-/Stillhalter-Logik ist neu und nicht gegen eine externe Referenz geprüft** — hier besonders sorgfältig kontrollieren.

## Genauigkeit
Der Aktien- und CFD-FIFO wurde gegen IBKRs eigene *Realized P/L* (auf ~0,1 %) und gegen einen
kommerziellen Referenzreport abgeglichen (Zeilen 19/20/22/23/41 sowie der Fremdwährungs-FIFO).
Die Umrechnung nutzt den **EZB-Referenzkurs des Handelstags** (an Feiertagen der letzte vorherige Kurs).

## EZB-Kurse aktualisieren / erweitern
Die Kurse sind in `index.html` eingebettet und liegen zusätzlich in `data/ecb-usd-eur.json`.
Aktualisieren (braucht Node 18+ mit `fetch`):

```bash
node scripts/update-rates.mjs 2019-01-01
```

Das lädt EZB-Referenzkurse (via Frankfurter API), rechnet sie in USD→EUR um und schreibt sie
sowohl in die JSON-Datei als auch direkt in `index.html`.

## Methodik (kurz)
- FIFO pro Wertpapier über die **gesamte importierte Historie**; realisiert wird beim schließenden Trade.
- **Aktienverluste** nur mit Aktiengewinnen verrechenbar (§ 20 Abs. 6 S. 4 EStG) → eigener Vortrag.
- **Termingeschäfte** (CFD/Optionen): seit 2025 voll verrechenbar (JStG 2024), Verluste in Zeile 22.
- **Margin-/Sollzinsen** sind nicht abziehbar (§ 20 Abs. 9 EStG) und bleiben außen vor.
- **Fremdwährung**: nur positive Guthaben erzeugen § 20-Einkünfte; Verbindlichkeitseffekte (Margin) bleiben unversteuert (Rn. 131 BMF).

## Lizenz
MIT — siehe `LICENSE`. Trag deinen Namen in die Copyright-Zeile ein.

## Haftungsausschluss
Dies ist ein privates Hilfswerkzeug, **keine steuerliche Beratung** im Sinne des StBerG. Es ersetzt
weder Steuerberater noch eigene Prüfung. Für die Richtigkeit der Steuererklärung bist allein du verantwortlich.

## Impressum

Angaben gemäß § 5 DDG:
Tobias Otschik
E-Mail: t.otschik@outlook.de

Rein privates, nicht-kommerzielles Open-Source-Projekt.
