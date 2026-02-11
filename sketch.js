const MAP_FILES = [
  "towerDefense1.map",
  "towerDefense2.map",
  "towerDefense3.map",
  "towerDefense4.map",
  "towerDefense5.map",
  "towerDefense6.map",
  "towerDefenseBlank.map"
];

const TILE_LETTERS = ["B", "C", "F", "G", "M", "P", "R", "S", "T", "W", "X", "Y", "Z"];
const BASE_CANVAS_WIDTH = 1024;
const BASE_CANVAS_HEIGHT = 704;
const RENDER_MODE_KEY = "towerDefenseRenderMode_v1";
const RENDER_MODE_CRISP = "crisp";
const RENDER_MODE_SMOOTH = "smooth";

let mapData = {};
let tileImages = {};
let mainCanvas = null;

let gameMap, map1, map2, map3, map4, map5, map6;
let enemies = [];
let towers = [];
let uSelect = true;
let select = false;
let allPlaced = true;
let lvUp = false;
let startX = 0;
let startY = 0;
let bX = 0;
let bY = 0;
let Xx = 0;
let Xy = 0;
let Yx = 0;
let Yy = 0;
let Zx = 0;
let Zy = 0;
let lastSelect = 0;
let waveL = 0;
let waveN = 0;
let waveType = 0;
let enemyType = 0;
let XP = 0;
let oldScore = 0;
let Coins = 0;
let pauseSelect = 0;
let pauseHover = -1;
let pauseOverlayDrawn = false;
let gameOverSelect = 0;
let gameOverHover = -1;
let gameOverOverlayDrawn = false;
let mX = 0;
let mY = 0;
let mZ = 0;
let damageX = 0;
let rangeX = 0;
let rateX = 0;
let damageY = 0;
let rangeY = 0;
let rateY = 0;
let damageZ = 0;
let rangeZ = 0;
let rateZ = 0;
let waveT = 0;
let HP = 100;
let gameState = "loading";
let mapName = "towerDefense6.map";
let Age = "Past";
let typeX = "";
let typeY = "";
let typeZ = "";
let extraX = "";
let extraY = "";
let extraZ = "";
let highScore = ["0"];
let defaultHighScore = ["0"];
const HIGH_SCORE_KEY = "towerDefenseHighScore_v1";
let autoPaused = false;
let ignoreNextDelta = false;
let renderMode = RENDER_MODE_SMOOTH;

let knight, rider, lancer, boss1;
let soldier, rocket, enemyTank, boss2;
let robot, spaceship, ball;
let castle, military, future;
let cannon, cannon2, catapult, catapult2, crossbow, crossbow2;
let tank, tank2, turret, turretB, turretT, turretT2, thrower, thrower2;
let laserCannon, laserCannon2, wavegun, wavegunB, wavegunT, wavegunT2, railgun, railgun2;
let volumeImgs = [null, null, null, null];
let settingsIconGameplay = null;
let settingsIconMenu = null;
let renderSettingsOpen = false;

let audioController;
let music = "music";
let cannonShot = "cannonShot", catapultShot = "catapultShot", crossbowShot = "crossbowShot";
let tankShot = "tankShot", turretShot = "turretShot", throwerShot = "throwerShot";
let lasercannonShot = "lasercannonShot", wavegunShot = "wavegunShot", railgunShot = "railgunShot";
let levelUpSound = "levelUpSound", deleteSound = "deleteSound", place = "place", coins = "coins", errorSound = "errorSound", gameOver = "gameOver";

function preload() {
  audioController = new AudioController();

  for (const file of MAP_FILES) {
    mapData[file] = loadStrings(`data/${file}`);
  }

  for (const letter of TILE_LETTERS) {
    tileImages[letter] = loadImage(`data/images/${letter}.png`);
  }

  knight = loadImage("data/images/knight.png");
  lancer = loadImage("data/images/lancer.png");
  rider = loadImage("data/images/rider.png");
  boss1 = loadImage("data/images/boss1.png");
  soldier = loadImage("data/images/soldier.png");
  rocket = loadImage("data/images/rocket.png");
  enemyTank = loadImage("data/images/enemyTank.png");
  boss2 = loadImage("data/images/boss2.png");
  robot = loadImage("data/images/robot.png");
  spaceship = loadImage("data/images/spaceship.png");
  ball = loadImage("data/images/ball.png");
  castle = loadImage("data/images/castle.png");
  military = loadImage("data/images/military.png");
  future = loadImage("data/images/future.png");
  cannon = loadImage("data/images/cannon.png");
  cannon2 = loadImage("data/images/cannon2.png");
  catapult = loadImage("data/images/catapult.png");
  catapult2 = loadImage("data/images/catapult2.png");
  crossbow = loadImage("data/images/crossbow.png");
  crossbow2 = loadImage("data/images/crossbow2.png");
  tank = loadImage("data/images/tank.png");
  tank2 = loadImage("data/images/tank2.png");
  turret = loadImage("data/images/turret.png");
  turretB = loadImage("data/images/turretB.png");
  turretT = loadImage("data/images/turretT.png");
  turretT2 = loadImage("data/images/turretT2.png");
  thrower = loadImage("data/images/thrower.png");
  thrower2 = loadImage("data/images/thrower2.png");
  laserCannon = loadImage("data/images/laserCannon.png");
  laserCannon2 = loadImage("data/images/laserCannon2.png");
  wavegun = loadImage("data/images/wavegun.png");
  wavegunB = loadImage("data/images/wavegunB.png");
  wavegunT = loadImage("data/images/wavegunT.png");
  wavegunT2 = loadImage("data/images/wavegunT2.png");
  railgun = loadImage("data/images/railgun.png");
  railgun2 = loadImage("data/images/railgun2.png");
  volumeImgs[0] = loadImage("data/images/volume0.png");
  volumeImgs[1] = loadImage("data/images/volume1.png");
  volumeImgs[2] = loadImage("data/images/volume2.png");
  volumeImgs[3] = loadImage("data/images/volume3.png");
  settingsIconGameplay = loadImage("data/images/settings.png");
  settingsIconMenu = loadImage("data/images/settings_w.png");

  audioController.loadMusic("data/sounds/music.mp3");
  audioController.loadSFX(cannonShot, "data/sounds/cannonShot.mp3");
  audioController.loadSFX(catapultShot, "data/sounds/catapultShot.mp3");
  audioController.loadSFX(crossbowShot, "data/sounds/crossbowShot.mp3");
  audioController.loadSFX(tankShot, "data/sounds/tankShot.mp3");
  audioController.loadSFX(turretShot, "data/sounds/turretShot.mp3");
  audioController.loadSFX(throwerShot, "data/sounds/throwerShot.mp3");
  audioController.loadSFX(lasercannonShot, "data/sounds/lasercannonShot.mp3");
  audioController.loadSFX(wavegunShot, "data/sounds/wavegunShot.mp3");
  audioController.loadSFX(railgunShot, "data/sounds/railgunShot.mp3");
  audioController.loadSFX(levelUpSound, "data/sounds/levelUp.mp3");
  audioController.loadSFX(place, "data/sounds/place.mp3");
  audioController.loadSFX(deleteSound, "data/sounds/delete.mp3");
  audioController.loadSFX(coins, "data/sounds/coins.mp3");
  audioController.loadSFX(errorSound, "data/sounds/error.mp3");
  audioController.loadSFX(gameOver, "data/sounds/gameOver.mp3");

  defaultHighScore = loadStrings("data/highScore.txt");
}

function setup() {
  loadRenderMode();
  pixelDensity(getTargetPixelDensity());
  mainCanvas = createCanvas(BASE_CANVAS_WIDTH, BASE_CANVAS_HEIGHT);
  applyRenderMode();
  background(0);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("loading...", width / 2, height / 2);
  imageMode(CENTER);
  frameRate(60);

  setAudioEnabled(true);

  gameState = "loading";
  loadHighScore();
  
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (gameState === "Start") {
        autoPaused = true;
        gameState = "Pause";
        audioController.pauseMusic();
      }
      return;
    }
    if (autoPaused && gameState === "Pause") {
      autoPaused = false;
      gameState = "Start";
      audioController.playMusic();
    }
    ignoreNextDelta = true;
  });

  window.addEventListener("blur", () => {
    if (gameState === "Start") {
      autoPaused = true;
      gameState = "Pause";
      audioController.pauseMusic();
    }
  });
  window.addEventListener("focus", () => {
    if (autoPaused && gameState === "Pause") {
      autoPaused = false;
      gameState = "Start";
      audioController.playMusic();
    }
    ignoreNextDelta = true;
  });
}

function applyCanvasScale() {
  if (!mainCanvas || !mainCanvas.elt) return;

  const fitScale = min(windowWidth / BASE_CANVAS_WIDTH, windowHeight / BASE_CANVAS_HEIGHT);
  let renderScale = max(fitScale, 0.1);
  if (renderMode === RENDER_MODE_CRISP && fitScale >= 1) {
    renderScale = max(1, floor(fitScale));
  }
  const scaledWidth = max(1, renderMode === RENDER_MODE_CRISP ? floor(BASE_CANVAS_WIDTH * renderScale) : BASE_CANVAS_WIDTH * renderScale);
  const scaledHeight = max(1, renderMode === RENDER_MODE_CRISP ? floor(BASE_CANVAS_HEIGHT * renderScale) : BASE_CANVAS_HEIGHT * renderScale);

  mainCanvas.elt.style.width = `${scaledWidth}px`;
  mainCanvas.elt.style.height = `${scaledHeight}px`;
}

function windowResized() {
  applyCanvasScale();
}

function draw() {
  syncCursorVisibility();

  // Reset overlay flag when not paused so it can be drawn next time we enter Pause
  if (gameState !== "Pause") pauseOverlayDrawn = false;
  // Reset GameOver overlay flag when not GameOver so it can be drawn next time
  if (gameState !== "GameOver") gameOverOverlayDrawn = false;

  if (gameState === "loading") {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Loading assets...", width/2, height/2);
    if (audioController.isReady()) {
        gameState = "SelectMap";
        drawMaps();
    }
    return;
  }
  
  if (gameState === "SelectMap") {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("Select your Map:", width / 2, height / 6);
    textAlign(LEFT, TOP);
    textSize(20);
    fill(255, 255, 0);
    text(`Highscore: ${highScore[0]}`, 7, 20);
    strokeWeight(1);
    noFill();
    if (mouseX > width / 20 && mouseY > height / 4 && mouseX < width / 20 + width / 4 && mouseY < height / 4 + height / 4)
      stroke(255);
    rect(width / 20, height / 4, width / 4, height / 4);
    stroke(0);
    if (
      mouseX > width / 20 * 7.5 &&
      mouseY > height / 4 &&
      mouseX < width / 20 * 7.5 + width / 4 &&
      mouseY < height / 4 + height / 4
    )
      stroke(255);
    rect(width / 20 * 7.5, height / 4, width / 4, height / 4);
    stroke(0);
    if (
      mouseX > width / 20 * 14 &&
      mouseY > height / 4 &&
      mouseX < width / 20 * 14 + width / 4 &&
      mouseY < height / 4 + height / 4
    )
      stroke(255);
    rect(width / 20 * 14, height / 4, width / 4, height / 4);
    stroke(0);
    if (
      mouseX > width / 20 &&
      mouseY > height / 2 + height / 20 &&
      mouseX < width / 20 + width / 4 &&
      mouseY < height / 2 + height / 20 + height / 4
    )
      stroke(255);
    rect(width / 20, height / 2 + height / 20, width / 4, height / 4);
    stroke(0);
    if (
      mouseX > width / 20 * 7.5 &&
      mouseY > height / 2 + height / 20 &&
      mouseX < width / 20 * 7.5 + width / 4 &&
      mouseY < height / 2 + height / 20 + height / 4
    )
      stroke(255);
    rect(width / 20 * 7.5, height / 2 + height / 20, width / 4, height / 4);
    stroke(0);
    if (
      mouseX > width / 20 * 14 &&
      mouseY > height / 2 + height / 20 &&
      mouseX < width / 20 * 14 + width / 4 &&
      mouseY < height / 2 + height / 20 + height / 4
    )
    stroke(255);
    rect(width / 20 * 14, height / 2 + height / 20, width / 4, height / 4);
    stroke(0);
  }

  if (gameState === "Start") {
    if (Age === "Past") background(35, 90, 0);
    if (Age === "Present") background(90, 60, 20);
    if (Age === "Future") background(20, 50, 90);

    gameMap.draw(0, 0);
    wave();

    for (let i = 0; i < towers.length; i++) {
      towers[i].draw();
      if (towers[i].del === true) {
        playSound(deleteSound);
        playSound(deleteSound);
        playSound(errorSound);
        cursor();
        towers.splice(i, 1);
        i--;
        uSelect = true;
      }
    }

    for (let i = 0; i < enemies.length; i++) {
      enemies[i].move();
      enemies[i].draw();
      if (enemies[i].base()) {
        if (HP > 0) HP -= 10;
        if (enemies[i].type === "Boss1") HP = 0;
        if (enemies[i].type === "Boss2") HP = 0;
        if (HP <= 0) {
          gameState = "GameOver";
          playSound(gameOver);
          fill(0, 110);
          rect(0, 0, width, height);
          if (Number(highScore[0]) < XP) saveHighScore(XP);
        }
        enemies.splice(i, 1);
        i--;
      }
    }

    lvUp = isLevelUpAvailable();

    if (Age === "Past") image(castle, bX, bY);
    if (Age === "Present") image(military, bX, bY);
    if (Age === "Future") image(future, bX, bY);

    GUI();
  }

  if (gameState === "Pause") {
    // Draw a single semi-transparent overlay once when entering Pause
    if (!pauseOverlayDrawn) {
      noStroke();
      fill(0, 150);
      rect(0, 0, width, height);
      // draw title once
      textAlign(CENTER, CENTER);
      textSize(75);
      fill(255);
      // move title higher so buttons remain unobstructed
      text("Pause", width / 2, height / 16 * 4);
      pauseOverlayDrawn = true;
    }

    // Button layout (flat, neutral, lower so it doesn't overlap title)
    const pauseBtnW = 300;
    const pauseBtnH = 52;
    const pauseBtnX = width / 2 - pauseBtnW / 2;
    const firstBtnY = height / 16 * 8.5 - pauseBtnH / 2;
    const btnGap = 18;

    // draw two simple flat, colorless buttons (no rounded corners)
    for (let i = 0; i < 2; i++) {
      const bx = pauseBtnX;
      const by = firstBtnY + i * (pauseBtnH + btnGap);

      noStroke();
      if (pauseHover === i) fill(200); // only change color on hover
      else fill(230);
      rect(bx, by, pauseBtnW, pauseBtnH);

      // button text
      textSize(22);
      fill(30);
      const label = i === 0 ? "Continue" : "Menu";
      text(label, bx + pauseBtnW / 2, by + pauseBtnH / 2);
    }

    if (pauseSelect > 1) pauseSelect = 0;
    if (pauseSelect < 0) pauseSelect = 1;
    audioController.pauseMusic();
  }

  if (gameState === "GameOver") {
    // Draw a single semi-transparent overlay once when entering GameOver
    if (!gameOverOverlayDrawn) {
      noStroke();
      fill(0, 150);
      rect(0, 0, width, height);
      // draw title once
      textAlign(CENTER, CENTER);
      textSize(75);
      fill(255);
      // move title and scores higher so buttons stay clear
      text("Game Over!", width / 2, height / 16 * 4);
      textSize(25);
      if (oldScore < XP) {
        fill(255, 255, 0);
        text(`New Highscore: ${XP}!`, width / 2, height / 16 * 6.2);
      } else {
        text(`Score: ${XP}`, width / 2, height / 16 * 5.8);
        text(`Highscore: ${highScore[0]}`, width / 2, height / 16 * 6.5);
      }
      gameOverOverlayDrawn = true;
      gameOverSelect = 0;
    }

    // draw two simple flat, colorless buttons (Play again, Menu)
    for (let i = 0; i < 2; i++) {
      const r = getGameOverButtonRect(i);
      noStroke();
      if (gameOverHover === i) fill(200);
      else fill(230);
      rect(r.x, r.y, r.w, r.h);
      textSize(22);
      fill(30);
      const label = i === 0 ? "Play again" : "Menu";
      text(label, r.x + r.w / 2, r.y + r.h / 2);
    }

    audioController.pauseMusic();
  }

  if (gameState !== "loading") drawSettingsUI();
}

// Helper: return the rectangle for pause buttons (index 0 = Continue, 1 = Menu)
function getPauseButtonRect(index) {
  const pauseBtnW = 300;
  const pauseBtnH = 52;
  const pauseBtnX = width / 2 - pauseBtnW / 2;
  const firstBtnY = height / 16 * 8.5 - pauseBtnH / 2;
  const btnGap = 18;
  const bx = pauseBtnX;
  const by = firstBtnY + index * (pauseBtnH + btnGap);
  return { x: bx, y: by, w: pauseBtnW, h: pauseBtnH };
}

// GameOver uses the same layout as Pause (flat buttons lower on screen)
function getGameOverButtonRect(index) {
  const w = 300;
  const h = 52;
  const x = width / 2 - w / 2;
  const firstY = height / 16 * 8.5 - h / 2;
  const gap = 18;
  const bx = x;
  const by = firstY + index * (h + gap);
  return { x: bx, y: by, w: w, h: h };
}

function syncCursorVisibility() {
  if (gameState === "Start" && select) noCursor();
  else cursor();
}

function isPointInRect(px, py, rectInfo) {
  return px >= rectInfo.x && px <= rectInfo.x + rectInfo.w && py >= rectInfo.y && py <= rectInfo.y + rectInfo.h;
}

function getSettingsButtonRect() {
  const size = 32;
  const menuMargin = 16;
  const isGameplay = gameState === "Start";
  const x = isGameplay ? width - size : width - size - menuMargin;
  const y = isGameplay ? 0 : menuMargin;
  return { x, y, w: size, h: size };
}

function getRenderSettingsPanelRect() {
  const w = 64;
  const h = 36;
  const menuMargin = 16;
  const isGameplay = gameState === "Start";
  const x = isGameplay ? width - w - 32 : width - w - 32 - menuMargin;
  const y = isGameplay ? 32 : 32 + menuMargin;
  return { x, y, w, h };
}

function getRenderOptionRect() {
  const panel = getRenderSettingsPanelRect();
  const pad = 4;
  const optionH = panel.h - pad * 2;
  return {
    x: panel.x + pad,
    y: panel.y + pad,
    w: panel.w - pad * 2,
    h: optionH
  };
}

function drawSettingsButton() {
  const r = getSettingsButtonRect();
  const icon = gameState === "Start" ? settingsIconGameplay : settingsIconMenu;
  if (icon) {
    image(icon, r.x + r.w / 2, r.y + r.h / 2, 28, 28);
    return;
  }
  noStroke();
  fill(0);
  rect(r.x + 8, r.y + 8, 16, 16);
}

function drawRenderSettingsPanel() {
  const panel = getRenderSettingsPanelRect();
  const modeButton = getRenderOptionRect();
  noStroke();
  fill(0);
  rect(panel.x, panel.y, panel.w, panel.h);

  fill(255);
  rect(modeButton.x, modeButton.y, modeButton.w, modeButton.h);

  textAlign(CENTER, CENTER);
  textSize(14);
  fill(0);
  if (renderMode === RENDER_MODE_CRISP) text("Sharp", modeButton.x + modeButton.w / 2, modeButton.y + modeButton.h / 2);
  else text("Smooth", modeButton.x + modeButton.w / 2, modeButton.y + modeButton.h / 2);
}

function drawSettingsUI() {
  drawSettingsButton();
  if (renderSettingsOpen) drawRenderSettingsPanel();
}

function closeRenderSettingsMenu() {
  renderSettingsOpen = false;
  if (gameState === "SelectMap") {
    drawMaps();
  }
}

function mouseMoved() {
  if (gameState === "Pause") {
    const r0 = getPauseButtonRect(0);
    const r1 = getPauseButtonRect(1);
    if (mouseX >= r0.x && mouseX <= r0.x + r0.w && mouseY >= r0.y && mouseY <= r0.y + r0.h) pauseHover = 0;
    else if (mouseX >= r1.x && mouseX <= r1.x + r1.w && mouseY >= r1.y && mouseY <= r1.y + r1.h) pauseHover = 1;
    else pauseHover = -1;
  }
  else if (gameState === "GameOver") {
    const g0 = getGameOverButtonRect(0);
    const g1 = getGameOverButtonRect(1);
    if (mouseX >= g0.x && mouseX <= g0.x + g0.w && mouseY >= g0.y && mouseY <= g0.y + g0.h) gameOverHover = 0;
    else if (mouseX >= g1.x && mouseX <= g1.x + g1.w && mouseY >= g1.y && mouseY <= g1.y + g1.h) gameOverHover = 1;
    else gameOverHover = -1;
  }
}

function mouseClicked() {
  if (mouseButton === LEFT) handleClick();
}

function mousePressed() {
  if (mouseButton === RIGHT) {
    if (mouseX < 32 && mouseY < 32) {
      if (audioController) {
        audioController.toggleMusicMuted();
      }
      return false;
    }
    handleClick();
    return false;
  }
}

function handleClick() {
  ensureAudio();

  if (gameState !== "loading") {
    const settingsButton = getSettingsButtonRect();
    if (isPointInRect(mouseX, mouseY, settingsButton)) {
      renderSettingsOpen = !renderSettingsOpen;
      return;
    }

    if (renderSettingsOpen) {
      const panel = getRenderSettingsPanelRect();
      if (isPointInRect(mouseX, mouseY, panel)) {
        toggleRenderMode();
        closeRenderSettingsMenu();
        return;
      }

      closeRenderSettingsMenu();
    }
  }

  if (gameState === "Start") {
    if (mouseX < 32 && mouseY < 32) {
      if (audioController) {
        audioController.cycleVolumeLevel();
      }
      return;
    }
  }

  if (gameState === "SelectMap") {
    if (mouseX > width / 20 && mouseY > height / 4 && mouseX < width / 20 + width / 4 && mouseY < height / 4 + height / 4) {
      mapName = "towerDefense1.map";
      newGame();
    }
    if (
      mouseX > width / 20 * 7.5 &&
      mouseY > height / 4 &&
      mouseX < width / 20 * 7.5 + width / 4 &&
      mouseY < height / 4 + height / 4
    ) {
      mapName = "towerDefense2.map";
      newGame();
    }
    if (
      mouseX > width / 20 * 14 &&
      mouseY > height / 4 &&
      mouseX < width / 20 * 14 + width / 4 &&
      mouseY < height / 4 + height / 4
    ) {
      mapName = "towerDefense3.map";
      newGame();
    }
    if (
      mouseX > width / 20 &&
      mouseY > height / 2 + height / 20 &&
      mouseX < width / 20 + width / 4 &&
      mouseY < height / 2 + height / 20 + height / 4
    ) {
      mapName = "towerDefense4.map";
      newGame();
    }
    if (
      mouseX > width / 20 * 7.5 &&
      mouseY > height / 2 + height / 20 &&
      mouseX < width / 20 * 7.5 + width / 4 &&
      mouseY < height / 2 + height / 20 + height / 4
    ) {
      mapName = "towerDefense5.map";
      newGame();
    }
    if (
      mouseX > width / 20 * 14 &&
      mouseY > height / 2 + height / 20 &&
      mouseX < width / 20 * 14 + width / 4 &&
      mouseY < height / 2 + height / 20 + height / 4
    ) {
      mapName = "towerDefense6.map";
      newGame();
    }
  }

  if (gameState === "Start") {
    if (mouseY < 544) uSelect = true;

    if (towers.length > 0)
      for (let i = 0; i < towers.length; i++)
        if (towers[i].mouseInside()) {
          lastSelect = i;
          uSelect = false;
        }

    trade();
    towerSelect();

    if (mouseX > width - 90 && mouseY > height - 60 && mouseX < width - 90 + 75 && mouseY < height - 60 + 45) {
      if (isLevelUpAvailable()) levelUp();
    }

    if (
      mouseX > width - 90 &&
      mouseY > height - 145 &&
      mouseX < width - 90 + 75 &&
      mouseY < height - 145 + 35
    )
      waveT = 0;
  }

  if (gameState === "Pause") {
    const r0 = getPauseButtonRect(0);
    const r1 = getPauseButtonRect(1);
    if (mouseX >= r0.x && mouseX <= r0.x + r0.w && mouseY >= r0.y && mouseY <= r0.y + r0.h) {
      gameState = "Start";
      audioController.playMusic();
    }
    if (mouseX >= r1.x && mouseX <= r1.x + r1.w && mouseY >= r1.y && mouseY <= r1.y + r1.h) {
      gameState = "SelectMap";
      drawMaps();
    }
  }

  if (gameState === "GameOver") {
    const g0 = getGameOverButtonRect(0);
    const g1 = getGameOverButtonRect(1);
    if (mouseX >= g0.x && mouseX <= g0.x + g0.w && mouseY >= g0.y && mouseY <= g0.y + g0.h) {
      newGame();
    }
    if (mouseX >= g1.x && mouseX <= g1.x + g1.w && mouseY >= g1.y && mouseY <= g1.y + g1.h) {
      gameState = "SelectMap";
      drawMaps();
    }
  }

  if (gameState === "GameOver") {
    gameState = "SelectMap";
    drawMaps();
  }
}

function keyPressed() {
  ensureAudio();

  if (gameState === "GameOver") {
    if (keyCode === ENTER && gameOverSelect === 0) {
      newGame();
      return false;
    }
    if (keyCode === ENTER && gameOverSelect === 1) {
      gameState = "SelectMap";
      drawMaps();
      return false;
    }

    if (keyCode === UP_ARROW) gameOverSelect--;
    else if (keyCode === DOWN_ARROW) gameOverSelect++;
  }

    if (key === "m" || key === "M") {
      if (audioController) {
        audioController.cycleVolumeLevel();
      }
    }

  if (key === "n" || key === "N") {
    toggleRenderMode();
    return false;
    }

  if (key === " ") {
    waveT = 0;
    return false;
  }
  if (key === "p" || key === "P") {
    if (gameState === "Start") {
        gameState = "Pause";
        audioController.pauseMusic();
    }
    else if (gameState === "Pause") {
      gameState = "Start";
      audioController.playMusic();
    }
  }

  if (keyCode === DELETE || keyCode === BACKSPACE) {
    if (uSelect === false) {
      Coins += towers[lastSelect].worth;
      playSound(deleteSound);
      playSound(coins);
      towers.splice(lastSelect, 1);
      uSelect = true;
    }
    return false;
  }

  if (gameState === "Pause") {
    if (keyCode === ENTER && pauseSelect === 0) {
      gameState = "Start";
      audioController.playMusic();
    }
    if (keyCode === ENTER && pauseSelect === 1) {
      gameState = "SelectMap";
      drawMaps();
    }

    if (keyCode === UP_ARROW) pauseSelect--;
    else if (keyCode === DOWN_ARROW) pauseSelect++;
  }

  if (keyCode === ESCAPE && (gameState === "Pause" || gameState === "Start")) {
    if (gameState === "Start") {
        gameState = "Pause";
        audioController.pauseMusic();
    }
    else if (gameState === "Pause") {
      gameState = "Start";
      audioController.playMusic();
    }
    return false;
  }
}

function trade() {
  if (uSelect === false && select === false) {
    if (mouseX > 624 && mouseY > 560 && mouseX < 624 + 64 && mouseY < 560 + 32) {
      Coins += towers[lastSelect].worth;
      playSound(deleteSound);
      playSound(coins);
      towers.splice(lastSelect, 1);
      uSelect = true;
    }
    if (mouseX > 422 && mouseY > 595 && mouseX < 422 + 48 && mouseY < 595 + 24) {
      const upgradeCost = getUpgradeCost(towers[lastSelect], "damage");
      if (Coins - upgradeCost >= 0) {
        if (towers[lastSelect].damage < towers[lastSelect].maxDamage) {
          towers[lastSelect].damage *= 2;
          Coins -= upgradeCost;
          towers[lastSelect].worth += upgradeCost * (2 / 3);
          playSound(coins);
        }
      }
    }
    if (mouseX > 422 && mouseY > 625 && mouseX < 422 + 48 && mouseY < 625 + 24) {
      const upgradeCost = getUpgradeCost(towers[lastSelect], "range");
      if (Coins - upgradeCost >= 0) {
        if (towers[lastSelect].range < towers[lastSelect].maxRange) {
          towers[lastSelect].range *= 2;
          Coins -= upgradeCost;
          towers[lastSelect].worth += upgradeCost * (2 / 3);
          playSound(coins);
        }
      }
    }
    if (mouseX > 422 && mouseY > 655 && mouseX < 422 + 48 && mouseY < 655 + 24) {
      const upgradeCost = getUpgradeCost(towers[lastSelect], "rate");
      if (Coins - upgradeCost >= 0) {
        if (towers[lastSelect].rate < towers[lastSelect].maxRate) {
          towers[lastSelect].rate *= 2;
          Coins -= upgradeCost;
          towers[lastSelect].worth += upgradeCost * (2 / 3);
          playSound(coins);
        }
      }
    }
  }
}

function towerSelect() {
  allPlaced = true;
  if (towers.length > 0) allPlaced = towers[towers.length - 1].placed;
  if (mouseButton === LEFT) {
    if (select === true) select = false;
    if (gameMap.atPixel(mouseX, mouseY) === "X" && allPlaced) {
      noCursor();
      if (select === false) towers.push(new Tower(typeX, mX, damageX, rangeX, rateX));
      select = true;
      uSelect = true;
    }
    if (gameMap.atPixel(mouseX, mouseY) === "Y" && allPlaced) {
      noCursor();
      if (select === false) towers.push(new Tower(typeY, mY, damageY, rangeY, rateY));
      select = true;
      uSelect = true;
    }
    if (gameMap.atPixel(mouseX, mouseY) === "Z" && allPlaced) {
      noCursor();
      if (select === false) towers.push(new Tower(typeZ, mZ, damageZ, rangeZ, rateZ));
      select = true;
      uSelect = true;
    }
  }
  if (mouseButton === RIGHT && select === true) {
    cursor();
    playSound(deleteSound);
    select = false;
    towers.pop();
    uSelect = true;
  }
}

function GUI() {
  textAlign(LEFT, TOP);
  textSize(20);
  fill(255);
  const hudX = width - 290;
  const lineH = 24;
  const hudY = height - 135;
  textLeading(lineH);
  text(`Wave: ${waveN}\nXP: ${XP}\nHighscore: ${highScore[0]}\nEnemies: ${enemies.length}`, hudX, hudY);
  fill(255, 255, 0);
  text(`Coins: $${int(Coins)}`, hudX, hudY + 4 * lineH);
  noStroke();
  fill(0);
  rect(bX - 17, bY - 3, 33, 5);
  fill(0, 255, 0);
  rect(bX - 17, bY - 3, (HP / 100) * 33, 5);
  if (uSelect && !select) {
    fill(0, 64);
    rect(416, 544, 288, 160);
    const panelLeft = 416;
    const panelTop = 544;
    textAlign(LEFT, TOP);
    textSize(25);
    fill(255);
    text("Type", panelLeft + 16, panelTop + 10);
    textSize(20);
    text("Damage:   -", panelLeft + 64, panelTop + 54);
    text("Range:      -", panelLeft + 64, panelTop + 84);
    text("Rate:         -", panelLeft + 64, panelTop + 114);
  }
  if (towers.length > 0) {
    if (!uSelect) towers[lastSelect].data();
    if (select) if (towers[towers.length - 1].mouseInside()) towers[towers.length - 1].data();
  }
  fill(0, 255, 0);
  rect(width - 90, height - 145, 75, 35);
  fill(255, 0, 0);
  rect(width - 90, height - 145, 75 - (waveT / 20) * 75, 35);
  textAlign(CENTER, CENTER);
  textSize(22);
  fill(0);
  text("Next", width - 90 + 37.5, height - 145 + 17.5);
  const levelUpX = width - 90;
  const levelUpY = height - 55;
  const levelUpW = 75;
  const levelUpH = 35;
  const levelUpXPRequired = getLevelUpXPRequired();
  const levelUpProgress = levelUpXPRequired === null ? 1 : constrain(XP / levelUpXPRequired, 0, 1);

  fill(0, 127, 127);
  rect(levelUpX, levelUpY, levelUpW, levelUpH);
  if (levelUpXPRequired !== null) {
    fill(0, 255, 255);
    rect(levelUpX, levelUpY, levelUpProgress * levelUpW, levelUpH);
  }
  if (
    mouseX > levelUpX &&
    mouseY > levelUpY &&
    mouseX < levelUpX + levelUpW &&
    mouseY < levelUpY + levelUpH
  ) {
    drawLevelUpTooltip(levelUpXPRequired);
  }
  textAlign(CENTER, CENTER);
  fill(0);
  textSize(16);
  text("Level Up", levelUpX + levelUpW / 2, levelUpY + levelUpH / 2);
  textAlign(CENTER, CENTER);
  textSize(15);
  fill(255, 255, 0);
  if (Age === "Past") {
    text("$" + getScaledCost(mX), Xx, Xy - 24);
    text("$" + getScaledCost(mY), Yx, Yy - 24);
    text("$" + getScaledCost(mZ), Zx, Zy - 24);
  }
  if (Age === "Present") {
    text("$" + getScaledCost(mX), Xx, Xy - 24);
    text("$" + getScaledCost(mY), Yx, Yy - 24);
    text("$" + getScaledCost(mZ), Zx, Zy - 24);
  }
  if (Age === "Future") {
    text("$" + getScaledCost(mX), Xx, Xy - 24);
    text("$" + getScaledCost(mY), Yx, Yy - 24);
    text("$" + getScaledCost(mZ), Zx, Zy - 24);
  }
  if (Age === "Past") image(cannon, Xx, Xy);
  if (Age === "Past") image(catapult, Yx, Yy);
  if (Age === "Past") image(crossbow, Zx, Zy);

  if (Age === "Present") image(tank, Xx, Xy);
  if (Age === "Present") image(thrower, Yx, Yy);
  if (Age === "Present") image(turret, Zx, Zy);

  if (Age === "Future") image(laserCannon, Xx, Xy);
  if (Age === "Future") image(railgun, Yx, Yy);
  if (Age === "Future") image(wavegun, Zx, Zy);
  if (audioController && volumeImgs[audioController.getVolumeLevel()]) {
    image(volumeImgs[audioController.getVolumeLevel()], 16, 16);
  }

  if (gameMap.atPixel(mouseX, mouseY) === "X") info(typeX, damageX, rangeX, rateX, extraX);
  if (gameMap.atPixel(mouseX, mouseY) === "Y") info(typeY, damageY, rangeY, rateY, extraY);
  if (gameMap.atPixel(mouseX, mouseY) === "Z") info(typeZ, damageZ, rangeZ, rateZ, extraZ);
}

function info(type, Damage, Range, Rate, Extra) {
  fill(255, 50);
  textAlign(LEFT, TOP);
  rect(mouseX, mouseY - 100, 100, 90);

  textSize(9 + 500 / textWidth(type));
  fill(0);
  text(type, mouseX + 5, mouseY - 96);

  textSize(12);
  fill(0, 255, 0);
  text(`Damage: ${Damage}`, mouseX + 5, mouseY - 75);
  text(`Range:    ${Range}`, mouseX + 5, mouseY - 60);
  text(`Rate:       ${Rate}`, mouseX + 5, mouseY - 45);

  textSize(13);
  fill(255, 255, 0);
  text(Extra, mouseX + 5, mouseY - 30);
}

function drawLevelUpTooltip(levelUpXPRequired) {
  const margin = 6;
  const tooltipText =
    levelUpXPRequired === null
      ? "Max age reached"
      : `XP: ${int(min(XP, levelUpXPRequired))}/${levelUpXPRequired}`;

  textSize(12);
  const tooltipW = max(76, int(textWidth(tooltipText) + 12));
  const tooltipH = 24;
  let tipX = mouseX + 10;
  let tipY = mouseY - tooltipH - 10;

  tipX = constrain(tipX, margin, width - tooltipW - margin);
  tipY = constrain(tipY, margin, height - tooltipH - margin);

  fill(255, 50);
  textAlign(LEFT, TOP);
  rect(tipX, tipY, tooltipW, tooltipH);

  if (levelUpXPRequired === null) fill(120);
  else fill(255, 255, 0);
  text(tooltipText, tipX + 6, tipY + 6);
}

function getLevelUpXPRequired() {
  if (Age === "Past") return 200;
  if (Age === "Present") return 600;
  return null;
}

function isLevelUpAvailable() {
  const requiredXP = getLevelUpXPRequired();
  return requiredXP !== null && XP >= requiredXP;
}

function getEnemyHP(type, wave) {
  const futureScale = pow(wave, 1.3);

  if (type === "Knight") return int(12 * wave);
  if (type === "Lancer") return int(20 * wave);
  if (type === "Rider") return int(8 * wave);

  if (type === "Rocket") return int(40 * wave);
  if (type === "Tank") return int(70 * wave);
  if (type === "Soldier") return int(30 * wave);

  if (type === "Robot") return int(30 * futureScale);
  if (type === "Spaceship") return int(42 * futureScale);
  if (type === "Ball") return int(24 * futureScale);

  return 1;
}

function getEnemyBounty(enemy) {
  if (enemy.type === "Boss1") return 700;
  if (enemy.type === "Boss2") return 2200;

  let config = { base: 1, k: 0.33, cap: 12 };
  if (enemy.spawnAge === "Present") config = { base: 7, k: 0.45, cap: 42 };
  if (enemy.spawnAge === "Future") config = { base: 14, k: 0.55, cap: 75 };

  const payout = config.base + sqrt(enemy.maxHP) * config.k + enemy.maxV / 90;
  return int(min(config.cap, payout));
}

function wave() {
  const dt = getDeltaTimeSafe();
  waveT -= dt;

  if (waveT < 0) {
    waveT = 20;
    waveN++;
    waveL += 10;
  }
  if (waveType <= 0) {
    waveType = 10;
    enemyType = int(random(3));
  }
  if (waveL > 0) {
    if (random() < (2 + waveL / 10) * dt) {
      waveL--;
      waveType--;
      if (Age === "Past") {
        if (enemyType === 0) enemies.push(new Enemy("Knight", getEnemyHP("Knight", waveN), 100));
        if (enemyType === 1) enemies.push(new Enemy("Lancer", getEnemyHP("Lancer", waveN), 80));
        if (enemyType === 2) enemies.push(new Enemy("Rider", getEnemyHP("Rider", waveN), 120));
      }
      if (Age === "Present") {
        if (enemyType === 0) enemies.push(new Enemy("Rocket", getEnemyHP("Rocket", waveN), 90));
        if (enemyType === 1) enemies.push(new Enemy("Tank", getEnemyHP("Tank", waveN), 70));
        if (enemyType === 2) enemies.push(new Enemy("Soldier", getEnemyHP("Soldier", waveN), 110));
      }
      if (Age === "Future") {
        if (enemyType === 0) enemies.push(new Enemy("Robot", getEnemyHP("Robot", waveN), 100));
        if (enemyType === 1) enemies.push(new Enemy("Spaceship", getEnemyHP("Spaceship", waveN), 60));
        if (enemyType === 2) enemies.push(new Enemy("Ball", getEnemyHP("Ball", waveN), 120));
      }
    }
  }
}

function levelUp() {
  lvUp = false;
  playSound(levelUpSound);
  if (Age === "Present") {
    Age = "Future";

    typeX = "Lasercannon";
    typeY = "Railgun";
    typeZ = "Wavegun";

    extraX = "          -";
    extraY = "Area Damage";
    extraZ = "Deceleration";

    mX = 800;
    mY = 1500;
    mZ = 3000;

    damageX = 3000;
    damageY = 3000;
    damageZ = 200;

    rangeX = 650;
    rangeY = 250;
    rangeZ = 500;

    rateX = 2;
    rateY = 18;
    rateZ = 70;
  }
  if (Age === "Past") {
    Age = "Present";

    typeX = "Tank";
    typeY = "Flamethrower";
    typeZ = "Turret";

    extraX = "          -";
    extraY = "Area Damage";
    extraZ = "Deceleration";

    mX = 500;
    mY = 700;
    mZ = 1000;

    damageX = 350;
    damageY = 250;
    damageZ = 200;

    rangeX = 700;
    rangeY = 300;
    rangeZ = 200;

    rateX = 4;
    rateY = 30;
    rateZ = 15;
  }
  for (let x = 0; x < gameMap.w; x++) {
    for (let y = 0; y < gameMap.h; y++) {
      if (gameMap.at(x, y) === "W") gameMap.set(x, y, "F");
      if (gameMap.at(x, y) === "P") gameMap.set(x, y, "W");
    }
  }
}

function newGame() {
  if (gameMap) gameMap.destroy();

  audioController.pauseMusic();
  enemies = [];
  towers = [];
  waveL = 0;
  waveN = 0;
  XP = 0;
  Coins = 350;
  typeX = "Cannon";
  typeY = "Catapult";
  typeZ = "Crossbow";
  extraX = "          -";
  extraY = "Area Damage";
  extraZ = "Deceleration";
  mX = 75;
  mY = 150;
  mZ = 200;
  damageX = 200;
  damageY = 80;
  damageZ = 40;
  rangeX = 350;
  rangeY = 600;
  rangeZ = 300;
  rateX = 5;
  rateY = 6;
  rateZ = 20;
  waveT = 20;
  waveType = 10;
  HP = 100;
  uSelect = true;
  select = false;
  allPlaced = true;
  lvUp = false;
  gameState = "Start";
  Age = "Past";

  ensureAudio();
  audioController.playMusic();
  if (audioController.musicElement) {
    audioController.musicElement.currentTime = 0;
  } 


  imageMode(CENTER);
  gameMap = new GameMap(mapName);
  gameMap.mode(CENTER);
  loadHighScore();
  oldScore = int(highScore[0]);
  pauseSelect = 0;

  for (let x = 0; x < gameMap.w; x++) {
    for (let y = 0; y < gameMap.h; y++) {
      if (gameMap.at(x, y) === "S") {
        gameMap.set(x, y, "P");
        startX = gameMap.centerXOfTile(x);
        startY = gameMap.centerYOfTile(y);
      }
      if (gameMap.at(x, y) === "B") {
        bX = gameMap.centerXOfTile(x);
        bY = gameMap.centerYOfTile(y);
      }
      if (gameMap.at(x, y) === "X") {
        Xx = gameMap.centerXOfTile(x);
        Xy = gameMap.centerYOfTile(y);
      }
      if (gameMap.at(x, y) === "Y") {
        Yx = gameMap.centerXOfTile(x);
        Yy = gameMap.centerYOfTile(y);
      }
      if (gameMap.at(x, y) === "Z") {
        Zx = gameMap.centerXOfTile(x);
        Zy = gameMap.centerYOfTile(y);
      }
    }
  }
}

function drawMaps() {
  if (map1) map1.destroy();
  if (map2) map2.destroy();
  if (map3) map3.destroy();
  if (map4) map4.destroy();
  if (map5) map5.destroy();
  if (map6) map6.destroy();

  background(0);
  fill(35, 90, 0);
  rect(width / 20, height / 4, width / 4, height / 4);
  rect(width / 20 * 7.5, height / 4, width / 4, height / 4);
  rect(width / 20 * 14, height / 4, width / 4, height / 4);
  rect(width / 20, height / 2 + height / 20, width / 4, height / 4);
  rect(width / 20 * 7.5, height / 2 + height / 20, width / 4, height / 4);
  rect(width / 20 * 14, height / 2 + height / 20, width / 4, height / 4);
  map1 = new GameMap("towerDefense1.map");
  map2 = new GameMap("towerDefense2.map");
  map3 = new GameMap("towerDefense3.map");
  map4 = new GameMap("towerDefense4.map");
  map5 = new GameMap("towerDefense5.map");
  map6 = new GameMap("towerDefense6.map");
  map1.draw(width / 20, height / 4);
  map2.draw(width / 20 * 7.5, height / 4);
  map3.draw(width / 20 * 14, height / 4);
  map4.draw(width / 20, height / 2 + height / 20);
  map5.draw(width / 20 * 7.5, height / 2 + height / 20);
  map6.draw(width / 20 * 14, height / 2 + height / 20);
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(200);
  text("'Space' = Next Wave     'P' = Pause     'M' = Volume     'N' = Render Mode", width / 2, height / 11 * 10);
}

function setAudioEnabled(enabled) {
  if (audioController) {
      audioController.setMute(!enabled);
      audioController.ensureContext();
  }
}

function playSound(sound) {
  if (audioController) audioController.play(sound);
}

function ensureAudio() {
  if (audioController) audioController.ensureContext();
}

function loadHighScore() {
  let stored = null;
  try {
    stored = localStorage.getItem(HIGH_SCORE_KEY);
  } catch (err) {
    stored = null;
  }

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && !isNaN(parseInt(parsed.score, 10))) {
        highScore = [String(parseInt(parsed.score, 10))];
        oldScore = int(highScore[0]);
        return;
      }
    } catch (err) {}
  }

  try {
    const legacy = localStorage.getItem("towerDefenseHighScore");
    if (legacy !== null && !isNaN(parseInt(legacy, 10))) {
      highScore = [String(parseInt(legacy, 10))];
      saveHighScore(int(highScore[0]));
      oldScore = int(highScore[0]);
      return;
    }
  } catch (err) {}

  if (defaultHighScore && defaultHighScore.length > 0) {
    highScore = [String(defaultHighScore[0]).trim()];
  } else {
    highScore = ["0"];
  }
  oldScore = int(highScore[0]);
}

function loadRenderMode() {
  let stored = null;
  try {
    stored = localStorage.getItem(RENDER_MODE_KEY);
  } catch (err) {
    stored = null;
  }
  if (stored === RENDER_MODE_SMOOTH || stored === RENDER_MODE_CRISP) {
    renderMode = stored;
  } else {
    renderMode = RENDER_MODE_CRISP;
  }
}

function saveRenderMode() {
  try {
    localStorage.setItem(RENDER_MODE_KEY, renderMode);
  } catch (err) {}
}

function getTargetPixelDensity() {
  if (renderMode === RENDER_MODE_SMOOTH) return min(2, window.devicePixelRatio || 1);
  return 1;
}

function applyRenderMode() {
  if (!mainCanvas || !mainCanvas.elt) return;

  if (renderMode === RENDER_MODE_SMOOTH) {
    smooth();
    if (drawingContext) drawingContext.imageSmoothingEnabled = true;
    mainCanvas.elt.style.imageRendering = "auto";
  } else {
    noSmooth();
    if (drawingContext) drawingContext.imageSmoothingEnabled = false;
    mainCanvas.elt.style.imageRendering = "pixelated";
  }
  applyCanvasScale();
}

function setRenderMode(mode) {
  const nextMode = mode === RENDER_MODE_SMOOTH ? RENDER_MODE_SMOOTH : RENDER_MODE_CRISP;
  renderMode = nextMode;
  saveRenderMode();

  pixelDensity(getTargetPixelDensity());
  if (mainCanvas) {
    resizeCanvas(BASE_CANVAS_WIDTH, BASE_CANVAS_HEIGHT);
    applyRenderMode();
    imageMode(CENTER);
  }

  if (gameState === "Pause") {
    pauseOverlayDrawn = false;
  }
  if (gameState === "GameOver") {
    gameOverOverlayDrawn = false;
  }
  if (gameState === "SelectMap") {
    drawMaps();
  }
}

function toggleRenderMode() {
  if (renderMode === RENDER_MODE_CRISP) setRenderMode(RENDER_MODE_SMOOTH);
  else setRenderMode(RENDER_MODE_CRISP);
}

function saveHighScore(score) {
  highScore = [String(score)];
  try {
    const payload = {
      score: parseInt(score, 10),
      date: new Date().toISOString(),
      map: mapName
    };
    localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(payload));
  } catch (err) {}
}

function getDeltaTimeSafe() {
  if (ignoreNextDelta) {
    ignoreNextDelta = false;
    return 1 / 60;
  }
  const dtMs = deltaTime;
  if (!dtMs || dtMs <= 0 || !isFinite(dtMs)) return 1 / 60;
  const dt = dtMs / 1000;
  return min(dt, 1 / 30);
}

function getCostScale() {
  return 1;
}

function getScaledCost(baseCost) {
  return int(ceil(baseCost * getCostScale()));
}

function getUpgradeCost(tower, stat) {
  let maxVal = 1;
  if (stat === "damage") maxVal = tower.maxDamage;
  else if (stat === "range") maxVal = tower.maxRange;
  else if (stat === "rate") maxVal = tower.maxRate;

  const currentVal = tower[stat];
  const baseCost = (currentVal * 2 / maxVal) * tower.cost;
  return getScaledCost(baseCost);
}
