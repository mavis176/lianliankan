(function(){
"use strict";
// ========================================================
    // ZERO-DEPENDENCY PURE JAVASCRIPT ENGINE
    // - Robust LocalStorage Save / Pure Initial State Architecture
    // - Dedicated Title / Splash Screen with Floating Cat Cup
    // - Endless Chain Branches System (Theme Switching & Rebirth)
    // - Multi-Tier Facility Upgrades (Lv.1 to Lv.3 Stars)
    // - Alley Stray Cat Gacha & Infinite Adoption
    // - Procedural LianLianKan (100+ Levels, Deadlock Reshuffle)
    // ========================================================

    // --- 1. Web Audio Synthesizer ---
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
      playMatch() {
        if (!this.enabled) return;
        const c = this.getCtx(); if (!c) return;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const o = c.createOscillator(), g = c.createGain();
          o.type = 'triangle'; o.frequency.value = freq;
          const t = c.currentTime + i * 0.04;
          g.gain.setValueAtTime(0.1, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
          o.connect(g); g.connect(c.destination);
          o.start(t); o.stop(t + 0.14);
        });
      }
      playError() {
        if (!this.enabled) return;
        const c = this.getCtx(); if (!c) return;
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(200, c.currentTime);
        o.frequency.linearRampToValueAtTime(140, c.currentTime + 0.12);
        g.gain.setValueAtTime(0.08, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + 0.13);
      }
      playVictory() {
        if (!this.enabled) return;
        const c = this.getCtx(); if (!c) return;
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        notes.forEach((f, idx) => {
          const o = c.createOscillator(), g = c.createGain();
          o.type = 'sine'; o.frequency.value = f;
          const t = c.currentTime + idx * 0.07;
          g.gain.setValueAtTime(0.15, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          o.connect(g); g.connect(c.destination);
          o.start(t); o.stop(t + 0.38);
        });
      }
      playMeow(pitch = 600) {
        if (!this.enabled) return;
        const c = this.getCtx(); if (!c) return;
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(pitch, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(pitch * 1.35, c.currentTime + 0.12);
        o.frequency.exponentialRampToValueAtTime(pitch * 0.9, c.currentTime + 0.28);
        g.gain.setValueAtTime(0.14, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + 0.32);
      }
    }
    const sound = new SoundManager();

    // Trigger container vibration if available
    function triggerHaptic(style = 'light') {
      try {
        if (window.xhs && typeof window.xhs.vibrateShort === 'function') {
          window.xhs.vibrateShort({ style });
        } else if (navigator.vibrate) {
          navigator.vibrate(style === 'heavy' ? 40 : 15);
        }
      } catch(e) {}
    }

    // --- 2. Base Themes Pool for Endless Chain Branches ---
    const BASE_THEMES = [
      {
        id: 'theme_wood',
        namePrefix: '老街·暖阳木质猫咖',
        icon: '🪵',
        tag: '原木质朴',
        facilities: [
          {
            key: 'floor',
            name: '胡桃木地板',
            icon: '🪵',
            tiers: [
              { name: '简易松木条', desc: '打扫旧水泥，铺上散发松木香的基础地板', costStars: 1, costCoins: 60 },
              { name: '胡桃木实木板', desc: '深色哑光涂层，耐磨防滑，脚步声温润柔和', costStars: 3, costCoins: 200 },
              { name: '鱼骨实木地热拼贴', desc: '手工严丝拼贴，冬日自带地暖，猫咪整天贴地躺', costStars: 6, costCoins: 500 }
            ]
          },
          {
            key: 'bar',
            name: '吧台操作台',
            icon: '☕',
            tiers: [
              { name: '简易原木板工作台', desc: '基础实木台面，内置单孔洗槽', costStars: 1, costCoins: 90 },
              { name: '磨砂胡桃木一体吧台', desc: '边缘手工打磨倒圆角，手感细腻厚实', costStars: 3, costCoins: 260 },
              { name: '黄铜收边典藏水吧台', desc: '古典黄铜包边与暖黄内嵌灯带，香气袅袅', costStars: 6, costCoins: 650 }
            ]
          },
          {
            key: 'grinder',
            name: '咖啡磨豆萃取',
            icon: '⚙️',
            tiers: [
              { name: '复古手摇铸铁磨', desc: '纯手工慢磨细摇，坚果油脂初绽', costStars: 2, costCoins: 140 },
              { name: '平刀商用电动磨豆机', desc: '64mm平刀温控研磨，风味萃取倍增', costStars: 4, costCoins: 380 },
              { name: '双头蒸汽意式怪兽机', desc: '双锅炉连续出杯，整条老街都弥漫浓醇香气', costStars: 8, costCoins: 900 }
            ]
          },
          {
            key: 'sofa',
            name: '窗边客座沙发',
            icon: '🛋️',
            tiers: [
              { name: '原木亚麻单人位', desc: '简单透气，适合午后独自发呆', costStars: 2, costCoins: 160 },
              { name: '焦糖灯芯绒双人软座', desc: '高弹海绵承托，陷进去就不想起来', costStars: 4, costCoins: 420 },
              { name: '鹅绒复古大转角沙发', desc: '尊享宽厚鹅绒包覆，猫咪客人共同依偎', costStars: 8, costCoins: 1000 }
            ]
          },
          {
            key: 'cattree',
            name: '通顶活动猫爬架',
            icon: '🏰',
            tiers: [
              { name: '剑麻抓柱与单层平台', desc: '天然原麻抓柱，满足基础磨爪需求', costStars: 2, costCoins: 180 },
              { name: '多层云朵太空舱爬架', desc: '全透明悬空亚克力碗，从底下看粉嫩肉垫', costStars: 5, costCoins: 480 },
              { name: '室内森林通顶猫城堡', desc: '跨墙悬空吊桥与云端瞭望塔，猫咪全场巡视', costStars: 8, costCoins: 1200 }
            ]
          }
        ]
      },
      {
        id: 'theme_ocean',
        namePrefix: '海滨·夏日微风猫咖',
        icon: '🌊',
        tag: '白蓝海风',
        facilities: [
          {
            key: 'floor',
            name: '海风木甲板',
            icon: '⚓',
            tiers: [
              { name: '防潮白漆木甲板', desc: '淡淡海蓝色水洗纹理，清凉怡人', costStars: 2, costCoins: 120 },
              { name: '海洋渐变耐磨地板', desc: '仿佛踏上海浪波光，赤足触感舒适', costStars: 4, costCoins: 320 },
              { name: '贝壳晶石漫步栈道', desc: '镶嵌纯天然海贝碎晶，阳光下波光粼粼', costStars: 7, costCoins: 750 }
            ]
          },
          {
            key: 'bar',
            name: '浮木贝壳吧台',
            icon: '🍹',
            tiers: [
              { name: '漂流木拼接水吧', desc: '粗粝海洋漂流木手工组装，质朴自然', costStars: 2, costCoins: 150 },
              { name: '蓝白环形贝壳操作台', desc: '镶嵌海玻璃与白贝壳，清新唯美', costStars: 4, costCoins: 390 },
              { name: '全景珊瑚透光艺术水吧', desc: '内置微型活体水族箱，透出幽蓝光影', costStars: 7, costCoins: 850 }
            ]
          },
          {
            key: 'grinder',
            name: '冷萃冰滴萃取塔',
            icon: '🧊',
            tiers: [
              { name: '双柱荷兰木架冰滴', desc: '一秒一滴缓慢凝结纯净咖啡风味', costStars: 3, costCoins: 200 },
              { name: '多联阀精准冷萃系统', desc: '持续萃取海洋果酸冷萃拼配', costStars: 5, costCoins: 480 },
              { name: '液氮极速锁鲜冷萃舱', desc: '瞬间封存热带水果花香香气', costStars: 8, costCoins: 1100 }
            ]
          },
          {
            key: 'sofa',
            name: '露天遮阳帆布椅',
            icon: '🏖️',
            tiers: [
              { name: '蓝白条纹折叠沙滩椅', desc: '清爽透气，尽享海风抚面', costStars: 2, costCoins: 150 },
              { name: '编织藤条半包围吊床', desc: '悬空轻轻摇晃，猫咪在肚皮上呼噜', costStars: 5, costCoins: 450 },
              { name: '全景海景圆形日光大软塌', desc: '可容纳多只猫咪一起享受暖阳日光浴', costStars: 8, costCoins: 1150 }
            ]
          },
          {
            key: 'cattree',
            name: '海浪栈桥猫爬架',
            icon: '⛵',
            tiers: [
              { name: '原木船舵瞭望台', desc: '水手风木桩配以纯棉麻绳', costStars: 3, costCoins: 220 },
              { name: '帆船绳梯攀爬网络', desc: '悬空跳网如桅杆航行，锻炼猫咪身手', costStars: 5, costCoins: 520 },
              { name: '飞跃海浪悬空浮桥', desc: '从天花板横跨全店的通顶灯塔乐园', costStars: 8, costCoins: 1300 }
            ]
          }
        ]
      },
      {
        id: 'theme_forest',
        namePrefix: '森林·绿意树屋猫咖',
        icon: '🌿',
        tag: '自然树屋',
        facilities: [
          {
            key: 'floor',
            name: '原生态年轮木桩地',
            icon: '🪵',
            tiers: [
              { name: '碎石与松针铺面', desc: '野性森林初印象，脚踏松软芬芳', costStars: 2, costCoins: 140 },
              { name: '年轮原木整切地砖', desc: '保留树木自然年轮，质朴沉静', costStars: 4, costCoins: 360 },
              { name: '恒湿活体苔藓玻璃地板', desc: '透过强化玻璃可见下方青翠微观苔藓森林', costStars: 7, costCoins: 800 }
            ]
          },
          {
            key: 'bar',
            name: '百年古树桩吧台',
            icon: '🍵',
            tiers: [
              { name: '苔藓树桩原始桌面', desc: '保留天然树皮与青翠苔藓边', costStars: 2, costCoins: 180 },
              { name: '香樟古木整体打磨台', desc: '散发古朴木香，纹理如行云流水', costStars: 5, costCoins: 460 },
              { name: '垂藤飞瀑活水生态吧', desc: '水流沿着岩壁潺潺流下，小猫追逐小鱼游动', costStars: 8, costCoins: 1050 }
            ]
          },
          {
            key: 'grinder',
            name: '炭火慢焙萃取器',
            icon: '🔥',
            tiers: [
              { name: '柴烧铁网慢摇烘焙', desc: '木柴燃烧的烟熏焦糖风味', costStars: 3, costCoins: 240 },
              { name: '红外炭火恒温烘焙机', desc: '精准锁定每一颗原产地风味豆', costStars: 5, costCoins: 550 },
              { name: '古法石磨慢速冷萃组', desc: '缓慢研磨不发热，保留纯正野莓果香', costStars: 8, costCoins: 1250 }
            ]
          },
          {
            key: 'sofa',
            name: '藤蔓秋千吊椅',
            icon: '🪑',
            tiers: [
              { name: '麻绳实木秋千板', desc: '挂在粗壮树枝上，荡漾午后惬意', costStars: 3, costCoins: 210 },
              { name: '鸟巢包裹式编织吊椅', desc: '如同沉浸在温暖鸟巢中，安稳静谧', costStars: 5, costCoins: 510 },
              { name: '悬浮树屋软绵大座舱', desc: '嵌在巨木深处，厚实软垫与阳光相伴', costStars: 9, costCoins: 1280 }
            ]
          },
          {
            key: 'cattree',
            name: '参天巨木栖息架',
            icon: '🌳',
            tiers: [
              { name: '原生树丫攀爬架', desc: '顺着天然枝干上下跳跃', costStars: 3, costCoins: 260 },
              { name: '跨墙悬空树屋通道', desc: '猫咪在树洞与空中管道自如穿梭', costStars: 6, costCoins: 600 },
              { name: '森林神木全景巨型乐园', desc: '延伸至天花板的森林乐园，枝头挂满猫咪美梦', costStars: 9, costCoins: 1400 }
            ]
          }
        ]
      },
      {
        id: 'theme_jazz',
        namePrefix: '深夜·复古爵士猫咖',
        icon: '🎷',
        tag: '微醺爵士',
        facilities: [
          {
            key: 'floor',
            name: '黑白爵士地砖',
            icon: '♟️',
            tiers: [
              { name: '黑白哑光石拼砖', desc: '经典黑白拼花，优雅复古', costStars: 2, costCoins: 180 },
              { name: '菱形大理石金线地板', desc: '微光下折射低调奢华的金线', costStars: 5, costCoins: 420 },
              { name: '微醺胡桃木拼黑胶纹', desc: '木纹如唱片同心圆，猫爪踩踏轻盈生姿', costStars: 8, costCoins: 950 }
            ]
          },
          {
            key: 'bar',
            name: '黑胶唱片吧台',
            icon: '🍸',
            tiers: [
              { name: '复古胶木黄铜吧台', desc: '黄铜脚踏与暖黄酒保灯', costStars: 3, costCoins: 220 },
              { name: '黑胶唱片手工压制台', desc: '台面封入经典老唱片，极具年代感', costStars: 5, costCoins: 520 },
              { name: '流光律动波形水吧', desc: '随着爵士旋律轻轻泛起微光的夜市吧台', costStars: 8, costCoins: 1200 }
            ]
          },
          {
            key: 'grinder',
            name: '古董留声萃取组',
            icon: '📻',
            tiers: [
              { name: '手摇铜喇叭唱机磨豆', desc: '旋转把手，黑胶沙沙流淌', costStars: 3, costCoins: 260 },
              { name: '双声道电子管咖啡机', desc: '真空管散发橙红暖光，深烘咖啡回甘悠长', costStars: 6, costCoins: 600 },
              { name: '传奇爵士母盘原音萃取塔', desc: '醇厚坚果与微醺朗姆香交融无界', costStars: 9, costCoins: 1350 }
            ]
          },
          {
            key: 'sofa',
            name: '深红丝绒卡座',
            icon: '🛋️',
            tiers: [
              { name: '墨绿拉扣复古单人椅', desc: '深沉优雅，坐感极佳', costStars: 3, costCoins: 240 },
              { name: '勃艮第红丝绒双人长椅', desc: '垂顺丝绒，深邃迷离', costStars: 6, costCoins: 560 },
              { name: '爵士环形沉浸包厢', desc: '弧形围合，小猫窝在丝绒靠垫上打呼噜', costStars: 9, costCoins: 1380 }
            ]
          },
          {
            key: 'cattree',
            name: '琴键五线谱猫道',
            icon: '🎹',
            tiers: [
              { name: '黑白琴键墙面跳板', desc: '猫咪每踩一步宛如敲击音符', costStars: 3, costCoins: 280 },
              { name: '萨克斯螺旋攀爬柱', desc: '金属光泽螺旋上升，造型别致', costStars: 6, costCoins: 650 },
              { name: '空中五线谱夜光云道', desc: '黑夜中点亮音符，猫咪在五线谱上漫步如舞者', costStars: 9, costCoins: 1500 }
            ]
          }
        ]
      }
    ];

    // --- 3. Generative Stray Cat Pool (Alley Gacha) ---
    const CAT_BREEDS = [
      { breed: '中华田园橘猫', icon: '🐱', colors: ['金黄虎斑', '浅橘白', '纯暖橘'] },
      { breed: '招财三花猫', icon: '🐈', colors: ['黑白橙三色', '玳瑁浅花', '水墨三花'] },
      { breed: '绅士奶牛猫', icon: '🐾', colors: ['黑白对称', '白手套黑背', '小八字脸'] },
      { breed: '神秘玄猫', icon: '🐈‍⬛', colors: ['纯曜石黑', '黑墨泛金', '乌木光泽'] },
      { breed: '富贵金渐层', icon: '✨', colors: ['亮金底绒', '蜜糖金毛', '浅香槟色'] },
      { breed: '优雅布偶猫', icon: '👑', colors: ['海双色', '蓝手套', '丁香重点色'] },
      { breed: '机灵狸花猫', icon: '🐯', colors: ['深褐条纹', '野性虎斑', '黄腹狸花'] },
      { breed: '慵懒银渐层', icon: '☁️', colors: ['浅银白毛', '黑眼线银背', '雪白渐变'] }
    ];

    const CAT_NAMES = [
      '奶黄包', '小碎花', '奥利奥', '玄夜', '发财', '棉花糖', '狮子王', '旺财',
      '芋泥', '麻团', '汤圆', '抹茶', '豆包', '拿铁', '摩卡', '雪球', '煤球',
      '元宝', '布丁', '曲奇', '肉桂', '泡芙', '大福', '年糕', '饭团'
    ];

    const CAT_PERSONALITIES = [
      '贪吃的', '黏人的', '高冷的', '活泼好动的', '呼噜震天的',
      '踩奶狂魔', '好奇心爆棚的', '喜欢晒太阳的', '温顺乖巧的', '傲娇霸道的'
    ];

    const RESCUE_SCENARIOS = [
      '在便利店后门雨棚下，发现了一只正在躲雨探头的小猫，用一小包冻干顺利将它接回了店里！',
      '在老街旧书店的窗台上，一只晒着太阳打呼噜的流浪猫主动蹭了蹭你的手腕，跟着你回了家！',
      '在巷子尽头的花坛旁，听到一声细软的喵呜，拨开叶片发现了一只毛茸茸的小家伙！',
      '在咖啡烘焙坊门口的咖啡麻袋上，发现了一只蜷成毛球睡得正香的流浪猫，轻轻抱回了分店！',
      '在小桥流水边的青石板路上，一只优雅漫步的猫咪和你对视了五秒，然后哒哒哒跑向你！'
    ];

    // --- 4. 20-Emoji Theme Pool for LianLianKan ---
    const THEME_ICONS_20 = [
      '☕', '🍰', '🍩', '🥐', '🥛', '🐾', '🧇', '🥞', '🧋', '🧁',
      '🍪', '🍮', '🍫', '🍓', '🥪', '🍋', '🍒', '🍯', '🍵', '🥨'
    ];

    // --- 5. Procedural Level Formula (100+ Endless) ---
    function generateLevelConfig(level) {
      let rows, cols;
      if (level <= 3) { rows = 4; cols = 6; }
      else if (level <= 8) { rows = 6; cols = 6; }
      else if (level <= 15) { rows = 8; cols = 6; }
      else if (level <= 25) { rows = 8; cols = 8; }
      else if (level <= 40) { rows = 10; cols = 8; }
      else {
        if (level % 2 === 0) { rows = 12; cols = 8; }
        else { rows = 10; cols = 8; }
      }

      let totalSlots = rows * cols;
      if (totalSlots % 2 !== 0) cols += 1;
      totalSlots = rows * cols;

      const pairs = totalSlots / 2;
      const iconTypes = Math.min(20, Math.max(4, Math.floor(4 + level * 0.45)));

      let obstacleCount = 0;
      if (level >= 8) {
        obstacleCount = Math.min(6, Math.floor((level - 7) / 4) * 2);
      }

      let frozenCount = 0;
      if (level >= 12) {
        frozenCount = Math.min(8, Math.floor((level - 10) / 3) * 2);
      }

      const isMovesMode = (level >= 15 && level % 5 === 0);
      const mode = isMovesMode ? 'moves' : 'time';

      let timeLimit = 0;
      let movesLimit = 0;
      if (mode === 'time') {
        const baseTime = Math.round(pairs * 4.2);
        const penalty = Math.min(baseTime * 0.45, (level - 1) * 1.5);
        timeLimit = Math.max(30, Math.round(baseTime - penalty));
      } else {
        const extraMoves = Math.max(6, Math.round(pairs * 0.5 - (level * 0.2)));
        movesLimit = pairs + extraMoves;
      }

      const starsReward = 3;
      const coinsReward = 60 + level * 15;

      const titles = ['初探烘焙', '浓缩油脂', '打发奶泡', '花式拉花', '冷萃滴滤', '私房甜点', '夏日冰调', '深夜暖饮'];
      const title = '关卡 ' + level + ' · ' + titles[(level - 1) % titles.length];

      return {
        level, title, rows, cols, pairs, iconTypes,
        obstacleCount, frozenCount, mode, timeLimit, movesLimit,
        starsReward, coinsReward
      };
    }

    // --- 6. Unified Drinks Menu ---
    const DRINK_MENU = [
      { id: 'drink_pourover', name: '耶加雪菲手冲单品', icon: '☕', level: 1, costCoins: 80, passiveCoinRate: 4, bonusCoinPerLevel: 10, desc: '花香与明亮柑橘调，手冲咖啡入门经典' },
      { id: 'drink_americano', name: '经典冰美式', icon: '🧊', level: 0, costCoins: 200, passiveCoinRate: 7, bonusCoinPerLevel: 15, desc: '深烘拼配浓缩与纯净冰水，醒脑必备' },
      { id: 'drink_latte', name: '丝绒浓郁拿铁', icon: '🥛', level: 0, costCoins: 400, passiveCoinRate: 11, bonusCoinPerLevel: 25, desc: '细腻微奶泡与坚果醇香交织，口感顺滑' },
      { id: 'drink_macchiato', name: '焦糖玛奇朵', icon: '🍯', level: 0, costCoins: 700, passiveCoinRate: 16, bonusCoinPerLevel: 35, desc: '香草风味糖浆覆以手淋海盐焦糖网格' },
      { id: 'drink_matcha', name: '宇治抹茶鲜奶', icon: '🍵', level: 0, costCoins: 1000, passiveCoinRate: 24, bonusCoinPerLevel: 50, desc: '石臼研磨纯抹茶，茶香清冽回甘悠长' },
      { id: 'drink_cocoa_paw', name: '猫爪棉花糖热可可', icon: '🍫', level: 0, costCoins: 1500, passiveCoinRate: 35, bonusCoinPerLevel: 75, desc: '法芙娜可可融化，漂浮手作Q弹猫爪棉花糖' }
    ];

    // --- 7. Pure Initial State Factory & Save/Load System ---
    // Strict Clean Out-of-the-box Default State
    const STORAGE_KEY = 'cat_cafe_save_v1';

    function createPureInitialState() {
      return {
        level: 1,
        maxClearedLevel: 0,
        stars: 0,
        coins: 0,
        cashRegister: 0,
        currentBranchIndex: 0,
        branches: [
          {
            id: 'branch_1',
            themeIndex: 0,
            name: '老街·暖阳木质猫咖',
            icon: '🪵',
            tag: '原木质朴',
            prestige: 0,
            facilityTiers: { floor: 0, bar: 0, grinder: 0, sofa: 0, cattree: 0 },
            unlocked: true,
            logs: [
              '【08:00】铺面刚刚租下，空荡荡的地板上积着一层薄灰。门缝外有一只流浪小橘猫探头探脑。'
            ]
          }
        ],
        adoptedCats: [],
        unlockedDrinks: []
      };
    }

    // Active App State Variables
    let currentLevel = 1;
    let maxClearedLevel = 0;
    let stars = 0;
    let coins = 0;
    let cashRegister = 0;
    let currentBranchIndex = 0;
    let branches = [];
    let adoptedCats = [];
    let unlockedDrinks = new Set();
    let currentTab = 'renovate';
    let currentLevelRange = 1;

    // Check if player has real save progress
    function hasExistingSave() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const p = JSON.parse(raw);
        if (!p) return false;
        const hasLevelProg = (typeof p.maxClearedLevel === 'number' && p.maxClearedLevel > 0) || (typeof p.level === 'number' && p.level > 1);
        const hasCats = Array.isArray(p.adoptedCats) && p.adoptedCats.length > 0;
        const hasDecor = Array.isArray(p.branches) && p.branches.some(b => Object.values(b.facilityTiers || {}).some(t => t > 0));
        const hasRes = (p.stars && p.stars > 0) || (p.coins && p.coins > 0);
        return hasLevelProg || hasCats || hasDecor || hasRes;
      } catch(e) {
        return false;
      }
    }

    function getSaveSummaryText() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return '';
        const p = JSON.parse(raw);
        const lvl = (typeof p.maxClearedLevel === 'number' && p.maxClearedLevel > 0) ? p.maxClearedLevel : (p.level || 1);
        const cats = Array.isArray(p.adoptedCats) ? p.adoptedCats.length : 0;
        return '已营业至第 ' + lvl + ' 关 · 已收容 ' + cats + ' 只猫咪';
      } catch(e) {
        return '';
      }
    }

    function saveGame() {
      try {
        const payload = {
          level: currentLevel,
          maxClearedLevel,
          stars,
          coins,
          cashRegister,
          currentBranchIndex,
          branches,
          adoptedCats,
          unlockedDrinks: Array.from(unlockedDrinks),
          timestamp: Date.now()
        };
        const str = JSON.stringify(payload);
        localStorage.setItem(STORAGE_KEY, str);
        if (window.xhs && typeof window.xhs.setStorage === 'function') {
          window.xhs.setStorage({ key: STORAGE_KEY, data: str });
        }
      } catch(e) {
        console.error('Failed to save state:', e);
      }
    }
    const saveState = saveGame; // alias

    function loadGame() {
      const pure = createPureInitialState();
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const p = JSON.parse(raw);
          if (p && typeof p === 'object') {
            currentLevel = typeof p.level === 'number' ? Math.max(1, p.level) : 1;
            maxClearedLevel = typeof p.maxClearedLevel === 'number' ? p.maxClearedLevel : 0;
            stars = typeof p.stars === 'number' ? p.stars : 0;
            coins = typeof p.coins === 'number' ? p.coins : 0;
            cashRegister = typeof p.cashRegister === 'number' ? p.cashRegister : 0;
            currentBranchIndex = typeof p.currentBranchIndex === 'number' ? p.currentBranchIndex : 0;
            branches = (Array.isArray(p.branches) && p.branches.length > 0) ? p.branches : pure.branches;
            adoptedCats = (Array.isArray(p.adoptedCats) ? p.adoptedCats : []).map(cat => ({
              ...cat,
              affinity: typeof cat.affinity === 'number' ? Math.min(10, Math.max(1, cat.affinity)) : 1,
              affinityExp: typeof cat.affinityExp === 'number' ? cat.affinityExp : 0,
              mood: typeof cat.mood === 'number' ? Math.min(3, Math.max(0, cat.mood)) : 3,
              maxMood: 3,
              lastPetTime: typeof cat.lastPetTime === 'number' ? cat.lastPetTime : 0,
              lastMoodRegenTime: typeof cat.lastMoodRegenTime === 'number' ? cat.lastMoodRegenTime : Date.now()
            }));
            unlockedDrinks = new Set(Array.isArray(p.unlockedDrinks) ? p.unlockedDrinks : []);
            return true;
          }
        }
      } catch(e) {
        console.error('Failed to parse save:', e);
      }

      // Initialize with pristine clean default
      currentLevel = pure.level;
      maxClearedLevel = pure.maxClearedLevel;
      stars = pure.stars;
      coins = pure.coins;
      cashRegister = pure.cashRegister;
      currentBranchIndex = pure.currentBranchIndex;
      branches = pure.branches;
      adoptedCats = pure.adoptedCats;
      unlockedDrinks = new Set(pure.unlockedDrinks);
      return false;
    }

    function resetGame() {
      try {
        localStorage.removeItem(STORAGE_KEY);
        if (window.xhs && typeof window.xhs.removeStorage === 'function') {
          window.xhs.removeStorage({ key: STORAGE_KEY });
        }
      } catch(e) {}

      const pure = createPureInitialState();
      currentLevel = pure.level;
      maxClearedLevel = pure.maxClearedLevel;
      stars = pure.stars;
      coins = pure.coins;
      cashRegister = pure.cashRegister;
      currentBranchIndex = pure.currentBranchIndex;
      branches = pure.branches;
      adoptedCats = pure.adoptedCats;
      unlockedDrinks = new Set(pure.unlockedDrinks);
      saveGame();
      renderTitleScreen();
    }

    // Helper: Get active branch & theme definition
    function getActiveBranch() {
      if (!branches || branches.length === 0) {
        branches = createPureInitialState().branches;
      }
      if (currentBranchIndex >= branches.length) currentBranchIndex = branches.length - 1;
      return branches[currentBranchIndex];
    }

    function getBranchTheme(branch) {
      const idx = (branch.themeIndex || 0) % BASE_THEMES.length;
      return BASE_THEMES[idx];
    }

    // Passive Coin Generation (every 10s)
    setInterval(() => {
      let baseRate = 0;
      DRINK_MENU.forEach(d => {
        if (unlockedDrinks.has(d.id)) baseRate += d.passiveCoinRate;
      });
      let totalPrestige = 0;
      branches.forEach(b => { totalPrestige += (b.prestige || 0); });
      const mult = 1 + totalPrestige * 0.25;
      const effectiveRate = Math.ceil(baseRate * mult);

      if (effectiveRate > 0) {
        cashRegister += Math.ceil(effectiveRate / 6);
        updateCashRegisterDisplay(effectiveRate);
      }
    }, 10000);

    function updateCashRegisterDisplay(rate = null) {
      const el = document.getElementById('cashRegisterAmount');
      if (el) el.innerText = cashRegister;
      if (rate === null) {
        let baseRate = 0;
        DRINK_MENU.forEach(d => { if (unlockedDrinks.has(d.id)) baseRate += d.passiveCoinRate; });
        let totalPrestige = 0;
        branches.forEach(b => { totalPrestige += (b.prestige || 0); });
        rate = Math.ceil(baseRate * (1 + totalPrestige * 0.25));
      }
      const rateEl = document.getElementById('passiveRateBadge');
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
      triggerHaptic('medium');
      const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      const b = getActiveBranch();
      b.logs.push('【' + timeStr + ' 提取】从收银机提取了 ' + collected + ' 营业金币 🪙');
      saveGame();
      renderJournal();
    }

    // --- 8. Navigation & Branch Swapping ---
    function navigateBranch(delta) {
      const nextIdx = currentBranchIndex + delta;
      if (nextIdx >= 0 && nextIdx < branches.length) {
        currentBranchIndex = nextIdx;
        sound.playSelect();
        triggerHaptic('light');
        saveGame();
        renderJournal();
      }
    }

    function switchJournalTab(tab) {
      currentTab = tab;
      ['renovate', 'cats', 'drinks'].forEach(t => {
        const btn = document.getElementById('tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
        const panel = document.getElementById('panel' + t.charAt(0).toUpperCase() + t.slice(1));
        if (btn) btn.classList.toggle('active', t === tab);
        if (panel) panel.classList.toggle('hidden', t !== tab);
      });
      sound.playSelect();
      triggerHaptic('light');
    }

    // --- 9. Alley Stray Cat Adoption (Endless Gacha) ---
    // --- Cat Mood, Cooldown & Affinity EXP Rules ---
    const AFFINITY_MAX_LEVEL = 10;
    const AFFINITY_EXP_TABLE = [0, 3, 5, 8, 12, 18, 25, 35, 48, 65];
    function getRequiredExp(level) {
      return AFFINITY_EXP_TABLE[level] || 80;
    }

    function updateCatMood(cat) {
      const now = Date.now();
      const maxM = cat.maxMood || 3;
      if (typeof cat.mood !== 'number') cat.mood = maxM;
      if (cat.mood < maxM) {
        const elapsed = now - (cat.lastMoodRegenTime || now);
        const recovered = Math.floor(elapsed / 60000);
        if (recovered > 0) {
          cat.mood = Math.min(maxM, cat.mood + recovered);
          cat.lastMoodRegenTime = now - (elapsed % 60000);
        }
      } else {
        cat.lastMoodRegenTime = now;
      }
    }

    function rescueAlleyCat() {
      if (stars < 3) {
        alert('后巷探寻需要 3 颗 ⭐ 星光灵感！先去通关连连看获取吧！');
        return;
      }
      stars -= 3;

      const breedObj = CAT_BREEDS[Math.floor(Math.random() * CAT_BREEDS.length)];
      const color = breedObj.colors[Math.floor(Math.random() * breedObj.colors.length)];
      const name = CAT_NAMES[Math.floor(Math.random() * CAT_NAMES.length)];
      const personality = CAT_PERSONALITIES[Math.floor(Math.random() * CAT_PERSONALITIES.length)];
      const story = RESCUE_SCENARIOS[Math.floor(Math.random() * RESCUE_SCENARIOS.length)];

      const newCat = {
        id: 'cat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        name,
        breed: breedObj.breed,
        color,
        personality,
        icon: breedObj.icon,
        affinity: 1,
        affinityExp: 0,
        mood: 3,
        maxMood: 3,
        lastPetTime: 0,
        lastMoodRegenTime: Date.now(),
        branchId: getActiveBranch().id,
        story
      };

      adoptedCats.unshift(newCat);
      sound.playMeow(640);
      triggerHaptic('heavy');
      setTimeout(() => sound.playVictory(), 200);

      const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      getActiveBranch().logs.push('【' + timeStr + ' 奇遇】收容了新猫咪「' + personality + name + '」(' + breedObj.breed + ')！' + story);

      saveGame();
      renderJournal();
      switchJournalTab('cats');
      alert('🎉 成功收容流浪名猫「' + personality + name + '」！欢迎加入猫咪大家庭！');
    }

    function petAdoptedCat(catId) {
      const cat = adoptedCats.find(c => c.id === catId);
      if (!cat) return;

      updateCatMood(cat);
      const now = Date.now();

      // 1. Anti-spam 5-second cooldown check
      const cdRemaining = Math.max(0, Math.ceil(((cat.lastPetTime || 0) + 5000 - now) / 1000));
      if (cdRemaining > 0) {
        alert('「' + cat.name + '」正在惬意地回味刚才的抚摸呢，请稍等 ' + cdRemaining + ' 秒～');
        return;
      }

      // 2. Mood check (0 mood = sleeping)
      if (cat.mood <= 0) {
        alert('「' + cat.name + '」困得打哈欠啦！通关连连看采购鲜食犒劳，或等待休息即可唤醒它～');
        return;
      }

      // 3. Consume 1 mood
      cat.mood -= 1;
      cat.lastPetTime = now;
      cat.lastMoodRegenTime = now;

      // 4. Balanced economy: strictly 5~10 coins per pet
      const coinReward = 5 + Math.min(5, Math.floor((cat.affinity || 1) / 2));
      coins += coinReward;

      // 5. Affinity EXP progression
      const isCrit = Math.random() < 0.15;
      const expGain = isCrit ? 2 : 1;
      cat.affinityExp = (cat.affinityExp || 0) + expGain;

      let leveledUp = false;
      const currentLvl = cat.affinity || 1;
      if (currentLvl < AFFINITY_MAX_LEVEL) {
        const needExp = getRequiredExp(currentLvl);
        if (cat.affinityExp >= needExp) {
          cat.affinity = currentLvl + 1;
          cat.affinityExp = 0;
          leveledUp = true;
        }
      }

      sound.playMeow(680 + Math.random() * 120);
      triggerHaptic('light');

      const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      const branch = getActiveBranch();

      if (leveledUp) {
        sound.playVictory();
        triggerHaptic('heavy');
        branch.logs.push('【' + timeStr + ' 💖羁绊升阶】与「' + cat.name + '」的羁绊提升至 Lv.' + cat.affinity + '！猫咪更加依赖你了！');
      } else {
        const quotes = [
          '「' + cat.name + '」舒服地打着呼噜，用湿漉漉的鼻子蹭了蹭你的手背。',
          '「' + cat.name + '」在阳光下翻开肚皮，前爪有节奏地起伏踩奶。',
          '「' + cat.name + '」舔了舔你的指尖，眼神里满是依赖与温柔。'
        ];
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        const critText = isCrit ? ' (心花怒放! 经验+2)' : ' (经验+1)';
        branch.logs.push('【' + timeStr + ' 互动】' + q + critText + ' (+' + coinReward + ' 🪙)');
      }

      if (cat.mood === 0) {
        branch.logs.push('【' + timeStr + ' 💤午睡】「' + cat.name + '」舒服地打了个哈欠，跳上猫爬架呼呼大睡了，暂时不想被打扰。(通关连连看或休息后恢复)');
      }

      saveGame();
      renderJournal();
    }

    // --- 10. Multi-Tier Facility Upgrades & Branch Unlocking ---
    function upgradeFacility(key) {
      const branch = getActiveBranch();
      const theme = getBranchTheme(branch);
      const fac = theme.facilities.find(f => f.key === key);
      if (!fac) return;

      const currentTier = branch.facilityTiers[key] || 0;
      if (currentTier >= fac.tiers.length) return;

      const nextTierData = fac.tiers[currentTier];
      if (stars < nextTierData.costStars || coins < nextTierData.costCoins) {
        alert('资源不足！升级需要 ⭐ ' + nextTierData.costStars + ' 与 🪙 ' + nextTierData.costCoins);
        return;
      }

      stars -= nextTierData.costStars;
      coins -= nextTierData.costCoins;
      branch.facilityTiers[key] = currentTier + 1;

      sound.playVictory();
      triggerHaptic('medium');
      const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      branch.logs.push('【' + timeStr + ' 升阶】「' + fac.name + '」荣升为「' + nextTierData.name + '」！' + nextTierData.desc);

      saveGame();
      renderJournal();
    }

    function unlockNextBranchOrRebirth() {
      const branch = getActiveBranch();
      const theme = getBranchTheme(branch);
      let allMax = true;
      theme.facilities.forEach(f => {
        if ((branch.facilityTiers[f.key] || 0) < f.tiers.length) allMax = false;
      });

      if (!allMax) return;

      const newBranchIndex = branches.length;
      const nextThemeIndex = newBranchIndex % BASE_THEMES.length;
      const nextTheme = BASE_THEMES[nextThemeIndex];

      const newBranch = {
        id: 'branch_' + (newBranchIndex + 1),
        themeIndex: nextThemeIndex,
        name: '分店 ' + (newBranchIndex + 1) + ': ' + nextTheme.namePrefix,
        icon: nextTheme.icon,
        tag: nextTheme.tag,
        prestige: 0,
        facilityTiers: { floor: 0, bar: 0, grinder: 0, sofa: 0, cattree: 0 },
        unlocked: true,
        logs: [
          '【新店奠基】「' + nextTheme.namePrefix + '」正式签下租约，等待你开启全新主题篇章！'
        ]
      };

      branches.push(newBranch);
      currentBranchIndex = branches.length - 1;
      branch.prestige = (branch.prestige || 0) + 1;

      sound.playVictory();
      triggerHaptic('heavy');
      saveGame();
      renderJournal();
      alert('🎊 恭喜！成功开启全新主题分店「' + newBranch.name + '」！');
    }

    // --- 11. Drinks Research ---
    function developDrink(drinkId) {
      const d = DRINK_MENU.find(x => x.id === drinkId);
      if (!d || unlockedDrinks.has(drinkId)) return;

      if (coins < d.costCoins) {
        alert('营业金币不足！研发需要 🪙 ' + d.costCoins);
        return;
      }

      coins -= d.costCoins;
      unlockedDrinks.add(drinkId);
      sound.playVictory();
      triggerHaptic('medium');

      const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      getActiveBranch().logs.push('【' + timeStr + ' 研发】成功推出新品「' + d.name + '」！全连锁营业额提升 ' + d.passiveCoinRate + ' 币/分。');

      saveGame();
      renderJournal();
    }

    // --- 12. Render Journal UI ---
    function renderJournal() {
      document.getElementById('headerStars').innerText = stars;
      document.getElementById('headerCoins').innerText = coins;
      document.getElementById('headerCats').innerText = adoptedCats.length + ' 只';
      document.getElementById('tabCatCount').innerText = adoptedCats.length;
      document.getElementById('catTotalText').innerText = '共 ' + adoptedCats.length + ' 只猫咪';
      document.getElementById('journalLevelBadge').innerText = '第 ' + currentLevel + ' 关';

      const branch = getActiveBranch();
      const theme = getBranchTheme(branch);

      document.getElementById('branchIcon').innerText = theme.icon;
      document.getElementById('branchTitle').innerText = branch.name;
      document.getElementById('branchTag').innerText = theme.tag;

      let currentStars = 0;
      let totalStars = theme.facilities.length * 3;
      theme.facilities.forEach(f => {
        currentStars += (branch.facilityTiers[f.key] || 0);
      });
      const percent = Math.round((currentStars / totalStars) * 100);
      document.getElementById('branchProgressSub').innerText = '施工竣工度: ' + percent + '% (' + currentStars + '/' + totalStars + ')';
      document.getElementById('branchUpgradeSummary').innerText = '总星阶: ' + currentStars + ' / ' + totalStars + ' ⭐';

      const banner = document.getElementById('branchUnlockBanner');
      if (currentStars >= totalStars) {
        banner.classList.remove('hidden');
      } else {
        banner.classList.add('hidden');
      }

      document.getElementById('journalBranchTitle').innerText = branch.name.split(':')[0] + ' · 随笔手记';
      const logsBox = document.getElementById('journalLogsContainer');
      logsBox.innerHTML = '';
      (branch.logs || []).forEach(entry => {
        const div = document.createElement('div');
        const isHighlight = entry.startsWith('【');
        div.className = 'log-entry ' + (isHighlight ? 'highlight' : '');
        div.innerText = entry;
        logsBox.appendChild(div);
      });
      logsBox.scrollTop = logsBox.scrollHeight;

      updateCashRegisterDisplay();
      renderFacilities(branch, theme);
      renderCats();
      renderDrinks();
    }

    function renderFacilities(branch, theme) {
      const box = document.getElementById('facilityCardsContainer');
      box.innerHTML = '';

      theme.facilities.forEach(fac => {
        const currentTier = branch.facilityTiers[fac.key] || 0;
        const isMax = currentTier >= fac.tiers.length;
        const tierInfo = currentTier > 0 ? fac.tiers[currentTier - 1] : { name: '尚未采购', desc: '点击升级添置该设施' };
        const nextTier = !isMax ? fac.tiers[currentTier] : null;

        const card = document.createElement('div');
        card.className = 'content-card';
        const starDisplay = '★'.repeat(currentTier) + '☆'.repeat(fac.tiers.length - currentTier);

        card.innerHTML = `
          <div class="card-left">
            <div class="card-icon-box">${fac.icon}</div>
            <div class="card-text-col">
              <div class="card-title-line">
                <span class="card-main-title">${fac.name}</span>
                <span class="tier-stars">${starDisplay}</span>
              </div>
              <div class="card-desc" style="font-weight: 600; color: #4B3322;">
                ${currentTier > 0 ? 'Lv.' + currentTier + ' ' + tierInfo.name : '未添置 (毛坯)'}
              </div>
              <div class="card-desc">${tierInfo.desc}</div>
              ${!isMax && nextTier ? `<div class="card-cost-line">
                <span>升至 Lv.${currentTier + 1}:</span>
                <span class="cost-badge">⭐ ${nextTier.costStars}</span>
                <span class="cost-badge">🪙 ${nextTier.costCoins}</span>
              </div>` : ''}
            </div>
          </div>
          <div>
            ${isMax
              ? '<span class="tag-max">✓ 典藏满星</span>'
              : `<button data-action="upgrade-facility" data-key="${fac.key}" class="btn-upgrade" ${stars < nextTier.costStars || coins < nextTier.costCoins ? 'disabled' : ''}>${stars >= nextTier.costStars && coins >= nextTier.costCoins ? '升阶' : '缺少'}</button>`
            }
          </div>
        `;
        box.appendChild(card);
      });
    }

    function renderCats() {
      const box = document.getElementById('catCardsContainer');
      box.innerHTML = '';

      if (adoptedCats.length === 0) {
        box.innerHTML = `
          <div class="content-card" style="text-align: center; justify-content: center; padding: 24px 10px; color: #8C7561;">
            <div>
              <div style="font-size: 28px; margin-bottom: 6px;">🐾</div>
              <div style="font-size: 12px; font-weight: 700; color: #5C4434;">店内暂未收容猫咪</div>
              <div style="font-size: 10px; margin-top: 4px;">通关赚取 ⭐ 星光灵感，在上方【后巷探寻】偶遇流浪猫！</div>
            </div>
          </div>
        `;
        return;
      }

      const now = Date.now();

      adoptedCats.forEach(cat => {
        updateCatMood(cat);

        const card = document.createElement('div');
        card.className = 'content-card';

        const cdRemaining = Math.max(0, Math.ceil(((cat.lastPetTime || 0) + 5000 - now) / 1000));
        const isSleeping = (cat.mood || 0) <= 0;
        const isCd = cdRemaining > 0;

        let moodHearts = '';
        for (let i = 0; i < 3; i++) {
          moodHearts += i < (cat.mood || 0) ? '💖' : '🖤';
        }

        const currentLvl = cat.affinity || 1;
        const isMaxLvl = currentLvl >= AFFINITY_MAX_LEVEL;
        const needExp = getRequiredExp(currentLvl);
        const currExp = isMaxLvl ? needExp : (cat.affinityExp || 0);
        const expPercent = isMaxLvl ? 100 : Math.min(100, Math.round((currExp / needExp) * 100));

        let actionBtnHtml = '';
        if (isCd) {
          actionBtnHtml = `<button class="btn-upgrade btn-pet-disabled" disabled style="padding: 5px 8px; font-size: 10.5px;">⏳ ${cdRemaining}s</button>`;
        } else if (isSleeping) {
          actionBtnHtml = `<button class="btn-upgrade btn-pet-disabled" disabled style="padding: 5px 8px; font-size: 10.5px;">💤 午睡中</button>`;
        } else {
          actionBtnHtml = `<button data-action="pet-cat" data-id="${cat.id}" class="btn-upgrade" style="padding: 5px 8px; font-size: 10.5px;">🐾 抚摸 (-1💖)</button>`;
        }

        card.innerHTML = `
          <div class="card-left">
            <div class="card-icon-box" style="background: ${isSleeping ? '#F3F4F6' : '#FFF7ED'};">${cat.icon}</div>
            <div class="card-text-col">
              <div class="card-title-line">
                <span class="card-main-title">${cat.name}</span>
                <span style="font-size: 9.5px; padding: 1px 5px; border-radius: 6px; background: #FEF3C7; color: #92400E; font-weight: 700;">${cat.breed} · ${cat.color}</span>
              </div>
              <div class="card-desc" style="color: #6B482A; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span>性格: ${cat.personality}</span>
                <span style="font-weight: 700; color: #B45309;">Lv.${currentLvl} ${isMaxLvl ? '典藏' : ''}</span>
              </div>
              <div class="cat-exp-bar-wrap">
                <span>羁绊:</span>
                <div class="cat-exp-track">
                  <div class="cat-exp-fill" style="width: ${expPercent}%;"></div>
                </div>
                <span>${isMaxLvl ? 'MAX' : currExp + '/' + needExp}</span>
              </div>
              <div class="cat-mood-row">
                <span>心情:</span>
                <span class="cat-mood-hearts">${moodHearts}</span>
                <span style="color: ${isSleeping ? '#9CA3AF' : '#D97706'}; font-weight: 700;">(${cat.mood || 0}/3${isSleeping ? ' · 呼呼大睡中' : ''})</span>
              </div>
            </div>
          </div>
          <div>
            ${actionBtnHtml}
          </div>
        `;
        box.appendChild(card);
      });
    }

    function renderDrinks() {
      const box = document.getElementById('drinksCardsContainer');
      box.innerHTML = '';
      let unlockedCount = 0;

      DRINK_MENU.forEach(d => {
        const isUnlocked = unlockedDrinks.has(d.id);
        if (isUnlocked) unlockedCount++;

        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
          <div class="card-left">
            <div class="card-icon-box">${d.icon}</div>
            <div class="card-text-col">
              <div class="card-title-line">
                <span class="card-main-title">${d.name}</span>
                ${isUnlocked ? '<span class="tag-max" style="padding: 1px 5px; font-size: 9px;">+'+d.passiveCoinRate+' 币/分</span>' : ''}
              </div>
              <div class="card-desc">${d.desc}</div>
              ${!isUnlocked ? `<div class="card-cost-line">
                <span>研发配方:</span>
                <span class="cost-badge">🪙 ${d.costCoins}</span>
              </div>` : ''}
            </div>
          </div>
          <div>
            ${isUnlocked
              ? '<span class="tag-max">✓ 已研制</span>'
              : `<button data-action="develop-drink" data-id="${d.id}" class="btn-upgrade" ${coins < d.costCoins ? 'disabled' : ''}>${coins >= d.costCoins ? '研发' : '缺少'}</button>`
            }
          </div>
        `;
        box.appendChild(card);
      });

      document.getElementById('drinksProgressText').innerText = '已研发 ' + unlockedCount + ' / ' + DRINK_MENU.length;
    }

    // --- 13. Title / Splash Screen Manager ---
    function renderTitleScreen() {
      const hasSave = hasExistingSave();
      const startBtnText = document.getElementById('titleStartBtnText');
      const startBtnSub = document.getElementById('titleStartBtnSub');
      const startBtnIcon = document.getElementById('titleStartBtnIcon');

      if (hasSave) {
        startBtnIcon.innerText = '☕';
        startBtnText.innerText = '继续营业';
        startBtnSub.innerText = getSaveSummaryText() || '继续经营你的猫咪连锁小店';
      } else {
        startBtnIcon.innerText = '🐾';
        startBtnText.innerText = '开始新经营';
        startBtnSub.innerText = '开启属于你的毛坯小店';
      }

      const sndIcon = document.getElementById('titleSoundIcon');
      const sndText = document.getElementById('titleSoundText');
      if (sndIcon) sndIcon.innerText = sound.enabled ? '🔊' : '🔇';
      if (sndText) sndText.innerText = '游戏音效: ' + (sound.enabled ? '开启' : '静音');
    }

    function showTitleView() {
      renderTitleScreen();
      const titleView = document.getElementById('viewTitle');
      titleView.classList.remove('hidden');
      titleView.classList.remove('fade-out');

      document.getElementById('viewJournal').classList.add('hidden');
      document.getElementById('viewPuzzle').classList.add('hidden');
    }

    function enterGameFromTitle() {
      sound.playMeow(620);
      triggerHaptic('medium');

      const titleView = document.getElementById('viewTitle');
      titleView.classList.add('fade-out');

      setTimeout(() => {
        titleView.classList.add('hidden');
        showJournalView();
      }, 300);
    }

    function showJournalView() {
      document.getElementById('viewTitle').classList.add('hidden');
      document.getElementById('viewPuzzle').classList.add('hidden');
      document.getElementById('viewJournal').classList.remove('hidden');
      renderJournal();
    }

    // --- 14. LianLianKan Core Puzzle Engine ---
    let puzzleConfig = null;
    let board = [];
    let selectedTile = null;
    let timerId = null;
    let timeLeft = 0;
    let movesLeft = 0;
    let remainingPairs = 0;
    let score = 0;
    let hintPair = null;
    let hintsRemain = 3;
    let shufflesRemain = 2;
    let freezeRemain = 1;

    function showPuzzleView(levelNum) {
      currentLevel = levelNum;
      puzzleConfig = generateLevelConfig(levelNum);
      document.getElementById('viewTitle').classList.add('hidden');
      document.getElementById('viewJournal').classList.add('hidden');
      document.getElementById('viewPuzzle').classList.remove('hidden');
      initPuzzleLevel();
    }

    function initPuzzleLevel() {
      selectedTile = null;
      hintPair = null;
      hintsRemain = 3;
      shufflesRemain = 2;
      freezeRemain = 1;
      updatePowerupsUI();

      document.getElementById('puzzleLevelTitle').innerText = puzzleConfig.title.split('·')[0];
      document.getElementById('modeBadge').innerText = puzzleConfig.mode === 'moves' ? '步数' : '限时';

      const totalSlots = puzzleConfig.rows * puzzleConfig.cols;
      remainingPairs = puzzleConfig.pairs;
      score = 0;
      updateScoreUI();

      board = [];
      for (let r = 0; r < puzzleConfig.rows; r++) {
        board[r] = [];
        for (let c = 0; c < puzzleConfig.cols; c++) {
          board[r][c] = null;
        }
      }

      const activeIcons = THEME_ICONS_20.slice(0, puzzleConfig.iconTypes);
      const tilesPool = [];
      for (let p = 0; p < puzzleConfig.pairs; p++) {
        const icon = activeIcons[p % activeIcons.length];
        tilesPool.push(icon, icon);
      }
      shuffleArray(tilesPool);

      let idx = 0;
      for (let r = 0; r < puzzleConfig.rows; r++) {
        for (let c = 0; c < puzzleConfig.cols; c++) {
          board[r][c] = {
            r, c,
            icon: tilesPool[idx++],
            frozen: false,
            obstacle: false
          };
        }
      }

      if (puzzleConfig.frozenCount > 0) {
        let fCount = 0;
        while (fCount < puzzleConfig.frozenCount) {
          const rr = Math.floor(Math.random() * puzzleConfig.rows);
          const cc = Math.floor(Math.random() * puzzleConfig.cols);
          if (board[rr][cc] && !board[rr][cc].frozen) {
            board[rr][cc].frozen = true;
            fCount++;
          }
        }
      }

      ensureSolvable();
      resizeBoard();
      renderTiles();

      if (timerId) clearInterval(timerId);
      const clockBox = document.getElementById('clockBox');
      clockBox.classList.remove('warning');

      if (puzzleConfig.mode === 'time') {
        timeLeft = puzzleConfig.timeLimit;
        updateClockUI();
        timerId = setInterval(() => {
          timeLeft--;
          updateClockUI();
          if (timeLeft <= 10) clockBox.classList.add('warning');
          if (timeLeft <= 0) {
            clearInterval(timerId);
            sound.playError();
            alert('⏰ 时间耗尽！别灰心，整理心情再次挑战！');
            showJournalView();
          }
        }, 1000);
      } else {
        movesLeft = puzzleConfig.movesLimit;
        updateClockUI();
      }
    }

    function updateClockUI() {
      const el = document.getElementById('timerText');
      if (puzzleConfig.mode === 'time') {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        el.innerText = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
      } else {
        el.innerText = '步数: ' + movesLeft;
      }
    }

    function updateScoreUI() {
      document.getElementById('scoreText').innerText = '得分: ' + score;
      document.getElementById('pairProgress').innerText = (puzzleConfig.pairs - remainingPairs) + ' / ' + puzzleConfig.pairs;
      const progress = ((puzzleConfig.pairs - remainingPairs) / puzzleConfig.pairs) * 100;
      document.getElementById('clearanceBar').style.width = Math.max(4, progress) + '%';
    }

    function updatePowerupsUI() {
      document.getElementById('badgeHint').innerText = 'x' + hintsRemain;
      document.getElementById('badgeShuffle').innerText = 'x' + shufflesRemain;
      document.getElementById('badgeFreeze').innerText = 'x' + freezeRemain;
    }

    function resizeBoard() {
      const container = document.getElementById('boardContainer');
      const inner = document.getElementById('boardInner');
      const wrapper = document.getElementById('tilesWrapper');

      const maxW = container.clientWidth - 16;
      const maxH = container.clientHeight - 16;

      const cellSize = Math.min(
        Math.floor(maxW / puzzleConfig.cols),
        Math.floor(maxH / puzzleConfig.rows),
        48
      );

      const totalW = cellSize * puzzleConfig.cols;
      const totalH = cellSize * puzzleConfig.rows;

      wrapper.style.width = totalW + 'px';
      wrapper.style.height = totalH + 'px';
      inner.style.width = (totalW + 6) + 'px';
      inner.style.height = (totalH + 6) + 'px';

      const canvas = document.getElementById('particleCanvas');
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    function renderTiles() {
      const wrapper = document.getElementById('tilesWrapper');
      wrapper.innerHTML = '';
      const cellSize = Math.floor(wrapper.clientWidth / puzzleConfig.cols);

      for (let r = 0; r < puzzleConfig.rows; r++) {
        for (let c = 0; c < puzzleConfig.cols; c++) {
          const item = board[r][c];
          if (!item) continue;

          const div = document.createElement('div');
          div.className = 'tile-cell';
          div.style.width = (cellSize - 3) + 'px';
          div.style.height = (cellSize - 3) + 'px';
          div.style.left = (c * cellSize + 1.5) + 'px';
          div.style.top = (r * cellSize + 1.5) + 'px';
          div.style.fontSize = Math.floor(cellSize * 0.52) + 'px';

          div.innerText = item.icon;

          if (item.frozen) div.classList.add('frozen');
          if (item.obstacle) div.classList.add('obstacle');
          if (selectedTile && selectedTile.r === r && selectedTile.c === c) div.classList.add('selected');
          if (hintPair && ((hintPair[0].r === r && hintPair[0].c === c) || (hintPair[1].r === r && hintPair[1].c === c))) {
            div.classList.add('hinted');
          }

          div.onclick = () => onTileClick(r, c);
          wrapper.appendChild(div);
        }
      }
    }

    // Tile Click & Elimination
    function onTileClick(r, c) {
      const tile = board[r][c];
      if (!tile || tile.obstacle) return;

      if (tile.frozen) {
        sound.playError();
        triggerHaptic('light');
        tile.frozen = false;
        renderTiles();
        return;
      }

      hintPair = null;

      if (!selectedTile) {
        selectedTile = { r, c };
        sound.playSelect();
        triggerHaptic('light');
        renderTiles();
        return;
      }

      if (selectedTile.r === r && selectedTile.c === c) {
        selectedTile = null;
        sound.playSelect();
        renderTiles();
        return;
      }

      const prevTile = board[selectedTile.r][selectedTile.c];
      if (prevTile.icon === tile.icon) {
        const path = findPath(selectedTile.r, selectedTile.c, r, c);
        if (path) {
          board[selectedTile.r][selectedTile.c] = null;
          board[r][c] = null;
          remainingPairs--;
          score += 100;
          sound.playMatch();
          triggerHaptic('medium');

          drawMatchEffect(path);
          selectedTile = null;
          updateScoreUI();
          renderTiles();

          if (puzzleConfig.mode === 'moves') {
            movesLeft--;
            updateClockUI();
          }

          if (remainingPairs <= 0) {
            handleLevelClear();
            return;
          }

          ensureSolvable();
          return;
        }
      }

      // Not match or no path
      if (puzzleConfig.mode === 'moves') {
        movesLeft--;
        updateClockUI();
        if (movesLeft <= 0) {
          sound.playError();
          alert('🚫 步数已用尽！');
          showJournalView();
          return;
        }
      }

      selectedTile = { r, c };
      sound.playSelect();
      triggerHaptic('light');
      renderTiles();
    }

    // 0, 1, 2 Bends Pathfinding (BFS with 1-padding)
    function findPath(r1, c1, r2, c2) {
      const R = puzzleConfig.rows + 2;
      const C = puzzleConfig.cols + 2;
      const grid = Array.from({ length: R }, () => Array(C).fill(0));

      for (let r = 0; r < puzzleConfig.rows; r++) {
        for (let c = 0; c < puzzleConfig.cols; c++) {
          if (board[r][c] !== null) {
            grid[r + 1][c + 1] = 1;
          }
        }
      }
      grid[r1 + 1][c1 + 1] = 0;
      grid[r2 + 1][c2 + 1] = 0;

      const start = { r: r1 + 1, c: c1 + 1 };
      const target = { r: r2 + 1, c: c2 + 1 };

      const minBends = Array.from({ length: R }, () =>
        Array.from({ length: C }, () => Array(4).fill(999))
      );

      const queue = [];
      for (let d = 0; d < 4; d++) {
        minBends[start.r][start.c][d] = 0;
        queue.push({ r: start.r, c: start.c, dir: d, bends: 0, path: [start] });
      }

      const dr = [-1, 1, 0, 0];
      const dc = [0, 0, -1, 1];

      let bestPath = null;
      let minFoundBends = 999;

      while (queue.length > 0) {
        const curr = queue.shift();
        if (curr.bends > 2) continue;

        if (curr.r === target.r && curr.c === target.c) {
          if (curr.bends < minFoundBends) {
            minFoundBends = curr.bends;
            bestPath = curr.path;
          }
          continue;
        }

        for (let nd = 0; nd < 4; nd++) {
          const nr = curr.r + dr[nd];
          const nc = curr.c + dc[nd];

          if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
          if (grid[nr][nc] === 1) continue;

          const nb = curr.dir === nd ? curr.bends : curr.bends + 1;
          if (nb > 2) continue;

          if (nb < minBends[nr][nc][nd]) {
            minBends[nr][nc][nd] = nb;
            queue.push({
              r: nr, c: nc, dir: nd, bends: nb,
              path: [...curr.path, { r: nr, c: nc }]
            });
          }
        }
      }

      if (bestPath) {
        return bestPath.map(p => ({ r: p.r - 1, c: p.c - 1 }));
      }
      return null;
    }

    // Deadlock Prevention & Reshuffle
    function findAnyValidPair() {
      const tiles = [];
      for (let r = 0; r < puzzleConfig.rows; r++) {
        for (let c = 0; c < puzzleConfig.cols; c++) {
          if (board[r][c] && !board[r][c].obstacle) {
            tiles.push(board[r][c]);
          }
        }
      }

      for (let i = 0; i < tiles.length; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
          if (tiles[i].icon === tiles[j].icon) {
            const p = findPath(tiles[i].r, tiles[i].c, tiles[j].r, tiles[j].c);
            if (p) return [tiles[i], tiles[j]];
          }
        }
      }
      return null;
    }

    function ensureSolvable() {
      if (remainingPairs <= 0) return;
      let valid = findAnyValidPair();
      let attempts = 0;

      while (!valid && attempts < 25) {
        reshuffleBoardQuietly();
        valid = findAnyValidPair();
        attempts++;
      }
    }

    function reshuffleBoardQuietly() {
      const items = [];
      for (let r = 0; r < puzzleConfig.rows; r++) {
        for (let c = 0; c < puzzleConfig.cols; c++) {
          if (board[r][c] && !board[r][c].obstacle) {
            items.push(board[r][c].icon);
          }
        }
      }
      shuffleArray(items);

      let idx = 0;
      for (let r = 0; r < puzzleConfig.rows; r++) {
        for (let c = 0; c < puzzleConfig.cols; c++) {
          if (board[r][c] && !board[r][c].obstacle) {
            board[r][c].icon = items[idx++];
          }
        }
      }
    }

    // Power-up Triggers
    document.getElementById('btnHint').onclick = () => {
      if (hintsRemain <= 0) {
        alert('提示次数已用完！');
        return;
      }
      const pair = findAnyValidPair();
      if (pair) {
        hintsRemain--;
        updatePowerupsUI();
        hintPair = pair;
        sound.playSelect();
        renderTiles();
      }
    };

    document.getElementById('btnShuffle').onclick = () => {
      if (shufflesRemain <= 0) {
        alert('重排次数已用完！');
        return;
      }
      shufflesRemain--;
      updatePowerupsUI();
      sound.playSelect();
      reshuffleBoardQuietly();
      ensureSolvable();
      renderTiles();
    };

    document.getElementById('btnFreeze').onclick = () => {
      if (freezeRemain <= 0) {
        alert('加时道具已用完！');
        return;
      }
      freezeRemain--;
      updatePowerupsUI();
      sound.playVictory();
      if (puzzleConfig.mode === 'time') {
        timeLeft += 20;
        updateClockUI();
      } else {
        movesLeft += 5;
        updateClockUI();
      }
    };

    // Draw Particle Line on Canvas
    function drawMatchEffect(path) {
      const canvas = document.getElementById('particleCanvas');
      const ctx = canvas.getContext('2d');
      const wrapper = document.getElementById('tilesWrapper');
      const rect = wrapper.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();

      const offsetX = rect.left - canvasRect.left;
      const offsetY = rect.top - canvasRect.top;
      const cellSize = wrapper.clientWidth / puzzleConfig.cols;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#F59E0B';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      path.forEach((pt, i) => {
        const x = offsetX + (pt.c + 0.5) * cellSize;
        const y = offsetY + (pt.r + 0.5) * cellSize;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 220);
    }

    function handleLevelClear() {
      if (timerId) clearInterval(timerId);
      sound.playVictory();
      triggerHaptic('heavy');

      stars += puzzleConfig.starsReward;
      coins += puzzleConfig.coinsReward;
      if (currentLevel > maxClearedLevel) {
        maxClearedLevel = currentLevel;
      }

      // Restore all adopted cats' mood to 3/3 on LianLianKan clear!
      let restoredMoodCount = 0;
      adoptedCats.forEach(c => {
        if (typeof c.mood !== 'number' || c.mood < (c.maxMood || 3)) {
          c.mood = (c.maxMood || 3);
          c.lastMoodRegenTime = Date.now();
          restoredMoodCount++;
        }
      });

      document.getElementById('vicStarsEarned').innerText = '+' + puzzleConfig.starsReward + ' 星光灵感';
      document.getElementById('vicCoinsEarned').innerText = '+' + puzzleConfig.coinsReward + ' 营业金币';

      const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      const catLogSuffix = restoredMoodCount > 0 ? ' 带回的鲜美食材让 ' + restoredMoodCount + ' 只猫咪饱餐一顿，心情全部满格（💖 3/3）！' : '';
      getActiveBranch().logs.push('【' + timeStr + ' 捷报】通关了' + puzzleConfig.title + '，带回 ' + puzzleConfig.starsReward + '⭐ 与 ' + puzzleConfig.coinsReward + '🪙！' + catLogSuffix);

      saveGame();
      document.getElementById('modalVictory').classList.remove('hidden');
    }

    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    // --- 15. Level Select Modal (100+ Levels) ---
    function renderLevelSelectModal(startRange = 1) {
      currentLevelRange = startRange;
      const tabs = document.getElementById('levelRangeTabs');
      tabs.innerHTML = '';

      const maxTabStart = Math.max(100, Math.floor((maxClearedLevel + 20) / 20) * 20);
      for (let s = 1; s <= maxTabStart; s += 20) {
        const e = s + 19;
        const btn = document.createElement('button');
        btn.className = 'level-tab-btn ' + (currentLevelRange === s ? 'active' : '');
        btn.innerText = s + '~' + e;
        btn.onclick = () => renderLevelSelectModal(s);
        tabs.appendChild(btn);
      }

      const list = document.getElementById('levelSelectList');
      list.innerHTML = '';
      for (let lvl = startRange; lvl <= startRange + 19; lvl++) {
        const btn = document.createElement('button');
        const isCurrent = lvl === currentLevel;
        const isCleared = lvl <= maxClearedLevel;
        const isUnlocked = lvl <= maxClearedLevel + 1;
        const isMoves = (lvl >= 15 && lvl % 5 === 0);

        btn.className = 'level-grid-item ' + (isCurrent ? 'current' : isCleared ? 'cleared' : '');
        btn.innerHTML = `
          <span style="font-family: ui-monospace, monospace; font-size: 11px;">${lvl}</span>
          <span style="font-size: 8px;">${isMoves ? '步数' : '限时'}</span>
          ${isCleared ? '<span style="font-size: 8px; color: #059669;">✓</span>' : ''}
        `;
        if (isUnlocked) {
          btn.onclick = () => {
            document.getElementById('modalLevelSelect').classList.add('hidden');
            showPuzzleView(lvl);
          };
        } else {
          btn.style.opacity = '0.5';
          btn.onclick = () => alert('请先通关第 ' + (lvl - 1) + ' 关！');
        }
        list.appendChild(btn);
      }
    }

    function jumpToCustomLevel() {
      const val = parseInt(document.getElementById('inputCustomLevel').value, 10);
      if (val && val >= 1) {
        document.getElementById('modalLevelSelect').classList.add('hidden');
        showPuzzleView(val);
      }
    }

    document.getElementById('btnLevelSelect').onclick = () => {
      const range = Math.max(1, Math.floor((currentLevel - 1) / 20) * 20 + 1);
      renderLevelSelectModal(range);
      document.getElementById('modalLevelSelect').classList.remove('hidden');
    };

    // --- 16. Event Bindings ---
    // Title Screen Events
    document.getElementById('btnTitleStart').onclick = enterGameFromTitle;

    document.getElementById('btnTitleReset').onclick = () => {
      sound.playSelect();
      document.getElementById('modalResetConfirm').classList.remove('hidden');
    };

    document.getElementById('btnCancelReset').onclick = () => {
      sound.playSelect();
      document.getElementById('modalResetConfirm').classList.add('hidden');
    };

    document.getElementById('btnConfirmReset').onclick = () => {
      document.getElementById('modalResetConfirm').classList.add('hidden');
      resetGame();
      sound.playError();
      alert('已清空所有档案，恢复出厂纯净小铺！');
    };

    const toggleSound = () => {
      sound.enabled = !sound.enabled;
      const text = sound.enabled ? '🔊' : '🔇';
      document.getElementById('btnToggleSoundJournal').innerText = text;
      document.getElementById('btnToggleSoundPuzzle').innerText = text;
      renderTitleScreen();
    };

    document.getElementById('btnTitleToggleSound').onclick = toggleSound;
    document.getElementById('btnToggleSoundJournal').onclick = toggleSound;
    document.getElementById('btnToggleSoundPuzzle').onclick = toggleSound;

    // Return to Title from Journal
    document.getElementById('btnBackToTitle').onclick = () => {
      sound.playSelect();
      showTitleView();
    };

    // Game view navigation
    document.getElementById('btnStartProcure').onclick = () => showPuzzleView(currentLevel);
    document.getElementById('btnBackToJournal').onclick = () => showJournalView();
    document.getElementById('btnBackToJournalFromVic').onclick = () => {
      document.getElementById('modalVictory').classList.add('hidden');
      showJournalView();
    };
    document.getElementById('btnNextLevel').onclick = () => {
      document.getElementById('modalVictory').classList.add('hidden');
      currentLevel++;
      showPuzzleView(currentLevel);
    };

    window.onresize = () => {
      if (!document.getElementById('viewPuzzle').classList.contains('hidden')) {
        resizeBoard(); renderTiles();
      }
    };

    
    // --- Global Event Delegation for CSP Compliance ---
    document.addEventListener('click', function(e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const act = target.getAttribute('data-action');
      if (act === 'prev-branch') navigateBranch(-1);
      else if (act === 'next-branch') navigateBranch(1);
      else if (act === 'tab-renovate') switchJournalTab('renovate');
      else if (act === 'tab-cats') switchJournalTab('cats');
      else if (act === 'tab-drinks') switchJournalTab('drinks');
      else if (act === 'rescue-cat') rescueAlleyCat();
      else if (act === 'unlock-branch') unlockNextBranchOrRebirth();
      else if (act === 'collect-cash') collectCashRegister();
      else if (act === 'jump-level') jumpToCustomLevel();
      else if (act === 'close-level-select') {
        const m = document.getElementById('modalLevelSelect');
        if (m) m.classList.add('hidden');
      }
      else if (act === 'upgrade-facility') {
        const key = target.getAttribute('data-key');
        if (key) upgradeFacility(key);
      }
      else if (act === 'pet-cat') {
        const id = target.getAttribute('data-id');
        if (id) petAdoptedCat(id);
      }
      else if (act === 'develop-drink') {
        const id = target.getAttribute('data-id');
        if (id) developDrink(id);
      }
    });

        // 1-second ticker for Cat Pet CD countdown and mood natural recovery
    setInterval(() => {
      if (currentTab === 'cats' && !document.getElementById('viewJournal').classList.contains('hidden')) {
        const now = Date.now();
        let needRefresh = false;
        adoptedCats.forEach(c => {
          if ((c.lastPetTime && now - c.lastPetTime < 6000) || (c.mood || 0) < (c.maxMood || 3)) {
            needRefresh = true;
          }
        });
        if (needRefresh) {
          renderCats();
        }
      }
    }, 1000);

    // --- 17. Boot Engine ---
    loadGame();
    showTitleView();
})();