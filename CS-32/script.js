(() => {
  const $ = id => document.getElementById(id);
  const els = {
    input: $('colorInput'),
    hex: $('hexCode'),
    rgb: $('rgbCode'),
    hsl: $('hslCode'),
    msg: $('copiedMsg')
  };

  const hexToRgb = hex => {
    const [r, g, b] = hex.replace('#', '')
      .match(hex.length > 4 ? /.{2}/g : /./g)
      .map(x => parseInt(x.repeat(x.length === 1 ? 2 : 1), 16));
    return [r, g, b];
  };

  const rgbToHsl = ([r, g, b]) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [
      Math.round(h * 360),
      Math.round(s * 100),
      Math.round(l * 100)
    ];
  };

  const updateUI = color => {
    // Update color codes
    els.hex.textContent = color;
    const rgb = hexToRgb(color);
    els.rgb.textContent = `rgb(${rgb.join(', ')})`;
    const [h, s, l] = rgbToHsl(rgb);
    els.hsl.textContent = `hsl(${h}, ${s}%, ${l}%)`;
    
    // Update dynamic backgrounds
    const [r, g, b] = rgb;
    const style = document.documentElement.style;
    style.setProperty('--accent', color);
    
    // Update body background
    document.body.style.background = `radial-gradient(ellipse at top, rgba(${r}, ${g}, ${b}, 0.08), var(--bg))`;
    
    // Update ripple
    const ripple = document.querySelector('.color-ripple');
    if (ripple) ripple.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
  };

  const showCopied = () => {
    els.msg.hidden = false;
    els.msg.classList.add('show');
    setTimeout(() => {
      els.msg.classList.remove('show');
      setTimeout(() => els.msg.hidden = true, 300);
    }, 1200);
  };

  // Event Listeners
  els.input.addEventListener('input', e => updateUI(e.target.value));
  
  document.querySelectorAll('.copyBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = $(btn.dataset.target);
      navigator.clipboard.writeText(target.textContent).then(showCopied);
    });
  });

  // Init
  updateUI(els.input.value);
})();
