// Theme Customizer for MHS Konnect

// Theme presets
const themePresets = {
  mixed: {
    bgColor: '#0a0a0a',
    primaryColor: '#00ff41',
    secondaryColor: '#ff0000',
    textColor: '#ffffff',
    bgImage: 'none'
  },
  dark: {
    bgColor: '#000000',
    primaryColor: '#ffffff',
    secondaryColor: '#cccccc',
    textColor: '#ffffff',
    bgImage: 'none'
  },
  horror: {
    bgColor: '#0a0000',
    primaryColor: '#ff0000',
    secondaryColor: '#8b0000',
    textColor: '#ffffff',
    bgImage: 'none'
  },
  battlefield: {
    bgColor: '#000a00',
    primaryColor: '#00ff41',
    secondaryColor: '#00cc33',
    textColor: '#ffffff',
    bgImage: 'none'
  },
  cyberpunk: {
    bgColor: '#0a000a',
    primaryColor: '#ff00ff',
    secondaryColor: '#00ffff',
    textColor: '#ffffff',
    bgImage: 'none'
  },
  light: {
    bgColor: '#f5f5f5',
    primaryColor: '#009900',
    secondaryColor: '#cc0000',
    textColor: '#1a1a1a',
    bgImage: 'none'
  },
  grey: {
    bgColor: '#404040',
    primaryColor: '#00ff41',
    secondaryColor: '#ff6666',
    textColor: '#ffffff',
    bgImage: 'none'
  }
};

// Get DOM elements
const themePresetBtns = document.querySelectorAll('.theme-preset-btn');
const bgColorInput = document.getElementById('bg-color');
const primaryColorInput = document.getElementById('primary-color');
const secondaryColorInput = document.getElementById('secondary-color');
const textColorInput = document.getElementById('text-color');
const bgOpacitySlider = document.getElementById('bg-opacity');
const bgBlurSlider = document.getElementById('bg-blur');
const opacityValue = document.getElementById('opacity-value');
const blurValue = document.getElementById('blur-value');
const bgPresetBtns = document.querySelectorAll('.bg-preset-btn');
const bgUpload = document.getElementById('bg-upload');
const saveBtn = document.getElementById('save-theme');
const resetBtn = document.getElementById('reset-theme');
const previewBtn = document.getElementById('preview-theme');

// Current theme state
let currentTheme = {
  bgColor: '#0a0a0a',
  primaryColor: '#00ff41',
  secondaryColor: '#ff0000',
  textColor: '#ffffff',
  bgImage: 'none',
  bgOpacity: 100,
  bgBlur: 0,
  customBgImage: null
};

// Load saved theme from localStorage
function loadSavedTheme() {
  const saved = localStorage.getItem('mhsKonnectTheme');
  if (saved) {
    currentTheme = JSON.parse(saved);
    applyTheme(currentTheme);
    updateInputs(currentTheme);
  }
}

// Apply theme to page
function applyTheme(theme) {
  const root = document.documentElement;

  // Detect if it's a light theme (bright background)
  const isLightTheme = getBrightness(theme.bgColor) > 128;

  // Apply colors
  root.style.setProperty('--bg-dark', theme.bgColor);

  if (isLightTheme) {
    // Light theme: make darker and card lighter
    root.style.setProperty('--bg-darker', adjustBrightness(theme.bgColor, -15));
    root.style.setProperty('--bg-card', '#ffffff');
  } else {
    // Dark theme: normal behavior
    root.style.setProperty('--bg-darker', adjustBrightness(theme.bgColor, -20));
    root.style.setProperty('--bg-card', adjustBrightness(theme.bgColor, 10));
  }

  root.style.setProperty('--battlefield-primary', theme.primaryColor);
  root.style.setProperty('--horror-primary', theme.secondaryColor);
  root.style.setProperty('--text-primary', theme.textColor);

  // Apply background image (only if custom image is uploaded)
  if (theme.customBgImage) {
    document.body.style.backgroundImage = `url(${theme.customBgImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  } else {
    document.body.style.backgroundImage = 'none';
  }

  // Apply opacity and blur
  document.body.style.opacity = theme.bgOpacity / 100;
  if (theme.bgImage !== 'none' || theme.customBgImage) {
    document.body.style.backdropFilter = `blur(${theme.bgBlur}px)`;
  }

  // Adjust navigation link styles for light themes
  const navLinks = document.querySelectorAll('.mhs-header nav a');
  if (isLightTheme) {
    navLinks.forEach(link => {
      link.style.background = 'rgba(255, 255, 255, 0.8)';
      link.style.color = '#1a1a1a';
      link.style.border = '1px solid rgba(0, 0, 0, 0.2)';
    });
  } else {
    navLinks.forEach(link => {
      link.style.background = 'rgba(0, 0, 0, 0.5)';
      link.style.color = '';
      link.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    });
  }
}

// Update input values
function updateInputs(theme) {
  bgColorInput.value = theme.bgColor;
  primaryColorInput.value = theme.primaryColor;
  secondaryColorInput.value = theme.secondaryColor;
  textColorInput.value = theme.textColor;
  bgOpacitySlider.value = theme.bgOpacity;
  bgBlurSlider.value = theme.bgBlur;
  opacityValue.textContent = theme.bgOpacity;
  blurValue.textContent = theme.bgBlur;
}

// Get brightness of a hex color (0-255)
function getBrightness(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  const R = (num >> 16);
  const G = (num >> 8 & 0x00FF);
  const B = (num & 0x0000FF);
  return (R * 299 + G * 587 + B * 114) / 1000;
}

// Adjust color brightness (helper function)
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}

// Preset theme buttons
themePresetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const themeName = btn.dataset.theme;
    const preset = themePresets[themeName];

    // Update active state
    themePresetBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Apply preset
    currentTheme = { ...currentTheme, ...preset };
    updateInputs(currentTheme);
    applyTheme(currentTheme);
  });
});

// Color picker changes
bgColorInput.addEventListener('input', (e) => {
  currentTheme.bgColor = e.target.value;
  applyTheme(currentTheme);
});

primaryColorInput.addEventListener('input', (e) => {
  currentTheme.primaryColor = e.target.value;
  applyTheme(currentTheme);
});

secondaryColorInput.addEventListener('input', (e) => {
  currentTheme.secondaryColor = e.target.value;
  applyTheme(currentTheme);
});

textColorInput.addEventListener('input', (e) => {
  currentTheme.textColor = e.target.value;
  applyTheme(currentTheme);
});

// Opacity slider
bgOpacitySlider.addEventListener('input', (e) => {
  currentTheme.bgOpacity = parseInt(e.target.value);
  opacityValue.textContent = currentTheme.bgOpacity;
  applyTheme(currentTheme);
});

// Blur slider
bgBlurSlider.addEventListener('input', (e) => {
  currentTheme.bgBlur = parseInt(e.target.value);
  blurValue.textContent = currentTheme.bgBlur;
  applyTheme(currentTheme);
});

// Background preset buttons
bgPresetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const bgName = btn.dataset.bg;

    // Update active state
    bgPresetBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Apply background
    currentTheme.bgImage = bgName;
    currentTheme.customBgImage = null;
    applyTheme(currentTheme);
  });
});

// Custom background upload
bgUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      currentTheme.customBgImage = event.target.result;
      currentTheme.bgImage = 'custom';
      applyTheme(currentTheme);
    };
    reader.readAsDataURL(file);
  }
});

// Save theme
saveBtn.addEventListener('click', () => {
  localStorage.setItem('mhsKonnectTheme', JSON.stringify(currentTheme));

  // Show confirmation
  saveBtn.textContent = '✅ Saved!';
  saveBtn.style.background = 'linear-gradient(135deg, #00ff41, #00cc33)';

  setTimeout(() => {
    saveBtn.textContent = '💾 Save Theme';
    saveBtn.style.background = '';
  }, 2000);
});

// Reset theme
resetBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset to default theme?')) {
    currentTheme = { ...themePresets.mixed, bgOpacity: 100, bgBlur: 0, customBgImage: null };
    updateInputs(currentTheme);
    applyTheme(currentTheme);
    localStorage.removeItem('mhsKonnectTheme');

    // Reset active preset button
    themePresetBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-theme="mixed"]').classList.add('active');

    // Show confirmation
    resetBtn.textContent = '✅ Reset Complete!';
    setTimeout(() => {
      resetBtn.textContent = '🔄 Reset to Default';
    }, 2000);
  }
});

// Preview theme (same as apply, just for confirmation)
previewBtn.addEventListener('click', () => {
  applyTheme(currentTheme);

  // Show confirmation
  previewBtn.textContent = '✅ Preview Applied!';
  setTimeout(() => {
    previewBtn.textContent = '👁️ Preview';
  }, 2000);
});

// Load saved theme on page load
loadSavedTheme();

// Also apply theme immediately if on other pages
if (window.location.pathname.includes('feed.html') ||
    window.location.pathname.includes('profile.html') ||
    window.location.pathname.includes('upload.html') ||
    window.location.pathname.includes('chat.html')) {
  loadSavedTheme();
}

// ===== TAB FUNCTIONALITY =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('[data-tab-content]');

// Show first tab by default
if (tabContents.length > 0) {
  tabContents[0].classList.add('active');
}

// Tab switching
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;

    // Update active button
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update active content
    tabContents.forEach(content => {
      if (content.dataset.tabContent === targetTab) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  });
});
