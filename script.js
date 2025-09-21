// Enhanced Sound System
class SoundManager {
  constructor() {
    this.sounds = {};
    this.audioContext = null;
    this.enabled = true;
    this.volume = 0.5;
    this.initializeSounds();
  }

  initializeSounds() {
    this.soundList = {
      click: { file: 'assets/click.mp3', frequency: 400, duration: 0.1 },
      chime: { file: 'assets/chime.mp3', frequency: 880, duration: 0.3 },
      toggle: { file: 'assets/toggle.mp3', frequency: 600, duration: 0.15 },
      success: { file: 'assets/success.mp3', frequency: 523, duration: 0.4 },
      error: { file: 'assets/error.mp3', frequency: 200, duration: 0.5 },
      notification: { file: 'assets/notification.mp3', frequency: 1000, duration: 0.2 }
    };
    this.preloadSounds();
  }

  preloadSounds() {
    Object.keys(this.soundList).forEach(soundName => {
      const sound = this.soundList[soundName];
      try {
        this.sounds[soundName] = new Audio(sound.file);
        this.sounds[soundName].volume = this.volume;
        this.sounds[soundName].preload = 'auto';
        this.sounds[soundName].addEventListener('error', () => {
          console.warn(`Failed to load ${soundName} audio file`);
        });
      } catch (e) {
        console.warn(`Failed to create ${soundName} audio:`, e);
      }
    });
  }

  async play(soundName) {
    if (!this.enabled) return;
    if (this.sounds[soundName]) {
      try {
        this.sounds[soundName].currentTime = 0;
        await this.sounds[soundName].play();
        return;
      } catch (e) {
        console.warn(`Failed to play ${soundName} audio file, falling back to Web Audio API:`, e);
      }
    }
    this.playWebAudioSound(soundName);
  }

  playWebAudioSound(soundName) {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      const sound = this.soundList[soundName];
      if (!sound) return;
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      oscillator.frequency.value = sound.frequency;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration);
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + sound.duration);
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(audio => {
      if (audio) audio.volume = this.volume;
    });
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

// Enhanced Mood data with ROMANTIC DESCRIPTIONS for your love
const MOODS = [
  { 
    key: "Happy", 
    emoji: "😊", 
    bgClass: "bg-happy",
    color: "#10b981",
    particles: ["✨", "🌟", "💫", "🎉", "🌈", "☀️", "💖", "💕"],
    quotes: [
      "Your smile lights up my entire world, my love!",
      "Darling, your happiness is my sweetest melody.",
      "With you, every joyous moment feels like forever.",
      "Beloved, your laughter is the sunshine in our garden of love.",
      "My heart soars when I see you happy, my dearest treasure."
    ],
    tips: ["Let's celebrate this beautiful moment together", "Share your joy with me, my love", "Dance with me in this happiness"]
  },
  { 
    key: "Sad", 
    emoji: "😔", 
    bgClass: "bg-sad",
    color: "#3b82f6",
    particles: ["💧", "🌧️", "☁️", "💙", "🌫️", "💜", "🤗"],
    quotes: [
      "It's okay my Loveee, even the darkest skies clear for us.",
      "My darling, every tear you shed waters the garden of our love.",
      "In your sorrow, know my heart beats softly beside yours.",
      "Sweetheart, remember, I'm here holding you close through it all.",
      "My Love, even sadness blooms into the sweetest song when we're together."
    ],
    tips: ["Let me hold you close, my darling", "Tell me what's in your heart", "We'll get through this together, always"]
  },
  { 
    key: "Angry", 
    emoji: "😠", 
    bgClass: "bg-angry",
    color: "#ef4444",
    particles: ["⚡", "🔥", "💥", "🌪️", "💢", "❤️‍🔥", "💪"],
    quotes: [
      "Even when you're upset, my love for you burns brighter than ever.",
      "Darling, let me calm your storm with my endless care and kisses.",
      "In anger's fire, our passion only grows stronger, my love.",
      "My Love, your emotions are beautiful, even in their fierce strength.",
      "Together, we can weather any tempest that comes our way, hand in hand."
    ],
    tips: ["Let me massage your shoulders, love", "Take deep breaths with me", "Tell me what's bothering your heart"]
  },
  { 
    key: "Tired", 
    emoji: "😴", 
    bgClass: "bg-tired",
    color: "#8b5cf6",
    particles: ["💤", "🌙", "⭐", "🌌", "😪", "🛏️", "💤"],
    quotes: [
      "Rest now, my love, and dream of our sweetest moments together.",
      "Let me soothe your tired soul with gentle whispers and warm hugs.",
      "Darling, even in fatigue, your grace shines brighter than the stars.",
      "My Love, I'll hold you soft and close through the peaceful night.",
      "Take your time to rest, for our love will wait patiently and tenderly."
    ],
    tips: ["Let's cuddle and rest together", "I'll make you some warm tea, love", "Close your eyes, I'm here watching over you"]
  },
  { 
    key: "Calm", 
    emoji: "😌", 
    bgClass: "bg-calm",
    color: "#06b6d4",
    particles: ["🍃", "🌊", "🕊️", "☮️", "🧘‍♀️", "💙", "🌸"],
    quotes: [
      "In your calm, I find my peace and endless love, my darling.",
      "Beloved, your serenity is the sweetest music to my heart.",
      "Together, we flow like a gentle river of eternal love.",
      "My love, your presence is my most tranquil and safe refuge.",
      "Let our hearts beat quietly in this beautiful, romantic calm."
    ],
    tips: ["Let's enjoy this peaceful moment together", "Hold my hand and breathe with me", "This serenity with you is perfect"]
  },
  { 
    key: "Excited", 
    emoji: "🤩", 
    bgClass: "bg-excited",
    color: "#f59e0b",
    particles: ["🎊", "🎉", "⚡", "🌟", "🔥", "🎈", "💖", "✨"],
    quotes: [
      "Your excitement sparks pure joy deep within my soul, my love!",
      "Darling, your passion fuels our everlasting flame of romance.",
      "Together, we dance in the thrilling magic of our love story.",
      "My love, your energy is the most beautiful song to my ears.",
      "Embrace the joy, for our hearts beat wildly and passionately together!"
    ],
    tips: ["Let's celebrate this excitement together!", "Your energy is contagious, my love", "Share this beautiful moment with me"]
  },
  { 
    key: "Anxious", 
    emoji: "😰", 
    bgClass: "bg-anxious",
    color: "#ea580c",
    particles: ["🌀", "💭", "🫨", "😵‍💫", "🤗", "💜", "🌟"],
    quotes: [
      "In moments of worry, know I'm here holding your hand tightly, my love.",
      "My darling, let our hearts be a sanctuary of safety and endless love.",
      "With every breath, feel my love surrounding and steadying you completely.",
      "Sweetheart, you're never alone; my heart is your eternal home.",
      "Together, we'll face every fear, wrapped in love's warmest embrace."
    ],
    tips: ["Breathe with me, my love", "I'm here, you're safe with me", "Let me hold you until you feel better"]
  },
  { 
    key: "Neutral", 
    emoji: "😐", 
    bgClass: "bg-neutral",
    color: "#6b7280",
    particles: ["⚪", "🔘", "⚫", "🔹", "◯", "💫", "💛"],
    quotes: [
      "My love, every feeling you have is absolutely perfect to me.",
      "Beloved, in your balance, I find such beauty and endless grace.",
      "Together, we create a harmony of the gentlest, sweetest love.",
      "Darling, simply being with you makes my heart completely full.",
      "In every quiet moment, our love whispers the most beautiful songs."
    ],
    tips: ["Just being with you is enough", "Your presence is my happiness", "Every moment with you is precious"]
  }
];

// Enhanced App Class with Romantic Features
class ModernMoodMirror {
  constructor() {
    this.currentMood = null;
    this.moodHistory = this.loadData('moodHistory') || [];
    this.settings = this.loadData('settings') || this.getDefaultSettings();
    this.streakCount = this.calculateStreak();
    this.stats = this.calculateStats();
    
    // Voice recognition properties
    this.isListening = false;
    this.continuousListening = false;
    this.recognition = null;
    
    this.currentTheme = this.loadData('theme') || 'light';
    this.initializeTheme();
    
    this.soundManager = new SoundManager();
    
    const savedVolume = this.loadData('volume');
    if (savedVolume !== null) {
      this.soundManager.setVolume(savedVolume);
    }
    
    this.init();
  }

  getDefaultSettings() {
    return {
      soundEnabled: true,
      persistData: false,
      notifications: false,
      theme: 'auto'
    };
  }

  async init() {
    this.showLoadingScreen();
    await this.delay(1500);
    this.hideLoadingScreen();
    
    this.bindElements();
    this.bindEvents();
    this.renderMoodButtons();
    this.updateUI();
    this.setupCurrentDate();
    this.setupVoiceRecognition();
    this.checkNotificationPermission();
    
    if (!this.loadData('theme')) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        this.currentTheme = 'dark';
        document.documentElement.setAttribute('data-theme', 'dark');
        this.updateThemeIcon();
      }
    }
    
    if (this.settings.persistData) {
      this.restoreLastSession();
    }

    this.updateSliderFill();
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.remove('hidden');
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
  }

  setupCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
  }

  initializeTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    this.updateThemeIcon();
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    this.updateThemeIcon();
    this.saveData('theme', this.currentTheme);
    
    this.playSound('toggle');
    this.showToast(`Switched to ${this.currentTheme} mode`, 'info');
  }

  updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
      
      themeIcon.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        themeIcon.style.transform = 'rotate(0deg)';
      }, 400);
    }
  }

  playSound(soundName) {
    if (!this.settings.soundEnabled) return;
    this.soundManager.play(soundName);
  }

  bindElements() {
    this.elements = {
      moodGrid: document.getElementById('moodGrid'),
      resultCard: document.getElementById('resultCard'),
      selectedMood: document.getElementById('selectedMood'),
      quote: document.getElementById('motivationalQuote'),
      moodMeta: document.getElementById('moodMeta'),
      streakBadge: document.getElementById('streakBadge'),
      totalEntries: document.getElementById('totalEntries'),
      dominantMood: document.getElementById('dominantMood'),
      weeklyAvg: document.getElementById('weeklyAvg'),
      intensityRange: document.getElementById('intensityRange'),
      intensityLabel: document.getElementById('intensityLabel'),
      sliderFill: document.getElementById('sliderFill'),
      notesInput: document.getElementById('notesInput'),
      charCount: document.getElementById('charCount'),
      historyList: document.getElementById('historyList'),
      historyFilter: document.getElementById('historyFilter'),
      muteToggle: document.getElementById('muteToggle'),
      persistToggle: document.getElementById('persistToggle'),
      notificationsToggle: document.getElementById('notificationsToggle'),
      modal: document.getElementById('modal'),
      modalOverlay: document.getElementById('modalOverlay'),
      modalTitle: document.getElementById('modalTitle'),
      modalBody: document.getElementById('modalBody'),
      toastContainer: document.getElementById('toastContainer'),
      volumeRange: document.getElementById('volumeRange')
    };
  }

  bindEvents() {
    const randomizeBtn = document.getElementById('randomizeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const shareBtn = document.getElementById('shareBtn');
    
    if (randomizeBtn) randomizeBtn.addEventListener('click', () => this.randomizeMood());
    if (clearBtn) clearBtn.addEventListener('click', () => this.clearMood());
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveMoodEntry());
    if (shareBtn) shareBtn.addEventListener('click', () => this.shareMood());
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (!this.loadData('theme')) {
          this.currentTheme = e.matches ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', this.currentTheme);
          this.updateThemeIcon();
        }
      });
    }
    
    if (this.elements.muteToggle) {
      this.elements.muteToggle.addEventListener('change', (e) => {
        this.updateSetting('soundEnabled', !e.target.checked);
        this.soundManager.setEnabled(!e.target.checked);
        this.playSound('toggle');
      });
    }
    if (this.elements.persistToggle) {
      this.elements.persistToggle.addEventListener('change', (e) => {
        this.updateSetting('persistData', e.target.checked);
        this.playSound('toggle');
      });
    }
    if (this.elements.notificationsToggle) {
      this.elements.notificationsToggle.addEventListener('change', (e) => this.toggleNotifications(e.target.checked));
    }
    
    if (this.elements.volumeRange) {
      this.elements.volumeRange.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        this.soundManager.setVolume(volume);
        this.saveData('volume', volume);
        this.playSound('click');
      });
    }
    
    if (this.elements.intensityRange) {
      this.elements.intensityRange.addEventListener('input', (e) => this.updateIntensity(e.target.value));
    }
    if (this.elements.notesInput) {
      this.elements.notesInput.addEventListener('input', (e) => this.updateCharCount(e.target.value));
    }
    if (this.elements.historyFilter) {
      this.elements.historyFilter.addEventListener('change', (e) => this.filterHistory(e.target.value));
    }
    
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const exportBtn = document.getElementById('exportBtn');
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    if (exportBtn) exportBtn.addEventListener('click', () => this.exportData());
    
    const modalClose = document.getElementById('modalClose');
    if (modalClose) modalClose.addEventListener('click', () => this.closeModal());
    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.elements.modalOverlay) this.closeModal();
      });
    }
    
    const helpBtn = document.getElementById('helpBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    if (helpBtn) helpBtn.addEventListener('click', () => this.showHelp());
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => this.startVoiceInput());
      // Long press for continuous listening
      let pressTimer;
      voiceBtn.addEventListener('mousedown', () => {
        pressTimer = setTimeout(() => {
          this.continuousListening = !this.continuousListening;
          if (this.continuousListening) {
            this.showToast('Continuous listening enabled! Click to stop.', 'info');
            this.startVoiceInput();
          } else {
            this.showToast('Continuous listening disabled', 'info');
            if (this.isListening) this.recognition.stop();
          }
        }, 1000);
      });
      voiceBtn.addEventListener('mouseup', () => clearTimeout(pressTimer));
      voiceBtn.addEventListener('mouseleave', () => clearTimeout(pressTimer));
    }
    
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  }

  renderMoodButtons() {
    if (!this.elements.moodGrid) return;
    
    this.elements.moodGrid.innerHTML = '';
    MOODS.forEach((mood, index) => {
      const btn = document.createElement('button');
      btn.className = 'mood-btn';
      btn.setAttribute('data-mood', mood.key);
      btn.setAttribute('data-index', index);
      btn.innerHTML = `
        <span class="mood-emoji">${mood.emoji}</span>
        <span class="mood-label">${mood.key}</span>
      `;
      btn.addEventListener('click', () => this.selectMood(mood));
      this.elements.moodGrid.appendChild(btn);
    });
  }

  selectMood(mood) {
    this.playSound('click');
    this.currentMood = mood;
    this.updateMoodDisplay(mood);
    this.createParticles(mood);
    this.updateMoodButtons(mood.key);
    this.updateMoodMeta();
  }

  updateMoodDisplay(mood) {
    if (!this.elements.resultCard) return;
    
    const moodClasses = MOODS.map(m => m.bgClass);
    this.elements.resultCard.classList.remove(...moodClasses);
    this.elements.resultCard.classList.add('dynamic-bg', mood.bgClass);
    
    if (this.elements.selectedMood) {
      this.elements.selectedMood.textContent = `${mood.emoji} ${mood.key}`;
    }
    
    const quote = this.getRomanticQuote(mood);
    if (this.elements.quote) {
      this.elements.quote.textContent = quote;
    }
    
    this.playSound('chime');
  }

  // ROMANTIC QUOTE GENERATOR for your love
  getRomanticQuote(mood) {
    const baseQuote = mood.quotes[Math.floor(Math.random() * mood.quotes.length)];
    const intensity = this.elements.intensityRange ? parseInt(this.elements.intensityRange.value) : 3;
    
    let personalizedQuote = baseQuote;
    
    if (intensity >= 4) {
      personalizedQuote += " Your beautiful energy fills my heart completely!";
    } else if (intensity <= 2) {
      personalizedQuote += " Let me love you gently through this moment, darling.";
    }
    
    return personalizedQuote;
  }

  updateMoodMeta() {
    if (!this.currentMood || !this.elements.moodMeta) return;
    
    const intensity = this.elements.intensityRange ? this.elements.intensityRange.value : 3;
    const timestamp = new Date().toLocaleString();
    const tip = this.currentMood.tips[Math.floor(Math.random() * this.currentMood.tips.length)];
    
    this.elements.moodMeta.innerHTML = `
      <div>Intensity: ${intensity}/5 • ${timestamp}</div>
      <div style="margin-top: 4px; font-style: italic;">💖 Love Note: ${tip}</div>
    `;
  }

  updateMoodButtons(selectedMoodKey) {
    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mood === selectedMoodKey);
    });
  }

  createParticles(mood) {
    if (!this.elements.resultCard) return;
    
    const existingParticles = this.elements.resultCard.querySelector('.mood-particles');
    if (existingParticles) existingParticles.remove();

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'mood-particles';
    
    const particleCount = Math.floor(Math.random() * 4) + 6;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.textContent = mood.particles[Math.floor(Math.random() * mood.particles.length)];
      
      particle.style.left = Math.random() * 90 + '%';
      particle.style.top = Math.random() * 80 + '%';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
      
      particlesContainer.appendChild(particle);
    }
    
    this.elements.resultCard.appendChild(particlesContainer);
  }

  randomizeMood() {
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
    const randomizeBtn = document.getElementById('randomizeBtn');
    
    // Add spin animation effect
    if (randomizeBtn) {
      randomizeBtn.style.transition = 'transform 0.3s ease';
      randomizeBtn.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        randomizeBtn.style.transform = 'rotate(0deg)';
      }, 300);
    }
    
    this.selectMood(randomMood);
    this.soundManager.playWithFeedback('chime', randomizeBtn);
  }

  clearMood() {
    this.currentMood = null;
    
    if (this.elements.resultCard) {
      const moodClasses = MOODS.map(m => m.bgClass);
      this.elements.resultCard.classList.remove(...moodClasses, 'dynamic-bg');
      
      const particles = this.elements.resultCard.querySelector('.mood-particles');
      if (particles) particles.remove();
    }
    
    if (this.elements.selectedMood) {
      this.elements.selectedMood.textContent = 'Select a mood above';
    }
    if (this.elements.quote) {
      this.elements.quote.textContent = 'Choose how you\'re feeling to get romantic words of love and comfort.';
    }
    if (this.elements.moodMeta) {
      this.elements.moodMeta.innerHTML = '';
    }
    
    // Enhanced clear animation with staggered effect
    document.querySelectorAll('.mood-btn').forEach((btn, index) => {
      setTimeout(() => {
        btn.classList.remove('active');
        btn.style.transition = 'transform 0.1s ease';
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          btn.style.transform = 'scale(1)';
        }, 100);
      }, index * 30);
    });
    
    const clearBtn = document.getElementById('clearBtn');
    this.soundManager.playWithFeedback('toggle', clearBtn);
  }

  saveMoodEntry() {
    if (!this.currentMood) {
      const saveBtn = document.getElementById('saveBtn');
      if (saveBtn) {
        saveBtn.classList.add('error-feedback');
        setTimeout(() => saveBtn.classList.remove('error-feedback'), 500);
      }
      this.showToast('Please select a mood first, my love!', 'warning');
      this.playSound('error');
      return;
    }

    const entry = {
      id: Date.now(),
      mood: this.currentMood.key,
      emoji: this.currentMood.emoji,
      intensity: this.elements.intensityRange ? parseInt(this.elements.intensityRange.value) : 3,
      note: this.elements.notesInput ? this.elements.notesInput.value.trim() : '',
      timestamp: Date.now(),
      date: new Date().toDateString()
    };

    this.moodHistory.unshift(entry);
    this.saveData('moodHistory', this.moodHistory);
    
    this.stats = this.calculateStats();
    this.streakCount = this.calculateStreak();
    this.updateUI();
    
    // Enhanced success feedback
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
      saveBtn.classList.add('success-feedback');
      setTimeout(() => saveBtn.classList.remove('success-feedback'), 500);
    }
    
    this.showToast('Your beautiful feelings saved with love! 💕', 'success');
    this.soundManager.playWithFeedback('success', saveBtn);
    
    if (this.elements.notesInput) {
      this.elements.notesInput.value = '';
      this.updateCharCount('');
    }
  }

  async shareMood() {
    if (!this.currentMood) return;

    const shareData = {
      title: 'Love Mirror',
      text: `I'm feeling ${this.currentMood.key} ${this.currentMood.emoji} and thinking of my love!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        this.playSound('success');
      } catch (err) {
        this.copyToClipboard(shareData.text);
      }
    } else {
      this.copyToClipboard(shareData.text);
    }
  }

  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Copied to clipboard with love!', 'success');
        this.playSound('success');
      });
    } else {
      this.showToast('Sharing not supported', 'warning');
      this.playSound('error');
    }
  }

  updateIntensity(value) {
    if (this.elements.intensityLabel) {
      this.elements.intensityLabel.textContent = `${value}/5`;
    }
    this.updateSliderFill();
    if (this.currentMood) {
      this.updateMoodMeta();
    }
    this.playSound('click');
  }

  updateSliderFill() {
    if (!this.elements.intensityRange || !this.elements.sliderFill) return;
    
    const value = this.elements.intensityRange.value;
    const percentage = ((value - 1) / 4) * 100;
    this.elements.sliderFill.style.width = percentage + '%';
  }

  updateCharCount(text) {
    if (!this.elements.charCount) return;
    
    const count = text.length;
    this.elements.charCount.textContent = count;
    this.elements.charCount.style.color = count > 280 ? 'var(--danger)' : 'var(--text-muted)';
  }

  calculateStreak() {
    if (this.moodHistory.length === 0) return 0;

    const uniqueDates = [...new Set(this.moodHistory.map(entry => 
      new Date(entry.timestamp).toDateString()
    ))].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < uniqueDates.length; i++) {
      const entryDate = new Date(uniqueDates[i]);
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (entryDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  calculateStats() {
    if (this.moodHistory.length === 0) {
      return { total: 0, dominant: '😊', weeklyAvg: 0 };
    }

    const moodCounts = {};
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const weeklyEntries = this.moodHistory.filter(entry => entry.timestamp > weekAgo);

    this.moodHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const dominant = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, 'Happy'
    );

    const dominantEmoji = MOODS.find(m => m.key === dominant)?.emoji || '😊';
    const weeklyAvg = weeklyEntries.length > 0 
      ? (weeklyEntries.reduce((sum, entry) => sum + (entry.intensity || 3), 0) / weeklyEntries.length).toFixed(1)
      : 0;

    return {
      total: this.moodHistory.length,
      dominant: dominantEmoji,
      weeklyAvg: weeklyAvg
    };
  }

  updateUI() {
    if (this.elements.streakBadge) {
      const streakCount = this.elements.streakBadge.querySelector('.streak-count');
      if (streakCount) streakCount.textContent = this.streakCount;
    }

    if (this.elements.totalEntries) this.elements.totalEntries.textContent = this.stats.total;
    if (this.elements.dominantMood) this.elements.dominantMood.textContent = this.stats.dominant;
    if (this.elements.weeklyAvg) this.elements.weeklyAvg.textContent = this.stats.weeklyAvg;

    this.renderHistory();
  }

  renderHistory() {
    if (!this.elements.historyList) return;
    
    const filter = this.elements.historyFilter ? this.elements.historyFilter.value : 'all';
    let filteredHistory = [...this.moodHistory];

    if (filter !== 'all') {
      const days = parseInt(filter);
      const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
      filteredHistory = this.moodHistory.filter(entry => entry.timestamp > cutoff);
    }

    this.elements.historyList.innerHTML = '';

    if (filteredHistory.length === 0) {
      this.elements.historyList.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;">No mood entries yet. Start sharing your feelings, my love!</div>';
      return;
    }

    filteredHistory.slice(0, 20).forEach(entry => {
      const item = document.createElement('div');
      item.className = 'history-item';
      
      const date = new Date(entry.timestamp);
      const timeString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      
      item.innerHTML = `
        <div class="history-emoji">${entry.emoji}</div>
        <div class="history-content">
          <div class="history-mood">${entry.mood} (${entry.intensity}/5)</div>
          <div class="history-date">${timeString}</div>
          ${entry.note ? `<div class="history-note">"${entry.note}"</div>` : ''}
        </div>
      `;
      
      this.elements.historyList.appendChild(item);
    });
  }

  filterHistory(days) {
    this.renderHistory();
    this.playSound('click');
  }

  clearHistory() {
    if (confirm('Are you sure you want to clear all beautiful memories? This cannot be undone.')) {
      this.moodHistory = [];
      this.saveData('moodHistory', this.moodHistory);
      this.stats = this.calculateStats();
      this.streakCount = this.calculateStreak();
      this.updateUI();
      this.showToast('History cleared with love', 'success');
      this.playSound('success');
    } else {
      this.playSound('error');
    }
  }

  exportData() {
    const dataToExport = {
      moodHistory: this.moodHistory,
      stats: this.stats,
      streak: this.streakCount,
      exportDate: new Date().toISOString(),
      note: "Beautiful moments saved with love 💕"
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `love-mirror-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showToast('Love data exported successfully! 💕', 'success');
    this.playSound('success');
  }

  setupVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 3;

      // Enhanced result processing with confidence scoring
      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          this.processSpeechInput(finalTranscript.toLowerCase().trim());
        } else if (interimTranscript) {
          // Show interim results for better UX
          this.updateVoiceStatus(`Listening: "${interimTranscript.trim()}"`);
        }
      };

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateVoiceButton(true);
        this.updateVoiceStatus('Listening... Speak now!');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateVoiceButton(false);
        this.clearVoiceStatus();
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        this.updateVoiceButton(false);
        let errorMessage = 'Voice recognition error. Please try again, love.';
        
        switch(event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Try speaking louder, my love.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not found. Please check your audio settings.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection.';
            break;
        }
        
        this.showToast(errorMessage, 'warning');
        this.playSound('error');
        this.clearVoiceStatus();
      };

      // Auto-restart feature for continuous listening
      this.recognition.onspeechend = () => {
        if (this.continuousListening) {
          setTimeout(() => {
            if (this.continuousListening && !this.isListening) {
              this.startVoiceInput();
            }
          }, 1000);
        }
      };
    }
  }

  startVoiceInput() {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      this.showToast('Voice recognition requires HTTPS or localhost', 'warning');
      this.playSound('error');
      return;
    }

    if (!this.recognition) {
      this.showToast('Voice recognition not supported in your browser', 'warning');
      this.playSound('error');
      return;
    }

    if (this.isListening) {
      // Stop listening if already active
      this.recognition.stop();
      this.continuousListening = false;
      return;
    }

    try {
      this.recognition.start();
      this.playSound('notification');
    } catch (error) {
      console.error('Speech recognition start error:', error);
      this.showToast('Failed to start voice recognition. Please try again.', 'error');
      this.playSound('error');
    }
  }

  processSpeechInput(transcript) {
    console.log('Processing speech:', transcript);
    
    // Enhanced mood keywords with synonyms and phrases
    const moodKeywords = {
      'happy': ['happy', 'good', 'great', 'wonderful', 'joyful', 'cheerful', 'glad', 'pleased', 'delighted', 'content'],
      'sad': ['sad', 'down', 'blue', 'depressed', 'unhappy', 'melancholy', 'sorrowful', 'gloomy', 'dejected'],
      'angry': ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'upset', 'frustrated', 'enraged', 'livid'],
      'tired': ['tired', 'exhausted', 'weary', 'fatigued', 'drained', 'sleepy', 'worn out', 'beat'],
      'calm': ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'composed', 'zen', 'centered'],
      'excited': ['excited', 'thrilled', 'pumped', 'energetic', 'enthusiastic', 'hyped', 'elated'],
      'anxious': ['anxious', 'nervous', 'worried', 'stressed', 'tense', 'uneasy', 'concerned', 'panicked'],
      'neutral': ['neutral', 'okay', 'fine', 'alright', 'normal', 'meh', 'average', 'so-so']
    };

    // Check for exact mood matches first
    let bestMatch = null;
    let highestConfidence = 0;
    
    // Look for direct mood mentions
    for (const [moodKey, keywords] of Object.entries(moodKeywords)) {
      for (const keyword of keywords) {
        if (transcript.includes(keyword)) {
          const confidence = keyword.length / transcript.length;
          if (confidence > highestConfidence) {
            highestConfidence = confidence;
            bestMatch = moodKey;
          }
        }
      }
    }

    // Look for phrases like "I feel...", "I'm feeling...", "I am..."
    const feelingPhrases = [
      /i feel (\w+)/,
      /i'm feeling (\w+)/,
      /i am (\w+)/,
      /feeling (\w+)/,
      /i'm (\w+)/
    ];

    for (const phrase of feelingPhrases) {
      const match = transcript.match(phrase);
      if (match && match[1]) {
        const extractedWord = match[1];
        for (const [moodKey, keywords] of Object.entries(moodKeywords)) {
          if (keywords.includes(extractedWord)) {
            bestMatch = moodKey;
            highestConfidence = 0.9; // High confidence for structured phrases
            break;
          }
        }
        if (bestMatch) break;
      }
    }

    // Find the mood and select it
    if (bestMatch) {
      const mood = MOODS.find(m => m.key.toLowerCase() === bestMatch.toLowerCase());
      if (mood) {
        this.selectMood(mood);
        this.showToast(`I heard "${bestMatch}" - sending you love! 💕`, 'success');
        this.playSound('success');
        
        // Auto-populate notes if there's additional context
        const notes = transcript.replace(new RegExp(moodKeywords[bestMatch].join('|'), 'gi'), '').trim();
        if (notes.length > 10 && this.elements.notesInput) {
          this.elements.notesInput.value = notes.charAt(0).toUpperCase() + notes.slice(1);
          this.updateCharCount(this.elements.notesInput.value);
        }
        return;
      }
    }
    
    // Provide helpful suggestions
    const suggestions = ['happy', 'sad', 'excited', 'calm', 'tired'];
    this.showToast(`I didn't catch that, love. Try saying "I feel ${suggestions[Math.floor(Math.random() * suggestions.length)]}" or similar.`, 'info');
    this.playSound('error');
  }

  async checkNotificationPermission() {
    if ('Notification' in window && this.settings.notifications) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    }
  }

  async toggleNotifications(enabled) {
    this.updateSetting('notifications', enabled);
    
    if (enabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.showToast('Love reminders enabled! 💕', 'success');
        this.playSound('success');
        this.scheduleNotification();
      } else {
        if (this.elements.notificationsToggle) {
          this.elements.notificationsToggle.checked = false;
        }
        this.showToast('Notification permission denied', 'warning');
        this.playSound('error');
      }
    } else {
      this.playSound('toggle');
    }
  }

  scheduleNotification() {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(19, 0, 0, 0);
    
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      if (this.settings.notifications && Notification.permission === 'granted') {
        new Notification('Love Mirror Reminder 💕', {
          body: 'How are you feeling today, my love? Share your heart with me.',
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💕</text></svg>',
          tag: 'love-reminder'
        });
        this.playSound('notification');
      }
    }, timeUntilNotification);
  }

  handleKeyboardShortcuts(e) {
    if (e.altKey) {
      const keyMap = {
        '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7
      };
      
      if (keyMap.hasOwnProperty(e.key)) {
        e.preventDefault();
        const moodIndex = keyMap[e.key];
        if (MOODS[moodIndex]) {
          this.selectMood(MOODS[moodIndex]);
        }
      }
      
      if (e.key === 's') {
        e.preventDefault();
        this.saveMoodEntry();
      }
      
      if (e.key === 'c') {
        e.preventDefault();
        this.clearMood();
      }

      if (e.key === 't') {
        e.preventDefault();
        this.toggleTheme();
      }
    }
    
    if (e.key === 'Escape') {
      this.closeModal();
    }
  }

  showHelp() {
    this.showModal('How to Use Love Mirror 💕', `
      <div style="line-height: 1.8; color: var(--text-secondary);">
        <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem;">
          <h4 style="margin: 0 0 1rem 0; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            💖 Getting Started
          </h4>
          <ul style="margin: 0; padding-left: 1.25rem;">
            <li>Click on a mood that matches how you're feeling</li>
            <li>Adjust the intensity slider (1-5)</li>
            <li>Add love notes about your mood</li>
            <li>Save your entry to track your feelings over time</li>
          </ul>
        </div>
        
        <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem;">
          <h4 style="margin: 0 0 1rem 0; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            ⌨️ Keyboard Shortcuts
          </h4>
          <ul style="margin: 0; padding-left: 1.25rem;">
            <li><strong>Alt + 1-8:</strong> Quick select moods</li>
            <li><strong>Alt + S:</strong> Save mood entry</li>
            <li><strong>Alt + C:</strong> Clear selection</li>
            <li><strong>Alt + T:</strong> Toggle dark/light mode</li>
            <li><strong>Escape:</strong> Close modal</li>
          </ul>
        </div>
        
        <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem;">
          <h4 style="margin: 0 0 1rem 0; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            🎤 Voice Input
          </h4>
          <p style="margin: 0;">Click the microphone button and say "I feel [mood]" to quickly select your mood!</p>
        </div>
        
        <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem;">
          <h4 style="margin: 0 0 1rem 0; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            🔊 Sound Controls
          </h4>
          <ul style="margin: 0; padding-left: 1.25rem;">
            <li>Toggle sound on/off with the sound toggle</li>
            <li>Adjust volume with the volume slider</li>
            <li>Different sounds for different actions</li>
          </ul>
        </div>
        
        <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--radius-lg);">
          <h4 style="margin: 0 0 1rem 0; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            💕 Made with Love
          </h4>
          <p style="margin: 0;">This Love Mirror is specially crafted to help you express your feelings with romantic, caring messages. Every mood gets loving support and beautiful words.</p>
        </div>
      </div>
    `);
    this.playSound('click');
  }

  showModal(title, content) {
    if (!this.elements.modalTitle || !this.elements.modalBody || !this.elements.modalOverlay) return;
    
    this.elements.modalTitle.textContent = title;
    this.elements.modalBody.innerHTML = content;
    this.elements.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
    this.playSound('click');
  }

  showToast(message, type = 'info') {
    if (!this.elements.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = { success: '💕', warning: '💛', info: '💖', error: '💙' };
    
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    `;
    
    this.elements.toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          this.elements.toastContainer.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  updateSetting(key, value) {
    this.settings[key] = value;
    this.saveData('settings', this.settings);
  }

  restoreLastSession() {
    const lastSession = this.loadData('lastSession');
    if (lastSession && lastSession.timestamp > Date.now() - (24 * 60 * 60 * 1000)) {
      if (this.elements.intensityRange) {
        this.elements.intensityRange.value = lastSession.intensity || 3;
      }
      if (this.elements.intensityLabel) {
        this.elements.intensityLabel.textContent = `${lastSession.intensity || 3}/5`;
      }
      if (this.elements.notesInput) {
        this.elements.notesInput.value = lastSession.note || '';
      }
      this.updateSliderFill();
      
      if (lastSession.mood) {
        const mood = MOODS.find(m => m.key === lastSession.mood);
        if (mood) {
          this.selectMood(mood);
        }
      }
    }
  }

  saveLastSession() {
    if (!this.settings.persistData) return;
    
    const session = {
      mood: this.currentMood?.key,
      intensity: this.elements.intensityRange ? parseInt(this.elements.intensityRange.value) : 3,
      note: this.elements.notesInput ? this.elements.notesInput.value.trim() : '',
      timestamp: Date.now()
    };
    
    this.saveData('lastSession', session);
  }

  saveData(key, data) {
    try {
      localStorage.setItem(`loveMirror_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save data to localStorage:', e);
    }
  }

  loadData(key) {
    try {
      const data = localStorage.getItem(`loveMirror_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to load data from localStorage:', e);
      return null;
    }
  }
}

// Initialize the romantic app
document.addEventListener('DOMContentLoaded', () => {
  window.loveMirror = new ModernMoodMirror();
});

window.addEventListener('beforeunload', () => {
  if (window.loveMirror) {
    window.loveMirror.saveLastSession();
  }
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && window.loveMirror) {
    window.loveMirror.updateUI();
  }
});

setTimeout(() => {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
    loadingScreen.classList.add('hidden');
  }
}, 5000);
