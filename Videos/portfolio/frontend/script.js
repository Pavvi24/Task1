const API_BASE = 'https://task1-3-skgb.onrender.com';

/* CURSOR */
(function() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor) return;
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    setTimeout(() => { trail.style.left = mx + 'px'; trail.style.top = my + 'px'; }, 80);
  });
  document.querySelectorAll('a,button,.tag,.info-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2)'; trail.style.transform = 'translate(-50%,-50%) scale(1.4)'; });
    el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; trail.style.transform = 'translate(-50%,-50%) scale(1)'; });
  });
})();

/* PARTICLES */
(function() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.life = 0; this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life++;
      if (this.y < -5 || this.life > this.maxLife) this.reset(false);
    }
    draw() {
      const fade = Math.min(this.life / 40, 1) * Math.min((this.maxLife - this.life) / 40, 1);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168,127,212,${this.alpha * fade})`;
      ctx.fill();
    }
  }

  function init() { resize(); particles = Array.from({length:80}, () => new Particle()); }
  function loop() { ctx.clearRect(0,0,W,H); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(loop); }

  window.addEventListener('resize', resize);
  init(); loop();
})();

/* NAVBAR SCROLL */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
}, {passive:true});

/* MOBILE MENU */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); mobileMenu.classList.toggle('open'); });
function closeMobile() { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); }

/* TYPED TEXT */
(function() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const phrases = ['AI/ML Engineer in Training','Deep Learning Enthusiast','Full-Stack Developer','CS Undergraduate @ RGUKT','DeepLearning.AI Certified'];
  let pi = 0, ci = 0, del = false;
  function tick() {
    const p = phrases[pi];
    el.textContent = del ? p.slice(0, ci--) : p.slice(0, ci++);
    if (!del && ci > p.length) { del = true; setTimeout(tick, 1800); return; }
    if (del && ci < 0) { del = false; pi = (pi+1) % phrases.length; setTimeout(tick, 350); return; }
    setTimeout(tick, del ? 45 : 80);
  }
  setTimeout(tick, 1000);
})();

/* COUNTERS */
(function() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = parseInt(el.dataset.target);
      const isDecimal = target === 838;
      let n = 0; const step = target / 60;
      const t = setInterval(() => {
        n += step;
        if (n >= target) { n = target; clearInterval(t); }
        el.textContent = isDecimal ? (n/100).toFixed(2) : Math.floor(n);
      }, 20);
      obs.unobserve(el);
    });
  }, {threshold:0.5});
  document.querySelectorAll('.counter-num').forEach(c => obs.observe(c));
})();

/* SCROLL REVEAL */
(function() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) * 100 : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      obs.unobserve(el);
    });
  }, {threshold:0.12});
  document.querySelectorAll('.info-card,.skill-block,.project-card').forEach(el => obs.observe(el));
})();

/* PROJECTS */
const DEMO = [
  {id:'d1',title:'Hostel Management System',description:'Full-stack MERN application for managing students, room allocation, and complaints. RESTful APIs with Node.js & Express.js, MongoDB persistence, React.js UI with JWT auth and email verification.',tech:'React.js, Node.js, Express.js, MongoDB, JWT Auth',githubLink:'https://github.com/pavanadithyavattam/hostel-management'},
  {id:'d2',title:'Deep Learning Projects',description:'Applied deep learning from the DeepLearning.AI specialization — neural networks from scratch, optimization (regularization, hyperparameter tuning), and sequence models using TensorFlow.',tech:'Python, TensorFlow, Keras, NumPy, Jupyter Notebook',githubLink:'https://github.com/pavanadithyavattam/deeplearning-projects'},
  {id:'d3',title:'ML Model Evaluation Suite',description:'Structured ML workflows covering data preprocessing, feature engineering, model training, debugging, and performance analysis using Scikit-learn for reproducible pipelines.',tech:'Python, Scikit-learn, Pandas, NumPy, Matplotlib',githubLink:'https://github.com/pavanadithyavattam/ml-evaluation-suite'}
];

async function loadProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects`, {signal: AbortSignal.timeout(4000)});
    if (!res.ok) throw new Error();
    const data = await res.json();
    renderProjects(data.length ? data : DEMO, data.length === 0);
  } catch { renderProjects(DEMO, true); }
}

function renderProjects(projects, offline=false) {
  const grid = document.getElementById('projectList');
  const note = document.getElementById('apiNote');
  grid.innerHTML = '';
  if (!projects.length) {
    grid.innerHTML = `<p style="color:var(--text-3);font-family:var(--ff-mono);font-size:.85rem;grid-column:1/-1">No projects yet. Click + Add Project.</p>`;
    return;
  }
  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    const chips = p.tech.split(',').map(t=>`<span class="tech-chip">${esc(t.trim())}</span>`).join('');
    const gh = p.githubLink ? `<a href="${p.githubLink}" target="_blank" rel="noopener" class="project-github-link"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg> GitHub ↗</a>` : '';
    card.innerHTML = `<div class="project-card-top"><span class="project-number">PROJECT_${String(i+1).padStart(2,'0')}</span>${gh}</div><div class="project-title">${esc(p.title)}</div><div class="project-desc">${esc(p.description)}</div><div class="project-tech-list">${chips}</div>`;
    grid.appendChild(card);
    requestAnimationFrame(() => setTimeout(() => card.classList.add('visible'), i * 80));
  });
  if (offline && note) note.style.display = 'flex';
}

function esc(s) { const d=document.createElement('div'); d.appendChild(document.createTextNode(s||'')); return d.innerHTML; }

/* MODAL */
const backdrop   = document.getElementById('modalBackdrop');
const btnAdd     = document.getElementById('btnAddProject');
const btnClose   = document.getElementById('modalClose');
const btnCancel  = document.getElementById('btnModalCancel');
const btnSubmit  = document.getElementById('btnModalSubmit');
const submitLbl  = document.getElementById('submitLabel');

btnAdd.addEventListener('click', () => backdrop.classList.add('open'));
btnClose.addEventListener('click', closeModal);
btnCancel.addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if(e.target===backdrop) closeModal(); });

function closeModal() {
  backdrop.classList.remove('open');
  ['mTitle','mDesc','mTech','mGithub'].forEach(id => document.getElementById(id).value='');
}

btnSubmit.addEventListener('click', async () => {
  const title  = document.getElementById('mTitle').value.trim();
  const desc   = document.getElementById('mDesc').value.trim();
  const tech   = document.getElementById('mTech').value.trim();
  const github = document.getElementById('mGithub').value.trim();
  if (!title||!desc||!tech) { showToast('Fill in all required fields.', true); return; }
  btnSubmit.disabled=true; submitLbl.textContent='Adding...';
  try {
    const res = await fetch(`${API_BASE}/projects`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,description:desc,tech,githubLink:github})});
    if(!res.ok) throw new Error();
    const saved = await res.json();
    const grid = document.getElementById('projectList');
    const i = grid.querySelectorAll('.project-card').length;
    const card = document.createElement('div');
    card.className='project-card';
    const chips=saved.tech.split(',').map(t=>`<span class="tech-chip">${esc(t.trim())}</span>`).join('');
    card.innerHTML=`<div class="project-card-top"><span class="project-number">PROJECT_${String(i+1).padStart(2,'0')}</span></div><div class="project-title">${esc(saved.title)}</div><div class="project-desc">${esc(saved.description)}</div><div class="project-tech-list">${chips}</div>`;
    grid.appendChild(card);
    requestAnimationFrame(()=>setTimeout(()=>card.classList.add('visible'),50));
    closeModal(); showToast('✓ Project added!');
  } catch { showToast('⚠ Backend offline.', true); }
  finally { btnSubmit.disabled=false; submitLbl.textContent='Add Project'; }
});

/* CONTACT */
function handleContact(e) {
  e.preventDefault();
  const fd=new FormData(e.target);
  const name=fd.get('name'), email=fd.get('email'), subject=fd.get('subject')||`Portfolio Contact from ${name}`, message=fd.get('message');
  window.location.href=`mailto:pavanadithyavattam@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Pavan,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`)}`;
  showToast('✓ Opening email client...');
  e.target.reset();
}

/* TOAST */
let toastTimer;
function showToast(msg, err=false) {
  const t=document.getElementById('toast');
  clearTimeout(toastTimer);
  t.textContent=msg; t.className='toast'+(err?' error':'');
  void t.offsetWidth;
  t.classList.add('show');
  toastTimer=setTimeout(()=>t.classList.remove('show'),3500);
}

/* ACTIVE NAV */
(function() {
  const sections=document.querySelectorAll('section[id]');
  const links=document.querySelectorAll('.nav-links a');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      links.forEach(l=>l.style.color='');
      const a=document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if(a) a.style.color='var(--violet-light)';
    });
  },{rootMargin:'-50% 0px -50% 0px'});
  sections.forEach(s=>obs.observe(s));
})();

/* SMOOTH SCROLL OFFSET */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(!t) return; e.preventDefault();
    window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-72,behavior:'smooth'});
  });
});

loadProjects();