# Game Center

Eine für das iPad gestaltete Web-App, die einen Apple-Sperrbildschirm nachbildet.
Sie dient als Hülle für die spätere Spiele-Sammlung.

## Screens

1. **Lockscreen** – kühler Farbverlauf, große Live-Uhrzeit, sonst keine Schrift.
   Nach oben wischen führt zur PIN-Eingabe.
2. **Passcode** – „Enter Passcode", sechs Punkte und das Apple-Keypad.
   Jede gedrückte Ziffer füllt den nächsten Punkt weiß.
   `Cancel` löscht die zuletzt eingegebene Ziffer; bei leerer Eingabe geht es
   zurück zum Lockscreen.
3. **Homescreen** – vorerst nur ein Platzhalter-Raster.

PIN: `000000`

## Bedienung

| Aktion | Geste | Tastatur |
| --- | --- | --- |
| Lockscreen entsperren | nach oben wischen | `↑`, `Enter`, Leertaste |
| Ziffer eingeben | Keypad antippen | `0`–`9` |
| Ziffer löschen | `Cancel` | `Backspace` |

## Struktur

- `index.html` – Markup der drei Screens
- `styles.css` – Layout, Farbverlauf, Animationen (iPad-optimiert, Quer- und Hochformat)
- `app.js` – Uhr, Swipe-Geste, PIN-Logik

## Deployment

Jeder Push auf `main` veröffentlicht die Seite über GitHub Pages
(`.github/workflows/deploy.yml`).
