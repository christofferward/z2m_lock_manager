/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, Y = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, J = Symbol(), X = /* @__PURE__ */ new WeakMap();
let ht = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== J) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Y && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = X.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && X.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const $t = (o) => new ht(typeof o == "string" ? o : o + "", void 0, J), pt = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((s, i, a) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[a + 1], o[0]);
  return new ht(e, o, J);
}, yt = (o, t) => {
  if (Y) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = j.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, o.appendChild(s);
  }
}, tt = Y ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return $t(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: vt, defineProperty: bt, getOwnPropertyDescriptor: xt, getOwnPropertyNames: St, getOwnPropertySymbols: At, getPrototypeOf: wt } = Object, y = globalThis, et = y.trustedTypes, kt = et ? et.emptyScript : "", F = y.reactiveElementPolyfillSupport, D = (o, t) => o, V = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? kt : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, K = (o, t) => !vt(o, t), st = { attribute: !0, type: String, converter: V, reflect: !1, useDefault: !1, hasChanged: K };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = st) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && bt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: a } = xt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: i, set(r) {
      const l = i == null ? void 0 : i.call(this);
      a == null || a.call(this, r), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(D("elementProperties"))) return;
    const t = wt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(D("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(D("properties"))) {
      const e = this.properties, s = [...St(e), ...At(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(tt(i));
    } else t !== void 0 && e.push(tt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return yt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var a;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const r = (((a = s.converter) == null ? void 0 : a.toAttribute) !== void 0 ? s.converter : V).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var a, r;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const l = s.getPropertyOptions(i), n = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((a = l.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? l.converter : V;
      this._$Em = i;
      const d = n.fromAttribute(e, l.type);
      this[i] = d ?? ((r = this._$Ej) == null ? void 0 : r.get(i)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, a) {
    var r;
    if (t !== void 0) {
      const l = this.constructor;
      if (i === !1 && (a = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? K)(a, e) || s.useDefault && s.reflect && a === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: a }, r) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), a !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [a, r] of this._$Ep) this[a] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [a, r] of i) {
        const { wrapped: l } = r, n = this[a];
        l !== !0 || this._$AL.has(a) || n === void 0 || this.C(a, void 0, r, n);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var a;
        return (a = i.hostUpdate) == null ? void 0 : a.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[D("elementProperties")] = /* @__PURE__ */ new Map(), E[D("finalized")] = /* @__PURE__ */ new Map(), F == null || F({ ReactiveElement: E }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, it = (o) => o, q = U.trustedTypes, ot = q ? q.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, ut = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, gt = "?" + $, Et = `<${gt}>`, S = document, z = () => S.createComment(""), N = (o) => o === null || typeof o != "object" && typeof o != "function", Q = Array.isArray, Ct = (o) => Q(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", W = `[ 	
\f\r]`, R = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, at = />/g, v = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nt = /'/g, lt = /"/g, ft = /^(?:script|style|textarea|title)$/i, Pt = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), p = Pt(1), T = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), ct = /* @__PURE__ */ new WeakMap(), b = S.createTreeWalker(S, 129);
function _t(o, t) {
  if (!Q(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ot !== void 0 ? ot.createHTML(t) : t;
}
const Tt = (o, t) => {
  const e = o.length - 1, s = [];
  let i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = R;
  for (let l = 0; l < e; l++) {
    const n = o[l];
    let d, u, c = -1, g = 0;
    for (; g < n.length && (r.lastIndex = g, u = r.exec(n), u !== null); ) g = r.lastIndex, r === R ? u[1] === "!--" ? r = rt : u[1] !== void 0 ? r = at : u[2] !== void 0 ? (ft.test(u[2]) && (i = RegExp("</" + u[2], "g")), r = v) : u[3] !== void 0 && (r = v) : r === v ? u[0] === ">" ? (r = i ?? R, c = -1) : u[1] === void 0 ? c = -2 : (c = r.lastIndex - u[2].length, d = u[1], r = u[3] === void 0 ? v : u[3] === '"' ? lt : nt) : r === lt || r === nt ? r = v : r === rt || r === at ? r = R : (r = v, i = void 0);
    const m = r === v && o[l + 1].startsWith("/>") ? " " : "";
    a += r === R ? n + Et : c >= 0 ? (s.push(d), n.slice(0, c) + ut + n.slice(c) + $ + m) : n + $ + (c === -2 ? l : m);
  }
  return [_t(o, a + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class H {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let a = 0, r = 0;
    const l = t.length - 1, n = this.parts, [d, u] = Tt(t, e);
    if (this.el = H.createElement(d, s), b.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = b.nextNode()) !== null && n.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(ut)) {
          const g = u[r++], m = i.getAttribute(c).split($), I = /([.?@])?(.*)/.exec(g);
          n.push({ type: 1, index: a, name: I[2], strings: m, ctor: I[1] === "." ? Ot : I[1] === "?" ? Rt : I[1] === "@" ? Dt : B }), i.removeAttribute(c);
        } else c.startsWith($) && (n.push({ type: 6, index: a }), i.removeAttribute(c));
        if (ft.test(i.tagName)) {
          const c = i.textContent.split($), g = c.length - 1;
          if (g > 0) {
            i.textContent = q ? q.emptyScript : "";
            for (let m = 0; m < g; m++) i.append(c[m], z()), b.nextNode(), n.push({ type: 2, index: ++a });
            i.append(c[g], z());
          }
        }
      } else if (i.nodeType === 8) if (i.data === gt) n.push({ type: 2, index: a });
      else {
        let c = -1;
        for (; (c = i.data.indexOf($, c + 1)) !== -1; ) n.push({ type: 7, index: a }), c += $.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const s = S.createElement("template");
    return s.innerHTML = t, s;
  }
}
function M(o, t, e = o, s) {
  var r, l;
  if (t === T) return t;
  let i = s !== void 0 ? (r = e._$Co) == null ? void 0 : r[s] : e._$Cl;
  const a = N(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== a && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), a === void 0 ? i = void 0 : (i = new a(o), i._$AT(o, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = M(o, i._$AS(o, t.values), i, s)), t;
}
class Mt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? S).importNode(e, !0);
    b.currentNode = i;
    let a = b.nextNode(), r = 0, l = 0, n = s[0];
    for (; n !== void 0; ) {
      if (r === n.index) {
        let d;
        n.type === 2 ? d = new L(a, a.nextSibling, this, t) : n.type === 1 ? d = new n.ctor(a, n.name, n.strings, this, t) : n.type === 6 && (d = new Ut(a, this, t)), this._$AV.push(d), n = s[++l];
      }
      r !== (n == null ? void 0 : n.index) && (a = b.nextNode(), r++);
    }
    return b.currentNode = S, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class L {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = M(this, t, e), N(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== T && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ct(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && N(this._$AH) ? this._$AA.nextSibling.data = t : this.T(S.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var a;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = H.createElement(_t(s.h, s.h[0]), this.options)), s);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === i) this._$AH.p(e);
    else {
      const r = new Mt(i, this), l = r.u(this.options);
      r.p(e), this.T(l), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = ct.get(t.strings);
    return e === void 0 && ct.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    Q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const a of t) i === e.length ? e.push(s = new L(this.O(z()), this.O(z()), this, this.options)) : s = e[i], s._$AI(a), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = it(t).nextSibling;
      it(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, a) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = h;
  }
  _$AI(t, e = this, s, i) {
    const a = this.strings;
    let r = !1;
    if (a === void 0) t = M(this, t, e, 0), r = !N(t) || t !== this._$AH && t !== T, r && (this._$AH = t);
    else {
      const l = t;
      let n, d;
      for (t = a[0], n = 0; n < a.length - 1; n++) d = M(this, l[s + n], e, n), d === T && (d = this._$AH[n]), r || (r = !N(d) || d !== this._$AH[n]), d === h ? t = h : t !== h && (t += (d ?? "") + a[n + 1]), this._$AH[n] = d;
    }
    r && !i && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ot extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Rt extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Dt extends B {
  constructor(t, e, s, i, a) {
    super(t, e, s, i, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = M(this, t, e, 0) ?? h) === T) return;
    const s = this._$AH, i = t === h && s !== h || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, a = t !== h && (s === h || i);
    i && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ut {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    M(this, t);
  }
}
const Z = U.litHtmlPolyfillSupport;
Z == null || Z(H, L), (U.litHtmlVersions ?? (U.litHtmlVersions = [])).push("3.3.2");
const zt = (o, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const a = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new L(t.insertBefore(z(), a), a, void 0, e ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
class C extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = zt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return T;
  }
}
var dt;
C._$litElement$ = !0, C.finalized = !0, (dt = x.litElementHydrateSupport) == null || dt.call(x, { LitElement: C });
const G = x.litElementPolyfillSupport;
G == null || G({ LitElement: C });
(x.litElementVersions ?? (x.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = (o) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(o, t);
  }) : customElements.define(o, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nt = { attribute: !0, type: String, converter: V, reflect: !1, hasChanged: K }, Ht = (o = Nt, t, e) => {
  const { kind: s, metadata: i } = e;
  let a = globalThis.litPropertyMetadata.get(i);
  if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), s === "setter" && ((o = Object.create(o)).wrapped = !0), a.set(e.name, o), s === "accessor") {
    const { name: r } = e;
    return { set(l) {
      const n = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(r, n, o, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, o, l), l;
    } };
  }
  if (s === "setter") {
    const { name: r } = e;
    return function(l) {
      const n = this[r];
      t.call(this, l), this.requestUpdate(r, n, o, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function A(o) {
  return (t, e) => typeof e == "object" ? Ht(o, t, e) : ((s, i, a) => {
    const r = i.hasOwnProperty(a);
    return i.constructor.createProperty(a, s), r ? Object.getOwnPropertyDescriptor(i, a) : void 0;
  })(o, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function O(o) {
  return A({ ...o, state: !0, attribute: !1 });
}
const P = {
  en: {
    title: "Zigbee2MQTT Locks",
    select_lock: "Select Lock",
    loading: "Loading...",
    slot: "Slot",
    name: "Name",
    pin_code: "PIN Code",
    user_type: "User Type",
    enabled: "Enabled",
    actions: "Actions",
    save: "Save",
    clear: "Clear",
    user_type_unrestricted: "Unrestricted",
    user_type_year_day_schedule: "Year/Day Schedule",
    user_type_week_day_schedule: "Week/Day Schedule",
    user_type_master: "Master",
    user_type_non_access: "Non-Access",
    fingerprint: "Fingerprint",
    rfid: "RFID",
    auto_rotate: "Temporary Code (Guest)",
    rotate_interval: "Valid for (Hours)",
    expires_in: "Expires in",
    expired: "Expired!",
    saving: "Saving...",
    saved: "Saved!",
    clearing: "Clearing...",
    cleared: "Cleared!",
    prev_page: "Previous",
    next_page: "Next"
  },
  sv: {
    title: "Zigbee2MQTT Lås",
    select_lock: "Välj lås",
    loading: "Laddar...",
    slot: "Plats",
    name: "Namn",
    pin_code: "PIN-kod",
    user_type: "Användartyp",
    enabled: "Aktiverad",
    actions: "Åtgärder",
    save: "Spara",
    clear: "Rensa",
    user_type_unrestricted: "Obegränsad",
    user_type_year_day_schedule: "Års/dagsschema",
    user_type_week_day_schedule: "Vecko/dagsschema",
    user_type_master: "Master",
    user_type_non_access: "Ingen åtkomst",
    fingerprint: "Fingeravtryck",
    rfid: "RFID",
    auto_rotate: "Tillfällig kod (Gäst)",
    rotate_interval: "Giltig i (Timmar)",
    expires_in: "Utgår om",
    expired: "Utgått!",
    saving: "Sparar...",
    saved: "Sparad!",
    clearing: "Rensar...",
    cleared: "Rensad!",
    prev_page: "Föregående",
    next_page: "Nästa"
  }
}, Lt = pt`
  :host {
    display: block;
    padding: 16px;
    background-color: var(--primary-background-color);
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }
  .card {
    background: var(--card-background-color, #fff);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(
      --ha-card-box-shadow,
      0px 2px 1px -1px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.14),
      0px 1px 3px 0px rgba(0, 0, 0, 0.12)
    );
    padding: 16px;
    max-width: 900px;
    margin: 0 auto;
  }
  .header {
    font-size: 24px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--divider-color);
    padding-bottom: 8px;
  }
  .lock-selector {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .lock-selector select {
    padding: 10px 12px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid var(--divider-color);
    background-color: var(--card-background-color);
    color: var(--primary-text-color);
    width: 100%;
    max-width: 400px;
    min-height: 44px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .slot-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 12px 0 4px;
  }
  .pagination button {
    padding: 6px 14px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    background-color: var(--card-background-color);
    color: var(--primary-text-color);
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
  }
  .pagination button:hover:not(:disabled) {
    background-color: var(--divider-color);
  }
  .pagination button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .pagination .page-info {
    font-size: 13px;
    color: var(--secondary-text-color);
  }
`, It = pt`
  :host { display: block; }
  .slot-accordion {
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background-color: var(--secondary-background-color, transparent);
    overflow: hidden;
  }
  .slot-accordion summary {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    cursor: pointer;
    list-style: none;
    user-select: none;
    font-size: 14px;
  }
  .slot-accordion summary::-webkit-details-marker {
    display: none;
  }
  .slot-accordion summary::before {
    content: "▸";
    font-size: 14px;
    color: var(--secondary-text-color);
    transition: transform 0.15s ease;
    flex-shrink: 0;
  }
  .slot-accordion[open] summary::before {
    transform: rotate(90deg);
  }
  .slot-accordion summary:hover {
    background-color: var(--divider-color);
  }
  .slot-summary-title {
    font-weight: 500;
    color: var(--primary-color);
    min-width: 52px;
  }
  .slot-summary-name {
    color: var(--primary-text-color);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .slot-summary-badges {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-shrink: 0;
  }
  .badge {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 500;
    white-space: nowrap;
  }
  .badge-enabled {
    background-color: rgba(67, 160, 71, 0.15);
    color: var(--success-color, #43a047);
  }
  .badge-disabled {
    background-color: rgba(158, 158, 158, 0.15);
    color: var(--secondary-text-color);
  }
  .badge-guest {
    background-color: rgba(3, 169, 244, 0.15);
    color: var(--primary-color, #03a9f4);
  }
  .slot-accordion-body {
    padding: 10px 16px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .slot-main-inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    align-items: flex-start;
  }
  .slot-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 4px;
  }
  .toggles-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }
  .slot-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: normal;
    font-size: 13px;
  }
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .input-group label {
    font-size: 12px;
    color: var(--secondary-text-color);
    font-weight: 500;
    text-transform: uppercase;
  }
  input[type="text"],
  input[type="password"],
  input[type="number"],
  select {
    padding: 4px 6px;
    font-size: 13px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    background-color: var(--card-background-color);
    color: var(--primary-text-color);
    width: 100%;
    box-sizing: border-box;
    height: 32px;
  }
  select {
    padding-right: 2px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  input:focus,
  select:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: -1px;
  }
  .code-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .code-wrapper input {
    flex: 1;
  }
  .btn-toggle {
    background: var(--secondary-background-color);
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    cursor: pointer;
    padding: 0 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
  }
  .btn-toggle:hover {
    background: var(--divider-color);
  }
  .slot-actions {
    display: flex;
    gap: 8px;
    margin: 0;
    justify-content: flex-end;
  }
  .btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    color: white;
    height: 32px;
    font-size: 13px;
  }
  .btn-save {
    background-color: var(--primary-color);
    margin-right: 8px;
  }
  .btn-clear {
    background-color: var(--error-color, #db4437);
  }
`, jt = p`<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`, Vt = p`<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`;
var qt = Object.defineProperty, Bt = Object.getOwnPropertyDescriptor, w = (o, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Bt(t, e) : t, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = (s ? r(t, e, i) : r(i)) || i);
  return s && i && qt(t, e, i), i;
};
let f = class extends C {
  constructor() {
    super(...arguments), this.actionState = null, this._codeVisible = !1;
  }
  t(o) {
    var s;
    const t = ((s = this.hass) == null ? void 0 : s.language) || "en";
    return (P[t] || P.en)[o] || P.en[o] || o;
  }
  calculateTimeRemaining(o, t) {
    const e = new Date(o), i = new Date(e.getTime() + t * 60 * 60 * 1e3).getTime() - this.currentTime.getTime();
    if (i <= 0)
      return this.t("expired");
    const a = Math.floor(i / (1e3 * 60 * 60)), r = Math.floor(i % (1e3 * 60 * 60) / (1e3 * 60));
    return `${a}h ${r}m`;
  }
  toggleCodeVisibility() {
    this._codeVisible = !this._codeVisible;
  }
  handleSave() {
    const o = this.shadowRoot.querySelector("#name"), t = this.shadowRoot.querySelector("#code"), e = this.shadowRoot.querySelector("#enabled"), s = this.shadowRoot.querySelector("#usertype"), i = this.shadowRoot.querySelector("#fingerprint"), a = this.shadowRoot.querySelector("#rfid"), r = this.shadowRoot.querySelector("#autorotate"), l = this.shadowRoot.querySelector("#interval");
    this.dispatchEvent(
      new CustomEvent("save-slot", {
        detail: {
          slot: this.slotStr,
          name: o.value,
          code: t.value,
          enabled: e.checked,
          userType: s ? s.value : "unrestricted",
          hasFingerprint: i ? i.checked : !1,
          hasRfid: a ? a.checked : !1,
          autoRotate: r ? r.checked : !1,
          rotateIntervalHours: l ? parseInt(l.value || "24", 10) : 24
        },
        bubbles: !0,
        composed: !0
      })
    );
  }
  handleClear() {
    this.dispatchEvent(
      new CustomEvent("clear-slot", {
        detail: { slot: this.slotStr },
        bubbles: !0,
        composed: !0
      })
    );
  }
  // To easily update local state instead of requiring a full save just to show the interval box
  handleAutoRotateChange(o) {
    const t = o.target;
    this.dispatchEvent(
      new CustomEvent("update-slot-data", {
        detail: {
          slot: this.slotStr,
          updates: { auto_rotate: t.checked }
        },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    var o, t, e, s;
    return p`
      <details class="slot-accordion">
        <summary>
          <span class="slot-summary-title">${this.t("slot")} ${this.slotStr}</span>
          <span class="slot-summary-name">${this.slotData.name || "—"}</span>
          <span class="slot-summary-badges">
            ${this.slotData.auto_rotate ? p`<span class="badge badge-guest">${this.t("auto_rotate")}</span>` : ""}
            ${this.slotData.enabled ? p`<span class="badge badge-enabled">${this.t("enabled")}</span>` : p`<span class="badge badge-disabled">${this.t("user_type_non_access")}</span>`}
          </span>
        </summary>

        <div class="slot-accordion-body">
          <label class="slot-toggle" style="font-weight: 500;">
            <input type="checkbox" id="enabled" ?checked="${this.slotData.enabled}" />
            ${this.t("enabled")}
          </label>

          <div class="slot-main-inputs">
            <div class="input-group">
              <label>${this.t("name")}</label>
              <input type="text" id="name" .value="${this.slotData.name}" />
            </div>

            <div class="input-group">
              <label>${this.t("pin_code")}${this.slotData.auto_rotate ? " (Auto)" : ""}</label>
              <div class="code-wrapper">
                <input
                  type="${this._codeVisible ? "text" : "password"}"
                  id="code"
                  .value="${this.slotData.code}"
                  ?disabled="${this.slotData.auto_rotate}"
                />
                <button
                  class="btn-toggle"
                  @click=${this.toggleCodeVisibility}
                  title="Toggle visibility"
                >
                  <span style="display:flex; align-items:center; justify-content:center;">
                    ${this._codeVisible ? Vt : jt}
                  </span>
                </button>
              </div>
            </div>

            ${this.slotData.auto_rotate ? p`
                    <div class="input-group">
                      <label>${this.t("rotate_interval")}</label>
                      <input
                        type="number"
                        id="interval"
                        .value="${this.slotData.rotate_interval_hours || 24}"
                        min="1"
                      />
                      ${this.slotData.last_rotated && this.slotData.enabled ? p`
                              <div style="font-size: 12px; color: var(--secondary-text-color); margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                                <span
                                  style="display: inline-block; width: 6px; height: 6px; background-color: ${this.calculateTimeRemaining(
      this.slotData.last_rotated,
      this.slotData.rotate_interval_hours || 24
    ) === this.t("expired") ? "var(--error-color, #db4437)" : "var(--success-color, #43a047)"}; border-radius: 50%;"
                                ></span>
                                ${this.t("expires_in")}:
                                <strong>${this.calculateTimeRemaining(
      this.slotData.last_rotated,
      this.slotData.rotate_interval_hours || 24
    )}</strong>
                              </div>
                            ` : ""}
                    </div>
                  ` : p`
                    <div class="input-group">
                      <label>${this.t("user_type")}</label>
                      <select
                        id="usertype"
                        .value="${this.slotData.user_type || "unrestricted"}"
                      >
                        <option value="unrestricted">${this.t("user_type_unrestricted")}</option>
                        <option value="non_access">${this.t("user_type_non_access")}</option>
                      </select>
                    </div>
                  `}
          </div>

          <div class="slot-footer">
            <div class="toggles-wrapper">
              <label class="slot-toggle">
                <input
                  type="checkbox"
                  id="autorotate"
                  ?checked="${this.slotData.auto_rotate}"
                  @change=${this.handleAutoRotateChange}
                />
                ${this.t("auto_rotate")}
              </label>

              <label class="slot-toggle">
                <input
                  type="checkbox"
                  id="fingerprint"
                  ?checked="${this.slotData.has_fingerprint}"
                />
                ${this.t("fingerprint")}
              </label>
              <label class="slot-toggle">
                <input
                  type="checkbox"
                  id="rfid"
                  ?checked="${this.slotData.has_rfid}"
                />
                ${this.t("rfid")}
              </label>
            </div>

            <div class="slot-actions">
              <button class="btn btn-save" @click=${this.handleSave}>
                ${((o = this.actionState) == null ? void 0 : o.slot) === this.slotStr && this.actionState.type === "saving" ? this.t("saving") : ((t = this.actionState) == null ? void 0 : t.slot) === this.slotStr && this.actionState.type === "saved" ? this.t("saved") : this.t("save")}
              </button>
              <button class="btn btn-clear" @click=${this.handleClear}>
                ${((e = this.actionState) == null ? void 0 : e.slot) === this.slotStr && this.actionState.type === "clearing" ? this.t("clearing") : ((s = this.actionState) == null ? void 0 : s.slot) === this.slotStr && this.actionState.type === "cleared" ? this.t("cleared") : this.t("clear")}
              </button>
            </div>
          </div>
        </div>
      </details>
    `;
  }
};
f.styles = It;
w([
  A({ type: Object })
], f.prototype, "slotData", 2);
w([
  A({ type: String })
], f.prototype, "slotStr", 2);
w([
  A({ type: Object })
], f.prototype, "hass", 2);
w([
  A({ type: Object })
], f.prototype, "actionState", 2);
w([
  A({ type: Object })
], f.prototype, "currentTime", 2);
w([
  O()
], f.prototype, "_codeVisible", 2);
f = w([
  mt("z2m-lock-slot")
], f);
var Ft = Object.defineProperty, Wt = Object.getOwnPropertyDescriptor, k = (o, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Wt(t, e) : t, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = (s ? r(t, e, i) : r(i)) || i);
  return s && i && Ft(t, e, i), i;
};
let _ = class extends C {
  constructor() {
    super(...arguments), this.locks = [], this.selectedLock = null, this.actionState = null, this.currentPage = 1, this.currentTime = /* @__PURE__ */ new Date(), this._timerInterval = null, this._hassSet = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._timerInterval = window.setInterval(() => {
      this.currentTime = /* @__PURE__ */ new Date();
    }, 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._timerInterval !== null && window.clearInterval(this._timerInterval);
  }
  calculateTimeRemaining(o, t) {
    const e = new Date(o), i = new Date(
      e.getTime() + t * 60 * 60 * 1e3
    ).getTime() - this.currentTime.getTime();
    if (i <= 0)
      return this.t("expired");
    const a = Math.floor(i / (1e3 * 60 * 60)), r = Math.floor(i % (1e3 * 60 * 60) / (1e3 * 60));
    return `${a}h ${r}m`;
  }
  t(o) {
    var s;
    const t = ((s = this.hass) == null ? void 0 : s.language) || "en";
    return (P[t] || P.en)[o] || P.en[o] || o;
  }
  updated(o) {
    o.has("hass") && this.hass && !this._hassSet && (this._hassSet = !0, this.loadLocks());
  }
  async loadLocks() {
    try {
      this.locks = await this.hass.connection.sendMessagePromise({
        type: "z2m_lock_manager/get_locks"
      }), this.locks.length > 0 && !this.selectedLock && (this.selectedLock = this.locks[0].entity_id);
    } catch (o) {
      console.error("Failed to load locks", o);
    }
  }
  async setCode(o, t, e, s, i, a, r, l, n) {
    try {
      await this.hass.connection.sendMessagePromise({
        type: "z2m_lock_manager/set_code",
        entity_id: this.selectedLock,
        slot: parseInt(o, 10),
        name: t,
        code: e,
        enabled: s,
        user_type: i,
        has_fingerprint: a,
        has_rfid: r,
        auto_rotate: l,
        rotate_interval_hours: n
      }), await this.loadLocks();
    } catch (d) {
      console.error("Failed to set code", d);
    }
  }
  async clearCode(o) {
    try {
      await this.hass.connection.sendMessagePromise({
        type: "z2m_lock_manager/clear_code",
        entity_id: this.selectedLock,
        slot: parseInt(o, 10)
      }), await this.loadLocks();
    } catch (t) {
      console.error("Failed to clear code", t);
    }
  }
  handleLockChange(o) {
    const t = o.target;
    this.selectedLock = t.value, this.currentPage = 1;
  }
  async handleSlotSave(o) {
    const t = o.detail;
    this.actionState = { slot: t.slot, type: "saving" }, await this.setCode(
      t.slot,
      t.name,
      t.code,
      t.enabled,
      t.userType,
      t.hasFingerprint,
      t.hasRfid,
      t.autoRotate,
      t.rotateIntervalHours
    ), this.actionState = { slot: t.slot, type: "saved" }, setTimeout(() => {
      var e, s;
      ((e = this.actionState) == null ? void 0 : e.slot) === t.slot && ((s = this.actionState) == null ? void 0 : s.type) === "saved" && (this.actionState = null);
    }, 2e3);
  }
  async handleSlotClear(o) {
    const t = o.detail;
    this.actionState = { slot: t.slot, type: "clearing" }, await this.clearCode(t.slot), this.actionState = { slot: t.slot, type: "cleared" }, setTimeout(() => {
      var e, s;
      ((e = this.actionState) == null ? void 0 : e.slot) === t.slot && ((s = this.actionState) == null ? void 0 : s.type) === "cleared" && (this.actionState = null);
    }, 2e3);
  }
  handleSlotUpdate(o) {
    const t = o.detail, e = this.locks.findIndex((s) => s.entity_id === this.selectedLock);
    e > -1 && (this.locks[e].slots[t.slot] || (this.locks[e].slots[t.slot] = {
      name: "",
      code: "",
      enabled: !1,
      user_type: "unrestricted",
      auto_rotate: !1,
      rotate_interval_hours: 24
    }), this.locks[e].slots[t.slot] = {
      ...this.locks[e].slots[t.slot],
      ...t.updates
    }, this.requestUpdate());
  }
  render() {
    if (!this.hass || !this.locks.length)
      return p`<div class="card">${this.t("loading")}</div>`;
    const o = this.locks.find(
      (t) => t.entity_id === this.selectedLock
    );
    return p`
      <div class="card">
        <div class="header">${this.t("title")}</div>

        <div class="lock-selector">
          <label>${this.t("select_lock")}</label>
          <select id="lock-select" @change=${this.handleLockChange}>
            ${this.locks.map(
      (t) => p`
                <option
                  value="${t.entity_id}"
                  ?selected=${t.entity_id === this.selectedLock}
                >
                  ${t.name}
                </option>
              `
    )}
          </select>
        </div>

        <div class="slot-list">${this.renderSlots(o)}</div>
        ${this.renderPagination(o)}
      </div>
    `;
  }
  renderPagination(o) {
    if (!o) return p``;
    const t = o.max_slots || 10, e = Math.ceil(t / 10);
    return e <= 1 ? p`` : p`
      <div class="pagination">
        <button
          ?disabled=${this.currentPage <= 1}
          @click=${() => {
      this.currentPage--;
    }}
        >
          ← ${this.t("prev_page")}
        </button>
        <span class="page-info">${this.currentPage} / ${e}</span>
        <button
          ?disabled=${this.currentPage >= e}
          @click=${() => {
      this.currentPage++;
    }}
        >
          ${this.t("next_page")} →
        </button>
      </div>
    `;
  }
  renderSlots(o) {
    if (!o)
      return p``;
    const t = [], e = o.max_slots || 10, s = 10, i = (this.currentPage - 1) * s + 1, a = Math.min(this.currentPage * s, e);
    for (let r = i; r <= a; r++) {
      const l = r.toString(), n = o.slots[l] || {
        name: "",
        code: "",
        enabled: !1,
        user_type: "unrestricted",
        auto_rotate: !1,
        rotate_interval_hours: 24
      };
      t.push(p`
        <z2m-lock-slot
          .slotData=${n}
          .slotStr=${l}
          .hass=${this.hass}
          .currentTime=${this.currentTime}
          .actionState=${this.actionState}
          @save-slot=${this.handleSlotSave}
          @clear-slot=${this.handleSlotClear}
          @update-slot-data=${this.handleSlotUpdate}
        ></z2m-lock-slot>
      `);
    }
    return t;
  }
};
_.styles = Lt;
k([
  A({ attribute: !1 })
], _.prototype, "hass", 2);
k([
  O()
], _.prototype, "locks", 2);
k([
  O()
], _.prototype, "selectedLock", 2);
k([
  O()
], _.prototype, "actionState", 2);
k([
  O()
], _.prototype, "currentPage", 2);
k([
  O()
], _.prototype, "currentTime", 2);
_ = k([
  mt("z2m-lock-manager-panel")
], _);
export {
  _ as Z2MLockManagerPanel
};
