/* IRTH static runtime — renders the design's template with its logic class.
   Implements the subset used by the site: {{holes}}, <sc-if>, <sc-for>, on* events. */
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
                 onmouseleave: 'mouseleave', onmousedown: 'mousedown', onkeyup: 'keyup' };

  function build(node, scope, parent) {
    var i, c;
    if (node.nodeType === 3) {
      var t = node.nodeValue;
      if (t.indexOf('{{') !== -1) t = String(interp(t, scope));
      parent.appendChild(document.createTextNode(t));
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = (node.tagName || '').toLowerCase();

    if (tag === 'sc-if') {
      if (resolve(node.getAttribute('value') || '', scope)) {
        for (i = 0; i < node.childNodes.length; i++) build(node.childNodes[i], scope, parent);
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
        for (c = 0; c < node.childNodes.length; c++) build(node.childNodes[c], s2, parent);
      }
      return;
    }

    var el = node.cloneNode(false);
    var attrs = Array.prototype.slice.call(el.attributes || []);
    var deferValue = null, deferChecked = null;
    for (i = 0; i < attrs.length; i++) {
      var name = attrs[i].name, raw = attrs[i].value;
      if (name.indexOf('hint-') === 0) { el.removeAttribute(name); continue; }
      var lower = name.toLowerCase();
      if (EVENTS[lower]) {
        el.removeAttribute(name);
        var fn = resolve(raw, scope);
        if (typeof fn === 'function') {
          var ev = EVENTS[lower];
          if (ev === 'change' && (tag === 'input' || tag === 'textarea')) ev = 'input';
          el.addEventListener(ev, fn);
        }
        continue;
      }
      if (raw.indexOf('{{') === -1) continue;
      var val = interp(raw, scope);
      if (lower === 'value' && (tag === 'input' || tag === 'textarea' || tag === 'select')) {
        deferValue = val == null ? '' : String(val);
        el.setAttribute('value', deferValue);
        continue;
      }
      if (lower === 'checked') {
        deferChecked = !!val && val !== 'false';
        el.removeAttribute('checked');
        continue;
      }
      if (val === false || val == null || val === '') el.setAttribute(name, val === 0 ? '0' : '');
      else el.setAttribute(name, String(val));
    }
    for (i = 0; i < node.childNodes.length; i++) build(node.childNodes[i], scope, el);
    if (deferValue !== null) el.value = deferValue;
    if (deferChecked !== null) el.checked = deferChecked;
    parent.appendChild(el);
  }

  function DCLogic() { this.state = {}; this.props = {}; }
  DCLogic.prototype.setState = function (patch, cb) {
    Object.assign(this.state, typeof patch === 'function' ? patch(this.state) : patch);
    if (this._host) this._host.schedule(cb);
    else if (cb) cb();
  };
  DCLogic.prototype.forceUpdate = function (cb) { if (this._host) this._host.schedule(cb); else if (cb) cb(); };

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
    var active = document.activeElement, id = active && active.id, selStart = null, selEnd = null;
    if (id && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
      try { selStart = active.selectionStart; selEnd = active.selectionEnd; } catch (e) {}
    }
    var vals = this.comp.renderVals() || {};
    var frag = document.createDocumentFragment(), i;
    for (i = 0; i < this.template.childNodes.length; i++) build(this.template.childNodes[i], vals, frag);
    this.root.textContent = '';
    this.root.appendChild(frag);
    if (id) {
      var again = document.getElementById(id);
      if (again && again.focus) {
        again.focus();
        if (selStart !== null && again.setSelectionRange) {
          try { again.setSelectionRange(selStart, selEnd); } catch (e) {}
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
