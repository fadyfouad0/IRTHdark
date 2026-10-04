/* IRTH static runtime — renders the design's template with its logic class.
   Implements the subset used by the site: {{holes}}, <sc-if>, <sc-for>, on* events.

   Rendering is a two-step reconcile: the template is compiled to a lightweight
   vnode list against the current scope, then the existing DOM is patched in
   place. Nodes are matched to the template node they came from, so elements,
   images, focus, caret position, scroll and running CSS animations all survive
   a re-render. (The previous version rebuilt document fragments and replaced
   the whole tree, which blanked the page and dropped focus on every keystroke.) */
(function (global) {
  'use strict';

  function lookup(scope, path) {
    var p = String(path).trim();
    if (p === 'true') return true;
    if (p === 'false') return false;
    if (p === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(p)) return parseFloat(p);
    var parts = p.split('.'), v = scope, i;
    for (i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }

  var WHOLE = /^\s*\{\{([^}]*)\}\}\s*$/;
  var ANY = /\{\{([^}]*)\}\}/g;

  function resolve(str, scope) {
    var m = WHOLE.exec(str);
    if (m) return lookup(scope, m[1]);
    return null;
  }

  function interp(str, scope) {
    if (str.indexOf('{{') === -1) return str;
    var whole = WHOLE.exec(str);
    if (whole) {
      var v = lookup(scope, whole[1]);
      return v == null ? '' : v;
    }
    return str.replace(ANY, function (_, expr) {
      var v = lookup(scope, expr);
      return v == null ? '' : String(v);
    });
  }

  var EVENTS = { onclick: 'click', onchange: 'change', onsubmit: 'submit', onkeydown: 'keydown',
                 oninput: 'input', onfocus: 'focus', onblur: 'blur', onmouseenter: 'mouseenter',
                 onmouseleave: 'mouseleave', onmousedown: 'mousedown', onkeyup: 'keyup',
                 onwheel: 'wheel' };

  var TEXT = 1, ELEM = 2;
  var VALUE_TAGS = { input: 1, textarea: 1, select: 1 };

  /* ---- compile: template node + scope -> vnodes ------------------------- */

  function compile(node, scope, out) {
    var i, c;

    if (node.nodeType === 3) {
      var t = node.nodeValue;
      out.push({ t: TEXT, v: t.indexOf('{{') === -1 ? t : String(interp(t, scope)) });
      return;
    }
    if (node.nodeType !== 1) return;

    var tag = (node.tagName || '').toLowerCase();

    if (tag === 'sc-if') {
      if (resolve(node.getAttribute('value') || '', scope)) {
        for (i = 0; i < node.childNodes.length; i++) compile(node.childNodes[i], scope, out);
      }
      return;
    }
    if (tag === 'sc-for') {
      var list = resolve(node.getAttribute('list') || '', scope) || [];
      var as = node.getAttribute('as') || 'item';
      for (i = 0; i < list.length; i++) {
        var s2 = Object.create(scope);
        s2[as] = list[i];
        s2.$index = i;
        for (c = 0; c < node.childNodes.length; c++) compile(node.childNodes[c], s2, out);
      }
      return;
    }

    var dyn = null, events = null, drop = null;
    var value = null, checked = null;
    var attrs = node.attributes;

    for (i = 0; i < attrs.length; i++) {
      var name = attrs[i].name, raw = attrs[i].value;

      if (name.indexOf('hint-') === 0) { (drop || (drop = [])).push(name); continue; }

      var lower = name.toLowerCase();
      if (EVENTS[lower]) {
        (drop || (drop = [])).push(name);
        var fn = resolve(raw, scope);
        if (typeof fn === 'function') {
          var ev = EVENTS[lower];
          if (ev === 'change' && (tag === 'input' || tag === 'textarea')) ev = 'input';
          (events || (events = [])).push(ev, fn);
        }
        continue;
      }

      if (raw.indexOf('{{') === -1) continue;   /* static: the clone already has it */

      var val = interp(raw, scope);

      if (lower === 'value' && VALUE_TAGS[tag]) {
        value = val == null ? '' : String(val);
        (drop || (drop = [])).push(name);
        continue;
      }
      if (lower === 'checked') {
        checked = !!val && val !== 'false';
        (drop || (drop = [])).push(name);
        continue;
      }
      (dyn || (dyn = {}))[name] =
        (val === false || val == null || val === '') ? (val === 0 ? '0' : '') : String(val);
    }

    var kids = [];
    for (i = 0; i < node.childNodes.length; i++) compile(node.childNodes[i], scope, kids);

    out.push({ t: ELEM, src: node, tag: tag, dyn: dyn, events: events,
               drop: drop, value: value, checked: checked, kids: kids });
  }

  /* ---- apply a vnode to a real element ---------------------------------- */

  function applyDyn(el, v) {
    var prev = el.__dcDyn, dyn = v.dyn, k;
    if (dyn) {
      for (k in dyn) {
        if (!Object.prototype.hasOwnProperty.call(dyn, k)) continue;
        if (!prev || prev[k] !== dyn[k]) el.setAttribute(k, dyn[k]);
      }
    }
    if (prev) {
      for (k in prev) {
        if (!Object.prototype.hasOwnProperty.call(prev, k)) continue;
        if (!dyn || !Object.prototype.hasOwnProperty.call(dyn, k)) el.removeAttribute(k);
      }
    }
    el.__dcDyn = dyn;
  }

  function bindEvents(el, v) {
    var old = el.__dcEv, i;
    if (old) for (i = 0; i < old.length; i += 2) el.removeEventListener(old[i], old[i + 1]);
    var ev = v.events || null;
    el.__dcEv = ev;
    if (ev) for (i = 0; i < ev.length; i += 2) el.addEventListener(ev[i], ev[i + 1]);
  }

  function applyValue(el, v) {
    if (v.value !== null && el.value !== v.value) {
      /* keep the caret where the person left it when the value really changes */
      var live = (document.activeElement === el), ss = null, se = null;
      if (live) { try { ss = el.selectionStart; se = el.selectionEnd; } catch (e) {} }
      el.value = v.value;
      if (live && ss !== null && el.setSelectionRange) {
        try { el.setSelectionRange(ss, se); } catch (e) {}
      }
    }
    if (v.checked !== null && el.checked !== v.checked) el.checked = v.checked;
  }

  function createNode(v) {
    if (v.t === TEXT) return document.createTextNode(v.v);
    var el = v.src.cloneNode(false);          /* keeps namespace + static attrs */
    var i;
    if (v.drop) for (i = 0; i < v.drop.length; i++) el.removeAttribute(v.drop[i]);
    el.__dcSrc = v.src;
    el.__dcDyn = null;
    applyDyn(el, v);
    bindEvents(el, v);
    for (i = 0; i < v.kids.length; i++) el.appendChild(createNode(v.kids[i]));
    applyValue(el, v);
    return el;
  }

  function sameNode(dom, v) {
    if (!dom || !v) return false;
    if (v.t === TEXT) return dom.nodeType === 3;
    return dom.nodeType === 1 && dom.__dcSrc === v.src;
  }

  function patchNode(dom, v) {
    if (v.t === TEXT) {
      if (dom.nodeValue !== v.v) dom.nodeValue = v.v;
      return;
    }
    applyDyn(dom, v);
    bindEvents(dom, v);
    patchChildren(dom, v.kids);
    applyValue(dom, v);
  }

  function patchChildren(parent, vs) {
    var i = 0, guard = 0;
    while (i < vs.length && guard++ < 100000) {
      var v = vs[i], cur = parent.childNodes[i];
      if (sameNode(cur, v)) { patchNode(cur, v); i++; continue; }
      /* one node disappeared here: drop it and retry this slot */
      if (cur && sameNode(parent.childNodes[i + 1], v) && !sameNode(cur, vs[i + 1])) {
        parent.removeChild(cur);
        continue;
      }
      /* otherwise a node appeared (or the type changed): insert a fresh one */
      var fresh = createNode(v);
      if (cur && !sameNode(cur, vs[i + 1])) parent.replaceChild(fresh, cur);
      else parent.insertBefore(fresh, cur || null);
      i++;
    }
    while (parent.childNodes.length > vs.length) parent.removeChild(parent.lastChild);
  }

  /* ---- focus safety net -------------------------------------------------- */

  function pathTo(root, el) {
    var p = [], n = el;
    while (n && n !== root) {
      var parent = n.parentNode;
      if (!parent) return null;
      p.push(Array.prototype.indexOf.call(parent.childNodes, n));
      n = parent;
    }
    return n === root ? p : null;
  }

  function nodeAt(root, path) {
    var n = root, i;
    for (i = path.length - 1; i >= 0; i--) {
      if (!n) return null;
      n = n.childNodes[path[i]];
    }
    return n;
  }

  /* ---- component host ---------------------------------------------------- */

  function DCLogic() { this.state = {}; this.props = {}; }
  DCLogic.prototype.setState = function (patch, cb) {
    Object.assign(this.state, typeof patch === 'function' ? patch(this.state) : patch);
    if (this._host) this._host.schedule(cb);
    else if (cb) cb();
  };
  DCLogic.prototype.forceUpdate = function (cb) {
    if (this._host) this._host.schedule(cb); else if (cb) cb();
  };

  function Host(root, template, comp) {
    this.root = root; this.template = template; this.comp = comp;
    this.queued = false; this.cbs = []; this.mounted = false;
  }
  Host.prototype.schedule = function (cb) {
    if (cb) this.cbs.push(cb);
    if (this.queued) return;
    this.queued = true;
    var self = this;
    requestAnimationFrame(function () { self.queued = false; self.render(); });
  };
  Host.prototype.render = function () {
    var active = document.activeElement;
    var track = (active && active !== document.body && this.root.contains(active)) ? active : null;
    var path = track ? pathTo(this.root, track) : null;
    var ss = null, se = null;
    if (track && 'selectionStart' in track) {
      try { ss = track.selectionStart; se = track.selectionEnd; } catch (e) {}
    }

    var vals = this.comp.renderVals() || {};
    var vs = [], i;
    for (i = 0; i < this.template.childNodes.length; i++) compile(this.template.childNodes[i], vals, vs);
    patchChildren(this.root, vs);

    /* in-place patching normally keeps focus; this only catches the rare
       case where the focused element genuinely had to be replaced */
    if (track && document.activeElement !== track && !this.root.contains(track) && path) {
      var again = nodeAt(this.root, path);
      if (again && again.focus) {
        again.focus();
        if (ss !== null && again.setSelectionRange) {
          try { again.setSelectionRange(ss, se); } catch (e) {}
        }
      }
    }

    var cbs = this.cbs; this.cbs = [];
    if (!this.mounted) {
      this.mounted = true;
      if (this.comp.componentDidMount) this.comp.componentDidMount();
    } else if (this.comp.componentDidUpdate) {
      this.comp.componentDidUpdate();
    }
    for (i = 0; i < cbs.length; i++) cbs[i]();
  };

  global.DCLogic = DCLogic;
  global.DCMount = function (rootSel, templateSel, ComponentClass, props) {
    var root = document.querySelector(rootSel);
    var tpl = document.querySelector(templateSel);
    var comp = new ComponentClass();
    comp.props = props || {};
    if (!comp.state) comp.state = {};
    var host = new Host(root, tpl.content, comp);
    comp._host = host;
    host.render();
    return comp;
  };
})(window);
