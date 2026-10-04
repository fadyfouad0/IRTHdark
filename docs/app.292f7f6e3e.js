/* IRTH — site logic (exported from the design source) */
window.IRTH_BUILD = '20261004-181221';
try { console.log('IRTH build 20261004-181221'); } catch (e) {}
const IMG_GIFT = 'assets/73b19fd44845dc0eca17125e6c1a6364.webp';
const RIDGE = 'assets/98f516ff3d313629ff389be48fa957d2.webp';
const MONEY = (n) => 'EGP ' + n.toLocaleString('en-US');

/* the small print, so the three links in the footer open something real */
const LEGAL = {
  privacy: { title: 'Privacy', body: [
    'IRTH keeps the least it can. We hold your name, your delivery address, your WhatsApp number and your order history, because without them an order cannot be packed, carried or traced.',
    'We do not sell what we hold, and we do not pass it to anyone except the carrier who brings your order to the door and the bank that takes the payment. Both get only what that job needs.',
    'Payment card numbers never reach us. They go straight to the payment provider, who returns a reference we store in their place.',
    'You can ask us at any time for a copy of everything we hold about you, or ask us to delete it. Write to hello@irth-house.com and we will answer within one working day.'] },
  terms: { title: 'Terms', body: [
    'Everything on this site is sold by IRTH, Madinah Al Munawwarah, Kingdom of Saudi Arabia. Prices are in Egyptian pounds and include tax where it applies.',
    'A piece is yours once we confirm the order. If a harvest runs out between your order and our packing, we will tell you the same day and refund that line in full.',
    'Food and anything sealed cannot be returned once it is opened, which is the rule for every house that sells it. Anything unopened can come back within fourteen days.',
    'Prayer rugs, beads, burners and the gift boxes carry a one-year guarantee against anything that was our fault in the making.'] },
  cookies: { title: 'Cookies', body: [
    'This site sets one cookie, and only one: the one that remembers what is in your bag between pages. Without it the bag empties every time you move.',
    'We do not run advertising trackers, and nothing here follows you to another site.',
    'We count visits in aggregate so we know which houses people open, and that count carries no name, no address and no way back to a person.',
    'Clearing your browser data clears all of it, and nothing on the site breaks except the bag, which starts again empty.'] }
};

/* the account's own data, so its panels have something to show */
const ORDERS = [
  {ref:'IRTH-4192', when:'14 September 2026', what:'Signature Ajwa Selection, Wild Sidr Honey', total:1060, status:'Delivered'},
  {ref:'IRTH-3877', when:'2 August 2026',     what:'Amber Prayer Beads',                      total:780,  status:'Delivered'},
  {ref:'IRTH-3511', when:'19 June 2026',      what:'The Madinah Box, six spaces',             total:2730, status:'Delivered'}
];
const ADDRESSES = [
  {label:'Home', lines:'14 Hassan Sabry, Zamalek \u00b7 Cairo 11211 \u00b7 +20 100 222 8841'},
  {label:'The office', lines:'Nile City Towers, Corniche el Nil \u00b7 Cairo 11624 \u00b7 +20 100 222 8841'}
];

/* every form on the site: what it holds, what it checks, what it answers */
function formVals(s, pv) {
  const digits = (v) => (v || '').replace(/[^0-9]/g, '');
  const okPhone = (v) => digits(v).length >= 7 && digits(v).length <= 12;
  const okMail = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test((v || '').trim());
  const sent = s.sent || {};
  const say = (k, msg) => this.setState({ sent: Object.assign({}, sent, { [k]: msg }) });
  const o = {};

  /* the footer's WhatsApp circle */
  o.joinVal = s.joinVal || '';
  o.setJoin = (e) => this.setState({ joinVal: e.target.value });
  o.joinText = sent.join && sent.join.indexOf('\u2713') === 0 ? 'Joined' : 'Join';
  o.joinGo = pv(() => say('join', okPhone(s.joinVal)
    ? '\u2713 You are on the list. We will message that number before the next harvest opens.'
    : 'That does not look like a number we can reach on WhatsApp.'));
  o.joinNote = sent.join || '';
  o.hasJoinNote = !!sent.join;

  /* the membership band on the home page */
  o.inviteVal = s.inviteVal || '';
  o.setInvite = (e) => this.setState({ inviteVal: e.target.value });
  o.inviteGo = pv(() => say('invite', okMail(s.inviteVal)
    ? '\u2713 Asked for. Invitations go out on the first of the month.'
    : 'We need an email address we can send the invitation to.'));
  o.inviteNote = sent.invite || '';
  o.hasInviteNote = !!sent.invite;
  o.inviteText = sent.invite && sent.invite.indexOf('\u2713') === 0
    ? 'Invitation requested' : 'Request invitation';

  /* the contact form */
  o.ctName = s.ctName || '';  o.setCtName = (e) => this.setState({ ctName: e.target.value });
  o.ctMail = s.ctMail || '';  o.setCtMail = (e) => this.setState({ ctMail: e.target.value });
  o.ctMsg = s.ctMsg || '';    o.setCtMsg = (e) => this.setState({ ctMsg: e.target.value });
  o.ctSend = pv(() => {
    if (!(s.ctName || '').trim()) return say('ct', 'We need a name to answer to.');
    if (!okMail(s.ctMail)) return say('ct', 'That email address will not reach you.');
    if ((s.ctMsg || '').trim().length < 10) return say('ct', 'Tell us a little more and we can actually help.');
    this.setState({ sent: Object.assign({}, sent, { ct: '\u2713 Sent. A human in Madinah answers within one working day.' }),
                    ctName: '', ctMail: '', ctMsg: '' });
  });
  o.ctNote = sent.ct || '';
  o.hasCtNote = !!sent.ct;
  o.ctText = sent.ct && sent.ct.indexOf('\u2713') === 0 ? 'Message sent' : 'Send the message';

  /* the account's details panel */
  o.acName = s.acName === undefined ? 'Fady Fouad' : s.acName;
  o.setAcName = (e) => this.setState({ acName: e.target.value });
  o.acMail = s.acMail === undefined ? 'fady@example.com' : s.acMail;
  o.setAcMail = (e) => this.setState({ acMail: e.target.value });
  o.acPhone = s.acPhone === undefined ? '+20 100 222 8841' : s.acPhone;
  o.setAcPhone = (e) => this.setState({ acPhone: e.target.value });
  o.acSave = pv(() => say('ac', okMail(o.acMail) && (o.acName || '').trim()
    ? '\u2713 Saved.' : 'A name and a working email, please.'));
  o.acNote = sent.ac || '';
  o.hasAcNote = !!sent.ac;
  return o;
}

const GALLERY = (d) => [d.img, 'assets/73b19fd44845dc0eca17125e6c1a6364.webp', 'assets/570775dd344fdb69305c22cbb70b45b0.webp', 'assets/23133ed1a6c40697c3124d3d7e7aaed9.webp'];
const MATCH = {
  'stock':  (d) => true,
  'gift':   (d) => !!d.gift,
  'h-Dates':  (d) => d.house === 'dates',
  'h-Coffee': (d) => d.house === 'coffee',
  'h-Scent':  (d) => d.house === 'scent',
  'h-Spirit': (d) => d.house === 'spirit',
  'p-low':  (d) => d.price < 250,
  'p-mid':  (d) => d.price >= 250 && d.price <= 600,
  'p-high': (d) => d.price > 600
};
const FILTERS = ['stock','gift','h-Dates','h-Coffee','h-Scent','h-Spirit','p-low','p-mid','p-high'];
/* Each house is its own page: its own photograph, its own crumb, its own
   editorial. HOUSE_CHIPS drives the chip row, the hero, the opening block and
   the dropdown, so there is one place to change a house. */
const HOUSE_CHIPS = [
  {key:'', label:'All', crumb:'The six houses',
   title:'The six houses',
   blurb:'Every piece IRTH carries, across the six lineages of Madinah.',
   img:'assets/98f516ff3d313629ff389be48fa957d2.webp',
   eyebrow:'Six lineages', heading:'One city, one standard',
   para:'IRTH is six houses, not six categories. Each is a line of work Madinah has kept for generations — the groves, the roasting, the oud, the loom, the apothecary, the wrapping — and each is held to the same grading before it leaves the city.',
   notes:[['I','Walked, not sourced','Every farm and workshop here is one we visit ourselves.'],
          ['II','One grading','Hand-graded in a single sitting. What does not pass stays.'],
          ['III','Sealed in Madinah','Packed the week it is gathered, traced to the door.']]},

  {key:'dates', label:'Dates & Sweets', crumb:'Dates & Sweets',
   title:'Dates & Sweets',
   blurb:'The first house. Ajwa, Sukkari and Medjool, graded by hand in Madinah.',
   img:'assets/9b6b44e5f8abf8c09baa89d74fb2004f.webp',
   eyebrow:'The first house', heading:'Ajwa, Sukkari, Medjool',
   para:'Every date in this house is picked from farms we walk ourselves in Al Qassim and Madinah, graded by hand in one sitting, and sealed the same week. Nothing is held over from last season.',
   notes:[['I','Three farms','Al Qassim, Al Ula and the palm groves east of Madinah.'],
          ['II','Graded once, by hand','No machine sorting, no second pass.'],
          ['III','Sealed the same week','The seal carries the batch and the date.']]},

  {key:'coffee', label:'Coffee & Infusions', crumb:'Coffee & Infusions',
   title:'Coffee & Infusions',
   blurb:'The second house. Qahwa ground for the dallah, and the brass it is poured from.',
   img:'assets/e664b98c9352690ca9caedc460c9a435.webp',
   eyebrow:'The second house', heading:'Qahwa, and what it is poured from',
   para:'Light-roasted beans ground for the dallah rather than the machine, with cardamom kept on the side so you set the strength yourself. The brass is hammered in the same quarter the coffee is sold in.',
   notes:[['I','Roasted light','Taken off early, the way Madinah drinks it.'],
          ['II','Ground for the dallah','Coarse enough to settle, never for a filter.'],
          ['III','Cardamom apart','Kept separate so the first round and the second differ.']]},

  {key:'scent', label:'Scent', crumb:'Scent',
   title:'Scent',
   blurb:'The third house. Oud, bukhoor and the brass that carries them through a room.',
   img:'assets/c7ce029f485cc6c9da5761ef60744c79.webp',
   eyebrow:'The third house', heading:'Oud, bukhoor, and the burner',
   para:'Aged chips cut thin, bukhoor pressed into small bricks, and burners pierced by hand so the smoke leaves slowly. A single piece is meant to carry a whole evening, not a minute of it.',
   notes:[['I','Aged, then cut','Chips rested for years before they are sized.'],
          ['II','Pressed by hand','Sandalwood ground with musk and rose, in small runs.'],
          ['III','Pierced brass','Sized for one piece, so nothing is wasted.']]},

  {key:'spirit', label:'Prayer & Spirit', crumb:'Prayer & Spirit',
   title:'Prayer & Spirit',
   blurb:'The fourth house. Rugs woven close and beads turned from one piece.',
   img:'assets/23133ed1a6c40697c3124d3d7e7aaed9.webp',
   eyebrow:'The fourth house', heading:'Woven close, turned whole',
   para:'Rugs woven tight enough to stay quiet underfoot and bound at the edge so they do not fray. Beads turned from one piece of amber rather than strung from offcuts, finished with a silk tassel.',
   notes:[['I','Bound at the edge','Sewn, not glued, so the pile holds its line.'],
          ['II','One piece, not many','Each bead comes from the same block.'],
          ['III','Quiet underfoot','Dense enough that it does not shift as you move.']]},

  {key:'apoth', label:'Madinah Apothecary', crumb:'Madinah Apothecary',
   title:'Madinah Apothecary',
   blurb:'The fifth house. Honey, saffron, black seed and the herbs of the slope.',
   img:'assets/570775dd344fdb69305c22cbb70b45b0.webp',
   eyebrow:'The fifth house', heading:'Pressed, dried, bottled dark',
   para:'Sidr honey thick enough to hold the spoon, saffron picked at dawn and dried the same morning, black seed cold-pressed in small runs, and thyme and wild mint cut on the slope they grew on.',
   notes:[['I','Picked at dawn','Saffron graded by colour the day it is lifted.'],
          ['II','Cold-pressed','Small runs, bottled dark to keep the oil still.'],
          ['III','Cut on the slope','Herbs dried where they grew, not shipped wet.']]},

  {key:'gift', label:'Gifting', crumb:'Gifting',
   title:'Gifting',
   blurb:'The sixth house. Boxes and trays, hand-tied and sealed in the city.',
   img:'assets/73b19fd44845dc0eca17125e6c1a6364.webp',
   eyebrow:'The sixth house', heading:'Hand-tied, and written by hand',
   para:'Boxes lined and embossed in Madinah, filled from the five houses before them, tied with a ribbon and sealed. The card inside is written by a person, not printed.',
   notes:[['I','Filled here','Packed in the city, not assembled in transit.'],
          ['II','Tied, not taped','A ribbon and a seal, so it opens the way it should.'],
          ['III','A written card','Your words, in a hand, inside the lid.']]}
];
const DATA = [
  {id:1,  name:'Signature Ajwa Selection',     cat:'Dates',      house:'dates',  price:420,  img:'assets/ce0105cdd4c75f335da0454c96a40305.webp',   gift:1, badge:'Bestseller',
   blurb:'Soft Ajwa from Al Qassim, graded by hand and sealed the week it is picked.'},
  {id:2,  name:'Sukkari Dates, Soft Grade',    cat:'Dates',      house:'dates',  price:310,  img:'assets/9b6b44e5f8abf8c09baa89d74fb2004f.webp',      badge:'',
   blurb:'Golden, caramel-soft and picked early, while the skin is still thin.'},
  {id:3,  name:'Madinah Arabic Coffee',        cat:'Coffee',     house:'coffee', price:185,  img:'assets/95d95a57bf0746174cb74dbc65353055.webp',  badge:'New harvest',
   blurb:'Ground for the dallah, roasted light, with cardamom on the side.'},
  {id:4,  name:'Dallah and Cups Set',          cat:'Coffee',     house:'coffee', price:860,  img:'assets/e664b98c9352690ca9caedc460c9a435.webp',      gift:1, badge:'',
   blurb:'Hammered brass dallah with six finjan cups, for the first round and the second.'},
  {id:5,  name:'Wild Sidr Honey',              cat:'Apothecary', house:'apoth',  price:640,  img:'assets/0e6c1520107c052f6f9b41cc45684507.webp',   badge:'',
   blurb:'Pressed from sidr blossom, thick enough to hold the spoon.'},
  {id:6,  name:'Dates and Nuts Gift Tray',     cat:'Gifting',    house:'gift',   price:760,  img:'assets/2d35818a12bcb247a793751b14962682.webp',      gift:1, badge:'Only 3 left',
   blurb:'A shallow tray laid in the storeroom: four dates, three nuts, tied and sealed.'},
  {id:7,  name:'Premium Saffron Threads',      cat:'Apothecary', house:'apoth',  price:390,  img:'assets/8238ed8b01b5577a6e33b7bb1a4d7ec3.webp', badge:'',
   blurb:'Picked at dawn, dried the same morning, graded by colour.'},
  {id:8,  name:'Cold-Pressed Black Seed Oil',  cat:'Apothecary', house:'apoth',  price:210,  img:'assets/dcb1743b4629e46cb5da131cfee46b6d.webp',     badge:'',
   blurb:'Cold-pressed in small runs, bottled dark to keep it still.'},
  {id:9,  name:'Mountain Herb Infusion',       cat:'Apothecary', house:'apoth',  price:165,  img:'assets/570775dd344fdb69305c22cbb70b45b0.webp',      badge:'',
   blurb:'Thyme, sage and wild mint, cut and dried on the slope they grew on.'},
  {id:10, name:'Luxury Prayer Rug',            cat:'Spirit',     house:'spirit', price:1250, img:'assets/c7c30b033e36833f3646cbc9e395488c.webp',     gift:1, badge:'',
   blurb:'Woven close, bound at the edge, soft underfoot and quiet.'},
  {id:11, name:'Amber Prayer Beads',           cat:'Spirit',     house:'spirit', price:780,  img:'assets/daabb3d700fe6b8e5601842473910bd1.webp',   gift:1, badge:'Only 3 left',
   blurb:'Turned from one piece, strung by hand, finished with a silk tassel.'},
  {id:12, name:'Travel Prayer Rug',            cat:'Spirit',     house:'spirit', price:540,  img:'assets/23133ed1a6c40697c3124d3d7e7aaed9.webp',      badge:'',
   blurb:'Folds to the size of a book and opens flat, with a sewn compass pocket.'},
  {id:13, name:'Brass Incense Burner',         cat:'Scent',      house:'scent',  price:520,  img:'assets/d710908a0b072ad7f734d1421ec18151.webp', badge:'Bestseller',
   blurb:'Brass, pierced by hand, sized for a single piece of oud.'},
  {id:14, name:'Oud Mubakhar Chips',           cat:'Scent',      house:'scent',  price:1480, img:'assets/c7ce029f485cc6c9da5761ef60744c79.webp',      gift:1, badge:'',
   blurb:'Aged chips, cut thin so one piece carries a whole evening.'},
  {id:15, name:'Bukhoor, Madinah Blend',       cat:'Scent',      house:'scent',  price:340,  img:'assets/1c274a408fd2ae86c68b14c5092632a7.webp',      badge:'New harvest',
   blurb:'Sandalwood ground with musk and rose, pressed into small bricks.'},
  {id:16, name:'The Madinah Gift Box',         cat:'Gifting',    house:'gift',   price:890,  img:'assets/73b19fd44845dc0eca17125e6c1a6364.webp',    gift:1, badge:'Bestseller',
   blurb:'Six spaces in green and gold, hand-tied, with a card written by hand.'}
];

class Component extends DCLogic {
  st() { return Object.assign({ page: this.props.startPage || 'home', mode: 'canvas', vh: 900, rail: this.props.startRail || '', past: false, bag: [], wish: [], q: '', pid: 1, qty: 1, bagOpen: this.flag('openCart'), searchOpen: this.flag('openSearch'), qvId: this.flag('openQuick') ? 1 : null, qvQty: 1 }, this.state); }
  flag(k) { const f = this.props && this.props[k]; return f === true || f === 'true' || f === '1'; }
  componentDidMount() {
    this._raf = 0;
    this._onScroll = () => {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => { this._raf = 0; this.apply(); });
    };
    this._onResize = () => this.measure();
    window.addEventListener('scroll', this._onScroll, { passive: true });
    window.addEventListener('resize', this._onResize);
    this.measure();
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onResize);
    if (this._raf) cancelAnimationFrame(this._raf);
    clearTimeout(this._tt);
  }
  componentDidUpdate() { this.apply(); }
  measure() {
    const h = window.innerHeight || 900;
    const mode = h > 1400 ? 'canvas' : 'play';
    const vh = mode === 'canvas' ? 900 : Math.max(620, h);
    const s = this.st();
    if (s.mode !== mode || s.vh !== vh) this.setState({ mode: mode, vh: vh });
    else this.apply();
  }
  apply() {
    const s = this.st();
    if (s.page !== 'home') return;
    const stages = document.querySelectorAll('[data-stage]');
    if (!stages.length) return;
    if (s.mode === 'canvas') { this.paint(stages[0], 0.03); return; }
    const tr = document.querySelector('[data-track]');
    if (!tr) return;
    const r = tr.getBoundingClientRect();
    this.paint(stages[0], Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - s.vh))));
    const past = r.bottom <= 90;
    if (past !== s.past) this.setState({ past: past });
  }
  paint(s, p) {
    const c = (x) => Math.min(1, Math.max(0, x));
    const seg = (a, b) => c((p - a) / (b - a));
    const e = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const set = (k, fn) => { const el = s.querySelector('[data-k="' + k + '"]'); if (el) fn(el.style); };
    const setOut = (k, fn) => { const el = document.querySelector('[data-k="' + k + '"]'); if (el) fn(el.style); };
    const inout = (a, b, cc, d) => Math.min(e(seg(a, b)), 1 - e(seg(cc, d)));
    const cam = e(seg(0, 0.55));
    const zoom = 1.7 - 0.62 * cam - 0.08 * e(seg(0.55, 1));
    set('photo', (st) => { st.transformOrigin = (50 - 12 * cam) + '% ' + (58 * cam) + '%'; st.transform = 'scale(' + zoom + ')'; });
    set('haze', (st) => { st.opacity = String(1 - e(seg(0.08, 0.4))); });
    set('sun', (st) => { st.opacity = String(1 - e(seg(0.1, 0.45))); st.transform = 'translateX(-50%) translateY(' + (-cam * 160) + 'px)'; });
    const dim = e(seg(0.22, 0.42));
    const dark = e(seg(0.66, 0.8));
    set('dim', (st) => { st.opacity = String(dim); });
    set('olive', (st) => { st.opacity = String(0.9 * dark); });
    const pass = e(seg(0.05, 0.5));
    set('palmL', (st) => { st.transform = 'translateX(' + (-pass * 220) + 'px) scale(' + (1 + 0.28 * pass) + ')'; });
    set('palmR', (st) => { st.transform = 'translateX(' + (pass * 240) + 'px) scale(' + (1 + 0.3 * pass) + ')'; });
    const rise = e(seg(0.5, 0.64));
    const turns = this.props.turns != null ? this.props.turns : 1.1;
    // same spin as before, but anchored so it lands on the grooved side view (frame 2) and holds through the finale
    // spins at a steady speed, then glides (decelerates smoothly) into the end frame instead of stopping abruptly
    const END_FRAME = 2, P0 = 0.45, HOLD = 0.9, U0 = 0.55;
    const total = (HOLD - P0) * 2 * turns * 60;
    const u = Math.min(1, Math.max(0, (p - P0) / (HOLD - P0)));
    const v = 2 / (1 + U0);
    const g = u < U0 ? v * u : v * u - v * (u - U0) * (u - U0) / (2 * (1 - U0));
    const f = (((END_FRAME - Math.round((1 - g) * total)) % 60) + 60) % 60;
    set('date', (st) => { st.backgroundPosition = ((f % 10) / 9 * 100) + '% ' + (Math.floor(f / 10) / 5 * 100) + '%'; });
    set('datewrap', (st) => { st.opacity = String(rise); st.transform = 'translate(-50%,-50%) translateY(' + ((1 - rise) * 220 + Math.sin(p * Math.PI * 6) * 5) + 'px) scale(' + (0.8 + 0.2 * rise) + ')'; });
    set('glow', (st) => { st.opacity = String(rise * (0.7 + 0.3 * dark)); });
    const it = 1 - e(seg(0.14, 0.24));
    set('introFade', (st) => { st.opacity = String(1 - e(seg(0.04, 0.3))); });
    set('intro', (st) => { st.opacity = String(it); st.transform = 'translateY(' + (-(1 - it) * 40 - cam * 30) + 'px)'; });
    const c2 = inout(0.28, 0.36, 0.46, 0.52);
    set('ch2', (st) => { st.opacity = String(c2); st.transform = 'translateY(' + ((1 - e(seg(0.28, 0.36))) * 30) + 'px)'; });
    const c3 = inout(0.54, 0.6, 0.66, 0.72);
    set('ch3', (st) => { st.opacity = String(c3); st.transform = 'translateY(-50%) translateX(' + ((1 - e(seg(0.54, 0.6))) * -40) + 'px)'; });
    const fin = e(seg(0.76, 0.86));
    set('finale', (st) => { st.opacity = String(fin); st.transform = 'translateY(-50%) translateY(' + ((1 - fin) * 30) + 'px)'; st.pointerEvents = fin > 0.5 ? 'auto' : 'none'; });
    set('cue', (st) => { st.opacity = String(1 - seg(0, 0.05)); });
    const light = Math.max(dim, dark);
    const mix = (a, b, t) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',') + ')';
    const col = mix([31, 46, 38], [247, 239, 229], light);
    setOut('hdr', (st) => { st.color = col; });
    set('rail', (st) => { st.color = col; st.opacity = String(e(Math.min(1, Math.max(0, (light - 0.35) / 0.55)))); st.pointerEvents = light > 0.5 ? 'auto' : 'none'; });
    set('logoDark', (st) => { st.opacity = String(1 - light); });
    set('logoLight', (st) => { st.opacity = String(light); });
    const active = p < 0.24 ? 0 : p < 0.52 ? 1 : p < 0.74 ? 2 : 3;
    for (let i = 0; i < 4; i++) set('t' + i, (st) => { st.opacity = i === active ? '1' : '0.4'; });
  }

  renderVals() {
    const s = this.st();
    const canvas = s.mode === 'canvas';
    const pv = (f) => (e) => { if (e && e.preventDefault) e.preventDefault(); f(); };
    const page = s.page;
    const money = (n) => 'EGP ' + n.toLocaleString('en-US');

    const bag = s.bag || [];
    const wish = s.wish || [];
    const byId = (id) => DATA.filter((d) => d.id === id)[0];

    /* A piece is sold in three sizes. The size travels with the bag line, so
       250 g and 1 kg of the same piece are two lines, each priced for itself. */
    const SIZES = [{ label: '250 g', mult: 0.6 }, { label: '500 g', mult: 1 },
                   { label: '1 kg', mult: 1.8 }];
    const sizeOf = (b) => (b.size === undefined ? 1 : b.size);
    const priceAt = (d, i) => Math.round(d.price * SIZES[i].mult / 5) * 5;

    /* The gift box is a bag line too: the box itself plus what went in it. */
    const BOXES = [{ name: 'The Madinah Box', price: 890, cap: 6 },
                   { name: 'The Traveller', price: 620, cap: 4 },
                   { name: 'The Majlis', price: 1340, cap: 9 }];
    const GIFT_IDS = [1, 3, 6, 5, 7, 2];
    const boxIdx = s.gbBox === undefined ? 0 : s.gbBox;
    const boxPicks = s.gbQty || [2, 1, 1, 0, 0, 0];
    const boxFilled = boxPicks.reduce((a, b) => a + b, 0);
    const boxContents = (picks) =>
      picks.reduce((n, v, i) => n + v * byId(GIFT_IDS[i]).price, 0);

    /* a gift card is a third kind of line: an amount, and the way it arrives */
    const GC_AMOUNTS = [250, 500, 1000, 0];
    const gcPick = s.gcAmt === undefined ? 1 : s.gcAmt;
    /* the fourth chip is "another amount", so the figure comes from the field */
    const gcOwnRaw = (s.gcOwn || '').replace(/[^0-9]/g, '');
    const gcOwnNum = gcOwnRaw ? parseInt(gcOwnRaw, 10) : 0;
    const gcAmount = gcPick === 3
      ? (gcOwnNum >= 100 && gcOwnNum <= 50000 ? gcOwnNum : 0)
      : GC_AMOUNTS[gcPick];
    const GC_WAYS = [{ label: 'Sent on WhatsApp', fee: 0 },
                     { label: 'Sent by email', fee: 0 },
                     { label: 'Printed and posted', fee: 60 }];
    const gcWay = s.gcDel === undefined ? 0 : s.gcDel;
    const gcFee = GC_WAYS[gcWay].fee;

    const linePrice = (b) => (b.card !== undefined ? b.card + (b.fee || 0)
      : (b.box === undefined
        ? priceAt(byId(b.id), sizeOf(b))
        : BOXES[b.box].price + boxContents(b.picks)));

    const bagQty = bag.reduce((n, b) => n + b.qty, 0);
    const goods = bag.reduce((n, b) => n + b.qty * linePrice(b), 0);

    /* one promo code, so the field on checkout is a real control */
    const PROMO = { MADINAH10: 0.1, IRTH10: 0.1 };
    const promo = s.promo || '';
    const promoRate = PROMO[promo] || 0;
    const discount = Math.round(goods * promoRate);
    const subtotal = goods - discount;
    /* delivery is free over EGP 1,500, which is the rule the promise strip states */
    const DELIVERY = 90;
    const delivery = goods === 0 ? 0 : (goods >= 1500 ? 0 : DELIVERY);
    const total = subtotal + delivery;

    /* a new page starts at its top: scroll the window and whatever box the
       board is sitting in, since on the canvas the page itself does not move */
    const toTop = () => {
      try { window.scrollTo(0, 0); } catch (e) {}
      let n = document.querySelector('.wrap');
      while (n && n !== document.body) {
        if (n.scrollTop) n.scrollTop = 0;
        n = n.parentElement;
      }
      try {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch (e) {}
    };
    const goTo = (p) => pv(() => {
      this.setState({ page: p, bagOpen: false, searchOpen: false, qvId: null,
                      gal: 0, acc: 0, past: p === 'home' ? false : s.past });
      toTop();
    });
    const go = {};
    ['home','store','product','checkout','gift','giftcard','about',
     'contact','account','wishlist','notfound','done'].forEach((p) => { go[p] = goTo(p); });
    /* the category page was folded into the store; keep the name working */
    go.house = pv(() => { this.setState({ page: 'store', rail: 'dates', tab: 'all', shown: 8,
      bagOpen: false, searchOpen: false, qvId: null }); toTop(); });

    const sameLine = (b, id, sz) => b.box === undefined && b.id === id && sizeOf(b) === sz;
    const inBag = (id, sz) => bag.filter((b) => (sz === undefined
      ? b.box === undefined && b.id === id : sameLine(b, id, sz))).length > 0;
    const addToBag = (id, size, n) => {
      const sz = size === undefined ? 1 : size;
      const k = n || 1;
      this.setState({
        bag: inBag(id, sz)
          ? bag.map((b) => (sameLine(b, id, sz)
              ? { id: b.id, size: sz, qty: b.qty + k } : b))
          : bag.concat([{ id: id, size: sz, qty: k }]),
        bagOpen: true, toast: null });
    };

    const toggleWish = (id) => this.setState({
      wish: wish.indexOf(id) >= 0 ? wish.filter((w) => w !== id) : wish.concat([id]) });

    const card = (d) => ({
      id: d.id, name: d.name, cat: d.cat, img: d.img,
      priceText: money(d.price),
      hasBadge: !!d.badge, badge: d.badge,
      open: pv(() => { this.setState({ page: 'product', pid: d.id, qty: 1, gal: 0, acc: 0,
                                        qvId: null, bagOpen: false, searchOpen: false }); toTop(); }),
      quick: pv(() => this.setState({ qvId: d.id, qvQty: 1 })),
      add: pv(() => addToBag(d.id)),
      addText: inBag(d.id) ? 'In the bag' : 'Add to bag',
      toggleWish: pv(() => toggleWish(d.id)),
      wishLabel: (wish.indexOf(d.id) >= 0 ? 'Saved: ' : 'Save ') + d.name,
      wishFill: wish.indexOf(d.id) >= 0 ? '#C29B3C' : 'none',
      wishFg: wish.indexOf(d.id) >= 0 ? '#C29B3C' : '#C29B3C',
      wishBg: wish.indexOf(d.id) >= 0 ? 'rgba(194,155,60,0.18)' : 'rgba(31,30,29,0.72)'
    });

    const q = (s.q || '').trim().toLowerCase();
    const hits = q ? DATA.filter((d) =>
      (d.name + ' ' + d.cat + ' ' + d.blurb).toLowerCase().indexOf(q) >= 0) : DATA.slice(0, 3);

    /* the store grid answers the rail, the filter box and the sort */
    const on = s.filters || [];
    const sq = (s.storeQ || '').trim().toLowerCase();
    const groups = [
      on.filter((f) => f === 'stock' || f === 'gift'),
      on.filter((f) => f.indexOf('h-') === 0),
      on.filter((f) => f.indexOf('p-') === 0)
    ];
    let storeAll = DATA.filter((d) => groups.every(
      (g) => !g.length || g.some((f) => MATCH[f](d))));
    const rail = s.rail || '';
    if (rail) storeAll = storeAll.filter((d) => d.house === rail);
    const tab = s.tab || 'all';
    if (tab === 'new') storeAll = storeAll.filter((d) => d.badge === 'New harvest' || d.badge === 'Bestseller');
    if (tab === 'gift') storeAll = storeAll.filter((d) => !!d.gift);
    if (sq) storeAll = storeAll.filter(
      (d) => (d.name + ' ' + d.cat).toLowerCase().indexOf(sq) >= 0);
    const sort = s.sort || 0;
    if (sort === 1) storeAll = storeAll.slice().sort((a, b) => a.price - b.price);
    if (sort === 2) storeAll = storeAll.slice().sort((a, b) => b.price - a.price);

    /* there is no separate category page: the store IS the category page, and
       its head follows whichever house the rail has selected */
    const hMeta = HOUSE_CHIPS.filter((h) => h.key === rail)[0] || HOUSE_CHIPS[0];

    const prod = byId(s.pid || 1) || DATA[0];
    const prodSize = s.size === undefined ? 1 : s.size;
    const prodPrice = priceAt(prod, prodSize);
    const qv = s.qvId ? byId(s.qvId) : null;

    const base = {
      /* --- the hero, exactly as the home board draws it --- */
      rootH: (page === 'home' && canvas) ? '8107px' : 'auto',
      deep: '#6E7059',
      fDisplay: "'Marcellus', Georgia, serif",
      fSerif: "'Bodoni Moda', Didot, serif",
      stages: [{ i: 0, tag: 'Home \u00b7 hero at scroll 0%, press Play to scroll the site', showTag: canvas, border: '0' }],
      stageH: s.vh, stagePos: canvas ? 'relative' : 'sticky',
      trackH: canvas ? s.vh : s.vh * 5,
      hdrBg: (page !== 'home' || s.past) ? '#262524' : 'transparent',
      hdrGrain: (page !== 'home' || s.past) ? 'grain' : '',
      hdrShadow: (page !== 'home' || s.past)
        ? '0 1px 0 rgba(194,155,60,0.26), 0 18px 40px -30px rgba(0,0,0,0.85)' : 'none',
      /* the bar floats over the hero on the home and nowhere else */
      hdrPull: page === 'home' ? '-88px' : '0px',
      /* on the home page the mega menu would drop over the hero while it is
         still playing, so it waits until the hero is behind you */
      ddLock: (page === 'home' && !s.past) ? 'dd-lock' : '',
      /* at the top of the hero the nav is the wordmark's ink; the painter
         carries it to cream as the hero darkens, and every inner page is cream */
      hdrColor: (page === 'home' && !s.past) ? '#1F2E26' : '#F0E6DA',
      annOn: false, annTop: 0, closeAnn: pv(() => {}),

      /* --- which screen --- */
      isHome: page === 'home', isStore: page === 'store' || page === 'house',
      isProduct: page === 'product', isCheckout: page === 'checkout',
      isGift: page === 'gift', isGiftCard: page === 'giftcard', isAbout: page === 'about',
      isContact: page === 'contact', isAccount: page === 'account',
      isWishlist: page === 'wishlist', isNotFound: page === 'notfound', isDone: page === 'done',

      /* --- the nav --- */
      go: go,
      navItems: ['The house', 'Luxury dates', 'Gifting', 'Our story'].map((l) => ({
        label: l, heroBorder: '1px solid transparent',
        go: l === 'Gifting' ? go.gift : l === 'Our story' ? go.about : go.store })),
      openSearch: pv(() => this.setState({ searchOpen: true, bagOpen: false, qvId: null })),
      openBag: pv(() => this.setState({ bagOpen: true, searchOpen: false, qvId: null })),
      openQuick: pv(() => this.setState({ qvId: DATA[0].id, qvQty: 1 })),
      openCart: pv(() => this.setState({ bagOpen: true, searchOpen: false, qvId: null })),
      closeAll: pv(() => this.setState({ bagOpen: false, searchOpen: false, qvId: null })),
      goDates: go.house, toMembership: go.account,
      ddAll: 'View all ' + DATA.length + ' pieces',
      accountLabel: 'Account',
      wishCount: wish.length, wishHas: wish.length > 0,
      cartCount: bagQty, cartHas: bagQty > 0, cartTotalText: money(subtotal),

      /* --- the product page --- */
      prod: { name: prod.name, blurb: prod.blurb, priceText: money(prodPrice),
              img: prod.img, houseLabel: prod.cat },
      prodSizeText: SIZES[prodSize].label,
      galShots: GALLERY(prod).map((src, i) => ({
        img: src, alt: i === 0 ? prod.name : (prod.name + ', view ' + (i + 1)) })),
      toggleProdWish: pv(() => toggleWish(prod.id)),
      prodWishLabel: (wish.indexOf(prod.id) >= 0 ? 'Saved: ' : 'Save ') + prod.name,
      prodWishFg: wish.indexOf(prod.id) >= 0 ? '#C29B3C' : '#CFC2B0',
      qty: s.qty || 1,
      qtyInc: pv(() => this.setState({ qty: (s.qty || 1) + 1 })),
      qtyDec: pv(() => this.setState({ qty: Math.max(1, (s.qty || 1) - 1) })),
      addProd: pv(() => addToBag(prod.id, prodSize, s.qty || 1)),
      addProdText: inBag(prod.id, prodSize)
        ? 'Add another ' + SIZES[prodSize].label : 'Add to bag',

      /* --- gallery, sizes and accordions, by index --- */
      ...(function () {
        const o = {};
        GALLERY(prod).forEach((src, i) => {
          o['g' + i] = { img: src, cls: (s.gal || 0) === i ? 'on' : '',
                         pick: pv(() => this.setState({ gal: i })) };
        });
        SIZES.forEach((_v, i) => {
          o['sz' + i] = { cls: prodSize === i ? 'on' : '',
                          pick: pv(() => this.setState({ size: i })) };
        });
        'acf'.split('').forEach((k) => {
          for (let i = 0; i < 8; i++) {
            o[k + i] = { open: (s.acc === undefined ? 0 : s.acc) === i,
                         sign: (s.acc === undefined ? 0 : s.acc) === i ? '−' : '+',
                         toggle: pv(() => this.setState({ acc: (s.acc === undefined ? 0 : s.acc) === i ? -1 : i })) };
          }
        });
        return o;
      }).call(this),

      /* --- the nav's active link --- */
      navOn: { home: page === 'home' ? 'on' : '', store: (page === 'store' || page === 'house' || page === 'product') ? 'on' : '',
               gift: (page === 'gift' || page === 'giftcard') ? 'on' : '',
               about: page === 'about' ? 'on' : '', contact: page === 'contact' ? 'on' : '' },

      /* --- the arch rail and the tab row --- */
      ...(function () {
        const o = {};
        HOUSE_CHIPS.forEach((h, i) => {
          const sel = rail === h.key;
          o['st' + i] = { cls: sel ? 'on' : '',
                          go: pv(() => { this.setState({ rail: h.key, tab: 'all', shown: 8 }); toTop(); }) };
        });
        ['all', 'new', 'gift'].forEach((k, i) => {
          o['tab' + i] = { cls: (s.tab || 'all') === k ? 'on' : '',
                           go: pv(() => this.setState({ tab: k, shown: 8 })) };
        });
        return o;
      }).call(this),

      /* --- the store: rail, sort, filter box --- */
      ...(function () {
        const o = {};
        FILTERS.forEach((f, i) => {
          const on = (s.filters || []).indexOf(f) >= 0;
          o['f' + i] = {
            on: on ? 'true' : 'false',
            bg: on ? '#C29B3C' : 'transparent',
            bd: on ? '#C29B3C' : '#5A5248',
            n: DATA.filter(MATCH[f]).length,
            toggle: pv(() => this.setState({
              filters: on ? (s.filters || []).filter((x) => x !== f)
                          : (s.filters || []).concat([f]),
              shown: 8 }))
          };
        });
        return o;
      }).call(this),
      setSort: (e) => this.setState({ sort: e.target.selectedIndex }),
      storeQ: s.storeQ || '',
      setStoreQ: (e) => this.setState({ storeQ: e.target.value, shown: 8 }),
      clearFilters: pv(() => this.setState({ filters: [], storeQ: '', rail: '', tab: 'all', shown: 8 })),
      loadMore: pv(() => this.setState({ shown: (s.shown || 8) + 4 })),
      loadMoreText: storeAll.length > (s.shown || 8) ? 'Load more pieces' : 'That is the whole store',

      /* --- the grids --- */
      storeItems: storeAll.slice(0, s.shown || 8).map(card),
      storeCount: storeAll.length
        ? ('Showing ' + Math.min(storeAll.length, s.shown || 8) + ' of ' + storeAll.length + ' pieces')
        : 'Nothing matches those filters',
      /* --- the mega dropdown: every group heading opens that house --- */
      ...(function () {
        const o = {};
        HOUSE_CHIPS.slice(1).forEach((h, i) => {
          o['dd' + i] = { go: pv(() => {
            this.setState({ page: 'store', rail: h.key, tab: 'all', shown: 8,
                            bagOpen: false, searchOpen: false, qvId: null });
            toTop();
          }) };
        });
        return o;
      }).call(this),

      storeTitle: rail ? hMeta.title : 'The store',
      storeBlurb: rail ? hMeta.blurb
        : 'Hand-selected at the source, in the heart of Madinah Al Munawwarah.',
      storeCrumb: rail ? hMeta.crumb : 'Store',
      inHouse: !!rail,
      storeImg: rail ? hMeta.img : RIDGE,
      storeEyebrow: hMeta.eyebrow,
      storeHeading: hMeta.heading,
      storePara: hMeta.para,
      storeNotes: hMeta.notes.map((n) => ({ n: n[0], name: n[1], note: n[2] })),
      relatedItems: DATA.filter((d) => d.id !== prod.id).slice(0, 4).map(card),
      wishItems: (wish.length ? DATA.filter((d) => wish.indexOf(d.id) >= 0) : DATA.slice(0, 4)).map(card),
      alsoItems: DATA.filter((d) => wish.indexOf(d.id) < 0).slice(0, 4).map(card),
      wishEmptyText: wish.length ? (wish.length + (wish.length === 1 ? ' saved piece' : ' saved pieces')) : '4 saved pieces',

      /* --- the bag --- */
      bagOpen: !!s.bagOpen, bagEmpty: bag.length === 0,
      bagTitle: bagQty === 1 ? '1 piece' : bagQty + ' pieces',
      subtotalText: money(subtotal),
      bagItems: bag.map((b, li) => {
        const isBox = b.box !== undefined;
        const isCard = b.card !== undefined;
        const d = (isBox || isCard) ? null : byId(b.id);
        const step = (k) => this.setState({ bag: bag.map((x, j) =>
          (j === li ? Object.assign({}, x, { qty: Math.max(1, x.qty + k) }) : x)) });
        return {
          img: (isBox || isCard) ? IMG_GIFT : d.img,
          cat: isCard ? 'Gift card' : (isBox ? 'Gifting' : d.cat),
          name: isCard ? ('IRTH gift card, ' + money(b.card))
            : (isBox ? BOXES[b.box].name : d.name),
          variant: isCard
            ? (GC_WAYS[b.way || 0].label + (b.to ? ' \u00b7 for ' + b.to : ''))
            : (isBox ? (b.picks.reduce((a, c) => a + c, 0) + ' pieces inside')
                     : SIZES[sizeOf(b)].label),
          qty: b.qty,
          lineText: money(b.qty * linePrice(b)),
          open: isCard
            ? pv(() => { this.setState({ page: 'giftcard', bagOpen: false }); toTop(); })
            : (isBox
              ? pv(() => { this.setState({ page: 'gift', bagOpen: false }); toTop(); })
              : pv(() => { this.setState({ page: 'product', pid: d.id, size: sizeOf(b),
                                           gal: 0, acc: 0, bagOpen: false }); toTop(); })),
          inc: pv(() => step(1)),
          dec: pv(() => step(-1)),
          remove: pv(() => this.setState({ bag: bag.filter((x, j) => j !== li) })) };
      }),

      /* --- search --- */
      searchOpen: !!s.searchOpen, query: s.q || '',
      setQuery: (e) => this.setState({ q: e.target.value }),
      results: hits.slice(0, 5).map(card),
      resultCount: q ? (hits.length + (hits.length === 1 ? ' result' : ' results')) : 'Start typing',
      noResults: q && hits.length === 0,
      houseChips: ['Dates & Sweets', 'Coffee & Infusions', 'Scent',
                   'Prayer & Spirit', 'Apothecary', 'Gifting']
                   .map((n) => ({ name: n, go: n.indexOf('Dates') === 0 ? go.house : go.store })),

      /* --- the gift card --- */
      ...(function () {
        const o = {};
        GC_AMOUNTS.forEach((v, i) => {
          o['amt' + i] = { cls: (s.gcAmt === undefined ? 1 : s.gcAmt) === i ? 'on' : '',
                           pick: pv(() => this.setState({ gcAmt: i })) };
        });
        return o;
      }).call(this),
      /* the three ways it arrives; the third one carries a fee */
      ...(function () {
        const o = {};
        GC_WAYS.forEach((w, i) => {
          const sel = gcWay === i;
          o['gcd' + i] = {
            bd: sel ? 'rgba(194,155,60,0.55)' : '#44403A',
            bg: sel ? 'rgba(194,155,60,0.07)' : 'transparent',
            ring: sel ? '#C29B3C' : '#5A5248',
            dot: sel ? 'block' : 'none',
            pick: pv(() => this.setState({ gcDel: i }))
          };
        });
        return o;
      }).call(this),
      gcText: gcAmount ? money(gcAmount) : 'Your amount',
      gcOwn: gcPick === 3,
      gcOwnVal: s.gcOwn || '',
      setGcOwn: (e) => this.setState({ gcOwn: e.target.value }),
      gcOwnNote: !gcOwnRaw ? 'Any amount from EGP 100 to EGP 50,000.'
        : (gcOwnNum < 100 ? 'The smallest card is EGP 100.'
          : (gcOwnNum > 50000 ? 'The largest card is EGP 50,000.'
            : money(gcOwnNum) + ' \u00b7 ready to add')),

      /* --- the gift box: choose it, fill it, and it goes in the bag --- */
      ...(function () {
        const o = {};
        BOXES.forEach((bx, i) => {
          const sel = boxIdx === i;
          o['gbx' + i] = {
            cls: sel ? 'on' : '',
            bd: sel ? 'rgba(194,155,60,0.6)' : '#44403A',
            tick: sel ? 'flex' : 'none',
            /* a smaller box keeps only what fits, nearest pieces first */
            pick: pv(() => {
              let left = bx.cap;
              const c = boxPicks.map((v) => { const t = Math.min(v, left); left -= t; return t; });
              this.setState({ gbBox: i, gbQty: c });
            })
          };
        });
        boxPicks.forEach((v, i) => {
          o['gb' + i] = {
            n: v,
            inc: pv(() => { const c = boxPicks.slice();
              if (boxFilled < BOXES[boxIdx].cap) c[i] = v + 1;
              this.setState({ gbQty: c }); }),
            dec: pv(() => { const c = boxPicks.slice(); c[i] = Math.max(0, v - 1);
              this.setState({ gbQty: c }); })
          };
        });
        return o;
      }).call(this),
      gbName: BOXES[boxIdx].name,
      gbFilled: boxFilled + ' of ' + BOXES[boxIdx].cap + ' spaces filled',
      gbPct: Math.min(100, boxFilled / BOXES[boxIdx].cap * 100) + '%',
      gbBoxPrice: money(BOXES[boxIdx].price),
      gbTotal: money(BOXES[boxIdx].price + boxContents(boxPicks)),
      gbLines: boxPicks.map((v, i) => ({ n: v, show: v > 0, name: byId(GIFT_IDS[i]).name,
        lineText: money(v * byId(GIFT_IDS[i]).price) })).filter((l) => l.show),
      gbEmpty: boxFilled === 0,
      gbAddText: boxFilled === 0 ? 'Put something in the box first'
        : 'Add the box to bag \u00b7 ' + money(BOXES[boxIdx].price + boxContents(boxPicks)),
      gbAdd: pv(() => {
        if (boxFilled === 0) return;
        this.setState({ bag: bag.concat([{ box: boxIdx, picks: boxPicks.slice(), qty: 1 }]),
                        bagOpen: true });
      }),

      /* --- the small print, as a panel rather than three dead links --- */
      legalOpen: !!s.legal,
      legalTitle: LEGAL[s.legal || 'privacy'].title,
      legalBody: LEGAL[s.legal || 'privacy'].body.map((t) => ({ text: t })),
      legalTabs: ['privacy', 'terms', 'cookies'].map((k) => ({
        label: LEGAL[k].title, cls: (s.legal || 'privacy') === k ? 'on' : '',
        go: pv(() => this.setState({ legal: k })) })),
      openPrivacy: pv(() => this.setState({ legal: 'privacy', bagOpen: false, searchOpen: false, qvId: null })),
      openTerms: pv(() => this.setState({ legal: 'terms', bagOpen: false, searchOpen: false, qvId: null })),
      openCookies: pv(() => this.setState({ legal: 'cookies', bagOpen: false, searchOpen: false, qvId: null })),

      /* --- the forms: each one checks what it was given and answers --- */
      ...formVals.call(this, s, pv),

      /* --- the account: the sidebar reaches each block and marks it --- */
      ...(function () {
        const o = {};
        ['orders', 'addresses', 'details'].forEach((k, i) => {
          o['ac' + i] = {
            cls: (s.acct || 'orders') === k ? 'on' : '',
            go: pv(() => {
              this.setState({ acct: k });
              try {
                const el = document.getElementById('acct-' + k);
                if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start' });
              } catch (e) {}
            })
          };
        });
        return o;
      }).call(this),
      addrItems: (s.addrs || ADDRESSES).map((a, i) => ({
        label: s.addrEdit === i ? 'Editing' : a.label,
        lines: a.lines,
        bd: (i === 0 || s.addrEdit === i) ? 'rgba(194,155,60,0.45)' : '#44403A',
        bg: (i === 0 || s.addrEdit === i) ? 'rgba(194,155,60,0.06)' : 'transparent',
        edit: pv(() => this.setState({ addrEdit: s.addrEdit === i ? -1 : i })),
        editText: s.addrEdit === i ? 'Done' : 'Edit',
        remove: pv(() => this.setState({
          addrs: (s.addrs || ADDRESSES).filter((x, j) => j !== i), addrEdit: -1 })) })),
      addrEmpty: (s.addrs || ADDRESSES).length === 0,
      addrCount: String((s.addrs || ADDRESSES).length),

      /* --- checkout --- */
      promoVal: s.promoDraft === undefined ? '' : s.promoDraft,
      setPromo: (e) => this.setState({ promoDraft: e.target.value }),
      applyPromo: pv(() => {
        const code = (s.promoDraft || '').trim().toUpperCase();
        this.setState({ promo: PROMO[code] ? code : '', promoTried: code || '-' });
      }),
      promoNote: promoRate
        ? (promo + ' applied \u2014 ' + Math.round(promoRate * 100) + '% off, ' + money(discount))
        : (s.promoTried && s.promoTried !== '-' ? 'That code is not one of ours' : ''),
      hasPromoNote: !!(promoRate || (s.promoTried && s.promoTried !== '-')),
      goodsText: money(goods),
      discountLabel: promo + ', ' + Math.round(promoRate * 100) + '% off',
      discountText: '\u2212 ' + money(discount),
      hasDiscount: discount > 0,
      deliveryText: goods === 0 ? '\u2014' : (goods >= 1500 ? 'Free' : money(DELIVERY)),
      totalText: money(total),
      placeOrder: pv(() => {
        if (!bag.length) return;
        this.setState({
          page: 'done', bagOpen: false, bag: [], promo: '', promoDraft: '', promoTried: '',
          order: { lines: bag.slice(), goods: goods, delivery: delivery,
                   discount: discount, total: total,
                   ref: 'IRTH-' + (4200 + Math.floor(Math.random() * 700)) },
          promoWas: promo });
        toTop();
      }),
      placeOrderText: bag.length ? 'Place order' : 'The bag is empty',

      /* --- the confirmation shows the order that was placed --- */
      ...(function () {
        const ord = s.order || { lines: [], goods: 0, delivery: 0, total: 0, ref: 'IRTH-4821' };
        const line = (b) => ({
          img: (b.box !== undefined || b.card !== undefined) ? IMG_GIFT : byId(b.id).img,
          qty: b.qty,
          name: b.card !== undefined ? ('IRTH gift card, ' + money(b.card))
            : (b.box !== undefined ? BOXES[b.box].name : byId(b.id).name),
          variant: b.card !== undefined
            ? (GC_WAYS[b.way || 0].label + (b.to ? ' \u00b7 for ' + b.to : ''))
            : (b.box !== undefined
               ? (b.picks.reduce((a, c) => a + c, 0) + ' pieces inside')
               : SIZES[sizeOf(b)].label),
          lineText: money(b.qty * linePrice(b))
        });
        return {
          orderLines: ord.lines.map(line),
          orderGoods: money(ord.goods),
          orderDelivery: ord.delivery ? money(ord.delivery) : 'Free',
          orderTotal: money(ord.total),
          orderRef: ord.ref
        };
      })(),

      /* --- wishlist --- */
      clearWish: pv(() => this.setState({ wish: [] })),

      /* --- the gift card --- */
      gcPreview: !!s.gcPreview,
      toggleGcPreview: pv(() => this.setState({ gcPreview: !s.gcPreview })),
      gcPreviewText: s.gcPreview ? 'Hide preview' : 'Preview',
      gcTo: s.gcTo || '', setGcTo: (e) => this.setState({ gcTo: e.target.value }),
      gcPhone: s.gcPhone || '', setGcPhone: (e) => this.setState({ gcPhone: e.target.value }),
      gcFrom: s.gcFrom || '', setGcFrom: (e) => this.setState({ gcFrom: e.target.value }),
      gcWhen: s.gcWhen || '', setGcWhen: (e) => this.setState({ gcWhen: e.target.value }),
      gcCorner: (s.gcTo || '').trim() ? 'For ' + (s.gcTo || '').trim() : 'Gift card',
      gcCaption: s.gcPreview ? 'As it will reach them' : 'What they will receive',
      gcLines: [
        { k: 'Amount', v: gcAmount ? money(gcAmount) : 'Not chosen yet' },
        { k: 'To', v: (s.gcTo || '').trim() || 'Not filled in' },
        { k: 'On WhatsApp', v: (s.gcPhone || '').trim() || 'Not filled in' },
        { k: 'From', v: (s.gcFrom || '').trim() || 'Not filled in' },
        { k: 'How it arrives', v: GC_WAYS[gcWay].label
            + (gcFee ? ' \u00b7 ' + money(gcFee) : '') },
        { k: 'Delivered', v: (s.gcWhen || '').trim() || 'Today' }],
      gcAddText: gcAmount ? 'Add the card to bag \u00b7 ' + money(gcAmount + gcFee)
        : (gcPick === 3 ? 'Enter an amount' : 'Choose an amount first'),
      gcAdd: pv(() => {
        if (!gcAmount) return;
        this.setState({ bag: bag.concat([{ card: gcAmount, fee: gcFee, way: gcWay,
                                           to: (s.gcTo || '').trim(), qty: 1 }]),
                        bagOpen: true });
      }),

      /* --- quick view --- */
      quickOpen: !!qv,
      qv: qv ? Object.assign(card(qv), { blurb: qv.blurb }) : { name: '', cat: '', img: '', priceText: '', blurb: '', open: pv(() => {}) },
      qvQty: s.qvQty || 1,
      qvInc: pv(() => this.setState({ qvQty: (s.qvQty || 1) + 1 })),
      qvDec: pv(() => this.setState({ qvQty: Math.max(1, (s.qvQty || 1) - 1) })),
      qvAdd: pv(() => { if (qv) addToBag(qv.id); })
    };
    return base;
  }
}

window.addEventListener('DOMContentLoaded', function () {
  window.__irth = window.DCMount('#app', '#irth-template', Component, {"startPage": "home", "startRail": ""});
});
