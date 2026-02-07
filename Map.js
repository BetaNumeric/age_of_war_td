class TileReference {
  constructor(mapRef, tmpX, tmpY) {
    this.mapRef = mapRef;
    this.x = tmpX;
    this.y = tmpY;
    this.setBorders();
    this.xPixel = this.centerX;
    this.yPixel = this.centerY;
  }

  setBorders() {
    const mapRef = this.mapRef;
    this.tile = mapRef.at(this.x, this.y);
    this.left = mapRef.leftOfTile(this.x);
    this.right = mapRef.rightOfTile(this.x);
    this.top = mapRef.topOfTile(this.y);
    this.bottom = mapRef.bottomOfTile(this.y);
    this.centerX = mapRef.centerXOfTile(this.x);
    this.centerY = mapRef.centerYOfTile(this.y);
  }

  advanceTowards(goalX, goalY) {
    const mapRef = this.mapRef;
    const dX = goalX - this.xPixel;
    const dY = goalY - this.yPixel;

    let lambdaToNextX = Infinity;
    if (dX > 0) {
      const nextX = (this.x + 1) * mapRef.tileSize;
      lambdaToNextX = (nextX - this.xPixel) / dX;
    } else if (dX < 0) {
      const nextX = this.x * mapRef.tileSize;
      lambdaToNextX = (nextX - this.xPixel) / dX;
    }

    let lambdaToNextY = Infinity;
    if (dY > 0) {
      const nextY = (this.y + 1) * mapRef.tileSize;
      lambdaToNextY = (nextY - this.yPixel) / dY;
    } else if (dY < 0) {
      const nextY = this.y * mapRef.tileSize;
      lambdaToNextY = (nextY - this.yPixel) / dY;
    }

    if (lambdaToNextX < lambdaToNextY && lambdaToNextX < 1) {
      this.xPixel += dX * lambdaToNextX;
      this.yPixel += dY * lambdaToNextX;
      if (dX > 0) this.x++;
      else this.x--;
    } else if (lambdaToNextY <= lambdaToNextX && lambdaToNextY < 1) {
      this.xPixel += dX * lambdaToNextY;
      this.yPixel += dY * lambdaToNextY;
      if (dY > 0) this.y++;
      else this.y--;
    } else {
      this.xPixel = goalX;
      this.yPixel = goalY;
    }
  }
}

class GameMap {
  constructor(mapFileOrTileSize) {
    this.buffer = null;
    this.modeValue = CORNER;
    this.images = new Array(26).fill(null);
    if (typeof mapFileOrTileSize === "string") {
      this.loadFile(mapFileOrTileSize);
    } else {
      this.tileSize = mapFileOrTileSize;
    }
  }

  destroy() {
    if (this.buffer) {
      this.buffer.remove();
      this.buffer = null;
    }
  }

  mode(tmpMode) {
    this.modeValue = tmpMode;
  }

  widthPixel() {
    return this.w * this.tileSize;
  }

  heightPixel() {
    return this.h * this.tileSize;
  }

  leftOfTile(x) {
    return x * this.tileSize;
  }

  rightOfTile(x) {
    return (x + 1) * this.tileSize - 1;
  }

  topOfTile(y) {
    return y * this.tileSize;
  }

  bottomOfTile(y) {
    return (y + 1) * this.tileSize - 1;
  }

  centerXOfTile(x) {
    return x * this.tileSize + this.tileSize / 2;
  }

  centerYOfTile(y) {
    return y * this.tileSize + this.tileSize / 2;
  }

  at(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return "_";
    return this.map[y].charAt(x);
  }

  atPixel(x, y) {
    return this.at(floor(x / this.tileSize), floor(y / this.tileSize));
  }

  set(x, y, ch) {
    if (x < 0 || y < 0) return;
    this.buffer = null;
    this.extend(x + 1, y + 1);
    this.map[y] = this.replace(this.map[y], x, ch);
  }

  setPixel(x, y, ch) {
    this.set(floor(x / this.tileSize), floor(y / this.tileSize), ch);
  }

  newRefOfPixel(pixelX, pixelY) {
    const ref = new TileReference(this, floor(pixelX / this.tileSize), floor(pixelY / this.tileSize));
    ref.xPixel = pixelX;
    ref.yPixel = pixelY;
    return ref;
  }

  testTileInRect(x, y, w, h, list) {
    if (this.modeValue === CENTER) {
      x -= w / 2;
      y -= w / 2;
    }
    if (this.modeValue === CORNERS) {
      w = w - x;
      h = h - y;
    }

    const startX = floor(x / this.tileSize);
    const startY = floor(y / this.tileSize);
    const endX = floor((x + w) / this.tileSize);
    const endY = floor((y + h) / this.tileSize);

    for (let xx = startX; xx <= endX; xx++) {
      for (let yy = startY; yy <= endY; yy++) {
        if (list.indexOf(this.at(xx, yy)) !== -1) return true;
      }
    }
    return false;
  }

  findTileInRect(x, y, w, h, list) {
    if (this.modeValue === CENTER) {
      x -= w / 2;
      y -= w / 2;
    }
    if (this.modeValue === CORNERS) {
      w = w - x;
      h = h - y;
    }

    const startX = floor(x / this.tileSize);
    const startY = floor(y / this.tileSize);
    const endX = floor((x + w) / this.tileSize);
    const endY = floor((y + h) / this.tileSize);

    for (let xx = startX; xx <= endX; xx++) {
      for (let yy = startY; yy <= endY; yy++) {
        if (list.indexOf(this.at(xx, yy)) !== -1) return new TileReference(this, xx, yy);
      }
    }
    return null;
  }

  findClosestTileInRect(x, y, w, h, list) {
    if (this.modeValue === CENTER) {
      x -= w / 2;
      y -= w / 2;
    }
    if (this.modeValue === CORNERS) {
      w = w - x;
      h = h - y;
    }

    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const startX = floor(x / this.tileSize);
    const startY = floor(y / this.tileSize);
    const endX = floor((x + w) / this.tileSize);
    const endY = floor((y + h) / this.tileSize);

    let xFound = -1;
    let yFound = -1;
    let dFound = Infinity;

    for (let xx = startX; xx <= endX; xx++) {
      for (let yy = startY; yy <= endY; yy++) {
        if (list.indexOf(this.at(xx, yy)) !== -1) {
          const d = dist(this.centerXOfTile(xx), this.centerYOfTile(yy), centerX, centerY);
          if (d < dFound) {
            dFound = d;
            xFound = xx;
            yFound = yy;
          }
        }
      }
    }
    if (dFound < Infinity) return new TileReference(this, xFound, yFound);
    return null;
  }

  testTileFullyInsideRect(x, y, w, h, list) {
    if (this.modeValue === CENTER) {
      x -= w / 2;
      y -= w / 2;
    }
    if (this.modeValue === CORNERS) {
      w = w - x;
      h = h - y;
    }

    const startX = floor(x / this.tileSize);
    const startY = floor(y / this.tileSize);
    const endX = floor((x + w) / this.tileSize);
    const endY = floor((y + h) / this.tileSize);

    for (let xx = startX; xx <= endX; xx++) {
      for (let yy = startY; yy <= endY; yy++) {
        if (list.indexOf(this.at(xx, yy)) === -1) return false;
      }
    }
    return true;
  }

  findTileOnLine(x1, y1, x2, y2, list) {
    const ref = this.newRefOfPixel(x1, y1);
    let ctr = 0;
    const maxCtr = floor(abs(x1 - x2) + abs(y1 - y2)) / this.tileSize + 3;
    while (ctr <= maxCtr && (ref.xPixel !== x2 || ref.yPixel !== y2)) {
      if (ctr > 0) ref.advanceTowards(x2, y2);
      if (list.indexOf(this.at(ref.x, ref.y)) !== -1) {
        ref.setBorders();
        return ref;
      }
      ctr++;
    }
    if (ctr > maxCtr) console.warn("Internal error in GameMap.findTileOnLine");
    return null;
  }

  testTileOnLine(x1, y1, x2, y2, list) {
    return this.findTileOnLine(x1, y1, x2, y2, list) !== null;
  }

  draw(leftX, topY) {
    if (!this.buffer) {
      this.buffer = createGraphics(this.w * this.tileSize, this.h * this.tileSize);
      this.buffer.noStroke();
      for (let y = 0; y < this.h; ++y) {
        for (let x = 0; x < this.w; ++x) {
          let img = null;
          const tile = this.at(x, y);
          if (tile === "_") img = this.outsideImage;
          else if (tile >= "A" && tile <= "Z") img = this.images[tile.charCodeAt(0) - 65];
          if (img) {
            this.buffer.image(img, x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
          }
        }
      }
    }
    push();
    imageMode(CORNER);
    image(this.buffer, leftX, topY);
    pop();
  }

  loadFile(mapFile) {
    this.buffer = null;
    const lines = mapData[mapFile];
    if (!lines) throw new Error(`Map ${mapFile} not found.`);

    this.map = lines.map((line) => line.replace(/\r/g, ""));
    while (this.map.length > 0 && this.map[this.map.length - 1].trim() === "") this.map.pop();

    this.h = this.map.length;
    if (this.h === 0) throw new Error("Map has zero size");
    this.w = this.map[0].length;

    for (let c = 65; c <= 90; c++) {
      const letter = String.fromCharCode(c);
      this.images[c - 65] = tileImages[letter] || null;
    }
    this.outsideImage = tileImages["_"] || null;

    for (let y = 0; y < this.h; y++) {
      const line = this.map[y];
      if (line.length !== this.w) throw new Error("Not every line in map of same length");
      for (let x = 0; x < line.length; x++) {
        const ch = line.charAt(x);
        if (ch === " " || ch === "_") {
          continue;
        }
        if (ch >= "A" && ch <= "Z") {
          if (!this.images[ch.charCodeAt(0) - 65]) {
            throw new Error(`Image for ${ch}.png missing`);
          }
        } else {
          throw new Error("map must only contain A-Z, space or _");
        }
      }
    }

    this.determineTileSize();
  }

  saveFile(mapFile) {
    saveStrings(mapFile, this.map);
  }

  determineTileSize() {
    this.tileSize = 0;
    const allImages = this.images.slice();
    allImages.push(this.outsideImage);

    for (let i = 0; i < allImages.length; i++) {
      const img = allImages[i];
      if (!img) continue;

      if (this.tileSize > 0 && (img.width !== this.tileSize || img.height !== this.tileSize)) {
        console.warn("WARNING: Images are not square and of same size");
      }

      if (gameState === "Start") {
        if (img.width > this.tileSize) this.tileSize = img.width;
        if (img.height > this.tileSize) this.tileSize = img.height;
      } else {
        if (img.width > this.tileSize) this.tileSize = img.width / 4;
        if (img.height > this.tileSize) this.tileSize = img.height / 4;
      }
    }

    if (this.tileSize === 0) throw new Error("No image could be loaded.");
  }

  extend(width, height) {
    while (height > this.h) {
      this.map.push("");
      this.h++;
    }
    if (this.w < width) this.w = width;
    for (let y = 0; y < this.h; y++) {
      while (this.map[y].length < this.w) this.map[y] += "_";
    }
  }

  replace(s, index, ch) {
    return s.substring(0, index) + ch + s.substring(index + 1, s.length);
  }
}
