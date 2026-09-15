const LAB_STORAGE_KEY = "cyber-terminal-lab-v2";

const rankTable = [
  { min: 0, label: "Junior Analyst" },
  { min: 120, label: "SOC Operator" },
  { min: 280, label: "Forensics Specialist" },
  { min: 460, label: "Incident Responder" },
  { min: 700, label: "DFIR Strategist" },
  { min: 1000, label: "Cybersecurity Architect" },
  { min: 1400, label: "Threat Hunter" },
];

const scenarioCatalog = {
  soc: {
    id: "soc",
    name: "SOC Triage",
    shortName: "SOC",
    sector: "Enterprise SIEM Monitoring",
    user: "analyst",
    host: "4rm0byte-soc",
    cwd: "/home/analyst/case",
    missionBrief:
      "A burst of alerts indicates possible credential abuse and C2 callback activity. Correlate process and auth telemetry and preserve evidence.",
    missionHint: "grep failed auth.log",
    files: {
      "auth.log": [
        "Sep 14 03:20:11 sshd[813]: Failed password for admin from 185.220.101.44 port 44788",
        "Sep 14 03:20:12 sshd[814]: Failed password for root from 185.220.101.44 port 44789",
        "Sep 14 03:20:22 sshd[821]: Accepted password for backup from 10.10.20.14 port 55721",
        "Sep 14 03:21:09 sudo: backup : TTY=pts/0 ; PWD=/home/backup ; USER=root ; COMMAND=/usr/bin/python3 /tmp/.agent.py",
      ].join("\n"),
      "processes.txt": [
        "root      515  0.0  /usr/sbin/sshd -D",
        "backup    888 11.2  /usr/bin/python3 /tmp/.agent.py --beacon 185.220.101.44",
        "mysql     411  0.6  /usr/sbin/mysqld",
        "www-data  722  2.1  /usr/bin/php-fpm",
      ].join("\n"),
      "netflow.csv": [
        "time,src,dst,proto,bytes",
        "03:20:11,10.10.20.14,185.220.101.44,tcp,7621",
        "03:20:15,10.10.20.14,104.26.4.21,tcp,2390",
        "03:20:42,10.10.20.14,185.220.101.44,tcp,14920",
        "03:21:08,10.10.20.14,1.1.1.1,udp,212",
      ].join("\n"),
      "ransom_note.txt": "Your files are locked. Contact secure-team@protonmail.com and send 3.2 BTC.",
      "alerts.json": [
        "{",
        '  "severity": "high",',
        '  "rule": "Suspicious Python Beacon",',
        '  "host": "srv-app-04",',
        '  "src_ip": "10.10.20.14",',
        '  "dst_ip": "185.220.101.44"',
        "}",
      ].join("\n"),
    },
    objectives: [
      {
        text: "Find failed authentication events in auth.log.",
        detector: /grep\s+failed\s+auth\.log/i,
        ioc: "Brute-force source IP 185.220.101.44",
      },
      {
        text: "Identify suspicious beacon process in processes.txt.",
        detector: /grep\s+(beacon|agent|python)\s+processes\.txt/i,
        ioc: "Suspicious process /tmp/.agent.py",
      },
      {
        text: "Hash ransom_note.txt for evidence integrity.",
        detector: /sha256sum\s+ransom_note\.txt/i,
        ioc: "Evidence hash captured for ransom_note.txt",
      },
    ],
    hashes: {
      "ransom_note.txt": "ab0f9231d9a6cfb5af7f0c84abbe09356f390f25268460e5d31848d8f0200fc6",
      "alerts.json": "f8ff8d2f9dc9bde9f5f809f3472a4ca87f42e6f85a052e4fd2c11a9edfd6e66f",
    },
  },
  forensics: {
    id: "forensics",
    name: "Disk Forensics",
    shortName: "DF",
    sector: "Endpoint Evidence Examination",
    user: "examiner",
    host: "4rm0byte-dfir",
    cwd: "/mnt/evidence/case-017",
    missionBrief:
      "A workstation image was acquired after possible data theft. Review browser, USB, and document artifacts to establish activity timeline.",
    missionHint: "grep usb usb_events.log",
    files: {
      "usb_events.log": [
        "2026-09-11T08:02:11Z USB inserted VID_8564 PID_1000 Label=KINGSTON32",
        "2026-09-11T08:14:48Z USB removed VID_8564 PID_1000 Label=KINGSTON32",
        "2026-09-11T09:01:33Z USB inserted VID_090C PID_1000 Label=ARCHIVE_DRIVE",
      ].join("\n"),
      "browser_history.csv": [
        "time,url,title",
        "08:09,https://drive.google.com/file/export,Cloud Export",
        "08:12,https://pastebin.com/raw/hf72L1,Encoded Keys",
        "08:19,https://github.com/security-labs/tools,Tool Repo",
      ].join("\n"),
      "doc_index.txt": ["Project_Aquila_budget.xlsx", "HR_review_q4.pdf", "pipeline_keys_backup.txt"].join(
        "\n",
      ),
      "image_payload.hex": [
        "00000000  89 50 4e 47 0d 0a 1a 0a  49 48 44 52 00 00 03 20",
        "00000010  00 00 01 90 08 06 00 00  00 56 25 04 be 00 00 00",
        "00000190  74 45 58 74 43 6f 6d 6d  65 6e 74 00 53 45 43 52",
        "000001a0  45 54 5f 54 4f 4b 45 4e  3d 44 46 49 52 2d 31 37",
      ].join("\n"),
      "timeline.txt": [
        "08:02 USB inserted",
        "08:09 Cloud export opened",
        "08:12 Pastebin page visited",
        "08:14 USB removed",
      ].join("\n"),
    },
    objectives: [
      {
        text: "Find USB insertion records.",
        detector: /grep\s+usb\s+usb_events\.log/i,
        ioc: "USB label ARCHIVE_DRIVE inserted",
      },
      {
        text: "Find suspicious browser destinations.",
        detector: /grep\s+(pastebin|drive|export)\s+browser_history\.csv/i,
        ioc: "Potential exfil destination in browser_history.csv",
      },
      {
        text: "Extract hidden token from image payload.",
        detector: /strings\s+image_payload\.hex/i,
        ioc: "Hidden token SECRET_TOKEN=DFIR-17 found",
      },
    ],
    hashes: {
      "image_payload.hex": "5d32e5de9d3cb2f4bff2e865c722f30ecfbcf93fd34aac6e3209cc1a43f4965d",
      "browser_history.csv": "ec90d1172c712080f6a9d8a28f7123e81294a8a3b26f6425fa1c5c85e674c082",
    },
  },
  threathunt: {
    id: "threathunt",
    name: "Threat Hunt",
    shortName: "TH",
    sector: "Endpoint and Network Hunt Operations",
    user: "hunter",
    host: "4rm0byte-hunt",
    cwd: "/opt/hunt/sprint",
    missionBrief:
      "Anomalous DNS tunneling and suspicious persistence have been reported. Hunt across endpoint and DNS datasets and map indicators.",
    missionHint: "grep txt dns.log",
    files: {
      "dns.log": [
        "09:11:20 client-21 A login.microsoftonline.com",
        "09:11:24 client-21 TXT x3f12.payload.node-control[.]net",
        "09:11:26 client-21 TXT x4a91.payload.node-control[.]net",
        "09:11:31 client-21 A cdn.discordapp.com",
      ].join("\n"),
      "autoruns.txt": [
        "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\OneDrive",
        "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\NodeUpdate = C:\\Users\\dev\\AppData\\Roaming\\nodeup\\nodeup.exe",
      ].join("\n"),
      "sigma_hits.txt": [
        "rule=Suspicious DNS TXT Burst host=client-21 severity=high",
        "rule=Unsigned Startup Binary host=client-21 severity=medium",
      ].join("\n"),
      "endpoint.csv": [
        "host,user,process,parent,sha256",
        "client-21,dev,nodeup.exe,explorer.exe,ce23b3f3fd1f2a13b8727f2a913cb5acac2f2314cc4f67f7b8ed793402f8de0f",
      ].join("\n"),
      "notes.md": "Hunt notes: prioritize persistence and command-and-control channels.",
    },
    objectives: [
      {
        text: "Identify DNS TXT tunneling traces.",
        detector: /grep\s+txt\s+dns\.log/i,
        ioc: "Suspicious TXT beacons to node-control domain",
      },
      {
        text: "Find persistence entries in autoruns.",
        detector: /grep\s+(nodeupdate|run)\s+autoruns\.txt/i,
        ioc: "Persistence via HKCU Run key NodeUpdate",
      },
      {
        text: "Review suspicious process hash in endpoint dataset.",
        detector: /grep\s+nodeup\.exe\s+endpoint\.csv/i,
        ioc: "Hash ce23b3f3... linked to nodeup.exe",
      },
    ],
    hashes: {
      "endpoint.csv": "3157bd467a1302cf9f9576ea45d544a8ad5eb6f6152f3d8e138f8f87f80e5c14",
      "dns.log": "61ea805febe7b7fef6f01afcb4c47a8d39603607e89a864619f8c5d45ee37942",
    },
  },
};

const utilityTips = [
  "Use mission to restate current objectives.",
  "Use scenario to see all available training tracks.",
  "Use iocs to review extracted indicators before reporting.",
  "Combine ls and cat to build a quick investigation sequence.",
  "Hash any suspicious file before writing containment notes.",
];

document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("terminal-output");
  const form = document.getElementById("terminal-form");
  const input = document.getElementById("terminal-input");
  const promptLabel = document.getElementById("prompt-label");
  const shellLabel = document.getElementById("shell-label");

  const xpCount = document.getElementById("xp-count");
  const solvedCount = document.getElementById("solved-count");
  const streakCount = document.getElementById("streak-count");
  const scenarioShort = document.getElementById("scenario-short");
  const rankLabel = document.getElementById("rank-label");
  const xpBar = document.getElementById("xp-bar");

  const missionBriefEl = document.getElementById("mission-brief");
  const missionObjectivesEl = document.getElementById("mission-objectives");
  const iocListEl = document.getElementById("ioc-list");

  const scenarioNameEl = document.getElementById("scenario-name");
  const scenarioSectorEl = document.getElementById("scenario-sector");
  const iocCountEl = document.getElementById("ioc-count");

  const newMissionButton = document.getElementById("new-mission");
  const insertHintButton = document.getElementById("insert-hint");
  const jumpToTerminalButton = document.getElementById("jump-to-terminal");
  const copyAsciiButton = document.getElementById("copy-ascii");
  const asciiBanner = document.getElementById("ascii-banner");

  const quickButtons = document.querySelectorAll(".quick-command");
  const scenarioButtons = document.querySelectorAll(".scenario-btn");

  if (!output || !form || !input) {
    return;
  }

  const state = loadState();
  if (!scenarioCatalog[state.scenario]) {
    state.scenario = "soc";
  }

  let commandHistory = [];
  let historyIndex = -1;
  let missionState = createMissionState(state.scenario);
  let currentPath = scenarioCatalog[state.scenario].cwd;

  bootBanner();
  refreshScenarioUI();
  refreshMissionUI();
  refreshOperatorUI();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = input.value.trim();
    if (!command) {
      return;
    }

    commandHistory.push(command);
    historyIndex = commandHistory.length;

    printLine(`${buildPrompt()} ${command}`, "prompt");
    executeCommand(command);
    input.value = "";
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!commandHistory.length) {
        return;
      }
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = commandHistory[historyIndex] || "";
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!commandHistory.length) {
        return;
      }
      historyIndex = Math.min(commandHistory.length, historyIndex + 1);
      input.value = commandHistory[historyIndex] || "";
    }
  });

  quickButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const command = button.getAttribute("data-command");
      if (!command) {
        return;
      }
      input.value = command;
      input.focus();
    });
  });

  scenarioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextScenario = button.getAttribute("data-scenario");
      if (!nextScenario || !scenarioCatalog[nextScenario]) {
        return;
      }
      switchScenario(nextScenario);
      printLine(`Scenario switched to ${scenarioCatalog[nextScenario].name}.`, "success");
    });
  });

  newMissionButton?.addEventListener("click", () => {
    missionState = createMissionState(state.scenario);
    refreshMissionUI();
    printLine("Mission rotated. New objective chain loaded.", "muted");
  });

  insertHintButton?.addEventListener("click", () => {
    const scenario = getScenario();
    input.value = scenario.missionHint;
    input.focus();
  });

  jumpToTerminalButton?.addEventListener("click", () => {
    document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth", block: "start" });
    input.focus();
  });

  copyAsciiButton?.addEventListener("click", async () => {
    if (!asciiBanner?.textContent) {
      return;
    }

    try {
      await navigator.clipboard.writeText(asciiBanner.textContent.trim());
      printLine("ASCII banner copied to clipboard.", "success");
    } catch {
      printLine("Clipboard permissions blocked copy action.", "warn");
    }
  });

  function executeCommand(raw) {
    const cmd = raw.trim();
    const lower = cmd.toLowerCase();
    const scenario = getScenario();

    if (lower === "help") {
      printLines(
        [
          "Core commands:",
          "help, clear, mission, scenario, use <soc|forensics|threathunt>, score",
          "ls, ls -la, pwd, cd .., cd /path, cat <file>, file <file>, strings <file>",
          "grep <term> <file>, sha256sum <file>, hexdump -c <file>, history, iocs, tip",
          "Host triage: whoami, uname -a, ps aux, netstat -tulnp, journalctl -n 20",
        ],
        "muted",
      );
      rewardCommand(cmd);
      return;
    }

    if (lower === "clear") {
      output.innerHTML = "";
      rewardCommand(cmd);
      return;
    }

    if (lower === "mission") {
      printLine(`Mission: ${scenario.missionBrief}`, "muted");
      missionState.objectives.forEach((obj, index) => {
        const mark = obj.done ? "[done]" : "[open]";
        printLine(`${index + 1}. ${mark} ${obj.text}`, obj.done ? "success" : "muted");
      });
      rewardCommand(cmd);
      return;
    }

    if (lower === "scenario") {
      printLines(
        [
          "Scenarios:",
          "soc -> credential abuse and C2 triage",
          "forensics -> disk and artifact investigation",
          "threathunt -> endpoint and dns hunt",
          "Switch with: use <scenario>",
        ],
        "muted",
      );
      rewardCommand(cmd);
      return;
    }

    if (lower.startsWith("use ")) {
      const next = lower.slice(4).trim();
      if (!scenarioCatalog[next]) {
        printLine(`Unknown scenario: ${next}`, "error");
        return handleFailure();
      }
      switchScenario(next);
      printLine(`Scenario switched to ${scenarioCatalog[next].name}.`, "success");
      rewardCommand(cmd);
      return;
    }

    if (lower === "pwd") {
      printLine(currentPath, "success");
      rewardCommand(cmd);
      return;
    }

    if (lower === "whoami") {
      printLine(scenario.user, "success");
      rewardCommand(cmd);
      return;
    }

    if (lower === "uname -a") {
      printLine("Linux secure-lab 6.12.4 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux", "success");
      rewardCommand(cmd);
      return;
    }

    if (lower === "ps aux") {
      printLines(
        [
          "USER      PID  CPU  COMMAND",
          "root      101  0.1  /usr/lib/systemd/systemd",
          `${scenario.user}  612  1.8  /usr/bin/python3 triage_worker.py`,
          `${scenario.user}  713  2.3  /usr/bin/tmux`,
        ],
        "muted",
      );
      rewardCommand(cmd);
      return;
    }

    if (lower === "netstat -tulnp") {
      printLines(
        [
          "Proto Local Address          Foreign Address        State       PID/Program",
          "tcp   10.10.20.14:22         185.220.101.44:44788   ESTABLISHED 813/sshd",
          "udp   0.0.0.0:5353           0.0.0.0:*              LISTEN      421/avahi",
          "tcp   10.10.20.14:443        104.26.4.21:53321      ESTABLISHED 722/php-fpm",
        ],
        "muted",
      );
      rewardCommand(cmd);
      return;
    }

    if (lower === "journalctl -n 20") {
      printLines(
        [
          "Sep 14 03:20:11 auth failure detected for admin",
          "Sep 14 03:20:12 auth failure detected for root",
          "Sep 14 03:20:22 successful login backup",
          "Sep 14 03:21:09 privilege escalation event via sudo",
        ],
        "muted",
      );
      rewardCommand(cmd);
      return;
    }

    if (lower === "ls" || lower === "ls -la") {
      const fileNames = Object.keys(scenario.files);
      if (!fileNames.length) {
        printLine("No files in current scenario.", "warn");
      } else if (lower === "ls -la") {
        printLines(
          fileNames.map((name) => `-rw-r--r--  ${name}`),
          "success",
        );
      } else {
        printLine(fileNames.join("  "), "success");
      }
      rewardCommand(cmd);
      evaluateObjectives(cmd);
      return;
    }

    if (lower === "cd ..") {
      const parts = currentPath.split("/").filter(Boolean);
      if (parts.length > 1) {
        parts.pop();
        currentPath = `/${parts.join("/")}`;
      }
      syncPrompt();
      rewardCommand(cmd);
      return;
    }

    if (lower.startsWith("cd ")) {
      const target = cmd.slice(3).trim();
      if (!target) {
        printLine("Usage: cd <path>", "warn");
        return;
      }
      if (target.startsWith("/")) {
        currentPath = target;
      } else {
        currentPath = `${currentPath.replace(/\/$/, "")}/${target}`;
      }
      syncPrompt();
      rewardCommand(cmd);
      return;
    }

    if (lower.startsWith("cat ")) {
      const target = cmd.slice(4).trim();
      const content = scenario.files[target];
      if (!content) {
        printLine(`cat: ${target}: No such file`, "error");
        return handleFailure();
      }
      printLines(content.split("\n"), "muted");
      rewardCommand(cmd);
      evaluateObjectives(cmd);
      return;
    }

    if (lower.startsWith("file ")) {
      const target = cmd.slice(5).trim();
      if (!scenario.files[target]) {
        printLine(`file: cannot open ${target}`, "error");
        return handleFailure();
      }
      const descriptor = target.endsWith(".csv")
        ? "ASCII text, with CRLF line terminators"
        : target.endsWith(".log")
          ? "UTF-8 text log data"
          : target.endsWith(".hex")
            ? "hexdump text artifact"
            : "UTF-8 Unicode text";
      printLine(`${target}: ${descriptor}`, "success");
      rewardCommand(cmd);
      evaluateObjectives(cmd);
      return;
    }

    if (lower.startsWith("strings ")) {
      const target = cmd.slice(8).trim();
      const content = scenario.files[target];
      if (!content) {
        printLine(`strings: ${target}: No such file`, "error");
        return handleFailure();
      }

      const extracted = [];
      content
        .split("\n")
        .map((line) => line.trim())
        .forEach((line) => {
          if (line.length >= 8) {
            extracted.push(line.replace(/\s+/g, " "));
          }
        });

      const finalExtract = extracted.slice(0, 10);
      if (!finalExtract.length) {
        printLine("No printable strings found.", "warn");
      } else {
        printLines(finalExtract, "muted");
      }

      rewardCommand(cmd);
      evaluateObjectives(cmd);
      return;
    }

    if (lower.startsWith("sha256sum ")) {
      const target = cmd.slice(10).trim();
      const hash = scenario.hashes[target];
      if (!scenario.files[target]) {
        printLine(`sha256sum: ${target}: No such file`, "error");
        return handleFailure();
      }
      if (hash) {
        printLine(`${hash}  ${target}`, "success");
      } else {
        printLine(`9a6d4ac72d7419e74f5837f5ff2f8b3fbb0ac772f4db4afcff739f16d8051c89  ${target}`, "success");
      }
      rewardCommand(cmd);
      evaluateObjectives(cmd);
      return;
    }

    if (lower.startsWith("hexdump -c ")) {
      const target = cmd.slice(10).trim();
      const content = scenario.files[target];
      if (!content) {
        printLine(`hexdump: ${target}: No such file`, "error");
        return handleFailure();
      }
      printLines(content.split("\n").slice(0, 8), "muted");
      rewardCommand(cmd);
      evaluateObjectives(cmd);
      return;
    }

    if (lower.startsWith("grep ")) {
      const parsed = parseGrep(cmd);
      if (!parsed) {
        printLine("Usage: grep <term> <file>", "warn");
        return;
      }
      const { term, file } = parsed;
      const content = scenario.files[file];
      if (!content) {
        printLine(`grep: ${file}: No such file`, "error");
        return handleFailure();
      }

      const lines = content.split("\n");
      const regex = new RegExp(escapeRegExp(term), "i");
      const matches = lines.filter((line) => regex.test(line));

      if (!matches.length) {
        printLine("No matches found.", "warn");
      } else {
        printLines(matches, "success");
      }

      rewardCommand(cmd);
      evaluateObjectives(cmd);
      return;
    }

    if (lower === "history") {
      if (!commandHistory.length) {
        printLine("No command history yet.", "warn");
      } else {
        printLines(
          commandHistory.map((entry, i) => `${String(i + 1).padStart(2, "0")}  ${entry}`),
          "muted",
        );
      }
      rewardCommand(cmd);
      return;
    }

    if (lower === "iocs") {
      if (!missionState.iocs.length) {
        printLine("No indicators confirmed yet.", "warn");
      } else {
        missionState.iocs.forEach((ioc, index) => {
          printLine(`${index + 1}. ${ioc}`, "success");
        });
      }
      rewardCommand(cmd);
      return;
    }

    if (lower === "tip") {
      const tip = utilityTips[Math.floor(Math.random() * utilityTips.length)];
      printLine(`Tip: ${tip}`, "muted");
      rewardCommand(cmd);
      return;
    }

    if (lower === "score") {
      printLine(
        `XP: ${state.xp} | Solved: ${state.solved} | Streak: ${state.streak} | Rank: ${resolveRank(state.xp)}`,
        "success",
      );
      rewardCommand(cmd);
      return;
    }

    printLine(`Command not found: ${cmd}`, "error");
    printLine("Try help for available commands.", "warn");
    handleFailure();
  }

  function bootBanner() {
    const scenario = getScenario();
    const lines = [
      "Initializing 4rm0Byte Cyber Range...",
      "Loading DFIR modules: evidence-parser, timeline-builder, ioc-tracker",
      `Active scenario: ${scenario.name}`,
      "Environment policy: defensive simulation only",
      "Type help to see command set.",
    ];

    printLines(lines, "muted");
    printLine("Welcome, operator.", "success");
  }

  function parseGrep(command) {
    const match = command.match(/^grep\s+(.+)\s+([^\s]+)$/i);
    if (!match) {
      return null;
    }

    return {
      term: match[1].trim(),
      file: match[2].trim(),
    };
  }

  function evaluateObjectives(command) {
    const normalized = command.toLowerCase();
    let completedNow = 0;

    missionState.objectives.forEach((objective) => {
      if (objective.done) {
        return;
      }
      if (!objective.detector.test(normalized)) {
        return;
      }

      objective.done = true;
      completedNow += 1;
      state.solved += 1;
      state.xp += 45;
      state.streak += 1;
      printLine(`Objective complete: ${objective.text}`, "success");

      if (objective.ioc && !missionState.iocs.includes(objective.ioc)) {
        missionState.iocs.push(objective.ioc);
        printLine(`IOC added: ${objective.ioc}`, "warn");
      }
    });

    if (completedNow > 0) {
      refreshMissionUI();
      refreshOperatorUI();
      persistState();

      const remaining = missionState.objectives.filter((obj) => !obj.done).length;
      if (remaining === 0) {
        printLine("Mission chain completed. Great investigation flow.", "success");
      }
    }
  }

  function rewardCommand(command) {
    const key = command.toLowerCase();

    if (!state.commandLedger[key]) {
      state.commandLedger[key] = 1;
      state.xp += 8;
    } else {
      state.commandLedger[key] += 1;
      state.xp += 2;
    }

    refreshOperatorUI();
    persistState();
  }

  function handleFailure() {
    state.streak = 0;
    refreshOperatorUI();
    persistState();
  }

  function switchScenario(nextScenario) {
    state.scenario = nextScenario;
    missionState = createMissionState(nextScenario);
    currentPath = scenarioCatalog[nextScenario].cwd;
    refreshScenarioUI();
    refreshMissionUI();
    refreshOperatorUI();
    persistState();
  }

  function createMissionState(scenarioId) {
    const source = scenarioCatalog[scenarioId];
    return {
      objectives: source.objectives.map((item) => ({ ...item, done: false })),
      iocs: [],
    };
  }

  function getScenario() {
    return scenarioCatalog[state.scenario];
  }

  function refreshScenarioUI() {
    const scenario = getScenario();

    scenarioNameEl.textContent = `Scenario: ${scenario.name}`;
    scenarioSectorEl.textContent = `Sector: ${scenario.sector}`;
    iocCountEl.textContent = `IOCs Confirmed: ${missionState.iocs.length}`;
    scenarioShort.textContent = scenario.shortName;

    scenarioButtons.forEach((button) => {
      button.classList.toggle("active", button.getAttribute("data-scenario") === scenario.id);
    });

    syncPrompt();
  }

  function refreshMissionUI() {
    const scenario = getScenario();

    missionBriefEl.textContent = scenario.missionBrief;
    missionObjectivesEl.innerHTML = "";

    missionState.objectives.forEach((objective) => {
      const li = document.createElement("li");
      li.textContent = objective.text;
      if (objective.done) {
        li.classList.add("done");
      }
      missionObjectivesEl.appendChild(li);
    });

    iocListEl.innerHTML = "";
    if (!missionState.iocs.length) {
      const li = document.createElement("li");
      li.textContent = "No indicators confirmed yet.";
      iocListEl.appendChild(li);
    } else {
      missionState.iocs.forEach((indicator) => {
        const li = document.createElement("li");
        li.textContent = indicator;
        iocListEl.appendChild(li);
      });
    }

    iocCountEl.textContent = `IOCs Confirmed: ${missionState.iocs.length}`;
  }

  function refreshOperatorUI() {
    xpCount.textContent = String(state.xp);
    solvedCount.textContent = String(state.solved);
    streakCount.textContent = String(state.streak);
    rankLabel.textContent = `Rank: ${resolveRank(state.xp)}`;

    const progress = Math.max(4, Math.min(100, state.xp % 100 || (state.xp > 0 ? 100 : 4)));
    xpBar.style.width = `${progress}%`;
  }

  function syncPrompt() {
    const scenario = getScenario();
    const prompt = `${scenario.user}@${scenario.host}:${currentPath}$`;
    if (promptLabel) {
      promptLabel.textContent = prompt;
    }
    if (shellLabel) {
      shellLabel.textContent = prompt;
    }
  }

  function buildPrompt() {
    const scenario = getScenario();
    return `${scenario.user}@${scenario.host}:${currentPath}$`;
  }

  function resolveRank(xp) {
    let label = rankTable[0].label;
    rankTable.forEach((rank) => {
      if (xp >= rank.min) {
        label = rank.label;
      }
    });
    return label;
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function printLines(lines, className = "") {
    lines.forEach((line) => printLine(line, className));
  }

  function printLine(text, className = "") {
    const row = document.createElement("p");
    row.className = `terminal-line ${className}`.trim();
    row.textContent = text;
    output.appendChild(row);
    output.scrollTop = output.scrollHeight;
  }

  function loadState() {
    const baseline = {
      scenario: "soc",
      xp: 0,
      solved: 0,
      streak: 0,
      commandLedger: {},
    };

    try {
      const raw = localStorage.getItem(LAB_STORAGE_KEY);
      if (!raw) {
        return baseline;
      }

      const parsed = JSON.parse(raw);
      return {
        scenario: typeof parsed?.scenario === "string" ? parsed.scenario : baseline.scenario,
        xp: Number.isFinite(parsed?.xp) ? parsed.xp : baseline.xp,
        solved: Number.isFinite(parsed?.solved) ? parsed.solved : baseline.solved,
        streak: Number.isFinite(parsed?.streak) ? parsed.streak : baseline.streak,
        commandLedger:
          parsed?.commandLedger && typeof parsed.commandLedger === "object"
            ? parsed.commandLedger
            : baseline.commandLedger,
      };
    } catch {
      return baseline;
    }
  }

  function persistState() {
    localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(state));
  }
});
