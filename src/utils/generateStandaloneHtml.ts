/**
 * Generates a self-contained, 100% zero-dependency single-file HTML game
 * Clean Dual-Page Architecture:
 * - Page 1: 【主页 · 猫咪咖啡馆日志】 (3 Deep Modules: 15 Renovation Stages, 6 Drink Upgrades with Cash Register, Customer Events & Cat Meters)
 * - Page 2: 【关卡页 · 食材连连看】 (30 Progressive Levels + Endless Mode, Ice Blocks, Crates, Move Limits, Laser Lines)
 */
export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>暖喵咖啡馆 · 深度经营日志与食材连连看 (Purr & Coffee Match)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { -webkit-tap-highlight-color: transparent; user-select: none; box-sizing: border-box; }
    body { background-color: #FAF7F2; color: #2C2219; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    @keyframes tilePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
    .animate-tile-pulse { animation: tilePulse 1.2s ease-in-out infinite; }
  </style>
</head>
<body class="w-full h-full min-h-[100dvh] bg-[#FAF7F2] flex flex-col items-center justify-center p-0 m-0 overflow-x-hidden font-sans select-none">

  <!-- Mobile Viewport Container -->
  <div class="relative w-full max-w-md h-[100dvh] flex flex-col justify-between overflow-hidden shadow-2xl bg-[#FAF7F2]">

    <!-- ======================================================== -->
    <!-- VIEW 1: 【主页 · 猫咪咖啡馆日志】(3大深度子系统)            -->
    <!-- ======================================================== -->
    <div id="viewJournal" class="relative w-full h-full flex flex-col justify-between overflow-hidden">
      <!-- Top Status Bar -->
      <header class="w-full px-4 pt-3 pb-2 flex items-center justify-between shrink-0 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E8DEC8] z-20">
        <div class="flex items-center gap-2">
          <!-- 星光灵感 -->
          <div class="flex items-center gap-1.5 bg-[#FFFDF9] border border-[#D9CDB8] px-2.5 py-1 rounded-xl shadow-xs">
            <span class="text-sm">⭐</span>
            <div class="flex flex-col leading-none">
              <span class="text-[9px] text-[#8C6544] font-medium">星光灵感</span>
              <span id="headerStars" class="text-xs font-bold text-[#2C2219] font-mono">4</span>
            </div>
          </div>
          <!-- 营业金币 -->
          <div class="flex items-center gap-1.5 bg-[#FFFDF9] border border-[#D9CDB8] px-2.5 py-1 rounded-xl shadow-xs">
            <span class="text-sm">🪙</span>
            <div class="flex flex-col leading-none">
              <span class="text-[9px] text-[#8C6544] font-medium">营业金币</span>
              <span id="headerCoins" class="text-xs font-bold text-[#2C2219] font-mono">450</span>
            </div>
          </div>
          <!-- 驻店猫咪数 -->
          <div class="flex items-center gap-1 bg-[#FFFDF9] border border-[#D9CDB8] px-2 py-1 rounded-xl shadow-xs">
            <span class="text-xs">🐾</span>
            <span id="headerCats" class="text-xs font-bold text-[#5C4434] font-mono">0 只</span>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <button id="btnLevelSelect" class="h-8 px-2.5 rounded-xl bg-[#FFFDF9] border border-[#D9CDB8] text-[#5C4434] hover:bg-[#F4ECE1] text-[11px] font-bold cursor-pointer">
            选关
          </button>
          <button id="btnToggleSoundJournal" class="w-8 h-8 rounded-xl bg-[#FFFDF9] border border-[#D9CDB8] flex items-center justify-center text-[#5C4434] hover:bg-[#F4ECE1] text-xs cursor-pointer">
            🔊
          </button>
        </div>
      </header>

      <!-- 3 Module Navigation Tabs -->
      <nav class="w-full px-3 py-1.5 flex items-center justify-between gap-1.5 bg-[#F6EFE6] border-b border-[#E8DEC8] shrink-0">
        <button id="tabBtnRenovate" onclick="switchJournalTab('renovate')" class="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all bg-[#FFFDF9] text-[#2C2219] shadow-xs border border-[#D8C9B4]">
          空间施工 (15)
        </button>
        <button id="tabBtnDrinks" onclick="switchJournalTab('drinks')" class="flex-1 py-1.5 px-2 rounded-xl text-xs font-medium text-[#7D6652] hover:bg-[#FFFDF9]/60 transition-all">
          饮品研发 (6)
        </button>
        <button id="tabBtnCats" onclick="switchJournalTab('cats')" class="flex-1 py-1.5 px-2 rounded-xl text-xs font-medium text-[#7D6652] hover:bg-[#FFFDF9]/60 transition-all">
          猫咪与日常
        </button>
      </nav>

      <!-- Scrollable Body Area -->
      <main class="flex-1 w-full overflow-y-auto px-3.5 py-3 space-y-3 min-h-0">
        
        <!-- Live Narrative Text Window -->
        <section class="w-full bg-[#FFFDF9] border border-[#E2D6C2] rounded-2xl shadow-xs p-3 flex flex-col">
          <div class="flex items-center justify-between pb-1.5 border-b border-[#EFE7D8] mb-2">
            <div class="flex items-center gap-1.5">
              <span class="text-sm">📖</span>
              <h2 class="text-xs font-bold text-[#3B2C20]">猫咪咖啡馆随笔 · 营业手记</h2>
            </div>
            <div class="flex items-center gap-1 bg-[#F5EFEB] text-[#8C6544] text-[10px] font-medium px-2 py-0.5 rounded-full">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span id="passiveRateBadge">+0 币/分</span>
            </div>
          </div>
          <div id="journalLogsContainer" class="h-28 overflow-y-auto space-y-1.5 pr-1 text-xs text-[#4A3B2C] leading-relaxed scroll-smooth"></div>
        </section>

        <!-- SUB-TAB 1: 空间施工 (15 Stages) -->
        <div id="panelRenovate" class="space-y-2.5">
          <div class="flex items-center justify-between px-0.5">
            <span class="text-xs font-bold text-[#5C4434] flex items-center gap-1.5">
              <span>🔨</span> 空间翻新与施工阶段
            </span>
            <span id="stagesProgressText" class="text-[11px] font-mono text-[#8C6544]">已竣工 2 / 15</span>
          </div>
          <!-- Phase Filter Pills -->
          <div class="flex items-center gap-1.5 text-[11px]">
            <button onclick="setPhaseFilter('all')" id="filterAll" class="px-2 py-0.5 rounded-lg font-bold bg-[#8C603D] text-white">全部 (15)</button>
            <button onclick="setPhaseFilter('early')" id="filterEarly" class="px-2 py-0.5 rounded-lg bg-[#EFE8DA] text-[#6B533E]">初期·毛坯</button>
            <button onclick="setPhaseFilter('mid')" id="filterMid" class="px-2 py-0.5 rounded-lg bg-[#EFE8DA] text-[#6B533E]">中期·核心</button>
            <button onclick="setPhaseFilter('late')" id="filterLate" class="px-2 py-0.5 rounded-lg bg-[#EFE8DA] text-[#6B533E]">后期·乐园</button>
          </div>
          <div id="stagesCardsContainer" class="space-y-2"></div>
        </div>

        <!-- SUB-TAB 2: 饮品研发 (6 Drinks + Cash Register) -->
        <div id="panelDrinks" class="space-y-2.5 hidden">
          <!-- Cash Register Idle Box -->
          <div class="w-full bg-gradient-to-r from-[#FFFDF9] to-[#FBF6EE] border border-[#D9CDB8] rounded-2xl p-3 shadow-xs flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">💰</span>
              <div>
                <div class="text-xs font-bold text-[#3B2C20]">吧台收银机 · 被动营收</div>
                <div class="text-[10px] text-[#8C6544] mt-0.5">
                  累积金币: <span id="cashRegisterAmount" class="font-bold text-amber-600 font-mono">0</span> 🪙
                  <span id="cashRateText" class="text-[9px] text-[#A38E7A] ml-1">(+0 币/分)</span>
                </div>
              </div>
            </div>
            <button id="btnCollectCash" onclick="collectCashRegister()" class="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all">
              提取
            </button>
          </div>

          <div class="flex items-center justify-between px-0.5">
            <span class="text-xs font-bold text-[#5C4434] flex items-center gap-1.5">
              <span>☕</span> 咖啡馆饮品菜单研发
            </span>
            <span id="drinksProgressText" class="text-[11px] font-mono text-[#8C6544]">已研发 1 / 6</span>
          </div>
          <div id="drinksCardsContainer" class="space-y-2"></div>
        </div>

        <!-- SUB-TAB 3: 猫咪与日常 (Cat Satiety/Mood + 12 Customer Stories) -->
        <div id="panelCats" class="space-y-2.5 hidden">
          <!-- Cat Status Meters -->
          <div class="w-full bg-[#FFFDF9] border border-[#E2D6C2] rounded-2xl p-3 shadow-xs">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-[#5C4434] flex items-center gap-1.5">
                <span>🐾</span> 驻店猫咪状态监测
              </span>
              <span class="text-[10px] text-[#A38265]">喂食与轻抚可回复</span>
            </div>
            <div id="catsMetersContainer" class="space-y-2.5"></div>
          </div>

          <!-- Customer & Daily Stories -->
          <div class="space-y-2">
            <div class="flex items-center justify-between px-0.5">
              <span class="text-xs font-bold text-[#5C4434] flex items-center gap-1.5">
                <span>📜</span> 顾客与日常突发记录 (12)
              </span>
              <span id="eventsCountText" class="text-[11px] font-mono text-[#8C6544]">解锁 3 / 12</span>
            </div>
            <div id="eventsCardsContainer" class="space-y-2"></div>
          </div>
        </div>

      </main>

      <!-- Bottom Action Bar -->
      <footer class="w-full px-4 pt-2.5 pb-4 shrink-0 bg-[#FAF7F2]/95 backdrop-blur-sm border-t border-[#E8DEC8] z-20">
        <button id="btnStartProcure" class="w-full h-12 rounded-2xl bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#8C4309] hover:from-[#E68A17] hover:to-[#9A4B0B] text-white font-bold text-sm shadow-md active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
          <span class="text-base animate-bounce">🐾</span>
          <span class="tracking-wide">开始采购食材</span>
          <span id="journalLevelBadge" class="bg-black/25 text-amber-100 text-xs font-mono font-medium px-2 py-0.5 rounded-full border border-white/20">第 1 关</span>
          <span class="text-xs">▶</span>
        </button>
      </footer>
    </div>

    <!-- ======================================================== -->
    <!-- VIEW 2: 【关卡页 · 连连看】(30关，步数/限时，冰块与木箱)       -->
    <!-- ======================================================== -->
    <div id="viewPuzzle" class="relative w-full h-full flex flex-col justify-between overflow-hidden p-2.5 sm:p-3 hidden bg-[#FAF5EE]">
      <!-- Top Puzzle Header -->
      <header class="w-full flex items-center justify-between gap-2 pb-2 shrink-0 z-20">
        <button id="btnBackToJournal" class="h-10 px-3 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] shadow-[0_2px_0_#6B482A] active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer shrink-0">
          <span class="text-sm font-bold text-[#6B482A]">⬅</span>
          <span class="text-xs font-black text-[#5A381E]">返回</span>
        </button>

        <div class="flex-1 flex flex-col items-center justify-center min-w-0 px-1">
          <div class="flex items-center gap-1.5 max-w-full">
            <span id="puzzleLevelTitle" class="text-xs sm:text-sm font-black text-[#5A381E] truncate">第 1 关</span>
            <span id="modeBadge" class="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 border border-amber-300">限时</span>
          </div>
          <div class="flex items-center gap-1.5 text-[11px] font-bold text-[#8C623E]">
            <span>剩余目标:</span>
            <span id="pairProgress" class="bg-[#8C603D] text-white px-2 py-0.2 rounded-full font-mono text-[10px]">0 / 18</span>
          </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <!-- Counter Box (Timer or Moves) -->
          <div id="clockBox" class="relative min-w-12 h-10 px-2 bg-[#FFFDF8] border-2 border-[#6B482A] rounded-xl flex items-center justify-center shadow-[0_2px_0_#6B482A]">
            <span id="timerText" class="text-xs font-black text-[#6B482A] font-mono">01:30</span>
          </div>
          <button id="btnToggleSoundPuzzle" class="w-8 h-8 rounded-full bg-[#FFFDF8] border-2 border-[#6B482A] flex items-center justify-center text-xs active:translate-y-0.5 cursor-pointer">
            🔊
          </button>
        </div>
      </header>

      <!-- Power-ups Bar -->
      <div class="w-full grid grid-cols-3 gap-2 pb-2 shrink-0 z-20">
        <button id="btnHint" class="relative h-10 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] shadow-[0_2px_0_#6B482A] active:translate-y-0.5 flex items-center justify-center gap-1 cursor-pointer">
          <span class="text-sm">💡</span>
          <span class="text-xs font-black text-[#5A381E]">提示</span>
          <span id="badgeHint" class="absolute -bottom-1 -right-1 bg-[#6B482A] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-white">x3</span>
        </button>

        <button id="btnShuffle" class="relative h-10 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] shadow-[0_2px_0_#6B482A] active:translate-y-0.5 flex items-center justify-center gap-1 cursor-pointer">
          <span class="text-sm">🔄</span>
          <span class="text-xs font-black text-[#5A381E]">重排</span>
          <span id="badgeShuffle" class="absolute -bottom-1 -right-1 bg-[#6B482A] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-white">x2</span>
        </button>

        <button id="btnFreeze" class="relative h-10 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] shadow-[0_2px_0_#6B482A] active:translate-y-0.5 flex items-center justify-center gap-1 cursor-pointer">
          <span class="text-sm">⏳</span>
          <span id="freezeText" class="text-xs font-black text-[#5A381E]">加时/步</span>
          <span id="badgeFreeze" class="absolute -bottom-1 -right-1 bg-[#6B482A] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-white">x1</span>
        </button>
      </div>

      <!-- Main Board (>70% Screen Space, Exact getBoundingClientRect Center Coordinates) -->
      <main id="boardContainer" class="relative flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden z-10">
        <canvas id="particleCanvas" class="absolute inset-0 pointer-events-none z-30"></canvas>
        <div id="boardInner" class="relative rounded-3xl bg-[#7D5537] border-4 border-[#8C603C] shadow-[0_5px_0_#5C3D26] p-0.5">
          <div id="tilesWrapper" class="relative w-full h-full"></div>
        </div>
      </main>

      <!-- Bottom Progress Bar -->
      <footer class="w-full pt-2 flex items-center justify-between gap-3 shrink-0 z-20">
        <div class="flex-1 h-9 bg-[#FFFDF8] border-2 border-[#6B482A] rounded-2xl p-1 shadow-[0_2px_0_#6B482A] flex items-center">
          <div class="w-full h-full bg-[#E8DCBF] border border-[#6B482A] rounded-xl p-0.5 overflow-hidden shadow-inner flex items-center">
            <div id="clearanceBar" class="h-full bg-gradient-to-r from-[#A5D67D] to-[#86C852] border border-[#5E9B2F] rounded-lg transition-all duration-300" style="width: 4%;"></div>
          </div>
        </div>
        <div class="px-3 h-9 rounded-2xl bg-[#FFFDF8] border-2 border-[#6B482A] shadow-[0_2px_0_#6B482A] flex items-center justify-center shrink-0">
          <span id="scoreText" class="text-xs font-black text-[#5A381E] font-mono">得分: 0</span>
        </div>
      </footer>
    </div>

    <!-- VICTORY MODAL -->
    <div id="modalVictory" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm hidden">
      <div class="relative w-full max-w-sm bg-[#FFFDF8] border-2 border-[#6B482A] rounded-3xl shadow-2xl p-6 text-center">
        <span class="text-4xl animate-bounce inline-block">🎉</span>
        <h2 class="text-xl font-black text-[#5A381E] mt-1">食材采购成功！🐾</h2>
        <div id="vicStars" class="text-2xl my-2 text-amber-400">⭐⭐⭐</div>
        <p class="text-xs text-[#8C623E] mb-4">新鲜香浓原料已送达咖啡馆，获得了新灵感！</p>

        <div class="w-full flex items-center justify-center gap-4 bg-[#FAF5EE] border border-[#6B482A]/20 rounded-2xl py-3 mb-5">
          <div class="flex items-center gap-1 font-mono font-black text-amber-600">
            <span>⭐</span><span id="vicStarsEarned">+3 星光灵感</span>
          </div>
          <div class="flex items-center gap-1 font-mono font-black text-amber-600">
            <span>🪙</span><span id="vicCoinsEarned">+120 营业金币</span>
          </div>
        </div>

        <div class="w-full flex flex-col gap-2.5">
          <button id="btnBackToJournalFromVic" class="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 border-2 border-[#6B482A] font-black text-white text-sm shadow-[0_3px_0_#6B482A] active:translate-y-0.5 cursor-pointer">
            返回咖啡馆装扮 📖
          </button>
          <button id="btnNextLevel" class="w-full py-2.5 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] font-bold text-[#5A381E] text-xs shadow-[0_2px_0_#6B482A] active:translate-y-0.5 cursor-pointer">
            继续采购下一关 🐾
          </button>
        </div>
      </div>
    </div>

    <!-- LEVEL SELECT MODAL -->
    <div id="modalLevelSelect" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm hidden">
      <div class="relative w-full max-w-sm max-h-[85vh] bg-[#FFFDF8] border-2 border-[#6B482A] rounded-3xl shadow-2xl p-5 flex flex-col">
        <div class="flex items-center justify-between pb-3 border-b border-[#E8DEC8]">
          <h3 class="text-base font-black text-[#5A381E] flex items-center gap-1.5">
            <span>🗺️</span> 关卡选择 (共 30 关)
          </h3>
          <button onclick="document.getElementById('modalLevelSelect').classList.add('hidden')" class="w-7 h-7 rounded-full bg-[#FAF4EB] border border-[#D9CDB8] text-xs font-bold text-[#6B482A] flex items-center justify-center cursor-pointer">✕</button>
        </div>
        <div id="levelSelectList" class="flex-1 overflow-y-auto py-3 grid grid-cols-5 gap-2"></div>
      </div>
    </div>

  </div>

  <script>
    // --- 1. Sound Manager ---
    class SoundManager {
      constructor() { this.ctx = null; this.enabled = true; }
      getCtx() {
        if (!this.ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC) this.ctx = new AC();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
        return this.ctx;
      }
      playSelect() {
        if (!this.enabled) return;
        const c = this.getCtx(); if (!c) return;
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(540, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(880, c.currentTime + 0.05);
        g.gain.setValueAtTime(0.12, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + 0.06);
      }
      playMatch(combo = 1) {
        if (!this.enabled) return;
        const c = this.getCtx(); if (!c) return;
        const now = c.currentTime;
        const baseFreq = 523.25 * Math.pow(1.059, Math.min(12, combo * 2));
        [baseFreq, baseFreq * 1.25, baseFreq * 1.5].forEach((f, i) => {
          const t = now + i * 0.035, o = c.createOscillator(), g = c.createGain();
          o.type = 'triangle'; o.frequency.setValueAtTime(f, t);
          g.gain.setValueAtTime(0.14, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
          o.connect(g); g.connect(c.destination);
          o.start(t); o.stop(t + 0.19);
        });
      }
      playIceCrack() {
        if (!this.enabled) return;
        const c = this.getCtx(); if (!c) return;
        const now = c.currentTime;
        [1800, 2400, 3200].forEach((f, i) => {
          const t = now + i * 0.02, o = c.createOscillator(), g = c.createGain();
          o.type = 'sawtooth'; o.frequency.setValueAtTime(f, t);
          o.frequency.exponentialRampToValueAtTime(f * 0.4, t + 0.08);
          g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
          o.connect(g); g.connect(c.destination);
          o.start(t); o.stop(t + 0.1);
        });
      }
      playMeow(pitch = 600) {
        if (!this.enabled) return;
        const c = this.getCtx(); if (!c) return;
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(pitch, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(pitch * 1.4, c.currentTime + 0.08);
        o.frequency.exponentialRampToValueAtTime(pitch * 0.85, c.currentTime + 0.22);
        g.gain.setValueAtTime(0.18, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.24);
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + 0.25);
      }
      playVictory() {
        if (!this.enabled) return;
        const c = this.getCtx(); if (!c) return;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((f, i) => {
          const t = c.currentTime + i * 0.1, o = c.createOscillator(), g = c.createGain();
          o.type = 'sine'; o.frequency.setValueAtTime(f, t);
          g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
          o.connect(g); g.connect(c.destination);
          o.start(t); o.stop(t + 0.3);
        });
      }
    }
    const sound = new SoundManager();

    // --- 2. Master Data (15 Stages, 6 Drinks, 12 Events, 30 Levels) ---
    const JOURNAL_STAGES = [
      { stage: 1, phase: 'early', id: 'stage_1_cleanup', name: '清扫建筑废料', subtitle: '清除毛坯房旧瓦砾与碎砖，打扫出整洁明亮的地面框架', costStars: 1, costCoins: 60, icon: '🧹', log: '【08:00】清运了三车碎瓦砾，阳光终于毫无阻隔地铺在地板上。' },
      { stage: 2, phase: 'early', id: 'stage_2_floor', name: '铺设胡桃木地板', subtitle: '选用天然防水耐磨胡桃木，散发幽静森林原木香', costStars: 1, costCoins: 120, icon: '🪵', log: '【09:30】胡桃木地板泛着温润的哑光色泽，踩上去悄无声息。' },
      { stage: 3, phase: 'early', id: 'stage_3_wall', name: '粉刷暖白珪藻土墙面', subtitle: '吸附异味、调湿透气的暖白质感，构筑温馨呼吸感', costStars: 2, costCoins: 180, icon: '🎨', log: '【11:15】刚粉刷好的暖白墙壁衬托着窗影，屋子里立刻亮堂温和了起来。' },
      { stage: 4, phase: 'early', id: 'stage_4_window', name: '修复复古拱形采光窗', subtitle: '安装双层隔音玻璃与黄铜把手，锁住午后的温暖阳光', costStars: 2, costCoins: 240, icon: '🪟', log: '【14:00】拱形木窗修复完毕，微风拂动纱帘，光线柔和得刚刚好。' },
      { stage: 5, phase: 'mid', id: 'stage_5_bar', name: '搭建实木一体工作台', subtitle: '加厚实木台面与内嵌水槽，咖啡师的核心舞台', costStars: 2, costCoins: 320, icon: '☕', log: '【10:00】实木吧台稳固成型，台面边缘打磨出圆润的手感弧度。' },
      { stage: 6, phase: 'mid', id: 'stage_6_pourover_kit', name: '采购手冲咖啡器具组', subtitle: '细口黄铜手冲壶、三孔陶滤杯与天然原浆滤纸', costStars: 3, costCoins: 420, icon: '🫖', log: '【12:30】试冲了第一壶埃塞俄比亚水洗豆，茉莉与柑橘香气四溢。' },
      { stage: 7, phase: 'mid', id: 'stage_7_grinder', name: '安装意式商用磨豆机', subtitle: '64mm平刀温控研磨，精准萃取每一颗咖啡豆的风味因子', costStars: 3, costCoins: 520, icon: '⚙️', log: '【14:20】电动磨豆机低沉轰鸣，极细研磨的咖啡粉泛着金棕油脂光泽。' },
      { stage: 8, phase: 'mid', id: 'stage_8_sofa', name: '摆放窗边双人位软沙发', subtitle: '焦糖色灯芯绒靠垫与高弹海绵，久坐也不会疲惫', costStars: 3, costCoins: 650, icon: '🛋️', log: '【15:45】沙发安放就位，陷进柔软靠背里，看着窗外街道发呆格外治愈。' },
      { stage: 9, phase: 'mid', id: 'stage_9_carpet', name: '铺设复古编织羊毛地毯', subtitle: '几何纹理手织毯，猫爪肉垫踩在上面最舒服', costStars: 3, costCoins: 780, icon: '🧶', log: '【17:10】羊毛地毯吸音又保暖，整间咖啡馆的脚步声都变得轻柔细语。' },
      { stage: 10, phase: 'late', id: 'stage_10_cat_custard', name: '领养第一只小橘猫「奶黄包」', subtitle: '圆滚滚胖嘟嘟，性情温和黏人，最喜欢用下巴蹭人', costStars: 4, costCoins: 900, icon: '🐱', catId: 'custard', catName: '奶黄包', log: '【10:30】小橘猫「奶黄包」正式入住！嗅了嗅吧台后在阳光下舒服地伸大懒腰。' },
      { stage: 11, phase: 'late', id: 'stage_11_cattree', name: '搭建通顶多层猫爬架', subtitle: '剑麻抓柱、太空舱瞭望台与云朵吊床', costStars: 4, costCoins: 1050, icon: '🏰', log: '【13:40】「奶黄包」两步窜到最高的透明太空舱里，居高临下俯瞰领地。' },
      { stage: 12, phase: 'late', id: 'stage_12_feeder', name: '添置自动喂食器与活水盆', subtitle: '恒温循环活氧流水，保障猫主子的日常健康', costStars: 4, costCoins: 1200, icon: '🥣', log: '【15:10】流水喷泉咕嘟咕嘟冒泡，猫咪们好奇地用爪子蘸水玩得不亦乐乎。' },
      { stage: 13, phase: 'late', id: 'stage_13_cat_dango', name: '领养漫步三花猫「小碎花」', subtitle: '优雅灵动的玳瑁三花，巡视全场的猫界高冷掌柜', costStars: 5, costCoins: 1400, icon: '🐈', catId: 'dango', catName: '小碎花', log: '【16:20】三花猫「小碎花」迈着猫步踱入店中，优雅巡视每一个角落。' },
      { stage: 14, phase: 'late', id: 'stage_14_grass_bed', name: '种植鲜嫩猫草与悬空跳板', subtitle: '无土水培多汁小麦草，墙面游乐空中走廊', costStars: 5, costCoins: 1650, icon: '🌿', log: '【17:40】两只猫咪一前一后穿过墙面跳板，惬意地嚼着水嫩的猫草尖。' },
      { stage: 15, phase: 'late', id: 'stage_15_neon_grand', name: '点亮猫爪霓虹灯与旗舰盛宴', subtitle: '门头复古黄铜手写招牌与常客夜市，成为街角最温馨的明灯', costStars: 6, costCoins: 2000, icon: '✨', log: '【19:30】夜幕降临，门头的猫爪暖黄招牌亮起，整个街角都被咖啡香与呼噜声温暖包围！' }
    ];

    const DRINK_MENU = [
      { id: 'drink_pourover', name: '耶加雪菲手冲单品', icon: '☕', level: 1, costCoins: 100, passiveCoinRate: 3, bonusCoinPerLevel: 10, desc: '花香与明亮柑橘调，手冲咖啡入门经典' },
      { id: 'drink_americano', name: '经典冰美式', icon: '🧊', level: 0, costCoins: 250, passiveCoinRate: 5, bonusCoinPerLevel: 15, desc: '深烘拼配浓缩与纯净冰水，醒脑必备' },
      { id: 'drink_latte', name: '丝绒浓郁拿铁', icon: '🥛', level: 0, costCoins: 450, passiveCoinRate: 8, bonusCoinPerLevel: 25, desc: '细腻微奶泡与坚果醇香交织，口感顺滑' },
      { id: 'drink_macchiato', name: '焦糖玛奇朵', icon: '🍯', level: 0, costCoins: 750, passiveCoinRate: 12, bonusCoinPerLevel: 35, desc: '香草风味糖浆覆以手淋海盐焦糖网格' },
      { id: 'drink_matcha', name: '宇治抹茶鲜奶', icon: '🍵', level: 0, costCoins: 1100, passiveCoinRate: 18, bonusCoinPerLevel: 50, desc: '石臼研磨纯抹茶，茶香清冽回甘悠长' },
      { id: 'drink_cocoa_paw', name: '猫爪棉花糖热可可', icon: '🍫', level: 0, costCoins: 1600, passiveCoinRate: 25, bonusCoinPerLevel: 75, desc: '法芙娜可可融化，漂浮手作Q弹猫爪棉花糖' }
    ];

    const CUSTOMER_EVENTS = [
      { id: 'evt_1', title: '雨天避雨的学生', guest: '戴眼镜的高中生', icon: '🌧️', log: '窗外下起暴雨，少年推开店门，点了一杯热可可，安安静静写完了数学作业。', unlockStageReq: 2 },
      { id: 'evt_2', title: '小橘猫的探头初遇', guest: '流浪橘猫「奶黄包」', icon: '🐾', log: '门缝外传来微弱的喵呜声，一根胡子沾着草籽的小橘猫探头探脑地打量着吧台。', unlockStageReq: 3 },
      { id: 'evt_3', title: '疲惫的插画师', guest: '抱着画板的短发女孩', icon: '🎨', log: '画师在窗边坐了一下午，铅笔沙沙作响，速写本上满是小猫在阳光下打盹的姿态。', unlockStageReq: 4 },
      { id: 'evt_4', title: '第一批豆子烘焙香', guest: '老街坊陈爷爷', icon: '🫘', log: '陈爷爷顺着香气走进来赞叹：“这老街十几年没闻到这么地道纯粹的豆子香了！”', unlockStageReq: 6 },
      { id: 'evt_5', title: '邻居送来的猫罐头', guest: '隔壁花店的店主阿姨', icon: '🥫', log: '阿姨抱着一捧新鲜尤加利叶和两罐金枪鱼泥进门，笑着说要犒劳辛苦当掌柜的小猫。', unlockStageReq: 8 },
      { id: 'evt_6', title: '午后双猫踩奶协奏曲', guest: '奶黄包 & 小碎花', icon: '💤', log: '两只猫咪挤在羊毛毯上，前爪有节奏地起伏踩奶，呼噜声汇成了治愈的催眠曲。', unlockStageReq: 10 },
      { id: 'evt_7', title: '手冲咖啡盲品测试', guest: '资深咖啡烘焙师', icon: '☕', log: '专业杯测师品尝后连连点头：“萃取干净、酸质活泼，这杯单品水准相当惊艳！”', unlockStageReq: 11 },
      { id: 'evt_8', title: '猫咪爬架捉迷藏', guest: '常客小林', icon: '🏰', log: '奶黄包躲在最高层的猫洞里，只露出一截尾巴尖晃来晃去，逗得全场客人忍俊不禁。', unlockStageReq: 12 },
      { id: 'evt_9', title: '暖阳下的猫草丰收', guest: '小碎花', icon: '🌿', log: '小碎花眯着眼睛咔嚓咔嚓嚼着新收割的嫩麦草，吃饱后心满意足地舔着前爪。', unlockStageReq: 14 },
      { id: 'evt_10', title: '冬夜街角的那盏明灯', guest: '加班归途的白领', icon: '🏮', log: '“下班路上看到那盏暖黄猫爪灯亮着，心里一下子就踏实了。”客人在留言簿上写道。', unlockStageReq: 15 },
      { id: 'evt_11', title: '常客赠送手作陶瓷猫碗', guest: '陶艺工作室学徒', icon: '🥣', log: '送来了一只带有手绘猫爪印的烧制陶碗，奶黄包立刻把脑袋埋进去吃得格外香甜。', unlockStageReq: 15 },
      { id: 'evt_12', title: '咖啡馆一周岁生日派对', guest: '全体爱猫老常客', icon: '🎂', log: '小小的咖啡馆里挤满了常客与笑声，猫咪们戴着小领结，共享特制金枪鱼生日蛋糕！', unlockStageReq: 15 }
    ];

    // 30 Progressive Levels
    const CAFE_LEVELS = [
      { level: 1, name: '初夏清晨', mode: 'time', rows: 6, cols: 6, timeLimit: 90, pairs: 18, obstacleCount: 0, frozenCount: 0, starsReward: 2, coinsReward: 80 },
      { level: 2, name: '晨曦咖啡豆', mode: 'time', rows: 6, cols: 6, timeLimit: 85, pairs: 18, obstacleCount: 0, frozenCount: 0, starsReward: 2, coinsReward: 90 },
      { level: 3, name: '松木烘焙坊', mode: 'time', rows: 6, cols: 6, timeLimit: 80, pairs: 18, obstacleCount: 0, frozenCount: 0, starsReward: 2, coinsReward: 100 },
      { level: 4, name: '步数初试', mode: 'moves', rows: 6, cols: 6, movesLimit: 26, pairs: 18, obstacleCount: 0, frozenCount: 0, starsReward: 2, coinsReward: 110 },
      { level: 5, name: '起步考核', mode: 'time', rows: 6, cols: 6, timeLimit: 75, pairs: 18, obstacleCount: 0, frozenCount: 0, starsReward: 3, coinsReward: 130 },
      { level: 6, name: '旧木箱障碍', mode: 'time', rows: 8, cols: 8, timeLimit: 120, pairs: 30, obstacleCount: 4, frozenCount: 0, starsReward: 3, coinsReward: 140 },
      { level: 7, name: '工坊储物间', mode: 'time', rows: 8, cols: 8, timeLimit: 110, pairs: 30, obstacleCount: 4, frozenCount: 0, starsReward: 3, coinsReward: 150 },
      { level: 8, name: '货架迷宫', mode: 'moves', rows: 8, cols: 8, movesLimit: 42, pairs: 30, obstacleCount: 4, frozenCount: 0, starsReward: 3, coinsReward: 160 },
      { level: 9, name: '午后焦糖', mode: 'time', rows: 8, cols: 8, timeLimit: 105, pairs: 29, obstacleCount: 6, frozenCount: 0, starsReward: 3, coinsReward: 170 },
      { level: 10, name: '猫咪巡逻', mode: 'time', rows: 8, cols: 8, timeLimit: 100, pairs: 29, obstacleCount: 6, frozenCount: 0, starsReward: 3, coinsReward: 180 },
      { level: 11, name: '箱中捉迷藏', mode: 'moves', rows: 8, cols: 8, movesLimit: 40, pairs: 29, obstacleCount: 6, frozenCount: 0, starsReward: 3, coinsReward: 190 },
      { level: 12, name: '烘焙研磨', mode: 'time', rows: 8, cols: 8, timeLimit: 95, pairs: 28, obstacleCount: 8, frozenCount: 0, starsReward: 3, coinsReward: 200 },
      { level: 13, name: '曲奇香气', mode: 'moves', rows: 8, cols: 8, movesLimit: 38, pairs: 28, obstacleCount: 8, frozenCount: 0, starsReward: 3, coinsReward: 210 },
      { level: 14, name: '窗边暖阳', mode: 'time', rows: 8, cols: 8, timeLimit: 90, pairs: 28, obstacleCount: 8, frozenCount: 0, starsReward: 3, coinsReward: 220 },
      { level: 15, name: '半程晋级', mode: 'moves', rows: 8, cols: 8, movesLimit: 36, pairs: 28, obstacleCount: 8, frozenCount: 0, starsReward: 4, coinsReward: 250 },
      { level: 16, name: '初遇薄冰', mode: 'time', rows: 8, cols: 8, timeLimit: 110, pairs: 30, obstacleCount: 4, frozenCount: 4, starsReward: 4, coinsReward: 260 },
      { level: 17, name: '冰封鲜奶', mode: 'moves', rows: 8, cols: 8, movesLimit: 40, pairs: 30, obstacleCount: 4, frozenCount: 6, starsReward: 4, coinsReward: 270 },
      { level: 18, name: '冷萃风味', mode: 'time', rows: 8, cols: 8, timeLimit: 100, pairs: 29, obstacleCount: 6, frozenCount: 6, starsReward: 4, coinsReward: 280 },
      { level: 19, name: '冰霜阻隔', mode: 'moves', rows: 8, cols: 8, movesLimit: 38, pairs: 29, obstacleCount: 6, frozenCount: 8, starsReward: 4, coinsReward: 290 },
      { level: 20, name: '严冬试炼', mode: 'time', rows: 8, cols: 8, timeLimit: 95, pairs: 28, obstacleCount: 8, frozenCount: 8, starsReward: 4, coinsReward: 300 },
      { level: 21, name: '大网格开拓', mode: 'time', rows: 8, cols: 10, timeLimit: 135, pairs: 37, obstacleCount: 6, frozenCount: 8, starsReward: 4, coinsReward: 320 },
      { level: 22, name: '深烘回甘', mode: 'moves', rows: 8, cols: 10, movesLimit: 50, pairs: 37, obstacleCount: 6, frozenCount: 10, starsReward: 4, coinsReward: 340 },
      { level: 23, name: '冰晶拿铁', mode: 'time', rows: 8, cols: 10, timeLimit: 125, pairs: 36, obstacleCount: 8, frozenCount: 10, starsReward: 4, coinsReward: 360 },
      { level: 24, name: '步数极限', mode: 'moves', rows: 8, cols: 10, movesLimit: 46, pairs: 36, obstacleCount: 8, frozenCount: 12, starsReward: 4, coinsReward: 380 },
      { level: 25, name: '迷雾密室', mode: 'time', rows: 8, cols: 10, timeLimit: 115, pairs: 35, obstacleCount: 10, frozenCount: 12, starsReward: 5, coinsReward: 400 },
      { level: 26, name: '终极大网格', mode: 'time', rows: 10, cols: 10, timeLimit: 160, pairs: 46, obstacleCount: 8, frozenCount: 12, starsReward: 5, coinsReward: 420 },
      { level: 27, name: '棋盘破冰者', mode: 'moves', rows: 10, cols: 10, movesLimit: 58, pairs: 46, obstacleCount: 8, frozenCount: 14, starsReward: 5, coinsReward: 440 },
      { level: 28, name: '猫咪大师试炼', mode: 'time', rows: 10, cols: 10, timeLimit: 140, pairs: 45, obstacleCount: 10, frozenCount: 14, starsReward: 5, coinsReward: 460 },
      { level: 29, name: '巅峰智谋', mode: 'moves', rows: 10, cols: 10, movesLimit: 54, pairs: 44, obstacleCount: 12, frozenCount: 16, starsReward: 5, coinsReward: 480 },
      { level: 30, name: '传奇旗舰盛典', mode: 'time', rows: 10, cols: 10, timeLimit: 130, pairs: 43, obstacleCount: 14, frozenCount: 16, starsReward: 6, coinsReward: 600 }
    ];

    // --- 3. App State & Persistence ---
    const STORAGE_KEY = 'purr_cafe_standalone_v6_deep';
    let stars = 4, coins = 450;
    let unlockedStages = new Set(['stage_1_cleanup', 'stage_2_floor']);
    let unlockedDrinks = new Set(['drink_pourover']);
    let journalLogs = [
      '铺面刚刚租下，空荡荡的地板上积着一层薄灰。门缝外有一只流浪小橘猫探头探脑。',
      JOURNAL_STAGES[0].log,
      JOURNAL_STAGES[1].log
    ];
    let currentLevel = 1;
    let currentPhaseFilter = 'all';
    let currentTab = 'renovate';
    let cashRegister = 0;
    let catSatiety = 80, catMood = 90;

    // Load LocalStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (typeof p.stars === 'number') stars = p.stars;
        if (typeof p.coins === 'number') coins = p.coins;
        if (Array.isArray(p.unlockedStages)) unlockedStages = new Set(p.unlockedStages);
        if (Array.isArray(p.unlockedDrinks)) unlockedDrinks = new Set(p.unlockedDrinks);
        if (Array.isArray(p.journalLogs) && p.journalLogs.length > 0) journalLogs = p.journalLogs;
        if (typeof p.currentLevel === 'number') currentLevel = p.currentLevel;
        if (typeof p.cashRegister === 'number') cashRegister = p.cashRegister;
      }
    } catch(e) {}

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          stars, coins, unlockedStages: Array.from(unlockedStages),
          unlockedDrinks: Array.from(unlockedDrinks),
          journalLogs, currentLevel, cashRegister
        }));
      } catch(e) {}
    }

    // Passive Coin Generation (every 10s gives 1/6th minute rate)
    setInterval(() => {
      let rate = 0;
      DRINK_MENU.forEach(d => {
        if (unlockedDrinks.has(d.id)) rate += d.passiveCoinRate;
      });
      if (rate > 0) {
        cashRegister += Math.ceil(rate / 6);
        updateCashRegisterDisplay();
      }
    }, 10000);

    function updateCashRegisterDisplay() {
      const el = document.getElementById('cashRegisterAmount');
      if (el) el.innerText = cashRegister;
      const rateEl = document.getElementById('passiveRateBadge');
      let rate = 0;
      DRINK_MENU.forEach(d => { if (unlockedDrinks.has(d.id)) rate += d.passiveCoinRate; });
      if (rateEl) rateEl.innerText = '+' + rate + ' 币/分';
      const cRate = document.getElementById('cashRateText');
      if (cRate) cRate.innerText = '(+' + rate + ' 币/分)';
    }

    function collectCashRegister() {
      if (cashRegister <= 0) return;
      coins += cashRegister;
      const collected = cashRegister;
      cashRegister = 0;
      sound.playVictory();
      const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      journalLogs.push('【' + timeStr + ' 提取】从吧台收银机提取了 ' + collected + ' 营业金币 🪙');
      saveState();
      renderJournal();
    }

    // --- 4. Journal Navigation & Rendering ---
    function switchJournalTab(tab) {
      currentTab = tab;
      ['renovate', 'drinks', 'cats'].forEach(t => {
        const btn = document.getElementById('tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
        const panel = document.getElementById('panel' + t.charAt(0).toUpperCase() + t.slice(1));
        if (t === tab) {
          btn.className = 'flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all bg-[#FFFDF9] text-[#2C2219] shadow-xs border border-[#D8C9B4]';
          panel.classList.remove('hidden');
        } else {
          btn.className = 'flex-1 py-1.5 px-2 rounded-xl text-xs font-medium text-[#7D6652] hover:bg-[#FFFDF9]/60 transition-all';
          panel.classList.add('hidden');
        }
      });
      renderJournal();
    }

    function setPhaseFilter(phase) {
      currentPhaseFilter = phase;
      ['All', 'Early', 'Mid', 'Late'].forEach(p => {
        const btn = document.getElementById('filter' + p);
        if (p.toLowerCase() === phase) {
          btn.className = 'px-2 py-0.5 rounded-lg font-bold bg-[#8C603D] text-white';
        } else {
          btn.className = 'px-2 py-0.5 rounded-lg bg-[#EFE8DA] text-[#6B533E]';
        }
      });
      renderStages();
    }

    function renderJournal() {
      document.getElementById('headerStars').innerText = stars;
      document.getElementById('headerCoins').innerText = coins.toLocaleString();
      document.getElementById('journalLevelBadge').innerText = '第 ' + currentLevel + ' 关';
      document.getElementById('stagesProgressText').innerText = '已竣工 ' + unlockedStages.size + ' / ' + JOURNAL_STAGES.length;
      document.getElementById('drinksProgressText').innerText = '已研发 ' + unlockedDrinks.size + ' / ' + DRINK_MENU.length;

      // Count cats
      const hasCustard = unlockedStages.has('stage_10_cat_custard');
      const hasDango = unlockedStages.has('stage_13_cat_dango');
      const catCount = (hasCustard ? 1 : 0) + (hasDango ? 1 : 0);
      document.getElementById('headerCats').innerText = catCount + ' 只';

      // Logs
      const logsBox = document.getElementById('journalLogsContainer');
      logsBox.innerHTML = '';
      journalLogs.forEach(entry => {
        const div = document.createElement('div');
        const isHighlight = entry.startsWith('【');
        div.className = 'p-1.5 rounded-xl ' + (isHighlight ? 'bg-[#FBF6EE] border-l-2 border-[#C49B71] text-[#332417]' : 'bg-[#FAF8F5] text-[#554332]');
        div.innerText = entry;
        logsBox.appendChild(div);
      });
      logsBox.scrollTop = logsBox.scrollHeight;

      updateCashRegisterDisplay();
      renderStages();
      renderDrinks();
      renderCatsAndEvents();
    }

    function renderStages() {
      const cardsBox = document.getElementById('stagesCardsContainer');
      cardsBox.innerHTML = '';
      const filtered = JOURNAL_STAGES.filter(s => currentPhaseFilter === 'all' || s.phase === currentPhaseFilter);

      filtered.forEach(item => {
        const isUnlocked = unlockedStages.has(item.id);
        const idx = JOURNAL_STAGES.findIndex(s => s.id === item.id);
        const prevUnlocked = idx === 0 || unlockedStages.has(JOURNAL_STAGES[idx - 1].id);
        const canAfford = stars >= item.costStars && coins >= item.costCoins;
        const isAvail = prevUnlocked && !isUnlocked;

        const card = document.createElement('div');
        card.className = 'w-full p-2.5 rounded-2xl border transition-all ' +
          (isUnlocked ? 'bg-[#F9F6F0] border-[#E8DEC8] opacity-90' : isAvail ? 'bg-[#FFFDF9] border-[#D9CDB8] shadow-xs' : 'bg-[#F5F2EB]/60 border-[#E8DEC8]/60 opacity-60');

        card.innerHTML = \`
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-start gap-2.5 flex-1 min-w-0">
              <div class="w-8 h-8 rounded-xl bg-[#F5EFEB] border border-[#E2D6C2] flex items-center justify-center text-base shrink-0 mt-0.5">\${item.icon}</div>
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-1.5">
                  <span class="text-[9px] font-mono font-bold bg-[#EFE8DA] text-[#6B533E] px-1 rounded-sm">\${item.stage}</span>
                  <h3 class="text-xs font-bold text-[#2C2219] truncate">\${item.name}</h3>
                </div>
                <p class="text-[10px] text-[#78614E] mt-0.5 line-clamp-1 leading-tight">\${item.subtitle}</p>
                \${!isUnlocked ? \`<div class="flex items-center gap-1.5 mt-1 text-[9px] font-mono font-bold text-[#8C6544]">
                  <span class="bg-[#FAF4EB] border border-[#E8DEC8] px-1 py-0.2 rounded-sm">⭐ \${item.costStars}</span>
                  <span class="bg-[#FAF4EB] border border-[#E8DEC8] px-1 py-0.2 rounded-sm">🪙 \${item.costCoins}</span>
                </div>\` : ''}
              </div>
            </div>
            <div class="shrink-0 flex items-center self-center">
              \${isUnlocked
                ? '<span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">✓ 已竣工</span>'
                : isAvail
                ? \`<button onclick="unlockStage('\${item.id}')" class="px-2.5 py-1 rounded-xl text-xs font-bold \${canAfford ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs cursor-pointer' : 'bg-[#E8DEC8] text-[#8C7560] cursor-not-allowed'}" \${!canAfford ? 'disabled' : ''}>\${canAfford ? '施工' : '缺少'}</button>\`
                : '<span class="text-[9px] text-[#A38E7A] bg-[#EFEAE0] px-1.5 py-0.5 rounded-md">未解锁</span>'
              }
            </div>
          </div>
        \`;
        cardsBox.appendChild(card);
      });
    }

    function renderDrinks() {
      const box = document.getElementById('drinksCardsContainer');
      box.innerHTML = '';
      DRINK_MENU.forEach(item => {
        const isUnlocked = unlockedDrinks.has(item.id);
        const canAfford = coins >= item.costCoins;
        const card = document.createElement('div');
        card.className = 'w-full p-2.5 rounded-2xl border transition-all ' +
          (isUnlocked ? 'bg-[#FFFDF9] border-[#D9CDB8]' : 'bg-[#F5F2EB]/70 border-[#E8DEC8]/60');

        card.innerHTML = \`
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-start gap-2.5 flex-1 min-w-0">
              <div class="w-8 h-8 rounded-xl bg-[#F5EFEB] border border-[#E2D6C2] flex items-center justify-center text-base shrink-0 mt-0.5">\${item.icon}</div>
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-1.5">
                  <h3 class="text-xs font-bold text-[#2C2219] truncate">\${item.name}</h3>
                  <span class="text-[9px] font-mono text-amber-700 font-bold bg-amber-50 border border-amber-200 px-1 rounded-sm">+\${item.passiveCoinRate}币/分</span>
                </div>
                <p class="text-[10px] text-[#78614E] mt-0.5 leading-tight">\${item.desc}</p>
                <div class="text-[9px] text-emerald-700 font-medium mt-0.5">通关加成: +\${item.bonusCoinPerLevel} 币/关</div>
              </div>
            </div>
            <div class="shrink-0 flex items-center self-center">
              \${isUnlocked
                ? '<span class="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">售卖中</span>'
                : \`<button onclick="unlockDrink('\${item.id}')" class="px-2.5 py-1 rounded-xl text-xs font-bold \${canAfford ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs cursor-pointer' : 'bg-[#E8DEC8] text-[#8C7560] cursor-not-allowed'}" \${!canAfford ? 'disabled' : ''}>🪙 \${item.costCoins}</button>\`
              }
            </div>
          </div>
        \`;
        box.appendChild(card);
      });
    }

    function renderCatsAndEvents() {
      // Meters
      const mBox = document.getElementById('catsMetersContainer');
      mBox.innerHTML = \`
        <div class="space-y-2">
          <div>
            <div class="flex justify-between text-[11px] font-medium text-[#6B533E] mb-0.5">
              <span>🐟 猫咪全员饱腹度</span>
              <span class="font-bold text-amber-700 font-mono">\${catSatiety} %</span>
            </div>
            <div class="w-full h-2 bg-[#EFE7D8] rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style="width: \${catSatiety}%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-[11px] font-medium text-[#6B533E] mb-0.5">
              <span>💖 猫咪心满意足度</span>
              <span class="font-bold text-rose-600 font-mono">\${catMood} %</span>
            </div>
            <div class="w-full h-2 bg-[#EFE7D8] rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full" style="width: \${catMood}%"></div>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-1">
            <button onclick="feedCat()" class="flex-1 py-1.5 rounded-xl bg-[#FAF4EB] hover:bg-[#F3EADA] border border-[#E5DAC8] text-xs font-bold text-[#5C4434] cursor-pointer active:scale-95">
              🥣 喂食冻干 (-20🪙)
            </button>
            <button onclick="petCat()" class="flex-1 py-1.5 rounded-xl bg-[#FAF4EB] hover:bg-[#F3EADA] border border-[#E5DAC8] text-xs font-bold text-[#5C4434] cursor-pointer active:scale-95">
              🐾 摸头逗猫 (+5🪙)
            </button>
          </div>
        </div>
      \`;

      // Events list
      const eBox = document.getElementById('eventsCardsContainer');
      eBox.innerHTML = '';
      let unlockedEvtCount = 0;
      CUSTOMER_EVENTS.forEach(evt => {
        const isUnlocked = unlockedStages.size >= evt.unlockStageReq;
        if (isUnlocked) unlockedEvtCount++;
        const card = document.createElement('div');
        card.className = 'w-full p-2.5 rounded-2xl border transition-all ' +
          (isUnlocked ? 'bg-[#FFFDF9] border-[#D9CDB8]' : 'bg-[#F5F2EB]/50 border-[#E8DEC8]/50 opacity-60');

        card.innerHTML = \`
          <div class="flex items-start gap-2">
            <span class="text-lg">\${evt.icon}</span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold text-[#3B2C20]">\${evt.title}</h4>
                <span class="text-[9px] text-[#A38E7A]">\${evt.guest}</span>
              </div>
              <p class="text-[10px] text-[#6B533E] mt-0.5 leading-relaxed">\${isUnlocked ? evt.log : '完成空间施工阶段 ' + evt.unlockStageReq + ' 后解锁见闻'}</p>
            </div>
          </div>
        \`;
        eBox.appendChild(card);
      });
      document.getElementById('eventsCountText').innerText = '解锁 ' + unlockedEvtCount + ' / ' + CUSTOMER_EVENTS.length;
    }

    function feedCat() {
      if (coins < 20) { alert('金币不足，先去连连看赚点金币吧！'); return; }
      coins -= 20;
      catSatiety = Math.min(100, catSatiety + 15);
      sound.playMeow(620);
      const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      journalLogs.push('【' + timeStr + ' 投喂】递上了一小份金枪鱼冻干，两只小猫吃得津津有味 (饱腹度 ' + catSatiety + '%)');
      saveState();
      renderJournal();
    }

    function petCat() {
      coins += 5;
      catMood = Math.min(100, catMood + 10);
      sound.playMeow(780);
      const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      journalLogs.push('【' + timeStr + ' 逗猫】轻轻抚摸了小猫的下巴，发出了清脆的呼噜呼噜声 (+5 🪙)');
      saveState();
      renderJournal();
    }

    window.unlockStage = function(id) {
      const stage = JOURNAL_STAGES.find(s => s.id === id);
      if (!stage) return;
      if (stars >= stage.costStars && coins >= stage.costCoins) {
        stars -= stage.costStars;
        coins -= stage.costCoins;
        unlockedStages.add(stage.id);
        journalLogs.push(stage.log);
        sound.playVictory();
        if (stage.catId) setTimeout(() => sound.playMeow(650), 300);
        saveState();
        renderJournal();
      }
    };

    window.unlockDrink = function(id) {
      const d = DRINK_MENU.find(m => m.id === id);
      if (!d) return;
      if (coins >= d.costCoins) {
        coins -= d.costCoins;
        unlockedDrinks.add(d.id);
        sound.playVictory();
        const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        journalLogs.push('【' + timeStr + ' 研发】成功推出新饮品「' + d.name + '」！被动营收 +' + d.passiveCoinRate + ' 币/分');
        saveState();
        renderJournal();
      }
    };

    // --- 5. Hardcore LianLianKan Engine ---
    const ICONS = ['☕', '🍰', '🥐', '🍩', '🐾', '🥛', '🍓', '🍵', '🍪', '🥪', '🧁', '🍯'];
    let rows = 6, cols = 6;
    let grid = [], frozenMap = [];
    let selectedTile = null;
    let clearedCount = 0, totalPairs = 18;
    let timeLeft = 90, movesLeft = 25;
    let currentLevelConfig = CAFE_LEVELS[0];
    let isFrozen = false;
    let timerInterval = null;
    let score = 0, combo = 0;
    let hintsLeft = 3, shufflesLeft = 2, freezesLeft = 1;

    function isLineEmpty(g, p1, p2) {
      if (p1.r === p2.r) {
        const minC = Math.min(p1.c, p2.c), maxC = Math.max(p1.c, p2.c);
        for (let c = minC + 1; c < maxC; c++) if (g[p1.r][c] !== 0) return false;
        return true;
      }
      if (p1.c === p2.c) {
        const minR = Math.min(p1.r, p2.r), maxR = Math.max(p1.r, p2.r);
        for (let r = minR + 1; r < maxR; r++) if (g[r][p1.c] !== 0) return false;
        return true;
      }
      return false;
    }
    function check0Turn(g, p1, p2) {
      if ((p1.r === p2.r || p1.c === p2.c) && isLineEmpty(g, p1, p2)) return [p1, p2];
      return null;
    }
    function check1Turn(g, p1, p2) {
      const c1 = { r: p1.r, c: p2.c };
      if (g[c1.r][c1.c] === 0 && isLineEmpty(g, p1, c1) && isLineEmpty(g, c1, p2)) return [p1, c1, p2];
      const c2 = { r: p2.r, c: p1.c };
      if (g[c2.r][c2.c] === 0 && isLineEmpty(g, p1, c2) && isLineEmpty(g, c2, p2)) return [p1, c2, p2];
      return null;
    }
    function check2Turn(g, p1, p2) {
      const dirs = [{dr: -1, dc: 0}, {dr: 1, dc: 0}, {dr: 0, dc: -1}, {dr: 0, dc: 1}];
      let best = null, minDist = Infinity;
      for (const d of dirs) {
        let cr = p1.r + d.dr, cc = p1.c + d.dc;
        while (cr >= 0 && cr <= rows + 1 && cc >= 0 && cc <= cols + 1) {
          if (g[cr][cc] !== 0) break;
          const s1 = { r: cr, c: cc };
          const sub = check1Turn(g, s1, p2);
          if (sub) {
            const dist = Math.abs(p1.r - cr) + Math.abs(p1.c - cc) + Math.abs(cr - sub[1].r) + Math.abs(cc - sub[1].c) + Math.abs(sub[1].r - p2.r) + Math.abs(sub[1].c - p2.c);
            if (dist < minDist) { minDist = dist; best = [p1, s1, sub[1], p2]; }
          }
          cr += d.dr; cc += d.dc;
        }
      }
      return best;
    }
    function findPath(g, p1, p2) {
      if (p1.r === p2.r && p1.c === p2.c) return null;
      if (g[p1.r][p1.c] <= 0 || g[p1.r][p1.c] !== g[p2.r][p2.c]) return null;
      const p0 = check0Turn(g, p1, p2); if (p0) return p0;
      const p1Turn = check1Turn(g, p1, p2); if (p1Turn) return p1Turn;
      return check2Turn(g, p1, p2);
    }

    // Canvas laser
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [], activeLine = null, cellSize = 42;

    function renderCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (activeLine) {
        activeLine.opacity -= 0.04;
        if (activeLine.opacity <= 0) activeLine = null;
        else {
          ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.globalAlpha = activeLine.opacity;
          ctx.strokeStyle = '#FBBF24'; ctx.lineWidth = 6;
          ctx.shadowColor = '#F59E0B'; ctx.shadowBlur = 16;
          ctx.beginPath();
          activeLine.pts.forEach((pt, i) => { if (i === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
          ctx.stroke();
          ctx.lineWidth = 3; ctx.strokeStyle = '#FFFDF5'; ctx.stroke();
          ctx.restore();
        }
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++; p.x += p.vx; p.y += p.vy; p.alpha = 1 - p.life / p.maxLife;
        if (p.life >= p.maxLife) particles.splice(i, 1);
        else {
          ctx.save(); ctx.globalAlpha = p.alpha;
          if (p.isPaw) { ctx.font = '13px sans-serif'; ctx.fillText('🐾', p.x, p.y); }
          else { ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
          ctx.restore();
        }
      }
      requestAnimationFrame(renderCanvas);
    }
    requestAnimationFrame(renderCanvas);

    function triggerSparks(center) {
      for (let i = 0; i < 16; i++) {
        const angle = Math.random() * Math.PI * 2, spd = 2 + Math.random() * 4;
        particles.push({
          x: center.x, y: center.y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
          color: ['#F59E0B', '#FBBF24', '#38BDF8', '#FFFDF8'][Math.floor(Math.random() * 4)],
          size: 2.5 + Math.random() * 2.5, life: 0, maxLife: 20 + Math.random() * 10, alpha: 1,
          isPaw: i % 4 === 0
        });
      }
    }

    function initPuzzle(lvlNum = currentLevel) {
      currentLevel = lvlNum;
      currentLevelConfig = CAFE_LEVELS.find(l => l.level === currentLevel) || CAFE_LEVELS[0];
      rows = currentLevelConfig.rows;
      cols = currentLevelConfig.cols;
      clearedCount = 0;
      totalPairs = currentLevelConfig.pairs;
      score = 0; combo = 0;
      hintsLeft = 3; shufflesLeft = 2; freezesLeft = 1;
      selectedTile = null;

      document.getElementById('puzzleLevelTitle').innerText = '第 ' + currentLevel + ' 关 · ' + currentLevelConfig.name;
      document.getElementById('modeBadge').innerText = currentLevelConfig.mode === 'moves' ? '步数模式' : '限时模式';

      if (currentLevelConfig.mode === 'moves') {
        movesLeft = currentLevelConfig.movesLimit || 30;
        document.getElementById('timerText').innerText = movesLeft + ' 步';
      } else {
        timeLeft = currentLevelConfig.timeLimit || 90;
        isFrozen = false;
        const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        const s = String(timeLeft % 60).padStart(2, '0');
        document.getElementById('timerText').innerText = m + ':' + s;
      }

      // Generate board
      grid = Array.from({ length: rows + 2 }, () => Array(cols + 2).fill(0));
      frozenMap = Array.from({ length: rows + 2 }, () => Array(cols + 2).fill(false));

      const totalInnerCells = rows * cols;
      const obstacles = currentLevelConfig.obstacleCount || 0;
      const playable = totalInnerCells - obstacles;
      const actualPairs = Math.floor(playable / 2);

      const pool = [];
      const distinctTypes = Math.min(ICONS.length, Math.max(6, Math.floor(actualPairs / 3)));
      for (let i = 0; i < actualPairs; i++) {
        const t = (i % distinctTypes) + 1;
        pool.push(t, t);
      }
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }

      let pIdx = 0;
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
          if (obstacles > 0 && Math.random() < (obstacles / totalInnerCells) && pIdx < pool.length) {
            // place obstacle
            grid[r][c] = -1; // -1 represents crate
          } else if (pIdx < pool.length) {
            grid[r][c] = pool[pIdx++];
          }
        }
      }

      // Distribute frozen tiles
      let fCount = currentLevelConfig.frozenCount || 0;
      while (fCount > 0) {
        const rr = Math.floor(Math.random() * rows) + 1;
        const cc = Math.floor(Math.random() * cols) + 1;
        if (grid[rr][cc] > 0 && !frozenMap[rr][cc]) {
          frozenMap[rr][cc] = true;
          fCount--;
        }
      }

      updateBadges();
      resizeBoard();
      renderTiles();

      if (timerInterval) clearInterval(timerInterval);
      if (currentLevelConfig.mode === 'time') {
        timerInterval = setInterval(() => {
          if (!isFrozen && timeLeft > 0) {
            timeLeft--;
            const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
            const s = String(timeLeft % 60).padStart(2, '0');
            document.getElementById('timerText').innerText = m + ':' + s;
            if (timeLeft === 0) {
              clearInterval(timerInterval);
              alert('时间耗尽！猫咪们想要再试一次！');
              showJournalView();
            }
          }
        }, 1000);
      }
    }

    function updateBadges() {
      document.getElementById('badgeHint').innerText = 'x' + hintsLeft;
      document.getElementById('badgeShuffle').innerText = 'x' + shufflesLeft;
      document.getElementById('badgeFreeze').innerText = 'x' + freezesLeft;
      document.getElementById('scoreText').innerText = '得分: ' + score;
      document.getElementById('pairProgress').innerText = clearedCount + ' / ' + totalPairs;
      const pct = Math.min(100, (clearedCount / totalPairs) * 100);
      document.getElementById('clearanceBar').style.width = pct + '%';
    }

    function resizeBoard() {
      const cont = document.getElementById('boardContainer');
      const maxW = cont.clientWidth - 12;
      const maxH = cont.clientHeight - 12;
      cellSize = Math.min(48, Math.floor(Math.min(maxW / (cols + 2), maxH / (rows + 2))));
      const bW = cellSize * (cols + 2), bH = cellSize * (rows + 2);
      const bInner = document.getElementById('boardInner');
      bInner.style.width = bW + 'px'; bInner.style.height = bH + 'px';
      canvas.width = cont.clientWidth; canvas.height = cont.clientHeight;
    }

    function renderTiles() {
      const wrapper = document.getElementById('tilesWrapper');
      wrapper.innerHTML = '';
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
          const v = grid[r][c];
          if (v === 0) continue;
          const isObstacle = v === -1;
          const isIce = frozenMap[r][c];

          const btn = document.createElement('button');
          btn.id = 'tile-' + r + '-' + c;
          btn.style.left = (c * cellSize) + 'px';
          btn.style.top = (r * cellSize) + 'px';
          btn.style.width = cellSize + 'px';
          btn.style.height = cellSize + 'px';
          btn.className = 'absolute p-0.5 cursor-pointer transition-transform active:scale-95';

          const inner = document.createElement('div');
          const isSel = selectedTile && selectedTile.r === r && selectedTile.c === c;

          if (isObstacle) {
            inner.className = 'w-full h-full rounded-xl flex items-center justify-center text-sm font-bold bg-[#8B5A2B] border border-[#5C3D26] shadow-inner opacity-90';
            inner.innerText = '📦';
          } else {
            inner.className = 'relative w-full h-full rounded-xl flex items-center justify-center text-lg font-bold transition-all ' +
              (isSel ? 'bg-[#FFFDF5] border-2 border-amber-400 ring-2 ring-amber-300 shadow-md scale-105' :
               'bg-[#FFFDF8] hover:bg-[#FAF6EE] border border-[#8C6541] shadow-xs');
            inner.innerText = ICONS[(v - 1) % ICONS.length];

            if (isIce) {
              const iceBadge = document.createElement('div');
              iceBadge.className = 'absolute inset-0 rounded-xl bg-cyan-200/40 border-2 border-cyan-400 pointer-events-none flex items-center justify-center text-[10px] font-black text-cyan-900';
              iceBadge.innerText = '🧊';
              inner.appendChild(iceBadge);
            }
          }

          btn.appendChild(inner);
          if (!isObstacle) {
            btn.onclick = () => onTileClick(r, c);
          }
          wrapper.appendChild(btn);
        }
      }
    }

    function getCanvasPointsForPath(path) {
      const canvasRect = canvas.getBoundingClientRect();
      const bInner = document.getElementById('boardInner');
      const bRect = bInner.getBoundingClientRect();
      const cellW = bRect.width / (cols + 2);
      const cellH = bRect.height / (rows + 2);

      return path.map(pt => {
        const el = document.getElementById('tile-' + pt.r + '-' + pt.c);
        if (el) {
          const tRect = el.getBoundingClientRect();
          return {
            x: tRect.left + tRect.width / 2 - canvasRect.left,
            y: tRect.top + tRect.height / 2 - canvasRect.top
          };
        }
        return {
          x: bRect.left + (pt.c + 0.5) * cellW - canvasRect.left,
          y: bRect.top + (pt.r + 0.5) * cellH - canvasRect.top
        };
      });
    }

    function onTileClick(r, c) {
      if (grid[r][c] <= 0) return;
      sound.playSelect();
      if (!selectedTile) {
        selectedTile = { r, c }; renderTiles(); return;
      }
      if (selectedTile.r === r && selectedTile.c === c) {
        selectedTile = null; renderTiles(); return;
      }

      // Check moves limit
      if (currentLevelConfig.mode === 'moves') {
        movesLeft--;
        document.getElementById('timerText').innerText = movesLeft + ' 步';
      }

      const path = findPath(grid, selectedTile, { r, c });
      if (path) {
        const p1 = selectedTile, p2 = { r, c };
        const canvasPts = getCanvasPointsForPath(path);
        activeLine = { pts: canvasPts, opacity: 1 };
        triggerSparks(canvasPts[0]); triggerSparks(canvasPts[canvasPts.length - 1]);

        const p1Ice = frozenMap[p1.r][p1.c];
        const p2Ice = frozenMap[p2.r][p2.c];

        if (p1Ice || p2Ice) {
          sound.playIceCrack();
          if (p1Ice) frozenMap[p1.r][p1.c] = false; else grid[p1.r][p1.c] = 0;
          if (p2Ice) frozenMap[p2.r][p2.c] = false; else grid[p2.r][p2.c] = 0;
          score += 60;
        } else {
          grid[p1.r][p1.c] = 0; grid[p2.r][p2.c] = 0;
          clearedCount++; combo++;
          score += 100 + (combo - 1) * 35;
          sound.playMatch(combo);
        }

        selectedTile = null;
        renderTiles();
        updateBadges();

        if (clearedCount >= totalPairs) {
          if (timerInterval) clearInterval(timerInterval);
          sound.playVictory();
          const earnedStars = currentLevelConfig.starsReward || 3;
          let earnedCoins = currentLevelConfig.coinsReward || 120;
          // Apply drink bonuses
          DRINK_MENU.forEach(d => { if (unlockedDrinks.has(d.id)) earnedCoins += d.bonusCoinPerLevel; });

          stars += earnedStars;
          coins += earnedCoins;
          document.getElementById('vicStarsEarned').innerText = '+' + earnedStars + ' 星光灵感';
          document.getElementById('vicCoinsEarned').innerText = '+' + earnedCoins + ' 营业金币';

          const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
          journalLogs.push('【' + timeStr + ' 采购】第 ' + currentLevel + ' 关食材采购大获全胜！(+' + earnedStars + ' ⭐, +' + earnedCoins + ' 🪙)');
          saveState();
          document.getElementById('modalVictory').classList.remove('hidden');
        } else if (currentLevelConfig.mode === 'moves' && movesLeft <= 0) {
          alert('步数耗尽！再接再厉喵！');
          showJournalView();
        }
      } else {
        selectedTile = { r, c }; renderTiles();
        if (currentLevelConfig.mode === 'moves' && movesLeft <= 0) {
          alert('步数用完啦！');
          showJournalView();
        }
      }
    }

    // Power-ups
    document.getElementById('btnHint').onclick = () => {
      if (hintsLeft <= 0) return;
      for (let r1 = 1; r1 <= rows; r1++) {
        for (let c1 = 1; c1 <= cols; c1++) {
          if (grid[r1][c1] <= 0) continue;
          for (let r2 = 1; r2 <= rows; r2++) {
            for (let c2 = 1; c2 <= cols; c2++) {
              if (r1 === r2 && c1 === c2) continue;
              if (grid[r1][c1] === grid[r2][c2]) {
                const path = findPath(grid, { r: r1, c: c1 }, { r: r2, c: c2 });
                if (path) {
                  hintsLeft--; updateBadges();
                  activeLine = { pts: getCanvasPointsForPath(path), opacity: 1 };
                  return;
                }
              }
            }
          }
        }
      }
    };

    document.getElementById('btnShuffle').onclick = () => {
      if (shufflesLeft <= 0) return;
      shufflesLeft--;
      const remaining = [];
      for (let r = 1; r <= rows; r++) for (let c = 1; c <= cols; c++) if (grid[r][c] > 0) remaining.push(grid[r][c]);
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      let idx = 0;
      for (let r = 1; r <= rows; r++) for (let c = 1; c <= cols; c++) if (grid[r][c] > 0) grid[r][c] = remaining[idx++];
      updateBadges(); renderTiles();
    };

    document.getElementById('btnFreeze').onclick = () => {
      if (freezesLeft <= 0) return;
      freezesLeft--;
      if (currentLevelConfig.mode === 'moves') {
        movesLeft += 6;
        document.getElementById('timerText').innerText = movesLeft + ' 步';
      } else {
        isFrozen = true; timeLeft += 15;
        document.getElementById('freezeText').innerText = '冰冻中';
        setTimeout(() => { isFrozen = false; document.getElementById('freezeText').innerText = '加时/步'; }, 10000);
      }
      updateBadges();
    };

    // View Transitions
    function showJournalView() {
      document.getElementById('viewJournal').classList.remove('hidden');
      document.getElementById('viewPuzzle').classList.add('hidden');
      if (timerInterval) clearInterval(timerInterval);
      renderJournal();
    }
    function showPuzzleView(lvl = currentLevel) {
      document.getElementById('viewJournal').classList.add('hidden');
      document.getElementById('viewPuzzle').classList.remove('hidden');
      initPuzzle(lvl);
    }

    // Modal Level Select
    document.getElementById('btnLevelSelect').onclick = () => {
      const list = document.getElementById('levelSelectList');
      list.innerHTML = '';
      CAFE_LEVELS.forEach(lvl => {
        const btn = document.createElement('button');
        const isCurrent = lvl.level === currentLevel;
        btn.className = 'p-2 rounded-xl border flex flex-col items-center justify-center cursor-pointer ' +
          (isCurrent ? 'bg-amber-100 border-amber-500 font-bold text-amber-900 shadow-xs' : 'bg-[#FAF4EB] border-[#D9CDB8] text-[#5C4434] hover:bg-[#F3EADA]');
        btn.innerHTML = \`<span class="text-xs font-mono font-bold">\${lvl.level}</span><span class="text-[9px]">\${lvl.mode === 'moves' ? '步数' : '限时'}</span>\`;
        btn.onclick = () => {
          document.getElementById('modalLevelSelect').classList.add('hidden');
          showPuzzleView(lvl.level);
        };
        list.appendChild(btn);
      });
      document.getElementById('modalLevelSelect').classList.remove('hidden');
    };

    // Event Bindings
    document.getElementById('btnStartProcure').onclick = () => showPuzzleView(currentLevel);
    document.getElementById('btnBackToJournal').onclick = () => showJournalView();
    document.getElementById('btnBackToJournalFromVic').onclick = () => {
      document.getElementById('modalVictory').classList.add('hidden');
      showJournalView();
    };
    document.getElementById('btnNextLevel').onclick = () => {
      document.getElementById('modalVictory').classList.add('hidden');
      currentLevel = Math.min(30, currentLevel + 1);
      showPuzzleView(currentLevel);
    };

    const toggleSound = () => {
      sound.enabled = !sound.enabled;
      const text = sound.enabled ? '🔊' : '🔇';
      document.getElementById('btnToggleSoundJournal').innerText = text;
      document.getElementById('btnToggleSoundPuzzle').innerText = text;
    };
    document.getElementById('btnToggleSoundJournal').onclick = toggleSound;
    document.getElementById('btnToggleSoundPuzzle').onclick = toggleSound;

    window.onresize = () => {
      if (!document.getElementById('viewPuzzle').classList.contains('hidden')) {
        resizeBoard(); renderTiles();
      }
    };

    showJournalView();
  </script>
</body>
</html>`;
}
