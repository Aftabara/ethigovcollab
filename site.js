const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const EMAIL = (window.SITE && SITE.email) || "ethigov.collab@gmail.com";
const todayStr = new Date().toISOString().slice(0, 10);
const fmt = d => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const mail = (subject, body) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
const validEmail = v => /^\S+@\S+\.\S+$/.test(v);

// Footer year and mobile menu
const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
const menuBtn = $("#menuBtn"), menu = $("#menu");
menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("hidden") === false;
  menuBtn.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("flex", open);
});
menu.addEventListener("click", e => { if (e.target.tagName === "A" && window.innerWidth < 1024) { menu.classList.add("hidden"); menu.classList.remove("flex"); menuBtn.setAttribute("aria-expanded", "false"); } });

const page = document.body.dataset.page;

// ---------- Home ----------
if (page === "home") {
  const themes = [
    { name: "Ethics of generative AI", desc: "Ethical implications, trust and accountability in AI systems.",
      qs: ["What are the ethical implications of generative AI for organisations and society?", "What builds or erodes trust in AI-generated outputs?", "Who is accountable when AI systems cause harm?"] },
    { name: "Human resource management", desc: "AI-driven HR, green HRM and organisational performance.",
      qs: ["How do employees perceive AI-driven HR systems?", "How do green HRM practices influence environmental performance?", "What oversight do AI-enabled HR decisions need?"] },
    { name: "Higher education & sustainability", desc: "AI-enabled learning and sustainable development goals.",
      qs: ["How can AI-enabled learning support sustainable development?", "How do institutions balance innovation and equity?", "What does human-AI collaboration mean for teaching and learning?"] },
    { name: "Healthcare, data & e-commerce", desc: "Data visualization, ethics in healthcare and consumer perception.",
      qs: ["What ethical challenges arise from AI and data in healthcare?", "How can data visualization improve patient care and process design?", "How do consumers perceive AI-powered e-commerce?"] }
  ];
  const tabs = $("#themeTabs"), panel = $("#themePanel");
  const show = i => {
    const t = themes[i];
    tabs.querySelectorAll(".tab").forEach((b, j) => b.setAttribute("aria-selected", String(i === j)));
    panel.innerHTML = `<div class="md:col-span-2"><h3 class="font-serif text-2xl font-bold text-teal-900">${esc(t.name)}</h3><p class="mt-3 text-slate-600">${esc(t.desc)}</p><a href="join.html" class="inline-block mt-5 text-teal-700 font-semibold hover:underline">Collaborate on this theme &rarr;</a></div>
    <div class="md:col-span-3"><p class="text-xs font-semibold uppercase tracking-wider text-gold">Guiding questions</p><ul class="mt-3 space-y-3">${t.qs.map(q => `<li class="flex gap-3"><span class="mt-2 w-2 h-2 rounded-full bg-teal-600 shrink-0"></span><span>${esc(q)}</span></li>`).join("")}</ul></div>`;
  };
  themes.forEach((t, i) => { const b = document.createElement("button"); b.className = "tab"; b.setAttribute("role", "tab"); b.textContent = t.name; b.addEventListener("click", () => show(i)); tabs.appendChild(b); });
  show(0);

  const faqs = [
    ["Who can join?", "Researchers, students, practitioners and partner institutions with an interest in ethics, governance and AI."],
    ["Is there a fee?", "No. Collaboration is voluntary, and we favour publication venues that do not charge article processing fees."],
    ["How is authorship decided?", "Roles and the order of authorship are agreed in the project protocol at the start and reviewed if contributions change."],
    ["Can I join for a single project?", "Yes. You can contribute to one study, one Delphi round, or one working group without a longer commitment."],
    ["How is my information used?", "The forms only prepare an email draft. Nothing is stored on this website."]
  ];
  $("#faqList").innerHTML = faqs.map(([q, a]) => `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`).join("");

  const latest = [...NEWS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);
  $("#latest").innerHTML = latest.map(newsCard).join("") || `<p class="text-slate-500">No news yet.</p>`;
}

function newsCard(n) {
  const up = n.type === "Event" && n.date >= todayStr;
  return `<article class="card"><div class="flex flex-wrap items-center gap-2"><span class="tag">${esc(n.type)}</span>${up ? '<span class="tag tag--up">Upcoming</span>' : ""}<time class="text-sm text-slate-500" datetime="${esc(n.date)}">${fmt(n.date)}</time></div>
  <h3 class="card-title">${esc(n.title)}</h3><p class="card-text">${esc(n.text)}</p>${n.url ? `<a class="inline-block mt-3 text-teal-700 font-semibold text-sm hover:underline" href="${esc(n.url)}"${/^https?:/.test(n.url) ? ' target="_blank" rel="noopener noreferrer"' : ""}>Read more &rarr;</a>` : ""}</article>`;
}

// ---------- Team ----------
if (page === "team") {
  const labels = { founder: "Founder", member: "Team members", advisor: "Advisors", student: "Students", committee: "Scientific committee" };
  const order = ["founder", "member", "advisor", "committee", "student"];
  const groups = [...new Set([...order, ...TEAM.map(t => t.group)])].filter(g => TEAM.some(t => t.group === g));
  $("#team").innerHTML = groups.map(g => `<section class="mb-12"><h2 class="font-serif text-2xl font-bold text-teal-900">${esc(labels[g] || g)}</h2><div class="mt-6 grid gap-6 md:grid-cols-2">${TEAM.filter(t => t.group === g).map(t => {
    return `<article class="card team-card"><div><h3 class="font-semibold text-lg text-teal-900">${esc(t.name)}</h3><p class="text-sm text-gold font-medium">${esc(t.role)}${t.org ? " &middot; " + esc(t.org) : ""}</p>${t.tagline ? `<p class="mt-1 text-sm italic text-slate-500">${esc(t.tagline)}</p>` : ""}
    <p class="mt-3 text-sm text-slate-600">${esc(t.bio)}</p>
    <ul class="mt-3 flex flex-wrap gap-2">${(t.interests || []).map(i => `<li class="tag tag--soft">${esc(i)}</li>`).join("")}</ul>
    <p class="mt-3 flex flex-wrap gap-4 text-sm">${(t.links || []).map(l => `<a class="text-teal-700 font-semibold hover:underline" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} &nearr;</a>`).join("")}</p></div></article>`;
  }).join("")}</div></section>`).join("");
}

// ---------- Calls ----------
if (page === "calls") {
  let theme = "all";
  const f = $("#filters");
  f.innerHTML = `<button class="chip chip--on" data-theme="all">All themes</button>` + Object.entries(THEMES).map(([k, v]) => `<button class="chip" data-theme="${k}">${esc(v)}</button>`).join("");
  const draw = () => {
    const list = CFPS.filter(c => theme === "all" || c.themes.includes(theme)).sort((a, b) => a.deadline.localeCompare(b.deadline));
    $("#count").textContent = `${list.length} call${list.length === 1 ? "" : "s"}`;
    $("#list").innerHTML = list.map(c => {
      const closed = c.deadline < todayStr;
      return `<article class="card ${closed ? "opacity-70" : ""}"><div class="flex flex-wrap items-center gap-2"><span class="tag">${esc(c.tier)}</span>${closed ? '<span class="tag tag--closed">Closed</span>' : ""}</div>
      <h3 class="card-title">${esc(c.title)}</h3><p class="text-sm font-medium text-gold">${esc(c.journal)}</p>
      ${c.note ? `<p class="card-text">${esc(c.note)}</p>` : ""}
      <p class="mt-3 text-sm"><strong>Deadline:</strong> <time datetime="${esc(c.deadline)}">${fmt(c.deadline)}</time></p>
      <ul class="mt-3 flex flex-wrap gap-2">${c.themes.map(t => `<li class="tag tag--soft">${esc(THEMES[t] || t)}</li>`).join("")}</ul>
      <a class="inline-block mt-4 text-teal-700 font-semibold text-sm hover:underline" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">View official call &nearr;</a></article>`;
    }).join("");
  };
  f.addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; theme = b.dataset.theme; f.querySelectorAll(".chip").forEach(c => c.classList.toggle("chip--on", c === b)); draw(); });
  draw();
}

// ---------- News ----------
if (page === "news") {
  let type = "all";
  const draw = () => {
    const list = NEWS.filter(n => type === "all" || n.type === type).sort((a, b) => b.date.localeCompare(a.date));
    $("#newslist").innerHTML = list.map(newsCard).join("") || `<p class="text-slate-500">Nothing here yet. Check back soon.</p>`;
  };
  $("#nfilters").addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; type = b.dataset.type; document.querySelectorAll("#nfilters .chip").forEach(c => c.classList.toggle("chip--on", c === b)); draw(); });
  draw();
}

// ---------- Resources ----------
if (page === "resources") {
  $("#res").innerHTML = RESOURCES.map(g => `<section class="mb-14"><h2 class="font-serif text-2xl font-bold text-teal-900">${esc(g.title)}</h2><p class="mt-2 text-slate-600">${esc(g.desc)}</p>
  <ul class="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">${g.items.map(i => { const ext = /^https?:/.test(i.url); return `<li class="fw"><h3 class="font-semibold text-teal-900">${esc(i.title)}</h3><p class="mt-2 text-sm text-slate-600">${esc(i.desc)}</p><a href="${esc(i.url)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>${ext ? "Visit site &nearr;" : "Open &rarr;"}</a></li>`; }).join("")}</ul></section>`).join("");
}

// ---------- Join ----------
if (page === "join") {
  $("#mailshow").textContent = EMAIL;
  if (SITE.joinFormUrl) { $("#onlineform").hidden = false; $("#onlinebtn").href = SITE.joinFormUrl; }
  if (SITE.newsletterUrl) { $("#onlinenews").hidden = false; $("#newsbtn").href = SITE.newsletterUrl; }
  $("#joinform").addEventListener("submit", e => {
    e.preventDefault();
    const msg = $("#formMsg"), name = $("#f-name").value.trim(), email = $("#f-email").value.trim();
    if (!name || !validEmail(email)) { msg.textContent = "Please enter your name and a valid email address."; msg.classList.remove("hidden"); return; }
    msg.classList.add("hidden");
    const interests = [...document.querySelectorAll("#interestChecks input:checked")].map(x => x.value).join("; ") || "Not specified";
    const body = `Name: ${name}\nEmail: ${email}\nInstitution: ${$("#f-org").value}\nJoining as: ${$("#f-role").value}\nInterests: ${interests}\n\nHow I would like to collaborate:\n${$("#f-msg").value}`;
    window.location.href = mail("Join Ethigov: " + name, body);
  });
  $("#newsform").addEventListener("submit", e => {
    e.preventDefault();
    const v = $("#n-email").value.trim(), msg = $("#newsMsg");
    if (!validEmail(v)) { msg.textContent = "Please enter a valid email address."; msg.classList.remove("hidden"); return; }
    msg.classList.add("hidden");
    window.location.href = mail("Subscribe to Ethigov updates", `Please add me to the updates list.\n\nEmail: ${v}`);
  });
}
