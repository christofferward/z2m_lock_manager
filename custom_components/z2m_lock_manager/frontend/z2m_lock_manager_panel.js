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
const yt = (s) => new pt(typeof s == "string" ? s : s + "", void 0, K), ut = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, r, o) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[o + 1], s[0]);
  return new pt(e, s, K);
}, $t = (s, t) => {
  if (Y) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = j.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, s.appendChild(i);
  }
}, tt = Y ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return yt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: xt, defineProperty: wt, getOwnPropertyDescriptor: St, getOwnPropertyNames: kt, getOwnPropertySymbols: At, getPrototypeOf: Et } = Object, y = globalThis, et = y.trustedTypes, Ct = et ? et.emptyScript : "", G = y.reactiveElementPolyfillSupport, z = (s, t) => s, V = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Ct : null;
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
} }, J = (s, t) => !xt(s, t), st = { attribute: !0, type: String, converter: V, reflect: !1, useDefault: !1, hasChanged: J };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let T = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = st) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && wt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: o } = St(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: r, set(a) {
      const n = r == null ? void 0 : r.call(this);
      o == null || o.call(this, a), this.requestUpdate(t, n, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const t = Et(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const e = this.properties, i = [...kt(e), ...At(e)];
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
    return $t(t, this.constructor.elementStyles), t;
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
    var o;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const a = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : V).toAttribute(e, i.type);
      this._$Em = t, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, a;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = i.getPropertyOptions(r), l = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((o = n.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? n.converter : V;
      this._$Em = r;
      const h = l.fromAttribute(e, n.type);
      this[r] = h ?? ((a = this._$Ej) == null ? void 0 : a.get(r)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, o) {
    var a;
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[t]), i ?? (i = n.getPropertyOptions(t)), !((i.hasChanged ?? J)(o, e) || i.useDefault && i.reflect && o === ((a = this._$Ej) == null ? void 0 : a.get(t)) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: o }, a) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), o !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [o, a] of this._$Ep) this[o] = a;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, a] of r) {
        const { wrapped: n } = a, l = this[o];
        n !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, a, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
        var o;
        return (o = r.hostUpdate) == null ? void 0 : o.call(r);
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
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[z("elementProperties")] = /* @__PURE__ */ new Map(), T[z("finalized")] = /* @__PURE__ */ new Map(), G == null || G({ ReactiveElement: T }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, it = (s) => s, F = R.trustedTypes, rt = F ? F.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, gt = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, _t = "?" + b, Tt = `<${_t}>`, A = document, N = () => A.createComment(""), U = (s) => s === null || typeof s != "object" && typeof s != "function", Q = Array.isArray, Pt = (s) => Q(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", Z = `[ 	
\f\r]`, I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, at = />/g, w = RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nt = /'/g, lt = /"/g, vt = /^(?:script|style|textarea|title)$/i, Ot = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), d = Ot(1), M = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), ct = /* @__PURE__ */ new WeakMap(), S = A.createTreeWalker(A, 129);
function ft(s, t) {
  if (!Q(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return rt !== void 0 ? rt.createHTML(t) : t;
}
const Mt = (s, t) => {
  const e = s.length - 1, i = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = I;
  for (let n = 0; n < e; n++) {
    const l = s[n];
    let h, p, c = -1, g = 0;
    for (; g < l.length && (a.lastIndex = g, p = a.exec(l), p !== null); ) g = a.lastIndex, a === I ? p[1] === "!--" ? a = ot : p[1] !== void 0 ? a = at : p[2] !== void 0 ? (vt.test(p[2]) && (r = RegExp("</" + p[2], "g")), a = w) : p[3] !== void 0 && (a = w) : a === w ? p[0] === ">" ? (a = r ?? I, c = -1) : p[1] === void 0 ? c = -2 : (c = a.lastIndex - p[2].length, h = p[1], a = p[3] === void 0 ? w : p[3] === '"' ? lt : nt) : a === lt || a === nt ? a = w : a === ot || a === at ? a = I : (a = w, r = void 0);
    const _ = a === w && s[n + 1].startsWith("/>") ? " " : "";
    o += a === I ? l + Tt : c >= 0 ? (i.push(h), l.slice(0, c) + gt + l.slice(c) + b + _) : l + b + (c === -2 ? n : _);
  }
  return [ft(s, o + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class L {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let o = 0, a = 0;
    const n = t.length - 1, l = this.parts, [h, p] = Mt(t, e);
    if (this.el = L.createElement(h, i), S.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = S.nextNode()) !== null && l.length < n; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(gt)) {
          const g = p[a++], _ = r.getAttribute(c).split(b), x = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: o, name: x[2], strings: _, ctor: x[1] === "." ? It : x[1] === "?" ? zt : x[1] === "@" ? Rt : B }), r.removeAttribute(c);
        } else c.startsWith(b) && (l.push({ type: 6, index: o }), r.removeAttribute(c));
        if (vt.test(r.tagName)) {
          const c = r.textContent.split(b), g = c.length - 1;
          if (g > 0) {
            r.textContent = F ? F.emptyScript : "";
            for (let _ = 0; _ < g; _++) r.append(c[_], N()), S.nextNode(), l.push({ type: 2, index: ++o });
            r.append(c[g], N());
          }
        }
      } else if (r.nodeType === 8) if (r.data === _t) l.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(b, c + 1)) !== -1; ) l.push({ type: 7, index: o }), c += b.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = A.createElement("template");
    return i.innerHTML = t, i;
  }
}
function D(s, t, e = s, i) {
  var a, n;
  if (t === M) return t;
  let r = i !== void 0 ? (a = e._$Co) == null ? void 0 : a[i] : e._$Cl;
  const o = U(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((n = r == null ? void 0 : r._$AO) == null || n.call(r, !1), o === void 0 ? r = void 0 : (r = new o(s), r._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = D(s, r._$AS(s, t.values), r, i)), t;
}
class Dt {
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
    S.currentNode = r;
    let o = S.nextNode(), a = 0, n = 0, l = i[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let h;
        l.type === 2 ? h = new H(o, o.nextSibling, this, t) : l.type === 1 ? h = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (h = new Nt(o, this, t)), this._$AV.push(h), l = i[++n];
      }
      a !== (l == null ? void 0 : l.index) && (o = S.nextNode(), a++);
    }
    return S.currentNode = A, r;
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
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = D(this, t, e), U(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== M && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Pt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = L.createElement(ft(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(e);
    else {
      const a = new Dt(r, this), n = a.u(this.options);
      a.p(e), this.T(n), this._$AH = a;
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
    for (const o of t) r === e.length ? e.push(i = new H(this.O(N()), this.O(N()), this, this.options)) : i = e[r], i._$AI(o), r++;
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
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, o) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(t, e = this, i, r) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) t = D(this, t, e, 0), a = !U(t) || t !== this._$AH && t !== M, a && (this._$AH = t);
    else {
      const n = t;
      let l, h;
      for (t = o[0], l = 0; l < o.length - 1; l++) h = D(this, n[i + l], e, l), h === M && (h = this._$AH[l]), a || (a = !U(h) || h !== this._$AH[l]), h === u ? t = u : t !== u && (t += (h ?? "") + o[l + 1]), this._$AH[l] = h;
    }
    a && !r && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class It extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class zt extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class Rt extends B {
  constructor(t, e, i, r, o) {
    super(t, e, i, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = D(this, t, e, 0) ?? u) === M) return;
    const i = this._$AH, r = t === u && i !== u || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== u && (i === u || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
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
    D(this, t);
  }
}
const q = R.litHtmlPolyfillSupport;
q == null || q(L, H), (R.litHtmlVersions ?? (R.litHtmlVersions = [])).push("3.3.2");
const Ut = (s, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new H(t.insertBefore(N(), o), o, void 0, e ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis;
class P extends T {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ut(e, this.renderRoot, this.renderOptions);
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
    return M;
  }
}
var ht;
P._$litElement$ = !0, P.finalized = !0, (ht = k.litElementHydrateSupport) == null || ht.call(k, { LitElement: P });
const W = k.litElementPolyfillSupport;
W == null || W({ LitElement: P });
(k.litElementVersions ?? (k.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = (s) => (t, e) => {
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
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(e.name, s), i === "accessor") {
    const { name: a } = e;
    return { set(n) {
      const l = t.get.call(this);
      t.set.call(this, n), this.requestUpdate(a, l, s, !0, n);
    }, init(n) {
      return n !== void 0 && this.C(a, void 0, s, n), n;
    } };
  }
  if (i === "setter") {
    const { name: a } = e;
    return function(n) {
      const l = this[a];
      t.call(this, n), this.requestUpdate(a, l, s, !0, n);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function $(s) {
  return (t, e) => typeof e == "object" ? Ht(s, t, e) : ((i, r, o) => {
    const a = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), a ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function E(s) {
  return $({ ...s, state: !0, attribute: !1 });
}
const O = {
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
    next_page: "Next",
    valid_from: "Valid From",
    valid_to: "Valid To",
    enables_in: "Enables in",
    disables_in: "Disables in",
    status_synced: "Synced to Lock",
    status_pending: "Pending Sync",
    recurring_schedule: "Recurring Schedule",
    start_time: "Start Time",
    end_time: "End Time",
    mon: "M",
    tue: "T",
    wed: "W",
    thu: "T",
    fri: "F",
    sat: "S",
    sun: "S",
    status_suspended: "Suspended"
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
    next_page: "Nästa",
    valid_from: "Giltig från",
    valid_to: "Giltig till",
    enables_in: "Aktiveras om",
    disables_in: "Inaktiveras om",
    status_synced: "Synkad till lås",
    status_pending: "Väntar på synk",
    recurring_schedule: "Återkommande Schema",
    start_time: "Starttid",
    end_time: "Sluttid",
    mon: "M",
    tue: "T",
    wed: "O",
    thu: "T",
    fri: "F",
    sat: "L",
    sun: "S",
    status_suspended: "Pausad"
  }
}, jt = d`<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`, Vt = d`<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`, Ft = d`<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>`, Bt = d`<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>`, Gt = d`<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>`, Zt = d`<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>`, qt = ut`
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

  /* State colours — scheduled & currently active */
  .slot-chip.state-scheduled-active {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, #ab47bc 20%, var(--card-background-color)),
      color-mix(in srgb, #8e24aa 10%, var(--card-background-color))
    );
  }
  .slot-chip.state-scheduled-active .slot-chip-icon {
    color: #ab47bc;
  }

  /* State colours — scheduled but outside active window */
  .slot-chip.state-scheduled-inactive {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, #ff9800 18%, var(--card-background-color)),
      color-mix(in srgb, #e65100 10%, var(--card-background-color))
    );
  }
  .slot-chip.state-scheduled-inactive .slot-chip-icon {
    color: #ffa726;
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
`, Wt = ut`
  :host {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-row {
    display: flex;
    gap: 1rem;
  }
  .form-row > * {
    flex: 1;
    min-width: 0;
  }
  @media (max-width: 480px) {
    .form-row {
      flex-direction: column;
    }
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
  input[type="time"],
  input[type="date"],
  input[type="datetime-local"],
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

  /* Day circles */
  .days-wrap {
    display: flex;
    gap: 8px;
    margin-top: 4px;
    flex-wrap: wrap;
  }
  .day-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, border-color 0.15s;
    user-select: none;
  }
  .day-btn.selected {
    background: var(--primary-color);
    color: #fff;
    border-color: var(--primary-color);
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
var Yt = Object.defineProperty, Kt = Object.getOwnPropertyDescriptor, C = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Kt(t, e) : t, o = s.length - 1, a; o >= 0; o--)
    (a = s[o]) && (r = (i ? a(t, e, r) : a(r)) || r);
  return i && r && Yt(t, e, r), r;
};
let f = class extends P {
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
    const r = Math.floor(i / 36e5), o = Math.floor(i % 36e5 / 6e4);
    return `${r}h ${o}m`;
  }
  _formatDateForInput(s) {
    if (!s) return "";
    const t = new Date(s);
    if (isNaN(t.getTime())) return "";
    const e = (i) => i.toString().padStart(2, "0");
    return `${t.getFullYear()}-${e(t.getMonth() + 1)}-${e(t.getDate())}T${e(t.getHours())}:${e(t.getMinutes())}`;
  }
  _formatDateOnlyForInput(s) {
    if (!s) return "";
    const t = new Date(s);
    if (isNaN(t.getTime())) return "";
    const e = (i) => i.toString().padStart(2, "0");
    return `${t.getFullYear()}-${e(t.getMonth() + 1)}-${e(t.getDate())}`;
  }
  _getScheduleState() {
    const s = this.slotData;
    if (!s.enabled || !s.valid_from && !s.valid_to) return null;
    const t = this.currentTime.getTime(), e = s.valid_from ? new Date(s.valid_from).getTime() : 0, i = s.valid_to ? new Date(s.valid_to).getTime() : 1 / 0, r = (o) => {
      const a = Math.floor(o / 864e5), n = Math.floor(o % 864e5 / 36e5), l = Math.floor(o % 36e5 / 6e4);
      return a > 0 ? `${a}d ${n}h` : `${n}h ${l}m`;
    };
    return e && t < e ? `${this.t("enables_in")}: ${r(e - t)}` : s.recurring_days && s.recurring_days.length > 0 ? this.t("recurring_schedule") : i && t < i ? `${this.t("disables_in")}: ${r(i - t)}` : this.t("expired");
  }
  render() {
    const s = this.slotData, t = s.auto_rotate && s.last_rotated ? this._getTimeRemaining(s.last_rotated, s.rotate_interval_hours ?? 24) : null, e = t === this.t("expired"), i = s.auto_rotate ? null : this._getScheduleState();
    return d`
      <!-- Row 1: Name, Code, Type -->
      <div class="form-row">
        <div class="input-group">
          <label>${this.t("name")}</label>
          <input type="text" id="name" .value="${s.name}" autocomplete="off" />
        </div>
        <div class="input-group">
          <label>${this.t("pin_code")}${s.auto_rotate ? " (Auto)" : ""}</label>
          <div class="code-wrapper">
            <input type="${this._codeVisible ? "text" : "password"}" id="code" .value="${s.code}" ?disabled="${s.auto_rotate}" autocomplete="new-password" />
            <button class="btn-icon" @click=${() => this._codeVisible = !this._codeVisible} title="Toggle visibility">
              ${this._codeVisible ? Vt : jt}
            </button>
          </div>
        </div>
        ${s.auto_rotate ? d`
          <div class="input-group">
            <label>${this.t("rotate_interval")}</label>
            <input type="number" id="interval" .value="${s.rotate_interval_hours ?? 24}" min="1" />
          </div>
        ` : d`
          <div class="input-group">
            <label>${this.t("user_type")}</label>
            <select id="usertype" .value="${s.user_type ?? "unrestricted"}" @change=${this._handleUserTypeChange}>
              <option value="unrestricted">${this.t("user_type_unrestricted")}</option>
              <option value="year_day_schedule">${this.t("user_type_year_day_schedule")}</option>
              <option value="week_day_schedule">${this.t("user_type_week_day_schedule")}</option>
              <option value="non_access">${this.t("user_type_non_access")}</option>
            </select>
          </div>
        `}
      </div>

      ${s.auto_rotate && t && s.enabled ? d`
        <div class="rotate-info">
          <span class="dot ${e ? "dot-red" : "dot-green"}"></span>
          ${this.t("expires_in")}: <strong>${t}</strong>
        </div>
      ` : ""}

      <!-- Row 2: Valid From, Valid To (only for schedule types) -->
      ${!s.auto_rotate && (s.user_type === "year_day_schedule" || s.user_type === "week_day_schedule") ? d`
        <div class="form-row">
          <div class="input-group">
            <label>${this.t("valid_from")}</label>
            ${s.user_type === "week_day_schedule" ? d`<input type="date" id="valid_from" .value="${this._formatDateOnlyForInput(s.valid_from)}" />` : d`<input type="datetime-local" id="valid_from" .value="${this._formatDateForInput(s.valid_from)}" />`}
          </div>
          <div class="input-group">
            <label>${this.t("valid_to")}</label>
            ${s.user_type === "week_day_schedule" ? d`<input type="date" id="valid_to" .value="${this._formatDateOnlyForInput(s.valid_to)}" />` : d`<input type="datetime-local" id="valid_to" .value="${this._formatDateForInput(s.valid_to)}" />`}
          </div>
        </div>
      ` : ""}

      <!-- Row 3: Recurring days (only for week_day_schedule) -->
      ${!s.auto_rotate && s.user_type === "week_day_schedule" ? d`
        <div class="input-group">
          <label>${this.t("recurring_schedule")}</label>
          <div class="days-wrap">
            ${[0, 1, 2, 3, 4, 5, 6].map((r) => d`
              <div 
                class="day-btn ${(s.recurring_days || []).includes(r) ? "selected" : ""}"
                @click=${() => this._toggleRecurringDay(r)}
              >
                ${this.t(["mon", "tue", "wed", "thu", "fri", "sat", "sun"][r])}
              </div>
            `)}
          </div>
        </div>

        <!-- Row 4: Start time, End time -->
        <div class="form-row">
          <div class="input-group">
            <label>${this.t("start_time")}</label>
            <input type="time" id="recurring_start" .value="${s.recurring_start_time || ""}" />
          </div>
          <div class="input-group">
            <label>${this.t("end_time")}</label>
            <input type="time" id="recurring_end" .value="${s.recurring_end_time || ""}" />
          </div>
        </div>
      ` : ""}
      
      ${i ? d`
        <div class="rotate-info">
          <span class="dot ${i === this.t("expired") ? "dot-red" : "dot-green"}"></span>
          ${i}
          ${s.pin_synced_to_lock ? d` | <span style="color: #4caf50; font-size: 0.9em; font-weight: 500;">${this.t("status_synced")}</span>` : d` | <span style="color: #ff9800; font-size: 0.9em; font-weight: 500;">${this.t("status_pending")}</span>`}
        </div>
      ` : ""}

      <!-- Row 5: Toggles -->
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

      <!-- Row 6: Save, Clear -->
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
    return (O[t] || O.en)[s] || O.en[s] || s;
  }
  _handleAutoRotateChange(s) {
    this.dispatchEvent(new CustomEvent("update-slot-data", {
      detail: { slot: this.slotStr, updates: { auto_rotate: s.target.checked } },
      bubbles: !0,
      composed: !0
    }));
  }
  _handleUserTypeChange(s) {
    this.dispatchEvent(new CustomEvent("update-slot-data", {
      detail: { slot: this.slotStr, updates: { user_type: s.target.value } },
      bubbles: !0,
      composed: !0
    }));
  }
  _toggleRecurringDay(s) {
    const t = [...this.slotData.recurring_days || []], e = t.indexOf(s);
    e !== -1 ? t.splice(e, 1) : t.push(s), this.dispatchEvent(new CustomEvent("update-slot-data", {
      detail: { slot: this.slotStr, updates: { recurring_days: t } },
      bubbles: !0,
      composed: !0
    }));
  }
  _handleSave() {
    var o, a, n, l, h, p, c, g, _, x;
    const s = (bt) => this.shadowRoot.querySelector(`#${bt}`), t = s("valid_from"), e = s("valid_to");
    let i = null;
    t != null && t.value && (i = new Date(t.value.includes("T") ? t.value : `${t.value}T00:00:00`).toISOString());
    let r = null;
    e != null && e.value && (r = new Date(e.value.includes("T") ? e.value : `${e.value}T23:59:59`).toISOString()), this.dispatchEvent(new CustomEvent("save-slot", {
      detail: {
        slot: this.slotStr,
        name: ((o = s("name")) == null ? void 0 : o.value) || "",
        code: ((a = s("code")) == null ? void 0 : a.value) || "",
        enabled: ((n = s("enabled")) == null ? void 0 : n.checked) ?? !1,
        userType: ((l = s("usertype")) == null ? void 0 : l.value) ?? "unrestricted",
        hasFingerprint: ((h = s("fingerprint")) == null ? void 0 : h.checked) ?? !1,
        hasRfid: ((p = s("rfid")) == null ? void 0 : p.checked) ?? !1,
        autoRotate: ((c = s("autorotate")) == null ? void 0 : c.checked) ?? !1,
        rotateIntervalHours: parseInt(((g = s("interval")) == null ? void 0 : g.value) ?? "24", 10),
        validFrom: i,
        validTo: r,
        recurringDays: this.slotData.recurring_days || [],
        recurringStartTime: ((_ = s("recurring_start")) == null ? void 0 : _.value) || null,
        recurringEndTime: ((x = s("recurring_end")) == null ? void 0 : x.value) || null
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
f.styles = Wt;
C([
  $({ type: Object })
], f.prototype, "slotData", 2);
C([
  $({ type: String })
], f.prototype, "slotStr", 2);
C([
  $({ type: Object })
], f.prototype, "hass", 2);
C([
  $({ attribute: !1 })
], f.prototype, "actionState", 2);
C([
  $({ attribute: !1 })
], f.prototype, "currentTime", 2);
C([
  E()
], f.prototype, "_codeVisible", 2);
f = C([
  mt("z2m-lock-slot")
], f);
var Jt = Object.defineProperty, Qt = Object.getOwnPropertyDescriptor, m = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Qt(t, e) : t, o = s.length - 1, a; o >= 0; o--)
    (a = s[o]) && (r = (i ? a(t, e, r) : a(r)) || r);
  return i && r && Jt(t, e, r), r;
};
const dt = {
  name: "",
  code: "",
  enabled: !1,
  user_type: "unrestricted",
  auto_rotate: !1,
  rotate_interval_hours: 24
};
let v = class extends P {
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
    return (O[t] || O.en)[s] || O.en[s] || s;
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
        rotate_interval_hours: t.rotateIntervalHours,
        valid_from: t.validFrom,
        valid_to: t.validTo,
        recurring_days: t.recurringDays,
        recurring_start_time: t.recurringStartTime,
        recurring_end_time: t.recurringEndTime
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
    if (!s) return "empty";
    if (!s.enabled) return s.name || s.code ? "disabled" : "empty";
    if (s.auto_rotate) return "guest";
    if (!(s.valid_from || s.valid_to || s.recurring_days && s.recurring_days.length > 0)) return "active";
    const e = this.currentTime, i = e.getTime();
    if (s.valid_from && i < new Date(s.valid_from).getTime() || s.valid_to && i > new Date(s.valid_to).getTime()) return "scheduled-inactive";
    if (s.recurring_days && s.recurring_days.length > 0) {
      const r = (e.getDay() + 6) % 7;
      if (!s.recurring_days.includes(r)) return "scheduled-inactive";
      if (s.recurring_start_time && s.recurring_end_time) {
        const o = `${String(e.getHours()).padStart(2, "0")}:${String(e.getMinutes()).padStart(2, "0")}`;
        if (o < s.recurring_start_time || o >= s.recurring_end_time) return "scheduled-inactive";
      }
    }
    return "scheduled-active";
  }
  _getChipIcon(s) {
    return s === "guest" ? Bt : s === "active" ? Ft : s === "scheduled-active" || s === "scheduled-inactive" ? Zt : Gt;
  }
  render() {
    const s = this.locks.find((r) => r.entity_id === this.selectedLock) || this.locks[0];
    if (!this.hass || !this.locks.length)
      return d`
        <div class="header">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <span class="title">${this.t("title")}</span>
        </div>
        <div class="content">
          <div class="empty-state">${this.t("loading")}</div>
        </div>
      `;
    const t = (s == null ? void 0 : s.slots) ?? {}, e = (s == null ? void 0 : s.max_slots) ?? 10, i = this.selectedSlot ? t[this.selectedSlot] ?? { ...dt } : null;
    return d`
      <div class="header">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <span class="title">${this.t("title")}</span>
      </div>

      <div class="content">
        <div class="lock-tabs">
          ${this.locks.map((r) => d`
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

        ${this.selectedSlot && i ? d`
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
    return Array.from({ length: i - e }, (r, o) => {
      const a = String(e + o + 1), n = s[a], l = this._getChipState(n);
      return d`
        <div
          class="slot-chip state-${l} ${this.selectedSlot === a ? "selected" : ""}"
          @click=${() => this.selectedSlot = this.selectedSlot === a ? null : a}
          title="${(n == null ? void 0 : n.name) || ""}"
        >
          <span class="slot-chip-number">${this.t("slot")} ${a}</span>
          <span class="slot-chip-icon">${this._getChipIcon(l)}</span>
          <span class="slot-chip-name">${(n == null ? void 0 : n.name) || "—"}</span>
        </div>
      `;
    });
  }
  _renderPagination(s) {
    if (s <= this.PAGE_SIZE) return "";
    const t = this._currentPage * this.PAGE_SIZE + 1, e = Math.min((this._currentPage + 1) * this.PAGE_SIZE, s);
    return d`
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
v.styles = qt;
m([
  $({ attribute: !1 })
], v.prototype, "hass", 2);
m([
  $({ type: Boolean })
], v.prototype, "narrow", 2);
m([
  E()
], v.prototype, "locks", 2);
m([
  E()
], v.prototype, "selectedLock", 2);
m([
  E()
], v.prototype, "selectedSlot", 2);
m([
  E()
], v.prototype, "actionState", 2);
m([
  E()
], v.prototype, "currentTime", 2);
m([
  E()
], v.prototype, "_currentPage", 2);
v = m([
  mt("z2m-lock-manager-panel")
], v);
export {
  v as Z2MLockManagerPanel
};
