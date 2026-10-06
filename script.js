/**
 * ===================================================================
 * ⚖️ EL DÍA DE ALEX: ENCUENTRA EL EQUILIBRIO
 * Lógica pedagógica e interactiva completa (HTML5, CSS3, Vanilla JS)
 * ===================================================================
 */

// -------------------------------------------------------------------
// 1. MOTOR DE AUDIO CON WEB AUDIO API (Sintetizador 100% Offline)
// -------------------------------------------------------------------
const SoundEngine = {
  ctx: null,
  enabled: true,

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  },

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  },

  playPop() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  },

  playSuccess() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + (idx * 0.09);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.3);
    });
  },

  playChime() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [880, 1174.66].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + (idx * 0.12);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.15, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.38);
    });
  },

  playError() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
  },

  playFanfare() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.14 },
      { f: 1046.50, d: 0.45 }
    ];

    let t = now;
    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + n.d + 0.05);

      t += n.d * 0.85;
    });
  }
};

// -------------------------------------------------------------------
// 2. SISTEMA DE PARTÍCULAS DE CONFETI (Para celebraciones)
// -------------------------------------------------------------------
const ConfettiFX = {
  canvas: null,
  ctx: null,
  particles: [],
  animId: null,

  init() {
    this.canvas = document.getElementById('confetti-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  },

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  },

  launch(count = 70) {
    if (!this.canvas || !this.ctx) return;
    const colors = ['#2A9D8F', '#E76F51', '#F4A261', '#E9C46A', '#48CAE4', '#7209B7'];
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: -10 - Math.random() * 50,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        velX: (Math.random() - 0.5) * 4,
        velY: Math.random() * 4 + 3,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8
      });
    }

    if (!this.animId) {
      this.render();
    }
  },

  render() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.velX;
      p.y += p.velY;
      p.rot += p.rotSpeed;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rot * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      this.ctx.restore();

      if (p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.render());
    } else {
      this.animId = null;
    }
  }
};

// -------------------------------------------------------------------
// 3. GENERADOR DE ILUSTRACIONES VECTORIALES DE ALEX (SVG Consistente)
// -------------------------------------------------------------------
const AlexArt = {
  getSvg(pose = 'happy', expression = 'happy', width = 160, height = 180) {
    let eyesSvg = '';
    let mouthSvg = '';
    let sweatSvg = '';
    let armsSvg = '';
    let bodyTransform = '';
    let extraAccessories = '';

    // Expresión facial
    switch (expression) {
      case 'tired':
        eyesSvg = `
          <!-- Ojos cansados -->
          <path d="M42 48 Q50 46 56 50" stroke="#264653" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path d="M68 50 Q74 46 82 48" stroke="#264653" stroke-width="3" stroke-linecap="round" fill="none"/>
          <ellipse cx="49" cy="53" rx="3.5" ry="2" fill="#264653"/>
          <ellipse cx="75" cy="53" rx="3.5" ry="2" fill="#264653"/>
          <path d="M40 58 Q49 61 58 58" stroke="#FFAA80" stroke-width="2" fill="none"/>
          <path d="M66 58 Q75 61 84 58" stroke="#FFAA80" stroke-width="2" fill="none"/>
        `;
        mouthSvg = `<path d="M54 68 Q62 65 70 68" stroke="#5C3827" stroke-width="2.5" stroke-linecap="round" fill="none"/>`;
        sweatSvg = `<path d="M86 42 Q90 48 86 52 Q82 48 86 42 Z" fill="#48CAE4"/>`;
        break;

      case 'surprised':
        eyesSvg = `
          <!-- Ojos de sorpresa -->
          <circle cx="49" cy="49" r="6" fill="#264653"/>
          <circle cx="51" cy="47" r="2.2" fill="#FFFFFF"/>
          <circle cx="75" cy="49" r="6" fill="#264653"/>
          <circle cx="77" cy="47" r="2.2" fill="#FFFFFF"/>
        `;
        mouthSvg = `<ellipse cx="62" cy="68" rx="5" ry="7" fill="#E76F51"/>`;
        break;

      case 'proud':
      case 'satisfaction':
        eyesSvg = `
          <!-- Ojos felices guiñando o brillantes -->
          <path d="M42 50 Q49 43 56 50" stroke="#264653" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          <path d="M68 50 Q75 43 82 50" stroke="#264653" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          <circle cx="40" cy="56" r="4.5" fill="#FFAA80" opacity="0.6"/>
          <circle cx="84" cy="56" r="4.5" fill="#FFAA80" opacity="0.6"/>
        `;
        mouthSvg = `
          <path d="M50 64 Q62 76 74 64" fill="#E76F51" stroke="#264653" stroke-width="2"/>
          <path d="M54 65 Q62 70 70 65" fill="#FFFFFF"/>
        `;
        break;

      case 'happy':
      default:
        eyesSvg = `
          <!-- Ojos alegres con destellos -->
          <circle cx="49" cy="49" r="5" fill="#264653"/>
          <circle cx="51" cy="47" r="1.8" fill="#FFFFFF"/>
          <circle cx="75" cy="49" r="5" fill="#264653"/>
          <circle cx="77" cy="47" r="1.8" fill="#FFFFFF"/>
          <circle cx="40" cy="56" r="4" fill="#FFAA80" opacity="0.6"/>
          <circle cx="84" cy="56" r="4" fill="#FFAA80" opacity="0.6"/>
        `;
        mouthSvg = `<path d="M52 64 Q62 72 72 64" stroke="#5C3827" stroke-width="3" stroke-linecap="round" fill="none"/>`;
        break;
    }

    // Poses del cuerpo
    let legsSvg = `
      <!-- Piernas rectas -->
      <rect x="48" y="118" width="11" height="42" rx="4" fill="#264653"/>
      <rect x="65" y="118" width="11" height="42" rx="4" fill="#264653"/>
      <!-- Zapatos -->
      <path d="M43 158 Q53 158 59 160 L59 164 Q46 166 43 164 Z" fill="#F4A261"/>
      <path d="M65 160 Q71 158 81 158 Q82 164 79 164 L65 164 Z" fill="#F4A261"/>
    `;

    switch (pose) {
      case 'slouching':
        bodyTransform = `transform="rotate(14 62 90) translate(10, 8)"`;
        armsSvg = `
          <!-- Brazos estirados al teclado encorvado -->
          <path d="M40 85 Q26 100 18 112" stroke="#2A9D8F" stroke-width="9" stroke-linecap="round" fill="none"/>
          <circle cx="16" cy="114" r="5" fill="#FFD0A6"/>
        `;
        break;

      case 'stretching':
        armsSvg = `
          <!-- Brazos arriba celebrando o estirando -->
          <path d="M38 82 Q24 55 20 40" stroke="#2A9D8F" stroke-width="9" stroke-linecap="round" fill="none"/>
          <circle cx="18" cy="38" r="5" fill="#FFD0A6"/>
          <path d="M86 82 Q100 55 104 40" stroke="#2A9D8F" stroke-width="9" stroke-linecap="round" fill="none"/>
          <circle cx="106" cy="38" r="5" fill="#FFD0A6"/>
        `;
        legsSvg = `
          <!-- Piernas activas -->
          <path d="M48 118 L40 156" stroke="#264653" stroke-width="12" stroke-linecap="round"/>
          <path d="M72 118 L80 156" stroke="#264653" stroke-width="12" stroke-linecap="round"/>
          <ellipse cx="36" cy="160" rx="9" ry="5" fill="#F4A261"/>
          <ellipse cx="84" cy="160" rx="9" ry="5" fill="#F4A261"/>
        `;
        break;

      case 'sitting_good':
        legsSvg = `
          <!-- Piernas sentadas 90 grados -->
          <path d="M52 115 L78 115 L78 152" stroke="#264653" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <ellipse cx="80" cy="154" rx="8" ry="4" fill="#F4A261"/>
        `;
        armsSvg = `
          <!-- Brazo apoyado en mesa -->
          <path d="M46 84 Q60 95 72 96" stroke="#2A9D8F" stroke-width="8" stroke-linecap="round" fill="none"/>
          <circle cx="74" cy="96" r="4.5" fill="#FFD0A6"/>
        `;
        break;

      case 'happy':
      default:
        armsSvg = `
          <!-- Brazos amigables al costado -->
          <path d="M38 82 Q30 96 34 110" stroke="#2A9D8F" stroke-width="8" stroke-linecap="round" fill="none"/>
          <circle cx="35" cy="112" r="4.5" fill="#FFD0A6"/>
          <path d="M86 82 Q94 96 90 110" stroke="#2A9D8F" stroke-width="8" stroke-linecap="round" fill="none"/>
          <circle cx="89" cy="112" r="4.5" fill="#FFD0A6"/>
        `;
        break;
    }

    return `
      <svg class="alex-svg alex-breathe" viewBox="0 0 124 175" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="hairGrad" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stop-color="#734932"/>
            <stop offset="100%" stop-color="#49291A"/>
          </radialGradient>
        </defs>

        <g ${bodyTransform}>
          <!-- Piernas y calzado -->
          ${legsSvg}

          <!-- Torso / Camiseta turquesa -->
          <path d="M38 78 Q62 74 86 78 L80 120 Q62 124 44 120 Z" fill="#2A9D8F"/>
          
          <!-- Cuello de camiseta -->
          <path d="M52 76 Q62 82 72 76" stroke="#E76F51" stroke-width="3" fill="none"/>

          <!-- Emblema de la balanza en el pecho -->
          <circle cx="62" cy="94" r="8" fill="#E9C46A" opacity="0.95"/>
          <path d="M57 94 L67 94 M62 90 L62 98 M58 96 L60 97 M66 96 L64 97" stroke="#264653" stroke-width="1.2" stroke-linecap="round"/>

          <!-- Brazos -->
          ${armsSvg}

          <!-- Cabeza y cuello -->
          <rect x="56" y="65" width="12" height="12" rx="4" fill="#FFD0A6"/>
          <ellipse cx="62" cy="52" rx="24" ry="26" fill="#FFD0A6"/>

          <!-- Orejas -->
          <circle cx="38" cy="52" r="5" fill="#FFD0A6"/>
          <circle cx="86" cy="52" r="5" fill="#FFD0A6"/>

          <!-- Cabello moderno y ondeado -->
          <path d="M38 48 C36 28, 54 20, 62 20 C70 20, 88 26, 86 48 C83 38, 76 34, 70 34 C64 34, 58 37, 54 35 C48 37, 42 42, 38 48 Z" fill="url(#hairGrad)"/>
          <path d="M46 32 Q54 22 66 26" stroke="#5C3827" stroke-width="2" fill="none"/>
          <path d="M68 28 Q78 24 84 34" stroke="#5C3827" stroke-width="2" fill="none"/>

          <!-- Expresión: ojos, boca, sudor -->
          ${eyesSvg}
          ${mouthSvg}
          ${sweatSvg}
          ${extraAccessories}
        </g>
      </svg>
    `;
  }
};

// -------------------------------------------------------------------
// 4. CONTROLADOR PRINCIPAL DEL JUEGO (GameApp)
// -------------------------------------------------------------------
const GameApp = {
  levelsUnlocked: 1,
  levelStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
  currentLevel: 1,
  currentMission: 1,
  hintsUsedForLevel: 0,
  selectedTapCard: null,
  feedbackContinueCallback: null,

  init() {
    this.loadProgress();
    ConfettiFX.init();
    this.bindEvents();
    this.renderIntroAlex();
    this.updateHud();
    this.updateMapNodes();
  },

  loadProgress() {
    try {
      const savedUnlocked = localStorage.getItem('alex_game_unlocked');
      const savedStars = localStorage.getItem('alex_game_stars');
      if (savedUnlocked) this.levelsUnlocked = Math.max(1, parseInt(savedUnlocked, 10));
      if (savedStars) this.levelStars = JSON.parse(savedStars);
    } catch (e) {
      console.warn('Storage no accesible:', e);
    }
  },

  saveProgress() {
    try {
      localStorage.setItem('alex_game_unlocked', this.levelsUnlocked);
      localStorage.setItem('alex_game_stars', JSON.stringify(this.levelStars));
    } catch (e) {
      console.warn('No se pudo guardar progreso:', e);
    }
    this.updateHud();
    this.updateMapNodes();
  },

  bindEvents() {
    // Botón iniciar
    document.getElementById('btn-start-game').addEventListener('click', () => {
      SoundEngine.playPop();
      this.openMap();
    });

    // Botón HUD Mapa
    document.getElementById('btn-map').addEventListener('click', () => {
      SoundEngine.playPop();
      this.openMap();
    });

    // Botón HUD Sonido
    document.getElementById('btn-sound').addEventListener('click', () => {
      const active = SoundEngine.toggle();
      document.getElementById('sound-icon').textContent = active ? '🔊' : '🔇';
      document.getElementById('sound-text').textContent = active ? 'Sonido' : 'Silencio';
      if (active) SoundEngine.playPop();
    });

    // Botón HUD Pistas
    document.getElementById('btn-hint').addEventListener('click', () => {
      this.openHintModal();
    });

    // Modal Pistas cerrar
    document.getElementById('btn-close-hint').addEventListener('click', () => this.closeHintModal());
    document.getElementById('btn-dismiss-hint').addEventListener('click', () => this.closeHintModal());
    document.getElementById('btn-request-more-hint').addEventListener('click', () => {
      SoundEngine.playPop();
      document.getElementById('hint-level-2-box').style.display = 'block';
      document.getElementById('btn-request-more-hint').style.display = 'none';
    });

    // Botón HUD Reinicio
    document.getElementById('btn-restart').addEventListener('click', () => {
      SoundEngine.playPop();
      document.getElementById('modal-restart-confirm').classList.add('active');
    });

    document.getElementById('btn-cancel-restart').addEventListener('click', () => {
      SoundEngine.playPop();
      document.getElementById('modal-restart-confirm').classList.remove('active');
    });

    document.getElementById('btn-confirm-restart').addEventListener('click', () => {
      SoundEngine.playPop();
      this.resetAllProgress();
      document.getElementById('modal-restart-confirm').classList.remove('active');
    });

    // Botón Comprobar Misión en pantalla de juego
    document.getElementById('btn-check-action').addEventListener('click', () => {
      this.checkCurrentMission();
    });

    // Botón Continuar en pantalla de juego
    document.getElementById('btn-next-mission').addEventListener('click', () => {
      this.advanceMission();
    });

    // Modal Feedback Continuar
    document.getElementById('btn-feedback-continue').addEventListener('click', () => {
      SoundEngine.playPop();
      const cb = this.feedbackContinueCallback;
      this.feedbackContinueCallback = null;
      this.closeFeedbackModal();
      if (typeof cb === 'function') {
        cb();
      } else {
        this.advanceMission();
      }
    });
  },

  resetAllProgress() {
    this.levelsUnlocked = 1;
    this.levelStars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
    this.saveProgress();
    this.showScreen('screen-intro');
    this.renderIntroAlex();
  },

  showScreen(screenId) {
    document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  renderIntroAlex() {
    const box = document.getElementById('intro-alex-container');
    if (box) {
      box.innerHTML = AlexArt.getSvg('happy', 'happy', 180, 210);
    }
  },

  updateHud() {
    let totalStars = 0;
    Object.values(this.levelStars).forEach(s => totalStars += s);
    const starEl = document.getElementById('total-stars-count');
    if (starEl) starEl.textContent = `⭐ ${totalStars} / 24`;
  },

  updateMapNodes() {
    for (let lvl = 1; lvl <= 8; lvl++) {
      const node = document.getElementById(`map-node-${lvl}`);
      if (!node) continue;
      const btn = node.querySelector('.node-btn');
      const starsBox = document.getElementById(`stars-lvl-${lvl}`);

      const stars = this.levelStars[lvl] || 0;
      let starStr = '';
      for (let s = 1; s <= 3; s++) {
        starStr += (s <= stars) ? '⭐' : '☆';
      }
      if (starsBox) starsBox.textContent = starStr;

      if (lvl <= this.levelsUnlocked) {
        node.classList.remove('locked');
        node.classList.add('unlocked');
        if (btn) {
          btn.disabled = false;
          btn.textContent = (stars > 0) ? 'Repetir' : 'Jugar';
        }
        if (lvl === this.levelsUnlocked) {
          node.classList.add('current');
        } else {
          node.classList.remove('current');
          node.classList.add('completed');
        }
      } else {
        node.classList.add('locked');
        node.classList.remove('unlocked', 'current', 'completed');
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Bloqueado';
        }
      }
    }
  },

  openMap() {
    this.updateMapNodes();
    document.getElementById('mission-progress-indicator').style.display = 'none';
    document.getElementById('screen-title').textContent = 'Mapa de Misiones';
    this.showScreen('screen-map');
  },

  startLevel(levelNumber) {
    if (levelNumber > this.levelsUnlocked) {
      SoundEngine.playError();
      return;
    }
    SoundEngine.playPop();
    this.currentLevel = levelNumber;
    this.currentMission = 1;
    this.hintsUsedForLevel = 0;
    this.selectedTapCard = null;
    this.feedbackContinueCallback = null;
    const continueBtn = document.getElementById('btn-feedback-continue');
    if (continueBtn) continueBtn.onclick = null;

    document.getElementById('screen-title').textContent = `Nivel ${levelNumber}`;
    document.getElementById('mission-progress-indicator').style.display = 'flex';
    this.showScreen('screen-play');

    this.loadLevelData();
  },

  loadLevelData() {
    const stage = document.getElementById('level-stage');
    const badge = document.getElementById('level-badge');
    const title = document.getElementById('level-title');
    const instruction = document.getElementById('level-instruction');
    const counter = document.getElementById('mission-counter');
    const cornerAlex = document.getElementById('alex-corner-reaction');
    const feedbackText = document.getElementById('live-feedback-text');
    const checkBtn = document.getElementById('btn-check-action');
    const nextBtn = document.getElementById('btn-next-mission');

    checkBtn.style.display = 'inline-flex';
    nextBtn.style.display = 'none';

    // Alex en la esquina
    cornerAlex.innerHTML = AlexArt.getSvg('happy', 'happy', 85, 90);

    // Cargar contenido según nivel
    switch (this.currentLevel) {
      case 1:
        Level1Engine.render(this.currentMission, stage, badge, title, instruction, counter, feedbackText);
        break;
      case 2:
        Level2Engine.render(this.currentMission, stage, badge, title, instruction, counter, feedbackText);
        break;
      case 3:
        Level3Engine.render(this.currentMission, stage, badge, title, instruction, counter, feedbackText);
        break;
      case 4:
        Level4Engine.render(this.currentMission, stage, badge, title, instruction, counter, feedbackText);
        break;
      case 5:
        Level5Engine.render(this.currentMission, stage, badge, title, instruction, counter, feedbackText);
        break;
      case 6:
        Level6Engine.render(this.currentMission, stage, badge, title, instruction, counter, feedbackText);
        break;
      case 7:
        Level7Engine.render(this.currentMission, stage, badge, title, instruction, counter, feedbackText);
        break;
      case 8:
        Level8Engine.render(this.currentMission, stage, badge, title, instruction, counter, feedbackText);
        break;
    }
  },

  checkCurrentMission() {
    let result = false;
    switch (this.currentLevel) {
      case 1: result = Level1Engine.validate(this.currentMission); break;
      case 2: result = Level2Engine.validate(this.currentMission); break;
      case 3: result = Level3Engine.validate(this.currentMission); break;
      case 4: result = Level4Engine.validate(this.currentMission); break;
      case 5: result = Level5Engine.validate(this.currentMission); break;
      case 6: result = Level6Engine.validate(this.currentMission); break;
      case 7: result = Level7Engine.validate(this.currentMission); break;
      case 8: result = Level8Engine.validate(this.currentMission); break;
    }

    if (result.success) {
      SoundEngine.playSuccess();
      ConfettiFX.launch(35);
      this.showFeedbackModal(result.title || '¡Excelente Trabajo!', result.message, 'proud');
    } else {
      SoundEngine.playError();
      const feedbackEl = document.getElementById('live-feedback-text');
      feedbackEl.textContent = result.message || '🤔 Casi. Intenta reorganizar o cambiar algunas opciones.';
      const corner = document.getElementById('alex-corner-reaction');
      corner.innerHTML = AlexArt.getSvg('happy', 'surprised', 85, 90);
    }
  },

  advanceMission() {
    const maxMissions = this.getMaxMissionsForLevel(this.currentLevel);
    if (this.currentMission < maxMissions) {
      this.currentMission++;
      this.loadLevelData();
    } else {
      // Completó el nivel
      this.completeLevel();
    }
  },

  getMaxMissionsForLevel(level) {
    if (level === 7) return 5;
    if (level === 8) return 5;
    return 3;
  },

  completeLevel() {
    SoundEngine.playFanfare();
    ConfettiFX.launch(70);

    // Calcular estrellas (1 a 3) según pistas usadas
    let stars = 3;
    if (this.hintsUsedForLevel === 1) stars = 2;
    if (this.hintsUsedForLevel >= 2) stars = 2; // Siempre amigable

    if (!this.levelStars[this.currentLevel] || stars > this.levelStars[this.currentLevel]) {
      this.levelStars[this.currentLevel] = stars;
    }

    if (this.currentLevel === this.levelsUnlocked && this.levelsUnlocked < 8) {
      this.levelsUnlocked++;
    }

    this.saveProgress();

    if (this.currentLevel === 8) {
      // Fin del juego completo
      this.showScreen('screen-victory');
      const box = document.getElementById('alex-celebration-box');
      box.innerHTML = AlexArt.getSvg('stretching', 'proud', 180, 220);
    } else {
      this.showFeedbackModal(
        `🏆 ¡NIVEL ${this.currentLevel} COMPLETADO!`,
        `¡Fantástico entrenador/a! Has ganado ${stars} estrellas ⭐. Alex aprendió una valiosa lección de equilibrio hoy.`,
        'proud',
        () => {
          this.openMap();
        },
        '🗺️ Ir al Mapa de Misiones'
      );
    }
  },

  showFeedbackModal(title, text, alexMood = 'proud', onContinue = null, buttonText = '¡Siguiente Reto! 🚀') {
    const modal = document.getElementById('modal-feedback');
    document.getElementById('feedback-title').textContent = title;
    document.getElementById('feedback-explanation').textContent = text;
    document.getElementById('modal-alex-feedback-visual').innerHTML = AlexArt.getSvg('happy', alexMood, 110, 120);
    
    this.feedbackContinueCallback = onContinue;
    const btn = document.getElementById('btn-feedback-continue');
    if (btn) {
      btn.textContent = buttonText;
      btn.onclick = null;
    }
    
    modal.classList.add('active');
  },

  closeFeedbackModal() {
    document.getElementById('modal-feedback').classList.remove('active');
  },

  openHintModal() {
    SoundEngine.playChime();
    this.hintsUsedForLevel++;
    const hints = HintData.getHints(this.currentLevel, this.currentMission);
    document.getElementById('hint-text-1').textContent = hints.hint1;
    document.getElementById('hint-text-2').textContent = hints.hint2;
    document.getElementById('hint-level-2-box').style.display = 'none';
    document.getElementById('btn-request-more-hint').style.display = 'inline-block';
    document.getElementById('modal-hint').classList.add('active');
  },

  closeHintModal() {
    SoundEngine.playPop();
    document.getElementById('modal-hint').classList.remove('active');
  }
};

// -------------------------------------------------------------------
// 5. BANCO DE PISTAS PEDAGÓGICAS (Progresivas y No Punitivas)
// -------------------------------------------------------------------
const HintData = {
  getHints(level, mission) {
    const catalog = {
      1: {
        1: {
          hint1: "🌅 En la mañana, Alex necesita energía para el día y prepararse para aprender.",
          hint2: "Combina un desayuno nutritivo con el estudio y algo de juego o tarea digital sin saturar."
        },
        2: {
          hint1: "☀️ La tarde es larga y perfecta para tener variedad de actividades.",
          hint2: "No dejes que solo haya pantallas. ¡Agrega un rato de deporte o dibujo creativo!"
        },
        3: {
          hint1: "🌙 La noche es el momento de calmar el cuerpo para descansar bien.",
          hint2: "Evita poner videojuegos o celular justo antes de dormir; mejor lectura o charla familiar."
        }
      },
      2: {
        1: {
          hint1: "⏱️ Fíjate en cómo cambian los ojos y la energía de Alex a medida que pasa el tiempo.",
          hint2: "Cuando el reloj pasa de 30 o 45 minutos, es el momento perfecto para sugerir una pausa."
        },
        2: {
          hint1: "🚶 Una pausa de verdad implica alejar la mirada de cualquier pantalla.",
          hint2: "Si pausas el computador para mirar el celular, ¡tus ojos siguen cansados! Elige moverte o descansar."
        },
        3: {
          hint1: "🧩 Una buena secuencia alterna momentos de concentración con momentos activos.",
          hint2: "Coloca una tarjeta de pausa o movimiento entre dos momentos de tecnología."
        }
      },
      3: {
        1: {
          hint1: "👀 Busca en la habitación qué cosas pueden cansar la vista de Alex.",
          hint2: "Revisa la pantalla demasiado cerca, los ojos secos sin parpadear y la ventana cerrada."
        },
        2: {
          hint1: "🌳 Para relajar los ojos, necesitamos enfocar cosas que estén muy lejos.",
          hint2: "Haz clic en los objetos lejanos a través de la ventana para que los ojos descansen."
        },
        3: {
          hint1: "🎨 Elige una actividad que permita a tus ojos enfocar a distancias normales y sin luz azul.",
          hint2: "Pasear al aire libre o dibujar en papel son excelentes para relajar la vista."
        }
      },
      4: {
        1: {
          hint1: "🪑 Fíjate en la espalda y el cuello de Alex. ¿Parece cómodo o doblado?",
          hint2: "Haz clic en la espalda arqueada, el cuello doblado o los pies flotando sin apoyo."
        },
        2: {
          hint1: "🔧 Mueve los controles de la silla y la pantalla para ayudar a Alex.",
          hint2: "Los pies deben apoyarse firmemente y el borde superior de la pantalla debe estar a la altura de sus ojos."
        },
        3: {
          hint1: "🙂 Observa qué postura permite mantener la columna recta sin tensionar los hombros.",
          hint2: "Sentarse con la espalda en el respaldo es mucho mejor que acostarse en la cama con el computador."
        }
      },
      5: {
        1: {
          hint1: "🌑 Estar a oscuras con una pantalla brillante hace que los ojos se esfuercen el doble.",
          hint2: "Haz clic en la lámpara para iluminar la habitación con una luz suave y acogedora."
        },
        2: {
          hint1: "☀️ El sol directo sobre la pantalla crea un reflejo blanco incómodo.",
          hint2: "Baja la cortina o cambia la inclinación de la pantalla para quitar el reflejo."
        },
        3: {
          hint1: "💡 Busca un nivel de luz donde la pantalla se lea clara sin cegar ni brillar en exceso.",
          hint2: "Ajusta la luz ambiental y la cortina hasta que la barra de confort esté en color verde."
        }
      },
      6: {
        1: {
          hint1: "🏃 Nuestro cuerpo está hecho para saltar, correr y moverse todos los días.",
          hint2: "Arrastra actividades físicas para que la balanza de movimiento iguale a la de tecnología."
        },
        2: {
          hint1: "🤸 ¡Hora de estirar! Selecciona un ejercicio para que Alex active sus músculos.",
          hint2: "Estirar los brazos al cielo o hacer círculos suaves con los hombros quita la rigidez."
        },
        3: {
          hint1: "⚖️ Crea una secuencia donde después de jugar videojuegos haya un momento activo.",
          hint2: "Alterna: Tecnología -> Deporte/Juego físico -> Creatividad -> Familia."
        }
      },
      7: {
        1: {
          hint1: "📅 El día de Alex tiene demasiadas pantallas seguidas. ¡Está agotado!",
          hint2: "Distribuye: estudio y tareas en la mañana, deportes y juegos por la tarde, descanso en la noche."
        },
        2: {
          hint1: "🔍 Revisa el detector de desequilibrio: marca dónde hay más de 2 horas seguidas de pantallas.",
          hint2: "Intercala una actividad física o artística entre los videojuegos y la computadora."
        },
        3: {
          hint1: "✨ Logra que todos los medidores del panel estén en verde o amarillo suave.",
          hint2: "Asegúrate de incluir tiempo con la familia y al menos 8 horas de sueño reparador."
        }
      },
      8: {
        1: {
          hint1: "🚨 En cada caso, pregúntate: ¿Qué decisión protege la salud de Alex sin prohibir la diversión?",
          hint2: "Una pausa a tiempo, encender la luz o cambiar de postura solucionan la mayoría de los casos."
        }
      }
    };

    const lvlHints = catalog[level] || {};
    const mHints = lvlHints[mission] || lvlHints[1] || {
      hint1: "Observa con atención la escena y piensa en qué necesita el cuerpo de Alex.",
      hint2: "El equilibrio consiste en combinar la tecnología con descanso y movimiento."
    };
    return mHints;
  }
};

// -------------------------------------------------------------------
// 6. CONTROLADOR DE DRAG & DROP Y SELECCIÓN POR CLIC / TAP (Accesible)
// -------------------------------------------------------------------
const InteractionHelper = {
  setupInteractiveItems(container, onDropCallback) {
    const draggables = container.querySelectorAll('.activity-card[draggable="true"]');
    const dropzones = container.querySelectorAll('.timeline-slot, .schedule-drop-area');

    draggables.forEach(card => {
      // HTML5 Drag
      card.addEventListener('dragstart', (e) => {
        card.classList.add('is-dragging');
        e.dataTransfer.setData('text/plain', card.dataset.id);
        SoundEngine.playPop();
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('is-dragging');
      });

      // Accesibilidad Táctil / Clic (Alternativa a arrastrar)
      card.addEventListener('click', () => {
        SoundEngine.playPop();
        container.querySelectorAll('.activity-card').forEach(c => c.classList.remove('selected-tap'));
        if (GameApp.selectedTapCard === card.dataset.id) {
          GameApp.selectedTapCard = null;
        } else {
          GameApp.selectedTapCard = card.dataset.id;
          card.classList.add('selected-tap');
          const fb = document.getElementById('live-feedback-text');
          fb.textContent = `👉 Seleccionaste "${card.querySelector('.act-name').textContent}". Haz clic en un espacio para colocarlo.`;
        }
      });
    });

    dropzones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const actId = e.dataTransfer.getData('text/plain');
        if (actId) {
          SoundEngine.playPop();
          onDropCallback(zone, actId);
        }
      });

      // Clic para colocar tarjeta seleccionada
      zone.addEventListener('click', () => {
        if (GameApp.selectedTapCard) {
          SoundEngine.playPop();
          onDropCallback(zone, GameApp.selectedTapCard);
          GameApp.selectedTapCard = null;
          container.querySelectorAll('.activity-card').forEach(c => c.classList.remove('selected-tap'));
        }
      });
    });
  }
};

// -------------------------------------------------------------------
// 7. NIVEL 1: CONSTRUYE EL DÍA DE ALEX (Mañana, Tarde, Noche)
// -------------------------------------------------------------------
const Level1Engine = {
  slotsState: {},

  render(mission, stage, badge, title, instruction, counter, feedbackText) {
    this.slotsState = {};
    badge.textContent = 'NIVEL 1';
    title.textContent = 'Construye el Día de Alex';
    counter.textContent = `${mission} de 3`;

    let periodName = '';
    let periodClass = '';
    let periodSlots = [];
    let paletteItems = [];

    if (mission === 1) {
      periodName = '🌅 Rutina de la Mañana';
      periodClass = 'period-morning';
      instruction.textContent = 'Organiza la mañana de Alex combinando estudio, desayuno y otras actividades.';
      feedbackText.textContent = 'Arrastra las tarjetas a los 3 momentos de la mañana.';
      periodSlots = [
        { id: 'm1_s1', label: '1. Al Despertar' },
        { id: 'm1_s2', label: '2. Mitad de Mañana' },
        { id: 'm1_s3', label: '3. Antes del Almuerzo' }
      ];
      paletteItems = [
        { id: 'desayuno', name: 'Desayuno Nutritivo', icon: '🍽️', type: 'body', desc: 'Comer bien' },
        { id: 'estudiar', name: 'Estudio / Tarea', icon: '📚', type: 'creat', desc: 'Aprender' },
        { id: 'pc_clase', name: 'Computador Escolar', icon: '💻', type: 'tech', desc: 'Clase digital' },
        { id: 'juego_patio', name: 'Jugar en el Patio', icon: '🏃', type: 'body', desc: 'Moverse' },
        { id: 'videojuegos_m', name: 'Videojuego Largo', icon: '🎮', type: 'tech', desc: '3 horas de juego' }
      ];
    } else if (mission === 2) {
      periodName = '☀️ Rutina de la Tarde';
      periodClass = 'period-afternoon';
      instruction.textContent = 'La tarde tiene tiempo para tecnología, pero también para movimiento y familia.';
      feedbackText.textContent = 'Crea una tarde variada con al menos una actividad física o creativa.';
      periodSlots = [
        { id: 't_s1', label: '1. Primera Hora' },
        { id: 't_s2', label: '2. Tarde Activa' },
        { id: 't_s3', label: '3. Atardecer' }
      ];
      paletteItems = [
        { id: 'tarea_pc', name: 'Investigación PC', icon: '💻', type: 'tech', desc: 'Uso productivo' },
        { id: 'futbol', name: 'Fútbol o Parque', icon: '⚽', type: 'body', desc: 'Deporte al aire libre' },
        { id: 'dibujo', name: 'Pintura y Dibujo', icon: '🎨', type: 'creat', desc: 'Creatividad manual' },
        { id: 'familia', name: 'Charla Familiar', icon: '👨‍👩‍👧', type: 'fam', desc: 'Compartir juntos' },
        { id: 'redes_tarde', name: 'Videos sin parar', icon: '📱', type: 'tech', desc: 'Pantalla continua' }
      ];
    } else {
      periodName = '🌙 Rutina de la Noche';
      periodClass = 'period-night';
      instruction.textContent = 'Organiza una noche tranquila para que Alex prepare su cuerpo para descansar.';
      feedbackText.textContent = 'Evita pantallas intensas justo antes de la hora de dormir.';
      periodSlots = [
        { id: 'n_s1', label: '1. Hora de Cena' },
        { id: 'n_s2', label: '2. Antes de Dormir' },
        { id: 'n_s3', label: '3. Para Descansar' }
      ];
      paletteItems = [
        { id: 'cena', name: 'Cena en Familia', icon: '🍽️', type: 'fam', desc: 'Cenar juntos' },
        { id: 'lectura', name: 'Lectura de Cuentos', icon: '📖', type: 'rest', desc: 'Relaja la mente' },
        { id: 'dormir', name: 'Dormir 8-9 Horas', icon: '😴', type: 'rest', desc: 'Recuperar energía' },
        { id: 'celular_cama', name: 'Celular en la Cama', icon: '📱', type: 'tech', desc: 'Luz azul en oscuridad' },
        { id: 'juego_noche', name: 'Videojuego Intenso', icon: '🎮', type: 'tech', desc: 'Quita el sueño' }
      ];
    }

    // Render HTML
    let html = `
      <div class="n1-container">
        <div class="n1-period-header ${periodClass}">
          <span>${periodName}</span>
          <span style="font-size:0.9rem; font-weight:600;">⚖️ Elige 3 actividades equilibradas</span>
        </div>

        <div class="n1-timeline-track" id="n1-track">
          ${periodSlots.map(s => `
            <div class="timeline-slot" data-slot="${s.id}">
              <span class="slot-label">${s.label}</span>
              <div class="slot-content">
                <span style="color:#A0B2B8; font-size:0.85rem;">(Vacío)</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="n1-palette">
          <div class="palette-title">
            <span>✨ Opciones para elegir (arrastra o toca una y luego el espacio):</span>
          </div>
          <div class="palette-items-row" id="n1-palette-row">
            ${paletteItems.map(item => `
              <div class="activity-card" draggable="true" data-id="${item.id}" data-type="${item.type}">
                <span class="act-icon">${item.icon}</span>
                <span class="act-name">${item.name}</span>
                <span class="act-badge badge-${item.type}">${item.type}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    stage.innerHTML = html;

    // Conectar interacción
    InteractionHelper.setupInteractiveItems(stage, (zone, actId) => {
      const itemData = paletteItems.find(p => p.id === actId);
      if (!itemData) return;

      const slotId = zone.dataset.slot;
      this.slotsState[slotId] = itemData;

      zone.classList.add('filled');
      zone.innerHTML = `
        <button class="btn-remove-slot" title="Quitar" onclick="Level1Engine.removeSlot('${slotId}')">&times;</button>
        <span class="act-icon">${itemData.icon}</span>
        <span class="act-name">${itemData.name}</span>
        <span class="act-badge badge-${itemData.type}">${itemData.type}</span>
      `;
    });
  },

  removeSlot(slotId) {
    delete this.slotsState[slotId];
    SoundEngine.playPop();
    const zone = document.querySelector(`[data-slot="${slotId}"]`);
    if (zone) {
      zone.classList.remove('filled');
      const label = slotId.includes('m1') ? 'Momento' : 'Espacio';
      zone.innerHTML = `
        <span class="slot-label">${label}</span>
        <div class="slot-content"><span style="color:#A0B2B8; font-size:0.85rem;">(Vacío)</span></div>
      `;
    }
  },

  validate(mission) {
    const placed = Object.values(this.slotsState);
    if (placed.length < 3) {
      return { success: false, message: '¡Aún faltan espacios por completar! Elige 3 actividades.' };
    }

    const techCount = placed.filter(p => p.type === 'tech').length;

    if (mission === 1) {
      // Mañana: Debe haber comida o estudio, y no 100% tech
      const hasFoodOrStudy = placed.some(p => p.id === 'desayuno' || p.id === 'estudiar');
      if (!hasFoodOrStudy) {
        return { success: false, message: 'La mañana necesita energía para el cuerpo o la mente (como desayuno o estudio).' };
      }
      if (placed.some(p => p.id === 'videojuegos_m')) {
        return { success: false, message: 'Un videojuego de 3 horas en la mañana dejaría sin tiempo a las tareas y el desayuno.' };
      }
      return {
        success: true,
        title: '¡Mañana Equilibrada!',
        message: '¡Excelente! Alex desayuna bien, cumple con sus deberes y combina la tecnología con hábitos sanos.'
      };
    } else if (mission === 2) {
      // Tarde: debe incluir deporte o creatividad o familia
      const hasActive = placed.some(p => p.type === 'body' || p.type === 'creat' || p.type === 'fam');
      if (techCount >= 3) {
        return { success: false, message: 'Toda la tarde en pantallas deja a Alex sin movimiento. Agrega algo de fútbol, arte o familia.' };
      }
      if (!hasActive) {
        return { success: false, message: 'Recuerda que una tarde feliz necesita variedad: cuerpo activo, creatividad y seres queridos.' };
      }
      return {
        success: true,
        title: '¡Tarde Espectacular!',
        message: '¡Gran combinación! Alex usó la tecnología para sus tareas, pero también movió el cuerpo y compartió con otros.'
      };
    } else {
      // Noche: no celular_cama en slot 3 y debe incluir dormir
      const hasSleep = placed.some(p => p.id === 'dormir');
      const hasPhoneInBed = placed.some(p => p.id === 'celular_cama');
      if (!hasSleep) {
        return { success: false, message: '¡Alex necesita dormir para que su cerebro y cuerpo crezcan sanos!' };
      }
      if (hasPhoneInBed) {
        return { success: false, message: 'Mirar el celular en la cama confunde a los ojos con la luz azul y quita el sueño. Prueba con un libro o charla.' };
      }
      return {
        success: true,
        title: '¡Noche Reparadora!',
        message: '¡Fantástico! Alex cena en familia, apaga las pantallas a tiempo y descansará genial para mañana.'
      };
    }
  }
};

// -------------------------------------------------------------------
// 8. NIVEL 2: ¿CUÁNTO TIEMPO LLEVAMOS? (Reloj y Pausas Activas)
// -------------------------------------------------------------------
const Level2Engine = {
  selectedPause: null,
  clockStep: 0, // 0..3 (15, 30, 45, 60 min)
  sequenceItems: [],

  render(mission, stage, badge, title, instruction, counter, feedbackText) {
    this.selectedPause = null;
    badge.textContent = 'NIVEL 2';
    title.textContent = '¿Cuánto tiempo llevamos?';
    counter.textContent = `${mission} de 3`;

    if (mission === 1) {
      instruction.textContent = 'Observa cómo pasa el tiempo frente a la pantalla. ¿Cuándo debería Alex hacer una pausa?';
      feedbackText.textContent = 'Haz avanzar el reloj o pulsa "Hacer Pausa Ahora" en el momento oportuno.';
      this.clockStep = 0;

      const html = `
        <div class="n2-container">
          <div class="n2-clock-stage">
            <div class="clock-widget">
              <div class="clock-face">
                <div class="clock-center-dot"></div>
                <div class="clock-hand-hour"></div>
                <div class="clock-hand-min" id="n2-clock-hand"></div>
              </div>
              <div class="digital-time-box" id="n2-digital-clock">00:15</div>
              <button class="btn-secondary" id="btn-advance-time">⏱️ Avanzar +15 min</button>
            </div>

            <div class="alex-state-display">
              <div id="n2-alex-box" style="width:160px; height:180px;"></div>
              <p id="n2-alex-speech" style="font-weight:700; margin-top:8px; color:#264653;">"Estoy empezando mi tarea en el PC..."</p>
              <div class="fatigue-bar-container">
                <div class="fatigue-bar-fill" id="n2-fatigue-fill"></div>
              </div>
              <span style="font-size:0.75rem; color:#5C677D; margin-top:4px;">Cansancio acumulado</span>
            </div>
          </div>

          <div style="text-align:center; margin-top:10px;">
            <button class="btn-action check-btn" id="btn-trigger-pause" style="padding:14px 28px;">
              ⏸️ ¡Proponer Pausa a Alex Ahora!
            </button>
          </div>
        </div>
      `;

      stage.innerHTML = html;
      this.updateClockMission1Visuals();

      document.getElementById('btn-advance-time').addEventListener('click', () => {
        SoundEngine.playPop();
        this.clockStep = (this.clockStep + 1) % 4;
        this.updateClockMission1Visuals();
      });

      document.getElementById('btn-trigger-pause').addEventListener('click', () => {
        GameApp.checkCurrentMission();
      });

    } else if (mission === 2) {
      instruction.textContent = 'Alex lleva un rato sentado. ¿Cuál es la mejor actividad para una pausa de verdad?';
      feedbackText.textContent = 'Selecciona una actividad que realmente descanse los ojos y el cuerpo.';

      const pauseOptions = [
        { id: 'estirar', icon: '🧘', title: 'Estirarse y Respirar', desc: 'Mover brazos, cuello y respirar hondo', good: true },
        { id: 'agua', icon: '🚶', title: 'Caminar y Tomar Agua', desc: 'Ponerse de pie y refrescarse', good: true },
        { id: 'celular', icon: '📱', title: 'Mirar el Celular', desc: 'Seguir mirando otra pantalla pequeña', good: false },
        { id: 'dibujo', icon: '🎨', title: 'Dibujar en Papel', desc: 'Descansar de la luz digital', good: true }
      ];

      const html = `
        <div class="n2-container">
          <div class="speech-bubble" style="max-width:600px; margin-bottom:12px;">
            <p><strong>Alex:</strong> "¡Dejé el computador por un momento! ¿Qué me recomiendas hacer durante mis 10 minutos de pausa?"</p>
          </div>

          <div class="n2-pause-options-grid">
            ${pauseOptions.map(opt => `
              <div class="pause-option-card" data-id="${opt.id}" data-good="${opt.good}">
                <span class="opt-icon">${opt.icon}</span>
                <span class="opt-title">${opt.title}</span>
                <span class="opt-desc">${opt.desc}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      stage.innerHTML = html;

      stage.querySelectorAll('.pause-option-card').forEach(card => {
        card.addEventListener('click', () => {
          SoundEngine.playPop();
          stage.querySelectorAll('.pause-option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.selectedPause = card.dataset.id;
          feedbackText.textContent = `Elegiste: ${card.querySelector('.opt-title').textContent}. Pulsa "Comprobar Misión".`;
        });
      });

    } else {
      instruction.textContent = 'Crea una secuencia lógica de bloques: alterna trabajo digital con descansos activos.';
      feedbackText.textContent = 'Coloca los 4 bloques en orden equilibrado.';
      this.sequenceItems = [];

      const blocks = [
        { id: 'seq_pc1', name: '💻 Pantalla (35 min)', type: 'tech' },
        { id: 'seq_pause', name: '🧘 Pausa y Estirar (10 min)', type: 'body' },
        { id: 'seq_pc2', name: '💻 Tarea Digital (30 min)', type: 'tech' },
        { id: 'seq_sport', name: '🏃 Salir a Moverse (30 min)', type: 'body' }
      ];

      const html = `
        <div class="n2-container">
          <div class="n1-timeline-track" id="n2-seq-track" style="width:100%; max-width:820px;">
            <div class="timeline-slot" data-step="0"><span class="slot-label">Paso 1</span><div class="slot-content">(Vacío)</div></div>
            <div class="timeline-slot" data-step="1"><span class="slot-label">Paso 2</span><div class="slot-content">(Vacío)</div></div>
            <div class="timeline-slot" data-step="2"><span class="slot-label">Paso 3</span><div class="slot-content">(Vacío)</div></div>
            <div class="timeline-slot" data-step="3"><span class="slot-label">Paso 4</span><div class="slot-content">(Vacío)</div></div>
          </div>

          <div class="n1-palette" style="width:100%; max-width:820px;">
            <div class="palette-title"><span>🧩 Tarjetas disponibles para ordenar:</span></div>
            <div class="palette-items-row">
              ${blocks.map(b => `
                <div class="activity-card" draggable="true" data-id="${b.id}" data-type="${b.type}">
                  <span class="act-name">${b.name}</span>
                  <span class="act-badge badge-${b.type}">${b.type}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      stage.innerHTML = html;

      InteractionHelper.setupInteractiveItems(stage, (zone, actId) => {
        const blk = blocks.find(b => b.id === actId);
        if (!blk) return;
        const step = parseInt(zone.dataset.step, 10);
        this.sequenceItems[step] = blk;

        zone.classList.add('filled');
        zone.innerHTML = `
          <button class="btn-remove-slot" onclick="Level2Engine.removeSeq(${step})">&times;</button>
          <span style="font-weight:800; font-size:0.9rem; text-align:center;">${blk.name}</span>
        `;
      });
    }
  },

  updateClockMission1Visuals() {
    const times = ['00:15', '00:30', '00:45', '01:00'];
    const angles = [90, 180, 270, 360];
    const fatigues = [15, 40, 75, 95];
    const moods = ['happy', 'happy', 'tired', 'tired'];
    const speeches = [
      '"Apenas llevo 15 minutos, me siento fresco."',
      '"30 minutos... Es un buen momento para parpadear y considerar una pausa."',
      '"45 minutos continuos... Mis ojos se sienten secos y el cuello algo tenso."',
      '"¡1 hora seguida sin moverme! Necesito un descanso urgente."'
    ];

    const hand = document.getElementById('n2-clock-hand');
    const digi = document.getElementById('n2-digital-clock');
    const alexBox = document.getElementById('n2-alex-box');
    const speech = document.getElementById('n2-alex-speech');
    const fill = document.getElementById('n2-fatigue-fill');

    if (hand) hand.style.transform = `translateX(-50%) rotate(${angles[this.clockStep]}deg)`;
    if (digi) digi.textContent = times[this.clockStep];
    if (fill) fill.style.width = `${fatigues[this.clockStep]}%`;
    if (speech) speech.textContent = speeches[this.clockStep];
    if (alexBox) {
      const exp = moods[this.clockStep];
      alexBox.innerHTML = AlexArt.getSvg(exp === 'tired' ? 'slouching' : 'sitting_good', exp, 150, 170);
    }
  },

  removeSeq(step) {
    delete this.sequenceItems[step];
    SoundEngine.playPop();
    const zone = document.querySelector(`[data-step="${step}"]`);
    if (zone) {
      zone.classList.remove('filled');
      zone.innerHTML = `<span class="slot-label">Paso ${step + 1}</span><div class="slot-content">(Vacío)</div>`;
    }
  },

  validate(mission) {
    if (mission === 1) {
      // Buen momento para pausar: 30 o 45 o 60 min (enseña que 30-45 es ideal)
      if (this.clockStep === 0) {
        return { success: false, message: 'A los 15 minutos Alex apenas está concentrándose. Avanza un poco más el reloj.' };
      }
      return {
        success: true,
        title: '¡Pausa a Tiempo!',
        message: '¡Exacto! Cuando llevamos entre 30 y 45 minutos frente a una pantalla, hacer una pausa previene la fatiga ocular y física.'
      };
    } else if (mission === 2) {
      if (!this.selectedPause) {
        return { success: false, message: 'Selecciona una actividad para comprobar.' };
      }
      if (this.selectedPause === 'celular') {
        return {
          success: false,
          message: 'Pasar de una pantalla a otra pantalla pequeña no descansa los ojos. ¡Elige estirarte, caminar o dibujar!'
        };
      }
      return {
        success: true,
        title: '¡Gran Elección de Pausa!',
        message: '¡Excelente! Cambiar de actividad, estirarse o hidratarse renueva tu mente y cuida tu cuerpo.'
      };
    } else {
      if (this.sequenceItems.length < 4 || Object.keys(this.sequenceItems).length < 4) {
        return { success: false, message: 'Completa los 4 pasos de la secuencia.' };
      }

      // Validar que no haya 2 tech seguidas
      if (this.sequenceItems[0].type === 'tech' && this.sequenceItems[1].type === 'tech') {
        return { success: false, message: 'Tienes dos bloques de pantalla juntos. Intercala una pausa en medio.' };
      }
      return {
        success: true,
        title: '¡Secuencia en Equilibrio!',
        message: '¡Increíble! Creaste una rutina de bloques inteligentes donde el trabajo digital se combina con actividad física.'
      };
    }
  }
};

// -------------------------------------------------------------------
// 9. NIVEL 3: LOS OJOS NECESITAN DESCANSAR (Detective Visual)
// -------------------------------------------------------------------
const Level3Engine = {
  foundHotspots: {},
  birdClicks: 0,

  render(mission, stage, badge, title, instruction, counter, feedbackText) {
    badge.textContent = 'NIVEL 3';
    title.textContent = 'Los ojos necesitan descansar';
    counter.textContent = `${mission} de 3`;

    if (mission === 1) {
      this.foundHotspots = {};
      instruction.textContent = 'Haz clic en los 3 problemas que están forzando la vista de Alex en esta habitación.';
      feedbackText.textContent = 'Encuentra: 1. Pantalla muy cercana, 2. Ojos resecos sin parpadear, 3. Ventana cerrada sin vista lejana.';

      const html = `
        <div class="n3-scene-room" id="n3-room-detective">
          <!-- Ventana lejana -->
          <div class="room-window scene-hotspot" id="hs-window" data-hs="window" style="top:25px; right:40px; width:130px; height:150px; border-radius:12px;" title="Ventana con vista lejana">
            <span class="hotspot-icon" style="position:absolute; top:8px; right:8px;">🔍</span>
            <div class="window-bird">🕊️</div>
            <div style="position:absolute; bottom:6px; left:12px; font-size:0.75rem; font-weight:800; color:#03045E;">Mirar a lo lejos</div>
          </div>

          <!-- Alex frente al monitor -->
          <div style="position:absolute; bottom:40px; left:180px; width:170px; height:190px;">
            ${AlexArt.getSvg('slouching', 'tired', 160, 180)}
            <div class="scene-hotspot" id="hs-eyes" data-hs="eyes" style="position:absolute; top:42px; left:52px; width:48px; height:34px;" title="Ojos de Alex">
              <span class="hotspot-icon">👀</span>
            </div>
          </div>

          <!-- Escritorio y monitor deslumbrante -->
          <div style="position:absolute; bottom:30px; left:330px; width:220px; height:180px;">
            <svg viewBox="0 0 220 180" width="100%" height="100%">
              <!-- Mesa -->
              <rect x="0" y="110" width="220" height="14" rx="3" fill="#B08968"/>
              <rect x="15" y="124" width="12" height="56" fill="#7F5539"/>
              <rect x="195" y="124" width="12" height="56" fill="#7F5539"/>
              <!-- Monitor -->
              <rect x="40" y="24" width="120" height="80" rx="6" fill="#2B2D42"/>
              <rect x="46" y="30" width="108" height="68" rx="3" fill="#DDF2FD"/>
              <!-- Base -->
              <rect x="92" y="104" width="16" height="10" fill="#4A4E69"/>
              <rect x="76" y="112" width="48" height="4" rx="2" fill="#2B2D42"/>
            </svg>
            <div class="scene-hotspot" id="hs-screen" data-hs="screen" style="position:absolute; top:28px; left:46px; width:108px; height:70px;" title="Pantalla muy cercana y brillante">
              <span class="hotspot-icon">💻</span>
            </div>
          </div>
        </div>

        <div class="detective-tracker">
          <div class="tracker-item" id="track-screen">💻 Pantalla muy cerca</div>
          <div class="tracker-item" id="track-eyes">👀 Ojos cansados</div>
          <div class="tracker-item" id="track-window">🌳 Mirar a lo lejos</div>
        </div>
      `;

      stage.innerHTML = html;

      stage.querySelectorAll('.scene-hotspot').forEach(spot => {
        spot.addEventListener('click', () => {
          const type = spot.dataset.hs;
          SoundEngine.playPop();
          this.foundHotspots[type] = true;
          spot.classList.add('found');

          if (type === 'screen') document.getElementById('track-screen').classList.add('active');
          if (type === 'eyes') document.getElementById('track-eyes').classList.add('active');
          if (type === 'window') document.getElementById('track-window').classList.add('active');

          const count = Object.keys(this.foundHotspots).length;
          feedbackText.textContent = `¡Excelente observación! Llevas ${count} de 3 puntos detectados.`;
        });
      });

    } else if (mission === 2) {
      this.birdClicks = 0;
      instruction.textContent = 'Practica la regla 20-20-20: Haz clic 3 veces en las aves y nubes lejanas para relajar la vista.';
      feedbackText.textContent = 'Mira a través de la ventana y haz clic en las aves lejanas.';

      const html = `
        <div class="n3-scene-room" style="display:flex; align-items:center; justify-content:center; background:linear-gradient(180deg, #A2D2FF 0%, #BDE0FE 100%);">
          <div style="text-align:center; position:relative; width:100%; height:100%;">
            <p style="font-weight:800; color:#003049; margin-top:14px; font-size:1.15rem;">
              🌳 "Cada 20 minutos, mira a 20 pies (6 metros) de distancia durante 20 segundos"
            </p>

            <button id="window-target-1" class="btn-action" style="position:absolute; top:70px; left:18%; background:white; color:#023E8A; box-shadow:var(--shadow-md);">
              🕊️ Ave Lejana
            </button>
            <button id="window-target-2" class="btn-action" style="position:absolute; top:140px; right:20%; background:white; color:#023E8A; box-shadow:var(--shadow-md);">
              ☁️ Nube Suave
            </button>
            <button id="window-target-3" class="btn-action" style="position:absolute; bottom:60px; left:45%; background:white; color:#023E8A; box-shadow:var(--shadow-md);">
              🌳 Árbol Distante
            </button>
          </div>
        </div>
      `;

      stage.innerHTML = html;

      ['window-target-1', 'window-target-2', 'window-target-3'].forEach(id => {
        const btn = document.getElementById(id);
        btn.addEventListener('click', () => {
          SoundEngine.playPop();
          btn.style.transform = 'scale(0.8)';
          btn.style.opacity = '0.5';
          btn.disabled = true;
          this.birdClicks++;
          feedbackText.textContent = `¡Vista relajada! Objetivos enfocados: ${this.birdClicks} de 3.`;
        });
      });

    } else {
      instruction.textContent = '¿Cuál de estas actividades ayuda verdaderamente a relajar la fatiga de los ojos?';
      feedbackText.textContent = 'Elige una actividad que no utilice pantallas ni luz artificial directa.';
      this.selectedPause = null;

      const visionActivities = [
        { id: 'v_jugar_movil', icon: '📱', title: 'Jugar en el móvil', desc: 'Sigue enfocando a 20 cm con luz brillante', good: false },
        { id: 'v_parque', icon: '🌳', title: 'Pasear en el parque', desc: 'Luz natural, enfocar objetos lejanos y verdes', good: true },
        { id: 'v_video', icon: '📺', title: 'Ver serie en la TV', desc: 'Sigue siendo pantalla con cambios rápidos de luz', good: false },
        { id: 'v_musica', icon: '🎵', title: 'Escuchar música y cerrar ojos', desc: 'Permite que los párpados hidraten la córnea', good: true }
      ];

      const html = `
        <div class="n2-container">
          <div class="n2-pause-options-grid">
            ${visionActivities.map(v => `
              <div class="pause-option-card" data-id="${v.id}" data-good="${v.good}">
                <span class="opt-icon">${v.icon}</span>
                <span class="opt-title">${v.title}</span>
                <span class="opt-desc">${v.desc}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      stage.innerHTML = html;

      stage.querySelectorAll('.pause-option-card').forEach(card => {
        card.addEventListener('click', () => {
          SoundEngine.playPop();
          stage.querySelectorAll('.pause-option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.selectedPause = card.dataset.id;
        });
      });
    }
  },

  validate(mission) {
    if (mission === 1) {
      if (Object.keys(this.foundHotspots).length < 3) {
        return { success: false, message: 'Aún te faltan problemas por detectar. Haz clic en la pantalla, los ojos y la ventana.' };
      }
      return {
        success: true,
        title: '¡Gran Ojo Detective!',
        message: '¡Excelente! Detectaste la pantalla muy cerca, la falta de parpadeo y la importancia de enfocar a lo lejos por la ventana.'
      };
    } else if (mission === 2) {
      if (this.birdClicks < 3) {
        return { success: false, message: 'Haz clic en los 3 elementos lejanos para completar el ejercicio de enfoque visual.' };
      }
      return {
        success: true,
        title: '¡Músculos Oculares Relajados!',
        message: '¡Genial! Mirar a lo lejos permite que los músculos del cristalino del ojo descansen de la tensión de ver de cerca.'
      };
    } else {
      if (!this.selectedPause) {
        return { success: false, message: 'Selecciona una actividad para continuar.' };
      }
      if (this.selectedPause === 'v_jugar_movil' || this.selectedPause === 'v_video') {
        return { success: false, message: 'Esa opción sigue usando pantallas con luz artificial. ¡Elige el parque o escuchar música!' };
      }
      return {
        success: true,
        title: '¡Visión Protegida!',
        message: '¡Excelente! Las actividades al aire libre y el descanso de luz artificial son el mejor regalo para tus ojos.'
      };
    }
  }
};

// -------------------------------------------------------------------
// 10. NIVEL 4: DETECTIVE DE POSTURA (Ergonomía Adaptada)
// -------------------------------------------------------------------
const Level4Engine = {
  selectedPostureCard: null,
  chairHeight: 50,
  screenHeight: 50,
  backAngle: 50,

  render(mission, stage, badge, title, instruction, counter, feedbackText) {
    badge.textContent = 'NIVEL 4';
    title.textContent = 'Detective de Postura';
    counter.textContent = `${mission} de 3`;

    if (mission === 1) {
      instruction.textContent = 'Investiga estas 3 formas en que Alex se sienta. Elige cuál es la postura saludable y cómoda.';
      feedbackText.textContent = 'Selecciona la tarjeta que protege la espalda, cuello y articulaciones.';
      this.selectedPostureCard = null;

      const postures = [
        {
          id: 'pos_slouch',
          title: 'Alex Camarón 🦐',
          desc: 'Espalda encorvada, cuello doblado hacia abajo y hombros tensos.',
          verdict: 'Inadecuada',
          good: false,
          svg: AlexArt.getSvg('slouching', 'tired', 140, 160)
        },
        {
          id: 'pos_bed',
          title: 'Alex en la Cama 🛌',
          desc: 'Acostado boca abajo con la laptop forzando cuello y lumbares.',
          verdict: 'Inadecuada',
          good: false,
          svg: AlexArt.getSvg('slouching', 'tired', 140, 160)
        },
        {
          id: 'pos_good',
          title: 'Alex Ergonómico ✨',
          desc: 'Espalda recta en el respaldo, monitor a nivel de ojos y pies firmes.',
          verdict: '¡Adecuada y Cómoda!',
          good: true,
          svg: AlexArt.getSvg('sitting_good', 'happy', 140, 160)
        }
      ];

      const html = `
        <div class="n4-container">
          <div class="n4-postures-comparison">
            ${postures.map(p => `
              <div class="posture-card" data-id="${p.id}" data-good="${p.good}">
                <div class="posture-visual-box">${p.svg}</div>
                <span class="posture-verdict-badge ${p.good ? 'verdict-good' : 'verdict-bad'}">${p.verdict}</span>
                <div class="posture-title">${p.title}</div>
                <p style="font-size:0.85rem; color:#5C677D;">${p.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      stage.innerHTML = html;

      stage.querySelectorAll('.posture-card').forEach(card => {
        card.addEventListener('click', () => {
          SoundEngine.playPop();
          stage.querySelectorAll('.posture-card').forEach(c => c.classList.remove('selected-posture'));
          card.classList.add('selected-posture');
          this.selectedPostureCard = card.dataset.id;
        });
      });

    } else if (mission === 2) {
      instruction.textContent = 'Laboratorio de Ergonomía: Ajusta la silla, la pantalla y el respaldo para que Alex esté cómodo.';
      feedbackText.textContent = 'Mueve los 3 controles deslizantes hasta alcanzar el 100% de comodidad.';

      this.chairHeight = 20;
      this.screenHeight = 20;
      this.backAngle = 20;

      const html = `
        <div class="n4-container">
          <div class="ergo-lab">
            <div class="ergo-visual-preview" id="n4-ergo-preview">
              <!-- Render interactivo de Alex según sliders -->
            </div>

            <div class="ergo-controls">
              <div class="control-slider-group">
                <div class="control-label">
                  <span>🪑 Altura de la Silla</span>
                  <span id="val-chair">Pies en el aire</span>
                </div>
                <input type="range" class="slider-input" id="slider-chair" min="0" max="100" value="20">
              </div>

              <div class="control-slider-group">
                <div class="control-label">
                  <span>💻 Altura de la Pantalla</span>
                  <span id="val-screen">Muy baja</span>
                </div>
                <input type="range" class="slider-input" id="slider-screen" min="0" max="100" value="20">
              </div>

              <div class="control-slider-group">
                <div class="control-label">
                  <span>🧍 Apoyo de la Espalda</span>
                  <span id="val-back">Encorvado</span>
                </div>
                <input type="range" class="slider-input" id="slider-back" min="0" max="100" value="20">
              </div>

              <div class="comfort-meter-wrap">
                <div class="comfort-meter-label">Comodidad y Postura: <span id="ergo-percent">30%</span></div>
                <div class="comfort-meter-track">
                  <div class="comfort-meter-fill" id="ergo-fill" style="width:30%;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      stage.innerHTML = html;

      const updateErgo = () => {
        this.chairHeight = parseInt(document.getElementById('slider-chair').value, 10);
        this.screenHeight = parseInt(document.getElementById('slider-screen').value, 10);
        this.backAngle = parseInt(document.getElementById('slider-back').value, 10);

        // Textos descriptivos
        document.getElementById('val-chair').textContent = (this.chairHeight > 70) ? '¡Pies firmes a 90°!' : 'Pies colgando o doblados';
        document.getElementById('val-screen').textContent = (this.screenHeight > 70) ? '¡Ojos al borde superior!' : 'Cuello inclinado';
        document.getElementById('val-back').textContent = (this.backAngle > 70) ? '¡Espalda en el respaldo!' : 'Encorvado hacia adelante';

        const avg = Math.round((this.chairHeight + this.screenHeight + this.backAngle) / 3);
        document.getElementById('ergo-percent').textContent = `${avg}%`;
        document.getElementById('ergo-fill').style.width = `${avg}%`;

        const isGood = avg >= 75;
        const preview = document.getElementById('n4-ergo-preview');
        preview.innerHTML = AlexArt.getSvg(isGood ? 'sitting_good' : 'slouching', isGood ? 'proud' : 'tired', 170, 190);
      };

      document.getElementById('slider-chair').addEventListener('input', updateErgo);
      document.getElementById('slider-screen').addEventListener('input', updateErgo);
      document.getElementById('slider-back').addEventListener('input', updateErgo);

      updateErgo();

    } else {
      instruction.textContent = '¿Por qué es importante cuidar la postura al usar el computador o tablet?';
      feedbackText.textContent = 'Selecciona la conclusión más acertada.';
      this.selectedPostureCard = null;

      const options = [
        { id: 'c1', title: 'Para no cansarnos rápido y evitar dolores de espalda y cuello', good: true },
        { id: 'c2', title: 'Porque es una regla estricta que no tiene ninguna utilidad real', good: false },
        { id: 'c3', title: 'Para poder jugar 15 horas seguidas sin parar nunca', good: false }
      ];

      const html = `
        <div class="n4-container">
          <div style="display:flex; flex-direction:column; gap:12px; max-width:680px; margin:0 auto; width:100%;">
            ${options.map(o => `
              <button class="btn-stretch-choice" data-id="${o.id}" data-good="${o.good}" style="padding:16px;">
                <span style="font-size:1.4rem;">${o.good ? '💡' : '❓'}</span>
                <span>${o.title}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      stage.innerHTML = html;

      stage.querySelectorAll('.btn-stretch-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          SoundEngine.playPop();
          stage.querySelectorAll('.btn-stretch-choice').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedPostureCard = btn.dataset.id;
        });
      });
    }
  },

  validate(mission) {
    if (mission === 1) {
      if (this.selectedPostureCard !== 'pos_good') {
        return { success: false, message: 'Esa postura arquea el cuerpo o tensiona el cuello. Busca la postura ergonómica con respaldo.' };
      }
      return {
        success: true,
        title: '¡Postura Perfecta!',
        message: '¡Muy bien! Espalda apoyada, pantalla a la altura de la vista y pies firmes permiten trabajar y jugar sin lastimar tu cuerpo.'
      };
    } else if (mission === 2) {
      const avg = Math.round((this.chairHeight + this.screenHeight + this.backAngle) / 3);
      if (avg < 75) {
        return { success: false, message: 'Aún puedes mejorar el ajuste. Sube los 3 controles para lograr al menos 75% de confort.' };
      }
      return {
        success: true,
        title: '¡Espacio de Trabajo Ideal!',
        message: '¡Gran trabajo de ergonomía! Alex ahora tiene soporte en su espalda, pies cómodos y la pantalla a una altura perfecta.'
      };
    } else {
      if (this.selectedPostureCard !== 'c1') {
        return { success: false, message: 'Selecciona la opción que explica cómo nos protege la buena postura.' };
      }
      return {
        success: true,
        title: '¡Sabiduría Postural!',
        message: '¡Exacto! Cuidar la postura ayuda a que tus músculos y articulaciones crezcan fuertes y sanos.'
      };
    }
  }
};

// -------------------------------------------------------------------
// 11. NIVEL 5: ¡ALGO ESTÁ MAL CON LA LUZ! (Iluminación y Confort)
// -------------------------------------------------------------------
const Level5Engine = {
  lampOn: false,
  curtainClosed: false,
  screenBrightness: 50,

  render(mission, stage, badge, title, instruction, counter, feedbackText) {
    badge.textContent = 'NIVEL 5';
    title.textContent = '¡Algo está mal con la luz!';
    counter.textContent = `${mission} de 3`;

    if (mission === 1) {
      this.lampOn = false;
      instruction.textContent = 'La habitación está en penumbra y la pantalla ciega a Alex. ¡Enciende la lámpara para equilibrar la luz!';
      feedbackText.textContent = 'Haz clic en el botón de la lámpara de mesa.';

      const html = `
        <div class="n4-container">
          <div class="n5-room-canvas-box" id="n5-room-dark" style="background:#1C2541;">
            <div class="lighting-overlay" id="n5-dark-overlay" style="background:rgba(10, 15, 30, 0.75);"></div>
            <div style="position:absolute; bottom:20px; left:160px; width:150px; height:180px;">
              ${AlexArt.getSvg('sitting_good', 'tired', 150, 170)}
            </div>
            <!-- Lámpara SVG -->
            <div style="position:absolute; bottom:90px; right:180px; width:60px; height:90px; cursor:pointer;" id="n5-lamp-hotspot">
              <span id="lamp-bulb-glow" style="font-size:3rem; display:block; filter:grayscale(1); opacity:0.3;">💡</span>
            </div>
          </div>

          <div class="n5-controls-toolbar">
            <button class="lighting-toggle-btn" id="btn-toggle-lamp">
              <span>💡 Encender Lámpara Ambiental</span>
            </button>
          </div>
        </div>
      `;

      stage.innerHTML = html;

      const toggleLamp = () => {
        this.lampOn = !this.lampOn;
        SoundEngine.playPop();
        const overlay = document.getElementById('n5-dark-overlay');
        const bulb = document.getElementById('lamp-bulb-glow');
        const btn = document.getElementById('btn-toggle-lamp');

        if (this.lampOn) {
          overlay.style.opacity = '0.15';
          bulb.style.filter = 'drop-shadow(0 0 16px #FFE6A7)';
          bulb.style.opacity = '1';
          btn.classList.add('active-state');
          btn.innerHTML = '<span>✨ Lámpara Encendida (Luz Cálida)</span>';
          feedbackText.textContent = '¡Mucho mejor! La luz ambiental reduce el contraste que cansa los ojos.';
        } else {
          overlay.style.opacity = '0.75';
          bulb.style.filter = 'grayscale(1)';
          bulb.style.opacity = '0.3';
          btn.classList.remove('active-state');
          btn.innerHTML = '<span>💡 Encender Lámpara Ambiental</span>';
        }
      };

      document.getElementById('btn-toggle-lamp').addEventListener('click', toggleLamp);
      document.getElementById('n5-lamp-hotspot').addEventListener('click', toggleLamp);

    } else if (mission === 2) {
      this.curtainClosed = false;
      instruction.textContent = '¡Demasiado sol! Hay un reflejo cegador en la pantalla. Cierra la cortina para eliminar el reflejo.';
      feedbackText.textContent = 'Haz clic en el control de la cortina.';

      const html = `
        <div class="n4-container">
          <div class="n5-room-canvas-box" id="n5-room-glare" style="background:#FFF3B0;">
            <!-- Reflejo en pantalla -->
            <div class="glare-reflection" id="n5-glare" style="opacity:1;"></div>
            <div style="position:absolute; bottom:20px; left:160px; width:150px; height:180px;">
              ${AlexArt.getSvg('sitting_good', 'tired', 150, 170)}
            </div>
            <!-- Ventana con cortina -->
            <div style="position:absolute; top:20px; right:60px; width:120px; height:160px; background:#DDF2FD; border:4px solid white; border-radius:8px; overflow:hidden;">
              <div id="curtain-cloth" style="width:100%; height:15%; background:#F4A261; transition:height 0.4s ease;"></div>
              <div style="text-align:center; padding-top:20px; font-size:1.8rem;">☀️</div>
            </div>
          </div>

          <div class="n5-controls-toolbar">
            <button class="lighting-toggle-btn" id="btn-toggle-curtain">
              <span>🪟 Bajar Cortina Translúcida</span>
            </button>
          </div>
        </div>
      `;

      stage.innerHTML = html;

      document.getElementById('btn-toggle-curtain').addEventListener('click', () => {
        this.curtainClosed = !this.curtainClosed;
        SoundEngine.playPop();
        const glare = document.getElementById('n5-glare');
        const cloth = document.getElementById('curtain-cloth');
        const btn = document.getElementById('btn-toggle-curtain');

        if (this.curtainClosed) {
          glare.style.opacity = '0';
          cloth.style.height = '85%';
          btn.classList.add('active-state');
          btn.innerHTML = '<span>✅ Cortina Bajada (Sin Reflejo)</span>';
          feedbackText.textContent = '¡Excelente! Eliminaste el reflejo molesto que obligaba a forzar la vista.';
        } else {
          glare.style.opacity = '1';
          cloth.style.height = '15%';
          btn.classList.remove('active-state');
          btn.innerHTML = '<span>🪟 Bajar Cortina Translúcida</span>';
        }
      });

    } else {
      instruction.textContent = 'Ajusta la luz ambiental y el brillo de la pantalla hasta lograr el confort visual óptimo.';
      feedbackText.textContent = 'Mueve los controles hasta que la barra esté en verde.';

      this.lampOn = true;
      this.curtainClosed = true;
      this.screenBrightness = 30;

      const html = `
        <div class="n4-container">
          <div class="ergo-lab">
            <div class="ergo-controls" style="max-width:500px;">
              <div class="control-slider-group">
                <div class="control-label">
                  <span>💻 Brillo del Monitor</span>
                  <span id="n5-screen-bright-val">30%</span>
                </div>
                <input type="range" class="slider-input" id="slider-screen-bright" min="0" max="100" value="30">
              </div>

              <div class="control-slider-group">
                <div class="control-label">
                  <span>💡 Luz Ambiental de la Sala</span>
                  <span id="n5-ambient-val">50%</span>
                </div>
                <input type="range" class="slider-input" id="slider-ambient-bright" min="0" max="100" value="50">
              </div>

              <div class="comfort-meter-wrap">
                <div class="comfort-meter-label">Confort Visual: <span id="n5-comfort-val">60%</span></div>
                <div class="comfort-meter-track">
                  <div class="comfort-meter-fill" id="n5-comfort-fill" style="width:60%;"></div>
                </div>
              </div>
            </div>

            <div class="ergo-visual-preview" id="n5-preview-box">
              ${AlexArt.getSvg('sitting_good', 'happy', 160, 180)}
            </div>
          </div>
        </div>
      `;

      stage.innerHTML = html;

      const updateComfort = () => {
        const scr = parseInt(document.getElementById('slider-screen-bright').value, 10);
        const amb = parseInt(document.getElementById('slider-ambient-bright').value, 10);

        document.getElementById('n5-screen-bright-val').textContent = `${scr}%`;
        document.getElementById('n5-ambient-val').textContent = `${amb}%`;

        // Confort es óptimo cuando la diferencia entre pantalla y ambiente no es extrema (ambos entre 40 y 75)
        const diff = Math.abs(scr - amb);
        let score = 100 - diff;
        if (scr < 25 || scr > 85) score -= 20;
        if (amb < 25 || amb > 85) score -= 20;
        score = Math.max(20, Math.min(100, score));

        document.getElementById('n5-comfort-val').textContent = `${score}%`;
        document.getElementById('n5-comfort-fill').style.width = `${score}%`;

        const isGood = score >= 75;
        document.getElementById('n5-preview-box').innerHTML = AlexArt.getSvg('sitting_good', isGood ? 'proud' : 'tired', 160, 180);
      };

      document.getElementById('slider-screen-bright').addEventListener('input', updateComfort);
      document.getElementById('slider-ambient-bright').addEventListener('input', updateComfort);
      updateComfort();
    }
  },

  validate(mission) {
    if (mission === 1) {
      if (!this.lampOn) {
        return { success: false, message: 'La habitación sigue a oscuras. Enciende la lámpara para evitar forzar la vista.' };
      }
      return {
        success: true,
        title: '¡Luz Agradable!',
        message: '¡Muy bien! Usar pantallas en total oscuridad desgasta la vista rápidamente. La luz suave ambiental equilibra el contraste.'
      };
    } else if (mission === 2) {
      if (!this.curtainClosed) {
        return { success: false, message: 'El reflejo del sol aún está sobre la pantalla. Baja la cortina para neutralizarlo.' };
      }
      return {
        success: true,
        title: '¡Adiós Reflejos!',
        message: '¡Excelente! Evitar reflejos directos en el monitor protege tus ojos de parpadeos forzados y fatiga.'
      };
    } else {
      const scr = parseInt(document.getElementById('slider-screen-bright').value, 10);
      const amb = parseInt(document.getElementById('slider-ambient-bright').value, 10);
      const diff = Math.abs(scr - amb);
      if (diff > 35 || scr > 85 || amb < 30) {
        return { success: false, message: 'El contraste aún es muy alto o el brillo es deslumbrante. Acércalos a un rango medio equilibrado (entre 45% y 75%).' };
      }
      return {
        success: true,
        title: '¡Confort Visual Logrado!',
        message: '¡Perfecto! La pantalla se ve con claridad sin deslumbrar y la iluminación del espacio acompaña en armonía.'
      };
    }
  }
};

// -------------------------------------------------------------------
// 12. NIVEL 6: ¡ALEX NECESITA MOVERSE! (Actividad Física y Pausas)
// -------------------------------------------------------------------
const Level6Engine = {
  techMinutes: 60,
  moveMinutes: 20,
  activeWorkout: null,
  comboCards: [],

  render(mission, stage, badge, title, instruction, counter, feedbackText) {
    badge.textContent = 'NIVEL 6';
    title.textContent = '¡Alex necesita moverse!';
    counter.textContent = `${mission} de 3`;

    if (mission === 1) {
      this.techMinutes = 60;
      this.moveMinutes = 20;
      instruction.textContent = 'La tecnología no debe reemplazar el juego y el movimiento. Agrega actividades activas para igualar la balanza.';
      feedbackText.textContent = 'Haz clic en las actividades activas para sumar minutos de movimiento.';

      const html = `
        <div class="n4-container">
          <div class="n6-balance-board">
            <div class="gauge-column">
              <div class="gauge-header">
                <span>🖥️ Tiempo con Tecnología</span>
                <span id="n6-val-tech">60 min</span>
              </div>
              <div class="gauge-bar-outer">
                <div class="gauge-bar-fill fill-tech" id="n6-bar-tech" style="width:75%;"></div>
              </div>
            </div>

            <div class="gauge-column">
              <div class="gauge-header">
                <span>🏃 Movimiento y Deporte</span>
                <span id="n6-val-move">20 min</span>
              </div>
              <div class="gauge-bar-outer">
                <div class="gauge-bar-fill fill-move" id="n6-bar-move" style="width:25%;"></div>
              </div>
            </div>
          </div>

          <div class="palette-items-row" style="margin-top:14px;">
            <button class="activity-card" id="btn-add-futbol" style="cursor:pointer;">
              <span class="act-icon">⚽</span>
              <span class="act-name">Fútbol / Parque (+20m)</span>
            </button>
            <button class="activity-card" id="btn-add-bici" style="cursor:pointer;">
              <span class="act-icon">🚲</span>
              <span class="act-name">Paseo en Bici (+20m)</span>
            </button>
            <button class="activity-card" id="btn-add-baile" style="cursor:pointer;">
              <span class="act-icon">🕺</span>
              <span class="act-name">Baile y Salto (+15m)</span>
            </button>
          </div>
        </div>
      `;

      stage.innerHTML = html;

      const updateGauges = () => {
        const movePct = Math.min(100, Math.round((this.moveMinutes / 80) * 100));
        document.getElementById('n6-val-move').textContent = `${this.moveMinutes} min`;
        document.getElementById('n6-bar-move').style.width = `${movePct}%`;

        if (this.moveMinutes >= 55) {
          feedbackText.textContent = '¡Fantástico! El tiempo de movimiento está equilibrado con la tecnología.';
        }
      };

      document.getElementById('btn-add-futbol').addEventListener('click', () => {
        SoundEngine.playPop();
        this.moveMinutes += 20;
        updateGauges();
      });

      document.getElementById('btn-add-bici').addEventListener('click', () => {
        SoundEngine.playPop();
        this.moveMinutes += 20;
        updateGauges();
      });

      document.getElementById('btn-add-baile').addEventListener('click', () => {
        SoundEngine.playPop();
        this.moveMinutes += 15;
        updateGauges();
      });

    } else if (mission === 2) {
      instruction.textContent = '¡Levántate del asiento! Elige un estiramiento para que Alex active su cuerpo ahora mismo.';
      feedbackText.textContent = 'Selecciona un ejercicio y observa la animación activa de Alex.';
      this.activeWorkout = null;

      const exercises = [
        { id: 'ex_tree', title: '🌳 Brazos arriba como un árbol', desc: 'Descomprime la columna y abre el pecho' },
        { id: 'ex_neck', title: '🔄 Giros suaves de cuello y hombros', desc: 'Libera la tensión de mirar hacia abajo' },
        { id: 'ex_jump', title: '⭐ Saltos suaves de estrella', desc: 'Activa la circulación de las piernas' }
      ];

      const html = `
        <div class="n4-container">
          <div class="alex-workout-stage">
            <div id="n6-alex-workout" style="width:170px; height:200px;">
              ${AlexArt.getSvg('happy', 'happy', 160, 190)}
            </div>

            <div class="workout-options">
              ${exercises.map(ex => `
                <button class="btn-stretch-choice" data-id="${ex.id}">
                  <span style="font-size:1.6rem;">✨</span>
                  <div>
                    <div style="font-weight:800;">${ex.title}</div>
                    <div style="font-size:0.8rem; color:#5C677D;">${ex.desc}</div>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      stage.innerHTML = html;

      stage.querySelectorAll('.btn-stretch-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          SoundEngine.playPop();
          stage.querySelectorAll('.btn-stretch-choice').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeWorkout = btn.dataset.id;

          const box = document.getElementById('n6-alex-workout');
          box.innerHTML = AlexArt.getSvg('stretching', 'proud', 170, 200);
          feedbackText.textContent = `¡Muy bien! Alex realiza: ${btn.querySelector('div').firstElementChild.textContent}.`;
        });
      });

    } else {
      instruction.textContent = 'Combina actividades: Crea una rutina con tecnología, movimiento, creatividad y familia.';
      feedbackText.textContent = 'Arrastra o toca para ordenar las 4 actividades.';
      this.comboCards = [];

      const comboPool = [
        { id: 'c_tech', name: '💻 Tarea en PC', type: 'tech' },
        { id: 'c_move', name: '⚽ Salir al Parque', type: 'body' },
        { id: 'c_creat', name: '🎨 Dibujo o Música', type: 'creat' },
        { id: 'c_fam', name: '👨‍👩‍👧 Charla Familiar', type: 'fam' }
      ];

      const html = `
        <div class="n1-container">
          <div class="n1-timeline-track" id="n6-combo-track">
            <div class="timeline-slot" data-slot="0"><span class="slot-label">Bloque 1</span><div class="slot-content">(Vacío)</div></div>
            <div class="timeline-slot" data-slot="1"><span class="slot-label">Bloque 2</span><div class="slot-content">(Vacío)</div></div>
            <div class="timeline-slot" data-slot="2"><span class="slot-label">Bloque 3</span><div class="slot-content">(Vacío)</div></div>
            <div class="timeline-slot" data-slot="3"><span class="slot-label">Bloque 4</span><div class="slot-content">(Vacío)</div></div>
          </div>

          <div class="n1-palette">
            <div class="palette-title"><span>✨ Arrastra o toca las 4 tarjetas:</span></div>
            <div class="palette-items-row">
              ${comboPool.map(c => `
                <div class="activity-card" draggable="true" data-id="${c.id}" data-type="${c.type}">
                  <span class="act-name">${c.name}</span>
                  <span class="act-badge badge-${c.type}">${c.type}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      stage.innerHTML = html;

      InteractionHelper.setupInteractiveItems(stage, (zone, actId) => {
        const item = comboPool.find(c => c.id === actId);
        if (!item) return;
        const slotIdx = parseInt(zone.dataset.slot, 10);
        this.comboCards[slotIdx] = item;

        zone.classList.add('filled');
        zone.innerHTML = `
          <button class="btn-remove-slot" onclick="Level6Engine.removeCombo(${slotIdx})">&times;</button>
          <span style="font-weight:800; font-size:0.9rem;">${item.name}</span>
        `;
      });
    }
  },

  removeCombo(idx) {
    delete this.comboCards[idx];
    SoundEngine.playPop();
    const zone = document.querySelector(`[data-slot="${idx}"]`);
    if (zone) {
      zone.classList.remove('filled');
      zone.innerHTML = `<span class="slot-label">Bloque ${idx + 1}</span><div class="slot-content">(Vacío)</div>`;
    }
  },

  validate(mission) {
    if (mission === 1) {
      if (this.moveMinutes < 55) {
        return { success: false, message: 'Aún falta movimiento. Agrega otra actividad activa para que la barra de deporte se nivele.' };
      }
      return {
        success: true,
        title: '¡Balanza en Armonía!',
        message: '¡Excelente! Ahora Alex tiene tanto tiempo de movimiento como de tecnología.'
      };
    } else if (mission === 2) {
      if (!this.activeWorkout) {
        return { success: false, message: 'Elige un ejercicio de estiramiento para continuar.' };
      }
      return {
        success: true,
        title: '¡Cuerpo Renovado!',
        message: '¡Excelente! Los estiramientos rápidos relajan los músculos y oxigenan el cerebro para seguir aprendiendo con ganas.'
      };
    } else {
      if (Object.keys(this.comboCards).length < 4) {
        return { success: false, message: 'Completa los 4 bloques de la secuencia.' };
      }
      return {
        success: true,
        title: '¡Variedad Total!',
        message: '¡Increíble! Lograste una jornada completa donde caben las pantallas, el deporte, el arte y los seres queridos.'
      };
    }
  }
};

// -------------------------------------------------------------------
// 13. NIVEL 7: EL GRAN RETO (EQUILIBRA EL DÍA)
// -------------------------------------------------------------------
const Level7Engine = {
  scheduleState: {
    morning: [],
    afternoon: [],
    night: []
  },

  render(mission, stage, badge, title, instruction, counter, feedbackText) {
    badge.textContent = 'NIVEL 7';
    title.textContent = 'El Gran Reto: Equilibra el Día';
    counter.textContent = `${mission} de 5`;

    let instructionMsg = '';
    if (mission === 1) instructionMsg = 'Paso 1: Organiza la MAÑANA. Incluye tareas escolares y desayuno sin exceso de pantallas.';
    else if (mission === 2) instructionMsg = 'Paso 2: Organiza la TARDE. Combina tecnología con movimiento y amigos o familia.';
    else if (mission === 3) instructionMsg = 'Paso 3: Organiza la NOCHE. Asegura descanso, cena y sueño sin pantallas en la cama.';
    else if (mission === 4) instructionMsg = 'Paso 4: Detector de desequilibrio. Observa los medidores e identifica excesos.';
    else instructionMsg = 'Paso 5: Gran Ajuste Final. Logra que todos los medidores del panel alcancen el equilibrio.';

    instruction.textContent = instructionMsg;
    feedbackText.textContent = 'Arrastra actividades a cada columna y revisa el panel de equilibrio.';

    // Base de tarjetas para Level 7
    const fullPool = [
      { id: 'l7_pc_task', name: '💻 Deberes en PC', type: 'tech' },
      { id: 'l7_games', name: '🎮 Videojuegos', type: 'tech' },
      { id: 'l7_movil', name: '📱 Videos en Celular', type: 'tech' },
      { id: 'l7_break', name: '🍽️ Desayuno / Comida', type: 'body' },
      { id: 'l7_sport', name: '⚽ Parque o Deporte', type: 'body' },
      { id: 'l7_walk', name: '🚶 Caminata / Bici', type: 'body' },
      { id: 'l7_art', name: '🎨 Dibujo / Manualidades', type: 'creat' },
      { id: 'l7_fam', name: '👨‍👩‍👧 Compartir en Familia', type: 'fam' },
      { id: 'l7_read', name: '📖 Lectura Relajada', type: 'rest' },
      { id: 'l7_sleep', name: '😴 Dormir 8 Horas', type: 'rest' }
    ];

    const html = `
      <div class="n7-grid-layout">
        <!-- Dashboard de métricas en tiempo real -->
        <div class="n7-radar-dashboard">
          <div class="radar-stat-box">
            <span class="stat-label">💻 Tecnología</span>
            <div class="stat-bar"><div class="stat-bar-fill" id="bar-n7-tech" style="width:30%; background:#0284C7;"></div></div>
          </div>
          <div class="radar-stat-box">
            <span class="stat-label">🏃 Movimiento</span>
            <div class="stat-bar"><div class="stat-bar-fill" id="bar-n7-body" style="width:20%; background:#16A34A;"></div></div>
          </div>
          <div class="radar-stat-box">
            <span class="stat-label">🎨 Creatividad</span>
            <div class="stat-bar"><div class="stat-bar-fill" id="bar-n7-creat" style="width:10%; background:#9333EA;"></div></div>
          </div>
          <div class="radar-stat-box">
            <span class="stat-label">👨‍👩‍👧 Familia</span>
            <div class="stat-bar"><div class="stat-bar-fill" id="bar-n7-fam" style="width:10%; background:#E11D48;"></div></div>
          </div>
          <div class="radar-stat-box">
            <span class="stat-label">😴 Buen Dormir</span>
            <div class="stat-bar"><div class="stat-bar-fill" id="bar-n7-sleep" style="width:10%; background:#D97706;"></div></div>
          </div>
        </div>

        <!-- Columnas del día -->
        <div class="n7-schedule-board">
          <!-- Mañana -->
          <div class="schedule-column">
            <div class="schedule-col-title">
              <span>🌅 Mañana (3 items)</span>
            </div>
            <div class="schedule-drop-area" data-col="morning" id="n7-drop-morning">
              <span style="color:#A0B2B8; font-size:0.8rem; text-align:center;">Arrastra aquí</span>
            </div>
          </div>

          <!-- Tarde -->
          <div class="schedule-column">
            <div class="schedule-col-title">
              <span>☀️ Tarde (3 items)</span>
            </div>
            <div class="schedule-drop-area" data-col="afternoon" id="n7-drop-afternoon">
              <span style="color:#A0B2B8; font-size:0.8rem; text-align:center;">Arrastra aquí</span>
            </div>
          </div>

          <!-- Noche -->
          <div class="schedule-column">
            <div class="schedule-col-title">
              <span>🌙 Noche (3 items)</span>
            </div>
            <div class="schedule-drop-area" data-col="night" id="n7-drop-night">
              <span style="color:#A0B2B8; font-size:0.8rem; text-align:center;">Arrastra aquí</span>
            </div>
          </div>
        </div>

        <!-- Paleta de tarjetas -->
        <div class="n1-palette">
          <div class="palette-title"><span>🧩 Tarjetas disponibles para armar la agenda completa:</span></div>
          <div class="palette-items-row">
            ${fullPool.map(item => `
              <div class="activity-card" draggable="true" data-id="${item.id}" data-type="${item.type}">
                <span class="act-name">${item.name}</span>
                <span class="act-badge badge-${item.type}">${item.type}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    stage.innerHTML = html;

    InteractionHelper.setupInteractiveItems(stage, (zone, actId) => {
      const item = fullPool.find(p => p.id === actId);
      if (!item) return;
      const col = zone.dataset.col;
      if (!col) return;

      if (!this.scheduleState[col]) this.scheduleState[col] = [];
      if (this.scheduleState[col].length >= 3) {
        feedbackText.textContent = `La columna ${col} ya tiene 3 actividades. Quita una para reemplazar.`;
        return;
      }

      this.scheduleState[col].push(item);
      this.refreshN7Column(col);
      this.updateN7Stats();
    });
  },

  refreshN7Column(col) {
    const zone = document.getElementById(`n7-drop-${col}`);
    if (!zone) return;
    const items = this.scheduleState[col] || [];
    if (items.length === 0) {
      zone.innerHTML = `<span style="color:#A0B2B8; font-size:0.8rem; text-align:center;">Arrastra aquí</span>`;
      return;
    }

    zone.innerHTML = items.map((item, idx) => `
      <div style="background:white; border:1.5px solid #2A9D8F; border-radius:8px; padding:6px 10px; display:flex; align-items:center; justify-content:space-between;">
        <span style="font-weight:700; font-size:0.85rem;">${item.name}</span>
        <button style="background:transparent; border:none; color:#E76F51; font-weight:800; cursor:pointer;" onclick="Level7Engine.removeItem('${col}', ${idx})">&times;</button>
      </div>
    `).join('');
  },

  removeItem(col, idx) {
    SoundEngine.playPop();
    this.scheduleState[col].splice(idx, 1);
    this.refreshN7Column(col);
    this.updateN7Stats();
  },

  updateN7Stats() {
    const all = [
      ...(this.scheduleState.morning || []),
      ...(this.scheduleState.afternoon || []),
      ...(this.scheduleState.night || [])
    ];

    const techCount = all.filter(a => a.type === 'tech').length;
    const bodyCount = all.filter(a => a.type === 'body').length;
    const creatCount = all.filter(a => a.type === 'creat').length;
    const famCount = all.filter(a => a.type === 'fam').length;
    const sleepCount = all.filter(a => a.id === 'l7_sleep').length;

    const setBar = (id, count, max = 3) => {
      const el = document.getElementById(id);
      if (el) {
        const pct = Math.min(100, Math.round((count / max) * 100));
        el.style.width = `${pct}%`;
      }
    };

    setBar('bar-n7-tech', techCount, 3);
    setBar('bar-n7-body', bodyCount, 2);
    setBar('bar-n7-creat', creatCount, 1);
    setBar('bar-n7-fam', famCount, 1);
    setBar('bar-n7-sleep', sleepCount, 1);
  },

  validate(mission) {
    const m = this.scheduleState.morning || [];
    const a = this.scheduleState.afternoon || [];
    const n = this.scheduleState.night || [];

    if (mission === 1) {
      if (m.length < 3) return { success: false, message: 'Completa las 3 actividades de la mañana.' };
      const mTech = m.filter(x => x.type === 'tech').length;
      if (mTech > 1) return { success: false, message: 'La mañana tiene demasiadas pantallas. Deja espacio para desayunar y alistarse.' };
      return { success: true, title: '¡Mañana Organizada!', message: '¡Gran inicio de jornada! Buen balance entre estudio matutino y cuerpo activo.' };
    } else if (mission === 2) {
      if (a.length < 3) return { success: false, message: 'Completa las 3 actividades de la tarde.' };
      const hasMove = a.some(x => x.type === 'body');
      if (!hasMove) return { success: false, message: 'La tarde necesita al menos una actividad deportiva o al aire libre.' };
      return { success: true, title: '¡Tarde Dinámica!', message: '¡Excelente tarde! Hay tiempo para tecnología y también para ejercitarse.' };
    } else if (mission === 3) {
      if (n.length < 3) return { success: false, message: 'Completa las 3 actividades de la noche.' };
      const hasSleep = n.some(x => x.id === 'l7_sleep');
      if (!hasSleep) return { success: false, message: '¡La noche debe incluir la tarjeta de "Dormir 8 Horas"!' };
      return { success: true, title: '¡Noche de Paz!', message: '¡Muy bien! Alex descansará las horas necesarias para levantarse con energía.' };
    } else {
      // Misiones 4 y 5: Gran balance
      const totalTech = [...m, ...a, ...n].filter(x => x.type === 'tech').length;
      const totalBody = [...m, ...a, ...n].filter(x => x.type === 'body').length;
      const hasSleep = n.some(x => x.id === 'l7_sleep');

      if (totalTech > 3) return { success: false, message: 'Aún hay demasiadas horas seguidas de tecnología. Cambia una por arte o familia.' };
      if (totalBody < 2) return { success: false, message: 'El cuerpo necesita al menos 2 momentos de movimiento en el día.' };
      if (!hasSleep) return { success: false, message: 'Asegúrate de que la noche incluya dormir 8 horas.' };

      return {
        success: true,
        title: '¡DÍA EN EQUILIBRIO TOTAL!',
        message: '¡INCREÍBLE! Has conquistado el Gran Reto. Alex tiene una rutina completa, variada, saludable y divertida.'
      };
    }
  }
};

// -------------------------------------------------------------------
// 14. NIVEL 8: CASOS PRÁCTICOS DE ALEX (Toma de Decisiones)
// -------------------------------------------------------------------
const Level8Engine = {
  selectedCaseOption: null,

  render(mission, stage, badge, title, instruction, counter, feedbackText) {
    badge.textContent = 'NIVEL 8';
    title.textContent = 'Casos Prácticos de Alex';
    counter.textContent = `Caso ${mission} de 5`;
    this.selectedCaseOption = null;

    const casesData = [
      {
        num: 1,
        title: 'Racha de Videojuegos 🎮',
        narrative: 'Alex lleva 2 horas seguidas jugando una partida online con sus amigos. Siente hambre y los ojos secos, pero sus amigos le dicen: "¡Juguemos otra más!"',
        options: [
          { id: 'opt_pause', title: 'Pausar y Salir a Estirar', desc: 'Avisar a sus amigos que hará una pausa para tomar agua y merendar.', good: true },
          { id: 'opt_continue', title: 'Jugar 2 Horas Más', desc: 'Seguir jugando sin comer ni levantarse de la silla.', good: false },
          { id: 'opt_angry', title: 'Apagar enojado de golpe', desc: 'Desconectar el cable sin avisar a nadie.', good: false }
        ]
      },
      {
        num: 2,
        title: 'Deberes en Penumbra 💡',
        narrative: 'Alex está investigando en el computador para un trabajo de ciencias, pero la habitación está completamente a oscuras y el monitor brilla muchísimo.',
        options: [
          { id: 'opt_light', title: 'Encender Luz de la Habitación', desc: 'Prender una lámpara ambiental y regular el brillo de la pantalla.', good: true },
          { id: 'opt_dark', title: 'Ponerse Gafas de Sol en la Cueva', desc: 'Seguir a oscuras con gafas puestas.', good: false },
          { id: 'opt_bright_more', title: 'Subir el brillo al 100%', desc: 'Hacer que la pantalla brille aún con más fuerza.', good: false }
        ]
      },
      {
        num: 3,
        title: 'Encorvado en el Sofá 🪑',
        narrative: 'Alex está en el sofá usando la tablet sobre sus rodillas, con la cabeza totalmente inclinada hacia abajo como una tortuga.',
        options: [
          { id: 'opt_ergo_tab', title: 'Usar Soporte y Espalda Recta', desc: 'Apoyar la tablet sobre una mesa o cojín a la altura del pecho para no doblar el cuello.', good: true },
          { id: 'opt_floor', title: 'Tirarse de cabeza al suelo', desc: 'Acostarse al revés en el suelo para ver la pantalla.', good: false },
          { id: 'opt_ignore', title: 'Aguantarse el dolor', desc: 'Seguir así aunque le empiece a doler el cuello.', good: false }
        ]
      },
      {
        num: 4,
        title: 'Tarde de Flojera 🏃',
        narrative: 'Alex terminó sus tareas temprano y lleva 1 hora viendo videos graciosos. El día afuera está soleado y su amigo lo llama para montar en bicicleta.',
        options: [
          { id: 'opt_bike', title: '¡Salir en Bicicleta!', desc: 'Cerrar la pantalla y aprovechar el sol y el aire libre con su amigo.', good: true },
          { id: 'opt_stay', title: 'Quedarse viendo 4 horas más', desc: 'Decirle a su amigo que no y seguir pegado a los videos sin moverse.', good: false }
        ]
      },
      {
        num: 5,
        title: 'El "Salto de Pantallas" 📱',
        narrative: 'Alex acaba de apagar su computador tras 45 minutos de estudio. Inmediatamente saca su celular para ponerse a jugar.',
        options: [
          { id: 'opt_change', title: 'Romper el Ciclo con Otra Actividad', desc: 'Dejar el celular y hacer un dibujo, ayudar a poner la mesa o charlar con su familia.', good: true },
          { id: 'opt_phone_all', title: 'Quedarse 1 hora en el celular', desc: 'Mirar el móvil sin haber descansado los ojos del computador.', good: false }
        ]
      }
    ];

    const currentCase = casesData[mission - 1] || casesData[0];
    instruction.textContent = `Caso ${mission}: Intervén en la escena y ayuda a Alex a tomar la decisión más inteligente.`;
    feedbackText.textContent = 'Selecciona la mejor respuesta.';

    const html = `
      <div class="n8-case-card">
        <div class="case-header">
          <span class="case-number">Dilema ${currentCase.num} de 5</span>
          <h3 class="case-title">${currentCase.title}</h3>
        </div>

        <div class="case-scenario-box">
          <div class="case-illustration">
            ${AlexArt.getSvg('slouching', 'tired', 150, 160)}
          </div>
          <p class="case-narrative">${currentCase.narrative}</p>
        </div>

        <div class="case-options-grid">
          ${currentCase.options.map(opt => `
            <button class="case-opt-btn" data-id="${opt.id}" data-good="${opt.good}">
              <span class="opt-title">${opt.title}</span>
              <span class="opt-desc">${opt.desc}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    stage.innerHTML = html;

    stage.querySelectorAll('.case-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        SoundEngine.playPop();
        stage.querySelectorAll('.case-opt-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedCaseOption = { id: btn.dataset.id, good: btn.dataset.good === 'true' };
      });
    });
  },

  validate(mission) {
    if (!this.selectedCaseOption) {
      return { success: false, message: 'Selecciona una decisión para resolver el dilema de Alex.' };
    }
    if (!this.selectedCaseOption.good) {
      return {
        success: false,
        message: 'Esa decisión no soluciona el problema de fondo ni cuida el cuerpo de Alex. ¡Piensa en la alternativa saludable!'
      };
    }
    return {
      success: true,
      title: '¡Decisión de Oro!',
      message: '¡Brillante! Demostraste que sabes intervenir en el momento exacto para mantener el equilibrio.'
    };
  }
};

// -------------------------------------------------------------------
// 15. INICIALIZACIÓN GLOBAL CUANDO EL DOM ESTÉ LISTO
// -------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  GameApp.init();
});
