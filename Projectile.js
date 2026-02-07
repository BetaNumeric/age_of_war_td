class Projectile {
  constructor(tmpDamage, tmpX, tmpY, tmpD, tmpV, tmpI, tmpC) {
    this.damage = tmpDamage;
    this.x = tmpX;
    this.y = tmpY;
    this.d = tmpD;
    this.v = tmpV;
    this.i = tmpI;
    this.c = tmpC;
    this.del = false;
    this.angle = 0;
  }

  draw() {
    fill(this.c);
    ellipse(this.x, this.y, this.d, this.d);
  }

  move() {
    if (enemies.length > 0 && enemies.length > this.i) {
      const target = enemies[this.i];
      if (
        abs(this.x - (target.x + target.rX)) > this.d ||
        abs(this.y - (target.y + target.rY)) > this.d
      ) {
        this.angle = atan2(target.y + target.rY - this.y, target.x + target.rX - this.x);
        this.x = this.x + round(this.v * cos(this.angle));
        this.y = this.y + round(this.v * sin(this.angle));
      } else {
        this.del = true;
        if (target.HP >= 0) target.HP -= this.damage;
      }
    }
  }
}
