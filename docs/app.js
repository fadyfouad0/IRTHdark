/* IRTH — site logic (exported from the design source) */
class Component extends DCLogic {
  st() { return Object.assign({ page: 'home', mode: 'canvas', vh: 900, past: false, annOff: false }, this.state); }
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
    set('hdr', (st) => { st.color = col; });
    set('rail', (st) => { st.color = col; st.opacity = String(e(Math.min(1, Math.max(0, (light - 0.35) / 0.55)))); st.pointerEvents = light > 0.5 ? 'auto' : 'none'; });
    set('logoDark', (st) => { st.opacity = String(1 - light); });
    set('logoLight', (st) => { st.opacity = String(light); });
    const active = p < 0.24 ? 0 : p < 0.52 ? 1 : p < 0.74 ? 2 : 3;
    for (let i = 0; i < 4; i++) set('t' + i, (st) => { st.opacity = i === active ? '1' : '0.4'; });
  }
  renderVals() {
    const s = this.st();
    const canvas = s.mode === 'canvas';
    const noop = (e) => { if (e && e.preventDefault) e.preventDefault(); };
    const labels = ['The house', 'Luxury dates', 'Gifting', 'Our story'];
    return {
      rootH: canvas ? '8107px' : 'auto',
      deep: '#6E7059',
      fDisplay: "'Marcellus', Georgia, serif",
      fSerif: "'Bodoni Moda', Didot, serif",
      stages: [{ i: 0, tag: 'Home \u00b7 hero at scroll 0%, press Play to scroll the site', showTag: canvas, border: '0' }],
      stageH: s.vh,
      stagePos: canvas ? 'relative' : 'sticky',
      trackH: canvas ? s.vh : s.vh * 5,
      annOn: !s.annOff,
      annTop: s.annOff ? 0 : 36,
      closeAnn: (e) => { noop(e); this.setState({ annOff: true }); },
      navItems: labels.map((l) => ({ label: l, go: noop, heroBorder: '1px solid transparent' })),
      go: { home: noop, account: noop, wishlist: noop },
      openSearch: noop,
      openCart: noop,
      goDates: noop,
      toMembership: noop,
      accountLabel: 'Account',
      wishCount: 0, wishHas: false,
      cartCount: 0, cartHas: false, cartTotalText: 'SAR 0',
    };
  }
}

window.addEventListener('DOMContentLoaded', function () {
  window.DCMount('#app', '#irth-template', Component, {});
});
