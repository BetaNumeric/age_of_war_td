class Enemy {
  constructor(tmpType, tmpStr, tmpV) {
    this.x = startX;
    this.y = startY;
    const jitter = this.getVisualJitterRange();
    this.rX = random(-jitter, jitter);
    this.rY = random(-jitter, jitter);
    this.r = random(-1, 1);
    this.d = 1;
    this.V = tmpV;
    this.Vx = 0;
    this.Vy = 0;
    this.type = tmpType;
    this.spawnAge = typeof Age === "string" ? Age : "Past";

    if (this.type === "Boss1" || this.type === "Boss2") {
      this.rX = 0;
      this.rY = 0;
    }

    this.HP = tmpStr;
    this.maxHP = this.HP;
    this.maxV = this.V;
    this.firstD();
    this.steps = 0;
    this.stuckTime = 0;
  }

  getTileStep() {
    if (gameMap && gameMap.tileSize) return gameMap.tileSize;
    return 32;
  }

  getTurnProbe() {
    return this.getTileStep() / 4;
  }

  getVisualJitterRange() {
    return this.getTileStep() / 4;
  }

  getSpeedRecoveryPerSecond() {
    return 6;
  }

  getStuckStepEpsilon() {
    return 0.01;
  }

  getOutOfBoundsMarginTiles() {
    return 2;
  }

  getStuckResetSeconds() {
    return 3;
  }

  draw() {
    push();
    translate(this.x + this.rX, this.y + this.rY);
    if (this.Vx < 0) rotate(radians(0));
    if (this.Vx > 0) rotate(radians(180));
    if (this.Vy < 0) rotate(radians(90));
    if (this.Vy > 0) rotate(radians(270));
    push();
    if (this.r < 0) scale(1, -1);
    if (this.type === "Knight") image(knight, 0, 0);
    if (this.type === "Lancer") image(lancer, 0, 0);
    if (this.type === "Rider") image(rider, 0, 0);
    if (this.type === "Boss1") image(boss1, 0, 0);
    if (this.type === "Soldier") image(soldier, 0, 0);
    if (this.type === "Rocket") image(rocket, 0, 0);
    if (this.type === "Tank") image(enemyTank, 0, 0);
    if (this.type === "Boss2") image(boss2, 0, 0);
    if (this.type === "Robot") image(robot, 0, 0);
    if (this.type === "Spaceship") image(spaceship, 0, 0);
    if (this.type === "Ball") image(ball, 0, 0);
    pop();
    pop();

    const barYOffset = 16;
    const bossBarWidth = 32;
    const bossBarHeight = 5;
    const normalBarWidth = 16;
    const normalBarHeight = 3;

    if (this.type === "Boss1" || this.type === "Boss2") {
      fill(255, 0, 0);
      rect(
        this.x - bossBarWidth / 2 + this.rX,
        this.y - barYOffset + this.rY,
        (this.HP / this.maxHP) * bossBarWidth,
        bossBarHeight
      );
      stroke(0);
      strokeWeight(0.5);
      noFill();
      rect(this.x - bossBarWidth / 2 + this.rX, this.y - barYOffset + this.rY, bossBarWidth, bossBarHeight);
    } else {
      fill(0, 255, 0);
      rect(
        this.x - normalBarWidth / 2 + this.rX,
        this.y - barYOffset + this.rY,
        (this.HP / this.maxHP) * normalBarWidth,
        normalBarHeight
      );
      stroke(0);
      strokeWeight(0.5);
      noFill();
      rect(this.x - normalBarWidth / 2 + this.rX, this.y - barYOffset + this.rY, normalBarWidth, normalBarHeight);
    }
  }

  base() {
    return gameMap.testTileInRect(this.x + this.rX, this.y + this.rY, this.d, this.d, "B");
  }

  firstD() {
    const tileStep = this.getTileStep();
    if (gameMap.testTileInRect(this.x + tileStep, this.y, this.d, this.d, "WPF")) this.Vx = this.V;
    if (gameMap.testTileInRect(this.x - tileStep, this.y, this.d, this.d, "WPF")) this.Vx = -this.V;
    if (gameMap.testTileInRect(this.x, this.y + tileStep, this.d, this.d, "WPF")) this.Vy = this.V;
    if (gameMap.testTileInRect(this.x, this.y - tileStep, this.d, this.d, "WPF")) this.Vy = -this.V;
  }

  move() {
    const tileStep = this.getTileStep();
    const turnProbe = this.getTurnProbe();

    if (this.Vx < 0) this.Vx = -this.V;
    if (this.Vx > 0) this.Vx = this.V;
    if (this.Vy < 0) this.Vy = -this.V;
    if (this.Vy > 0) this.Vy = this.V;

    const dt = getDeltaTimeSafe();
    if (this.V < this.maxV) this.V = min(this.maxV, this.V + this.getSpeedRecoveryPerSecond() * dt);

    this.x += this.Vx * dt;
    this.y += this.Vy * dt;

    const prevSteps = this.steps;
    this.steps += (abs(this.Vx) + abs(this.Vy)) * dt;

    const stepDelta = this.steps - prevSteps;
    if (stepDelta < this.getStuckStepEpsilon()) this.stuckTime += dt;
    else this.stuckTime = 0;

    if (gameMap.testTileFullyInsideRect(this.x, this.y, this.d, this.d, "G")) this.V = -this.V;
    if (gameMap.testTileFullyInsideRect(this.x, this.y, this.d, this.d, "_M")) {
      this.x = startX;
      this.y = startY;
      this.firstD();
      this.stuckTime = 0;
    }

    const margin = gameMap.tileSize * this.getOutOfBoundsMarginTiles();
    if (
      this.x < -margin ||
      this.y < -margin ||
      this.x > gameMap.widthPixel() + margin ||
      this.y > gameMap.heightPixel() + margin
    ) {
      this.x = startX;
      this.y = startY;
      this.firstD();
      this.stuckTime = 0;
    }

    if (gameMap.testTileInRect(this.x + turnProbe, this.y, this.d, this.d, "G_") && this.Vx > 0) {
      if (gameMap.testTileInRect(this.x, this.y - tileStep, this.d, this.d, "G_")) {
        this.Vy = this.V;
        this.Vx = 0;
      }
      if (gameMap.testTileInRect(this.x, this.y + tileStep, this.d, this.d, "G_")) {
        this.Vy = -this.V;
        this.Vx = 0;
      }
      if (
        gameMap.testTileInRect(this.x, this.y + tileStep, this.d, this.d, "WPF") &&
        gameMap.testTileInRect(this.x, this.y - tileStep, this.d, this.d, "WPF")
      ) {
        if (this.randomD()) this.Vy = -this.V;
        else this.Vy = this.V;
        this.Vx = 0;
      }
    }

    if (gameMap.testTileInRect(this.x - turnProbe, this.y, this.d, this.d, "G_") && this.Vx < 0) {
      if (gameMap.testTileInRect(this.x, this.y - tileStep, this.d, this.d, "G_")) {
        this.Vy = this.V;
        this.Vx = 0;
      }
      if (gameMap.testTileInRect(this.x, this.y + tileStep, this.d, this.d, "G_")) {
        this.Vy = -this.V;
        this.Vx = 0;
      }
      if (
        gameMap.testTileInRect(this.x, this.y + tileStep, this.d, this.d, "WPF") &&
        gameMap.testTileInRect(this.x, this.y - tileStep, this.d, this.d, "WPF")
      ) {
        if (this.randomD()) this.Vy = -this.V;
        else this.Vy = this.V;
        this.Vx = 0;
      }
    }

    if (gameMap.testTileInRect(this.x, this.y + turnProbe, this.d, this.d, "G_") && this.Vy > 0) {
      if (gameMap.testTileInRect(this.x - tileStep, this.y, this.d, this.d, "G_")) {
        this.Vx = this.V;
        this.Vy = 0;
      }
      if (gameMap.testTileInRect(this.x + tileStep, this.y, this.d, this.d, "G_")) {
        this.Vx = -this.V;
        this.Vy = 0;
      }
      if (
        gameMap.testTileInRect(this.x + tileStep, this.y, this.d, this.d, "WPF") &&
        gameMap.testTileInRect(this.x - tileStep, this.y, this.d, this.d, "WPF")
      ) {
        if (this.randomD()) this.Vx = -this.V;
        else this.Vx = this.V;
        this.Vy = 0;
      }
    }

    if (gameMap.testTileInRect(this.x, this.y - turnProbe, this.d, this.d, "G_") && this.Vy < 0) {
      if (gameMap.testTileInRect(this.x - tileStep, this.y, this.d, this.d, "G_")) {
        this.Vx = this.V;
        this.Vy = 0;
      }
      if (gameMap.testTileInRect(this.x + tileStep, this.y, this.d, this.d, "G_")) {
        this.Vx = -this.V;
        this.Vy = 0;
      }
      if (
        gameMap.testTileInRect(this.x + tileStep, this.y, this.d, this.d, "WPF") &&
        gameMap.testTileInRect(this.x - tileStep, this.y, this.d, this.d, "WPF")
      ) {
        if (this.randomD()) this.Vx = -this.V;
        else this.Vx = this.V;
        this.Vy = 0;
      }
    }

    if (this.stuckTime > this.getStuckResetSeconds()) {
      this.x = startX;
      this.y = startY;
      this.firstD();
      this.stuckTime = 0;
    }
  }

  randomD() {
    return random(1) > 0.5;
  }
}
