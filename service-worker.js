const CACHE_NAME = "age-of-war-td-v5";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",
  "./a2hs.js",
  "./AudioController.js",
  "./Map.js",
  "./Enemy.js",
  "./Projectile.js",
  "./Tower.js",
  "./sketch.js",
  "./lib/p5.min.js",
  "./data/highScore.txt",
  "./data/towerDefense1.map",
  "./data/towerDefense2.map",
  "./data/towerDefense3.map",
  "./data/towerDefense4.map",
  "./data/towerDefense5.map",
  "./data/towerDefense6.map",
  "./data/towerDefenseBlank.map",
  "./data/icons/icon_180.png",
  "./data/icons/icon_192.png",
  "./data/icons/icon_512.png"
];

const IMAGE_NAMES = [
  "B",
  "C",
  "F",
  "G",
  "M",
  "P",
  "R",
  "S",
  "T",
  "W",
  "X",
  "Y",
  "Z",
  "ball",
  "boss1",
  "boss2",
  "cannon",
  "cannon2",
  "castle",
  "catapult",
  "catapult2",
  "crossbow",
  "crossbow2",
  "enemyTank",
  "future",
  "knight",
  "lancer",
  "laserCannon",
  "laserCannon2",
  "military",
  "railgun",
  "railgun2",
  "rider",
  "robot",
  "rocket",
  "settings",
  "settings_w",
  "soldier",
  "spaceship",
  "tank",
  "tank2",
  "thrower",
  "thrower2",
  "turret",
  "turretB",
  "turretT",
  "turretT2",
  "volume0",
  "volume1",
  "volume2",
  "volume3",
  "wavegun",
  "wavegunB",
  "wavegunT",
  "wavegunT2",
  "wavegunT2b"
];

const SOUND_NAMES = [
  "cannonShot",
  "catapultShot",
  "coins",
  "crossbowShot",
  "delete",
  "error",
  "gameOver",
  "lasercannonShot",
  "levelUp",
  "music",
  "place",
  "railgunShot",
  "tankShot",
  "throwerShot",
  "turretShot",
  "wavegunShot"
];

const IMAGE_ASSETS = IMAGE_NAMES.map((name) => `./data/images/${name}.png`);
const SOUND_ASSETS = SOUND_NAMES.map((name) => `./data/sounds/${name}.mp3`);
const PRE_CACHE_ASSETS = [...CORE_ASSETS, ...IMAGE_ASSETS, ...SOUND_ASSETS];

async function cacheAssets(cache, assetUrls) {
  await Promise.allSettled(
    assetUrls.map(async (url) => {
      const request = new Request(url, { cache: "no-store" });
      const response = await fetch(request);
      if (!response || !response.ok) return;
      await cache.put(request, response);
    })
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cacheAssets(cache, PRE_CACHE_ASSETS);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const response = await fetch(request);
          if (response && response.ok) {
            cache.put("./index.html", response.clone()).catch(() => {});
          }
          return response;
        } catch (_err) {
          const cachedPage = await cache.match(request);
          if (cachedPage) return cachedPage;
          const appShell = await cache.match("./index.html");
          if (appShell) return appShell;
          throw _err;
        }
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) {
        event.waitUntil(
          fetch(request)
            .then((response) => {
              if (response && response.ok) {
                return cache.put(request, response.clone());
              }
              return null;
            })
            .catch(() => null)
        );
        return cached;
      }

      const response = await fetch(request);
      if (response && response.ok) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    })()
  );
});
