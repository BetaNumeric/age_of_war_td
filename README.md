# Age of War - Tower Defense

[**Live Demo**](https://betanumeric.github.io/age_of_war_td/)

A browser-based tower defense game inspired by **Age of War**, built with p5.js.  
Pick a map, place towers, survive waves, and evolve from the **Past** to the **Future**.
s
## Features

- 6 playable maps
- Age progression: `Past -> Present -> Future`
- 9 tower types across ages, with upgrade and sell mechanics
- Wave spawning, boss encounters, and XP-based progression
- Coin economy and persistent local high score (`localStorage`)
- Music + SFX with in-game volume controls

## Controls

- `Left click`: select map, place/select towers, use UI buttons
- `Right click`: cancel tower placement
- `Shift` (while placing): keep placing the same tower type
- `Space`: start next wave immediately
- `P` or `Esc`: pause/resume
- `M`: cycle volume level
- `Delete` / `Backspace`: sell selected tower

## Run Locally

Use a local static server (recommended), then open the game in your browser:

```bash
python -m http.server 8000
```

Open: `http://localhost:8000`

No build step is required.

