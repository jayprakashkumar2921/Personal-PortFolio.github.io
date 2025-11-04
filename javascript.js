AOS.init();

AOS.init({
  // Settings that can be overridden on per-element basis, by data-aos-* attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 700, // values from 0 to 3000, with step 50ms
  easing: "ease", // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
});

//curser animation start
// Config
const DOTS = 20,
  DOT_SIZE = 18,
  trail = [];

// Create trail dots
for (let i = 0; i < DOTS; i++) {
  let dot = document.createElement("div");
  dot.className = "cursor-dot";
  dot.style.width = DOT_SIZE + "px";
  dot.style.height = DOT_SIZE + "px";
  dot.style.opacity = 0.85 - i * 0.05;
  dot.style.background = `rgba(${59 + i * 8},130,246,0.7)`;
  document.body.appendChild(dot);
  trail.push({ el: dot, x: 0, y: 0 });
}

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

// Mouse move listener
document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  trail[0].x = mouse.x;
  trail[0].y = mouse.y;
});

// Animate dots
function animateTrail() {
  for (let i = 1; i < trail.length; i++) {
    trail[i].x += (trail[i - 1].x - trail[i].x) * 0.3;
    trail[i].y += (trail[i - 1].y - trail[i].y) * 0.3;
  }
  for (let i = 0; i < trail.length; i++) {
    trail[i].el.style.transform = `translate(${trail[i].x - DOT_SIZE / 2}px, ${
      trail[i].y - DOT_SIZE / 2
    }px) scale(${1 - i * 0.04})`;
  }
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Hover grow effect
function growTrail(state) {
  trail.forEach((dot, i) => {
    dot.el.style.background = state
      ? `rgba(255,255,255,${1 - i * 0.05})`
      : `rgba(${59 + i * 8},130,246,0.7)`;
    dot.el.style.transform += state ? " scale(1.6)" : "";
  });
}

// Apply effect on hover elements
["a", "button", ".cta-btn", ".project", ".service-card"].forEach((sel) => {
  document.querySelectorAll(sel).forEach((el) => {
    el.addEventListener("mouseenter", () => growTrail(true));
    el.addEventListener("mouseleave", () => growTrail(false));
  });
});

// Hide when cursor leaves window
document.addEventListener("mouseleave", () => {
  trail.forEach((dot) => (dot.el.style.display = "none"));
});
document.addEventListener("mouseenter", () => {
  trail.forEach((dot) => (dot.el.style.display = "block"));
});
//curser animation ends

/* =============================
   Portfolio Chatbot — Single file
   Features: resume preview, project carousel, skills chart, voice in/out,
             theme toggle, emoji float, games, confetti, avatar expressions,
             typing animations variations (dots / typewriter)
   ============================= */

(function () {
  /* --------------------
     Config & placeholder data
     -------------------- */
  const CHAT = {
    userName: "Guest",
    ownerName: "Jayprakash Kumar",
    resume: {
      title: "Jayprakash Kumar — Resume",
      summary:
        "Passionate Data Analyst & Front-end Developer. Skilled in Python, R, MySQL, Excel, Power BI, Tableau, HTML, CSS, JavaScript and React.js.",
      link: "#", // replace with real PDF link or server endpoint
    },
    projects: [
      {
        title: "Face Detection",
        desc: "Face detection web app using JS + API.",
        url: "https://face-detection-jp.netlify.app/",
      },
      {
        title: "E-Commerce Demo",
        desc: "React shop demo (UI + mock backend).",
        url: "#",
      },
      {
        title: "Interactive Dashboard",
        desc: "Power BI interactive sales dashboard.",
        url: "#",
      },
    ],
    skills: [
      { name: "Python", value: 90 },
      { name: "MySQL", value: 85 },
      { name: "Power BI", value: 80 },
      { name: "Tableau", value: 78 },
      { name: "Excel", value: 92 },
      { name: "React.js", value: 75 },
    ],
    contact: {
      email: "jayprakash@example.com",
      linkedin: "https://www.linkedin.com/in/jayprakash-gupta-b39577251",
      github: "https://github.com/jayprakashkumar2921",
      whatsapp: "https://wa.me/917484029713",
    },
  };

  /* --------------------
     Elements
     -------------------- */
  const openBtn = document.getElementById("openChatBtn");
  const chatWindow = document.getElementById("chatWindow");
  const closeBtn = document.getElementById("closeBtn");
  const clearBtn = document.getElementById("clearBtn");
  const chatBody = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const quickReplies = document.getElementById("quickReplies");
  const micBtn = document.getElementById("micBtn");
  const themeToggle = document.getElementById("themeToggle");
  const avatarFace = document.getElementById("avatarFace");
  const confettiCanvas = document.getElementById("confettiCanvas");

  let isDark = true; // theme state
  let useTypewriter = false; // toggle typing style occasionally

  /* --------------------
     Open/Close, accessibility
     -------------------- */
  openBtn.addEventListener("click", () => openChat());
  closeBtn.addEventListener("click", () => closeChat());
  clearBtn.addEventListener("click", () => {
    chatBody.innerHTML = "";
    addBotMessage("Chat cleared. Ask me anything!");
    chatInput.focus();
  });

  function openChat() {
    document.getElementById("chatbot-root").classList.add("active");
    chatWindow.style.display = "flex";
    chatWindow.classList.add("chat-open");
    chatWindow.setAttribute("aria-hidden", "false");
    openBtn.style.display = "none";
    chatInput.focus();
    if (!chatBody.children.length) {
      addBotMessage(
        `Hey! 👋 I'm ${CHAT.ownerName}'s assistant. Ask about projects, skills, resume or say "Play a game".`
      );
    }
  }
  function closeChat() {
    chatWindow.style.display = "none";
    chatWindow.setAttribute("aria-hidden", "true");
    openBtn.style.display = "grid";
    openBtn.focus();
  }

  /* --------------------
     Utility: add message (bot/user)
     supports typing variations
     -------------------- */
  function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "msg user";
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addBotMessage(text, opts = {}) {
    // Variation: sometimes show typing dots then text (simulate typing)
    const method = useTypewriter && Math.random() > 0.3 ? "typewriter" : "dots";
    useTypewriter = !useTypewriter; // alternate
    if (method === "dots") {
      showTypingDots();
      setTimeout(() => {
        removeTypingDots();
        const div = document.createElement("div");
        div.className = "msg bot";
        div.textContent = text;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
        maybeAvatar("smile");
      }, 700 + Math.random() * 800);
    } else {
      // typewriter style
      const div = document.createElement("div");
      div.className = "msg bot";
      const span = document.createElement("div");
      span.className = "typewriter";
      span.textContent = text;
      div.appendChild(span);
      chatBody.appendChild(div);
      chatBody.scrollTop = chatBody.scrollHeight;
      maybeAvatar("thinking");
    }
    // speak if voice enabled
    if (opts.speak) speakText(text);
  }

  function showTypingDots() {
    if (document.querySelector(".typing")) return;
    const t = document.createElement("div");
    t.className = "typing";
    t.innerHTML =
      '<div class="typing-dots"><span></span><span></span><span></span></div>';
    t.classList.add("msg", "bot");
    t.dataset.typing = "1";
    chatBody.appendChild(t);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  function removeTypingDots() {
    const t = document.querySelector('[data-typing="1"]');
    if (t) t.remove();
  }

  /* --------------------
     Avatar micro-expressions
     -------------------- */
  function maybeAvatar(expression) {
    if (expression === "smile") {
      avatarFace.textContent = "😊";
      avatarFace.style.transform = "scale(1.08)";
      setTimeout(() => {
        avatarFace.textContent = "🙂";
        avatarFace.style.transform = "";
      }, 900);
    }
    if (expression === "thinking") {
      avatarFace.textContent = "🤔";
      setTimeout(() => {
        avatarFace.textContent = "🙂";
      }, 1200);
    }
    if (expression === "wink") {
      avatarFace.textContent = "😉";
      setTimeout(() => {
        avatarFace.textContent = "🙂";
      }, 1200);
    }
  }

  /* --------------------
     Input handling
     -------------------- */
  sendBtn.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (!text) return;
    chatSend(text);
  });
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendBtn.click();
    }
  });

  function chatSend(text) {
    addUserMessage(text);
    chatInput.value = "";
    chatInput.focus();
    handleCommand(text);
  }

  /* --------------------
     Quick replies
     -------------------- */
  quickReplies.addEventListener("click", (e) => {
    const btn = e.target.closest(".quick-btn");
    if (!btn) return;
    chatSend(btn.dataset.msg || btn.innerText);
  });

  /* --------------------
     Keyword-based handler (can be replaced with OpenAI integration)
     -------------------- */
  function handleCommand(text) {
    const t = text.toLowerCase();
    // Resume
    if (
      t.includes("resume") ||
      t.includes("cv") ||
      t.includes("show resume") ||
      t.includes("download resume")
    ) {
      openResumePreview();
      return;
    }
    // Projects
    if (
      t.includes("project") ||
      t.includes("work") ||
      t.includes("show projects")
    ) {
      showProjectsCarousel();
      return;
    }
    // Skills
    if (
      t.includes("skill") ||
      t.includes("skills") ||
      t.includes("what are your skills")
    ) {
      showSkillsChart();
      return;
    }
    // Contact
    if (
      t.includes("contact") ||
      t.includes("email") ||
      t.includes("linkedin") ||
      t.includes("github")
    ) {
      showContactOptions();
      return;
    }
    // Theme
    if (
      t.includes("dark mode") ||
      t.includes("switch to dark") ||
      t.includes("light mode") ||
      t.includes("theme")
    ) {
      toggleTheme();
      addBotMessage(
        'Theme updated! Try "Switch to Light Mode" or "Switch to Dark Mode".'
      );
      return;
    }
    // Games
    if (
      t.includes("play a game") ||
      t.includes("tic tac toe") ||
      t.includes("rock paper")
    ) {
      startGame();
      return;
    }
    // Joke
    if (t.includes("joke")) {
      const joke =
        "Why did the developer go broke? Because he used up all his cache. 😅";
      addBotMessage(joke);
      floatEmoji("🎉");
      return;
    }
    // Career guide
    if (
      t.includes("how can i become") ||
      t.includes("become a data analyst") ||
      t.includes("career")
    ) {
      showCareerGuide();
      return;
    }
    // Compliment -> emoji
    if (
      t.includes("nice work") ||
      t.includes("great") ||
      t.includes("awesome")
    ) {
      addBotMessage("Thanks! 🙏 Glad you liked it.");
      floatEmoji("🎉", 5);
      return;
    }

    // fallback generic portfolio answers (structured)
    if (
      t.includes("about") ||
      t.includes("tell me about yourself") ||
      t.includes("who are you")
    ) {
      addBotMessage(
        `${CHAT.ownerName} is a Data Analyst and Front-end Developer. ${CHAT.resume.summary}`
      );
      return;
    }

    // if nothing matched, give helpful options
    addBotMessage(
      "I can show Resume, Projects, Skills, Contact, Play a Game, or give a Career Roadmap — try typing one of these."
    );
  }

  /* --------------------
     Resume Preview (mini card + download)
     -------------------- */
  function openResumePreview() {
    const card = document.createElement("div");
    card.className = "mini-card";
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
        <div>
          <strong>${CHAT.resume.title}</strong>
          <div style="font-size:13px;margin-top:6px;color:#374151">${CHAT.resume.summary}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="small-btn" id="viewResume">View Full</button>
          <button class="small-btn" id="downloadResume">Download</button>
        </div>
      </div>
    `;
    chatBody.appendChild(card);
    chatBody.scrollTop = chatBody.scrollHeight;
    maybeAvatar("wink");

    // attach handlers
    document.getElementById("downloadResume").addEventListener("click", () => {
      addBotMessage("Downloading resume...", { speak: true });
      triggerConfetti();
      // quick simulate download: if resume.link is set to file, open it
      if (CHAT.resume.link && CHAT.resume.link !== "#") {
        window.open(CHAT.resume.link, "_blank");
      } else {
        // create a simple text file for demo
        const blob = new Blob([CHAT.resume.summary], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "Resume-Jayprakash.txt";
        a.click();
      }
    });

    document.getElementById("viewResume").addEventListener("click", () => {
      addBotMessage("Opening full resume preview...");
      // show structured details
      const full = document.createElement("div");
      full.className = "mini-card";
      full.style.marginTop = "8px";
      full.innerHTML = `<h4>Professional Summary</h4>
        <p style="color:#374151">${CHAT.resume.summary}</p>
        <p style="font-size:13px;color:#374151"><b>Education:</b> B.Tech in Computer Science (2025) • MSc (in progress)</p>
        <p style="font-size:13px;color:#374151"><b>Contact:</b> ${CHAT.contact.email}</p>`;
      chatBody.appendChild(full);
      chatBody.scrollTop = chatBody.scrollHeight;
    });
  }

  /* --------------------
     Project carousel
     -------------------- */
  function showProjectsCarousel() {
    const container = document.createElement("div");
    container.className = "mini-card";
    container.innerHTML = `<div style="display:flex;flex-direction:column">
      <strong>Projects</strong>
      <div class="project-carousel" id="carouselList" style="margin-top:10px"></div>
      <div class="carousel-controls">
        <button class="small-btn" id="prevSlide">⬅ Previous</button>
        <button class="small-btn" id="nextSlide">Next ➡</button>
        <a class="small-btn" href="${CHAT.contact.github}" target="_blank" style="margin-left:auto">View on GitHub</a>
      </div>
    </div>`;
    chatBody.appendChild(container);
    const list = container.querySelector("#carouselList");
    CHAT.projects.forEach((p, idx) => {
      const slide = document.createElement("div");
      slide.className = "project-slide";
      slide.innerHTML = `<strong>${p.title}</strong><div style="font-size:13px;color:#334155;margin-top:6px">${p.desc}</div>
        <div style="margin-top:8px;display:flex;gap:8px">
          <a class="small-btn" href="${p.url}" target="_blank">Open</a>
          <button class="small-btn" data-idx="${idx}" onclick="(event)=>{}">Details</button>
        </div>`;
      list.appendChild(slide);
    });
    // simple scroll navigation
    const prev = container.querySelector("#prevSlide");
    const next = container.querySelector("#nextSlide");
    prev.addEventListener("click", () => {
      list.scrollBy({ left: -280, behavior: "smooth" });
    });
    next.addEventListener("click", () => {
      list.scrollBy({ left: 280, behavior: "smooth" });
    });
    maybeAvatar("smile");
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  /* --------------------
     Skills Chart (Chart.js)
     -------------------- */
  function showSkillsChart() {
    const wrapper = document.createElement("div");
    wrapper.className = "mini-card";
    wrapper.innerHTML = `<strong>Skills Overview</strong><canvas id="skillsChart" style="margin-top:10px;max-width:100%"></canvas>`;
    chatBody.appendChild(wrapper);
    chatBody.scrollTop = chatBody.scrollHeight;
    // render chart
    setTimeout(() => {
      const ctx = document.getElementById("skillsChart").getContext("2d");
      const labels = CHAT.skills.map((s) => s.name);
      const data = CHAT.skills.map((s) => s.value);
      new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Skill proficiency",
              data,
              backgroundColor: labels.map(
                (l, i) => `rgba(${40 + i * 20},120,240,0.85)`
              ),
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, max: 100 } },
        },
      });
    }, 60);
    maybeAvatar("smile");
  }

  /* --------------------
     Contact options (email, linkedin, whatsapp)
     -------------------- */
  function showContactOptions() {
    const node = document.createElement("div");
    node.className = "mini-card";
    node.innerHTML = `<strong>Contact</strong>
      <div style="margin-top:8px;font-size:13px;color:#374151">Email: ${CHAT.contact.email}</div>
      <div style="margin-top:8px;display:flex;gap:8px">
        <a class="small-btn" href="mailto:${CHAT.contact.email}">Email</a>
        <a class="small-btn" href="${CHAT.contact.linkedin}" target="_blank">LinkedIn</a>
        <a class="small-btn" href="${CHAT.contact.github}" target="_blank">GitHub</a>
        <a class="small-btn" href="${CHAT.contact.whatsapp}" target="_blank">WhatsApp</a>
      </div>`;
    chatBody.appendChild(node);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  /* --------------------
     Theme toggle (affects body & chat window)
     -------------------- */
  themeToggle.addEventListener("click", toggleTheme);
  function toggleTheme() {
    isDark = !isDark;
    if (!isDark) {
      document.body.style.background =
        "linear-gradient(180deg,#f8fafc,#e6f2ff)";
      document.body.style.color = "#0b1220";
      // adjust chat window colors (keep simple)
      document
        .querySelectorAll(".chat-window, .mini-card")
        .forEach(
          (el) =>
            (el.style.background = "linear-gradient(180deg,#ffffff,#f8fafc)")
        );
    } else {
      document.body.style.background =
        "linear-gradient(180deg,#071028,#07182b)";
      document.body.style.color = "#eef2ff";
      document
        .querySelectorAll(".chat-window, .mini-card")
        .forEach(
          (el) =>
            (el.style.background =
              "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))")
        );
    }
    addBotMessage(`Theme switched to ${isDark ? "Dark" : "Light"} mode.`);
  }

  /* --------------------
     Emoji float
     -------------------- */
  function floatEmoji(emoji, count = 3) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "emoji-float";
      el.textContent = emoji;
      el.style.left = window.innerWidth - 120 - Math.random() * 260 + "px";
      el.style.bottom = 60 + Math.random() * 40 + "px";
      el.style.fontSize = 18 + Math.random() * 18 + "px";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1700 + Math.random() * 600);
    }
  }

  /* --------------------
     Confetti (simple canvas confetti)
     -------------------- */
  function triggerConfetti() {
    const W = (confettiCanvas.width = window.innerWidth);
    const H = (confettiCanvas.height = window.innerHeight);
    const ctx = confettiCanvas.getContext("2d");
    const pieces = [];
    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * W,
        y: Math.random() * H - 100,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 6 + 2,
        r: Math.random() * 6 + 4,
        color: `hsl(${Math.random() * 360},80%,60%)`,
      });
    }
    let t = 0;
    const anim = setInterval(() => {
      ctx.clearRect(0, 0, W, H);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.r, p.r * 0.6);
      });
      t++;
      if (t > 120) {
        clearInterval(anim);
        ctx.clearRect(0, 0, W, H);
      }
    }, 16);
  }

  /* --------------------
     Games (tic-tac-toe quick demo)
     -------------------- */
  function startGame() {
    const node = document.createElement("div");
    node.className = "mini-card";
    node.innerHTML = `<strong>Tic-Tac-Toe (You vs Bot)</strong>
      <div id="t3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px"></div>
      <div style="margin-top:8px;display:flex;gap:8px">
        <button class="small-btn" id="restart">Restart</button>
      </div>`;
    chatBody.appendChild(node);
    const t3 = node.querySelector("#t3");
    let board = Array(9).fill(null);
    let myTurn = true;
    for (let i = 0; i < 9; i++) {
      const c = document.createElement("button");
      c.className = "small-btn";
      c.style.height = "64px";
      c.dataset.idx = i;
      c.textContent = "";
      t3.appendChild(c);
      c.addEventListener("click", () => {
        if (!myTurn || c.textContent) return;
        c.textContent = "X";
        board[i] = "X";
        myTurn = false;
        if (checkWin(board, "X")) {
          addBotMessage("You win! 🎉");
          floatEmoji("🎉", 6);
          return;
        }
        botMove();
      });
    }
    node.querySelector("#restart").addEventListener("click", () => {
      node.remove();
      addBotMessage("Game ended. Want to play again?");
    });
    function botMove() {
      // simple random AI
      setTimeout(() => {
        const empty = board.map((v, i) => (v ? null : i)).filter(Boolean);
        if (!empty.length) {
          addBotMessage("It's a draw!");
          return;
        }
        const idx = empty[Math.floor(Math.random() * empty.length)];
        board[idx] = "O";
        t3.querySelector(`[data-idx="${idx}"]`).textContent = "O";
        if (checkWin(board, "O")) {
          addBotMessage("Bot wins! 😅");
        } else {
          myTurn = true;
        }
      }, 600);
    }
    function checkWin(b, p) {
      const wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      return wins.some((line) => line.every((i) => b[i] === p));
    }
  }

  /* --------------------
     Career guide (structured)
     -------------------- */
  function showCareerGuide() {
    addBotMessage("Here's a step-by-step roadmap to become a Data Analyst:");
    const steps = [
      "1) Learn fundamentals: Statistics, Excel, SQL.",
      "2) Learn Python/R and data manipulation libraries (pandas).",
      "3) Practice data cleaning and EDA on real datasets.",
      "4) Learn visualization: Power BI, Tableau, Matplotlib/Seaborn.",
      "5) Build projects (dashboards, reports) and publish on GitHub/portfolio.",
      "6) Learn basics of ML, and prepare for interviews with case studies.",
    ];
    steps.forEach((s) =>
      setTimeout(() => addBotMessage(s), 500 + Math.random() * 600)
    );
  }

  /* --------------------
     Voice (speech recognition + synthesis)
     -------------------- */
  let recognition = null;
  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (ev) => {
      const speech = ev.results[0][0].transcript;
      chatInput.value = speech;
      chatSend(speech);
    };
    recognition.onerror = (e) => {
      addBotMessage("Voice input failed. Type your question instead.");
    };
  } else {
    micBtn.style.opacity = 0.6;
    micBtn.title = "Voice input not supported on this browser";
  }

  micBtn.addEventListener("click", () => {
    if (!recognition) {
      addBotMessage("Voice not supported here.");
      return;
    }
    try {
      recognition.start();
      addBotMessage("Listening... Speak now.");
      maybeAvatar("thinking");
    } catch (err) {
      addBotMessage("Voice could not start.");
    }
  });

  function speakText(text) {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 1;
    u.pitch = 1;
    speechSynthesis.speak(u);
  }

  /* --------------------
     Simple keyboard shortcuts
     -------------------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeChat();
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      openChat();
      setTimeout(() => chatInput.focus(), 200);
    }
  });

  /* --------------------
     Window resize for confetti canvas
     -------------------- */
  window.addEventListener("resize", () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  });

  /* ---------- initial small tip ---------- */
  setTimeout(() => {
    // subtle unobtrusive prompt bounce
    openBtn.classList.remove("bounce");
    setTimeout(() => openBtn.classList.add("bounce"), 900);
  }, 1500);

  // expose some functions (for slides/buttons created dynamically)
  window.triggerConfetti = triggerConfetti;
  window.floatEmoji = floatEmoji;
  window.openResumePreview = openResumePreview;
  window.showProjectsCarousel = showProjectsCarousel;
})();

// --------------------------------- loader start here
document.addEventListener("DOMContentLoaded", function () {
  particlesJS("particles-js", {
    particles: {
      number: { value: 120, density: { enable: true, value_area: 800 } },
      color: { value: "#9f86c0" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 2, random: true },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 0.5, // Slowed down
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: false }, onclick: { enable: false } },
    },
    retina_detect: true,
  });

  const loader = document.getElementById("loader");
  const mouseFollower = document.getElementById("mouse-follower");

  document.addEventListener("mousemove", (e) => {
    mouseFollower.style.left = `${e.clientX}px`;
    mouseFollower.style.top = `${e.clientY}px`;
    mouseFollower.style.opacity = 1;
  });

  // Hide loader after a certain time
  setTimeout(() => {
    loader.style.opacity = 0;
    setTimeout(() => {
      loader.style.display = "none";
    }, 5000);
  }, 4000);
});
// --------------------------------- loader ends here
