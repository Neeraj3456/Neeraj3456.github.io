/* ═══════════════════════════════════════════
   NEERAJ KUMAR PORTFOLIO — main.js
   ═══════════════════════════════════════════ */

/* ── Mobile nav ── */
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.textContent = open ? '✕' : '☰';
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.textContent = '☰';
  })
);

/* ── Nav scroll style ── */
window.addEventListener('scroll', () => {
  document.querySelector('.nav').classList.toggle('scrolled', window.scrollY > 60);
  document.querySelector('.scroll-top').classList.toggle('visible', window.scrollY > 400);
});
document.querySelector('.scroll-top').addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

/* ── Scroll reveal ── */
const revealObs = new IntersectionObserver(entries =>
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── Split-flap board ── */
const WORDS = ['STUDENT','BUILDER','LEARNER','THINKER','CREATOR','CODER'];
let wordIdx = 0;
const board = document.getElementById('flapBoard');

WORDS[0].split('').forEach((ch, i) => {
  const flap  = document.createElement('div'); flap.className = 'flap';
  const inner = document.createElement('div'); inner.className = 'flap-inner';
  const front = document.createElement('div'); front.className = 'flap-face front'; front.textContent = ch;
  const back  = document.createElement('div'); back.className  = 'flap-face back';  back.textContent  = WORDS[1][i] || ' ';
  inner.append(front, back); flap.append(inner); board.append(flap);
});

function flipCell(cell, ch) {
  const inner = cell.querySelector('.flap-inner');
  const front = cell.querySelector('.flap-face.front');
  const back  = cell.querySelector('.flap-face.back');
  back.textContent = ch;
  inner.classList.add('flip');
  setTimeout(() => {
    front.textContent = ch;
    inner.style.transition = 'none';
    inner.classList.remove('flip');
    requestAnimationFrame(() => { inner.style.transition = ''; });
  }, 500);
}

const cells = board.querySelectorAll('.flap');
setInterval(() => {
  wordIdx = (wordIdx + 1) % WORDS.length;
  const word = WORDS[wordIdx].padEnd(WORDS[0].length);
  cells.forEach((c, i) => setTimeout(() => flipCell(c, word[i] || ' '), i * 65));
}, 3000);

/* ── Floating particles ── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const COLORS = ['rgba(52,230,255,', 'rgba(179,136,255,', 'rgba(87,255,176,', 'rgba(255,184,61,'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * w;
      this.y  = Math.random() * h;
      this.r  = Math.random() * 1.5 + .5;
      this.vx = (Math.random() - .5) * .3;
      this.vy = (Math.random() - .5) * .3;
      this.a  = Math.random() * .35 + .05;
      this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = Math.random() * 200 + 100;
      this.age  = 0;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.age++;
      if (this.age > this.life || this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      const fade = Math.min(1, Math.min(this.age, this.life - this.age) / 30);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.c + (this.a * fade) + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── Certificate filter + lightbox ── */
const filterBtns = document.querySelectorAll('.cert-filter-btn');
const certCards  = document.querySelectorAll('.cert-card');
const lightbox   = document.getElementById('lightbox');
const lbContent  = document.getElementById('lbContent');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    certCards.forEach(c => {
      c.dataset.hidden = (cat !== 'all' && c.dataset.cat !== cat) ? 'true' : 'false';
    });
  });
});

function openLightbox(src, isPdf) {
  lbContent.innerHTML = '';
  if (isPdf) {
    const iframe = document.createElement('iframe');
    iframe.src = src + '#toolbar=0';
    lbContent.appendChild(iframe);
  } else {
    const img = document.createElement('img');
    img.src = src; img.alt = 'Certificate';
    lbContent.appendChild(img);
  }
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lbContent.innerHTML = '';
  document.body.style.overflow = '';
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const src   = card.dataset.src;
    const isPdf = card.dataset.pdf === 'true';
    openLightbox(src, isPdf);
  });
});

/* ── Typed cursor effect on hero tagline ── */
(function typeEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const texts = [
    'AI Student | Building Intelligent Systems',
    'ML Intern @ Arch Technologies',
    'ZAB-E-FEST Code Crafters 🏆',
    'PTE Pakistan Campus Ambassador'
  ];
  let ti = 0, ci = 0, deleting = false;

  function tick() {
    const cur = texts[ti];
    if (!deleting) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { deleting = true; setTimeout(tick, 2000); return; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; }
    }
    setTimeout(tick, deleting ? 40 : 70);
  }
  tick();
})();
