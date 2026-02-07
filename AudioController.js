class AudioController {
  constructor() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    this.buffers = new Map();
    this.musicElement = null;
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    
    this.isMuted = false;
    this.volumeLevel = 3;
    this.musicMuted = false;
    this.toLoad = 0;
    this.loaded = 0;
    try {
      this.setVolumeLevel(this.volumeLevel);
    } catch (e) {
    }
  }

  loadSFX(key, url) {
    this.toLoad++;
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.ctx.decodeAudioData(arrayBuffer))
      .then(decodedAudio => {
        this.buffers.set(key, decodedAudio);
        this.loaded++;
      })
      .catch(err => {
        console.error("Failed to load sound:", url, err);
        this.loaded++;
      });
  }

  loadMusic(url) {
    this.musicElement = new Audio(url);
    this.musicElement.loop = true;
    this.musicElement.volume = 1.0;
  }

  isReady() {
    return this.loaded >= this.toLoad;
  }

  play(key) {
    if (this.isMuted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(e => console.error(e));
    }

    const buffer = this.buffers.get(key);
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.masterGain);
    source.start(0);
  }

  playMusic() {
    if (this.musicElement && !this.isMuted && !this.musicMuted) {
      this.musicElement.play().catch(e => {
        console.warn("Music play blocked (waiting for interaction):", e);
      });
    }
  }

  pauseMusic() {
    if (this.musicElement) {
      this.musicElement.pause();
    }
  }

  setMute(shouldMute) {
    this.isMuted = shouldMute;
    if (this.isMuted) {
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      if (this.musicElement) this.musicElement.volume = 0;
    } else {
      this.setVolumeLevel(this.volumeLevel);
    }
  }

  setMusicMuted(shouldMute) {
    this.musicMuted = shouldMute;
    if (!this.musicElement) return;
    if (this.musicMuted) {
      this.musicElement.volume = 0;
    } else {
      if (!this.isMuted) this.musicElement.volume = this.volumeLevel / 3;
    }
  }

  toggleMusicMuted() {
    this.setMusicMuted(!this.musicMuted);
  }

  isMusicMuted() {
    return !!this.musicMuted;
  }

  setVolumeLevel(level) {
    const clamped = Math.max(0, Math.min(3, Math.floor(level)));
    this.volumeLevel = clamped;
    this.isMuted = clamped === 0;
    const scalar = clamped / 3;
    try {
      this.masterGain.gain.setValueAtTime(scalar, this.ctx.currentTime);
    } catch (e) {
    }
    if (this.musicElement) this.musicElement.volume = scalar;
  }

  getVolumeLevel() {
    return this.volumeLevel;
  }

  cycleVolumeLevel() {
    const next = (this.volumeLevel + 1) % 4;
    this.setVolumeLevel(next);
  }
  
  ensureContext() {
     if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
      });
    }
  }
}
