/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, Y = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), X = /* @__PURE__ */ new WeakMap();
let pt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Y && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = X.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && X.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const mt = (s) => new pt(typeof s == "string" ? s : s + "", void 0, K), ut = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, r, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[a + 1], s[0]);
  return new pt(e, s, K);
}, yt = (s, t) => {
  if (Y) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = j.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, s.appendChild(i);
  }
}, tt = Y ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return mt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: $t, defineProperty: xt, getOwnPropertyDescriptor: wt, getOwnPropertyNames: St, getOwnPropertySymbols: At, getPrototypeOf: kt } = Object, y = globalThis, et = y.trustedTypes, Et = et ? et.emptyScript : "", Z = y.reactiveElementPolyfillSupport, U = (s, t) => s, V = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Et : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, J = (s, t) => !$t(s, t), st = { attribute: !0, type: String, converter: V, reflect: !1, useDefault: !1, hasChanged: J };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let C = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = st) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && xt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: a } = wt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const l = r == null ? void 0 : r.call(this);
      a == null || a.call(this, o), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(U("elementProperties"))) return;
    const t = kt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(U("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(U("properties"))) {
      const e = this.properties, i = [...St(e), ...At(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(tt(r));
    } else t !== void 0 && e.push(tt(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return yt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var a;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (((a = i.converter) == null ? void 0 : a.toAttribute) !== void 0 ? i.converter : V).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var a, o;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const l = i.getPropertyOptions(r), n = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((a = l.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? l.converter : V;
      this._$Em = r;
      const d = n.fromAttribute(e, l.type);
      this[r] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, a) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (a = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? J)(a, e) || i.useDefault && i.reflect && a === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: a }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), a !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [a, o] of this._$Ep) this[a] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [a, o] of r) {
        const { wrapped: l } = o, n = this[a];
        l !== !0 || this._$AL.has(a) || n === void 0 || this.C(a, void 0, o, n);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
        var a;
        return (a = r.hostUpdate) == null ? void 0 : a.call(r);
      }), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
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
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[U("elementProperties")] = /* @__PURE__ */ new Map(), C[U("finalized")] = /* @__PURE__ */ new Map(), Z == null || Z({ ReactiveElement: C }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, it = (s) => s, B = I.trustedTypes, rt = B ? B.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, gt = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, vt = "?" + m, Ct = `<${vt}>`, A = document, N = () => A.createComment(""), R = (s) => s === null || typeof s != "object" && typeof s != "function", Q = Array.isArray, Pt = (s) => Q(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", G = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, at = />/g, x = RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nt = /'/g, lt = /"/g, _t = /^(?:script|style|textarea|title)$/i, Tt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), u = Tt(1), O = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), ct = /* @__PURE__ */ new WeakMap(), w = A.createTreeWalker(A, 129);
function ft(s, t) {
  if (!Q(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return rt !== void 0 ? rt.createHTML(t) : t;
}
const Ot = (s, t) => {
  const e = s.length - 1, i = [];
  let r, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = z;
  for (let l = 0; l < e; l++) {
    const n = s[l];
    let d, p, c = -1, v = 0;
    for (; v < n.length && (o.lastIndex = v, p = o.exec(n), p !== null); ) v = o.lastIndex, o === z ? p[1] === "!--" ? o = ot : p[1] !== void 0 ? o = at : p[2] !== void 0 ? (_t.test(p[2]) && (r = RegExp("</" + p[2], "g")), o = x) : p[3] !== void 0 && (o = x) : o === x ? p[0] === ">" ? (o = r ?? z, c = -1) : p[1] === void 0 ? c = -2 : (c = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? x : p[3] === '"' ? lt : nt) : o === lt || o === nt ? o = x : o === ot || o === at ? o = z : (o = x, r = void 0);
    const b = o === x && s[l + 1].startsWith("/>") ? " " : "";
    a += o === z ? n + Ct : c >= 0 ? (i.push(d), n.slice(0, c) + gt + n.slice(c) + m + b) : n + m + (c === -2 ? l : b);
  }
  return [ft(s, a + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class L {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let a = 0, o = 0;
    const l = t.length - 1, n = this.parts, [d, p] = Ot(t, e);
    if (this.el = L.createElement(d, i), w.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = w.nextNode()) !== null && n.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(gt)) {
          const v = p[o++], b = r.getAttribute(c).split(m), D = /([.?@])?(.*)/.exec(v);
          n.push({ type: 1, index: a, name: D[2], strings: b, ctor: D[1] === "." ? zt : D[1] === "?" ? Ut : D[1] === "@" ? It : F }), r.removeAttribute(c);
        } else c.startsWith(m) && (n.push({ type: 6, index: a }), r.removeAttribute(c));
        if (_t.test(r.tagName)) {
          const c = r.textContent.split(m), v = c.length - 1;
          if (v > 0) {
            r.textContent = B ? B.emptyScript : "";
            for (let b = 0; b < v; b++) r.append(c[b], N()), w.nextNode(), n.push({ type: 2, index: ++a });
            r.append(c[v], N());
          }
        }
      } else if (r.nodeType === 8) if (r.data === vt) n.push({ type: 2, index: a });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(m, c + 1)) !== -1; ) n.push({ type: 7, index: a }), c += m.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const i = A.createElement("template");
    return i.innerHTML = t, i;
  }
}
function M(s, t, e = s, i) {
  var o, l;
  if (t === O) return t;
  let r = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const a = R(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== a && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), a === void 0 ? r = void 0 : (r = new a(s), r._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = M(s, r._$AS(s, t.values), r, i)), t;
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
    const { el: { content: e }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? A).importNode(e, !0);
    w.currentNode = r;
    let a = w.nextNode(), o = 0, l = 0, n = i[0];
    for (; n !== void 0; ) {
      if (o === n.index) {
        let d;
        n.type === 2 ? d = new H(a, a.nextSibling, this, t) : n.type === 1 ? d = new n.ctor(a, n.name, n.strings, this, t) : n.type === 6 && (d = new Nt(a, this, t)), this._$AV.push(d), n = i[++l];
      }
      o !== (n == null ? void 0 : n.index) && (a = w.nextNode(), o++);
    }
    return w.currentNode = A, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class H {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = M(this, t, e), R(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== O && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Pt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && R(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var a;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = L.createElement(ft(i.h, i.h[0]), this.options)), i);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === r) this._$AH.p(e);
    else {
      const o = new Mt(r, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ct.get(t.strings);
    return e === void 0 && ct.set(t.strings, e = new L(t)), e;
  }
  k(t) {
    Q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const a of t) r === e.length ? e.push(i = new H(this.O(N()), this.O(N()), this, this.options)) : i = e[r], i._$AI(a), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = it(t).nextSibling;
      it(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class F {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, a) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(t, e = this, i, r) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) t = M(this, t, e, 0), o = !R(t) || t !== this._$AH && t !== O, o && (this._$AH = t);
    else {
      const l = t;
      let n, d;
      for (t = a[0], n = 0; n < a.length - 1; n++) d = M(this, l[i + n], e, n), d === O && (d = this._$AH[n]), o || (o = !R(d) || d !== this._$AH[n]), d === h ? t = h : t !== h && (t += (d ?? "") + a[n + 1]), this._$AH[n] = d;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class zt extends F {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Ut extends F {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class It extends F {
  constructor(t, e, i, r, a) {
    super(t, e, i, r, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = M(this, t, e, 0) ?? h) === O) return;
    const i = this._$AH, r = t === h && i !== h || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== h && (i === h || r);
    r && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Nt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    M(this, t);
  }
}
const q = I.litHtmlPolyfillSupport;
q == null || q(L, H), (I.litHtmlVersions ?? (I.litHtmlVersions = [])).push("3.3.2");
const Rt = (s, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const a = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new H(t.insertBefore(N(), a), a, void 0, e ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis;
class P extends C {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Rt(e, this.renderRoot, this.renderOptions);
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
    return O;
  }
}
var ht;
P._$litElement$ = !0, P.finalized = !0, (ht = S.litElementHydrateSupport) == null || ht.call(S, { LitElement: P });
const W = S.litElementPolyfillSupport;
W == null || W({ LitElement: P });
(S.litElementVersions ?? (S.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bt = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lt = { attribute: !0, type: String, converter: V, reflect: !1, hasChanged: J }, Ht = (s = Lt, t, e) => {
  const { kind: i, metadata: r } = e;
  let a = globalThis.litPropertyMetadata.get(r);
  if (a === void 0 && globalThis.litPropertyMetadata.set(r, a = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), a.set(e.name, s), i === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const n = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, n, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: o } = e;
    return function(l) {
      const n = this[o];
      t.call(this, l), this.requestUpdate(o, n, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function $(s) {
  return (t, e) => typeof e == "object" ? Ht(s, t, e) : ((i, r, a) => {
    const o = r.hasOwnProperty(a);
    return r.constructor.createProperty(a, i), o ? Object.getOwnPropertyDescriptor(r, a) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function k(s) {
  return $({ ...s, state: !0, attribute: !1 });
}
const T = {
  en: {
    title: "Zigbee2MQTT Locks",
    select_lock: "Select slot",
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
    select_lock: "Välj plats",
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
}, Dt = u`<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`, jt = u`<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`, Vt = u`<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>`, Bt = u`<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>`, Ft = u`<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>`, Zt = ut`
  :host {
    display: block;
    background-color: var(--primary-background-color);
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    min-height: 100vh;
  }


  /* Header */
  .header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    background-color: var(
      --app-header-background-color,
      var(--primary-background-color)
    );
    color: var(--app-header-text-color, var(--primary-text-color));
  }
  ha-menu-button {
    color: var(--app-header-text-color, var(--primary-text-color));
  }
  .title {
    font-size: 20px;
    font-weight: 500;
  }


  /* Content */
  .content {
    padding: 16px;
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }


  /* Tabs */
  .lock-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .lock-tab {
    padding: 8px 18px;
    border-radius: 20px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition:
      background 0.15s,
      border-color 0.15s,
      color 0.15s;
  }
  .lock-tab:hover {
    background: var(--secondary-background-color);
  }
  .lock-tab.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
  }


  .section-title {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    margin-bottom: 12px;
  }


  .overview-card {
    background: var(--card-background-color);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(
      --ha-card-box-shadow,
      0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px rgba(0, 0, 0, 0.14),
      0 1px 3px rgba(0, 0, 0, 0.12)
    );
    padding: 16px 20px 20px;
  }


  /* Grid & Chips */
  .slot-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
  }
  @media (max-width: 500px) {
    .slot-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (min-width: 501px) and (max-width: 700px) {
    .slot-grid { grid-template-columns: repeat(4, 1fr); }
  }
  .slot-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 6px;
    height: 100px;
    box-sizing: border-box;
    border-radius: 12px;
    border: 2px solid transparent;
    background: var(--card-background-color);
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.2),
      0 1px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    user-select: none;
    transition:
      transform 0.12s ease,
      box-shadow 0.12s ease,
      border-color 0.15s;
    text-align: center;
  }
  .slot-chip:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  }
  .slot-chip:active {
    transform: scale(0.97);
  }

  /* Selected highlight */
  .slot-chip.selected {
    border-color: var(--primary-color);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--primary-color) 30%, transparent),
      0 4px 14px rgba(0, 0, 0, 0.2);
  }

  /* State colours — active */
  .slot-chip.state-active {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, #43a047 20%, var(--card-background-color)),
      color-mix(in srgb, #2e7d32 10%, var(--card-background-color))
    );
  }
  .slot-chip.state-active .slot-chip-icon {
    color: #4caf50;
  }

  /* State colours — guest / auto-rotate */
  .slot-chip.state-guest {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, #039be5 20%, var(--card-background-color)),
      color-mix(in srgb, #0277bd 10%, var(--card-background-color))
    );
  }
  .slot-chip.state-guest .slot-chip-icon {
    color: #29b6f6;
  }

  /* State colours — disabled (inactive but configured) */
  .slot-chip.state-disabled {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, #e53935 15%, var(--card-background-color)),
      color-mix(in srgb, #c62828 8%, var(--card-background-color))
    );
  }
  .slot-chip.state-disabled .slot-chip-icon {
    color: #ef5350;
  }

  /* State colours — empty */
  .slot-chip.state-empty {
    background: color-mix(in srgb, white 12%, var(--card-background-color));
  }
  .slot-chip.state-empty .slot-chip-icon {
    color: var(--disabled-text-color, #9e9e9e);
  }
  .slot-chip.state-empty .slot-chip-number {
    color: var(--disabled-text-color, #9e9e9e);
  }
  .slot-chip.state-empty .slot-chip-name {
    color: var(--disabled-text-color, #9e9e9e);
  }

  .slot-chip-number {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .slot-chip-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
  }
  .slot-chip-name {
    font-size: 11px;
    font-weight: 600;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 82px;
  }


  /* Slot Details */
  .detail-card {
    background: var(--card-background-color);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(
      --ha-card-box-shadow,
      0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px rgba(0, 0, 0, 0.14),
      0 1px 3px rgba(0, 0, 0, 0.12)
    );
    padding: 20px;
    animation: slideIn 0.15s ease;
  }
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .detail-title {
    font-size: 16px;
    font-weight: 600;
  }
  .detail-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--secondary-text-color);
    padding: 2px 6px;
    border-radius: 4px;
    line-height: 1;
  }
  .detail-close:hover {
    background: var(--secondary-background-color);
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }
  .detail-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--divider-color);
    margin-top: 4px;
  }
  .toggles-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    grid-column: 1 / -1;
  }
  .actions-row {
    display: flex;
    gap: 8px;
    grid-column: 1 / -1;
    justify-content: flex-start;
    margin-top: 4px;
  }


  .empty-state {
    text-align: center;
    padding: 40px;
    color: var(--secondary-text-color);
  }


  /* Pagination */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding-top: 14px;
    margin-top: 4px;
    border-top: 1px solid var(--divider-color);
  }
  .page-btn {
    padding: 0 14px;
    height: 32px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-size: 16px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .page-btn:hover:not(:disabled) {
    background: var(--secondary-background-color);
  }
  .page-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .page-info {
    font-size: 13px;
    color: var(--secondary-text-color);
    min-width: 80px;
    text-align: center;
  }
`, Gt = ut`
  :host {
    display: contents;
  }


  /* Form elements */
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .input-group label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  input[type="text"],
  input[type="password"],
  input[type="number"],
  select {
    padding: 6px 8px;
    font-size: 14px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--secondary-background-color, var(--card-background-color));
    color: var(--primary-text-color);
    width: 100%;
    box-sizing: border-box;
    height: 36px;
    transition: border-color 0.15s;
  }
  input:focus,
  select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--primary-color) 20%, transparent);
  }
  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  select {
    padding-right: 4px;
  }


  .code-wrapper {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .code-wrapper input {
    flex: 1;
  }
  .btn-icon {
    flex-shrink: 0;
    height: 36px;
    padding: 0 10px;
    background: var(--secondary-background-color);
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
  }
  .btn-icon:hover {
    background: var(--divider-color);
  }


  /* Toggles */
  .slot-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    cursor: pointer;
    font-size: 14px;
    color: var(--primary-text-color);
    user-select: none;
  }
  ha-switch {
    --switch-checked-button-color: var(--primary-color);
    --switch-checked-track-color: var(--primary-color);
  }
  ha-switch:not(:defined) {
    display: inline-block;
    width: 38px;
    height: 20px;
    background: #555;
    border-radius: 10px;
    position: relative;
  }
  ha-switch:not(:defined)::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
  }
  input[type="checkbox"] {
    accent-color: var(--primary-color);
    width: 15px;
    height: 15px;
    cursor: pointer;
  }

  .toggles-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    grid-column: 1 / -1;
  }

  .toggle-divider {
    width: 1px;
    height: 24px;
    background-color: var(--divider-color);
    margin: 0 4px;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .toggle-divider {
      display: none;
    }
  }

  .actions-row {
    display: flex;
    gap: 12px;
    grid-column: 1 / -1;
    justify-content: flex-start;
    margin-top: 12px;
  }


  .rotate-info {
    font-size: 12px;
    color: var(--secondary-text-color);
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 3px;
  }
  .dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .dot-green {
    background: var(--success-color, #43a047);
  }
  .dot-red {
    background: var(--error-color, #e53935);
  }


  /* Buttons */
  .btn {
    padding: 0 24px;
    height: 36px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    transition:
      opacity 0.15s,
      filter 0.15s;
    white-space: nowrap;
    width: auto;
    min-width: 100px;
  }
  .btn:hover {
    filter: brightness(1.08);
  }
  .btn:active {
    opacity: 0.85;
  }
  .btn-save {
    background: var(--primary-color);
    color: #fff;
  }
  .btn-clear {
    background: var(--error-color, #e53935);
    color: #fff;
  }
`;
var qt = Object.defineProperty, Wt = Object.getOwnPropertyDescriptor, E = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Wt(t, e) : t, a = s.length - 1, o; a >= 0; a--)
    (o = s[a]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && qt(t, e, r), r;
};
let _ = class extends P {
  constructor() {
    super(...arguments), this.actionState = null, this._codeVisible = !1;
  }
  get _isSaving() {
    var s;
    return ((s = this.actionState) == null ? void 0 : s.slot) === this.slotStr && this.actionState.type === "saving";
  }
  get _isSaved() {
    var s;
    return ((s = this.actionState) == null ? void 0 : s.slot) === this.slotStr && this.actionState.type === "saved";
  }
  get _isClearing() {
    var s;
    return ((s = this.actionState) == null ? void 0 : s.slot) === this.slotStr && this.actionState.type === "clearing";
  }
  get _isCleared() {
    var s;
    return ((s = this.actionState) == null ? void 0 : s.slot) === this.slotStr && this.actionState.type === "cleared";
  }
  _getTimeRemaining(s, t) {
    const i = new Date(new Date(s).getTime() + t * 36e5).getTime() - this.currentTime.getTime();
    if (i <= 0) return this.t("expired");
    const r = Math.floor(i / 36e5), a = Math.floor(i % 36e5 / 6e4);
    return `${r}h ${a}m`;
  }
  render() {
    const s = this.slotData, t = s.auto_rotate && s.last_rotated ? this._getTimeRemaining(s.last_rotated, s.rotate_interval_hours ?? 24) : null, e = t === this.t("expired");
    return u`
      <div class="input-group">
        <label>${this.t("name")}</label>
        <input type="text" id="name" .value="${s.name}" />
      </div>

      <div class="input-group">
        <label>${this.t("pin_code")}${s.auto_rotate ? " (Auto)" : ""}</label>
        <div class="code-wrapper">
          <input type="${this._codeVisible ? "text" : "password"}" id="code" .value="${s.code}" ?disabled="${s.auto_rotate}" />
          <button class="btn-icon" @click=${() => this._codeVisible = !this._codeVisible} title="Toggle visibility">
            ${this._codeVisible ? jt : Dt}
          </button>
        </div>
      </div>

      ${s.auto_rotate ? u`
        <div class="input-group">
          <label>${this.t("rotate_interval")}</label>
          <input type="number" id="interval" .value="${s.rotate_interval_hours ?? 24}" min="1" />
          ${t && s.enabled ? u`
            <div class="rotate-info">
              <span class="dot ${e ? "dot-red" : "dot-green"}"></span>
              ${this.t("expires_in")}: <strong>${t}</strong>
            </div>` : ""}
        </div>
      ` : u`
        <div class="input-group">
          <label>${this.t("user_type")}</label>
          <select id="usertype" .value="${s.user_type ?? "unrestricted"}">
            <option value="unrestricted">${this.t("user_type_unrestricted")}</option>
            <option value="non_access">${this.t("user_type_non_access")}</option>
          </select>
        </div>
      `}

      <div class="toggles-row">
        <label class="slot-toggle">
          <ha-switch id="enabled" .checked="${s.enabled}"></ha-switch>
          ${this.t("enabled")}
        </label>
        <label class="slot-toggle">
          <ha-switch id="autorotate" .checked="${s.auto_rotate}" @change=${this._handleAutoRotateChange}></ha-switch>
          ${this.t("auto_rotate")}
        </label>
        <div class="toggle-divider"></div>
        <label class="slot-toggle">
          <ha-switch id="fingerprint" .checked="${s.has_fingerprint}"></ha-switch>
          ${this.t("fingerprint")}
        </label>
        <label class="slot-toggle">
          <ha-switch id="rfid" .checked="${s.has_rfid}"></ha-switch>
          ${this.t("rfid")}
        </label>
      </div>

      <div class="actions-row">
        <button class="btn btn-save" @click=${this._handleSave}>
          ${this._isSaving ? this.t("saving") : this._isSaved ? this.t("saved") : this.t("save")}
        </button>
        <button class="btn btn-clear" @click=${this._handleClear}>
          ${this._isClearing ? this.t("clearing") : this._isCleared ? this.t("cleared") : this.t("clear")}
        </button>
      </div>
    `;
  }
  t(s) {
    var i;
    const t = ((i = this.hass) == null ? void 0 : i.language) || "en";
    return (T[t] || T.en)[s] || T.en[s] || s;
  }
  _handleAutoRotateChange(s) {
    this.dispatchEvent(new CustomEvent("update-slot-data", {
      detail: { slot: this.slotStr, updates: { auto_rotate: s.target.checked } },
      bubbles: !0,
      composed: !0
    }));
  }
  _handleSave() {
    var t, e, i, r, a;
    const s = (o) => this.shadowRoot.querySelector(`#${o}`);
    this.dispatchEvent(new CustomEvent("save-slot", {
      detail: {
        slot: this.slotStr,
        name: s("name").value,
        code: s("code").value,
        enabled: s("enabled").checked,
        userType: ((t = s("usertype")) == null ? void 0 : t.value) ?? "unrestricted",
        hasFingerprint: ((e = s("fingerprint")) == null ? void 0 : e.checked) ?? !1,
        hasRfid: ((i = s("rfid")) == null ? void 0 : i.checked) ?? !1,
        autoRotate: ((r = s("autorotate")) == null ? void 0 : r.checked) ?? !1,
        rotateIntervalHours: parseInt(((a = s("interval")) == null ? void 0 : a.value) ?? "24", 10)
      },
      bubbles: !0,
      composed: !0
    }));
  }
  _handleClear() {
    this.dispatchEvent(new CustomEvent("clear-slot", {
      detail: { slot: this.slotStr },
      bubbles: !0,
      composed: !0
    }));
  }
};
_.styles = Gt;
E([
  $({ type: Object })
], _.prototype, "slotData", 2);
E([
  $({ type: String })
], _.prototype, "slotStr", 2);
E([
  $({ type: Object })
], _.prototype, "hass", 2);
E([
  $({ attribute: !1 })
], _.prototype, "actionState", 2);
E([
  $({ attribute: !1 })
], _.prototype, "currentTime", 2);
E([
  k()
], _.prototype, "_codeVisible", 2);
_ = E([
  bt("z2m-lock-slot")
], _);
var Yt = Object.defineProperty, Kt = Object.getOwnPropertyDescriptor, f = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Kt(t, e) : t, a = s.length - 1, o; a >= 0; a--)
    (o = s[a]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && Yt(t, e, r), r;
};
const dt = {
  name: "",
  code: "",
  enabled: !1,
  user_type: "unrestricted",
  auto_rotate: !1,
  rotate_interval_hours: 24
};
let g = class extends P {
  constructor() {
    super(...arguments), this.locks = [], this.selectedLock = null, this.selectedSlot = null, this.actionState = null, this.currentTime = /* @__PURE__ */ new Date(), this._currentPage = 0, this._loading = !1, this.PAGE_SIZE = 20, this._timerInterval = null, this._handleVisibilityChange = () => {
      document.visibilityState === "visible" && this.hass && this.loadLocks().catch((s) => console.warn("Skipped reload:", s));
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._timerInterval = window.setInterval(() => {
      this.currentTime = /* @__PURE__ */ new Date();
    }, 6e4), document.addEventListener("visibilitychange", this._handleVisibilityChange), this.hass && this.loadLocks();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._timerInterval !== null && window.clearInterval(this._timerInterval), document.removeEventListener(
      "visibilitychange",
      this._handleVisibilityChange
    );
  }
  updated(s) {
    s.has("hass") && this.hass && (!s.get("hass") || this.locks.length === 0) && this.loadLocks().catch((e) => console.warn("Failed loading locks:", e));
  }
  t(s) {
    var i;
    const t = ((i = this.hass) == null ? void 0 : i.language) || "en";
    return (T[t] || T.en)[s] || T.en[s] || s;
  }
  async loadLocks() {
    if (!this._loading) {
      this._loading = !0;
      try {
        if (this.locks = await this.hass.connection.sendMessagePromise({
          type: "z2m_lock_manager/get_locks"
        }), this.locks.length > 0) {
          const s = this.locks.some((t) => t.entity_id === this.selectedLock);
          (!this.selectedLock || !s) && (this.selectedLock = this.locks[0].entity_id);
        }
      } catch (s) {
        console.error("Failed to load locks", s);
      } finally {
        this._loading = !1;
      }
    }
  }
  async handleSlotSave(s) {
    const t = s.detail;
    this.actionState = { slot: t.slot, type: "saving" };
    try {
      await this.hass.connection.sendMessagePromise({
        type: "z2m_lock_manager/set_code",
        entity_id: this.selectedLock,
        slot: parseInt(t.slot, 10),
        name: t.name,
        code: t.code,
        enabled: t.enabled,
        user_type: t.userType,
        has_fingerprint: t.hasFingerprint,
        has_rfid: t.hasRfid,
        auto_rotate: t.autoRotate,
        rotate_interval_hours: t.rotateIntervalHours
      }), await this.loadLocks(), this.actionState = { slot: t.slot, type: "saved" };
    } catch (e) {
      console.error("Failed to set code", e), this.actionState = null;
      return;
    }
    setTimeout(() => {
      const e = this.actionState;
      e && e.slot === t.slot && e.type === "saved" && (this.actionState = null);
    }, 2e3);
  }
  async handleSlotClear(s) {
    const t = s.detail;
    this.actionState = { slot: t.slot, type: "clearing" };
    try {
      await this.hass.connection.sendMessagePromise({
        type: "z2m_lock_manager/clear_code",
        entity_id: this.selectedLock,
        slot: parseInt(t.slot, 10)
      }), await this.loadLocks(), this.actionState = { slot: t.slot, type: "cleared" };
    } catch (e) {
      console.error("Failed to clear code", e), this.actionState = null;
      return;
    }
    setTimeout(() => {
      const e = this.actionState;
      e && e.slot === t.slot && e.type === "cleared" && (this.actionState = null);
    }, 2e3);
  }
  handleSlotUpdate(s) {
    const { slot: t, updates: e } = s.detail, i = this.locks.findIndex((r) => r.entity_id === this.selectedLock);
    i !== -1 && (this.locks[i].slots[t] = {
      ...this.locks[i].slots[t] ?? dt,
      ...e
    }, this.requestUpdate());
  }
  _getChipState(s) {
    return s ? s.enabled ? s.auto_rotate ? "guest" : "active" : s.name || s.code ? "disabled" : "empty" : "empty";
  }
  _getChipIcon(s) {
    return s === "guest" ? Bt : s === "active" ? Vt : Ft;
  }
  render() {
    const s = this.locks.find((r) => r.entity_id === this.selectedLock) || this.locks[0];
    if (!this.hass || !this.locks.length)
      return u`
        <div class="header">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <span class="title">${this.t("title")}</span>
        </div>
        <div class="content">
          <div class="empty-state">${this.t("loading")}</div>
        </div>
      `;
    const t = (s == null ? void 0 : s.slots) ?? {}, e = (s == null ? void 0 : s.max_slots) ?? 10, i = this.selectedSlot ? t[this.selectedSlot] ?? { ...dt } : null;
    return u`
      <div class="header">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <span class="title">${this.t("title")}</span>
      </div>

      <div class="content">
        <div class="lock-tabs">
          ${this.locks.map((r) => u`
            <button
              class="lock-tab ${r.entity_id === this.selectedLock ? "active" : ""}"
              @click=${() => {
      this.selectedLock = r.entity_id, this.selectedSlot = null, this._currentPage = 0;
    }}
            >
              ${r.name}
            </button>
          `)}
        </div>

        <div class="overview-card">
          <div class="section-title">${this.t("select_lock")}</div>
          <div class="slot-grid">
            ${this._renderSlotGrid(t, e)}
          </div>
          ${this._renderPagination(e)}
        </div>

        ${this.selectedSlot && i ? u`
          <div class="detail-card">
            <div class="detail-header">
              <span class="detail-title">
                ${this.t("slot")} ${this.selectedSlot}
                ${i.name ? ` · ${i.name}` : ""}
              </span>
              <button class="detail-close" @click=${() => this.selectedSlot = null}>✕</button>
            </div>
            <div class="detail-grid">
              <z2m-lock-slot
                .slotData=${i}
                .slotStr=${this.selectedSlot}
                .hass=${this.hass}
                .currentTime=${this.currentTime}
                .actionState=${this.actionState}
                @save-slot=${this.handleSlotSave}
                @clear-slot=${this.handleSlotClear}
                @update-slot-data=${this.handleSlotUpdate}
              ></z2m-lock-slot>
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }
  _renderSlotGrid(s, t) {
    const e = this._currentPage * this.PAGE_SIZE, i = Math.min(e + this.PAGE_SIZE, t);
    return Array.from({ length: i - e }, (r, a) => {
      const o = String(e + a + 1), l = s[o], n = this._getChipState(l);
      return u`
        <div
          class="slot-chip state-${n} ${this.selectedSlot === o ? "selected" : ""}"
          @click=${() => this.selectedSlot = this.selectedSlot === o ? null : o}
          title="${(l == null ? void 0 : l.name) || ""}"
        >
          <span class="slot-chip-number">${this.t("slot")} ${o}</span>
          <span class="slot-chip-icon">${this._getChipIcon(n)}</span>
          <span class="slot-chip-name">${(l == null ? void 0 : l.name) || "—"}</span>
        </div>
      `;
    });
  }
  _renderPagination(s) {
    if (s <= this.PAGE_SIZE) return "";
    const t = this._currentPage * this.PAGE_SIZE + 1, e = Math.min((this._currentPage + 1) * this.PAGE_SIZE, s);
    return u`
      <div class="pagination">
        <button
          class="page-btn"
          ?disabled=${this._currentPage === 0}
          @click=${() => {
      this._currentPage--, this.selectedSlot = null;
    }}
        >←</button>
        <span class="page-info">
          ${t}–${e} &nbsp;/&nbsp; ${s}
        </span>
        <button
          class="page-btn"
          ?disabled=${(this._currentPage + 1) * this.PAGE_SIZE >= s}
          @click=${() => {
      this._currentPage++, this.selectedSlot = null;
    }}
        >→</button>
      </div>
    `;
  }
};
g.styles = Zt;
f([
  $({ attribute: !1 })
], g.prototype, "hass", 2);
f([
  $({ type: Boolean })
], g.prototype, "narrow", 2);
f([
  k()
], g.prototype, "locks", 2);
f([
  k()
], g.prototype, "selectedLock", 2);
f([
  k()
], g.prototype, "selectedSlot", 2);
f([
  k()
], g.prototype, "actionState", 2);
f([
  k()
], g.prototype, "currentTime", 2);
f([
  k()
], g.prototype, "_currentPage", 2);
g = f([
  bt("z2m-lock-manager-panel")
], g);
export {
  g as Z2MLockManagerPanel
};
