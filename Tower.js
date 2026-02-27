class Tower {
  constructor(tempType, tempCost, tempDamage, tempRange, tempRate) {
    this.projectiles = [];
    this.cost = tempCost;
    this.baseCost = tempCost;
    const resaleCfg =
      typeof BALANCE !== "undefined" && BALANCE.towerResale
        ? BALANCE.towerResale
        : {
            initialFactor: 0.9,
            minFactor: 2 / 3,
            wearPerShot: 0.00002,
            wearPerDamage: 0.0000000005
          };
    this.invested = tempCost;
    this.initialResaleFactor = resaleCfg.initialFactor;
    this.minResaleFactor = resaleCfg.minFactor;
    this.resaleWearPerShot = resaleCfg.wearPerShot;
    this.resaleWearPerDamage = resaleCfg.wearPerDamage;
    this.resaleFactor = this.initialResaleFactor;
    this.worth = this.invested * this.resaleFactor;
    this.x = 0;
    this.y = 0;
    this.d = 30;
    this.damage = 0;
    this.maxDamage = tempDamage;
    this.range = 0;
    this.maxRange = tempRange;
    this.rate = 0;
    this.maxRate = tempRate;
    this.angle = 0;
    this.m = 0;
    this.mX = 0;
    this.mY = 0;
    this.mC = 0;
    this.time = 0;
    this.t = 0;
    this.Area = 0;
    this.AreaX = 0;
    this.AreaY = 0;
    this.AreaC = 0;
    this.aoeRadiusCatapult = 75;
    this.aoeRadiusFlamethrower = 100;
    this.aoeRadiusRailgun = 85;
    this.shootAnimTicks = 5;
    this.killTextFadePerSec = 300;
    this.panelX = 416;
    this.panelY = 544;
    this.panelW = 288;
    this.panelH = 160;
    this.sellButtonX = 624;
    this.sellButtonY = 560;
    this.sellButtonW = 64;
    this.sellButtonH = 32;
    this.upgradeButtonX = 422;
    this.upgradeButtonW = 48;
    this.upgradeButtonH = 24;
    this.upgradeDamageY = 595;
    this.upgradeRangeY = 625;
    this.upgradeRateY = 655;
    this.placed = false;
    this.del = false;
    this.shoot = false;
    this.type = tempType;

    this.damage = this.maxDamage / 8;
    this.range = this.maxRange / 2;
    this.rate = this.maxRate / 4;

    this.imgIdle = null;
    this.imgShoot = null;
    this.imgBase = null;

    if (this.type === "Cannon") {
      this.imgIdle = cannon;
      this.imgShoot = cannon2;
    } else if (this.type === "Catapult") {
      this.imgIdle = catapult;
      this.imgShoot = catapult2;
    } else if (this.type === "Crossbow") {
      this.imgIdle = crossbow;
      this.imgShoot = crossbow2;
    } else if (this.type === "Tank") {
      this.imgIdle = tank;
      this.imgShoot = tank2;
    } else if (this.type === "Turret") {
      this.imgIdle = turretT;
      this.imgShoot = turretT2;
      this.imgBase = turretB;
    } else if (this.type === "Flamethrower") {
      this.imgIdle = thrower;
      this.imgShoot = thrower2;
    } else if (this.type === "Lasercannon") {
      this.imgIdle = laserCannon;
      this.imgShoot = laserCannon2;
    } else if (this.type === "Wavegun") {
      this.imgIdle = wavegunT;
      this.imgShoot = wavegunT2;
      this.imgBase = wavegunB;
    } else if (this.type === "Railgun") {
      this.imgIdle = railgun;
      this.imgShoot = railgun2;
    }
  }

  draw() {
    if (!this.placed) this.placeTower();
    if (this.placed) this.shootEnemies();
    this.towerImage();
  }

  placeTower() {
    const placementPoint =
      typeof getTowerPlacementPoint === "function"
        ? getTowerPlacementPoint(this)
        : { x: mouseX, y: mouseY };
    this.x = placementPoint.x;
    this.y = placementPoint.y;
    const shouldCommitPlacement =
      typeof shouldCommitTowerPlacement === "function"
        ? shouldCommitTowerPlacement(this)
        : select === false;

    if (this.placeable()) {
      textAlign(CENTER, CENTER);
      textSize(this.d / 3);
      const costNow = getScaledCost(this.cost);
      if (Coins - costNow < 0) {
        fill(255, 0, 0);
        const short = floor(Coins - costNow);
        text(int(short), this.x, this.y - this.d / 2);
        fill(255, 0, 0, 100);
      } else {
        fill(255, 255, 0);
        text("$" + int(costNow), this.x, this.y - this.d / 2);
        noFill();
      }
      if (shouldCommitPlacement) {
        if (Coins - costNow < 0) {
          this.del = true;
        } else {
          Coins -= costNow;
          this.cost = costNow;
          this.invested = this.cost;
          this.resaleFactor = this.initialResaleFactor;
          this.recalculateWorth();
          playSound(place);
          playSound(coins);
          this.placed = true;
          select = false;
          if (typeof keyIsDown === 'function' && keyIsDown(SHIFT)) {
            towers.push(new Tower(this.type, this.baseCost, this.maxDamage, this.maxRange, this.maxRate));
            select = true;
            uSelect = true;
            noCursor();
          } else {
            cursor();
          }
        }
      }
    } else if (shouldCommitPlacement) {
      this.del = true;
    }
  }

  updateProjectiles() {
    for (let i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i].move();
      this.projectiles[i].draw();
      if (!this.projectileInside(i)) {
        this.projectiles.splice(i, 1);
        i--;
        continue;
      }
      if (this.projectiles.length > 0 && this.projectiles.length > i) {
        if (this.projectiles[i].del) {
          this.projectiles.splice(i, 1);
          i--;
        }
      }
    }
  }

  shootEnemies() {
    if (enemies.length > 0) {
      let i = enemies.length - 1;
      let furthest = 0;
      for (let j = enemies.length - 1; j >= 0; j--) {
        if (this.enemyInside(j) && enemies[j].steps >= furthest) {
          i = j;
          furthest = enemies[j].steps;
        }
      }
      if (this.enemyInside(i)) {
        this.angle = atan2(enemies[i].y + enemies[i].rY - this.y, enemies[i].x + enemies[i].rX - this.x);
        strokeWeight(3);
        stroke(255, 100, 0);
        const dt = getDeltaTimeSafe();
        this.time += dt;
        if (this.time >= 1 / this.rate) {
          this.time = 0;
          this.shoot = true;
          let damageDealt = 0;
          if (this.type === "Cannon") {
            playSound(cannonShot);
            strokeWeight(4);
            stroke(40);
          }
          if (this.type === "Catapult") {
            playSound(catapultShot);
            this.Area = this.aoeRadiusCatapult;
            damageDealt += this.AoE(i);
            strokeWeight(5);
            stroke(40);
          }
          if (this.type === "Crossbow") {
            playSound(crossbowShot);
            strokeWeight(2);
            stroke(77, 53, 19);
            if (enemies[i].V >= 70) enemies[i].V /= 1.3;
          }
          if (this.type === "Tank") {
            playSound(tankShot);
            strokeWeight(3);
            stroke(100, 50, 0);
          }
          if (this.type === "Flamethrower") {
            playSound(throwerShot);
            this.Area = this.aoeRadiusFlamethrower;
            damageDealt += this.AoE(i);
            strokeWeight(10);
            stroke(255, 200, 0, 200);
          }
          if (this.type === "Turret") {
            playSound(turretShot);
            if (enemies[i].V >= 50) enemies[i].V /= 1.5;
            strokeWeight(3);
            stroke(40);
          }
          if (this.type === "Lasercannon") {
            playSound(lasercannonShot);
            strokeWeight(3);
            stroke(255, 50, 0, 220);
          }
          if (this.type === "Railgun") {
            playSound(railgunShot);
            this.Area = this.aoeRadiusRailgun;
            damageDealt += this.AoE(i);
            strokeWeight(11);
            stroke(0, 88, 147, 150);
            line(this.x, this.y, enemies[i].x + enemies[i].rX, enemies[i].y + enemies[i].rY);
            strokeWeight(6);
            stroke(200, 0, 200, 200);
          }
          if (this.type === "Wavegun") {
            playSound(wavegunShot);
            if (enemies[i].V >= 65) enemies[i].V /= 2;
            strokeWeight(15);
            stroke(0, 150, 255, 150);
            line(this.x, this.y, enemies[i].x + enemies[i].rX, enemies[i].y + enemies[i].rY);
            strokeWeight(8);
            stroke(255, 255, 0, 150);
            line(this.x, this.y, enemies[i].x + enemies[i].rX, enemies[i].y + enemies[i].rY);
            strokeWeight(2);
            stroke(255);
          }
          line(this.x, this.y, enemies[i].x + enemies[i].rX, enemies[i].y + enemies[i].rY);
          if (enemies[i].HP >= 0) {
            enemies[i].HP -= this.damage;
            damageDealt += this.damage;
          }
          this.applyUseWear(damageDealt);
        }
      }
      if (enemies[i].HP < 0) {
        this.m = getEnemyBounty(enemies[i]);
        this.mX = enemies[i].x + enemies[i].rX;
        this.mY = enemies[i].y + enemies[i].rY;
        Coins += this.m;
        this.mC = 255;

        enemies.splice(i, 1);
        XP++;
      }
    }
    if (this.mC > 0) {
      const dt = getDeltaTimeSafe();
      this.mC = max(0, this.mC - this.killTextFadePerSec * dt);
      push();
      noStroke();
      fill(255, 255, 0, this.mC);
      textSize(10);
      textAlign(CENTER, CENTER);
      text("+" + int(this.m), this.mX, this.mY + this.mC / 25);
      pop();
    } else {
      this.m = 0;
    }
  }

  towerImage() {
    noStroke();
    noFill();
    const isPendingSelection =
      !this.placed && select && towers.length > 0 && towers[towers.length - 1] === this;
    const mobilePending =
      isPendingSelection &&
      typeof isMobilePlacementFlowActive === "function" &&
      isMobilePlacementFlowActive();
    if (!this.placeable() && ((select && this.mouseInside()) || mobilePending)) fill(255, 0, 0, 100);
    ellipse(this.x, this.y, this.d, this.d);
    
    if (this.imgBase) image(this.imgBase, this.x, this.y);

    push();
    translate(this.x, this.y);
    rotate(this.angle);
    if (this.shoot) {
      this.t--;
      if (this.t < 0) {
        this.shoot = false;
        this.t = this.shootAnimTicks;
      }
      if (this.imgShoot) image(this.imgShoot, 0, 0);
    } else {
      if (this.imgIdle) image(this.imgIdle, 0, 0);
    }
    pop();
    if (this.AreaC >= 0) this.AreaC -= 5;
    if (this.type === "Catapult") fill(100, 50, 0, this.AreaC);
    if (this.type === "Flamethrower") fill(255, 100, 0, this.AreaC);
    if (this.type === "Railgun") fill(85, 153, 143, this.AreaC);
    ellipse(this.AreaX, this.AreaY, this.Area, this.Area);
  }

  AoE(i) {
    this.AreaX = enemies[i].x;
    this.AreaY = enemies[i].y;
    this.AreaC = 100;
    let aoeDamageDealt = 0;
    const aoeDamage = this.damage / 2;
    for (let j = 0; j < enemies.length; j++) {
      if (i === j) continue;
      const dx = enemies[j].x - this.AreaX;
      const dy = enemies[j].y - this.AreaY;
      if (dx * dx + dy * dy < this.Area * this.Area) {
        if (enemies[j].HP >= 0) {
          enemies[j].HP -= aoeDamage;
          aoeDamageDealt += aoeDamage;
        }
      }
    }
    return aoeDamageDealt;
  }

  recalculateWorth() {
    this.worth = this.invested * this.resaleFactor;
  }

  registerInvestment(amount) {
    if (!amount || amount <= 0) return;
    this.invested += amount;
    this.recalculateWorth();
  }

  applyUseWear(damageDealt) {
    const wear = this.resaleWearPerShot + max(0, damageDealt) * this.resaleWearPerDamage;
    this.resaleFactor = max(this.minResaleFactor, this.resaleFactor - wear);
    this.recalculateWorth();
  }

  data() {
    textAlign(LEFT, TOP);
    fill(0, 64);
    rect(this.panelX, this.panelY, this.panelW, this.panelH);
    if (this.placed) {
      fill(255, 255, 0);
      rect(this.sellButtonX, this.sellButtonY, this.sellButtonW, this.sellButtonH);
      textAlign(CENTER, CENTER);
      fill(0);
      textSize(20 - this.worth / 2500);
      text("$" + int(this.worth), this.sellButtonX + this.sellButtonW / 2, this.sellButtonY + this.sellButtonH / 2);
      fill(0, 155, 0);
      if (Coins - getUpgradeCost(this, "damage") < 0) fill(255, 0, 0);
      textSize(14);
      if ((this.damage / this.maxDamage) * 100 < 100) {
        rect(this.upgradeButtonX, this.upgradeDamageY, this.upgradeButtonW, this.upgradeButtonH);
        textAlign(LEFT, CENTER);
        fill(255);
        text(" $" + getUpgradeCost(this, "damage"), this.upgradeButtonX - 2, this.upgradeDamageY + this.upgradeButtonH / 2);
      }
      fill(0, 155, 0);
      if (Coins - getUpgradeCost(this, "range") < 0) fill(255, 0, 0);
      if ((this.range / this.maxRange) * 100 < 100) {
        rect(this.upgradeButtonX, this.upgradeRangeY, this.upgradeButtonW, this.upgradeButtonH);
        textAlign(LEFT, CENTER);
        fill(255);
        text(" $" + getUpgradeCost(this, "range"), this.upgradeButtonX - 2, this.upgradeRangeY + this.upgradeButtonH / 2);
      }
      fill(0, 155, 0);
      if (Coins - getUpgradeCost(this, "rate") < 0) fill(255, 0, 0);
      if ((this.rate / this.maxRate) * 100 < 100) {
        rect(this.upgradeButtonX, this.upgradeRateY, this.upgradeButtonW, this.upgradeButtonH);
        textAlign(LEFT, CENTER);
        fill(255);
        text(" $" + getUpgradeCost(this, "rate"), this.upgradeButtonX - 2, this.upgradeRateY + this.upgradeButtonH / 2);
      }
    }
    fill(0, 255, 0, 20);
    noStroke();
    ellipse(this.x, this.y, this.range, this.range);
    if (towers.length > 0) {
      const panelLeft = this.panelX;
      const panelTop = this.panelY;
      textAlign(LEFT, TOP);
      fill(255);
      textSize(25);
      text(this.type, panelLeft + 16, this.sellButtonY);
      textSize(20);
      text(
        `Damage: ${int(this.damage)} (${int((this.damage / this.maxDamage) * 100)}%)`,
        panelLeft + 64,
        panelTop + 54
      );
      text(
        `Range:    ${int(this.range)} (${int((this.range / this.maxRange) * 100)}%)`,
        panelLeft + 64,
        panelTop + 84
      );
      text(
        `Rate:       ${int(this.rate)} (${int((this.rate / this.maxRate) * 100)}%)`,
        panelLeft + 64,
        panelTop + 114
      );
    }
  }

  enemyInside(i) {
    const dx = this.x - (enemies[i].x + enemies[i].rX);
    const dy = this.y - (enemies[i].y + enemies[i].rY);
    const r = this.range / 2 + enemies[i].d / 2;
    return dx * dx + dy * dy < r * r;
  }

  projectileInside(i) {
    const dx = this.x - this.projectiles[i].x;
    const dy = this.y - this.projectiles[i].y;
    const r = this.range / 2 + this.projectiles[i].d / 2;
    return dx * dx + dy * dy < r * r;
  }

  mouseInside() {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const r = this.d / 2;
    return dx * dx + dy * dy < r * r;
  }

  placeable() {
    let inT = false;
    for (let i = 0; i < towers.length; i++) {
      if (towers[i] === this) continue;
      const dx = this.x - towers[i].x;
      const dy = this.y - towers[i].y;
      const r = this.d / 2 + towers[i].d / 2;
      if (dx * dx + dy * dy < r * r) {
        inT = true;
        break;
      }
    }
    return !inT && gameMap.testTileFullyInsideRect(this.x, this.y, this.d, this.d, "G");
  }
}
