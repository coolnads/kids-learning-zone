// badges.js — Kids Learning Zone shared achievement system
// Include on every page: <script src="badges.js"></script>

const KLZ_BADGES = [
  // ── First steps ──────────────────────────────────────────────
  {id:'first_game',    icon:'🎮', name:'First Step',      desc:'Play any game for the first time',            secret:false},
  {id:'first_perfect', icon:'💯', name:'Perfect 10',      desc:'Score 10 out of 10 in any game',              secret:false},
  {id:'all_subjects',  icon:'🌍', name:'Explorer',        desc:'Play every single subject at least once',      secret:false},

  // ── Maths ────────────────────────────────────────────────────
  {id:'maths_streak5', icon:'🔥', name:'On Fire',         desc:'Get a streak of 5 in Maths',                  secret:false},
  {id:'maths_all',     icon:'➕', name:'Maths Master',    desc:'Play all 4 Maths modes',                      secret:false},
  {id:'maths_hard',    icon:'🦁', name:'Hard Mode Hero',  desc:'Complete a full Maths game on Hard',           secret:false},

  // ── Science / Solar System ────────────────────────────────────
  {id:'space_ace',     icon:'🚀', name:'Space Ace',       desc:'Score 9 or 10 on the Planet Quiz',            secret:false},
  {id:'science_all',   icon:'🔬', name:'Scientist',       desc:'Read all 4 Science topics',                   secret:false},

  // ── Geography ─────────────────────────────────────────────────
  {id:'geo_globe',     icon:'🌐', name:'Globe Trotter',   desc:'Score 8+ in Geography',                       secret:false},
  {id:'geo_continents',icon:'🗺️', name:'Continent Hopper',desc:'Play Geography on 3 different continents',    secret:false},
  {id:'map_ace',       icon:'📍', name:'Map Master',      desc:'Score 8+ on the Map Quiz',                    secret:false},

  // ── History ───────────────────────────────────────────────────
  {id:'hist_clue1',    icon:'🕵️', name:'Sharp Mind',      desc:'Guess a history figure on the first clue',    secret:false},
  {id:'hist_all_eras', icon:'📜', name:'Time Traveller',  desc:'Play History in all 5 eras',                  secret:false},

  // ── English ───────────────────────────────────────────────────
  {id:'eng_spell10',   icon:'🐝', name:'Spelling Bee',    desc:'Spell 10 words correctly in a row',           secret:false},
  {id:'eng_hard',      icon:'🌳', name:'Word Wizard',     desc:'Complete English Hard mode',                   secret:false},

  // ── Food game ─────────────────────────────────────────────────
  {id:'food_perfect',  icon:'🥦', name:'Health Hero',     desc:'Score 10/10 on the Healthy Food game',        secret:false},

  // ── Art & Colours ────────────────────────────────────────────
  {id:'art_ace',       icon:'🎨', name:'Color Maestro',   desc:'Score 8+ in Art & Colours',                   secret:false},

  // ── Logic Puzzles ────────────────────────────────────────────
  {id:'logic_ace',     icon:'🧠', name:'Puzzle Pro',      desc:'Score 8+ in Logic Puzzles',                   secret:false},
  {id:'logic_hard',    icon:'🔮', name:'Brain Genius',    desc:'Score 8+ on Logic Puzzles Hard mode',         secret:false},

  // ── Reading ───────────────────────────────────────────────────
  {id:'reading_ace',   icon:'📚', name:'Bookworm',        desc:'Score 85%+ in Reading Corner',                secret:false},

  // ── Science Experiments ──────────────────────────────────────
  {id:'first_experiment', icon:'🧪', name:'Young Scientist', desc:'Complete your first home experiment',      secret:false},
  {id:'mad_scientist', icon:'⚗️', name:'Mad Scientist',   desc:'Complete all 8 science experiments',          secret:false},

  // ── Aviation ──────────────────────────────────────────────────
  {id:'logo_ace',      icon:'🛩️', name:'Logo Legend',     desc:'Score 10+ on Airline Logo Quiz',               secret:false},
  {id:'plane_spotter', icon:'🛫', name:'Plane Spotter',   desc:'Score 10+ on Aircraft Spotter',                secret:false},
  {id:'aviation_scholar', icon:'✈️', name:'Aviation Scholar', desc:'Read all 5 How Flight Works topics',       secret:false},

  // ── Secret / fun ─────────────────────────────────────────────
  {id:'night_owl',     icon:'🦉', name:'Night Owl',       desc:'Play after 8pm',                              secret:true},
  {id:'early_bird',    icon:'🌅', name:'Early Bird',      desc:'Play before 7am',                             secret:true},
  {id:'collector5',    icon:'⭐', name:'Rising Star',     desc:'Earn 5 badges',                               secret:false},
  {id:'collector_all', icon:'🏆', name:'Champion',        desc:'Earn all non-secret badges',                  secret:false},
];

const KLZ = {
  // ── Storage helpers ──────────────────────────────────────────
  _get(k){ try{ return JSON.parse(localStorage.getItem('klz_'+k)||'null'); }catch(e){return null;} },
  _set(k,v){ try{ localStorage.setItem('klz_'+k, JSON.stringify(v)); }catch(e){} },

  getEarned(){ return this._get('badges') || []; },
  hasEarned(id){ return this.getEarned().includes(id); },
  getStats(){ return this._get('stats') || {}; },
  setStat(k,v){ const s=this.getStats(); s[k]=v; this._set('stats',s); },
  incStat(k){ const s=this.getStats(); s[k]=(s[k]||0)+1; this._set('stats',s); return s[k]; },

  // ── Award a badge ────────────────────────────────────────────
  award(id){
    if(this.hasEarned(id)) return false;
    const badge = KLZ_BADGES.find(b=>b.id===id);
    if(!badge) return false;
    const earned = this.getEarned();
    earned.push(id);
    this._set('badges', earned);
    this._showToast(badge);
    // Check collector badges
    setTimeout(()=>this._checkCollector(), 400);
    return true;
  },

  // ── Time-based secret badges ─────────────────────────────────
  checkTime(){
    const h = new Date().getHours();
    if(h >= 20) this.award('night_owl');
    if(h < 7)   this.award('early_bird');
  },

  // ── Collector meta-badges ─────────────────────────────────────
  _checkCollector(){
    const earned = this.getEarned();
    if(earned.length >= 5) this.award('collector5');
    const nonSecret = KLZ_BADGES.filter(b=>!b.secret&&b.id!=='collector_all').map(b=>b.id);
    if(nonSecret.every(id=>earned.includes(id))) this.award('collector_all');
  },

  // ── First-game badge ─────────────────────────────────────────
  markPlayed(subject){
    const played = this._get('played') || [];
    if(!played.includes(subject)){ played.push(subject); this._set('played',played); }
    this.award('first_game');
    // All subjects
    const all=['space','maths','geo','history','english','science','food','map','art','logic','reading','aviation'];
    if(all.every(s=>played.includes(s))) this.award('all_subjects');
  },

  // ── Toast notification ────────────────────────────────────────
  _showToast(badge){
    // Inject styles once
    if(!document.getElementById('klz-badge-style')){
      const st=document.createElement('style');
      st.id='klz-badge-style';
      st.textContent=`
        #klz-toast-wrap{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:99999;display:flex;flex-direction:column;align-items:center;gap:10px;pointer-events:none}
        .klz-toast{background:linear-gradient(135deg,#1e1b4b,#312e81);border:1.5px solid #818cf8;border-radius:18px;padding:14px 20px;display:flex;align-items:center;gap:14px;box-shadow:0 8px 32px rgba(0,0,0,0.5);animation:klzIn .4s cubic-bezier(.34,1.56,.64,1) forwards;min-width:280px;max-width:360px;pointer-events:none}
        .klz-toast.klz-out{animation:klzOut .35s ease forwards}
        .klz-toast-icon{font-size:32px;line-height:1;flex-shrink:0}
        .klz-toast-text{}
        .klz-toast-title{font-size:11px;font-weight:700;color:#818cf8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px}
        .klz-toast-name{font-size:16px;font-weight:900;color:#fff;margin-bottom:1px}
        .klz-toast-desc{font-size:12px;color:#a5b4fc;line-height:1.4}
        @keyframes klzIn{from{opacity:0;transform:translateY(20px) scale(.92)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes klzOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(12px)}}
      `;
      document.head.appendChild(st);
    }
    // Wrap
    let wrap=document.getElementById('klz-toast-wrap');
    if(!wrap){wrap=document.createElement('div');wrap.id='klz-toast-wrap';document.body.appendChild(wrap);}
    const t=document.createElement('div');
    t.className='klz-toast';
    t.innerHTML=`<div class="klz-toast-icon">${badge.icon}</div><div class="klz-toast-text"><div class="klz-toast-title">🏅 Badge unlocked!</div><div class="klz-toast-name">${badge.name}</div><div class="klz-toast-desc">${badge.desc}</div></div>`;
    wrap.appendChild(t);
    setTimeout(()=>{ t.classList.add('klz-out'); setTimeout(()=>t.remove(),350); }, 3200);
  },

  // ── Badge shelf widget ────────────────────────────────────────
  renderShelf(containerId){
    const el=document.getElementById(containerId);
    if(!el) return;
    const earned=this.getEarned();
    el.innerHTML='';
    KLZ_BADGES.forEach(b=>{
      const got=earned.includes(b.id);
      const div=document.createElement('div');
      div.style.cssText='display:flex;flex-direction:column;align-items:center;gap:4px;width:70px;cursor:default';
      div.title=got?b.desc:(b.secret?'???':b.desc);
      const icon=document.createElement('div');
      icon.style.cssText=`width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;transition:transform .2s;${got?'background:rgba(129,140,248,.2);border:2px solid #818cf8;':'background:rgba(255,255,255,.05);border:2px solid rgba(255,255,255,.1);filter:grayscale(1);opacity:.4;'}`;
      icon.textContent=got?(b.icon):(b.secret?'🔒':b.icon);
      const lbl=document.createElement('div');
      lbl.style.cssText=`font-size:10px;font-weight:700;text-align:center;line-height:1.2;color:${got?'#a5b4fc':'rgba(255,255,255,.3)'};font-family:Nunito,sans-serif`;
      lbl.textContent=got?b.name:(b.secret?'Secret':'Locked');
      div.appendChild(icon);div.appendChild(lbl);
      el.appendChild(div);
    });
  }
};
