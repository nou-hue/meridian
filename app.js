const SOLS = {
  40: {
    lede: "Blackout starts in six hours. The EVA call can still wait.",
    decision: {
      title: "Hold the greenhouse EVA until the comms window reopens.",
      why: "Two crew are under the sleep plan, and the blackout covers the only real-time consult. The plants can take one sol. A fall in the tunnel cannot.",
      cites: "E2 · E4 · T1",
    },
    delay: { value: "6 min", note: "Simulated one-way. Next live window 18:40 habitat." },
    sleep: { value: "2 short", note: "Ibrahim 4.5 h, Pell 5.0 h. Plan is 7. Not a score." },
    conflict: { value: "1 open", note: "Tool-cage blame from sol 39 is still unnamed." },
    known: [
      ["E1", "Power budget is inside the winter plan."],
      ["E2", "Ibrahim and Pell both logged under five hours."],
      ["E3", "Greenhouse CO₂ is stable. No crop deadline today."],
    ],
    open: [
      ["T1", "Whether the tool-cage dispute is about the tool, or about who assigns maintenance."],
    ],
  },
  41: {
    lede: "The EVA was held. Sleep did not recover. The dispute has a name.",
    decision: {
      title: "Split tomorrow’s maintenance so Ibrahim is not on the night round.",
      why: "Holding the EVA removed the acute risk. Leaving the same pair on the night round keeps the sleep debt and the dispute in the same room.",
      cites: "E2 · T1",
    },
    delay: { value: "6 min", note: "Simulated one-way. Window open until 21:10 habitat." },
    sleep: { value: "2 short", note: "Ibrahim 5.1 h, Pell 5.4 h. Still under plan." },
    conflict: { value: "1 open", note: "Pell says assignments ignore the rota. Ibrahim says the rota ignores the leak." },
    known: [
      ["E2", "Sleep is up, not restored."],
      ["E4", "No medical consult was required overnight."],
      ["E5", "The tool cage was restowed. The argument was not."],
    ],
    open: [
      ["T1", "Rota fairness versus whoever is nearest the leak."],
    ],
  },
  42: {
    lede: "Before the next contact. One decision, cited from the log.",
    decision: {
      title: "Do not run the exterior walk during the blackout.",
      why: "Comms delay is simulated at six minutes, then a forty-minute blackout. Pell is on a second short night. The walk can move one sol. The consult cannot happen inside the blackout.",
      cites: "E2 · E6 · T1",
    },
    delay: { value: "6 + 40", note: "Six minutes one-way, then blackout 16:20–17:00 habitat." },
    sleep: { value: "1 short", note: "Pell 4.8 h. Others at plan. Reported hours, not a score." },
    conflict: { value: "2 open", note: "Rota dispute, plus who speaks to ground at the next window." },
    known: [
      ["E2", "Pell logged 4.8 hours. Second short night."],
      ["E6", "Blackout overlaps the only exterior-walk slot."],
      ["E7", "Ground asked for a crew note, not a medical report."],
    ],
    open: [
      ["T1", "Rota versus proximity. Still unresolved after the tool cage."],
      ["T2", "Who has the ground mic. Two people assume it is theirs."],
    ],
  },
  43: {
    lede: "Walk moved. The mic question is the decision that is actually due.",
    decision: {
      title: "Name the ground speaker before the window, in writing.",
      why: "The walk was moved. The remaining collision is two people preparing different notes for the same contact. Pick one speaker. The other writes the dissent into the log.",
      cites: "T2 · E7",
    },
    delay: { value: "6 min", note: "Window opens 19:05 habitat. No blackout on this sol." },
    sleep: { value: "at plan", note: "Pell 7.2 h after the moved walk. Still just a report." },
    conflict: { value: "1 open", note: "Mic ownership. The rota dispute cooled once assignments were split." },
    known: [
      ["E8", "Exterior walk moved to sol 44. No incident."],
      ["E7", "Ground wants one note."],
      ["E9", "Both Okonkwo and Pell drafted different openings."],
    ],
    open: [
      ["T2", "Speaker for the window is still implicit."],
    ],
  },
  44: {
    lede: "Speaker named. The walk is back on the board.",
    decision: {
      title: "Run the walk with Pell inside, not outside.",
      why: "Sleep is back at plan for one night. That is not a recovery. Keep Pell on comms. Voss and Ibrahim take the exterior.",
      cites: "E2 · E8",
    },
    delay: { value: "6 min", note: "Continuous window. Delay remains a simulation." },
    sleep: { value: "at plan", note: "All six at or above 7 h. One night does not clear two short ones." },
    conflict: { value: "0 open", note: "Speaker was named on sol 43. Dissent is in the log, not in the room." },
    known: [
      ["E10", "Okonkwo speaks. Pell’s dissent is logged, not suppressed."],
      ["E2", "Sleep at plan for one night only."],
      ["E8", "Walk is clear of the next blackout."],
    ],
    open: [
      ["—", "No open operational tension on this sol."],
    ],
  },
};

const CREW = [
  { name: "A. Okonkwo", role: "Commander", watch: "Day", note: "Holds the decision. Does not score the crew." },
  { name: "M. Pell", role: "Systems", watch: "Night", note: "Two short nights by sol 42. On comms, not outside, if the walk runs." },
  { name: "S. Ibrahim", role: "Engineer", watch: "Night", note: "Nearest the leak on sol 39. Sleep short on 40 and 41." },
  { name: "L. Voss", role: "Scientist", watch: "Day", note: "Greenhouse has no deadline. Can take the exterior on 44." },
  { name: "R. Chen", role: "Medic support", watch: "Day", note: "Not a flight surgeon. Consult is ground, and only inside a window." },
  { name: "J. Adeyemi", role: "Logistics", watch: "Swing", note: "Rota owner. Asked to split the night round on sol 41." },
];

const state = { sol: 42, calls: {} };

const solNum = document.querySelector("#sol-num");
const solRange = document.querySelector("#sol-range");
const lede = document.querySelector("#lede");
const decisionEl = document.querySelector("#decision");
const signalsEl = document.querySelector("#signals");
const mapEl = document.querySelector("#map");
const crewEl = document.querySelector("#room-crew");
const logEl = document.querySelector("#room-log");

function current() {
  return SOLS[state.sol];
}

function callKey() {
  return String(state.sol);
}

function renderDay() {
  const day = current();
  const call = state.calls[callKey()];
  solNum.textContent = String(state.sol);
  solRange.textContent = `${state.sol} / 60`;
  lede.textContent = day.lede;

  decisionEl.innerHTML = `
    <p class="label">Decision due</p>
    <h2>${day.decision.title}</h2>
    <p>${day.decision.why}</p>
    <p class="cite">Cited from ${day.decision.cites}. The desk does not make the call.</p>
    <div class="actions">
      <button type="button" class="primary" data-call="held">Hold this</button>
      <button type="button" class="ghost" data-call="moved">Move one sol</button>
    </div>
    <p class="state ${call ? "held" : ""}">${call ? `Commander marked this ${call}. Still reversible.` : "Unmarked."}</p>
  `;

  signalsEl.innerHTML = `
    <article class="signal delay"><p class="k">Comms delay</p><p class="v">${day.delay.value}</p><p class="n">${day.delay.note}</p></article>
    <article class="signal"><p class="k">Sleep</p><p class="v">${day.sleep.value}</p><p class="n">${day.sleep.note}</p></article>
    <article class="signal"><p class="k">Conflict</p><p class="v">${day.conflict.value}</p><p class="n">${day.conflict.note}</p></article>
  `;

  mapEl.innerHTML = `
    <p class="label">Case map</p>
    <h3>What is known, and what is still open.</h3>
    <div class="lanes">
      <div>
        <p class="label">Known</p>
        ${day.known.map(([id, text]) => `<div class="obj"><p class="id">${id} · log</p><p>${text}</p></div>`).join("")}
      </div>
      <div>
        <p class="label">Open</p>
        ${day.open.map(([id, text]) => `<div class="obj"><p class="id">${id} · commander-authored</p><p>${text}</p></div>`).join("")}
      </div>
    </div>
  `;
}

function renderCrew() {
  crewEl.innerHTML = `
    <p class="label">Crew · six</p>
    <div class="crew-grid">
      ${CREW.map((c) => `
        <article class="crew-card">
          <span class="tag">${c.role}</span>
          <h3>${c.name}</h3>
          <p class="hours">${c.watch} watch</p>
          <p>${c.note}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderLog() {
  const sols = Object.keys(SOLS);
  logEl.innerHTML = `
    <p class="label">Log · sols 40–44</p>
    <div class="log-list">
      ${sols.map((sol) => {
        const day = SOLS[sol];
        const mark = state.calls[sol] ? ` · marked ${state.calls[sol]}` : "";
        return `<article class="log-item"><p class="id label">Sol ${sol}${mark}</p><h3 style="font-family:var(--serif);font-weight:560;letter-spacing:-0.03em;margin:8px 0 0;">${day.decision.title}</h3><p>${day.lede}</p></article>`;
      }).join("")}
    </div>
  `;
}

function show(room) {
  document.querySelectorAll(".rooms button").forEach((b) => b.classList.toggle("on", b.dataset.room === room));
  for (const id of ["day", "crew", "log"]) {
    const el = document.querySelector(`#room-${id}`);
    const on = id === room;
    el.hidden = !on;
    el.classList.toggle("on", on);
  }
}

document.querySelector(".rooms").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  show(btn.dataset.room);
});

document.querySelector("#prev").addEventListener("click", () => {
  state.sol = Math.max(40, state.sol - 1);
  renderDay();
  renderLog();
});
document.querySelector("#next").addEventListener("click", () => {
  state.sol = Math.min(44, state.sol + 1);
  renderDay();
  renderLog();
});
decisionEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  state.calls[callKey()] = btn.dataset.call;
  renderDay();
  renderLog();
});

renderDay();
renderCrew();
renderLog();
show("day");
