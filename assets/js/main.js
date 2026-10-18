/**
 * SAMIULLAH ZULFQAR - PORTFOLIO INTERACTION ENGINE
 * High-performance vanilla ES6 JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavbar();
  initTypewriter();
  initScrollAnimations();
  initStatsCounter();
  initThemeToggle();
  init3DTilt();
  initProjectFilters();
  initSkillFilters();
  initProjectModal();
  initResumeModal();
  initInteractiveTerminal();
  initContactForm();
  initCopyButtons();
  initSoundEffects();
  initBackToTop();
});

/* ==========================================================================
   1. Interactive Particle Canvas Background
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
  const maxDistance = 120;
  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse attraction / interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(99, 102, 241, ${this.baseAlpha})`
        : `rgba(79, 70, 229, ${this.baseAlpha * 0.8})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  createParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * (isDark ? 0.22 : 0.12);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDark
            ? `rgba(99, 102, 241, ${alpha})`
            : `rgba(79, 70, 229, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Navbar, Mobile Navigation & Scroll Progress
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / docHeight) * 100;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active Section Spy
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinkItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navLinkItems.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   3. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const target = document.querySelector('.typing-target');
  if (!target) return;

  const roles = [
    'Web Application Developer',
    'Mobile App Developer (Flutter & React Native)',
    'Full-Stack JavaScript & TypeScript Engineer',
    'UI/UX & Interactive Design Specialist',
    'Cloud Backend & REST/GraphQL Architect'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 2000; // Pause at full text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   5. Key Stats Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let started = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          statNumbers.forEach((counter) => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const stepTime = 25;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = isDecimal ? target.toFixed(1) : Math.floor(target);
                clearInterval(timer);
              } else {
                counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
              }
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   6. Theme Toggle (Dark & Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('samiullah_theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('samiullah_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode!`);
  });

  function updateThemeIcon(theme) {
    const icon = themeBtn.querySelector('.theme-icon');
    if (!icon) return;
    if (theme === 'light') {
      // Show Moon icon for switching to dark
      icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    } else {
      // Show Sun icon for switching to light
      icon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
    }
  }
}

/* ==========================================================================
   7. 3D Tilt Effect on Interactive Cards
   ========================================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

/* ==========================================================================
   8. Project Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   9. Skill Stack Filtering
   ========================================================================== */
function initSkillFilters() {
  const skillTabs = document.querySelectorAll('.skill-filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!skillTabs.length || !skillCards.length) return;

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-skill-category');

      skillCards.forEach((card) => {
        const itemCategory = card.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 30);
        } else {
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   10. Project Quick-View Modal
   ========================================================================== */
const projectDetails = {
  finpulse: {
    title: 'FinPulse - Fintech & Crypto Wallet App',
    category: 'Mobile & Web App • Flutter & Firebase',
    image: 'assets/images/projects/finpulse.svg',
    summary:
      'A next-generation digital wallet and decentralized crypto tracker offering real-time market data, biometric authentication, instant cross-chain swaps, and automated recurring transfers.',
    challenge:
      'Designing a seamless, ultra-responsive cross-platform mobile user interface that streams hundreds of live cryptocurrency WebSocket tickers simultaneously without freezing or dropping below 60fps.',
    solution:
      'Implemented clean Flutter BloC state management, isolates for heavy JSON deserialization, encrypted SQLite local cache for offline viewing, and Stripe API integration for instant fiat deposits.',
    features: [
      'Multi-chain wallet management (Bitcoin, Ethereum, Solana)',
      'Biometric authentication (FaceID & Fingerprint security)',
      'Real-time WebSocket price charts and alert notifications',
      'Stripe & Apple Pay fiat deposit checkout system',
      'Dark/Light sleek modern financial dashboard UI'
    ],
    tech: ['Flutter', 'Dart', 'Firebase', 'Web3 / Ethers.js', 'Stripe API', 'SQLite', 'Bloc Pattern'],
    demoUrl: '#',
    githubUrl: 'https://github.com/samiullahzulfqar980-cmd'
  },
  devflow: {
    title: 'DevFlow - Developer Community & SaaS Hub',
    category: 'Full-Stack Web App • Next.js 14 & Prisma',
    image: 'assets/images/projects/devflow.svg',
    summary:
      'An all-in-one developer workspace combining real-time code snippet sharing, interactive discussion boards, GitHub pull-request notifications, and collaborative coding rooms.',
    challenge:
      'Ensuring low-latency live multiplayer typing and state synchronization between multiple developers collaborating in the same code workspace.',
    solution:
      'Built with Next.js 14 App Router, WebSockets, Prisma ORM, and PostgreSQL. Used Redis Pub/Sub for sub-15ms message broadcasting and syntax highlighting powered by PrismJS.',
    features: [
      'Real-time collaborative code editor with syntax themes',
      'GitHub OAuth & webhook integration for commit feeds',
      'Search engine with full-text search across 10,000+ snippets',
      'Upvoting, commenting, and thread bookmarks system',
      'Automated dark/light theme based on system preference'
    ],
    tech: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Prisma ORM', 'PostgreSQL', 'WebSockets', 'NextAuth'],
    demoUrl: '#',
    githubUrl: 'https://github.com/samiullahzulfqar980-cmd'
  },
  foodexpress: {
    title: 'FoodExpress - Multi-Vendor Food Delivery App',
    category: 'Mobile App • React Native & Node.js',
    image: 'assets/images/projects/foodexpress.svg',
    summary:
      'On-demand food delivery mobile platform connecting customers, restaurants, and delivery drivers with real-time turn-by-turn GPS navigation and live order tracking.',
    challenge:
      'Optimizing battery usage and smooth live GPS marker updates for hundreds of riders moving in real-time across dynamic city maps.',
    solution:
      'Developed native map integration with Google Maps SDK in React Native, smoothed rider coordinates via Kalman filter interpolation, and integrated Socket.io on Node.js backend.',
    features: [
      'Live driver GPS tracking with real-time arrival estimates',
      'Filter restaurants by cuisine, dietary options, and ratings',
      'Cart management with custom ingredient add-ons',
      'Driver companion app with push notification dispatching',
      'Integrated in-app messaging and VoIP calling'
    ],
    tech: ['React Native', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Google Maps API', 'Redux Toolkit'],
    demoUrl: '#',
    githubUrl: 'https://github.com/samiullahzulfqar980-cmd'
  },
  aura3d: {
    title: 'Aura 3D - Interactive E-Commerce Experience',
    category: 'Web App • Three.js & React',
    image: 'assets/images/projects/aura3d.svg',
    summary:
      'Futuristic e-commerce storefront featuring interactive real-time 3D product customization, metallic PBR shaders, dynamic studio lighting, and smooth checkout flow.',
    challenge:
      'Maintaining 60fps rendering performance on lower-end mobile mobile browsers while loading intricate 3D GLTF models with high-resolution textures.',
    solution:
      'Created custom level-of-detail (LOD) Three.js geometry loaders, compressed textures using Draco and KTX2, and built a custom React Three Fiber pipeline.',
    features: [
      'Interactive 360-degree orbit controls and exploded views',
      'Real-time colorway, texture, and sole customization',
      'Dynamic physical lighting & environment reflection maps',
      'Optimized shopping cart with instant checkout preview',
      'Fully responsive touch gesture navigation on mobile'
    ],
    tech: ['React', 'Three.js', 'React Three Fiber', 'Tailwind CSS', 'GLTF/Draco', 'Stripe'],
    demoUrl: '#',
    githubUrl: 'https://github.com/samiullahzulfqar980-cmd'
  },
  healthsync: {
    title: 'HealthSync - Telehealth & AI Consultation',
    category: 'Cross-Platform • Flutter & FastAPI',
    image: 'assets/images/projects/healthsync.svg',
    summary:
      'HIPAA-compliant telemedicine application connecting patients with specialized physicians via encrypted HD video calls, instant chat, IoT vitals telemetry, and AI symptom analysis.',
    challenge:
      'Achieving zero-buffer encrypted video streaming and compliant storage of patient biometric signals received from smart watches.',
    solution:
      'Utilized WebRTC peer-to-peer protocols with TURN/STUN fallback, end-to-end AES-256 encryption, and Python FastAPI backend for high-throughput asynchronous medical telemetry processing.',
    features: [
      'HD WebRTC video consultations with live doctor notes',
      'Continuous Apple Watch & WearOS Bluetooth ECG telemetry sync',
      'AI triage assistant providing instant triage recommendations',
      'Electronic prescriptions automatically sent to local pharmacies',
      'Secure multi-factor biometric authentication'
    ],
    tech: ['Flutter', 'Python FastAPI', 'WebRTC', 'MongoDB', 'Docker', 'Bluetooth LE', 'HIPAA Ready'],
    demoUrl: '#',
    githubUrl: 'https://github.com/samiullahzulfqar980-cmd'
  },
  taskmaster: {
    title: 'TaskMaster Pro - AI Kanban & Team Workflow',
    category: 'Full-Stack Web App • React & Node.js',
    image: 'assets/images/projects/taskmaster.svg',
    summary:
      'Intelligent project management and productivity suite that uses AI to break large software epics into actionable subtasks, estimate sprint velocity, and automate team standup reports.',
    challenge:
      'Implementing fluid drag-and-drop Kanban reordering across complex hierarchical task trees with optimistic UI updates.',
    solution:
      'Leveraged dnd-kit for accessible touch & mouse dragging, optimistic Zustand store updates, and automated AI task breakdown using LLM API endpoints.',
    features: [
      'Drag-and-drop Kanban boards with custom swimlanes',
      'AI sprint planning & automated standup generation',
      'Real-time team presence indicators and mentions',
      'Time tracking with automated weekly timesheet export',
      'Role-based permissions (Admin, Member, Client Viewer)'
    ],
    tech: ['React', 'Node.js', 'Zustand', 'dnd-kit', 'Express', 'PostgreSQL', 'Tailwind CSS'],
    demoUrl: '#',
    githubUrl: 'https://github.com/samiullahzulfqar980-cmd'
  }
};

function initProjectModal() {
  const modalBackdrop = document.getElementById('project-modal');
  const closeBtn = document.getElementById('close-project-modal');
  const viewBtns = document.querySelectorAll('.quick-view-btn');

  if (!modalBackdrop || !closeBtn) return;

  viewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectDetails[projectId];
      if (!data) return;

      document.getElementById('modal-project-title').textContent = data.title;
      document.getElementById('modal-project-category').textContent = data.category;
      document.getElementById('modal-project-img').src = data.image;
      document.getElementById('modal-project-summary').textContent = data.summary;
      document.getElementById('modal-project-challenge').textContent = data.challenge;
      document.getElementById('modal-project-solution').textContent = data.solution;

      const featuresList = document.getElementById('modal-project-features');
      featuresList.innerHTML = data.features
        .map(
          (f) =>
            `<li style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem;color:var(--text-secondary);font-size:0.9rem;">
              <span style="color:#10b981;font-weight:bold;">✓</span> ${f}
            </li>`
        )
        .join('');

      const techContainer = document.getElementById('modal-project-tech');
      techContainer.innerHTML = data.tech
        .map((t) => `<span class="tech-pill">${t}</span>`)
        .join('');

      const githubBtn = document.getElementById('modal-github-link');
      if (githubBtn) githubBtn.href = data.githubUrl;

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   11. Resume / CV Viewer Modal
   ========================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const openBtns = document.querySelectorAll('.open-resume-btn');
  const closeBtn = document.getElementById('close-resume-modal');
  const printBtn = document.getElementById('print-resume-btn');

  if (!resumeModal || !closeBtn) return;

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeResume() {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeResume);
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   12. Interactive Developer CLI Terminal Easter Egg
   ========================================================================== */
function initInteractiveTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalChips = document.querySelectorAll('.terminal-chip');

  if (!terminalInput || !terminalOutput) return;

  const commands = {
    help: () => `
<div class="cmd-output">
Available commands:
  • <strong style="color:#6366f1">about</strong>     - Overview of Samiullah
  • <strong style="color:#6366f1">skills</strong>    - Key tech stack & frameworks
  • <strong style="color:#6366f1">projects</strong>  - Highlighted showcase projects
  • <strong style="color:#6366f1">experience</strong>- Career milestones & roles
  • <strong style="color:#6366f1">contact</strong>   - Direct email, phone & socials
  • <strong style="color:#6366f1">status</strong>    - Current availability
  • <strong style="color:#6366f1">clear</strong>     - Clear the terminal console
</div>`,

    about: () => `
<div class="cmd-output">
<strong>Samiullah Zulfqar</strong> - Web & Mobile App Developer
Based in Islamabad, Pakistan.
Passionate about engineering seamless, pixel-perfect, and ultra-fast digital experiences.
Specialized in both mobile apps (Flutter, React Native) and modern web applications (React, Next.js, Node.js).
</div>`,

    skills: () => `
<div class="cmd-output">
<strong>Tech Stack:</strong>
  • <strong>Mobile:</strong> Flutter, Dart, React Native, Expo, Android, iOS
  • <strong>Frontend:</strong> React.js, Next.js, TypeScript, JavaScript (ES6+), HTML5/CSS3, Tailwind CSS
  • <strong>Backend:</strong> Node.js, Express, Python FastAPI, RESTful APIs, GraphQL
  • <strong>Databases:</strong> PostgreSQL, MongoDB, Firebase, Supabase, Redis
  • <strong>Tools:</strong> Git, GitHub, Docker, Postman, Figma, Vercel
</div>`,

    projects: () => `
<div class="cmd-output">
<strong>Featured Projects:</strong>
  1. <strong>FinPulse:</strong> Crypto & Fintech Wallet (Flutter & Firebase)
  2. <strong>DevFlow:</strong> Developer Collaboration SaaS (Next.js 14 & Prisma)
  3. <strong>FoodExpress:</strong> Multi-Vendor Food Delivery App (React Native & Node)
  4. <strong>Aura 3D:</strong> Interactive 3D E-Commerce Store (React & Three.js)
  5. <strong>HealthSync:</strong> Telehealth & AI Diagnostics (Flutter & WebRTC)
  6. <strong>TaskMaster:</strong> AI Kanban Management (React & Node.js)
Type <em>cat project_name</em> or click cards below for live demos!
</div>`,

    experience: () => `
<div class="cmd-output">
<strong>Work Experience:</strong>
  • 2024 - Present: <strong>Lead Mobile & Web Developer</strong> @ TechNova Innovations
  • 2023 - 2024:    <strong>Full-Stack Developer</strong> @ Digital Craft Studio
  • 2022 - 2023:    <strong>Mobile Developer Intern</strong> @ AppForge
  • 2020 - 2024:    <strong>BS Computer Science / Software Engineering</strong>
</div>`,

    contact: () => `
<div class="cmd-output">
<strong>Contact Info:</strong>
  • <strong>Email:</strong> samiullahzulfqar980@gmail.com
  • <strong>GitHub:</strong> github.com/samiullahzulfqar980-cmd
  • <strong>Location:</strong> Islamabad, Pakistan
  • <strong>WhatsApp:</strong> Available for instant chat
</div>`,

    status: () => `
<div class="cmd-output" style="color:#10b981;">
● Status: AVAILABLE for freelance contracts and full-time roles worldwide!
</div>`,

    sudo: () => `
<div class="cmd-output" style="color:#f59e0b;">
Permission denied: User 'visitor' is not in the sudoers file. This incident will be reported to Samiullah 😉
</div>`,

    date: () => `
<div class="cmd-output">
${new Date().toUTCString()}
</div>`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      terminalOutput.innerHTML = `
        <p style="color:#64748b;">// Samiullah Dev CLI [Version 2.4.0]</p>
        <p style="color:#64748b;">// Type <strong style="color:#38bdf8;">help</strong> to see available commands.</p>
      `;
      terminalInput.value = '';
      return;
    }

    // Print command entered
    const userLine = document.createElement('p');
    userLine.innerHTML = `<span class="terminal-prompt">visitor@samiullah-dev:~$</span> ${escapeHTML(rawCmd)}`;
    terminalOutput.appendChild(userLine);

    // Print output
    const outputLine = document.createElement('div');
    if (commands[cmd]) {
      outputLine.innerHTML = commands[cmd]();
    } else {
      outputLine.innerHTML = `<div class="cmd-output" style="color:#f87171;">Command not found: "${escapeHTML(rawCmd)}". Type <strong style="color:#38bdf8;">help</strong> for list of commands.</div>`;
    }
    terminalOutput.appendChild(outputLine);

    // Scroll to bottom
    const terminalBody = terminalOutput.parentElement;
    terminalBody.scrollTop = terminalBody.scrollHeight;
    terminalInput.value = '';
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
    }
  });

  terminalChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* ==========================================================================
   13. Contact Form Submission Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const service = document.getElementById('contact-service')?.selectedOptions[0]?.text || '';
    const message = document.getElementById('contact-message').value.trim();
    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInterested in: ${service}\n\n${message}`);
    if (statusMsg) {
      statusMsg.className = 'form-status-msg success';
      statusMsg.textContent = 'Your email app is opening with your message. If it does not open, email samiullahzulfqar980@gmail.com directly.';
    }
    window.location.href = `mailto:samiullahzulfqar980@gmail.com?subject=${subject}&body=${body}`;
  });
}

/* ==========================================================================
   14. One-Click Copy Buttons
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span style="color:#10b981;">✓ Copied!</span>`;
        showToast(`Copied "${textToCopy}" to clipboard!`);

        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2200);
      });
    });
  });
}

/* ==========================================================================
   15. Toast Notifications System
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger show
  setTimeout(() => toast.classList.add('show'), 20);

  // Dismiss
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

/* ==========================================================================
   16. Optional Sound Effects (Web Audio API Synth)
   ========================================================================== */
function initSoundEffects() {
  const soundToggle = document.getElementById('sound-toggle-btn');
  let soundEnabled = false;
  let audioCtx = null;

  function playTone(freq, type, duration) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn(e);
    }
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggle.classList.toggle('active', soundEnabled);
      soundToggle.style.color = soundEnabled ? 'var(--accent-primary)' : 'var(--text-secondary)';
      showToast(soundEnabled ? 'Interactive audio feedback enabled 🔊' : 'Audio muted 🔇');
      if (soundEnabled) playTone(600, 'sine', 0.15);
    });
  }

  // Bind clicks on buttons and links
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, .btn, .nav-link, .filter-tab, .terminal-chip')) {
      playTone(480, 'sine', 0.08);
    }
  });
}

/* ==========================================================================
   17. Back to Top Floating Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
