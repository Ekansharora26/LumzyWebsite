var Ut = Object.defineProperty;
var Xt = (V, O, B) =>
  O in V
    ? Ut(V, O, { enumerable: !0, configurable: !0, writable: !0, value: B })
    : (V[O] = B);
var Ce = (V, O, B) => Xt(V, typeof O != "symbol" ? O + "" : O, B);
(function () {
  const O = document.createElement("link").relList;
  if (O && O.supports && O.supports("modulepreload")) return;
  for (const N of document.querySelectorAll('link[rel="modulepreload"]')) z(N);
  new MutationObserver((N) => {
    for (const G of N)
      if (G.type === "childList")
        for (const H of G.addedNodes)
          H.tagName === "LINK" && H.rel === "modulepreload" && z(H);
  }).observe(document, { childList: !0, subtree: !0 });
  function B(N) {
    const G = {};
    return (
      N.integrity && (G.integrity = N.integrity),
      N.referrerPolicy && (G.referrerPolicy = N.referrerPolicy),
      N.crossOrigin === "use-credentials"
        ? (G.credentials = "include")
        : N.crossOrigin === "anonymous"
          ? (G.credentials = "omit")
          : (G.credentials = "same-origin"),
      G
    );
  }
  function z(N) {
    if (N.ep) return;
    N.ep = !0;
    const G = B(N);
    fetch(N.href, G);
  }
})();
function clamp$1(V, O, B) {
  return Math.max(V, Math.min(O, B));
}
class Animate {
  advance(O) {
    var z;
    if (!this.isRunning) return;
    let B = !1;
    if (this.duration && this.easing) {
      this.currentTime += O;
      const N = clamp$1(0, this.currentTime / this.duration, 1);
      B = N >= 1;
      const G = B ? 1 : this.easing(N);
      this.value = this.from + (this.to - this.from) * G;
    } else
      this.lerp
        ? ((this.value = (function (G, H, W, q) {
            return (function (Y, re, U) {
              return (1 - U) * Y + U * re;
            })(G, H, 1 - Math.exp(-W * q));
          })(this.value, this.to, 60 * this.lerp, O)),
          Math.round(this.value) === this.to &&
            ((this.value = this.to), (B = !0)))
        : ((this.value = this.to), (B = !0));
    (B && this.stop(),
      (z = this.onUpdate) == null || z.call(this, this.value, B));
  }
  stop() {
    this.isRunning = !1;
  }
  fromTo(O, B, { lerp: z, duration: N, easing: G, onStart: H, onUpdate: W }) {
    ((this.from = this.value = O),
      (this.to = B),
      (this.lerp = z),
      (this.duration = N),
      (this.easing = G),
      (this.currentTime = 0),
      (this.isRunning = !0),
      H == null || H(),
      (this.onUpdate = W));
  }
}
class Dimensions {
  constructor({
    wrapper: O,
    content: B,
    autoResize: z = !0,
    debounce: N = 250,
  } = {}) {
    Ce(this, "resize", () => {
      (this.onWrapperResize(), this.onContentResize());
    });
    Ce(this, "onWrapperResize", () => {
      this.wrapper === window
        ? ((this.width = window.innerWidth), (this.height = window.innerHeight))
        : ((this.width = this.wrapper.clientWidth),
          (this.height = this.wrapper.clientHeight));
    });
    Ce(this, "onContentResize", () => {
      this.wrapper === window
        ? ((this.scrollHeight = this.content.scrollHeight),
          (this.scrollWidth = this.content.scrollWidth))
        : ((this.scrollHeight = this.wrapper.scrollHeight),
          (this.scrollWidth = this.wrapper.scrollWidth));
    });
    ((this.wrapper = O),
      (this.content = B),
      z &&
        ((this.debouncedResize = (function (H, W) {
          let q;
          return function () {
            let j = arguments,
              Y = this;
            (clearTimeout(q),
              (q = setTimeout(function () {
                H.apply(Y, j);
              }, W)));
          };
        })(this.resize, N)),
        this.wrapper === window
          ? window.addEventListener("resize", this.debouncedResize, !1)
          : ((this.wrapperResizeObserver = new ResizeObserver(
              this.debouncedResize,
            )),
            this.wrapperResizeObserver.observe(this.wrapper)),
        (this.contentResizeObserver = new ResizeObserver(this.debouncedResize)),
        this.contentResizeObserver.observe(this.content)),
      this.resize());
  }
  destroy() {
    var O, B;
    ((O = this.wrapperResizeObserver) == null || O.disconnect(),
      (B = this.contentResizeObserver) == null || B.disconnect(),
      window.removeEventListener("resize", this.debouncedResize, !1));
  }
  get limit() {
    return {
      x: this.scrollWidth - this.width,
      y: this.scrollHeight - this.height,
    };
  }
}
class Emitter {
  constructor() {
    this.events = {};
  }
  emit(O, ...B) {
    let z = this.events[O] || [];
    for (let N = 0, G = z.length; N < G; N++) z[N](...B);
  }
  on(O, B) {
    var z;
    return (
      ((z = this.events[O]) != null && z.push(B)) || (this.events[O] = [B]),
      () => {
        var N;
        this.events[O] =
          (N = this.events[O]) == null ? void 0 : N.filter((G) => B !== G);
      }
    );
  }
  off(O, B) {
    var z;
    this.events[O] =
      (z = this.events[O]) == null ? void 0 : z.filter((N) => B !== N);
  }
  destroy() {
    this.events = {};
  }
}
const t$1 = 100 / 6;
class VirtualScroll {
  constructor(O, { wheelMultiplier: B = 1, touchMultiplier: z = 1 }) {
    Ce(this, "onTouchStart", (O) => {
      const { clientX: B, clientY: z } = O.targetTouches
        ? O.targetTouches[0]
        : O;
      ((this.touchStart.x = B),
        (this.touchStart.y = z),
        (this.lastDelta = { x: 0, y: 0 }),
        this.emitter.emit("scroll", { deltaX: 0, deltaY: 0, event: O }));
    });
    Ce(this, "onTouchMove", (O) => {
      const { clientX: B, clientY: z } = O.targetTouches
          ? O.targetTouches[0]
          : O,
        N = -(B - this.touchStart.x) * this.touchMultiplier,
        G = -(z - this.touchStart.y) * this.touchMultiplier;
      ((this.touchStart.x = B),
        (this.touchStart.y = z),
        (this.lastDelta = { x: N, y: G }),
        this.emitter.emit("scroll", { deltaX: N, deltaY: G, event: O }));
    });
    Ce(this, "onTouchEnd", (O) => {
      this.emitter.emit("scroll", {
        deltaX: this.lastDelta.x,
        deltaY: this.lastDelta.y,
        event: O,
      });
    });
    Ce(this, "onWheel", (O) => {
      let { deltaX: B, deltaY: z, deltaMode: N } = O;
      ((B *= N === 1 ? t$1 : N === 2 ? this.windowWidth : 1),
        (z *= N === 1 ? t$1 : N === 2 ? this.windowHeight : 1),
        (B *= this.wheelMultiplier),
        (z *= this.wheelMultiplier),
        this.emitter.emit("scroll", { deltaX: B, deltaY: z, event: O }));
    });
    Ce(this, "onWindowResize", () => {
      ((this.windowWidth = window.innerWidth),
        (this.windowHeight = window.innerHeight));
    });
    ((this.element = O),
      (this.wheelMultiplier = B),
      (this.touchMultiplier = z),
      (this.touchStart = { x: null, y: null }),
      (this.emitter = new Emitter()),
      window.addEventListener("resize", this.onWindowResize, !1),
      this.onWindowResize(),
      this.element.addEventListener("wheel", this.onWheel, { passive: !1 }),
      this.element.addEventListener("touchstart", this.onTouchStart, {
        passive: !1,
      }),
      this.element.addEventListener("touchmove", this.onTouchMove, {
        passive: !1,
      }),
      this.element.addEventListener("touchend", this.onTouchEnd, {
        passive: !1,
      }));
  }
  on(O, B) {
    return this.emitter.on(O, B);
  }
  destroy() {
    (this.emitter.destroy(),
      window.removeEventListener("resize", this.onWindowResize, !1),
      this.element.removeEventListener("wheel", this.onWheel, { passive: !1 }),
      this.element.removeEventListener("touchstart", this.onTouchStart, {
        passive: !1,
      }),
      this.element.removeEventListener("touchmove", this.onTouchMove, {
        passive: !1,
      }),
      this.element.removeEventListener("touchend", this.onTouchEnd, {
        passive: !1,
      }));
  }
}
class Lenis {
  constructor({
    wrapper: O = window,
    content: B = document.documentElement,
    wheelEventsTarget: z = O,
    eventsTarget: N = z,
    smoothWheel: G = !0,
    syncTouch: H = !1,
    syncTouchLerp: W = 0.075,
    touchInertiaMultiplier: q = 35,
    duration: j,
    easing: Y = (ee) => Math.min(1, 1.001 - Math.pow(2, -10 * ee)),
    lerp: re = 0.1,
    infinite: U = !1,
    orientation: K = "vertical",
    gestureOrientation: Z = "vertical",
    touchMultiplier: X = 1,
    wheelMultiplier: se = 1,
    autoResize: Q = !0,
    prevent: te = !1,
    __experimental__naiveDimensions: J = !1,
  } = {}) {
    ((this.__isScrolling = !1),
      (this.__isStopped = !1),
      (this.__isLocked = !1),
      (this.direction = 0),
      (this.onPointerDown = (ee) => {
        ee.button === 1 && this.reset();
      }),
      (this.onVirtualScroll = ({ deltaX: ee, deltaY: ne, event: oe }) => {
        if (oe.ctrlKey) return;
        const he = oe.type.includes("touch"),
          ce = oe.type.includes("wheel");
        if (
          ((this.isTouching =
            oe.type === "touchstart" || oe.type === "touchmove"),
          this.options.syncTouch &&
            he &&
            oe.type === "touchstart" &&
            !this.isStopped &&
            !this.isLocked)
        )
          return void this.reset();
        const ue = ee === 0 && ne === 0,
          ge =
            (this.options.gestureOrientation === "vertical" && ne === 0) ||
            (this.options.gestureOrientation === "horizontal" && ee === 0);
        if (ue || ge) return;
        let ye = oe.composedPath();
        ye = ye.slice(0, ye.indexOf(this.rootElement));
        const me = this.options.prevent;
        if (
          ye.find((le) => {
            var pe, ie, ae, fe, de;
            return (
              le instanceof Element &&
              ((typeof me == "function"
                ? me == null
                  ? void 0
                  : me(le)
                : me) ||
                ((pe = le.hasAttribute) === null || pe === void 0
                  ? void 0
                  : pe.call(le, "data-lenis-prevent")) ||
                (he &&
                  ((ie = le.hasAttribute) === null || ie === void 0
                    ? void 0
                    : ie.call(le, "data-lenis-prevent-touch"))) ||
                (ce &&
                  ((ae = le.hasAttribute) === null || ae === void 0
                    ? void 0
                    : ae.call(le, "data-lenis-prevent-wheel"))) ||
                (((fe = le.classList) === null || fe === void 0
                  ? void 0
                  : fe.contains("lenis")) &&
                  !(
                    !((de = le.classList) === null || de === void 0) &&
                    de.contains("lenis-stopped")
                  )))
            );
          })
        )
          return;
        if (this.isStopped || this.isLocked) return void oe.preventDefault();
        if (
          !((this.options.syncTouch && he) || (this.options.smoothWheel && ce))
        )
          return ((this.isScrolling = "native"), void this.animate.stop());
        oe.preventDefault();
        let be = ne;
        this.options.gestureOrientation === "both"
          ? (be = Math.abs(ne) > Math.abs(ee) ? ne : ee)
          : this.options.gestureOrientation === "horizontal" && (be = ee);
        const Se = he && this.options.syncTouch,
          _e = he && oe.type === "touchend" && Math.abs(be) > 5;
        (_e && (be = this.velocity * this.options.touchInertiaMultiplier),
          this.scrollTo(
            this.targetScroll + be,
            Object.assign(
              { programmatic: !1 },
              Se
                ? { lerp: _e ? this.options.syncTouchLerp : 1 }
                : {
                    lerp: this.options.lerp,
                    duration: this.options.duration,
                    easing: this.options.easing,
                  },
            ),
          ));
      }),
      (this.onNativeScroll = () => {
        if (
          (clearTimeout(this.__resetVelocityTimeout),
          delete this.__resetVelocityTimeout,
          this.__preventNextNativeScrollEvent)
        )
          delete this.__preventNextNativeScrollEvent;
        else if (this.isScrolling === !1 || this.isScrolling === "native") {
          const ee = this.animatedScroll;
          ((this.animatedScroll = this.targetScroll = this.actualScroll),
            (this.lastVelocity = this.velocity),
            (this.velocity = this.animatedScroll - ee),
            (this.direction = Math.sign(this.animatedScroll - ee)),
            (this.isScrolling = "native"),
            this.emit(),
            this.velocity !== 0 &&
              (this.__resetVelocityTimeout = setTimeout(() => {
                ((this.lastVelocity = this.velocity),
                  (this.velocity = 0),
                  (this.isScrolling = !1),
                  this.emit());
              }, 400)));
        }
      }),
      (window.lenisVersion = "1.1.5"),
      (O && O !== document.documentElement && O !== document.body) ||
        (O = window),
      (this.options = {
        wrapper: O,
        content: B,
        wheelEventsTarget: z,
        eventsTarget: N,
        smoothWheel: G,
        syncTouch: H,
        syncTouchLerp: W,
        touchInertiaMultiplier: q,
        duration: j,
        easing: Y,
        lerp: re,
        infinite: U,
        gestureOrientation: Z,
        orientation: K,
        touchMultiplier: X,
        wheelMultiplier: se,
        autoResize: Q,
        prevent: te,
        __experimental__naiveDimensions: J,
      }),
      (this.animate = new Animate()),
      (this.emitter = new Emitter()),
      (this.dimensions = new Dimensions({
        wrapper: O,
        content: B,
        autoResize: Q,
      })),
      this.updateClassName(),
      (this.userData = {}),
      (this.time = 0),
      (this.velocity = this.lastVelocity = 0),
      (this.isLocked = !1),
      (this.isStopped = !1),
      (this.isScrolling = !1),
      (this.targetScroll = this.animatedScroll = this.actualScroll),
      this.options.wrapper.addEventListener("scroll", this.onNativeScroll, !1),
      this.options.wrapper.addEventListener(
        "pointerdown",
        this.onPointerDown,
        !1,
      ),
      (this.virtualScroll = new VirtualScroll(N, {
        touchMultiplier: X,
        wheelMultiplier: se,
      })),
      this.virtualScroll.on("scroll", this.onVirtualScroll));
  }
  destroy() {
    (this.emitter.destroy(),
      this.options.wrapper.removeEventListener(
        "scroll",
        this.onNativeScroll,
        !1,
      ),
      this.options.wrapper.removeEventListener(
        "pointerdown",
        this.onPointerDown,
        !1,
      ),
      this.virtualScroll.destroy(),
      this.dimensions.destroy(),
      this.cleanUpClassName());
  }
  on(O, B) {
    return this.emitter.on(O, B);
  }
  off(O, B) {
    return this.emitter.off(O, B);
  }
  setScroll(O) {
    this.isHorizontal
      ? (this.rootElement.scrollLeft = O)
      : (this.rootElement.scrollTop = O);
  }
  resize() {
    this.dimensions.resize();
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  reset() {
    ((this.isLocked = !1),
      (this.isScrolling = !1),
      (this.animatedScroll = this.targetScroll = this.actualScroll),
      (this.lastVelocity = this.velocity = 0),
      this.animate.stop());
  }
  start() {
    this.isStopped && ((this.isStopped = !1), this.reset());
  }
  stop() {
    this.isStopped ||
      ((this.isStopped = !0), this.animate.stop(), this.reset());
  }
  raf(O) {
    const B = O - (this.time || O);
    ((this.time = O), this.animate.advance(0.001 * B));
  }
  scrollTo(
    O,
    {
      offset: B = 0,
      immediate: z = !1,
      lock: N = !1,
      duration: G = this.options.duration,
      easing: H = this.options.easing,
      lerp: W = this.options.lerp,
      onStart: q,
      onComplete: j,
      force: Y = !1,
      programmatic: re = !0,
      userData: U = {},
    } = {},
  ) {
    if ((!this.isStopped && !this.isLocked) || Y) {
      if (typeof O == "string" && ["top", "left", "start"].includes(O)) O = 0;
      else if (typeof O == "string" && ["bottom", "right", "end"].includes(O))
        O = this.limit;
      else {
        let K;
        if (
          (typeof O == "string"
            ? (K = document.querySelector(O))
            : O instanceof HTMLElement && O != null && O.nodeType && (K = O),
          K)
        ) {
          if (this.options.wrapper !== window) {
            const X = this.rootElement.getBoundingClientRect();
            B -= this.isHorizontal ? X.left : X.top;
          }
          const Z = K.getBoundingClientRect();
          O = (this.isHorizontal ? Z.left : Z.top) + this.animatedScroll;
        }
      }
      if (
        typeof O == "number" &&
        ((O += B),
        (O = Math.round(O)),
        this.options.infinite
          ? re && (this.targetScroll = this.animatedScroll = this.scroll)
          : (O = clamp$1(0, O, this.limit)),
        O !== this.targetScroll)
      ) {
        if (((this.userData = U), z))
          return (
            (this.animatedScroll = this.targetScroll = O),
            this.setScroll(this.scroll),
            this.reset(),
            this.preventNextNativeScrollEvent(),
            this.emit(),
            j == null || j(this),
            void (this.userData = {})
          );
        (re || (this.targetScroll = O),
          this.animate.fromTo(this.animatedScroll, O, {
            duration: G,
            easing: H,
            lerp: W,
            onStart: () => {
              (N && (this.isLocked = !0),
                (this.isScrolling = "smooth"),
                q == null || q(this));
            },
            onUpdate: (K, Z) => {
              ((this.isScrolling = "smooth"),
                (this.lastVelocity = this.velocity),
                (this.velocity = K - this.animatedScroll),
                (this.direction = Math.sign(this.velocity)),
                (this.animatedScroll = K),
                this.setScroll(this.scroll),
                re && (this.targetScroll = K),
                Z || this.emit(),
                Z &&
                  (this.reset(),
                  this.emit(),
                  j == null || j(this),
                  (this.userData = {}),
                  this.preventNextNativeScrollEvent()));
            },
          }));
      }
    }
  }
  preventNextNativeScrollEvent() {
    ((this.__preventNextNativeScrollEvent = !0),
      requestAnimationFrame(() => {
        delete this.__preventNextNativeScrollEvent;
      }));
  }
  get rootElement() {
    return this.options.wrapper === window
      ? document.documentElement
      : this.options.wrapper;
  }
  get limit() {
    return this.options.__experimental__naiveDimensions
      ? this.isHorizontal
        ? this.rootElement.scrollWidth - this.rootElement.clientWidth
        : this.rootElement.scrollHeight - this.rootElement.clientHeight
      : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
  }
  get isHorizontal() {
    return this.options.orientation === "horizontal";
  }
  get actualScroll() {
    return this.isHorizontal
      ? this.rootElement.scrollLeft
      : this.rootElement.scrollTop;
  }
  get scroll() {
    return this.options.infinite
      ? (function (B, z) {
          return ((B % z) + z) % z;
        })(this.animatedScroll, this.limit)
      : this.animatedScroll;
  }
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  get isScrolling() {
    return this.__isScrolling;
  }
  set isScrolling(O) {
    this.__isScrolling !== O &&
      ((this.__isScrolling = O), this.updateClassName());
  }
  get isStopped() {
    return this.__isStopped;
  }
  set isStopped(O) {
    this.__isStopped !== O && ((this.__isStopped = O), this.updateClassName());
  }
  get isLocked() {
    return this.__isLocked;
  }
  set isLocked(O) {
    this.__isLocked !== O && ((this.__isLocked = O), this.updateClassName());
  }
  get isSmooth() {
    return this.isScrolling === "smooth";
  }
  get className() {
    let O = "lenis";
    return (
      this.isStopped && (O += " lenis-stopped"),
      this.isLocked && (O += " lenis-locked"),
      this.isScrolling && (O += " lenis-scrolling"),
      this.isScrolling === "smooth" && (O += " lenis-smooth"),
      O
    );
  }
  updateClassName() {
    (this.cleanUpClassName(),
      (this.rootElement.className =
        `${this.rootElement.className} ${this.className}`.trim()));
  }
  cleanUpClassName() {
    this.rootElement.className = this.rootElement.className
      .replace(/lenis(-\w+)?/g, "")
      .trim();
  }
}
function _assertThisInitialized(V) {
  if (V === void 0)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  return V;
}
function _inheritsLoose(V, O) {
  ((V.prototype = Object.create(O.prototype)),
    (V.prototype.constructor = V),
    (V.__proto__ = O));
}
/*!
 * GSAP 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */ var _config = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: { lineHeight: "" },
  },
  _defaults$1 = { duration: 0.5, overwrite: !1, delay: 0 },
  _suppressOverwrites$1,
  _reverting$1,
  _context$2,
  _bigNum$1 = 1e8,
  _tinyNum = 1 / _bigNum$1,
  _2PI = Math.PI * 2,
  _HALF_PI = _2PI / 4,
  _gsID = 0,
  _sqrt = Math.sqrt,
  _cos = Math.cos,
  _sin = Math.sin,
  _isString$1 = function (O) {
    return typeof O == "string";
  },
  _isFunction$1 = function (O) {
    return typeof O == "function";
  },
  _isNumber$1 = function (O) {
    return typeof O == "number";
  },
  _isUndefined = function (O) {
    return typeof O > "u";
  },
  _isObject$1 = function (O) {
    return typeof O == "object";
  },
  _isNotFalse = function (O) {
    return O !== !1;
  },
  _windowExists$2 = function () {
    return typeof window < "u";
  },
  _isFuncOrString = function (O) {
    return _isFunction$1(O) || _isString$1(O);
  },
  _isTypedArray =
    (typeof ArrayBuffer == "function" && ArrayBuffer.isView) || function () {},
  _isArray = Array.isArray,
  _strictNumExp = /(?:-?\.?\d|\.)+/gi,
  _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
  _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
  _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
  _relExp = /[+-]=-?[.\d]+/,
  _delimitedValueExp = /[^,'"\[\]\s]+/gi,
  _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
  _globalTimeline,
  _win$3,
  _coreInitted$2,
  _doc$3,
  _globals = {},
  _installScope = {},
  _coreReady,
  _install = function (O) {
    return (_installScope = _merge(O, _globals)) && gsap$2;
  },
  _missingPlugin = function (O, B) {
    return console.warn(
      "Invalid property",
      O,
      "set to",
      B,
      "Missing plugin? gsap.registerPlugin()",
    );
  },
  _warn = function (O, B) {
    return !B && console.warn(O);
  },
  _addGlobal = function (O, B) {
    return (
      (O && (_globals[O] = B) && _installScope && (_installScope[O] = B)) ||
      _globals
    );
  },
  _emptyFunc = function () {
    return 0;
  },
  _startAtRevertConfig = { suppressEvents: !0, isStart: !0, kill: !1 },
  _revertConfigNoKill = { suppressEvents: !0, kill: !1 },
  _revertConfig = { suppressEvents: !0 },
  _reservedProps = {},
  _lazyTweens = [],
  _lazyLookup = {},
  _lastRenderedFrame,
  _plugins = {},
  _effects = {},
  _nextGCFrame = 30,
  _harnessPlugins = [],
  _callbackNames = "",
  _harness = function (O) {
    var B = O[0],
      z,
      N;
    if (
      (_isObject$1(B) || _isFunction$1(B) || (O = [O]),
      !(z = (B._gsap || {}).harness))
    ) {
      for (
        N = _harnessPlugins.length;
        N-- && !_harnessPlugins[N].targetTest(B);
      );
      z = _harnessPlugins[N];
    }
    for (N = O.length; N--; )
      (O[N] && (O[N]._gsap || (O[N]._gsap = new GSCache(O[N], z)))) ||
        O.splice(N, 1);
    return O;
  },
  _getCache = function (O) {
    return O._gsap || _harness(toArray(O))[0]._gsap;
  },
  _getProperty = function (O, B, z) {
    return (z = O[B]) && _isFunction$1(z)
      ? O[B]()
      : (_isUndefined(z) && O.getAttribute && O.getAttribute(B)) || z;
  },
  _forEachName = function (O, B) {
    return (O = O.split(",")).forEach(B) || O;
  },
  _round$1 = function (O) {
    return Math.round(O * 1e5) / 1e5 || 0;
  },
  _roundPrecise = function (O) {
    return Math.round(O * 1e7) / 1e7 || 0;
  },
  _parseRelative = function (O, B) {
    var z = B.charAt(0),
      N = parseFloat(B.substr(2));
    return (
      (O = parseFloat(O)),
      z === "+" ? O + N : z === "-" ? O - N : z === "*" ? O * N : O / N
    );
  },
  _arrayContainsAny = function (O, B) {
    for (var z = B.length, N = 0; O.indexOf(B[N]) < 0 && ++N < z; );
    return N < z;
  },
  _lazyRender = function () {
    var O = _lazyTweens.length,
      B = _lazyTweens.slice(0),
      z,
      N;
    for (_lazyLookup = {}, _lazyTweens.length = 0, z = 0; z < O; z++)
      ((N = B[z]),
        N && N._lazy && (N.render(N._lazy[0], N._lazy[1], !0)._lazy = 0));
  },
  _lazySafeRender = function (O, B, z, N) {
    (_lazyTweens.length && !_reverting$1 && _lazyRender(),
      O.render(B, z, _reverting$1 && B < 0 && (O._initted || O._startAt)),
      _lazyTweens.length && !_reverting$1 && _lazyRender());
  },
  _numericIfPossible = function (O) {
    var B = parseFloat(O);
    return (B || B === 0) && (O + "").match(_delimitedValueExp).length < 2
      ? B
      : _isString$1(O)
        ? O.trim()
        : O;
  },
  _passThrough$1 = function (O) {
    return O;
  },
  _setDefaults$1 = function (O, B) {
    for (var z in B) z in O || (O[z] = B[z]);
    return O;
  },
  _setKeyframeDefaults = function (O) {
    return function (B, z) {
      for (var N in z)
        N in B || (N === "duration" && O) || N === "ease" || (B[N] = z[N]);
    };
  },
  _merge = function (O, B) {
    for (var z in B) O[z] = B[z];
    return O;
  },
  _mergeDeep = function V(O, B) {
    for (var z in B)
      z !== "__proto__" &&
        z !== "constructor" &&
        z !== "prototype" &&
        (O[z] = _isObject$1(B[z]) ? V(O[z] || (O[z] = {}), B[z]) : B[z]);
    return O;
  },
  _copyExcluding = function (O, B) {
    var z = {},
      N;
    for (N in O) N in B || (z[N] = O[N]);
    return z;
  },
  _inheritDefaults = function (O) {
    var B = O.parent || _globalTimeline,
      z = O.keyframes
        ? _setKeyframeDefaults(_isArray(O.keyframes))
        : _setDefaults$1;
    if (_isNotFalse(O.inherit))
      for (; B; ) (z(O, B.vars.defaults), (B = B.parent || B._dp));
    return O;
  },
  _arraysMatch = function (O, B) {
    for (var z = O.length, N = z === B.length; N && z-- && O[z] === B[z]; );
    return z < 0;
  },
  _addLinkedListItem = function (O, B, z, N, G) {
    var H = O[N],
      W;
    if (G) for (W = B[G]; H && H[G] > W; ) H = H._prev;
    return (
      H ? ((B._next = H._next), (H._next = B)) : ((B._next = O[z]), (O[z] = B)),
      B._next ? (B._next._prev = B) : (O[N] = B),
      (B._prev = H),
      (B.parent = B._dp = O),
      B
    );
  },
  _removeLinkedListItem = function (O, B, z, N) {
    (z === void 0 && (z = "_first"), N === void 0 && (N = "_last"));
    var G = B._prev,
      H = B._next;
    (G ? (G._next = H) : O[z] === B && (O[z] = H),
      H ? (H._prev = G) : O[N] === B && (O[N] = G),
      (B._next = B._prev = B.parent = null));
  },
  _removeFromParent = function (O, B) {
    (O.parent &&
      (!B || O.parent.autoRemoveChildren) &&
      O.parent.remove &&
      O.parent.remove(O),
      (O._act = 0));
  },
  _uncache = function (O, B) {
    if (O && (!B || B._end > O._dur || B._start < 0))
      for (var z = O; z; ) ((z._dirty = 1), (z = z.parent));
    return O;
  },
  _recacheAncestors = function (O) {
    for (var B = O.parent; B && B.parent; )
      ((B._dirty = 1), B.totalDuration(), (B = B.parent));
    return O;
  },
  _rewindStartAt = function (O, B, z, N) {
    return (
      O._startAt &&
      (_reverting$1
        ? O._startAt.revert(_revertConfigNoKill)
        : (O.vars.immediateRender && !O.vars.autoRevert) ||
          O._startAt.render(B, !0, N))
    );
  },
  _hasNoPausedAncestors = function V(O) {
    return !O || (O._ts && V(O.parent));
  },
  _elapsedCycleDuration = function (O) {
    return O._repeat
      ? _animationCycle(O._tTime, (O = O.duration() + O._rDelay)) * O
      : 0;
  },
  _animationCycle = function (O, B) {
    var z = Math.floor((O /= B));
    return O && z === O ? z - 1 : z;
  },
  _parentToChildTotalTime = function (O, B) {
    return (
      (O - B._start) * B._ts +
      (B._ts >= 0 ? 0 : B._dirty ? B.totalDuration() : B._tDur)
    );
  },
  _setEnd = function (O) {
    return (O._end = _roundPrecise(
      O._start + (O._tDur / Math.abs(O._ts || O._rts || _tinyNum) || 0),
    ));
  },
  _alignPlayhead = function (O, B) {
    var z = O._dp;
    return (
      z &&
        z.smoothChildTiming &&
        O._ts &&
        ((O._start = _roundPrecise(
          z._time -
            (O._ts > 0
              ? B / O._ts
              : ((O._dirty ? O.totalDuration() : O._tDur) - B) / -O._ts),
        )),
        _setEnd(O),
        z._dirty || _uncache(z, O)),
      O
    );
  },
  _postAddChecks = function (O, B) {
    var z;
    if (
      ((B._time ||
        (!B._dur && B._initted) ||
        (B._start < O._time && (B._dur || !B.add))) &&
        ((z = _parentToChildTotalTime(O.rawTime(), B)),
        (!B._dur || _clamp$1(0, B.totalDuration(), z) - B._tTime > _tinyNum) &&
          B.render(z, !0)),
      _uncache(O, B)._dp && O._initted && O._time >= O._dur && O._ts)
    ) {
      if (O._dur < O.duration())
        for (z = O; z._dp; )
          (z.rawTime() >= 0 && z.totalTime(z._tTime), (z = z._dp));
      O._zTime = -_tinyNum;
    }
  },
  _addToTimeline = function (O, B, z, N) {
    return (
      B.parent && _removeFromParent(B),
      (B._start = _roundPrecise(
        (_isNumber$1(z)
          ? z
          : z || O !== _globalTimeline
            ? _parsePosition$1(O, z, B)
            : O._time) + B._delay,
      )),
      (B._end = _roundPrecise(
        B._start + (B.totalDuration() / Math.abs(B.timeScale()) || 0),
      )),
      _addLinkedListItem(O, B, "_first", "_last", O._sort ? "_start" : 0),
      _isFromOrFromStart(B) || (O._recent = B),
      N || _postAddChecks(O, B),
      O._ts < 0 && _alignPlayhead(O, O._tTime),
      O
    );
  },
  _scrollTrigger = function (O, B) {
    return (
      (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", B)) &&
      _globals.ScrollTrigger.create(B, O)
    );
  },
  _attemptInitTween = function (O, B, z, N, G) {
    if ((_initTween(O, B, G), !O._initted)) return 1;
    if (
      !z &&
      O._pt &&
      !_reverting$1 &&
      ((O._dur && O.vars.lazy !== !1) || (!O._dur && O.vars.lazy)) &&
      _lastRenderedFrame !== _ticker.frame
    )
      return (_lazyTweens.push(O), (O._lazy = [G, N]), 1);
  },
  _parentPlayheadIsBeforeStart = function V(O) {
    var B = O.parent;
    return B && B._ts && B._initted && !B._lock && (B.rawTime() < 0 || V(B));
  },
  _isFromOrFromStart = function (O) {
    var B = O.data;
    return B === "isFromStart" || B === "isStart";
  },
  _renderZeroDurationTween = function (O, B, z, N) {
    var G = O.ratio,
      H =
        B < 0 ||
        (!B &&
          ((!O._start &&
            _parentPlayheadIsBeforeStart(O) &&
            !(!O._initted && _isFromOrFromStart(O))) ||
            ((O._ts < 0 || O._dp._ts < 0) && !_isFromOrFromStart(O))))
          ? 0
          : 1,
      W = O._rDelay,
      q = 0,
      j,
      Y,
      re;
    if (
      (W &&
        O._repeat &&
        ((q = _clamp$1(0, O._tDur, B)),
        (Y = _animationCycle(q, W)),
        O._yoyo && Y & 1 && (H = 1 - H),
        Y !== _animationCycle(O._tTime, W) &&
          ((G = 1 - H), O.vars.repeatRefresh && O._initted && O.invalidate())),
      H !== G || _reverting$1 || N || O._zTime === _tinyNum || (!B && O._zTime))
    ) {
      if (!O._initted && _attemptInitTween(O, B, N, z, q)) return;
      for (
        re = O._zTime,
          O._zTime = B || (z ? _tinyNum : 0),
          z || (z = B && !re),
          O.ratio = H,
          O._from && (H = 1 - H),
          O._time = 0,
          O._tTime = q,
          j = O._pt;
        j;
      )
        (j.r(H, j.d), (j = j._next));
      (B < 0 && _rewindStartAt(O, B, z, !0),
        O._onUpdate && !z && _callback$1(O, "onUpdate"),
        q && O._repeat && !z && O.parent && _callback$1(O, "onRepeat"),
        (B >= O._tDur || B < 0) &&
          O.ratio === H &&
          (H && _removeFromParent(O, 1),
          !z &&
            !_reverting$1 &&
            (_callback$1(O, H ? "onComplete" : "onReverseComplete", !0),
            O._prom && O._prom())));
    } else O._zTime || (O._zTime = B);
  },
  _findNextPauseTween = function (O, B, z) {
    var N;
    if (z > B)
      for (N = O._first; N && N._start <= z; ) {
        if (N.data === "isPause" && N._start > B) return N;
        N = N._next;
      }
    else
      for (N = O._last; N && N._start >= z; ) {
        if (N.data === "isPause" && N._start < B) return N;
        N = N._prev;
      }
  },
  _setDuration = function (O, B, z, N) {
    var G = O._repeat,
      H = _roundPrecise(B) || 0,
      W = O._tTime / O._tDur;
    return (
      W && !N && (O._time *= H / O._dur),
      (O._dur = H),
      (O._tDur = G
        ? G < 0
          ? 1e10
          : _roundPrecise(H * (G + 1) + O._rDelay * G)
        : H),
      W > 0 && !N && _alignPlayhead(O, (O._tTime = O._tDur * W)),
      O.parent && _setEnd(O),
      z || _uncache(O.parent, O),
      O
    );
  },
  _onUpdateTotalDuration = function (O) {
    return O instanceof Timeline ? _uncache(O) : _setDuration(O, O._dur);
  },
  _zeroPosition = { _start: 0, endTime: _emptyFunc, totalDuration: _emptyFunc },
  _parsePosition$1 = function V(O, B, z) {
    var N = O.labels,
      G = O._recent || _zeroPosition,
      H = O.duration() >= _bigNum$1 ? G.endTime(!1) : O._dur,
      W,
      q,
      j;
    return _isString$1(B) && (isNaN(B) || B in N)
      ? ((q = B.charAt(0)),
        (j = B.substr(-1) === "%"),
        (W = B.indexOf("=")),
        q === "<" || q === ">"
          ? (W >= 0 && (B = B.replace(/=/, "")),
            (q === "<" ? G._start : G.endTime(G._repeat >= 0)) +
              (parseFloat(B.substr(1)) || 0) *
                (j ? (W < 0 ? G : z).totalDuration() / 100 : 1))
          : W < 0
            ? (B in N || (N[B] = H), N[B])
            : ((q = parseFloat(B.charAt(W - 1) + B.substr(W + 1))),
              j &&
                z &&
                (q = (q / 100) * (_isArray(z) ? z[0] : z).totalDuration()),
              W > 1 ? V(O, B.substr(0, W - 1), z) + q : H + q))
      : B == null
        ? H
        : +B;
  },
  _createTweenType = function (O, B, z) {
    var N = _isNumber$1(B[1]),
      G = (N ? 2 : 1) + (O < 2 ? 0 : 1),
      H = B[G],
      W,
      q;
    if ((N && (H.duration = B[1]), (H.parent = z), O)) {
      for (W = H, q = z; q && !("immediateRender" in W); )
        ((W = q.vars.defaults || {}),
          (q = _isNotFalse(q.vars.inherit) && q.parent));
      ((H.immediateRender = _isNotFalse(W.immediateRender)),
        O < 2 ? (H.runBackwards = 1) : (H.startAt = B[G - 1]));
    }
    return new Tween(B[0], H, B[G + 1]);
  },
  _conditionalReturn = function (O, B) {
    return O || O === 0 ? B(O) : B;
  },
  _clamp$1 = function (O, B, z) {
    return z < O ? O : z > B ? B : z;
  },
  getUnit = function (O, B) {
    return !_isString$1(O) || !(B = _unitExp.exec(O)) ? "" : B[1];
  },
  clamp = function (O, B, z) {
    return _conditionalReturn(z, function (N) {
      return _clamp$1(O, B, N);
    });
  },
  _slice = [].slice,
  _isArrayLike = function (O, B) {
    return (
      O &&
      _isObject$1(O) &&
      "length" in O &&
      ((!B && !O.length) || (O.length - 1 in O && _isObject$1(O[0]))) &&
      !O.nodeType &&
      O !== _win$3
    );
  },
  _flatten = function (O, B, z) {
    return (
      z === void 0 && (z = []),
      O.forEach(function (N) {
        var G;
        return (_isString$1(N) && !B) || _isArrayLike(N, 1)
          ? (G = z).push.apply(G, toArray(N))
          : z.push(N);
      }) || z
    );
  },
  toArray = function (O, B, z) {
    return _context$2 && !B && _context$2.selector
      ? _context$2.selector(O)
      : _isString$1(O) && !z && (_coreInitted$2 || !_wake())
        ? _slice.call((B || _doc$3).querySelectorAll(O), 0)
        : _isArray(O)
          ? _flatten(O, z)
          : _isArrayLike(O)
            ? _slice.call(O, 0)
            : O
              ? [O]
              : [];
  },
  selector = function (O) {
    return (
      (O = toArray(O)[0] || _warn("Invalid scope") || {}),
      function (B) {
        var z = O.current || O.nativeElement || O;
        return toArray(
          B,
          z.querySelectorAll
            ? z
            : z === O
              ? _warn("Invalid scope") || _doc$3.createElement("div")
              : O,
        );
      }
    );
  },
  shuffle = function (O) {
    return O.sort(function () {
      return 0.5 - Math.random();
    });
  },
  distribute = function (O) {
    if (_isFunction$1(O)) return O;
    var B = _isObject$1(O) ? O : { each: O },
      z = _parseEase(B.ease),
      N = B.from || 0,
      G = parseFloat(B.base) || 0,
      H = {},
      W = N > 0 && N < 1,
      q = isNaN(N) || W,
      j = B.axis,
      Y = N,
      re = N;
    return (
      _isString$1(N)
        ? (Y = re = { center: 0.5, edges: 0.5, end: 1 }[N] || 0)
        : !W && q && ((Y = N[0]), (re = N[1])),
      function (U, K, Z) {
        var X = (Z || B).length,
          se = H[X],
          Q,
          te,
          J,
          ee,
          ne,
          oe,
          he,
          ce,
          ue;
        if (!se) {
          if (
            ((ue = B.grid === "auto" ? 0 : (B.grid || [1, _bigNum$1])[1]), !ue)
          ) {
            for (
              he = -_bigNum$1;
              he < (he = Z[ue++].getBoundingClientRect().left) && ue < X;
            );
            ue < X && ue--;
          }
          for (
            se = H[X] = [],
              Q = q ? Math.min(ue, X) * Y - 0.5 : N % ue,
              te =
                ue === _bigNum$1 ? 0 : q ? (X * re) / ue - 0.5 : (N / ue) | 0,
              he = 0,
              ce = _bigNum$1,
              oe = 0;
            oe < X;
            oe++
          )
            ((J = (oe % ue) - Q),
              (ee = te - ((oe / ue) | 0)),
              (se[oe] = ne =
                j ? Math.abs(j === "y" ? ee : J) : _sqrt(J * J + ee * ee)),
              ne > he && (he = ne),
              ne < ce && (ce = ne));
          (N === "random" && shuffle(se),
            (se.max = he - ce),
            (se.min = ce),
            (se.v = X =
              (parseFloat(B.amount) ||
                parseFloat(B.each) *
                  (ue > X
                    ? X - 1
                    : j
                      ? j === "y"
                        ? X / ue
                        : ue
                      : Math.max(ue, X / ue)) ||
                0) * (N === "edges" ? -1 : 1)),
            (se.b = X < 0 ? G - X : G),
            (se.u = getUnit(B.amount || B.each) || 0),
            (z = z && X < 0 ? _invertEase(z) : z));
        }
        return (
          (X = (se[U] - se.min) / se.max || 0),
          _roundPrecise(se.b + (z ? z(X) : X) * se.v) + se.u
        );
      }
    );
  },
  _roundModifier = function (O) {
    var B = Math.pow(10, ((O + "").split(".")[1] || "").length);
    return function (z) {
      var N = _roundPrecise(Math.round(parseFloat(z) / O) * O * B);
      return (N - (N % 1)) / B + (_isNumber$1(z) ? 0 : getUnit(z));
    };
  },
  snap = function (O, B) {
    var z = _isArray(O),
      N,
      G;
    return (
      !z &&
        _isObject$1(O) &&
        ((N = z = O.radius || _bigNum$1),
        O.values
          ? ((O = toArray(O.values)), (G = !_isNumber$1(O[0])) && (N *= N))
          : (O = _roundModifier(O.increment))),
      _conditionalReturn(
        B,
        z
          ? _isFunction$1(O)
            ? function (H) {
                return ((G = O(H)), Math.abs(G - H) <= N ? G : H);
              }
            : function (H) {
                for (
                  var W = parseFloat(G ? H.x : H),
                    q = parseFloat(G ? H.y : 0),
                    j = _bigNum$1,
                    Y = 0,
                    re = O.length,
                    U,
                    K;
                  re--;
                )
                  (G
                    ? ((U = O[re].x - W),
                      (K = O[re].y - q),
                      (U = U * U + K * K))
                    : (U = Math.abs(O[re] - W)),
                    U < j && ((j = U), (Y = re)));
                return (
                  (Y = !N || j <= N ? O[Y] : H),
                  G || Y === H || _isNumber$1(H) ? Y : Y + getUnit(H)
                );
              }
          : _roundModifier(O),
      )
    );
  },
  random = function (O, B, z, N) {
    return _conditionalReturn(
      _isArray(O) ? !B : z === !0 ? !!(z = 0) : !N,
      function () {
        return _isArray(O)
          ? O[~~(Math.random() * O.length)]
          : (z = z || 1e-5) &&
              (N = z < 1 ? Math.pow(10, (z + "").length - 2) : 1) &&
              Math.floor(
                Math.round(
                  (O - z / 2 + Math.random() * (B - O + z * 0.99)) / z,
                ) *
                  z *
                  N,
              ) / N;
      },
    );
  },
  pipe = function () {
    for (var O = arguments.length, B = new Array(O), z = 0; z < O; z++)
      B[z] = arguments[z];
    return function (N) {
      return B.reduce(function (G, H) {
        return H(G);
      }, N);
    };
  },
  unitize = function (O, B) {
    return function (z) {
      return O(parseFloat(z)) + (B || getUnit(z));
    };
  },
  normalize = function (O, B, z) {
    return mapRange(O, B, 0, 1, z);
  },
  _wrapArray = function (O, B, z) {
    return _conditionalReturn(z, function (N) {
      return O[~~B(N)];
    });
  },
  wrap = function V(O, B, z) {
    var N = B - O;
    return _isArray(O)
      ? _wrapArray(O, V(0, O.length), B)
      : _conditionalReturn(z, function (G) {
          return ((N + ((G - O) % N)) % N) + O;
        });
  },
  wrapYoyo = function V(O, B, z) {
    var N = B - O,
      G = N * 2;
    return _isArray(O)
      ? _wrapArray(O, V(0, O.length - 1), B)
      : _conditionalReturn(z, function (H) {
          return ((H = (G + ((H - O) % G)) % G || 0), O + (H > N ? G - H : H));
        });
  },
  _replaceRandom = function (O) {
    for (var B = 0, z = "", N, G, H, W; ~(N = O.indexOf("random(", B)); )
      ((H = O.indexOf(")", N)),
        (W = O.charAt(N + 7) === "["),
        (G = O.substr(N + 7, H - N - 7).match(
          W ? _delimitedValueExp : _strictNumExp,
        )),
        (z +=
          O.substr(B, N - B) +
          random(W ? G : +G[0], W ? 0 : +G[1], +G[2] || 1e-5)),
        (B = H + 1));
    return z + O.substr(B, O.length - B);
  },
  mapRange = function (O, B, z, N, G) {
    var H = B - O,
      W = N - z;
    return _conditionalReturn(G, function (q) {
      return z + (((q - O) / H) * W || 0);
    });
  },
  interpolate = function V(O, B, z, N) {
    var G = isNaN(O + B)
      ? 0
      : function (K) {
          return (1 - K) * O + K * B;
        };
    if (!G) {
      var H = _isString$1(O),
        W = {},
        q,
        j,
        Y,
        re,
        U;
      if ((z === !0 && (N = 1) && (z = null), H))
        ((O = { p: O }), (B = { p: B }));
      else if (_isArray(O) && !_isArray(B)) {
        for (Y = [], re = O.length, U = re - 2, j = 1; j < re; j++)
          Y.push(V(O[j - 1], O[j]));
        (re--,
          (G = function (Z) {
            Z *= re;
            var X = Math.min(U, ~~Z);
            return Y[X](Z - X);
          }),
          (z = B));
      } else N || (O = _merge(_isArray(O) ? [] : {}, O));
      if (!Y) {
        for (q in B) _addPropTween.call(W, O, q, "get", B[q]);
        G = function (Z) {
          return _renderPropTweens(Z, W) || (H ? O.p : O);
        };
      }
    }
    return _conditionalReturn(z, G);
  },
  _getLabelInDirection = function (O, B, z) {
    var N = O.labels,
      G = _bigNum$1,
      H,
      W,
      q;
    for (H in N)
      ((W = N[H] - B),
        W < 0 == !!z && W && G > (W = Math.abs(W)) && ((q = H), (G = W)));
    return q;
  },
  _callback$1 = function (O, B, z) {
    var N = O.vars,
      G = N[B],
      H = _context$2,
      W = O._ctx,
      q,
      j,
      Y;
    if (G)
      return (
        (q = N[B + "Params"]),
        (j = N.callbackScope || O),
        z && _lazyTweens.length && _lazyRender(),
        W && (_context$2 = W),
        (Y = q ? G.apply(j, q) : G.call(j)),
        (_context$2 = H),
        Y
      );
  },
  _interrupt = function (O) {
    return (
      _removeFromParent(O),
      O.scrollTrigger && O.scrollTrigger.kill(!!_reverting$1),
      O.progress() < 1 && _callback$1(O, "onInterrupt"),
      O
    );
  },
  _quickTween,
  _registerPluginQueue = [],
  _createPlugin = function (O) {
    if (O)
      if (
        ((O = (!O.name && O.default) || O), _windowExists$2() || O.headless)
      ) {
        var B = O.name,
          z = _isFunction$1(O),
          N =
            B && !z && O.init
              ? function () {
                  this._props = [];
                }
              : O,
          G = {
            init: _emptyFunc,
            render: _renderPropTweens,
            add: _addPropTween,
            kill: _killPropTweensOf,
            modifier: _addPluginModifier,
            rawVars: 0,
          },
          H = {
            targetTest: 0,
            get: 0,
            getSetter: _getSetter,
            aliases: {},
            register: 0,
          };
        if ((_wake(), O !== N)) {
          if (_plugins[B]) return;
          (_setDefaults$1(N, _setDefaults$1(_copyExcluding(O, G), H)),
            _merge(N.prototype, _merge(G, _copyExcluding(O, H))),
            (_plugins[(N.prop = B)] = N),
            O.targetTest && (_harnessPlugins.push(N), (_reservedProps[B] = 1)),
            (B =
              (B === "css" ? "CSS" : B.charAt(0).toUpperCase() + B.substr(1)) +
              "Plugin"));
        }
        (_addGlobal(B, N), O.register && O.register(gsap$2, N, PropTween));
      } else _registerPluginQueue.push(O);
  },
  _255 = 255,
  _colorLookup = {
    aqua: [0, _255, _255],
    lime: [0, _255, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, _255],
    navy: [0, 0, 128],
    white: [_255, _255, _255],
    olive: [128, 128, 0],
    yellow: [_255, _255, 0],
    orange: [_255, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [_255, 0, 0],
    pink: [_255, 192, 203],
    cyan: [0, _255, _255],
    transparent: [_255, _255, _255, 0],
  },
  _hue = function (O, B, z) {
    return (
      (O += O < 0 ? 1 : O > 1 ? -1 : 0),
      ((O * 6 < 1
        ? B + (z - B) * O * 6
        : O < 0.5
          ? z
          : O * 3 < 2
            ? B + (z - B) * (2 / 3 - O) * 6
            : B) *
        _255 +
        0.5) |
        0
    );
  },
  splitColor = function (O, B, z) {
    var N = O
        ? _isNumber$1(O)
          ? [O >> 16, (O >> 8) & _255, O & _255]
          : 0
        : _colorLookup.black,
      G,
      H,
      W,
      q,
      j,
      Y,
      re,
      U,
      K,
      Z;
    if (!N) {
      if (
        (O.substr(-1) === "," && (O = O.substr(0, O.length - 1)),
        _colorLookup[O])
      )
        N = _colorLookup[O];
      else if (O.charAt(0) === "#") {
        if (
          (O.length < 6 &&
            ((G = O.charAt(1)),
            (H = O.charAt(2)),
            (W = O.charAt(3)),
            (O =
              "#" +
              G +
              G +
              H +
              H +
              W +
              W +
              (O.length === 5 ? O.charAt(4) + O.charAt(4) : ""))),
          O.length === 9)
        )
          return (
            (N = parseInt(O.substr(1, 6), 16)),
            [
              N >> 16,
              (N >> 8) & _255,
              N & _255,
              parseInt(O.substr(7), 16) / 255,
            ]
          );
        ((O = parseInt(O.substr(1), 16)),
          (N = [O >> 16, (O >> 8) & _255, O & _255]));
      } else if (O.substr(0, 3) === "hsl") {
        if (((N = Z = O.match(_strictNumExp)), !B))
          ((q = (+N[0] % 360) / 360),
            (j = +N[1] / 100),
            (Y = +N[2] / 100),
            (H = Y <= 0.5 ? Y * (j + 1) : Y + j - Y * j),
            (G = Y * 2 - H),
            N.length > 3 && (N[3] *= 1),
            (N[0] = _hue(q + 1 / 3, G, H)),
            (N[1] = _hue(q, G, H)),
            (N[2] = _hue(q - 1 / 3, G, H)));
        else if (~O.indexOf("="))
          return ((N = O.match(_numExp)), z && N.length < 4 && (N[3] = 1), N);
      } else N = O.match(_strictNumExp) || _colorLookup.transparent;
      N = N.map(Number);
    }
    return (
      B &&
        !Z &&
        ((G = N[0] / _255),
        (H = N[1] / _255),
        (W = N[2] / _255),
        (re = Math.max(G, H, W)),
        (U = Math.min(G, H, W)),
        (Y = (re + U) / 2),
        re === U
          ? (q = j = 0)
          : ((K = re - U),
            (j = Y > 0.5 ? K / (2 - re - U) : K / (re + U)),
            (q =
              re === G
                ? (H - W) / K + (H < W ? 6 : 0)
                : re === H
                  ? (W - G) / K + 2
                  : (G - H) / K + 4),
            (q *= 60)),
        (N[0] = ~~(q + 0.5)),
        (N[1] = ~~(j * 100 + 0.5)),
        (N[2] = ~~(Y * 100 + 0.5))),
      z && N.length < 4 && (N[3] = 1),
      N
    );
  },
  _colorOrderData = function (O) {
    var B = [],
      z = [],
      N = -1;
    return (
      O.split(_colorExp).forEach(function (G) {
        var H = G.match(_numWithUnitExp) || [];
        (B.push.apply(B, H), z.push((N += H.length + 1)));
      }),
      (B.c = z),
      B
    );
  },
  _formatColors = function (O, B, z) {
    var N = "",
      G = (O + N).match(_colorExp),
      H = B ? "hsla(" : "rgba(",
      W = 0,
      q,
      j,
      Y,
      re;
    if (!G) return O;
    if (
      ((G = G.map(function (U) {
        return (
          (U = splitColor(U, B, 1)) &&
          H +
            (B ? U[0] + "," + U[1] + "%," + U[2] + "%," + U[3] : U.join(",")) +
            ")"
        );
      })),
      z && ((Y = _colorOrderData(O)), (q = z.c), q.join(N) !== Y.c.join(N)))
    )
      for (
        j = O.replace(_colorExp, "1").split(_numWithUnitExp), re = j.length - 1;
        W < re;
        W++
      )
        N +=
          j[W] +
          (~q.indexOf(W)
            ? G.shift() || H + "0,0,0,0)"
            : (Y.length ? Y : G.length ? G : z).shift());
    if (!j)
      for (j = O.split(_colorExp), re = j.length - 1; W < re; W++)
        N += j[W] + G[W];
    return N + j[re];
  },
  _colorExp = (function () {
    var V =
        "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",
      O;
    for (O in _colorLookup) V += "|" + O + "\\b";
    return new RegExp(V + ")", "gi");
  })(),
  _hslExp = /hsl[a]?\(/,
  _colorStringFilter = function (O) {
    var B = O.join(" "),
      z;
    if (((_colorExp.lastIndex = 0), _colorExp.test(B)))
      return (
        (z = _hslExp.test(B)),
        (O[1] = _formatColors(O[1], z)),
        (O[0] = _formatColors(O[0], z, _colorOrderData(O[1]))),
        !0
      );
  },
  _tickerActive,
  _ticker = (function () {
    var V = Date.now,
      O = 500,
      B = 33,
      z = V(),
      N = z,
      G = 1e3 / 240,
      H = G,
      W = [],
      q,
      j,
      Y,
      re,
      U,
      K,
      Z = function X(se) {
        var Q = V() - N,
          te = se === !0,
          J,
          ee,
          ne,
          oe;
        if (
          ((Q > O || Q < 0) && (z += Q - B),
          (N += Q),
          (ne = N - z),
          (J = ne - H),
          (J > 0 || te) &&
            ((oe = ++re.frame),
            (U = ne - re.time * 1e3),
            (re.time = ne = ne / 1e3),
            (H += J + (J >= G ? 4 : G - J)),
            (ee = 1)),
          te || (q = j(X)),
          ee)
        )
          for (K = 0; K < W.length; K++) W[K](ne, U, oe, se);
      };
    return (
      (re = {
        time: 0,
        frame: 0,
        tick: function () {
          Z(!0);
        },
        deltaRatio: function (se) {
          return U / (1e3 / (se || 60));
        },
        wake: function () {
          _coreReady &&
            (!_coreInitted$2 &&
              _windowExists$2() &&
              ((_win$3 = _coreInitted$2 = window),
              (_doc$3 = _win$3.document || {}),
              (_globals.gsap = gsap$2),
              (_win$3.gsapVersions || (_win$3.gsapVersions = [])).push(
                gsap$2.version,
              ),
              _install(
                _installScope ||
                  _win$3.GreenSockGlobals ||
                  (!_win$3.gsap && _win$3) ||
                  {},
              ),
              _registerPluginQueue.forEach(_createPlugin)),
            (Y = typeof requestAnimationFrame < "u" && requestAnimationFrame),
            q && re.sleep(),
            (j =
              Y ||
              function (se) {
                return setTimeout(se, (H - re.time * 1e3 + 1) | 0);
              }),
            (_tickerActive = 1),
            Z(2));
        },
        sleep: function () {
          ((Y ? cancelAnimationFrame : clearTimeout)(q),
            (_tickerActive = 0),
            (j = _emptyFunc));
        },
        lagSmoothing: function (se, Q) {
          ((O = se || 1 / 0), (B = Math.min(Q || 33, O)));
        },
        fps: function (se) {
          ((G = 1e3 / (se || 240)), (H = re.time * 1e3 + G));
        },
        add: function (se, Q, te) {
          var J = Q
            ? function (ee, ne, oe, he) {
                (se(ee, ne, oe, he), re.remove(J));
              }
            : se;
          return (re.remove(se), W[te ? "unshift" : "push"](J), _wake(), J);
        },
        remove: function (se, Q) {
          ~(Q = W.indexOf(se)) && W.splice(Q, 1) && K >= Q && K--;
        },
        _listeners: W,
      }),
      re
    );
  })(),
  _wake = function () {
    return !_tickerActive && _ticker.wake();
  },
  _easeMap = {},
  _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
  _quotesExp = /["']/g,
  _parseObjectInString = function (O) {
    for (
      var B = {},
        z = O.substr(1, O.length - 3).split(":"),
        N = z[0],
        G = 1,
        H = z.length,
        W,
        q,
        j;
      G < H;
      G++
    )
      ((q = z[G]),
        (W = G !== H - 1 ? q.lastIndexOf(",") : q.length),
        (j = q.substr(0, W)),
        (B[N] = isNaN(j) ? j.replace(_quotesExp, "").trim() : +j),
        (N = q.substr(W + 1).trim()));
    return B;
  },
  _valueInParentheses = function (O) {
    var B = O.indexOf("(") + 1,
      z = O.indexOf(")"),
      N = O.indexOf("(", B);
    return O.substring(B, ~N && N < z ? O.indexOf(")", z + 1) : z);
  },
  _configEaseFromString = function (O) {
    var B = (O + "").split("("),
      z = _easeMap[B[0]];
    return z && B.length > 1 && z.config
      ? z.config.apply(
          null,
          ~O.indexOf("{")
            ? [_parseObjectInString(B[1])]
            : _valueInParentheses(O).split(",").map(_numericIfPossible),
        )
      : _easeMap._CE && _customEaseExp.test(O)
        ? _easeMap._CE("", O)
        : z;
  },
  _invertEase = function (O) {
    return function (B) {
      return 1 - O(1 - B);
    };
  },
  _propagateYoyoEase = function V(O, B) {
    for (var z = O._first, N; z; )
      (z instanceof Timeline
        ? V(z, B)
        : z.vars.yoyoEase &&
          (!z._yoyo || !z._repeat) &&
          z._yoyo !== B &&
          (z.timeline
            ? V(z.timeline, B)
            : ((N = z._ease),
              (z._ease = z._yEase),
              (z._yEase = N),
              (z._yoyo = B))),
        (z = z._next));
  },
  _parseEase = function (O, B) {
    return (
      (O && (_isFunction$1(O) ? O : _easeMap[O] || _configEaseFromString(O))) ||
      B
    );
  },
  _insertEase = function (O, B, z, N) {
    (z === void 0 &&
      (z = function (q) {
        return 1 - B(1 - q);
      }),
      N === void 0 &&
        (N = function (q) {
          return q < 0.5 ? B(q * 2) / 2 : 1 - B((1 - q) * 2) / 2;
        }));
    var G = { easeIn: B, easeOut: z, easeInOut: N },
      H;
    return (
      _forEachName(O, function (W) {
        ((_easeMap[W] = _globals[W] = G),
          (_easeMap[(H = W.toLowerCase())] = z));
        for (var q in G)
          _easeMap[
            H + (q === "easeIn" ? ".in" : q === "easeOut" ? ".out" : ".inOut")
          ] = _easeMap[W + "." + q] = G[q];
      }),
      G
    );
  },
  _easeInOutFromOut = function (O) {
    return function (B) {
      return B < 0.5 ? (1 - O(1 - B * 2)) / 2 : 0.5 + O((B - 0.5) * 2) / 2;
    };
  },
  _configElastic = function V(O, B, z) {
    var N = B >= 1 ? B : 1,
      G = (z || (O ? 0.3 : 0.45)) / (B < 1 ? B : 1),
      H = (G / _2PI) * (Math.asin(1 / N) || 0),
      W = function (Y) {
        return Y === 1 ? 1 : N * Math.pow(2, -10 * Y) * _sin((Y - H) * G) + 1;
      },
      q =
        O === "out"
          ? W
          : O === "in"
            ? function (j) {
                return 1 - W(1 - j);
              }
            : _easeInOutFromOut(W);
    return (
      (G = _2PI / G),
      (q.config = function (j, Y) {
        return V(O, j, Y);
      }),
      q
    );
  },
  _configBack = function V(O, B) {
    B === void 0 && (B = 1.70158);
    var z = function (H) {
        return H ? --H * H * ((B + 1) * H + B) + 1 : 0;
      },
      N =
        O === "out"
          ? z
          : O === "in"
            ? function (G) {
                return 1 - z(1 - G);
              }
            : _easeInOutFromOut(z);
    return (
      (N.config = function (G) {
        return V(O, G);
      }),
      N
    );
  };
_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (V, O) {
  var B = O < 5 ? O + 1 : O;
  _insertEase(
    V + ",Power" + (B - 1),
    O
      ? function (z) {
          return Math.pow(z, B);
        }
      : function (z) {
          return z;
        },
    function (z) {
      return 1 - Math.pow(1 - z, B);
    },
    function (z) {
      return z < 0.5
        ? Math.pow(z * 2, B) / 2
        : 1 - Math.pow((1 - z) * 2, B) / 2;
    },
  );
});
_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
_insertEase(
  "Elastic",
  _configElastic("in"),
  _configElastic("out"),
  _configElastic(),
);
(function (V, O) {
  var B = 1 / O,
    z = 2 * B,
    N = 2.5 * B,
    G = function (W) {
      return W < B
        ? V * W * W
        : W < z
          ? V * Math.pow(W - 1.5 / O, 2) + 0.75
          : W < N
            ? V * (W -= 2.25 / O) * W + 0.9375
            : V * Math.pow(W - 2.625 / O, 2) + 0.984375;
    };
  _insertEase(
    "Bounce",
    function (H) {
      return 1 - G(1 - H);
    },
    G,
  );
})(7.5625, 2.75);
_insertEase("Expo", function (V) {
  return V ? Math.pow(2, 10 * (V - 1)) : 0;
});
_insertEase("Circ", function (V) {
  return -(_sqrt(1 - V * V) - 1);
});
_insertEase("Sine", function (V) {
  return V === 1 ? 1 : -_cos(V * _HALF_PI) + 1;
});
_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
_easeMap.SteppedEase =
  _easeMap.steps =
  _globals.SteppedEase =
    {
      config: function (O, B) {
        O === void 0 && (O = 1);
        var z = 1 / O,
          N = O + (B ? 0 : 1),
          G = B ? 1 : 0,
          H = 1 - _tinyNum;
        return function (W) {
          return (((N * _clamp$1(0, H, W)) | 0) + G) * z;
        };
      },
    };
_defaults$1.ease = _easeMap["quad.out"];
_forEachName(
  "onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",
  function (V) {
    return (_callbackNames += V + "," + V + "Params,");
  },
);
var GSCache = function (O, B) {
    ((this.id = _gsID++),
      (O._gsap = this),
      (this.target = O),
      (this.harness = B),
      (this.get = B ? B.get : _getProperty),
      (this.set = B ? B.getSetter : _getSetter));
  },
  Animation = (function () {
    function V(B) {
      ((this.vars = B),
        (this._delay = +B.delay || 0),
        (this._repeat = B.repeat === 1 / 0 ? -2 : B.repeat || 0) &&
          ((this._rDelay = B.repeatDelay || 0),
          (this._yoyo = !!B.yoyo || !!B.yoyoEase)),
        (this._ts = 1),
        _setDuration(this, +B.duration, 1, 1),
        (this.data = B.data),
        _context$2 && ((this._ctx = _context$2), _context$2.data.push(this)),
        _tickerActive || _ticker.wake());
    }
    var O = V.prototype;
    return (
      (O.delay = function (z) {
        return z || z === 0
          ? (this.parent &&
              this.parent.smoothChildTiming &&
              this.startTime(this._start + z - this._delay),
            (this._delay = z),
            this)
          : this._delay;
      }),
      (O.duration = function (z) {
        return arguments.length
          ? this.totalDuration(
              this._repeat > 0 ? z + (z + this._rDelay) * this._repeat : z,
            )
          : this.totalDuration() && this._dur;
      }),
      (O.totalDuration = function (z) {
        return arguments.length
          ? ((this._dirty = 0),
            _setDuration(
              this,
              this._repeat < 0
                ? z
                : (z - this._repeat * this._rDelay) / (this._repeat + 1),
            ))
          : this._tDur;
      }),
      (O.totalTime = function (z, N) {
        if ((_wake(), !arguments.length)) return this._tTime;
        var G = this._dp;
        if (G && G.smoothChildTiming && this._ts) {
          for (
            _alignPlayhead(this, z),
              !G._dp || G.parent || _postAddChecks(G, this);
            G && G.parent;
          )
            (G.parent._time !==
              G._start +
                (G._ts >= 0
                  ? G._tTime / G._ts
                  : (G.totalDuration() - G._tTime) / -G._ts) &&
              G.totalTime(G._tTime, !0),
              (G = G.parent));
          !this.parent &&
            this._dp.autoRemoveChildren &&
            ((this._ts > 0 && z < this._tDur) ||
              (this._ts < 0 && z > 0) ||
              (!this._tDur && !z)) &&
            _addToTimeline(this._dp, this, this._start - this._delay);
        }
        return (
          (this._tTime !== z ||
            (!this._dur && !N) ||
            (this._initted && Math.abs(this._zTime) === _tinyNum) ||
            (!z && !this._initted && (this.add || this._ptLookup))) &&
            (this._ts || (this._pTime = z), _lazySafeRender(this, z, N)),
          this
        );
      }),
      (O.time = function (z, N) {
        return arguments.length
          ? this.totalTime(
              Math.min(this.totalDuration(), z + _elapsedCycleDuration(this)) %
                (this._dur + this._rDelay) || (z ? this._dur : 0),
              N,
            )
          : this._time;
      }),
      (O.totalProgress = function (z, N) {
        return arguments.length
          ? this.totalTime(this.totalDuration() * z, N)
          : this.totalDuration()
            ? Math.min(1, this._tTime / this._tDur)
            : this.rawTime() > 0
              ? 1
              : 0;
      }),
      (O.progress = function (z, N) {
        return arguments.length
          ? this.totalTime(
              this.duration() *
                (this._yoyo && !(this.iteration() & 1) ? 1 - z : z) +
                _elapsedCycleDuration(this),
              N,
            )
          : this.duration()
            ? Math.min(1, this._time / this._dur)
            : this.rawTime() > 0
              ? 1
              : 0;
      }),
      (O.iteration = function (z, N) {
        var G = this.duration() + this._rDelay;
        return arguments.length
          ? this.totalTime(this._time + (z - 1) * G, N)
          : this._repeat
            ? _animationCycle(this._tTime, G) + 1
            : 1;
      }),
      (O.timeScale = function (z, N) {
        if (!arguments.length) return this._rts === -_tinyNum ? 0 : this._rts;
        if (this._rts === z) return this;
        var G =
          this.parent && this._ts
            ? _parentToChildTotalTime(this.parent._time, this)
            : this._tTime;
        return (
          (this._rts = +z || 0),
          (this._ts = this._ps || z === -_tinyNum ? 0 : this._rts),
          this.totalTime(
            _clamp$1(-Math.abs(this._delay), this._tDur, G),
            N !== !1,
          ),
          _setEnd(this),
          _recacheAncestors(this)
        );
      }),
      (O.paused = function (z) {
        return arguments.length
          ? (this._ps !== z &&
              ((this._ps = z),
              z
                ? ((this._pTime =
                    this._tTime || Math.max(-this._delay, this.rawTime())),
                  (this._ts = this._act = 0))
                : (_wake(),
                  (this._ts = this._rts),
                  this.totalTime(
                    this.parent && !this.parent.smoothChildTiming
                      ? this.rawTime()
                      : this._tTime || this._pTime,
                    this.progress() === 1 &&
                      Math.abs(this._zTime) !== _tinyNum &&
                      (this._tTime -= _tinyNum),
                  ))),
            this)
          : this._ps;
      }),
      (O.startTime = function (z) {
        if (arguments.length) {
          this._start = z;
          var N = this.parent || this._dp;
          return (
            N &&
              (N._sort || !this.parent) &&
              _addToTimeline(N, this, z - this._delay),
            this
          );
        }
        return this._start;
      }),
      (O.endTime = function (z) {
        return (
          this._start +
          (_isNotFalse(z) ? this.totalDuration() : this.duration()) /
            Math.abs(this._ts || 1)
        );
      }),
      (O.rawTime = function (z) {
        var N = this.parent || this._dp;
        return N
          ? z &&
            (!this._ts ||
              (this._repeat && this._time && this.totalProgress() < 1))
            ? this._tTime % (this._dur + this._rDelay)
            : this._ts
              ? _parentToChildTotalTime(N.rawTime(z), this)
              : this._tTime
          : this._tTime;
      }),
      (O.revert = function (z) {
        z === void 0 && (z = _revertConfig);
        var N = _reverting$1;
        return (
          (_reverting$1 = z),
          (this._initted || this._startAt) &&
            (this.timeline && this.timeline.revert(z),
            this.totalTime(-0.01, z.suppressEvents)),
          this.data !== "nested" && z.kill !== !1 && this.kill(),
          (_reverting$1 = N),
          this
        );
      }),
      (O.globalTime = function (z) {
        for (var N = this, G = arguments.length ? z : N.rawTime(); N; )
          ((G = N._start + G / (Math.abs(N._ts) || 1)), (N = N._dp));
        return !this.parent && this._sat ? this._sat.globalTime(z) : G;
      }),
      (O.repeat = function (z) {
        return arguments.length
          ? ((this._repeat = z === 1 / 0 ? -2 : z),
            _onUpdateTotalDuration(this))
          : this._repeat === -2
            ? 1 / 0
            : this._repeat;
      }),
      (O.repeatDelay = function (z) {
        if (arguments.length) {
          var N = this._time;
          return (
            (this._rDelay = z),
            _onUpdateTotalDuration(this),
            N ? this.time(N) : this
          );
        }
        return this._rDelay;
      }),
      (O.yoyo = function (z) {
        return arguments.length ? ((this._yoyo = z), this) : this._yoyo;
      }),
      (O.seek = function (z, N) {
        return this.totalTime(_parsePosition$1(this, z), _isNotFalse(N));
      }),
      (O.restart = function (z, N) {
        return this.play().totalTime(z ? -this._delay : 0, _isNotFalse(N));
      }),
      (O.play = function (z, N) {
        return (z != null && this.seek(z, N), this.reversed(!1).paused(!1));
      }),
      (O.reverse = function (z, N) {
        return (
          z != null && this.seek(z || this.totalDuration(), N),
          this.reversed(!0).paused(!1)
        );
      }),
      (O.pause = function (z, N) {
        return (z != null && this.seek(z, N), this.paused(!0));
      }),
      (O.resume = function () {
        return this.paused(!1);
      }),
      (O.reversed = function (z) {
        return arguments.length
          ? (!!z !== this.reversed() &&
              this.timeScale(-this._rts || (z ? -_tinyNum : 0)),
            this)
          : this._rts < 0;
      }),
      (O.invalidate = function () {
        return (
          (this._initted = this._act = 0),
          (this._zTime = -_tinyNum),
          this
        );
      }),
      (O.isActive = function () {
        var z = this.parent || this._dp,
          N = this._start,
          G;
        return !!(
          !z ||
          (this._ts &&
            this._initted &&
            z.isActive() &&
            (G = z.rawTime(!0)) >= N &&
            G < this.endTime(!0) - _tinyNum)
        );
      }),
      (O.eventCallback = function (z, N, G) {
        var H = this.vars;
        return arguments.length > 1
          ? (N
              ? ((H[z] = N),
                G && (H[z + "Params"] = G),
                z === "onUpdate" && (this._onUpdate = N))
              : delete H[z],
            this)
          : H[z];
      }),
      (O.then = function (z) {
        var N = this;
        return new Promise(function (G) {
          var H = _isFunction$1(z) ? z : _passThrough$1,
            W = function () {
              var j = N.then;
              ((N.then = null),
                _isFunction$1(H) &&
                  (H = H(N)) &&
                  (H.then || H === N) &&
                  (N.then = j),
                G(H),
                (N.then = j));
            };
          (N._initted && N.totalProgress() === 1 && N._ts >= 0) ||
          (!N._tTime && N._ts < 0)
            ? W()
            : (N._prom = W);
        });
      }),
      (O.kill = function () {
        _interrupt(this);
      }),
      V
    );
  })();
_setDefaults$1(Animation.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: !1,
  parent: null,
  _initted: !1,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -_tinyNum,
  _prom: 0,
  _ps: !1,
  _rts: 1,
});
var Timeline = (function (V) {
  _inheritsLoose(O, V);
  function O(z, N) {
    var G;
    return (
      z === void 0 && (z = {}),
      (G = V.call(this, z) || this),
      (G.labels = {}),
      (G.smoothChildTiming = !!z.smoothChildTiming),
      (G.autoRemoveChildren = !!z.autoRemoveChildren),
      (G._sort = _isNotFalse(z.sortChildren)),
      _globalTimeline &&
        _addToTimeline(
          z.parent || _globalTimeline,
          _assertThisInitialized(G),
          N,
        ),
      z.reversed && G.reverse(),
      z.paused && G.paused(!0),
      z.scrollTrigger &&
        _scrollTrigger(_assertThisInitialized(G), z.scrollTrigger),
      G
    );
  }
  var B = O.prototype;
  return (
    (B.to = function (N, G, H) {
      return (_createTweenType(0, arguments, this), this);
    }),
    (B.from = function (N, G, H) {
      return (_createTweenType(1, arguments, this), this);
    }),
    (B.fromTo = function (N, G, H, W) {
      return (_createTweenType(2, arguments, this), this);
    }),
    (B.set = function (N, G, H) {
      return (
        (G.duration = 0),
        (G.parent = this),
        _inheritDefaults(G).repeatDelay || (G.repeat = 0),
        (G.immediateRender = !!G.immediateRender),
        new Tween(N, G, _parsePosition$1(this, H), 1),
        this
      );
    }),
    (B.call = function (N, G, H) {
      return _addToTimeline(this, Tween.delayedCall(0, N, G), H);
    }),
    (B.staggerTo = function (N, G, H, W, q, j, Y) {
      return (
        (H.duration = G),
        (H.stagger = H.stagger || W),
        (H.onComplete = j),
        (H.onCompleteParams = Y),
        (H.parent = this),
        new Tween(N, H, _parsePosition$1(this, q)),
        this
      );
    }),
    (B.staggerFrom = function (N, G, H, W, q, j, Y) {
      return (
        (H.runBackwards = 1),
        (_inheritDefaults(H).immediateRender = _isNotFalse(H.immediateRender)),
        this.staggerTo(N, G, H, W, q, j, Y)
      );
    }),
    (B.staggerFromTo = function (N, G, H, W, q, j, Y, re) {
      return (
        (W.startAt = H),
        (_inheritDefaults(W).immediateRender = _isNotFalse(W.immediateRender)),
        this.staggerTo(N, G, W, q, j, Y, re)
      );
    }),
    (B.render = function (N, G, H) {
      var W = this._time,
        q = this._dirty ? this.totalDuration() : this._tDur,
        j = this._dur,
        Y = N <= 0 ? 0 : _roundPrecise(N),
        re = this._zTime < 0 != N < 0 && (this._initted || !j),
        U,
        K,
        Z,
        X,
        se,
        Q,
        te,
        J,
        ee,
        ne,
        oe,
        he;
      if (
        (this !== _globalTimeline && Y > q && N >= 0 && (Y = q),
        Y !== this._tTime || H || re)
      ) {
        if (
          (W !== this._time &&
            j &&
            ((Y += this._time - W), (N += this._time - W)),
          (U = Y),
          (ee = this._start),
          (J = this._ts),
          (Q = !J),
          re && (j || (W = this._zTime), (N || !G) && (this._zTime = N)),
          this._repeat)
        ) {
          if (
            ((oe = this._yoyo),
            (se = j + this._rDelay),
            this._repeat < -1 && N < 0)
          )
            return this.totalTime(se * 100 + N, G, H);
          if (
            ((U = _roundPrecise(Y % se)),
            Y === q
              ? ((X = this._repeat), (U = j))
              : ((X = ~~(Y / se)),
                X && X === Y / se && ((U = j), X--),
                U > j && (U = j)),
            (ne = _animationCycle(this._tTime, se)),
            !W &&
              this._tTime &&
              ne !== X &&
              this._tTime - ne * se - this._dur <= 0 &&
              (ne = X),
            oe && X & 1 && ((U = j - U), (he = 1)),
            X !== ne && !this._lock)
          ) {
            var ce = oe && ne & 1,
              ue = ce === (oe && X & 1);
            if (
              (X < ne && (ce = !ce),
              (W = ce ? 0 : Y % j ? j : Y),
              (this._lock = 1),
              (this.render(W || (he ? 0 : _roundPrecise(X * se)), G, !j)._lock =
                0),
              (this._tTime = Y),
              !G && this.parent && _callback$1(this, "onRepeat"),
              this.vars.repeatRefresh && !he && (this.invalidate()._lock = 1),
              (W && W !== this._time) ||
                Q !== !this._ts ||
                (this.vars.onRepeat && !this.parent && !this._act))
            )
              return this;
            if (
              ((j = this._dur),
              (q = this._tDur),
              ue &&
                ((this._lock = 2),
                (W = ce ? j : -1e-4),
                this.render(W, !0),
                this.vars.repeatRefresh && !he && this.invalidate()),
              (this._lock = 0),
              !this._ts && !Q)
            )
              return this;
            _propagateYoyoEase(this, he);
          }
        }
        if (
          (this._hasPause &&
            !this._forcing &&
            this._lock < 2 &&
            ((te = _findNextPauseTween(
              this,
              _roundPrecise(W),
              _roundPrecise(U),
            )),
            te && (Y -= U - (U = te._start))),
          (this._tTime = Y),
          (this._time = U),
          (this._act = !J),
          this._initted ||
            ((this._onUpdate = this.vars.onUpdate),
            (this._initted = 1),
            (this._zTime = N),
            (W = 0)),
          !W &&
            U &&
            !G &&
            !X &&
            (_callback$1(this, "onStart"), this._tTime !== Y))
        )
          return this;
        if (U >= W && N >= 0)
          for (K = this._first; K; ) {
            if (
              ((Z = K._next), (K._act || U >= K._start) && K._ts && te !== K)
            ) {
              if (K.parent !== this) return this.render(N, G, H);
              if (
                (K.render(
                  K._ts > 0
                    ? (U - K._start) * K._ts
                    : (K._dirty ? K.totalDuration() : K._tDur) +
                        (U - K._start) * K._ts,
                  G,
                  H,
                ),
                U !== this._time || (!this._ts && !Q))
              ) {
                ((te = 0), Z && (Y += this._zTime = -_tinyNum));
                break;
              }
            }
            K = Z;
          }
        else {
          K = this._last;
          for (var ge = N < 0 ? N : U; K; ) {
            if (
              ((Z = K._prev), (K._act || ge <= K._end) && K._ts && te !== K)
            ) {
              if (K.parent !== this) return this.render(N, G, H);
              if (
                (K.render(
                  K._ts > 0
                    ? (ge - K._start) * K._ts
                    : (K._dirty ? K.totalDuration() : K._tDur) +
                        (ge - K._start) * K._ts,
                  G,
                  H || (_reverting$1 && (K._initted || K._startAt)),
                ),
                U !== this._time || (!this._ts && !Q))
              ) {
                ((te = 0), Z && (Y += this._zTime = ge ? -_tinyNum : _tinyNum));
                break;
              }
            }
            K = Z;
          }
        }
        if (
          te &&
          !G &&
          (this.pause(),
          (te.render(U >= W ? 0 : -_tinyNum)._zTime = U >= W ? 1 : -1),
          this._ts)
        )
          return ((this._start = ee), _setEnd(this), this.render(N, G, H));
        (this._onUpdate && !G && _callback$1(this, "onUpdate", !0),
          ((Y === q && this._tTime >= this.totalDuration()) || (!Y && W)) &&
            (ee === this._start || Math.abs(J) !== Math.abs(this._ts)) &&
            (this._lock ||
              ((N || !j) &&
                ((Y === q && this._ts > 0) || (!Y && this._ts < 0)) &&
                _removeFromParent(this, 1),
              !G &&
                !(N < 0 && !W) &&
                (Y || W || !q) &&
                (_callback$1(
                  this,
                  Y === q && N >= 0 ? "onComplete" : "onReverseComplete",
                  !0,
                ),
                this._prom &&
                  !(Y < q && this.timeScale() > 0) &&
                  this._prom()))));
      }
      return this;
    }),
    (B.add = function (N, G) {
      var H = this;
      if (
        (_isNumber$1(G) || (G = _parsePosition$1(this, G, N)),
        !(N instanceof Animation))
      ) {
        if (_isArray(N))
          return (
            N.forEach(function (W) {
              return H.add(W, G);
            }),
            this
          );
        if (_isString$1(N)) return this.addLabel(N, G);
        if (_isFunction$1(N)) N = Tween.delayedCall(0, N);
        else return this;
      }
      return this !== N ? _addToTimeline(this, N, G) : this;
    }),
    (B.getChildren = function (N, G, H, W) {
      (N === void 0 && (N = !0),
        G === void 0 && (G = !0),
        H === void 0 && (H = !0),
        W === void 0 && (W = -_bigNum$1));
      for (var q = [], j = this._first; j; )
        (j._start >= W &&
          (j instanceof Tween
            ? G && q.push(j)
            : (H && q.push(j), N && q.push.apply(q, j.getChildren(!0, G, H)))),
          (j = j._next));
      return q;
    }),
    (B.getById = function (N) {
      for (var G = this.getChildren(1, 1, 1), H = G.length; H--; )
        if (G[H].vars.id === N) return G[H];
    }),
    (B.remove = function (N) {
      return _isString$1(N)
        ? this.removeLabel(N)
        : _isFunction$1(N)
          ? this.killTweensOf(N)
          : (_removeLinkedListItem(this, N),
            N === this._recent && (this._recent = this._last),
            _uncache(this));
    }),
    (B.totalTime = function (N, G) {
      return arguments.length
        ? ((this._forcing = 1),
          !this._dp &&
            this._ts &&
            (this._start = _roundPrecise(
              _ticker.time -
                (this._ts > 0
                  ? N / this._ts
                  : (this.totalDuration() - N) / -this._ts),
            )),
          V.prototype.totalTime.call(this, N, G),
          (this._forcing = 0),
          this)
        : this._tTime;
    }),
    (B.addLabel = function (N, G) {
      return ((this.labels[N] = _parsePosition$1(this, G)), this);
    }),
    (B.removeLabel = function (N) {
      return (delete this.labels[N], this);
    }),
    (B.addPause = function (N, G, H) {
      var W = Tween.delayedCall(0, G || _emptyFunc, H);
      return (
        (W.data = "isPause"),
        (this._hasPause = 1),
        _addToTimeline(this, W, _parsePosition$1(this, N))
      );
    }),
    (B.removePause = function (N) {
      var G = this._first;
      for (N = _parsePosition$1(this, N); G; )
        (G._start === N && G.data === "isPause" && _removeFromParent(G),
          (G = G._next));
    }),
    (B.killTweensOf = function (N, G, H) {
      for (var W = this.getTweensOf(N, H), q = W.length; q--; )
        _overwritingTween !== W[q] && W[q].kill(N, G);
      return this;
    }),
    (B.getTweensOf = function (N, G) {
      for (
        var H = [], W = toArray(N), q = this._first, j = _isNumber$1(G), Y;
        q;
      )
        (q instanceof Tween
          ? _arrayContainsAny(q._targets, W) &&
            (j
              ? (!_overwritingTween || (q._initted && q._ts)) &&
                q.globalTime(0) <= G &&
                q.globalTime(q.totalDuration()) > G
              : !G || q.isActive()) &&
            H.push(q)
          : (Y = q.getTweensOf(W, G)).length && H.push.apply(H, Y),
          (q = q._next));
      return H;
    }),
    (B.tweenTo = function (N, G) {
      G = G || {};
      var H = this,
        W = _parsePosition$1(H, N),
        q = G,
        j = q.startAt,
        Y = q.onStart,
        re = q.onStartParams,
        U = q.immediateRender,
        K,
        Z = Tween.to(
          H,
          _setDefaults$1(
            {
              ease: G.ease || "none",
              lazy: !1,
              immediateRender: !1,
              time: W,
              overwrite: "auto",
              duration:
                G.duration ||
                Math.abs(
                  (W - (j && "time" in j ? j.time : H._time)) / H.timeScale(),
                ) ||
                _tinyNum,
              onStart: function () {
                if ((H.pause(), !K)) {
                  var se =
                    G.duration ||
                    Math.abs(
                      (W - (j && "time" in j ? j.time : H._time)) /
                        H.timeScale(),
                    );
                  (Z._dur !== se &&
                    _setDuration(Z, se, 0, 1).render(Z._time, !0, !0),
                    (K = 1));
                }
                Y && Y.apply(Z, re || []);
              },
            },
            G,
          ),
        );
      return U ? Z.render(0) : Z;
    }),
    (B.tweenFromTo = function (N, G, H) {
      return this.tweenTo(
        G,
        _setDefaults$1({ startAt: { time: _parsePosition$1(this, N) } }, H),
      );
    }),
    (B.recent = function () {
      return this._recent;
    }),
    (B.nextLabel = function (N) {
      return (
        N === void 0 && (N = this._time),
        _getLabelInDirection(this, _parsePosition$1(this, N))
      );
    }),
    (B.previousLabel = function (N) {
      return (
        N === void 0 && (N = this._time),
        _getLabelInDirection(this, _parsePosition$1(this, N), 1)
      );
    }),
    (B.currentLabel = function (N) {
      return arguments.length
        ? this.seek(N, !0)
        : this.previousLabel(this._time + _tinyNum);
    }),
    (B.shiftChildren = function (N, G, H) {
      H === void 0 && (H = 0);
      for (var W = this._first, q = this.labels, j; W; )
        (W._start >= H && ((W._start += N), (W._end += N)), (W = W._next));
      if (G) for (j in q) q[j] >= H && (q[j] += N);
      return _uncache(this);
    }),
    (B.invalidate = function (N) {
      var G = this._first;
      for (this._lock = 0; G; ) (G.invalidate(N), (G = G._next));
      return V.prototype.invalidate.call(this, N);
    }),
    (B.clear = function (N) {
      N === void 0 && (N = !0);
      for (var G = this._first, H; G; )
        ((H = G._next), this.remove(G), (G = H));
      return (
        this._dp && (this._time = this._tTime = this._pTime = 0),
        N && (this.labels = {}),
        _uncache(this)
      );
    }),
    (B.totalDuration = function (N) {
      var G = 0,
        H = this,
        W = H._last,
        q = _bigNum$1,
        j,
        Y,
        re;
      if (arguments.length)
        return H.timeScale(
          (H._repeat < 0 ? H.duration() : H.totalDuration()) /
            (H.reversed() ? -N : N),
        );
      if (H._dirty) {
        for (re = H.parent; W; )
          ((j = W._prev),
            W._dirty && W.totalDuration(),
            (Y = W._start),
            Y > q && H._sort && W._ts && !H._lock
              ? ((H._lock = 1),
                (_addToTimeline(H, W, Y - W._delay, 1)._lock = 0))
              : (q = Y),
            Y < 0 &&
              W._ts &&
              ((G -= Y),
              ((!re && !H._dp) || (re && re.smoothChildTiming)) &&
                ((H._start += Y / H._ts), (H._time -= Y), (H._tTime -= Y)),
              H.shiftChildren(-Y, !1, -1 / 0),
              (q = 0)),
            W._end > G && W._ts && (G = W._end),
            (W = j));
        (_setDuration(
          H,
          H === _globalTimeline && H._time > G ? H._time : G,
          1,
          1,
        ),
          (H._dirty = 0));
      }
      return H._tDur;
    }),
    (O.updateRoot = function (N) {
      if (
        (_globalTimeline._ts &&
          (_lazySafeRender(
            _globalTimeline,
            _parentToChildTotalTime(N, _globalTimeline),
          ),
          (_lastRenderedFrame = _ticker.frame)),
        _ticker.frame >= _nextGCFrame)
      ) {
        _nextGCFrame += _config.autoSleep || 120;
        var G = _globalTimeline._first;
        if (
          (!G || !G._ts) &&
          _config.autoSleep &&
          _ticker._listeners.length < 2
        ) {
          for (; G && !G._ts; ) G = G._next;
          G || _ticker.sleep();
        }
      }
    }),
    O
  );
})(Animation);
_setDefaults$1(Timeline.prototype, { _lock: 0, _hasPause: 0, _forcing: 0 });
var _addComplexStringPropTween = function (O, B, z, N, G, H, W) {
    var q = new PropTween(this._pt, O, B, 0, 1, _renderComplexString, null, G),
      j = 0,
      Y = 0,
      re,
      U,
      K,
      Z,
      X,
      se,
      Q,
      te;
    for (
      q.b = z,
        q.e = N,
        z += "",
        N += "",
        (Q = ~N.indexOf("random(")) && (N = _replaceRandom(N)),
        H && ((te = [z, N]), H(te, O, B), (z = te[0]), (N = te[1])),
        U = z.match(_complexStringNumExp) || [];
      (re = _complexStringNumExp.exec(N));
    )
      ((Z = re[0]),
        (X = N.substring(j, re.index)),
        K ? (K = (K + 1) % 5) : X.substr(-5) === "rgba(" && (K = 1),
        Z !== U[Y++] &&
          ((se = parseFloat(U[Y - 1]) || 0),
          (q._pt = {
            _next: q._pt,
            p: X || Y === 1 ? X : ",",
            s: se,
            c:
              Z.charAt(1) === "="
                ? _parseRelative(se, Z) - se
                : parseFloat(Z) - se,
            m: K && K < 4 ? Math.round : 0,
          }),
          (j = _complexStringNumExp.lastIndex)));
    return (
      (q.c = j < N.length ? N.substring(j, N.length) : ""),
      (q.fp = W),
      (_relExp.test(N) || Q) && (q.e = 0),
      (this._pt = q),
      q
    );
  },
  _addPropTween = function (O, B, z, N, G, H, W, q, j, Y) {
    _isFunction$1(N) && (N = N(G || 0, O, H));
    var re = O[B],
      U =
        z !== "get"
          ? z
          : _isFunction$1(re)
            ? j
              ? O[
                  B.indexOf("set") || !_isFunction$1(O["get" + B.substr(3)])
                    ? B
                    : "get" + B.substr(3)
                ](j)
              : O[B]()
            : re,
      K = _isFunction$1(re)
        ? j
          ? _setterFuncWithParam
          : _setterFunc
        : _setterPlain,
      Z;
    if (
      (_isString$1(N) &&
        (~N.indexOf("random(") && (N = _replaceRandom(N)),
        N.charAt(1) === "=" &&
          ((Z = _parseRelative(U, N) + (getUnit(U) || 0)),
          (Z || Z === 0) && (N = Z))),
      !Y || U !== N || _forceAllPropTweens)
    )
      return !isNaN(U * N) && N !== ""
        ? ((Z = new PropTween(
            this._pt,
            O,
            B,
            +U || 0,
            N - (U || 0),
            typeof re == "boolean" ? _renderBoolean : _renderPlain,
            0,
            K,
          )),
          j && (Z.fp = j),
          W && Z.modifier(W, this, O),
          (this._pt = Z))
        : (!re && !(B in O) && _missingPlugin(B, N),
          _addComplexStringPropTween.call(
            this,
            O,
            B,
            U,
            N,
            K,
            q || _config.stringFilter,
            j,
          ));
  },
  _processVars = function (O, B, z, N, G) {
    if (
      (_isFunction$1(O) && (O = _parseFuncOrString(O, G, B, z, N)),
      !_isObject$1(O) ||
        (O.style && O.nodeType) ||
        _isArray(O) ||
        _isTypedArray(O))
    )
      return _isString$1(O) ? _parseFuncOrString(O, G, B, z, N) : O;
    var H = {},
      W;
    for (W in O) H[W] = _parseFuncOrString(O[W], G, B, z, N);
    return H;
  },
  _checkPlugin = function (O, B, z, N, G, H) {
    var W, q, j, Y;
    if (
      _plugins[O] &&
      (W = new _plugins[O]()).init(
        G,
        W.rawVars ? B[O] : _processVars(B[O], N, G, H, z),
        z,
        N,
        H,
      ) !== !1 &&
      ((z._pt = q =
        new PropTween(z._pt, G, O, 0, 1, W.render, W, 0, W.priority)),
      z !== _quickTween)
    )
      for (j = z._ptLookup[z._targets.indexOf(G)], Y = W._props.length; Y--; )
        j[W._props[Y]] = q;
    return W;
  },
  _overwritingTween,
  _forceAllPropTweens,
  _initTween = function V(O, B, z) {
    var N = O.vars,
      G = N.ease,
      H = N.startAt,
      W = N.immediateRender,
      q = N.lazy,
      j = N.onUpdate,
      Y = N.runBackwards,
      re = N.yoyoEase,
      U = N.keyframes,
      K = N.autoRevert,
      Z = O._dur,
      X = O._startAt,
      se = O._targets,
      Q = O.parent,
      te = Q && Q.data === "nested" ? Q.vars.targets : se,
      J = O._overwrite === "auto" && !_suppressOverwrites$1,
      ee = O.timeline,
      ne,
      oe,
      he,
      ce,
      ue,
      ge,
      ye,
      me,
      be,
      Se,
      _e,
      le,
      pe;
    if (
      (ee && (!U || !G) && (G = "none"),
      (O._ease = _parseEase(G, _defaults$1.ease)),
      (O._yEase = re
        ? _invertEase(_parseEase(re === !0 ? G : re, _defaults$1.ease))
        : 0),
      re &&
        O._yoyo &&
        !O._repeat &&
        ((re = O._yEase), (O._yEase = O._ease), (O._ease = re)),
      (O._from = !ee && !!N.runBackwards),
      !ee || (U && !N.stagger))
    ) {
      if (
        ((me = se[0] ? _getCache(se[0]).harness : 0),
        (le = me && N[me.prop]),
        (ne = _copyExcluding(N, _reservedProps)),
        X &&
          (X._zTime < 0 && X.progress(1),
          B < 0 && Y && W && !K
            ? X.render(-1, !0)
            : X.revert(Y && Z ? _revertConfigNoKill : _startAtRevertConfig),
          (X._lazy = 0)),
        H)
      ) {
        if (
          (_removeFromParent(
            (O._startAt = Tween.set(
              se,
              _setDefaults$1(
                {
                  data: "isStart",
                  overwrite: !1,
                  parent: Q,
                  immediateRender: !0,
                  lazy: !X && _isNotFalse(q),
                  startAt: null,
                  delay: 0,
                  onUpdate:
                    j &&
                    function () {
                      return _callback$1(O, "onUpdate");
                    },
                  stagger: 0,
                },
                H,
              ),
            )),
          ),
          (O._startAt._dp = 0),
          (O._startAt._sat = O),
          B < 0 &&
            (_reverting$1 || (!W && !K)) &&
            O._startAt.revert(_revertConfigNoKill),
          W && Z && B <= 0 && z <= 0)
        ) {
          B && (O._zTime = B);
          return;
        }
      } else if (Y && Z && !X) {
        if (
          (B && (W = !1),
          (he = _setDefaults$1(
            {
              overwrite: !1,
              data: "isFromStart",
              lazy: W && !X && _isNotFalse(q),
              immediateRender: W,
              stagger: 0,
              parent: Q,
            },
            ne,
          )),
          le && (he[me.prop] = le),
          _removeFromParent((O._startAt = Tween.set(se, he))),
          (O._startAt._dp = 0),
          (O._startAt._sat = O),
          B < 0 &&
            (_reverting$1
              ? O._startAt.revert(_revertConfigNoKill)
              : O._startAt.render(-1, !0)),
          (O._zTime = B),
          !W)
        )
          V(O._startAt, _tinyNum, _tinyNum);
        else if (!B) return;
      }
      for (
        O._pt = O._ptCache = 0, q = (Z && _isNotFalse(q)) || (q && !Z), oe = 0;
        oe < se.length;
        oe++
      ) {
        if (
          ((ue = se[oe]),
          (ye = ue._gsap || _harness(se)[oe]._gsap),
          (O._ptLookup[oe] = Se = {}),
          _lazyLookup[ye.id] && _lazyTweens.length && _lazyRender(),
          (_e = te === se ? oe : te.indexOf(ue)),
          me &&
            (be = new me()).init(ue, le || ne, O, _e, te) !== !1 &&
            ((O._pt = ce =
              new PropTween(
                O._pt,
                ue,
                be.name,
                0,
                1,
                be.render,
                be,
                0,
                be.priority,
              )),
            be._props.forEach(function (ie) {
              Se[ie] = ce;
            }),
            be.priority && (ge = 1)),
          !me || le)
        )
          for (he in ne)
            _plugins[he] && (be = _checkPlugin(he, ne, O, _e, ue, te))
              ? be.priority && (ge = 1)
              : (Se[he] = ce =
                  _addPropTween.call(
                    O,
                    ue,
                    he,
                    "get",
                    ne[he],
                    _e,
                    te,
                    0,
                    N.stringFilter,
                  ));
        (O._op && O._op[oe] && O.kill(ue, O._op[oe]),
          J &&
            O._pt &&
            ((_overwritingTween = O),
            _globalTimeline.killTweensOf(ue, Se, O.globalTime(B)),
            (pe = !O.parent),
            (_overwritingTween = 0)),
          O._pt && q && (_lazyLookup[ye.id] = 1));
      }
      (ge && _sortPropTweensByPriority(O), O._onInit && O._onInit(O));
    }
    ((O._onUpdate = j),
      (O._initted = (!O._op || O._pt) && !pe),
      U && B <= 0 && ee.render(_bigNum$1, !0, !0));
  },
  _updatePropTweens = function (O, B, z, N, G, H, W, q) {
    var j = ((O._pt && O._ptCache) || (O._ptCache = {}))[B],
      Y,
      re,
      U,
      K;
    if (!j)
      for (
        j = O._ptCache[B] = [], U = O._ptLookup, K = O._targets.length;
        K--;
      ) {
        if (((Y = U[K][B]), Y && Y.d && Y.d._pt))
          for (Y = Y.d._pt; Y && Y.p !== B && Y.fp !== B; ) Y = Y._next;
        if (!Y)
          return (
            (_forceAllPropTweens = 1),
            (O.vars[B] = "+=0"),
            _initTween(O, W),
            (_forceAllPropTweens = 0),
            q ? _warn(B + " not eligible for reset") : 1
          );
        j.push(Y);
      }
    for (K = j.length; K--; )
      ((re = j[K]),
        (Y = re._pt || re),
        (Y.s = (N || N === 0) && !G ? N : Y.s + (N || 0) + H * Y.c),
        (Y.c = z - Y.s),
        re.e && (re.e = _round$1(z) + getUnit(re.e)),
        re.b && (re.b = Y.s + getUnit(re.b)));
  },
  _addAliasesToVars = function (O, B) {
    var z = O[0] ? _getCache(O[0]).harness : 0,
      N = z && z.aliases,
      G,
      H,
      W,
      q;
    if (!N) return B;
    G = _merge({}, B);
    for (H in N)
      if (H in G) for (q = N[H].split(","), W = q.length; W--; ) G[q[W]] = G[H];
    return G;
  },
  _parseKeyframe = function (O, B, z, N) {
    var G = B.ease || N || "power1.inOut",
      H,
      W;
    if (_isArray(B))
      ((W = z[O] || (z[O] = [])),
        B.forEach(function (q, j) {
          return W.push({ t: (j / (B.length - 1)) * 100, v: q, e: G });
        }));
    else
      for (H in B)
        ((W = z[H] || (z[H] = [])),
          H === "ease" || W.push({ t: parseFloat(O), v: B[H], e: G }));
  },
  _parseFuncOrString = function (O, B, z, N, G) {
    return _isFunction$1(O)
      ? O.call(B, z, N, G)
      : _isString$1(O) && ~O.indexOf("random(")
        ? _replaceRandom(O)
        : O;
  },
  _staggerTweenProps =
    _callbackNames +
    "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
  _staggerPropsToSkip = {};
_forEachName(
  _staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger",
  function (V) {
    return (_staggerPropsToSkip[V] = 1);
  },
);
var Tween = (function (V) {
  _inheritsLoose(O, V);
  function O(z, N, G, H) {
    var W;
    (typeof N == "number" && ((G.duration = N), (N = G), (G = null)),
      (W = V.call(this, H ? N : _inheritDefaults(N)) || this));
    var q = W.vars,
      j = q.duration,
      Y = q.delay,
      re = q.immediateRender,
      U = q.stagger,
      K = q.overwrite,
      Z = q.keyframes,
      X = q.defaults,
      se = q.scrollTrigger,
      Q = q.yoyoEase,
      te = N.parent || _globalTimeline,
      J = (_isArray(z) || _isTypedArray(z) ? _isNumber$1(z[0]) : "length" in N)
        ? [z]
        : toArray(z),
      ee,
      ne,
      oe,
      he,
      ce,
      ue,
      ge,
      ye;
    if (
      ((W._targets = J.length
        ? _harness(J)
        : _warn(
            "GSAP target " + z + " not found. https://gsap.com",
            !_config.nullTargetWarn,
          ) || []),
      (W._ptLookup = []),
      (W._overwrite = K),
      Z || U || _isFuncOrString(j) || _isFuncOrString(Y))
    ) {
      if (
        ((N = W.vars),
        (ee = W.timeline =
          new Timeline({
            data: "nested",
            defaults: X || {},
            targets: te && te.data === "nested" ? te.vars.targets : J,
          })),
        ee.kill(),
        (ee.parent = ee._dp = _assertThisInitialized(W)),
        (ee._start = 0),
        U || _isFuncOrString(j) || _isFuncOrString(Y))
      ) {
        if (((he = J.length), (ge = U && distribute(U)), _isObject$1(U)))
          for (ce in U)
            ~_staggerTweenProps.indexOf(ce) &&
              (ye || (ye = {}), (ye[ce] = U[ce]));
        for (ne = 0; ne < he; ne++)
          ((oe = _copyExcluding(N, _staggerPropsToSkip)),
            (oe.stagger = 0),
            Q && (oe.yoyoEase = Q),
            ye && _merge(oe, ye),
            (ue = J[ne]),
            (oe.duration = +_parseFuncOrString(
              j,
              _assertThisInitialized(W),
              ne,
              ue,
              J,
            )),
            (oe.delay =
              (+_parseFuncOrString(Y, _assertThisInitialized(W), ne, ue, J) ||
                0) - W._delay),
            !U &&
              he === 1 &&
              oe.delay &&
              ((W._delay = Y = oe.delay), (W._start += Y), (oe.delay = 0)),
            ee.to(ue, oe, ge ? ge(ne, ue, J) : 0),
            (ee._ease = _easeMap.none));
        ee.duration() ? (j = Y = 0) : (W.timeline = 0);
      } else if (Z) {
        (_inheritDefaults(_setDefaults$1(ee.vars.defaults, { ease: "none" })),
          (ee._ease = _parseEase(Z.ease || N.ease || "none")));
        var me = 0,
          be,
          Se,
          _e;
        if (_isArray(Z))
          (Z.forEach(function (le) {
            return ee.to(J, le, ">");
          }),
            ee.duration());
        else {
          oe = {};
          for (ce in Z)
            ce === "ease" ||
              ce === "easeEach" ||
              _parseKeyframe(ce, Z[ce], oe, Z.easeEach);
          for (ce in oe)
            for (
              be = oe[ce].sort(function (le, pe) {
                return le.t - pe.t;
              }),
                me = 0,
                ne = 0;
              ne < be.length;
              ne++
            )
              ((Se = be[ne]),
                (_e = {
                  ease: Se.e,
                  duration: ((Se.t - (ne ? be[ne - 1].t : 0)) / 100) * j,
                }),
                (_e[ce] = Se.v),
                ee.to(J, _e, me),
                (me += _e.duration));
          ee.duration() < j && ee.to({}, { duration: j - ee.duration() });
        }
      }
      j || W.duration((j = ee.duration()));
    } else W.timeline = 0;
    return (
      K === !0 &&
        !_suppressOverwrites$1 &&
        ((_overwritingTween = _assertThisInitialized(W)),
        _globalTimeline.killTweensOf(J),
        (_overwritingTween = 0)),
      _addToTimeline(te, _assertThisInitialized(W), G),
      N.reversed && W.reverse(),
      N.paused && W.paused(!0),
      (re ||
        (!j &&
          !Z &&
          W._start === _roundPrecise(te._time) &&
          _isNotFalse(re) &&
          _hasNoPausedAncestors(_assertThisInitialized(W)) &&
          te.data !== "nested")) &&
        ((W._tTime = -_tinyNum), W.render(Math.max(0, -Y) || 0)),
      se && _scrollTrigger(_assertThisInitialized(W), se),
      W
    );
  }
  var B = O.prototype;
  return (
    (B.render = function (N, G, H) {
      var W = this._time,
        q = this._tDur,
        j = this._dur,
        Y = N < 0,
        re = N > q - _tinyNum && !Y ? q : N < _tinyNum ? 0 : N,
        U,
        K,
        Z,
        X,
        se,
        Q,
        te,
        J,
        ee;
      if (!j) _renderZeroDurationTween(this, N, G, H);
      else if (
        re !== this._tTime ||
        !N ||
        H ||
        (!this._initted && this._tTime) ||
        (this._startAt && this._zTime < 0 !== Y)
      ) {
        if (((U = re), (J = this.timeline), this._repeat)) {
          if (((X = j + this._rDelay), this._repeat < -1 && Y))
            return this.totalTime(X * 100 + N, G, H);
          if (
            ((U = _roundPrecise(re % X)),
            re === q
              ? ((Z = this._repeat), (U = j))
              : ((Z = ~~(re / X)),
                Z && Z === _roundPrecise(re / X) && ((U = j), Z--),
                U > j && (U = j)),
            (Q = this._yoyo && Z & 1),
            Q && ((ee = this._yEase), (U = j - U)),
            (se = _animationCycle(this._tTime, X)),
            U === W && !H && this._initted && Z === se)
          )
            return ((this._tTime = re), this);
          Z !== se &&
            (J && this._yEase && _propagateYoyoEase(J, Q),
            this.vars.repeatRefresh &&
              !Q &&
              !this._lock &&
              this._time !== X &&
              this._initted &&
              ((this._lock = H = 1),
              (this.render(_roundPrecise(X * Z), !0).invalidate()._lock = 0)));
        }
        if (!this._initted) {
          if (_attemptInitTween(this, Y ? N : U, H, G, re))
            return ((this._tTime = 0), this);
          if (W !== this._time && !(H && this.vars.repeatRefresh && Z !== se))
            return this;
          if (j !== this._dur) return this.render(N, G, H);
        }
        if (
          ((this._tTime = re),
          (this._time = U),
          !this._act && this._ts && ((this._act = 1), (this._lazy = 0)),
          (this.ratio = te = (ee || this._ease)(U / j)),
          this._from && (this.ratio = te = 1 - te),
          U &&
            !W &&
            !G &&
            !Z &&
            (_callback$1(this, "onStart"), this._tTime !== re))
        )
          return this;
        for (K = this._pt; K; ) (K.r(te, K.d), (K = K._next));
        ((J && J.render(N < 0 ? N : J._dur * J._ease(U / this._dur), G, H)) ||
          (this._startAt && (this._zTime = N)),
          this._onUpdate &&
            !G &&
            (Y && _rewindStartAt(this, N, G, H), _callback$1(this, "onUpdate")),
          this._repeat &&
            Z !== se &&
            this.vars.onRepeat &&
            !G &&
            this.parent &&
            _callback$1(this, "onRepeat"),
          (re === this._tDur || !re) &&
            this._tTime === re &&
            (Y && !this._onUpdate && _rewindStartAt(this, N, !0, !0),
            (N || !j) &&
              ((re === this._tDur && this._ts > 0) || (!re && this._ts < 0)) &&
              _removeFromParent(this, 1),
            !G &&
              !(Y && !W) &&
              (re || W || Q) &&
              (_callback$1(
                this,
                re === q ? "onComplete" : "onReverseComplete",
                !0,
              ),
              this._prom &&
                !(re < q && this.timeScale() > 0) &&
                this._prom())));
      }
      return this;
    }),
    (B.targets = function () {
      return this._targets;
    }),
    (B.invalidate = function (N) {
      return (
        (!N || !this.vars.runBackwards) && (this._startAt = 0),
        (this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0),
        (this._ptLookup = []),
        this.timeline && this.timeline.invalidate(N),
        V.prototype.invalidate.call(this, N)
      );
    }),
    (B.resetTo = function (N, G, H, W, q) {
      (_tickerActive || _ticker.wake(), this._ts || this.play());
      var j = Math.min(this._dur, (this._dp._time - this._start) * this._ts),
        Y;
      return (
        this._initted || _initTween(this, j),
        (Y = this._ease(j / this._dur)),
        _updatePropTweens(this, N, G, H, W, Y, j, q)
          ? this.resetTo(N, G, H, W, 1)
          : (_alignPlayhead(this, 0),
            this.parent ||
              _addLinkedListItem(
                this._dp,
                this,
                "_first",
                "_last",
                this._dp._sort ? "_start" : 0,
              ),
            this.render(0))
      );
    }),
    (B.kill = function (N, G) {
      if ((G === void 0 && (G = "all"), !N && (!G || G === "all")))
        return (
          (this._lazy = this._pt = 0),
          this.parent ? _interrupt(this) : this
        );
      if (this.timeline) {
        var H = this.timeline.totalDuration();
        return (
          this.timeline.killTweensOf(
            N,
            G,
            _overwritingTween && _overwritingTween.vars.overwrite !== !0,
          )._first || _interrupt(this),
          this.parent &&
            H !== this.timeline.totalDuration() &&
            _setDuration(this, (this._dur * this.timeline._tDur) / H, 0, 1),
          this
        );
      }
      var W = this._targets,
        q = N ? toArray(N) : W,
        j = this._ptLookup,
        Y = this._pt,
        re,
        U,
        K,
        Z,
        X,
        se,
        Q;
      if ((!G || G === "all") && _arraysMatch(W, q))
        return (G === "all" && (this._pt = 0), _interrupt(this));
      for (
        re = this._op = this._op || [],
          G !== "all" &&
            (_isString$1(G) &&
              ((X = {}),
              _forEachName(G, function (te) {
                return (X[te] = 1);
              }),
              (G = X)),
            (G = _addAliasesToVars(W, G))),
          Q = W.length;
        Q--;
      )
        if (~q.indexOf(W[Q])) {
          ((U = j[Q]),
            G === "all"
              ? ((re[Q] = G), (Z = U), (K = {}))
              : ((K = re[Q] = re[Q] || {}), (Z = G)));
          for (X in Z)
            ((se = U && U[X]),
              se &&
                ((!("kill" in se.d) || se.d.kill(X) === !0) &&
                  _removeLinkedListItem(this, se, "_pt"),
                delete U[X]),
              K !== "all" && (K[X] = 1));
        }
      return (this._initted && !this._pt && Y && _interrupt(this), this);
    }),
    (O.to = function (N, G) {
      return new O(N, G, arguments[2]);
    }),
    (O.from = function (N, G) {
      return _createTweenType(1, arguments);
    }),
    (O.delayedCall = function (N, G, H, W) {
      return new O(G, 0, {
        immediateRender: !1,
        lazy: !1,
        overwrite: !1,
        delay: N,
        onComplete: G,
        onReverseComplete: G,
        onCompleteParams: H,
        onReverseCompleteParams: H,
        callbackScope: W,
      });
    }),
    (O.fromTo = function (N, G, H) {
      return _createTweenType(2, arguments);
    }),
    (O.set = function (N, G) {
      return ((G.duration = 0), G.repeatDelay || (G.repeat = 0), new O(N, G));
    }),
    (O.killTweensOf = function (N, G, H) {
      return _globalTimeline.killTweensOf(N, G, H);
    }),
    O
  );
})(Animation);
_setDefaults$1(Tween.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0,
});
_forEachName("staggerTo,staggerFrom,staggerFromTo", function (V) {
  Tween[V] = function () {
    var O = new Timeline(),
      B = _slice.call(arguments, 0);
    return (B.splice(V === "staggerFromTo" ? 5 : 4, 0, 0), O[V].apply(O, B));
  };
});
var _setterPlain = function (O, B, z) {
    return (O[B] = z);
  },
  _setterFunc = function (O, B, z) {
    return O[B](z);
  },
  _setterFuncWithParam = function (O, B, z, N) {
    return O[B](N.fp, z);
  },
  _setterAttribute = function (O, B, z) {
    return O.setAttribute(B, z);
  },
  _getSetter = function (O, B) {
    return _isFunction$1(O[B])
      ? _setterFunc
      : _isUndefined(O[B]) && O.setAttribute
        ? _setterAttribute
        : _setterPlain;
  },
  _renderPlain = function (O, B) {
    return B.set(B.t, B.p, Math.round((B.s + B.c * O) * 1e6) / 1e6, B);
  },
  _renderBoolean = function (O, B) {
    return B.set(B.t, B.p, !!(B.s + B.c * O), B);
  },
  _renderComplexString = function (O, B) {
    var z = B._pt,
      N = "";
    if (!O && B.b) N = B.b;
    else if (O === 1 && B.e) N = B.e;
    else {
      for (; z; )
        ((N =
          z.p +
          (z.m ? z.m(z.s + z.c * O) : Math.round((z.s + z.c * O) * 1e4) / 1e4) +
          N),
          (z = z._next));
      N += B.c;
    }
    B.set(B.t, B.p, N, B);
  },
  _renderPropTweens = function (O, B) {
    for (var z = B._pt; z; ) (z.r(O, z.d), (z = z._next));
  },
  _addPluginModifier = function (O, B, z, N) {
    for (var G = this._pt, H; G; )
      ((H = G._next), G.p === N && G.modifier(O, B, z), (G = H));
  },
  _killPropTweensOf = function (O) {
    for (var B = this._pt, z, N; B; )
      ((N = B._next),
        (B.p === O && !B.op) || B.op === O
          ? _removeLinkedListItem(this, B, "_pt")
          : B.dep || (z = 1),
        (B = N));
    return !z;
  },
  _setterWithModifier = function (O, B, z, N) {
    N.mSet(O, B, N.m.call(N.tween, z, N.mt), N);
  },
  _sortPropTweensByPriority = function (O) {
    for (var B = O._pt, z, N, G, H; B; ) {
      for (z = B._next, N = G; N && N.pr > B.pr; ) N = N._next;
      ((B._prev = N ? N._prev : H) ? (B._prev._next = B) : (G = B),
        (B._next = N) ? (N._prev = B) : (H = B),
        (B = z));
    }
    O._pt = G;
  },
  PropTween = (function () {
    function V(B, z, N, G, H, W, q, j, Y) {
      ((this.t = z),
        (this.s = G),
        (this.c = H),
        (this.p = N),
        (this.r = W || _renderPlain),
        (this.d = q || this),
        (this.set = j || _setterPlain),
        (this.pr = Y || 0),
        (this._next = B),
        B && (B._prev = this));
    }
    var O = V.prototype;
    return (
      (O.modifier = function (z, N, G) {
        ((this.mSet = this.mSet || this.set),
          (this.set = _setterWithModifier),
          (this.m = z),
          (this.mt = G),
          (this.tween = N));
      }),
      V
    );
  })();
_forEachName(
  _callbackNames +
    "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger",
  function (V) {
    return (_reservedProps[V] = 1);
  },
);
_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
  sortChildren: !1,
  defaults: _defaults$1,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0,
});
_config.stringFilter = _colorStringFilter;
var _media = [],
  _listeners$1 = {},
  _emptyArray$1 = [],
  _lastMediaTime = 0,
  _contextID = 0,
  _dispatch$1 = function (O) {
    return (_listeners$1[O] || _emptyArray$1).map(function (B) {
      return B();
    });
  },
  _onMediaChange = function () {
    var O = Date.now(),
      B = [];
    O - _lastMediaTime > 2 &&
      (_dispatch$1("matchMediaInit"),
      _media.forEach(function (z) {
        var N = z.queries,
          G = z.conditions,
          H,
          W,
          q,
          j;
        for (W in N)
          ((H = _win$3.matchMedia(N[W]).matches),
            H && (q = 1),
            H !== G[W] && ((G[W] = H), (j = 1)));
        j && (z.revert(), q && B.push(z));
      }),
      _dispatch$1("matchMediaRevert"),
      B.forEach(function (z) {
        return z.onMatch(z, function (N) {
          return z.add(null, N);
        });
      }),
      (_lastMediaTime = O),
      _dispatch$1("matchMedia"));
  },
  Context = (function () {
    function V(B, z) {
      ((this.selector = z && selector(z)),
        (this.data = []),
        (this._r = []),
        (this.isReverted = !1),
        (this.id = _contextID++),
        B && this.add(B));
    }
    var O = V.prototype;
    return (
      (O.add = function (z, N, G) {
        _isFunction$1(z) && ((G = N), (N = z), (z = _isFunction$1));
        var H = this,
          W = function () {
            var j = _context$2,
              Y = H.selector,
              re;
            return (
              j && j !== H && j.data.push(H),
              G && (H.selector = selector(G)),
              (_context$2 = H),
              (re = N.apply(H, arguments)),
              _isFunction$1(re) && H._r.push(re),
              (_context$2 = j),
              (H.selector = Y),
              (H.isReverted = !1),
              re
            );
          };
        return (
          (H.last = W),
          z === _isFunction$1
            ? W(H, function (q) {
                return H.add(null, q);
              })
            : z
              ? (H[z] = W)
              : W
        );
      }),
      (O.ignore = function (z) {
        var N = _context$2;
        ((_context$2 = null), z(this), (_context$2 = N));
      }),
      (O.getTweens = function () {
        var z = [];
        return (
          this.data.forEach(function (N) {
            return N instanceof V
              ? z.push.apply(z, N.getTweens())
              : N instanceof Tween &&
                  !(N.parent && N.parent.data === "nested") &&
                  z.push(N);
          }),
          z
        );
      }),
      (O.clear = function () {
        this._r.length = this.data.length = 0;
      }),
      (O.kill = function (z, N) {
        var G = this;
        if (
          (z
            ? (function () {
                for (var W = G.getTweens(), q = G.data.length, j; q--; )
                  ((j = G.data[q]),
                    j.data === "isFlip" &&
                      (j.revert(),
                      j.getChildren(!0, !0, !1).forEach(function (Y) {
                        return W.splice(W.indexOf(Y), 1);
                      })));
                for (
                  W.map(function (Y) {
                    return {
                      g:
                        Y._dur ||
                        Y._delay ||
                        (Y._sat && !Y._sat.vars.immediateRender)
                          ? Y.globalTime(0)
                          : -1 / 0,
                      t: Y,
                    };
                  })
                    .sort(function (Y, re) {
                      return re.g - Y.g || -1 / 0;
                    })
                    .forEach(function (Y) {
                      return Y.t.revert(z);
                    }),
                    q = G.data.length;
                  q--;
                )
                  ((j = G.data[q]),
                    j instanceof Timeline
                      ? j.data !== "nested" &&
                        (j.scrollTrigger && j.scrollTrigger.revert(), j.kill())
                      : !(j instanceof Tween) && j.revert && j.revert(z));
                (G._r.forEach(function (Y) {
                  return Y(z, G);
                }),
                  (G.isReverted = !0));
              })()
            : this.data.forEach(function (W) {
                return W.kill && W.kill();
              }),
          this.clear(),
          N)
        )
          for (var H = _media.length; H--; )
            _media[H].id === this.id && _media.splice(H, 1);
      }),
      (O.revert = function (z) {
        this.kill(z || {});
      }),
      V
    );
  })(),
  MatchMedia = (function () {
    function V(B) {
      ((this.contexts = []),
        (this.scope = B),
        _context$2 && _context$2.data.push(this));
    }
    var O = V.prototype;
    return (
      (O.add = function (z, N, G) {
        _isObject$1(z) || (z = { matches: z });
        var H = new Context(0, G || this.scope),
          W = (H.conditions = {}),
          q,
          j,
          Y;
        (_context$2 && !H.selector && (H.selector = _context$2.selector),
          this.contexts.push(H),
          (N = H.add("onMatch", N)),
          (H.queries = z));
        for (j in z)
          j === "all"
            ? (Y = 1)
            : ((q = _win$3.matchMedia(z[j])),
              q &&
                (_media.indexOf(H) < 0 && _media.push(H),
                (W[j] = q.matches) && (Y = 1),
                q.addListener
                  ? q.addListener(_onMediaChange)
                  : q.addEventListener("change", _onMediaChange)));
        return (
          Y &&
            N(H, function (re) {
              return H.add(null, re);
            }),
          this
        );
      }),
      (O.revert = function (z) {
        this.kill(z || {});
      }),
      (O.kill = function (z) {
        this.contexts.forEach(function (N) {
          return N.kill(z, !0);
        });
      }),
      V
    );
  })(),
  _gsap = {
    registerPlugin: function () {
      for (var O = arguments.length, B = new Array(O), z = 0; z < O; z++)
        B[z] = arguments[z];
      B.forEach(function (N) {
        return _createPlugin(N);
      });
    },
    timeline: function (O) {
      return new Timeline(O);
    },
    getTweensOf: function (O, B) {
      return _globalTimeline.getTweensOf(O, B);
    },
    getProperty: function (O, B, z, N) {
      _isString$1(O) && (O = toArray(O)[0]);
      var G = _getCache(O || {}).get,
        H = z ? _passThrough$1 : _numericIfPossible;
      return (
        z === "native" && (z = ""),
        O &&
          (B
            ? H(((_plugins[B] && _plugins[B].get) || G)(O, B, z, N))
            : function (W, q, j) {
                return H(((_plugins[W] && _plugins[W].get) || G)(O, W, q, j));
              })
      );
    },
    quickSetter: function (O, B, z) {
      if (((O = toArray(O)), O.length > 1)) {
        var N = O.map(function (Y) {
            return gsap$2.quickSetter(Y, B, z);
          }),
          G = N.length;
        return function (Y) {
          for (var re = G; re--; ) N[re](Y);
        };
      }
      O = O[0] || {};
      var H = _plugins[B],
        W = _getCache(O),
        q = (W.harness && (W.harness.aliases || {})[B]) || B,
        j = H
          ? function (Y) {
              var re = new H();
              ((_quickTween._pt = 0),
                re.init(O, z ? Y + z : Y, _quickTween, 0, [O]),
                re.render(1, re),
                _quickTween._pt && _renderPropTweens(1, _quickTween));
            }
          : W.set(O, q);
      return H
        ? j
        : function (Y) {
            return j(O, q, z ? Y + z : Y, W, 1);
          };
    },
    quickTo: function (O, B, z) {
      var N,
        G = gsap$2.to(
          O,
          _merge(((N = {}), (N[B] = "+=0.1"), (N.paused = !0), N), z || {}),
        ),
        H = function (q, j, Y) {
          return G.resetTo(B, q, j, Y);
        };
      return ((H.tween = G), H);
    },
    isTweening: function (O) {
      return _globalTimeline.getTweensOf(O, !0).length > 0;
    },
    defaults: function (O) {
      return (
        O && O.ease && (O.ease = _parseEase(O.ease, _defaults$1.ease)),
        _mergeDeep(_defaults$1, O || {})
      );
    },
    config: function (O) {
      return _mergeDeep(_config, O || {});
    },
    registerEffect: function (O) {
      var B = O.name,
        z = O.effect,
        N = O.plugins,
        G = O.defaults,
        H = O.extendTimeline;
      ((N || "").split(",").forEach(function (W) {
        return (
          W &&
          !_plugins[W] &&
          !_globals[W] &&
          _warn(B + " effect requires " + W + " plugin.")
        );
      }),
        (_effects[B] = function (W, q, j) {
          return z(toArray(W), _setDefaults$1(q || {}, G), j);
        }),
        H &&
          (Timeline.prototype[B] = function (W, q, j) {
            return this.add(
              _effects[B](W, _isObject$1(q) ? q : (j = q) && {}, this),
              j,
            );
          }));
    },
    registerEase: function (O, B) {
      _easeMap[O] = _parseEase(B);
    },
    parseEase: function (O, B) {
      return arguments.length ? _parseEase(O, B) : _easeMap;
    },
    getById: function (O) {
      return _globalTimeline.getById(O);
    },
    exportRoot: function (O, B) {
      O === void 0 && (O = {});
      var z = new Timeline(O),
        N,
        G;
      for (
        z.smoothChildTiming = _isNotFalse(O.smoothChildTiming),
          _globalTimeline.remove(z),
          z._dp = 0,
          z._time = z._tTime = _globalTimeline._time,
          N = _globalTimeline._first;
        N;
      )
        ((G = N._next),
          (B ||
            !(
              !N._dur &&
              N instanceof Tween &&
              N.vars.onComplete === N._targets[0]
            )) &&
            _addToTimeline(z, N, N._start - N._delay),
          (N = G));
      return (_addToTimeline(_globalTimeline, z, 0), z);
    },
    context: function (O, B) {
      return O ? new Context(O, B) : _context$2;
    },
    matchMedia: function (O) {
      return new MatchMedia(O);
    },
    matchMediaRefresh: function () {
      return (
        _media.forEach(function (O) {
          var B = O.conditions,
            z,
            N;
          for (N in B) B[N] && ((B[N] = !1), (z = 1));
          z && O.revert();
        }) || _onMediaChange()
      );
    },
    addEventListener: function (O, B) {
      var z = _listeners$1[O] || (_listeners$1[O] = []);
      ~z.indexOf(B) || z.push(B);
    },
    removeEventListener: function (O, B) {
      var z = _listeners$1[O],
        N = z && z.indexOf(B);
      N >= 0 && z.splice(N, 1);
    },
    utils: {
      wrap,
      wrapYoyo,
      distribute,
      random,
      snap,
      normalize,
      getUnit,
      clamp,
      splitColor,
      toArray,
      selector,
      mapRange,
      pipe,
      unitize,
      interpolate,
      shuffle,
    },
    install: _install,
    effects: _effects,
    ticker: _ticker,
    updateRoot: Timeline.updateRoot,
    plugins: _plugins,
    globalTimeline: _globalTimeline,
    core: {
      PropTween,
      globals: _addGlobal,
      Tween,
      Timeline,
      Animation,
      getCache: _getCache,
      _removeLinkedListItem,
      reverting: function () {
        return _reverting$1;
      },
      context: function (O) {
        return (
          O && _context$2 && (_context$2.data.push(O), (O._ctx = _context$2)),
          _context$2
        );
      },
      suppressOverwrites: function (O) {
        return (_suppressOverwrites$1 = O);
      },
    },
  };
_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (V) {
  return (_gsap[V] = Tween[V]);
});
_ticker.add(Timeline.updateRoot);
_quickTween = _gsap.to({}, { duration: 0 });
var _getPluginPropTween = function (O, B) {
    for (var z = O._pt; z && z.p !== B && z.op !== B && z.fp !== B; )
      z = z._next;
    return z;
  },
  _addModifiers = function (O, B) {
    var z = O._targets,
      N,
      G,
      H;
    for (N in B)
      for (G = z.length; G--; )
        ((H = O._ptLookup[G][N]),
          H &&
            (H = H.d) &&
            (H._pt && (H = _getPluginPropTween(H, N)),
            H && H.modifier && H.modifier(B[N], O, z[G], N)));
  },
  _buildModifierPlugin = function (O, B) {
    return {
      name: O,
      rawVars: 1,
      init: function (N, G, H) {
        H._onInit = function (W) {
          var q, j;
          if (
            (_isString$1(G) &&
              ((q = {}),
              _forEachName(G, function (Y) {
                return (q[Y] = 1);
              }),
              (G = q)),
            B)
          ) {
            q = {};
            for (j in G) q[j] = B(G[j]);
            G = q;
          }
          _addModifiers(W, G);
        };
      },
    };
  },
  gsap$2 =
    _gsap.registerPlugin(
      {
        name: "attr",
        init: function (O, B, z, N, G) {
          var H, W, q;
          this.tween = z;
          for (H in B)
            ((q = O.getAttribute(H) || ""),
              (W = this.add(
                O,
                "setAttribute",
                (q || 0) + "",
                B[H],
                N,
                G,
                0,
                0,
                H,
              )),
              (W.op = H),
              (W.b = q),
              this._props.push(H));
        },
        render: function (O, B) {
          for (var z = B._pt; z; )
            (_reverting$1 ? z.set(z.t, z.p, z.b, z) : z.r(O, z.d),
              (z = z._next));
        },
      },
      {
        name: "endArray",
        init: function (O, B) {
          for (var z = B.length; z--; )
            this.add(O, z, O[z] || 0, B[z], 0, 0, 0, 0, 0, 1);
        },
      },
      _buildModifierPlugin("roundProps", _roundModifier),
      _buildModifierPlugin("modifiers"),
      _buildModifierPlugin("snap", snap),
    ) || _gsap;
Tween.version = Timeline.version = gsap$2.version = "3.12.5";
_coreReady = 1;
_windowExists$2() && _wake();
_easeMap.Power0;
_easeMap.Power1;
_easeMap.Power2;
_easeMap.Power3;
_easeMap.Power4;
_easeMap.Linear;
_easeMap.Quad;
_easeMap.Cubic;
_easeMap.Quart;
_easeMap.Quint;
_easeMap.Strong;
_easeMap.Elastic;
_easeMap.Back;
_easeMap.SteppedEase;
_easeMap.Bounce;
_easeMap.Sine;
_easeMap.Expo;
_easeMap.Circ;
/*!
 * CSSPlugin 3.12.5
 * https://gsap.com
 *
 * Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */ var _win$2,
  _doc$2,
  _docElement,
  _pluginInitted,
  _tempDiv,
  _recentSetterPlugin,
  _reverting,
  _windowExists$1 = function () {
    return typeof window < "u";
  },
  _transformProps = {},
  _RAD2DEG = 180 / Math.PI,
  _DEG2RAD = Math.PI / 180,
  _atan2 = Math.atan2,
  _bigNum = 1e8,
  _capsExp$1 = /([A-Z])/g,
  _horizontalExp = /(left|right|width|margin|padding|x)/i,
  _complexExp = /[\s,\(]\S/,
  _propertyAliases = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity",
  },
  _renderCSSProp = function (O, B) {
    return B.set(B.t, B.p, Math.round((B.s + B.c * O) * 1e4) / 1e4 + B.u, B);
  },
  _renderPropWithEnd = function (O, B) {
    return B.set(
      B.t,
      B.p,
      O === 1 ? B.e : Math.round((B.s + B.c * O) * 1e4) / 1e4 + B.u,
      B,
    );
  },
  _renderCSSPropWithBeginning = function (O, B) {
    return B.set(
      B.t,
      B.p,
      O ? Math.round((B.s + B.c * O) * 1e4) / 1e4 + B.u : B.b,
      B,
    );
  },
  _renderRoundedCSSProp = function (O, B) {
    var z = B.s + B.c * O;
    B.set(B.t, B.p, ~~(z + (z < 0 ? -0.5 : 0.5)) + B.u, B);
  },
  _renderNonTweeningValue = function (O, B) {
    return B.set(B.t, B.p, O ? B.e : B.b, B);
  },
  _renderNonTweeningValueOnlyAtEnd = function (O, B) {
    return B.set(B.t, B.p, O !== 1 ? B.b : B.e, B);
  },
  _setterCSSStyle = function (O, B, z) {
    return (O.style[B] = z);
  },
  _setterCSSProp = function (O, B, z) {
    return O.style.setProperty(B, z);
  },
  _setterTransform = function (O, B, z) {
    return (O._gsap[B] = z);
  },
  _setterScale = function (O, B, z) {
    return (O._gsap.scaleX = O._gsap.scaleY = z);
  },
  _setterScaleWithRender = function (O, B, z, N, G) {
    var H = O._gsap;
    ((H.scaleX = H.scaleY = z), H.renderTransform(G, H));
  },
  _setterTransformWithRender = function (O, B, z, N, G) {
    var H = O._gsap;
    ((H[B] = z), H.renderTransform(G, H));
  },
  _transformProp$1 = "transform",
  _transformOriginProp = _transformProp$1 + "Origin",
  _saveStyle = function V(O, B) {
    var z = this,
      N = this.target,
      G = N.style,
      H = N._gsap;
    if (O in _transformProps && G) {
      if (((this.tfm = this.tfm || {}), O !== "transform"))
        ((O = _propertyAliases[O] || O),
          ~O.indexOf(",")
            ? O.split(",").forEach(function (W) {
                return (z.tfm[W] = _get(N, W));
              })
            : (this.tfm[O] = H.x ? H[O] : _get(N, O)),
          O === _transformOriginProp && (this.tfm.zOrigin = H.zOrigin));
      else
        return _propertyAliases.transform.split(",").forEach(function (W) {
          return V.call(z, W, B);
        });
      if (this.props.indexOf(_transformProp$1) >= 0) return;
      (H.svg &&
        ((this.svgo = N.getAttribute("data-svg-origin")),
        this.props.push(_transformOriginProp, B, "")),
        (O = _transformProp$1));
    }
    (G || B) && this.props.push(O, B, G[O]);
  },
  _removeIndependentTransforms = function (O) {
    O.translate &&
      (O.removeProperty("translate"),
      O.removeProperty("scale"),
      O.removeProperty("rotate"));
  },
  _revertStyle = function () {
    var O = this.props,
      B = this.target,
      z = B.style,
      N = B._gsap,
      G,
      H;
    for (G = 0; G < O.length; G += 3)
      O[G + 1]
        ? (B[O[G]] = O[G + 2])
        : O[G + 2]
          ? (z[O[G]] = O[G + 2])
          : z.removeProperty(
              O[G].substr(0, 2) === "--"
                ? O[G]
                : O[G].replace(_capsExp$1, "-$1").toLowerCase(),
            );
    if (this.tfm) {
      for (H in this.tfm) N[H] = this.tfm[H];
      (N.svg &&
        (N.renderTransform(),
        B.setAttribute("data-svg-origin", this.svgo || "")),
        (G = _reverting()),
        (!G || !G.isStart) &&
          !z[_transformProp$1] &&
          (_removeIndependentTransforms(z),
          N.zOrigin &&
            z[_transformOriginProp] &&
            ((z[_transformOriginProp] += " " + N.zOrigin + "px"),
            (N.zOrigin = 0),
            N.renderTransform()),
          (N.uncache = 1)));
    }
  },
  _getStyleSaver = function (O, B) {
    var z = { target: O, props: [], revert: _revertStyle, save: _saveStyle };
    return (
      O._gsap || gsap$2.core.getCache(O),
      B &&
        B.split(",").forEach(function (N) {
          return z.save(N);
        }),
      z
    );
  },
  _supports3D,
  _createElement = function (O, B) {
    var z = _doc$2.createElementNS
      ? _doc$2.createElementNS(
          (B || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"),
          O,
        )
      : _doc$2.createElement(O);
    return z && z.style ? z : _doc$2.createElement(O);
  },
  _getComputedProperty = function V(O, B, z) {
    var N = getComputedStyle(O);
    return (
      N[B] ||
      N.getPropertyValue(B.replace(_capsExp$1, "-$1").toLowerCase()) ||
      N.getPropertyValue(B) ||
      (!z && V(O, _checkPropPrefix(B) || B, 1)) ||
      ""
    );
  },
  _prefixes = "O,Moz,ms,Ms,Webkit".split(","),
  _checkPropPrefix = function (O, B, z) {
    var N = B || _tempDiv,
      G = N.style,
      H = 5;
    if (O in G && !z) return O;
    for (
      O = O.charAt(0).toUpperCase() + O.substr(1);
      H-- && !(_prefixes[H] + O in G);
    );
    return H < 0 ? null : (H === 3 ? "ms" : H >= 0 ? _prefixes[H] : "") + O;
  },
  _initCore$1 = function () {
    _windowExists$1() &&
      window.document &&
      ((_win$2 = window),
      (_doc$2 = _win$2.document),
      (_docElement = _doc$2.documentElement),
      (_tempDiv = _createElement("div") || { style: {} }),
      _createElement("div"),
      (_transformProp$1 = _checkPropPrefix(_transformProp$1)),
      (_transformOriginProp = _transformProp$1 + "Origin"),
      (_tempDiv.style.cssText =
        "border-width:0;line-height:0;position:absolute;padding:0"),
      (_supports3D = !!_checkPropPrefix("perspective")),
      (_reverting = gsap$2.core.reverting),
      (_pluginInitted = 1));
  },
  _getBBoxHack = function V(O) {
    var B = _createElement(
        "svg",
        (this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns")) ||
          "http://www.w3.org/2000/svg",
      ),
      z = this.parentNode,
      N = this.nextSibling,
      G = this.style.cssText,
      H;
    if (
      (_docElement.appendChild(B),
      B.appendChild(this),
      (this.style.display = "block"),
      O)
    )
      try {
        ((H = this.getBBox()),
          (this._gsapBBox = this.getBBox),
          (this.getBBox = V));
      } catch {}
    else this._gsapBBox && (H = this._gsapBBox());
    return (
      z && (N ? z.insertBefore(this, N) : z.appendChild(this)),
      _docElement.removeChild(B),
      (this.style.cssText = G),
      H
    );
  },
  _getAttributeFallbacks = function (O, B) {
    for (var z = B.length; z--; )
      if (O.hasAttribute(B[z])) return O.getAttribute(B[z]);
  },
  _getBBox = function (O) {
    var B;
    try {
      B = O.getBBox();
    } catch {
      B = _getBBoxHack.call(O, !0);
    }
    return (
      (B && (B.width || B.height)) ||
        O.getBBox === _getBBoxHack ||
        (B = _getBBoxHack.call(O, !0)),
      B && !B.width && !B.x && !B.y
        ? {
            x: +_getAttributeFallbacks(O, ["x", "cx", "x1"]) || 0,
            y: +_getAttributeFallbacks(O, ["y", "cy", "y1"]) || 0,
            width: 0,
            height: 0,
          }
        : B
    );
  },
  _isSVG = function (O) {
    return !!(O.getCTM && (!O.parentNode || O.ownerSVGElement) && _getBBox(O));
  },
  _removeProperty = function (O, B) {
    if (B) {
      var z = O.style,
        N;
      (B in _transformProps &&
        B !== _transformOriginProp &&
        (B = _transformProp$1),
        z.removeProperty
          ? ((N = B.substr(0, 2)),
            (N === "ms" || B.substr(0, 6) === "webkit") && (B = "-" + B),
            z.removeProperty(
              N === "--" ? B : B.replace(_capsExp$1, "-$1").toLowerCase(),
            ))
          : z.removeAttribute(B));
    }
  },
  _addNonTweeningPT = function (O, B, z, N, G, H) {
    var W = new PropTween(
      O._pt,
      B,
      z,
      0,
      1,
      H ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue,
    );
    return ((O._pt = W), (W.b = N), (W.e = G), O._props.push(z), W);
  },
  _nonConvertibleUnits = { deg: 1, rad: 1, turn: 1 },
  _nonStandardLayouts = { grid: 1, flex: 1 },
  _convertToUnit = function V(O, B, z, N) {
    var G = parseFloat(z) || 0,
      H = (z + "").trim().substr((G + "").length) || "px",
      W = _tempDiv.style,
      q = _horizontalExp.test(B),
      j = O.tagName.toLowerCase() === "svg",
      Y = (j ? "client" : "offset") + (q ? "Width" : "Height"),
      re = 100,
      U = N === "px",
      K = N === "%",
      Z,
      X,
      se,
      Q;
    if (N === H || !G || _nonConvertibleUnits[N] || _nonConvertibleUnits[H])
      return G;
    if (
      (H !== "px" && !U && (G = V(O, B, z, "px")),
      (Q = O.getCTM && _isSVG(O)),
      (K || H === "%") && (_transformProps[B] || ~B.indexOf("adius")))
    )
      return (
        (Z = Q ? O.getBBox()[q ? "width" : "height"] : O[Y]),
        _round$1(K ? (G / Z) * re : (G / 100) * Z)
      );
    if (
      ((W[q ? "width" : "height"] = re + (U ? H : N)),
      (X =
        ~B.indexOf("adius") || (N === "em" && O.appendChild && !j)
          ? O
          : O.parentNode),
      Q && (X = (O.ownerSVGElement || {}).parentNode),
      (!X || X === _doc$2 || !X.appendChild) && (X = _doc$2.body),
      (se = X._gsap),
      se && K && se.width && q && se.time === _ticker.time && !se.uncache)
    )
      return _round$1((G / se.width) * re);
    if (K && (B === "height" || B === "width")) {
      var te = O.style[B];
      ((O.style[B] = re + N),
        (Z = O[Y]),
        te ? (O.style[B] = te) : _removeProperty(O, B));
    } else
      ((K || H === "%") &&
        !_nonStandardLayouts[_getComputedProperty(X, "display")] &&
        (W.position = _getComputedProperty(O, "position")),
        X === O && (W.position = "static"),
        X.appendChild(_tempDiv),
        (Z = _tempDiv[Y]),
        X.removeChild(_tempDiv),
        (W.position = "absolute"));
    return (
      q &&
        K &&
        ((se = _getCache(X)), (se.time = _ticker.time), (se.width = X[Y])),
      _round$1(U ? (Z * G) / re : Z && G ? (re / Z) * G : 0)
    );
  },
  _get = function (O, B, z, N) {
    var G;
    return (
      _pluginInitted || _initCore$1(),
      B in _propertyAliases &&
        B !== "transform" &&
        ((B = _propertyAliases[B]), ~B.indexOf(",") && (B = B.split(",")[0])),
      _transformProps[B] && B !== "transform"
        ? ((G = _parseTransform(O, N)),
          (G =
            B !== "transformOrigin"
              ? G[B]
              : G.svg
                ? G.origin
                : _firstTwoOnly(_getComputedProperty(O, _transformOriginProp)) +
                  " " +
                  G.zOrigin +
                  "px"))
        : ((G = O.style[B]),
          (!G || G === "auto" || N || ~(G + "").indexOf("calc(")) &&
            (G =
              (_specialProps[B] && _specialProps[B](O, B, z)) ||
              _getComputedProperty(O, B) ||
              _getProperty(O, B) ||
              (B === "opacity" ? 1 : 0))),
      z && !~(G + "").trim().indexOf(" ") ? _convertToUnit(O, B, G, z) + z : G
    );
  },
  _tweenComplexCSSString = function (O, B, z, N) {
    if (!z || z === "none") {
      var G = _checkPropPrefix(B, O, 1),
        H = G && _getComputedProperty(O, G, 1);
      H && H !== z
        ? ((B = G), (z = H))
        : B === "borderColor" &&
          (z = _getComputedProperty(O, "borderTopColor"));
    }
    var W = new PropTween(this._pt, O.style, B, 0, 1, _renderComplexString),
      q = 0,
      j = 0,
      Y,
      re,
      U,
      K,
      Z,
      X,
      se,
      Q,
      te,
      J,
      ee,
      ne;
    if (
      ((W.b = z),
      (W.e = N),
      (z += ""),
      (N += ""),
      N === "auto" &&
        ((X = O.style[B]),
        (O.style[B] = N),
        (N = _getComputedProperty(O, B) || N),
        X ? (O.style[B] = X) : _removeProperty(O, B)),
      (Y = [z, N]),
      _colorStringFilter(Y),
      (z = Y[0]),
      (N = Y[1]),
      (U = z.match(_numWithUnitExp) || []),
      (ne = N.match(_numWithUnitExp) || []),
      ne.length)
    ) {
      for (; (re = _numWithUnitExp.exec(N)); )
        ((se = re[0]),
          (te = N.substring(q, re.index)),
          Z
            ? (Z = (Z + 1) % 5)
            : (te.substr(-5) === "rgba(" || te.substr(-5) === "hsla(") &&
              (Z = 1),
          se !== (X = U[j++] || "") &&
            ((K = parseFloat(X) || 0),
            (ee = X.substr((K + "").length)),
            se.charAt(1) === "=" && (se = _parseRelative(K, se) + ee),
            (Q = parseFloat(se)),
            (J = se.substr((Q + "").length)),
            (q = _numWithUnitExp.lastIndex - J.length),
            J ||
              ((J = J || _config.units[B] || ee),
              q === N.length && ((N += J), (W.e += J))),
            ee !== J && (K = _convertToUnit(O, B, X, J) || 0),
            (W._pt = {
              _next: W._pt,
              p: te || j === 1 ? te : ",",
              s: K,
              c: Q - K,
              m: (Z && Z < 4) || B === "zIndex" ? Math.round : 0,
            })));
      W.c = q < N.length ? N.substring(q, N.length) : "";
    } else
      W.r =
        B === "display" && N === "none"
          ? _renderNonTweeningValueOnlyAtEnd
          : _renderNonTweeningValue;
    return (_relExp.test(N) && (W.e = 0), (this._pt = W), W);
  },
  _keywordToPercent = {
    top: "0%",
    bottom: "100%",
    left: "0%",
    right: "100%",
    center: "50%",
  },
  _convertKeywordsToPercentages = function (O) {
    var B = O.split(" "),
      z = B[0],
      N = B[1] || "50%";
    return (
      (z === "top" || z === "bottom" || N === "left" || N === "right") &&
        ((O = z), (z = N), (N = O)),
      (B[0] = _keywordToPercent[z] || z),
      (B[1] = _keywordToPercent[N] || N),
      B.join(" ")
    );
  },
  _renderClearProps = function (O, B) {
    if (B.tween && B.tween._time === B.tween._dur) {
      var z = B.t,
        N = z.style,
        G = B.u,
        H = z._gsap,
        W,
        q,
        j;
      if (G === "all" || G === !0) ((N.cssText = ""), (q = 1));
      else
        for (G = G.split(","), j = G.length; --j > -1; )
          ((W = G[j]),
            _transformProps[W] &&
              ((q = 1),
              (W =
                W === "transformOrigin"
                  ? _transformOriginProp
                  : _transformProp$1)),
            _removeProperty(z, W));
      q &&
        (_removeProperty(z, _transformProp$1),
        H &&
          (H.svg && z.removeAttribute("transform"),
          _parseTransform(z, 1),
          (H.uncache = 1),
          _removeIndependentTransforms(N)));
    }
  },
  _specialProps = {
    clearProps: function (O, B, z, N, G) {
      if (G.data !== "isFromStart") {
        var H = (O._pt = new PropTween(O._pt, B, z, 0, 0, _renderClearProps));
        return ((H.u = N), (H.pr = -10), (H.tween = G), O._props.push(z), 1);
      }
    },
  },
  _identity2DMatrix = [1, 0, 0, 1, 0, 0],
  _rotationalProperties = {},
  _isNullTransform = function (O) {
    return O === "matrix(1, 0, 0, 1, 0, 0)" || O === "none" || !O;
  },
  _getComputedTransformMatrixAsArray = function (O) {
    var B = _getComputedProperty(O, _transformProp$1);
    return _isNullTransform(B)
      ? _identity2DMatrix
      : B.substr(7).match(_numExp).map(_round$1);
  },
  _getMatrix = function (O, B) {
    var z = O._gsap || _getCache(O),
      N = O.style,
      G = _getComputedTransformMatrixAsArray(O),
      H,
      W,
      q,
      j;
    return z.svg && O.getAttribute("transform")
      ? ((q = O.transform.baseVal.consolidate().matrix),
        (G = [q.a, q.b, q.c, q.d, q.e, q.f]),
        G.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : G)
      : (G === _identity2DMatrix &&
          !O.offsetParent &&
          O !== _docElement &&
          !z.svg &&
          ((q = N.display),
          (N.display = "block"),
          (H = O.parentNode),
          (!H || !O.offsetParent) &&
            ((j = 1), (W = O.nextElementSibling), _docElement.appendChild(O)),
          (G = _getComputedTransformMatrixAsArray(O)),
          q ? (N.display = q) : _removeProperty(O, "display"),
          j &&
            (W
              ? H.insertBefore(O, W)
              : H
                ? H.appendChild(O)
                : _docElement.removeChild(O))),
        B && G.length > 6 ? [G[0], G[1], G[4], G[5], G[12], G[13]] : G);
  },
  _applySVGOrigin = function (O, B, z, N, G, H) {
    var W = O._gsap,
      q = G || _getMatrix(O, !0),
      j = W.xOrigin || 0,
      Y = W.yOrigin || 0,
      re = W.xOffset || 0,
      U = W.yOffset || 0,
      K = q[0],
      Z = q[1],
      X = q[2],
      se = q[3],
      Q = q[4],
      te = q[5],
      J = B.split(" "),
      ee = parseFloat(J[0]) || 0,
      ne = parseFloat(J[1]) || 0,
      oe,
      he,
      ce,
      ue;
    (z
      ? q !== _identity2DMatrix &&
        (he = K * se - Z * X) &&
        ((ce = ee * (se / he) + ne * (-X / he) + (X * te - se * Q) / he),
        (ue = ee * (-Z / he) + ne * (K / he) - (K * te - Z * Q) / he),
        (ee = ce),
        (ne = ue))
      : ((oe = _getBBox(O)),
        (ee = oe.x + (~J[0].indexOf("%") ? (ee / 100) * oe.width : ee)),
        (ne =
          oe.y + (~(J[1] || J[0]).indexOf("%") ? (ne / 100) * oe.height : ne))),
      N || (N !== !1 && W.smooth)
        ? ((Q = ee - j),
          (te = ne - Y),
          (W.xOffset = re + (Q * K + te * X) - Q),
          (W.yOffset = U + (Q * Z + te * se) - te))
        : (W.xOffset = W.yOffset = 0),
      (W.xOrigin = ee),
      (W.yOrigin = ne),
      (W.smooth = !!N),
      (W.origin = B),
      (W.originIsAbsolute = !!z),
      (O.style[_transformOriginProp] = "0px 0px"),
      H &&
        (_addNonTweeningPT(H, W, "xOrigin", j, ee),
        _addNonTweeningPT(H, W, "yOrigin", Y, ne),
        _addNonTweeningPT(H, W, "xOffset", re, W.xOffset),
        _addNonTweeningPT(H, W, "yOffset", U, W.yOffset)),
      O.setAttribute("data-svg-origin", ee + " " + ne));
  },
  _parseTransform = function (O, B) {
    var z = O._gsap || new GSCache(O);
    if ("x" in z && !B && !z.uncache) return z;
    var N = O.style,
      G = z.scaleX < 0,
      H = "px",
      W = "deg",
      q = getComputedStyle(O),
      j = _getComputedProperty(O, _transformOriginProp) || "0",
      Y,
      re,
      U,
      K,
      Z,
      X,
      se,
      Q,
      te,
      J,
      ee,
      ne,
      oe,
      he,
      ce,
      ue,
      ge,
      ye,
      me,
      be,
      Se,
      _e,
      le,
      pe,
      ie,
      ae,
      fe,
      de,
      xe,
      we,
      Ee,
      Me;
    return (
      (Y = re = U = X = se = Q = te = J = ee = 0),
      (K = Z = 1),
      (z.svg = !!(O.getCTM && _isSVG(O))),
      q.translate &&
        ((q.translate !== "none" ||
          q.scale !== "none" ||
          q.rotate !== "none") &&
          (N[_transformProp$1] =
            (q.translate !== "none"
              ? "translate3d(" +
                (q.translate + " 0 0").split(" ").slice(0, 3).join(", ") +
                ") "
              : "") +
            (q.rotate !== "none" ? "rotate(" + q.rotate + ") " : "") +
            (q.scale !== "none"
              ? "scale(" + q.scale.split(" ").join(",") + ") "
              : "") +
            (q[_transformProp$1] !== "none" ? q[_transformProp$1] : "")),
        (N.scale = N.rotate = N.translate = "none")),
      (he = _getMatrix(O, z.svg)),
      z.svg &&
        (z.uncache
          ? ((ie = O.getBBox()),
            (j = z.xOrigin - ie.x + "px " + (z.yOrigin - ie.y) + "px"),
            (pe = ""))
          : (pe = !B && O.getAttribute("data-svg-origin")),
        _applySVGOrigin(
          O,
          pe || j,
          !!pe || z.originIsAbsolute,
          z.smooth !== !1,
          he,
        )),
      (ne = z.xOrigin || 0),
      (oe = z.yOrigin || 0),
      he !== _identity2DMatrix &&
        ((ye = he[0]),
        (me = he[1]),
        (be = he[2]),
        (Se = he[3]),
        (Y = _e = he[4]),
        (re = le = he[5]),
        he.length === 6
          ? ((K = Math.sqrt(ye * ye + me * me)),
            (Z = Math.sqrt(Se * Se + be * be)),
            (X = ye || me ? _atan2(me, ye) * _RAD2DEG : 0),
            (te = be || Se ? _atan2(be, Se) * _RAD2DEG + X : 0),
            te && (Z *= Math.abs(Math.cos(te * _DEG2RAD))),
            z.svg &&
              ((Y -= ne - (ne * ye + oe * be)),
              (re -= oe - (ne * me + oe * Se))))
          : ((Me = he[6]),
            (we = he[7]),
            (fe = he[8]),
            (de = he[9]),
            (xe = he[10]),
            (Ee = he[11]),
            (Y = he[12]),
            (re = he[13]),
            (U = he[14]),
            (ce = _atan2(Me, xe)),
            (se = ce * _RAD2DEG),
            ce &&
              ((ue = Math.cos(-ce)),
              (ge = Math.sin(-ce)),
              (pe = _e * ue + fe * ge),
              (ie = le * ue + de * ge),
              (ae = Me * ue + xe * ge),
              (fe = _e * -ge + fe * ue),
              (de = le * -ge + de * ue),
              (xe = Me * -ge + xe * ue),
              (Ee = we * -ge + Ee * ue),
              (_e = pe),
              (le = ie),
              (Me = ae)),
            (ce = _atan2(-be, xe)),
            (Q = ce * _RAD2DEG),
            ce &&
              ((ue = Math.cos(-ce)),
              (ge = Math.sin(-ce)),
              (pe = ye * ue - fe * ge),
              (ie = me * ue - de * ge),
              (ae = be * ue - xe * ge),
              (Ee = Se * ge + Ee * ue),
              (ye = pe),
              (me = ie),
              (be = ae)),
            (ce = _atan2(me, ye)),
            (X = ce * _RAD2DEG),
            ce &&
              ((ue = Math.cos(ce)),
              (ge = Math.sin(ce)),
              (pe = ye * ue + me * ge),
              (ie = _e * ue + le * ge),
              (me = me * ue - ye * ge),
              (le = le * ue - _e * ge),
              (ye = pe),
              (_e = ie)),
            se &&
              Math.abs(se) + Math.abs(X) > 359.9 &&
              ((se = X = 0), (Q = 180 - Q)),
            (K = _round$1(Math.sqrt(ye * ye + me * me + be * be))),
            (Z = _round$1(Math.sqrt(le * le + Me * Me))),
            (ce = _atan2(_e, le)),
            (te = Math.abs(ce) > 2e-4 ? ce * _RAD2DEG : 0),
            (ee = Ee ? 1 / (Ee < 0 ? -Ee : Ee) : 0)),
        z.svg &&
          ((pe = O.getAttribute("transform")),
          (z.forceCSS =
            O.setAttribute("transform", "") ||
            !_isNullTransform(_getComputedProperty(O, _transformProp$1))),
          pe && O.setAttribute("transform", pe))),
      Math.abs(te) > 90 &&
        Math.abs(te) < 270 &&
        (G
          ? ((K *= -1), (te += X <= 0 ? 180 : -180), (X += X <= 0 ? 180 : -180))
          : ((Z *= -1), (te += te <= 0 ? 180 : -180))),
      (B = B || z.uncache),
      (z.x =
        Y -
        ((z.xPercent =
          Y &&
          ((!B && z.xPercent) ||
            (Math.round(O.offsetWidth / 2) === Math.round(-Y) ? -50 : 0)))
          ? (O.offsetWidth * z.xPercent) / 100
          : 0) +
        H),
      (z.y =
        re -
        ((z.yPercent =
          re &&
          ((!B && z.yPercent) ||
            (Math.round(O.offsetHeight / 2) === Math.round(-re) ? -50 : 0)))
          ? (O.offsetHeight * z.yPercent) / 100
          : 0) +
        H),
      (z.z = U + H),
      (z.scaleX = _round$1(K)),
      (z.scaleY = _round$1(Z)),
      (z.rotation = _round$1(X) + W),
      (z.rotationX = _round$1(se) + W),
      (z.rotationY = _round$1(Q) + W),
      (z.skewX = te + W),
      (z.skewY = J + W),
      (z.transformPerspective = ee + H),
      (z.zOrigin = parseFloat(j.split(" ")[2]) || (!B && z.zOrigin) || 0) &&
        (N[_transformOriginProp] = _firstTwoOnly(j)),
      (z.xOffset = z.yOffset = 0),
      (z.force3D = _config.force3D),
      (z.renderTransform = z.svg
        ? _renderSVGTransforms
        : _supports3D
          ? _renderCSSTransforms
          : _renderNon3DTransforms),
      (z.uncache = 0),
      z
    );
  },
  _firstTwoOnly = function (O) {
    return (O = O.split(" "))[0] + " " + O[1];
  },
  _addPxTranslate = function (O, B, z) {
    var N = getUnit(B);
    return (
      _round$1(
        parseFloat(B) + parseFloat(_convertToUnit(O, "x", z + "px", N)),
      ) + N
    );
  },
  _renderNon3DTransforms = function (O, B) {
    ((B.z = "0px"),
      (B.rotationY = B.rotationX = "0deg"),
      (B.force3D = 0),
      _renderCSSTransforms(O, B));
  },
  _zeroDeg = "0deg",
  _zeroPx = "0px",
  _endParenthesis = ") ",
  _renderCSSTransforms = function (O, B) {
    var z = B || this,
      N = z.xPercent,
      G = z.yPercent,
      H = z.x,
      W = z.y,
      q = z.z,
      j = z.rotation,
      Y = z.rotationY,
      re = z.rotationX,
      U = z.skewX,
      K = z.skewY,
      Z = z.scaleX,
      X = z.scaleY,
      se = z.transformPerspective,
      Q = z.force3D,
      te = z.target,
      J = z.zOrigin,
      ee = "",
      ne = (Q === "auto" && O && O !== 1) || Q === !0;
    if (J && (re !== _zeroDeg || Y !== _zeroDeg)) {
      var oe = parseFloat(Y) * _DEG2RAD,
        he = Math.sin(oe),
        ce = Math.cos(oe),
        ue;
      ((oe = parseFloat(re) * _DEG2RAD),
        (ue = Math.cos(oe)),
        (H = _addPxTranslate(te, H, he * ue * -J)),
        (W = _addPxTranslate(te, W, -Math.sin(oe) * -J)),
        (q = _addPxTranslate(te, q, ce * ue * -J + J)));
    }
    (se !== _zeroPx && (ee += "perspective(" + se + _endParenthesis),
      (N || G) && (ee += "translate(" + N + "%, " + G + "%) "),
      (ne || H !== _zeroPx || W !== _zeroPx || q !== _zeroPx) &&
        (ee +=
          q !== _zeroPx || ne
            ? "translate3d(" + H + ", " + W + ", " + q + ") "
            : "translate(" + H + ", " + W + _endParenthesis),
      j !== _zeroDeg && (ee += "rotate(" + j + _endParenthesis),
      Y !== _zeroDeg && (ee += "rotateY(" + Y + _endParenthesis),
      re !== _zeroDeg && (ee += "rotateX(" + re + _endParenthesis),
      (U !== _zeroDeg || K !== _zeroDeg) &&
        (ee += "skew(" + U + ", " + K + _endParenthesis),
      (Z !== 1 || X !== 1) && (ee += "scale(" + Z + ", " + X + _endParenthesis),
      (te.style[_transformProp$1] = ee || "translate(0, 0)"));
  },
  _renderSVGTransforms = function (O, B) {
    var z = B || this,
      N = z.xPercent,
      G = z.yPercent,
      H = z.x,
      W = z.y,
      q = z.rotation,
      j = z.skewX,
      Y = z.skewY,
      re = z.scaleX,
      U = z.scaleY,
      K = z.target,
      Z = z.xOrigin,
      X = z.yOrigin,
      se = z.xOffset,
      Q = z.yOffset,
      te = z.forceCSS,
      J = parseFloat(H),
      ee = parseFloat(W),
      ne,
      oe,
      he,
      ce,
      ue;
    ((q = parseFloat(q)),
      (j = parseFloat(j)),
      (Y = parseFloat(Y)),
      Y && ((Y = parseFloat(Y)), (j += Y), (q += Y)),
      q || j
        ? ((q *= _DEG2RAD),
          (j *= _DEG2RAD),
          (ne = Math.cos(q) * re),
          (oe = Math.sin(q) * re),
          (he = Math.sin(q - j) * -U),
          (ce = Math.cos(q - j) * U),
          j &&
            ((Y *= _DEG2RAD),
            (ue = Math.tan(j - Y)),
            (ue = Math.sqrt(1 + ue * ue)),
            (he *= ue),
            (ce *= ue),
            Y &&
              ((ue = Math.tan(Y)),
              (ue = Math.sqrt(1 + ue * ue)),
              (ne *= ue),
              (oe *= ue))),
          (ne = _round$1(ne)),
          (oe = _round$1(oe)),
          (he = _round$1(he)),
          (ce = _round$1(ce)))
        : ((ne = re), (ce = U), (oe = he = 0)),
      ((J && !~(H + "").indexOf("px")) || (ee && !~(W + "").indexOf("px"))) &&
        ((J = _convertToUnit(K, "x", H, "px")),
        (ee = _convertToUnit(K, "y", W, "px"))),
      (Z || X || se || Q) &&
        ((J = _round$1(J + Z - (Z * ne + X * he) + se)),
        (ee = _round$1(ee + X - (Z * oe + X * ce) + Q))),
      (N || G) &&
        ((ue = K.getBBox()),
        (J = _round$1(J + (N / 100) * ue.width)),
        (ee = _round$1(ee + (G / 100) * ue.height))),
      (ue =
        "matrix(" +
        ne +
        "," +
        oe +
        "," +
        he +
        "," +
        ce +
        "," +
        J +
        "," +
        ee +
        ")"),
      K.setAttribute("transform", ue),
      te && (K.style[_transformProp$1] = ue));
  },
  _addRotationalPropTween = function (O, B, z, N, G) {
    var H = 360,
      W = _isString$1(G),
      q = parseFloat(G) * (W && ~G.indexOf("rad") ? _RAD2DEG : 1),
      j = q - N,
      Y = N + j + "deg",
      re,
      U;
    return (
      W &&
        ((re = G.split("_")[1]),
        re === "short" &&
          ((j %= H), j !== j % (H / 2) && (j += j < 0 ? H : -H)),
        re === "cw" && j < 0
          ? (j = ((j + H * _bigNum) % H) - ~~(j / H) * H)
          : re === "ccw" &&
            j > 0 &&
            (j = ((j - H * _bigNum) % H) - ~~(j / H) * H)),
      (O._pt = U = new PropTween(O._pt, B, z, N, j, _renderPropWithEnd)),
      (U.e = Y),
      (U.u = "deg"),
      O._props.push(z),
      U
    );
  },
  _assign = function (O, B) {
    for (var z in B) O[z] = B[z];
    return O;
  },
  _addRawTransformPTs = function (O, B, z) {
    var N = _assign({}, z._gsap),
      G = "perspective,force3D,transformOrigin,svgOrigin",
      H = z.style,
      W,
      q,
      j,
      Y,
      re,
      U,
      K,
      Z;
    N.svg
      ? ((j = z.getAttribute("transform")),
        z.setAttribute("transform", ""),
        (H[_transformProp$1] = B),
        (W = _parseTransform(z, 1)),
        _removeProperty(z, _transformProp$1),
        z.setAttribute("transform", j))
      : ((j = getComputedStyle(z)[_transformProp$1]),
        (H[_transformProp$1] = B),
        (W = _parseTransform(z, 1)),
        (H[_transformProp$1] = j));
    for (q in _transformProps)
      ((j = N[q]),
        (Y = W[q]),
        j !== Y &&
          G.indexOf(q) < 0 &&
          ((K = getUnit(j)),
          (Z = getUnit(Y)),
          (re = K !== Z ? _convertToUnit(z, q, j, Z) : parseFloat(j)),
          (U = parseFloat(Y)),
          (O._pt = new PropTween(O._pt, W, q, re, U - re, _renderCSSProp)),
          (O._pt.u = Z || 0),
          O._props.push(q)));
    _assign(W, N);
  };
_forEachName("padding,margin,Width,Radius", function (V, O) {
  var B = "Top",
    z = "Right",
    N = "Bottom",
    G = "Left",
    H = (O < 3 ? [B, z, N, G] : [B + G, B + z, N + z, N + G]).map(function (W) {
      return O < 2 ? V + W : "border" + W + V;
    });
  _specialProps[O > 1 ? "border" + V : V] = function (W, q, j, Y, re) {
    var U, K;
    if (arguments.length < 4)
      return (
        (U = H.map(function (Z) {
          return _get(W, Z, j);
        })),
        (K = U.join(" ")),
        K.split(U[0]).length === 5 ? U[0] : K
      );
    ((U = (Y + "").split(" ")),
      (K = {}),
      H.forEach(function (Z, X) {
        return (K[Z] = U[X] = U[X] || U[((X - 1) / 2) | 0]);
      }),
      W.init(q, K, re));
  };
});
var CSSPlugin = {
  name: "css",
  register: _initCore$1,
  targetTest: function (O) {
    return O.style && O.nodeType;
  },
  init: function (O, B, z, N, G) {
    var H = this._props,
      W = O.style,
      q = z.vars.startAt,
      j,
      Y,
      re,
      U,
      K,
      Z,
      X,
      se,
      Q,
      te,
      J,
      ee,
      ne,
      oe,
      he,
      ce;
    (_pluginInitted || _initCore$1(),
      (this.styles = this.styles || _getStyleSaver(O)),
      (ce = this.styles.props),
      (this.tween = z));
    for (X in B)
      if (
        X !== "autoRound" &&
        ((Y = B[X]), !(_plugins[X] && _checkPlugin(X, B, z, N, O, G)))
      ) {
        if (
          ((K = typeof Y),
          (Z = _specialProps[X]),
          K === "function" && ((Y = Y.call(z, N, O, G)), (K = typeof Y)),
          K === "string" && ~Y.indexOf("random(") && (Y = _replaceRandom(Y)),
          Z)
        )
          Z(this, O, X, Y, z) && (he = 1);
        else if (X.substr(0, 2) === "--")
          ((j = (getComputedStyle(O).getPropertyValue(X) + "").trim()),
            (Y += ""),
            (_colorExp.lastIndex = 0),
            _colorExp.test(j) || ((se = getUnit(j)), (Q = getUnit(Y))),
            Q
              ? se !== Q && (j = _convertToUnit(O, X, j, Q) + Q)
              : se && (Y += se),
            this.add(W, "setProperty", j, Y, N, G, 0, 0, X),
            H.push(X),
            ce.push(X, 0, W[X]));
        else if (K !== "undefined") {
          if (
            (q && X in q
              ? ((j = typeof q[X] == "function" ? q[X].call(z, N, O, G) : q[X]),
                _isString$1(j) &&
                  ~j.indexOf("random(") &&
                  (j = _replaceRandom(j)),
                getUnit(j + "") ||
                  j === "auto" ||
                  (j += _config.units[X] || getUnit(_get(O, X)) || ""),
                (j + "").charAt(1) === "=" && (j = _get(O, X)))
              : (j = _get(O, X)),
            (U = parseFloat(j)),
            (te = K === "string" && Y.charAt(1) === "=" && Y.substr(0, 2)),
            te && (Y = Y.substr(2)),
            (re = parseFloat(Y)),
            X in _propertyAliases &&
              (X === "autoAlpha" &&
                (U === 1 && _get(O, "visibility") === "hidden" && re && (U = 0),
                ce.push("visibility", 0, W.visibility),
                _addNonTweeningPT(
                  this,
                  W,
                  "visibility",
                  U ? "inherit" : "hidden",
                  re ? "inherit" : "hidden",
                  !re,
                )),
              X !== "scale" &&
                X !== "transform" &&
                ((X = _propertyAliases[X]),
                ~X.indexOf(",") && (X = X.split(",")[0]))),
            (J = X in _transformProps),
            J)
          ) {
            if (
              (this.styles.save(X),
              ee ||
                ((ne = O._gsap),
                (ne.renderTransform && !B.parseTransform) ||
                  _parseTransform(O, B.parseTransform),
                (oe = B.smoothOrigin !== !1 && ne.smooth),
                (ee = this._pt =
                  new PropTween(
                    this._pt,
                    W,
                    _transformProp$1,
                    0,
                    1,
                    ne.renderTransform,
                    ne,
                    0,
                    -1,
                  )),
                (ee.dep = 1)),
              X === "scale")
            )
              ((this._pt = new PropTween(
                this._pt,
                ne,
                "scaleY",
                ne.scaleY,
                (te ? _parseRelative(ne.scaleY, te + re) : re) - ne.scaleY || 0,
                _renderCSSProp,
              )),
                (this._pt.u = 0),
                H.push("scaleY", X),
                (X += "X"));
            else if (X === "transformOrigin") {
              (ce.push(_transformOriginProp, 0, W[_transformOriginProp]),
                (Y = _convertKeywordsToPercentages(Y)),
                ne.svg
                  ? _applySVGOrigin(O, Y, 0, oe, 0, this)
                  : ((Q = parseFloat(Y.split(" ")[2]) || 0),
                    Q !== ne.zOrigin &&
                      _addNonTweeningPT(this, ne, "zOrigin", ne.zOrigin, Q),
                    _addNonTweeningPT(
                      this,
                      W,
                      X,
                      _firstTwoOnly(j),
                      _firstTwoOnly(Y),
                    )));
              continue;
            } else if (X === "svgOrigin") {
              _applySVGOrigin(O, Y, 1, oe, 0, this);
              continue;
            } else if (X in _rotationalProperties) {
              _addRotationalPropTween(
                this,
                ne,
                X,
                U,
                te ? _parseRelative(U, te + Y) : Y,
              );
              continue;
            } else if (X === "smoothOrigin") {
              _addNonTweeningPT(this, ne, "smooth", ne.smooth, Y);
              continue;
            } else if (X === "force3D") {
              ne[X] = Y;
              continue;
            } else if (X === "transform") {
              _addRawTransformPTs(this, Y, O);
              continue;
            }
          } else X in W || (X = _checkPropPrefix(X) || X);
          if (
            J ||
            ((re || re === 0) &&
              (U || U === 0) &&
              !_complexExp.test(Y) &&
              X in W)
          )
            ((se = (j + "").substr((U + "").length)),
              re || (re = 0),
              (Q = getUnit(Y) || (X in _config.units ? _config.units[X] : se)),
              se !== Q && (U = _convertToUnit(O, X, j, Q)),
              (this._pt = new PropTween(
                this._pt,
                J ? ne : W,
                X,
                U,
                (te ? _parseRelative(U, te + re) : re) - U,
                !J && (Q === "px" || X === "zIndex") && B.autoRound !== !1
                  ? _renderRoundedCSSProp
                  : _renderCSSProp,
              )),
              (this._pt.u = Q || 0),
              se !== Q &&
                Q !== "%" &&
                ((this._pt.b = j), (this._pt.r = _renderCSSPropWithBeginning)));
          else if (X in W)
            _tweenComplexCSSString.call(this, O, X, j, te ? te + Y : Y);
          else if (X in O) this.add(O, X, j || O[X], te ? te + Y : Y, N, G);
          else if (X !== "parseTransform") {
            _missingPlugin(X, Y);
            continue;
          }
          (J || (X in W ? ce.push(X, 0, W[X]) : ce.push(X, 1, j || O[X])),
            H.push(X));
        }
      }
    he && _sortPropTweensByPriority(this);
  },
  render: function (O, B) {
    if (B.tween._time || !_reverting())
      for (var z = B._pt; z; ) (z.r(O, z.d), (z = z._next));
    else B.styles.revert();
  },
  get: _get,
  aliases: _propertyAliases,
  getSetter: function (O, B, z) {
    var N = _propertyAliases[B];
    return (
      N && N.indexOf(",") < 0 && (B = N),
      B in _transformProps &&
      B !== _transformOriginProp &&
      (O._gsap.x || _get(O, "x"))
        ? z && _recentSetterPlugin === z
          ? B === "scale"
            ? _setterScale
            : _setterTransform
          : (_recentSetterPlugin = z || {}) &&
            (B === "scale"
              ? _setterScaleWithRender
              : _setterTransformWithRender)
        : O.style && !_isUndefined(O.style[B])
          ? _setterCSSStyle
          : ~B.indexOf("-")
            ? _setterCSSProp
            : _getSetter(O, B)
    );
  },
  core: { _removeProperty, _getMatrix },
};
gsap$2.utils.checkPrefix = _checkPropPrefix;
gsap$2.core.getStyleSaver = _getStyleSaver;
(function (V, O, B, z) {
  var N = _forEachName(V + "," + O + "," + B, function (G) {
    _transformProps[G] = 1;
  });
  (_forEachName(O, function (G) {
    ((_config.units[G] = "deg"), (_rotationalProperties[G] = 1));
  }),
    (_propertyAliases[N[13]] = V + "," + O),
    _forEachName(z, function (G) {
      var H = G.split(":");
      _propertyAliases[H[1]] = N[H[0]];
    }));
})(
  "x,y,z,scale,scaleX,scaleY,xPercent,yPercent",
  "rotation,rotationX,rotationY,skewX,skewY",
  "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective",
  "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY",
);
_forEachName(
  "x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",
  function (V) {
    _config.units[V] = "px";
  },
);
gsap$2.registerPlugin(CSSPlugin);
var gsapWithCSS = gsap$2.registerPlugin(CSSPlugin) || gsap$2;
gsapWithCSS.core.Tween;
function _defineProperties(V, O) {
  for (var B = 0; B < O.length; B++) {
    var z = O[B];
    ((z.enumerable = z.enumerable || !1),
      (z.configurable = !0),
      "value" in z && (z.writable = !0),
      Object.defineProperty(V, z.key, z));
  }
}
function _createClass(V, O, B) {
  return (O && _defineProperties(V.prototype, O), V);
}
/*!
 * Observer 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */ var gsap$1,
  _coreInitted$1,
  _win$1,
  _doc$1,
  _docEl$1,
  _body$1,
  _isTouch,
  _pointerType,
  ScrollTrigger$1,
  _root$1,
  _normalizer$1,
  _eventTypes,
  _context$1,
  _getGSAP$1 = function () {
    return (
      gsap$1 ||
      (typeof window < "u" &&
        (gsap$1 = window.gsap) &&
        gsap$1.registerPlugin &&
        gsap$1)
    );
  },
  _startup$1 = 1,
  _observers = [],
  _scrollers = [],
  _proxies = [],
  _getTime$1 = Date.now,
  _bridge = function (O, B) {
    return B;
  },
  _integrate = function () {
    var O = ScrollTrigger$1.core,
      B = O.bridge || {},
      z = O._scrollers,
      N = O._proxies;
    (z.push.apply(z, _scrollers),
      N.push.apply(N, _proxies),
      (_scrollers = z),
      (_proxies = N),
      (_bridge = function (H, W) {
        return B[H](W);
      }));
  },
  _getProxyProp = function (O, B) {
    return ~_proxies.indexOf(O) && _proxies[_proxies.indexOf(O) + 1][B];
  },
  _isViewport$1 = function (O) {
    return !!~_root$1.indexOf(O);
  },
  _addListener$1 = function (O, B, z, N, G) {
    return O.addEventListener(B, z, { passive: N !== !1, capture: !!G });
  },
  _removeListener$1 = function (O, B, z, N) {
    return O.removeEventListener(B, z, !!N);
  },
  _scrollLeft = "scrollLeft",
  _scrollTop = "scrollTop",
  _onScroll$1 = function () {
    return (_normalizer$1 && _normalizer$1.isPressed) || _scrollers.cache++;
  },
  _scrollCacheFunc = function (O, B) {
    var z = function N(G) {
      if (G || G === 0) {
        _startup$1 && (_win$1.history.scrollRestoration = "manual");
        var H = _normalizer$1 && _normalizer$1.isPressed;
        ((G = N.v =
          Math.round(G) || (_normalizer$1 && _normalizer$1.iOS ? 1 : 0)),
          O(G),
          (N.cacheID = _scrollers.cache),
          H && _bridge("ss", G));
      } else
        (B || _scrollers.cache !== N.cacheID || _bridge("ref")) &&
          ((N.cacheID = _scrollers.cache), (N.v = O()));
      return N.v + N.offset;
    };
    return ((z.offset = 0), O && z);
  },
  _horizontal = {
    s: _scrollLeft,
    p: "left",
    p2: "Left",
    os: "right",
    os2: "Right",
    d: "width",
    d2: "Width",
    a: "x",
    sc: _scrollCacheFunc(function (V) {
      return arguments.length
        ? _win$1.scrollTo(V, _vertical.sc())
        : _win$1.pageXOffset ||
            _doc$1[_scrollLeft] ||
            _docEl$1[_scrollLeft] ||
            _body$1[_scrollLeft] ||
            0;
    }),
  },
  _vertical = {
    s: _scrollTop,
    p: "top",
    p2: "Top",
    os: "bottom",
    os2: "Bottom",
    d: "height",
    d2: "Height",
    a: "y",
    op: _horizontal,
    sc: _scrollCacheFunc(function (V) {
      return arguments.length
        ? _win$1.scrollTo(_horizontal.sc(), V)
        : _win$1.pageYOffset ||
            _doc$1[_scrollTop] ||
            _docEl$1[_scrollTop] ||
            _body$1[_scrollTop] ||
            0;
    }),
  },
  _getTarget = function (O, B) {
    return (
      ((B && B._ctx && B._ctx.selector) || gsap$1.utils.toArray)(O)[0] ||
      (typeof O == "string" && gsap$1.config().nullTargetWarn !== !1
        ? console.warn("Element not found:", O)
        : null)
    );
  },
  _getScrollFunc = function (O, B) {
    var z = B.s,
      N = B.sc;
    _isViewport$1(O) && (O = _doc$1.scrollingElement || _docEl$1);
    var G = _scrollers.indexOf(O),
      H = N === _vertical.sc ? 1 : 2;
    (!~G && (G = _scrollers.push(O) - 1),
      _scrollers[G + H] || _addListener$1(O, "scroll", _onScroll$1));
    var W = _scrollers[G + H],
      q =
        W ||
        (_scrollers[G + H] =
          _scrollCacheFunc(_getProxyProp(O, z), !0) ||
          (_isViewport$1(O)
            ? N
            : _scrollCacheFunc(function (j) {
                return arguments.length ? (O[z] = j) : O[z];
              })));
    return (
      (q.target = O),
      W || (q.smooth = gsap$1.getProperty(O, "scrollBehavior") === "smooth"),
      q
    );
  },
  _getVelocityProp = function (O, B, z) {
    var N = O,
      G = O,
      H = _getTime$1(),
      W = H,
      q = B || 50,
      j = Math.max(500, q * 3),
      Y = function (Z, X) {
        var se = _getTime$1();
        X || se - H > q
          ? ((G = N), (N = Z), (W = H), (H = se))
          : z
            ? (N += Z)
            : (N = G + ((Z - G) / (se - W)) * (H - W));
      },
      re = function () {
        ((G = N = z ? 0 : N), (W = H = 0));
      },
      U = function (Z) {
        var X = W,
          se = G,
          Q = _getTime$1();
        return (
          (Z || Z === 0) && Z !== N && Y(Z),
          H === W || Q - W > j
            ? 0
            : ((N + (z ? se : -se)) / ((z ? Q : H) - X)) * 1e3
        );
      };
    return { update: Y, reset: re, getVelocity: U };
  },
  _getEvent = function (O, B) {
    return (
      B && !O._gsapAllow && O.preventDefault(),
      O.changedTouches ? O.changedTouches[0] : O
    );
  },
  _getAbsoluteMax = function (O) {
    var B = Math.max.apply(Math, O),
      z = Math.min.apply(Math, O);
    return Math.abs(B) >= Math.abs(z) ? B : z;
  },
  _setScrollTrigger = function () {
    ((ScrollTrigger$1 = gsap$1.core.globals().ScrollTrigger),
      ScrollTrigger$1 && ScrollTrigger$1.core && _integrate());
  },
  _initCore = function (O) {
    return (
      (gsap$1 = O || _getGSAP$1()),
      !_coreInitted$1 &&
        gsap$1 &&
        typeof document < "u" &&
        document.body &&
        ((_win$1 = window),
        (_doc$1 = document),
        (_docEl$1 = _doc$1.documentElement),
        (_body$1 = _doc$1.body),
        (_root$1 = [_win$1, _doc$1, _docEl$1, _body$1]),
        gsap$1.utils.clamp,
        (_context$1 = gsap$1.core.context || function () {}),
        (_pointerType = "onpointerenter" in _body$1 ? "pointer" : "mouse"),
        (_isTouch = Observer.isTouch =
          _win$1.matchMedia &&
          _win$1.matchMedia("(hover: none), (pointer: coarse)").matches
            ? 1
            : "ontouchstart" in _win$1 ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0
              ? 2
              : 0),
        (_eventTypes = Observer.eventTypes =
          (
            "ontouchstart" in _docEl$1
              ? "touchstart,touchmove,touchcancel,touchend"
              : "onpointerdown" in _docEl$1
                ? "pointerdown,pointermove,pointercancel,pointerup"
                : "mousedown,mousemove,mouseup,mouseup"
          ).split(",")),
        setTimeout(function () {
          return (_startup$1 = 0);
        }, 500),
        _setScrollTrigger(),
        (_coreInitted$1 = 1)),
      _coreInitted$1
    );
  };
_horizontal.op = _vertical;
_scrollers.cache = 0;
var Observer = (function () {
  function V(B) {
    this.init(B);
  }
  var O = V.prototype;
  return (
    (O.init = function (z) {
      (_coreInitted$1 ||
        _initCore(gsap$1) ||
        console.warn("Please gsap.registerPlugin(Observer)"),
        ScrollTrigger$1 || _setScrollTrigger());
      var N = z.tolerance,
        G = z.dragMinimum,
        H = z.type,
        W = z.target,
        q = z.lineHeight,
        j = z.debounce,
        Y = z.preventDefault,
        re = z.onStop,
        U = z.onStopDelay,
        K = z.ignore,
        Z = z.wheelSpeed,
        X = z.event,
        se = z.onDragStart,
        Q = z.onDragEnd,
        te = z.onDrag,
        J = z.onPress,
        ee = z.onRelease,
        ne = z.onRight,
        oe = z.onLeft,
        he = z.onUp,
        ce = z.onDown,
        ue = z.onChangeX,
        ge = z.onChangeY,
        ye = z.onChange,
        me = z.onToggleX,
        be = z.onToggleY,
        Se = z.onHover,
        _e = z.onHoverEnd,
        le = z.onMove,
        pe = z.ignoreCheck,
        ie = z.isNormalizer,
        ae = z.onGestureStart,
        fe = z.onGestureEnd,
        de = z.onWheel,
        xe = z.onEnable,
        we = z.onDisable,
        Ee = z.onClick,
        Me = z.scrollSpeed,
        Ie = z.capture,
        Oe = z.allowClicks,
        Ge = z.lockAxis,
        We = z.onLockAxis;
      ((this.target = W = _getTarget(W) || _docEl$1),
        (this.vars = z),
        K && (K = gsap$1.utils.toArray(K)),
        (N = N || 1e-9),
        (G = G || 0),
        (Z = Z || 1),
        (Me = Me || 1),
        (H = H || "wheel,touch,pointer"),
        (j = j !== !1),
        q ||
          (q = parseFloat(_win$1.getComputedStyle(_body$1).lineHeight) || 22));
      var Ze,
        ze,
        Ye,
        Ae,
        Pe,
        Ue,
        Qe,
        ve = this,
        Xe = 0,
        st = 0,
        at = z.passive || !Y,
        Be = _getScrollFunc(W, _horizontal),
        ht = _getScrollFunc(W, _vertical),
        ut = Be(),
        ot = ht(),
        qe =
          ~H.indexOf("touch") &&
          !~H.indexOf("pointer") &&
          _eventTypes[0] === "pointerdown",
        rt = _isViewport$1(W),
        He = W.ownerDocument || _doc$1,
        dt = [0, 0, 0],
        ft = [0, 0, 0],
        vt = 0,
        Bt = function () {
          return (vt = _getTime$1());
        },
        it = function (Fe, Ne) {
          return (
            ((ve.event = Fe) && K && ~K.indexOf(Fe.target)) ||
            (Ne && qe && Fe.pointerType !== "touch") ||
            (pe && pe(Fe, Ne))
          );
        },
        Ht = function () {
          (ve._vx.reset(), ve._vy.reset(), ze.pause(), re && re(ve));
        },
        kt = function () {
          var Fe = (ve.deltaX = _getAbsoluteMax(dt)),
            Ne = (ve.deltaY = _getAbsoluteMax(ft)),
            Te = Math.abs(Fe) >= N,
            Re = Math.abs(Ne) >= N;
          (ye && (Te || Re) && ye(ve, Fe, Ne, dt, ft),
            Te &&
              (ne && ve.deltaX > 0 && ne(ve),
              oe && ve.deltaX < 0 && oe(ve),
              ue && ue(ve),
              me && ve.deltaX < 0 != Xe < 0 && me(ve),
              (Xe = ve.deltaX),
              (dt[0] = dt[1] = dt[2] = 0)),
            Re &&
              (ce && ve.deltaY > 0 && ce(ve),
              he && ve.deltaY < 0 && he(ve),
              ge && ge(ve),
              be && ve.deltaY < 0 != st < 0 && be(ve),
              (st = ve.deltaY),
              (ft[0] = ft[1] = ft[2] = 0)),
            (Ae || Ye) && (le && le(ve), Ye && (te(ve), (Ye = !1)), (Ae = !1)),
            Ue && !(Ue = !1) && We && We(ve),
            Pe && (de(ve), (Pe = !1)),
            (Ze = 0));
        },
        Rt = function (Fe, Ne, Te) {
          ((dt[Te] += Fe),
            (ft[Te] += Ne),
            ve._vx.update(Fe),
            ve._vy.update(Ne),
            j ? Ze || (Ze = requestAnimationFrame(kt)) : kt());
        },
        Ot = function (Fe, Ne) {
          (Ge &&
            !Qe &&
            ((ve.axis = Qe = Math.abs(Fe) > Math.abs(Ne) ? "x" : "y"),
            (Ue = !0)),
            Qe !== "y" && ((dt[2] += Fe), ve._vx.update(Fe, !0)),
            Qe !== "x" && ((ft[2] += Ne), ve._vy.update(Ne, !0)),
            j ? Ze || (Ze = requestAnimationFrame(kt)) : kt());
        },
        Mt = function (Fe) {
          if (!it(Fe, 1)) {
            Fe = _getEvent(Fe, Y);
            var Ne = Fe.clientX,
              Te = Fe.clientY,
              Re = Ne - ve.x,
              ke = Te - ve.y,
              De = ve.isDragging;
            ((ve.x = Ne),
              (ve.y = Te),
              (De ||
                Math.abs(ve.startX - Ne) >= G ||
                Math.abs(ve.startY - Te) >= G) &&
                (te && (Ye = !0),
                De || (ve.isDragging = !0),
                Ot(Re, ke),
                De || (se && se(ve))));
          }
        },
        Ft = (ve.onPress = function (Le) {
          it(Le, 1) ||
            (Le && Le.button) ||
            ((ve.axis = Qe = null),
            ze.pause(),
            (ve.isPressed = !0),
            (Le = _getEvent(Le)),
            (Xe = st = 0),
            (ve.startX = ve.x = Le.clientX),
            (ve.startY = ve.y = Le.clientY),
            ve._vx.reset(),
            ve._vy.reset(),
            _addListener$1(ie ? W : He, _eventTypes[1], Mt, at, !0),
            (ve.deltaX = ve.deltaY = 0),
            J && J(ve));
        }),
        Ve = (ve.onRelease = function (Le) {
          if (!it(Le, 1)) {
            _removeListener$1(ie ? W : He, _eventTypes[1], Mt, !0);
            var Fe = !isNaN(ve.y - ve.startY),
              Ne = ve.isDragging,
              Te =
                Ne &&
                (Math.abs(ve.x - ve.startX) > 3 ||
                  Math.abs(ve.y - ve.startY) > 3),
              Re = _getEvent(Le);
            (!Te &&
              Fe &&
              (ve._vx.reset(),
              ve._vy.reset(),
              Y &&
                Oe &&
                gsap$1.delayedCall(0.08, function () {
                  if (_getTime$1() - vt > 300 && !Le.defaultPrevented) {
                    if (Le.target.click) Le.target.click();
                    else if (He.createEvent) {
                      var ke = He.createEvent("MouseEvents");
                      (ke.initMouseEvent(
                        "click",
                        !0,
                        !0,
                        _win$1,
                        1,
                        Re.screenX,
                        Re.screenY,
                        Re.clientX,
                        Re.clientY,
                        !1,
                        !1,
                        !1,
                        !1,
                        0,
                        null,
                      ),
                        Le.target.dispatchEvent(ke));
                    }
                  }
                })),
              (ve.isDragging = ve.isGesturing = ve.isPressed = !1),
              re && Ne && !ie && ze.restart(!0),
              Q && Ne && Q(ve),
              ee && ee(ve, Te));
          }
        }),
        It = function (Fe) {
          return (
            Fe.touches &&
            Fe.touches.length > 1 &&
            (ve.isGesturing = !0) &&
            ae(Fe, ve.isDragging)
          );
        },
        St = function () {
          return (ve.isGesturing = !1) || fe(ve);
        },
        xt = function (Fe) {
          if (!it(Fe)) {
            var Ne = Be(),
              Te = ht();
            (Rt((Ne - ut) * Me, (Te - ot) * Me, 1),
              (ut = Ne),
              (ot = Te),
              re && ze.restart(!0));
          }
        },
        Pt = function (Fe) {
          if (!it(Fe)) {
            ((Fe = _getEvent(Fe, Y)), de && (Pe = !0));
            var Ne =
              (Fe.deltaMode === 1
                ? q
                : Fe.deltaMode === 2
                  ? _win$1.innerHeight
                  : 1) * Z;
            (Rt(Fe.deltaX * Ne, Fe.deltaY * Ne, 0),
              re && !ie && ze.restart(!0));
          }
        },
        Dt = function (Fe) {
          if (!it(Fe)) {
            var Ne = Fe.clientX,
              Te = Fe.clientY,
              Re = Ne - ve.x,
              ke = Te - ve.y;
            ((ve.x = Ne),
              (ve.y = Te),
              (Ae = !0),
              re && ze.restart(!0),
              (Re || ke) && Ot(Re, ke));
          }
        },
        Vt = function (Fe) {
          ((ve.event = Fe), Se(ve));
        },
        At = function (Fe) {
          ((ve.event = Fe), _e(ve));
        },
        $t = function (Fe) {
          return it(Fe) || (_getEvent(Fe, Y) && Ee(ve));
        };
      ((ze = ve._dc = gsap$1.delayedCall(U || 0.25, Ht).pause()),
        (ve.deltaX = ve.deltaY = 0),
        (ve._vx = _getVelocityProp(0, 50, !0)),
        (ve._vy = _getVelocityProp(0, 50, !0)),
        (ve.scrollX = Be),
        (ve.scrollY = ht),
        (ve.isDragging = ve.isGesturing = ve.isPressed = !1),
        _context$1(this),
        (ve.enable = function (Le) {
          return (
            ve.isEnabled ||
              (_addListener$1(rt ? He : W, "scroll", _onScroll$1),
              H.indexOf("scroll") >= 0 &&
                _addListener$1(rt ? He : W, "scroll", xt, at, Ie),
              H.indexOf("wheel") >= 0 && _addListener$1(W, "wheel", Pt, at, Ie),
              ((H.indexOf("touch") >= 0 && _isTouch) ||
                H.indexOf("pointer") >= 0) &&
                (_addListener$1(W, _eventTypes[0], Ft, at, Ie),
                _addListener$1(He, _eventTypes[2], Ve),
                _addListener$1(He, _eventTypes[3], Ve),
                Oe && _addListener$1(W, "click", Bt, !0, !0),
                Ee && _addListener$1(W, "click", $t),
                ae && _addListener$1(He, "gesturestart", It),
                fe && _addListener$1(He, "gestureend", St),
                Se && _addListener$1(W, _pointerType + "enter", Vt),
                _e && _addListener$1(W, _pointerType + "leave", At),
                le && _addListener$1(W, _pointerType + "move", Dt)),
              (ve.isEnabled = !0),
              Le && Le.type && Ft(Le),
              xe && xe(ve)),
            ve
          );
        }),
        (ve.disable = function () {
          ve.isEnabled &&
            (_observers.filter(function (Le) {
              return Le !== ve && _isViewport$1(Le.target);
            }).length || _removeListener$1(rt ? He : W, "scroll", _onScroll$1),
            ve.isPressed &&
              (ve._vx.reset(),
              ve._vy.reset(),
              _removeListener$1(ie ? W : He, _eventTypes[1], Mt, !0)),
            _removeListener$1(rt ? He : W, "scroll", xt, Ie),
            _removeListener$1(W, "wheel", Pt, Ie),
            _removeListener$1(W, _eventTypes[0], Ft, Ie),
            _removeListener$1(He, _eventTypes[2], Ve),
            _removeListener$1(He, _eventTypes[3], Ve),
            _removeListener$1(W, "click", Bt, !0),
            _removeListener$1(W, "click", $t),
            _removeListener$1(He, "gesturestart", It),
            _removeListener$1(He, "gestureend", St),
            _removeListener$1(W, _pointerType + "enter", Vt),
            _removeListener$1(W, _pointerType + "leave", At),
            _removeListener$1(W, _pointerType + "move", Dt),
            (ve.isEnabled = ve.isPressed = ve.isDragging = !1),
            we && we(ve));
        }),
        (ve.kill = ve.revert =
          function () {
            ve.disable();
            var Le = _observers.indexOf(ve);
            (Le >= 0 && _observers.splice(Le, 1),
              _normalizer$1 === ve && (_normalizer$1 = 0));
          }),
        _observers.push(ve),
        ie && _isViewport$1(W) && (_normalizer$1 = ve),
        ve.enable(X));
    }),
    _createClass(V, [
      {
        key: "velocityX",
        get: function () {
          return this._vx.getVelocity();
        },
      },
      {
        key: "velocityY",
        get: function () {
          return this._vy.getVelocity();
        },
      },
    ]),
    V
  );
})();
Observer.version = "3.12.5";
Observer.create = function (V) {
  return new Observer(V);
};
Observer.register = _initCore;
Observer.getAll = function () {
  return _observers.slice();
};
Observer.getById = function (V) {
  return _observers.filter(function (O) {
    return O.vars.id === V;
  })[0];
};
_getGSAP$1() && gsap$1.registerPlugin(Observer);
/*!
 * ScrollTrigger 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */ var gsap,
  _coreInitted,
  _win,
  _doc,
  _docEl,
  _body,
  _root,
  _resizeDelay,
  _toArray,
  _clamp,
  _time2,
  _syncInterval,
  _refreshing,
  _pointerIsDown,
  _transformProp,
  _i,
  _prevWidth,
  _prevHeight,
  _autoRefresh,
  _sort,
  _suppressOverwrites,
  _ignoreResize,
  _normalizer,
  _ignoreMobileResize,
  _baseScreenHeight,
  _baseScreenWidth,
  _fixIOSBug,
  _context,
  _scrollRestoration,
  _div100vh,
  _100vh,
  _isReverted,
  _clampingMax,
  _limitCallbacks,
  _startup = 1,
  _getTime = Date.now,
  _time1 = _getTime(),
  _lastScrollTime = 0,
  _enabled = 0,
  _parseClamp = function (O, B, z) {
    var N =
      _isString(O) && (O.substr(0, 6) === "clamp(" || O.indexOf("max") > -1);
    return ((z["_" + B + "Clamp"] = N), N ? O.substr(6, O.length - 7) : O);
  },
  _keepClamp = function (O, B) {
    return B && (!_isString(O) || O.substr(0, 6) !== "clamp(")
      ? "clamp(" + O + ")"
      : O;
  },
  _rafBugFix = function V() {
    return _enabled && requestAnimationFrame(V);
  },
  _pointerDownHandler = function () {
    return (_pointerIsDown = 1);
  },
  _pointerUpHandler = function () {
    return (_pointerIsDown = 0);
  },
  _passThrough = function (O) {
    return O;
  },
  _round = function (O) {
    return Math.round(O * 1e5) / 1e5 || 0;
  },
  _windowExists = function () {
    return typeof window < "u";
  },
  _getGSAP = function () {
    return (
      gsap ||
      (_windowExists() && (gsap = window.gsap) && gsap.registerPlugin && gsap)
    );
  },
  _isViewport = function (O) {
    return !!~_root.indexOf(O);
  },
  _getViewportDimension = function (O) {
    return (
      (O === "Height" ? _100vh : _win["inner" + O]) ||
      _docEl["client" + O] ||
      _body["client" + O]
    );
  },
  _getBoundsFunc = function (O) {
    return (
      _getProxyProp(O, "getBoundingClientRect") ||
      (_isViewport(O)
        ? function () {
            return (
              (_winOffsets.width = _win.innerWidth),
              (_winOffsets.height = _100vh),
              _winOffsets
            );
          }
        : function () {
            return _getBounds(O);
          })
    );
  },
  _getSizeFunc = function (O, B, z) {
    var N = z.d,
      G = z.d2,
      H = z.a;
    return (H = _getProxyProp(O, "getBoundingClientRect"))
      ? function () {
          return H()[N];
        }
      : function () {
          return (B ? _getViewportDimension(G) : O["client" + G]) || 0;
        };
  },
  _getOffsetsFunc = function (O, B) {
    return !B || ~_proxies.indexOf(O)
      ? _getBoundsFunc(O)
      : function () {
          return _winOffsets;
        };
  },
  _maxScroll = function (O, B) {
    var z = B.s,
      N = B.d2,
      G = B.d,
      H = B.a;
    return Math.max(
      0,
      (z = "scroll" + N) && (H = _getProxyProp(O, z))
        ? H() - _getBoundsFunc(O)()[G]
        : _isViewport(O)
          ? (_docEl[z] || _body[z]) - _getViewportDimension(N)
          : O[z] - O["offset" + N],
    );
  },
  _iterateAutoRefresh = function (O, B) {
    for (var z = 0; z < _autoRefresh.length; z += 3)
      (!B || ~B.indexOf(_autoRefresh[z + 1])) &&
        O(_autoRefresh[z], _autoRefresh[z + 1], _autoRefresh[z + 2]);
  },
  _isString = function (O) {
    return typeof O == "string";
  },
  _isFunction = function (O) {
    return typeof O == "function";
  },
  _isNumber = function (O) {
    return typeof O == "number";
  },
  _isObject = function (O) {
    return typeof O == "object";
  },
  _endAnimation = function (O, B, z) {
    return O && O.progress(B ? 0 : 1) && z && O.pause();
  },
  _callback = function (O, B) {
    if (O.enabled) {
      var z = O._ctx
        ? O._ctx.add(function () {
            return B(O);
          })
        : B(O);
      z && z.totalTime && (O.callbackAnimation = z);
    }
  },
  _abs = Math.abs,
  _left = "left",
  _top = "top",
  _right = "right",
  _bottom = "bottom",
  _width = "width",
  _height = "height",
  _Right = "Right",
  _Left = "Left",
  _Top = "Top",
  _Bottom = "Bottom",
  _padding = "padding",
  _margin = "margin",
  _Width = "Width",
  _Height = "Height",
  _px = "px",
  _getComputedStyle = function (O) {
    return _win.getComputedStyle(O);
  },
  _makePositionable = function (O) {
    var B = _getComputedStyle(O).position;
    O.style.position = B === "absolute" || B === "fixed" ? B : "relative";
  },
  _setDefaults = function (O, B) {
    for (var z in B) z in O || (O[z] = B[z]);
    return O;
  },
  _getBounds = function (O, B) {
    var z =
        B &&
        _getComputedStyle(O)[_transformProp] !== "matrix(1, 0, 0, 1, 0, 0)" &&
        gsap
          .to(O, {
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            skewX: 0,
            skewY: 0,
          })
          .progress(1),
      N = O.getBoundingClientRect();
    return (z && z.progress(0).kill(), N);
  },
  _getSize = function (O, B) {
    var z = B.d2;
    return O["offset" + z] || O["client" + z] || 0;
  },
  _getLabelRatioArray = function (O) {
    var B = [],
      z = O.labels,
      N = O.duration(),
      G;
    for (G in z) B.push(z[G] / N);
    return B;
  },
  _getClosestLabel = function (O) {
    return function (B) {
      return gsap.utils.snap(_getLabelRatioArray(O), B);
    };
  },
  _snapDirectional = function (O) {
    var B = gsap.utils.snap(O),
      z =
        Array.isArray(O) &&
        O.slice(0).sort(function (N, G) {
          return N - G;
        });
    return z
      ? function (N, G, H) {
          H === void 0 && (H = 0.001);
          var W;
          if (!G) return B(N);
          if (G > 0) {
            for (N -= H, W = 0; W < z.length; W++) if (z[W] >= N) return z[W];
            return z[W - 1];
          } else for (W = z.length, N += H; W--; ) if (z[W] <= N) return z[W];
          return z[0];
        }
      : function (N, G, H) {
          H === void 0 && (H = 0.001);
          var W = B(N);
          return !G || Math.abs(W - N) < H || W - N < 0 == G < 0
            ? W
            : B(G < 0 ? N - O : N + O);
        };
  },
  _getLabelAtDirection = function (O) {
    return function (B, z) {
      return _snapDirectional(_getLabelRatioArray(O))(B, z.direction);
    };
  },
  _multiListener = function (O, B, z, N) {
    return z.split(",").forEach(function (G) {
      return O(B, G, N);
    });
  },
  _addListener = function (O, B, z, N, G) {
    return O.addEventListener(B, z, { passive: !N, capture: !!G });
  },
  _removeListener = function (O, B, z, N) {
    return O.removeEventListener(B, z, !!N);
  },
  _wheelListener = function (O, B, z) {
    ((z = z && z.wheelHandler), z && (O(B, "wheel", z), O(B, "touchmove", z)));
  },
  _markerDefaults = {
    startColor: "green",
    endColor: "red",
    indent: 0,
    fontSize: "16px",
    fontWeight: "normal",
  },
  _defaults = { toggleActions: "play", anticipatePin: 0 },
  _keywords = { top: 0, left: 0, center: 0.5, bottom: 1, right: 1 },
  _offsetToPx = function (O, B) {
    if (_isString(O)) {
      var z = O.indexOf("="),
        N = ~z ? +(O.charAt(z - 1) + 1) * parseFloat(O.substr(z + 1)) : 0;
      (~z && (O.indexOf("%") > z && (N *= B / 100), (O = O.substr(0, z - 1))),
        (O =
          N +
          (O in _keywords
            ? _keywords[O] * B
            : ~O.indexOf("%")
              ? (parseFloat(O) * B) / 100
              : parseFloat(O) || 0)));
    }
    return O;
  },
  _createMarker = function (O, B, z, N, G, H, W, q) {
    var j = G.startColor,
      Y = G.endColor,
      re = G.fontSize,
      U = G.indent,
      K = G.fontWeight,
      Z = _doc.createElement("div"),
      X = _isViewport(z) || _getProxyProp(z, "pinType") === "fixed",
      se = O.indexOf("scroller") !== -1,
      Q = X ? _body : z,
      te = O.indexOf("start") !== -1,
      J = te ? j : Y,
      ee =
        "border-color:" +
        J +
        ";font-size:" +
        re +
        ";color:" +
        J +
        ";font-weight:" +
        K +
        ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
    return (
      (ee += "position:" + ((se || q) && X ? "fixed;" : "absolute;")),
      (se || q || !X) &&
        (ee +=
          (N === _vertical ? _right : _bottom) +
          ":" +
          (H + parseFloat(U)) +
          "px;"),
      W &&
        (ee +=
          "box-sizing:border-box;text-align:left;width:" +
          W.offsetWidth +
          "px;"),
      (Z._isStart = te),
      Z.setAttribute("class", "gsap-marker-" + O + (B ? " marker-" + B : "")),
      (Z.style.cssText = ee),
      (Z.innerText = B || B === 0 ? O + "-" + B : O),
      Q.children[0] ? Q.insertBefore(Z, Q.children[0]) : Q.appendChild(Z),
      (Z._offset = Z["offset" + N.op.d2]),
      _positionMarker(Z, 0, N, te),
      Z
    );
  },
  _positionMarker = function (O, B, z, N) {
    var G = { display: "block" },
      H = z[N ? "os2" : "p2"],
      W = z[N ? "p2" : "os2"];
    ((O._isFlipped = N),
      (G[z.a + "Percent"] = N ? -100 : 0),
      (G[z.a] = N ? "1px" : 0),
      (G["border" + H + _Width] = 1),
      (G["border" + W + _Width] = 0),
      (G[z.p] = B + "px"),
      gsap.set(O, G));
  },
  _triggers = [],
  _ids = {},
  _rafID,
  _sync = function () {
    return (
      _getTime() - _lastScrollTime > 34 &&
      (_rafID || (_rafID = requestAnimationFrame(_updateAll)))
    );
  },
  _onScroll = function () {
    (!_normalizer ||
      !_normalizer.isPressed ||
      _normalizer.startX > _body.clientWidth) &&
      (_scrollers.cache++,
      _normalizer
        ? _rafID || (_rafID = requestAnimationFrame(_updateAll))
        : _updateAll(),
      _lastScrollTime || _dispatch("scrollStart"),
      (_lastScrollTime = _getTime()));
  },
  _setBaseDimensions = function () {
    ((_baseScreenWidth = _win.innerWidth),
      (_baseScreenHeight = _win.innerHeight));
  },
  _onResize = function () {
    (_scrollers.cache++,
      !_refreshing &&
        !_ignoreResize &&
        !_doc.fullscreenElement &&
        !_doc.webkitFullscreenElement &&
        (!_ignoreMobileResize ||
          _baseScreenWidth !== _win.innerWidth ||
          Math.abs(_win.innerHeight - _baseScreenHeight) >
            _win.innerHeight * 0.25) &&
        _resizeDelay.restart(!0));
  },
  _listeners = {},
  _emptyArray = [],
  _softRefresh = function V() {
    return _removeListener(ScrollTrigger, "scrollEnd", V) || _refreshAll(!0);
  },
  _dispatch = function (O) {
    return (
      (_listeners[O] &&
        _listeners[O].map(function (B) {
          return B();
        })) ||
      _emptyArray
    );
  },
  _savedStyles = [],
  _revertRecorded = function (O) {
    for (var B = 0; B < _savedStyles.length; B += 5)
      (!O || (_savedStyles[B + 4] && _savedStyles[B + 4].query === O)) &&
        ((_savedStyles[B].style.cssText = _savedStyles[B + 1]),
        _savedStyles[B].getBBox &&
          _savedStyles[B].setAttribute("transform", _savedStyles[B + 2] || ""),
        (_savedStyles[B + 3].uncache = 1));
  },
  _revertAll = function (O, B) {
    var z;
    for (_i = 0; _i < _triggers.length; _i++)
      ((z = _triggers[_i]),
        z && (!B || z._ctx === B) && (O ? z.kill(1) : z.revert(!0, !0)));
    ((_isReverted = !0), B && _revertRecorded(B), B || _dispatch("revert"));
  },
  _clearScrollMemory = function (O, B) {
    (_scrollers.cache++,
      (B || !_refreshingAll) &&
        _scrollers.forEach(function (z) {
          return _isFunction(z) && z.cacheID++ && (z.rec = 0);
        }),
      _isString(O) &&
        (_win.history.scrollRestoration = _scrollRestoration = O));
  },
  _refreshingAll,
  _refreshID = 0,
  _queueRefreshID,
  _queueRefreshAll = function () {
    if (_queueRefreshID !== _refreshID) {
      var O = (_queueRefreshID = _refreshID);
      requestAnimationFrame(function () {
        return O === _refreshID && _refreshAll(!0);
      });
    }
  },
  _refresh100vh = function () {
    (_body.appendChild(_div100vh),
      (_100vh = (!_normalizer && _div100vh.offsetHeight) || _win.innerHeight),
      _body.removeChild(_div100vh));
  },
  _hideAllMarkers = function (O) {
    return _toArray(
      ".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end",
    ).forEach(function (B) {
      return (B.style.display = O ? "none" : "block");
    });
  },
  _refreshAll = function (O, B) {
    if (_lastScrollTime && !O && !_isReverted) {
      _addListener(ScrollTrigger, "scrollEnd", _softRefresh);
      return;
    }
    (_refresh100vh(),
      (_refreshingAll = ScrollTrigger.isRefreshing = !0),
      _scrollers.forEach(function (N) {
        return _isFunction(N) && ++N.cacheID && (N.rec = N());
      }));
    var z = _dispatch("refreshInit");
    (_sort && ScrollTrigger.sort(),
      B || _revertAll(),
      _scrollers.forEach(function (N) {
        _isFunction(N) &&
          (N.smooth && (N.target.style.scrollBehavior = "auto"), N(0));
      }),
      _triggers.slice(0).forEach(function (N) {
        return N.refresh();
      }),
      (_isReverted = !1),
      _triggers.forEach(function (N) {
        if (N._subPinOffset && N.pin) {
          var G = N.vars.horizontal ? "offsetWidth" : "offsetHeight",
            H = N.pin[G];
          (N.revert(!0, 1), N.adjustPinSpacing(N.pin[G] - H), N.refresh());
        }
      }),
      (_clampingMax = 1),
      _hideAllMarkers(!0),
      _triggers.forEach(function (N) {
        var G = _maxScroll(N.scroller, N._dir),
          H = N.vars.end === "max" || (N._endClamp && N.end > G),
          W = N._startClamp && N.start >= G;
        (H || W) &&
          N.setPositions(
            W ? G - 1 : N.start,
            H ? Math.max(W ? G : N.start + 1, G) : N.end,
            !0,
          );
      }),
      _hideAllMarkers(!1),
      (_clampingMax = 0),
      z.forEach(function (N) {
        return N && N.render && N.render(-1);
      }),
      _scrollers.forEach(function (N) {
        _isFunction(N) &&
          (N.smooth &&
            requestAnimationFrame(function () {
              return (N.target.style.scrollBehavior = "smooth");
            }),
          N.rec && N(N.rec));
      }),
      _clearScrollMemory(_scrollRestoration, 1),
      _resizeDelay.pause(),
      _refreshID++,
      (_refreshingAll = 2),
      _updateAll(2),
      _triggers.forEach(function (N) {
        return _isFunction(N.vars.onRefresh) && N.vars.onRefresh(N);
      }),
      (_refreshingAll = ScrollTrigger.isRefreshing = !1),
      _dispatch("refresh"));
  },
  _lastScroll = 0,
  _direction = 1,
  _primary,
  _updateAll = function (O) {
    if (O === 2 || (!_refreshingAll && !_isReverted)) {
      ((ScrollTrigger.isUpdating = !0), _primary && _primary.update(0));
      var B = _triggers.length,
        z = _getTime(),
        N = z - _time1 >= 50,
        G = B && _triggers[0].scroll();
      if (
        ((_direction = _lastScroll > G ? -1 : 1),
        _refreshingAll || (_lastScroll = G),
        N &&
          (_lastScrollTime &&
            !_pointerIsDown &&
            z - _lastScrollTime > 200 &&
            ((_lastScrollTime = 0), _dispatch("scrollEnd")),
          (_time2 = _time1),
          (_time1 = z)),
        _direction < 0)
      ) {
        for (_i = B; _i-- > 0; ) _triggers[_i] && _triggers[_i].update(0, N);
        _direction = 1;
      } else
        for (_i = 0; _i < B; _i++) _triggers[_i] && _triggers[_i].update(0, N);
      ScrollTrigger.isUpdating = !1;
    }
    _rafID = 0;
  },
  _propNamesToCopy = [
    _left,
    _top,
    _bottom,
    _right,
    _margin + _Bottom,
    _margin + _Right,
    _margin + _Top,
    _margin + _Left,
    "display",
    "flexShrink",
    "float",
    "zIndex",
    "gridColumnStart",
    "gridColumnEnd",
    "gridRowStart",
    "gridRowEnd",
    "gridArea",
    "justifySelf",
    "alignSelf",
    "placeSelf",
    "order",
  ],
  _stateProps = _propNamesToCopy.concat([
    _width,
    _height,
    "boxSizing",
    "max" + _Width,
    "max" + _Height,
    "position",
    _margin,
    _padding,
    _padding + _Top,
    _padding + _Right,
    _padding + _Bottom,
    _padding + _Left,
  ]),
  _swapPinOut = function (O, B, z) {
    _setState(z);
    var N = O._gsap;
    if (N.spacerIsNative) _setState(N.spacerState);
    else if (O._gsap.swappedIn) {
      var G = B.parentNode;
      G && (G.insertBefore(O, B), G.removeChild(B));
    }
    O._gsap.swappedIn = !1;
  },
  _swapPinIn = function (O, B, z, N) {
    if (!O._gsap.swappedIn) {
      for (var G = _propNamesToCopy.length, H = B.style, W = O.style, q; G--; )
        ((q = _propNamesToCopy[G]), (H[q] = z[q]));
      ((H.position = z.position === "absolute" ? "absolute" : "relative"),
        z.display === "inline" && (H.display = "inline-block"),
        (W[_bottom] = W[_right] = "auto"),
        (H.flexBasis = z.flexBasis || "auto"),
        (H.overflow = "visible"),
        (H.boxSizing = "border-box"),
        (H[_width] = _getSize(O, _horizontal) + _px),
        (H[_height] = _getSize(O, _vertical) + _px),
        (H[_padding] = W[_margin] = W[_top] = W[_left] = "0"),
        _setState(N),
        (W[_width] = W["max" + _Width] = z[_width]),
        (W[_height] = W["max" + _Height] = z[_height]),
        (W[_padding] = z[_padding]),
        O.parentNode !== B &&
          (O.parentNode.insertBefore(B, O), B.appendChild(O)),
        (O._gsap.swappedIn = !0));
    }
  },
  _capsExp = /([A-Z])/g,
  _setState = function (O) {
    if (O) {
      var B = O.t.style,
        z = O.length,
        N = 0,
        G,
        H;
      for ((O.t._gsap || gsap.core.getCache(O.t)).uncache = 1; N < z; N += 2)
        ((H = O[N + 1]),
          (G = O[N]),
          H
            ? (B[G] = H)
            : B[G] &&
              B.removeProperty(G.replace(_capsExp, "-$1").toLowerCase()));
    }
  },
  _getState = function (O) {
    for (var B = _stateProps.length, z = O.style, N = [], G = 0; G < B; G++)
      N.push(_stateProps[G], z[_stateProps[G]]);
    return ((N.t = O), N);
  },
  _copyState = function (O, B, z) {
    for (var N = [], G = O.length, H = z ? 8 : 0, W; H < G; H += 2)
      ((W = O[H]), N.push(W, W in B ? B[W] : O[H + 1]));
    return ((N.t = O.t), N);
  },
  _winOffsets = { left: 0, top: 0 },
  _parsePosition = function (O, B, z, N, G, H, W, q, j, Y, re, U, K, Z) {
    (_isFunction(O) && (O = O(q)),
      _isString(O) &&
        O.substr(0, 3) === "max" &&
        (O =
          U + (O.charAt(4) === "=" ? _offsetToPx("0" + O.substr(3), z) : 0)));
    var X = K ? K.time() : 0,
      se,
      Q,
      te;
    if ((K && K.seek(0), isNaN(O) || (O = +O), _isNumber(O)))
      (K &&
        (O = gsap.utils.mapRange(
          K.scrollTrigger.start,
          K.scrollTrigger.end,
          0,
          U,
          O,
        )),
        W && _positionMarker(W, z, N, !0));
    else {
      _isFunction(B) && (B = B(q));
      var J = (O || "0").split(" "),
        ee,
        ne,
        oe,
        he;
      ((te = _getTarget(B, q) || _body),
        (ee = _getBounds(te) || {}),
        (!ee || (!ee.left && !ee.top)) &&
          _getComputedStyle(te).display === "none" &&
          ((he = te.style.display),
          (te.style.display = "block"),
          (ee = _getBounds(te)),
          he ? (te.style.display = he) : te.style.removeProperty("display")),
        (ne = _offsetToPx(J[0], ee[N.d])),
        (oe = _offsetToPx(J[1] || "0", z)),
        (O = ee[N.p] - j[N.p] - Y + ne + G - oe),
        W && _positionMarker(W, oe, N, z - oe < 20 || (W._isStart && oe > 20)),
        (z -= z - oe));
    }
    if ((Z && ((q[Z] = O || -0.001), O < 0 && (O = 0)), H)) {
      var ce = O + z,
        ue = H._isStart;
      ((se = "scroll" + N.d2),
        _positionMarker(
          H,
          ce,
          N,
          (ue && ce > 20) ||
            (!ue &&
              (re ? Math.max(_body[se], _docEl[se]) : H.parentNode[se]) <=
                ce + 1),
        ),
        re &&
          ((j = _getBounds(W)),
          re && (H.style[N.op.p] = j[N.op.p] - N.op.m - H._offset + _px)));
    }
    return (
      K &&
        te &&
        ((se = _getBounds(te)),
        K.seek(U),
        (Q = _getBounds(te)),
        (K._caScrollDist = se[N.p] - Q[N.p]),
        (O = (O / K._caScrollDist) * U)),
      K && K.seek(X),
      K ? O : Math.round(O)
    );
  },
  _prefixExp = /(webkit|moz|length|cssText|inset)/i,
  _reparent = function (O, B, z, N) {
    if (O.parentNode !== B) {
      var G = O.style,
        H,
        W;
      if (B === _body) {
        ((O._stOrig = G.cssText), (W = _getComputedStyle(O)));
        for (H in W)
          !+H &&
            !_prefixExp.test(H) &&
            W[H] &&
            typeof G[H] == "string" &&
            H !== "0" &&
            (G[H] = W[H]);
        ((G.top = z), (G.left = N));
      } else G.cssText = O._stOrig;
      ((gsap.core.getCache(O).uncache = 1), B.appendChild(O));
    }
  },
  _interruptionTracker = function (O, B, z) {
    var N = B,
      G = N;
    return function (H) {
      var W = Math.round(O());
      return (
        W !== N &&
          W !== G &&
          Math.abs(W - N) > 3 &&
          Math.abs(W - G) > 3 &&
          ((H = W), z && z()),
        (G = N),
        (N = H),
        H
      );
    };
  },
  _shiftMarker = function (O, B, z) {
    var N = {};
    ((N[B.p] = "+=" + z), gsap.set(O, N));
  },
  _getTweenCreator = function (O, B) {
    var z = _getScrollFunc(O, B),
      N = "_scroll" + B.p2,
      G = function H(W, q, j, Y, re) {
        var U = H.tween,
          K = q.onComplete,
          Z = {};
        j = j || z();
        var X = _interruptionTracker(z, j, function () {
          (U.kill(), (H.tween = 0));
        });
        return (
          (re = (Y && re) || 0),
          (Y = Y || W - j),
          U && U.kill(),
          (q[N] = W),
          (q.inherit = !1),
          (q.modifiers = Z),
          (Z[N] = function () {
            return X(j + Y * U.ratio + re * U.ratio * U.ratio);
          }),
          (q.onUpdate = function () {
            (_scrollers.cache++, H.tween && _updateAll());
          }),
          (q.onComplete = function () {
            ((H.tween = 0), K && K.call(U));
          }),
          (U = H.tween = gsap.to(O, q)),
          U
        );
      };
    return (
      (O[N] = z),
      (z.wheelHandler = function () {
        return G.tween && G.tween.kill() && (G.tween = 0);
      }),
      _addListener(O, "wheel", z.wheelHandler),
      ScrollTrigger.isTouch && _addListener(O, "touchmove", z.wheelHandler),
      G
    );
  },
  ScrollTrigger = (function () {
    function V(B, z) {
      (_coreInitted ||
        V.register(gsap) ||
        console.warn("Please gsap.registerPlugin(ScrollTrigger)"),
        _context(this),
        this.init(B, z));
    }
    var O = V.prototype;
    return (
      (O.init = function (z, N) {
        if (
          ((this.progress = this.start = 0),
          this.vars && this.kill(!0, !0),
          !_enabled)
        ) {
          this.update = this.refresh = this.kill = _passThrough;
          return;
        }
        z = _setDefaults(
          _isString(z) || _isNumber(z) || z.nodeType ? { trigger: z } : z,
          _defaults,
        );
        var G = z,
          H = G.onUpdate,
          W = G.toggleClass,
          q = G.id,
          j = G.onToggle,
          Y = G.onRefresh,
          re = G.scrub,
          U = G.trigger,
          K = G.pin,
          Z = G.pinSpacing,
          X = G.invalidateOnRefresh,
          se = G.anticipatePin,
          Q = G.onScrubComplete,
          te = G.onSnapComplete,
          J = G.once,
          ee = G.snap,
          ne = G.pinReparent,
          oe = G.pinSpacer,
          he = G.containerAnimation,
          ce = G.fastScrollEnd,
          ue = G.preventOverlaps,
          ge =
            z.horizontal || (z.containerAnimation && z.horizontal !== !1)
              ? _horizontal
              : _vertical,
          ye = !re && re !== 0,
          me = _getTarget(z.scroller || _win),
          be = gsap.core.getCache(me),
          Se = _isViewport(me),
          _e =
            ("pinType" in z
              ? z.pinType
              : _getProxyProp(me, "pinType") || (Se && "fixed")) === "fixed",
          le = [z.onEnter, z.onLeave, z.onEnterBack, z.onLeaveBack],
          pe = ye && z.toggleActions.split(" "),
          ie = "markers" in z ? z.markers : _defaults.markers,
          ae = Se
            ? 0
            : parseFloat(_getComputedStyle(me)["border" + ge.p2 + _Width]) || 0,
          fe = this,
          de =
            z.onRefreshInit &&
            function () {
              return z.onRefreshInit(fe);
            },
          xe = _getSizeFunc(me, Se, ge),
          we = _getOffsetsFunc(me, Se),
          Ee = 0,
          Me = 0,
          Ie = 0,
          Oe = _getScrollFunc(me, ge),
          Ge,
          We,
          Ze,
          ze,
          Ye,
          Ae,
          Pe,
          Ue,
          Qe,
          ve,
          Xe,
          st,
          at,
          Be,
          ht,
          ut,
          ot,
          qe,
          rt,
          He,
          dt,
          ft,
          vt,
          Bt,
          it,
          Ht,
          kt,
          Rt,
          Ot,
          Mt,
          Ft,
          Ve,
          It,
          St,
          xt,
          Pt,
          Dt,
          Vt,
          At;
        if (
          ((fe._startClamp = fe._endClamp = !1),
          (fe._dir = ge),
          (se *= 45),
          (fe.scroller = me),
          (fe.scroll = he ? he.time.bind(he) : Oe),
          (ze = Oe()),
          (fe.vars = z),
          (N = N || z.animation),
          "refreshPriority" in z &&
            ((_sort = 1), z.refreshPriority === -9999 && (_primary = fe)),
          (be.tweenScroll = be.tweenScroll || {
            top: _getTweenCreator(me, _vertical),
            left: _getTweenCreator(me, _horizontal),
          }),
          (fe.tweenTo = Ge = be.tweenScroll[ge.p]),
          (fe.scrubDuration = function (Te) {
            ((It = _isNumber(Te) && Te),
              It
                ? Ve
                  ? Ve.duration(Te)
                  : (Ve = gsap.to(N, {
                      ease: "expo",
                      totalProgress: "+=0",
                      inherit: !1,
                      duration: It,
                      paused: !0,
                      onComplete: function () {
                        return Q && Q(fe);
                      },
                    }))
                : (Ve && Ve.progress(1).kill(), (Ve = 0)));
          }),
          N &&
            ((N.vars.lazy = !1),
            (N._initted && !fe.isReverted) ||
              (N.vars.immediateRender !== !1 &&
                z.immediateRender !== !1 &&
                N.duration() &&
                N.render(0, !0, !0)),
            (fe.animation = N.pause()),
            (N.scrollTrigger = fe),
            fe.scrubDuration(re),
            (Mt = 0),
            q || (q = N.vars.id)),
          ee &&
            ((!_isObject(ee) || ee.push) && (ee = { snapTo: ee }),
            "scrollBehavior" in _body.style &&
              gsap.set(Se ? [_body, _docEl] : me, { scrollBehavior: "auto" }),
            _scrollers.forEach(function (Te) {
              return (
                _isFunction(Te) &&
                Te.target === (Se ? _doc.scrollingElement || _docEl : me) &&
                (Te.smooth = !1)
              );
            }),
            (Ze = _isFunction(ee.snapTo)
              ? ee.snapTo
              : ee.snapTo === "labels"
                ? _getClosestLabel(N)
                : ee.snapTo === "labelsDirectional"
                  ? _getLabelAtDirection(N)
                  : ee.directional !== !1
                    ? function (Te, Re) {
                        return _snapDirectional(ee.snapTo)(
                          Te,
                          _getTime() - Me < 500 ? 0 : Re.direction,
                        );
                      }
                    : gsap.utils.snap(ee.snapTo)),
            (St = ee.duration || { min: 0.1, max: 2 }),
            (St = _isObject(St) ? _clamp(St.min, St.max) : _clamp(St, St)),
            (xt = gsap
              .delayedCall(ee.delay || It / 2 || 0.1, function () {
                var Te = Oe(),
                  Re = _getTime() - Me < 500,
                  ke = Ge.tween;
                if (
                  (Re || Math.abs(fe.getVelocity()) < 10) &&
                  !ke &&
                  !_pointerIsDown &&
                  Ee !== Te
                ) {
                  var De = (Te - Ae) / Be,
                    lt = N && !ye ? N.totalProgress() : De,
                    $e = Re
                      ? 0
                      : ((lt - Ft) / (_getTime() - _time2)) * 1e3 || 0,
                    tt = gsap.utils.clamp(
                      -De,
                      1 - De,
                      (_abs($e / 2) * $e) / 0.185,
                    ),
                    mt = De + (ee.inertia === !1 ? 0 : tt),
                    et,
                    Ke,
                    je = ee,
                    Tt = je.onStart,
                    Je = je.onInterrupt,
                    yt = je.onComplete;
                  if (
                    ((et = Ze(mt, fe)),
                    _isNumber(et) || (et = mt),
                    (Ke = Math.round(Ae + et * Be)),
                    Te <= Pe && Te >= Ae && Ke !== Te)
                  ) {
                    if (ke && !ke._initted && ke.data <= _abs(Ke - Te)) return;
                    (ee.inertia === !1 && (tt = et - De),
                      Ge(
                        Ke,
                        {
                          duration: St(
                            _abs(
                              (Math.max(_abs(mt - lt), _abs(et - lt)) * 0.185) /
                                $e /
                                0.05 || 0,
                            ),
                          ),
                          ease: ee.ease || "power3",
                          data: _abs(Ke - Te),
                          onInterrupt: function () {
                            return xt.restart(!0) && Je && Je(fe);
                          },
                          onComplete: function () {
                            (fe.update(),
                              (Ee = Oe()),
                              N &&
                                (Ve
                                  ? Ve.resetTo(
                                      "totalProgress",
                                      et,
                                      N._tTime / N._tDur,
                                    )
                                  : N.progress(et)),
                              (Mt = Ft =
                                N && !ye ? N.totalProgress() : fe.progress),
                              te && te(fe),
                              yt && yt(fe));
                          },
                        },
                        Te,
                        tt * Be,
                        Ke - Te - tt * Be,
                      ),
                      Tt && Tt(fe, Ge.tween));
                  }
                } else fe.isActive && Ee !== Te && xt.restart(!0);
              })
              .pause())),
          q && (_ids[q] = fe),
          (U = fe.trigger = _getTarget(U || (K !== !0 && K))),
          (At = U && U._gsap && U._gsap.stRevert),
          At && (At = At(fe)),
          (K = K === !0 ? U : _getTarget(K)),
          _isString(W) && (W = { targets: U, className: W }),
          K &&
            (Z === !1 ||
              Z === _margin ||
              (Z =
                !Z &&
                K.parentNode &&
                K.parentNode.style &&
                _getComputedStyle(K.parentNode).display === "flex"
                  ? !1
                  : _padding),
            (fe.pin = K),
            (We = gsap.core.getCache(K)),
            We.spacer
              ? (ht = We.pinState)
              : (oe &&
                  ((oe = _getTarget(oe)),
                  oe && !oe.nodeType && (oe = oe.current || oe.nativeElement),
                  (We.spacerIsNative = !!oe),
                  oe && (We.spacerState = _getState(oe))),
                (We.spacer = qe = oe || _doc.createElement("div")),
                qe.classList.add("pin-spacer"),
                q && qe.classList.add("pin-spacer-" + q),
                (We.pinState = ht = _getState(K))),
            z.force3D !== !1 && gsap.set(K, { force3D: !0 }),
            (fe.spacer = qe = We.spacer),
            (Ot = _getComputedStyle(K)),
            (Bt = Ot[Z + ge.os2]),
            (He = gsap.getProperty(K)),
            (dt = gsap.quickSetter(K, ge.a, _px)),
            _swapPinIn(K, qe, Ot),
            (ot = _getState(K))),
          ie)
        ) {
          ((st = _isObject(ie)
            ? _setDefaults(ie, _markerDefaults)
            : _markerDefaults),
            (ve = _createMarker("scroller-start", q, me, ge, st, 0)),
            (Xe = _createMarker("scroller-end", q, me, ge, st, 0, ve)),
            (rt = ve["offset" + ge.op.d2]));
          var $t = _getTarget(_getProxyProp(me, "content") || me);
          ((Ue = this.markerStart =
            _createMarker("start", q, $t, ge, st, rt, 0, he)),
            (Qe = this.markerEnd =
              _createMarker("end", q, $t, ge, st, rt, 0, he)),
            he && (Vt = gsap.quickSetter([Ue, Qe], ge.a, _px)),
            !_e &&
              !(_proxies.length && _getProxyProp(me, "fixedMarkers") === !0) &&
              (_makePositionable(Se ? _body : me),
              gsap.set([ve, Xe], { force3D: !0 }),
              (Ht = gsap.quickSetter(ve, ge.a, _px)),
              (Rt = gsap.quickSetter(Xe, ge.a, _px))));
        }
        if (he) {
          var Le = he.vars.onUpdate,
            Fe = he.vars.onUpdateParams;
          he.eventCallback("onUpdate", function () {
            (fe.update(0, 0, 1), Le && Le.apply(he, Fe || []));
          });
        }
        if (
          ((fe.previous = function () {
            return _triggers[_triggers.indexOf(fe) - 1];
          }),
          (fe.next = function () {
            return _triggers[_triggers.indexOf(fe) + 1];
          }),
          (fe.revert = function (Te, Re) {
            if (!Re) return fe.kill(!0);
            var ke = Te !== !1 || !fe.enabled,
              De = _refreshing;
            ke !== fe.isReverted &&
              (ke &&
                ((Pt = Math.max(Oe(), fe.scroll.rec || 0)),
                (Ie = fe.progress),
                (Dt = N && N.progress())),
              Ue &&
                [Ue, Qe, ve, Xe].forEach(function (lt) {
                  return (lt.style.display = ke ? "none" : "block");
                }),
              ke && ((_refreshing = fe), fe.update(ke)),
              K &&
                (!ne || !fe.isActive) &&
                (ke
                  ? _swapPinOut(K, qe, ht)
                  : _swapPinIn(K, qe, _getComputedStyle(K), it)),
              ke || fe.update(ke),
              (_refreshing = De),
              (fe.isReverted = ke));
          }),
          (fe.refresh = function (Te, Re, ke, De) {
            if (!((_refreshing || !fe.enabled) && !Re)) {
              if (K && Te && _lastScrollTime) {
                _addListener(V, "scrollEnd", _softRefresh);
                return;
              }
              (!_refreshingAll && de && de(fe),
                (_refreshing = fe),
                Ge.tween && !ke && (Ge.tween.kill(), (Ge.tween = 0)),
                Ve && Ve.pause(),
                X && N && N.revert({ kill: !1 }).invalidate(),
                fe.isReverted || fe.revert(!0, !0),
                (fe._subPinOffset = !1));
              var lt = xe(),
                $e = we(),
                tt = he ? he.duration() : _maxScroll(me, ge),
                mt = Be <= 0.01,
                et = 0,
                Ke = De || 0,
                je = _isObject(ke) ? ke.end : z.end,
                Tt = z.endTrigger || U,
                Je = _isObject(ke)
                  ? ke.start
                  : z.start || (z.start === 0 || !U ? 0 : K ? "0 0" : "0 100%"),
                yt = (fe.pinnedContainer =
                  z.pinnedContainer && _getTarget(z.pinnedContainer, fe)),
                Et = (U && Math.max(0, _triggers.indexOf(fe))) || 0,
                ct = Et,
                pt,
                gt,
                Lt,
                Wt,
                _t,
                nt,
                Ct,
                jt,
                Yt,
                zt,
                wt,
                Nt,
                qt;
              for (
                ie &&
                _isObject(ke) &&
                ((Nt = gsap.getProperty(ve, ge.p)),
                (qt = gsap.getProperty(Xe, ge.p)));
                ct--;
              )
                ((nt = _triggers[ct]),
                  nt.end || nt.refresh(0, 1) || (_refreshing = fe),
                  (Ct = nt.pin),
                  Ct &&
                    (Ct === U || Ct === K || Ct === yt) &&
                    !nt.isReverted &&
                    (zt || (zt = []), zt.unshift(nt), nt.revert(!0, !0)),
                  nt !== _triggers[ct] && (Et--, ct--));
              for (
                _isFunction(Je) && (Je = Je(fe)),
                  Je = _parseClamp(Je, "start", fe),
                  Ae =
                    _parsePosition(
                      Je,
                      U,
                      lt,
                      ge,
                      Oe(),
                      Ue,
                      ve,
                      fe,
                      $e,
                      ae,
                      _e,
                      tt,
                      he,
                      fe._startClamp && "_startClamp",
                    ) || (K ? -0.001 : 0),
                  _isFunction(je) && (je = je(fe)),
                  _isString(je) &&
                    !je.indexOf("+=") &&
                    (~je.indexOf(" ")
                      ? (je = (_isString(Je) ? Je.split(" ")[0] : "") + je)
                      : ((et = _offsetToPx(je.substr(2), lt)),
                        (je = _isString(Je)
                          ? Je
                          : (he
                              ? gsap.utils.mapRange(
                                  0,
                                  he.duration(),
                                  he.scrollTrigger.start,
                                  he.scrollTrigger.end,
                                  Ae,
                                )
                              : Ae) + et),
                        (Tt = U))),
                  je = _parseClamp(je, "end", fe),
                  Pe =
                    Math.max(
                      Ae,
                      _parsePosition(
                        je || (Tt ? "100% 0" : tt),
                        Tt,
                        lt,
                        ge,
                        Oe() + et,
                        Qe,
                        Xe,
                        fe,
                        $e,
                        ae,
                        _e,
                        tt,
                        he,
                        fe._endClamp && "_endClamp",
                      ),
                    ) || -0.001,
                  et = 0,
                  ct = Et;
                ct--;
              )
                ((nt = _triggers[ct]),
                  (Ct = nt.pin),
                  Ct &&
                    nt.start - nt._pinPush <= Ae &&
                    !he &&
                    nt.end > 0 &&
                    ((pt =
                      nt.end -
                      (fe._startClamp ? Math.max(0, nt.start) : nt.start)),
                    ((Ct === U && nt.start - nt._pinPush < Ae) || Ct === yt) &&
                      isNaN(Je) &&
                      (et += pt * (1 - nt.progress)),
                    Ct === K && (Ke += pt)));
              if (
                ((Ae += et),
                (Pe += et),
                fe._startClamp && (fe._startClamp += et),
                fe._endClamp &&
                  !_refreshingAll &&
                  ((fe._endClamp = Pe || -0.001),
                  (Pe = Math.min(Pe, _maxScroll(me, ge)))),
                (Be = Pe - Ae || ((Ae -= 0.01) && 0.001)),
                mt &&
                  (Ie = gsap.utils.clamp(
                    0,
                    1,
                    gsap.utils.normalize(Ae, Pe, Pt),
                  )),
                (fe._pinPush = Ke),
                Ue &&
                  et &&
                  ((pt = {}),
                  (pt[ge.a] = "+=" + et),
                  yt && (pt[ge.p] = "-=" + Oe()),
                  gsap.set([Ue, Qe], pt)),
                K && !(_clampingMax && fe.end >= _maxScroll(me, ge)))
              )
                ((pt = _getComputedStyle(K)),
                  (Wt = ge === _vertical),
                  (Lt = Oe()),
                  (ft = parseFloat(He(ge.a)) + Ke),
                  !tt &&
                    Pe > 1 &&
                    ((wt = (Se ? _doc.scrollingElement || _docEl : me).style),
                    (wt = {
                      style: wt,
                      value: wt["overflow" + ge.a.toUpperCase()],
                    }),
                    Se &&
                      _getComputedStyle(_body)[
                        "overflow" + ge.a.toUpperCase()
                      ] !== "scroll" &&
                      (wt.style["overflow" + ge.a.toUpperCase()] = "scroll")),
                  _swapPinIn(K, qe, pt),
                  (ot = _getState(K)),
                  (gt = _getBounds(K, !0)),
                  (jt =
                    _e && _getScrollFunc(me, Wt ? _horizontal : _vertical)()),
                  Z
                    ? ((it = [Z + ge.os2, Be + Ke + _px]),
                      (it.t = qe),
                      (ct = Z === _padding ? _getSize(K, ge) + Be + Ke : 0),
                      ct &&
                        (it.push(ge.d, ct + _px),
                        qe.style.flexBasis !== "auto" &&
                          (qe.style.flexBasis = ct + _px)),
                      _setState(it),
                      yt &&
                        _triggers.forEach(function (Gt) {
                          Gt.pin === yt &&
                            Gt.vars.pinSpacing !== !1 &&
                            (Gt._subPinOffset = !0);
                        }),
                      _e && Oe(Pt))
                    : ((ct = _getSize(K, ge)),
                      ct &&
                        qe.style.flexBasis !== "auto" &&
                        (qe.style.flexBasis = ct + _px)),
                  _e &&
                    ((_t = {
                      top: gt.top + (Wt ? Lt - Ae : jt) + _px,
                      left: gt.left + (Wt ? jt : Lt - Ae) + _px,
                      boxSizing: "border-box",
                      position: "fixed",
                    }),
                    (_t[_width] = _t["max" + _Width] =
                      Math.ceil(gt.width) + _px),
                    (_t[_height] = _t["max" + _Height] =
                      Math.ceil(gt.height) + _px),
                    (_t[_margin] =
                      _t[_margin + _Top] =
                      _t[_margin + _Right] =
                      _t[_margin + _Bottom] =
                      _t[_margin + _Left] =
                        "0"),
                    (_t[_padding] = pt[_padding]),
                    (_t[_padding + _Top] = pt[_padding + _Top]),
                    (_t[_padding + _Right] = pt[_padding + _Right]),
                    (_t[_padding + _Bottom] = pt[_padding + _Bottom]),
                    (_t[_padding + _Left] = pt[_padding + _Left]),
                    (ut = _copyState(ht, _t, ne)),
                    _refreshingAll && Oe(0)),
                  N
                    ? ((Yt = N._initted),
                      _suppressOverwrites(1),
                      N.render(N.duration(), !0, !0),
                      (vt = He(ge.a) - ft + Be + Ke),
                      (kt = Math.abs(Be - vt) > 1),
                      _e && kt && ut.splice(ut.length - 2, 2),
                      N.render(0, !0, !0),
                      Yt || N.invalidate(!0),
                      N.parent || N.totalTime(N.totalTime()),
                      _suppressOverwrites(0))
                    : (vt = Be),
                  wt &&
                    (wt.value
                      ? (wt.style["overflow" + ge.a.toUpperCase()] = wt.value)
                      : wt.style.removeProperty("overflow-" + ge.a)));
              else if (U && Oe() && !he)
                for (gt = U.parentNode; gt && gt !== _body; )
                  (gt._pinOffset &&
                    ((Ae -= gt._pinOffset), (Pe -= gt._pinOffset)),
                    (gt = gt.parentNode));
              (zt &&
                zt.forEach(function (Gt) {
                  return Gt.revert(!1, !0);
                }),
                (fe.start = Ae),
                (fe.end = Pe),
                (ze = Ye = _refreshingAll ? Pt : Oe()),
                !he &&
                  !_refreshingAll &&
                  (ze < Pt && Oe(Pt), (fe.scroll.rec = 0)),
                fe.revert(!1, !0),
                (Me = _getTime()),
                xt && ((Ee = -1), xt.restart(!0)),
                (_refreshing = 0),
                N &&
                  ye &&
                  (N._initted || Dt) &&
                  N.progress() !== Dt &&
                  N.progress(Dt || 0, !0).render(N.time(), !0, !0),
                (mt || Ie !== fe.progress || he || X) &&
                  (N &&
                    !ye &&
                    N.totalProgress(
                      he && Ae < -0.001 && !Ie
                        ? gsap.utils.normalize(Ae, Pe, 0)
                        : Ie,
                      !0,
                    ),
                  (fe.progress = mt || (ze - Ae) / Be === Ie ? 0 : Ie)),
                K && Z && (qe._pinOffset = Math.round(fe.progress * vt)),
                Ve && Ve.invalidate(),
                isNaN(Nt) ||
                  ((Nt -= gsap.getProperty(ve, ge.p)),
                  (qt -= gsap.getProperty(Xe, ge.p)),
                  _shiftMarker(ve, ge, Nt),
                  _shiftMarker(Ue, ge, Nt - (De || 0)),
                  _shiftMarker(Xe, ge, qt),
                  _shiftMarker(Qe, ge, qt - (De || 0))),
                mt && !_refreshingAll && fe.update(),
                Y && !_refreshingAll && !at && ((at = !0), Y(fe), (at = !1)));
            }
          }),
          (fe.getVelocity = function () {
            return ((Oe() - Ye) / (_getTime() - _time2)) * 1e3 || 0;
          }),
          (fe.endAnimation = function () {
            (_endAnimation(fe.callbackAnimation),
              N &&
                (Ve
                  ? Ve.progress(1)
                  : N.paused()
                    ? ye || _endAnimation(N, fe.direction < 0, 1)
                    : _endAnimation(N, N.reversed())));
          }),
          (fe.labelToScroll = function (Te) {
            return (
              (N &&
                N.labels &&
                (Ae || fe.refresh() || Ae) +
                  (N.labels[Te] / N.duration()) * Be) ||
              0
            );
          }),
          (fe.getTrailing = function (Te) {
            var Re = _triggers.indexOf(fe),
              ke =
                fe.direction > 0
                  ? _triggers.slice(0, Re).reverse()
                  : _triggers.slice(Re + 1);
            return (
              _isString(Te)
                ? ke.filter(function (De) {
                    return De.vars.preventOverlaps === Te;
                  })
                : ke
            ).filter(function (De) {
              return fe.direction > 0 ? De.end <= Ae : De.start >= Pe;
            });
          }),
          (fe.update = function (Te, Re, ke) {
            if (!(he && !ke && !Te)) {
              var De = _refreshingAll === !0 ? Pt : fe.scroll(),
                lt = Te ? 0 : (De - Ae) / Be,
                $e = lt < 0 ? 0 : lt > 1 ? 1 : lt || 0,
                tt = fe.progress,
                mt,
                et,
                Ke,
                je,
                Tt,
                Je,
                yt,
                Et;
              if (
                (Re &&
                  ((Ye = ze),
                  (ze = he ? Oe() : De),
                  ee && ((Ft = Mt), (Mt = N && !ye ? N.totalProgress() : $e))),
                se &&
                  K &&
                  !_refreshing &&
                  !_startup &&
                  _lastScrollTime &&
                  (!$e && Ae < De + ((De - Ye) / (_getTime() - _time2)) * se
                    ? ($e = 1e-4)
                    : $e === 1 &&
                      Pe > De + ((De - Ye) / (_getTime() - _time2)) * se &&
                      ($e = 0.9999)),
                $e !== tt && fe.enabled)
              ) {
                if (
                  ((mt = fe.isActive = !!$e && $e < 1),
                  (et = !!tt && tt < 1),
                  (Je = mt !== et),
                  (Tt = Je || !!$e != !!tt),
                  (fe.direction = $e > tt ? 1 : -1),
                  (fe.progress = $e),
                  Tt &&
                    !_refreshing &&
                    ((Ke = $e && !tt ? 0 : $e === 1 ? 1 : tt === 1 ? 2 : 3),
                    ye &&
                      ((je =
                        (!Je && pe[Ke + 1] !== "none" && pe[Ke + 1]) || pe[Ke]),
                      (Et =
                        N &&
                        (je === "complete" || je === "reset" || je in N)))),
                  ue &&
                    (Je || Et) &&
                    (Et || re || !N) &&
                    (_isFunction(ue)
                      ? ue(fe)
                      : fe.getTrailing(ue).forEach(function (Lt) {
                          return Lt.endAnimation();
                        })),
                  ye ||
                    (Ve && !_refreshing && !_startup
                      ? (Ve._dp._time - Ve._start !== Ve._time &&
                          Ve.render(Ve._dp._time - Ve._start),
                        Ve.resetTo
                          ? Ve.resetTo("totalProgress", $e, N._tTime / N._tDur)
                          : ((Ve.vars.totalProgress = $e),
                            Ve.invalidate().restart()))
                      : N &&
                        N.totalProgress($e, !!(_refreshing && (Me || Te)))),
                  K)
                ) {
                  if ((Te && Z && (qe.style[Z + ge.os2] = Bt), !_e))
                    dt(_round(ft + vt * $e));
                  else if (Tt) {
                    if (
                      ((yt =
                        !Te &&
                        $e > tt &&
                        Pe + 1 > De &&
                        De + 1 >= _maxScroll(me, ge)),
                      ne)
                    )
                      if (!Te && (mt || yt)) {
                        var ct = _getBounds(K, !0),
                          pt = De - Ae;
                        _reparent(
                          K,
                          _body,
                          ct.top + (ge === _vertical ? pt : 0) + _px,
                          ct.left + (ge === _vertical ? 0 : pt) + _px,
                        );
                      } else _reparent(K, qe);
                    (_setState(mt || yt ? ut : ot),
                      (kt && $e < 1 && mt) ||
                        dt(ft + ($e === 1 && !yt ? vt : 0)));
                  }
                }
                (ee && !Ge.tween && !_refreshing && !_startup && xt.restart(!0),
                  W &&
                    (Je || (J && $e && ($e < 1 || !_limitCallbacks))) &&
                    _toArray(W.targets).forEach(function (Lt) {
                      return Lt.classList[mt || J ? "add" : "remove"](
                        W.className,
                      );
                    }),
                  H && !ye && !Te && H(fe),
                  Tt && !_refreshing
                    ? (ye &&
                        (Et &&
                          (je === "complete"
                            ? N.pause().totalProgress(1)
                            : je === "reset"
                              ? N.restart(!0).pause()
                              : je === "restart"
                                ? N.restart(!0)
                                : N[je]()),
                        H && H(fe)),
                      (Je || !_limitCallbacks) &&
                        (j && Je && _callback(fe, j),
                        le[Ke] && _callback(fe, le[Ke]),
                        J && ($e === 1 ? fe.kill(!1, 1) : (le[Ke] = 0)),
                        Je ||
                          ((Ke = $e === 1 ? 1 : 3),
                          le[Ke] && _callback(fe, le[Ke]))),
                      ce &&
                        !mt &&
                        Math.abs(fe.getVelocity()) >
                          (_isNumber(ce) ? ce : 2500) &&
                        (_endAnimation(fe.callbackAnimation),
                        Ve
                          ? Ve.progress(1)
                          : _endAnimation(N, je === "reverse" ? 1 : !$e, 1)))
                    : ye && H && !_refreshing && H(fe));
              }
              if (Rt) {
                var gt = he
                  ? (De / he.duration()) * (he._caScrollDist || 0)
                  : De;
                (Ht(gt + (ve._isFlipped ? 1 : 0)), Rt(gt));
              }
              Vt && Vt((-De / he.duration()) * (he._caScrollDist || 0));
            }
          }),
          (fe.enable = function (Te, Re) {
            fe.enabled ||
              ((fe.enabled = !0),
              _addListener(me, "resize", _onResize),
              Se || _addListener(me, "scroll", _onScroll),
              de && _addListener(V, "refreshInit", de),
              Te !== !1 && ((fe.progress = Ie = 0), (ze = Ye = Ee = Oe())),
              Re !== !1 && fe.refresh());
          }),
          (fe.getTween = function (Te) {
            return Te && Ge ? Ge.tween : Ve;
          }),
          (fe.setPositions = function (Te, Re, ke, De) {
            if (he) {
              var lt = he.scrollTrigger,
                $e = he.duration(),
                tt = lt.end - lt.start;
              ((Te = lt.start + (tt * Te) / $e),
                (Re = lt.start + (tt * Re) / $e));
            }
            (fe.refresh(
              !1,
              !1,
              {
                start: _keepClamp(Te, ke && !!fe._startClamp),
                end: _keepClamp(Re, ke && !!fe._endClamp),
              },
              De,
            ),
              fe.update());
          }),
          (fe.adjustPinSpacing = function (Te) {
            if (it && Te) {
              var Re = it.indexOf(ge.d) + 1;
              ((it[Re] = parseFloat(it[Re]) + Te + _px),
                (it[1] = parseFloat(it[1]) + Te + _px),
                _setState(it));
            }
          }),
          (fe.disable = function (Te, Re) {
            if (
              fe.enabled &&
              (Te !== !1 && fe.revert(!0, !0),
              (fe.enabled = fe.isActive = !1),
              Re || (Ve && Ve.pause()),
              (Pt = 0),
              We && (We.uncache = 1),
              de && _removeListener(V, "refreshInit", de),
              xt && (xt.pause(), Ge.tween && Ge.tween.kill() && (Ge.tween = 0)),
              !Se)
            ) {
              for (var ke = _triggers.length; ke--; )
                if (_triggers[ke].scroller === me && _triggers[ke] !== fe)
                  return;
              (_removeListener(me, "resize", _onResize),
                Se || _removeListener(me, "scroll", _onScroll));
            }
          }),
          (fe.kill = function (Te, Re) {
            (fe.disable(Te, Re), Ve && !Re && Ve.kill(), q && delete _ids[q]);
            var ke = _triggers.indexOf(fe);
            (ke >= 0 && _triggers.splice(ke, 1),
              ke === _i && _direction > 0 && _i--,
              (ke = 0),
              _triggers.forEach(function (De) {
                return De.scroller === fe.scroller && (ke = 1);
              }),
              ke || _refreshingAll || (fe.scroll.rec = 0),
              N &&
                ((N.scrollTrigger = null),
                Te && N.revert({ kill: !1 }),
                Re || N.kill()),
              Ue &&
                [Ue, Qe, ve, Xe].forEach(function (De) {
                  return De.parentNode && De.parentNode.removeChild(De);
                }),
              _primary === fe && (_primary = 0),
              K &&
                (We && (We.uncache = 1),
                (ke = 0),
                _triggers.forEach(function (De) {
                  return De.pin === K && ke++;
                }),
                ke || (We.spacer = 0)),
              z.onKill && z.onKill(fe));
          }),
          _triggers.push(fe),
          fe.enable(!1, !1),
          At && At(fe),
          N && N.add && !Be)
        ) {
          var Ne = fe.update;
          ((fe.update = function () {
            ((fe.update = Ne), Ae || Pe || fe.refresh());
          }),
            gsap.delayedCall(0.01, fe.update),
            (Be = 0.01),
            (Ae = Pe = 0));
        } else fe.refresh();
        K && _queueRefreshAll();
      }),
      (V.register = function (z) {
        return (
          _coreInitted ||
            ((gsap = z || _getGSAP()),
            _windowExists() && window.document && V.enable(),
            (_coreInitted = _enabled)),
          _coreInitted
        );
      }),
      (V.defaults = function (z) {
        if (z) for (var N in z) _defaults[N] = z[N];
        return _defaults;
      }),
      (V.disable = function (z, N) {
        ((_enabled = 0),
          _triggers.forEach(function (H) {
            return H[N ? "kill" : "disable"](z);
          }),
          _removeListener(_win, "wheel", _onScroll),
          _removeListener(_doc, "scroll", _onScroll),
          clearInterval(_syncInterval),
          _removeListener(_doc, "touchcancel", _passThrough),
          _removeListener(_body, "touchstart", _passThrough),
          _multiListener(
            _removeListener,
            _doc,
            "pointerdown,touchstart,mousedown",
            _pointerDownHandler,
          ),
          _multiListener(
            _removeListener,
            _doc,
            "pointerup,touchend,mouseup",
            _pointerUpHandler,
          ),
          _resizeDelay.kill(),
          _iterateAutoRefresh(_removeListener));
        for (var G = 0; G < _scrollers.length; G += 3)
          (_wheelListener(_removeListener, _scrollers[G], _scrollers[G + 1]),
            _wheelListener(_removeListener, _scrollers[G], _scrollers[G + 2]));
      }),
      (V.enable = function () {
        if (
          ((_win = window),
          (_doc = document),
          (_docEl = _doc.documentElement),
          (_body = _doc.body),
          gsap &&
            ((_toArray = gsap.utils.toArray),
            (_clamp = gsap.utils.clamp),
            (_context = gsap.core.context || _passThrough),
            (_suppressOverwrites =
              gsap.core.suppressOverwrites || _passThrough),
            (_scrollRestoration = _win.history.scrollRestoration || "auto"),
            (_lastScroll = _win.pageYOffset),
            gsap.core.globals("ScrollTrigger", V),
            _body))
        ) {
          ((_enabled = 1),
            (_div100vh = document.createElement("div")),
            (_div100vh.style.height = "100vh"),
            (_div100vh.style.position = "absolute"),
            _refresh100vh(),
            _rafBugFix(),
            Observer.register(gsap),
            (V.isTouch = Observer.isTouch),
            (_fixIOSBug =
              Observer.isTouch &&
              /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent)),
            (_ignoreMobileResize = Observer.isTouch === 1),
            _addListener(_win, "wheel", _onScroll),
            (_root = [_win, _doc, _docEl, _body]),
            gsap.matchMedia
              ? ((V.matchMedia = function (q) {
                  var j = gsap.matchMedia(),
                    Y;
                  for (Y in q) j.add(Y, q[Y]);
                  return j;
                }),
                gsap.addEventListener("matchMediaInit", function () {
                  return _revertAll();
                }),
                gsap.addEventListener("matchMediaRevert", function () {
                  return _revertRecorded();
                }),
                gsap.addEventListener("matchMedia", function () {
                  (_refreshAll(0, 1), _dispatch("matchMedia"));
                }),
                gsap.matchMedia("(orientation: portrait)", function () {
                  return (_setBaseDimensions(), _setBaseDimensions);
                }))
              : console.warn("Requires GSAP 3.11.0 or later"),
            _setBaseDimensions(),
            _addListener(_doc, "scroll", _onScroll));
          var z = _body.style,
            N = z.borderTopStyle,
            G = gsap.core.Animation.prototype,
            H,
            W;
          for (
            G.revert ||
              Object.defineProperty(G, "revert", {
                value: function () {
                  return this.time(-0.01, !0);
                },
              }),
              z.borderTopStyle = "solid",
              H = _getBounds(_body),
              _vertical.m = Math.round(H.top + _vertical.sc()) || 0,
              _horizontal.m = Math.round(H.left + _horizontal.sc()) || 0,
              N ? (z.borderTopStyle = N) : z.removeProperty("border-top-style"),
              _syncInterval = setInterval(_sync, 250),
              gsap.delayedCall(0.5, function () {
                return (_startup = 0);
              }),
              _addListener(_doc, "touchcancel", _passThrough),
              _addListener(_body, "touchstart", _passThrough),
              _multiListener(
                _addListener,
                _doc,
                "pointerdown,touchstart,mousedown",
                _pointerDownHandler,
              ),
              _multiListener(
                _addListener,
                _doc,
                "pointerup,touchend,mouseup",
                _pointerUpHandler,
              ),
              _transformProp = gsap.utils.checkPrefix("transform"),
              _stateProps.push(_transformProp),
              _coreInitted = _getTime(),
              _resizeDelay = gsap.delayedCall(0.2, _refreshAll).pause(),
              _autoRefresh = [
                _doc,
                "visibilitychange",
                function () {
                  var q = _win.innerWidth,
                    j = _win.innerHeight;
                  _doc.hidden
                    ? ((_prevWidth = q), (_prevHeight = j))
                    : (_prevWidth !== q || _prevHeight !== j) && _onResize();
                },
                _doc,
                "DOMContentLoaded",
                _refreshAll,
                _win,
                "load",
                _refreshAll,
                _win,
                "resize",
                _onResize,
              ],
              _iterateAutoRefresh(_addListener),
              _triggers.forEach(function (q) {
                return q.enable(0, 1);
              }),
              W = 0;
            W < _scrollers.length;
            W += 3
          )
            (_wheelListener(_removeListener, _scrollers[W], _scrollers[W + 1]),
              _wheelListener(
                _removeListener,
                _scrollers[W],
                _scrollers[W + 2],
              ));
        }
      }),
      (V.config = function (z) {
        "limitCallbacks" in z && (_limitCallbacks = !!z.limitCallbacks);
        var N = z.syncInterval;
        ((N && clearInterval(_syncInterval)) ||
          ((_syncInterval = N) && setInterval(_sync, N)),
          "ignoreMobileResize" in z &&
            (_ignoreMobileResize = V.isTouch === 1 && z.ignoreMobileResize),
          "autoRefreshEvents" in z &&
            (_iterateAutoRefresh(_removeListener) ||
              _iterateAutoRefresh(_addListener, z.autoRefreshEvents || "none"),
            (_ignoreResize =
              (z.autoRefreshEvents + "").indexOf("resize") === -1)));
      }),
      (V.scrollerProxy = function (z, N) {
        var G = _getTarget(z),
          H = _scrollers.indexOf(G),
          W = _isViewport(G);
        (~H && _scrollers.splice(H, W ? 6 : 2),
          N &&
            (W
              ? _proxies.unshift(_win, N, _body, N, _docEl, N)
              : _proxies.unshift(G, N)));
      }),
      (V.clearMatchMedia = function (z) {
        _triggers.forEach(function (N) {
          return N._ctx && N._ctx.query === z && N._ctx.kill(!0, !0);
        });
      }),
      (V.isInViewport = function (z, N, G) {
        var H = (_isString(z) ? _getTarget(z) : z).getBoundingClientRect(),
          W = H[G ? _width : _height] * N || 0;
        return G
          ? H.right - W > 0 && H.left + W < _win.innerWidth
          : H.bottom - W > 0 && H.top + W < _win.innerHeight;
      }),
      (V.positionInViewport = function (z, N, G) {
        _isString(z) && (z = _getTarget(z));
        var H = z.getBoundingClientRect(),
          W = H[G ? _width : _height],
          q =
            N == null
              ? W / 2
              : N in _keywords
                ? _keywords[N] * W
                : ~N.indexOf("%")
                  ? (parseFloat(N) * W) / 100
                  : parseFloat(N) || 0;
        return G
          ? (H.left + q) / _win.innerWidth
          : (H.top + q) / _win.innerHeight;
      }),
      (V.killAll = function (z) {
        if (
          (_triggers.slice(0).forEach(function (G) {
            return G.vars.id !== "ScrollSmoother" && G.kill();
          }),
          z !== !0)
        ) {
          var N = _listeners.killAll || [];
          ((_listeners = {}),
            N.forEach(function (G) {
              return G();
            }));
        }
      }),
      V
    );
  })();
ScrollTrigger.version = "3.12.5";
ScrollTrigger.saveStyles = function (V) {
  return V
    ? _toArray(V).forEach(function (O) {
        if (O && O.style) {
          var B = _savedStyles.indexOf(O);
          (B >= 0 && _savedStyles.splice(B, 5),
            _savedStyles.push(
              O,
              O.style.cssText,
              O.getBBox && O.getAttribute("transform"),
              gsap.core.getCache(O),
              _context(),
            ));
        }
      })
    : _savedStyles;
};
ScrollTrigger.revert = function (V, O) {
  return _revertAll(!V, O);
};
ScrollTrigger.create = function (V, O) {
  return new ScrollTrigger(V, O);
};
ScrollTrigger.refresh = function (V) {
  return V
    ? _onResize()
    : (_coreInitted || ScrollTrigger.register()) && _refreshAll(!0);
};
ScrollTrigger.update = function (V) {
  return ++_scrollers.cache && _updateAll(V === !0 ? 2 : 0);
};
ScrollTrigger.clearScrollMemory = _clearScrollMemory;
ScrollTrigger.maxScroll = function (V, O) {
  return _maxScroll(V, O ? _horizontal : _vertical);
};
ScrollTrigger.getScrollFunc = function (V, O) {
  return _getScrollFunc(_getTarget(V), O ? _horizontal : _vertical);
};
ScrollTrigger.getById = function (V) {
  return _ids[V];
};
ScrollTrigger.getAll = function () {
  return _triggers.filter(function (V) {
    return V.vars.id !== "ScrollSmoother";
  });
};
ScrollTrigger.isScrolling = function () {
  return !!_lastScrollTime;
};
ScrollTrigger.snapDirectional = _snapDirectional;
ScrollTrigger.addEventListener = function (V, O) {
  var B = _listeners[V] || (_listeners[V] = []);
  ~B.indexOf(O) || B.push(O);
};
ScrollTrigger.removeEventListener = function (V, O) {
  var B = _listeners[V],
    z = B && B.indexOf(O);
  z >= 0 && B.splice(z, 1);
};
ScrollTrigger.batch = function (V, O) {
  var B = [],
    z = {},
    N = O.interval || 0.016,
    G = O.batchMax || 1e9,
    H = function (j, Y) {
      var re = [],
        U = [],
        K = gsap
          .delayedCall(N, function () {
            (Y(re, U), (re = []), (U = []));
          })
          .pause();
      return function (Z) {
        (re.length || K.restart(!0),
          re.push(Z.trigger),
          U.push(Z),
          G <= re.length && K.progress(1));
      };
    },
    W;
  for (W in O)
    z[W] =
      W.substr(0, 2) === "on" && _isFunction(O[W]) && W !== "onRefreshInit"
        ? H(W, O[W])
        : O[W];
  return (
    _isFunction(G) &&
      ((G = G()),
      _addListener(ScrollTrigger, "refresh", function () {
        return (G = O.batchMax());
      })),
    _toArray(V).forEach(function (q) {
      var j = {};
      for (W in z) j[W] = z[W];
      ((j.trigger = q), B.push(ScrollTrigger.create(j)));
    }),
    B
  );
};
var _clampScrollAndGetDurationMultiplier = function (O, B, z, N) {
    return (
      B > N ? O(N) : B < 0 && O(0),
      z > N ? (N - B) / (z - B) : z < 0 ? B / (B - z) : 1
    );
  },
  _allowNativePanning = function V(O, B) {
    (B === !0
      ? O.style.removeProperty("touch-action")
      : (O.style.touchAction =
          B === !0
            ? "auto"
            : B
              ? "pan-" + B + (Observer.isTouch ? " pinch-zoom" : "")
              : "none"),
      O === _docEl && V(_body, B));
  },
  _overflow = { auto: 1, scroll: 1 },
  _nestedScroll = function (O) {
    var B = O.event,
      z = O.target,
      N = O.axis,
      G = (B.changedTouches ? B.changedTouches[0] : B).target,
      H = G._gsap || gsap.core.getCache(G),
      W = _getTime(),
      q;
    if (!H._isScrollT || W - H._isScrollT > 2e3) {
      for (
        ;
        G &&
        G !== _body &&
        ((G.scrollHeight <= G.clientHeight && G.scrollWidth <= G.clientWidth) ||
          !(
            _overflow[(q = _getComputedStyle(G)).overflowY] ||
            _overflow[q.overflowX]
          ));
      )
        G = G.parentNode;
      ((H._isScroll =
        G &&
        G !== z &&
        !_isViewport(G) &&
        (_overflow[(q = _getComputedStyle(G)).overflowY] ||
          _overflow[q.overflowX])),
        (H._isScrollT = W));
    }
    (H._isScroll || N === "x") && (B.stopPropagation(), (B._gsapAllow = !0));
  },
  _inputObserver = function (O, B, z, N) {
    return Observer.create({
      target: O,
      capture: !0,
      debounce: !1,
      lockAxis: !0,
      type: B,
      onWheel: (N = N && _nestedScroll),
      onPress: N,
      onDrag: N,
      onScroll: N,
      onEnable: function () {
        return (
          z &&
          _addListener(_doc, Observer.eventTypes[0], _captureInputs, !1, !0)
        );
      },
      onDisable: function () {
        return _removeListener(
          _doc,
          Observer.eventTypes[0],
          _captureInputs,
          !0,
        );
      },
    });
  },
  _inputExp = /(input|label|select|textarea)/i,
  _inputIsFocused,
  _captureInputs = function (O) {
    var B = _inputExp.test(O.target.tagName);
    (B || _inputIsFocused) && ((O._gsapAllow = !0), (_inputIsFocused = B));
  },
  _getScrollNormalizer = function (O) {
    (_isObject(O) || (O = {}),
      (O.preventDefault = O.isNormalizer = O.allowClicks = !0),
      O.type || (O.type = "wheel,touch"),
      (O.debounce = !!O.debounce),
      (O.id = O.id || "normalizer"));
    var B = O,
      z = B.normalizeScrollX,
      N = B.momentum,
      G = B.allowNestedScroll,
      H = B.onRelease,
      W,
      q,
      j = _getTarget(O.target) || _docEl,
      Y = gsap.core.globals().ScrollSmoother,
      re = Y && Y.get(),
      U =
        _fixIOSBug &&
        ((O.content && _getTarget(O.content)) ||
          (re && O.content !== !1 && !re.smooth() && re.content())),
      K = _getScrollFunc(j, _vertical),
      Z = _getScrollFunc(j, _horizontal),
      X = 1,
      se =
        (Observer.isTouch && _win.visualViewport
          ? _win.visualViewport.scale * _win.visualViewport.width
          : _win.outerWidth) / _win.innerWidth,
      Q = 0,
      te = _isFunction(N)
        ? function () {
            return N(W);
          }
        : function () {
            return N || 2.8;
          },
      J,
      ee,
      ne = _inputObserver(j, O.type, !0, G),
      oe = function () {
        return (ee = !1);
      },
      he = _passThrough,
      ce = _passThrough,
      ue = function () {
        ((q = _maxScroll(j, _vertical)),
          (ce = _clamp(_fixIOSBug ? 1 : 0, q)),
          z && (he = _clamp(0, _maxScroll(j, _horizontal))),
          (J = _refreshID));
      },
      ge = function () {
        ((U._gsap.y = _round(parseFloat(U._gsap.y) + K.offset) + "px"),
          (U.style.transform =
            "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " +
            parseFloat(U._gsap.y) +
            ", 0, 1)"),
          (K.offset = K.cacheID = 0));
      },
      ye = function () {
        if (ee) {
          requestAnimationFrame(oe);
          var ie = _round(W.deltaY / 2),
            ae = ce(K.v - ie);
          if (U && ae !== K.v + K.offset) {
            K.offset = ae - K.v;
            var fe = _round((parseFloat(U && U._gsap.y) || 0) - K.offset);
            ((U.style.transform =
              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " +
              fe +
              ", 0, 1)"),
              (U._gsap.y = fe + "px"),
              (K.cacheID = _scrollers.cache),
              _updateAll());
          }
          return !0;
        }
        (K.offset && ge(), (ee = !0));
      },
      me,
      be,
      Se,
      _e,
      le = function () {
        (ue(),
          me.isActive() &&
            me.vars.scrollY > q &&
            (K() > q ? me.progress(1) && K(q) : me.resetTo("scrollY", q)));
      };
    return (
      U && gsap.set(U, { y: "+=0" }),
      (O.ignoreCheck = function (pe) {
        return (
          (_fixIOSBug && pe.type === "touchmove" && ye()) ||
          (X > 1.05 && pe.type !== "touchstart") ||
          W.isGesturing ||
          (pe.touches && pe.touches.length > 1)
        );
      }),
      (O.onPress = function () {
        ee = !1;
        var pe = X;
        ((X = _round(
          ((_win.visualViewport && _win.visualViewport.scale) || 1) / se,
        )),
          me.pause(),
          pe !== X && _allowNativePanning(j, X > 1.01 ? !0 : z ? !1 : "x"),
          (be = Z()),
          (Se = K()),
          ue(),
          (J = _refreshID));
      }),
      (O.onRelease = O.onGestureStart =
        function (pe, ie) {
          if ((K.offset && ge(), !ie)) _e.restart(!0);
          else {
            _scrollers.cache++;
            var ae = te(),
              fe,
              de;
            (z &&
              ((fe = Z()),
              (de = fe + (ae * 0.05 * -pe.velocityX) / 0.227),
              (ae *= _clampScrollAndGetDurationMultiplier(
                Z,
                fe,
                de,
                _maxScroll(j, _horizontal),
              )),
              (me.vars.scrollX = he(de))),
              (fe = K()),
              (de = fe + (ae * 0.05 * -pe.velocityY) / 0.227),
              (ae *= _clampScrollAndGetDurationMultiplier(
                K,
                fe,
                de,
                _maxScroll(j, _vertical),
              )),
              (me.vars.scrollY = ce(de)),
              me.invalidate().duration(ae).play(0.01),
              ((_fixIOSBug && me.vars.scrollY >= q) || fe >= q - 1) &&
                gsap.to({}, { onUpdate: le, duration: ae }));
          }
          H && H(pe);
        }),
      (O.onWheel = function () {
        (me._ts && me.pause(),
          _getTime() - Q > 1e3 && ((J = 0), (Q = _getTime())));
      }),
      (O.onChange = function (pe, ie, ae, fe, de) {
        if (
          (_refreshID !== J && ue(),
          ie &&
            z &&
            Z(he(fe[2] === ie ? be + (pe.startX - pe.x) : Z() + ie - fe[1])),
          ae)
        ) {
          K.offset && ge();
          var xe = de[2] === ae,
            we = xe ? Se + pe.startY - pe.y : K() + ae - de[1],
            Ee = ce(we);
          (xe && we !== Ee && (Se += Ee - we), K(Ee));
        }
        (ae || ie) && _updateAll();
      }),
      (O.onEnable = function () {
        (_allowNativePanning(j, z ? !1 : "x"),
          ScrollTrigger.addEventListener("refresh", le),
          _addListener(_win, "resize", le),
          K.smooth &&
            ((K.target.style.scrollBehavior = "auto"),
            (K.smooth = Z.smooth = !1)),
          ne.enable());
      }),
      (O.onDisable = function () {
        (_allowNativePanning(j, !0),
          _removeListener(_win, "resize", le),
          ScrollTrigger.removeEventListener("refresh", le),
          ne.kill());
      }),
      (O.lockAxis = O.lockAxis !== !1),
      (W = new Observer(O)),
      (W.iOS = _fixIOSBug),
      _fixIOSBug && !K() && K(1),
      _fixIOSBug && gsap.ticker.add(_passThrough),
      (_e = W._dc),
      (me = gsap.to(W, {
        ease: "power4",
        paused: !0,
        inherit: !1,
        scrollX: z ? "+=0.1" : "+=0",
        scrollY: "+=0.1",
        modifiers: {
          scrollY: _interruptionTracker(K, K(), function () {
            return me.pause();
          }),
        },
        onUpdate: _updateAll,
        onComplete: _e.vars.onComplete,
      })),
      W
    );
  };
ScrollTrigger.sort = function (V) {
  return _triggers.sort(
    V ||
      function (O, B) {
        return (
          (O.vars.refreshPriority || 0) * -1e6 +
          O.start -
          (B.start + (B.vars.refreshPriority || 0) * -1e6)
        );
      },
  );
};
ScrollTrigger.observe = function (V) {
  return new Observer(V);
};
ScrollTrigger.normalizeScroll = function (V) {
  if (typeof V > "u") return _normalizer;
  if (V === !0 && _normalizer) return _normalizer.enable();
  if (V === !1) {
    (_normalizer && _normalizer.kill(), (_normalizer = V));
    return;
  }
  var O = V instanceof Observer ? V : _getScrollNormalizer(V);
  return (
    _normalizer && _normalizer.target === O.target && _normalizer.kill(),
    _isViewport(O.target) && (_normalizer = O),
    O
  );
};
ScrollTrigger.core = {
  _getVelocityProp,
  _inputObserver,
  _scrollers,
  _proxies,
  bridge: {
    ss: function () {
      (_lastScrollTime || _dispatch("scrollStart"),
        (_lastScrollTime = _getTime()));
    },
    ref: function () {
      return _refreshing;
    },
  },
};
_getGSAP() && gsap.registerPlugin(ScrollTrigger);
gsapWithCSS.registerPlugin(ScrollTrigger);
const initSmoothScrolling = () => {
    const V = new Lenis({ lerp: 0.2 });
    (V.on("scroll", ScrollTrigger.update),
      gsapWithCSS.ticker.add((O) => {
        V.raf(O * 1e3);
      }),
      gsapWithCSS.ticker.lagSmoothing(0));
  },
  splitTextAnimation = () => {
    function V() {
      document.querySelectorAll(".splitText").forEach((O) => {
        const z = O.textContent
          .trim()
          .split(/\s+/)
          .map((N) => `<span><span>${N}</span></span>`)
          .join(" ");
        O.innerHTML = z;
      });
    }
    (V(),
      gsapWithCSS.utils.toArray(".splitText").forEach((O) => {
        gsapWithCSS.to(O.querySelectorAll("span span"), {
          y: 0,
          duration: 1,
          stagger: 0.01,
          ease: "power3.out",
          scrollTrigger: {
            trigger: O,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }));
  },
  animateNumbering = () => {
    document.querySelectorAll(".fontNumber").forEach((V) => {
      const O = parseInt(V.textContent.replace(/[^\d]/g, ""));
      gsapWithCSS
        .timeline({
          scrollTrigger: {
            trigger: V,
            start: "top bottom",
            toggleActions: "play none none none",
          },
          defaults: { duration: 2, ease: "power1.inOut" },
        })
        .fromTo(
          V,
          { innerText: 0 },
          {
            innerText: O,
            roundProps: "innerText",
            ease: "power3.inOut",
            onUpdate: () =>
              (V.textContent =
                "+" + Math.ceil(gsapWithCSS.getProperty(V, "innerText"))),
            onComplete: () => (V.textContent = "+" + O),
          },
        );
    });
  },
  animateImage_whatwedo = () => {
    gsapWithCSS.utils
      .toArray(".what_we_do .wrapper .row .img img")
      .forEach((V) => {
        gsapWithCSS.to(V, {
          clipPath: "inset(0 0 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: V,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
            onUpdate: (O) => {
              gsapWithCSS.to(V, {
                clipPath: `inset(0 ${100 - O.progress * 100}% 0 0)`,
                duration: 0.1,
                ease: "none",
              });
            },
          },
        });
      });
  },
  animateService = () => {
    const V = document.querySelectorAll(".accordians_wrapper .accordion");
    V &&
      V.forEach((O) => {
        gsapWithCSS.fromTo(
          O,
          { x: "35%", opacity: 0 },
          {
            x: "0%",
            opacity: 1,
            duration: 1,
            ease: "none",
            scrollTrigger: {
              trigger: O,
              start: "top 90%",
              end: "top 70%",
              scrub: 1.4,
            },
          },
        );
      });
  },
  animateImage_About = () => {
    const V = document.querySelector(".about_header_img img");
    V &&
      gsapWithCSS.to(V, {
        scale: 1.2,
        scrollTrigger: {
          trigger: ".about_header_img",
          start: "top center",
          end: "bottom center",
          scrub: !0,
        },
      });
  },
  mouseMoveImage = () => {
    const V = document.querySelectorAll("#careerBlocks .row");
    if (V.length > 0) {
      const O = document.createElement("div");
      ((O.className = "image-overlay"), document.body.appendChild(O));
      const B = { duration: 0.5, ease: "power3.out" };
      V.forEach((z) => {
        (z.addEventListener("mouseenter", () => {
          ((O.style.backgroundImage = `url(${z.getAttribute("data-image")})`),
            gsapWithCSS.to(O, { scale: 1, opacity: 1, ...B }));
        }),
          z.addEventListener("mousemove", (N) => {
            gsapWithCSS.to(O, {
              x: N.clientX - 100,
              y: N.clientY - 100,
              duration: 0.3,
              ease: "power3.out",
            });
          }),
          z.addEventListener("mouseleave", () => {
            gsapWithCSS.to(O, { scale: 0, opacity: 0, ...B });
          }));
      });
    }
  },
  animateImage_ProjectSingle = () => {
    const V = document.querySelector(".projectSingle_header_img img");
    V &&
      gsapWithCSS.to(V, {
        scale: 1.2,
        scrollTrigger: {
          trigger: ".projectSingle_header_img",
          start: "top center",
          end: "bottom center",
          scrub: !0,
        },
      });
  },
  animateMultipleImage_ProjectSingle = () => {
    const V = document.querySelectorAll(".image_holder img");
    V.length &&
      V.forEach((O) => {
        gsapWithCSS.to(O, {
          scale: 1,
          scrollTrigger: {
            trigger: O.closest(".image_holder"),
            start: "top center",
            end: "bottom center",
            scrub: !0,
          },
        });
      });
  };
function init() {
  (initSmoothScrolling(),
    splitTextAnimation(),
    animateNumbering(),
    animateImage_whatwedo(),
    animateService(),
    animateImage_About(),
    mouseMoveImage(),
    animateImage_ProjectSingle(),
    animateMultipleImage_ProjectSingle(),
    ScrollTrigger.refresh());
}
function createIntroAnimation() {
  if (!document.querySelector(".intro")) return;
  const O = gsapWithCSS.timeline({ defaults: { ease: "power4.inOut" } });
  (O.set(".intro img", {}),
    O.from(".intro_text_heading h1", { duration: 0.7, y: "100%" }),
    O.from(
      ".intro_text_p h2",
      { duration: 1, y: "100%", delay: 0.2, stagger: 0.2 },
      "-=0.5",
    ),
    O.from(
      ".intro img",
      { duration: 1.5, clipPath: "inset(100% 0 0 0)" },
      "-=1.5",
    ),
    O.to(".intro_text_heading h1", { duration: 0.7, y: "-100%" }, "+=1.5"),
    O.to(".intro_text_p h2", { duration: 1, y: "-100%", stagger: 0.2 }, "-=.5"),
    O.to(
      ".intro img",
      { duration: 1.5, clipPath: "inset(0 0 100% 0)", ease: "power4.inOut" },
      "-=0.5",
    ),
    O.to(
      ".intro",
      { duration: 1.5, y: "-100%", ease: "power4.inOut" },
      "-=0.5",
    ),
    O.to(".hero", { duration: 1, opacity: 1, ease: "power4.inOut" }, "-=.5"),
    O.from(
      ".hero h1",
      { duration: 1.5, y: "80%", opacity: 0, ease: "power4.inOut", skewY: 1 },
      "-=1",
    ),
    O.call(() => {
      document.querySelector(".intro").style.display = "none";
    }));
}
function flip_Link_hover() {
  document.querySelectorAll(".flip__link--text").forEach((O) => {
    const B = O.textContent.trim();
    ((O.innerHTML = ""),
      B.split("").forEach((z, N) => {
        const G = document.createElement("span");
        ((G.className = "char"),
          G.style.setProperty("--char-index", N),
          (G.textContent = z),
          O.appendChild(G));
      }));
  });
}
const bioData = [
  { currently: "Currently", role: "Development Head at NovaBitz" },
  { currently: "Freelancer", role: "Anfisign & others" },
  { currently: "Specialized at", role: "UI/UX, Development & Branding" },
  { currently: "Empowering", role: "Website Development" },
  { currently: "Enthusiastic by", role: "Digital, Art & Technology" },
  { currently: "From", role: "UK, England" },
];
function fetching_Bio_Data() {
  const V = document.querySelector(".bio .container");
  if (V) {
    const O = bioData
        .slice(0, 3)
        .map(
          (z) => `
            <div>
                <p class="font12 splitText">${z.currently}</p>
                <p class="font12 splitText">${z.role}</p>
            </div>
        `,
        )
        .join(""),
      B = bioData
        .slice(3)
        .map(
          (z) => `
            <div>
                <p class="font12 splitText">${z.currently}</p>
                <p class="font12 splitText">${z.role}</p>
            </div>
        `,
        )
        .join("");
    V.innerHTML = `
            <div class="bio_wrapper">${O}</div>
            <div class="bio_wrapper">${B}</div>
        `;
  }
}
const featuredProjects = [
  {
    link: "projectsingle.html",
    title: "ThreadLuxe",
    description: "UIUX Design, Branding",
    images: ["/case1_1.jpg", "/case1_2.jpg"],
  },
  {
    link: "projectsingle.html",
    title: "Benctlear",
    description: "Art Direction, Branding, UIUX Design",
    images: ["/case2_1.jpg", "/case2_2.jpg"],
  },
  {
    link: "projectsingle.html",
    title: "Catalyst",
    description: "UIUX Design, Web Development",
    images: ["/case3_1.png", "/case3_2.png"],
  },
];
function adding_featured_Projects() {
  const V = document.querySelector(".featured_projects_wrapper");
  if (V) {
    const B = featuredProjects
      .reduce((z, N, G) => {
        const H = Math.floor(G / 2);
        return (z[H] || (z[H] = []), z[H].push(N), z);
      }, [])
      .map(
        (z, N) => `
            <div class="row row${N + 1}">
                ${z
                  .map(
                    (G) => `
                    <a href="${G.link}" class="case">
                        <div class="projectCase">
                            ${G.images.map((H) => `<img src="${H}" alt="${G.title}" />`).join("")}
                        </div>
                        <div class="details">
                            <h5 class="font12 splitText">${G.title}</h5>
                            <p class="font12 splitText">${G.description}</p>
                        </div>
                    </a>
                `,
                  )
                  .join("")}
            </div>
        `,
      )
      .join("");
    V.innerHTML = B;
  }
}
const accordianData = [
  {
    question: "Branding",
    answer:
      "Your brand’s identity is its visual voice, and I am here to make sure it speaks volumes. From logo design to comprehensive brand guidelines, I provide cohesive branding solutions that reflect your company's values and resonate with your target audience. My goal is to create a strong, memorable brand identity that sets you apart from the competition.",
    tag: "Brand Guidelines <br> Marketing Collateral <br> Logo Design",
  },
  {
    question: "uiux design",
    answer:
      "Creating visually stunning and intuitive interfaces is my forte. I specialize in crafting web and mobile app interfaces that not only look beautiful but also provide a seamless user experience. Understanding user needs and behaviors is crucial for designing products that resonate. My UX design services encompass comprehensive user research and analysis, wireframing, and prototyping, as well as thorough usability testing.",
    tag: "Interactive Prototypes <br> Visual Design Systems <br> User Research and Analysis <br> Wireframing and Prototyping <br> Usability Testing",
  },
  {
    question: "motion graphics",
    answer:
      "Bring your ideas to life with dynamic motion graphics and animations. From explainer videos to animated UI elements and logo animations, I create engaging visual content that can help convey complex ideas simply and effectively. Motion graphics add a layer of sophistication to your digital presence, making your content more compelling and memorable.",
    tag: "Explainer Videos <br> Animated UI Elements <br> Logo Animations",
  },
  {
    question: "Web Development",
    answer:
      "I build responsive, visually appealing websites that offer a seamless user experience across all devices. By utilizing the latest HTML, CSS, SASS, Tailwind, JS, ReactJS & NextJS technologies, I create interactive features and animations that enhance user engagement. My front-end development services ensure that your website looks great and performs flawlessly. Behind every great website is a powerful backend. I offer server-side scripting, database integration, and API development services to create robust, scalable web applications. My back-end development expertise ensures that your website is fast, secure, and capable of handling your business needs.",
    tag: "Responsive Web Design <br> NextJS Development <br> Interactive Animations <br> Framer Development <br> Server-Side Scripting <br> Database Integration <br> API Development",
  },
  {
    question: "Strategy",
    answer:
      "Navigate the digital world with confidence through my consultation and strategy services. I offer digital strategy planning, design and development consultation, and user experience audits to help you make informed decisions. By understanding your goals and challenges, I provide actionable insights and tailored strategies to achieve success.",
    tag: "Digital Strategy Planning <br> Design and Development Consultation <br> User Experience Audits",
  },
];
function fetch_accordionData() {
  function V() {
    const B = document.querySelector(".accordians_wrapper");
    if (!B) return;
    const z = accordianData
      .map(
        (N) => `
            <div class="accordion">
                <div class="question">
                    <h5 class="font36">${N.question}</h5>
                    <div class="close"><img src="close.png"></div>
                </div>
                <div class="answer">
                    <p class="font12">${N.answer}</p>
                    <div class="tags mT20">
                        <p class="font12">${N.tag}</p>
                    </div>
                </div>
            </div>
        `,
      )
      .join("");
    B.innerHTML = z;
  }
  function O() {
    const B = document.querySelectorAll(".accordion");
    function z(N) {
      B.forEach((G) => {
        const H = G.querySelector(".answer");
        H !== N &&
          H.style.height !== "0px" &&
          ((H.style.height = "0px"),
          (H.style.opacity = "0"),
          G.querySelector(".close").classList.remove("rotate"));
      });
    }
    B.forEach((N) => {
      const G = N.querySelector(".answer"),
        H = N.querySelector(".close");
      (N.addEventListener("click", function () {
        G.style.height !== "0px"
          ? ((G.style.height = "0px"),
            (G.style.opacity = "0"),
            (G.style.marginTop = "0"),
            H.classList.remove("rotate"))
          : (z(G),
            (G.style.height = `${G.scrollHeight}px`),
            (G.style.opacity = "1"),
            (G.style.marginTop = "1rem"),
            H.classList.add("rotate"));
      }),
        (G.style.height = "0px"),
        (G.style.opacity = "0"),
        (G.style.marginTop = "0"));
    });
  }
  (V(), O());
}
const data = [
  {
    title: "Research",
    text: "Through in-depth research, I aim to fully grasp the project's objectives and requirements. I develop a visual moodboard to lay the groundwork for typography, layout, motion, and color, ensuring a seamless blend of functionality and user engagement.",
    imgSrc: "whatWeDo1.png",
    alt: "Research",
  },
  {
    title: "Design",
    text: "Once the research is complete, I transition to the design phase. Here, I dive into design exploration, crafting concepts, developing brand identity, ensuring visual consistency, and planning for scalability.",
    imgSrc: "whatWeDo2.jpg",
    alt: "Design",
  },
  {
    title: "Creation",
    text: "As the design takes shape, I shift into the creation phase, where dynamic feedback drives the development of an engaging product. Here, I incorporate motion and interactivity to bring aesthetics to life, blending clear intent with a memorable user experience.",
    imgSrc: "whatWeDo3.png",
    alt: "Creation",
  },
  {
    title: "Creative Development",
    text: "After the creation phase, it's time for the handoff. This stage is where the final touches are meticulously added, and essential documentation is created. I maintain close collaboration with creative developers to bring the envisioned interaction and experience to life with precision and dedication, transforming the ordinary into the extraordinary.",
    imgSrc: "whatWeDo4.jpg",
    alt: "Creative Development",
  },
];
function fetch_row_whatWeDo() {
  const V = document.querySelector(".what_we_do .wrapper");
  V &&
    (V.innerHTML = data
      .map(
        (O) => `
    <div class="row">
        <div class="title">
            <h5 class="font12 splitText">${O.title}</h5>
            <p class="font12 splitText">${O.text}</p>
        </div>
        <div class="img">
            <img src="${O.imgSrc}" alt="${O.alt}">
        </div>
    </div>
    `,
      )
      .join(""));
}
const projects = [
  {
    name: "Pillars",
    img1: "/case9_1.png",
    img2: "/case9_2.png",
    details: "UIUX Design, Branding Identity",
    link: "projectsingle.html",
  },
  {
    name: "Chi-Golf",
    img1: "/case8_1.jpg",
    img2: "/case8_2.jpg",
    details: "Branding, Brand Identity",
    link: "projectsingle.html",
  },
  {
    name: "Theonys",
    img1: "/case7_1.jpg",
    img2: "/case7_2.jpg",
    details: "Branding, Web Development",
    link: "projectsingle.html",
  },
  {
    name: "Emendor",
    img1: "/case6_1.png",
    img2: "/case6_2.png",
    details: "Web Development",
    link: "projectsingle.html",
  },
  {
    name: "Suttere",
    img1: "/case5_1.png",
    img2: "/case5_2.png",
    details: "UIUX Design, Web Development",
    link: "projectsingle.html",
  },
  {
    name: "Jetpack",
    img1: "/case4_1.jpg",
    img2: "/case4_2.jpg",
    details: "Logo, Branding",
    link: "projectsingle.html",
  },
  {
    name: "ThreadLuxe",
    img1: "/case1_1.jpg",
    img2: "/case1_2.jpg",
    details: "UIUX Design, Branding",
    link: "projectsingle.html",
  },
  {
    name: "Benctlear",
    img1: "/case2_1.jpg",
    img2: "/case2_2.jpg",
    details: "Art Direction, Branding, UIUX Design",
    link: "projectsingle.html",
  },
  {
    name: "Catalyst",
    img1: "/case3_1.png",
    img2: "/case3_2.png",
    details: "UIUX Design, Web Development",
    link: "projectsingle.html",
  },
];
function adding_projects_projectPage() {
  const V = document.getElementById("projectsContainer");
  V &&
    (V.innerHTML = projects
      .map(
        (O) => `
        <a href="${O.link}" class="case">
            <div class="projectCase">
                <img src="${O.img1}" alt="${O.name}">
                <img src="${O.img2}" alt="${O.name}">
            </div>
            <div class="details">
                <h5 class="font12 splitText">${O.name}</h5>
                <p class="font12 splitText">${O.details}</p>
            </div>
        </a>
    `,
      )
      .join(""));
}
const careerData = [
  {
    year: "2024 - Present",
    experiences: [
      {
        company: "Toptal",
        role: "Head of Development",
        image: "aboutrow1.png",
      },
      {
        company: "Frog Design",
        role: "Freelancer as Designer",
        image: "aboutrow2.png",
      },
      { company: "IDEO", role: "Lead Designer", image: "aboutrow3.png" },
    ],
  },
  {
    year: "2023",
    experiences: [
      {
        company: "ThoughtBot",
        role: "Freelancer as a Web Developer",
        image: "aboutrow4.png",
      },
      { company: "Balsamiq", role: "UX Researcher", image: "aboutrow5.png" },
    ],
  },
  {
    year: "2022",
    experiences: [
      {
        company: "UXPin",
        role: "Head of UX / Director of UX",
        image: "aboutrow6.png",
      },
      {
        company: "Landor",
        role: "Freelancer as Web Developer",
        image: "aboutrow7.png",
      },
      {
        company: "Hatch Labs",
        role: "Freelancer as UIUX Designer",
        image: "aboutrow8.png",
      },
    ],
  },
  {
    year: "2021",
    experiences: [
      {
        company: "Cleveroad",
        role: "Freelancer as Motion Designer",
        image: "aboutrow9.png",
      },
      {
        company: "Y Media Labs",
        role: "Freelancer as Fullstack Developer",
        image: "aboutrow10.png",
      },
    ],
  },
];
function adding_careerBlocks_about() {
  const V = document.getElementById("careerBlocks");
  V &&
    (V.innerHTML = careerData
      .map(
        (O) => `
            <div class="block mT70">
                <div class="heading">
                    <h3 class="font36 splitText">${O.year}</h3>
                </div>
                <div class="wrapper">
                    ${O.experiences
                      .map(
                        (B) => `
                        <div class="row" data-image="${B.image}">
                            <p class="font12 splitText">${B.company}</p>
                            <p class="font12 splitText">${B.role}</p>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `,
      )
      .join(""));
}
function fetch_Data() {
  (fetching_Bio_Data(),
    adding_featured_Projects(),
    fetch_row_whatWeDo(),
    fetch_accordionData(),
    adding_projects_projectPage(),
    adding_careerBlocks_about());
}
const links = [
    { name: "Projects", url: "projects.html" },
    { name: "About", url: "about.html" },
    { name: "Playground", url: "playground.html" },
    { name: "Contact", url: "contact.html" },
  ],
  navHTML = `
<nav>
    <div class="container">
        <a href="/" class="flip__link" id="logo">
            <span class="flip__link--text">Rebel&nbsp;Grace</span>
            <span class="flip__link--text">Rebel&nbsp;Grace</span>
        </a>
        <div class="nav_links">
            ${links
              .map(
                (V) => `
                <a href="${V.url}" class="flip__link">
                    <span class="flip__link--text">${V.name}</span>
                    <span class="flip__link--text">${V.name}</span>
                </a>
            `,
              )
              .join("")}
        </div>
        <div class="hamburger">
            <div></div>
            <div></div>
        </div>
    </div>
    <div class="navBlur">
        ${"<div></div>".repeat(4)}
    </div>
</nav>`;
document.body.insertAdjacentHTML("afterbegin", navHTML);
const slidingNav = document.createElement("div");
slidingNav.className = "sliding_navigation";
slidingNav.innerHTML = links
  .map(
    (V) => `
    <a href="${V.url}" class="flip__link">
        <span class="flip__link--text">${V.name}</span>
        <span class="flip__link--text">${V.name}</span>
    </a>
`,
  )
  .join("");
document.body.appendChild(slidingNav);
function animatingNav() {
  const V = (N, G) => N.classList.toggle(G),
    O = document.querySelector(".hamburger"),
    B = document.querySelector(".sliding_navigation"),
    z = document.querySelector(".overlay");
  [O, z].forEach((N) => {
    N.addEventListener("click", () => {
      (V(B, "active"), V(O, "active"), V(z, "active"));
    });
  });
}
animatingNav();
function CreateFooter() {
  const V = document.querySelector("footer");
  V &&
    (V.innerHTML = `
        <div class="container">
            <div class="top">
                <div class="left">
                    <h4 class="font36">Interested in collaborating with me?</h4>
                    <p class="font12">
                        Together, we have the power to shape and design the world we envision, transforming our shared ideas into
                        reality through innovative and creative solutions.
                    </p>
                </div>
                <div class="right">
                    <p class="font12">51° 30' 26.64'' N / 0° 7' 40.08'' W</p>
                    <p class="font12">Remote From England, UK</p>
                </div>
            </div>
            <div class="center">
                <div class="left">
                    <p class="font12">Drop a message</p>
                    <a href="mailto:mrzaidsaeed@gmail.com" class="flip__link">
                        <span class="flip__link--text">hello@rebelgrace.com</span>
                        <span class="flip__link--text">hello@rebelgrace.com</span>
                    </a>
                </div>
                <div class="right">
                    ${[
                      {
                        platform: "Twitter",
                        url: "https://ui8.net/users/frontendzaid",
                      },
                      {
                        platform: "Facebook",
                        url: "https://ui8.net/users/frontendzaid",
                      },
                      {
                        platform: "Linkedin",
                        url: "https://ui8.net/users/frontendzaid",
                      },
                      {
                        platform: "Instagram",
                        url: "https://ui8.net/users/frontendzaid",
                      },
                      {
                        platform: "Behance",
                        url: "https://ui8.net/users/frontendzaid",
                      },
                      {
                        platform: "Dribble",
                        url: "https://dribbble.com/zaidkhan3419",
                      },
                    ]
                      .map(
                        ({ platform: O, url: B }) => `
                        <a href="${B}" class="flip__link" target="_blank" rel="noopener noreferrer">
                            <span class="flip__link--text">${O}</span>
                            <span class="flip__link--text">${O}</span>
                        </a>`,
                      )
                      .join("")}
                </div>
            </div>
            <div class="bottom">
                <p class="font12">
                    Copyright © 2024 Rebel Grace. All rights reserved.
                    <span>Design & Development by Zaid</span>
                </p>
            </div>
        </div>
        `);
}
CreateFooter();
document.addEventListener("DOMContentLoaded", function () {
  const V = document.createElement("div");
  V.className = "loader";
  const O = `
            <span class="spinner"></span>
        `;
  ((V.innerHTML = O), document.body.appendChild(V));
});
function sheryJS() {
  (Shery.imageEffect(".heroimage", {
    style: 6,
    gooey: !0,
    config: {
      noiseDetail: { value: 7.63, range: [0, 100] },
      distortionAmount: { value: 1.68, range: [0, 10] },
      scale: { value: 38.93, range: [0, 100] },
      speed: { value: 0.76, range: [0, 1] },
      zindex: { value: -9996999, range: [-9999999, 9999999] },
      aspect: { value: 2.082236837977518 },
      ignoreShapeAspect: { value: !0 },
      shapePosition: { value: { x: 0, y: 0 } },
      shapeScale: { value: { x: 0.5, y: 0.5 } },
      shapeEdgeSoftness: { value: 0.5, range: [0, 0.5] },
      shapeRadius: { value: 0, range: [0, 2] },
      currentScroll: { value: 0 },
      scrollLerp: { value: 0.07 },
      gooey: { value: !0 },
      infiniteGooey: { value: !0 },
      growSize: { value: 4, range: [1, 15] },
      durationOut: { value: 1, range: [0.1, 5] },
      durationIn: { value: 1.5, range: [0.1, 5] },
      displaceAmount: { value: 0.5 },
      masker: { value: !0 },
      maskVal: { value: 1, range: [1, 5] },
      scrollType: { value: 0 },
      geoVertex: { range: [1, 64], value: 1 },
      noEffectGooey: { value: !0 },
      onMouse: { value: 0 },
      noise_speed: { value: 0.84, range: [0, 10] },
      metaball: { value: 0.21, range: [0, 2] },
      discard_threshold: { value: 0.58, range: [0, 1] },
      antialias_threshold: { value: 0.02, range: [0, 0.1] },
      noise_height: { value: 0.29, range: [0, 2] },
      noise_scale: { value: 10.69, range: [0, 100] },
    },
  }),
    Shery.imageEffect(".projectCase", {
      style: 6,
      gooey: !0,
      config: {
        noiseDetail: { value: 6.11, range: [0, 100] },
        distortionAmount: { value: 2.14, range: [0, 10] },
        scale: { value: 38.93, range: [0, 100] },
        speed: { value: 0.76, range: [0, 1] },
        zindex: { value: -9996999, range: [-9999999, 9999999] },
        aspect: { value: 0.9327999877929688 },
        ignoreShapeAspect: { value: !0 },
        shapePosition: { value: { x: 0, y: 0 } },
        shapeScale: { value: { x: 0.5, y: 0.5 } },
        shapeEdgeSoftness: { value: 0.5, range: [0, 0.5] },
        shapeRadius: { value: 0, range: [0, 2] },
        currentScroll: { value: 0 },
        scrollLerp: { value: 0.07 },
        gooey: { value: !0 },
        infiniteGooey: { value: !0 },
        growSize: { value: 4, range: [1, 15] },
        durationOut: { value: 1, range: [0.1, 5] },
        durationIn: { value: 1.5, range: [0.1, 5] },
        displaceAmount: { value: 0.5 },
        masker: { value: !0 },
        maskVal: { value: 1.2, range: [1, 5] },
        scrollType: { value: 0 },
        geoVertex: { range: [1, 64], value: 1 },
        noEffectGooey: { value: !1 },
        onMouse: { value: 0 },
        noise_speed: { value: 0.84, range: [0, 10] },
        metaball: { value: 0.46, range: [0, 2] },
        discard_threshold: { value: 0.65, range: [0, 1] },
        antialias_threshold: { value: 0.02, range: [0, 0.1] },
        noise_height: { value: 0.4, range: [0, 2] },
        noise_scale: { value: 11.45, range: [0, 100] },
      },
    }),
    Shery.imageEffect(".areasImage", {
      style: 2,
      config: {
        resolutionXY: { value: 100 },
        distortion: { value: !0 },
        mode: { value: -10 },
        mousemove: { value: 2 },
        modeA: { value: 0 },
        modeN: { value: 0 },
        speed: { value: -2.31, range: [-500, 500], rangep: [-10, 10] },
        frequency: { value: 50, range: [-800, 800], rangep: [-50, 50] },
        angle: { value: 0.72, range: [0, 3.141592653589793] },
        waveFactor: { value: 1.4, range: [-3, 3] },
        color: { value: 10212607 },
        pixelStrength: { value: 3, range: [-20, 100], rangep: [-20, 20] },
        quality: { value: 5, range: [0, 10] },
        contrast: { value: 1, range: [-25, 25] },
        brightness: { value: 1, range: [-1, 25] },
        colorExposer: { value: 0.18, range: [-5, 5] },
        strength: { value: 0.2, range: [-40, 40], rangep: [-5, 5] },
        exposer: { value: 8, range: [-100, 100] },
        zindex: { value: -9996999, range: [-9999999, 9999999] },
        aspect: { value: 1.0578135176689285 },
        ignoreShapeAspect: { value: !0 },
        shapePosition: { value: { x: 0, y: 0 } },
        shapeScale: { value: { x: 0.5, y: 0.5 } },
        shapeEdgeSoftness: { value: 0, range: [0, 0.5] },
        shapeRadius: { value: 0, range: [0, 2] },
        currentScroll: { value: 0 },
        scrollLerp: { value: 0.07 },
        gooey: { value: !1 },
        infiniteGooey: { value: !1 },
        growSize: { value: 4, range: [1, 15] },
        durationOut: { value: 1, range: [0.1, 5] },
        durationIn: { value: 1.5, range: [0.1, 5] },
        displaceAmount: { value: 0.5 },
        masker: { value: !1 },
        maskVal: { value: 1, range: [1, 5] },
        scrollType: { value: 0 },
        geoVertex: { range: [1, 64], value: 1 },
        noEffectGooey: { value: !0 },
        onMouse: { value: 1 },
        noise_speed: { value: 0.2, range: [0, 10] },
        metaball: { value: 0.2, range: [0, 2] },
        discard_threshold: { value: 0.5, range: [0, 1] },
        antialias_threshold: { value: 0.002, range: [0, 0.1] },
        noise_height: { value: 0.5, range: [0, 2] },
        noise_scale: { value: 10, range: [0, 100] },
      },
      preset: "./presets/wigglewobble.json",
    }),
    Shery.imageEffect(".playground_images", {
      style: 5,
      scrollSpeed: 12,
      touchSpeed: 12,
      damping: 1,
      config: {
        a: { value: 0.69, range: [0, 30] },
        b: { value: -0.98, range: [-1, 1] },
        zindex: { value: -9996999, range: [-9999999, 9999999] },
        aspect: { value: 2.0317460317460316 },
        ignoreShapeAspect: { value: !0 },
        shapePosition: { value: { x: 0, y: 0 } },
        shapeScale: { value: { x: 0.5, y: 0.5 } },
        shapeEdgeSoftness: { value: 0, range: [0, 0.5] },
        shapeRadius: { value: 0, range: [0, 2] },
        currentScroll: { value: 1.997183207363943 },
        scrollLerp: { value: 0.2 },
        gooey: { value: !1 },
        infiniteGooey: { value: !0 },
        growSize: { value: 4, range: [1, 15] },
        durationOut: { value: 1, range: [0.1, 5] },
        durationIn: { value: 1.5, range: [0.1, 5] },
        displaceAmount: { value: 0.5 },
        masker: { value: !1 },
        maskVal: { value: 1, range: [1, 5] },
        scrollType: { value: 0 },
        geoVertex: { range: [1, 64], value: 1 },
        noEffectGooey: { value: !0 },
        onMouse: { value: 0 },
        noise_speed: { value: 0.2, range: [0, 10] },
        metaball: { value: 0.2, range: [0, 2] },
        discard_threshold: { value: 0.5, range: [0, 1] },
        antialias_threshold: { value: 0.002, range: [0, 0.1] },
        noise_height: { value: 0.5, range: [0, 2] },
        noise_scale: { value: 10, range: [0, 100] },
      },
    }));
}
var commonjsGlobal =
  typeof globalThis < "u"
    ? globalThis
    : typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof self < "u"
          ? self
          : {};
function getDefaultExportFromCjs(V) {
  return V && V.__esModule && Object.prototype.hasOwnProperty.call(V, "default")
    ? V.default
    : V;
}
var lottie$1 = { exports: {} };
(function (module, exports) {
  typeof navigator < "u" &&
    (function (V, O) {
      module.exports = O();
    })(commonjsGlobal, function () {
      var svgNS = "http://www.w3.org/2000/svg",
        locationHref = "",
        _useWebWorker = !1,
        initialDefaultFrame = -999999,
        setWebWorker = function (O) {
          _useWebWorker = !!O;
        },
        getWebWorker = function () {
          return _useWebWorker;
        },
        setLocationHref = function (O) {
          locationHref = O;
        },
        getLocationHref = function () {
          return locationHref;
        };
      function createTag(V) {
        return document.createElement(V);
      }
      function extendPrototype(V, O) {
        var B,
          z = V.length,
          N;
        for (B = 0; B < z; B += 1) {
          N = V[B].prototype;
          for (var G in N)
            Object.prototype.hasOwnProperty.call(N, G) &&
              (O.prototype[G] = N[G]);
        }
      }
      function getDescriptor(V, O) {
        return Object.getOwnPropertyDescriptor(V, O);
      }
      function createProxyFunction(V) {
        function O() {}
        return ((O.prototype = V), O);
      }
      var audioControllerFactory = (function () {
          function V(O) {
            ((this.audios = []),
              (this.audioFactory = O),
              (this._volume = 1),
              (this._isMuted = !1));
          }
          return (
            (V.prototype = {
              addAudio: function (B) {
                this.audios.push(B);
              },
              pause: function () {
                var B,
                  z = this.audios.length;
                for (B = 0; B < z; B += 1) this.audios[B].pause();
              },
              resume: function () {
                var B,
                  z = this.audios.length;
                for (B = 0; B < z; B += 1) this.audios[B].resume();
              },
              setRate: function (B) {
                var z,
                  N = this.audios.length;
                for (z = 0; z < N; z += 1) this.audios[z].setRate(B);
              },
              createAudio: function (B) {
                return this.audioFactory
                  ? this.audioFactory(B)
                  : window.Howl
                    ? new window.Howl({ src: [B] })
                    : {
                        isPlaying: !1,
                        play: function () {
                          this.isPlaying = !0;
                        },
                        seek: function () {
                          this.isPlaying = !1;
                        },
                        playing: function () {},
                        rate: function () {},
                        setVolume: function () {},
                      };
              },
              setAudioFactory: function (B) {
                this.audioFactory = B;
              },
              setVolume: function (B) {
                ((this._volume = B), this._updateVolume());
              },
              mute: function () {
                ((this._isMuted = !0), this._updateVolume());
              },
              unmute: function () {
                ((this._isMuted = !1), this._updateVolume());
              },
              getVolume: function () {
                return this._volume;
              },
              _updateVolume: function () {
                var B,
                  z = this.audios.length;
                for (B = 0; B < z; B += 1)
                  this.audios[B].volume(this._volume * (this._isMuted ? 0 : 1));
              },
            }),
            function () {
              return new V();
            }
          );
        })(),
        createTypedArray = (function () {
          function V(B, z) {
            var N = 0,
              G = [],
              H;
            switch (B) {
              case "int16":
              case "uint8c":
                H = 1;
                break;
              default:
                H = 1.1;
                break;
            }
            for (N = 0; N < z; N += 1) G.push(H);
            return G;
          }
          function O(B, z) {
            return B === "float32"
              ? new Float32Array(z)
              : B === "int16"
                ? new Int16Array(z)
                : B === "uint8c"
                  ? new Uint8ClampedArray(z)
                  : V(B, z);
          }
          return typeof Uint8ClampedArray == "function" &&
            typeof Float32Array == "function"
            ? O
            : V;
        })();
      function createSizedArray(V) {
        return Array.apply(null, { length: V });
      }
      function _typeof$6(V) {
        "@babel/helpers - typeof";
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof$6 = function (B) {
                return typeof B;
              })
            : (_typeof$6 = function (B) {
                return B &&
                  typeof Symbol == "function" &&
                  B.constructor === Symbol &&
                  B !== Symbol.prototype
                  ? "symbol"
                  : typeof B;
              }),
          _typeof$6(V)
        );
      }
      var subframeEnabled = !0,
        expressionsPlugin = null,
        expressionsInterfaces = null,
        idPrefix$1 = "",
        isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
        bmPow = Math.pow,
        bmSqrt = Math.sqrt,
        bmFloor = Math.floor,
        bmMax = Math.max,
        bmMin = Math.min,
        BMMath = {};
      ((function () {
        var V = [
            "abs",
            "acos",
            "acosh",
            "asin",
            "asinh",
            "atan",
            "atanh",
            "atan2",
            "ceil",
            "cbrt",
            "expm1",
            "clz32",
            "cos",
            "cosh",
            "exp",
            "floor",
            "fround",
            "hypot",
            "imul",
            "log",
            "log1p",
            "log2",
            "log10",
            "max",
            "min",
            "pow",
            "random",
            "round",
            "sign",
            "sin",
            "sinh",
            "sqrt",
            "tan",
            "tanh",
            "trunc",
            "E",
            "LN10",
            "LN2",
            "LOG10E",
            "LOG2E",
            "PI",
            "SQRT1_2",
            "SQRT2",
          ],
          O,
          B = V.length;
        for (O = 0; O < B; O += 1) BMMath[V[O]] = Math[V[O]];
      })(),
        (BMMath.random = Math.random),
        (BMMath.abs = function (V) {
          var O = _typeof$6(V);
          if (O === "object" && V.length) {
            var B = createSizedArray(V.length),
              z,
              N = V.length;
            for (z = 0; z < N; z += 1) B[z] = Math.abs(V[z]);
            return B;
          }
          return Math.abs(V);
        }));
      var defaultCurveSegments = 150,
        degToRads = Math.PI / 180,
        roundCorner = 0.5519;
      function styleDiv(V) {
        ((V.style.position = "absolute"),
          (V.style.top = 0),
          (V.style.left = 0),
          (V.style.display = "block"),
          (V.style.transformOrigin = "0 0"),
          (V.style.webkitTransformOrigin = "0 0"),
          (V.style.backfaceVisibility = "visible"),
          (V.style.webkitBackfaceVisibility = "visible"),
          (V.style.transformStyle = "preserve-3d"),
          (V.style.webkitTransformStyle = "preserve-3d"),
          (V.style.mozTransformStyle = "preserve-3d"));
      }
      function BMEnterFrameEvent(V, O, B, z) {
        ((this.type = V),
          (this.currentTime = O),
          (this.totalTime = B),
          (this.direction = z < 0 ? -1 : 1));
      }
      function BMCompleteEvent(V, O) {
        ((this.type = V), (this.direction = O < 0 ? -1 : 1));
      }
      function BMCompleteLoopEvent(V, O, B, z) {
        ((this.type = V),
          (this.currentLoop = B),
          (this.totalLoops = O),
          (this.direction = z < 0 ? -1 : 1));
      }
      function BMSegmentStartEvent(V, O, B) {
        ((this.type = V), (this.firstFrame = O), (this.totalFrames = B));
      }
      function BMDestroyEvent(V, O) {
        ((this.type = V), (this.target = O));
      }
      function BMRenderFrameErrorEvent(V, O) {
        ((this.type = "renderFrameError"),
          (this.nativeError = V),
          (this.currentTime = O));
      }
      function BMConfigErrorEvent(V) {
        ((this.type = "configError"), (this.nativeError = V));
      }
      var createElementID = (function () {
        var V = 0;
        return function () {
          return ((V += 1), idPrefix$1 + "__lottie_element_" + V);
        };
      })();
      function HSVtoRGB(V, O, B) {
        var z, N, G, H, W, q, j, Y;
        switch (
          ((H = Math.floor(V * 6)),
          (W = V * 6 - H),
          (q = B * (1 - O)),
          (j = B * (1 - W * O)),
          (Y = B * (1 - (1 - W) * O)),
          H % 6)
        ) {
          case 0:
            ((z = B), (N = Y), (G = q));
            break;
          case 1:
            ((z = j), (N = B), (G = q));
            break;
          case 2:
            ((z = q), (N = B), (G = Y));
            break;
          case 3:
            ((z = q), (N = j), (G = B));
            break;
          case 4:
            ((z = Y), (N = q), (G = B));
            break;
          case 5:
            ((z = B), (N = q), (G = j));
            break;
        }
        return [z, N, G];
      }
      function RGBtoHSV(V, O, B) {
        var z = Math.max(V, O, B),
          N = Math.min(V, O, B),
          G = z - N,
          H,
          W = z === 0 ? 0 : G / z,
          q = z / 255;
        switch (z) {
          case N:
            H = 0;
            break;
          case V:
            ((H = O - B + G * (O < B ? 6 : 0)), (H /= 6 * G));
            break;
          case O:
            ((H = B - V + G * 2), (H /= 6 * G));
            break;
          case B:
            ((H = V - O + G * 4), (H /= 6 * G));
            break;
        }
        return [H, W, q];
      }
      function addSaturationToRGB(V, O) {
        var B = RGBtoHSV(V[0] * 255, V[1] * 255, V[2] * 255);
        return (
          (B[1] += O),
          B[1] > 1 ? (B[1] = 1) : B[1] <= 0 && (B[1] = 0),
          HSVtoRGB(B[0], B[1], B[2])
        );
      }
      function addBrightnessToRGB(V, O) {
        var B = RGBtoHSV(V[0] * 255, V[1] * 255, V[2] * 255);
        return (
          (B[2] += O),
          B[2] > 1 ? (B[2] = 1) : B[2] < 0 && (B[2] = 0),
          HSVtoRGB(B[0], B[1], B[2])
        );
      }
      function addHueToRGB(V, O) {
        var B = RGBtoHSV(V[0] * 255, V[1] * 255, V[2] * 255);
        return (
          (B[0] += O / 360),
          B[0] > 1 ? (B[0] -= 1) : B[0] < 0 && (B[0] += 1),
          HSVtoRGB(B[0], B[1], B[2])
        );
      }
      var rgbToHex = (function () {
          var V = [],
            O,
            B;
          for (O = 0; O < 256; O += 1)
            ((B = O.toString(16)), (V[O] = B.length === 1 ? "0" + B : B));
          return function (z, N, G) {
            return (
              z < 0 && (z = 0),
              N < 0 && (N = 0),
              G < 0 && (G = 0),
              "#" + V[z] + V[N] + V[G]
            );
          };
        })(),
        setSubframeEnabled = function (O) {
          subframeEnabled = !!O;
        },
        getSubframeEnabled = function () {
          return subframeEnabled;
        },
        setExpressionsPlugin = function (O) {
          expressionsPlugin = O;
        },
        getExpressionsPlugin = function () {
          return expressionsPlugin;
        },
        setExpressionInterfaces = function (O) {
          expressionsInterfaces = O;
        },
        getExpressionInterfaces = function () {
          return expressionsInterfaces;
        },
        setDefaultCurveSegments = function (O) {
          defaultCurveSegments = O;
        },
        getDefaultCurveSegments = function () {
          return defaultCurveSegments;
        },
        setIdPrefix = function (O) {
          idPrefix$1 = O;
        };
      function createNS(V) {
        return document.createElementNS(svgNS, V);
      }
      function _typeof$5(V) {
        "@babel/helpers - typeof";
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof$5 = function (B) {
                return typeof B;
              })
            : (_typeof$5 = function (B) {
                return B &&
                  typeof Symbol == "function" &&
                  B.constructor === Symbol &&
                  B !== Symbol.prototype
                  ? "symbol"
                  : typeof B;
              }),
          _typeof$5(V)
        );
      }
      var dataManager = (function () {
          var V = 1,
            O = [],
            B,
            z,
            N = {
              onmessage: function () {},
              postMessage: function (K) {
                B({ data: K });
              },
            },
            G = {
              postMessage: function (K) {
                N.onmessage({ data: K });
              },
            };
          function H(U) {
            if (window.Worker && window.Blob && getWebWorker()) {
              var K = new Blob(
                  ["var _workerSelf = self; self.onmessage = ", U.toString()],
                  { type: "text/javascript" },
                ),
                Z = URL.createObjectURL(K);
              return new Worker(Z);
            }
            return ((B = U), N);
          }
          function W() {
            z ||
              ((z = H(function (K) {
                function Z() {
                  function se(_e, le) {
                    var pe,
                      ie,
                      ae = _e.length,
                      fe,
                      de,
                      xe,
                      we;
                    for (ie = 0; ie < ae; ie += 1)
                      if (((pe = _e[ie]), "ks" in pe && !pe.completed)) {
                        if (((pe.completed = !0), pe.hasMask)) {
                          var Ee = pe.masksProperties;
                          for (de = Ee.length, fe = 0; fe < de; fe += 1)
                            if (Ee[fe].pt.k.i) ne(Ee[fe].pt.k);
                            else
                              for (
                                we = Ee[fe].pt.k.length, xe = 0;
                                xe < we;
                                xe += 1
                              )
                                (Ee[fe].pt.k[xe].s && ne(Ee[fe].pt.k[xe].s[0]),
                                  Ee[fe].pt.k[xe].e &&
                                    ne(Ee[fe].pt.k[xe].e[0]));
                        }
                        pe.ty === 0
                          ? ((pe.layers = J(pe.refId, le)), se(pe.layers, le))
                          : pe.ty === 4
                            ? ee(pe.shapes)
                            : pe.ty === 5 && be(pe);
                      }
                  }
                  function Q(_e, le) {
                    if (_e) {
                      var pe = 0,
                        ie = _e.length;
                      for (pe = 0; pe < ie; pe += 1)
                        _e[pe].t === 1 &&
                          ((_e[pe].data.layers = J(_e[pe].data.refId, le)),
                          se(_e[pe].data.layers, le));
                    }
                  }
                  function te(_e, le) {
                    for (var pe = 0, ie = le.length; pe < ie; ) {
                      if (le[pe].id === _e) return le[pe];
                      pe += 1;
                    }
                    return null;
                  }
                  function J(_e, le) {
                    var pe = te(_e, le);
                    return pe
                      ? pe.layers.__used
                        ? JSON.parse(JSON.stringify(pe.layers))
                        : ((pe.layers.__used = !0), pe.layers)
                      : null;
                  }
                  function ee(_e) {
                    var le,
                      pe = _e.length,
                      ie,
                      ae;
                    for (le = pe - 1; le >= 0; le -= 1)
                      if (_e[le].ty === "sh")
                        if (_e[le].ks.k.i) ne(_e[le].ks.k);
                        else
                          for (
                            ae = _e[le].ks.k.length, ie = 0;
                            ie < ae;
                            ie += 1
                          )
                            (_e[le].ks.k[ie].s && ne(_e[le].ks.k[ie].s[0]),
                              _e[le].ks.k[ie].e && ne(_e[le].ks.k[ie].e[0]));
                      else _e[le].ty === "gr" && ee(_e[le].it);
                  }
                  function ne(_e) {
                    var le,
                      pe = _e.i.length;
                    for (le = 0; le < pe; le += 1)
                      ((_e.i[le][0] += _e.v[le][0]),
                        (_e.i[le][1] += _e.v[le][1]),
                        (_e.o[le][0] += _e.v[le][0]),
                        (_e.o[le][1] += _e.v[le][1]));
                  }
                  function oe(_e, le) {
                    var pe = le ? le.split(".") : [100, 100, 100];
                    return _e[0] > pe[0]
                      ? !0
                      : pe[0] > _e[0]
                        ? !1
                        : _e[1] > pe[1]
                          ? !0
                          : pe[1] > _e[1]
                            ? !1
                            : _e[2] > pe[2]
                              ? !0
                              : pe[2] > _e[2]
                                ? !1
                                : null;
                  }
                  var he = (function () {
                      var _e = [4, 4, 14];
                      function le(ie) {
                        var ae = ie.t.d;
                        ie.t.d = { k: [{ s: ae, t: 0 }] };
                      }
                      function pe(ie) {
                        var ae,
                          fe = ie.length;
                        for (ae = 0; ae < fe; ae += 1)
                          ie[ae].ty === 5 && le(ie[ae]);
                      }
                      return function (ie) {
                        if (oe(_e, ie.v) && (pe(ie.layers), ie.assets)) {
                          var ae,
                            fe = ie.assets.length;
                          for (ae = 0; ae < fe; ae += 1)
                            ie.assets[ae].layers && pe(ie.assets[ae].layers);
                        }
                      };
                    })(),
                    ce = (function () {
                      var _e = [4, 7, 99];
                      return function (le) {
                        if (le.chars && !oe(_e, le.v)) {
                          var pe,
                            ie = le.chars.length;
                          for (pe = 0; pe < ie; pe += 1) {
                            var ae = le.chars[pe];
                            ae.data &&
                              ae.data.shapes &&
                              (ee(ae.data.shapes),
                              (ae.data.ip = 0),
                              (ae.data.op = 99999),
                              (ae.data.st = 0),
                              (ae.data.sr = 1),
                              (ae.data.ks = {
                                p: { k: [0, 0], a: 0 },
                                s: { k: [100, 100], a: 0 },
                                a: { k: [0, 0], a: 0 },
                                r: { k: 0, a: 0 },
                                o: { k: 100, a: 0 },
                              }),
                              le.chars[pe].t ||
                                (ae.data.shapes.push({ ty: "no" }),
                                ae.data.shapes[0].it.push({
                                  p: { k: [0, 0], a: 0 },
                                  s: { k: [100, 100], a: 0 },
                                  a: { k: [0, 0], a: 0 },
                                  r: { k: 0, a: 0 },
                                  o: { k: 100, a: 0 },
                                  sk: { k: 0, a: 0 },
                                  sa: { k: 0, a: 0 },
                                  ty: "tr",
                                })));
                          }
                        }
                      };
                    })(),
                    ue = (function () {
                      var _e = [5, 7, 15];
                      function le(ie) {
                        var ae = ie.t.p;
                        (typeof ae.a == "number" && (ae.a = { a: 0, k: ae.a }),
                          typeof ae.p == "number" && (ae.p = { a: 0, k: ae.p }),
                          typeof ae.r == "number" &&
                            (ae.r = { a: 0, k: ae.r }));
                      }
                      function pe(ie) {
                        var ae,
                          fe = ie.length;
                        for (ae = 0; ae < fe; ae += 1)
                          ie[ae].ty === 5 && le(ie[ae]);
                      }
                      return function (ie) {
                        if (oe(_e, ie.v) && (pe(ie.layers), ie.assets)) {
                          var ae,
                            fe = ie.assets.length;
                          for (ae = 0; ae < fe; ae += 1)
                            ie.assets[ae].layers && pe(ie.assets[ae].layers);
                        }
                      };
                    })(),
                    ge = (function () {
                      var _e = [4, 1, 9];
                      function le(ie) {
                        var ae,
                          fe = ie.length,
                          de,
                          xe;
                        for (ae = 0; ae < fe; ae += 1)
                          if (ie[ae].ty === "gr") le(ie[ae].it);
                          else if (ie[ae].ty === "fl" || ie[ae].ty === "st")
                            if (ie[ae].c.k && ie[ae].c.k[0].i)
                              for (
                                xe = ie[ae].c.k.length, de = 0;
                                de < xe;
                                de += 1
                              )
                                (ie[ae].c.k[de].s &&
                                  ((ie[ae].c.k[de].s[0] /= 255),
                                  (ie[ae].c.k[de].s[1] /= 255),
                                  (ie[ae].c.k[de].s[2] /= 255),
                                  (ie[ae].c.k[de].s[3] /= 255)),
                                  ie[ae].c.k[de].e &&
                                    ((ie[ae].c.k[de].e[0] /= 255),
                                    (ie[ae].c.k[de].e[1] /= 255),
                                    (ie[ae].c.k[de].e[2] /= 255),
                                    (ie[ae].c.k[de].e[3] /= 255)));
                            else
                              ((ie[ae].c.k[0] /= 255),
                                (ie[ae].c.k[1] /= 255),
                                (ie[ae].c.k[2] /= 255),
                                (ie[ae].c.k[3] /= 255));
                      }
                      function pe(ie) {
                        var ae,
                          fe = ie.length;
                        for (ae = 0; ae < fe; ae += 1)
                          ie[ae].ty === 4 && le(ie[ae].shapes);
                      }
                      return function (ie) {
                        if (oe(_e, ie.v) && (pe(ie.layers), ie.assets)) {
                          var ae,
                            fe = ie.assets.length;
                          for (ae = 0; ae < fe; ae += 1)
                            ie.assets[ae].layers && pe(ie.assets[ae].layers);
                        }
                      };
                    })(),
                    ye = (function () {
                      var _e = [4, 4, 18];
                      function le(ie) {
                        var ae,
                          fe = ie.length,
                          de,
                          xe;
                        for (ae = fe - 1; ae >= 0; ae -= 1)
                          if (ie[ae].ty === "sh")
                            if (ie[ae].ks.k.i) ie[ae].ks.k.c = ie[ae].closed;
                            else
                              for (
                                xe = ie[ae].ks.k.length, de = 0;
                                de < xe;
                                de += 1
                              )
                                (ie[ae].ks.k[de].s &&
                                  (ie[ae].ks.k[de].s[0].c = ie[ae].closed),
                                  ie[ae].ks.k[de].e &&
                                    (ie[ae].ks.k[de].e[0].c = ie[ae].closed));
                          else ie[ae].ty === "gr" && le(ie[ae].it);
                      }
                      function pe(ie) {
                        var ae,
                          fe,
                          de = ie.length,
                          xe,
                          we,
                          Ee,
                          Me;
                        for (fe = 0; fe < de; fe += 1) {
                          if (((ae = ie[fe]), ae.hasMask)) {
                            var Ie = ae.masksProperties;
                            for (we = Ie.length, xe = 0; xe < we; xe += 1)
                              if (Ie[xe].pt.k.i) Ie[xe].pt.k.c = Ie[xe].cl;
                              else
                                for (
                                  Me = Ie[xe].pt.k.length, Ee = 0;
                                  Ee < Me;
                                  Ee += 1
                                )
                                  (Ie[xe].pt.k[Ee].s &&
                                    (Ie[xe].pt.k[Ee].s[0].c = Ie[xe].cl),
                                    Ie[xe].pt.k[Ee].e &&
                                      (Ie[xe].pt.k[Ee].e[0].c = Ie[xe].cl));
                          }
                          ae.ty === 4 && le(ae.shapes);
                        }
                      }
                      return function (ie) {
                        if (oe(_e, ie.v) && (pe(ie.layers), ie.assets)) {
                          var ae,
                            fe = ie.assets.length;
                          for (ae = 0; ae < fe; ae += 1)
                            ie.assets[ae].layers && pe(ie.assets[ae].layers);
                        }
                      };
                    })();
                  function me(_e) {
                    _e.__complete ||
                      (ge(_e),
                      he(_e),
                      ce(_e),
                      ue(_e),
                      ye(_e),
                      se(_e.layers, _e.assets),
                      Q(_e.chars, _e.assets),
                      (_e.__complete = !0));
                  }
                  function be(_e) {
                    _e.t.a.length === 0 && "m" in _e.t.p;
                  }
                  var Se = {};
                  return (
                    (Se.completeData = me),
                    (Se.checkColors = ge),
                    (Se.checkChars = ce),
                    (Se.checkPathProperties = ue),
                    (Se.checkShapes = ye),
                    (Se.completeLayers = se),
                    Se
                  );
                }
                if (
                  (G.dataManager || (G.dataManager = Z()),
                  G.assetLoader ||
                    (G.assetLoader = (function () {
                      function se(te) {
                        var J = te.getResponseHeader("content-type");
                        return (J &&
                          te.responseType === "json" &&
                          J.indexOf("json") !== -1) ||
                          (te.response && _typeof$5(te.response) === "object")
                          ? te.response
                          : te.response && typeof te.response == "string"
                            ? JSON.parse(te.response)
                            : te.responseText
                              ? JSON.parse(te.responseText)
                              : null;
                      }
                      function Q(te, J, ee, ne) {
                        var oe,
                          he = new XMLHttpRequest();
                        try {
                          he.responseType = "json";
                        } catch {}
                        he.onreadystatechange = function () {
                          if (he.readyState === 4)
                            if (he.status === 200) ((oe = se(he)), ee(oe));
                            else
                              try {
                                ((oe = se(he)), ee(oe));
                              } catch (ce) {
                                ne && ne(ce);
                              }
                        };
                        try {
                          he.open(["G", "E", "T"].join(""), te, !0);
                        } catch {
                          he.open(["G", "E", "T"].join(""), J + "/" + te, !0);
                        }
                        he.send();
                      }
                      return { load: Q };
                    })()),
                  K.data.type === "loadAnimation")
                )
                  G.assetLoader.load(
                    K.data.path,
                    K.data.fullPath,
                    function (se) {
                      (G.dataManager.completeData(se),
                        G.postMessage({
                          id: K.data.id,
                          payload: se,
                          status: "success",
                        }));
                    },
                    function () {
                      G.postMessage({ id: K.data.id, status: "error" });
                    },
                  );
                else if (K.data.type === "complete") {
                  var X = K.data.animation;
                  (G.dataManager.completeData(X),
                    G.postMessage({
                      id: K.data.id,
                      payload: X,
                      status: "success",
                    }));
                } else
                  K.data.type === "loadData" &&
                    G.assetLoader.load(
                      K.data.path,
                      K.data.fullPath,
                      function (se) {
                        G.postMessage({
                          id: K.data.id,
                          payload: se,
                          status: "success",
                        });
                      },
                      function () {
                        G.postMessage({ id: K.data.id, status: "error" });
                      },
                    );
              })),
              (z.onmessage = function (U) {
                var K = U.data,
                  Z = K.id,
                  X = O[Z];
                ((O[Z] = null),
                  K.status === "success"
                    ? X.onComplete(K.payload)
                    : X.onError && X.onError());
              }));
          }
          function q(U, K) {
            V += 1;
            var Z = "processId_" + V;
            return ((O[Z] = { onComplete: U, onError: K }), Z);
          }
          function j(U, K, Z) {
            W();
            var X = q(K, Z);
            z.postMessage({
              type: "loadAnimation",
              path: U,
              fullPath: window.location.origin + window.location.pathname,
              id: X,
            });
          }
          function Y(U, K, Z) {
            W();
            var X = q(K, Z);
            z.postMessage({
              type: "loadData",
              path: U,
              fullPath: window.location.origin + window.location.pathname,
              id: X,
            });
          }
          function re(U, K, Z) {
            W();
            var X = q(K, Z);
            z.postMessage({ type: "complete", animation: U, id: X });
          }
          return { loadAnimation: j, loadData: Y, completeAnimation: re };
        })(),
        ImagePreloader = (function () {
          var V = (function () {
            var Q = createTag("canvas");
            ((Q.width = 1), (Q.height = 1));
            var te = Q.getContext("2d");
            return (
              (te.fillStyle = "rgba(0,0,0,0)"),
              te.fillRect(0, 0, 1, 1),
              Q
            );
          })();
          function O() {
            ((this.loadedAssets += 1),
              this.loadedAssets === this.totalImages &&
                this.loadedFootagesCount === this.totalFootages &&
                this.imagesLoadedCb &&
                this.imagesLoadedCb(null));
          }
          function B() {
            ((this.loadedFootagesCount += 1),
              this.loadedAssets === this.totalImages &&
                this.loadedFootagesCount === this.totalFootages &&
                this.imagesLoadedCb &&
                this.imagesLoadedCb(null));
          }
          function z(Q, te, J) {
            var ee = "";
            if (Q.e) ee = Q.p;
            else if (te) {
              var ne = Q.p;
              (ne.indexOf("images/") !== -1 && (ne = ne.split("/")[1]),
                (ee = te + ne));
            } else ((ee = J), (ee += Q.u ? Q.u : ""), (ee += Q.p));
            return ee;
          }
          function N(Q) {
            var te = 0,
              J = setInterval(
                function () {
                  var ee = Q.getBBox();
                  ((ee.width || te > 500) &&
                    (this._imageLoaded(), clearInterval(J)),
                    (te += 1));
                }.bind(this),
                50,
              );
          }
          function G(Q) {
            var te = z(Q, this.assetsPath, this.path),
              J = createNS("image");
            (isSafari
              ? this.testImageLoaded(J)
              : J.addEventListener("load", this._imageLoaded, !1),
              J.addEventListener(
                "error",
                function () {
                  ((ee.img = V), this._imageLoaded());
                }.bind(this),
                !1,
              ),
              J.setAttributeNS("http://www.w3.org/1999/xlink", "href", te),
              this._elementHelper.append
                ? this._elementHelper.append(J)
                : this._elementHelper.appendChild(J));
            var ee = { img: J, assetData: Q };
            return ee;
          }
          function H(Q) {
            var te = z(Q, this.assetsPath, this.path),
              J = createTag("img");
            ((J.crossOrigin = "anonymous"),
              J.addEventListener("load", this._imageLoaded, !1),
              J.addEventListener(
                "error",
                function () {
                  ((ee.img = V), this._imageLoaded());
                }.bind(this),
                !1,
              ),
              (J.src = te));
            var ee = { img: J, assetData: Q };
            return ee;
          }
          function W(Q) {
            var te = { assetData: Q },
              J = z(Q, this.assetsPath, this.path);
            return (
              dataManager.loadData(
                J,
                function (ee) {
                  ((te.img = ee), this._footageLoaded());
                }.bind(this),
                function () {
                  ((te.img = {}), this._footageLoaded());
                }.bind(this),
              ),
              te
            );
          }
          function q(Q, te) {
            this.imagesLoadedCb = te;
            var J,
              ee = Q.length;
            for (J = 0; J < ee; J += 1)
              Q[J].layers ||
                (!Q[J].t || Q[J].t === "seq"
                  ? ((this.totalImages += 1),
                    this.images.push(this._createImageData(Q[J])))
                  : Q[J].t === 3 &&
                    ((this.totalFootages += 1),
                    this.images.push(this.createFootageData(Q[J]))));
          }
          function j(Q) {
            this.path = Q || "";
          }
          function Y(Q) {
            this.assetsPath = Q || "";
          }
          function re(Q) {
            for (var te = 0, J = this.images.length; te < J; ) {
              if (this.images[te].assetData === Q) return this.images[te].img;
              te += 1;
            }
            return null;
          }
          function U() {
            ((this.imagesLoadedCb = null), (this.images.length = 0));
          }
          function K() {
            return this.totalImages === this.loadedAssets;
          }
          function Z() {
            return this.totalFootages === this.loadedFootagesCount;
          }
          function X(Q, te) {
            Q === "svg"
              ? ((this._elementHelper = te),
                (this._createImageData = this.createImageData.bind(this)))
              : (this._createImageData = this.createImgData.bind(this));
          }
          function se() {
            ((this._imageLoaded = O.bind(this)),
              (this._footageLoaded = B.bind(this)),
              (this.testImageLoaded = N.bind(this)),
              (this.createFootageData = W.bind(this)),
              (this.assetsPath = ""),
              (this.path = ""),
              (this.totalImages = 0),
              (this.totalFootages = 0),
              (this.loadedAssets = 0),
              (this.loadedFootagesCount = 0),
              (this.imagesLoadedCb = null),
              (this.images = []));
          }
          return (
            (se.prototype = {
              loadAssets: q,
              setAssetsPath: Y,
              setPath: j,
              loadedImages: K,
              loadedFootages: Z,
              destroy: U,
              getAsset: re,
              createImgData: H,
              createImageData: G,
              imageLoaded: O,
              footageLoaded: B,
              setCacheType: X,
            }),
            se
          );
        })();
      function BaseEvent() {}
      BaseEvent.prototype = {
        triggerEvent: function (O, B) {
          if (this._cbs[O])
            for (var z = this._cbs[O], N = 0; N < z.length; N += 1) z[N](B);
        },
        addEventListener: function (O, B) {
          return (
            this._cbs[O] || (this._cbs[O] = []),
            this._cbs[O].push(B),
            function () {
              this.removeEventListener(O, B);
            }.bind(this)
          );
        },
        removeEventListener: function (O, B) {
          if (!B) this._cbs[O] = null;
          else if (this._cbs[O]) {
            for (var z = 0, N = this._cbs[O].length; z < N; )
              (this._cbs[O][z] === B &&
                (this._cbs[O].splice(z, 1), (z -= 1), (N -= 1)),
                (z += 1));
            this._cbs[O].length || (this._cbs[O] = null);
          }
        },
      };
      var markerParser = (function () {
          function V(O) {
            for (
              var B = O.split(`\r
`),
                z = {},
                N,
                G = 0,
                H = 0;
              H < B.length;
              H += 1
            )
              ((N = B[H].split(":")),
                N.length === 2 && ((z[N[0]] = N[1].trim()), (G += 1)));
            if (G === 0) throw new Error();
            return z;
          }
          return function (O) {
            for (var B = [], z = 0; z < O.length; z += 1) {
              var N = O[z],
                G = { time: N.tm, duration: N.dr };
              try {
                G.payload = JSON.parse(O[z].cm);
              } catch {
                try {
                  G.payload = V(O[z].cm);
                } catch {
                  G.payload = { name: O[z].cm };
                }
              }
              B.push(G);
            }
            return B;
          };
        })(),
        ProjectInterface = (function () {
          function V(O) {
            this.compositions.push(O);
          }
          return function () {
            function O(B) {
              for (var z = 0, N = this.compositions.length; z < N; ) {
                if (
                  this.compositions[z].data &&
                  this.compositions[z].data.nm === B
                )
                  return (
                    this.compositions[z].prepareFrame &&
                      this.compositions[z].data.xt &&
                      this.compositions[z].prepareFrame(this.currentFrame),
                    this.compositions[z].compInterface
                  );
                z += 1;
              }
              return null;
            }
            return (
              (O.compositions = []),
              (O.currentFrame = 0),
              (O.registerComposition = V),
              O
            );
          };
        })(),
        renderers = {},
        registerRenderer = function (O, B) {
          renderers[O] = B;
        };
      function getRenderer(V) {
        return renderers[V];
      }
      function getRegisteredRenderer() {
        if (renderers.canvas) return "canvas";
        for (var V in renderers) if (renderers[V]) return V;
        return "";
      }
      function _typeof$4(V) {
        "@babel/helpers - typeof";
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof$4 = function (B) {
                return typeof B;
              })
            : (_typeof$4 = function (B) {
                return B &&
                  typeof Symbol == "function" &&
                  B.constructor === Symbol &&
                  B !== Symbol.prototype
                  ? "symbol"
                  : typeof B;
              }),
          _typeof$4(V)
        );
      }
      var AnimationItem = function () {
        ((this._cbs = []),
          (this.name = ""),
          (this.path = ""),
          (this.isLoaded = !1),
          (this.currentFrame = 0),
          (this.currentRawFrame = 0),
          (this.firstFrame = 0),
          (this.totalFrames = 0),
          (this.frameRate = 0),
          (this.frameMult = 0),
          (this.playSpeed = 1),
          (this.playDirection = 1),
          (this.playCount = 0),
          (this.animationData = {}),
          (this.assets = []),
          (this.isPaused = !0),
          (this.autoplay = !1),
          (this.loop = !0),
          (this.renderer = null),
          (this.animationID = createElementID()),
          (this.assetsPath = ""),
          (this.timeCompleted = 0),
          (this.segmentPos = 0),
          (this.isSubframeEnabled = getSubframeEnabled()),
          (this.segments = []),
          (this._idle = !0),
          (this._completedLoop = !1),
          (this.projectInterface = ProjectInterface()),
          (this.imagePreloader = new ImagePreloader()),
          (this.audioController = audioControllerFactory()),
          (this.markers = []),
          (this.configAnimation = this.configAnimation.bind(this)),
          (this.onSetupError = this.onSetupError.bind(this)),
          (this.onSegmentComplete = this.onSegmentComplete.bind(this)),
          (this.drawnFrameEvent = new BMEnterFrameEvent("drawnFrame", 0, 0, 0)),
          (this.expressionsPlugin = getExpressionsPlugin()));
      };
      (extendPrototype([BaseEvent], AnimationItem),
        (AnimationItem.prototype.setParams = function (V) {
          (V.wrapper || V.container) &&
            (this.wrapper = V.wrapper || V.container);
          var O = "svg";
          V.animType ? (O = V.animType) : V.renderer && (O = V.renderer);
          var B = getRenderer(O);
          ((this.renderer = new B(this, V.rendererSettings)),
            this.imagePreloader.setCacheType(O, this.renderer.globalData.defs),
            this.renderer.setProjectInterface(this.projectInterface),
            (this.animType = O),
            V.loop === "" ||
            V.loop === null ||
            V.loop === void 0 ||
            V.loop === !0
              ? (this.loop = !0)
              : V.loop === !1
                ? (this.loop = !1)
                : (this.loop = parseInt(V.loop, 10)),
            (this.autoplay = "autoplay" in V ? V.autoplay : !0),
            (this.name = V.name ? V.name : ""),
            (this.autoloadSegments = Object.prototype.hasOwnProperty.call(
              V,
              "autoloadSegments",
            )
              ? V.autoloadSegments
              : !0),
            (this.assetsPath = V.assetsPath),
            (this.initialSegment = V.initialSegment),
            V.audioFactory &&
              this.audioController.setAudioFactory(V.audioFactory),
            V.animationData
              ? this.setupAnimation(V.animationData)
              : V.path &&
                (V.path.lastIndexOf("\\") !== -1
                  ? (this.path = V.path.substr(0, V.path.lastIndexOf("\\") + 1))
                  : (this.path = V.path.substr(0, V.path.lastIndexOf("/") + 1)),
                (this.fileName = V.path.substr(V.path.lastIndexOf("/") + 1)),
                (this.fileName = this.fileName.substr(
                  0,
                  this.fileName.lastIndexOf(".json"),
                )),
                dataManager.loadAnimation(
                  V.path,
                  this.configAnimation,
                  this.onSetupError,
                )));
        }),
        (AnimationItem.prototype.onSetupError = function () {
          this.trigger("data_failed");
        }),
        (AnimationItem.prototype.setupAnimation = function (V) {
          dataManager.completeAnimation(V, this.configAnimation);
        }),
        (AnimationItem.prototype.setData = function (V, O) {
          O && _typeof$4(O) !== "object" && (O = JSON.parse(O));
          var B = { wrapper: V, animationData: O },
            z = V.attributes;
          ((B.path = z.getNamedItem("data-animation-path")
            ? z.getNamedItem("data-animation-path").value
            : z.getNamedItem("data-bm-path")
              ? z.getNamedItem("data-bm-path").value
              : z.getNamedItem("bm-path")
                ? z.getNamedItem("bm-path").value
                : ""),
            (B.animType = z.getNamedItem("data-anim-type")
              ? z.getNamedItem("data-anim-type").value
              : z.getNamedItem("data-bm-type")
                ? z.getNamedItem("data-bm-type").value
                : z.getNamedItem("bm-type")
                  ? z.getNamedItem("bm-type").value
                  : z.getNamedItem("data-bm-renderer")
                    ? z.getNamedItem("data-bm-renderer").value
                    : z.getNamedItem("bm-renderer")
                      ? z.getNamedItem("bm-renderer").value
                      : getRegisteredRenderer() || "canvas"));
          var N = z.getNamedItem("data-anim-loop")
            ? z.getNamedItem("data-anim-loop").value
            : z.getNamedItem("data-bm-loop")
              ? z.getNamedItem("data-bm-loop").value
              : z.getNamedItem("bm-loop")
                ? z.getNamedItem("bm-loop").value
                : "";
          N === "false"
            ? (B.loop = !1)
            : N === "true"
              ? (B.loop = !0)
              : N !== "" && (B.loop = parseInt(N, 10));
          var G = z.getNamedItem("data-anim-autoplay")
            ? z.getNamedItem("data-anim-autoplay").value
            : z.getNamedItem("data-bm-autoplay")
              ? z.getNamedItem("data-bm-autoplay").value
              : z.getNamedItem("bm-autoplay")
                ? z.getNamedItem("bm-autoplay").value
                : !0;
          ((B.autoplay = G !== "false"),
            (B.name = z.getNamedItem("data-name")
              ? z.getNamedItem("data-name").value
              : z.getNamedItem("data-bm-name")
                ? z.getNamedItem("data-bm-name").value
                : z.getNamedItem("bm-name")
                  ? z.getNamedItem("bm-name").value
                  : ""));
          var H = z.getNamedItem("data-anim-prerender")
            ? z.getNamedItem("data-anim-prerender").value
            : z.getNamedItem("data-bm-prerender")
              ? z.getNamedItem("data-bm-prerender").value
              : z.getNamedItem("bm-prerender")
                ? z.getNamedItem("bm-prerender").value
                : "";
          (H === "false" && (B.prerender = !1),
            B.path ? this.setParams(B) : this.trigger("destroy"));
        }),
        (AnimationItem.prototype.includeLayers = function (V) {
          V.op > this.animationData.op &&
            ((this.animationData.op = V.op),
            (this.totalFrames = Math.floor(V.op - this.animationData.ip)));
          var O = this.animationData.layers,
            B,
            z = O.length,
            N = V.layers,
            G,
            H = N.length;
          for (G = 0; G < H; G += 1)
            for (B = 0; B < z; ) {
              if (O[B].id === N[G].id) {
                O[B] = N[G];
                break;
              }
              B += 1;
            }
          if (
            ((V.chars || V.fonts) &&
              (this.renderer.globalData.fontManager.addChars(V.chars),
              this.renderer.globalData.fontManager.addFonts(
                V.fonts,
                this.renderer.globalData.defs,
              )),
            V.assets)
          )
            for (z = V.assets.length, B = 0; B < z; B += 1)
              this.animationData.assets.push(V.assets[B]);
          ((this.animationData.__complete = !1),
            dataManager.completeAnimation(
              this.animationData,
              this.onSegmentComplete,
            ));
        }),
        (AnimationItem.prototype.onSegmentComplete = function (V) {
          this.animationData = V;
          var O = getExpressionsPlugin();
          (O && O.initExpressions(this), this.loadNextSegment());
        }),
        (AnimationItem.prototype.loadNextSegment = function () {
          var V = this.animationData.segments;
          if (!V || V.length === 0 || !this.autoloadSegments) {
            (this.trigger("data_ready"),
              (this.timeCompleted = this.totalFrames));
            return;
          }
          var O = V.shift();
          this.timeCompleted = O.time * this.frameRate;
          var B = this.path + this.fileName + "_" + this.segmentPos + ".json";
          ((this.segmentPos += 1),
            dataManager.loadData(
              B,
              this.includeLayers.bind(this),
              function () {
                this.trigger("data_failed");
              }.bind(this),
            ));
        }),
        (AnimationItem.prototype.loadSegments = function () {
          var V = this.animationData.segments;
          (V || (this.timeCompleted = this.totalFrames),
            this.loadNextSegment());
        }),
        (AnimationItem.prototype.imagesLoaded = function () {
          (this.trigger("loaded_images"), this.checkLoaded());
        }),
        (AnimationItem.prototype.preloadImages = function () {
          (this.imagePreloader.setAssetsPath(this.assetsPath),
            this.imagePreloader.setPath(this.path),
            this.imagePreloader.loadAssets(
              this.animationData.assets,
              this.imagesLoaded.bind(this),
            ));
        }),
        (AnimationItem.prototype.configAnimation = function (V) {
          if (this.renderer)
            try {
              ((this.animationData = V),
                this.initialSegment
                  ? ((this.totalFrames = Math.floor(
                      this.initialSegment[1] - this.initialSegment[0],
                    )),
                    (this.firstFrame = Math.round(this.initialSegment[0])))
                  : ((this.totalFrames = Math.floor(
                      this.animationData.op - this.animationData.ip,
                    )),
                    (this.firstFrame = Math.round(this.animationData.ip))),
                this.renderer.configAnimation(V),
                V.assets || (V.assets = []),
                (this.assets = this.animationData.assets),
                (this.frameRate = this.animationData.fr),
                (this.frameMult = this.animationData.fr / 1e3),
                this.renderer.searchExtraCompositions(V.assets),
                (this.markers = markerParser(V.markers || [])),
                this.trigger("config_ready"),
                this.preloadImages(),
                this.loadSegments(),
                this.updaFrameModifier(),
                this.waitForFontsLoaded(),
                this.isPaused && this.audioController.pause());
            } catch (O) {
              this.triggerConfigError(O);
            }
        }),
        (AnimationItem.prototype.waitForFontsLoaded = function () {
          this.renderer &&
            (this.renderer.globalData.fontManager.isLoaded
              ? this.checkLoaded()
              : setTimeout(this.waitForFontsLoaded.bind(this), 20));
        }),
        (AnimationItem.prototype.checkLoaded = function () {
          if (
            !this.isLoaded &&
            this.renderer.globalData.fontManager.isLoaded &&
            (this.imagePreloader.loadedImages() ||
              this.renderer.rendererType !== "canvas") &&
            this.imagePreloader.loadedFootages()
          ) {
            this.isLoaded = !0;
            var V = getExpressionsPlugin();
            (V && V.initExpressions(this),
              this.renderer.initItems(),
              setTimeout(
                function () {
                  this.trigger("DOMLoaded");
                }.bind(this),
                0,
              ),
              this.gotoFrame(),
              this.autoplay && this.play());
          }
        }),
        (AnimationItem.prototype.resize = function (V, O) {
          var B = typeof V == "number" ? V : void 0,
            z = typeof O == "number" ? O : void 0;
          this.renderer.updateContainerSize(B, z);
        }),
        (AnimationItem.prototype.setSubframe = function (V) {
          this.isSubframeEnabled = !!V;
        }),
        (AnimationItem.prototype.gotoFrame = function () {
          ((this.currentFrame = this.isSubframeEnabled
            ? this.currentRawFrame
            : ~~this.currentRawFrame),
            this.timeCompleted !== this.totalFrames &&
              this.currentFrame > this.timeCompleted &&
              (this.currentFrame = this.timeCompleted),
            this.trigger("enterFrame"),
            this.renderFrame(),
            this.trigger("drawnFrame"));
        }),
        (AnimationItem.prototype.renderFrame = function () {
          if (!(this.isLoaded === !1 || !this.renderer))
            try {
              (this.expressionsPlugin && this.expressionsPlugin.resetFrame(),
                this.renderer.renderFrame(this.currentFrame + this.firstFrame));
            } catch (V) {
              this.triggerRenderFrameError(V);
            }
        }),
        (AnimationItem.prototype.play = function (V) {
          (V && this.name !== V) ||
            (this.isPaused === !0 &&
              ((this.isPaused = !1),
              this.trigger("_play"),
              this.audioController.resume(),
              this._idle && ((this._idle = !1), this.trigger("_active"))));
        }),
        (AnimationItem.prototype.pause = function (V) {
          (V && this.name !== V) ||
            (this.isPaused === !1 &&
              ((this.isPaused = !0),
              this.trigger("_pause"),
              (this._idle = !0),
              this.trigger("_idle"),
              this.audioController.pause()));
        }),
        (AnimationItem.prototype.togglePause = function (V) {
          (V && this.name !== V) ||
            (this.isPaused === !0 ? this.play() : this.pause());
        }),
        (AnimationItem.prototype.stop = function (V) {
          (V && this.name !== V) ||
            (this.pause(),
            (this.playCount = 0),
            (this._completedLoop = !1),
            this.setCurrentRawFrameValue(0));
        }),
        (AnimationItem.prototype.getMarkerData = function (V) {
          for (var O, B = 0; B < this.markers.length; B += 1)
            if (((O = this.markers[B]), O.payload && O.payload.name === V))
              return O;
          return null;
        }),
        (AnimationItem.prototype.goToAndStop = function (V, O, B) {
          if (!(B && this.name !== B)) {
            var z = Number(V);
            if (isNaN(z)) {
              var N = this.getMarkerData(V);
              N && this.goToAndStop(N.time, !0);
            } else
              O
                ? this.setCurrentRawFrameValue(V)
                : this.setCurrentRawFrameValue(V * this.frameModifier);
            this.pause();
          }
        }),
        (AnimationItem.prototype.goToAndPlay = function (V, O, B) {
          if (!(B && this.name !== B)) {
            var z = Number(V);
            if (isNaN(z)) {
              var N = this.getMarkerData(V);
              N &&
                (N.duration
                  ? this.playSegments([N.time, N.time + N.duration], !0)
                  : this.goToAndStop(N.time, !0));
            } else this.goToAndStop(z, O, B);
            this.play();
          }
        }),
        (AnimationItem.prototype.advanceTime = function (V) {
          if (!(this.isPaused === !0 || this.isLoaded === !1)) {
            var O = this.currentRawFrame + V * this.frameModifier,
              B = !1;
            (O >= this.totalFrames - 1 && this.frameModifier > 0
              ? !this.loop || this.playCount === this.loop
                ? this.checkSegments(
                    O > this.totalFrames ? O % this.totalFrames : 0,
                  ) || ((B = !0), (O = this.totalFrames - 1))
                : O >= this.totalFrames
                  ? ((this.playCount += 1),
                    this.checkSegments(O % this.totalFrames) ||
                      (this.setCurrentRawFrameValue(O % this.totalFrames),
                      (this._completedLoop = !0),
                      this.trigger("loopComplete")))
                  : this.setCurrentRawFrameValue(O)
              : O < 0
                ? this.checkSegments(O % this.totalFrames) ||
                  (this.loop && !(this.playCount-- <= 0 && this.loop !== !0)
                    ? (this.setCurrentRawFrameValue(
                        this.totalFrames + (O % this.totalFrames),
                      ),
                      this._completedLoop
                        ? this.trigger("loopComplete")
                        : (this._completedLoop = !0))
                    : ((B = !0), (O = 0)))
                : this.setCurrentRawFrameValue(O),
              B &&
                (this.setCurrentRawFrameValue(O),
                this.pause(),
                this.trigger("complete")));
          }
        }),
        (AnimationItem.prototype.adjustSegment = function (V, O) {
          ((this.playCount = 0),
            V[1] < V[0]
              ? (this.frameModifier > 0 &&
                  (this.playSpeed < 0
                    ? this.setSpeed(-this.playSpeed)
                    : this.setDirection(-1)),
                (this.totalFrames = V[0] - V[1]),
                (this.timeCompleted = this.totalFrames),
                (this.firstFrame = V[1]),
                this.setCurrentRawFrameValue(this.totalFrames - 0.001 - O))
              : V[1] > V[0] &&
                (this.frameModifier < 0 &&
                  (this.playSpeed < 0
                    ? this.setSpeed(-this.playSpeed)
                    : this.setDirection(1)),
                (this.totalFrames = V[1] - V[0]),
                (this.timeCompleted = this.totalFrames),
                (this.firstFrame = V[0]),
                this.setCurrentRawFrameValue(0.001 + O)),
            this.trigger("segmentStart"));
        }),
        (AnimationItem.prototype.setSegment = function (V, O) {
          var B = -1;
          (this.isPaused &&
            (this.currentRawFrame + this.firstFrame < V
              ? (B = V)
              : this.currentRawFrame + this.firstFrame > O && (B = O - V)),
            (this.firstFrame = V),
            (this.totalFrames = O - V),
            (this.timeCompleted = this.totalFrames),
            B !== -1 && this.goToAndStop(B, !0));
        }),
        (AnimationItem.prototype.playSegments = function (V, O) {
          if ((O && (this.segments.length = 0), _typeof$4(V[0]) === "object")) {
            var B,
              z = V.length;
            for (B = 0; B < z; B += 1) this.segments.push(V[B]);
          } else this.segments.push(V);
          (this.segments.length &&
            O &&
            this.adjustSegment(this.segments.shift(), 0),
            this.isPaused && this.play());
        }),
        (AnimationItem.prototype.resetSegments = function (V) {
          ((this.segments.length = 0),
            this.segments.push([this.animationData.ip, this.animationData.op]),
            V && this.checkSegments(0));
        }),
        (AnimationItem.prototype.checkSegments = function (V) {
          return this.segments.length
            ? (this.adjustSegment(this.segments.shift(), V), !0)
            : !1;
        }),
        (AnimationItem.prototype.destroy = function (V) {
          (V && this.name !== V) ||
            !this.renderer ||
            (this.renderer.destroy(),
            this.imagePreloader.destroy(),
            this.trigger("destroy"),
            (this._cbs = null),
            (this.onEnterFrame = null),
            (this.onLoopComplete = null),
            (this.onComplete = null),
            (this.onSegmentStart = null),
            (this.onDestroy = null),
            (this.renderer = null),
            (this.expressionsPlugin = null),
            (this.imagePreloader = null),
            (this.projectInterface = null));
        }),
        (AnimationItem.prototype.setCurrentRawFrameValue = function (V) {
          ((this.currentRawFrame = V), this.gotoFrame());
        }),
        (AnimationItem.prototype.setSpeed = function (V) {
          ((this.playSpeed = V), this.updaFrameModifier());
        }),
        (AnimationItem.prototype.setDirection = function (V) {
          ((this.playDirection = V < 0 ? -1 : 1), this.updaFrameModifier());
        }),
        (AnimationItem.prototype.setLoop = function (V) {
          this.loop = V;
        }),
        (AnimationItem.prototype.setVolume = function (V, O) {
          (O && this.name !== O) || this.audioController.setVolume(V);
        }),
        (AnimationItem.prototype.getVolume = function () {
          return this.audioController.getVolume();
        }),
        (AnimationItem.prototype.mute = function (V) {
          (V && this.name !== V) || this.audioController.mute();
        }),
        (AnimationItem.prototype.unmute = function (V) {
          (V && this.name !== V) || this.audioController.unmute();
        }),
        (AnimationItem.prototype.updaFrameModifier = function () {
          ((this.frameModifier =
            this.frameMult * this.playSpeed * this.playDirection),
            this.audioController.setRate(this.playSpeed * this.playDirection));
        }),
        (AnimationItem.prototype.getPath = function () {
          return this.path;
        }),
        (AnimationItem.prototype.getAssetsPath = function (V) {
          var O = "";
          if (V.e) O = V.p;
          else if (this.assetsPath) {
            var B = V.p;
            (B.indexOf("images/") !== -1 && (B = B.split("/")[1]),
              (O = this.assetsPath + B));
          } else ((O = this.path), (O += V.u ? V.u : ""), (O += V.p));
          return O;
        }),
        (AnimationItem.prototype.getAssetData = function (V) {
          for (var O = 0, B = this.assets.length; O < B; ) {
            if (V === this.assets[O].id) return this.assets[O];
            O += 1;
          }
          return null;
        }),
        (AnimationItem.prototype.hide = function () {
          this.renderer.hide();
        }),
        (AnimationItem.prototype.show = function () {
          this.renderer.show();
        }),
        (AnimationItem.prototype.getDuration = function (V) {
          return V ? this.totalFrames : this.totalFrames / this.frameRate;
        }),
        (AnimationItem.prototype.updateDocumentData = function (V, O, B) {
          try {
            var z = this.renderer.getElementByPath(V);
            z.updateDocumentData(O, B);
          } catch {}
        }),
        (AnimationItem.prototype.trigger = function (V) {
          if (this._cbs && this._cbs[V])
            switch (V) {
              case "enterFrame":
                this.triggerEvent(
                  V,
                  new BMEnterFrameEvent(
                    V,
                    this.currentFrame,
                    this.totalFrames,
                    this.frameModifier,
                  ),
                );
                break;
              case "drawnFrame":
                ((this.drawnFrameEvent.currentTime = this.currentFrame),
                  (this.drawnFrameEvent.totalTime = this.totalFrames),
                  (this.drawnFrameEvent.direction = this.frameModifier),
                  this.triggerEvent(V, this.drawnFrameEvent));
                break;
              case "loopComplete":
                this.triggerEvent(
                  V,
                  new BMCompleteLoopEvent(
                    V,
                    this.loop,
                    this.playCount,
                    this.frameMult,
                  ),
                );
                break;
              case "complete":
                this.triggerEvent(V, new BMCompleteEvent(V, this.frameMult));
                break;
              case "segmentStart":
                this.triggerEvent(
                  V,
                  new BMSegmentStartEvent(V, this.firstFrame, this.totalFrames),
                );
                break;
              case "destroy":
                this.triggerEvent(V, new BMDestroyEvent(V, this));
                break;
              default:
                this.triggerEvent(V);
            }
          (V === "enterFrame" &&
            this.onEnterFrame &&
            this.onEnterFrame.call(
              this,
              new BMEnterFrameEvent(
                V,
                this.currentFrame,
                this.totalFrames,
                this.frameMult,
              ),
            ),
            V === "loopComplete" &&
              this.onLoopComplete &&
              this.onLoopComplete.call(
                this,
                new BMCompleteLoopEvent(
                  V,
                  this.loop,
                  this.playCount,
                  this.frameMult,
                ),
              ),
            V === "complete" &&
              this.onComplete &&
              this.onComplete.call(
                this,
                new BMCompleteEvent(V, this.frameMult),
              ),
            V === "segmentStart" &&
              this.onSegmentStart &&
              this.onSegmentStart.call(
                this,
                new BMSegmentStartEvent(V, this.firstFrame, this.totalFrames),
              ),
            V === "destroy" &&
              this.onDestroy &&
              this.onDestroy.call(this, new BMDestroyEvent(V, this)));
        }),
        (AnimationItem.prototype.triggerRenderFrameError = function (V) {
          var O = new BMRenderFrameErrorEvent(V, this.currentFrame);
          (this.triggerEvent("error", O),
            this.onError && this.onError.call(this, O));
        }),
        (AnimationItem.prototype.triggerConfigError = function (V) {
          var O = new BMConfigErrorEvent(V, this.currentFrame);
          (this.triggerEvent("error", O),
            this.onError && this.onError.call(this, O));
        }));
      var animationManager = (function () {
          var V = {},
            O = [],
            B = 0,
            z = 0,
            N = 0,
            G = !0,
            H = !1;
          function W(le) {
            for (var pe = 0, ie = le.target; pe < z; )
              (O[pe].animation === ie &&
                (O.splice(pe, 1), (pe -= 1), (z -= 1), ie.isPaused || re()),
                (pe += 1));
          }
          function q(le, pe) {
            if (!le) return null;
            for (var ie = 0; ie < z; ) {
              if (O[ie].elem === le && O[ie].elem !== null)
                return O[ie].animation;
              ie += 1;
            }
            var ae = new AnimationItem();
            return (U(ae, le), ae.setData(le, pe), ae);
          }
          function j() {
            var le,
              pe = O.length,
              ie = [];
            for (le = 0; le < pe; le += 1) ie.push(O[le].animation);
            return ie;
          }
          function Y() {
            ((N += 1), ge());
          }
          function re() {
            N -= 1;
          }
          function U(le, pe) {
            (le.addEventListener("destroy", W),
              le.addEventListener("_active", Y),
              le.addEventListener("_idle", re),
              O.push({ elem: pe, animation: le }),
              (z += 1));
          }
          function K(le) {
            var pe = new AnimationItem();
            return (U(pe, null), pe.setParams(le), pe);
          }
          function Z(le, pe) {
            var ie;
            for (ie = 0; ie < z; ie += 1) O[ie].animation.setSpeed(le, pe);
          }
          function X(le, pe) {
            var ie;
            for (ie = 0; ie < z; ie += 1) O[ie].animation.setDirection(le, pe);
          }
          function se(le) {
            var pe;
            for (pe = 0; pe < z; pe += 1) O[pe].animation.play(le);
          }
          function Q(le) {
            var pe = le - B,
              ie;
            for (ie = 0; ie < z; ie += 1) O[ie].animation.advanceTime(pe);
            ((B = le), N && !H ? window.requestAnimationFrame(Q) : (G = !0));
          }
          function te(le) {
            ((B = le), window.requestAnimationFrame(Q));
          }
          function J(le) {
            var pe;
            for (pe = 0; pe < z; pe += 1) O[pe].animation.pause(le);
          }
          function ee(le, pe, ie) {
            var ae;
            for (ae = 0; ae < z; ae += 1)
              O[ae].animation.goToAndStop(le, pe, ie);
          }
          function ne(le) {
            var pe;
            for (pe = 0; pe < z; pe += 1) O[pe].animation.stop(le);
          }
          function oe(le) {
            var pe;
            for (pe = 0; pe < z; pe += 1) O[pe].animation.togglePause(le);
          }
          function he(le) {
            var pe;
            for (pe = z - 1; pe >= 0; pe -= 1) O[pe].animation.destroy(le);
          }
          function ce(le, pe, ie) {
            var ae = [].concat(
                [].slice.call(document.getElementsByClassName("lottie")),
                [].slice.call(document.getElementsByClassName("bodymovin")),
              ),
              fe,
              de = ae.length;
            for (fe = 0; fe < de; fe += 1)
              (ie && ae[fe].setAttribute("data-bm-type", ie), q(ae[fe], le));
            if (pe && de === 0) {
              ie || (ie = "svg");
              var xe = document.getElementsByTagName("body")[0];
              xe.innerText = "";
              var we = createTag("div");
              ((we.style.width = "100%"),
                (we.style.height = "100%"),
                we.setAttribute("data-bm-type", ie),
                xe.appendChild(we),
                q(we, le));
            }
          }
          function ue() {
            var le;
            for (le = 0; le < z; le += 1) O[le].animation.resize();
          }
          function ge() {
            !H && N && G && (window.requestAnimationFrame(te), (G = !1));
          }
          function ye() {
            H = !0;
          }
          function me() {
            ((H = !1), ge());
          }
          function be(le, pe) {
            var ie;
            for (ie = 0; ie < z; ie += 1) O[ie].animation.setVolume(le, pe);
          }
          function Se(le) {
            var pe;
            for (pe = 0; pe < z; pe += 1) O[pe].animation.mute(le);
          }
          function _e(le) {
            var pe;
            for (pe = 0; pe < z; pe += 1) O[pe].animation.unmute(le);
          }
          return (
            (V.registerAnimation = q),
            (V.loadAnimation = K),
            (V.setSpeed = Z),
            (V.setDirection = X),
            (V.play = se),
            (V.pause = J),
            (V.stop = ne),
            (V.togglePause = oe),
            (V.searchAnimations = ce),
            (V.resize = ue),
            (V.goToAndStop = ee),
            (V.destroy = he),
            (V.freeze = ye),
            (V.unfreeze = me),
            (V.setVolume = be),
            (V.mute = Se),
            (V.unmute = _e),
            (V.getRegisteredAnimations = j),
            V
          );
        })(),
        BezierFactory = (function () {
          var V = {};
          V.getBezierEasing = B;
          var O = {};
          function B(te, J, ee, ne, oe) {
            var he =
              oe ||
              ("bez_" + te + "_" + J + "_" + ee + "_" + ne).replace(/\./g, "p");
            if (O[he]) return O[he];
            var ce = new Q([te, J, ee, ne]);
            return ((O[he] = ce), ce);
          }
          var z = 4,
            N = 0.001,
            G = 1e-7,
            H = 10,
            W = 11,
            q = 1 / (W - 1),
            j = typeof Float32Array == "function";
          function Y(te, J) {
            return 1 - 3 * J + 3 * te;
          }
          function re(te, J) {
            return 3 * J - 6 * te;
          }
          function U(te) {
            return 3 * te;
          }
          function K(te, J, ee) {
            return ((Y(J, ee) * te + re(J, ee)) * te + U(J)) * te;
          }
          function Z(te, J, ee) {
            return 3 * Y(J, ee) * te * te + 2 * re(J, ee) * te + U(J);
          }
          function X(te, J, ee, ne, oe) {
            var he,
              ce,
              ue = 0;
            do
              ((ce = J + (ee - J) / 2),
                (he = K(ce, ne, oe) - te),
                he > 0 ? (ee = ce) : (J = ce));
            while (Math.abs(he) > G && ++ue < H);
            return ce;
          }
          function se(te, J, ee, ne) {
            for (var oe = 0; oe < z; ++oe) {
              var he = Z(J, ee, ne);
              if (he === 0) return J;
              var ce = K(J, ee, ne) - te;
              J -= ce / he;
            }
            return J;
          }
          function Q(te) {
            ((this._p = te),
              (this._mSampleValues = j ? new Float32Array(W) : new Array(W)),
              (this._precomputed = !1),
              (this.get = this.get.bind(this)));
          }
          return (
            (Q.prototype = {
              get: function (J) {
                var ee = this._p[0],
                  ne = this._p[1],
                  oe = this._p[2],
                  he = this._p[3];
                return (
                  this._precomputed || this._precompute(),
                  ee === ne && oe === he
                    ? J
                    : J === 0
                      ? 0
                      : J === 1
                        ? 1
                        : K(this._getTForX(J), ne, he)
                );
              },
              _precompute: function () {
                var J = this._p[0],
                  ee = this._p[1],
                  ne = this._p[2],
                  oe = this._p[3];
                ((this._precomputed = !0),
                  (J !== ee || ne !== oe) && this._calcSampleValues());
              },
              _calcSampleValues: function () {
                for (var J = this._p[0], ee = this._p[2], ne = 0; ne < W; ++ne)
                  this._mSampleValues[ne] = K(ne * q, J, ee);
              },
              _getTForX: function (J) {
                for (
                  var ee = this._p[0],
                    ne = this._p[2],
                    oe = this._mSampleValues,
                    he = 0,
                    ce = 1,
                    ue = W - 1;
                  ce !== ue && oe[ce] <= J;
                  ++ce
                )
                  he += q;
                --ce;
                var ge = (J - oe[ce]) / (oe[ce + 1] - oe[ce]),
                  ye = he + ge * q,
                  me = Z(ye, ee, ne);
                return me >= N
                  ? se(J, ye, ee, ne)
                  : me === 0
                    ? ye
                    : X(J, he, he + q, ee, ne);
              },
            }),
            V
          );
        })(),
        pooling = (function () {
          function V(O) {
            return O.concat(createSizedArray(O.length));
          }
          return { double: V };
        })(),
        poolFactory = (function () {
          return function (V, O, B) {
            var z = 0,
              N = V,
              G = createSizedArray(N),
              H = { newElement: W, release: q };
            function W() {
              var j;
              return (z ? ((z -= 1), (j = G[z])) : (j = O()), j);
            }
            function q(j) {
              (z === N && ((G = pooling.double(G)), (N *= 2)),
                B && B(j),
                (G[z] = j),
                (z += 1));
            }
            return H;
          };
        })(),
        bezierLengthPool = (function () {
          function V() {
            return {
              addedLength: 0,
              percents: createTypedArray("float32", getDefaultCurveSegments()),
              lengths: createTypedArray("float32", getDefaultCurveSegments()),
            };
          }
          return poolFactory(8, V);
        })(),
        segmentsLengthPool = (function () {
          function V() {
            return { lengths: [], totalLength: 0 };
          }
          function O(B) {
            var z,
              N = B.lengths.length;
            for (z = 0; z < N; z += 1) bezierLengthPool.release(B.lengths[z]);
            B.lengths.length = 0;
          }
          return poolFactory(8, V, O);
        })();
      function bezFunction() {
        var V = Math;
        function O(U, K, Z, X, se, Q) {
          var te = U * X + K * se + Z * Q - se * X - Q * U - Z * K;
          return te > -0.001 && te < 0.001;
        }
        function B(U, K, Z, X, se, Q, te, J, ee) {
          if (Z === 0 && Q === 0 && ee === 0) return O(U, K, X, se, te, J);
          var ne = V.sqrt(V.pow(X - U, 2) + V.pow(se - K, 2) + V.pow(Q - Z, 2)),
            oe = V.sqrt(V.pow(te - U, 2) + V.pow(J - K, 2) + V.pow(ee - Z, 2)),
            he = V.sqrt(V.pow(te - X, 2) + V.pow(J - se, 2) + V.pow(ee - Q, 2)),
            ce;
          return (
            ne > oe
              ? ne > he
                ? (ce = ne - oe - he)
                : (ce = he - oe - ne)
              : he > oe
                ? (ce = he - oe - ne)
                : (ce = oe - ne - he),
            ce > -1e-4 && ce < 1e-4
          );
        }
        var z = (function () {
          return function (U, K, Z, X) {
            var se = getDefaultCurveSegments(),
              Q,
              te,
              J,
              ee,
              ne,
              oe = 0,
              he,
              ce = [],
              ue = [],
              ge = bezierLengthPool.newElement();
            for (J = Z.length, Q = 0; Q < se; Q += 1) {
              for (ne = Q / (se - 1), he = 0, te = 0; te < J; te += 1)
                ((ee =
                  bmPow(1 - ne, 3) * U[te] +
                  3 * bmPow(1 - ne, 2) * ne * Z[te] +
                  3 * (1 - ne) * bmPow(ne, 2) * X[te] +
                  bmPow(ne, 3) * K[te]),
                  (ce[te] = ee),
                  ue[te] !== null && (he += bmPow(ce[te] - ue[te], 2)),
                  (ue[te] = ce[te]));
              (he && ((he = bmSqrt(he)), (oe += he)),
                (ge.percents[Q] = ne),
                (ge.lengths[Q] = oe));
            }
            return ((ge.addedLength = oe), ge);
          };
        })();
        function N(U) {
          var K = segmentsLengthPool.newElement(),
            Z = U.c,
            X = U.v,
            se = U.o,
            Q = U.i,
            te,
            J = U._length,
            ee = K.lengths,
            ne = 0;
          for (te = 0; te < J - 1; te += 1)
            ((ee[te] = z(X[te], X[te + 1], se[te], Q[te + 1])),
              (ne += ee[te].addedLength));
          return (
            Z &&
              J &&
              ((ee[te] = z(X[te], X[0], se[te], Q[0])),
              (ne += ee[te].addedLength)),
            (K.totalLength = ne),
            K
          );
        }
        function G(U) {
          ((this.segmentLength = 0), (this.points = new Array(U)));
        }
        function H(U, K) {
          ((this.partialLength = U), (this.point = K));
        }
        var W = (function () {
          var U = {};
          return function (K, Z, X, se) {
            var Q = (
              K[0] +
              "_" +
              K[1] +
              "_" +
              Z[0] +
              "_" +
              Z[1] +
              "_" +
              X[0] +
              "_" +
              X[1] +
              "_" +
              se[0] +
              "_" +
              se[1]
            ).replace(/\./g, "p");
            if (!U[Q]) {
              var te = getDefaultCurveSegments(),
                J,
                ee,
                ne,
                oe,
                he,
                ce = 0,
                ue,
                ge,
                ye = null;
              K.length === 2 &&
                (K[0] !== Z[0] || K[1] !== Z[1]) &&
                O(K[0], K[1], Z[0], Z[1], K[0] + X[0], K[1] + X[1]) &&
                O(K[0], K[1], Z[0], Z[1], Z[0] + se[0], Z[1] + se[1]) &&
                (te = 2);
              var me = new G(te);
              for (ne = X.length, J = 0; J < te; J += 1) {
                for (
                  ge = createSizedArray(ne), he = J / (te - 1), ue = 0, ee = 0;
                  ee < ne;
                  ee += 1
                )
                  ((oe =
                    bmPow(1 - he, 3) * K[ee] +
                    3 * bmPow(1 - he, 2) * he * (K[ee] + X[ee]) +
                    3 * (1 - he) * bmPow(he, 2) * (Z[ee] + se[ee]) +
                    bmPow(he, 3) * Z[ee]),
                    (ge[ee] = oe),
                    ye !== null && (ue += bmPow(ge[ee] - ye[ee], 2)));
                ((ue = bmSqrt(ue)),
                  (ce += ue),
                  (me.points[J] = new H(ue, ge)),
                  (ye = ge));
              }
              ((me.segmentLength = ce), (U[Q] = me));
            }
            return U[Q];
          };
        })();
        function q(U, K) {
          var Z = K.percents,
            X = K.lengths,
            se = Z.length,
            Q = bmFloor((se - 1) * U),
            te = U * K.addedLength,
            J = 0;
          if (Q === se - 1 || Q === 0 || te === X[Q]) return Z[Q];
          for (var ee = X[Q] > te ? -1 : 1, ne = !0; ne; )
            if (
              (X[Q] <= te && X[Q + 1] > te
                ? ((J = (te - X[Q]) / (X[Q + 1] - X[Q])), (ne = !1))
                : (Q += ee),
              Q < 0 || Q >= se - 1)
            ) {
              if (Q === se - 1) return Z[Q];
              ne = !1;
            }
          return Z[Q] + (Z[Q + 1] - Z[Q]) * J;
        }
        function j(U, K, Z, X, se, Q) {
          var te = q(se, Q),
            J = 1 - te,
            ee =
              V.round(
                (J * J * J * U[0] +
                  (te * J * J + J * te * J + J * J * te) * Z[0] +
                  (te * te * J + J * te * te + te * J * te) * X[0] +
                  te * te * te * K[0]) *
                  1e3,
              ) / 1e3,
            ne =
              V.round(
                (J * J * J * U[1] +
                  (te * J * J + J * te * J + J * J * te) * Z[1] +
                  (te * te * J + J * te * te + te * J * te) * X[1] +
                  te * te * te * K[1]) *
                  1e3,
              ) / 1e3;
          return [ee, ne];
        }
        var Y = createTypedArray("float32", 8);
        function re(U, K, Z, X, se, Q, te) {
          se < 0 ? (se = 0) : se > 1 && (se = 1);
          var J = q(se, te);
          Q = Q > 1 ? 1 : Q;
          var ee = q(Q, te),
            ne,
            oe = U.length,
            he = 1 - J,
            ce = 1 - ee,
            ue = he * he * he,
            ge = J * he * he * 3,
            ye = J * J * he * 3,
            me = J * J * J,
            be = he * he * ce,
            Se = J * he * ce + he * J * ce + he * he * ee,
            _e = J * J * ce + he * J * ee + J * he * ee,
            le = J * J * ee,
            pe = he * ce * ce,
            ie = J * ce * ce + he * ee * ce + he * ce * ee,
            ae = J * ee * ce + he * ee * ee + J * ce * ee,
            fe = J * ee * ee,
            de = ce * ce * ce,
            xe = ee * ce * ce + ce * ee * ce + ce * ce * ee,
            we = ee * ee * ce + ce * ee * ee + ee * ce * ee,
            Ee = ee * ee * ee;
          for (ne = 0; ne < oe; ne += 1)
            ((Y[ne * 4] =
              V.round(
                (ue * U[ne] + ge * Z[ne] + ye * X[ne] + me * K[ne]) * 1e3,
              ) / 1e3),
              (Y[ne * 4 + 1] =
                V.round(
                  (be * U[ne] + Se * Z[ne] + _e * X[ne] + le * K[ne]) * 1e3,
                ) / 1e3),
              (Y[ne * 4 + 2] =
                V.round(
                  (pe * U[ne] + ie * Z[ne] + ae * X[ne] + fe * K[ne]) * 1e3,
                ) / 1e3),
              (Y[ne * 4 + 3] =
                V.round(
                  (de * U[ne] + xe * Z[ne] + we * X[ne] + Ee * K[ne]) * 1e3,
                ) / 1e3));
          return Y;
        }
        return {
          getSegmentsLength: N,
          getNewSegment: re,
          getPointInSegment: j,
          buildBezierData: W,
          pointOnLine2D: O,
          pointOnLine3D: B,
        };
      }
      var bez = bezFunction(),
        initFrame = initialDefaultFrame,
        mathAbs = Math.abs;
      function interpolateValue(V, O) {
        var B = this.offsetTime,
          z;
        this.propType === "multidimensional" &&
          (z = createTypedArray("float32", this.pv.length));
        for (
          var N = O.lastIndex,
            G = N,
            H = this.keyframes.length - 1,
            W = !0,
            q,
            j,
            Y;
          W;
        ) {
          if (
            ((q = this.keyframes[G]),
            (j = this.keyframes[G + 1]),
            G === H - 1 && V >= j.t - B)
          ) {
            (q.h && (q = j), (N = 0));
            break;
          }
          if (j.t - B > V) {
            N = G;
            break;
          }
          G < H - 1 ? (G += 1) : ((N = 0), (W = !1));
        }
        Y = this.keyframesMetadata[G] || {};
        var re,
          U,
          K,
          Z,
          X,
          se,
          Q = j.t - B,
          te = q.t - B,
          J;
        if (q.to) {
          Y.bezierData ||
            (Y.bezierData = bez.buildBezierData(q.s, j.s || q.e, q.to, q.ti));
          var ee = Y.bezierData;
          if (V >= Q || V < te) {
            var ne = V >= Q ? ee.points.length - 1 : 0;
            for (U = ee.points[ne].point.length, re = 0; re < U; re += 1)
              z[re] = ee.points[ne].point[re];
          } else {
            (Y.__fnct
              ? (se = Y.__fnct)
              : ((se = BezierFactory.getBezierEasing(
                  q.o.x,
                  q.o.y,
                  q.i.x,
                  q.i.y,
                  q.n,
                ).get),
                (Y.__fnct = se)),
              (K = se((V - te) / (Q - te))));
            var oe = ee.segmentLength * K,
              he,
              ce =
                O.lastFrame < V && O._lastKeyframeIndex === G
                  ? O._lastAddedLength
                  : 0;
            for (
              X =
                O.lastFrame < V && O._lastKeyframeIndex === G
                  ? O._lastPoint
                  : 0,
                W = !0,
                Z = ee.points.length;
              W;
            ) {
              if (
                ((ce += ee.points[X].partialLength),
                oe === 0 || K === 0 || X === ee.points.length - 1)
              ) {
                for (U = ee.points[X].point.length, re = 0; re < U; re += 1)
                  z[re] = ee.points[X].point[re];
                break;
              } else if (oe >= ce && oe < ce + ee.points[X + 1].partialLength) {
                for (
                  he = (oe - ce) / ee.points[X + 1].partialLength,
                    U = ee.points[X].point.length,
                    re = 0;
                  re < U;
                  re += 1
                )
                  z[re] =
                    ee.points[X].point[re] +
                    (ee.points[X + 1].point[re] - ee.points[X].point[re]) * he;
                break;
              }
              X < Z - 1 ? (X += 1) : (W = !1);
            }
            ((O._lastPoint = X),
              (O._lastAddedLength = ce - ee.points[X].partialLength),
              (O._lastKeyframeIndex = G));
          }
        } else {
          var ue, ge, ye, me, be;
          if (((H = q.s.length), (J = j.s || q.e), this.sh && q.h !== 1))
            if (V >= Q) ((z[0] = J[0]), (z[1] = J[1]), (z[2] = J[2]));
            else if (V <= te)
              ((z[0] = q.s[0]), (z[1] = q.s[1]), (z[2] = q.s[2]));
            else {
              var Se = createQuaternion(q.s),
                _e = createQuaternion(J),
                le = (V - te) / (Q - te);
              quaternionToEuler(z, slerp(Se, _e, le));
            }
          else
            for (G = 0; G < H; G += 1)
              (q.h !== 1 &&
                (V >= Q
                  ? (K = 1)
                  : V < te
                    ? (K = 0)
                    : (q.o.x.constructor === Array
                        ? (Y.__fnct || (Y.__fnct = []),
                          Y.__fnct[G]
                            ? (se = Y.__fnct[G])
                            : ((ue = q.o.x[G] === void 0 ? q.o.x[0] : q.o.x[G]),
                              (ge = q.o.y[G] === void 0 ? q.o.y[0] : q.o.y[G]),
                              (ye = q.i.x[G] === void 0 ? q.i.x[0] : q.i.x[G]),
                              (me = q.i.y[G] === void 0 ? q.i.y[0] : q.i.y[G]),
                              (se = BezierFactory.getBezierEasing(
                                ue,
                                ge,
                                ye,
                                me,
                              ).get),
                              (Y.__fnct[G] = se)))
                        : Y.__fnct
                          ? (se = Y.__fnct)
                          : ((ue = q.o.x),
                            (ge = q.o.y),
                            (ye = q.i.x),
                            (me = q.i.y),
                            (se = BezierFactory.getBezierEasing(
                              ue,
                              ge,
                              ye,
                              me,
                            ).get),
                            (q.keyframeMetadata = se)),
                      (K = se((V - te) / (Q - te))))),
                (J = j.s || q.e),
                (be = q.h === 1 ? q.s[G] : q.s[G] + (J[G] - q.s[G]) * K),
                this.propType === "multidimensional" ? (z[G] = be) : (z = be));
        }
        return ((O.lastIndex = N), z);
      }
      function slerp(V, O, B) {
        var z = [],
          N = V[0],
          G = V[1],
          H = V[2],
          W = V[3],
          q = O[0],
          j = O[1],
          Y = O[2],
          re = O[3],
          U,
          K,
          Z,
          X,
          se;
        return (
          (K = N * q + G * j + H * Y + W * re),
          K < 0 && ((K = -K), (q = -q), (j = -j), (Y = -Y), (re = -re)),
          1 - K > 1e-6
            ? ((U = Math.acos(K)),
              (Z = Math.sin(U)),
              (X = Math.sin((1 - B) * U) / Z),
              (se = Math.sin(B * U) / Z))
            : ((X = 1 - B), (se = B)),
          (z[0] = X * N + se * q),
          (z[1] = X * G + se * j),
          (z[2] = X * H + se * Y),
          (z[3] = X * W + se * re),
          z
        );
      }
      function quaternionToEuler(V, O) {
        var B = O[0],
          z = O[1],
          N = O[2],
          G = O[3],
          H = Math.atan2(2 * z * G - 2 * B * N, 1 - 2 * z * z - 2 * N * N),
          W = Math.asin(2 * B * z + 2 * N * G),
          q = Math.atan2(2 * B * G - 2 * z * N, 1 - 2 * B * B - 2 * N * N);
        ((V[0] = H / degToRads),
          (V[1] = W / degToRads),
          (V[2] = q / degToRads));
      }
      function createQuaternion(V) {
        var O = V[0] * degToRads,
          B = V[1] * degToRads,
          z = V[2] * degToRads,
          N = Math.cos(O / 2),
          G = Math.cos(B / 2),
          H = Math.cos(z / 2),
          W = Math.sin(O / 2),
          q = Math.sin(B / 2),
          j = Math.sin(z / 2),
          Y = N * G * H - W * q * j,
          re = W * q * H + N * G * j,
          U = W * G * H + N * q * j,
          K = N * q * H - W * G * j;
        return [re, U, K, Y];
      }
      function getValueAtCurrentTime() {
        var V = this.comp.renderedFrame - this.offsetTime,
          O = this.keyframes[0].t - this.offsetTime,
          B = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
        if (
          !(
            V === this._caching.lastFrame ||
            (this._caching.lastFrame !== initFrame &&
              ((this._caching.lastFrame >= B && V >= B) ||
                (this._caching.lastFrame < O && V < O)))
          )
        ) {
          this._caching.lastFrame >= V &&
            ((this._caching._lastKeyframeIndex = -1),
            (this._caching.lastIndex = 0));
          var z = this.interpolateValue(V, this._caching);
          this.pv = z;
        }
        return ((this._caching.lastFrame = V), this.pv);
      }
      function setVValue(V) {
        var O;
        if (this.propType === "unidimensional")
          ((O = V * this.mult),
            mathAbs(this.v - O) > 1e-5 && ((this.v = O), (this._mdf = !0)));
        else
          for (var B = 0, z = this.v.length; B < z; )
            ((O = V[B] * this.mult),
              mathAbs(this.v[B] - O) > 1e-5 &&
                ((this.v[B] = O), (this._mdf = !0)),
              (B += 1));
      }
      function processEffectsSequence() {
        if (
          !(
            this.elem.globalData.frameId === this.frameId ||
            !this.effectsSequence.length
          )
        ) {
          if (this.lock) {
            this.setVValue(this.pv);
            return;
          }
          ((this.lock = !0), (this._mdf = this._isFirstFrame));
          var V,
            O = this.effectsSequence.length,
            B = this.kf ? this.pv : this.data.k;
          for (V = 0; V < O; V += 1) B = this.effectsSequence[V](B);
          (this.setVValue(B),
            (this._isFirstFrame = !1),
            (this.lock = !1),
            (this.frameId = this.elem.globalData.frameId));
        }
      }
      function addEffect(V) {
        (this.effectsSequence.push(V), this.container.addDynamicProperty(this));
      }
      function ValueProperty(V, O, B, z) {
        ((this.propType = "unidimensional"),
          (this.mult = B || 1),
          (this.data = O),
          (this.v = B ? O.k * B : O.k),
          (this.pv = O.k),
          (this._mdf = !1),
          (this.elem = V),
          (this.container = z),
          (this.comp = V.comp),
          (this.k = !1),
          (this.kf = !1),
          (this.vel = 0),
          (this.effectsSequence = []),
          (this._isFirstFrame = !0),
          (this.getValue = processEffectsSequence),
          (this.setVValue = setVValue),
          (this.addEffect = addEffect));
      }
      function MultiDimensionalProperty(V, O, B, z) {
        ((this.propType = "multidimensional"),
          (this.mult = B || 1),
          (this.data = O),
          (this._mdf = !1),
          (this.elem = V),
          (this.container = z),
          (this.comp = V.comp),
          (this.k = !1),
          (this.kf = !1),
          (this.frameId = -1));
        var N,
          G = O.k.length;
        for (
          this.v = createTypedArray("float32", G),
            this.pv = createTypedArray("float32", G),
            this.vel = createTypedArray("float32", G),
            N = 0;
          N < G;
          N += 1
        )
          ((this.v[N] = O.k[N] * this.mult), (this.pv[N] = O.k[N]));
        ((this._isFirstFrame = !0),
          (this.effectsSequence = []),
          (this.getValue = processEffectsSequence),
          (this.setVValue = setVValue),
          (this.addEffect = addEffect));
      }
      function KeyframedValueProperty(V, O, B, z) {
        ((this.propType = "unidimensional"),
          (this.keyframes = O.k),
          (this.keyframesMetadata = []),
          (this.offsetTime = V.data.st),
          (this.frameId = -1),
          (this._caching = {
            lastFrame: initFrame,
            lastIndex: 0,
            value: 0,
            _lastKeyframeIndex: -1,
          }),
          (this.k = !0),
          (this.kf = !0),
          (this.data = O),
          (this.mult = B || 1),
          (this.elem = V),
          (this.container = z),
          (this.comp = V.comp),
          (this.v = initFrame),
          (this.pv = initFrame),
          (this._isFirstFrame = !0),
          (this.getValue = processEffectsSequence),
          (this.setVValue = setVValue),
          (this.interpolateValue = interpolateValue),
          (this.effectsSequence = [getValueAtCurrentTime.bind(this)]),
          (this.addEffect = addEffect));
      }
      function KeyframedMultidimensionalProperty(V, O, B, z) {
        this.propType = "multidimensional";
        var N,
          G = O.k.length,
          H,
          W,
          q,
          j;
        for (N = 0; N < G - 1; N += 1)
          O.k[N].to &&
            O.k[N].s &&
            O.k[N + 1] &&
            O.k[N + 1].s &&
            ((H = O.k[N].s),
            (W = O.k[N + 1].s),
            (q = O.k[N].to),
            (j = O.k[N].ti),
            ((H.length === 2 &&
              !(H[0] === W[0] && H[1] === W[1]) &&
              bez.pointOnLine2D(
                H[0],
                H[1],
                W[0],
                W[1],
                H[0] + q[0],
                H[1] + q[1],
              ) &&
              bez.pointOnLine2D(
                H[0],
                H[1],
                W[0],
                W[1],
                W[0] + j[0],
                W[1] + j[1],
              )) ||
              (H.length === 3 &&
                !(H[0] === W[0] && H[1] === W[1] && H[2] === W[2]) &&
                bez.pointOnLine3D(
                  H[0],
                  H[1],
                  H[2],
                  W[0],
                  W[1],
                  W[2],
                  H[0] + q[0],
                  H[1] + q[1],
                  H[2] + q[2],
                ) &&
                bez.pointOnLine3D(
                  H[0],
                  H[1],
                  H[2],
                  W[0],
                  W[1],
                  W[2],
                  W[0] + j[0],
                  W[1] + j[1],
                  W[2] + j[2],
                ))) &&
              ((O.k[N].to = null), (O.k[N].ti = null)),
            H[0] === W[0] &&
              H[1] === W[1] &&
              q[0] === 0 &&
              q[1] === 0 &&
              j[0] === 0 &&
              j[1] === 0 &&
              (H.length === 2 || (H[2] === W[2] && q[2] === 0 && j[2] === 0)) &&
              ((O.k[N].to = null), (O.k[N].ti = null)));
        ((this.effectsSequence = [getValueAtCurrentTime.bind(this)]),
          (this.data = O),
          (this.keyframes = O.k),
          (this.keyframesMetadata = []),
          (this.offsetTime = V.data.st),
          (this.k = !0),
          (this.kf = !0),
          (this._isFirstFrame = !0),
          (this.mult = B || 1),
          (this.elem = V),
          (this.container = z),
          (this.comp = V.comp),
          (this.getValue = processEffectsSequence),
          (this.setVValue = setVValue),
          (this.interpolateValue = interpolateValue),
          (this.frameId = -1));
        var Y = O.k[0].s.length;
        for (
          this.v = createTypedArray("float32", Y),
            this.pv = createTypedArray("float32", Y),
            N = 0;
          N < Y;
          N += 1
        )
          ((this.v[N] = initFrame), (this.pv[N] = initFrame));
        ((this._caching = {
          lastFrame: initFrame,
          lastIndex: 0,
          value: createTypedArray("float32", Y),
        }),
          (this.addEffect = addEffect));
      }
      var PropertyFactory = (function () {
        function V(B, z, N, G, H) {
          z.sid && (z = B.globalData.slotManager.getProp(z));
          var W;
          if (!z.k.length) W = new ValueProperty(B, z, G, H);
          else if (typeof z.k[0] == "number")
            W = new MultiDimensionalProperty(B, z, G, H);
          else
            switch (N) {
              case 0:
                W = new KeyframedValueProperty(B, z, G, H);
                break;
              case 1:
                W = new KeyframedMultidimensionalProperty(B, z, G, H);
                break;
            }
          return (W.effectsSequence.length && H.addDynamicProperty(W), W);
        }
        var O = { getProp: V };
        return O;
      })();
      function DynamicPropertyContainer() {}
      DynamicPropertyContainer.prototype = {
        addDynamicProperty: function (O) {
          this.dynamicProperties.indexOf(O) === -1 &&
            (this.dynamicProperties.push(O),
            this.container.addDynamicProperty(this),
            (this._isAnimated = !0));
        },
        iterateDynamicProperties: function () {
          this._mdf = !1;
          var O,
            B = this.dynamicProperties.length;
          for (O = 0; O < B; O += 1)
            (this.dynamicProperties[O].getValue(),
              this.dynamicProperties[O]._mdf && (this._mdf = !0));
        },
        initDynamicPropertyContainer: function (O) {
          ((this.container = O),
            (this.dynamicProperties = []),
            (this._mdf = !1),
            (this._isAnimated = !1));
        },
      };
      var pointPool = (function () {
        function V() {
          return createTypedArray("float32", 2);
        }
        return poolFactory(8, V);
      })();
      function ShapePath() {
        ((this.c = !1),
          (this._length = 0),
          (this._maxLength = 8),
          (this.v = createSizedArray(this._maxLength)),
          (this.o = createSizedArray(this._maxLength)),
          (this.i = createSizedArray(this._maxLength)));
      }
      ((ShapePath.prototype.setPathData = function (V, O) {
        ((this.c = V), this.setLength(O));
        for (var B = 0; B < O; )
          ((this.v[B] = pointPool.newElement()),
            (this.o[B] = pointPool.newElement()),
            (this.i[B] = pointPool.newElement()),
            (B += 1));
      }),
        (ShapePath.prototype.setLength = function (V) {
          for (; this._maxLength < V; ) this.doubleArrayLength();
          this._length = V;
        }),
        (ShapePath.prototype.doubleArrayLength = function () {
          ((this.v = this.v.concat(createSizedArray(this._maxLength))),
            (this.i = this.i.concat(createSizedArray(this._maxLength))),
            (this.o = this.o.concat(createSizedArray(this._maxLength))),
            (this._maxLength *= 2));
        }),
        (ShapePath.prototype.setXYAt = function (V, O, B, z, N) {
          var G;
          switch (
            ((this._length = Math.max(this._length, z + 1)),
            this._length >= this._maxLength && this.doubleArrayLength(),
            B)
          ) {
            case "v":
              G = this.v;
              break;
            case "i":
              G = this.i;
              break;
            case "o":
              G = this.o;
              break;
            default:
              G = [];
              break;
          }
          ((!G[z] || (G[z] && !N)) && (G[z] = pointPool.newElement()),
            (G[z][0] = V),
            (G[z][1] = O));
        }),
        (ShapePath.prototype.setTripleAt = function (V, O, B, z, N, G, H, W) {
          (this.setXYAt(V, O, "v", H, W),
            this.setXYAt(B, z, "o", H, W),
            this.setXYAt(N, G, "i", H, W));
        }),
        (ShapePath.prototype.reverse = function () {
          var V = new ShapePath();
          V.setPathData(this.c, this._length);
          var O = this.v,
            B = this.o,
            z = this.i,
            N = 0;
          this.c &&
            (V.setTripleAt(
              O[0][0],
              O[0][1],
              z[0][0],
              z[0][1],
              B[0][0],
              B[0][1],
              0,
              !1,
            ),
            (N = 1));
          var G = this._length - 1,
            H = this._length,
            W;
          for (W = N; W < H; W += 1)
            (V.setTripleAt(
              O[G][0],
              O[G][1],
              z[G][0],
              z[G][1],
              B[G][0],
              B[G][1],
              W,
              !1,
            ),
              (G -= 1));
          return V;
        }),
        (ShapePath.prototype.length = function () {
          return this._length;
        }));
      var shapePool = (function () {
        function V() {
          return new ShapePath();
        }
        function O(N) {
          var G = N._length,
            H;
          for (H = 0; H < G; H += 1)
            (pointPool.release(N.v[H]),
              pointPool.release(N.i[H]),
              pointPool.release(N.o[H]),
              (N.v[H] = null),
              (N.i[H] = null),
              (N.o[H] = null));
          ((N._length = 0), (N.c = !1));
        }
        function B(N) {
          var G = z.newElement(),
            H,
            W = N._length === void 0 ? N.v.length : N._length;
          for (G.setLength(W), G.c = N.c, H = 0; H < W; H += 1)
            G.setTripleAt(
              N.v[H][0],
              N.v[H][1],
              N.o[H][0],
              N.o[H][1],
              N.i[H][0],
              N.i[H][1],
              H,
            );
          return G;
        }
        var z = poolFactory(4, V, O);
        return ((z.clone = B), z);
      })();
      function ShapeCollection() {
        ((this._length = 0),
          (this._maxLength = 4),
          (this.shapes = createSizedArray(this._maxLength)));
      }
      ((ShapeCollection.prototype.addShape = function (V) {
        (this._length === this._maxLength &&
          ((this.shapes = this.shapes.concat(
            createSizedArray(this._maxLength),
          )),
          (this._maxLength *= 2)),
          (this.shapes[this._length] = V),
          (this._length += 1));
      }),
        (ShapeCollection.prototype.releaseShapes = function () {
          var V;
          for (V = 0; V < this._length; V += 1)
            shapePool.release(this.shapes[V]);
          this._length = 0;
        }));
      var shapeCollectionPool = (function () {
          var V = { newShapeCollection: N, release: G },
            O = 0,
            B = 4,
            z = createSizedArray(B);
          function N() {
            var H;
            return (
              O ? ((O -= 1), (H = z[O])) : (H = new ShapeCollection()),
              H
            );
          }
          function G(H) {
            var W,
              q = H._length;
            for (W = 0; W < q; W += 1) shapePool.release(H.shapes[W]);
            ((H._length = 0),
              O === B && ((z = pooling.double(z)), (B *= 2)),
              (z[O] = H),
              (O += 1));
          }
          return V;
        })(),
        ShapePropertyFactory = (function () {
          var V = -999999;
          function O(Q, te, J) {
            var ee = J.lastIndex,
              ne,
              oe,
              he,
              ce,
              ue,
              ge,
              ye,
              me,
              be,
              Se = this.keyframes;
            if (Q < Se[0].t - this.offsetTime)
              ((ne = Se[0].s[0]), (he = !0), (ee = 0));
            else if (Q >= Se[Se.length - 1].t - this.offsetTime)
              ((ne = Se[Se.length - 1].s
                ? Se[Se.length - 1].s[0]
                : Se[Se.length - 2].e[0]),
                (he = !0));
            else {
              for (
                var _e = ee, le = Se.length - 1, pe = !0, ie, ae, fe;
                pe &&
                ((ie = Se[_e]),
                (ae = Se[_e + 1]),
                !(ae.t - this.offsetTime > Q));
              )
                _e < le - 1 ? (_e += 1) : (pe = !1);
              if (
                ((fe = this.keyframesMetadata[_e] || {}),
                (he = ie.h === 1),
                (ee = _e),
                !he)
              ) {
                if (Q >= ae.t - this.offsetTime) me = 1;
                else if (Q < ie.t - this.offsetTime) me = 0;
                else {
                  var de;
                  (fe.__fnct
                    ? (de = fe.__fnct)
                    : ((de = BezierFactory.getBezierEasing(
                        ie.o.x,
                        ie.o.y,
                        ie.i.x,
                        ie.i.y,
                      ).get),
                      (fe.__fnct = de)),
                    (me = de(
                      (Q - (ie.t - this.offsetTime)) /
                        (ae.t - this.offsetTime - (ie.t - this.offsetTime)),
                    )));
                }
                oe = ae.s ? ae.s[0] : ie.e[0];
              }
              ne = ie.s[0];
            }
            for (
              ge = te._length, ye = ne.i[0].length, J.lastIndex = ee, ce = 0;
              ce < ge;
              ce += 1
            )
              for (ue = 0; ue < ye; ue += 1)
                ((be = he
                  ? ne.i[ce][ue]
                  : ne.i[ce][ue] + (oe.i[ce][ue] - ne.i[ce][ue]) * me),
                  (te.i[ce][ue] = be),
                  (be = he
                    ? ne.o[ce][ue]
                    : ne.o[ce][ue] + (oe.o[ce][ue] - ne.o[ce][ue]) * me),
                  (te.o[ce][ue] = be),
                  (be = he
                    ? ne.v[ce][ue]
                    : ne.v[ce][ue] + (oe.v[ce][ue] - ne.v[ce][ue]) * me),
                  (te.v[ce][ue] = be));
          }
          function B() {
            var Q = this.comp.renderedFrame - this.offsetTime,
              te = this.keyframes[0].t - this.offsetTime,
              J = this.keyframes[this.keyframes.length - 1].t - this.offsetTime,
              ee = this._caching.lastFrame;
            return (
              (ee !== V && ((ee < te && Q < te) || (ee > J && Q > J))) ||
                ((this._caching.lastIndex =
                  ee < Q ? this._caching.lastIndex : 0),
                this.interpolateShape(Q, this.pv, this._caching)),
              (this._caching.lastFrame = Q),
              this.pv
            );
          }
          function z() {
            this.paths = this.localShapeCollection;
          }
          function N(Q, te) {
            if (Q._length !== te._length || Q.c !== te.c) return !1;
            var J,
              ee = Q._length;
            for (J = 0; J < ee; J += 1)
              if (
                Q.v[J][0] !== te.v[J][0] ||
                Q.v[J][1] !== te.v[J][1] ||
                Q.o[J][0] !== te.o[J][0] ||
                Q.o[J][1] !== te.o[J][1] ||
                Q.i[J][0] !== te.i[J][0] ||
                Q.i[J][1] !== te.i[J][1]
              )
                return !1;
            return !0;
          }
          function G(Q) {
            N(this.v, Q) ||
              ((this.v = shapePool.clone(Q)),
              this.localShapeCollection.releaseShapes(),
              this.localShapeCollection.addShape(this.v),
              (this._mdf = !0),
              (this.paths = this.localShapeCollection));
          }
          function H() {
            if (this.elem.globalData.frameId !== this.frameId) {
              if (!this.effectsSequence.length) {
                this._mdf = !1;
                return;
              }
              if (this.lock) {
                this.setVValue(this.pv);
                return;
              }
              ((this.lock = !0), (this._mdf = !1));
              var Q;
              this.kf
                ? (Q = this.pv)
                : this.data.ks
                  ? (Q = this.data.ks.k)
                  : (Q = this.data.pt.k);
              var te,
                J = this.effectsSequence.length;
              for (te = 0; te < J; te += 1) Q = this.effectsSequence[te](Q);
              (this.setVValue(Q),
                (this.lock = !1),
                (this.frameId = this.elem.globalData.frameId));
            }
          }
          function W(Q, te, J) {
            ((this.propType = "shape"),
              (this.comp = Q.comp),
              (this.container = Q),
              (this.elem = Q),
              (this.data = te),
              (this.k = !1),
              (this.kf = !1),
              (this._mdf = !1));
            var ee = J === 3 ? te.pt.k : te.ks.k;
            ((this.v = shapePool.clone(ee)),
              (this.pv = shapePool.clone(this.v)),
              (this.localShapeCollection =
                shapeCollectionPool.newShapeCollection()),
              (this.paths = this.localShapeCollection),
              this.paths.addShape(this.v),
              (this.reset = z),
              (this.effectsSequence = []));
          }
          function q(Q) {
            (this.effectsSequence.push(Q),
              this.container.addDynamicProperty(this));
          }
          ((W.prototype.interpolateShape = O),
            (W.prototype.getValue = H),
            (W.prototype.setVValue = G),
            (W.prototype.addEffect = q));
          function j(Q, te, J) {
            ((this.propType = "shape"),
              (this.comp = Q.comp),
              (this.elem = Q),
              (this.container = Q),
              (this.offsetTime = Q.data.st),
              (this.keyframes = J === 3 ? te.pt.k : te.ks.k),
              (this.keyframesMetadata = []),
              (this.k = !0),
              (this.kf = !0));
            var ee = this.keyframes[0].s[0].i.length;
            ((this.v = shapePool.newElement()),
              this.v.setPathData(this.keyframes[0].s[0].c, ee),
              (this.pv = shapePool.clone(this.v)),
              (this.localShapeCollection =
                shapeCollectionPool.newShapeCollection()),
              (this.paths = this.localShapeCollection),
              this.paths.addShape(this.v),
              (this.lastFrame = V),
              (this.reset = z),
              (this._caching = { lastFrame: V, lastIndex: 0 }),
              (this.effectsSequence = [B.bind(this)]));
          }
          ((j.prototype.getValue = H),
            (j.prototype.interpolateShape = O),
            (j.prototype.setVValue = G),
            (j.prototype.addEffect = q));
          var Y = (function () {
              var Q = roundCorner;
              function te(J, ee) {
                ((this.v = shapePool.newElement()),
                  this.v.setPathData(!0, 4),
                  (this.localShapeCollection =
                    shapeCollectionPool.newShapeCollection()),
                  (this.paths = this.localShapeCollection),
                  this.localShapeCollection.addShape(this.v),
                  (this.d = ee.d),
                  (this.elem = J),
                  (this.comp = J.comp),
                  (this.frameId = -1),
                  this.initDynamicPropertyContainer(J),
                  (this.p = PropertyFactory.getProp(J, ee.p, 1, 0, this)),
                  (this.s = PropertyFactory.getProp(J, ee.s, 1, 0, this)),
                  this.dynamicProperties.length
                    ? (this.k = !0)
                    : ((this.k = !1), this.convertEllToPath()));
              }
              return (
                (te.prototype = {
                  reset: z,
                  getValue: function () {
                    this.elem.globalData.frameId !== this.frameId &&
                      ((this.frameId = this.elem.globalData.frameId),
                      this.iterateDynamicProperties(),
                      this._mdf && this.convertEllToPath());
                  },
                  convertEllToPath: function () {
                    var ee = this.p.v[0],
                      ne = this.p.v[1],
                      oe = this.s.v[0] / 2,
                      he = this.s.v[1] / 2,
                      ce = this.d !== 3,
                      ue = this.v;
                    ((ue.v[0][0] = ee),
                      (ue.v[0][1] = ne - he),
                      (ue.v[1][0] = ce ? ee + oe : ee - oe),
                      (ue.v[1][1] = ne),
                      (ue.v[2][0] = ee),
                      (ue.v[2][1] = ne + he),
                      (ue.v[3][0] = ce ? ee - oe : ee + oe),
                      (ue.v[3][1] = ne),
                      (ue.i[0][0] = ce ? ee - oe * Q : ee + oe * Q),
                      (ue.i[0][1] = ne - he),
                      (ue.i[1][0] = ce ? ee + oe : ee - oe),
                      (ue.i[1][1] = ne - he * Q),
                      (ue.i[2][0] = ce ? ee + oe * Q : ee - oe * Q),
                      (ue.i[2][1] = ne + he),
                      (ue.i[3][0] = ce ? ee - oe : ee + oe),
                      (ue.i[3][1] = ne + he * Q),
                      (ue.o[0][0] = ce ? ee + oe * Q : ee - oe * Q),
                      (ue.o[0][1] = ne - he),
                      (ue.o[1][0] = ce ? ee + oe : ee - oe),
                      (ue.o[1][1] = ne + he * Q),
                      (ue.o[2][0] = ce ? ee - oe * Q : ee + oe * Q),
                      (ue.o[2][1] = ne + he),
                      (ue.o[3][0] = ce ? ee - oe : ee + oe),
                      (ue.o[3][1] = ne - he * Q));
                  },
                }),
                extendPrototype([DynamicPropertyContainer], te),
                te
              );
            })(),
            re = (function () {
              function Q(te, J) {
                ((this.v = shapePool.newElement()),
                  this.v.setPathData(!0, 0),
                  (this.elem = te),
                  (this.comp = te.comp),
                  (this.data = J),
                  (this.frameId = -1),
                  (this.d = J.d),
                  this.initDynamicPropertyContainer(te),
                  J.sy === 1
                    ? ((this.ir = PropertyFactory.getProp(
                        te,
                        J.ir,
                        0,
                        0,
                        this,
                      )),
                      (this.is = PropertyFactory.getProp(
                        te,
                        J.is,
                        0,
                        0.01,
                        this,
                      )),
                      (this.convertToPath = this.convertStarToPath))
                    : (this.convertToPath = this.convertPolygonToPath),
                  (this.pt = PropertyFactory.getProp(te, J.pt, 0, 0, this)),
                  (this.p = PropertyFactory.getProp(te, J.p, 1, 0, this)),
                  (this.r = PropertyFactory.getProp(
                    te,
                    J.r,
                    0,
                    degToRads,
                    this,
                  )),
                  (this.or = PropertyFactory.getProp(te, J.or, 0, 0, this)),
                  (this.os = PropertyFactory.getProp(te, J.os, 0, 0.01, this)),
                  (this.localShapeCollection =
                    shapeCollectionPool.newShapeCollection()),
                  this.localShapeCollection.addShape(this.v),
                  (this.paths = this.localShapeCollection),
                  this.dynamicProperties.length
                    ? (this.k = !0)
                    : ((this.k = !1), this.convertToPath()));
              }
              return (
                (Q.prototype = {
                  reset: z,
                  getValue: function () {
                    this.elem.globalData.frameId !== this.frameId &&
                      ((this.frameId = this.elem.globalData.frameId),
                      this.iterateDynamicProperties(),
                      this._mdf && this.convertToPath());
                  },
                  convertStarToPath: function () {
                    var J = Math.floor(this.pt.v) * 2,
                      ee = (Math.PI * 2) / J,
                      ne = !0,
                      oe = this.or.v,
                      he = this.ir.v,
                      ce = this.os.v,
                      ue = this.is.v,
                      ge = (2 * Math.PI * oe) / (J * 2),
                      ye = (2 * Math.PI * he) / (J * 2),
                      me,
                      be,
                      Se,
                      _e,
                      le = -Math.PI / 2;
                    le += this.r.v;
                    var pe = this.data.d === 3 ? -1 : 1;
                    for (this.v._length = 0, me = 0; me < J; me += 1) {
                      ((be = ne ? oe : he),
                        (Se = ne ? ce : ue),
                        (_e = ne ? ge : ye));
                      var ie = be * Math.cos(le),
                        ae = be * Math.sin(le),
                        fe =
                          ie === 0 && ae === 0
                            ? 0
                            : ae / Math.sqrt(ie * ie + ae * ae),
                        de =
                          ie === 0 && ae === 0
                            ? 0
                            : -ie / Math.sqrt(ie * ie + ae * ae);
                      ((ie += +this.p.v[0]),
                        (ae += +this.p.v[1]),
                        this.v.setTripleAt(
                          ie,
                          ae,
                          ie - fe * _e * Se * pe,
                          ae - de * _e * Se * pe,
                          ie + fe * _e * Se * pe,
                          ae + de * _e * Se * pe,
                          me,
                          !0,
                        ),
                        (ne = !ne),
                        (le += ee * pe));
                    }
                  },
                  convertPolygonToPath: function () {
                    var J = Math.floor(this.pt.v),
                      ee = (Math.PI * 2) / J,
                      ne = this.or.v,
                      oe = this.os.v,
                      he = (2 * Math.PI * ne) / (J * 4),
                      ce,
                      ue = -Math.PI * 0.5,
                      ge = this.data.d === 3 ? -1 : 1;
                    for (
                      ue += this.r.v, this.v._length = 0, ce = 0;
                      ce < J;
                      ce += 1
                    ) {
                      var ye = ne * Math.cos(ue),
                        me = ne * Math.sin(ue),
                        be =
                          ye === 0 && me === 0
                            ? 0
                            : me / Math.sqrt(ye * ye + me * me),
                        Se =
                          ye === 0 && me === 0
                            ? 0
                            : -ye / Math.sqrt(ye * ye + me * me);
                      ((ye += +this.p.v[0]),
                        (me += +this.p.v[1]),
                        this.v.setTripleAt(
                          ye,
                          me,
                          ye - be * he * oe * ge,
                          me - Se * he * oe * ge,
                          ye + be * he * oe * ge,
                          me + Se * he * oe * ge,
                          ce,
                          !0,
                        ),
                        (ue += ee * ge));
                    }
                    ((this.paths.length = 0), (this.paths[0] = this.v));
                  },
                }),
                extendPrototype([DynamicPropertyContainer], Q),
                Q
              );
            })(),
            U = (function () {
              function Q(te, J) {
                ((this.v = shapePool.newElement()),
                  (this.v.c = !0),
                  (this.localShapeCollection =
                    shapeCollectionPool.newShapeCollection()),
                  this.localShapeCollection.addShape(this.v),
                  (this.paths = this.localShapeCollection),
                  (this.elem = te),
                  (this.comp = te.comp),
                  (this.frameId = -1),
                  (this.d = J.d),
                  this.initDynamicPropertyContainer(te),
                  (this.p = PropertyFactory.getProp(te, J.p, 1, 0, this)),
                  (this.s = PropertyFactory.getProp(te, J.s, 1, 0, this)),
                  (this.r = PropertyFactory.getProp(te, J.r, 0, 0, this)),
                  this.dynamicProperties.length
                    ? (this.k = !0)
                    : ((this.k = !1), this.convertRectToPath()));
              }
              return (
                (Q.prototype = {
                  convertRectToPath: function () {
                    var J = this.p.v[0],
                      ee = this.p.v[1],
                      ne = this.s.v[0] / 2,
                      oe = this.s.v[1] / 2,
                      he = bmMin(ne, oe, this.r.v),
                      ce = he * (1 - roundCorner);
                    ((this.v._length = 0),
                      this.d === 2 || this.d === 1
                        ? (this.v.setTripleAt(
                            J + ne,
                            ee - oe + he,
                            J + ne,
                            ee - oe + he,
                            J + ne,
                            ee - oe + ce,
                            0,
                            !0,
                          ),
                          this.v.setTripleAt(
                            J + ne,
                            ee + oe - he,
                            J + ne,
                            ee + oe - ce,
                            J + ne,
                            ee + oe - he,
                            1,
                            !0,
                          ),
                          he !== 0
                            ? (this.v.setTripleAt(
                                J + ne - he,
                                ee + oe,
                                J + ne - he,
                                ee + oe,
                                J + ne - ce,
                                ee + oe,
                                2,
                                !0,
                              ),
                              this.v.setTripleAt(
                                J - ne + he,
                                ee + oe,
                                J - ne + ce,
                                ee + oe,
                                J - ne + he,
                                ee + oe,
                                3,
                                !0,
                              ),
                              this.v.setTripleAt(
                                J - ne,
                                ee + oe - he,
                                J - ne,
                                ee + oe - he,
                                J - ne,
                                ee + oe - ce,
                                4,
                                !0,
                              ),
                              this.v.setTripleAt(
                                J - ne,
                                ee - oe + he,
                                J - ne,
                                ee - oe + ce,
                                J - ne,
                                ee - oe + he,
                                5,
                                !0,
                              ),
                              this.v.setTripleAt(
                                J - ne + he,
                                ee - oe,
                                J - ne + he,
                                ee - oe,
                                J - ne + ce,
                                ee - oe,
                                6,
                                !0,
                              ),
                              this.v.setTripleAt(
                                J + ne - he,
                                ee - oe,
                                J + ne - ce,
                                ee - oe,
                                J + ne - he,
                                ee - oe,
                                7,
                                !0,
                              ))
                            : (this.v.setTripleAt(
                                J - ne,
                                ee + oe,
                                J - ne + ce,
                                ee + oe,
                                J - ne,
                                ee + oe,
                                2,
                              ),
                              this.v.setTripleAt(
                                J - ne,
                                ee - oe,
                                J - ne,
                                ee - oe + ce,
                                J - ne,
                                ee - oe,
                                3,
                              )))
                        : (this.v.setTripleAt(
                            J + ne,
                            ee - oe + he,
                            J + ne,
                            ee - oe + ce,
                            J + ne,
                            ee - oe + he,
                            0,
                            !0,
                          ),
                          he !== 0
                            ? (this.v.setTripleAt(
                                J + ne - he,
                                ee - oe,
                                J + ne - he,
                                ee - oe,
                                J + ne - ce,
                                ee - oe,
                                1,
                                !0,
                              ),
                              this.v.setTripleAt(
                                J - ne + he,
                                ee - oe,
                                J - ne + ce,
                                ee - oe,
                                J - ne + he,
                                ee - oe,
                                2,
                                !0,
                              ),
                              this.v.setTripleAt(
                                J - ne,
                                ee - oe + he,
                                J - ne,
                                ee - oe + he,
                                J - ne,
                                ee - oe + ce,
                                3,
                                !0,
                              ),
                              this.v.setTripleAt(
                                J - ne,
                                ee + oe - he,
                                J - ne,
                                ee + oe - ce,
                                J - ne,
                                ee + oe - he,
                                4,
                                !0,
                              ),
                              this.v.setTripleAt(
                                J - ne + he,
                                ee + oe,
                                J - ne + he,
                                ee + oe,
                                J - ne + ce,
                                ee + oe,
                                5,
                                !0,
                              ),
                              this.v.setTripleAt(
                                J + ne - he,
                                ee + oe,
                                J + ne - ce,
                                ee + oe,
                                J + ne - he,
                                ee + oe,
                                6,
                                !0,
                              ),
                              this.v.setTripleAt(
                                J + ne,
                                ee + oe - he,
                                J + ne,
                                ee + oe - he,
                                J + ne,
                                ee + oe - ce,
                                7,
                                !0,
                              ))
                            : (this.v.setTripleAt(
                                J - ne,
                                ee - oe,
                                J - ne + ce,
                                ee - oe,
                                J - ne,
                                ee - oe,
                                1,
                                !0,
                              ),
                              this.v.setTripleAt(
                                J - ne,
                                ee + oe,
                                J - ne,
                                ee + oe - ce,
                                J - ne,
                                ee + oe,
                                2,
                                !0,
                              ),
                              this.v.setTripleAt(
                                J + ne,
                                ee + oe,
                                J + ne - ce,
                                ee + oe,
                                J + ne,
                                ee + oe,
                                3,
                                !0,
                              ))));
                  },
                  getValue: function () {
                    this.elem.globalData.frameId !== this.frameId &&
                      ((this.frameId = this.elem.globalData.frameId),
                      this.iterateDynamicProperties(),
                      this._mdf && this.convertRectToPath());
                  },
                  reset: z,
                }),
                extendPrototype([DynamicPropertyContainer], Q),
                Q
              );
            })();
          function K(Q, te, J) {
            var ee;
            if (J === 3 || J === 4) {
              var ne = J === 3 ? te.pt : te.ks,
                oe = ne.k;
              oe.length ? (ee = new j(Q, te, J)) : (ee = new W(Q, te, J));
            } else
              J === 5
                ? (ee = new U(Q, te))
                : J === 6
                  ? (ee = new Y(Q, te))
                  : J === 7 && (ee = new re(Q, te));
            return (ee.k && Q.addDynamicProperty(ee), ee);
          }
          function Z() {
            return W;
          }
          function X() {
            return j;
          }
          var se = {};
          return (
            (se.getShapeProp = K),
            (se.getConstructorFunction = Z),
            (se.getKeyframedConstructorFunction = X),
            se
          );
        })();
      /*!
 Transformation Matrix v2.0
 (c) Epistemex 2014-2015
 www.epistemex.com
 By Ken Fyrstenberg
 Contributions by leeoniya.
 License: MIT, header required.
 */ var Matrix = (function () {
        var V = Math.cos,
          O = Math.sin,
          B = Math.tan,
          z = Math.round;
        function N() {
          return (
            (this.props[0] = 1),
            (this.props[1] = 0),
            (this.props[2] = 0),
            (this.props[3] = 0),
            (this.props[4] = 0),
            (this.props[5] = 1),
            (this.props[6] = 0),
            (this.props[7] = 0),
            (this.props[8] = 0),
            (this.props[9] = 0),
            (this.props[10] = 1),
            (this.props[11] = 0),
            (this.props[12] = 0),
            (this.props[13] = 0),
            (this.props[14] = 0),
            (this.props[15] = 1),
            this
          );
        }
        function G(ie) {
          if (ie === 0) return this;
          var ae = V(ie),
            fe = O(ie);
          return this._t(ae, -fe, 0, 0, fe, ae, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function H(ie) {
          if (ie === 0) return this;
          var ae = V(ie),
            fe = O(ie);
          return this._t(1, 0, 0, 0, 0, ae, -fe, 0, 0, fe, ae, 0, 0, 0, 0, 1);
        }
        function W(ie) {
          if (ie === 0) return this;
          var ae = V(ie),
            fe = O(ie);
          return this._t(ae, 0, fe, 0, 0, 1, 0, 0, -fe, 0, ae, 0, 0, 0, 0, 1);
        }
        function q(ie) {
          if (ie === 0) return this;
          var ae = V(ie),
            fe = O(ie);
          return this._t(ae, -fe, 0, 0, fe, ae, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function j(ie, ae) {
          return this._t(1, ae, ie, 1, 0, 0);
        }
        function Y(ie, ae) {
          return this.shear(B(ie), B(ae));
        }
        function re(ie, ae) {
          var fe = V(ae),
            de = O(ae);
          return this._t(fe, de, 0, 0, -de, fe, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
            ._t(1, 0, 0, 0, B(ie), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
            ._t(fe, -de, 0, 0, de, fe, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function U(ie, ae, fe) {
          return (
            !fe && fe !== 0 && (fe = 1),
            ie === 1 && ae === 1 && fe === 1
              ? this
              : this._t(ie, 0, 0, 0, 0, ae, 0, 0, 0, 0, fe, 0, 0, 0, 0, 1)
          );
        }
        function K(
          ie,
          ae,
          fe,
          de,
          xe,
          we,
          Ee,
          Me,
          Ie,
          Oe,
          Ge,
          We,
          Ze,
          ze,
          Ye,
          Ae,
        ) {
          return (
            (this.props[0] = ie),
            (this.props[1] = ae),
            (this.props[2] = fe),
            (this.props[3] = de),
            (this.props[4] = xe),
            (this.props[5] = we),
            (this.props[6] = Ee),
            (this.props[7] = Me),
            (this.props[8] = Ie),
            (this.props[9] = Oe),
            (this.props[10] = Ge),
            (this.props[11] = We),
            (this.props[12] = Ze),
            (this.props[13] = ze),
            (this.props[14] = Ye),
            (this.props[15] = Ae),
            this
          );
        }
        function Z(ie, ae, fe) {
          return (
            (fe = fe || 0),
            ie !== 0 || ae !== 0 || fe !== 0
              ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ie, ae, fe, 1)
              : this
          );
        }
        function X(
          ie,
          ae,
          fe,
          de,
          xe,
          we,
          Ee,
          Me,
          Ie,
          Oe,
          Ge,
          We,
          Ze,
          ze,
          Ye,
          Ae,
        ) {
          var Pe = this.props;
          if (
            ie === 1 &&
            ae === 0 &&
            fe === 0 &&
            de === 0 &&
            xe === 0 &&
            we === 1 &&
            Ee === 0 &&
            Me === 0 &&
            Ie === 0 &&
            Oe === 0 &&
            Ge === 1 &&
            We === 0
          )
            return (
              (Pe[12] = Pe[12] * ie + Pe[15] * Ze),
              (Pe[13] = Pe[13] * we + Pe[15] * ze),
              (Pe[14] = Pe[14] * Ge + Pe[15] * Ye),
              (Pe[15] *= Ae),
              (this._identityCalculated = !1),
              this
            );
          var Ue = Pe[0],
            Qe = Pe[1],
            ve = Pe[2],
            Xe = Pe[3],
            st = Pe[4],
            at = Pe[5],
            Be = Pe[6],
            ht = Pe[7],
            ut = Pe[8],
            ot = Pe[9],
            qe = Pe[10],
            rt = Pe[11],
            He = Pe[12],
            dt = Pe[13],
            ft = Pe[14],
            vt = Pe[15];
          return (
            (Pe[0] = Ue * ie + Qe * xe + ve * Ie + Xe * Ze),
            (Pe[1] = Ue * ae + Qe * we + ve * Oe + Xe * ze),
            (Pe[2] = Ue * fe + Qe * Ee + ve * Ge + Xe * Ye),
            (Pe[3] = Ue * de + Qe * Me + ve * We + Xe * Ae),
            (Pe[4] = st * ie + at * xe + Be * Ie + ht * Ze),
            (Pe[5] = st * ae + at * we + Be * Oe + ht * ze),
            (Pe[6] = st * fe + at * Ee + Be * Ge + ht * Ye),
            (Pe[7] = st * de + at * Me + Be * We + ht * Ae),
            (Pe[8] = ut * ie + ot * xe + qe * Ie + rt * Ze),
            (Pe[9] = ut * ae + ot * we + qe * Oe + rt * ze),
            (Pe[10] = ut * fe + ot * Ee + qe * Ge + rt * Ye),
            (Pe[11] = ut * de + ot * Me + qe * We + rt * Ae),
            (Pe[12] = He * ie + dt * xe + ft * Ie + vt * Ze),
            (Pe[13] = He * ae + dt * we + ft * Oe + vt * ze),
            (Pe[14] = He * fe + dt * Ee + ft * Ge + vt * Ye),
            (Pe[15] = He * de + dt * Me + ft * We + vt * Ae),
            (this._identityCalculated = !1),
            this
          );
        }
        function se(ie) {
          var ae = ie.props;
          return this.transform(
            ae[0],
            ae[1],
            ae[2],
            ae[3],
            ae[4],
            ae[5],
            ae[6],
            ae[7],
            ae[8],
            ae[9],
            ae[10],
            ae[11],
            ae[12],
            ae[13],
            ae[14],
            ae[15],
          );
        }
        function Q() {
          return (
            this._identityCalculated ||
              ((this._identity = !(
                this.props[0] !== 1 ||
                this.props[1] !== 0 ||
                this.props[2] !== 0 ||
                this.props[3] !== 0 ||
                this.props[4] !== 0 ||
                this.props[5] !== 1 ||
                this.props[6] !== 0 ||
                this.props[7] !== 0 ||
                this.props[8] !== 0 ||
                this.props[9] !== 0 ||
                this.props[10] !== 1 ||
                this.props[11] !== 0 ||
                this.props[12] !== 0 ||
                this.props[13] !== 0 ||
                this.props[14] !== 0 ||
                this.props[15] !== 1
              )),
              (this._identityCalculated = !0)),
            this._identity
          );
        }
        function te(ie) {
          for (var ae = 0; ae < 16; ) {
            if (ie.props[ae] !== this.props[ae]) return !1;
            ae += 1;
          }
          return !0;
        }
        function J(ie) {
          var ae;
          for (ae = 0; ae < 16; ae += 1) ie.props[ae] = this.props[ae];
          return ie;
        }
        function ee(ie) {
          var ae;
          for (ae = 0; ae < 16; ae += 1) this.props[ae] = ie[ae];
        }
        function ne(ie, ae, fe) {
          return {
            x:
              ie * this.props[0] +
              ae * this.props[4] +
              fe * this.props[8] +
              this.props[12],
            y:
              ie * this.props[1] +
              ae * this.props[5] +
              fe * this.props[9] +
              this.props[13],
            z:
              ie * this.props[2] +
              ae * this.props[6] +
              fe * this.props[10] +
              this.props[14],
          };
        }
        function oe(ie, ae, fe) {
          return (
            ie * this.props[0] +
            ae * this.props[4] +
            fe * this.props[8] +
            this.props[12]
          );
        }
        function he(ie, ae, fe) {
          return (
            ie * this.props[1] +
            ae * this.props[5] +
            fe * this.props[9] +
            this.props[13]
          );
        }
        function ce(ie, ae, fe) {
          return (
            ie * this.props[2] +
            ae * this.props[6] +
            fe * this.props[10] +
            this.props[14]
          );
        }
        function ue() {
          var ie =
              this.props[0] * this.props[5] - this.props[1] * this.props[4],
            ae = this.props[5] / ie,
            fe = -this.props[1] / ie,
            de = -this.props[4] / ie,
            xe = this.props[0] / ie,
            we =
              (this.props[4] * this.props[13] -
                this.props[5] * this.props[12]) /
              ie,
            Ee =
              -(
                this.props[0] * this.props[13] -
                this.props[1] * this.props[12]
              ) / ie,
            Me = new Matrix();
          return (
            (Me.props[0] = ae),
            (Me.props[1] = fe),
            (Me.props[4] = de),
            (Me.props[5] = xe),
            (Me.props[12] = we),
            (Me.props[13] = Ee),
            Me
          );
        }
        function ge(ie) {
          var ae = this.getInverseMatrix();
          return ae.applyToPointArray(ie[0], ie[1], ie[2] || 0);
        }
        function ye(ie) {
          var ae,
            fe = ie.length,
            de = [];
          for (ae = 0; ae < fe; ae += 1) de[ae] = ge(ie[ae]);
          return de;
        }
        function me(ie, ae, fe) {
          var de = createTypedArray("float32", 6);
          if (this.isIdentity())
            ((de[0] = ie[0]),
              (de[1] = ie[1]),
              (de[2] = ae[0]),
              (de[3] = ae[1]),
              (de[4] = fe[0]),
              (de[5] = fe[1]));
          else {
            var xe = this.props[0],
              we = this.props[1],
              Ee = this.props[4],
              Me = this.props[5],
              Ie = this.props[12],
              Oe = this.props[13];
            ((de[0] = ie[0] * xe + ie[1] * Ee + Ie),
              (de[1] = ie[0] * we + ie[1] * Me + Oe),
              (de[2] = ae[0] * xe + ae[1] * Ee + Ie),
              (de[3] = ae[0] * we + ae[1] * Me + Oe),
              (de[4] = fe[0] * xe + fe[1] * Ee + Ie),
              (de[5] = fe[0] * we + fe[1] * Me + Oe));
          }
          return de;
        }
        function be(ie, ae, fe) {
          var de;
          return (
            this.isIdentity()
              ? (de = [ie, ae, fe])
              : (de = [
                  ie * this.props[0] +
                    ae * this.props[4] +
                    fe * this.props[8] +
                    this.props[12],
                  ie * this.props[1] +
                    ae * this.props[5] +
                    fe * this.props[9] +
                    this.props[13],
                  ie * this.props[2] +
                    ae * this.props[6] +
                    fe * this.props[10] +
                    this.props[14],
                ]),
            de
          );
        }
        function Se(ie, ae) {
          if (this.isIdentity()) return ie + "," + ae;
          var fe = this.props;
          return (
            Math.round((ie * fe[0] + ae * fe[4] + fe[12]) * 100) / 100 +
            "," +
            Math.round((ie * fe[1] + ae * fe[5] + fe[13]) * 100) / 100
          );
        }
        function _e() {
          for (
            var ie = 0, ae = this.props, fe = "matrix3d(", de = 1e4;
            ie < 16;
          )
            ((fe += z(ae[ie] * de) / de),
              (fe += ie === 15 ? ")" : ","),
              (ie += 1));
          return fe;
        }
        function le(ie) {
          var ae = 1e4;
          return (ie < 1e-6 && ie > 0) || (ie > -1e-6 && ie < 0)
            ? z(ie * ae) / ae
            : ie;
        }
        function pe() {
          var ie = this.props,
            ae = le(ie[0]),
            fe = le(ie[1]),
            de = le(ie[4]),
            xe = le(ie[5]),
            we = le(ie[12]),
            Ee = le(ie[13]);
          return (
            "matrix(" +
            ae +
            "," +
            fe +
            "," +
            de +
            "," +
            xe +
            "," +
            we +
            "," +
            Ee +
            ")"
          );
        }
        return function () {
          ((this.reset = N),
            (this.rotate = G),
            (this.rotateX = H),
            (this.rotateY = W),
            (this.rotateZ = q),
            (this.skew = Y),
            (this.skewFromAxis = re),
            (this.shear = j),
            (this.scale = U),
            (this.setTransform = K),
            (this.translate = Z),
            (this.transform = X),
            (this.multiply = se),
            (this.applyToPoint = ne),
            (this.applyToX = oe),
            (this.applyToY = he),
            (this.applyToZ = ce),
            (this.applyToPointArray = be),
            (this.applyToTriplePoints = me),
            (this.applyToPointStringified = Se),
            (this.toCSS = _e),
            (this.to2dCSS = pe),
            (this.clone = J),
            (this.cloneFromProps = ee),
            (this.equals = te),
            (this.inversePoints = ye),
            (this.inversePoint = ge),
            (this.getInverseMatrix = ue),
            (this._t = this.transform),
            (this.isIdentity = Q),
            (this._identity = !0),
            (this._identityCalculated = !1),
            (this.props = createTypedArray("float32", 16)),
            this.reset());
        };
      })();
      function _typeof$3(V) {
        "@babel/helpers - typeof";
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof$3 = function (B) {
                return typeof B;
              })
            : (_typeof$3 = function (B) {
                return B &&
                  typeof Symbol == "function" &&
                  B.constructor === Symbol &&
                  B !== Symbol.prototype
                  ? "symbol"
                  : typeof B;
              }),
          _typeof$3(V)
        );
      }
      var lottie = {};
      function setLocation(V) {
        setLocationHref(V);
      }
      function searchAnimations() {
        animationManager.searchAnimations();
      }
      function setSubframeRendering(V) {
        setSubframeEnabled(V);
      }
      function setPrefix(V) {
        setIdPrefix(V);
      }
      function loadAnimation(V) {
        return animationManager.loadAnimation(V);
      }
      function setQuality(V) {
        if (typeof V == "string")
          switch (V) {
            case "high":
              setDefaultCurveSegments(200);
              break;
            default:
            case "medium":
              setDefaultCurveSegments(50);
              break;
            case "low":
              setDefaultCurveSegments(10);
              break;
          }
        else !isNaN(V) && V > 1 && setDefaultCurveSegments(V);
      }
      function inBrowser() {
        return typeof navigator < "u";
      }
      function installPlugin(V, O) {
        V === "expressions" && setExpressionsPlugin(O);
      }
      function getFactory(V) {
        switch (V) {
          case "propertyFactory":
            return PropertyFactory;
          case "shapePropertyFactory":
            return ShapePropertyFactory;
          case "matrix":
            return Matrix;
          default:
            return null;
        }
      }
      ((lottie.play = animationManager.play),
        (lottie.pause = animationManager.pause),
        (lottie.setLocationHref = setLocation),
        (lottie.togglePause = animationManager.togglePause),
        (lottie.setSpeed = animationManager.setSpeed),
        (lottie.setDirection = animationManager.setDirection),
        (lottie.stop = animationManager.stop),
        (lottie.searchAnimations = searchAnimations),
        (lottie.registerAnimation = animationManager.registerAnimation),
        (lottie.loadAnimation = loadAnimation),
        (lottie.setSubframeRendering = setSubframeRendering),
        (lottie.resize = animationManager.resize),
        (lottie.goToAndStop = animationManager.goToAndStop),
        (lottie.destroy = animationManager.destroy),
        (lottie.setQuality = setQuality),
        (lottie.inBrowser = inBrowser),
        (lottie.installPlugin = installPlugin),
        (lottie.freeze = animationManager.freeze),
        (lottie.unfreeze = animationManager.unfreeze),
        (lottie.setVolume = animationManager.setVolume),
        (lottie.mute = animationManager.mute),
        (lottie.unmute = animationManager.unmute),
        (lottie.getRegisteredAnimations =
          animationManager.getRegisteredAnimations),
        (lottie.useWebWorker = setWebWorker),
        (lottie.setIDPrefix = setPrefix),
        (lottie.__getFactory = getFactory),
        (lottie.version = "5.12.2"));
      function checkReady() {
        document.readyState === "complete" &&
          (clearInterval(readyStateCheckInterval), searchAnimations());
      }
      function getQueryVariable(V) {
        for (var O = queryString.split("&"), B = 0; B < O.length; B += 1) {
          var z = O[B].split("=");
          if (decodeURIComponent(z[0]) == V) return decodeURIComponent(z[1]);
        }
        return null;
      }
      var queryString = "";
      {
        var scripts = document.getElementsByTagName("script"),
          index = scripts.length - 1,
          myScript = scripts[index] || { src: "" };
        ((queryString = myScript.src
          ? myScript.src.replace(/^[^\?]+\??/, "")
          : ""),
          getQueryVariable("renderer"));
      }
      var readyStateCheckInterval = setInterval(checkReady, 100);
      try {
        _typeof$3(exports) !== "object" && (window.bodymovin = lottie);
      } catch (V) {}
      var ShapeModifiers = (function () {
        var V = {},
          O = {};
        ((V.registerModifier = B), (V.getModifier = z));
        function B(N, G) {
          O[N] || (O[N] = G);
        }
        function z(N, G, H) {
          return new O[N](G, H);
        }
        return V;
      })();
      function ShapeModifier() {}
      ((ShapeModifier.prototype.initModifierProperties = function () {}),
        (ShapeModifier.prototype.addShapeToModifier = function () {}),
        (ShapeModifier.prototype.addShape = function (V) {
          if (!this.closed) {
            V.sh.container.addDynamicProperty(V.sh);
            var O = {
              shape: V.sh,
              data: V,
              localShapeCollection: shapeCollectionPool.newShapeCollection(),
            };
            (this.shapes.push(O),
              this.addShapeToModifier(O),
              this._isAnimated && V.setAsAnimated());
          }
        }),
        (ShapeModifier.prototype.init = function (V, O) {
          ((this.shapes = []),
            (this.elem = V),
            this.initDynamicPropertyContainer(V),
            this.initModifierProperties(V, O),
            (this.frameId = initialDefaultFrame),
            (this.closed = !1),
            (this.k = !1),
            this.dynamicProperties.length ? (this.k = !0) : this.getValue(!0));
        }),
        (ShapeModifier.prototype.processKeys = function () {
          this.elem.globalData.frameId !== this.frameId &&
            ((this.frameId = this.elem.globalData.frameId),
            this.iterateDynamicProperties());
        }),
        extendPrototype([DynamicPropertyContainer], ShapeModifier));
      function TrimModifier() {}
      (extendPrototype([ShapeModifier], TrimModifier),
        (TrimModifier.prototype.initModifierProperties = function (V, O) {
          ((this.s = PropertyFactory.getProp(V, O.s, 0, 0.01, this)),
            (this.e = PropertyFactory.getProp(V, O.e, 0, 0.01, this)),
            (this.o = PropertyFactory.getProp(V, O.o, 0, 0, this)),
            (this.sValue = 0),
            (this.eValue = 0),
            (this.getValue = this.processKeys),
            (this.m = O.m),
            (this._isAnimated =
              !!this.s.effectsSequence.length ||
              !!this.e.effectsSequence.length ||
              !!this.o.effectsSequence.length));
        }),
        (TrimModifier.prototype.addShapeToModifier = function (V) {
          V.pathsData = [];
        }),
        (TrimModifier.prototype.calculateShapeEdges = function (V, O, B, z, N) {
          var G = [];
          O <= 1
            ? G.push({ s: V, e: O })
            : V >= 1
              ? G.push({ s: V - 1, e: O - 1 })
              : (G.push({ s: V, e: 1 }), G.push({ s: 0, e: O - 1 }));
          var H = [],
            W,
            q = G.length,
            j;
          for (W = 0; W < q; W += 1)
            if (((j = G[W]), !(j.e * N < z || j.s * N > z + B))) {
              var Y, re;
              (j.s * N <= z ? (Y = 0) : (Y = (j.s * N - z) / B),
                j.e * N >= z + B ? (re = 1) : (re = (j.e * N - z) / B),
                H.push([Y, re]));
            }
          return (H.length || H.push([0, 0]), H);
        }),
        (TrimModifier.prototype.releasePathsData = function (V) {
          var O,
            B = V.length;
          for (O = 0; O < B; O += 1) segmentsLengthPool.release(V[O]);
          return ((V.length = 0), V);
        }),
        (TrimModifier.prototype.processShapes = function (V) {
          var O, B;
          if (this._mdf || V) {
            var z = (this.o.v % 360) / 360;
            if (
              (z < 0 && (z += 1),
              this.s.v > 1
                ? (O = 1 + z)
                : this.s.v < 0
                  ? (O = 0 + z)
                  : (O = this.s.v + z),
              this.e.v > 1
                ? (B = 1 + z)
                : this.e.v < 0
                  ? (B = 0 + z)
                  : (B = this.e.v + z),
              O > B)
            ) {
              var N = O;
              ((O = B), (B = N));
            }
            ((O = Math.round(O * 1e4) * 1e-4),
              (B = Math.round(B * 1e4) * 1e-4),
              (this.sValue = O),
              (this.eValue = B));
          } else ((O = this.sValue), (B = this.eValue));
          var G,
            H,
            W = this.shapes.length,
            q,
            j,
            Y,
            re,
            U,
            K = 0;
          if (B === O)
            for (H = 0; H < W; H += 1)
              (this.shapes[H].localShapeCollection.releaseShapes(),
                (this.shapes[H].shape._mdf = !0),
                (this.shapes[H].shape.paths =
                  this.shapes[H].localShapeCollection),
                this._mdf && (this.shapes[H].pathsData.length = 0));
          else if ((B === 1 && O === 0) || (B === 0 && O === 1)) {
            if (this._mdf)
              for (H = 0; H < W; H += 1)
                ((this.shapes[H].pathsData.length = 0),
                  (this.shapes[H].shape._mdf = !0));
          } else {
            var Z = [],
              X,
              se;
            for (H = 0; H < W; H += 1)
              if (
                ((X = this.shapes[H]),
                !X.shape._mdf && !this._mdf && !V && this.m !== 2)
              )
                X.shape.paths = X.localShapeCollection;
              else {
                if (
                  ((G = X.shape.paths),
                  (j = G._length),
                  (U = 0),
                  !X.shape._mdf && X.pathsData.length)
                )
                  U = X.totalShapeLength;
                else {
                  for (
                    Y = this.releasePathsData(X.pathsData), q = 0;
                    q < j;
                    q += 1
                  )
                    ((re = bez.getSegmentsLength(G.shapes[q])),
                      Y.push(re),
                      (U += re.totalLength));
                  ((X.totalShapeLength = U), (X.pathsData = Y));
                }
                ((K += U), (X.shape._mdf = !0));
              }
            var Q = O,
              te = B,
              J = 0,
              ee;
            for (H = W - 1; H >= 0; H -= 1)
              if (((X = this.shapes[H]), X.shape._mdf)) {
                for (
                  se = X.localShapeCollection,
                    se.releaseShapes(),
                    this.m === 2 && W > 1
                      ? ((ee = this.calculateShapeEdges(
                          O,
                          B,
                          X.totalShapeLength,
                          J,
                          K,
                        )),
                        (J += X.totalShapeLength))
                      : (ee = [[Q, te]]),
                    j = ee.length,
                    q = 0;
                  q < j;
                  q += 1
                ) {
                  ((Q = ee[q][0]),
                    (te = ee[q][1]),
                    (Z.length = 0),
                    te <= 1
                      ? Z.push({
                          s: X.totalShapeLength * Q,
                          e: X.totalShapeLength * te,
                        })
                      : Q >= 1
                        ? Z.push({
                            s: X.totalShapeLength * (Q - 1),
                            e: X.totalShapeLength * (te - 1),
                          })
                        : (Z.push({
                            s: X.totalShapeLength * Q,
                            e: X.totalShapeLength,
                          }),
                          Z.push({ s: 0, e: X.totalShapeLength * (te - 1) })));
                  var ne = this.addShapes(X, Z[0]);
                  if (Z[0].s !== Z[0].e) {
                    if (Z.length > 1) {
                      var oe = X.shape.paths.shapes[X.shape.paths._length - 1];
                      if (oe.c) {
                        var he = ne.pop();
                        (this.addPaths(ne, se),
                          (ne = this.addShapes(X, Z[1], he)));
                      } else
                        (this.addPaths(ne, se), (ne = this.addShapes(X, Z[1])));
                    }
                    this.addPaths(ne, se);
                  }
                }
                X.shape.paths = se;
              }
          }
        }),
        (TrimModifier.prototype.addPaths = function (V, O) {
          var B,
            z = V.length;
          for (B = 0; B < z; B += 1) O.addShape(V[B]);
        }),
        (TrimModifier.prototype.addSegment = function (V, O, B, z, N, G, H) {
          (N.setXYAt(O[0], O[1], "o", G),
            N.setXYAt(B[0], B[1], "i", G + 1),
            H && N.setXYAt(V[0], V[1], "v", G),
            N.setXYAt(z[0], z[1], "v", G + 1));
        }),
        (TrimModifier.prototype.addSegmentFromArray = function (V, O, B, z) {
          (O.setXYAt(V[1], V[5], "o", B),
            O.setXYAt(V[2], V[6], "i", B + 1),
            z && O.setXYAt(V[0], V[4], "v", B),
            O.setXYAt(V[3], V[7], "v", B + 1));
        }),
        (TrimModifier.prototype.addShapes = function (V, O, B) {
          var z = V.pathsData,
            N = V.shape.paths.shapes,
            G,
            H = V.shape.paths._length,
            W,
            q,
            j = 0,
            Y,
            re,
            U,
            K,
            Z = [],
            X,
            se = !0;
          for (
            B
              ? ((re = B._length), (X = B._length))
              : ((B = shapePool.newElement()), (re = 0), (X = 0)),
              Z.push(B),
              G = 0;
            G < H;
            G += 1
          ) {
            for (
              U = z[G].lengths,
                B.c = N[G].c,
                q = N[G].c ? U.length : U.length + 1,
                W = 1;
              W < q;
              W += 1
            )
              if (((Y = U[W - 1]), j + Y.addedLength < O.s))
                ((j += Y.addedLength), (B.c = !1));
              else if (j > O.e) {
                B.c = !1;
                break;
              } else
                (O.s <= j && O.e >= j + Y.addedLength
                  ? (this.addSegment(
                      N[G].v[W - 1],
                      N[G].o[W - 1],
                      N[G].i[W],
                      N[G].v[W],
                      B,
                      re,
                      se,
                    ),
                    (se = !1))
                  : ((K = bez.getNewSegment(
                      N[G].v[W - 1],
                      N[G].v[W],
                      N[G].o[W - 1],
                      N[G].i[W],
                      (O.s - j) / Y.addedLength,
                      (O.e - j) / Y.addedLength,
                      U[W - 1],
                    )),
                    this.addSegmentFromArray(K, B, re, se),
                    (se = !1),
                    (B.c = !1)),
                  (j += Y.addedLength),
                  (re += 1));
            if (N[G].c && U.length) {
              if (((Y = U[W - 1]), j <= O.e)) {
                var Q = U[W - 1].addedLength;
                O.s <= j && O.e >= j + Q
                  ? (this.addSegment(
                      N[G].v[W - 1],
                      N[G].o[W - 1],
                      N[G].i[0],
                      N[G].v[0],
                      B,
                      re,
                      se,
                    ),
                    (se = !1))
                  : ((K = bez.getNewSegment(
                      N[G].v[W - 1],
                      N[G].v[0],
                      N[G].o[W - 1],
                      N[G].i[0],
                      (O.s - j) / Q,
                      (O.e - j) / Q,
                      U[W - 1],
                    )),
                    this.addSegmentFromArray(K, B, re, se),
                    (se = !1),
                    (B.c = !1));
              } else B.c = !1;
              ((j += Y.addedLength), (re += 1));
            }
            if (
              (B._length &&
                (B.setXYAt(B.v[X][0], B.v[X][1], "i", X),
                B.setXYAt(
                  B.v[B._length - 1][0],
                  B.v[B._length - 1][1],
                  "o",
                  B._length - 1,
                )),
              j > O.e)
            )
              break;
            G < H - 1 &&
              ((B = shapePool.newElement()), (se = !0), Z.push(B), (re = 0));
          }
          return Z;
        }));
      function PuckerAndBloatModifier() {}
      (extendPrototype([ShapeModifier], PuckerAndBloatModifier),
        (PuckerAndBloatModifier.prototype.initModifierProperties = function (
          V,
          O,
        ) {
          ((this.getValue = this.processKeys),
            (this.amount = PropertyFactory.getProp(V, O.a, 0, null, this)),
            (this._isAnimated = !!this.amount.effectsSequence.length));
        }),
        (PuckerAndBloatModifier.prototype.processPath = function (V, O) {
          var B = O / 100,
            z = [0, 0],
            N = V._length,
            G = 0;
          for (G = 0; G < N; G += 1) ((z[0] += V.v[G][0]), (z[1] += V.v[G][1]));
          ((z[0] /= N), (z[1] /= N));
          var H = shapePool.newElement();
          H.c = V.c;
          var W, q, j, Y, re, U;
          for (G = 0; G < N; G += 1)
            ((W = V.v[G][0] + (z[0] - V.v[G][0]) * B),
              (q = V.v[G][1] + (z[1] - V.v[G][1]) * B),
              (j = V.o[G][0] + (z[0] - V.o[G][0]) * -B),
              (Y = V.o[G][1] + (z[1] - V.o[G][1]) * -B),
              (re = V.i[G][0] + (z[0] - V.i[G][0]) * -B),
              (U = V.i[G][1] + (z[1] - V.i[G][1]) * -B),
              H.setTripleAt(W, q, j, Y, re, U, G));
          return H;
        }),
        (PuckerAndBloatModifier.prototype.processShapes = function (V) {
          var O,
            B,
            z = this.shapes.length,
            N,
            G,
            H = this.amount.v;
          if (H !== 0) {
            var W, q;
            for (B = 0; B < z; B += 1) {
              if (
                ((W = this.shapes[B]),
                (q = W.localShapeCollection),
                !(!W.shape._mdf && !this._mdf && !V))
              )
                for (
                  q.releaseShapes(),
                    W.shape._mdf = !0,
                    O = W.shape.paths.shapes,
                    G = W.shape.paths._length,
                    N = 0;
                  N < G;
                  N += 1
                )
                  q.addShape(this.processPath(O[N], H));
              W.shape.paths = W.localShapeCollection;
            }
          }
          this.dynamicProperties.length || (this._mdf = !1);
        }));
      var TransformPropertyFactory = (function () {
        var V = [0, 0];
        function O(q) {
          var j = this._mdf;
          (this.iterateDynamicProperties(),
            (this._mdf = this._mdf || j),
            this.a && q.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
            this.s && q.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
            this.sk && q.skewFromAxis(-this.sk.v, this.sa.v),
            this.r
              ? q.rotate(-this.r.v)
              : q
                  .rotateZ(-this.rz.v)
                  .rotateY(this.ry.v)
                  .rotateX(this.rx.v)
                  .rotateZ(-this.or.v[2])
                  .rotateY(this.or.v[1])
                  .rotateX(this.or.v[0]),
            this.data.p.s
              ? this.data.p.z
                ? q.translate(this.px.v, this.py.v, -this.pz.v)
                : q.translate(this.px.v, this.py.v, 0)
              : q.translate(this.p.v[0], this.p.v[1], -this.p.v[2]));
        }
        function B(q) {
          if (this.elem.globalData.frameId !== this.frameId) {
            if (
              (this._isDirty &&
                (this.precalculateMatrix(), (this._isDirty = !1)),
              this.iterateDynamicProperties(),
              this._mdf || q)
            ) {
              var j;
              if (
                (this.v.cloneFromProps(this.pre.props),
                this.appliedTransformations < 1 &&
                  this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                this.appliedTransformations < 2 &&
                  this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                this.sk &&
                  this.appliedTransformations < 3 &&
                  this.v.skewFromAxis(-this.sk.v, this.sa.v),
                this.r && this.appliedTransformations < 4
                  ? this.v.rotate(-this.r.v)
                  : !this.r &&
                    this.appliedTransformations < 4 &&
                    this.v
                      .rotateZ(-this.rz.v)
                      .rotateY(this.ry.v)
                      .rotateX(this.rx.v)
                      .rotateZ(-this.or.v[2])
                      .rotateY(this.or.v[1])
                      .rotateX(this.or.v[0]),
                this.autoOriented)
              ) {
                var Y, re;
                if (
                  ((j = this.elem.globalData.frameRate),
                  this.p && this.p.keyframes && this.p.getValueAtTime)
                )
                  this.p._caching.lastFrame + this.p.offsetTime <=
                  this.p.keyframes[0].t
                    ? ((Y = this.p.getValueAtTime(
                        (this.p.keyframes[0].t + 0.01) / j,
                        0,
                      )),
                      (re = this.p.getValueAtTime(
                        this.p.keyframes[0].t / j,
                        0,
                      )))
                    : this.p._caching.lastFrame + this.p.offsetTime >=
                        this.p.keyframes[this.p.keyframes.length - 1].t
                      ? ((Y = this.p.getValueAtTime(
                          this.p.keyframes[this.p.keyframes.length - 1].t / j,
                          0,
                        )),
                        (re = this.p.getValueAtTime(
                          (this.p.keyframes[this.p.keyframes.length - 1].t -
                            0.05) /
                            j,
                          0,
                        )))
                      : ((Y = this.p.pv),
                        (re = this.p.getValueAtTime(
                          (this.p._caching.lastFrame +
                            this.p.offsetTime -
                            0.01) /
                            j,
                          this.p.offsetTime,
                        )));
                else if (
                  this.px &&
                  this.px.keyframes &&
                  this.py.keyframes &&
                  this.px.getValueAtTime &&
                  this.py.getValueAtTime
                ) {
                  ((Y = []), (re = []));
                  var U = this.px,
                    K = this.py;
                  U._caching.lastFrame + U.offsetTime <= U.keyframes[0].t
                    ? ((Y[0] = U.getValueAtTime(
                        (U.keyframes[0].t + 0.01) / j,
                        0,
                      )),
                      (Y[1] = K.getValueAtTime(
                        (K.keyframes[0].t + 0.01) / j,
                        0,
                      )),
                      (re[0] = U.getValueAtTime(U.keyframes[0].t / j, 0)),
                      (re[1] = K.getValueAtTime(K.keyframes[0].t / j, 0)))
                    : U._caching.lastFrame + U.offsetTime >=
                        U.keyframes[U.keyframes.length - 1].t
                      ? ((Y[0] = U.getValueAtTime(
                          U.keyframes[U.keyframes.length - 1].t / j,
                          0,
                        )),
                        (Y[1] = K.getValueAtTime(
                          K.keyframes[K.keyframes.length - 1].t / j,
                          0,
                        )),
                        (re[0] = U.getValueAtTime(
                          (U.keyframes[U.keyframes.length - 1].t - 0.01) / j,
                          0,
                        )),
                        (re[1] = K.getValueAtTime(
                          (K.keyframes[K.keyframes.length - 1].t - 0.01) / j,
                          0,
                        )))
                      : ((Y = [U.pv, K.pv]),
                        (re[0] = U.getValueAtTime(
                          (U._caching.lastFrame + U.offsetTime - 0.01) / j,
                          U.offsetTime,
                        )),
                        (re[1] = K.getValueAtTime(
                          (K._caching.lastFrame + K.offsetTime - 0.01) / j,
                          K.offsetTime,
                        )));
                } else ((re = V), (Y = re));
                this.v.rotate(-Math.atan2(Y[1] - re[1], Y[0] - re[0]));
              }
              this.data.p && this.data.p.s
                ? this.data.p.z
                  ? this.v.translate(this.px.v, this.py.v, -this.pz.v)
                  : this.v.translate(this.px.v, this.py.v, 0)
                : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
            }
            this.frameId = this.elem.globalData.frameId;
          }
        }
        function z() {
          if (
            ((this.appliedTransformations = 0),
            this.pre.reset(),
            !this.a.effectsSequence.length)
          )
            (this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
              (this.appliedTransformations = 1));
          else return;
          if (!this.s.effectsSequence.length)
            (this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
              (this.appliedTransformations = 2));
          else return;
          if (this.sk)
            if (
              !this.sk.effectsSequence.length &&
              !this.sa.effectsSequence.length
            )
              (this.pre.skewFromAxis(-this.sk.v, this.sa.v),
                (this.appliedTransformations = 3));
            else return;
          this.r
            ? this.r.effectsSequence.length ||
              (this.pre.rotate(-this.r.v), (this.appliedTransformations = 4))
            : !this.rz.effectsSequence.length &&
              !this.ry.effectsSequence.length &&
              !this.rx.effectsSequence.length &&
              !this.or.effectsSequence.length &&
              (this.pre
                .rotateZ(-this.rz.v)
                .rotateY(this.ry.v)
                .rotateX(this.rx.v)
                .rotateZ(-this.or.v[2])
                .rotateY(this.or.v[1])
                .rotateX(this.or.v[0]),
              (this.appliedTransformations = 4));
        }
        function N() {}
        function G(q) {
          (this._addDynamicProperty(q),
            this.elem.addDynamicProperty(q),
            (this._isDirty = !0));
        }
        function H(q, j, Y) {
          if (
            ((this.elem = q),
            (this.frameId = -1),
            (this.propType = "transform"),
            (this.data = j),
            (this.v = new Matrix()),
            (this.pre = new Matrix()),
            (this.appliedTransformations = 0),
            this.initDynamicPropertyContainer(Y || q),
            j.p && j.p.s
              ? ((this.px = PropertyFactory.getProp(q, j.p.x, 0, 0, this)),
                (this.py = PropertyFactory.getProp(q, j.p.y, 0, 0, this)),
                j.p.z &&
                  (this.pz = PropertyFactory.getProp(q, j.p.z, 0, 0, this)))
              : (this.p = PropertyFactory.getProp(
                  q,
                  j.p || { k: [0, 0, 0] },
                  1,
                  0,
                  this,
                )),
            j.rx)
          ) {
            if (
              ((this.rx = PropertyFactory.getProp(q, j.rx, 0, degToRads, this)),
              (this.ry = PropertyFactory.getProp(q, j.ry, 0, degToRads, this)),
              (this.rz = PropertyFactory.getProp(q, j.rz, 0, degToRads, this)),
              j.or.k[0].ti)
            ) {
              var re,
                U = j.or.k.length;
              for (re = 0; re < U; re += 1)
                ((j.or.k[re].to = null), (j.or.k[re].ti = null));
            }
            ((this.or = PropertyFactory.getProp(q, j.or, 1, degToRads, this)),
              (this.or.sh = !0));
          } else
            this.r = PropertyFactory.getProp(
              q,
              j.r || { k: 0 },
              0,
              degToRads,
              this,
            );
          (j.sk &&
            ((this.sk = PropertyFactory.getProp(q, j.sk, 0, degToRads, this)),
            (this.sa = PropertyFactory.getProp(q, j.sa, 0, degToRads, this))),
            (this.a = PropertyFactory.getProp(
              q,
              j.a || { k: [0, 0, 0] },
              1,
              0,
              this,
            )),
            (this.s = PropertyFactory.getProp(
              q,
              j.s || { k: [100, 100, 100] },
              1,
              0.01,
              this,
            )),
            j.o
              ? (this.o = PropertyFactory.getProp(q, j.o, 0, 0.01, q))
              : (this.o = { _mdf: !1, v: 1 }),
            (this._isDirty = !0),
            this.dynamicProperties.length || this.getValue(!0));
        }
        ((H.prototype = {
          applyToMatrix: O,
          getValue: B,
          precalculateMatrix: z,
          autoOrient: N,
        }),
          extendPrototype([DynamicPropertyContainer], H),
          (H.prototype.addDynamicProperty = G),
          (H.prototype._addDynamicProperty =
            DynamicPropertyContainer.prototype.addDynamicProperty));
        function W(q, j, Y) {
          return new H(q, j, Y);
        }
        return { getTransformProperty: W };
      })();
      function RepeaterModifier() {}
      (extendPrototype([ShapeModifier], RepeaterModifier),
        (RepeaterModifier.prototype.initModifierProperties = function (V, O) {
          ((this.getValue = this.processKeys),
            (this.c = PropertyFactory.getProp(V, O.c, 0, null, this)),
            (this.o = PropertyFactory.getProp(V, O.o, 0, null, this)),
            (this.tr = TransformPropertyFactory.getTransformProperty(
              V,
              O.tr,
              this,
            )),
            (this.so = PropertyFactory.getProp(V, O.tr.so, 0, 0.01, this)),
            (this.eo = PropertyFactory.getProp(V, O.tr.eo, 0, 0.01, this)),
            (this.data = O),
            this.dynamicProperties.length || this.getValue(!0),
            (this._isAnimated = !!this.dynamicProperties.length),
            (this.pMatrix = new Matrix()),
            (this.rMatrix = new Matrix()),
            (this.sMatrix = new Matrix()),
            (this.tMatrix = new Matrix()),
            (this.matrix = new Matrix()));
        }),
        (RepeaterModifier.prototype.applyTransforms = function (
          V,
          O,
          B,
          z,
          N,
          G,
        ) {
          var H = G ? -1 : 1,
            W = z.s.v[0] + (1 - z.s.v[0]) * (1 - N),
            q = z.s.v[1] + (1 - z.s.v[1]) * (1 - N);
          (V.translate(z.p.v[0] * H * N, z.p.v[1] * H * N, z.p.v[2]),
            O.translate(-z.a.v[0], -z.a.v[1], z.a.v[2]),
            O.rotate(-z.r.v * H * N),
            O.translate(z.a.v[0], z.a.v[1], z.a.v[2]),
            B.translate(-z.a.v[0], -z.a.v[1], z.a.v[2]),
            B.scale(G ? 1 / W : W, G ? 1 / q : q),
            B.translate(z.a.v[0], z.a.v[1], z.a.v[2]));
        }),
        (RepeaterModifier.prototype.init = function (V, O, B, z) {
          for (
            this.elem = V,
              this.arr = O,
              this.pos = B,
              this.elemsData = z,
              this._currentCopies = 0,
              this._elements = [],
              this._groups = [],
              this.frameId = -1,
              this.initDynamicPropertyContainer(V),
              this.initModifierProperties(V, O[B]);
            B > 0;
          )
            ((B -= 1), this._elements.unshift(O[B]));
          this.dynamicProperties.length ? (this.k = !0) : this.getValue(!0);
        }),
        (RepeaterModifier.prototype.resetElements = function (V) {
          var O,
            B = V.length;
          for (O = 0; O < B; O += 1)
            ((V[O]._processed = !1),
              V[O].ty === "gr" && this.resetElements(V[O].it));
        }),
        (RepeaterModifier.prototype.cloneElements = function (V) {
          var O = JSON.parse(JSON.stringify(V));
          return (this.resetElements(O), O);
        }),
        (RepeaterModifier.prototype.changeGroupRender = function (V, O) {
          var B,
            z = V.length;
          for (B = 0; B < z; B += 1)
            ((V[B]._render = O),
              V[B].ty === "gr" && this.changeGroupRender(V[B].it, O));
        }),
        (RepeaterModifier.prototype.processShapes = function (V) {
          var O,
            B,
            z,
            N,
            G,
            H = !1;
          if (this._mdf || V) {
            var W = Math.ceil(this.c.v);
            if (this._groups.length < W) {
              for (; this._groups.length < W; ) {
                var q = { it: this.cloneElements(this._elements), ty: "gr" };
                (q.it.push({
                  a: { a: 0, ix: 1, k: [0, 0] },
                  nm: "Transform",
                  o: { a: 0, ix: 7, k: 100 },
                  p: { a: 0, ix: 2, k: [0, 0] },
                  r: {
                    a: 1,
                    ix: 6,
                    k: [
                      { s: 0, e: 0, t: 0 },
                      { s: 0, e: 0, t: 1 },
                    ],
                  },
                  s: { a: 0, ix: 3, k: [100, 100] },
                  sa: { a: 0, ix: 5, k: 0 },
                  sk: { a: 0, ix: 4, k: 0 },
                  ty: "tr",
                }),
                  this.arr.splice(0, 0, q),
                  this._groups.splice(0, 0, q),
                  (this._currentCopies += 1));
              }
              (this.elem.reloadShapes(), (H = !0));
            }
            G = 0;
            var j;
            for (z = 0; z <= this._groups.length - 1; z += 1) {
              if (
                ((j = G < W),
                (this._groups[z]._render = j),
                this.changeGroupRender(this._groups[z].it, j),
                !j)
              ) {
                var Y = this.elemsData[z].it,
                  re = Y[Y.length - 1];
                re.transform.op.v !== 0
                  ? ((re.transform.op._mdf = !0), (re.transform.op.v = 0))
                  : (re.transform.op._mdf = !1);
              }
              G += 1;
            }
            this._currentCopies = W;
            var U = this.o.v,
              K = U % 1,
              Z = U > 0 ? Math.floor(U) : Math.ceil(U),
              X = this.pMatrix.props,
              se = this.rMatrix.props,
              Q = this.sMatrix.props;
            (this.pMatrix.reset(),
              this.rMatrix.reset(),
              this.sMatrix.reset(),
              this.tMatrix.reset(),
              this.matrix.reset());
            var te = 0;
            if (U > 0) {
              for (; te < Z; )
                (this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  1,
                  !1,
                ),
                  (te += 1));
              K &&
                (this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  K,
                  !1,
                ),
                (te += K));
            } else if (U < 0) {
              for (; te > Z; )
                (this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  1,
                  !0,
                ),
                  (te -= 1));
              K &&
                (this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  -K,
                  !0,
                ),
                (te -= K));
            }
            ((z = this.data.m === 1 ? 0 : this._currentCopies - 1),
              (N = this.data.m === 1 ? 1 : -1),
              (G = this._currentCopies));
            for (var J, ee; G; ) {
              if (
                ((O = this.elemsData[z].it),
                (B = O[O.length - 1].transform.mProps.v.props),
                (ee = B.length),
                (O[O.length - 1].transform.mProps._mdf = !0),
                (O[O.length - 1].transform.op._mdf = !0),
                (O[O.length - 1].transform.op.v =
                  this._currentCopies === 1
                    ? this.so.v
                    : this.so.v +
                      (this.eo.v - this.so.v) *
                        (z / (this._currentCopies - 1))),
                te !== 0)
              ) {
                for (
                  ((z !== 0 && N === 1) ||
                    (z !== this._currentCopies - 1 && N === -1)) &&
                    this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      1,
                      !1,
                    ),
                    this.matrix.transform(
                      se[0],
                      se[1],
                      se[2],
                      se[3],
                      se[4],
                      se[5],
                      se[6],
                      se[7],
                      se[8],
                      se[9],
                      se[10],
                      se[11],
                      se[12],
                      se[13],
                      se[14],
                      se[15],
                    ),
                    this.matrix.transform(
                      Q[0],
                      Q[1],
                      Q[2],
                      Q[3],
                      Q[4],
                      Q[5],
                      Q[6],
                      Q[7],
                      Q[8],
                      Q[9],
                      Q[10],
                      Q[11],
                      Q[12],
                      Q[13],
                      Q[14],
                      Q[15],
                    ),
                    this.matrix.transform(
                      X[0],
                      X[1],
                      X[2],
                      X[3],
                      X[4],
                      X[5],
                      X[6],
                      X[7],
                      X[8],
                      X[9],
                      X[10],
                      X[11],
                      X[12],
                      X[13],
                      X[14],
                      X[15],
                    ),
                    J = 0;
                  J < ee;
                  J += 1
                )
                  B[J] = this.matrix.props[J];
                this.matrix.reset();
              } else
                for (this.matrix.reset(), J = 0; J < ee; J += 1)
                  B[J] = this.matrix.props[J];
              ((te += 1), (G -= 1), (z += N));
            }
          } else
            for (G = this._currentCopies, z = 0, N = 1; G; )
              ((O = this.elemsData[z].it),
                (B = O[O.length - 1].transform.mProps.v.props),
                (O[O.length - 1].transform.mProps._mdf = !1),
                (O[O.length - 1].transform.op._mdf = !1),
                (G -= 1),
                (z += N));
          return H;
        }),
        (RepeaterModifier.prototype.addShape = function () {}));
      function RoundCornersModifier() {}
      (extendPrototype([ShapeModifier], RoundCornersModifier),
        (RoundCornersModifier.prototype.initModifierProperties = function (
          V,
          O,
        ) {
          ((this.getValue = this.processKeys),
            (this.rd = PropertyFactory.getProp(V, O.r, 0, null, this)),
            (this._isAnimated = !!this.rd.effectsSequence.length));
        }),
        (RoundCornersModifier.prototype.processPath = function (V, O) {
          var B = shapePool.newElement();
          B.c = V.c;
          var z,
            N = V._length,
            G,
            H,
            W,
            q,
            j,
            Y,
            re = 0,
            U,
            K,
            Z,
            X,
            se,
            Q;
          for (z = 0; z < N; z += 1)
            ((G = V.v[z]),
              (W = V.o[z]),
              (H = V.i[z]),
              G[0] === W[0] && G[1] === W[1] && G[0] === H[0] && G[1] === H[1]
                ? (z === 0 || z === N - 1) && !V.c
                  ? (B.setTripleAt(G[0], G[1], W[0], W[1], H[0], H[1], re),
                    (re += 1))
                  : (z === 0 ? (q = V.v[N - 1]) : (q = V.v[z - 1]),
                    (j = Math.sqrt(
                      Math.pow(G[0] - q[0], 2) + Math.pow(G[1] - q[1], 2),
                    )),
                    (Y = j ? Math.min(j / 2, O) / j : 0),
                    (se = G[0] + (q[0] - G[0]) * Y),
                    (U = se),
                    (Q = G[1] - (G[1] - q[1]) * Y),
                    (K = Q),
                    (Z = U - (U - G[0]) * roundCorner),
                    (X = K - (K - G[1]) * roundCorner),
                    B.setTripleAt(U, K, Z, X, se, Q, re),
                    (re += 1),
                    z === N - 1 ? (q = V.v[0]) : (q = V.v[z + 1]),
                    (j = Math.sqrt(
                      Math.pow(G[0] - q[0], 2) + Math.pow(G[1] - q[1], 2),
                    )),
                    (Y = j ? Math.min(j / 2, O) / j : 0),
                    (Z = G[0] + (q[0] - G[0]) * Y),
                    (U = Z),
                    (X = G[1] + (q[1] - G[1]) * Y),
                    (K = X),
                    (se = U - (U - G[0]) * roundCorner),
                    (Q = K - (K - G[1]) * roundCorner),
                    B.setTripleAt(U, K, Z, X, se, Q, re),
                    (re += 1))
                : (B.setTripleAt(
                    V.v[z][0],
                    V.v[z][1],
                    V.o[z][0],
                    V.o[z][1],
                    V.i[z][0],
                    V.i[z][1],
                    re,
                  ),
                  (re += 1)));
          return B;
        }),
        (RoundCornersModifier.prototype.processShapes = function (V) {
          var O,
            B,
            z = this.shapes.length,
            N,
            G,
            H = this.rd.v;
          if (H !== 0) {
            var W, q;
            for (B = 0; B < z; B += 1) {
              if (
                ((W = this.shapes[B]),
                (q = W.localShapeCollection),
                !(!W.shape._mdf && !this._mdf && !V))
              )
                for (
                  q.releaseShapes(),
                    W.shape._mdf = !0,
                    O = W.shape.paths.shapes,
                    G = W.shape.paths._length,
                    N = 0;
                  N < G;
                  N += 1
                )
                  q.addShape(this.processPath(O[N], H));
              W.shape.paths = W.localShapeCollection;
            }
          }
          this.dynamicProperties.length || (this._mdf = !1);
        }));
      function floatEqual(V, O) {
        return Math.abs(V - O) * 1e5 <= Math.min(Math.abs(V), Math.abs(O));
      }
      function floatZero(V) {
        return Math.abs(V) <= 1e-5;
      }
      function lerp(V, O, B) {
        return V * (1 - B) + O * B;
      }
      function lerpPoint(V, O, B) {
        return [lerp(V[0], O[0], B), lerp(V[1], O[1], B)];
      }
      function quadRoots(V, O, B) {
        if (V === 0) return [];
        var z = O * O - 4 * V * B;
        if (z < 0) return [];
        var N = -O / (2 * V);
        if (z === 0) return [N];
        var G = Math.sqrt(z) / (2 * V);
        return [N - G, N + G];
      }
      function polynomialCoefficients(V, O, B, z) {
        return [
          -V + 3 * O - 3 * B + z,
          3 * V - 6 * O + 3 * B,
          -3 * V + 3 * O,
          V,
        ];
      }
      function singlePoint(V) {
        return new PolynomialBezier(V, V, V, V, !1);
      }
      function PolynomialBezier(V, O, B, z, N) {
        (N && pointEqual(V, O) && (O = lerpPoint(V, z, 1 / 3)),
          N && pointEqual(B, z) && (B = lerpPoint(V, z, 2 / 3)));
        var G = polynomialCoefficients(V[0], O[0], B[0], z[0]),
          H = polynomialCoefficients(V[1], O[1], B[1], z[1]);
        ((this.a = [G[0], H[0]]),
          (this.b = [G[1], H[1]]),
          (this.c = [G[2], H[2]]),
          (this.d = [G[3], H[3]]),
          (this.points = [V, O, B, z]));
      }
      ((PolynomialBezier.prototype.point = function (V) {
        return [
          ((this.a[0] * V + this.b[0]) * V + this.c[0]) * V + this.d[0],
          ((this.a[1] * V + this.b[1]) * V + this.c[1]) * V + this.d[1],
        ];
      }),
        (PolynomialBezier.prototype.derivative = function (V) {
          return [
            (3 * V * this.a[0] + 2 * this.b[0]) * V + this.c[0],
            (3 * V * this.a[1] + 2 * this.b[1]) * V + this.c[1],
          ];
        }),
        (PolynomialBezier.prototype.tangentAngle = function (V) {
          var O = this.derivative(V);
          return Math.atan2(O[1], O[0]);
        }),
        (PolynomialBezier.prototype.normalAngle = function (V) {
          var O = this.derivative(V);
          return Math.atan2(O[0], O[1]);
        }),
        (PolynomialBezier.prototype.inflectionPoints = function () {
          var V = this.a[1] * this.b[0] - this.a[0] * this.b[1];
          if (floatZero(V)) return [];
          var O = (-0.5 * (this.a[1] * this.c[0] - this.a[0] * this.c[1])) / V,
            B =
              O * O -
              ((1 / 3) * (this.b[1] * this.c[0] - this.b[0] * this.c[1])) / V;
          if (B < 0) return [];
          var z = Math.sqrt(B);
          return floatZero(z)
            ? z > 0 && z < 1
              ? [O]
              : []
            : [O - z, O + z].filter(function (N) {
                return N > 0 && N < 1;
              });
        }),
        (PolynomialBezier.prototype.split = function (V) {
          if (V <= 0) return [singlePoint(this.points[0]), this];
          if (V >= 1)
            return [this, singlePoint(this.points[this.points.length - 1])];
          var O = lerpPoint(this.points[0], this.points[1], V),
            B = lerpPoint(this.points[1], this.points[2], V),
            z = lerpPoint(this.points[2], this.points[3], V),
            N = lerpPoint(O, B, V),
            G = lerpPoint(B, z, V),
            H = lerpPoint(N, G, V);
          return [
            new PolynomialBezier(this.points[0], O, N, H, !0),
            new PolynomialBezier(H, G, z, this.points[3], !0),
          ];
        }));
      function extrema(V, O) {
        var B = V.points[0][O],
          z = V.points[V.points.length - 1][O];
        if (B > z) {
          var N = z;
          ((z = B), (B = N));
        }
        for (
          var G = quadRoots(3 * V.a[O], 2 * V.b[O], V.c[O]), H = 0;
          H < G.length;
          H += 1
        )
          if (G[H] > 0 && G[H] < 1) {
            var W = V.point(G[H])[O];
            W < B ? (B = W) : W > z && (z = W);
          }
        return { min: B, max: z };
      }
      ((PolynomialBezier.prototype.bounds = function () {
        return { x: extrema(this, 0), y: extrema(this, 1) };
      }),
        (PolynomialBezier.prototype.boundingBox = function () {
          var V = this.bounds();
          return {
            left: V.x.min,
            right: V.x.max,
            top: V.y.min,
            bottom: V.y.max,
            width: V.x.max - V.x.min,
            height: V.y.max - V.y.min,
            cx: (V.x.max + V.x.min) / 2,
            cy: (V.y.max + V.y.min) / 2,
          };
        }));
      function intersectData(V, O, B) {
        var z = V.boundingBox();
        return {
          cx: z.cx,
          cy: z.cy,
          width: z.width,
          height: z.height,
          bez: V,
          t: (O + B) / 2,
          t1: O,
          t2: B,
        };
      }
      function splitData(V) {
        var O = V.bez.split(0.5);
        return [intersectData(O[0], V.t1, V.t), intersectData(O[1], V.t, V.t2)];
      }
      function boxIntersect(V, O) {
        return (
          Math.abs(V.cx - O.cx) * 2 < V.width + O.width &&
          Math.abs(V.cy - O.cy) * 2 < V.height + O.height
        );
      }
      function intersectsImpl(V, O, B, z, N, G) {
        if (boxIntersect(V, O)) {
          if (
            B >= G ||
            (V.width <= z && V.height <= z && O.width <= z && O.height <= z)
          ) {
            N.push([V.t, O.t]);
            return;
          }
          var H = splitData(V),
            W = splitData(O);
          (intersectsImpl(H[0], W[0], B + 1, z, N, G),
            intersectsImpl(H[0], W[1], B + 1, z, N, G),
            intersectsImpl(H[1], W[0], B + 1, z, N, G),
            intersectsImpl(H[1], W[1], B + 1, z, N, G));
        }
      }
      ((PolynomialBezier.prototype.intersections = function (V, O, B) {
        (O === void 0 && (O = 2), B === void 0 && (B = 7));
        var z = [];
        return (
          intersectsImpl(
            intersectData(this, 0, 1),
            intersectData(V, 0, 1),
            0,
            O,
            z,
            B,
          ),
          z
        );
      }),
        (PolynomialBezier.shapeSegment = function (V, O) {
          var B = (O + 1) % V.length();
          return new PolynomialBezier(V.v[O], V.o[O], V.i[B], V.v[B], !0);
        }),
        (PolynomialBezier.shapeSegmentInverted = function (V, O) {
          var B = (O + 1) % V.length();
          return new PolynomialBezier(V.v[B], V.i[B], V.o[O], V.v[O], !0);
        }));
      function crossProduct(V, O) {
        return [
          V[1] * O[2] - V[2] * O[1],
          V[2] * O[0] - V[0] * O[2],
          V[0] * O[1] - V[1] * O[0],
        ];
      }
      function lineIntersection(V, O, B, z) {
        var N = [V[0], V[1], 1],
          G = [O[0], O[1], 1],
          H = [B[0], B[1], 1],
          W = [z[0], z[1], 1],
          q = crossProduct(crossProduct(N, G), crossProduct(H, W));
        return floatZero(q[2]) ? null : [q[0] / q[2], q[1] / q[2]];
      }
      function polarOffset(V, O, B) {
        return [V[0] + Math.cos(O) * B, V[1] - Math.sin(O) * B];
      }
      function pointDistance(V, O) {
        return Math.hypot(V[0] - O[0], V[1] - O[1]);
      }
      function pointEqual(V, O) {
        return floatEqual(V[0], O[0]) && floatEqual(V[1], O[1]);
      }
      function ZigZagModifier() {}
      (extendPrototype([ShapeModifier], ZigZagModifier),
        (ZigZagModifier.prototype.initModifierProperties = function (V, O) {
          ((this.getValue = this.processKeys),
            (this.amplitude = PropertyFactory.getProp(V, O.s, 0, null, this)),
            (this.frequency = PropertyFactory.getProp(V, O.r, 0, null, this)),
            (this.pointsType = PropertyFactory.getProp(V, O.pt, 0, null, this)),
            (this._isAnimated =
              this.amplitude.effectsSequence.length !== 0 ||
              this.frequency.effectsSequence.length !== 0 ||
              this.pointsType.effectsSequence.length !== 0));
        }));
      function setPoint(V, O, B, z, N, G, H) {
        var W = B - Math.PI / 2,
          q = B + Math.PI / 2,
          j = O[0] + Math.cos(B) * z * N,
          Y = O[1] - Math.sin(B) * z * N;
        V.setTripleAt(
          j,
          Y,
          j + Math.cos(W) * G,
          Y - Math.sin(W) * G,
          j + Math.cos(q) * H,
          Y - Math.sin(q) * H,
          V.length(),
        );
      }
      function getPerpendicularVector(V, O) {
        var B = [O[0] - V[0], O[1] - V[1]],
          z = -Math.PI * 0.5,
          N = [
            Math.cos(z) * B[0] - Math.sin(z) * B[1],
            Math.sin(z) * B[0] + Math.cos(z) * B[1],
          ];
        return N;
      }
      function getProjectingAngle(V, O) {
        var B = O === 0 ? V.length() - 1 : O - 1,
          z = (O + 1) % V.length(),
          N = V.v[B],
          G = V.v[z],
          H = getPerpendicularVector(N, G);
        return Math.atan2(0, 1) - Math.atan2(H[1], H[0]);
      }
      function zigZagCorner(V, O, B, z, N, G, H) {
        var W = getProjectingAngle(O, B),
          q = O.v[B % O._length],
          j = O.v[B === 0 ? O._length - 1 : B - 1],
          Y = O.v[(B + 1) % O._length],
          re =
            G === 2
              ? Math.sqrt(Math.pow(q[0] - j[0], 2) + Math.pow(q[1] - j[1], 2))
              : 0,
          U =
            G === 2
              ? Math.sqrt(Math.pow(q[0] - Y[0], 2) + Math.pow(q[1] - Y[1], 2))
              : 0;
        setPoint(
          V,
          O.v[B % O._length],
          W,
          H,
          z,
          U / ((N + 1) * 2),
          re / ((N + 1) * 2),
        );
      }
      function zigZagSegment(V, O, B, z, N, G) {
        for (var H = 0; H < z; H += 1) {
          var W = (H + 1) / (z + 1),
            q =
              N === 2
                ? Math.sqrt(
                    Math.pow(O.points[3][0] - O.points[0][0], 2) +
                      Math.pow(O.points[3][1] - O.points[0][1], 2),
                  )
                : 0,
            j = O.normalAngle(W),
            Y = O.point(W);
          (setPoint(V, Y, j, G, B, q / ((z + 1) * 2), q / ((z + 1) * 2)),
            (G = -G));
        }
        return G;
      }
      ((ZigZagModifier.prototype.processPath = function (V, O, B, z) {
        var N = V._length,
          G = shapePool.newElement();
        if (((G.c = V.c), V.c || (N -= 1), N === 0)) return G;
        var H = -1,
          W = PolynomialBezier.shapeSegment(V, 0);
        zigZagCorner(G, V, 0, O, B, z, H);
        for (var q = 0; q < N; q += 1)
          ((H = zigZagSegment(G, W, O, B, z, -H)),
            q === N - 1 && !V.c
              ? (W = null)
              : (W = PolynomialBezier.shapeSegment(V, (q + 1) % N)),
            zigZagCorner(G, V, q + 1, O, B, z, H));
        return G;
      }),
        (ZigZagModifier.prototype.processShapes = function (V) {
          var O,
            B,
            z = this.shapes.length,
            N,
            G,
            H = this.amplitude.v,
            W = Math.max(0, Math.round(this.frequency.v)),
            q = this.pointsType.v;
          if (H !== 0) {
            var j, Y;
            for (B = 0; B < z; B += 1) {
              if (
                ((j = this.shapes[B]),
                (Y = j.localShapeCollection),
                !(!j.shape._mdf && !this._mdf && !V))
              )
                for (
                  Y.releaseShapes(),
                    j.shape._mdf = !0,
                    O = j.shape.paths.shapes,
                    G = j.shape.paths._length,
                    N = 0;
                  N < G;
                  N += 1
                )
                  Y.addShape(this.processPath(O[N], H, W, q));
              j.shape.paths = j.localShapeCollection;
            }
          }
          this.dynamicProperties.length || (this._mdf = !1);
        }));
      function linearOffset(V, O, B) {
        var z = Math.atan2(O[0] - V[0], O[1] - V[1]);
        return [polarOffset(V, z, B), polarOffset(O, z, B)];
      }
      function offsetSegment(V, O) {
        var B, z, N, G, H, W, q;
        ((q = linearOffset(V.points[0], V.points[1], O)),
          (B = q[0]),
          (z = q[1]),
          (q = linearOffset(V.points[1], V.points[2], O)),
          (N = q[0]),
          (G = q[1]),
          (q = linearOffset(V.points[2], V.points[3], O)),
          (H = q[0]),
          (W = q[1]));
        var j = lineIntersection(B, z, N, G);
        j === null && (j = z);
        var Y = lineIntersection(H, W, N, G);
        return (Y === null && (Y = H), new PolynomialBezier(B, j, Y, W));
      }
      function joinLines(V, O, B, z, N) {
        var G = O.points[3],
          H = B.points[0];
        if (z === 3 || pointEqual(G, H)) return G;
        if (z === 2) {
          var W = -O.tangentAngle(1),
            q = -B.tangentAngle(0) + Math.PI,
            j = lineIntersection(
              G,
              polarOffset(G, W + Math.PI / 2, 100),
              H,
              polarOffset(H, W + Math.PI / 2, 100),
            ),
            Y = j ? pointDistance(j, G) : pointDistance(G, H) / 2,
            re = polarOffset(G, W, 2 * Y * roundCorner);
          return (
            V.setXYAt(re[0], re[1], "o", V.length() - 1),
            (re = polarOffset(H, q, 2 * Y * roundCorner)),
            V.setTripleAt(H[0], H[1], H[0], H[1], re[0], re[1], V.length()),
            H
          );
        }
        var U = pointEqual(G, O.points[2]) ? O.points[0] : O.points[2],
          K = pointEqual(H, B.points[1]) ? B.points[3] : B.points[1],
          Z = lineIntersection(U, G, H, K);
        return Z && pointDistance(Z, G) < N
          ? (V.setTripleAt(Z[0], Z[1], Z[0], Z[1], Z[0], Z[1], V.length()), Z)
          : G;
      }
      function getIntersection(V, O) {
        var B = V.intersections(O);
        return (
          B.length && floatEqual(B[0][0], 1) && B.shift(),
          B.length ? B[0] : null
        );
      }
      function pruneSegmentIntersection(V, O) {
        var B = V.slice(),
          z = O.slice(),
          N = getIntersection(V[V.length - 1], O[0]);
        return (
          N &&
            ((B[V.length - 1] = V[V.length - 1].split(N[0])[0]),
            (z[0] = O[0].split(N[1])[1])),
          V.length > 1 &&
          O.length > 1 &&
          ((N = getIntersection(V[0], O[O.length - 1])), N)
            ? [[V[0].split(N[0])[0]], [O[O.length - 1].split(N[1])[1]]]
            : [B, z]
        );
      }
      function pruneIntersections(V) {
        for (var O, B = 1; B < V.length; B += 1)
          ((O = pruneSegmentIntersection(V[B - 1], V[B])),
            (V[B - 1] = O[0]),
            (V[B] = O[1]));
        return (
          V.length > 1 &&
            ((O = pruneSegmentIntersection(V[V.length - 1], V[0])),
            (V[V.length - 1] = O[0]),
            (V[0] = O[1])),
          V
        );
      }
      function offsetSegmentSplit(V, O) {
        var B = V.inflectionPoints(),
          z,
          N,
          G,
          H;
        if (B.length === 0) return [offsetSegment(V, O)];
        if (B.length === 1 || floatEqual(B[1], 1))
          return (
            (G = V.split(B[0])),
            (z = G[0]),
            (N = G[1]),
            [offsetSegment(z, O), offsetSegment(N, O)]
          );
        ((G = V.split(B[0])), (z = G[0]));
        var W = (B[1] - B[0]) / (1 - B[0]);
        return (
          (G = G[1].split(W)),
          (H = G[0]),
          (N = G[1]),
          [offsetSegment(z, O), offsetSegment(H, O), offsetSegment(N, O)]
        );
      }
      function OffsetPathModifier() {}
      (extendPrototype([ShapeModifier], OffsetPathModifier),
        (OffsetPathModifier.prototype.initModifierProperties = function (V, O) {
          ((this.getValue = this.processKeys),
            (this.amount = PropertyFactory.getProp(V, O.a, 0, null, this)),
            (this.miterLimit = PropertyFactory.getProp(V, O.ml, 0, null, this)),
            (this.lineJoin = O.lj),
            (this._isAnimated = this.amount.effectsSequence.length !== 0));
        }),
        (OffsetPathModifier.prototype.processPath = function (V, O, B, z) {
          var N = shapePool.newElement();
          N.c = V.c;
          var G = V.length();
          V.c || (G -= 1);
          var H,
            W,
            q,
            j = [];
          for (H = 0; H < G; H += 1)
            ((q = PolynomialBezier.shapeSegment(V, H)),
              j.push(offsetSegmentSplit(q, O)));
          if (!V.c)
            for (H = G - 1; H >= 0; H -= 1)
              ((q = PolynomialBezier.shapeSegmentInverted(V, H)),
                j.push(offsetSegmentSplit(q, O)));
          j = pruneIntersections(j);
          var Y = null,
            re = null;
          for (H = 0; H < j.length; H += 1) {
            var U = j[H];
            for (
              re && (Y = joinLines(N, re, U[0], B, z)),
                re = U[U.length - 1],
                W = 0;
              W < U.length;
              W += 1
            )
              ((q = U[W]),
                Y && pointEqual(q.points[0], Y)
                  ? N.setXYAt(
                      q.points[1][0],
                      q.points[1][1],
                      "o",
                      N.length() - 1,
                    )
                  : N.setTripleAt(
                      q.points[0][0],
                      q.points[0][1],
                      q.points[1][0],
                      q.points[1][1],
                      q.points[0][0],
                      q.points[0][1],
                      N.length(),
                    ),
                N.setTripleAt(
                  q.points[3][0],
                  q.points[3][1],
                  q.points[3][0],
                  q.points[3][1],
                  q.points[2][0],
                  q.points[2][1],
                  N.length(),
                ),
                (Y = q.points[3]));
          }
          return (j.length && joinLines(N, re, j[0][0], B, z), N);
        }),
        (OffsetPathModifier.prototype.processShapes = function (V) {
          var O,
            B,
            z = this.shapes.length,
            N,
            G,
            H = this.amount.v,
            W = this.miterLimit.v,
            q = this.lineJoin;
          if (H !== 0) {
            var j, Y;
            for (B = 0; B < z; B += 1) {
              if (
                ((j = this.shapes[B]),
                (Y = j.localShapeCollection),
                !(!j.shape._mdf && !this._mdf && !V))
              )
                for (
                  Y.releaseShapes(),
                    j.shape._mdf = !0,
                    O = j.shape.paths.shapes,
                    G = j.shape.paths._length,
                    N = 0;
                  N < G;
                  N += 1
                )
                  Y.addShape(this.processPath(O[N], H, q, W));
              j.shape.paths = j.localShapeCollection;
            }
          }
          this.dynamicProperties.length || (this._mdf = !1);
        }));
      function getFontProperties(V) {
        for (
          var O = V.fStyle ? V.fStyle.split(" ") : [],
            B = "normal",
            z = "normal",
            N = O.length,
            G,
            H = 0;
          H < N;
          H += 1
        )
          switch (((G = O[H].toLowerCase()), G)) {
            case "italic":
              z = "italic";
              break;
            case "bold":
              B = "700";
              break;
            case "black":
              B = "900";
              break;
            case "medium":
              B = "500";
              break;
            case "regular":
            case "normal":
              B = "400";
              break;
            case "light":
            case "thin":
              B = "200";
              break;
          }
        return { style: z, weight: V.fWeight || B };
      }
      var FontManager = (function () {
        var V = 5e3,
          O = { w: 0, size: 0, shapes: [], data: { shapes: [] } },
          B = [];
        B = B.concat([
          2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368,
          2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379,
          2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403,
        ]);
        var z = 127988,
          N = 917631,
          G = 917601,
          H = 917626,
          W = 65039,
          q = 8205,
          j = 127462,
          Y = 127487,
          re = ["d83cdffb", "d83cdffc", "d83cdffd", "d83cdffe", "d83cdfff"];
        function U(le) {
          var pe = le.split(","),
            ie,
            ae = pe.length,
            fe = [];
          for (ie = 0; ie < ae; ie += 1)
            pe[ie] !== "sans-serif" &&
              pe[ie] !== "monospace" &&
              fe.push(pe[ie]);
          return fe.join(",");
        }
        function K(le, pe) {
          var ie = createTag("span");
          (ie.setAttribute("aria-hidden", !0), (ie.style.fontFamily = pe));
          var ae = createTag("span");
          ((ae.innerText = "giItT1WQy@!-/#"),
            (ie.style.position = "absolute"),
            (ie.style.left = "-10000px"),
            (ie.style.top = "-10000px"),
            (ie.style.fontSize = "300px"),
            (ie.style.fontVariant = "normal"),
            (ie.style.fontStyle = "normal"),
            (ie.style.fontWeight = "normal"),
            (ie.style.letterSpacing = "0"),
            ie.appendChild(ae),
            document.body.appendChild(ie));
          var fe = ae.offsetWidth;
          return (
            (ae.style.fontFamily = U(le) + ", " + pe),
            { node: ae, w: fe, parent: ie }
          );
        }
        function Z() {
          var le,
            pe = this.fonts.length,
            ie,
            ae,
            fe = pe;
          for (le = 0; le < pe; le += 1)
            this.fonts[le].loaded
              ? (fe -= 1)
              : this.fonts[le].fOrigin === "n" || this.fonts[le].origin === 0
                ? (this.fonts[le].loaded = !0)
                : ((ie = this.fonts[le].monoCase.node),
                  (ae = this.fonts[le].monoCase.w),
                  ie.offsetWidth !== ae
                    ? ((fe -= 1), (this.fonts[le].loaded = !0))
                    : ((ie = this.fonts[le].sansCase.node),
                      (ae = this.fonts[le].sansCase.w),
                      ie.offsetWidth !== ae &&
                        ((fe -= 1), (this.fonts[le].loaded = !0))),
                  this.fonts[le].loaded &&
                    (this.fonts[le].sansCase.parent.parentNode.removeChild(
                      this.fonts[le].sansCase.parent,
                    ),
                    this.fonts[le].monoCase.parent.parentNode.removeChild(
                      this.fonts[le].monoCase.parent,
                    )));
          fe !== 0 && Date.now() - this.initTime < V
            ? setTimeout(this.checkLoadedFontsBinded, 20)
            : setTimeout(this.setIsLoadedBinded, 10);
        }
        function X(le, pe) {
          var ie = document.body && pe ? "svg" : "canvas",
            ae,
            fe = getFontProperties(le);
          if (ie === "svg") {
            var de = createNS("text");
            ((de.style.fontSize = "100px"),
              de.setAttribute("font-family", le.fFamily),
              de.setAttribute("font-style", fe.style),
              de.setAttribute("font-weight", fe.weight),
              (de.textContent = "1"),
              le.fClass
                ? ((de.style.fontFamily = "inherit"),
                  de.setAttribute("class", le.fClass))
                : (de.style.fontFamily = le.fFamily),
              pe.appendChild(de),
              (ae = de));
          } else {
            var xe = new OffscreenCanvas(500, 500).getContext("2d");
            ((xe.font = fe.style + " " + fe.weight + " 100px " + le.fFamily),
              (ae = xe));
          }
          function we(Ee) {
            return ie === "svg"
              ? ((ae.textContent = Ee), ae.getComputedTextLength())
              : ae.measureText(Ee).width;
          }
          return { measureText: we };
        }
        function se(le, pe) {
          if (!le) {
            this.isLoaded = !0;
            return;
          }
          if (this.chars) {
            ((this.isLoaded = !0), (this.fonts = le.list));
            return;
          }
          if (!document.body) {
            ((this.isLoaded = !0),
              le.list.forEach(function (Ge) {
                ((Ge.helper = X(Ge)), (Ge.cache = {}));
              }),
              (this.fonts = le.list));
            return;
          }
          var ie = le.list,
            ae,
            fe = ie.length,
            de = fe;
          for (ae = 0; ae < fe; ae += 1) {
            var xe = !0,
              we,
              Ee;
            if (
              ((ie[ae].loaded = !1),
              (ie[ae].monoCase = K(ie[ae].fFamily, "monospace")),
              (ie[ae].sansCase = K(ie[ae].fFamily, "sans-serif")),
              !ie[ae].fPath)
            )
              ((ie[ae].loaded = !0), (de -= 1));
            else if (ie[ae].fOrigin === "p" || ie[ae].origin === 3) {
              if (
                ((we = document.querySelectorAll(
                  'style[f-forigin="p"][f-family="' +
                    ie[ae].fFamily +
                    '"], style[f-origin="3"][f-family="' +
                    ie[ae].fFamily +
                    '"]',
                )),
                we.length > 0 && (xe = !1),
                xe)
              ) {
                var Me = createTag("style");
                (Me.setAttribute("f-forigin", ie[ae].fOrigin),
                  Me.setAttribute("f-origin", ie[ae].origin),
                  Me.setAttribute("f-family", ie[ae].fFamily),
                  (Me.type = "text/css"),
                  (Me.innerText =
                    "@font-face {font-family: " +
                    ie[ae].fFamily +
                    "; font-style: normal; src: url('" +
                    ie[ae].fPath +
                    "');}"),
                  pe.appendChild(Me));
              }
            } else if (ie[ae].fOrigin === "g" || ie[ae].origin === 1) {
              for (
                we = document.querySelectorAll(
                  'link[f-forigin="g"], link[f-origin="1"]',
                ),
                  Ee = 0;
                Ee < we.length;
                Ee += 1
              )
                we[Ee].href.indexOf(ie[ae].fPath) !== -1 && (xe = !1);
              if (xe) {
                var Ie = createTag("link");
                (Ie.setAttribute("f-forigin", ie[ae].fOrigin),
                  Ie.setAttribute("f-origin", ie[ae].origin),
                  (Ie.type = "text/css"),
                  (Ie.rel = "stylesheet"),
                  (Ie.href = ie[ae].fPath),
                  document.body.appendChild(Ie));
              }
            } else if (ie[ae].fOrigin === "t" || ie[ae].origin === 2) {
              for (
                we = document.querySelectorAll(
                  'script[f-forigin="t"], script[f-origin="2"]',
                ),
                  Ee = 0;
                Ee < we.length;
                Ee += 1
              )
                ie[ae].fPath === we[Ee].src && (xe = !1);
              if (xe) {
                var Oe = createTag("link");
                (Oe.setAttribute("f-forigin", ie[ae].fOrigin),
                  Oe.setAttribute("f-origin", ie[ae].origin),
                  Oe.setAttribute("rel", "stylesheet"),
                  Oe.setAttribute("href", ie[ae].fPath),
                  pe.appendChild(Oe));
              }
            }
            ((ie[ae].helper = X(ie[ae], pe)),
              (ie[ae].cache = {}),
              this.fonts.push(ie[ae]));
          }
          de === 0
            ? (this.isLoaded = !0)
            : setTimeout(this.checkLoadedFonts.bind(this), 100);
        }
        function Q(le) {
          if (le) {
            this.chars || (this.chars = []);
            var pe,
              ie = le.length,
              ae,
              fe = this.chars.length,
              de;
            for (pe = 0; pe < ie; pe += 1) {
              for (ae = 0, de = !1; ae < fe; )
                (this.chars[ae].style === le[pe].style &&
                  this.chars[ae].fFamily === le[pe].fFamily &&
                  this.chars[ae].ch === le[pe].ch &&
                  (de = !0),
                  (ae += 1));
              de || (this.chars.push(le[pe]), (fe += 1));
            }
          }
        }
        function te(le, pe, ie) {
          for (var ae = 0, fe = this.chars.length; ae < fe; ) {
            if (
              this.chars[ae].ch === le &&
              this.chars[ae].style === pe &&
              this.chars[ae].fFamily === ie
            )
              return this.chars[ae];
            ae += 1;
          }
          return (
            ((typeof le == "string" && le.charCodeAt(0) !== 13) || !le) &&
              console &&
              console.warn &&
              !this._warned &&
              ((this._warned = !0),
              console.warn(
                "Missing character from exported characters list: ",
                le,
                pe,
                ie,
              )),
            O
          );
        }
        function J(le, pe, ie) {
          var ae = this.getFontByName(pe),
            fe = le;
          if (!ae.cache[fe]) {
            var de = ae.helper;
            if (le === " ") {
              var xe = de.measureText("|" + le + "|"),
                we = de.measureText("||");
              ae.cache[fe] = (xe - we) / 100;
            } else ae.cache[fe] = de.measureText(le) / 100;
          }
          return ae.cache[fe] * ie;
        }
        function ee(le) {
          for (var pe = 0, ie = this.fonts.length; pe < ie; ) {
            if (this.fonts[pe].fName === le) return this.fonts[pe];
            pe += 1;
          }
          return this.fonts[0];
        }
        function ne(le) {
          var pe = 0,
            ie = le.charCodeAt(0);
          if (ie >= 55296 && ie <= 56319) {
            var ae = le.charCodeAt(1);
            ae >= 56320 &&
              ae <= 57343 &&
              (pe = (ie - 55296) * 1024 + ae - 56320 + 65536);
          }
          return pe;
        }
        function oe(le, pe) {
          var ie = le.toString(16) + pe.toString(16);
          return re.indexOf(ie) !== -1;
        }
        function he(le) {
          return le === q;
        }
        function ce(le) {
          return le === W;
        }
        function ue(le) {
          var pe = ne(le);
          return pe >= j && pe <= Y;
        }
        function ge(le) {
          return ue(le.substr(0, 2)) && ue(le.substr(2, 2));
        }
        function ye(le) {
          return B.indexOf(le) !== -1;
        }
        function me(le, pe) {
          var ie = ne(le.substr(pe, 2));
          if (ie !== z) return !1;
          var ae = 0;
          for (pe += 2; ae < 5; ) {
            if (((ie = ne(le.substr(pe, 2))), ie < G || ie > H)) return !1;
            ((ae += 1), (pe += 2));
          }
          return ne(le.substr(pe, 2)) === N;
        }
        function be() {
          this.isLoaded = !0;
        }
        var Se = function () {
          ((this.fonts = []),
            (this.chars = null),
            (this.typekitLoaded = 0),
            (this.isLoaded = !1),
            (this._warned = !1),
            (this.initTime = Date.now()),
            (this.setIsLoadedBinded = this.setIsLoaded.bind(this)),
            (this.checkLoadedFontsBinded = this.checkLoadedFonts.bind(this)));
        };
        ((Se.isModifier = oe),
          (Se.isZeroWidthJoiner = he),
          (Se.isFlagEmoji = ge),
          (Se.isRegionalCode = ue),
          (Se.isCombinedCharacter = ye),
          (Se.isRegionalFlag = me),
          (Se.isVariationSelector = ce),
          (Se.BLACK_FLAG_CODE_POINT = z));
        var _e = {
          addChars: Q,
          addFonts: se,
          getCharData: te,
          getFontByName: ee,
          measureText: J,
          checkLoadedFonts: Z,
          setIsLoaded: be,
        };
        return ((Se.prototype = _e), Se);
      })();
      function SlotManager(V) {
        this.animationData = V;
      }
      SlotManager.prototype.getProp = function (V) {
        return this.animationData.slots && this.animationData.slots[V.sid]
          ? Object.assign(V, this.animationData.slots[V.sid].p)
          : V;
      };
      function slotFactory(V) {
        return new SlotManager(V);
      }
      function RenderableElement() {}
      RenderableElement.prototype = {
        initRenderable: function () {
          ((this.isInRange = !1),
            (this.hidden = !1),
            (this.isTransparent = !1),
            (this.renderableComponents = []));
        },
        addRenderableComponent: function (O) {
          this.renderableComponents.indexOf(O) === -1 &&
            this.renderableComponents.push(O);
        },
        removeRenderableComponent: function (O) {
          this.renderableComponents.indexOf(O) !== -1 &&
            this.renderableComponents.splice(
              this.renderableComponents.indexOf(O),
              1,
            );
        },
        prepareRenderableFrame: function (O) {
          this.checkLayerLimits(O);
        },
        checkTransparency: function () {
          this.finalTransform.mProp.o.v <= 0
            ? !this.isTransparent &&
              this.globalData.renderConfig.hideOnTransparent &&
              ((this.isTransparent = !0), this.hide())
            : this.isTransparent && ((this.isTransparent = !1), this.show());
        },
        checkLayerLimits: function (O) {
          this.data.ip - this.data.st <= O && this.data.op - this.data.st > O
            ? this.isInRange !== !0 &&
              ((this.globalData._mdf = !0),
              (this._mdf = !0),
              (this.isInRange = !0),
              this.show())
            : this.isInRange !== !1 &&
              ((this.globalData._mdf = !0), (this.isInRange = !1), this.hide());
        },
        renderRenderable: function () {
          var O,
            B = this.renderableComponents.length;
          for (O = 0; O < B; O += 1)
            this.renderableComponents[O].renderFrame(this._isFirstFrame);
        },
        sourceRectAtTime: function () {
          return { top: 0, left: 0, width: 100, height: 100 };
        },
        getLayerSize: function () {
          return this.data.ty === 5
            ? { w: this.data.textData.width, h: this.data.textData.height }
            : { w: this.data.width, h: this.data.height };
        },
      };
      var getBlendMode = (function () {
        var V = {
          0: "source-over",
          1: "multiply",
          2: "screen",
          3: "overlay",
          4: "darken",
          5: "lighten",
          6: "color-dodge",
          7: "color-burn",
          8: "hard-light",
          9: "soft-light",
          10: "difference",
          11: "exclusion",
          12: "hue",
          13: "saturation",
          14: "color",
          15: "luminosity",
        };
        return function (O) {
          return V[O] || "";
        };
      })();
      function SliderEffect(V, O, B) {
        this.p = PropertyFactory.getProp(O, V.v, 0, 0, B);
      }
      function AngleEffect(V, O, B) {
        this.p = PropertyFactory.getProp(O, V.v, 0, 0, B);
      }
      function ColorEffect(V, O, B) {
        this.p = PropertyFactory.getProp(O, V.v, 1, 0, B);
      }
      function PointEffect(V, O, B) {
        this.p = PropertyFactory.getProp(O, V.v, 1, 0, B);
      }
      function LayerIndexEffect(V, O, B) {
        this.p = PropertyFactory.getProp(O, V.v, 0, 0, B);
      }
      function MaskIndexEffect(V, O, B) {
        this.p = PropertyFactory.getProp(O, V.v, 0, 0, B);
      }
      function CheckboxEffect(V, O, B) {
        this.p = PropertyFactory.getProp(O, V.v, 0, 0, B);
      }
      function NoValueEffect() {
        this.p = {};
      }
      function EffectsManager(V, O) {
        var B = V.ef || [];
        this.effectElements = [];
        var z,
          N = B.length,
          G;
        for (z = 0; z < N; z += 1)
          ((G = new GroupEffect(B[z], O)), this.effectElements.push(G));
      }
      function GroupEffect(V, O) {
        this.init(V, O);
      }
      (extendPrototype([DynamicPropertyContainer], GroupEffect),
        (GroupEffect.prototype.getValue =
          GroupEffect.prototype.iterateDynamicProperties),
        (GroupEffect.prototype.init = function (V, O) {
          ((this.data = V),
            (this.effectElements = []),
            this.initDynamicPropertyContainer(O));
          var B,
            z = this.data.ef.length,
            N,
            G = this.data.ef;
          for (B = 0; B < z; B += 1) {
            switch (((N = null), G[B].ty)) {
              case 0:
                N = new SliderEffect(G[B], O, this);
                break;
              case 1:
                N = new AngleEffect(G[B], O, this);
                break;
              case 2:
                N = new ColorEffect(G[B], O, this);
                break;
              case 3:
                N = new PointEffect(G[B], O, this);
                break;
              case 4:
              case 7:
                N = new CheckboxEffect(G[B], O, this);
                break;
              case 10:
                N = new LayerIndexEffect(G[B], O, this);
                break;
              case 11:
                N = new MaskIndexEffect(G[B], O, this);
                break;
              case 5:
                N = new EffectsManager(G[B], O);
                break;
              default:
                N = new NoValueEffect(G[B]);
                break;
            }
            N && this.effectElements.push(N);
          }
        }));
      function BaseElement() {}
      BaseElement.prototype = {
        checkMasks: function () {
          if (!this.data.hasMask) return !1;
          for (var O = 0, B = this.data.masksProperties.length; O < B; ) {
            if (
              this.data.masksProperties[O].mode !== "n" &&
              this.data.masksProperties[O].cl !== !1
            )
              return !0;
            O += 1;
          }
          return !1;
        },
        initExpressions: function () {
          var O = getExpressionInterfaces();
          if (O) {
            var B = O("layer"),
              z = O("effects"),
              N = O("shape"),
              G = O("text"),
              H = O("comp");
            ((this.layerInterface = B(this)),
              this.data.hasMask &&
                this.maskManager &&
                this.layerInterface.registerMaskInterface(this.maskManager));
            var W = z.createEffectsInterface(this, this.layerInterface);
            (this.layerInterface.registerEffectsInterface(W),
              this.data.ty === 0 || this.data.xt
                ? (this.compInterface = H(this))
                : this.data.ty === 4
                  ? ((this.layerInterface.shapeInterface = N(
                      this.shapesData,
                      this.itemsData,
                      this.layerInterface,
                    )),
                    (this.layerInterface.content =
                      this.layerInterface.shapeInterface))
                  : this.data.ty === 5 &&
                    ((this.layerInterface.textInterface = G(this)),
                    (this.layerInterface.text =
                      this.layerInterface.textInterface)));
          }
        },
        setBlendMode: function () {
          var O = getBlendMode(this.data.bm),
            B = this.baseElement || this.layerElement;
          B.style["mix-blend-mode"] = O;
        },
        initBaseData: function (O, B, z) {
          ((this.globalData = B),
            (this.comp = z),
            (this.data = O),
            (this.layerId = createElementID()),
            this.data.sr || (this.data.sr = 1),
            (this.effectsManager = new EffectsManager(
              this.data,
              this,
              this.dynamicProperties,
            )));
        },
        getType: function () {
          return this.type;
        },
        sourceRectAtTime: function () {},
      };
      function FrameElement() {}
      FrameElement.prototype = {
        initFrame: function () {
          ((this._isFirstFrame = !1),
            (this.dynamicProperties = []),
            (this._mdf = !1));
        },
        prepareProperties: function (O, B) {
          var z,
            N = this.dynamicProperties.length;
          for (z = 0; z < N; z += 1)
            (B ||
              (this._isParent &&
                this.dynamicProperties[z].propType === "transform")) &&
              (this.dynamicProperties[z].getValue(),
              this.dynamicProperties[z]._mdf &&
                ((this.globalData._mdf = !0), (this._mdf = !0)));
        },
        addDynamicProperty: function (O) {
          this.dynamicProperties.indexOf(O) === -1 &&
            this.dynamicProperties.push(O);
        },
      };
      function FootageElement(V, O, B) {
        (this.initFrame(),
          this.initRenderable(),
          (this.assetData = O.getAssetData(V.refId)),
          (this.footageData = O.imageLoader.getAsset(this.assetData)),
          this.initBaseData(V, O, B));
      }
      ((FootageElement.prototype.prepareFrame = function () {}),
        extendPrototype(
          [RenderableElement, BaseElement, FrameElement],
          FootageElement,
        ),
        (FootageElement.prototype.getBaseElement = function () {
          return null;
        }),
        (FootageElement.prototype.renderFrame = function () {}),
        (FootageElement.prototype.destroy = function () {}),
        (FootageElement.prototype.initExpressions = function () {
          var V = getExpressionInterfaces();
          if (V) {
            var O = V("footage");
            this.layerInterface = O(this);
          }
        }),
        (FootageElement.prototype.getFootageData = function () {
          return this.footageData;
        }));
      function AudioElement(V, O, B) {
        (this.initFrame(),
          this.initRenderable(),
          (this.assetData = O.getAssetData(V.refId)),
          this.initBaseData(V, O, B),
          (this._isPlaying = !1),
          (this._canPlay = !1));
        var z = this.globalData.getAssetsPath(this.assetData);
        ((this.audio = this.globalData.audioController.createAudio(z)),
          (this._currentTime = 0),
          this.globalData.audioController.addAudio(this),
          (this._volumeMultiplier = 1),
          (this._volume = 1),
          (this._previousVolume = null),
          (this.tm = V.tm
            ? PropertyFactory.getProp(this, V.tm, 0, O.frameRate, this)
            : { _placeholder: !0 }),
          (this.lv = PropertyFactory.getProp(
            this,
            V.au && V.au.lv ? V.au.lv : { k: [100] },
            1,
            0.01,
            this,
          )));
      }
      ((AudioElement.prototype.prepareFrame = function (V) {
        if (
          (this.prepareRenderableFrame(V, !0),
          this.prepareProperties(V, !0),
          this.tm._placeholder)
        )
          this._currentTime = V / this.data.sr;
        else {
          var O = this.tm.v;
          this._currentTime = O;
        }
        this._volume = this.lv.v[0];
        var B = this._volume * this._volumeMultiplier;
        this._previousVolume !== B &&
          ((this._previousVolume = B), this.audio.volume(B));
      }),
        extendPrototype(
          [RenderableElement, BaseElement, FrameElement],
          AudioElement,
        ),
        (AudioElement.prototype.renderFrame = function () {
          this.isInRange &&
            this._canPlay &&
            (this._isPlaying
              ? (!this.audio.playing() ||
                  Math.abs(
                    this._currentTime / this.globalData.frameRate -
                      this.audio.seek(),
                  ) > 0.1) &&
                this.audio.seek(this._currentTime / this.globalData.frameRate)
              : (this.audio.play(),
                this.audio.seek(this._currentTime / this.globalData.frameRate),
                (this._isPlaying = !0)));
        }),
        (AudioElement.prototype.show = function () {}),
        (AudioElement.prototype.hide = function () {
          (this.audio.pause(), (this._isPlaying = !1));
        }),
        (AudioElement.prototype.pause = function () {
          (this.audio.pause(), (this._isPlaying = !1), (this._canPlay = !1));
        }),
        (AudioElement.prototype.resume = function () {
          this._canPlay = !0;
        }),
        (AudioElement.prototype.setRate = function (V) {
          this.audio.rate(V);
        }),
        (AudioElement.prototype.volume = function (V) {
          ((this._volumeMultiplier = V),
            (this._previousVolume = V * this._volume),
            this.audio.volume(this._previousVolume));
        }),
        (AudioElement.prototype.getBaseElement = function () {
          return null;
        }),
        (AudioElement.prototype.destroy = function () {}),
        (AudioElement.prototype.sourceRectAtTime = function () {}),
        (AudioElement.prototype.initExpressions = function () {}));
      function BaseRenderer() {}
      ((BaseRenderer.prototype.checkLayers = function (V) {
        var O,
          B = this.layers.length,
          z;
        for (this.completeLayers = !0, O = B - 1; O >= 0; O -= 1)
          (this.elements[O] ||
            ((z = this.layers[O]),
            z.ip - z.st <= V - this.layers[O].st &&
              z.op - z.st > V - this.layers[O].st &&
              this.buildItem(O)),
            (this.completeLayers = this.elements[O]
              ? this.completeLayers
              : !1));
        this.checkPendingElements();
      }),
        (BaseRenderer.prototype.createItem = function (V) {
          switch (V.ty) {
            case 2:
              return this.createImage(V);
            case 0:
              return this.createComp(V);
            case 1:
              return this.createSolid(V);
            case 3:
              return this.createNull(V);
            case 4:
              return this.createShape(V);
            case 5:
              return this.createText(V);
            case 6:
              return this.createAudio(V);
            case 13:
              return this.createCamera(V);
            case 15:
              return this.createFootage(V);
            default:
              return this.createNull(V);
          }
        }),
        (BaseRenderer.prototype.createCamera = function () {
          throw new Error("You're using a 3d camera. Try the html renderer.");
        }),
        (BaseRenderer.prototype.createAudio = function (V) {
          return new AudioElement(V, this.globalData, this);
        }),
        (BaseRenderer.prototype.createFootage = function (V) {
          return new FootageElement(V, this.globalData, this);
        }),
        (BaseRenderer.prototype.buildAllItems = function () {
          var V,
            O = this.layers.length;
          for (V = 0; V < O; V += 1) this.buildItem(V);
          this.checkPendingElements();
        }),
        (BaseRenderer.prototype.includeLayers = function (V) {
          this.completeLayers = !1;
          var O,
            B = V.length,
            z,
            N = this.layers.length;
          for (O = 0; O < B; O += 1)
            for (z = 0; z < N; ) {
              if (this.layers[z].id === V[O].id) {
                this.layers[z] = V[O];
                break;
              }
              z += 1;
            }
        }),
        (BaseRenderer.prototype.setProjectInterface = function (V) {
          this.globalData.projectInterface = V;
        }),
        (BaseRenderer.prototype.initItems = function () {
          this.globalData.progressiveLoad || this.buildAllItems();
        }),
        (BaseRenderer.prototype.buildElementParenting = function (V, O, B) {
          for (
            var z = this.elements, N = this.layers, G = 0, H = N.length;
            G < H;
          )
            (N[G].ind == O &&
              (!z[G] || z[G] === !0
                ? (this.buildItem(G), this.addPendingElement(V))
                : (B.push(z[G]),
                  z[G].setAsParent(),
                  N[G].parent !== void 0
                    ? this.buildElementParenting(V, N[G].parent, B)
                    : V.setHierarchy(B))),
              (G += 1));
        }),
        (BaseRenderer.prototype.addPendingElement = function (V) {
          this.pendingElements.push(V);
        }),
        (BaseRenderer.prototype.searchExtraCompositions = function (V) {
          var O,
            B = V.length;
          for (O = 0; O < B; O += 1)
            if (V[O].xt) {
              var z = this.createComp(V[O]);
              (z.initExpressions(),
                this.globalData.projectInterface.registerComposition(z));
            }
        }),
        (BaseRenderer.prototype.getElementById = function (V) {
          var O,
            B = this.elements.length;
          for (O = 0; O < B; O += 1)
            if (this.elements[O].data.ind === V) return this.elements[O];
          return null;
        }),
        (BaseRenderer.prototype.getElementByPath = function (V) {
          var O = V.shift(),
            B;
          if (typeof O == "number") B = this.elements[O];
          else {
            var z,
              N = this.elements.length;
            for (z = 0; z < N; z += 1)
              if (this.elements[z].data.nm === O) {
                B = this.elements[z];
                break;
              }
          }
          return V.length === 0 ? B : B.getElementByPath(V);
        }),
        (BaseRenderer.prototype.setupGlobalData = function (V, O) {
          ((this.globalData.fontManager = new FontManager()),
            (this.globalData.slotManager = slotFactory(V)),
            this.globalData.fontManager.addChars(V.chars),
            this.globalData.fontManager.addFonts(V.fonts, O),
            (this.globalData.getAssetData =
              this.animationItem.getAssetData.bind(this.animationItem)),
            (this.globalData.getAssetsPath =
              this.animationItem.getAssetsPath.bind(this.animationItem)),
            (this.globalData.imageLoader = this.animationItem.imagePreloader),
            (this.globalData.audioController =
              this.animationItem.audioController),
            (this.globalData.frameId = 0),
            (this.globalData.frameRate = V.fr),
            (this.globalData.nm = V.nm),
            (this.globalData.compSize = { w: V.w, h: V.h }));
        }));
      var effectTypes = { TRANSFORM_EFFECT: "transformEFfect" };
      function TransformElement() {}
      TransformElement.prototype = {
        initTransform: function () {
          var O = new Matrix();
          ((this.finalTransform = {
            mProp: this.data.ks
              ? TransformPropertyFactory.getTransformProperty(
                  this,
                  this.data.ks,
                  this,
                )
              : { o: 0 },
            _matMdf: !1,
            _localMatMdf: !1,
            _opMdf: !1,
            mat: O,
            localMat: O,
            localOpacity: 1,
          }),
            this.data.ao && (this.finalTransform.mProp.autoOriented = !0),
            this.data.ty);
        },
        renderTransform: function () {
          if (
            ((this.finalTransform._opMdf =
              this.finalTransform.mProp.o._mdf || this._isFirstFrame),
            (this.finalTransform._matMdf =
              this.finalTransform.mProp._mdf || this._isFirstFrame),
            this.hierarchy)
          ) {
            var O,
              B = this.finalTransform.mat,
              z = 0,
              N = this.hierarchy.length;
            if (!this.finalTransform._matMdf)
              for (; z < N; ) {
                if (this.hierarchy[z].finalTransform.mProp._mdf) {
                  this.finalTransform._matMdf = !0;
                  break;
                }
                z += 1;
              }
            if (this.finalTransform._matMdf)
              for (
                O = this.finalTransform.mProp.v.props,
                  B.cloneFromProps(O),
                  z = 0;
                z < N;
                z += 1
              )
                B.multiply(this.hierarchy[z].finalTransform.mProp.v);
          }
          (this.finalTransform._matMdf &&
            (this.finalTransform._localMatMdf = this.finalTransform._matMdf),
            this.finalTransform._opMdf &&
              (this.finalTransform.localOpacity =
                this.finalTransform.mProp.o.v));
        },
        renderLocalTransform: function () {
          if (this.localTransforms) {
            var O = 0,
              B = this.localTransforms.length;
            if (
              ((this.finalTransform._localMatMdf = this.finalTransform._matMdf),
              !this.finalTransform._localMatMdf || !this.finalTransform._opMdf)
            )
              for (; O < B; )
                (this.localTransforms[O]._mdf &&
                  (this.finalTransform._localMatMdf = !0),
                  this.localTransforms[O]._opMdf &&
                    !this.finalTransform._opMdf &&
                    ((this.finalTransform.localOpacity =
                      this.finalTransform.mProp.o.v),
                    (this.finalTransform._opMdf = !0)),
                  (O += 1));
            if (this.finalTransform._localMatMdf) {
              var z = this.finalTransform.localMat;
              for (
                this.localTransforms[0].matrix.clone(z), O = 1;
                O < B;
                O += 1
              ) {
                var N = this.localTransforms[O].matrix;
                z.multiply(N);
              }
              z.multiply(this.finalTransform.mat);
            }
            if (this.finalTransform._opMdf) {
              var G = this.finalTransform.localOpacity;
              for (O = 0; O < B; O += 1)
                G *= this.localTransforms[O].opacity * 0.01;
              this.finalTransform.localOpacity = G;
            }
          }
        },
        searchEffectTransforms: function () {
          if (this.renderableEffectsManager) {
            var O = this.renderableEffectsManager.getEffects(
              effectTypes.TRANSFORM_EFFECT,
            );
            if (O.length) {
              ((this.localTransforms = []),
                (this.finalTransform.localMat = new Matrix()));
              var B = 0,
                z = O.length;
              for (B = 0; B < z; B += 1) this.localTransforms.push(O[B]);
            }
          }
        },
        globalToLocal: function (O) {
          var B = [];
          B.push(this.finalTransform);
          for (var z = !0, N = this.comp; z; )
            N.finalTransform
              ? (N.data.hasMask && B.splice(0, 0, N.finalTransform),
                (N = N.comp))
              : (z = !1);
          var G,
            H = B.length,
            W;
          for (G = 0; G < H; G += 1)
            ((W = B[G].mat.applyToPointArray(0, 0, 0)),
              (O = [O[0] - W[0], O[1] - W[1], 0]));
          return O;
        },
        mHelper: new Matrix(),
      };
      function MaskElement(V, O, B) {
        ((this.data = V),
          (this.element = O),
          (this.globalData = B),
          (this.storedData = []),
          (this.masksProperties = this.data.masksProperties || []),
          (this.maskElement = null));
        var z = this.globalData.defs,
          N,
          G = this.masksProperties ? this.masksProperties.length : 0;
        ((this.viewData = createSizedArray(G)), (this.solidPath = ""));
        var H,
          W = this.masksProperties,
          q = 0,
          j = [],
          Y,
          re,
          U = createElementID(),
          K,
          Z,
          X,
          se,
          Q = "clipPath",
          te = "clip-path";
        for (N = 0; N < G; N += 1)
          if (
            (((W[N].mode !== "a" && W[N].mode !== "n") ||
              W[N].inv ||
              W[N].o.k !== 100 ||
              W[N].o.x) &&
              ((Q = "mask"), (te = "mask")),
            (W[N].mode === "s" || W[N].mode === "i") && q === 0
              ? ((K = createNS("rect")),
                K.setAttribute("fill", "#ffffff"),
                K.setAttribute("width", this.element.comp.data.w || 0),
                K.setAttribute("height", this.element.comp.data.h || 0),
                j.push(K))
              : (K = null),
            (H = createNS("path")),
            W[N].mode === "n")
          )
            ((this.viewData[N] = {
              op: PropertyFactory.getProp(
                this.element,
                W[N].o,
                0,
                0.01,
                this.element,
              ),
              prop: ShapePropertyFactory.getShapeProp(this.element, W[N], 3),
              elem: H,
              lastPath: "",
            }),
              z.appendChild(H));
          else {
            ((q += 1),
              H.setAttribute("fill", W[N].mode === "s" ? "#000000" : "#ffffff"),
              H.setAttribute("clip-rule", "nonzero"));
            var J;
            if (
              (W[N].x.k !== 0
                ? ((Q = "mask"),
                  (te = "mask"),
                  (se = PropertyFactory.getProp(
                    this.element,
                    W[N].x,
                    0,
                    null,
                    this.element,
                  )),
                  (J = createElementID()),
                  (Z = createNS("filter")),
                  Z.setAttribute("id", J),
                  (X = createNS("feMorphology")),
                  X.setAttribute("operator", "erode"),
                  X.setAttribute("in", "SourceGraphic"),
                  X.setAttribute("radius", "0"),
                  Z.appendChild(X),
                  z.appendChild(Z),
                  H.setAttribute(
                    "stroke",
                    W[N].mode === "s" ? "#000000" : "#ffffff",
                  ))
                : ((X = null), (se = null)),
              (this.storedData[N] = {
                elem: H,
                x: se,
                expan: X,
                lastPath: "",
                lastOperator: "",
                filterId: J,
                lastRadius: 0,
              }),
              W[N].mode === "i")
            ) {
              re = j.length;
              var ee = createNS("g");
              for (Y = 0; Y < re; Y += 1) ee.appendChild(j[Y]);
              var ne = createNS("mask");
              (ne.setAttribute("mask-type", "alpha"),
                ne.setAttribute("id", U + "_" + q),
                ne.appendChild(H),
                z.appendChild(ne),
                ee.setAttribute(
                  "mask",
                  "url(" + getLocationHref() + "#" + U + "_" + q + ")",
                ),
                (j.length = 0),
                j.push(ee));
            } else j.push(H);
            (W[N].inv &&
              !this.solidPath &&
              (this.solidPath = this.createLayerSolidPath()),
              (this.viewData[N] = {
                elem: H,
                lastPath: "",
                op: PropertyFactory.getProp(
                  this.element,
                  W[N].o,
                  0,
                  0.01,
                  this.element,
                ),
                prop: ShapePropertyFactory.getShapeProp(this.element, W[N], 3),
                invRect: K,
              }),
              this.viewData[N].prop.k ||
                this.drawPath(W[N], this.viewData[N].prop.v, this.viewData[N]));
          }
        for (this.maskElement = createNS(Q), G = j.length, N = 0; N < G; N += 1)
          this.maskElement.appendChild(j[N]);
        (q > 0 &&
          (this.maskElement.setAttribute("id", U),
          this.element.maskedElement.setAttribute(
            te,
            "url(" + getLocationHref() + "#" + U + ")",
          ),
          z.appendChild(this.maskElement)),
          this.viewData.length && this.element.addRenderableComponent(this));
      }
      ((MaskElement.prototype.getMaskProperty = function (V) {
        return this.viewData[V].prop;
      }),
        (MaskElement.prototype.renderFrame = function (V) {
          var O = this.element.finalTransform.mat,
            B,
            z = this.masksProperties.length;
          for (B = 0; B < z; B += 1)
            if (
              ((this.viewData[B].prop._mdf || V) &&
                this.drawPath(
                  this.masksProperties[B],
                  this.viewData[B].prop.v,
                  this.viewData[B],
                ),
              (this.viewData[B].op._mdf || V) &&
                this.viewData[B].elem.setAttribute(
                  "fill-opacity",
                  this.viewData[B].op.v,
                ),
              this.masksProperties[B].mode !== "n" &&
                (this.viewData[B].invRect &&
                  (this.element.finalTransform.mProp._mdf || V) &&
                  this.viewData[B].invRect.setAttribute(
                    "transform",
                    O.getInverseMatrix().to2dCSS(),
                  ),
                this.storedData[B].x && (this.storedData[B].x._mdf || V)))
            ) {
              var N = this.storedData[B].expan;
              this.storedData[B].x.v < 0
                ? (this.storedData[B].lastOperator !== "erode" &&
                    ((this.storedData[B].lastOperator = "erode"),
                    this.storedData[B].elem.setAttribute(
                      "filter",
                      "url(" +
                        getLocationHref() +
                        "#" +
                        this.storedData[B].filterId +
                        ")",
                    )),
                  N.setAttribute("radius", -this.storedData[B].x.v))
                : (this.storedData[B].lastOperator !== "dilate" &&
                    ((this.storedData[B].lastOperator = "dilate"),
                    this.storedData[B].elem.setAttribute("filter", null)),
                  this.storedData[B].elem.setAttribute(
                    "stroke-width",
                    this.storedData[B].x.v * 2,
                  ));
            }
        }),
        (MaskElement.prototype.getMaskelement = function () {
          return this.maskElement;
        }),
        (MaskElement.prototype.createLayerSolidPath = function () {
          var V = "M0,0 ";
          return (
            (V += " h" + this.globalData.compSize.w),
            (V += " v" + this.globalData.compSize.h),
            (V += " h-" + this.globalData.compSize.w),
            (V += " v-" + this.globalData.compSize.h + " "),
            V
          );
        }),
        (MaskElement.prototype.drawPath = function (V, O, B) {
          var z = " M" + O.v[0][0] + "," + O.v[0][1],
            N,
            G;
          for (G = O._length, N = 1; N < G; N += 1)
            z +=
              " C" +
              O.o[N - 1][0] +
              "," +
              O.o[N - 1][1] +
              " " +
              O.i[N][0] +
              "," +
              O.i[N][1] +
              " " +
              O.v[N][0] +
              "," +
              O.v[N][1];
          if (
            (O.c &&
              G > 1 &&
              (z +=
                " C" +
                O.o[N - 1][0] +
                "," +
                O.o[N - 1][1] +
                " " +
                O.i[0][0] +
                "," +
                O.i[0][1] +
                " " +
                O.v[0][0] +
                "," +
                O.v[0][1]),
            B.lastPath !== z)
          ) {
            var H = "";
            (B.elem &&
              (O.c && (H = V.inv ? this.solidPath + z : z),
              B.elem.setAttribute("d", H)),
              (B.lastPath = z));
          }
        }),
        (MaskElement.prototype.destroy = function () {
          ((this.element = null),
            (this.globalData = null),
            (this.maskElement = null),
            (this.data = null),
            (this.masksProperties = null));
        }));
      var filtersFactory = (function () {
          var V = {};
          ((V.createFilter = O), (V.createAlphaToLuminanceFilter = B));
          function O(z, N) {
            var G = createNS("filter");
            return (
              G.setAttribute("id", z),
              N !== !0 &&
                (G.setAttribute("filterUnits", "objectBoundingBox"),
                G.setAttribute("x", "0%"),
                G.setAttribute("y", "0%"),
                G.setAttribute("width", "100%"),
                G.setAttribute("height", "100%")),
              G
            );
          }
          function B() {
            var z = createNS("feColorMatrix");
            return (
              z.setAttribute("type", "matrix"),
              z.setAttribute("color-interpolation-filters", "sRGB"),
              z.setAttribute(
                "values",
                "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1",
              ),
              z
            );
          }
          return V;
        })(),
        featureSupport = (function () {
          var V = {
            maskType: !0,
            svgLumaHidden: !0,
            offscreenCanvas: typeof OffscreenCanvas < "u",
          };
          return (
            (/MSIE 10/i.test(navigator.userAgent) ||
              /MSIE 9/i.test(navigator.userAgent) ||
              /rv:11.0/i.test(navigator.userAgent) ||
              /Edge\/\d./i.test(navigator.userAgent)) &&
              (V.maskType = !1),
            /firefox/i.test(navigator.userAgent) && (V.svgLumaHidden = !1),
            V
          );
        })(),
        registeredEffects$1 = {},
        idPrefix = "filter_result_";
      function SVGEffects(V) {
        var O,
          B = "SourceGraphic",
          z = V.data.ef ? V.data.ef.length : 0,
          N = createElementID(),
          G = filtersFactory.createFilter(N, !0),
          H = 0;
        this.filters = [];
        var W;
        for (O = 0; O < z; O += 1) {
          W = null;
          var q = V.data.ef[O].ty;
          if (registeredEffects$1[q]) {
            var j = registeredEffects$1[q].effect;
            ((W = new j(
              G,
              V.effectsManager.effectElements[O],
              V,
              idPrefix + H,
              B,
            )),
              (B = idPrefix + H),
              registeredEffects$1[q].countsAsEffect && (H += 1));
          }
          W && this.filters.push(W);
        }
        (H &&
          (V.globalData.defs.appendChild(G),
          V.layerElement.setAttribute(
            "filter",
            "url(" + getLocationHref() + "#" + N + ")",
          )),
          this.filters.length && V.addRenderableComponent(this));
      }
      ((SVGEffects.prototype.renderFrame = function (V) {
        var O,
          B = this.filters.length;
        for (O = 0; O < B; O += 1) this.filters[O].renderFrame(V);
      }),
        (SVGEffects.prototype.getEffects = function (V) {
          var O,
            B = this.filters.length,
            z = [];
          for (O = 0; O < B; O += 1)
            this.filters[O].type === V && z.push(this.filters[O]);
          return z;
        }));
      function registerEffect$1(V, O, B) {
        registeredEffects$1[V] = { effect: O, countsAsEffect: B };
      }
      function SVGBaseElement() {}
      SVGBaseElement.prototype = {
        initRendererElement: function () {
          this.layerElement = createNS("g");
        },
        createContainerElements: function () {
          ((this.matteElement = createNS("g")),
            (this.transformedElement = this.layerElement),
            (this.maskedElement = this.layerElement),
            (this._sizeChanged = !1));
          var O = null;
          if (this.data.td) {
            this.matteMasks = {};
            var B = createNS("g");
            (B.setAttribute("id", this.layerId),
              B.appendChild(this.layerElement),
              (O = B),
              this.globalData.defs.appendChild(B));
          } else
            this.data.tt
              ? (this.matteElement.appendChild(this.layerElement),
                (O = this.matteElement),
                (this.baseElement = this.matteElement))
              : (this.baseElement = this.layerElement);
          if (
            (this.data.ln && this.layerElement.setAttribute("id", this.data.ln),
            this.data.cl &&
              this.layerElement.setAttribute("class", this.data.cl),
            this.data.ty === 0 && !this.data.hd)
          ) {
            var z = createNS("clipPath"),
              N = createNS("path");
            N.setAttribute(
              "d",
              "M0,0 L" +
                this.data.w +
                ",0 L" +
                this.data.w +
                "," +
                this.data.h +
                " L0," +
                this.data.h +
                "z",
            );
            var G = createElementID();
            if (
              (z.setAttribute("id", G),
              z.appendChild(N),
              this.globalData.defs.appendChild(z),
              this.checkMasks())
            ) {
              var H = createNS("g");
              (H.setAttribute(
                "clip-path",
                "url(" + getLocationHref() + "#" + G + ")",
              ),
                H.appendChild(this.layerElement),
                (this.transformedElement = H),
                O
                  ? O.appendChild(this.transformedElement)
                  : (this.baseElement = this.transformedElement));
            } else
              this.layerElement.setAttribute(
                "clip-path",
                "url(" + getLocationHref() + "#" + G + ")",
              );
          }
          this.data.bm !== 0 && this.setBlendMode();
        },
        renderElement: function () {
          (this.finalTransform._localMatMdf &&
            this.transformedElement.setAttribute(
              "transform",
              this.finalTransform.localMat.to2dCSS(),
            ),
            this.finalTransform._opMdf &&
              this.transformedElement.setAttribute(
                "opacity",
                this.finalTransform.localOpacity,
              ));
        },
        destroyBaseElement: function () {
          ((this.layerElement = null),
            (this.matteElement = null),
            this.maskManager.destroy());
        },
        getBaseElement: function () {
          return this.data.hd ? null : this.baseElement;
        },
        createRenderableComponents: function () {
          ((this.maskManager = new MaskElement(
            this.data,
            this,
            this.globalData,
          )),
            (this.renderableEffectsManager = new SVGEffects(this)),
            this.searchEffectTransforms());
        },
        getMatte: function (O) {
          if (
            (this.matteMasks || (this.matteMasks = {}), !this.matteMasks[O])
          ) {
            var B = this.layerId + "_" + O,
              z,
              N,
              G,
              H;
            if (O === 1 || O === 3) {
              var W = createNS("mask");
              (W.setAttribute("id", B),
                W.setAttribute("mask-type", O === 3 ? "luminance" : "alpha"),
                (G = createNS("use")),
                G.setAttributeNS(
                  "http://www.w3.org/1999/xlink",
                  "href",
                  "#" + this.layerId,
                ),
                W.appendChild(G),
                this.globalData.defs.appendChild(W),
                !featureSupport.maskType &&
                  O === 1 &&
                  (W.setAttribute("mask-type", "luminance"),
                  (z = createElementID()),
                  (N = filtersFactory.createFilter(z)),
                  this.globalData.defs.appendChild(N),
                  N.appendChild(filtersFactory.createAlphaToLuminanceFilter()),
                  (H = createNS("g")),
                  H.appendChild(G),
                  W.appendChild(H),
                  H.setAttribute(
                    "filter",
                    "url(" + getLocationHref() + "#" + z + ")",
                  )));
            } else if (O === 2) {
              var q = createNS("mask");
              (q.setAttribute("id", B), q.setAttribute("mask-type", "alpha"));
              var j = createNS("g");
              (q.appendChild(j),
                (z = createElementID()),
                (N = filtersFactory.createFilter(z)));
              var Y = createNS("feComponentTransfer");
              (Y.setAttribute("in", "SourceGraphic"), N.appendChild(Y));
              var re = createNS("feFuncA");
              (re.setAttribute("type", "table"),
                re.setAttribute("tableValues", "1.0 0.0"),
                Y.appendChild(re),
                this.globalData.defs.appendChild(N));
              var U = createNS("rect");
              (U.setAttribute("width", this.comp.data.w),
                U.setAttribute("height", this.comp.data.h),
                U.setAttribute("x", "0"),
                U.setAttribute("y", "0"),
                U.setAttribute("fill", "#ffffff"),
                U.setAttribute("opacity", "0"),
                j.setAttribute(
                  "filter",
                  "url(" + getLocationHref() + "#" + z + ")",
                ),
                j.appendChild(U),
                (G = createNS("use")),
                G.setAttributeNS(
                  "http://www.w3.org/1999/xlink",
                  "href",
                  "#" + this.layerId,
                ),
                j.appendChild(G),
                featureSupport.maskType ||
                  (q.setAttribute("mask-type", "luminance"),
                  N.appendChild(filtersFactory.createAlphaToLuminanceFilter()),
                  (H = createNS("g")),
                  j.appendChild(U),
                  H.appendChild(this.layerElement),
                  j.appendChild(H)),
                this.globalData.defs.appendChild(q));
            }
            this.matteMasks[O] = B;
          }
          return this.matteMasks[O];
        },
        setMatte: function (O) {
          this.matteElement &&
            this.matteElement.setAttribute(
              "mask",
              "url(" + getLocationHref() + "#" + O + ")",
            );
        },
      };
      function HierarchyElement() {}
      HierarchyElement.prototype = {
        initHierarchy: function () {
          ((this.hierarchy = []), (this._isParent = !1), this.checkParenting());
        },
        setHierarchy: function (O) {
          this.hierarchy = O;
        },
        setAsParent: function () {
          this._isParent = !0;
        },
        checkParenting: function () {
          this.data.parent !== void 0 &&
            this.comp.buildElementParenting(this, this.data.parent, []);
        },
      };
      function RenderableDOMElement() {}
      (function () {
        var V = {
          initElement: function (B, z, N) {
            (this.initFrame(),
              this.initBaseData(B, z, N),
              this.initTransform(B, z, N),
              this.initHierarchy(),
              this.initRenderable(),
              this.initRendererElement(),
              this.createContainerElements(),
              this.createRenderableComponents(),
              this.createContent(),
              this.hide());
          },
          hide: function () {
            if (!this.hidden && (!this.isInRange || this.isTransparent)) {
              var B = this.baseElement || this.layerElement;
              ((B.style.display = "none"), (this.hidden = !0));
            }
          },
          show: function () {
            if (this.isInRange && !this.isTransparent) {
              if (!this.data.hd) {
                var B = this.baseElement || this.layerElement;
                B.style.display = "block";
              }
              ((this.hidden = !1), (this._isFirstFrame = !0));
            }
          },
          renderFrame: function () {
            this.data.hd ||
              this.hidden ||
              (this.renderTransform(),
              this.renderRenderable(),
              this.renderLocalTransform(),
              this.renderElement(),
              this.renderInnerContent(),
              this._isFirstFrame && (this._isFirstFrame = !1));
          },
          renderInnerContent: function () {},
          prepareFrame: function (B) {
            ((this._mdf = !1),
              this.prepareRenderableFrame(B),
              this.prepareProperties(B, this.isInRange),
              this.checkTransparency());
          },
          destroy: function () {
            ((this.innerElem = null), this.destroyBaseElement());
          },
        };
        extendPrototype(
          [RenderableElement, createProxyFunction(V)],
          RenderableDOMElement,
        );
      })();
      function IImageElement(V, O, B) {
        ((this.assetData = O.getAssetData(V.refId)),
          this.assetData &&
            this.assetData.sid &&
            (this.assetData = O.slotManager.getProp(this.assetData)),
          this.initElement(V, O, B),
          (this.sourceRect = {
            top: 0,
            left: 0,
            width: this.assetData.w,
            height: this.assetData.h,
          }));
      }
      (extendPrototype(
        [
          BaseElement,
          TransformElement,
          SVGBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
        ],
        IImageElement,
      ),
        (IImageElement.prototype.createContent = function () {
          var V = this.globalData.getAssetsPath(this.assetData);
          ((this.innerElem = createNS("image")),
            this.innerElem.setAttribute("width", this.assetData.w + "px"),
            this.innerElem.setAttribute("height", this.assetData.h + "px"),
            this.innerElem.setAttribute(
              "preserveAspectRatio",
              this.assetData.pr ||
                this.globalData.renderConfig.imagePreserveAspectRatio,
            ),
            this.innerElem.setAttributeNS(
              "http://www.w3.org/1999/xlink",
              "href",
              V,
            ),
            this.layerElement.appendChild(this.innerElem));
        }),
        (IImageElement.prototype.sourceRectAtTime = function () {
          return this.sourceRect;
        }));
      function ProcessedElement(V, O) {
        ((this.elem = V), (this.pos = O));
      }
      function IShapeElement() {}
      IShapeElement.prototype = {
        addShapeToModifiers: function (O) {
          var B,
            z = this.shapeModifiers.length;
          for (B = 0; B < z; B += 1) this.shapeModifiers[B].addShape(O);
        },
        isShapeInAnimatedModifiers: function (O) {
          for (var B = 0, z = this.shapeModifiers.length; B < z; )
            if (this.shapeModifiers[B].isAnimatedWithShape(O)) return !0;
          return !1;
        },
        renderModifiers: function () {
          if (this.shapeModifiers.length) {
            var O,
              B = this.shapes.length;
            for (O = 0; O < B; O += 1) this.shapes[O].sh.reset();
            B = this.shapeModifiers.length;
            var z;
            for (
              O = B - 1;
              O >= 0 &&
              ((z = this.shapeModifiers[O].processShapes(this._isFirstFrame)),
              !z);
              O -= 1
            );
          }
        },
        searchProcessedElement: function (O) {
          for (var B = this.processedElements, z = 0, N = B.length; z < N; ) {
            if (B[z].elem === O) return B[z].pos;
            z += 1;
          }
          return 0;
        },
        addProcessedElement: function (O, B) {
          for (var z = this.processedElements, N = z.length; N; )
            if (((N -= 1), z[N].elem === O)) {
              z[N].pos = B;
              return;
            }
          z.push(new ProcessedElement(O, B));
        },
        prepareFrame: function (O) {
          (this.prepareRenderableFrame(O),
            this.prepareProperties(O, this.isInRange));
        },
      };
      var lineCapEnum = { 1: "butt", 2: "round", 3: "square" },
        lineJoinEnum = { 1: "miter", 2: "round", 3: "bevel" };
      function SVGShapeData(V, O, B) {
        ((this.caches = []),
          (this.styles = []),
          (this.transformers = V),
          (this.lStr = ""),
          (this.sh = B),
          (this.lvl = O),
          (this._isAnimated = !!B.k));
        for (var z = 0, N = V.length; z < N; ) {
          if (V[z].mProps.dynamicProperties.length) {
            this._isAnimated = !0;
            break;
          }
          z += 1;
        }
      }
      SVGShapeData.prototype.setAsAnimated = function () {
        this._isAnimated = !0;
      };
      function SVGStyleData(V, O) {
        ((this.data = V),
          (this.type = V.ty),
          (this.d = ""),
          (this.lvl = O),
          (this._mdf = !1),
          (this.closed = V.hd === !0),
          (this.pElem = createNS("path")),
          (this.msElem = null));
      }
      SVGStyleData.prototype.reset = function () {
        ((this.d = ""), (this._mdf = !1));
      };
      function DashProperty(V, O, B, z) {
        ((this.elem = V),
          (this.frameId = -1),
          (this.dataProps = createSizedArray(O.length)),
          (this.renderer = B),
          (this.k = !1),
          (this.dashStr = ""),
          (this.dashArray = createTypedArray(
            "float32",
            O.length ? O.length - 1 : 0,
          )),
          (this.dashoffset = createTypedArray("float32", 1)),
          this.initDynamicPropertyContainer(z));
        var N,
          G = O.length || 0,
          H;
        for (N = 0; N < G; N += 1)
          ((H = PropertyFactory.getProp(V, O[N].v, 0, 0, this)),
            (this.k = H.k || this.k),
            (this.dataProps[N] = { n: O[N].n, p: H }));
        (this.k || this.getValue(!0), (this._isAnimated = this.k));
      }
      ((DashProperty.prototype.getValue = function (V) {
        if (
          !(this.elem.globalData.frameId === this.frameId && !V) &&
          ((this.frameId = this.elem.globalData.frameId),
          this.iterateDynamicProperties(),
          (this._mdf = this._mdf || V),
          this._mdf)
        ) {
          var O = 0,
            B = this.dataProps.length;
          for (
            this.renderer === "svg" && (this.dashStr = ""), O = 0;
            O < B;
            O += 1
          )
            this.dataProps[O].n !== "o"
              ? this.renderer === "svg"
                ? (this.dashStr += " " + this.dataProps[O].p.v)
                : (this.dashArray[O] = this.dataProps[O].p.v)
              : (this.dashoffset[0] = this.dataProps[O].p.v);
        }
      }),
        extendPrototype([DynamicPropertyContainer], DashProperty));
      function SVGStrokeStyleData(V, O, B) {
        (this.initDynamicPropertyContainer(V),
          (this.getValue = this.iterateDynamicProperties),
          (this.o = PropertyFactory.getProp(V, O.o, 0, 0.01, this)),
          (this.w = PropertyFactory.getProp(V, O.w, 0, null, this)),
          (this.d = new DashProperty(V, O.d || {}, "svg", this)),
          (this.c = PropertyFactory.getProp(V, O.c, 1, 255, this)),
          (this.style = B),
          (this._isAnimated = !!this._isAnimated));
      }
      extendPrototype([DynamicPropertyContainer], SVGStrokeStyleData);
      function SVGFillStyleData(V, O, B) {
        (this.initDynamicPropertyContainer(V),
          (this.getValue = this.iterateDynamicProperties),
          (this.o = PropertyFactory.getProp(V, O.o, 0, 0.01, this)),
          (this.c = PropertyFactory.getProp(V, O.c, 1, 255, this)),
          (this.style = B));
      }
      extendPrototype([DynamicPropertyContainer], SVGFillStyleData);
      function SVGNoStyleData(V, O, B) {
        (this.initDynamicPropertyContainer(V),
          (this.getValue = this.iterateDynamicProperties),
          (this.style = B));
      }
      extendPrototype([DynamicPropertyContainer], SVGNoStyleData);
      function GradientProperty(V, O, B) {
        ((this.data = O), (this.c = createTypedArray("uint8c", O.p * 4)));
        var z = O.k.k[0].s
          ? O.k.k[0].s.length - O.p * 4
          : O.k.k.length - O.p * 4;
        ((this.o = createTypedArray("float32", z)),
          (this._cmdf = !1),
          (this._omdf = !1),
          (this._collapsable = this.checkCollapsable()),
          (this._hasOpacity = z),
          this.initDynamicPropertyContainer(B),
          (this.prop = PropertyFactory.getProp(V, O.k, 1, null, this)),
          (this.k = this.prop.k),
          this.getValue(!0));
      }
      ((GradientProperty.prototype.comparePoints = function (V, O) {
        for (var B = 0, z = this.o.length / 2, N; B < z; ) {
          if (((N = Math.abs(V[B * 4] - V[O * 4 + B * 2])), N > 0.01))
            return !1;
          B += 1;
        }
        return !0;
      }),
        (GradientProperty.prototype.checkCollapsable = function () {
          if (this.o.length / 2 !== this.c.length / 4) return !1;
          if (this.data.k.k[0].s)
            for (var V = 0, O = this.data.k.k.length; V < O; ) {
              if (!this.comparePoints(this.data.k.k[V].s, this.data.p))
                return !1;
              V += 1;
            }
          else if (!this.comparePoints(this.data.k.k, this.data.p)) return !1;
          return !0;
        }),
        (GradientProperty.prototype.getValue = function (V) {
          if (
            (this.prop.getValue(),
            (this._mdf = !1),
            (this._cmdf = !1),
            (this._omdf = !1),
            this.prop._mdf || V)
          ) {
            var O,
              B = this.data.p * 4,
              z,
              N;
            for (O = 0; O < B; O += 1)
              ((z = O % 4 === 0 ? 100 : 255),
                (N = Math.round(this.prop.v[O] * z)),
                this.c[O] !== N && ((this.c[O] = N), (this._cmdf = !V)));
            if (this.o.length)
              for (B = this.prop.v.length, O = this.data.p * 4; O < B; O += 1)
                ((z = O % 2 === 0 ? 100 : 1),
                  (N =
                    O % 2 === 0
                      ? Math.round(this.prop.v[O] * 100)
                      : this.prop.v[O]),
                  this.o[O - this.data.p * 4] !== N &&
                    ((this.o[O - this.data.p * 4] = N), (this._omdf = !V)));
            this._mdf = !V;
          }
        }),
        extendPrototype([DynamicPropertyContainer], GradientProperty));
      function SVGGradientFillStyleData(V, O, B) {
        (this.initDynamicPropertyContainer(V),
          (this.getValue = this.iterateDynamicProperties),
          this.initGradientData(V, O, B));
      }
      ((SVGGradientFillStyleData.prototype.initGradientData = function (
        V,
        O,
        B,
      ) {
        ((this.o = PropertyFactory.getProp(V, O.o, 0, 0.01, this)),
          (this.s = PropertyFactory.getProp(V, O.s, 1, null, this)),
          (this.e = PropertyFactory.getProp(V, O.e, 1, null, this)),
          (this.h = PropertyFactory.getProp(V, O.h || { k: 0 }, 0, 0.01, this)),
          (this.a = PropertyFactory.getProp(
            V,
            O.a || { k: 0 },
            0,
            degToRads,
            this,
          )),
          (this.g = new GradientProperty(V, O.g, this)),
          (this.style = B),
          (this.stops = []),
          this.setGradientData(B.pElem, O),
          this.setGradientOpacity(O, B),
          (this._isAnimated = !!this._isAnimated));
      }),
        (SVGGradientFillStyleData.prototype.setGradientData = function (V, O) {
          var B = createElementID(),
            z = createNS(O.t === 1 ? "linearGradient" : "radialGradient");
          (z.setAttribute("id", B),
            z.setAttribute("spreadMethod", "pad"),
            z.setAttribute("gradientUnits", "userSpaceOnUse"));
          var N = [],
            G,
            H,
            W;
          for (W = O.g.p * 4, H = 0; H < W; H += 4)
            ((G = createNS("stop")), z.appendChild(G), N.push(G));
          (V.setAttribute(
            O.ty === "gf" ? "fill" : "stroke",
            "url(" + getLocationHref() + "#" + B + ")",
          ),
            (this.gf = z),
            (this.cst = N));
        }),
        (SVGGradientFillStyleData.prototype.setGradientOpacity = function (
          V,
          O,
        ) {
          if (this.g._hasOpacity && !this.g._collapsable) {
            var B,
              z,
              N,
              G = createNS("mask"),
              H = createNS("path");
            G.appendChild(H);
            var W = createElementID(),
              q = createElementID();
            G.setAttribute("id", q);
            var j = createNS(V.t === 1 ? "linearGradient" : "radialGradient");
            (j.setAttribute("id", W),
              j.setAttribute("spreadMethod", "pad"),
              j.setAttribute("gradientUnits", "userSpaceOnUse"),
              (N = V.g.k.k[0].s ? V.g.k.k[0].s.length : V.g.k.k.length));
            var Y = this.stops;
            for (z = V.g.p * 4; z < N; z += 2)
              ((B = createNS("stop")),
                B.setAttribute("stop-color", "rgb(255,255,255)"),
                j.appendChild(B),
                Y.push(B));
            (H.setAttribute(
              V.ty === "gf" ? "fill" : "stroke",
              "url(" + getLocationHref() + "#" + W + ")",
            ),
              V.ty === "gs" &&
                (H.setAttribute("stroke-linecap", lineCapEnum[V.lc || 2]),
                H.setAttribute("stroke-linejoin", lineJoinEnum[V.lj || 2]),
                V.lj === 1 && H.setAttribute("stroke-miterlimit", V.ml)),
              (this.of = j),
              (this.ms = G),
              (this.ost = Y),
              (this.maskId = q),
              (O.msElem = H));
          }
        }),
        extendPrototype([DynamicPropertyContainer], SVGGradientFillStyleData));
      function SVGGradientStrokeStyleData(V, O, B) {
        (this.initDynamicPropertyContainer(V),
          (this.getValue = this.iterateDynamicProperties),
          (this.w = PropertyFactory.getProp(V, O.w, 0, null, this)),
          (this.d = new DashProperty(V, O.d || {}, "svg", this)),
          this.initGradientData(V, O, B),
          (this._isAnimated = !!this._isAnimated));
      }
      extendPrototype(
        [SVGGradientFillStyleData, DynamicPropertyContainer],
        SVGGradientStrokeStyleData,
      );
      function ShapeGroupData() {
        ((this.it = []), (this.prevViewData = []), (this.gr = createNS("g")));
      }
      function SVGTransformData(V, O, B) {
        ((this.transform = { mProps: V, op: O, container: B }),
          (this.elements = []),
          (this._isAnimated =
            this.transform.mProps.dynamicProperties.length ||
            this.transform.op.effectsSequence.length));
      }
      var buildShapeString = function (O, B, z, N) {
          if (B === 0) return "";
          var G = O.o,
            H = O.i,
            W = O.v,
            q,
            j = " M" + N.applyToPointStringified(W[0][0], W[0][1]);
          for (q = 1; q < B; q += 1)
            j +=
              " C" +
              N.applyToPointStringified(G[q - 1][0], G[q - 1][1]) +
              " " +
              N.applyToPointStringified(H[q][0], H[q][1]) +
              " " +
              N.applyToPointStringified(W[q][0], W[q][1]);
          return (
            z &&
              B &&
              ((j +=
                " C" +
                N.applyToPointStringified(G[q - 1][0], G[q - 1][1]) +
                " " +
                N.applyToPointStringified(H[0][0], H[0][1]) +
                " " +
                N.applyToPointStringified(W[0][0], W[0][1])),
              (j += "z")),
            j
          );
        },
        SVGElementsRenderer = (function () {
          var V = new Matrix(),
            O = new Matrix(),
            B = { createRenderFunction: z };
          function z(re) {
            switch (re.ty) {
              case "fl":
                return W;
              case "gf":
                return j;
              case "gs":
                return q;
              case "st":
                return Y;
              case "sh":
              case "el":
              case "rc":
              case "sr":
                return H;
              case "tr":
                return N;
              case "no":
                return G;
              default:
                return null;
            }
          }
          function N(re, U, K) {
            ((K || U.transform.op._mdf) &&
              U.transform.container.setAttribute("opacity", U.transform.op.v),
              (K || U.transform.mProps._mdf) &&
                U.transform.container.setAttribute(
                  "transform",
                  U.transform.mProps.v.to2dCSS(),
                ));
          }
          function G() {}
          function H(re, U, K) {
            var Z,
              X,
              se,
              Q,
              te,
              J,
              ee = U.styles.length,
              ne = U.lvl,
              oe,
              he,
              ce,
              ue;
            for (J = 0; J < ee; J += 1) {
              if (((Q = U.sh._mdf || K), U.styles[J].lvl < ne)) {
                for (
                  he = O.reset(),
                    ce = ne - U.styles[J].lvl,
                    ue = U.transformers.length - 1;
                  !Q && ce > 0;
                )
                  ((Q = U.transformers[ue].mProps._mdf || Q),
                    (ce -= 1),
                    (ue -= 1));
                if (Q)
                  for (
                    ce = ne - U.styles[J].lvl, ue = U.transformers.length - 1;
                    ce > 0;
                  )
                    (he.multiply(U.transformers[ue].mProps.v),
                      (ce -= 1),
                      (ue -= 1));
              } else he = V;
              if (((oe = U.sh.paths), (X = oe._length), Q)) {
                for (se = "", Z = 0; Z < X; Z += 1)
                  ((te = oe.shapes[Z]),
                    te &&
                      te._length &&
                      (se += buildShapeString(te, te._length, te.c, he)));
                U.caches[J] = se;
              } else se = U.caches[J];
              ((U.styles[J].d += re.hd === !0 ? "" : se),
                (U.styles[J]._mdf = Q || U.styles[J]._mdf));
            }
          }
          function W(re, U, K) {
            var Z = U.style;
            ((U.c._mdf || K) &&
              Z.pElem.setAttribute(
                "fill",
                "rgb(" +
                  bmFloor(U.c.v[0]) +
                  "," +
                  bmFloor(U.c.v[1]) +
                  "," +
                  bmFloor(U.c.v[2]) +
                  ")",
              ),
              (U.o._mdf || K) && Z.pElem.setAttribute("fill-opacity", U.o.v));
          }
          function q(re, U, K) {
            (j(re, U, K), Y(re, U, K));
          }
          function j(re, U, K) {
            var Z = U.gf,
              X = U.g._hasOpacity,
              se = U.s.v,
              Q = U.e.v;
            if (U.o._mdf || K) {
              var te = re.ty === "gf" ? "fill-opacity" : "stroke-opacity";
              U.style.pElem.setAttribute(te, U.o.v);
            }
            if (U.s._mdf || K) {
              var J = re.t === 1 ? "x1" : "cx",
                ee = J === "x1" ? "y1" : "cy";
              (Z.setAttribute(J, se[0]),
                Z.setAttribute(ee, se[1]),
                X &&
                  !U.g._collapsable &&
                  (U.of.setAttribute(J, se[0]), U.of.setAttribute(ee, se[1])));
            }
            var ne, oe, he, ce;
            if (U.g._cmdf || K) {
              ne = U.cst;
              var ue = U.g.c;
              for (he = ne.length, oe = 0; oe < he; oe += 1)
                ((ce = ne[oe]),
                  ce.setAttribute("offset", ue[oe * 4] + "%"),
                  ce.setAttribute(
                    "stop-color",
                    "rgb(" +
                      ue[oe * 4 + 1] +
                      "," +
                      ue[oe * 4 + 2] +
                      "," +
                      ue[oe * 4 + 3] +
                      ")",
                  ));
            }
            if (X && (U.g._omdf || K)) {
              var ge = U.g.o;
              for (
                U.g._collapsable ? (ne = U.cst) : (ne = U.ost),
                  he = ne.length,
                  oe = 0;
                oe < he;
                oe += 1
              )
                ((ce = ne[oe]),
                  U.g._collapsable ||
                    ce.setAttribute("offset", ge[oe * 2] + "%"),
                  ce.setAttribute("stop-opacity", ge[oe * 2 + 1]));
            }
            if (re.t === 1)
              (U.e._mdf || K) &&
                (Z.setAttribute("x2", Q[0]),
                Z.setAttribute("y2", Q[1]),
                X &&
                  !U.g._collapsable &&
                  (U.of.setAttribute("x2", Q[0]),
                  U.of.setAttribute("y2", Q[1])));
            else {
              var ye;
              if (
                ((U.s._mdf || U.e._mdf || K) &&
                  ((ye = Math.sqrt(
                    Math.pow(se[0] - Q[0], 2) + Math.pow(se[1] - Q[1], 2),
                  )),
                  Z.setAttribute("r", ye),
                  X && !U.g._collapsable && U.of.setAttribute("r", ye)),
                U.e._mdf || U.h._mdf || U.a._mdf || K)
              ) {
                ye ||
                  (ye = Math.sqrt(
                    Math.pow(se[0] - Q[0], 2) + Math.pow(se[1] - Q[1], 2),
                  ));
                var me = Math.atan2(Q[1] - se[1], Q[0] - se[0]),
                  be = U.h.v;
                be >= 1 ? (be = 0.99) : be <= -1 && (be = -0.99);
                var Se = ye * be,
                  _e = Math.cos(me + U.a.v) * Se + se[0],
                  le = Math.sin(me + U.a.v) * Se + se[1];
                (Z.setAttribute("fx", _e),
                  Z.setAttribute("fy", le),
                  X &&
                    !U.g._collapsable &&
                    (U.of.setAttribute("fx", _e), U.of.setAttribute("fy", le)));
              }
            }
          }
          function Y(re, U, K) {
            var Z = U.style,
              X = U.d;
            (X &&
              (X._mdf || K) &&
              X.dashStr &&
              (Z.pElem.setAttribute("stroke-dasharray", X.dashStr),
              Z.pElem.setAttribute("stroke-dashoffset", X.dashoffset[0])),
              U.c &&
                (U.c._mdf || K) &&
                Z.pElem.setAttribute(
                  "stroke",
                  "rgb(" +
                    bmFloor(U.c.v[0]) +
                    "," +
                    bmFloor(U.c.v[1]) +
                    "," +
                    bmFloor(U.c.v[2]) +
                    ")",
                ),
              (U.o._mdf || K) && Z.pElem.setAttribute("stroke-opacity", U.o.v),
              (U.w._mdf || K) &&
                (Z.pElem.setAttribute("stroke-width", U.w.v),
                Z.msElem && Z.msElem.setAttribute("stroke-width", U.w.v)));
          }
          return B;
        })();
      function SVGShapeElement(V, O, B) {
        ((this.shapes = []),
          (this.shapesData = V.shapes),
          (this.stylesList = []),
          (this.shapeModifiers = []),
          (this.itemsData = []),
          (this.processedElements = []),
          (this.animatedContents = []),
          this.initElement(V, O, B),
          (this.prevViewData = []));
      }
      (extendPrototype(
        [
          BaseElement,
          TransformElement,
          SVGBaseElement,
          IShapeElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
        ],
        SVGShapeElement,
      ),
        (SVGShapeElement.prototype.initSecondaryElement = function () {}),
        (SVGShapeElement.prototype.identityMatrix = new Matrix()),
        (SVGShapeElement.prototype.buildExpressionInterface = function () {}),
        (SVGShapeElement.prototype.createContent = function () {
          (this.searchShapes(
            this.shapesData,
            this.itemsData,
            this.prevViewData,
            this.layerElement,
            0,
            [],
            !0,
          ),
            this.filterUniqueShapes());
        }),
        (SVGShapeElement.prototype.filterUniqueShapes = function () {
          var V,
            O = this.shapes.length,
            B,
            z,
            N = this.stylesList.length,
            G,
            H = [],
            W = !1;
          for (z = 0; z < N; z += 1) {
            for (
              G = this.stylesList[z], W = !1, H.length = 0, V = 0;
              V < O;
              V += 1
            )
              ((B = this.shapes[V]),
                B.styles.indexOf(G) !== -1 &&
                  (H.push(B), (W = B._isAnimated || W)));
            H.length > 1 && W && this.setShapesAsAnimated(H);
          }
        }),
        (SVGShapeElement.prototype.setShapesAsAnimated = function (V) {
          var O,
            B = V.length;
          for (O = 0; O < B; O += 1) V[O].setAsAnimated();
        }),
        (SVGShapeElement.prototype.createStyleElement = function (V, O) {
          var B,
            z = new SVGStyleData(V, O),
            N = z.pElem;
          if (V.ty === "st") B = new SVGStrokeStyleData(this, V, z);
          else if (V.ty === "fl") B = new SVGFillStyleData(this, V, z);
          else if (V.ty === "gf" || V.ty === "gs") {
            var G =
              V.ty === "gf"
                ? SVGGradientFillStyleData
                : SVGGradientStrokeStyleData;
            ((B = new G(this, V, z)),
              this.globalData.defs.appendChild(B.gf),
              B.maskId &&
                (this.globalData.defs.appendChild(B.ms),
                this.globalData.defs.appendChild(B.of),
                N.setAttribute(
                  "mask",
                  "url(" + getLocationHref() + "#" + B.maskId + ")",
                )));
          } else V.ty === "no" && (B = new SVGNoStyleData(this, V, z));
          return (
            (V.ty === "st" || V.ty === "gs") &&
              (N.setAttribute("stroke-linecap", lineCapEnum[V.lc || 2]),
              N.setAttribute("stroke-linejoin", lineJoinEnum[V.lj || 2]),
              N.setAttribute("fill-opacity", "0"),
              V.lj === 1 && N.setAttribute("stroke-miterlimit", V.ml)),
            V.r === 2 && N.setAttribute("fill-rule", "evenodd"),
            V.ln && N.setAttribute("id", V.ln),
            V.cl && N.setAttribute("class", V.cl),
            V.bm && (N.style["mix-blend-mode"] = getBlendMode(V.bm)),
            this.stylesList.push(z),
            this.addToAnimatedContents(V, B),
            B
          );
        }),
        (SVGShapeElement.prototype.createGroupElement = function (V) {
          var O = new ShapeGroupData();
          return (
            V.ln && O.gr.setAttribute("id", V.ln),
            V.cl && O.gr.setAttribute("class", V.cl),
            V.bm && (O.gr.style["mix-blend-mode"] = getBlendMode(V.bm)),
            O
          );
        }),
        (SVGShapeElement.prototype.createTransformElement = function (V, O) {
          var B = TransformPropertyFactory.getTransformProperty(this, V, this),
            z = new SVGTransformData(B, B.o, O);
          return (this.addToAnimatedContents(V, z), z);
        }),
        (SVGShapeElement.prototype.createShapeElement = function (V, O, B) {
          var z = 4;
          V.ty === "rc"
            ? (z = 5)
            : V.ty === "el"
              ? (z = 6)
              : V.ty === "sr" && (z = 7);
          var N = ShapePropertyFactory.getShapeProp(this, V, z, this),
            G = new SVGShapeData(O, B, N);
          return (
            this.shapes.push(G),
            this.addShapeToModifiers(G),
            this.addToAnimatedContents(V, G),
            G
          );
        }),
        (SVGShapeElement.prototype.addToAnimatedContents = function (V, O) {
          for (var B = 0, z = this.animatedContents.length; B < z; ) {
            if (this.animatedContents[B].element === O) return;
            B += 1;
          }
          this.animatedContents.push({
            fn: SVGElementsRenderer.createRenderFunction(V),
            element: O,
            data: V,
          });
        }),
        (SVGShapeElement.prototype.setElementStyles = function (V) {
          var O = V.styles,
            B,
            z = this.stylesList.length;
          for (B = 0; B < z; B += 1)
            this.stylesList[B].closed || O.push(this.stylesList[B]);
        }),
        (SVGShapeElement.prototype.reloadShapes = function () {
          this._isFirstFrame = !0;
          var V,
            O = this.itemsData.length;
          for (V = 0; V < O; V += 1) this.prevViewData[V] = this.itemsData[V];
          for (
            this.searchShapes(
              this.shapesData,
              this.itemsData,
              this.prevViewData,
              this.layerElement,
              0,
              [],
              !0,
            ),
              this.filterUniqueShapes(),
              O = this.dynamicProperties.length,
              V = 0;
            V < O;
            V += 1
          )
            this.dynamicProperties[V].getValue();
          this.renderModifiers();
        }),
        (SVGShapeElement.prototype.searchShapes = function (
          V,
          O,
          B,
          z,
          N,
          G,
          H,
        ) {
          var W = [].concat(G),
            q,
            j = V.length - 1,
            Y,
            re,
            U = [],
            K = [],
            Z,
            X,
            se;
          for (q = j; q >= 0; q -= 1) {
            if (
              ((se = this.searchProcessedElement(V[q])),
              se ? (O[q] = B[se - 1]) : (V[q]._render = H),
              V[q].ty === "fl" ||
                V[q].ty === "st" ||
                V[q].ty === "gf" ||
                V[q].ty === "gs" ||
                V[q].ty === "no")
            )
              (se
                ? (O[q].style.closed = !1)
                : (O[q] = this.createStyleElement(V[q], N)),
                V[q]._render &&
                  O[q].style.pElem.parentNode !== z &&
                  z.appendChild(O[q].style.pElem),
                U.push(O[q].style));
            else if (V[q].ty === "gr") {
              if (!se) O[q] = this.createGroupElement(V[q]);
              else
                for (re = O[q].it.length, Y = 0; Y < re; Y += 1)
                  O[q].prevViewData[Y] = O[q].it[Y];
              (this.searchShapes(
                V[q].it,
                O[q].it,
                O[q].prevViewData,
                O[q].gr,
                N + 1,
                W,
                H,
              ),
                V[q]._render &&
                  O[q].gr.parentNode !== z &&
                  z.appendChild(O[q].gr));
            } else
              V[q].ty === "tr"
                ? (se || (O[q] = this.createTransformElement(V[q], z)),
                  (Z = O[q].transform),
                  W.push(Z))
                : V[q].ty === "sh" ||
                    V[q].ty === "rc" ||
                    V[q].ty === "el" ||
                    V[q].ty === "sr"
                  ? (se || (O[q] = this.createShapeElement(V[q], W, N)),
                    this.setElementStyles(O[q]))
                  : V[q].ty === "tm" ||
                      V[q].ty === "rd" ||
                      V[q].ty === "ms" ||
                      V[q].ty === "pb" ||
                      V[q].ty === "zz" ||
                      V[q].ty === "op"
                    ? (se
                        ? ((X = O[q]), (X.closed = !1))
                        : ((X = ShapeModifiers.getModifier(V[q].ty)),
                          X.init(this, V[q]),
                          (O[q] = X),
                          this.shapeModifiers.push(X)),
                      K.push(X))
                    : V[q].ty === "rp" &&
                      (se
                        ? ((X = O[q]), (X.closed = !0))
                        : ((X = ShapeModifiers.getModifier(V[q].ty)),
                          (O[q] = X),
                          X.init(this, V, q, O),
                          this.shapeModifiers.push(X),
                          (H = !1)),
                      K.push(X));
            this.addProcessedElement(V[q], q + 1);
          }
          for (j = U.length, q = 0; q < j; q += 1) U[q].closed = !0;
          for (j = K.length, q = 0; q < j; q += 1) K[q].closed = !0;
        }),
        (SVGShapeElement.prototype.renderInnerContent = function () {
          this.renderModifiers();
          var V,
            O = this.stylesList.length;
          for (V = 0; V < O; V += 1) this.stylesList[V].reset();
          for (this.renderShape(), V = 0; V < O; V += 1)
            (this.stylesList[V]._mdf || this._isFirstFrame) &&
              (this.stylesList[V].msElem &&
                (this.stylesList[V].msElem.setAttribute(
                  "d",
                  this.stylesList[V].d,
                ),
                (this.stylesList[V].d = "M0 0" + this.stylesList[V].d)),
              this.stylesList[V].pElem.setAttribute(
                "d",
                this.stylesList[V].d || "M0 0",
              ));
        }),
        (SVGShapeElement.prototype.renderShape = function () {
          var V,
            O = this.animatedContents.length,
            B;
          for (V = 0; V < O; V += 1)
            ((B = this.animatedContents[V]),
              (this._isFirstFrame || B.element._isAnimated) &&
                B.data !== !0 &&
                B.fn(B.data, B.element, this._isFirstFrame));
        }),
        (SVGShapeElement.prototype.destroy = function () {
          (this.destroyBaseElement(),
            (this.shapesData = null),
            (this.itemsData = null));
        }));
      function LetterProps(V, O, B, z, N, G) {
        ((this.o = V),
          (this.sw = O),
          (this.sc = B),
          (this.fc = z),
          (this.m = N),
          (this.p = G),
          (this._mdf = { o: !0, sw: !!O, sc: !!B, fc: !!z, m: !0, p: !0 }));
      }
      LetterProps.prototype.update = function (V, O, B, z, N, G) {
        ((this._mdf.o = !1),
          (this._mdf.sw = !1),
          (this._mdf.sc = !1),
          (this._mdf.fc = !1),
          (this._mdf.m = !1),
          (this._mdf.p = !1));
        var H = !1;
        return (
          this.o !== V && ((this.o = V), (this._mdf.o = !0), (H = !0)),
          this.sw !== O && ((this.sw = O), (this._mdf.sw = !0), (H = !0)),
          this.sc !== B && ((this.sc = B), (this._mdf.sc = !0), (H = !0)),
          this.fc !== z && ((this.fc = z), (this._mdf.fc = !0), (H = !0)),
          this.m !== N && ((this.m = N), (this._mdf.m = !0), (H = !0)),
          G.length &&
            (this.p[0] !== G[0] ||
              this.p[1] !== G[1] ||
              this.p[4] !== G[4] ||
              this.p[5] !== G[5] ||
              this.p[12] !== G[12] ||
              this.p[13] !== G[13]) &&
            ((this.p = G), (this._mdf.p = !0), (H = !0)),
          H
        );
      };
      function TextProperty(V, O) {
        ((this._frameId = initialDefaultFrame),
          (this.pv = ""),
          (this.v = ""),
          (this.kf = !1),
          (this._isFirstFrame = !0),
          (this._mdf = !1),
          O.d && O.d.sid && (O.d = V.globalData.slotManager.getProp(O.d)),
          (this.data = O),
          (this.elem = V),
          (this.comp = this.elem.comp),
          (this.keysIndex = 0),
          (this.canResize = !1),
          (this.minimumFontSize = 1),
          (this.effectsSequence = []),
          (this.currentData = {
            ascent: 0,
            boxWidth: this.defaultBoxWidth,
            f: "",
            fStyle: "",
            fWeight: "",
            fc: "",
            j: "",
            justifyOffset: "",
            l: [],
            lh: 0,
            lineWidths: [],
            ls: "",
            of: "",
            s: "",
            sc: "",
            sw: 0,
            t: 0,
            tr: 0,
            sz: 0,
            ps: null,
            fillColorAnim: !1,
            strokeColorAnim: !1,
            strokeWidthAnim: !1,
            yOffset: 0,
            finalSize: 0,
            finalText: [],
            finalLineHeight: 0,
            __complete: !1,
          }),
          this.copyData(this.currentData, this.data.d.k[0].s),
          this.searchProperty() || this.completeTextData(this.currentData));
      }
      ((TextProperty.prototype.defaultBoxWidth = [0, 0]),
        (TextProperty.prototype.copyData = function (V, O) {
          for (var B in O)
            Object.prototype.hasOwnProperty.call(O, B) && (V[B] = O[B]);
          return V;
        }),
        (TextProperty.prototype.setCurrentData = function (V) {
          (V.__complete || this.completeTextData(V),
            (this.currentData = V),
            (this.currentData.boxWidth =
              this.currentData.boxWidth || this.defaultBoxWidth),
            (this._mdf = !0));
        }),
        (TextProperty.prototype.searchProperty = function () {
          return this.searchKeyframes();
        }),
        (TextProperty.prototype.searchKeyframes = function () {
          return (
            (this.kf = this.data.d.k.length > 1),
            this.kf && this.addEffect(this.getKeyframeValue.bind(this)),
            this.kf
          );
        }),
        (TextProperty.prototype.addEffect = function (V) {
          (this.effectsSequence.push(V), this.elem.addDynamicProperty(this));
        }),
        (TextProperty.prototype.getValue = function (V) {
          if (
            !(
              (this.elem.globalData.frameId === this.frameId ||
                !this.effectsSequence.length) &&
              !V
            )
          ) {
            this.currentData.t = this.data.d.k[this.keysIndex].s.t;
            var O = this.currentData,
              B = this.keysIndex;
            if (this.lock) {
              this.setCurrentData(this.currentData);
              return;
            }
            ((this.lock = !0), (this._mdf = !1));
            var z,
              N = this.effectsSequence.length,
              G = V || this.data.d.k[this.keysIndex].s;
            for (z = 0; z < N; z += 1)
              B !== this.keysIndex
                ? (G = this.effectsSequence[z](G, G.t))
                : (G = this.effectsSequence[z](this.currentData, G.t));
            (O !== G && this.setCurrentData(G),
              (this.v = this.currentData),
              (this.pv = this.v),
              (this.lock = !1),
              (this.frameId = this.elem.globalData.frameId));
          }
        }),
        (TextProperty.prototype.getKeyframeValue = function () {
          for (
            var V = this.data.d.k,
              O = this.elem.comp.renderedFrame,
              B = 0,
              z = V.length;
            B <= z - 1 && !(B === z - 1 || V[B + 1].t > O);
          )
            B += 1;
          return (
            this.keysIndex !== B && (this.keysIndex = B),
            this.data.d.k[this.keysIndex].s
          );
        }),
        (TextProperty.prototype.buildFinalText = function (V) {
          for (
            var O = [], B = 0, z = V.length, N, G, H = !1, W = !1, q = "";
            B < z;
          )
            ((H = W),
              (W = !1),
              (N = V.charCodeAt(B)),
              (q = V.charAt(B)),
              FontManager.isCombinedCharacter(N)
                ? (H = !0)
                : N >= 55296 && N <= 56319
                  ? FontManager.isRegionalFlag(V, B)
                    ? (q = V.substr(B, 14))
                    : ((G = V.charCodeAt(B + 1)),
                      G >= 56320 &&
                        G <= 57343 &&
                        (FontManager.isModifier(N, G)
                          ? ((q = V.substr(B, 2)), (H = !0))
                          : FontManager.isFlagEmoji(V.substr(B, 4))
                            ? (q = V.substr(B, 4))
                            : (q = V.substr(B, 2))))
                  : N > 56319
                    ? ((G = V.charCodeAt(B + 1)),
                      FontManager.isVariationSelector(N) && (H = !0))
                    : FontManager.isZeroWidthJoiner(N) && ((H = !0), (W = !0)),
              H ? ((O[O.length - 1] += q), (H = !1)) : O.push(q),
              (B += q.length));
          return O;
        }),
        (TextProperty.prototype.completeTextData = function (V) {
          V.__complete = !0;
          var O = this.elem.globalData.fontManager,
            B = this.data,
            z = [],
            N,
            G,
            H,
            W = 0,
            q,
            j = B.m.g,
            Y = 0,
            re = 0,
            U = 0,
            K = [],
            Z = 0,
            X = 0,
            se,
            Q,
            te = O.getFontByName(V.f),
            J,
            ee = 0,
            ne = getFontProperties(te);
          ((V.fWeight = ne.weight),
            (V.fStyle = ne.style),
            (V.finalSize = V.s),
            (V.finalText = this.buildFinalText(V.t)),
            (G = V.finalText.length),
            (V.finalLineHeight = V.lh));
          var oe = (V.tr / 1e3) * V.finalSize,
            he;
          if (V.sz)
            for (var ce = !0, ue = V.sz[0], ge = V.sz[1], ye, me; ce; ) {
              ((me = this.buildFinalText(V.t)),
                (ye = 0),
                (Z = 0),
                (G = me.length),
                (oe = (V.tr / 1e3) * V.finalSize));
              var be = -1;
              for (N = 0; N < G; N += 1)
                ((he = me[N].charCodeAt(0)),
                  (H = !1),
                  me[N] === " "
                    ? (be = N)
                    : (he === 13 || he === 3) &&
                      ((Z = 0),
                      (H = !0),
                      (ye += V.finalLineHeight || V.finalSize * 1.2)),
                  O.chars
                    ? ((J = O.getCharData(me[N], te.fStyle, te.fFamily)),
                      (ee = H ? 0 : (J.w * V.finalSize) / 100))
                    : (ee = O.measureText(me[N], V.f, V.finalSize)),
                  Z + ee > ue && me[N] !== " "
                    ? (be === -1 ? (G += 1) : (N = be),
                      (ye += V.finalLineHeight || V.finalSize * 1.2),
                      me.splice(N, be === N ? 1 : 0, "\r"),
                      (be = -1),
                      (Z = 0))
                    : ((Z += ee), (Z += oe)));
              ((ye += (te.ascent * V.finalSize) / 100),
                this.canResize && V.finalSize > this.minimumFontSize && ge < ye
                  ? ((V.finalSize -= 1),
                    (V.finalLineHeight = (V.finalSize * V.lh) / V.s))
                  : ((V.finalText = me), (G = V.finalText.length), (ce = !1)));
            }
          ((Z = -oe), (ee = 0));
          var Se = 0,
            _e;
          for (N = 0; N < G; N += 1)
            if (
              ((H = !1),
              (_e = V.finalText[N]),
              (he = _e.charCodeAt(0)),
              he === 13 || he === 3
                ? ((Se = 0),
                  K.push(Z),
                  (X = Z > X ? Z : X),
                  (Z = -2 * oe),
                  (q = ""),
                  (H = !0),
                  (U += 1))
                : (q = _e),
              O.chars
                ? ((J = O.getCharData(
                    _e,
                    te.fStyle,
                    O.getFontByName(V.f).fFamily,
                  )),
                  (ee = H ? 0 : (J.w * V.finalSize) / 100))
                : (ee = O.measureText(q, V.f, V.finalSize)),
              _e === " " ? (Se += ee + oe) : ((Z += ee + oe + Se), (Se = 0)),
              z.push({
                l: ee,
                an: ee,
                add: Y,
                n: H,
                anIndexes: [],
                val: q,
                line: U,
                animatorJustifyOffset: 0,
              }),
              j == 2)
            ) {
              if (((Y += ee), q === "" || q === " " || N === G - 1)) {
                for ((q === "" || q === " ") && (Y -= ee); re <= N; )
                  ((z[re].an = Y),
                    (z[re].ind = W),
                    (z[re].extra = ee),
                    (re += 1));
                ((W += 1), (Y = 0));
              }
            } else if (j == 3) {
              if (((Y += ee), q === "" || N === G - 1)) {
                for (q === "" && (Y -= ee); re <= N; )
                  ((z[re].an = Y),
                    (z[re].ind = W),
                    (z[re].extra = ee),
                    (re += 1));
                ((Y = 0), (W += 1));
              }
            } else ((z[W].ind = W), (z[W].extra = 0), (W += 1));
          if (((V.l = z), (X = Z > X ? Z : X), K.push(Z), V.sz))
            ((V.boxWidth = V.sz[0]), (V.justifyOffset = 0));
          else
            switch (((V.boxWidth = X), V.j)) {
              case 1:
                V.justifyOffset = -V.boxWidth;
                break;
              case 2:
                V.justifyOffset = -V.boxWidth / 2;
                break;
              default:
                V.justifyOffset = 0;
            }
          V.lineWidths = K;
          var le = B.a,
            pe,
            ie;
          Q = le.length;
          var ae,
            fe,
            de = [];
          for (se = 0; se < Q; se += 1) {
            for (
              pe = le[se],
                pe.a.sc && (V.strokeColorAnim = !0),
                pe.a.sw && (V.strokeWidthAnim = !0),
                (pe.a.fc || pe.a.fh || pe.a.fs || pe.a.fb) &&
                  (V.fillColorAnim = !0),
                fe = 0,
                ae = pe.s.b,
                N = 0;
              N < G;
              N += 1
            )
              ((ie = z[N]),
                (ie.anIndexes[se] = fe),
                ((ae == 1 && ie.val !== "") ||
                  (ae == 2 && ie.val !== "" && ie.val !== " ") ||
                  (ae == 3 && (ie.n || ie.val == " " || N == G - 1)) ||
                  (ae == 4 && (ie.n || N == G - 1))) &&
                  (pe.s.rn === 1 && de.push(fe), (fe += 1)));
            B.a[se].s.totalChars = fe;
            var xe = -1,
              we;
            if (pe.s.rn === 1)
              for (N = 0; N < G; N += 1)
                ((ie = z[N]),
                  xe != ie.anIndexes[se] &&
                    ((xe = ie.anIndexes[se]),
                    (we = de.splice(
                      Math.floor(Math.random() * de.length),
                      1,
                    )[0])),
                  (ie.anIndexes[se] = we));
          }
          ((V.yOffset = V.finalLineHeight || V.finalSize * 1.2),
            (V.ls = V.ls || 0),
            (V.ascent = (te.ascent * V.finalSize) / 100));
        }),
        (TextProperty.prototype.updateDocumentData = function (V, O) {
          O = O === void 0 ? this.keysIndex : O;
          var B = this.copyData({}, this.data.d.k[O].s);
          ((B = this.copyData(B, V)),
            (this.data.d.k[O].s = B),
            this.recalculate(O),
            this.setCurrentData(B),
            this.elem.addDynamicProperty(this));
        }),
        (TextProperty.prototype.recalculate = function (V) {
          var O = this.data.d.k[V].s;
          ((O.__complete = !1),
            (this.keysIndex = 0),
            (this._isFirstFrame = !0),
            this.getValue(O));
        }),
        (TextProperty.prototype.canResizeFont = function (V) {
          ((this.canResize = V),
            this.recalculate(this.keysIndex),
            this.elem.addDynamicProperty(this));
        }),
        (TextProperty.prototype.setMinimumFontSize = function (V) {
          ((this.minimumFontSize = Math.floor(V) || 1),
            this.recalculate(this.keysIndex),
            this.elem.addDynamicProperty(this));
        }));
      var TextSelectorProp = (function () {
        var V = Math.max,
          O = Math.min,
          B = Math.floor;
        function z(G, H) {
          ((this._currentTextLength = -1),
            (this.k = !1),
            (this.data = H),
            (this.elem = G),
            (this.comp = G.comp),
            (this.finalS = 0),
            (this.finalE = 0),
            this.initDynamicPropertyContainer(G),
            (this.s = PropertyFactory.getProp(G, H.s || { k: 0 }, 0, 0, this)),
            "e" in H
              ? (this.e = PropertyFactory.getProp(G, H.e, 0, 0, this))
              : (this.e = { v: 100 }),
            (this.o = PropertyFactory.getProp(G, H.o || { k: 0 }, 0, 0, this)),
            (this.xe = PropertyFactory.getProp(
              G,
              H.xe || { k: 0 },
              0,
              0,
              this,
            )),
            (this.ne = PropertyFactory.getProp(
              G,
              H.ne || { k: 0 },
              0,
              0,
              this,
            )),
            (this.sm = PropertyFactory.getProp(
              G,
              H.sm || { k: 100 },
              0,
              0,
              this,
            )),
            (this.a = PropertyFactory.getProp(G, H.a, 0, 0.01, this)),
            this.dynamicProperties.length || this.getValue());
        }
        ((z.prototype = {
          getMult: function (H) {
            this._currentTextLength !==
              this.elem.textProperty.currentData.l.length && this.getValue();
            var W = 0,
              q = 0,
              j = 1,
              Y = 1;
            (this.ne.v > 0 ? (W = this.ne.v / 100) : (q = -this.ne.v / 100),
              this.xe.v > 0
                ? (j = 1 - this.xe.v / 100)
                : (Y = 1 + this.xe.v / 100));
            var re = BezierFactory.getBezierEasing(W, q, j, Y).get,
              U = 0,
              K = this.finalS,
              Z = this.finalE,
              X = this.data.sh;
            if (X === 2)
              (Z === K
                ? (U = H >= Z ? 1 : 0)
                : (U = V(0, O(0.5 / (Z - K) + (H - K) / (Z - K), 1))),
                (U = re(U)));
            else if (X === 3)
              (Z === K
                ? (U = H >= Z ? 0 : 1)
                : (U = 1 - V(0, O(0.5 / (Z - K) + (H - K) / (Z - K), 1))),
                (U = re(U)));
            else if (X === 4)
              (Z === K
                ? (U = 0)
                : ((U = V(0, O(0.5 / (Z - K) + (H - K) / (Z - K), 1))),
                  U < 0.5 ? (U *= 2) : (U = 1 - 2 * (U - 0.5))),
                (U = re(U)));
            else if (X === 5) {
              if (Z === K) U = 0;
              else {
                var se = Z - K;
                H = O(V(0, H + 0.5 - K), Z - K);
                var Q = -se / 2 + H,
                  te = se / 2;
                U = Math.sqrt(1 - (Q * Q) / (te * te));
              }
              U = re(U);
            } else
              X === 6
                ? (Z === K
                    ? (U = 0)
                    : ((H = O(V(0, H + 0.5 - K), Z - K)),
                      (U =
                        (1 + Math.cos(Math.PI + (Math.PI * 2 * H) / (Z - K))) /
                        2)),
                  (U = re(U)))
                : (H >= B(K) &&
                    (H - K < 0
                      ? (U = V(0, O(O(Z, 1) - (K - H), 1)))
                      : (U = V(0, O(Z - H, 1)))),
                  (U = re(U)));
            if (this.sm.v !== 100) {
              var J = this.sm.v * 0.01;
              J === 0 && (J = 1e-8);
              var ee = 0.5 - J * 0.5;
              U < ee ? (U = 0) : ((U = (U - ee) / J), U > 1 && (U = 1));
            }
            return U * this.a.v;
          },
          getValue: function (H) {
            (this.iterateDynamicProperties(),
              (this._mdf = H || this._mdf),
              (this._currentTextLength =
                this.elem.textProperty.currentData.l.length || 0),
              H && this.data.r === 2 && (this.e.v = this._currentTextLength));
            var W = this.data.r === 2 ? 1 : 100 / this.data.totalChars,
              q = this.o.v / W,
              j = this.s.v / W + q,
              Y = this.e.v / W + q;
            if (j > Y) {
              var re = j;
              ((j = Y), (Y = re));
            }
            ((this.finalS = j), (this.finalE = Y));
          },
        }),
          extendPrototype([DynamicPropertyContainer], z));
        function N(G, H, W) {
          return new z(G, H);
        }
        return { getTextSelectorProp: N };
      })();
      function TextAnimatorDataProperty(V, O, B) {
        var z = { propType: !1 },
          N = PropertyFactory.getProp,
          G = O.a;
        ((this.a = {
          r: G.r ? N(V, G.r, 0, degToRads, B) : z,
          rx: G.rx ? N(V, G.rx, 0, degToRads, B) : z,
          ry: G.ry ? N(V, G.ry, 0, degToRads, B) : z,
          sk: G.sk ? N(V, G.sk, 0, degToRads, B) : z,
          sa: G.sa ? N(V, G.sa, 0, degToRads, B) : z,
          s: G.s ? N(V, G.s, 1, 0.01, B) : z,
          a: G.a ? N(V, G.a, 1, 0, B) : z,
          o: G.o ? N(V, G.o, 0, 0.01, B) : z,
          p: G.p ? N(V, G.p, 1, 0, B) : z,
          sw: G.sw ? N(V, G.sw, 0, 0, B) : z,
          sc: G.sc ? N(V, G.sc, 1, 0, B) : z,
          fc: G.fc ? N(V, G.fc, 1, 0, B) : z,
          fh: G.fh ? N(V, G.fh, 0, 0, B) : z,
          fs: G.fs ? N(V, G.fs, 0, 0.01, B) : z,
          fb: G.fb ? N(V, G.fb, 0, 0.01, B) : z,
          t: G.t ? N(V, G.t, 0, 0, B) : z,
        }),
          (this.s = TextSelectorProp.getTextSelectorProp(V, O.s, B)),
          (this.s.t = O.s.t));
      }
      function TextAnimatorProperty(V, O, B) {
        ((this._isFirstFrame = !0),
          (this._hasMaskedPath = !1),
          (this._frameId = -1),
          (this._textData = V),
          (this._renderType = O),
          (this._elem = B),
          (this._animatorsData = createSizedArray(this._textData.a.length)),
          (this._pathData = {}),
          (this._moreOptions = { alignment: {} }),
          (this.renderedLetters = []),
          (this.lettersChangedFlag = !1),
          this.initDynamicPropertyContainer(B));
      }
      ((TextAnimatorProperty.prototype.searchProperties = function () {
        var V,
          O = this._textData.a.length,
          B,
          z = PropertyFactory.getProp;
        for (V = 0; V < O; V += 1)
          ((B = this._textData.a[V]),
            (this._animatorsData[V] = new TextAnimatorDataProperty(
              this._elem,
              B,
              this,
            )));
        (this._textData.p && "m" in this._textData.p
          ? ((this._pathData = {
              a: z(this._elem, this._textData.p.a, 0, 0, this),
              f: z(this._elem, this._textData.p.f, 0, 0, this),
              l: z(this._elem, this._textData.p.l, 0, 0, this),
              r: z(this._elem, this._textData.p.r, 0, 0, this),
              p: z(this._elem, this._textData.p.p, 0, 0, this),
              m: this._elem.maskManager.getMaskProperty(this._textData.p.m),
            }),
            (this._hasMaskedPath = !0))
          : (this._hasMaskedPath = !1),
          (this._moreOptions.alignment = z(
            this._elem,
            this._textData.m.a,
            1,
            0,
            this,
          )));
      }),
        (TextAnimatorProperty.prototype.getMeasures = function (V, O) {
          if (
            ((this.lettersChangedFlag = O),
            !(
              !this._mdf &&
              !this._isFirstFrame &&
              !O &&
              (!this._hasMaskedPath || !this._pathData.m._mdf)
            ))
          ) {
            this._isFirstFrame = !1;
            var B = this._moreOptions.alignment.v,
              z = this._animatorsData,
              N = this._textData,
              G = this.mHelper,
              H = this._renderType,
              W = this.renderedLetters.length,
              q,
              j,
              Y,
              re,
              U = V.l,
              K,
              Z,
              X,
              se,
              Q,
              te,
              J,
              ee,
              ne,
              oe,
              he,
              ce,
              ue,
              ge,
              ye;
            if (this._hasMaskedPath) {
              if (
                ((ye = this._pathData.m),
                !this._pathData.n || this._pathData._mdf)
              ) {
                var me = ye.v;
                (this._pathData.r.v && (me = me.reverse()),
                  (K = { tLength: 0, segments: [] }),
                  (re = me._length - 1));
                var be;
                for (ce = 0, Y = 0; Y < re; Y += 1)
                  ((be = bez.buildBezierData(
                    me.v[Y],
                    me.v[Y + 1],
                    [me.o[Y][0] - me.v[Y][0], me.o[Y][1] - me.v[Y][1]],
                    [
                      me.i[Y + 1][0] - me.v[Y + 1][0],
                      me.i[Y + 1][1] - me.v[Y + 1][1],
                    ],
                  )),
                    (K.tLength += be.segmentLength),
                    K.segments.push(be),
                    (ce += be.segmentLength));
                ((Y = re),
                  ye.v.c &&
                    ((be = bez.buildBezierData(
                      me.v[Y],
                      me.v[0],
                      [me.o[Y][0] - me.v[Y][0], me.o[Y][1] - me.v[Y][1]],
                      [me.i[0][0] - me.v[0][0], me.i[0][1] - me.v[0][1]],
                    )),
                    (K.tLength += be.segmentLength),
                    K.segments.push(be),
                    (ce += be.segmentLength)),
                  (this._pathData.pi = K));
              }
              if (
                ((K = this._pathData.pi),
                (Z = this._pathData.f.v),
                (J = 0),
                (te = 1),
                (se = 0),
                (Q = !0),
                (oe = K.segments),
                Z < 0 && ye.v.c)
              )
                for (
                  K.tLength < Math.abs(Z) && (Z = -Math.abs(Z) % K.tLength),
                    J = oe.length - 1,
                    ne = oe[J].points,
                    te = ne.length - 1;
                  Z < 0;
                )
                  ((Z += ne[te].partialLength),
                    (te -= 1),
                    te < 0 &&
                      ((J -= 1), (ne = oe[J].points), (te = ne.length - 1)));
              ((ne = oe[J].points),
                (ee = ne[te - 1]),
                (X = ne[te]),
                (he = X.partialLength));
            }
            ((re = U.length), (q = 0), (j = 0));
            var Se = V.finalSize * 1.2 * 0.714,
              _e = !0,
              le,
              pe,
              ie,
              ae,
              fe;
            ae = z.length;
            var de,
              xe = -1,
              we,
              Ee,
              Me,
              Ie = Z,
              Oe = J,
              Ge = te,
              We = -1,
              Ze,
              ze,
              Ye,
              Ae,
              Pe,
              Ue,
              Qe,
              ve,
              Xe = "",
              st = this.defaultPropsArray,
              at;
            if (V.j === 2 || V.j === 1) {
              var Be = 0,
                ht = 0,
                ut = V.j === 2 ? -0.5 : -1,
                ot = 0,
                qe = !0;
              for (Y = 0; Y < re; Y += 1)
                if (U[Y].n) {
                  for (Be && (Be += ht); ot < Y; )
                    ((U[ot].animatorJustifyOffset = Be), (ot += 1));
                  ((Be = 0), (qe = !0));
                } else {
                  for (ie = 0; ie < ae; ie += 1)
                    ((le = z[ie].a),
                      le.t.propType &&
                        (qe && V.j === 2 && (ht += le.t.v * ut),
                        (pe = z[ie].s),
                        (de = pe.getMult(
                          U[Y].anIndexes[ie],
                          N.a[ie].s.totalChars,
                        )),
                        de.length
                          ? (Be += le.t.v * de[0] * ut)
                          : (Be += le.t.v * de * ut)));
                  qe = !1;
                }
              for (Be && (Be += ht); ot < Y; )
                ((U[ot].animatorJustifyOffset = Be), (ot += 1));
            }
            for (Y = 0; Y < re; Y += 1) {
              if ((G.reset(), (Ze = 1), U[Y].n))
                ((q = 0),
                  (j += V.yOffset),
                  (j += _e ? 1 : 0),
                  (Z = Ie),
                  (_e = !1),
                  this._hasMaskedPath &&
                    ((J = Oe),
                    (te = Ge),
                    (ne = oe[J].points),
                    (ee = ne[te - 1]),
                    (X = ne[te]),
                    (he = X.partialLength),
                    (se = 0)),
                  (Xe = ""),
                  (ve = ""),
                  (Ue = ""),
                  (at = ""),
                  (st = this.defaultPropsArray));
              else {
                if (this._hasMaskedPath) {
                  if (We !== U[Y].line) {
                    switch (V.j) {
                      case 1:
                        Z += ce - V.lineWidths[U[Y].line];
                        break;
                      case 2:
                        Z += (ce - V.lineWidths[U[Y].line]) / 2;
                        break;
                    }
                    We = U[Y].line;
                  }
                  (xe !== U[Y].ind &&
                    (U[xe] && (Z += U[xe].extra),
                    (Z += U[Y].an / 2),
                    (xe = U[Y].ind)),
                    (Z += B[0] * U[Y].an * 0.005));
                  var rt = 0;
                  for (ie = 0; ie < ae; ie += 1)
                    ((le = z[ie].a),
                      le.p.propType &&
                        ((pe = z[ie].s),
                        (de = pe.getMult(
                          U[Y].anIndexes[ie],
                          N.a[ie].s.totalChars,
                        )),
                        de.length
                          ? (rt += le.p.v[0] * de[0])
                          : (rt += le.p.v[0] * de)),
                      le.a.propType &&
                        ((pe = z[ie].s),
                        (de = pe.getMult(
                          U[Y].anIndexes[ie],
                          N.a[ie].s.totalChars,
                        )),
                        de.length
                          ? (rt += le.a.v[0] * de[0])
                          : (rt += le.a.v[0] * de)));
                  for (
                    Q = !0,
                      this._pathData.a.v &&
                        ((Z =
                          U[0].an * 0.5 +
                          ((ce -
                            this._pathData.f.v -
                            U[0].an * 0.5 -
                            U[U.length - 1].an * 0.5) *
                            xe) /
                            (re - 1)),
                        (Z += this._pathData.f.v));
                    Q;
                  )
                    se + he >= Z + rt || !ne
                      ? ((ue = (Z + rt - se) / X.partialLength),
                        (Ee = ee.point[0] + (X.point[0] - ee.point[0]) * ue),
                        (Me = ee.point[1] + (X.point[1] - ee.point[1]) * ue),
                        G.translate(
                          -B[0] * U[Y].an * 0.005,
                          -(B[1] * Se) * 0.01,
                        ),
                        (Q = !1))
                      : ne &&
                        ((se += X.partialLength),
                        (te += 1),
                        te >= ne.length &&
                          ((te = 0),
                          (J += 1),
                          oe[J]
                            ? (ne = oe[J].points)
                            : ye.v.c
                              ? ((te = 0), (J = 0), (ne = oe[J].points))
                              : ((se -= X.partialLength), (ne = null))),
                        ne && ((ee = X), (X = ne[te]), (he = X.partialLength)));
                  ((we = U[Y].an / 2 - U[Y].add), G.translate(-we, 0, 0));
                } else
                  ((we = U[Y].an / 2 - U[Y].add),
                    G.translate(-we, 0, 0),
                    G.translate(-B[0] * U[Y].an * 0.005, -B[1] * Se * 0.01, 0));
                for (ie = 0; ie < ae; ie += 1)
                  ((le = z[ie].a),
                    le.t.propType &&
                      ((pe = z[ie].s),
                      (de = pe.getMult(
                        U[Y].anIndexes[ie],
                        N.a[ie].s.totalChars,
                      )),
                      (q !== 0 || V.j !== 0) &&
                        (this._hasMaskedPath
                          ? de.length
                            ? (Z += le.t.v * de[0])
                            : (Z += le.t.v * de)
                          : de.length
                            ? (q += le.t.v * de[0])
                            : (q += le.t.v * de))));
                for (
                  V.strokeWidthAnim && (Ye = V.sw || 0),
                    V.strokeColorAnim &&
                      (V.sc
                        ? (ze = [V.sc[0], V.sc[1], V.sc[2]])
                        : (ze = [0, 0, 0])),
                    V.fillColorAnim &&
                      V.fc &&
                      (Ae = [V.fc[0], V.fc[1], V.fc[2]]),
                    ie = 0;
                  ie < ae;
                  ie += 1
                )
                  ((le = z[ie].a),
                    le.a.propType &&
                      ((pe = z[ie].s),
                      (de = pe.getMult(
                        U[Y].anIndexes[ie],
                        N.a[ie].s.totalChars,
                      )),
                      de.length
                        ? G.translate(
                            -le.a.v[0] * de[0],
                            -le.a.v[1] * de[1],
                            le.a.v[2] * de[2],
                          )
                        : G.translate(
                            -le.a.v[0] * de,
                            -le.a.v[1] * de,
                            le.a.v[2] * de,
                          )));
                for (ie = 0; ie < ae; ie += 1)
                  ((le = z[ie].a),
                    le.s.propType &&
                      ((pe = z[ie].s),
                      (de = pe.getMult(
                        U[Y].anIndexes[ie],
                        N.a[ie].s.totalChars,
                      )),
                      de.length
                        ? G.scale(
                            1 + (le.s.v[0] - 1) * de[0],
                            1 + (le.s.v[1] - 1) * de[1],
                            1,
                          )
                        : G.scale(
                            1 + (le.s.v[0] - 1) * de,
                            1 + (le.s.v[1] - 1) * de,
                            1,
                          )));
                for (ie = 0; ie < ae; ie += 1) {
                  if (
                    ((le = z[ie].a),
                    (pe = z[ie].s),
                    (de = pe.getMult(U[Y].anIndexes[ie], N.a[ie].s.totalChars)),
                    le.sk.propType &&
                      (de.length
                        ? G.skewFromAxis(-le.sk.v * de[0], le.sa.v * de[1])
                        : G.skewFromAxis(-le.sk.v * de, le.sa.v * de)),
                    le.r.propType &&
                      (de.length
                        ? G.rotateZ(-le.r.v * de[2])
                        : G.rotateZ(-le.r.v * de)),
                    le.ry.propType &&
                      (de.length
                        ? G.rotateY(le.ry.v * de[1])
                        : G.rotateY(le.ry.v * de)),
                    le.rx.propType &&
                      (de.length
                        ? G.rotateX(le.rx.v * de[0])
                        : G.rotateX(le.rx.v * de)),
                    le.o.propType &&
                      (de.length
                        ? (Ze += (le.o.v * de[0] - Ze) * de[0])
                        : (Ze += (le.o.v * de - Ze) * de)),
                    V.strokeWidthAnim &&
                      le.sw.propType &&
                      (de.length
                        ? (Ye += le.sw.v * de[0])
                        : (Ye += le.sw.v * de)),
                    V.strokeColorAnim && le.sc.propType)
                  )
                    for (Pe = 0; Pe < 3; Pe += 1)
                      de.length
                        ? (ze[Pe] += (le.sc.v[Pe] - ze[Pe]) * de[0])
                        : (ze[Pe] += (le.sc.v[Pe] - ze[Pe]) * de);
                  if (V.fillColorAnim && V.fc) {
                    if (le.fc.propType)
                      for (Pe = 0; Pe < 3; Pe += 1)
                        de.length
                          ? (Ae[Pe] += (le.fc.v[Pe] - Ae[Pe]) * de[0])
                          : (Ae[Pe] += (le.fc.v[Pe] - Ae[Pe]) * de);
                    (le.fh.propType &&
                      (de.length
                        ? (Ae = addHueToRGB(Ae, le.fh.v * de[0]))
                        : (Ae = addHueToRGB(Ae, le.fh.v * de))),
                      le.fs.propType &&
                        (de.length
                          ? (Ae = addSaturationToRGB(Ae, le.fs.v * de[0]))
                          : (Ae = addSaturationToRGB(Ae, le.fs.v * de))),
                      le.fb.propType &&
                        (de.length
                          ? (Ae = addBrightnessToRGB(Ae, le.fb.v * de[0]))
                          : (Ae = addBrightnessToRGB(Ae, le.fb.v * de))));
                  }
                }
                for (ie = 0; ie < ae; ie += 1)
                  ((le = z[ie].a),
                    le.p.propType &&
                      ((pe = z[ie].s),
                      (de = pe.getMult(
                        U[Y].anIndexes[ie],
                        N.a[ie].s.totalChars,
                      )),
                      this._hasMaskedPath
                        ? de.length
                          ? G.translate(
                              0,
                              le.p.v[1] * de[0],
                              -le.p.v[2] * de[1],
                            )
                          : G.translate(0, le.p.v[1] * de, -le.p.v[2] * de)
                        : de.length
                          ? G.translate(
                              le.p.v[0] * de[0],
                              le.p.v[1] * de[1],
                              -le.p.v[2] * de[2],
                            )
                          : G.translate(
                              le.p.v[0] * de,
                              le.p.v[1] * de,
                              -le.p.v[2] * de,
                            )));
                if (
                  (V.strokeWidthAnim && (Ue = Ye < 0 ? 0 : Ye),
                  V.strokeColorAnim &&
                    (Qe =
                      "rgb(" +
                      Math.round(ze[0] * 255) +
                      "," +
                      Math.round(ze[1] * 255) +
                      "," +
                      Math.round(ze[2] * 255) +
                      ")"),
                  V.fillColorAnim &&
                    V.fc &&
                    (ve =
                      "rgb(" +
                      Math.round(Ae[0] * 255) +
                      "," +
                      Math.round(Ae[1] * 255) +
                      "," +
                      Math.round(Ae[2] * 255) +
                      ")"),
                  this._hasMaskedPath)
                ) {
                  if (
                    (G.translate(0, -V.ls),
                    G.translate(0, B[1] * Se * 0.01 + j, 0),
                    this._pathData.p.v)
                  ) {
                    ge =
                      (X.point[1] - ee.point[1]) / (X.point[0] - ee.point[0]);
                    var He = (Math.atan(ge) * 180) / Math.PI;
                    (X.point[0] < ee.point[0] && (He += 180),
                      G.rotate((-He * Math.PI) / 180));
                  }
                  (G.translate(Ee, Me, 0),
                    (Z -= B[0] * U[Y].an * 0.005),
                    U[Y + 1] &&
                      xe !== U[Y + 1].ind &&
                      ((Z += U[Y].an / 2), (Z += V.tr * 0.001 * V.finalSize)));
                } else {
                  switch (
                    (G.translate(q, j, 0),
                    V.ps && G.translate(V.ps[0], V.ps[1] + V.ascent, 0),
                    V.j)
                  ) {
                    case 1:
                      G.translate(
                        U[Y].animatorJustifyOffset +
                          V.justifyOffset +
                          (V.boxWidth - V.lineWidths[U[Y].line]),
                        0,
                        0,
                      );
                      break;
                    case 2:
                      G.translate(
                        U[Y].animatorJustifyOffset +
                          V.justifyOffset +
                          (V.boxWidth - V.lineWidths[U[Y].line]) / 2,
                        0,
                        0,
                      );
                      break;
                  }
                  (G.translate(0, -V.ls),
                    G.translate(we, 0, 0),
                    G.translate(B[0] * U[Y].an * 0.005, B[1] * Se * 0.01, 0),
                    (q += U[Y].l + V.tr * 0.001 * V.finalSize));
                }
                (H === "html"
                  ? (Xe = G.toCSS())
                  : H === "svg"
                    ? (Xe = G.to2dCSS())
                    : (st = [
                        G.props[0],
                        G.props[1],
                        G.props[2],
                        G.props[3],
                        G.props[4],
                        G.props[5],
                        G.props[6],
                        G.props[7],
                        G.props[8],
                        G.props[9],
                        G.props[10],
                        G.props[11],
                        G.props[12],
                        G.props[13],
                        G.props[14],
                        G.props[15],
                      ]),
                  (at = Ze));
              }
              W <= Y
                ? ((fe = new LetterProps(at, Ue, Qe, ve, Xe, st)),
                  this.renderedLetters.push(fe),
                  (W += 1),
                  (this.lettersChangedFlag = !0))
                : ((fe = this.renderedLetters[Y]),
                  (this.lettersChangedFlag =
                    fe.update(at, Ue, Qe, ve, Xe, st) ||
                    this.lettersChangedFlag));
            }
          }
        }),
        (TextAnimatorProperty.prototype.getValue = function () {
          this._elem.globalData.frameId !== this._frameId &&
            ((this._frameId = this._elem.globalData.frameId),
            this.iterateDynamicProperties());
        }),
        (TextAnimatorProperty.prototype.mHelper = new Matrix()),
        (TextAnimatorProperty.prototype.defaultPropsArray = []),
        extendPrototype([DynamicPropertyContainer], TextAnimatorProperty));
      function ITextElement() {}
      ((ITextElement.prototype.initElement = function (V, O, B) {
        ((this.lettersChangedFlag = !0),
          this.initFrame(),
          this.initBaseData(V, O, B),
          (this.textProperty = new TextProperty(
            this,
            V.t,
            this.dynamicProperties,
          )),
          (this.textAnimator = new TextAnimatorProperty(
            V.t,
            this.renderType,
            this,
          )),
          this.initTransform(V, O, B),
          this.initHierarchy(),
          this.initRenderable(),
          this.initRendererElement(),
          this.createContainerElements(),
          this.createRenderableComponents(),
          this.createContent(),
          this.hide(),
          this.textAnimator.searchProperties(this.dynamicProperties));
      }),
        (ITextElement.prototype.prepareFrame = function (V) {
          ((this._mdf = !1),
            this.prepareRenderableFrame(V),
            this.prepareProperties(V, this.isInRange));
        }),
        (ITextElement.prototype.createPathShape = function (V, O) {
          var B,
            z = O.length,
            N,
            G = "";
          for (B = 0; B < z; B += 1)
            O[B].ty === "sh" &&
              ((N = O[B].ks.k), (G += buildShapeString(N, N.i.length, !0, V)));
          return G;
        }),
        (ITextElement.prototype.updateDocumentData = function (V, O) {
          this.textProperty.updateDocumentData(V, O);
        }),
        (ITextElement.prototype.canResizeFont = function (V) {
          this.textProperty.canResizeFont(V);
        }),
        (ITextElement.prototype.setMinimumFontSize = function (V) {
          this.textProperty.setMinimumFontSize(V);
        }),
        (ITextElement.prototype.applyTextPropertiesToMatrix = function (
          V,
          O,
          B,
          z,
          N,
        ) {
          switch (
            (V.ps && O.translate(V.ps[0], V.ps[1] + V.ascent, 0),
            O.translate(0, -V.ls, 0),
            V.j)
          ) {
            case 1:
              O.translate(
                V.justifyOffset + (V.boxWidth - V.lineWidths[B]),
                0,
                0,
              );
              break;
            case 2:
              O.translate(
                V.justifyOffset + (V.boxWidth - V.lineWidths[B]) / 2,
                0,
                0,
              );
              break;
          }
          O.translate(z, N, 0);
        }),
        (ITextElement.prototype.buildColor = function (V) {
          return (
            "rgb(" +
            Math.round(V[0] * 255) +
            "," +
            Math.round(V[1] * 255) +
            "," +
            Math.round(V[2] * 255) +
            ")"
          );
        }),
        (ITextElement.prototype.emptyProp = new LetterProps()),
        (ITextElement.prototype.destroy = function () {}),
        (ITextElement.prototype.validateText = function () {
          (this.textProperty._mdf || this.textProperty._isFirstFrame) &&
            (this.buildNewText(),
            (this.textProperty._isFirstFrame = !1),
            (this.textProperty._mdf = !1));
        }));
      var emptyShapeData = { shapes: [] };
      function SVGTextLottieElement(V, O, B) {
        ((this.textSpans = []),
          (this.renderType = "svg"),
          this.initElement(V, O, B));
      }
      (extendPrototype(
        [
          BaseElement,
          TransformElement,
          SVGBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
          ITextElement,
        ],
        SVGTextLottieElement,
      ),
        (SVGTextLottieElement.prototype.createContent = function () {
          this.data.singleShape &&
            !this.globalData.fontManager.chars &&
            (this.textContainer = createNS("text"));
        }),
        (SVGTextLottieElement.prototype.buildTextContents = function (V) {
          for (var O = 0, B = V.length, z = [], N = ""; O < B; )
            (V[O] === "\r" || V[O] === "" ? (z.push(N), (N = "")) : (N += V[O]),
              (O += 1));
          return (z.push(N), z);
        }),
        (SVGTextLottieElement.prototype.buildShapeData = function (V, O) {
          if (V.shapes && V.shapes.length) {
            var B = V.shapes[0];
            if (B.it) {
              var z = B.it[B.it.length - 1];
              z.s && ((z.s.k[0] = O), (z.s.k[1] = O));
            }
          }
          return V;
        }),
        (SVGTextLottieElement.prototype.buildNewText = function () {
          this.addDynamicProperty(this);
          var V,
            O,
            B = this.textProperty.currentData;
          ((this.renderedLetters = createSizedArray(B ? B.l.length : 0)),
            B.fc
              ? this.layerElement.setAttribute("fill", this.buildColor(B.fc))
              : this.layerElement.setAttribute("fill", "rgba(0,0,0,0)"),
            B.sc &&
              (this.layerElement.setAttribute("stroke", this.buildColor(B.sc)),
              this.layerElement.setAttribute("stroke-width", B.sw)),
            this.layerElement.setAttribute("font-size", B.finalSize));
          var z = this.globalData.fontManager.getFontByName(B.f);
          if (z.fClass) this.layerElement.setAttribute("class", z.fClass);
          else {
            this.layerElement.setAttribute("font-family", z.fFamily);
            var N = B.fWeight,
              G = B.fStyle;
            (this.layerElement.setAttribute("font-style", G),
              this.layerElement.setAttribute("font-weight", N));
          }
          this.layerElement.setAttribute("aria-label", B.t);
          var H = B.l || [],
            W = !!this.globalData.fontManager.chars;
          O = H.length;
          var q,
            j = this.mHelper,
            Y = "",
            re = this.data.singleShape,
            U = 0,
            K = 0,
            Z = !0,
            X = B.tr * 0.001 * B.finalSize;
          if (re && !W && !B.sz) {
            var se = this.textContainer,
              Q = "start";
            switch (B.j) {
              case 1:
                Q = "end";
                break;
              case 2:
                Q = "middle";
                break;
              default:
                Q = "start";
                break;
            }
            (se.setAttribute("text-anchor", Q),
              se.setAttribute("letter-spacing", X));
            var te = this.buildTextContents(B.finalText);
            for (
              O = te.length, K = B.ps ? B.ps[1] + B.ascent : 0, V = 0;
              V < O;
              V += 1
            )
              ((q = this.textSpans[V].span || createNS("tspan")),
                (q.textContent = te[V]),
                q.setAttribute("x", 0),
                q.setAttribute("y", K),
                (q.style.display = "inherit"),
                se.appendChild(q),
                this.textSpans[V] ||
                  (this.textSpans[V] = { span: null, glyph: null }),
                (this.textSpans[V].span = q),
                (K += B.finalLineHeight));
            this.layerElement.appendChild(se);
          } else {
            var J = this.textSpans.length,
              ee;
            for (V = 0; V < O; V += 1) {
              if (
                (this.textSpans[V] ||
                  (this.textSpans[V] = {
                    span: null,
                    childSpan: null,
                    glyph: null,
                  }),
                !W || !re || V === 0)
              ) {
                if (
                  ((q =
                    J > V
                      ? this.textSpans[V].span
                      : createNS(W ? "g" : "text")),
                  J <= V)
                ) {
                  if (
                    (q.setAttribute("stroke-linecap", "butt"),
                    q.setAttribute("stroke-linejoin", "round"),
                    q.setAttribute("stroke-miterlimit", "4"),
                    (this.textSpans[V].span = q),
                    W)
                  ) {
                    var ne = createNS("g");
                    (q.appendChild(ne), (this.textSpans[V].childSpan = ne));
                  }
                  ((this.textSpans[V].span = q),
                    this.layerElement.appendChild(q));
                }
                q.style.display = "inherit";
              }
              if (
                (j.reset(),
                re &&
                  (H[V].n &&
                    ((U = -X), (K += B.yOffset), (K += Z ? 1 : 0), (Z = !1)),
                  this.applyTextPropertiesToMatrix(B, j, H[V].line, U, K),
                  (U += H[V].l || 0),
                  (U += X)),
                W)
              ) {
                ee = this.globalData.fontManager.getCharData(
                  B.finalText[V],
                  z.fStyle,
                  this.globalData.fontManager.getFontByName(B.f).fFamily,
                );
                var oe;
                if (ee.t === 1)
                  oe = new SVGCompElement(ee.data, this.globalData, this);
                else {
                  var he = emptyShapeData;
                  (ee.data &&
                    ee.data.shapes &&
                    (he = this.buildShapeData(ee.data, B.finalSize)),
                    (oe = new SVGShapeElement(he, this.globalData, this)));
                }
                if (this.textSpans[V].glyph) {
                  var ce = this.textSpans[V].glyph;
                  (this.textSpans[V].childSpan.removeChild(ce.layerElement),
                    ce.destroy());
                }
                ((this.textSpans[V].glyph = oe),
                  (oe._debug = !0),
                  oe.prepareFrame(0),
                  oe.renderFrame(),
                  this.textSpans[V].childSpan.appendChild(oe.layerElement),
                  ee.t === 1 &&
                    this.textSpans[V].childSpan.setAttribute(
                      "transform",
                      "scale(" +
                        B.finalSize / 100 +
                        "," +
                        B.finalSize / 100 +
                        ")",
                    ));
              } else
                (re &&
                  q.setAttribute(
                    "transform",
                    "translate(" + j.props[12] + "," + j.props[13] + ")",
                  ),
                  (q.textContent = H[V].val),
                  q.setAttributeNS(
                    "http://www.w3.org/XML/1998/namespace",
                    "xml:space",
                    "preserve",
                  ));
            }
            re && q && q.setAttribute("d", Y);
          }
          for (; V < this.textSpans.length; )
            ((this.textSpans[V].span.style.display = "none"), (V += 1));
          this._sizeChanged = !0;
        }),
        (SVGTextLottieElement.prototype.sourceRectAtTime = function () {
          if (
            (this.prepareFrame(this.comp.renderedFrame - this.data.st),
            this.renderInnerContent(),
            this._sizeChanged)
          ) {
            this._sizeChanged = !1;
            var V = this.layerElement.getBBox();
            this.bbox = {
              top: V.y,
              left: V.x,
              width: V.width,
              height: V.height,
            };
          }
          return this.bbox;
        }),
        (SVGTextLottieElement.prototype.getValue = function () {
          var V,
            O = this.textSpans.length,
            B;
          for (
            this.renderedFrame = this.comp.renderedFrame, V = 0;
            V < O;
            V += 1
          )
            ((B = this.textSpans[V].glyph),
              B &&
                (B.prepareFrame(this.comp.renderedFrame - this.data.st),
                B._mdf && (this._mdf = !0)));
        }),
        (SVGTextLottieElement.prototype.renderInnerContent = function () {
          if (
            (this.validateText(),
            (!this.data.singleShape || this._mdf) &&
              (this.textAnimator.getMeasures(
                this.textProperty.currentData,
                this.lettersChangedFlag,
              ),
              this.lettersChangedFlag || this.textAnimator.lettersChangedFlag))
          ) {
            this._sizeChanged = !0;
            var V,
              O,
              B = this.textAnimator.renderedLetters,
              z = this.textProperty.currentData.l;
            O = z.length;
            var N, G, H;
            for (V = 0; V < O; V += 1)
              z[V].n ||
                ((N = B[V]),
                (G = this.textSpans[V].span),
                (H = this.textSpans[V].glyph),
                H && H.renderFrame(),
                N._mdf.m && G.setAttribute("transform", N.m),
                N._mdf.o && G.setAttribute("opacity", N.o),
                N._mdf.sw && G.setAttribute("stroke-width", N.sw),
                N._mdf.sc && G.setAttribute("stroke", N.sc),
                N._mdf.fc && G.setAttribute("fill", N.fc));
          }
        }));
      function ISolidElement(V, O, B) {
        this.initElement(V, O, B);
      }
      (extendPrototype([IImageElement], ISolidElement),
        (ISolidElement.prototype.createContent = function () {
          var V = createNS("rect");
          (V.setAttribute("width", this.data.sw),
            V.setAttribute("height", this.data.sh),
            V.setAttribute("fill", this.data.sc),
            this.layerElement.appendChild(V));
        }));
      function NullElement(V, O, B) {
        (this.initFrame(),
          this.initBaseData(V, O, B),
          this.initFrame(),
          this.initTransform(V, O, B),
          this.initHierarchy());
      }
      ((NullElement.prototype.prepareFrame = function (V) {
        this.prepareProperties(V, !0);
      }),
        (NullElement.prototype.renderFrame = function () {}),
        (NullElement.prototype.getBaseElement = function () {
          return null;
        }),
        (NullElement.prototype.destroy = function () {}),
        (NullElement.prototype.sourceRectAtTime = function () {}),
        (NullElement.prototype.hide = function () {}),
        extendPrototype(
          [BaseElement, TransformElement, HierarchyElement, FrameElement],
          NullElement,
        ));
      function SVGRendererBase() {}
      (extendPrototype([BaseRenderer], SVGRendererBase),
        (SVGRendererBase.prototype.createNull = function (V) {
          return new NullElement(V, this.globalData, this);
        }),
        (SVGRendererBase.prototype.createShape = function (V) {
          return new SVGShapeElement(V, this.globalData, this);
        }),
        (SVGRendererBase.prototype.createText = function (V) {
          return new SVGTextLottieElement(V, this.globalData, this);
        }),
        (SVGRendererBase.prototype.createImage = function (V) {
          return new IImageElement(V, this.globalData, this);
        }),
        (SVGRendererBase.prototype.createSolid = function (V) {
          return new ISolidElement(V, this.globalData, this);
        }),
        (SVGRendererBase.prototype.configAnimation = function (V) {
          (this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg"),
            this.svgElement.setAttribute(
              "xmlns:xlink",
              "http://www.w3.org/1999/xlink",
            ),
            this.renderConfig.viewBoxSize
              ? this.svgElement.setAttribute(
                  "viewBox",
                  this.renderConfig.viewBoxSize,
                )
              : this.svgElement.setAttribute(
                  "viewBox",
                  "0 0 " + V.w + " " + V.h,
                ),
            this.renderConfig.viewBoxOnly ||
              (this.svgElement.setAttribute("width", V.w),
              this.svgElement.setAttribute("height", V.h),
              (this.svgElement.style.width = "100%"),
              (this.svgElement.style.height = "100%"),
              (this.svgElement.style.transform = "translate3d(0,0,0)"),
              (this.svgElement.style.contentVisibility =
                this.renderConfig.contentVisibility)),
            this.renderConfig.width &&
              this.svgElement.setAttribute("width", this.renderConfig.width),
            this.renderConfig.height &&
              this.svgElement.setAttribute("height", this.renderConfig.height),
            this.renderConfig.className &&
              this.svgElement.setAttribute(
                "class",
                this.renderConfig.className,
              ),
            this.renderConfig.id &&
              this.svgElement.setAttribute("id", this.renderConfig.id),
            this.renderConfig.focusable !== void 0 &&
              this.svgElement.setAttribute(
                "focusable",
                this.renderConfig.focusable,
              ),
            this.svgElement.setAttribute(
              "preserveAspectRatio",
              this.renderConfig.preserveAspectRatio,
            ),
            this.animationItem.wrapper.appendChild(this.svgElement));
          var O = this.globalData.defs;
          (this.setupGlobalData(V, O),
            (this.globalData.progressiveLoad =
              this.renderConfig.progressiveLoad),
            (this.data = V));
          var B = createNS("clipPath"),
            z = createNS("rect");
          (z.setAttribute("width", V.w),
            z.setAttribute("height", V.h),
            z.setAttribute("x", 0),
            z.setAttribute("y", 0));
          var N = createElementID();
          (B.setAttribute("id", N),
            B.appendChild(z),
            this.layerElement.setAttribute(
              "clip-path",
              "url(" + getLocationHref() + "#" + N + ")",
            ),
            O.appendChild(B),
            (this.layers = V.layers),
            (this.elements = createSizedArray(V.layers.length)));
        }),
        (SVGRendererBase.prototype.destroy = function () {
          (this.animationItem.wrapper &&
            (this.animationItem.wrapper.innerText = ""),
            (this.layerElement = null),
            (this.globalData.defs = null));
          var V,
            O = this.layers ? this.layers.length : 0;
          for (V = 0; V < O; V += 1)
            this.elements[V] &&
              this.elements[V].destroy &&
              this.elements[V].destroy();
          ((this.elements.length = 0),
            (this.destroyed = !0),
            (this.animationItem = null));
        }),
        (SVGRendererBase.prototype.updateContainerSize = function () {}),
        (SVGRendererBase.prototype.findIndexByInd = function (V) {
          var O = 0,
            B = this.layers.length;
          for (O = 0; O < B; O += 1) if (this.layers[O].ind === V) return O;
          return -1;
        }),
        (SVGRendererBase.prototype.buildItem = function (V) {
          var O = this.elements;
          if (!(O[V] || this.layers[V].ty === 99)) {
            O[V] = !0;
            var B = this.createItem(this.layers[V]);
            if (
              ((O[V] = B),
              getExpressionsPlugin() &&
                (this.layers[V].ty === 0 &&
                  this.globalData.projectInterface.registerComposition(B),
                B.initExpressions()),
              this.appendElementInPos(B, V),
              this.layers[V].tt)
            ) {
              var z =
                "tp" in this.layers[V]
                  ? this.findIndexByInd(this.layers[V].tp)
                  : V - 1;
              if (z === -1) return;
              if (!this.elements[z] || this.elements[z] === !0)
                (this.buildItem(z), this.addPendingElement(B));
              else {
                var N = O[z],
                  G = N.getMatte(this.layers[V].tt);
                B.setMatte(G);
              }
            }
          }
        }),
        (SVGRendererBase.prototype.checkPendingElements = function () {
          for (; this.pendingElements.length; ) {
            var V = this.pendingElements.pop();
            if ((V.checkParenting(), V.data.tt))
              for (var O = 0, B = this.elements.length; O < B; ) {
                if (this.elements[O] === V) {
                  var z =
                      "tp" in V.data ? this.findIndexByInd(V.data.tp) : O - 1,
                    N = this.elements[z],
                    G = N.getMatte(this.layers[O].tt);
                  V.setMatte(G);
                  break;
                }
                O += 1;
              }
          }
        }),
        (SVGRendererBase.prototype.renderFrame = function (V) {
          if (!(this.renderedFrame === V || this.destroyed)) {
            (V === null ? (V = this.renderedFrame) : (this.renderedFrame = V),
              (this.globalData.frameNum = V),
              (this.globalData.frameId += 1),
              (this.globalData.projectInterface.currentFrame = V),
              (this.globalData._mdf = !1));
            var O,
              B = this.layers.length;
            for (
              this.completeLayers || this.checkLayers(V), O = B - 1;
              O >= 0;
              O -= 1
            )
              (this.completeLayers || this.elements[O]) &&
                this.elements[O].prepareFrame(V - this.layers[O].st);
            if (this.globalData._mdf)
              for (O = 0; O < B; O += 1)
                (this.completeLayers || this.elements[O]) &&
                  this.elements[O].renderFrame();
          }
        }),
        (SVGRendererBase.prototype.appendElementInPos = function (V, O) {
          var B = V.getBaseElement();
          if (B) {
            for (var z = 0, N; z < O; )
              (this.elements[z] &&
                this.elements[z] !== !0 &&
                this.elements[z].getBaseElement() &&
                (N = this.elements[z].getBaseElement()),
                (z += 1));
            N
              ? this.layerElement.insertBefore(B, N)
              : this.layerElement.appendChild(B);
          }
        }),
        (SVGRendererBase.prototype.hide = function () {
          this.layerElement.style.display = "none";
        }),
        (SVGRendererBase.prototype.show = function () {
          this.layerElement.style.display = "block";
        }));
      function ICompElement() {}
      (extendPrototype(
        [
          BaseElement,
          TransformElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
        ],
        ICompElement,
      ),
        (ICompElement.prototype.initElement = function (V, O, B) {
          (this.initFrame(),
            this.initBaseData(V, O, B),
            this.initTransform(V, O, B),
            this.initRenderable(),
            this.initHierarchy(),
            this.initRendererElement(),
            this.createContainerElements(),
            this.createRenderableComponents(),
            (this.data.xt || !O.progressiveLoad) && this.buildAllItems(),
            this.hide());
        }),
        (ICompElement.prototype.prepareFrame = function (V) {
          if (
            ((this._mdf = !1),
            this.prepareRenderableFrame(V),
            this.prepareProperties(V, this.isInRange),
            !(!this.isInRange && !this.data.xt))
          ) {
            if (this.tm._placeholder) this.renderedFrame = V / this.data.sr;
            else {
              var O = this.tm.v;
              (O === this.data.op && (O = this.data.op - 1),
                (this.renderedFrame = O));
            }
            var B,
              z = this.elements.length;
            for (
              this.completeLayers || this.checkLayers(this.renderedFrame),
                B = z - 1;
              B >= 0;
              B -= 1
            )
              (this.completeLayers || this.elements[B]) &&
                (this.elements[B].prepareFrame(
                  this.renderedFrame - this.layers[B].st,
                ),
                this.elements[B]._mdf && (this._mdf = !0));
          }
        }),
        (ICompElement.prototype.renderInnerContent = function () {
          var V,
            O = this.layers.length;
          for (V = 0; V < O; V += 1)
            (this.completeLayers || this.elements[V]) &&
              this.elements[V].renderFrame();
        }),
        (ICompElement.prototype.setElements = function (V) {
          this.elements = V;
        }),
        (ICompElement.prototype.getElements = function () {
          return this.elements;
        }),
        (ICompElement.prototype.destroyElements = function () {
          var V,
            O = this.layers.length;
          for (V = 0; V < O; V += 1)
            this.elements[V] && this.elements[V].destroy();
        }),
        (ICompElement.prototype.destroy = function () {
          (this.destroyElements(), this.destroyBaseElement());
        }));
      function SVGCompElement(V, O, B) {
        ((this.layers = V.layers),
          (this.supports3d = !0),
          (this.completeLayers = !1),
          (this.pendingElements = []),
          (this.elements = this.layers
            ? createSizedArray(this.layers.length)
            : []),
          this.initElement(V, O, B),
          (this.tm = V.tm
            ? PropertyFactory.getProp(this, V.tm, 0, O.frameRate, this)
            : { _placeholder: !0 }));
      }
      (extendPrototype(
        [SVGRendererBase, ICompElement, SVGBaseElement],
        SVGCompElement,
      ),
        (SVGCompElement.prototype.createComp = function (V) {
          return new SVGCompElement(V, this.globalData, this);
        }));
      function SVGRenderer(V, O) {
        ((this.animationItem = V),
          (this.layers = null),
          (this.renderedFrame = -1),
          (this.svgElement = createNS("svg")));
        var B = "";
        if (O && O.title) {
          var z = createNS("title"),
            N = createElementID();
          (z.setAttribute("id", N),
            (z.textContent = O.title),
            this.svgElement.appendChild(z),
            (B += N));
        }
        if (O && O.description) {
          var G = createNS("desc"),
            H = createElementID();
          (G.setAttribute("id", H),
            (G.textContent = O.description),
            this.svgElement.appendChild(G),
            (B += " " + H));
        }
        B && this.svgElement.setAttribute("aria-labelledby", B);
        var W = createNS("defs");
        this.svgElement.appendChild(W);
        var q = createNS("g");
        (this.svgElement.appendChild(q),
          (this.layerElement = q),
          (this.renderConfig = {
            preserveAspectRatio:
              (O && O.preserveAspectRatio) || "xMidYMid meet",
            imagePreserveAspectRatio:
              (O && O.imagePreserveAspectRatio) || "xMidYMid slice",
            contentVisibility: (O && O.contentVisibility) || "visible",
            progressiveLoad: (O && O.progressiveLoad) || !1,
            hideOnTransparent: !(O && O.hideOnTransparent === !1),
            viewBoxOnly: (O && O.viewBoxOnly) || !1,
            viewBoxSize: (O && O.viewBoxSize) || !1,
            className: (O && O.className) || "",
            id: (O && O.id) || "",
            focusable: O && O.focusable,
            filterSize: {
              width: (O && O.filterSize && O.filterSize.width) || "100%",
              height: (O && O.filterSize && O.filterSize.height) || "100%",
              x: (O && O.filterSize && O.filterSize.x) || "0%",
              y: (O && O.filterSize && O.filterSize.y) || "0%",
            },
            width: O && O.width,
            height: O && O.height,
            runExpressions:
              !O || O.runExpressions === void 0 || O.runExpressions,
          }),
          (this.globalData = {
            _mdf: !1,
            frameNum: -1,
            defs: W,
            renderConfig: this.renderConfig,
          }),
          (this.elements = []),
          (this.pendingElements = []),
          (this.destroyed = !1),
          (this.rendererType = "svg"));
      }
      (extendPrototype([SVGRendererBase], SVGRenderer),
        (SVGRenderer.prototype.createComp = function (V) {
          return new SVGCompElement(V, this.globalData, this);
        }));
      function ShapeTransformManager() {
        ((this.sequences = {}),
          (this.sequenceList = []),
          (this.transform_key_count = 0));
      }
      ShapeTransformManager.prototype = {
        addTransformSequence: function (O) {
          var B,
            z = O.length,
            N = "_";
          for (B = 0; B < z; B += 1) N += O[B].transform.key + "_";
          var G = this.sequences[N];
          return (
            G ||
              ((G = {
                transforms: [].concat(O),
                finalTransform: new Matrix(),
                _mdf: !1,
              }),
              (this.sequences[N] = G),
              this.sequenceList.push(G)),
            G
          );
        },
        processSequence: function (O, B) {
          for (var z = 0, N = O.transforms.length, G = B; z < N && !B; ) {
            if (O.transforms[z].transform.mProps._mdf) {
              G = !0;
              break;
            }
            z += 1;
          }
          if (G)
            for (O.finalTransform.reset(), z = N - 1; z >= 0; z -= 1)
              O.finalTransform.multiply(O.transforms[z].transform.mProps.v);
          O._mdf = G;
        },
        processSequences: function (O) {
          var B,
            z = this.sequenceList.length;
          for (B = 0; B < z; B += 1)
            this.processSequence(this.sequenceList[B], O);
        },
        getNewKey: function () {
          return (
            (this.transform_key_count += 1),
            "_" + this.transform_key_count
          );
        },
      };
      var lumaLoader = function () {
        var O = "__lottie_element_luma_buffer",
          B = null,
          z = null,
          N = null;
        function G() {
          var q = createNS("svg"),
            j = createNS("filter"),
            Y = createNS("feColorMatrix");
          return (
            j.setAttribute("id", O),
            Y.setAttribute("type", "matrix"),
            Y.setAttribute("color-interpolation-filters", "sRGB"),
            Y.setAttribute(
              "values",
              "0.3, 0.3, 0.3, 0, 0, 0.3, 0.3, 0.3, 0, 0, 0.3, 0.3, 0.3, 0, 0, 0.3, 0.3, 0.3, 0, 0",
            ),
            j.appendChild(Y),
            q.appendChild(j),
            q.setAttribute("id", O + "_svg"),
            featureSupport.svgLumaHidden && (q.style.display = "none"),
            q
          );
        }
        function H() {
          B ||
            ((N = G()),
            document.body.appendChild(N),
            (B = createTag("canvas")),
            (z = B.getContext("2d")),
            (z.filter = "url(#" + O + ")"),
            (z.fillStyle = "rgba(0,0,0,0)"),
            z.fillRect(0, 0, 1, 1));
        }
        function W(q) {
          return (
            B || H(),
            (B.width = q.width),
            (B.height = q.height),
            (z.filter = "url(#" + O + ")"),
            B
          );
        }
        return { load: H, get: W };
      };
      function createCanvas(V, O) {
        if (featureSupport.offscreenCanvas) return new OffscreenCanvas(V, O);
        var B = createTag("canvas");
        return ((B.width = V), (B.height = O), B);
      }
      var assetLoader = (function () {
          return {
            loadLumaCanvas: lumaLoader.load,
            getLumaCanvas: lumaLoader.get,
            createCanvas,
          };
        })(),
        registeredEffects = {};
      function CVEffects(V) {
        var O,
          B = V.data.ef ? V.data.ef.length : 0;
        this.filters = [];
        var z;
        for (O = 0; O < B; O += 1) {
          z = null;
          var N = V.data.ef[O].ty;
          if (registeredEffects[N]) {
            var G = registeredEffects[N].effect;
            z = new G(V.effectsManager.effectElements[O], V);
          }
          z && this.filters.push(z);
        }
        this.filters.length && V.addRenderableComponent(this);
      }
      ((CVEffects.prototype.renderFrame = function (V) {
        var O,
          B = this.filters.length;
        for (O = 0; O < B; O += 1) this.filters[O].renderFrame(V);
      }),
        (CVEffects.prototype.getEffects = function (V) {
          var O,
            B = this.filters.length,
            z = [];
          for (O = 0; O < B; O += 1)
            this.filters[O].type === V && z.push(this.filters[O]);
          return z;
        }));
      function registerEffect(V, O) {
        registeredEffects[V] = { effect: O };
      }
      function CVMaskElement(V, O) {
        ((this.data = V),
          (this.element = O),
          (this.masksProperties = this.data.masksProperties || []),
          (this.viewData = createSizedArray(this.masksProperties.length)));
        var B,
          z = this.masksProperties.length,
          N = !1;
        for (B = 0; B < z; B += 1)
          (this.masksProperties[B].mode !== "n" && (N = !0),
            (this.viewData[B] = ShapePropertyFactory.getShapeProp(
              this.element,
              this.masksProperties[B],
              3,
            )));
        ((this.hasMasks = N), N && this.element.addRenderableComponent(this));
      }
      ((CVMaskElement.prototype.renderFrame = function () {
        if (this.hasMasks) {
          var V = this.element.finalTransform.mat,
            O = this.element.canvasContext,
            B,
            z = this.masksProperties.length,
            N,
            G,
            H;
          for (O.beginPath(), B = 0; B < z; B += 1)
            if (this.masksProperties[B].mode !== "n") {
              (this.masksProperties[B].inv &&
                (O.moveTo(0, 0),
                O.lineTo(this.element.globalData.compSize.w, 0),
                O.lineTo(
                  this.element.globalData.compSize.w,
                  this.element.globalData.compSize.h,
                ),
                O.lineTo(0, this.element.globalData.compSize.h),
                O.lineTo(0, 0)),
                (H = this.viewData[B].v),
                (N = V.applyToPointArray(H.v[0][0], H.v[0][1], 0)),
                O.moveTo(N[0], N[1]));
              var W,
                q = H._length;
              for (W = 1; W < q; W += 1)
                ((G = V.applyToTriplePoints(H.o[W - 1], H.i[W], H.v[W])),
                  O.bezierCurveTo(G[0], G[1], G[2], G[3], G[4], G[5]));
              ((G = V.applyToTriplePoints(H.o[W - 1], H.i[0], H.v[0])),
                O.bezierCurveTo(G[0], G[1], G[2], G[3], G[4], G[5]));
            }
          (this.element.globalData.renderer.save(!0), O.clip());
        }
      }),
        (CVMaskElement.prototype.getMaskProperty =
          MaskElement.prototype.getMaskProperty),
        (CVMaskElement.prototype.destroy = function () {
          this.element = null;
        }));
      function CVBaseElement() {}
      var operationsMap = {
        1: "source-in",
        2: "source-out",
        3: "source-in",
        4: "source-out",
      };
      ((CVBaseElement.prototype = {
        createElements: function () {},
        initRendererElement: function () {},
        createContainerElements: function () {
          if (this.data.tt >= 1) {
            this.buffers = [];
            var O = this.globalData.canvasContext,
              B = assetLoader.createCanvas(O.canvas.width, O.canvas.height);
            this.buffers.push(B);
            var z = assetLoader.createCanvas(O.canvas.width, O.canvas.height);
            (this.buffers.push(z),
              this.data.tt >= 3 &&
                !document._isProxy &&
                assetLoader.loadLumaCanvas());
          }
          ((this.canvasContext = this.globalData.canvasContext),
            (this.transformCanvas = this.globalData.transformCanvas),
            (this.renderableEffectsManager = new CVEffects(this)),
            this.searchEffectTransforms());
        },
        createContent: function () {},
        setBlendMode: function () {
          var O = this.globalData;
          if (O.blendMode !== this.data.bm) {
            O.blendMode = this.data.bm;
            var B = getBlendMode(this.data.bm);
            O.canvasContext.globalCompositeOperation = B;
          }
        },
        createRenderableComponents: function () {
          ((this.maskManager = new CVMaskElement(this.data, this)),
            (this.transformEffects = this.renderableEffectsManager.getEffects(
              effectTypes.TRANSFORM_EFFECT,
            )));
        },
        hideElement: function () {
          !this.hidden &&
            (!this.isInRange || this.isTransparent) &&
            (this.hidden = !0);
        },
        showElement: function () {
          this.isInRange &&
            !this.isTransparent &&
            ((this.hidden = !1),
            (this._isFirstFrame = !0),
            (this.maskManager._isFirstFrame = !0));
        },
        clearCanvas: function (O) {
          O.clearRect(
            this.transformCanvas.tx,
            this.transformCanvas.ty,
            this.transformCanvas.w * this.transformCanvas.sx,
            this.transformCanvas.h * this.transformCanvas.sy,
          );
        },
        prepareLayer: function () {
          if (this.data.tt >= 1) {
            var O = this.buffers[0],
              B = O.getContext("2d");
            (this.clearCanvas(B),
              B.drawImage(this.canvasContext.canvas, 0, 0),
              (this.currentTransform = this.canvasContext.getTransform()),
              this.canvasContext.setTransform(1, 0, 0, 1, 0, 0),
              this.clearCanvas(this.canvasContext),
              this.canvasContext.setTransform(this.currentTransform));
          }
        },
        exitLayer: function () {
          if (this.data.tt >= 1) {
            var O = this.buffers[1],
              B = O.getContext("2d");
            (this.clearCanvas(B),
              B.drawImage(this.canvasContext.canvas, 0, 0),
              this.canvasContext.setTransform(1, 0, 0, 1, 0, 0),
              this.clearCanvas(this.canvasContext),
              this.canvasContext.setTransform(this.currentTransform));
            var z = this.comp.getElementById(
              "tp" in this.data ? this.data.tp : this.data.ind - 1,
            );
            if (
              (z.renderFrame(!0),
              this.canvasContext.setTransform(1, 0, 0, 1, 0, 0),
              this.data.tt >= 3 && !document._isProxy)
            ) {
              var N = assetLoader.getLumaCanvas(this.canvasContext.canvas),
                G = N.getContext("2d");
              (G.drawImage(this.canvasContext.canvas, 0, 0),
                this.clearCanvas(this.canvasContext),
                this.canvasContext.drawImage(N, 0, 0));
            }
            ((this.canvasContext.globalCompositeOperation =
              operationsMap[this.data.tt]),
              this.canvasContext.drawImage(O, 0, 0),
              (this.canvasContext.globalCompositeOperation =
                "destination-over"),
              this.canvasContext.drawImage(this.buffers[0], 0, 0),
              this.canvasContext.setTransform(this.currentTransform),
              (this.canvasContext.globalCompositeOperation = "source-over"));
          }
        },
        renderFrame: function (O) {
          if (!(this.hidden || this.data.hd) && !(this.data.td === 1 && !O)) {
            (this.renderTransform(),
              this.renderRenderable(),
              this.renderLocalTransform(),
              this.setBlendMode());
            var B = this.data.ty === 0;
            (this.prepareLayer(),
              this.globalData.renderer.save(B),
              this.globalData.renderer.ctxTransform(
                this.finalTransform.localMat.props,
              ),
              this.globalData.renderer.ctxOpacity(
                this.finalTransform.localOpacity,
              ),
              this.renderInnerContent(),
              this.globalData.renderer.restore(B),
              this.exitLayer(),
              this.maskManager.hasMasks && this.globalData.renderer.restore(!0),
              this._isFirstFrame && (this._isFirstFrame = !1));
          }
        },
        destroy: function () {
          ((this.canvasContext = null),
            (this.data = null),
            (this.globalData = null),
            this.maskManager.destroy());
        },
        mHelper: new Matrix(),
      }),
        (CVBaseElement.prototype.hide = CVBaseElement.prototype.hideElement),
        (CVBaseElement.prototype.show = CVBaseElement.prototype.showElement));
      function CVShapeData(V, O, B, z) {
        ((this.styledShapes = []), (this.tr = [0, 0, 0, 0, 0, 0]));
        var N = 4;
        (O.ty === "rc"
          ? (N = 5)
          : O.ty === "el"
            ? (N = 6)
            : O.ty === "sr" && (N = 7),
          (this.sh = ShapePropertyFactory.getShapeProp(V, O, N, V)));
        var G,
          H = B.length,
          W;
        for (G = 0; G < H; G += 1)
          B[G].closed ||
            ((W = {
              transforms: z.addTransformSequence(B[G].transforms),
              trNodes: [],
            }),
            this.styledShapes.push(W),
            B[G].elements.push(W));
      }
      CVShapeData.prototype.setAsAnimated =
        SVGShapeData.prototype.setAsAnimated;
      function CVShapeElement(V, O, B) {
        ((this.shapes = []),
          (this.shapesData = V.shapes),
          (this.stylesList = []),
          (this.itemsData = []),
          (this.prevViewData = []),
          (this.shapeModifiers = []),
          (this.processedElements = []),
          (this.transformsManager = new ShapeTransformManager()),
          this.initElement(V, O, B));
      }
      (extendPrototype(
        [
          BaseElement,
          TransformElement,
          CVBaseElement,
          IShapeElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        CVShapeElement,
      ),
        (CVShapeElement.prototype.initElement =
          RenderableDOMElement.prototype.initElement),
        (CVShapeElement.prototype.transformHelper = { opacity: 1, _opMdf: !1 }),
        (CVShapeElement.prototype.dashResetter = []),
        (CVShapeElement.prototype.createContent = function () {
          this.searchShapes(
            this.shapesData,
            this.itemsData,
            this.prevViewData,
            !0,
            [],
          );
        }),
        (CVShapeElement.prototype.createStyleElement = function (V, O) {
          var B = {
              data: V,
              type: V.ty,
              preTransforms: this.transformsManager.addTransformSequence(O),
              transforms: [],
              elements: [],
              closed: V.hd === !0,
            },
            z = {};
          if (
            (V.ty === "fl" || V.ty === "st"
              ? ((z.c = PropertyFactory.getProp(this, V.c, 1, 255, this)),
                z.c.k ||
                  (B.co =
                    "rgb(" +
                    bmFloor(z.c.v[0]) +
                    "," +
                    bmFloor(z.c.v[1]) +
                    "," +
                    bmFloor(z.c.v[2]) +
                    ")"))
              : (V.ty === "gf" || V.ty === "gs") &&
                ((z.s = PropertyFactory.getProp(this, V.s, 1, null, this)),
                (z.e = PropertyFactory.getProp(this, V.e, 1, null, this)),
                (z.h = PropertyFactory.getProp(
                  this,
                  V.h || { k: 0 },
                  0,
                  0.01,
                  this,
                )),
                (z.a = PropertyFactory.getProp(
                  this,
                  V.a || { k: 0 },
                  0,
                  degToRads,
                  this,
                )),
                (z.g = new GradientProperty(this, V.g, this))),
            (z.o = PropertyFactory.getProp(this, V.o, 0, 0.01, this)),
            V.ty === "st" || V.ty === "gs")
          ) {
            if (
              ((B.lc = lineCapEnum[V.lc || 2]),
              (B.lj = lineJoinEnum[V.lj || 2]),
              V.lj == 1 && (B.ml = V.ml),
              (z.w = PropertyFactory.getProp(this, V.w, 0, null, this)),
              z.w.k || (B.wi = z.w.v),
              V.d)
            ) {
              var N = new DashProperty(this, V.d, "canvas", this);
              ((z.d = N),
                z.d.k || ((B.da = z.d.dashArray), (B.do = z.d.dashoffset[0])));
            }
          } else B.r = V.r === 2 ? "evenodd" : "nonzero";
          return (this.stylesList.push(B), (z.style = B), z);
        }),
        (CVShapeElement.prototype.createGroupElement = function () {
          var V = { it: [], prevViewData: [] };
          return V;
        }),
        (CVShapeElement.prototype.createTransformElement = function (V) {
          var O = {
            transform: {
              opacity: 1,
              _opMdf: !1,
              key: this.transformsManager.getNewKey(),
              op: PropertyFactory.getProp(this, V.o, 0, 0.01, this),
              mProps: TransformPropertyFactory.getTransformProperty(
                this,
                V,
                this,
              ),
            },
          };
          return O;
        }),
        (CVShapeElement.prototype.createShapeElement = function (V) {
          var O = new CVShapeData(
            this,
            V,
            this.stylesList,
            this.transformsManager,
          );
          return (this.shapes.push(O), this.addShapeToModifiers(O), O);
        }),
        (CVShapeElement.prototype.reloadShapes = function () {
          this._isFirstFrame = !0;
          var V,
            O = this.itemsData.length;
          for (V = 0; V < O; V += 1) this.prevViewData[V] = this.itemsData[V];
          for (
            this.searchShapes(
              this.shapesData,
              this.itemsData,
              this.prevViewData,
              !0,
              [],
            ),
              O = this.dynamicProperties.length,
              V = 0;
            V < O;
            V += 1
          )
            this.dynamicProperties[V].getValue();
          (this.renderModifiers(),
            this.transformsManager.processSequences(this._isFirstFrame));
        }),
        (CVShapeElement.prototype.addTransformToStyleList = function (V) {
          var O,
            B = this.stylesList.length;
          for (O = 0; O < B; O += 1)
            this.stylesList[O].closed || this.stylesList[O].transforms.push(V);
        }),
        (CVShapeElement.prototype.removeTransformFromStyleList = function () {
          var V,
            O = this.stylesList.length;
          for (V = 0; V < O; V += 1)
            this.stylesList[V].closed || this.stylesList[V].transforms.pop();
        }),
        (CVShapeElement.prototype.closeStyles = function (V) {
          var O,
            B = V.length;
          for (O = 0; O < B; O += 1) V[O].closed = !0;
        }),
        (CVShapeElement.prototype.searchShapes = function (V, O, B, z, N) {
          var G,
            H = V.length - 1,
            W,
            q,
            j = [],
            Y = [],
            re,
            U,
            K,
            Z = [].concat(N);
          for (G = H; G >= 0; G -= 1) {
            if (
              ((re = this.searchProcessedElement(V[G])),
              re ? (O[G] = B[re - 1]) : (V[G]._shouldRender = z),
              V[G].ty === "fl" ||
                V[G].ty === "st" ||
                V[G].ty === "gf" ||
                V[G].ty === "gs")
            )
              (re
                ? (O[G].style.closed = !1)
                : (O[G] = this.createStyleElement(V[G], Z)),
                j.push(O[G].style));
            else if (V[G].ty === "gr") {
              if (!re) O[G] = this.createGroupElement(V[G]);
              else
                for (q = O[G].it.length, W = 0; W < q; W += 1)
                  O[G].prevViewData[W] = O[G].it[W];
              this.searchShapes(V[G].it, O[G].it, O[G].prevViewData, z, Z);
            } else
              V[G].ty === "tr"
                ? (re || ((K = this.createTransformElement(V[G])), (O[G] = K)),
                  Z.push(O[G]),
                  this.addTransformToStyleList(O[G]))
                : V[G].ty === "sh" ||
                    V[G].ty === "rc" ||
                    V[G].ty === "el" ||
                    V[G].ty === "sr"
                  ? re || (O[G] = this.createShapeElement(V[G]))
                  : V[G].ty === "tm" ||
                      V[G].ty === "rd" ||
                      V[G].ty === "pb" ||
                      V[G].ty === "zz" ||
                      V[G].ty === "op"
                    ? (re
                        ? ((U = O[G]), (U.closed = !1))
                        : ((U = ShapeModifiers.getModifier(V[G].ty)),
                          U.init(this, V[G]),
                          (O[G] = U),
                          this.shapeModifiers.push(U)),
                      Y.push(U))
                    : V[G].ty === "rp" &&
                      (re
                        ? ((U = O[G]), (U.closed = !0))
                        : ((U = ShapeModifiers.getModifier(V[G].ty)),
                          (O[G] = U),
                          U.init(this, V, G, O),
                          this.shapeModifiers.push(U),
                          (z = !1)),
                      Y.push(U));
            this.addProcessedElement(V[G], G + 1);
          }
          for (
            this.removeTransformFromStyleList(),
              this.closeStyles(j),
              H = Y.length,
              G = 0;
            G < H;
            G += 1
          )
            Y[G].closed = !0;
        }),
        (CVShapeElement.prototype.renderInnerContent = function () {
          ((this.transformHelper.opacity = 1),
            (this.transformHelper._opMdf = !1),
            this.renderModifiers(),
            this.transformsManager.processSequences(this._isFirstFrame),
            this.renderShape(
              this.transformHelper,
              this.shapesData,
              this.itemsData,
              !0,
            ));
        }),
        (CVShapeElement.prototype.renderShapeTransform = function (V, O) {
          (V._opMdf || O.op._mdf || this._isFirstFrame) &&
            ((O.opacity = V.opacity), (O.opacity *= O.op.v), (O._opMdf = !0));
        }),
        (CVShapeElement.prototype.drawLayer = function () {
          var V,
            O = this.stylesList.length,
            B,
            z,
            N,
            G,
            H,
            W,
            q = this.globalData.renderer,
            j = this.globalData.canvasContext,
            Y,
            re;
          for (V = 0; V < O; V += 1)
            if (
              ((re = this.stylesList[V]),
              (Y = re.type),
              !(
                ((Y === "st" || Y === "gs") && re.wi === 0) ||
                !re.data._shouldRender ||
                re.coOp === 0 ||
                this.globalData.currentGlobalAlpha === 0
              ))
            ) {
              for (
                q.save(),
                  H = re.elements,
                  Y === "st" || Y === "gs"
                    ? (q.ctxStrokeStyle(Y === "st" ? re.co : re.grd),
                      q.ctxLineWidth(re.wi),
                      q.ctxLineCap(re.lc),
                      q.ctxLineJoin(re.lj),
                      q.ctxMiterLimit(re.ml || 0))
                    : q.ctxFillStyle(Y === "fl" ? re.co : re.grd),
                  q.ctxOpacity(re.coOp),
                  Y !== "st" && Y !== "gs" && j.beginPath(),
                  q.ctxTransform(re.preTransforms.finalTransform.props),
                  z = H.length,
                  B = 0;
                B < z;
                B += 1
              ) {
                for (
                  (Y === "st" || Y === "gs") &&
                    (j.beginPath(),
                    re.da &&
                      (j.setLineDash(re.da), (j.lineDashOffset = re.do))),
                    W = H[B].trNodes,
                    G = W.length,
                    N = 0;
                  N < G;
                  N += 1
                )
                  W[N].t === "m"
                    ? j.moveTo(W[N].p[0], W[N].p[1])
                    : W[N].t === "c"
                      ? j.bezierCurveTo(
                          W[N].pts[0],
                          W[N].pts[1],
                          W[N].pts[2],
                          W[N].pts[3],
                          W[N].pts[4],
                          W[N].pts[5],
                        )
                      : j.closePath();
                (Y === "st" || Y === "gs") &&
                  (q.ctxStroke(), re.da && j.setLineDash(this.dashResetter));
              }
              (Y !== "st" &&
                Y !== "gs" &&
                this.globalData.renderer.ctxFill(re.r),
                q.restore());
            }
        }),
        (CVShapeElement.prototype.renderShape = function (V, O, B, z) {
          var N,
            G = O.length - 1,
            H;
          for (H = V, N = G; N >= 0; N -= 1)
            O[N].ty === "tr"
              ? ((H = B[N].transform), this.renderShapeTransform(V, H))
              : O[N].ty === "sh" ||
                  O[N].ty === "el" ||
                  O[N].ty === "rc" ||
                  O[N].ty === "sr"
                ? this.renderPath(O[N], B[N])
                : O[N].ty === "fl"
                  ? this.renderFill(O[N], B[N], H)
                  : O[N].ty === "st"
                    ? this.renderStroke(O[N], B[N], H)
                    : O[N].ty === "gf" || O[N].ty === "gs"
                      ? this.renderGradientFill(O[N], B[N], H)
                      : O[N].ty === "gr"
                        ? this.renderShape(H, O[N].it, B[N].it)
                        : O[N].ty;
          z && this.drawLayer();
        }),
        (CVShapeElement.prototype.renderStyledShape = function (V, O) {
          if (this._isFirstFrame || O._mdf || V.transforms._mdf) {
            var B = V.trNodes,
              z = O.paths,
              N,
              G,
              H,
              W = z._length;
            B.length = 0;
            var q = V.transforms.finalTransform;
            for (H = 0; H < W; H += 1) {
              var j = z.shapes[H];
              if (j && j.v) {
                for (G = j._length, N = 1; N < G; N += 1)
                  (N === 1 &&
                    B.push({
                      t: "m",
                      p: q.applyToPointArray(j.v[0][0], j.v[0][1], 0),
                    }),
                    B.push({
                      t: "c",
                      pts: q.applyToTriplePoints(j.o[N - 1], j.i[N], j.v[N]),
                    }));
                (G === 1 &&
                  B.push({
                    t: "m",
                    p: q.applyToPointArray(j.v[0][0], j.v[0][1], 0),
                  }),
                  j.c &&
                    G &&
                    (B.push({
                      t: "c",
                      pts: q.applyToTriplePoints(j.o[N - 1], j.i[0], j.v[0]),
                    }),
                    B.push({ t: "z" })));
              }
            }
            V.trNodes = B;
          }
        }),
        (CVShapeElement.prototype.renderPath = function (V, O) {
          if (V.hd !== !0 && V._shouldRender) {
            var B,
              z = O.styledShapes.length;
            for (B = 0; B < z; B += 1)
              this.renderStyledShape(O.styledShapes[B], O.sh);
          }
        }),
        (CVShapeElement.prototype.renderFill = function (V, O, B) {
          var z = O.style;
          ((O.c._mdf || this._isFirstFrame) &&
            (z.co =
              "rgb(" +
              bmFloor(O.c.v[0]) +
              "," +
              bmFloor(O.c.v[1]) +
              "," +
              bmFloor(O.c.v[2]) +
              ")"),
            (O.o._mdf || B._opMdf || this._isFirstFrame) &&
              (z.coOp = O.o.v * B.opacity));
        }),
        (CVShapeElement.prototype.renderGradientFill = function (V, O, B) {
          var z = O.style,
            N;
          if (
            !z.grd ||
            O.g._mdf ||
            O.s._mdf ||
            O.e._mdf ||
            (V.t !== 1 && (O.h._mdf || O.a._mdf))
          ) {
            var G = this.globalData.canvasContext,
              H = O.s.v,
              W = O.e.v;
            if (V.t === 1) N = G.createLinearGradient(H[0], H[1], W[0], W[1]);
            else {
              var q = Math.sqrt(
                  Math.pow(H[0] - W[0], 2) + Math.pow(H[1] - W[1], 2),
                ),
                j = Math.atan2(W[1] - H[1], W[0] - H[0]),
                Y = O.h.v;
              Y >= 1 ? (Y = 0.99) : Y <= -1 && (Y = -0.99);
              var re = q * Y,
                U = Math.cos(j + O.a.v) * re + H[0],
                K = Math.sin(j + O.a.v) * re + H[1];
              N = G.createRadialGradient(U, K, 0, H[0], H[1], q);
            }
            var Z,
              X = V.g.p,
              se = O.g.c,
              Q = 1;
            for (Z = 0; Z < X; Z += 1)
              (O.g._hasOpacity && O.g._collapsable && (Q = O.g.o[Z * 2 + 1]),
                N.addColorStop(
                  se[Z * 4] / 100,
                  "rgba(" +
                    se[Z * 4 + 1] +
                    "," +
                    se[Z * 4 + 2] +
                    "," +
                    se[Z * 4 + 3] +
                    "," +
                    Q +
                    ")",
                ));
            z.grd = N;
          }
          z.coOp = O.o.v * B.opacity;
        }),
        (CVShapeElement.prototype.renderStroke = function (V, O, B) {
          var z = O.style,
            N = O.d;
          (N &&
            (N._mdf || this._isFirstFrame) &&
            ((z.da = N.dashArray), (z.do = N.dashoffset[0])),
            (O.c._mdf || this._isFirstFrame) &&
              (z.co =
                "rgb(" +
                bmFloor(O.c.v[0]) +
                "," +
                bmFloor(O.c.v[1]) +
                "," +
                bmFloor(O.c.v[2]) +
                ")"),
            (O.o._mdf || B._opMdf || this._isFirstFrame) &&
              (z.coOp = O.o.v * B.opacity),
            (O.w._mdf || this._isFirstFrame) && (z.wi = O.w.v));
        }),
        (CVShapeElement.prototype.destroy = function () {
          ((this.shapesData = null),
            (this.globalData = null),
            (this.canvasContext = null),
            (this.stylesList.length = 0),
            (this.itemsData.length = 0));
        }));
      function CVTextElement(V, O, B) {
        ((this.textSpans = []),
          (this.yOffset = 0),
          (this.fillColorAnim = !1),
          (this.strokeColorAnim = !1),
          (this.strokeWidthAnim = !1),
          (this.stroke = !1),
          (this.fill = !1),
          (this.justifyOffset = 0),
          (this.currentRender = null),
          (this.renderType = "canvas"),
          (this.values = {
            fill: "rgba(0,0,0,0)",
            stroke: "rgba(0,0,0,0)",
            sWidth: 0,
            fValue: "",
          }),
          this.initElement(V, O, B));
      }
      (extendPrototype(
        [
          BaseElement,
          TransformElement,
          CVBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
          ITextElement,
        ],
        CVTextElement,
      ),
        (CVTextElement.prototype.tHelper =
          createTag("canvas").getContext("2d")),
        (CVTextElement.prototype.buildNewText = function () {
          var V = this.textProperty.currentData;
          this.renderedLetters = createSizedArray(V.l ? V.l.length : 0);
          var O = !1;
          (V.fc
            ? ((O = !0), (this.values.fill = this.buildColor(V.fc)))
            : (this.values.fill = "rgba(0,0,0,0)"),
            (this.fill = O));
          var B = !1;
          V.sc &&
            ((B = !0),
            (this.values.stroke = this.buildColor(V.sc)),
            (this.values.sWidth = V.sw));
          var z = this.globalData.fontManager.getFontByName(V.f),
            N,
            G,
            H = V.l,
            W = this.mHelper;
          ((this.stroke = B),
            (this.values.fValue =
              V.finalSize +
              "px " +
              this.globalData.fontManager.getFontByName(V.f).fFamily),
            (G = V.finalText.length));
          var q,
            j,
            Y,
            re,
            U,
            K,
            Z,
            X,
            se,
            Q,
            te = this.data.singleShape,
            J = V.tr * 0.001 * V.finalSize,
            ee = 0,
            ne = 0,
            oe = !0,
            he = 0;
          for (N = 0; N < G; N += 1) {
            ((q = this.globalData.fontManager.getCharData(
              V.finalText[N],
              z.fStyle,
              this.globalData.fontManager.getFontByName(V.f).fFamily,
            )),
              (j = (q && q.data) || {}),
              W.reset(),
              te &&
                H[N].n &&
                ((ee = -J), (ne += V.yOffset), (ne += oe ? 1 : 0), (oe = !1)),
              (U = j.shapes ? j.shapes[0].it : []),
              (Z = U.length),
              W.scale(V.finalSize / 100, V.finalSize / 100),
              te && this.applyTextPropertiesToMatrix(V, W, H[N].line, ee, ne),
              (se = createSizedArray(Z - 1)));
            var ce = 0;
            for (K = 0; K < Z; K += 1)
              if (U[K].ty === "sh") {
                for (
                  re = U[K].ks.k.i.length, X = U[K].ks.k, Q = [], Y = 1;
                  Y < re;
                  Y += 1
                )
                  (Y === 1 &&
                    Q.push(
                      W.applyToX(X.v[0][0], X.v[0][1], 0),
                      W.applyToY(X.v[0][0], X.v[0][1], 0),
                    ),
                    Q.push(
                      W.applyToX(X.o[Y - 1][0], X.o[Y - 1][1], 0),
                      W.applyToY(X.o[Y - 1][0], X.o[Y - 1][1], 0),
                      W.applyToX(X.i[Y][0], X.i[Y][1], 0),
                      W.applyToY(X.i[Y][0], X.i[Y][1], 0),
                      W.applyToX(X.v[Y][0], X.v[Y][1], 0),
                      W.applyToY(X.v[Y][0], X.v[Y][1], 0),
                    ));
                (Q.push(
                  W.applyToX(X.o[Y - 1][0], X.o[Y - 1][1], 0),
                  W.applyToY(X.o[Y - 1][0], X.o[Y - 1][1], 0),
                  W.applyToX(X.i[0][0], X.i[0][1], 0),
                  W.applyToY(X.i[0][0], X.i[0][1], 0),
                  W.applyToX(X.v[0][0], X.v[0][1], 0),
                  W.applyToY(X.v[0][0], X.v[0][1], 0),
                ),
                  (se[ce] = Q),
                  (ce += 1));
              }
            (te && ((ee += H[N].l), (ee += J)),
              this.textSpans[he]
                ? (this.textSpans[he].elem = se)
                : (this.textSpans[he] = { elem: se }),
              (he += 1));
          }
        }),
        (CVTextElement.prototype.renderInnerContent = function () {
          this.validateText();
          var V = this.canvasContext;
          ((V.font = this.values.fValue),
            this.globalData.renderer.ctxLineCap("butt"),
            this.globalData.renderer.ctxLineJoin("miter"),
            this.globalData.renderer.ctxMiterLimit(4),
            this.data.singleShape ||
              this.textAnimator.getMeasures(
                this.textProperty.currentData,
                this.lettersChangedFlag,
              ));
          var O,
            B,
            z,
            N,
            G,
            H,
            W = this.textAnimator.renderedLetters,
            q = this.textProperty.currentData.l;
          B = q.length;
          var j,
            Y = null,
            re = null,
            U = null,
            K,
            Z,
            X = this.globalData.renderer;
          for (O = 0; O < B; O += 1)
            if (!q[O].n) {
              if (
                ((j = W[O]),
                j && (X.save(), X.ctxTransform(j.p), X.ctxOpacity(j.o)),
                this.fill)
              ) {
                for (
                  j && j.fc
                    ? Y !== j.fc && (X.ctxFillStyle(j.fc), (Y = j.fc))
                    : Y !== this.values.fill &&
                      ((Y = this.values.fill),
                      X.ctxFillStyle(this.values.fill)),
                    K = this.textSpans[O].elem,
                    N = K.length,
                    this.globalData.canvasContext.beginPath(),
                    z = 0;
                  z < N;
                  z += 1
                )
                  for (
                    Z = K[z],
                      H = Z.length,
                      this.globalData.canvasContext.moveTo(Z[0], Z[1]),
                      G = 2;
                    G < H;
                    G += 6
                  )
                    this.globalData.canvasContext.bezierCurveTo(
                      Z[G],
                      Z[G + 1],
                      Z[G + 2],
                      Z[G + 3],
                      Z[G + 4],
                      Z[G + 5],
                    );
                (this.globalData.canvasContext.closePath(), X.ctxFill());
              }
              if (this.stroke) {
                for (
                  j && j.sw
                    ? U !== j.sw && ((U = j.sw), X.ctxLineWidth(j.sw))
                    : U !== this.values.sWidth &&
                      ((U = this.values.sWidth),
                      X.ctxLineWidth(this.values.sWidth)),
                    j && j.sc
                      ? re !== j.sc && ((re = j.sc), X.ctxStrokeStyle(j.sc))
                      : re !== this.values.stroke &&
                        ((re = this.values.stroke),
                        X.ctxStrokeStyle(this.values.stroke)),
                    K = this.textSpans[O].elem,
                    N = K.length,
                    this.globalData.canvasContext.beginPath(),
                    z = 0;
                  z < N;
                  z += 1
                )
                  for (
                    Z = K[z],
                      H = Z.length,
                      this.globalData.canvasContext.moveTo(Z[0], Z[1]),
                      G = 2;
                    G < H;
                    G += 6
                  )
                    this.globalData.canvasContext.bezierCurveTo(
                      Z[G],
                      Z[G + 1],
                      Z[G + 2],
                      Z[G + 3],
                      Z[G + 4],
                      Z[G + 5],
                    );
                (this.globalData.canvasContext.closePath(), X.ctxStroke());
              }
              j && this.globalData.renderer.restore();
            }
        }));
      function CVImageElement(V, O, B) {
        ((this.assetData = O.getAssetData(V.refId)),
          (this.img = O.imageLoader.getAsset(this.assetData)),
          this.initElement(V, O, B));
      }
      (extendPrototype(
        [
          BaseElement,
          TransformElement,
          CVBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        CVImageElement,
      ),
        (CVImageElement.prototype.initElement =
          SVGShapeElement.prototype.initElement),
        (CVImageElement.prototype.prepareFrame =
          IImageElement.prototype.prepareFrame),
        (CVImageElement.prototype.createContent = function () {
          if (
            this.img.width &&
            (this.assetData.w !== this.img.width ||
              this.assetData.h !== this.img.height)
          ) {
            var V = createTag("canvas");
            ((V.width = this.assetData.w), (V.height = this.assetData.h));
            var O = V.getContext("2d"),
              B = this.img.width,
              z = this.img.height,
              N = B / z,
              G = this.assetData.w / this.assetData.h,
              H,
              W,
              q =
                this.assetData.pr ||
                this.globalData.renderConfig.imagePreserveAspectRatio;
            ((N > G && q === "xMidYMid slice") ||
            (N < G && q !== "xMidYMid slice")
              ? ((W = z), (H = W * G))
              : ((H = B), (W = H / G)),
              O.drawImage(
                this.img,
                (B - H) / 2,
                (z - W) / 2,
                H,
                W,
                0,
                0,
                this.assetData.w,
                this.assetData.h,
              ),
              (this.img = V));
          }
        }),
        (CVImageElement.prototype.renderInnerContent = function () {
          this.canvasContext.drawImage(this.img, 0, 0);
        }),
        (CVImageElement.prototype.destroy = function () {
          this.img = null;
        }));
      function CVSolidElement(V, O, B) {
        this.initElement(V, O, B);
      }
      (extendPrototype(
        [
          BaseElement,
          TransformElement,
          CVBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        CVSolidElement,
      ),
        (CVSolidElement.prototype.initElement =
          SVGShapeElement.prototype.initElement),
        (CVSolidElement.prototype.prepareFrame =
          IImageElement.prototype.prepareFrame),
        (CVSolidElement.prototype.renderInnerContent = function () {
          (this.globalData.renderer.ctxFillStyle(this.data.sc),
            this.globalData.renderer.ctxFillRect(
              0,
              0,
              this.data.sw,
              this.data.sh,
            ));
        }));
      function CanvasRendererBase() {}
      (extendPrototype([BaseRenderer], CanvasRendererBase),
        (CanvasRendererBase.prototype.createShape = function (V) {
          return new CVShapeElement(V, this.globalData, this);
        }),
        (CanvasRendererBase.prototype.createText = function (V) {
          return new CVTextElement(V, this.globalData, this);
        }),
        (CanvasRendererBase.prototype.createImage = function (V) {
          return new CVImageElement(V, this.globalData, this);
        }),
        (CanvasRendererBase.prototype.createSolid = function (V) {
          return new CVSolidElement(V, this.globalData, this);
        }),
        (CanvasRendererBase.prototype.createNull =
          SVGRenderer.prototype.createNull),
        (CanvasRendererBase.prototype.ctxTransform = function (V) {
          (V[0] === 1 &&
            V[1] === 0 &&
            V[4] === 0 &&
            V[5] === 1 &&
            V[12] === 0 &&
            V[13] === 0) ||
            this.canvasContext.transform(V[0], V[1], V[4], V[5], V[12], V[13]);
        }),
        (CanvasRendererBase.prototype.ctxOpacity = function (V) {
          this.canvasContext.globalAlpha *= V < 0 ? 0 : V;
        }),
        (CanvasRendererBase.prototype.ctxFillStyle = function (V) {
          this.canvasContext.fillStyle = V;
        }),
        (CanvasRendererBase.prototype.ctxStrokeStyle = function (V) {
          this.canvasContext.strokeStyle = V;
        }),
        (CanvasRendererBase.prototype.ctxLineWidth = function (V) {
          this.canvasContext.lineWidth = V;
        }),
        (CanvasRendererBase.prototype.ctxLineCap = function (V) {
          this.canvasContext.lineCap = V;
        }),
        (CanvasRendererBase.prototype.ctxLineJoin = function (V) {
          this.canvasContext.lineJoin = V;
        }),
        (CanvasRendererBase.prototype.ctxMiterLimit = function (V) {
          this.canvasContext.miterLimit = V;
        }),
        (CanvasRendererBase.prototype.ctxFill = function (V) {
          this.canvasContext.fill(V);
        }),
        (CanvasRendererBase.prototype.ctxFillRect = function (V, O, B, z) {
          this.canvasContext.fillRect(V, O, B, z);
        }),
        (CanvasRendererBase.prototype.ctxStroke = function () {
          this.canvasContext.stroke();
        }),
        (CanvasRendererBase.prototype.reset = function () {
          if (!this.renderConfig.clearCanvas) {
            this.canvasContext.restore();
            return;
          }
          this.contextData.reset();
        }),
        (CanvasRendererBase.prototype.save = function () {
          this.canvasContext.save();
        }),
        (CanvasRendererBase.prototype.restore = function (V) {
          if (!this.renderConfig.clearCanvas) {
            this.canvasContext.restore();
            return;
          }
          (V && (this.globalData.blendMode = "source-over"),
            this.contextData.restore(V));
        }),
        (CanvasRendererBase.prototype.configAnimation = function (V) {
          if (this.animationItem.wrapper) {
            this.animationItem.container = createTag("canvas");
            var O = this.animationItem.container.style;
            ((O.width = "100%"), (O.height = "100%"));
            var B = "0px 0px 0px";
            ((O.transformOrigin = B),
              (O.mozTransformOrigin = B),
              (O.webkitTransformOrigin = B),
              (O["-webkit-transform"] = B),
              (O.contentVisibility = this.renderConfig.contentVisibility),
              this.animationItem.wrapper.appendChild(
                this.animationItem.container,
              ),
              (this.canvasContext =
                this.animationItem.container.getContext("2d")),
              this.renderConfig.className &&
                this.animationItem.container.setAttribute(
                  "class",
                  this.renderConfig.className,
                ),
              this.renderConfig.id &&
                this.animationItem.container.setAttribute(
                  "id",
                  this.renderConfig.id,
                ));
          } else this.canvasContext = this.renderConfig.context;
          (this.contextData.setContext(this.canvasContext),
            (this.data = V),
            (this.layers = V.layers),
            (this.transformCanvas = {
              w: V.w,
              h: V.h,
              sx: 0,
              sy: 0,
              tx: 0,
              ty: 0,
            }),
            this.setupGlobalData(V, document.body),
            (this.globalData.canvasContext = this.canvasContext),
            (this.globalData.renderer = this),
            (this.globalData.isDashed = !1),
            (this.globalData.progressiveLoad =
              this.renderConfig.progressiveLoad),
            (this.globalData.transformCanvas = this.transformCanvas),
            (this.elements = createSizedArray(V.layers.length)),
            this.updateContainerSize());
        }),
        (CanvasRendererBase.prototype.updateContainerSize = function (V, O) {
          this.reset();
          var B, z;
          V
            ? ((B = V),
              (z = O),
              (this.canvasContext.canvas.width = B),
              (this.canvasContext.canvas.height = z))
            : (this.animationItem.wrapper && this.animationItem.container
                ? ((B = this.animationItem.wrapper.offsetWidth),
                  (z = this.animationItem.wrapper.offsetHeight))
                : ((B = this.canvasContext.canvas.width),
                  (z = this.canvasContext.canvas.height)),
              (this.canvasContext.canvas.width = B * this.renderConfig.dpr),
              (this.canvasContext.canvas.height = z * this.renderConfig.dpr));
          var N, G;
          if (
            this.renderConfig.preserveAspectRatio.indexOf("meet") !== -1 ||
            this.renderConfig.preserveAspectRatio.indexOf("slice") !== -1
          ) {
            var H = this.renderConfig.preserveAspectRatio.split(" "),
              W = H[1] || "meet",
              q = H[0] || "xMidYMid",
              j = q.substr(0, 4),
              Y = q.substr(4);
            ((N = B / z),
              (G = this.transformCanvas.w / this.transformCanvas.h),
              (G > N && W === "meet") || (G < N && W === "slice")
                ? ((this.transformCanvas.sx =
                    B / (this.transformCanvas.w / this.renderConfig.dpr)),
                  (this.transformCanvas.sy =
                    B / (this.transformCanvas.w / this.renderConfig.dpr)))
                : ((this.transformCanvas.sx =
                    z / (this.transformCanvas.h / this.renderConfig.dpr)),
                  (this.transformCanvas.sy =
                    z / (this.transformCanvas.h / this.renderConfig.dpr))),
              j === "xMid" &&
              ((G < N && W === "meet") || (G > N && W === "slice"))
                ? (this.transformCanvas.tx =
                    ((B -
                      this.transformCanvas.w * (z / this.transformCanvas.h)) /
                      2) *
                    this.renderConfig.dpr)
                : j === "xMax" &&
                    ((G < N && W === "meet") || (G > N && W === "slice"))
                  ? (this.transformCanvas.tx =
                      (B -
                        this.transformCanvas.w * (z / this.transformCanvas.h)) *
                      this.renderConfig.dpr)
                  : (this.transformCanvas.tx = 0),
              Y === "YMid" &&
              ((G > N && W === "meet") || (G < N && W === "slice"))
                ? (this.transformCanvas.ty =
                    ((z -
                      this.transformCanvas.h * (B / this.transformCanvas.w)) /
                      2) *
                    this.renderConfig.dpr)
                : Y === "YMax" &&
                    ((G > N && W === "meet") || (G < N && W === "slice"))
                  ? (this.transformCanvas.ty =
                      (z -
                        this.transformCanvas.h * (B / this.transformCanvas.w)) *
                      this.renderConfig.dpr)
                  : (this.transformCanvas.ty = 0));
          } else
            this.renderConfig.preserveAspectRatio === "none"
              ? ((this.transformCanvas.sx =
                  B / (this.transformCanvas.w / this.renderConfig.dpr)),
                (this.transformCanvas.sy =
                  z / (this.transformCanvas.h / this.renderConfig.dpr)),
                (this.transformCanvas.tx = 0),
                (this.transformCanvas.ty = 0))
              : ((this.transformCanvas.sx = this.renderConfig.dpr),
                (this.transformCanvas.sy = this.renderConfig.dpr),
                (this.transformCanvas.tx = 0),
                (this.transformCanvas.ty = 0));
          ((this.transformCanvas.props = [
            this.transformCanvas.sx,
            0,
            0,
            0,
            0,
            this.transformCanvas.sy,
            0,
            0,
            0,
            0,
            1,
            0,
            this.transformCanvas.tx,
            this.transformCanvas.ty,
            0,
            1,
          ]),
            this.ctxTransform(this.transformCanvas.props),
            this.canvasContext.beginPath(),
            this.canvasContext.rect(
              0,
              0,
              this.transformCanvas.w,
              this.transformCanvas.h,
            ),
            this.canvasContext.closePath(),
            this.canvasContext.clip(),
            this.renderFrame(this.renderedFrame, !0));
        }),
        (CanvasRendererBase.prototype.destroy = function () {
          this.renderConfig.clearCanvas &&
            this.animationItem.wrapper &&
            (this.animationItem.wrapper.innerText = "");
          var V,
            O = this.layers ? this.layers.length : 0;
          for (V = O - 1; V >= 0; V -= 1)
            this.elements[V] &&
              this.elements[V].destroy &&
              this.elements[V].destroy();
          ((this.elements.length = 0),
            (this.globalData.canvasContext = null),
            (this.animationItem.container = null),
            (this.destroyed = !0));
        }),
        (CanvasRendererBase.prototype.renderFrame = function (V, O) {
          if (
            !(
              (this.renderedFrame === V &&
                this.renderConfig.clearCanvas === !0 &&
                !O) ||
              this.destroyed ||
              V === -1
            )
          ) {
            ((this.renderedFrame = V),
              (this.globalData.frameNum = V - this.animationItem._isFirstFrame),
              (this.globalData.frameId += 1),
              (this.globalData._mdf = !this.renderConfig.clearCanvas || O),
              (this.globalData.projectInterface.currentFrame = V));
            var B,
              z = this.layers.length;
            for (
              this.completeLayers || this.checkLayers(V), B = z - 1;
              B >= 0;
              B -= 1
            )
              (this.completeLayers || this.elements[B]) &&
                this.elements[B].prepareFrame(V - this.layers[B].st);
            if (this.globalData._mdf) {
              for (
                this.renderConfig.clearCanvas === !0
                  ? this.canvasContext.clearRect(
                      0,
                      0,
                      this.transformCanvas.w,
                      this.transformCanvas.h,
                    )
                  : this.save(),
                  B = z - 1;
                B >= 0;
                B -= 1
              )
                (this.completeLayers || this.elements[B]) &&
                  this.elements[B].renderFrame();
              this.renderConfig.clearCanvas !== !0 && this.restore();
            }
          }
        }),
        (CanvasRendererBase.prototype.buildItem = function (V) {
          var O = this.elements;
          if (!(O[V] || this.layers[V].ty === 99)) {
            var B = this.createItem(this.layers[V], this, this.globalData);
            ((O[V] = B), B.initExpressions());
          }
        }),
        (CanvasRendererBase.prototype.checkPendingElements = function () {
          for (; this.pendingElements.length; ) {
            var V = this.pendingElements.pop();
            V.checkParenting();
          }
        }),
        (CanvasRendererBase.prototype.hide = function () {
          this.animationItem.container.style.display = "none";
        }),
        (CanvasRendererBase.prototype.show = function () {
          this.animationItem.container.style.display = "block";
        }));
      function CanvasContext() {
        ((this.opacity = -1),
          (this.transform = createTypedArray("float32", 16)),
          (this.fillStyle = ""),
          (this.strokeStyle = ""),
          (this.lineWidth = ""),
          (this.lineCap = ""),
          (this.lineJoin = ""),
          (this.miterLimit = ""),
          (this.id = Math.random()));
      }
      function CVContextData() {
        ((this.stack = []), (this.cArrPos = 0), (this.cTr = new Matrix()));
        var V,
          O = 15;
        for (V = 0; V < O; V += 1) {
          var B = new CanvasContext();
          this.stack[V] = B;
        }
        ((this._length = O),
          (this.nativeContext = null),
          (this.transformMat = new Matrix()),
          (this.currentOpacity = 1),
          (this.currentFillStyle = ""),
          (this.appliedFillStyle = ""),
          (this.currentStrokeStyle = ""),
          (this.appliedStrokeStyle = ""),
          (this.currentLineWidth = ""),
          (this.appliedLineWidth = ""),
          (this.currentLineCap = ""),
          (this.appliedLineCap = ""),
          (this.currentLineJoin = ""),
          (this.appliedLineJoin = ""),
          (this.appliedMiterLimit = ""),
          (this.currentMiterLimit = ""));
      }
      ((CVContextData.prototype.duplicate = function () {
        var V = this._length * 2,
          O = 0;
        for (O = this._length; O < V; O += 1)
          this.stack[O] = new CanvasContext();
        this._length = V;
      }),
        (CVContextData.prototype.reset = function () {
          ((this.cArrPos = 0),
            this.cTr.reset(),
            (this.stack[this.cArrPos].opacity = 1));
        }),
        (CVContextData.prototype.restore = function (V) {
          this.cArrPos -= 1;
          var O = this.stack[this.cArrPos],
            B = O.transform,
            z,
            N = this.cTr.props;
          for (z = 0; z < 16; z += 1) N[z] = B[z];
          if (V) {
            this.nativeContext.restore();
            var G = this.stack[this.cArrPos + 1];
            ((this.appliedFillStyle = G.fillStyle),
              (this.appliedStrokeStyle = G.strokeStyle),
              (this.appliedLineWidth = G.lineWidth),
              (this.appliedLineCap = G.lineCap),
              (this.appliedLineJoin = G.lineJoin),
              (this.appliedMiterLimit = G.miterLimit));
          }
          (this.nativeContext.setTransform(
            B[0],
            B[1],
            B[4],
            B[5],
            B[12],
            B[13],
          ),
            (V || (O.opacity !== -1 && this.currentOpacity !== O.opacity)) &&
              ((this.nativeContext.globalAlpha = O.opacity),
              (this.currentOpacity = O.opacity)),
            (this.currentFillStyle = O.fillStyle),
            (this.currentStrokeStyle = O.strokeStyle),
            (this.currentLineWidth = O.lineWidth),
            (this.currentLineCap = O.lineCap),
            (this.currentLineJoin = O.lineJoin),
            (this.currentMiterLimit = O.miterLimit));
        }),
        (CVContextData.prototype.save = function (V) {
          V && this.nativeContext.save();
          var O = this.cTr.props;
          this._length <= this.cArrPos && this.duplicate();
          var B = this.stack[this.cArrPos],
            z;
          for (z = 0; z < 16; z += 1) B.transform[z] = O[z];
          this.cArrPos += 1;
          var N = this.stack[this.cArrPos];
          ((N.opacity = B.opacity),
            (N.fillStyle = B.fillStyle),
            (N.strokeStyle = B.strokeStyle),
            (N.lineWidth = B.lineWidth),
            (N.lineCap = B.lineCap),
            (N.lineJoin = B.lineJoin),
            (N.miterLimit = B.miterLimit));
        }),
        (CVContextData.prototype.setOpacity = function (V) {
          this.stack[this.cArrPos].opacity = V;
        }),
        (CVContextData.prototype.setContext = function (V) {
          this.nativeContext = V;
        }),
        (CVContextData.prototype.fillStyle = function (V) {
          this.stack[this.cArrPos].fillStyle !== V &&
            ((this.currentFillStyle = V),
            (this.stack[this.cArrPos].fillStyle = V));
        }),
        (CVContextData.prototype.strokeStyle = function (V) {
          this.stack[this.cArrPos].strokeStyle !== V &&
            ((this.currentStrokeStyle = V),
            (this.stack[this.cArrPos].strokeStyle = V));
        }),
        (CVContextData.prototype.lineWidth = function (V) {
          this.stack[this.cArrPos].lineWidth !== V &&
            ((this.currentLineWidth = V),
            (this.stack[this.cArrPos].lineWidth = V));
        }),
        (CVContextData.prototype.lineCap = function (V) {
          this.stack[this.cArrPos].lineCap !== V &&
            ((this.currentLineCap = V), (this.stack[this.cArrPos].lineCap = V));
        }),
        (CVContextData.prototype.lineJoin = function (V) {
          this.stack[this.cArrPos].lineJoin !== V &&
            ((this.currentLineJoin = V),
            (this.stack[this.cArrPos].lineJoin = V));
        }),
        (CVContextData.prototype.miterLimit = function (V) {
          this.stack[this.cArrPos].miterLimit !== V &&
            ((this.currentMiterLimit = V),
            (this.stack[this.cArrPos].miterLimit = V));
        }),
        (CVContextData.prototype.transform = function (V) {
          this.transformMat.cloneFromProps(V);
          var O = this.cTr;
          (this.transformMat.multiply(O),
            O.cloneFromProps(this.transformMat.props));
          var B = O.props;
          this.nativeContext.setTransform(B[0], B[1], B[4], B[5], B[12], B[13]);
        }),
        (CVContextData.prototype.opacity = function (V) {
          var O = this.stack[this.cArrPos].opacity;
          ((O *= V < 0 ? 0 : V),
            this.stack[this.cArrPos].opacity !== O &&
              (this.currentOpacity !== V &&
                ((this.nativeContext.globalAlpha = V),
                (this.currentOpacity = V)),
              (this.stack[this.cArrPos].opacity = O)));
        }),
        (CVContextData.prototype.fill = function (V) {
          (this.appliedFillStyle !== this.currentFillStyle &&
            ((this.appliedFillStyle = this.currentFillStyle),
            (this.nativeContext.fillStyle = this.appliedFillStyle)),
            this.nativeContext.fill(V));
        }),
        (CVContextData.prototype.fillRect = function (V, O, B, z) {
          (this.appliedFillStyle !== this.currentFillStyle &&
            ((this.appliedFillStyle = this.currentFillStyle),
            (this.nativeContext.fillStyle = this.appliedFillStyle)),
            this.nativeContext.fillRect(V, O, B, z));
        }),
        (CVContextData.prototype.stroke = function () {
          (this.appliedStrokeStyle !== this.currentStrokeStyle &&
            ((this.appliedStrokeStyle = this.currentStrokeStyle),
            (this.nativeContext.strokeStyle = this.appliedStrokeStyle)),
            this.appliedLineWidth !== this.currentLineWidth &&
              ((this.appliedLineWidth = this.currentLineWidth),
              (this.nativeContext.lineWidth = this.appliedLineWidth)),
            this.appliedLineCap !== this.currentLineCap &&
              ((this.appliedLineCap = this.currentLineCap),
              (this.nativeContext.lineCap = this.appliedLineCap)),
            this.appliedLineJoin !== this.currentLineJoin &&
              ((this.appliedLineJoin = this.currentLineJoin),
              (this.nativeContext.lineJoin = this.appliedLineJoin)),
            this.appliedMiterLimit !== this.currentMiterLimit &&
              ((this.appliedMiterLimit = this.currentMiterLimit),
              (this.nativeContext.miterLimit = this.appliedMiterLimit)),
            this.nativeContext.stroke());
        }));
      function CVCompElement(V, O, B) {
        ((this.completeLayers = !1),
          (this.layers = V.layers),
          (this.pendingElements = []),
          (this.elements = createSizedArray(this.layers.length)),
          this.initElement(V, O, B),
          (this.tm = V.tm
            ? PropertyFactory.getProp(this, V.tm, 0, O.frameRate, this)
            : { _placeholder: !0 }));
      }
      (extendPrototype(
        [CanvasRendererBase, ICompElement, CVBaseElement],
        CVCompElement,
      ),
        (CVCompElement.prototype.renderInnerContent = function () {
          var V = this.canvasContext;
          (V.beginPath(),
            V.moveTo(0, 0),
            V.lineTo(this.data.w, 0),
            V.lineTo(this.data.w, this.data.h),
            V.lineTo(0, this.data.h),
            V.lineTo(0, 0),
            V.clip());
          var O,
            B = this.layers.length;
          for (O = B - 1; O >= 0; O -= 1)
            (this.completeLayers || this.elements[O]) &&
              this.elements[O].renderFrame();
        }),
        (CVCompElement.prototype.destroy = function () {
          var V,
            O = this.layers.length;
          for (V = O - 1; V >= 0; V -= 1)
            this.elements[V] && this.elements[V].destroy();
          ((this.layers = null), (this.elements = null));
        }),
        (CVCompElement.prototype.createComp = function (V) {
          return new CVCompElement(V, this.globalData, this);
        }));
      function CanvasRenderer(V, O) {
        ((this.animationItem = V),
          (this.renderConfig = {
            clearCanvas: O && O.clearCanvas !== void 0 ? O.clearCanvas : !0,
            context: (O && O.context) || null,
            progressiveLoad: (O && O.progressiveLoad) || !1,
            preserveAspectRatio:
              (O && O.preserveAspectRatio) || "xMidYMid meet",
            imagePreserveAspectRatio:
              (O && O.imagePreserveAspectRatio) || "xMidYMid slice",
            contentVisibility: (O && O.contentVisibility) || "visible",
            className: (O && O.className) || "",
            id: (O && O.id) || "",
            runExpressions:
              !O || O.runExpressions === void 0 || O.runExpressions,
          }),
          (this.renderConfig.dpr = (O && O.dpr) || 1),
          this.animationItem.wrapper &&
            (this.renderConfig.dpr =
              (O && O.dpr) || window.devicePixelRatio || 1),
          (this.renderedFrame = -1),
          (this.globalData = {
            frameNum: -1,
            _mdf: !1,
            renderConfig: this.renderConfig,
            currentGlobalAlpha: -1,
          }),
          (this.contextData = new CVContextData()),
          (this.elements = []),
          (this.pendingElements = []),
          (this.transformMat = new Matrix()),
          (this.completeLayers = !1),
          (this.rendererType = "canvas"),
          this.renderConfig.clearCanvas &&
            ((this.ctxTransform = this.contextData.transform.bind(
              this.contextData,
            )),
            (this.ctxOpacity = this.contextData.opacity.bind(this.contextData)),
            (this.ctxFillStyle = this.contextData.fillStyle.bind(
              this.contextData,
            )),
            (this.ctxStrokeStyle = this.contextData.strokeStyle.bind(
              this.contextData,
            )),
            (this.ctxLineWidth = this.contextData.lineWidth.bind(
              this.contextData,
            )),
            (this.ctxLineCap = this.contextData.lineCap.bind(this.contextData)),
            (this.ctxLineJoin = this.contextData.lineJoin.bind(
              this.contextData,
            )),
            (this.ctxMiterLimit = this.contextData.miterLimit.bind(
              this.contextData,
            )),
            (this.ctxFill = this.contextData.fill.bind(this.contextData)),
            (this.ctxFillRect = this.contextData.fillRect.bind(
              this.contextData,
            )),
            (this.ctxStroke = this.contextData.stroke.bind(this.contextData)),
            (this.save = this.contextData.save.bind(this.contextData))));
      }
      (extendPrototype([CanvasRendererBase], CanvasRenderer),
        (CanvasRenderer.prototype.createComp = function (V) {
          return new CVCompElement(V, this.globalData, this);
        }));
      function HBaseElement() {}
      ((HBaseElement.prototype = {
        checkBlendMode: function () {},
        initRendererElement: function () {
          ((this.baseElement = createTag(this.data.tg || "div")),
            this.data.hasMask
              ? ((this.svgElement = createNS("svg")),
                (this.layerElement = createNS("g")),
                (this.maskedElement = this.layerElement),
                this.svgElement.appendChild(this.layerElement),
                this.baseElement.appendChild(this.svgElement))
              : (this.layerElement = this.baseElement),
            styleDiv(this.baseElement));
        },
        createContainerElements: function () {
          ((this.renderableEffectsManager = new CVEffects(this)),
            (this.transformedElement = this.baseElement),
            (this.maskedElement = this.layerElement),
            this.data.ln && this.layerElement.setAttribute("id", this.data.ln),
            this.data.cl &&
              this.layerElement.setAttribute("class", this.data.cl),
            this.data.bm !== 0 && this.setBlendMode());
        },
        renderElement: function () {
          var O = this.transformedElement ? this.transformedElement.style : {};
          if (this.finalTransform._matMdf) {
            var B = this.finalTransform.mat.toCSS();
            ((O.transform = B), (O.webkitTransform = B));
          }
          this.finalTransform._opMdf &&
            (O.opacity = this.finalTransform.mProp.o.v);
        },
        renderFrame: function () {
          this.data.hd ||
            this.hidden ||
            (this.renderTransform(),
            this.renderRenderable(),
            this.renderElement(),
            this.renderInnerContent(),
            this._isFirstFrame && (this._isFirstFrame = !1));
        },
        destroy: function () {
          ((this.layerElement = null),
            (this.transformedElement = null),
            this.matteElement && (this.matteElement = null),
            this.maskManager &&
              (this.maskManager.destroy(), (this.maskManager = null)));
        },
        createRenderableComponents: function () {
          this.maskManager = new MaskElement(this.data, this, this.globalData);
        },
        addEffects: function () {},
        setMatte: function () {},
      }),
        (HBaseElement.prototype.getBaseElement =
          SVGBaseElement.prototype.getBaseElement),
        (HBaseElement.prototype.destroyBaseElement =
          HBaseElement.prototype.destroy),
        (HBaseElement.prototype.buildElementParenting =
          BaseRenderer.prototype.buildElementParenting));
      function HSolidElement(V, O, B) {
        this.initElement(V, O, B);
      }
      (extendPrototype(
        [
          BaseElement,
          TransformElement,
          HBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
        ],
        HSolidElement,
      ),
        (HSolidElement.prototype.createContent = function () {
          var V;
          (this.data.hasMask
            ? ((V = createNS("rect")),
              V.setAttribute("width", this.data.sw),
              V.setAttribute("height", this.data.sh),
              V.setAttribute("fill", this.data.sc),
              this.svgElement.setAttribute("width", this.data.sw),
              this.svgElement.setAttribute("height", this.data.sh))
            : ((V = createTag("div")),
              (V.style.width = this.data.sw + "px"),
              (V.style.height = this.data.sh + "px"),
              (V.style.backgroundColor = this.data.sc)),
            this.layerElement.appendChild(V));
        }));
      function HShapeElement(V, O, B) {
        ((this.shapes = []),
          (this.shapesData = V.shapes),
          (this.stylesList = []),
          (this.shapeModifiers = []),
          (this.itemsData = []),
          (this.processedElements = []),
          (this.animatedContents = []),
          (this.shapesContainer = createNS("g")),
          this.initElement(V, O, B),
          (this.prevViewData = []),
          (this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 }));
      }
      (extendPrototype(
        [
          BaseElement,
          TransformElement,
          HSolidElement,
          SVGShapeElement,
          HBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        HShapeElement,
      ),
        (HShapeElement.prototype._renderShapeFrame =
          HShapeElement.prototype.renderInnerContent),
        (HShapeElement.prototype.createContent = function () {
          var V;
          if (((this.baseElement.style.fontSize = 0), this.data.hasMask))
            (this.layerElement.appendChild(this.shapesContainer),
              (V = this.svgElement));
          else {
            V = createNS("svg");
            var O = this.comp.data ? this.comp.data : this.globalData.compSize;
            (V.setAttribute("width", O.w),
              V.setAttribute("height", O.h),
              V.appendChild(this.shapesContainer),
              this.layerElement.appendChild(V));
          }
          (this.searchShapes(
            this.shapesData,
            this.itemsData,
            this.prevViewData,
            this.shapesContainer,
            0,
            [],
            !0,
          ),
            this.filterUniqueShapes(),
            (this.shapeCont = V));
        }),
        (HShapeElement.prototype.getTransformedPoint = function (V, O) {
          var B,
            z = V.length;
          for (B = 0; B < z; B += 1)
            O = V[B].mProps.v.applyToPointArray(O[0], O[1], 0);
          return O;
        }),
        (HShapeElement.prototype.calculateShapeBoundingBox = function (V, O) {
          var B = V.sh.v,
            z = V.transformers,
            N,
            G = B._length,
            H,
            W,
            q,
            j;
          if (!(G <= 1)) {
            for (N = 0; N < G - 1; N += 1)
              ((H = this.getTransformedPoint(z, B.v[N])),
                (W = this.getTransformedPoint(z, B.o[N])),
                (q = this.getTransformedPoint(z, B.i[N + 1])),
                (j = this.getTransformedPoint(z, B.v[N + 1])),
                this.checkBounds(H, W, q, j, O));
            B.c &&
              ((H = this.getTransformedPoint(z, B.v[N])),
              (W = this.getTransformedPoint(z, B.o[N])),
              (q = this.getTransformedPoint(z, B.i[0])),
              (j = this.getTransformedPoint(z, B.v[0])),
              this.checkBounds(H, W, q, j, O));
          }
        }),
        (HShapeElement.prototype.checkBounds = function (V, O, B, z, N) {
          this.getBoundsOfCurve(V, O, B, z);
          var G = this.shapeBoundingBox;
          ((N.x = bmMin(G.left, N.x)),
            (N.xMax = bmMax(G.right, N.xMax)),
            (N.y = bmMin(G.top, N.y)),
            (N.yMax = bmMax(G.bottom, N.yMax)));
        }),
        (HShapeElement.prototype.shapeBoundingBox = {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }),
        (HShapeElement.prototype.tempBoundingBox = {
          x: 0,
          xMax: 0,
          y: 0,
          yMax: 0,
          width: 0,
          height: 0,
        }),
        (HShapeElement.prototype.getBoundsOfCurve = function (V, O, B, z) {
          for (
            var N = [
                [V[0], z[0]],
                [V[1], z[1]],
              ],
              G,
              H,
              W,
              q,
              j,
              Y,
              re,
              U = 0;
            U < 2;
            ++U
          )
            ((H = 6 * V[U] - 12 * O[U] + 6 * B[U]),
              (G = -3 * V[U] + 9 * O[U] - 9 * B[U] + 3 * z[U]),
              (W = 3 * O[U] - 3 * V[U]),
              (H |= 0),
              (G |= 0),
              (W |= 0),
              (G === 0 && H === 0) ||
                (G === 0
                  ? ((q = -W / H),
                    q > 0 &&
                      q < 1 &&
                      N[U].push(this.calculateF(q, V, O, B, z, U)))
                  : ((j = H * H - 4 * W * G),
                    j >= 0 &&
                      ((Y = (-H + bmSqrt(j)) / (2 * G)),
                      Y > 0 &&
                        Y < 1 &&
                        N[U].push(this.calculateF(Y, V, O, B, z, U)),
                      (re = (-H - bmSqrt(j)) / (2 * G)),
                      re > 0 &&
                        re < 1 &&
                        N[U].push(this.calculateF(re, V, O, B, z, U))))));
          ((this.shapeBoundingBox.left = bmMin.apply(null, N[0])),
            (this.shapeBoundingBox.top = bmMin.apply(null, N[1])),
            (this.shapeBoundingBox.right = bmMax.apply(null, N[0])),
            (this.shapeBoundingBox.bottom = bmMax.apply(null, N[1])));
        }),
        (HShapeElement.prototype.calculateF = function (V, O, B, z, N, G) {
          return (
            bmPow(1 - V, 3) * O[G] +
            3 * bmPow(1 - V, 2) * V * B[G] +
            3 * (1 - V) * bmPow(V, 2) * z[G] +
            bmPow(V, 3) * N[G]
          );
        }),
        (HShapeElement.prototype.calculateBoundingBox = function (V, O) {
          var B,
            z = V.length;
          for (B = 0; B < z; B += 1)
            V[B] && V[B].sh
              ? this.calculateShapeBoundingBox(V[B], O)
              : V[B] && V[B].it
                ? this.calculateBoundingBox(V[B].it, O)
                : V[B] &&
                  V[B].style &&
                  V[B].w &&
                  this.expandStrokeBoundingBox(V[B].w, O);
        }),
        (HShapeElement.prototype.expandStrokeBoundingBox = function (V, O) {
          var B = 0;
          if (V.keyframes) {
            for (var z = 0; z < V.keyframes.length; z += 1) {
              var N = V.keyframes[z].s;
              N > B && (B = N);
            }
            B *= V.mult;
          } else B = V.v * V.mult;
          ((O.x -= B), (O.xMax += B), (O.y -= B), (O.yMax += B));
        }),
        (HShapeElement.prototype.currentBoxContains = function (V) {
          return (
            this.currentBBox.x <= V.x &&
            this.currentBBox.y <= V.y &&
            this.currentBBox.width + this.currentBBox.x >= V.x + V.width &&
            this.currentBBox.height + this.currentBBox.y >= V.y + V.height
          );
        }),
        (HShapeElement.prototype.renderInnerContent = function () {
          if (
            (this._renderShapeFrame(),
            !this.hidden && (this._isFirstFrame || this._mdf))
          ) {
            var V = this.tempBoundingBox,
              O = 999999;
            if (
              ((V.x = O),
              (V.xMax = -O),
              (V.y = O),
              (V.yMax = -O),
              this.calculateBoundingBox(this.itemsData, V),
              (V.width = V.xMax < V.x ? 0 : V.xMax - V.x),
              (V.height = V.yMax < V.y ? 0 : V.yMax - V.y),
              this.currentBoxContains(V))
            )
              return;
            var B = !1;
            if (
              (this.currentBBox.w !== V.width &&
                ((this.currentBBox.w = V.width),
                this.shapeCont.setAttribute("width", V.width),
                (B = !0)),
              this.currentBBox.h !== V.height &&
                ((this.currentBBox.h = V.height),
                this.shapeCont.setAttribute("height", V.height),
                (B = !0)),
              B || this.currentBBox.x !== V.x || this.currentBBox.y !== V.y)
            ) {
              ((this.currentBBox.w = V.width),
                (this.currentBBox.h = V.height),
                (this.currentBBox.x = V.x),
                (this.currentBBox.y = V.y),
                this.shapeCont.setAttribute(
                  "viewBox",
                  this.currentBBox.x +
                    " " +
                    this.currentBBox.y +
                    " " +
                    this.currentBBox.w +
                    " " +
                    this.currentBBox.h,
                ));
              var z = this.shapeCont.style,
                N =
                  "translate(" +
                  this.currentBBox.x +
                  "px," +
                  this.currentBBox.y +
                  "px)";
              ((z.transform = N), (z.webkitTransform = N));
            }
          }
        }));
      function HTextElement(V, O, B) {
        ((this.textSpans = []),
          (this.textPaths = []),
          (this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 }),
          (this.renderType = "svg"),
          (this.isMasked = !1),
          this.initElement(V, O, B));
      }
      (extendPrototype(
        [
          BaseElement,
          TransformElement,
          HBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
          ITextElement,
        ],
        HTextElement,
      ),
        (HTextElement.prototype.createContent = function () {
          if (((this.isMasked = this.checkMasks()), this.isMasked)) {
            ((this.renderType = "svg"),
              (this.compW = this.comp.data.w),
              (this.compH = this.comp.data.h),
              this.svgElement.setAttribute("width", this.compW),
              this.svgElement.setAttribute("height", this.compH));
            var V = createNS("g");
            (this.maskedElement.appendChild(V), (this.innerElem = V));
          } else
            ((this.renderType = "html"), (this.innerElem = this.layerElement));
          this.checkParenting();
        }),
        (HTextElement.prototype.buildNewText = function () {
          var V = this.textProperty.currentData;
          this.renderedLetters = createSizedArray(V.l ? V.l.length : 0);
          var O = this.innerElem.style,
            B = V.fc ? this.buildColor(V.fc) : "rgba(0,0,0,0)";
          ((O.fill = B),
            (O.color = B),
            V.sc &&
              ((O.stroke = this.buildColor(V.sc)),
              (O.strokeWidth = V.sw + "px")));
          var z = this.globalData.fontManager.getFontByName(V.f);
          if (!this.globalData.fontManager.chars)
            if (
              ((O.fontSize = V.finalSize + "px"),
              (O.lineHeight = V.finalSize + "px"),
              z.fClass)
            )
              this.innerElem.className = z.fClass;
            else {
              O.fontFamily = z.fFamily;
              var N = V.fWeight,
                G = V.fStyle;
              ((O.fontStyle = G), (O.fontWeight = N));
            }
          var H,
            W,
            q = V.l;
          W = q.length;
          var j,
            Y,
            re,
            U = this.mHelper,
            K,
            Z = "",
            X = 0;
          for (H = 0; H < W; H += 1) {
            if (
              (this.globalData.fontManager.chars
                ? (this.textPaths[X]
                    ? (j = this.textPaths[X])
                    : ((j = createNS("path")),
                      j.setAttribute("stroke-linecap", lineCapEnum[1]),
                      j.setAttribute("stroke-linejoin", lineJoinEnum[2]),
                      j.setAttribute("stroke-miterlimit", "4")),
                  this.isMasked ||
                    (this.textSpans[X]
                      ? ((Y = this.textSpans[X]), (re = Y.children[0]))
                      : ((Y = createTag("div")),
                        (Y.style.lineHeight = 0),
                        (re = createNS("svg")),
                        re.appendChild(j),
                        styleDiv(Y))))
                : this.isMasked
                  ? (j = this.textPaths[X]
                      ? this.textPaths[X]
                      : createNS("text"))
                  : this.textSpans[X]
                    ? ((Y = this.textSpans[X]), (j = this.textPaths[X]))
                    : ((Y = createTag("span")),
                      styleDiv(Y),
                      (j = createTag("span")),
                      styleDiv(j),
                      Y.appendChild(j)),
              this.globalData.fontManager.chars)
            ) {
              var se = this.globalData.fontManager.getCharData(
                  V.finalText[H],
                  z.fStyle,
                  this.globalData.fontManager.getFontByName(V.f).fFamily,
                ),
                Q;
              if (
                (se ? (Q = se.data) : (Q = null),
                U.reset(),
                Q &&
                  Q.shapes &&
                  Q.shapes.length &&
                  ((K = Q.shapes[0].it),
                  U.scale(V.finalSize / 100, V.finalSize / 100),
                  (Z = this.createPathShape(U, K)),
                  j.setAttribute("d", Z)),
                this.isMasked)
              )
                this.innerElem.appendChild(j);
              else {
                if ((this.innerElem.appendChild(Y), Q && Q.shapes)) {
                  document.body.appendChild(re);
                  var te = re.getBBox();
                  (re.setAttribute("width", te.width + 2),
                    re.setAttribute("height", te.height + 2),
                    re.setAttribute(
                      "viewBox",
                      te.x -
                        1 +
                        " " +
                        (te.y - 1) +
                        " " +
                        (te.width + 2) +
                        " " +
                        (te.height + 2),
                    ));
                  var J = re.style,
                    ee = "translate(" + (te.x - 1) + "px," + (te.y - 1) + "px)";
                  ((J.transform = ee),
                    (J.webkitTransform = ee),
                    (q[H].yOffset = te.y - 1));
                } else
                  (re.setAttribute("width", 1), re.setAttribute("height", 1));
                Y.appendChild(re);
              }
            } else if (
              ((j.textContent = q[H].val),
              j.setAttributeNS(
                "http://www.w3.org/XML/1998/namespace",
                "xml:space",
                "preserve",
              ),
              this.isMasked)
            )
              this.innerElem.appendChild(j);
            else {
              this.innerElem.appendChild(Y);
              var ne = j.style,
                oe = "translate3d(0," + -V.finalSize / 1.2 + "px,0)";
              ((ne.transform = oe), (ne.webkitTransform = oe));
            }
            (this.isMasked ? (this.textSpans[X] = j) : (this.textSpans[X] = Y),
              (this.textSpans[X].style.display = "block"),
              (this.textPaths[X] = j),
              (X += 1));
          }
          for (; X < this.textSpans.length; )
            ((this.textSpans[X].style.display = "none"), (X += 1));
        }),
        (HTextElement.prototype.renderInnerContent = function () {
          this.validateText();
          var V;
          if (this.data.singleShape) {
            if (!this._isFirstFrame && !this.lettersChangedFlag) return;
            if (this.isMasked && this.finalTransform._matMdf) {
              (this.svgElement.setAttribute(
                "viewBox",
                -this.finalTransform.mProp.p.v[0] +
                  " " +
                  -this.finalTransform.mProp.p.v[1] +
                  " " +
                  this.compW +
                  " " +
                  this.compH,
              ),
                (V = this.svgElement.style));
              var O =
                "translate(" +
                -this.finalTransform.mProp.p.v[0] +
                "px," +
                -this.finalTransform.mProp.p.v[1] +
                "px)";
              ((V.transform = O), (V.webkitTransform = O));
            }
          }
          if (
            (this.textAnimator.getMeasures(
              this.textProperty.currentData,
              this.lettersChangedFlag,
            ),
            !(
              !this.lettersChangedFlag && !this.textAnimator.lettersChangedFlag
            ))
          ) {
            var B,
              z,
              N = 0,
              G = this.textAnimator.renderedLetters,
              H = this.textProperty.currentData.l;
            z = H.length;
            var W, q, j;
            for (B = 0; B < z; B += 1)
              H[B].n
                ? (N += 1)
                : ((q = this.textSpans[B]),
                  (j = this.textPaths[B]),
                  (W = G[N]),
                  (N += 1),
                  W._mdf.m &&
                    (this.isMasked
                      ? q.setAttribute("transform", W.m)
                      : ((q.style.webkitTransform = W.m),
                        (q.style.transform = W.m))),
                  (q.style.opacity = W.o),
                  W.sw && W._mdf.sw && j.setAttribute("stroke-width", W.sw),
                  W.sc && W._mdf.sc && j.setAttribute("stroke", W.sc),
                  W.fc &&
                    W._mdf.fc &&
                    (j.setAttribute("fill", W.fc), (j.style.color = W.fc)));
            if (
              this.innerElem.getBBox &&
              !this.hidden &&
              (this._isFirstFrame || this._mdf)
            ) {
              var Y = this.innerElem.getBBox();
              (this.currentBBox.w !== Y.width &&
                ((this.currentBBox.w = Y.width),
                this.svgElement.setAttribute("width", Y.width)),
                this.currentBBox.h !== Y.height &&
                  ((this.currentBBox.h = Y.height),
                  this.svgElement.setAttribute("height", Y.height)));
              var re = 1;
              if (
                this.currentBBox.w !== Y.width + re * 2 ||
                this.currentBBox.h !== Y.height + re * 2 ||
                this.currentBBox.x !== Y.x - re ||
                this.currentBBox.y !== Y.y - re
              ) {
                ((this.currentBBox.w = Y.width + re * 2),
                  (this.currentBBox.h = Y.height + re * 2),
                  (this.currentBBox.x = Y.x - re),
                  (this.currentBBox.y = Y.y - re),
                  this.svgElement.setAttribute(
                    "viewBox",
                    this.currentBBox.x +
                      " " +
                      this.currentBBox.y +
                      " " +
                      this.currentBBox.w +
                      " " +
                      this.currentBBox.h,
                  ),
                  (V = this.svgElement.style));
                var U =
                  "translate(" +
                  this.currentBBox.x +
                  "px," +
                  this.currentBBox.y +
                  "px)";
                ((V.transform = U), (V.webkitTransform = U));
              }
            }
          }
        }));
      function HCameraElement(V, O, B) {
        (this.initFrame(), this.initBaseData(V, O, B), this.initHierarchy());
        var z = PropertyFactory.getProp;
        if (
          ((this.pe = z(this, V.pe, 0, 0, this)),
          V.ks.p.s
            ? ((this.px = z(this, V.ks.p.x, 1, 0, this)),
              (this.py = z(this, V.ks.p.y, 1, 0, this)),
              (this.pz = z(this, V.ks.p.z, 1, 0, this)))
            : (this.p = z(this, V.ks.p, 1, 0, this)),
          V.ks.a && (this.a = z(this, V.ks.a, 1, 0, this)),
          V.ks.or.k.length && V.ks.or.k[0].to)
        ) {
          var N,
            G = V.ks.or.k.length;
          for (N = 0; N < G; N += 1)
            ((V.ks.or.k[N].to = null), (V.ks.or.k[N].ti = null));
        }
        ((this.or = z(this, V.ks.or, 1, degToRads, this)),
          (this.or.sh = !0),
          (this.rx = z(this, V.ks.rx, 0, degToRads, this)),
          (this.ry = z(this, V.ks.ry, 0, degToRads, this)),
          (this.rz = z(this, V.ks.rz, 0, degToRads, this)),
          (this.mat = new Matrix()),
          (this._prevMat = new Matrix()),
          (this._isFirstFrame = !0),
          (this.finalTransform = { mProp: this }));
      }
      (extendPrototype(
        [BaseElement, FrameElement, HierarchyElement],
        HCameraElement,
      ),
        (HCameraElement.prototype.setup = function () {
          var V,
            O = this.comp.threeDElements.length,
            B,
            z,
            N;
          for (V = 0; V < O; V += 1)
            if (((B = this.comp.threeDElements[V]), B.type === "3d")) {
              ((z = B.perspectiveElem.style), (N = B.container.style));
              var G = this.pe.v + "px",
                H = "0px 0px 0px",
                W = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
              ((z.perspective = G),
                (z.webkitPerspective = G),
                (N.transformOrigin = H),
                (N.mozTransformOrigin = H),
                (N.webkitTransformOrigin = H),
                (z.transform = W),
                (z.webkitTransform = W));
            }
        }),
        (HCameraElement.prototype.createElements = function () {}),
        (HCameraElement.prototype.hide = function () {}),
        (HCameraElement.prototype.renderFrame = function () {
          var V = this._isFirstFrame,
            O,
            B;
          if (this.hierarchy)
            for (B = this.hierarchy.length, O = 0; O < B; O += 1)
              V = this.hierarchy[O].finalTransform.mProp._mdf || V;
          if (
            V ||
            this.pe._mdf ||
            (this.p && this.p._mdf) ||
            (this.px && (this.px._mdf || this.py._mdf || this.pz._mdf)) ||
            this.rx._mdf ||
            this.ry._mdf ||
            this.rz._mdf ||
            this.or._mdf ||
            (this.a && this.a._mdf)
          ) {
            if ((this.mat.reset(), this.hierarchy))
              for (B = this.hierarchy.length - 1, O = B; O >= 0; O -= 1) {
                var z = this.hierarchy[O].finalTransform.mProp;
                (this.mat.translate(-z.p.v[0], -z.p.v[1], z.p.v[2]),
                  this.mat
                    .rotateX(-z.or.v[0])
                    .rotateY(-z.or.v[1])
                    .rotateZ(z.or.v[2]),
                  this.mat.rotateX(-z.rx.v).rotateY(-z.ry.v).rotateZ(z.rz.v),
                  this.mat.scale(1 / z.s.v[0], 1 / z.s.v[1], 1 / z.s.v[2]),
                  this.mat.translate(z.a.v[0], z.a.v[1], z.a.v[2]));
              }
            if (
              (this.p
                ? this.mat.translate(-this.p.v[0], -this.p.v[1], this.p.v[2])
                : this.mat.translate(-this.px.v, -this.py.v, this.pz.v),
              this.a)
            ) {
              var N;
              this.p
                ? (N = [
                    this.p.v[0] - this.a.v[0],
                    this.p.v[1] - this.a.v[1],
                    this.p.v[2] - this.a.v[2],
                  ])
                : (N = [
                    this.px.v - this.a.v[0],
                    this.py.v - this.a.v[1],
                    this.pz.v - this.a.v[2],
                  ]);
              var G = Math.sqrt(
                  Math.pow(N[0], 2) + Math.pow(N[1], 2) + Math.pow(N[2], 2),
                ),
                H = [N[0] / G, N[1] / G, N[2] / G],
                W = Math.sqrt(H[2] * H[2] + H[0] * H[0]),
                q = Math.atan2(H[1], W),
                j = Math.atan2(H[0], -H[2]);
              this.mat.rotateY(j).rotateX(-q);
            }
            (this.mat
              .rotateX(-this.rx.v)
              .rotateY(-this.ry.v)
              .rotateZ(this.rz.v),
              this.mat
                .rotateX(-this.or.v[0])
                .rotateY(-this.or.v[1])
                .rotateZ(this.or.v[2]),
              this.mat.translate(
                this.globalData.compSize.w / 2,
                this.globalData.compSize.h / 2,
                0,
              ),
              this.mat.translate(0, 0, this.pe.v));
            var Y = !this._prevMat.equals(this.mat);
            if ((Y || this.pe._mdf) && this.comp.threeDElements) {
              B = this.comp.threeDElements.length;
              var re, U, K;
              for (O = 0; O < B; O += 1)
                if (((re = this.comp.threeDElements[O]), re.type === "3d")) {
                  if (Y) {
                    var Z = this.mat.toCSS();
                    ((K = re.container.style),
                      (K.transform = Z),
                      (K.webkitTransform = Z));
                  }
                  this.pe._mdf &&
                    ((U = re.perspectiveElem.style),
                    (U.perspective = this.pe.v + "px"),
                    (U.webkitPerspective = this.pe.v + "px"));
                }
              this.mat.clone(this._prevMat);
            }
          }
          this._isFirstFrame = !1;
        }),
        (HCameraElement.prototype.prepareFrame = function (V) {
          this.prepareProperties(V, !0);
        }),
        (HCameraElement.prototype.destroy = function () {}),
        (HCameraElement.prototype.getBaseElement = function () {
          return null;
        }));
      function HImageElement(V, O, B) {
        ((this.assetData = O.getAssetData(V.refId)), this.initElement(V, O, B));
      }
      (extendPrototype(
        [
          BaseElement,
          TransformElement,
          HBaseElement,
          HSolidElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        HImageElement,
      ),
        (HImageElement.prototype.createContent = function () {
          var V = this.globalData.getAssetsPath(this.assetData),
            O = new Image();
          (this.data.hasMask
            ? ((this.imageElem = createNS("image")),
              this.imageElem.setAttribute("width", this.assetData.w + "px"),
              this.imageElem.setAttribute("height", this.assetData.h + "px"),
              this.imageElem.setAttributeNS(
                "http://www.w3.org/1999/xlink",
                "href",
                V,
              ),
              this.layerElement.appendChild(this.imageElem),
              this.baseElement.setAttribute("width", this.assetData.w),
              this.baseElement.setAttribute("height", this.assetData.h))
            : this.layerElement.appendChild(O),
            (O.crossOrigin = "anonymous"),
            (O.src = V),
            this.data.ln && this.baseElement.setAttribute("id", this.data.ln));
        }));
      function HybridRendererBase(V, O) {
        ((this.animationItem = V),
          (this.layers = null),
          (this.renderedFrame = -1),
          (this.renderConfig = {
            className: (O && O.className) || "",
            imagePreserveAspectRatio:
              (O && O.imagePreserveAspectRatio) || "xMidYMid slice",
            hideOnTransparent: !(O && O.hideOnTransparent === !1),
            filterSize: {
              width: (O && O.filterSize && O.filterSize.width) || "400%",
              height: (O && O.filterSize && O.filterSize.height) || "400%",
              x: (O && O.filterSize && O.filterSize.x) || "-100%",
              y: (O && O.filterSize && O.filterSize.y) || "-100%",
            },
          }),
          (this.globalData = {
            _mdf: !1,
            frameNum: -1,
            renderConfig: this.renderConfig,
          }),
          (this.pendingElements = []),
          (this.elements = []),
          (this.threeDElements = []),
          (this.destroyed = !1),
          (this.camera = null),
          (this.supports3d = !0),
          (this.rendererType = "html"));
      }
      (extendPrototype([BaseRenderer], HybridRendererBase),
        (HybridRendererBase.prototype.buildItem =
          SVGRenderer.prototype.buildItem),
        (HybridRendererBase.prototype.checkPendingElements = function () {
          for (; this.pendingElements.length; ) {
            var V = this.pendingElements.pop();
            V.checkParenting();
          }
        }),
        (HybridRendererBase.prototype.appendElementInPos = function (V, O) {
          var B = V.getBaseElement();
          if (B) {
            var z = this.layers[O];
            if (!z.ddd || !this.supports3d)
              if (this.threeDElements) this.addTo3dContainer(B, O);
              else {
                for (var N = 0, G, H, W; N < O; )
                  (this.elements[N] &&
                    this.elements[N] !== !0 &&
                    this.elements[N].getBaseElement &&
                    ((H = this.elements[N]),
                    (W = this.layers[N].ddd
                      ? this.getThreeDContainerByPos(N)
                      : H.getBaseElement()),
                    (G = W || G)),
                    (N += 1));
                G
                  ? (!z.ddd || !this.supports3d) &&
                    this.layerElement.insertBefore(B, G)
                  : (!z.ddd || !this.supports3d) &&
                    this.layerElement.appendChild(B);
              }
            else this.addTo3dContainer(B, O);
          }
        }),
        (HybridRendererBase.prototype.createShape = function (V) {
          return this.supports3d
            ? new HShapeElement(V, this.globalData, this)
            : new SVGShapeElement(V, this.globalData, this);
        }),
        (HybridRendererBase.prototype.createText = function (V) {
          return this.supports3d
            ? new HTextElement(V, this.globalData, this)
            : new SVGTextLottieElement(V, this.globalData, this);
        }),
        (HybridRendererBase.prototype.createCamera = function (V) {
          return (
            (this.camera = new HCameraElement(V, this.globalData, this)),
            this.camera
          );
        }),
        (HybridRendererBase.prototype.createImage = function (V) {
          return this.supports3d
            ? new HImageElement(V, this.globalData, this)
            : new IImageElement(V, this.globalData, this);
        }),
        (HybridRendererBase.prototype.createSolid = function (V) {
          return this.supports3d
            ? new HSolidElement(V, this.globalData, this)
            : new ISolidElement(V, this.globalData, this);
        }),
        (HybridRendererBase.prototype.createNull =
          SVGRenderer.prototype.createNull),
        (HybridRendererBase.prototype.getThreeDContainerByPos = function (V) {
          for (var O = 0, B = this.threeDElements.length; O < B; ) {
            if (
              this.threeDElements[O].startPos <= V &&
              this.threeDElements[O].endPos >= V
            )
              return this.threeDElements[O].perspectiveElem;
            O += 1;
          }
          return null;
        }),
        (HybridRendererBase.prototype.createThreeDContainer = function (V, O) {
          var B = createTag("div"),
            z,
            N;
          styleDiv(B);
          var G = createTag("div");
          if ((styleDiv(G), O === "3d")) {
            ((z = B.style),
              (z.width = this.globalData.compSize.w + "px"),
              (z.height = this.globalData.compSize.h + "px"));
            var H = "50% 50%";
            ((z.webkitTransformOrigin = H),
              (z.mozTransformOrigin = H),
              (z.transformOrigin = H),
              (N = G.style));
            var W = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
            ((N.transform = W), (N.webkitTransform = W));
          }
          B.appendChild(G);
          var q = {
            container: G,
            perspectiveElem: B,
            startPos: V,
            endPos: V,
            type: O,
          };
          return (this.threeDElements.push(q), q);
        }),
        (HybridRendererBase.prototype.build3dContainers = function () {
          var V,
            O = this.layers.length,
            B,
            z = "";
          for (V = 0; V < O; V += 1)
            this.layers[V].ddd && this.layers[V].ty !== 3
              ? (z !== "3d" &&
                  ((z = "3d"), (B = this.createThreeDContainer(V, "3d"))),
                (B.endPos = Math.max(B.endPos, V)))
              : (z !== "2d" &&
                  ((z = "2d"), (B = this.createThreeDContainer(V, "2d"))),
                (B.endPos = Math.max(B.endPos, V)));
          for (O = this.threeDElements.length, V = O - 1; V >= 0; V -= 1)
            this.resizerElem.appendChild(
              this.threeDElements[V].perspectiveElem,
            );
        }),
        (HybridRendererBase.prototype.addTo3dContainer = function (V, O) {
          for (var B = 0, z = this.threeDElements.length; B < z; ) {
            if (O <= this.threeDElements[B].endPos) {
              for (var N = this.threeDElements[B].startPos, G; N < O; )
                (this.elements[N] &&
                  this.elements[N].getBaseElement &&
                  (G = this.elements[N].getBaseElement()),
                  (N += 1));
              G
                ? this.threeDElements[B].container.insertBefore(V, G)
                : this.threeDElements[B].container.appendChild(V);
              break;
            }
            B += 1;
          }
        }),
        (HybridRendererBase.prototype.configAnimation = function (V) {
          var O = createTag("div"),
            B = this.animationItem.wrapper,
            z = O.style;
          ((z.width = V.w + "px"),
            (z.height = V.h + "px"),
            (this.resizerElem = O),
            styleDiv(O),
            (z.transformStyle = "flat"),
            (z.mozTransformStyle = "flat"),
            (z.webkitTransformStyle = "flat"),
            this.renderConfig.className &&
              O.setAttribute("class", this.renderConfig.className),
            B.appendChild(O),
            (z.overflow = "hidden"));
          var N = createNS("svg");
          (N.setAttribute("width", "1"),
            N.setAttribute("height", "1"),
            styleDiv(N),
            this.resizerElem.appendChild(N));
          var G = createNS("defs");
          (N.appendChild(G),
            (this.data = V),
            this.setupGlobalData(V, N),
            (this.globalData.defs = G),
            (this.layers = V.layers),
            (this.layerElement = this.resizerElem),
            this.build3dContainers(),
            this.updateContainerSize());
        }),
        (HybridRendererBase.prototype.destroy = function () {
          (this.animationItem.wrapper &&
            (this.animationItem.wrapper.innerText = ""),
            (this.animationItem.container = null),
            (this.globalData.defs = null));
          var V,
            O = this.layers ? this.layers.length : 0;
          for (V = 0; V < O; V += 1)
            this.elements[V] &&
              this.elements[V].destroy &&
              this.elements[V].destroy();
          ((this.elements.length = 0),
            (this.destroyed = !0),
            (this.animationItem = null));
        }),
        (HybridRendererBase.prototype.updateContainerSize = function () {
          var V = this.animationItem.wrapper.offsetWidth,
            O = this.animationItem.wrapper.offsetHeight,
            B = V / O,
            z = this.globalData.compSize.w / this.globalData.compSize.h,
            N,
            G,
            H,
            W;
          z > B
            ? ((N = V / this.globalData.compSize.w),
              (G = V / this.globalData.compSize.w),
              (H = 0),
              (W =
                (O -
                  this.globalData.compSize.h *
                    (V / this.globalData.compSize.w)) /
                2))
            : ((N = O / this.globalData.compSize.h),
              (G = O / this.globalData.compSize.h),
              (H =
                (V -
                  this.globalData.compSize.w *
                    (O / this.globalData.compSize.h)) /
                2),
              (W = 0));
          var q = this.resizerElem.style;
          ((q.webkitTransform =
            "matrix3d(" +
            N +
            ",0,0,0,0," +
            G +
            ",0,0,0,0,1,0," +
            H +
            "," +
            W +
            ",0,1)"),
            (q.transform = q.webkitTransform));
        }),
        (HybridRendererBase.prototype.renderFrame =
          SVGRenderer.prototype.renderFrame),
        (HybridRendererBase.prototype.hide = function () {
          this.resizerElem.style.display = "none";
        }),
        (HybridRendererBase.prototype.show = function () {
          this.resizerElem.style.display = "block";
        }),
        (HybridRendererBase.prototype.initItems = function () {
          if ((this.buildAllItems(), this.camera)) this.camera.setup();
          else {
            var V = this.globalData.compSize.w,
              O = this.globalData.compSize.h,
              B,
              z = this.threeDElements.length;
            for (B = 0; B < z; B += 1) {
              var N = this.threeDElements[B].perspectiveElem.style;
              ((N.webkitPerspective =
                Math.sqrt(Math.pow(V, 2) + Math.pow(O, 2)) + "px"),
                (N.perspective = N.webkitPerspective));
            }
          }
        }),
        (HybridRendererBase.prototype.searchExtraCompositions = function (V) {
          var O,
            B = V.length,
            z = createTag("div");
          for (O = 0; O < B; O += 1)
            if (V[O].xt) {
              var N = this.createComp(V[O], z, this.globalData.comp, null);
              (N.initExpressions(),
                this.globalData.projectInterface.registerComposition(N));
            }
        }));
      function HCompElement(V, O, B) {
        ((this.layers = V.layers),
          (this.supports3d = !V.hasMask),
          (this.completeLayers = !1),
          (this.pendingElements = []),
          (this.elements = this.layers
            ? createSizedArray(this.layers.length)
            : []),
          this.initElement(V, O, B),
          (this.tm = V.tm
            ? PropertyFactory.getProp(this, V.tm, 0, O.frameRate, this)
            : { _placeholder: !0 }));
      }
      (extendPrototype(
        [HybridRendererBase, ICompElement, HBaseElement],
        HCompElement,
      ),
        (HCompElement.prototype._createBaseContainerElements =
          HCompElement.prototype.createContainerElements),
        (HCompElement.prototype.createContainerElements = function () {
          (this._createBaseContainerElements(),
            this.data.hasMask
              ? (this.svgElement.setAttribute("width", this.data.w),
                this.svgElement.setAttribute("height", this.data.h),
                (this.transformedElement = this.baseElement))
              : (this.transformedElement = this.layerElement));
        }),
        (HCompElement.prototype.addTo3dContainer = function (V, O) {
          for (var B = 0, z; B < O; )
            (this.elements[B] &&
              this.elements[B].getBaseElement &&
              (z = this.elements[B].getBaseElement()),
              (B += 1));
          z
            ? this.layerElement.insertBefore(V, z)
            : this.layerElement.appendChild(V);
        }),
        (HCompElement.prototype.createComp = function (V) {
          return this.supports3d
            ? new HCompElement(V, this.globalData, this)
            : new SVGCompElement(V, this.globalData, this);
        }));
      function HybridRenderer(V, O) {
        ((this.animationItem = V),
          (this.layers = null),
          (this.renderedFrame = -1),
          (this.renderConfig = {
            className: (O && O.className) || "",
            imagePreserveAspectRatio:
              (O && O.imagePreserveAspectRatio) || "xMidYMid slice",
            hideOnTransparent: !(O && O.hideOnTransparent === !1),
            filterSize: {
              width: (O && O.filterSize && O.filterSize.width) || "400%",
              height: (O && O.filterSize && O.filterSize.height) || "400%",
              x: (O && O.filterSize && O.filterSize.x) || "-100%",
              y: (O && O.filterSize && O.filterSize.y) || "-100%",
            },
            runExpressions:
              !O || O.runExpressions === void 0 || O.runExpressions,
          }),
          (this.globalData = {
            _mdf: !1,
            frameNum: -1,
            renderConfig: this.renderConfig,
          }),
          (this.pendingElements = []),
          (this.elements = []),
          (this.threeDElements = []),
          (this.destroyed = !1),
          (this.camera = null),
          (this.supports3d = !0),
          (this.rendererType = "html"));
      }
      (extendPrototype([HybridRendererBase], HybridRenderer),
        (HybridRenderer.prototype.createComp = function (V) {
          return this.supports3d
            ? new HCompElement(V, this.globalData, this)
            : new SVGCompElement(V, this.globalData, this);
        }));
      var CompExpressionInterface = (function () {
        return function (V) {
          function O(B) {
            for (var z = 0, N = V.layers.length; z < N; ) {
              if (V.layers[z].nm === B || V.layers[z].ind === B)
                return V.elements[z].layerInterface;
              z += 1;
            }
            return null;
          }
          return (
            Object.defineProperty(O, "_name", { value: V.data.nm }),
            (O.layer = O),
            (O.pixelAspect = 1),
            (O.height = V.data.h || V.globalData.compSize.h),
            (O.width = V.data.w || V.globalData.compSize.w),
            (O.pixelAspect = 1),
            (O.frameDuration = 1 / V.globalData.frameRate),
            (O.displayStartTime = 0),
            (O.numLayers = V.layers.length),
            O
          );
        };
      })();
      function _typeof$2(V) {
        "@babel/helpers - typeof";
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof$2 = function (B) {
                return typeof B;
              })
            : (_typeof$2 = function (B) {
                return B &&
                  typeof Symbol == "function" &&
                  B.constructor === Symbol &&
                  B !== Symbol.prototype
                  ? "symbol"
                  : typeof B;
              }),
          _typeof$2(V)
        );
      }
      function seedRandom(V, O) {
        var B = this,
          z = 256,
          N = 6,
          G = 52,
          H = "random",
          W = O.pow(z, N),
          q = O.pow(2, G),
          j = q * 2,
          Y = z - 1,
          re;
        function U(J, ee, ne) {
          var oe = [];
          ee = ee === !0 ? { entropy: !0 } : ee || {};
          var he = se(X(ee.entropy ? [J, te(V)] : J === null ? Q() : J, 3), oe),
            ce = new K(oe),
            ue = function () {
              for (var ye = ce.g(N), me = W, be = 0; ye < q; )
                ((ye = (ye + be) * z), (me *= z), (be = ce.g(1)));
              for (; ye >= j; ) ((ye /= 2), (me /= 2), (be >>>= 1));
              return (ye + be) / me;
            };
          return (
            (ue.int32 = function () {
              return ce.g(4) | 0;
            }),
            (ue.quick = function () {
              return ce.g(4) / 4294967296;
            }),
            (ue.double = ue),
            se(te(ce.S), V),
            (
              ee.pass ||
              ne ||
              function (ge, ye, me, be) {
                return (
                  be &&
                    (be.S && Z(be, ce),
                    (ge.state = function () {
                      return Z(ce, {});
                    })),
                  me ? ((O[H] = ge), ye) : ge
                );
              }
            )(ue, he, "global" in ee ? ee.global : this == O, ee.state)
          );
        }
        O["seed" + H] = U;
        function K(J) {
          var ee,
            ne = J.length,
            oe = this,
            he = 0,
            ce = (oe.i = oe.j = 0),
            ue = (oe.S = []);
          for (ne || (J = [ne++]); he < z; ) ue[he] = he++;
          for (he = 0; he < z; he++)
            ((ue[he] = ue[(ce = Y & (ce + J[he % ne] + (ee = ue[he])))]),
              (ue[ce] = ee));
          oe.g = function (ge) {
            for (var ye, me = 0, be = oe.i, Se = oe.j, _e = oe.S; ge--; )
              ((ye = _e[(be = Y & (be + 1))]),
                (me =
                  me * z +
                  _e[
                    Y & ((_e[be] = _e[(Se = Y & (Se + ye))]) + (_e[Se] = ye))
                  ]));
            return ((oe.i = be), (oe.j = Se), me);
          };
        }
        function Z(J, ee) {
          return ((ee.i = J.i), (ee.j = J.j), (ee.S = J.S.slice()), ee);
        }
        function X(J, ee) {
          var ne = [],
            oe = _typeof$2(J),
            he;
          if (ee && oe == "object")
            for (he in J)
              try {
                ne.push(X(J[he], ee - 1));
              } catch {}
          return ne.length ? ne : oe == "string" ? J : J + "\0";
        }
        function se(J, ee) {
          for (var ne = J + "", oe, he = 0; he < ne.length; )
            ee[Y & he] = Y & ((oe ^= ee[Y & he] * 19) + ne.charCodeAt(he++));
          return te(ee);
        }
        function Q() {
          try {
            var J = new Uint8Array(z);
            return ((B.crypto || B.msCrypto).getRandomValues(J), te(J));
          } catch {
            var ee = B.navigator,
              ne = ee && ee.plugins;
            return [+new Date(), B, ne, B.screen, te(V)];
          }
        }
        function te(J) {
          return String.fromCharCode.apply(0, J);
        }
        se(O.random(), V);
      }
      function initialize$2(V) {
        seedRandom([], V);
      }
      var propTypes = { SHAPE: "shape" };
      function _typeof$1(V) {
        "@babel/helpers - typeof";
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof$1 = function (B) {
                return typeof B;
              })
            : (_typeof$1 = function (B) {
                return B &&
                  typeof Symbol == "function" &&
                  B.constructor === Symbol &&
                  B !== Symbol.prototype
                  ? "symbol"
                  : typeof B;
              }),
          _typeof$1(V)
        );
      }
      var ExpressionManager = (function () {
          var ob = {},
            Math = BMMath,
            window = null,
            document = null,
            XMLHttpRequest = null,
            fetch = null,
            frames = null,
            _lottieGlobal = {};
          initialize$2(BMMath);
          function resetFrame() {
            _lottieGlobal = {};
          }
          function $bm_isInstanceOfArray(V) {
            return V.constructor === Array || V.constructor === Float32Array;
          }
          function isNumerable(V, O) {
            return (
              V === "number" ||
              O instanceof Number ||
              V === "boolean" ||
              V === "string"
            );
          }
          function $bm_neg(V) {
            var O = _typeof$1(V);
            if (O === "number" || V instanceof Number || O === "boolean")
              return -V;
            if ($bm_isInstanceOfArray(V)) {
              var B,
                z = V.length,
                N = [];
              for (B = 0; B < z; B += 1) N[B] = -V[B];
              return N;
            }
            return V.propType ? V.v : -V;
          }
          var easeInBez = BezierFactory.getBezierEasing(
              0.333,
              0,
              0.833,
              0.833,
              "easeIn",
            ).get,
            easeOutBez = BezierFactory.getBezierEasing(
              0.167,
              0.167,
              0.667,
              1,
              "easeOut",
            ).get,
            easeInOutBez = BezierFactory.getBezierEasing(
              0.33,
              0,
              0.667,
              1,
              "easeInOut",
            ).get;
          function sum(V, O) {
            var B = _typeof$1(V),
              z = _typeof$1(O);
            if (
              (isNumerable(B, V) && isNumerable(z, O)) ||
              B === "string" ||
              z === "string"
            )
              return V + O;
            if ($bm_isInstanceOfArray(V) && isNumerable(z, O))
              return ((V = V.slice(0)), (V[0] += O), V);
            if (isNumerable(B, V) && $bm_isInstanceOfArray(O))
              return ((O = O.slice(0)), (O[0] = V + O[0]), O);
            if ($bm_isInstanceOfArray(V) && $bm_isInstanceOfArray(O)) {
              for (
                var N = 0, G = V.length, H = O.length, W = [];
                N < G || N < H;
              )
                ((typeof V[N] == "number" || V[N] instanceof Number) &&
                (typeof O[N] == "number" || O[N] instanceof Number)
                  ? (W[N] = V[N] + O[N])
                  : (W[N] = O[N] === void 0 ? V[N] : V[N] || O[N]),
                  (N += 1));
              return W;
            }
            return 0;
          }
          var add = sum;
          function sub(V, O) {
            var B = _typeof$1(V),
              z = _typeof$1(O);
            if (isNumerable(B, V) && isNumerable(z, O))
              return (
                B === "string" && (V = parseInt(V, 10)),
                z === "string" && (O = parseInt(O, 10)),
                V - O
              );
            if ($bm_isInstanceOfArray(V) && isNumerable(z, O))
              return ((V = V.slice(0)), (V[0] -= O), V);
            if (isNumerable(B, V) && $bm_isInstanceOfArray(O))
              return ((O = O.slice(0)), (O[0] = V - O[0]), O);
            if ($bm_isInstanceOfArray(V) && $bm_isInstanceOfArray(O)) {
              for (
                var N = 0, G = V.length, H = O.length, W = [];
                N < G || N < H;
              )
                ((typeof V[N] == "number" || V[N] instanceof Number) &&
                (typeof O[N] == "number" || O[N] instanceof Number)
                  ? (W[N] = V[N] - O[N])
                  : (W[N] = O[N] === void 0 ? V[N] : V[N] || O[N]),
                  (N += 1));
              return W;
            }
            return 0;
          }
          function mul(V, O) {
            var B = _typeof$1(V),
              z = _typeof$1(O),
              N;
            if (isNumerable(B, V) && isNumerable(z, O)) return V * O;
            var G, H;
            if ($bm_isInstanceOfArray(V) && isNumerable(z, O)) {
              for (
                H = V.length, N = createTypedArray("float32", H), G = 0;
                G < H;
                G += 1
              )
                N[G] = V[G] * O;
              return N;
            }
            if (isNumerable(B, V) && $bm_isInstanceOfArray(O)) {
              for (
                H = O.length, N = createTypedArray("float32", H), G = 0;
                G < H;
                G += 1
              )
                N[G] = V * O[G];
              return N;
            }
            return 0;
          }
          function div(V, O) {
            var B = _typeof$1(V),
              z = _typeof$1(O),
              N;
            if (isNumerable(B, V) && isNumerable(z, O)) return V / O;
            var G, H;
            if ($bm_isInstanceOfArray(V) && isNumerable(z, O)) {
              for (
                H = V.length, N = createTypedArray("float32", H), G = 0;
                G < H;
                G += 1
              )
                N[G] = V[G] / O;
              return N;
            }
            if (isNumerable(B, V) && $bm_isInstanceOfArray(O)) {
              for (
                H = O.length, N = createTypedArray("float32", H), G = 0;
                G < H;
                G += 1
              )
                N[G] = V / O[G];
              return N;
            }
            return 0;
          }
          function mod(V, O) {
            return (
              typeof V == "string" && (V = parseInt(V, 10)),
              typeof O == "string" && (O = parseInt(O, 10)),
              V % O
            );
          }
          var $bm_sum = sum,
            $bm_sub = sub,
            $bm_mul = mul,
            $bm_div = div,
            $bm_mod = mod;
          function clamp(V, O, B) {
            if (O > B) {
              var z = B;
              ((B = O), (O = z));
            }
            return Math.min(Math.max(V, O), B);
          }
          function radiansToDegrees(V) {
            return V / degToRads;
          }
          var radians_to_degrees = radiansToDegrees;
          function degreesToRadians(V) {
            return V * degToRads;
          }
          var degrees_to_radians = radiansToDegrees,
            helperLengthArray = [0, 0, 0, 0, 0, 0];
          function length(V, O) {
            if (typeof V == "number" || V instanceof Number)
              return ((O = O || 0), Math.abs(V - O));
            O || (O = helperLengthArray);
            var B,
              z = Math.min(V.length, O.length),
              N = 0;
            for (B = 0; B < z; B += 1) N += Math.pow(O[B] - V[B], 2);
            return Math.sqrt(N);
          }
          function normalize(V) {
            return div(V, length(V));
          }
          function rgbToHsl(V) {
            var O = V[0],
              B = V[1],
              z = V[2],
              N = Math.max(O, B, z),
              G = Math.min(O, B, z),
              H,
              W,
              q = (N + G) / 2;
            if (N === G) ((H = 0), (W = 0));
            else {
              var j = N - G;
              switch (((W = q > 0.5 ? j / (2 - N - G) : j / (N + G)), N)) {
                case O:
                  H = (B - z) / j + (B < z ? 6 : 0);
                  break;
                case B:
                  H = (z - O) / j + 2;
                  break;
                case z:
                  H = (O - B) / j + 4;
                  break;
              }
              H /= 6;
            }
            return [H, W, q, V[3]];
          }
          function hue2rgb(V, O, B) {
            return (
              B < 0 && (B += 1),
              B > 1 && (B -= 1),
              B < 1 / 6
                ? V + (O - V) * 6 * B
                : B < 1 / 2
                  ? O
                  : B < 2 / 3
                    ? V + (O - V) * (2 / 3 - B) * 6
                    : V
            );
          }
          function hslToRgb(V) {
            var O = V[0],
              B = V[1],
              z = V[2],
              N,
              G,
              H;
            if (B === 0) ((N = z), (H = z), (G = z));
            else {
              var W = z < 0.5 ? z * (1 + B) : z + B - z * B,
                q = 2 * z - W;
              ((N = hue2rgb(q, W, O + 1 / 3)),
                (G = hue2rgb(q, W, O)),
                (H = hue2rgb(q, W, O - 1 / 3)));
            }
            return [N, G, H, V[3]];
          }
          function linear(V, O, B, z, N) {
            if (
              ((z === void 0 || N === void 0) &&
                ((z = O), (N = B), (O = 0), (B = 1)),
              B < O)
            ) {
              var G = B;
              ((B = O), (O = G));
            }
            if (V <= O) return z;
            if (V >= B) return N;
            var H = B === O ? 0 : (V - O) / (B - O);
            if (!z.length) return z + (N - z) * H;
            var W,
              q = z.length,
              j = createTypedArray("float32", q);
            for (W = 0; W < q; W += 1) j[W] = z[W] + (N[W] - z[W]) * H;
            return j;
          }
          function random(V, O) {
            if (
              (O === void 0 &&
                (V === void 0 ? ((V = 0), (O = 1)) : ((O = V), (V = void 0))),
              O.length)
            ) {
              var B,
                z = O.length;
              V || (V = createTypedArray("float32", z));
              var N = createTypedArray("float32", z),
                G = BMMath.random();
              for (B = 0; B < z; B += 1) N[B] = V[B] + G * (O[B] - V[B]);
              return N;
            }
            V === void 0 && (V = 0);
            var H = BMMath.random();
            return V + H * (O - V);
          }
          function createPath(V, O, B, z) {
            var N,
              G = V.length,
              H = shapePool.newElement();
            H.setPathData(!!z, G);
            var W = [0, 0],
              q,
              j;
            for (N = 0; N < G; N += 1)
              ((q = O && O[N] ? O[N] : W),
                (j = B && B[N] ? B[N] : W),
                H.setTripleAt(
                  V[N][0],
                  V[N][1],
                  j[0] + V[N][0],
                  j[1] + V[N][1],
                  q[0] + V[N][0],
                  q[1] + V[N][1],
                  N,
                  !0,
                ));
            return H;
          }
          function initiateExpression(elem, data, property) {
            function noOp(V) {
              return V;
            }
            if (!elem.globalData.renderConfig.runExpressions) return noOp;
            var val = data.x,
              needsVelocity = /velocity(?![\w\d])/.test(val),
              _needsRandom = val.indexOf("random") !== -1,
              elemType = elem.data.ty,
              transform,
              $bm_transform,
              content,
              effect,
              thisProperty = property;
            ((thisProperty.valueAtTime = thisProperty.getValueAtTime),
              Object.defineProperty(thisProperty, "value", {
                get: function () {
                  return thisProperty.v;
                },
              }),
              (elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate),
              (elem.comp.displayStartTime = 0));
            var inPoint = elem.data.ip / elem.comp.globalData.frameRate,
              outPoint = elem.data.op / elem.comp.globalData.frameRate,
              width = elem.data.sw ? elem.data.sw : 0,
              height = elem.data.sh ? elem.data.sh : 0,
              name = elem.data.nm,
              loopIn,
              loop_in,
              loopOut,
              loop_out,
              smooth,
              toWorld,
              fromWorld,
              fromComp,
              toComp,
              fromCompToSurface,
              position,
              rotation,
              anchorPoint,
              scale,
              thisLayer,
              thisComp,
              mask,
              valueAtTime,
              velocityAtTime,
              scoped_bm_rt,
              expression_function = eval(
                "[function _expression_function(){" +
                  val +
                  ";scoped_bm_rt=$bm_rt}]",
              )[0],
              numKeys = property.kf ? data.k.length : 0,
              active = !this.data || this.data.hd !== !0,
              wiggle = function V(O, B) {
                var z,
                  N,
                  G = this.pv.length ? this.pv.length : 1,
                  H = createTypedArray("float32", G);
                O = 5;
                var W = Math.floor(time * O);
                for (z = 0, N = 0; z < W; ) {
                  for (N = 0; N < G; N += 1)
                    H[N] += -B + B * 2 * BMMath.random();
                  z += 1;
                }
                var q = time * O,
                  j = q - Math.floor(q),
                  Y = createTypedArray("float32", G);
                if (G > 1) {
                  for (N = 0; N < G; N += 1)
                    Y[N] =
                      this.pv[N] + H[N] + (-B + B * 2 * BMMath.random()) * j;
                  return Y;
                }
                return this.pv + H[0] + (-B + B * 2 * BMMath.random()) * j;
              }.bind(this);
            (thisProperty.loopIn &&
              ((loopIn = thisProperty.loopIn.bind(thisProperty)),
              (loop_in = loopIn)),
              thisProperty.loopOut &&
                ((loopOut = thisProperty.loopOut.bind(thisProperty)),
                (loop_out = loopOut)),
              thisProperty.smooth &&
                (smooth = thisProperty.smooth.bind(thisProperty)));
            function loopInDuration(V, O) {
              return loopIn(V, O, !0);
            }
            function loopOutDuration(V, O) {
              return loopOut(V, O, !0);
            }
            (this.getValueAtTime &&
              (valueAtTime = this.getValueAtTime.bind(this)),
              this.getVelocityAtTime &&
                (velocityAtTime = this.getVelocityAtTime.bind(this)));
            var comp = elem.comp.globalData.projectInterface.bind(
              elem.comp.globalData.projectInterface,
            );
            function lookAt(V, O) {
              var B = [O[0] - V[0], O[1] - V[1], O[2] - V[2]],
                z =
                  Math.atan2(B[0], Math.sqrt(B[1] * B[1] + B[2] * B[2])) /
                  degToRads,
                N = -Math.atan2(B[1], B[2]) / degToRads;
              return [N, z, 0];
            }
            function easeOut(V, O, B, z, N) {
              return applyEase(easeOutBez, V, O, B, z, N);
            }
            function easeIn(V, O, B, z, N) {
              return applyEase(easeInBez, V, O, B, z, N);
            }
            function ease(V, O, B, z, N) {
              return applyEase(easeInOutBez, V, O, B, z, N);
            }
            function applyEase(V, O, B, z, N, G) {
              (N === void 0 ? ((N = B), (G = z)) : (O = (O - B) / (z - B)),
                O > 1 ? (O = 1) : O < 0 && (O = 0));
              var H = V(O);
              if ($bm_isInstanceOfArray(N)) {
                var W,
                  q = N.length,
                  j = createTypedArray("float32", q);
                for (W = 0; W < q; W += 1) j[W] = (G[W] - N[W]) * H + N[W];
                return j;
              }
              return (G - N) * H + N;
            }
            function nearestKey(V) {
              var O,
                B = data.k.length,
                z,
                N;
              if (!data.k.length || typeof data.k[0] == "number")
                ((z = 0), (N = 0));
              else if (
                ((z = -1),
                (V *= elem.comp.globalData.frameRate),
                V < data.k[0].t)
              )
                ((z = 1), (N = data.k[0].t));
              else {
                for (O = 0; O < B - 1; O += 1)
                  if (V === data.k[O].t) {
                    ((z = O + 1), (N = data.k[O].t));
                    break;
                  } else if (V > data.k[O].t && V < data.k[O + 1].t) {
                    V - data.k[O].t > data.k[O + 1].t - V
                      ? ((z = O + 2), (N = data.k[O + 1].t))
                      : ((z = O + 1), (N = data.k[O].t));
                    break;
                  }
                z === -1 && ((z = O + 1), (N = data.k[O].t));
              }
              var G = {};
              return (
                (G.index = z),
                (G.time = N / elem.comp.globalData.frameRate),
                G
              );
            }
            function key(V) {
              var O, B, z;
              if (!data.k.length || typeof data.k[0] == "number")
                throw new Error("The property has no keyframe at index " + V);
              ((V -= 1),
                (O = {
                  time: data.k[V].t / elem.comp.globalData.frameRate,
                  value: [],
                }));
              var N = Object.prototype.hasOwnProperty.call(data.k[V], "s")
                ? data.k[V].s
                : data.k[V - 1].e;
              for (z = N.length, B = 0; B < z; B += 1)
                ((O[B] = N[B]), (O.value[B] = N[B]));
              return O;
            }
            function framesToTime(V, O) {
              return (O || (O = elem.comp.globalData.frameRate), V / O);
            }
            function timeToFrames(V, O) {
              return (
                !V && V !== 0 && (V = time),
                O || (O = elem.comp.globalData.frameRate),
                V * O
              );
            }
            function seedRandom(V) {
              BMMath.seedrandom(randSeed + V);
            }
            function sourceRectAtTime() {
              return elem.sourceRectAtTime();
            }
            function substring(V, O) {
              return typeof value == "string"
                ? O === void 0
                  ? value.substring(V)
                  : value.substring(V, O)
                : "";
            }
            function substr(V, O) {
              return typeof value == "string"
                ? O === void 0
                  ? value.substr(V)
                  : value.substr(V, O)
                : "";
            }
            function posterizeTime(V) {
              ((time = V === 0 ? 0 : Math.floor(time * V) / V),
                (value = valueAtTime(time)));
            }
            var time,
              velocity,
              value,
              text,
              textIndex,
              textTotal,
              selectorValue,
              index = elem.data.ind,
              hasParent = !!(elem.hierarchy && elem.hierarchy.length),
              parent,
              randSeed = Math.floor(Math.random() * 1e6),
              globalData = elem.globalData;
            function executeExpression(V) {
              return (
                (value = V),
                this.frameExpressionId === elem.globalData.frameId &&
                this.propType !== "textSelector"
                  ? value
                  : (this.propType === "textSelector" &&
                      ((textIndex = this.textIndex),
                      (textTotal = this.textTotal),
                      (selectorValue = this.selectorValue)),
                    thisLayer ||
                      ((text = elem.layerInterface.text),
                      (thisLayer = elem.layerInterface),
                      (thisComp = elem.comp.compInterface),
                      (toWorld = thisLayer.toWorld.bind(thisLayer)),
                      (fromWorld = thisLayer.fromWorld.bind(thisLayer)),
                      (fromComp = thisLayer.fromComp.bind(thisLayer)),
                      (toComp = thisLayer.toComp.bind(thisLayer)),
                      (mask = thisLayer.mask
                        ? thisLayer.mask.bind(thisLayer)
                        : null),
                      (fromCompToSurface = fromComp)),
                    transform ||
                      ((transform = elem.layerInterface(
                        "ADBE Transform Group",
                      )),
                      ($bm_transform = transform),
                      transform && (anchorPoint = transform.anchorPoint)),
                    elemType === 4 &&
                      !content &&
                      (content = thisLayer("ADBE Root Vectors Group")),
                    effect || (effect = thisLayer(4)),
                    (hasParent = !!(elem.hierarchy && elem.hierarchy.length)),
                    hasParent &&
                      !parent &&
                      (parent = elem.hierarchy[0].layerInterface),
                    (time =
                      this.comp.renderedFrame / this.comp.globalData.frameRate),
                    _needsRandom && seedRandom(randSeed + time),
                    needsVelocity && (velocity = velocityAtTime(time)),
                    expression_function(),
                    (this.frameExpressionId = elem.globalData.frameId),
                    (scoped_bm_rt =
                      scoped_bm_rt.propType === propTypes.SHAPE
                        ? scoped_bm_rt.v
                        : scoped_bm_rt),
                    scoped_bm_rt)
              );
            }
            return (
              (executeExpression.__preventDeadCodeRemoval = [
                $bm_transform,
                anchorPoint,
                time,
                velocity,
                inPoint,
                outPoint,
                width,
                height,
                name,
                loop_in,
                loop_out,
                smooth,
                toComp,
                fromCompToSurface,
                toWorld,
                fromWorld,
                mask,
                position,
                rotation,
                scale,
                thisComp,
                numKeys,
                active,
                wiggle,
                loopInDuration,
                loopOutDuration,
                comp,
                lookAt,
                easeOut,
                easeIn,
                ease,
                nearestKey,
                key,
                text,
                textIndex,
                textTotal,
                selectorValue,
                framesToTime,
                timeToFrames,
                sourceRectAtTime,
                substring,
                substr,
                posterizeTime,
                index,
                globalData,
              ]),
              executeExpression
            );
          }
          return (
            (ob.initiateExpression = initiateExpression),
            (ob.__preventDeadCodeRemoval = [
              window,
              document,
              XMLHttpRequest,
              fetch,
              frames,
              $bm_neg,
              add,
              $bm_sum,
              $bm_sub,
              $bm_mul,
              $bm_div,
              $bm_mod,
              clamp,
              radians_to_degrees,
              degreesToRadians,
              degrees_to_radians,
              normalize,
              rgbToHsl,
              hslToRgb,
              linear,
              random,
              createPath,
              _lottieGlobal,
            ]),
            (ob.resetFrame = resetFrame),
            ob
          );
        })(),
        Expressions = (function () {
          var V = {};
          ((V.initExpressions = O),
            (V.resetFrame = ExpressionManager.resetFrame));
          function O(B) {
            var z = 0,
              N = [];
            function G() {
              z += 1;
            }
            function H() {
              ((z -= 1), z === 0 && q());
            }
            function W(j) {
              N.indexOf(j) === -1 && N.push(j);
            }
            function q() {
              var j,
                Y = N.length;
              for (j = 0; j < Y; j += 1) N[j].release();
              N.length = 0;
            }
            ((B.renderer.compInterface = CompExpressionInterface(B.renderer)),
              B.renderer.globalData.projectInterface.registerComposition(
                B.renderer,
              ),
              (B.renderer.globalData.pushExpression = G),
              (B.renderer.globalData.popExpression = H),
              (B.renderer.globalData.registerExpressionProperty = W));
          }
          return V;
        })(),
        MaskManagerInterface = (function () {
          function V(B, z) {
            ((this._mask = B), (this._data = z));
          }
          (Object.defineProperty(V.prototype, "maskPath", {
            get: function () {
              return (
                this._mask.prop.k && this._mask.prop.getValue(),
                this._mask.prop
              );
            },
          }),
            Object.defineProperty(V.prototype, "maskOpacity", {
              get: function () {
                return (
                  this._mask.op.k && this._mask.op.getValue(),
                  this._mask.op.v * 100
                );
              },
            }));
          var O = function (z) {
            var N = createSizedArray(z.viewData.length),
              G,
              H = z.viewData.length;
            for (G = 0; G < H; G += 1)
              N[G] = new V(z.viewData[G], z.masksProperties[G]);
            var W = function (j) {
              for (G = 0; G < H; ) {
                if (z.masksProperties[G].nm === j) return N[G];
                G += 1;
              }
              return null;
            };
            return W;
          };
          return O;
        })(),
        ExpressionPropertyInterface = (function () {
          var V = { pv: 0, v: 0, mult: 1 },
            O = { pv: [0, 0, 0], v: [0, 0, 0], mult: 1 };
          function B(H, W, q) {
            (Object.defineProperty(H, "velocity", {
              get: function () {
                return W.getVelocityAtTime(W.comp.currentFrame);
              },
            }),
              (H.numKeys = W.keyframes ? W.keyframes.length : 0),
              (H.key = function (j) {
                if (!H.numKeys) return 0;
                var Y = "";
                "s" in W.keyframes[j - 1]
                  ? (Y = W.keyframes[j - 1].s)
                  : "e" in W.keyframes[j - 2]
                    ? (Y = W.keyframes[j - 2].e)
                    : (Y = W.keyframes[j - 2].s);
                var re =
                  q === "unidimensional" ? new Number(Y) : Object.assign({}, Y);
                return (
                  (re.time =
                    W.keyframes[j - 1].t / W.elem.comp.globalData.frameRate),
                  (re.value = q === "unidimensional" ? Y[0] : Y),
                  re
                );
              }),
              (H.valueAtTime = W.getValueAtTime),
              (H.speedAtTime = W.getSpeedAtTime),
              (H.velocityAtTime = W.getVelocityAtTime),
              (H.propertyGroup = W.propertyGroup));
          }
          function z(H) {
            (!H || !("pv" in H)) && (H = V);
            var W = 1 / H.mult,
              q = H.pv * W,
              j = new Number(q);
            return (
              (j.value = q),
              B(j, H, "unidimensional"),
              function () {
                return (
                  H.k && H.getValue(),
                  (q = H.v * W),
                  j.value !== q &&
                    ((j = new Number(q)),
                    (j.value = q),
                    B(j, H, "unidimensional")),
                  j
                );
              }
            );
          }
          function N(H) {
            (!H || !("pv" in H)) && (H = O);
            var W = 1 / H.mult,
              q = (H.data && H.data.l) || H.pv.length,
              j = createTypedArray("float32", q),
              Y = createTypedArray("float32", q);
            return (
              (j.value = Y),
              B(j, H, "multidimensional"),
              function () {
                H.k && H.getValue();
                for (var re = 0; re < q; re += 1)
                  ((Y[re] = H.v[re] * W), (j[re] = Y[re]));
                return j;
              }
            );
          }
          function G() {
            return V;
          }
          return function (H) {
            return H ? (H.propType === "unidimensional" ? z(H) : N(H)) : G;
          };
        })(),
        TransformExpressionInterface = (function () {
          return function (V) {
            function O(H) {
              switch (H) {
                case "scale":
                case "Scale":
                case "ADBE Scale":
                case 6:
                  return O.scale;
                case "rotation":
                case "Rotation":
                case "ADBE Rotation":
                case "ADBE Rotate Z":
                case 10:
                  return O.rotation;
                case "ADBE Rotate X":
                  return O.xRotation;
                case "ADBE Rotate Y":
                  return O.yRotation;
                case "position":
                case "Position":
                case "ADBE Position":
                case 2:
                  return O.position;
                case "ADBE Position_0":
                  return O.xPosition;
                case "ADBE Position_1":
                  return O.yPosition;
                case "ADBE Position_2":
                  return O.zPosition;
                case "anchorPoint":
                case "AnchorPoint":
                case "Anchor Point":
                case "ADBE AnchorPoint":
                case 1:
                  return O.anchorPoint;
                case "opacity":
                case "Opacity":
                case 11:
                  return O.opacity;
                default:
                  return null;
              }
            }
            (Object.defineProperty(O, "rotation", {
              get: ExpressionPropertyInterface(V.r || V.rz),
            }),
              Object.defineProperty(O, "zRotation", {
                get: ExpressionPropertyInterface(V.rz || V.r),
              }),
              Object.defineProperty(O, "xRotation", {
                get: ExpressionPropertyInterface(V.rx),
              }),
              Object.defineProperty(O, "yRotation", {
                get: ExpressionPropertyInterface(V.ry),
              }),
              Object.defineProperty(O, "scale", {
                get: ExpressionPropertyInterface(V.s),
              }));
            var B, z, N, G;
            return (
              V.p
                ? (G = ExpressionPropertyInterface(V.p))
                : ((B = ExpressionPropertyInterface(V.px)),
                  (z = ExpressionPropertyInterface(V.py)),
                  V.pz && (N = ExpressionPropertyInterface(V.pz))),
              Object.defineProperty(O, "position", {
                get: function () {
                  return V.p ? G() : [B(), z(), N ? N() : 0];
                },
              }),
              Object.defineProperty(O, "xPosition", {
                get: ExpressionPropertyInterface(V.px),
              }),
              Object.defineProperty(O, "yPosition", {
                get: ExpressionPropertyInterface(V.py),
              }),
              Object.defineProperty(O, "zPosition", {
                get: ExpressionPropertyInterface(V.pz),
              }),
              Object.defineProperty(O, "anchorPoint", {
                get: ExpressionPropertyInterface(V.a),
              }),
              Object.defineProperty(O, "opacity", {
                get: ExpressionPropertyInterface(V.o),
              }),
              Object.defineProperty(O, "skew", {
                get: ExpressionPropertyInterface(V.sk),
              }),
              Object.defineProperty(O, "skewAxis", {
                get: ExpressionPropertyInterface(V.sa),
              }),
              Object.defineProperty(O, "orientation", {
                get: ExpressionPropertyInterface(V.or),
              }),
              O
            );
          };
        })(),
        LayerExpressionInterface = (function () {
          function V(j) {
            var Y = new Matrix();
            if (j !== void 0) {
              var re = this._elem.finalTransform.mProp.getValueAtTime(j);
              re.clone(Y);
            } else {
              var U = this._elem.finalTransform.mProp;
              U.applyToMatrix(Y);
            }
            return Y;
          }
          function O(j, Y) {
            var re = this.getMatrix(Y);
            return (
              (re.props[12] = 0),
              (re.props[13] = 0),
              (re.props[14] = 0),
              this.applyPoint(re, j)
            );
          }
          function B(j, Y) {
            var re = this.getMatrix(Y);
            return this.applyPoint(re, j);
          }
          function z(j, Y) {
            var re = this.getMatrix(Y);
            return (
              (re.props[12] = 0),
              (re.props[13] = 0),
              (re.props[14] = 0),
              this.invertPoint(re, j)
            );
          }
          function N(j, Y) {
            var re = this.getMatrix(Y);
            return this.invertPoint(re, j);
          }
          function G(j, Y) {
            if (this._elem.hierarchy && this._elem.hierarchy.length) {
              var re,
                U = this._elem.hierarchy.length;
              for (re = 0; re < U; re += 1)
                this._elem.hierarchy[re].finalTransform.mProp.applyToMatrix(j);
            }
            return j.applyToPointArray(Y[0], Y[1], Y[2] || 0);
          }
          function H(j, Y) {
            if (this._elem.hierarchy && this._elem.hierarchy.length) {
              var re,
                U = this._elem.hierarchy.length;
              for (re = 0; re < U; re += 1)
                this._elem.hierarchy[re].finalTransform.mProp.applyToMatrix(j);
            }
            return j.inversePoint(Y);
          }
          function W(j) {
            var Y = new Matrix();
            if (
              (Y.reset(),
              this._elem.finalTransform.mProp.applyToMatrix(Y),
              this._elem.hierarchy && this._elem.hierarchy.length)
            ) {
              var re,
                U = this._elem.hierarchy.length;
              for (re = 0; re < U; re += 1)
                this._elem.hierarchy[re].finalTransform.mProp.applyToMatrix(Y);
              return Y.inversePoint(j);
            }
            return Y.inversePoint(j);
          }
          function q() {
            return [1, 1, 1, 1];
          }
          return function (j) {
            var Y;
            function re(X) {
              K.mask = new MaskManagerInterface(X, j);
            }
            function U(X) {
              K.effect = X;
            }
            function K(X) {
              switch (X) {
                case "ADBE Root Vectors Group":
                case "Contents":
                case 2:
                  return K.shapeInterface;
                case 1:
                case 6:
                case "Transform":
                case "transform":
                case "ADBE Transform Group":
                  return Y;
                case 4:
                case "ADBE Effect Parade":
                case "effects":
                case "Effects":
                  return K.effect;
                case "ADBE Text Properties":
                  return K.textInterface;
                default:
                  return null;
              }
            }
            ((K.getMatrix = V),
              (K.invertPoint = H),
              (K.applyPoint = G),
              (K.toWorld = B),
              (K.toWorldVec = O),
              (K.fromWorld = N),
              (K.fromWorldVec = z),
              (K.toComp = B),
              (K.fromComp = W),
              (K.sampleImage = q),
              (K.sourceRectAtTime = j.sourceRectAtTime.bind(j)),
              (K._elem = j),
              (Y = TransformExpressionInterface(j.finalTransform.mProp)));
            var Z = getDescriptor(Y, "anchorPoint");
            return (
              Object.defineProperties(K, {
                hasParent: {
                  get: function () {
                    return j.hierarchy.length;
                  },
                },
                parent: {
                  get: function () {
                    return j.hierarchy[0].layerInterface;
                  },
                },
                rotation: getDescriptor(Y, "rotation"),
                scale: getDescriptor(Y, "scale"),
                position: getDescriptor(Y, "position"),
                opacity: getDescriptor(Y, "opacity"),
                anchorPoint: Z,
                anchor_point: Z,
                transform: {
                  get: function () {
                    return Y;
                  },
                },
                active: {
                  get: function () {
                    return j.isInRange;
                  },
                },
              }),
              (K.startTime = j.data.st),
              (K.index = j.data.ind),
              (K.source = j.data.refId),
              (K.height = j.data.ty === 0 ? j.data.h : 100),
              (K.width = j.data.ty === 0 ? j.data.w : 100),
              (K.inPoint = j.data.ip / j.comp.globalData.frameRate),
              (K.outPoint = j.data.op / j.comp.globalData.frameRate),
              (K._name = j.data.nm),
              (K.registerMaskInterface = re),
              (K.registerEffectsInterface = U),
              K
            );
          };
        })(),
        propertyGroupFactory = (function () {
          return function (V, O) {
            return function (B) {
              return ((B = B === void 0 ? 1 : B), B <= 0 ? V : O(B - 1));
            };
          };
        })(),
        PropertyInterface = (function () {
          return function (V, O) {
            var B = { _name: V };
            function z(N) {
              return ((N = N === void 0 ? 1 : N), N <= 0 ? B : O(N - 1));
            }
            return z;
          };
        })(),
        EffectsExpressionInterface = (function () {
          var V = { createEffectsInterface: O };
          function O(N, G) {
            if (N.effectsManager) {
              var H = [],
                W = N.data.ef,
                q,
                j = N.effectsManager.effectElements.length;
              for (q = 0; q < j; q += 1)
                H.push(B(W[q], N.effectsManager.effectElements[q], G, N));
              var Y = N.data.ef || [],
                re = function (K) {
                  for (q = 0, j = Y.length; q < j; ) {
                    if (K === Y[q].nm || K === Y[q].mn || K === Y[q].ix)
                      return H[q];
                    q += 1;
                  }
                  return null;
                };
              return (
                Object.defineProperty(re, "numProperties", {
                  get: function () {
                    return Y.length;
                  },
                }),
                re
              );
            }
            return null;
          }
          function B(N, G, H, W) {
            function q(K) {
              for (var Z = N.ef, X = 0, se = Z.length; X < se; ) {
                if (K === Z[X].nm || K === Z[X].mn || K === Z[X].ix)
                  return Z[X].ty === 5 ? Y[X] : Y[X]();
                X += 1;
              }
              throw new Error();
            }
            var j = propertyGroupFactory(q, H),
              Y = [],
              re,
              U = N.ef.length;
            for (re = 0; re < U; re += 1)
              N.ef[re].ty === 5
                ? Y.push(
                    B(
                      N.ef[re],
                      G.effectElements[re],
                      G.effectElements[re].propertyGroup,
                      W,
                    ),
                  )
                : Y.push(z(G.effectElements[re], N.ef[re].ty, W, j));
            return (
              N.mn === "ADBE Color Control" &&
                Object.defineProperty(q, "color", {
                  get: function () {
                    return Y[0]();
                  },
                }),
              Object.defineProperties(q, {
                numProperties: {
                  get: function () {
                    return N.np;
                  },
                },
                _name: { value: N.nm },
                propertyGroup: { value: j },
              }),
              (q.enabled = N.en !== 0),
              (q.active = q.enabled),
              q
            );
          }
          function z(N, G, H, W) {
            var q = ExpressionPropertyInterface(N.p);
            function j() {
              return G === 10 ? H.comp.compInterface(N.p.v) : q();
            }
            return (
              N.p.setGroupProperty &&
                N.p.setGroupProperty(PropertyInterface("", W)),
              j
            );
          }
          return V;
        })(),
        ShapePathInterface = (function () {
          return function (O, B, z) {
            var N = B.sh;
            function G(W) {
              return W === "Shape" ||
                W === "shape" ||
                W === "Path" ||
                W === "path" ||
                W === "ADBE Vector Shape" ||
                W === 2
                ? G.path
                : null;
            }
            var H = propertyGroupFactory(G, z);
            return (
              N.setGroupProperty(PropertyInterface("Path", H)),
              Object.defineProperties(G, {
                path: {
                  get: function () {
                    return (N.k && N.getValue(), N);
                  },
                },
                shape: {
                  get: function () {
                    return (N.k && N.getValue(), N);
                  },
                },
                _name: { value: O.nm },
                ix: { value: O.ix },
                propertyIndex: { value: O.ix },
                mn: { value: O.mn },
                propertyGroup: { value: z },
              }),
              G
            );
          };
        })(),
        ShapeExpressionInterface = (function () {
          function V(Z, X, se) {
            var Q = [],
              te,
              J = Z ? Z.length : 0;
            for (te = 0; te < J; te += 1)
              Z[te].ty === "gr"
                ? Q.push(B(Z[te], X[te], se))
                : Z[te].ty === "fl"
                  ? Q.push(z(Z[te], X[te], se))
                  : Z[te].ty === "st"
                    ? Q.push(H(Z[te], X[te], se))
                    : Z[te].ty === "tm"
                      ? Q.push(W(Z[te], X[te], se))
                      : Z[te].ty === "tr" ||
                        (Z[te].ty === "el"
                          ? Q.push(j(Z[te], X[te], se))
                          : Z[te].ty === "sr"
                            ? Q.push(Y(Z[te], X[te], se))
                            : Z[te].ty === "sh"
                              ? Q.push(ShapePathInterface(Z[te], X[te], se))
                              : Z[te].ty === "rc"
                                ? Q.push(re(Z[te], X[te], se))
                                : Z[te].ty === "rd"
                                  ? Q.push(U(Z[te], X[te], se))
                                  : Z[te].ty === "rp"
                                    ? Q.push(K(Z[te], X[te], se))
                                    : Z[te].ty === "gf"
                                      ? Q.push(N(Z[te], X[te], se))
                                      : Q.push(G(Z[te], X[te])));
            return Q;
          }
          function O(Z, X, se) {
            var Q,
              te = function (ne) {
                for (var oe = 0, he = Q.length; oe < he; ) {
                  if (
                    Q[oe]._name === ne ||
                    Q[oe].mn === ne ||
                    Q[oe].propertyIndex === ne ||
                    Q[oe].ix === ne ||
                    Q[oe].ind === ne
                  )
                    return Q[oe];
                  oe += 1;
                }
                return typeof ne == "number" ? Q[ne - 1] : null;
              };
            ((te.propertyGroup = propertyGroupFactory(te, se)),
              (Q = V(Z.it, X.it, te.propertyGroup)),
              (te.numProperties = Q.length));
            var J = q(
              Z.it[Z.it.length - 1],
              X.it[X.it.length - 1],
              te.propertyGroup,
            );
            return (
              (te.transform = J),
              (te.propertyIndex = Z.cix),
              (te._name = Z.nm),
              te
            );
          }
          function B(Z, X, se) {
            var Q = function (ne) {
              switch (ne) {
                case "ADBE Vectors Group":
                case "Contents":
                case 2:
                  return Q.content;
                default:
                  return Q.transform;
              }
            };
            Q.propertyGroup = propertyGroupFactory(Q, se);
            var te = O(Z, X, Q.propertyGroup),
              J = q(
                Z.it[Z.it.length - 1],
                X.it[X.it.length - 1],
                Q.propertyGroup,
              );
            return (
              (Q.content = te),
              (Q.transform = J),
              Object.defineProperty(Q, "_name", {
                get: function () {
                  return Z.nm;
                },
              }),
              (Q.numProperties = Z.np),
              (Q.propertyIndex = Z.ix),
              (Q.nm = Z.nm),
              (Q.mn = Z.mn),
              Q
            );
          }
          function z(Z, X, se) {
            function Q(te) {
              return te === "Color" || te === "color"
                ? Q.color
                : te === "Opacity" || te === "opacity"
                  ? Q.opacity
                  : null;
            }
            return (
              Object.defineProperties(Q, {
                color: { get: ExpressionPropertyInterface(X.c) },
                opacity: { get: ExpressionPropertyInterface(X.o) },
                _name: { value: Z.nm },
                mn: { value: Z.mn },
              }),
              X.c.setGroupProperty(PropertyInterface("Color", se)),
              X.o.setGroupProperty(PropertyInterface("Opacity", se)),
              Q
            );
          }
          function N(Z, X, se) {
            function Q(te) {
              return te === "Start Point" || te === "start point"
                ? Q.startPoint
                : te === "End Point" || te === "end point"
                  ? Q.endPoint
                  : te === "Opacity" || te === "opacity"
                    ? Q.opacity
                    : null;
            }
            return (
              Object.defineProperties(Q, {
                startPoint: { get: ExpressionPropertyInterface(X.s) },
                endPoint: { get: ExpressionPropertyInterface(X.e) },
                opacity: { get: ExpressionPropertyInterface(X.o) },
                type: {
                  get: function () {
                    return "a";
                  },
                },
                _name: { value: Z.nm },
                mn: { value: Z.mn },
              }),
              X.s.setGroupProperty(PropertyInterface("Start Point", se)),
              X.e.setGroupProperty(PropertyInterface("End Point", se)),
              X.o.setGroupProperty(PropertyInterface("Opacity", se)),
              Q
            );
          }
          function G() {
            function Z() {
              return null;
            }
            return Z;
          }
          function H(Z, X, se) {
            var Q = propertyGroupFactory(he, se),
              te = propertyGroupFactory(oe, Q);
            function J(ce) {
              Object.defineProperty(oe, Z.d[ce].nm, {
                get: ExpressionPropertyInterface(X.d.dataProps[ce].p),
              });
            }
            var ee,
              ne = Z.d ? Z.d.length : 0,
              oe = {};
            for (ee = 0; ee < ne; ee += 1)
              (J(ee), X.d.dataProps[ee].p.setGroupProperty(te));
            function he(ce) {
              return ce === "Color" || ce === "color"
                ? he.color
                : ce === "Opacity" || ce === "opacity"
                  ? he.opacity
                  : ce === "Stroke Width" || ce === "stroke width"
                    ? he.strokeWidth
                    : null;
            }
            return (
              Object.defineProperties(he, {
                color: { get: ExpressionPropertyInterface(X.c) },
                opacity: { get: ExpressionPropertyInterface(X.o) },
                strokeWidth: { get: ExpressionPropertyInterface(X.w) },
                dash: {
                  get: function () {
                    return oe;
                  },
                },
                _name: { value: Z.nm },
                mn: { value: Z.mn },
              }),
              X.c.setGroupProperty(PropertyInterface("Color", Q)),
              X.o.setGroupProperty(PropertyInterface("Opacity", Q)),
              X.w.setGroupProperty(PropertyInterface("Stroke Width", Q)),
              he
            );
          }
          function W(Z, X, se) {
            function Q(J) {
              return J === Z.e.ix || J === "End" || J === "end"
                ? Q.end
                : J === Z.s.ix
                  ? Q.start
                  : J === Z.o.ix
                    ? Q.offset
                    : null;
            }
            var te = propertyGroupFactory(Q, se);
            return (
              (Q.propertyIndex = Z.ix),
              X.s.setGroupProperty(PropertyInterface("Start", te)),
              X.e.setGroupProperty(PropertyInterface("End", te)),
              X.o.setGroupProperty(PropertyInterface("Offset", te)),
              (Q.propertyIndex = Z.ix),
              (Q.propertyGroup = se),
              Object.defineProperties(Q, {
                start: { get: ExpressionPropertyInterface(X.s) },
                end: { get: ExpressionPropertyInterface(X.e) },
                offset: { get: ExpressionPropertyInterface(X.o) },
                _name: { value: Z.nm },
              }),
              (Q.mn = Z.mn),
              Q
            );
          }
          function q(Z, X, se) {
            function Q(J) {
              return Z.a.ix === J || J === "Anchor Point"
                ? Q.anchorPoint
                : Z.o.ix === J || J === "Opacity"
                  ? Q.opacity
                  : Z.p.ix === J || J === "Position"
                    ? Q.position
                    : Z.r.ix === J ||
                        J === "Rotation" ||
                        J === "ADBE Vector Rotation"
                      ? Q.rotation
                      : Z.s.ix === J || J === "Scale"
                        ? Q.scale
                        : (Z.sk && Z.sk.ix === J) || J === "Skew"
                          ? Q.skew
                          : (Z.sa && Z.sa.ix === J) || J === "Skew Axis"
                            ? Q.skewAxis
                            : null;
            }
            var te = propertyGroupFactory(Q, se);
            return (
              X.transform.mProps.o.setGroupProperty(
                PropertyInterface("Opacity", te),
              ),
              X.transform.mProps.p.setGroupProperty(
                PropertyInterface("Position", te),
              ),
              X.transform.mProps.a.setGroupProperty(
                PropertyInterface("Anchor Point", te),
              ),
              X.transform.mProps.s.setGroupProperty(
                PropertyInterface("Scale", te),
              ),
              X.transform.mProps.r.setGroupProperty(
                PropertyInterface("Rotation", te),
              ),
              X.transform.mProps.sk &&
                (X.transform.mProps.sk.setGroupProperty(
                  PropertyInterface("Skew", te),
                ),
                X.transform.mProps.sa.setGroupProperty(
                  PropertyInterface("Skew Angle", te),
                )),
              X.transform.op.setGroupProperty(PropertyInterface("Opacity", te)),
              Object.defineProperties(Q, {
                opacity: {
                  get: ExpressionPropertyInterface(X.transform.mProps.o),
                },
                position: {
                  get: ExpressionPropertyInterface(X.transform.mProps.p),
                },
                anchorPoint: {
                  get: ExpressionPropertyInterface(X.transform.mProps.a),
                },
                scale: {
                  get: ExpressionPropertyInterface(X.transform.mProps.s),
                },
                rotation: {
                  get: ExpressionPropertyInterface(X.transform.mProps.r),
                },
                skew: {
                  get: ExpressionPropertyInterface(X.transform.mProps.sk),
                },
                skewAxis: {
                  get: ExpressionPropertyInterface(X.transform.mProps.sa),
                },
                _name: { value: Z.nm },
              }),
              (Q.ty = "tr"),
              (Q.mn = Z.mn),
              (Q.propertyGroup = se),
              Q
            );
          }
          function j(Z, X, se) {
            function Q(ee) {
              return Z.p.ix === ee ? Q.position : Z.s.ix === ee ? Q.size : null;
            }
            var te = propertyGroupFactory(Q, se);
            Q.propertyIndex = Z.ix;
            var J = X.sh.ty === "tm" ? X.sh.prop : X.sh;
            return (
              J.s.setGroupProperty(PropertyInterface("Size", te)),
              J.p.setGroupProperty(PropertyInterface("Position", te)),
              Object.defineProperties(Q, {
                size: { get: ExpressionPropertyInterface(J.s) },
                position: { get: ExpressionPropertyInterface(J.p) },
                _name: { value: Z.nm },
              }),
              (Q.mn = Z.mn),
              Q
            );
          }
          function Y(Z, X, se) {
            function Q(ee) {
              return Z.p.ix === ee
                ? Q.position
                : Z.r.ix === ee
                  ? Q.rotation
                  : Z.pt.ix === ee
                    ? Q.points
                    : Z.or.ix === ee || ee === "ADBE Vector Star Outer Radius"
                      ? Q.outerRadius
                      : Z.os.ix === ee
                        ? Q.outerRoundness
                        : Z.ir &&
                            (Z.ir.ix === ee ||
                              ee === "ADBE Vector Star Inner Radius")
                          ? Q.innerRadius
                          : Z.is && Z.is.ix === ee
                            ? Q.innerRoundness
                            : null;
            }
            var te = propertyGroupFactory(Q, se),
              J = X.sh.ty === "tm" ? X.sh.prop : X.sh;
            return (
              (Q.propertyIndex = Z.ix),
              J.or.setGroupProperty(PropertyInterface("Outer Radius", te)),
              J.os.setGroupProperty(PropertyInterface("Outer Roundness", te)),
              J.pt.setGroupProperty(PropertyInterface("Points", te)),
              J.p.setGroupProperty(PropertyInterface("Position", te)),
              J.r.setGroupProperty(PropertyInterface("Rotation", te)),
              Z.ir &&
                (J.ir.setGroupProperty(PropertyInterface("Inner Radius", te)),
                J.is.setGroupProperty(
                  PropertyInterface("Inner Roundness", te),
                )),
              Object.defineProperties(Q, {
                position: { get: ExpressionPropertyInterface(J.p) },
                rotation: { get: ExpressionPropertyInterface(J.r) },
                points: { get: ExpressionPropertyInterface(J.pt) },
                outerRadius: { get: ExpressionPropertyInterface(J.or) },
                outerRoundness: { get: ExpressionPropertyInterface(J.os) },
                innerRadius: { get: ExpressionPropertyInterface(J.ir) },
                innerRoundness: { get: ExpressionPropertyInterface(J.is) },
                _name: { value: Z.nm },
              }),
              (Q.mn = Z.mn),
              Q
            );
          }
          function re(Z, X, se) {
            function Q(ee) {
              return Z.p.ix === ee
                ? Q.position
                : Z.r.ix === ee
                  ? Q.roundness
                  : Z.s.ix === ee ||
                      ee === "Size" ||
                      ee === "ADBE Vector Rect Size"
                    ? Q.size
                    : null;
            }
            var te = propertyGroupFactory(Q, se),
              J = X.sh.ty === "tm" ? X.sh.prop : X.sh;
            return (
              (Q.propertyIndex = Z.ix),
              J.p.setGroupProperty(PropertyInterface("Position", te)),
              J.s.setGroupProperty(PropertyInterface("Size", te)),
              J.r.setGroupProperty(PropertyInterface("Rotation", te)),
              Object.defineProperties(Q, {
                position: { get: ExpressionPropertyInterface(J.p) },
                roundness: { get: ExpressionPropertyInterface(J.r) },
                size: { get: ExpressionPropertyInterface(J.s) },
                _name: { value: Z.nm },
              }),
              (Q.mn = Z.mn),
              Q
            );
          }
          function U(Z, X, se) {
            function Q(ee) {
              return Z.r.ix === ee || ee === "Round Corners 1"
                ? Q.radius
                : null;
            }
            var te = propertyGroupFactory(Q, se),
              J = X;
            return (
              (Q.propertyIndex = Z.ix),
              J.rd.setGroupProperty(PropertyInterface("Radius", te)),
              Object.defineProperties(Q, {
                radius: { get: ExpressionPropertyInterface(J.rd) },
                _name: { value: Z.nm },
              }),
              (Q.mn = Z.mn),
              Q
            );
          }
          function K(Z, X, se) {
            function Q(ee) {
              return Z.c.ix === ee || ee === "Copies"
                ? Q.copies
                : Z.o.ix === ee || ee === "Offset"
                  ? Q.offset
                  : null;
            }
            var te = propertyGroupFactory(Q, se),
              J = X;
            return (
              (Q.propertyIndex = Z.ix),
              J.c.setGroupProperty(PropertyInterface("Copies", te)),
              J.o.setGroupProperty(PropertyInterface("Offset", te)),
              Object.defineProperties(Q, {
                copies: { get: ExpressionPropertyInterface(J.c) },
                offset: { get: ExpressionPropertyInterface(J.o) },
                _name: { value: Z.nm },
              }),
              (Q.mn = Z.mn),
              Q
            );
          }
          return function (Z, X, se) {
            var Q;
            function te(ee) {
              if (typeof ee == "number")
                return (
                  (ee = ee === void 0 ? 1 : ee),
                  ee === 0 ? se : Q[ee - 1]
                );
              for (var ne = 0, oe = Q.length; ne < oe; ) {
                if (Q[ne]._name === ee) return Q[ne];
                ne += 1;
              }
              return null;
            }
            function J() {
              return se;
            }
            return (
              (te.propertyGroup = propertyGroupFactory(te, J)),
              (Q = V(Z, X, te.propertyGroup)),
              (te.numProperties = Q.length),
              (te._name = "Contents"),
              te
            );
          };
        })(),
        TextExpressionInterface = (function () {
          return function (V) {
            var O;
            function B(z) {
              switch (z) {
                case "ADBE Text Document":
                  return B.sourceText;
                default:
                  return null;
              }
            }
            return (
              Object.defineProperty(B, "sourceText", {
                get: function () {
                  V.textProperty.getValue();
                  var N = V.textProperty.currentData.t;
                  return (
                    (!O || N !== O.value) &&
                      ((O = new String(N)),
                      (O.value = N || new String(N)),
                      Object.defineProperty(O, "style", {
                        get: function () {
                          return { fillColor: V.textProperty.currentData.fc };
                        },
                      })),
                    O
                  );
                },
              }),
              B
            );
          };
        })();
      function _typeof(V) {
        "@babel/helpers - typeof";
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof = function (B) {
                return typeof B;
              })
            : (_typeof = function (B) {
                return B &&
                  typeof Symbol == "function" &&
                  B.constructor === Symbol &&
                  B !== Symbol.prototype
                  ? "symbol"
                  : typeof B;
              }),
          _typeof(V)
        );
      }
      var FootageInterface = (function () {
          var V = function (z) {
              var N = "",
                G = z.getFootageData();
              function H() {
                return ((N = ""), (G = z.getFootageData()), W);
              }
              function W(q) {
                if (G[q])
                  return ((N = q), (G = G[q]), _typeof(G) === "object" ? W : G);
                var j = q.indexOf(N);
                if (j !== -1) {
                  var Y = parseInt(q.substr(j + N.length), 10);
                  return ((G = G[Y]), _typeof(G) === "object" ? W : G);
                }
                return "";
              }
              return H;
            },
            O = function (z) {
              function N(G) {
                return G === "Outline" ? N.outlineInterface() : null;
              }
              return ((N._name = "Outline"), (N.outlineInterface = V(z)), N);
            };
          return function (B) {
            function z(N) {
              return N === "Data" ? z.dataInterface : null;
            }
            return ((z._name = "Data"), (z.dataInterface = O(B)), z);
          };
        })(),
        interfaces = {
          layer: LayerExpressionInterface,
          effects: EffectsExpressionInterface,
          comp: CompExpressionInterface,
          shape: ShapeExpressionInterface,
          text: TextExpressionInterface,
          footage: FootageInterface,
        };
      function getInterface(V) {
        return interfaces[V] || null;
      }
      var expressionHelpers = (function () {
        function V(H, W, q) {
          W.x &&
            ((q.k = !0),
            (q.x = !0),
            (q.initiateExpression = ExpressionManager.initiateExpression),
            q.effectsSequence.push(q.initiateExpression(H, W, q).bind(q)));
        }
        function O(H) {
          return (
            (H *= this.elem.globalData.frameRate),
            (H -= this.offsetTime),
            H !== this._cachingAtTime.lastFrame &&
              ((this._cachingAtTime.lastIndex =
                this._cachingAtTime.lastFrame < H
                  ? this._cachingAtTime.lastIndex
                  : 0),
              (this._cachingAtTime.value = this.interpolateValue(
                H,
                this._cachingAtTime,
              )),
              (this._cachingAtTime.lastFrame = H)),
            this._cachingAtTime.value
          );
        }
        function B(H) {
          var W = -0.01,
            q = this.getValueAtTime(H),
            j = this.getValueAtTime(H + W),
            Y = 0;
          if (q.length) {
            var re;
            for (re = 0; re < q.length; re += 1)
              Y += Math.pow(j[re] - q[re], 2);
            Y = Math.sqrt(Y) * 100;
          } else Y = 0;
          return Y;
        }
        function z(H) {
          if (this.vel !== void 0) return this.vel;
          var W = -0.001,
            q = this.getValueAtTime(H),
            j = this.getValueAtTime(H + W),
            Y;
          if (q.length) {
            Y = createTypedArray("float32", q.length);
            var re;
            for (re = 0; re < q.length; re += 1) Y[re] = (j[re] - q[re]) / W;
          } else Y = (j - q) / W;
          return Y;
        }
        function N() {
          return this.pv;
        }
        function G(H) {
          this.propertyGroup = H;
        }
        return {
          searchExpressions: V,
          getSpeedAtTime: B,
          getVelocityAtTime: z,
          getValueAtTime: O,
          getStaticValueAtTime: N,
          setGroupProperty: G,
        };
      })();
      function addPropertyDecorator() {
        function V(U, K, Z) {
          if (!this.k || !this.keyframes) return this.pv;
          U = U ? U.toLowerCase() : "";
          var X = this.comp.renderedFrame,
            se = this.keyframes,
            Q = se[se.length - 1].t;
          if (X <= Q) return this.pv;
          var te, J;
          Z
            ? (K
                ? (te = Math.abs(Q - this.elem.comp.globalData.frameRate * K))
                : (te = Math.max(0, Q - this.elem.data.ip)),
              (J = Q - te))
            : ((!K || K > se.length - 1) && (K = se.length - 1),
              (J = se[se.length - 1 - K].t),
              (te = Q - J));
          var ee, ne, oe;
          if (U === "pingpong") {
            var he = Math.floor((X - J) / te);
            if (he % 2 !== 0)
              return this.getValueAtTime(
                (te - ((X - J) % te) + J) / this.comp.globalData.frameRate,
                0,
              );
          } else if (U === "offset") {
            var ce = this.getValueAtTime(J / this.comp.globalData.frameRate, 0),
              ue = this.getValueAtTime(Q / this.comp.globalData.frameRate, 0),
              ge = this.getValueAtTime(
                (((X - J) % te) + J) / this.comp.globalData.frameRate,
                0,
              ),
              ye = Math.floor((X - J) / te);
            if (this.pv.length) {
              for (
                oe = new Array(ce.length), ne = oe.length, ee = 0;
                ee < ne;
                ee += 1
              )
                oe[ee] = (ue[ee] - ce[ee]) * ye + ge[ee];
              return oe;
            }
            return (ue - ce) * ye + ge;
          } else if (U === "continue") {
            var me = this.getValueAtTime(Q / this.comp.globalData.frameRate, 0),
              be = this.getValueAtTime(
                (Q - 0.001) / this.comp.globalData.frameRate,
                0,
              );
            if (this.pv.length) {
              for (
                oe = new Array(me.length), ne = oe.length, ee = 0;
                ee < ne;
                ee += 1
              )
                oe[ee] =
                  me[ee] +
                  ((me[ee] - be[ee]) *
                    ((X - Q) / this.comp.globalData.frameRate)) /
                    5e-4;
              return oe;
            }
            return me + (me - be) * ((X - Q) / 0.001);
          }
          return this.getValueAtTime(
            (((X - J) % te) + J) / this.comp.globalData.frameRate,
            0,
          );
        }
        function O(U, K, Z) {
          if (!this.k) return this.pv;
          U = U ? U.toLowerCase() : "";
          var X = this.comp.renderedFrame,
            se = this.keyframes,
            Q = se[0].t;
          if (X >= Q) return this.pv;
          var te, J;
          Z
            ? (K
                ? (te = Math.abs(this.elem.comp.globalData.frameRate * K))
                : (te = Math.max(0, this.elem.data.op - Q)),
              (J = Q + te))
            : ((!K || K > se.length - 1) && (K = se.length - 1),
              (J = se[K].t),
              (te = J - Q));
          var ee, ne, oe;
          if (U === "pingpong") {
            var he = Math.floor((Q - X) / te);
            if (he % 2 === 0)
              return this.getValueAtTime(
                (((Q - X) % te) + Q) / this.comp.globalData.frameRate,
                0,
              );
          } else if (U === "offset") {
            var ce = this.getValueAtTime(Q / this.comp.globalData.frameRate, 0),
              ue = this.getValueAtTime(J / this.comp.globalData.frameRate, 0),
              ge = this.getValueAtTime(
                (te - ((Q - X) % te) + Q) / this.comp.globalData.frameRate,
                0,
              ),
              ye = Math.floor((Q - X) / te) + 1;
            if (this.pv.length) {
              for (
                oe = new Array(ce.length), ne = oe.length, ee = 0;
                ee < ne;
                ee += 1
              )
                oe[ee] = ge[ee] - (ue[ee] - ce[ee]) * ye;
              return oe;
            }
            return ge - (ue - ce) * ye;
          } else if (U === "continue") {
            var me = this.getValueAtTime(Q / this.comp.globalData.frameRate, 0),
              be = this.getValueAtTime(
                (Q + 0.001) / this.comp.globalData.frameRate,
                0,
              );
            if (this.pv.length) {
              for (
                oe = new Array(me.length), ne = oe.length, ee = 0;
                ee < ne;
                ee += 1
              )
                oe[ee] = me[ee] + ((me[ee] - be[ee]) * (Q - X)) / 0.001;
              return oe;
            }
            return me + ((me - be) * (Q - X)) / 0.001;
          }
          return this.getValueAtTime(
            (te - (((Q - X) % te) + Q)) / this.comp.globalData.frameRate,
            0,
          );
        }
        function B(U, K) {
          if (!this.k) return this.pv;
          if (((U = (U || 0.4) * 0.5), (K = Math.floor(K || 5)), K <= 1))
            return this.pv;
          var Z = this.comp.renderedFrame / this.comp.globalData.frameRate,
            X = Z - U,
            se = Z + U,
            Q = K > 1 ? (se - X) / (K - 1) : 1,
            te = 0,
            J = 0,
            ee;
          this.pv.length
            ? (ee = createTypedArray("float32", this.pv.length))
            : (ee = 0);
          for (var ne; te < K; ) {
            if (((ne = this.getValueAtTime(X + te * Q)), this.pv.length))
              for (J = 0; J < this.pv.length; J += 1) ee[J] += ne[J];
            else ee += ne;
            te += 1;
          }
          if (this.pv.length)
            for (J = 0; J < this.pv.length; J += 1) ee[J] /= K;
          else ee /= K;
          return ee;
        }
        function z(U) {
          this._transformCachingAtTime ||
            (this._transformCachingAtTime = { v: new Matrix() });
          var K = this._transformCachingAtTime.v;
          if (
            (K.cloneFromProps(this.pre.props), this.appliedTransformations < 1)
          ) {
            var Z = this.a.getValueAtTime(U);
            K.translate(
              -Z[0] * this.a.mult,
              -Z[1] * this.a.mult,
              Z[2] * this.a.mult,
            );
          }
          if (this.appliedTransformations < 2) {
            var X = this.s.getValueAtTime(U);
            K.scale(X[0] * this.s.mult, X[1] * this.s.mult, X[2] * this.s.mult);
          }
          if (this.sk && this.appliedTransformations < 3) {
            var se = this.sk.getValueAtTime(U),
              Q = this.sa.getValueAtTime(U);
            K.skewFromAxis(-se * this.sk.mult, Q * this.sa.mult);
          }
          if (this.r && this.appliedTransformations < 4) {
            var te = this.r.getValueAtTime(U);
            K.rotate(-te * this.r.mult);
          } else if (!this.r && this.appliedTransformations < 4) {
            var J = this.rz.getValueAtTime(U),
              ee = this.ry.getValueAtTime(U),
              ne = this.rx.getValueAtTime(U),
              oe = this.or.getValueAtTime(U);
            K.rotateZ(-J * this.rz.mult)
              .rotateY(ee * this.ry.mult)
              .rotateX(ne * this.rx.mult)
              .rotateZ(-oe[2] * this.or.mult)
              .rotateY(oe[1] * this.or.mult)
              .rotateX(oe[0] * this.or.mult);
          }
          if (this.data.p && this.data.p.s) {
            var he = this.px.getValueAtTime(U),
              ce = this.py.getValueAtTime(U);
            if (this.data.p.z) {
              var ue = this.pz.getValueAtTime(U);
              K.translate(
                he * this.px.mult,
                ce * this.py.mult,
                -ue * this.pz.mult,
              );
            } else K.translate(he * this.px.mult, ce * this.py.mult, 0);
          } else {
            var ge = this.p.getValueAtTime(U);
            K.translate(
              ge[0] * this.p.mult,
              ge[1] * this.p.mult,
              -ge[2] * this.p.mult,
            );
          }
          return K;
        }
        function N() {
          return this.v.clone(new Matrix());
        }
        var G = TransformPropertyFactory.getTransformProperty;
        TransformPropertyFactory.getTransformProperty = function (U, K, Z) {
          var X = G(U, K, Z);
          return (
            X.dynamicProperties.length
              ? (X.getValueAtTime = z.bind(X))
              : (X.getValueAtTime = N.bind(X)),
            (X.setGroupProperty = expressionHelpers.setGroupProperty),
            X
          );
        };
        var H = PropertyFactory.getProp;
        PropertyFactory.getProp = function (U, K, Z, X, se) {
          var Q = H(U, K, Z, X, se);
          (Q.kf
            ? (Q.getValueAtTime = expressionHelpers.getValueAtTime.bind(Q))
            : (Q.getValueAtTime =
                expressionHelpers.getStaticValueAtTime.bind(Q)),
            (Q.setGroupProperty = expressionHelpers.setGroupProperty),
            (Q.loopOut = V),
            (Q.loopIn = O),
            (Q.smooth = B),
            (Q.getVelocityAtTime = expressionHelpers.getVelocityAtTime.bind(Q)),
            (Q.getSpeedAtTime = expressionHelpers.getSpeedAtTime.bind(Q)),
            (Q.numKeys = K.a === 1 ? K.k.length : 0),
            (Q.propertyIndex = K.ix));
          var te = 0;
          return (
            Z !== 0 &&
              (te = createTypedArray(
                "float32",
                K.a === 1 ? K.k[0].s.length : K.k.length,
              )),
            (Q._cachingAtTime = {
              lastFrame: initialDefaultFrame,
              lastIndex: 0,
              value: te,
            }),
            expressionHelpers.searchExpressions(U, K, Q),
            Q.k && se.addDynamicProperty(Q),
            Q
          );
        };
        function W(U) {
          return (
            this._cachingAtTime ||
              (this._cachingAtTime = {
                shapeValue: shapePool.clone(this.pv),
                lastIndex: 0,
                lastTime: initialDefaultFrame,
              }),
            (U *= this.elem.globalData.frameRate),
            (U -= this.offsetTime),
            U !== this._cachingAtTime.lastTime &&
              ((this._cachingAtTime.lastIndex =
                this._cachingAtTime.lastTime < U ? this._caching.lastIndex : 0),
              (this._cachingAtTime.lastTime = U),
              this.interpolateShape(
                U,
                this._cachingAtTime.shapeValue,
                this._cachingAtTime,
              )),
            this._cachingAtTime.shapeValue
          );
        }
        var q = ShapePropertyFactory.getConstructorFunction(),
          j = ShapePropertyFactory.getKeyframedConstructorFunction();
        function Y() {}
        ((Y.prototype = {
          vertices: function (K, Z) {
            this.k && this.getValue();
            var X = this.v;
            Z !== void 0 && (X = this.getValueAtTime(Z, 0));
            var se,
              Q = X._length,
              te = X[K],
              J = X.v,
              ee = createSizedArray(Q);
            for (se = 0; se < Q; se += 1)
              K === "i" || K === "o"
                ? (ee[se] = [te[se][0] - J[se][0], te[se][1] - J[se][1]])
                : (ee[se] = [te[se][0], te[se][1]]);
            return ee;
          },
          points: function (K) {
            return this.vertices("v", K);
          },
          inTangents: function (K) {
            return this.vertices("i", K);
          },
          outTangents: function (K) {
            return this.vertices("o", K);
          },
          isClosed: function () {
            return this.v.c;
          },
          pointOnPath: function (K, Z) {
            var X = this.v;
            (Z !== void 0 && (X = this.getValueAtTime(Z, 0)),
              this._segmentsLength ||
                (this._segmentsLength = bez.getSegmentsLength(X)));
            for (
              var se = this._segmentsLength,
                Q = se.lengths,
                te = se.totalLength * K,
                J = 0,
                ee = Q.length,
                ne = 0,
                oe;
              J < ee;
            ) {
              if (ne + Q[J].addedLength > te) {
                var he = J,
                  ce = X.c && J === ee - 1 ? 0 : J + 1,
                  ue = (te - ne) / Q[J].addedLength;
                oe = bez.getPointInSegment(
                  X.v[he],
                  X.v[ce],
                  X.o[he],
                  X.i[ce],
                  ue,
                  Q[J],
                );
                break;
              } else ne += Q[J].addedLength;
              J += 1;
            }
            return (
              oe ||
                (oe = X.c
                  ? [X.v[0][0], X.v[0][1]]
                  : [X.v[X._length - 1][0], X.v[X._length - 1][1]]),
              oe
            );
          },
          vectorOnPath: function (K, Z, X) {
            K == 1 ? (K = this.v.c) : K == 0 && (K = 0.999);
            var se = this.pointOnPath(K, Z),
              Q = this.pointOnPath(K + 0.001, Z),
              te = Q[0] - se[0],
              J = Q[1] - se[1],
              ee = Math.sqrt(Math.pow(te, 2) + Math.pow(J, 2));
            if (ee === 0) return [0, 0];
            var ne = X === "tangent" ? [te / ee, J / ee] : [-J / ee, te / ee];
            return ne;
          },
          tangentOnPath: function (K, Z) {
            return this.vectorOnPath(K, Z, "tangent");
          },
          normalOnPath: function (K, Z) {
            return this.vectorOnPath(K, Z, "normal");
          },
          setGroupProperty: expressionHelpers.setGroupProperty,
          getValueAtTime: expressionHelpers.getStaticValueAtTime,
        }),
          extendPrototype([Y], q),
          extendPrototype([Y], j),
          (j.prototype.getValueAtTime = W),
          (j.prototype.initiateExpression =
            ExpressionManager.initiateExpression));
        var re = ShapePropertyFactory.getShapeProp;
        ShapePropertyFactory.getShapeProp = function (U, K, Z, X, se) {
          var Q = re(U, K, Z, X, se);
          return (
            (Q.propertyIndex = K.ix),
            (Q.lock = !1),
            Z === 3
              ? expressionHelpers.searchExpressions(U, K.pt, Q)
              : Z === 4 && expressionHelpers.searchExpressions(U, K.ks, Q),
            Q.k && U.addDynamicProperty(Q),
            Q
          );
        };
      }
      function initialize$1() {
        addPropertyDecorator();
      }
      function addDecorator() {
        function V() {
          return this.data.d.x
            ? ((this.calculateExpression =
                ExpressionManager.initiateExpression.bind(this)(
                  this.elem,
                  this.data.d,
                  this,
                )),
              this.addEffect(this.getExpressionValue.bind(this)),
              !0)
            : null;
        }
        ((TextProperty.prototype.getExpressionValue = function (O, B) {
          var z = this.calculateExpression(B);
          if (O.t !== z) {
            var N = {};
            return (
              this.copyData(N, O),
              (N.t = z.toString()),
              (N.__complete = !1),
              N
            );
          }
          return O;
        }),
          (TextProperty.prototype.searchProperty = function () {
            var O = this.searchKeyframes(),
              B = this.searchExpressions();
            return ((this.kf = O || B), this.kf);
          }),
          (TextProperty.prototype.searchExpressions = V));
      }
      function initialize() {
        addDecorator();
      }
      function SVGComposableEffect() {}
      SVGComposableEffect.prototype = {
        createMergeNode: function V(O, B) {
          var z = createNS("feMerge");
          z.setAttribute("result", O);
          var N, G;
          for (G = 0; G < B.length; G += 1)
            ((N = createNS("feMergeNode")),
              N.setAttribute("in", B[G]),
              z.appendChild(N),
              z.appendChild(N));
          return z;
        },
      };
      var linearFilterValue =
        "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0";
      function SVGTintFilter(V, O, B, z, N) {
        this.filterManager = O;
        var G = createNS("feColorMatrix");
        (G.setAttribute("type", "matrix"),
          G.setAttribute("color-interpolation-filters", "linearRGB"),
          G.setAttribute("values", linearFilterValue + " 1 0"),
          (this.linearFilter = G),
          G.setAttribute("result", z + "_tint_1"),
          V.appendChild(G),
          (G = createNS("feColorMatrix")),
          G.setAttribute("type", "matrix"),
          G.setAttribute("color-interpolation-filters", "sRGB"),
          G.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"),
          G.setAttribute("result", z + "_tint_2"),
          V.appendChild(G),
          (this.matrixFilter = G));
        var H = this.createMergeNode(z, [N, z + "_tint_1", z + "_tint_2"]);
        V.appendChild(H);
      }
      (extendPrototype([SVGComposableEffect], SVGTintFilter),
        (SVGTintFilter.prototype.renderFrame = function (V) {
          if (V || this.filterManager._mdf) {
            var O = this.filterManager.effectElements[0].p.v,
              B = this.filterManager.effectElements[1].p.v,
              z = this.filterManager.effectElements[2].p.v / 100;
            (this.linearFilter.setAttribute(
              "values",
              linearFilterValue + " " + z + " 0",
            ),
              this.matrixFilter.setAttribute(
                "values",
                B[0] -
                  O[0] +
                  " 0 0 0 " +
                  O[0] +
                  " " +
                  (B[1] - O[1]) +
                  " 0 0 0 " +
                  O[1] +
                  " " +
                  (B[2] - O[2]) +
                  " 0 0 0 " +
                  O[2] +
                  " 0 0 0 1 0",
              ));
          }
        }));
      function SVGFillFilter(V, O, B, z) {
        this.filterManager = O;
        var N = createNS("feColorMatrix");
        (N.setAttribute("type", "matrix"),
          N.setAttribute("color-interpolation-filters", "sRGB"),
          N.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"),
          N.setAttribute("result", z),
          V.appendChild(N),
          (this.matrixFilter = N));
      }
      SVGFillFilter.prototype.renderFrame = function (V) {
        if (V || this.filterManager._mdf) {
          var O = this.filterManager.effectElements[2].p.v,
            B = this.filterManager.effectElements[6].p.v;
          this.matrixFilter.setAttribute(
            "values",
            "0 0 0 0 " +
              O[0] +
              " 0 0 0 0 " +
              O[1] +
              " 0 0 0 0 " +
              O[2] +
              " 0 0 0 " +
              B +
              " 0",
          );
        }
      };
      function SVGStrokeEffect(V, O, B) {
        ((this.initialized = !1),
          (this.filterManager = O),
          (this.elem = B),
          (this.paths = []));
      }
      ((SVGStrokeEffect.prototype.initialize = function () {
        var V =
            this.elem.layerElement.children ||
            this.elem.layerElement.childNodes,
          O,
          B,
          z,
          N;
        for (
          this.filterManager.effectElements[1].p.v === 1
            ? ((N = this.elem.maskManager.masksProperties.length), (z = 0))
            : ((z = this.filterManager.effectElements[0].p.v - 1), (N = z + 1)),
            B = createNS("g"),
            B.setAttribute("fill", "none"),
            B.setAttribute("stroke-linecap", "round"),
            B.setAttribute("stroke-dashoffset", 1),
            z;
          z < N;
          z += 1
        )
          ((O = createNS("path")),
            B.appendChild(O),
            this.paths.push({ p: O, m: z }));
        if (this.filterManager.effectElements[10].p.v === 3) {
          var G = createNS("mask"),
            H = createElementID();
          (G.setAttribute("id", H),
            G.setAttribute("mask-type", "alpha"),
            G.appendChild(B),
            this.elem.globalData.defs.appendChild(G));
          var W = createNS("g");
          for (
            W.setAttribute("mask", "url(" + getLocationHref() + "#" + H + ")");
            V[0];
          )
            W.appendChild(V[0]);
          (this.elem.layerElement.appendChild(W),
            (this.masker = G),
            B.setAttribute("stroke", "#fff"));
        } else if (
          this.filterManager.effectElements[10].p.v === 1 ||
          this.filterManager.effectElements[10].p.v === 2
        ) {
          if (this.filterManager.effectElements[10].p.v === 2)
            for (
              V =
                this.elem.layerElement.children ||
                this.elem.layerElement.childNodes;
              V.length;
            )
              this.elem.layerElement.removeChild(V[0]);
          (this.elem.layerElement.appendChild(B),
            this.elem.layerElement.removeAttribute("mask"),
            B.setAttribute("stroke", "#fff"));
        }
        ((this.initialized = !0), (this.pathMasker = B));
      }),
        (SVGStrokeEffect.prototype.renderFrame = function (V) {
          this.initialized || this.initialize();
          var O,
            B = this.paths.length,
            z,
            N;
          for (O = 0; O < B; O += 1)
            if (
              this.paths[O].m !== -1 &&
              ((z = this.elem.maskManager.viewData[this.paths[O].m]),
              (N = this.paths[O].p),
              (V || this.filterManager._mdf || z.prop._mdf) &&
                N.setAttribute("d", z.lastPath),
              V ||
                this.filterManager.effectElements[9].p._mdf ||
                this.filterManager.effectElements[4].p._mdf ||
                this.filterManager.effectElements[7].p._mdf ||
                this.filterManager.effectElements[8].p._mdf ||
                z.prop._mdf)
            ) {
              var G;
              if (
                this.filterManager.effectElements[7].p.v !== 0 ||
                this.filterManager.effectElements[8].p.v !== 100
              ) {
                var H =
                    Math.min(
                      this.filterManager.effectElements[7].p.v,
                      this.filterManager.effectElements[8].p.v,
                    ) * 0.01,
                  W =
                    Math.max(
                      this.filterManager.effectElements[7].p.v,
                      this.filterManager.effectElements[8].p.v,
                    ) * 0.01,
                  q = N.getTotalLength();
                G = "0 0 0 " + q * H + " ";
                var j = q * (W - H),
                  Y =
                    1 +
                    this.filterManager.effectElements[4].p.v *
                      2 *
                      this.filterManager.effectElements[9].p.v *
                      0.01,
                  re = Math.floor(j / Y),
                  U;
                for (U = 0; U < re; U += 1)
                  G +=
                    "1 " +
                    this.filterManager.effectElements[4].p.v *
                      2 *
                      this.filterManager.effectElements[9].p.v *
                      0.01 +
                    " ";
                G += "0 " + q * 10 + " 0 0";
              } else
                G =
                  "1 " +
                  this.filterManager.effectElements[4].p.v *
                    2 *
                    this.filterManager.effectElements[9].p.v *
                    0.01;
              N.setAttribute("stroke-dasharray", G);
            }
          if (
            ((V || this.filterManager.effectElements[4].p._mdf) &&
              this.pathMasker.setAttribute(
                "stroke-width",
                this.filterManager.effectElements[4].p.v * 2,
              ),
            (V || this.filterManager.effectElements[6].p._mdf) &&
              this.pathMasker.setAttribute(
                "opacity",
                this.filterManager.effectElements[6].p.v,
              ),
            (this.filterManager.effectElements[10].p.v === 1 ||
              this.filterManager.effectElements[10].p.v === 2) &&
              (V || this.filterManager.effectElements[3].p._mdf))
          ) {
            var K = this.filterManager.effectElements[3].p.v;
            this.pathMasker.setAttribute(
              "stroke",
              "rgb(" +
                bmFloor(K[0] * 255) +
                "," +
                bmFloor(K[1] * 255) +
                "," +
                bmFloor(K[2] * 255) +
                ")",
            );
          }
        }));
      function SVGTritoneFilter(V, O, B, z) {
        this.filterManager = O;
        var N = createNS("feColorMatrix");
        (N.setAttribute("type", "matrix"),
          N.setAttribute("color-interpolation-filters", "linearRGB"),
          N.setAttribute(
            "values",
            "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0",
          ),
          V.appendChild(N));
        var G = createNS("feComponentTransfer");
        (G.setAttribute("color-interpolation-filters", "sRGB"),
          G.setAttribute("result", z),
          (this.matrixFilter = G));
        var H = createNS("feFuncR");
        (H.setAttribute("type", "table"), G.appendChild(H), (this.feFuncR = H));
        var W = createNS("feFuncG");
        (W.setAttribute("type", "table"), G.appendChild(W), (this.feFuncG = W));
        var q = createNS("feFuncB");
        (q.setAttribute("type", "table"),
          G.appendChild(q),
          (this.feFuncB = q),
          V.appendChild(G));
      }
      SVGTritoneFilter.prototype.renderFrame = function (V) {
        if (V || this.filterManager._mdf) {
          var O = this.filterManager.effectElements[0].p.v,
            B = this.filterManager.effectElements[1].p.v,
            z = this.filterManager.effectElements[2].p.v,
            N = z[0] + " " + B[0] + " " + O[0],
            G = z[1] + " " + B[1] + " " + O[1],
            H = z[2] + " " + B[2] + " " + O[2];
          (this.feFuncR.setAttribute("tableValues", N),
            this.feFuncG.setAttribute("tableValues", G),
            this.feFuncB.setAttribute("tableValues", H));
        }
      };
      function SVGProLevelsFilter(V, O, B, z) {
        this.filterManager = O;
        var N = this.filterManager.effectElements,
          G = createNS("feComponentTransfer");
        ((N[10].p.k ||
          N[10].p.v !== 0 ||
          N[11].p.k ||
          N[11].p.v !== 1 ||
          N[12].p.k ||
          N[12].p.v !== 1 ||
          N[13].p.k ||
          N[13].p.v !== 0 ||
          N[14].p.k ||
          N[14].p.v !== 1) &&
          (this.feFuncR = this.createFeFunc("feFuncR", G)),
          (N[17].p.k ||
            N[17].p.v !== 0 ||
            N[18].p.k ||
            N[18].p.v !== 1 ||
            N[19].p.k ||
            N[19].p.v !== 1 ||
            N[20].p.k ||
            N[20].p.v !== 0 ||
            N[21].p.k ||
            N[21].p.v !== 1) &&
            (this.feFuncG = this.createFeFunc("feFuncG", G)),
          (N[24].p.k ||
            N[24].p.v !== 0 ||
            N[25].p.k ||
            N[25].p.v !== 1 ||
            N[26].p.k ||
            N[26].p.v !== 1 ||
            N[27].p.k ||
            N[27].p.v !== 0 ||
            N[28].p.k ||
            N[28].p.v !== 1) &&
            (this.feFuncB = this.createFeFunc("feFuncB", G)),
          (N[31].p.k ||
            N[31].p.v !== 0 ||
            N[32].p.k ||
            N[32].p.v !== 1 ||
            N[33].p.k ||
            N[33].p.v !== 1 ||
            N[34].p.k ||
            N[34].p.v !== 0 ||
            N[35].p.k ||
            N[35].p.v !== 1) &&
            (this.feFuncA = this.createFeFunc("feFuncA", G)),
          (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) &&
            (G.setAttribute("color-interpolation-filters", "sRGB"),
            V.appendChild(G)),
          (N[3].p.k ||
            N[3].p.v !== 0 ||
            N[4].p.k ||
            N[4].p.v !== 1 ||
            N[5].p.k ||
            N[5].p.v !== 1 ||
            N[6].p.k ||
            N[6].p.v !== 0 ||
            N[7].p.k ||
            N[7].p.v !== 1) &&
            ((G = createNS("feComponentTransfer")),
            G.setAttribute("color-interpolation-filters", "sRGB"),
            G.setAttribute("result", z),
            V.appendChild(G),
            (this.feFuncRComposed = this.createFeFunc("feFuncR", G)),
            (this.feFuncGComposed = this.createFeFunc("feFuncG", G)),
            (this.feFuncBComposed = this.createFeFunc("feFuncB", G))));
      }
      ((SVGProLevelsFilter.prototype.createFeFunc = function (V, O) {
        var B = createNS(V);
        return (B.setAttribute("type", "table"), O.appendChild(B), B);
      }),
        (SVGProLevelsFilter.prototype.getTableValue = function (V, O, B, z, N) {
          for (
            var G = 0,
              H = 256,
              W,
              q = Math.min(V, O),
              j = Math.max(V, O),
              Y = Array.call(null, { length: H }),
              re,
              U = 0,
              K = N - z,
              Z = O - V;
            G <= 256;
          )
            ((W = G / 256),
              W <= q
                ? (re = Z < 0 ? N : z)
                : W >= j
                  ? (re = Z < 0 ? z : N)
                  : (re = z + K * Math.pow((W - V) / Z, 1 / B)),
              (Y[U] = re),
              (U += 1),
              (G += 256 / (H - 1)));
          return Y.join(" ");
        }),
        (SVGProLevelsFilter.prototype.renderFrame = function (V) {
          if (V || this.filterManager._mdf) {
            var O,
              B = this.filterManager.effectElements;
            (this.feFuncRComposed &&
              (V ||
                B[3].p._mdf ||
                B[4].p._mdf ||
                B[5].p._mdf ||
                B[6].p._mdf ||
                B[7].p._mdf) &&
              ((O = this.getTableValue(
                B[3].p.v,
                B[4].p.v,
                B[5].p.v,
                B[6].p.v,
                B[7].p.v,
              )),
              this.feFuncRComposed.setAttribute("tableValues", O),
              this.feFuncGComposed.setAttribute("tableValues", O),
              this.feFuncBComposed.setAttribute("tableValues", O)),
              this.feFuncR &&
                (V ||
                  B[10].p._mdf ||
                  B[11].p._mdf ||
                  B[12].p._mdf ||
                  B[13].p._mdf ||
                  B[14].p._mdf) &&
                ((O = this.getTableValue(
                  B[10].p.v,
                  B[11].p.v,
                  B[12].p.v,
                  B[13].p.v,
                  B[14].p.v,
                )),
                this.feFuncR.setAttribute("tableValues", O)),
              this.feFuncG &&
                (V ||
                  B[17].p._mdf ||
                  B[18].p._mdf ||
                  B[19].p._mdf ||
                  B[20].p._mdf ||
                  B[21].p._mdf) &&
                ((O = this.getTableValue(
                  B[17].p.v,
                  B[18].p.v,
                  B[19].p.v,
                  B[20].p.v,
                  B[21].p.v,
                )),
                this.feFuncG.setAttribute("tableValues", O)),
              this.feFuncB &&
                (V ||
                  B[24].p._mdf ||
                  B[25].p._mdf ||
                  B[26].p._mdf ||
                  B[27].p._mdf ||
                  B[28].p._mdf) &&
                ((O = this.getTableValue(
                  B[24].p.v,
                  B[25].p.v,
                  B[26].p.v,
                  B[27].p.v,
                  B[28].p.v,
                )),
                this.feFuncB.setAttribute("tableValues", O)),
              this.feFuncA &&
                (V ||
                  B[31].p._mdf ||
                  B[32].p._mdf ||
                  B[33].p._mdf ||
                  B[34].p._mdf ||
                  B[35].p._mdf) &&
                ((O = this.getTableValue(
                  B[31].p.v,
                  B[32].p.v,
                  B[33].p.v,
                  B[34].p.v,
                  B[35].p.v,
                )),
                this.feFuncA.setAttribute("tableValues", O)));
          }
        }));
      function SVGDropShadowEffect(V, O, B, z, N) {
        var G = O.container.globalData.renderConfig.filterSize,
          H = O.data.fs || G;
        (V.setAttribute("x", H.x || G.x),
          V.setAttribute("y", H.y || G.y),
          V.setAttribute("width", H.width || G.width),
          V.setAttribute("height", H.height || G.height),
          (this.filterManager = O));
        var W = createNS("feGaussianBlur");
        (W.setAttribute("in", "SourceAlpha"),
          W.setAttribute("result", z + "_drop_shadow_1"),
          W.setAttribute("stdDeviation", "0"),
          (this.feGaussianBlur = W),
          V.appendChild(W));
        var q = createNS("feOffset");
        (q.setAttribute("dx", "25"),
          q.setAttribute("dy", "0"),
          q.setAttribute("in", z + "_drop_shadow_1"),
          q.setAttribute("result", z + "_drop_shadow_2"),
          (this.feOffset = q),
          V.appendChild(q));
        var j = createNS("feFlood");
        (j.setAttribute("flood-color", "#00ff00"),
          j.setAttribute("flood-opacity", "1"),
          j.setAttribute("result", z + "_drop_shadow_3"),
          (this.feFlood = j),
          V.appendChild(j));
        var Y = createNS("feComposite");
        (Y.setAttribute("in", z + "_drop_shadow_3"),
          Y.setAttribute("in2", z + "_drop_shadow_2"),
          Y.setAttribute("operator", "in"),
          Y.setAttribute("result", z + "_drop_shadow_4"),
          V.appendChild(Y));
        var re = this.createMergeNode(z, [z + "_drop_shadow_4", N]);
        V.appendChild(re);
      }
      (extendPrototype([SVGComposableEffect], SVGDropShadowEffect),
        (SVGDropShadowEffect.prototype.renderFrame = function (V) {
          if (V || this.filterManager._mdf) {
            if (
              ((V || this.filterManager.effectElements[4].p._mdf) &&
                this.feGaussianBlur.setAttribute(
                  "stdDeviation",
                  this.filterManager.effectElements[4].p.v / 4,
                ),
              V || this.filterManager.effectElements[0].p._mdf)
            ) {
              var O = this.filterManager.effectElements[0].p.v;
              this.feFlood.setAttribute(
                "flood-color",
                rgbToHex(
                  Math.round(O[0] * 255),
                  Math.round(O[1] * 255),
                  Math.round(O[2] * 255),
                ),
              );
            }
            if (
              ((V || this.filterManager.effectElements[1].p._mdf) &&
                this.feFlood.setAttribute(
                  "flood-opacity",
                  this.filterManager.effectElements[1].p.v / 255,
                ),
              V ||
                this.filterManager.effectElements[2].p._mdf ||
                this.filterManager.effectElements[3].p._mdf)
            ) {
              var B = this.filterManager.effectElements[3].p.v,
                z = (this.filterManager.effectElements[2].p.v - 90) * degToRads,
                N = B * Math.cos(z),
                G = B * Math.sin(z);
              (this.feOffset.setAttribute("dx", N),
                this.feOffset.setAttribute("dy", G));
            }
          }
        }));
      var _svgMatteSymbols = [];
      function SVGMatte3Effect(V, O, B) {
        ((this.initialized = !1),
          (this.filterManager = O),
          (this.filterElem = V),
          (this.elem = B),
          (B.matteElement = createNS("g")),
          B.matteElement.appendChild(B.layerElement),
          B.matteElement.appendChild(B.transformedElement),
          (B.baseElement = B.matteElement));
      }
      ((SVGMatte3Effect.prototype.findSymbol = function (V) {
        for (var O = 0, B = _svgMatteSymbols.length; O < B; ) {
          if (_svgMatteSymbols[O] === V) return _svgMatteSymbols[O];
          O += 1;
        }
        return null;
      }),
        (SVGMatte3Effect.prototype.replaceInParent = function (V, O) {
          var B = V.layerElement.parentNode;
          if (B) {
            for (
              var z = B.children, N = 0, G = z.length;
              N < G && z[N] !== V.layerElement;
            )
              N += 1;
            var H;
            N <= G - 2 && (H = z[N + 1]);
            var W = createNS("use");
            (W.setAttribute("href", "#" + O),
              H ? B.insertBefore(W, H) : B.appendChild(W));
          }
        }),
        (SVGMatte3Effect.prototype.setElementAsMask = function (V, O) {
          if (!this.findSymbol(O)) {
            var B = createElementID(),
              z = createNS("mask");
            (z.setAttribute("id", O.layerId),
              z.setAttribute("mask-type", "alpha"),
              _svgMatteSymbols.push(O));
            var N = V.globalData.defs;
            N.appendChild(z);
            var G = createNS("symbol");
            (G.setAttribute("id", B),
              this.replaceInParent(O, B),
              G.appendChild(O.layerElement),
              N.appendChild(G));
            var H = createNS("use");
            (H.setAttribute("href", "#" + B),
              z.appendChild(H),
              (O.data.hd = !1),
              O.show());
          }
          V.setMatte(O.layerId);
        }),
        (SVGMatte3Effect.prototype.initialize = function () {
          for (
            var V = this.filterManager.effectElements[0].p.v,
              O = this.elem.comp.elements,
              B = 0,
              z = O.length;
            B < z;
          )
            (O[B] &&
              O[B].data.ind === V &&
              this.setElementAsMask(this.elem, O[B]),
              (B += 1));
          this.initialized = !0;
        }),
        (SVGMatte3Effect.prototype.renderFrame = function () {
          this.initialized || this.initialize();
        }));
      function SVGGaussianBlurEffect(V, O, B, z) {
        (V.setAttribute("x", "-100%"),
          V.setAttribute("y", "-100%"),
          V.setAttribute("width", "300%"),
          V.setAttribute("height", "300%"),
          (this.filterManager = O));
        var N = createNS("feGaussianBlur");
        (N.setAttribute("result", z),
          V.appendChild(N),
          (this.feGaussianBlur = N));
      }
      SVGGaussianBlurEffect.prototype.renderFrame = function (V) {
        if (V || this.filterManager._mdf) {
          var O = 0.3,
            B = this.filterManager.effectElements[0].p.v * O,
            z = this.filterManager.effectElements[1].p.v,
            N = z == 3 ? 0 : B,
            G = z == 2 ? 0 : B;
          this.feGaussianBlur.setAttribute("stdDeviation", N + " " + G);
          var H =
            this.filterManager.effectElements[2].p.v == 1
              ? "wrap"
              : "duplicate";
          this.feGaussianBlur.setAttribute("edgeMode", H);
        }
      };
      function TransformEffect() {}
      ((TransformEffect.prototype.init = function (V) {
        ((this.effectsManager = V),
          (this.type = effectTypes.TRANSFORM_EFFECT),
          (this.matrix = new Matrix()),
          (this.opacity = -1),
          (this._mdf = !1),
          (this._opMdf = !1));
      }),
        (TransformEffect.prototype.renderFrame = function (V) {
          if (
            ((this._opMdf = !1),
            (this._mdf = !1),
            V || this.effectsManager._mdf)
          ) {
            var O = this.effectsManager.effectElements,
              B = O[0].p.v,
              z = O[1].p.v,
              N = O[2].p.v === 1,
              G = O[3].p.v,
              H = N ? G : O[4].p.v,
              W = O[5].p.v,
              q = O[6].p.v,
              j = O[7].p.v;
            (this.matrix.reset(),
              this.matrix.translate(-B[0], -B[1], B[2]),
              this.matrix.scale(H * 0.01, G * 0.01, 1),
              this.matrix.rotate(-j * degToRads),
              this.matrix.skewFromAxis(-W * degToRads, (q + 90) * degToRads),
              this.matrix.translate(z[0], z[1], 0),
              (this._mdf = !0),
              this.opacity !== O[8].p.v &&
                ((this.opacity = O[8].p.v), (this._opMdf = !0)));
          }
        }));
      function SVGTransformEffect(V, O) {
        this.init(O);
      }
      extendPrototype([TransformEffect], SVGTransformEffect);
      function CVTransformEffect(V) {
        this.init(V);
      }
      return (
        extendPrototype([TransformEffect], CVTransformEffect),
        registerRenderer("canvas", CanvasRenderer),
        registerRenderer("html", HybridRenderer),
        registerRenderer("svg", SVGRenderer),
        ShapeModifiers.registerModifier("tm", TrimModifier),
        ShapeModifiers.registerModifier("pb", PuckerAndBloatModifier),
        ShapeModifiers.registerModifier("rp", RepeaterModifier),
        ShapeModifiers.registerModifier("rd", RoundCornersModifier),
        ShapeModifiers.registerModifier("zz", ZigZagModifier),
        ShapeModifiers.registerModifier("op", OffsetPathModifier),
        setExpressionsPlugin(Expressions),
        setExpressionInterfaces(getInterface),
        initialize$1(),
        initialize(),
        registerEffect$1(20, SVGTintFilter, !0),
        registerEffect$1(21, SVGFillFilter, !0),
        registerEffect$1(22, SVGStrokeEffect, !1),
        registerEffect$1(23, SVGTritoneFilter, !0),
        registerEffect$1(24, SVGProLevelsFilter, !0),
        registerEffect$1(25, SVGDropShadowEffect, !0),
        registerEffect$1(28, SVGMatte3Effect, !1),
        registerEffect$1(29, SVGGaussianBlurEffect, !0),
        registerEffect$1(35, SVGTransformEffect, !1),
        registerEffect(35, CVTransformEffect),
        lottie
      );
    });
})(lottie$1, lottie$1.exports);
var lottieExports = lottie$1.exports;
const lottie = getDefaultExportFromCjs(lottieExports);
function e(V) {
  return JSON.parse(JSON.stringify(V));
}
function t(V) {
  return V == null;
}
function i(V) {
  return V !== null && typeof V == "object";
}
function s(V, O, B) {
  const z = Array.isArray(O) ? O : O.split(".");
  let N = V;
  for (const G of z) {
    if (!i(N) || !(G in N)) return B;
    N = N[G];
  }
  return N === void 0 ? B : N;
}
function r(V, O, B) {
  let z = V;
  const N = Array.isArray(O) ? O : O.split(".");
  for (let G = 0; G < N.length; ++G)
    G === N.length - 1 ? (z[N[G]] = B) : (z = z[N[G]]);
}
const n = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  "indianred ": "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgrey: "#d3d3d3",
  lightgreen: "#90ee90",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370d8",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#d87093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32",
};
function a(V) {
  return V.startsWith("#")
    ? V.length === 4
      ? `#${V[1]}${V[1]}${V[2]}${V[2]}${V[3]}${V[3]}`
      : V
    : n[V.toLowerCase()] || "#000000";
}
function o(V) {
  if (V && typeof V == "string")
    return V.split(",")
      .filter((O) => O)
      .map((O) => O.split(":"))
      .filter((O) => O.length == 2)
      .reduce((O, B) => ((O[B[0].toLowerCase()] = a(B[1])), O), {});
}
function l(V) {
  return V === "light" || V === 1 || V === "1"
    ? 1
    : V === "regular" || V === 2 || V === "2"
      ? 2
      : V === "bold" || V === 3 || V === "3"
        ? 3
        : typeof V == "number" || typeof V == "string"
          ? +V
          : void 0;
}
function h(V) {
  if (typeof V == "string") return V;
}
function c(V) {
  const O = V.toString(16);
  return O.length == 1 ? "0" + O : O;
}
function d(V) {
  return Math.round((V / 255) * 1e3) / 1e3;
}
function g(V) {
  return Math.round(255 * V);
}
function f(V) {
  const {
    r: O,
    g: B,
    b: z,
  } = (function (N) {
    let G = parseInt(N[0] != "#" ? N : N.substring(1), 16);
    return { r: (G >> 16) & 255, g: (G >> 8) & 255, b: 255 & G };
  })(V);
  return [d(O), d(B), d(z)];
}
function u(V) {
  return (function (O) {
    return "#" + c(O.r) + c(O.g) + c(O.b);
  })({ r: g(V[0]), g: g(V[1]), b: g(V[2]) });
}
function m(V, { lottieInstance: O } = {}) {
  const B = [];
  return (
    V &&
      V.layers &&
      V.layers.forEach((z, N) => {
        z.nm &&
          z.ef &&
          z.ef.forEach((G, H) => {
            var re, U, K;
            const W =
              (K =
                (U =
                  (re = G == null ? void 0 : G.ef) == null ? void 0 : re[0]) ==
                null
                  ? void 0
                  : U.v) == null
                ? void 0
                : K.k;
            if (W === void 0) return;
            let q, j;
            if (
              ((q = O
                ? `renderer.elements.${N}.effectsManager.effectElements.${H}.effectElements.0.p.v`
                : `layers.${N}.ef.${H}.ef.0.v.k`),
              G.mn === "ADBE Color Control"
                ? (j = "color")
                : G.mn === "ADBE Slider Control"
                  ? (j = "slider")
                  : G.mn === "ADBE Point Control"
                    ? (j = "point")
                    : G.mn === "ADBE Checkbox Control"
                      ? (j = "checkbox")
                      : G.mn.startsWith("Pseudo/") && (j = "feature"),
              !j)
            )
              return;
            const Y = G.nm.toLowerCase();
            B.push({ name: Y, path: q, value: W, type: j });
          });
      }),
    B
  );
}
function y(V, O) {
  for (const B of O) r(V, B.path, B.value);
}
function p(V, O, B) {
  for (const z of O)
    z.type === "color"
      ? typeof B == "object" && "r" in B && "g" in B && "b" in B
        ? r(V, z.path, [d(B.r), d(B.g), d(B.b)])
        : Array.isArray(B)
          ? r(V, z.path, B)
          : typeof B == "string" && r(V, z.path, f(a(B)))
      : z.type === "point"
        ? typeof B == "object" && "x" in B && "y" in B
          ? (r(V, z.path + ".0", B.x), r(V, z.path + ".1", B.y))
          : Array.isArray(B) &&
            (r(V, z.path + ".0", B[0]), r(V, z.path + ".1", B[1]))
        : r(V, z.path, B);
}
const _ = ["click", "mouseenter", "mouseleave"];
let b;
const v = [
    "colors",
    "src",
    "icon",
    "state",
    "trigger",
    "loading",
    "target",
    "stroke",
  ],
  bt = class bt extends HTMLElement {
    constructor() {
      super(...arguments);
      Ce(this, "_root");
      Ce(this, "_isConnected", !1);
      Ce(this, "_isReady", !1);
      Ce(this, "_assignedIconData");
      Ce(this, "_loadedIconData");
      Ce(this, "_triggerInstance");
      Ce(this, "_playerInstance");
      Ce(this, "delayedLoading", null);
    }
    static get version() {
      return "1.6.0";
    }
    static get observedAttributes() {
      return v;
    }
    static setIconLoader(B) {
      bt._iconLoader = B;
    }
    static setPlayerFactory(B) {
      bt._playerFactory = B;
    }
    static defineTrigger(B, z) {
      bt._definedTriggers.set(B, z);
    }
    attributeChangedCallback(B, z, N) {
      this[`${B}Changed`].call(this);
    }
    connectedCallback() {
      if ((this._root || this.createElements(), this.loading === "lazy")) {
        let B;
        ((this.delayedLoading = (z) => {
          (B.unobserve(this),
            (B = void 0),
            (this.delayedLoading = null),
            z || this.createPlayer());
        }),
          (B = new IntersectionObserver((z, N) => {
            z.forEach((G) => {
              G.isIntersecting &&
                B &&
                this.delayedLoading &&
                this.delayedLoading();
            });
          })),
          B.observe(this));
      } else if (this.loading === "interaction") {
        let B;
        this.delayedLoading = (G) => {
          for (const H of _) (z || this).removeEventListener(H, N);
          ((this.delayedLoading = null),
            G ||
              this.createPlayer().then(() => {
                B && (z || this).dispatchEvent(new Event(B));
              }));
        };
        const z = this.target ? this.closest(this.target) : null;
        let N = (G) => {
          const H = G == null ? void 0 : G.type;
          B ? (B = H) : ((B = H), this.delayedLoading && this.delayedLoading());
        };
        N = N.bind(this);
        for (const G of _) (z || this).addEventListener(G, N);
      } else if (this.loading === "delay") {
        this.delayedLoading = (z) => {
          ((this.delayedLoading = null), z || this.createPlayer());
        };
        const B = this.hasAttribute("delay") ? +this.getAttribute("delay") : 0;
        setTimeout(() => {
          this.delayedLoading && this.delayedLoading();
        }, B);
      } else this.createPlayer();
      this._isConnected = !0;
    }
    disconnectedCallback() {
      (this.delayedLoading && this.delayedLoading(!0),
        this.destroyPlayer(),
        (this._isConnected = !1));
    }
    createElements() {
      ((this._root = this.attachShadow({ mode: "open" })),
        b ||
          ((b = new CSSStyleSheet()),
          b.replaceSync(`
    :host {
        position: relative;
        display: inline-block;
        width: 32px;
        height: 32px;
        transform: translate3d(0px, 0px, 0px);
    }

    :host(.current-color) svg path[fill] {
        fill: currentColor;
    }

    :host(.current-color) svg path[stroke] {
        stroke: currentColor;
    }

    svg {
        position: absolute;
        pointer-events: none;
        display: block;
        transform: unset!important;
    }

    ::slotted(*) {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .body.ready ::slotted(*) {
        display: none;
    }
`)),
        (this._root.adoptedStyleSheets = [b]));
      const B = document.createElement("div");
      (B.classList.add("body"), this._root.appendChild(B));
      const z = document.createElement("slot");
      B.appendChild(z);
    }
    async createPlayer() {
      if (!bt._playerFactory) throw new Error("Missing player loader!");
      if (this.delayedLoading) return;
      const B = await this.loadIconData();
      if (!B) return;
      this._playerInstance = bt._playerFactory(this.animationContainer, B, {
        state: h(this.state),
        stroke: l(this.stroke),
        colors: o(this.colors),
        scale: parseFloat("" + this.getAttribute("scale") || ""),
        axisX: parseFloat("" + this.getAttribute("axis-x") || ""),
        axisY: parseFloat("" + this.getAttribute("axis-y") || ""),
      });
      const z = Object.entries(this._playerInstance.colors || {});
      if (z.length) {
        let N = "";
        for (const [H, W] of z)
          N += `
                    :host(:not(.current-color)) svg path[fill].${H} {
                        fill: var(--lord-icon-${H}, var(--lord-icon-${H}-base, #000));
                    }
        
                    :host(:not(.current-color)) svg path[stroke].${H} {
                        stroke: var(--lord-icon-${H}, var(--lord-icon-${H}-base, #000));
                    }
                `;
        const G = document.createElement("style");
        ((G.innerHTML = N), this.animationContainer.appendChild(G));
      }
      (this._playerInstance.connect(),
        this._playerInstance.addEventListener("ready", () => {
          this._triggerInstance &&
            this._triggerInstance.onReady &&
            this._triggerInstance.onReady();
        }),
        this._playerInstance.addEventListener("refresh", () => {
          (this.refresh(),
            this._triggerInstance &&
              this._triggerInstance.onRefresh &&
              this._triggerInstance.onRefresh());
        }),
        this._playerInstance.addEventListener("complete", () => {
          this._triggerInstance &&
            this._triggerInstance.onComplete &&
            this._triggerInstance.onComplete();
        }),
        this._playerInstance.addEventListener("frame", () => {
          this._triggerInstance &&
            this._triggerInstance.onFrame &&
            this._triggerInstance.onFrame();
        }),
        this.refresh(),
        this.triggerChanged(),
        await new Promise((N, G) => {
          this._playerInstance.isReady
            ? N()
            : this._playerInstance.addEventListener("ready", N);
        }),
        this.animationContainer.classList.add("ready"),
        (this._isReady = !0),
        this.dispatchEvent(new CustomEvent("ready")));
    }
    destroyPlayer() {
      ((this._isReady = !1),
        (this._loadedIconData = void 0),
        this._triggerInstance &&
          (this._triggerInstance.onDisconnected &&
            this._triggerInstance.onDisconnected(),
          (this._triggerInstance = void 0)),
        this._playerInstance &&
          (this._playerInstance.disconnect(),
          (this._playerInstance = void 0),
          this.animationContainer.classList.remove("ready")));
    }
    async loadIconData() {
      let B = this.iconData;
      if (!B) {
        if (this.icon && bt._iconLoader)
          this._loadedIconData = B = await bt._iconLoader(this.icon);
        else if (this.src) {
          const z = await fetch(this.src);
          this._loadedIconData = B = await z.json();
        }
      }
      return B;
    }
    refresh() {
      this.movePaletteToCssVariables();
    }
    movePaletteToCssVariables() {
      for (const [B, z] of Object.entries(this._playerInstance.colors || {}))
        z
          ? this.animationContainer.style.setProperty(
              `--lord-icon-${B}-base`,
              z,
            )
          : this.animationContainer.style.removeProperty(
              `--lord-icon-${B}-base`,
            );
    }
    targetChanged() {
      this.triggerChanged();
    }
    loadingChanged() {}
    triggerChanged() {
      var N;
      if (
        (this._triggerInstance &&
          (this._triggerInstance.onDisconnected &&
            this._triggerInstance.onDisconnected(),
          (this._triggerInstance = void 0),
          (N = this._playerInstance) == null || N.pause()),
        !this.trigger || !this._playerInstance)
      )
        return;
      const B = bt._definedTriggers.get(this.trigger);
      if (!B) throw new Error("Can't use unregistered trigger!");
      const z = this.target ? this.closest(this.target) : null;
      ((this._triggerInstance = new B(this._playerInstance, this, z || this)),
        this._triggerInstance.onConnected &&
          this._triggerInstance.onConnected(),
        this._playerInstance.isReady &&
          this._triggerInstance.onReady &&
          this._triggerInstance.onReady());
    }
    colorsChanged() {
      this._playerInstance &&
        (this._playerInstance.colors = o(this.colors) || null);
    }
    strokeChanged() {
      this._playerInstance &&
        (this._playerInstance.stroke = l(this.stroke) || null);
    }
    stateChanged() {
      this._playerInstance && (this._playerInstance.state = this.state);
    }
    iconChanged() {
      this._isConnected && (this.destroyPlayer(), this.createPlayer());
    }
    srcChanged() {
      this._isConnected && (this.destroyPlayer(), this.createPlayer());
    }
    set icon(B) {
      const z = this._assignedIconData;
      B && i(B)
        ? ((this._assignedIconData = B),
          z !== B &&
            (this.hasAttribute("icon")
              ? this.removeAttribute("icon")
              : this.iconChanged()))
        : ((this._assignedIconData = void 0),
          B && typeof B == "string"
            ? this.setAttribute("icon", B)
            : this.hasAttribute("icon")
              ? this.removeAttribute("icon")
              : z && this.iconChanged());
    }
    get icon() {
      return this._assignedIconData || this.getAttribute("icon");
    }
    set src(B) {
      B ? this.setAttribute("src", B) : this.removeAttribute("src");
    }
    get src() {
      return this.getAttribute("src");
    }
    set state(B) {
      B ? this.setAttribute("state", B) : this.removeAttribute("state");
    }
    get state() {
      return this.getAttribute("state");
    }
    set colors(B) {
      B ? this.setAttribute("colors", B) : this.removeAttribute("colors");
    }
    get colors() {
      return this.getAttribute("colors");
    }
    set trigger(B) {
      B ? this.setAttribute("trigger", B) : this.removeAttribute("trigger");
    }
    get trigger() {
      return this.getAttribute("trigger");
    }
    set loading(B) {
      B ? this.setAttribute("loading", B) : this.removeAttribute("loading");
    }
    get loading() {
      if (this.getAttribute("loading")) {
        const B = this.getAttribute("loading").toLowerCase();
        if (B === "lazy") return "lazy";
        if (B === "interaction") return "interaction";
        if (B === "delay") return "delay";
      }
      return null;
    }
    set target(B) {
      B ? this.setAttribute("target", B) : this.removeAttribute("target");
    }
    get target() {
      return this.getAttribute("target");
    }
    set stroke(B) {
      B ? this.setAttribute("stroke", B) : this.removeAttribute("stroke");
    }
    get stroke() {
      return this.hasAttribute("stroke") ? this.getAttribute("stroke") : null;
    }
    set iconData(B) {
      B !== this._assignedIconData &&
        ((this._assignedIconData = B), this.iconChanged());
    }
    get iconData() {
      return this._assignedIconData || this._loadedIconData;
    }
    get isReady() {
      return this._isReady;
    }
    get playerInstance() {
      return this._playerInstance;
    }
    get triggerInstance() {
      return this._triggerInstance;
    }
    get animationContainer() {
      return this._root.lastElementChild;
    }
  };
(Ce(bt, "_iconLoader"),
  Ce(bt, "_playerFactory"),
  Ce(bt, "_definedTriggers", new Map()));
let k = bt;
const E = {
  renderer: "svg",
  loop: !1,
  autoplay: !1,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid meet",
    progressiveLoad: !0,
    hideOnTransparent: !0,
  },
};
function I() {
  return new Proxy(this, {
    set: (V, O, B, z) => (
      typeof O == "string" &&
        (B
          ? p(
              this.lottie,
              this.rawProperties.filter(
                (N) => N.type === "color" && N.name === O,
              ),
              B,
            )
          : y(
              this.lottie,
              this.rawProperties.filter(
                (N) => N.type === "color" && N.name === O,
              ),
            ),
        V.refresh()),
      !0
    ),
    get: (V, O, B) => {
      for (const z of V.rawProperties)
        if (z.type == "color" && typeof O == "string" && O == z.name) {
          const N = s(this.lottie, z.path);
          if (N) return u(N);
        }
    },
    deleteProperty: (V, O) => (
      typeof O == "string" &&
        (y(
          this.lottie,
          this.rawProperties.filter((B) => B.type === "color" && B.name === O),
        ),
        V.refresh()),
      !0
    ),
    ownKeys: (V) =>
      V.rawProperties.filter((O) => O.type == "color").map((O) => O.name),
    has: (V, O) => {
      for (const B of V.rawProperties)
        if (B.type == "color" && typeof O == "string" && O == B.name) return !0;
      return !1;
    },
    getOwnPropertyDescriptor: (V) => ({ enumerable: !0, configurable: !0 }),
  });
}
class C {
  constructor(O, B, z, N, G) {
    Ce(this, "_animationLoader");
    Ce(this, "_container");
    Ce(this, "_iconData");
    Ce(this, "_initial");
    Ce(this, "_options");
    Ce(this, "_lottie");
    Ce(this, "_isReady", !1);
    Ce(this, "_colorsProxy");
    Ce(this, "_direction", 1);
    Ce(this, "_speed", 1);
    Ce(this, "_rawProperties");
    Ce(this, "_eventCallbacks", {});
    Ce(this, "_state");
    Ce(this, "_states");
    if (
      ((this._animationLoader = O),
      (this._container = B),
      (this._iconData = z),
      (this._initial = N || {}),
      (this._options = G || E),
      (this._states = (z.markers || [])
        .map((H) => {
          const [W, q] = H.cm.split(":"),
            j = {
              time: H.tm,
              duration: H.dr,
              name: q || W,
              default: !(!q || !W.includes("default")),
            };
          return (
            (j.name === this._initial.state ||
              (j.default && t(this._initial.state))) &&
              (this._state = j),
            j
          );
        })
        .filter((H) => H.duration > 0)),
      this._states.length &&
        (this._initial.stroke &&
          ![1, 2, 3, "light", "regular", "bold"].includes(
            this._initial.stroke,
          ) &&
          delete this._initial.stroke,
        this._initial.state &&
          !this._state &&
          (this._state = this._states.filter((H) => H.default)[0])),
      !this._states.length)
    ) {
      this._iconData = e(this._iconData);
      const H = m(this._iconData, { lottieInstance: !1 });
      if (H && this._initial.state) {
        const W = `state-${this._initial.state.toLowerCase()}`;
        (p(
          this._iconData,
          H.filter((q) => q.name.startsWith("state-")),
          0,
        ),
          p(
            this._iconData,
            H.filter((q) => q.name === W),
            1,
          ));
      }
      if (H && this._initial.stroke) {
        const W = H.filter((q) => q.name === "stroke")[0];
        if (W) {
          const q = W.value / 50,
            j = this._initial.stroke * q;
          r(this._iconData, W.path, j);
        }
      }
      if (H && this._initial.scale) {
        const W = H.filter((q) => q.name === "scale")[0];
        if (W) {
          const q = W.value / 50,
            j = this._initial.scale * q;
          r(this._iconData, W.path, j);
        }
      }
      if (H && this._initial.axisX && this._initial.axisY) {
        const W = H.filter((q) => q.name === "axis")[0];
        if (W) {
          const q = (W.value[0] + W.value[1]) / 2 / 50;
          (r(this._iconData, W.path + ".0", this._initial.axisX * q),
            r(this._iconData, W.path + ".1", this._initial.axisY * q));
        }
      }
    }
  }
  connect() {
    if (this._lottie) throw new Error("Already connected player!");
    const O = {},
      B = {};
    if (
      (this._state &&
        (B.initialSegment = [
          this._state.time,
          this._state.time + this._state.duration + 1,
        ]),
      this._states.length)
    ) {
      const z = this._states[0],
        N = this._states[this._states.length - 1];
      ((O.ip = z.time), (O.op = N.time + N.duration + 1));
    }
    ((this._lottie = this._animationLoader({
      ...this._options,
      ...B,
      container: this._container,
      animationData: Object.assign(e(this._iconData), O),
    })),
      this._initial.colors && (this.colors = this._initial.colors),
      this._initial.stroke && (this.stroke = this._initial.stroke),
      this._lottie.addEventListener("complete", (z) => {
        this.triggerEvent("complete");
      }),
      this._lottie.addEventListener("loopComplete", () => {
        this.triggerEvent("complete");
      }),
      this._lottie.addEventListener("enterFrame", (z) => {
        this.triggerEvent("frame");
      }),
      this._lottie.isLoaded
        ? ((this._isReady = !0), this.triggerEvent("ready"))
        : this._lottie.addEventListener("config_ready", () => {
            ((this._isReady = !0), this.triggerEvent("ready"));
          }));
  }
  disconnect() {
    if (!this._lottie) throw new Error("Not connected player!");
    ((this._isReady = !1),
      this._lottie.destroy(),
      (this._lottie = void 0),
      (this._colorsProxy = void 0),
      (this._rawProperties = void 0));
  }
  addEventListener(O, B) {
    return (
      this._eventCallbacks[O] || (this._eventCallbacks[O] = []),
      this._eventCallbacks[O].push(B),
      () => {
        this.removeEventListener(O, B);
      }
    );
  }
  removeEventListener(O, B) {
    if (B) {
      if (this._eventCallbacks[O]) {
        let z = 0,
          N = this._eventCallbacks[O].length;
        for (; z < N; )
          (this._eventCallbacks[O][z] === B &&
            (this._eventCallbacks[O].splice(z, 1), (z -= 1), (N -= 1)),
            (z += 1));
        this._eventCallbacks[O].length || (this._eventCallbacks[O] = null);
      }
    } else this._eventCallbacks[O] = null;
  }
  triggerEvent(O, B) {
    if (this._eventCallbacks[O]) {
      const z = this._eventCallbacks[O];
      for (let N = 0; N < z.length; N += 1) z[N](B);
    }
  }
  refresh() {
    var O;
    ((O = this._lottie) == null || O.renderer.renderFrame(null),
      this.triggerEvent("refresh"));
  }
  play() {
    (this._lottie.setDirection(this._direction), this._lottie.play());
  }
  playFromBeginning() {
    (this._lottie.setDirection(1),
      this._state
        ? this._lottie.playSegments(
            [this._state.time, this._state.time + this._state.duration + 1],
            !0,
          )
        : this._lottie.goToAndPlay(0));
  }
  pause() {
    this._lottie.pause();
  }
  stop() {
    this._lottie.stop();
  }
  goToFrame(O) {
    this._lottie.goToAndStop(O, !0);
  }
  goToFirstFrame() {
    this.goToFrame(0);
  }
  goToLastFrame() {
    this.goToFrame(Math.max(0, this.frames));
  }
  set properties(O) {
    ((this.colors = O.colors || null),
      (this.stroke = O.stroke || null),
      (this.state = O.state || null));
  }
  get properties() {
    const O = {};
    return (
      this.rawProperties.filter((B) => B.type === "color").length &&
        (O.colors = { ...this.colors }),
      this.rawProperties.filter(
        (B) => B.name === "stroke" || B.name === "stroke-layers",
      ).length && (O.stroke = this.stroke),
      this._states.length && (O.state = this.state),
      O
    );
  }
  set colors(O) {
    if (
      (y(
        this._lottie,
        this.rawProperties.filter((B) => B.type === "color"),
      ),
      O)
    )
      for (const [B, z] of Object.entries(O))
        p(
          this._lottie,
          this.rawProperties.filter((N) => N.type === "color" && N.name === B),
          z,
        );
    this.refresh();
  }
  get colors() {
    return (
      this._colorsProxy || (this._colorsProxy = I.call(this)),
      this._colorsProxy
    );
  }
  set stroke(O) {
    y(
      this._lottie,
      this.rawProperties.filter(
        (z) => z.name === "stroke" || z.name === "stroke-layers",
      ),
    );
    const B = l(O);
    (B &&
      p(
        this._lottie,
        this.rawProperties.filter(
          (z) => z.name === "stroke" || z.name === "stroke-layers",
        ),
        B,
      ),
      this.refresh());
  }
  get stroke() {
    const O = this.rawProperties.filter(
      (B) => B.name === "stroke" || B.name === "stroke-layers",
    )[0];
    return (O && l(+s(this._lottie, O.path))) || null;
  }
  set state(O) {
    var z;
    if (O === this.state) return;
    const B = this.isPlaying;
    ((this._state = void 0),
      t(O)
        ? (this._state = this._states.filter((N) => N.default)[0])
        : O &&
          ((this._state = this._states.filter((N) => N.name === O)[0]),
          this._state ||
            (this._state = this._states.filter((N) => N.default)[0])),
      this._state
        ? (z = this._lottie) == null ||
          z.setSegment(
            this._state.time,
            this._state.time + this._state.duration + 1,
          )
        : this._lottie.resetSegments(!0),
      this.goToFirstFrame(),
      B && (this.pause(), this.play()));
  }
  get state() {
    return this._state ? this._state.name : "";
  }
  set speed(O) {
    var B;
    ((this._speed = O), (B = this._lottie) == null || B.setSpeed(O));
  }
  get speed() {
    return this._speed;
  }
  set direction(O) {
    ((this._direction = O), this._lottie.setDirection(O));
  }
  get direction() {
    return this._direction;
  }
  set loop(O) {
    this._lottie.loop = O;
  }
  get loop() {
    return !!this._lottie.loop;
  }
  set frame(O) {
    this.goToFrame(Math.max(0, Math.min(this.frames, O)));
  }
  get frame() {
    return this._lottie.currentFrame;
  }
  get states() {
    return this._states;
  }
  get isPlaying() {
    return !this._lottie.isPaused;
  }
  get isReady() {
    return this._isReady;
  }
  get frames() {
    return this._lottie.getDuration(!0) - 1;
  }
  get duration() {
    return this._lottie.getDuration(!1);
  }
  get lottie() {
    return this._lottie;
  }
  get rawProperties() {
    return (
      this._rawProperties ||
        ((this._rawProperties = m(this._iconData, { lottieInstance: !0 })),
        !this._states.length &&
          this._rawProperties &&
          (this._rawProperties = this._rawProperties.filter(
            (O) =>
              O.name !== "scale" &&
              O.name !== "axis" &&
              O.name !== "stroke" &&
              !O.name.startsWith("state-"),
          ))),
      this._rawProperties || []
    );
  }
}
class w {
  constructor(O, B, z) {
    Ce(this, "player");
    Ce(this, "element");
    Ce(this, "targetElement");
    ((this.player = O),
      (this.element = B),
      (this.targetElement = z),
      (this.onHover = this.onHover.bind(this)));
  }
  onConnected() {
    this.targetElement.addEventListener("mouseenter", this.onHover);
  }
  onDisconnected() {
    (this.targetElement.removeEventListener("mouseenter", this.onHover),
      (this.player.direction = 1));
  }
  onComplete() {
    ((this.player.direction = -1), this.player.play());
  }
  onHover() {
    ((this.player.direction = 1), this.player.play());
  }
}
const L = [
  { name: "mousedown" },
  { name: "touchstart", options: { passive: !0 } },
];
class D {
  constructor(O, B, z) {
    Ce(this, "player");
    Ce(this, "element");
    Ce(this, "targetElement");
    ((this.player = O),
      (this.element = B),
      (this.targetElement = z),
      (this.onClick = this.onClick.bind(this)));
  }
  onConnected() {
    for (const O of L)
      this.targetElement.addEventListener(O.name, this.onClick, O.options);
  }
  onDisconnected() {
    for (const O of L)
      this.targetElement.removeEventListener(O.name, this.onClick);
  }
  onClick() {
    this.player.isPlaying || this.player.playFromBeginning();
  }
}
class P {
  constructor(O, B, z) {
    Ce(this, "player");
    Ce(this, "element");
    Ce(this, "targetElement");
    ((this.player = O),
      (this.element = B),
      (this.targetElement = z),
      (this.onHover = this.onHover.bind(this)));
  }
  onConnected() {
    this.targetElement.addEventListener("mouseenter", this.onHover);
  }
  onDisconnected() {
    this.targetElement.removeEventListener("mouseenter", this.onHover);
  }
  onHover() {
    this.player.isPlaying || this.player.playFromBeginning();
  }
}
class T {
  constructor(O, B, z) {
    Ce(this, "player");
    Ce(this, "element");
    Ce(this, "targetElement");
    Ce(this, "playTimeout", null);
    Ce(this, "played", !1);
    Ce(this, "intersectionObserver");
    ((this.player = O), (this.element = B), (this.targetElement = z));
  }
  onConnected() {
    if (this.loading) this.play();
    else {
      const O = (B, z) => {
        B.forEach((N) => {
          N.isIntersecting && (this.play(), this.resetIntersectionObserver());
        });
      };
      ((this.intersectionObserver = new IntersectionObserver(O)),
        this.intersectionObserver.observe(this.element));
    }
  }
  onDisconnected() {
    ((this.played = !1),
      this.resetIntersectionObserver(),
      this.resetPlayDelayTimer());
  }
  play() {
    this.played ||
      ((this.played = !0),
      this.resetPlayDelayTimer(),
      this.delay > 0
        ? (this.playTimeout = setTimeout(() => {
            (this.player.playFromBeginning(), (this.playTimeout = null));
          }, this.delay))
        : this.player.playFromBeginning());
  }
  resetIntersectionObserver() {
    this.intersectionObserver &&
      (this.intersectionObserver.unobserve(this.element),
      (this.intersectionObserver = void 0));
  }
  resetPlayDelayTimer() {
    this.playTimeout &&
      (clearTimeout(this.playTimeout), (this.playTimeout = null));
  }
  get delay() {
    const O = this.element.hasAttribute("delay")
      ? +(this.element.getAttribute("delay") || 0)
      : 0;
    return Math.max(O, 0);
  }
  get loading() {
    return this.element.hasAttribute("loading");
  }
}
class A {
  constructor(O, B, z) {
    Ce(this, "player");
    Ce(this, "element");
    Ce(this, "targetElement");
    Ce(this, "playTimeout", null);
    ((this.player = O), (this.element = B), (this.targetElement = z));
  }
  onReady() {
    this.play();
  }
  onComplete() {
    this.play();
  }
  onDisconnected() {
    this.resetPlayDelayTimer();
  }
  play() {
    (this.resetPlayDelayTimer(),
      this.delay > 0
        ? (this.playTimeout = setTimeout(() => {
            this.player.playFromBeginning();
          }, this.delay))
        : this.player.playFromBeginning());
  }
  resetPlayDelayTimer() {
    this.playTimeout &&
      (clearTimeout(this.playTimeout), (this.playTimeout = null));
  }
  get delay() {
    const O = this.element.hasAttribute("delay")
      ? +(this.element.getAttribute("delay") || 0)
      : 0;
    return Math.max(O, 0);
  }
}
class F {
  constructor(O, B, z) {
    Ce(this, "player");
    Ce(this, "element");
    Ce(this, "targetElement");
    Ce(this, "playTimeout", null);
    Ce(this, "mouseIn", !1);
    ((this.player = O),
      (this.element = B),
      (this.targetElement = z),
      (this.onMouseEnter = this.onMouseEnter.bind(this)),
      (this.onMouseLeave = this.onMouseLeave.bind(this)));
  }
  onConnected() {
    (this.targetElement.addEventListener("mouseenter", this.onMouseEnter),
      this.targetElement.addEventListener("mouseleave", this.onMouseLeave));
  }
  onDisconnected() {
    (this.targetElement.removeEventListener("mouseenter", this.onMouseEnter),
      this.targetElement.removeEventListener("mouseleave", this.onMouseLeave),
      this.resetPlayDelayTimer());
  }
  onMouseEnter() {
    ((this.mouseIn = !0), this.player.isPlaying || this.play());
  }
  onMouseLeave() {
    ((this.mouseIn = !1), this.resetPlayDelayTimer());
  }
  onComplete() {
    this.play();
  }
  play() {
    (this.resetPlayDelayTimer(),
      this.mouseIn &&
        (this.delay > 0
          ? (this.playTimeout = setTimeout(() => {
              this.player.playFromBeginning();
            }, this.delay))
          : this.player.playFromBeginning()));
  }
  resetPlayDelayTimer() {
    this.playTimeout &&
      (clearTimeout(this.playTimeout), (this.playTimeout = null));
  }
  get delay() {
    const O = this.element.hasAttribute("delay")
      ? +(this.element.getAttribute("delay") || 0)
      : 0;
    return Math.max(O, 0);
  }
}
class x {
  constructor(O, B, z) {
    Ce(this, "player");
    Ce(this, "element");
    Ce(this, "targetElement");
    ((this.player = O),
      (this.element = B),
      (this.targetElement = z),
      (this.onMouseEnter = this.onMouseEnter.bind(this)),
      (this.onMouseLeave = this.onMouseLeave.bind(this)));
  }
  onConnected() {
    (this.targetElement.addEventListener("mouseenter", this.onMouseEnter),
      this.targetElement.addEventListener("mouseleave", this.onMouseLeave));
  }
  onDisconnected() {
    (this.targetElement.removeEventListener("mouseenter", this.onMouseEnter),
      this.targetElement.removeEventListener("mouseleave", this.onMouseLeave),
      (this.player.direction = 1));
  }
  onMouseEnter() {
    ((this.player.direction = 1), this.player.play());
  }
  onMouseLeave() {
    ((this.player.direction = -1), this.player.play());
  }
}
const M = /^\d*(\.\d+)?$/,
  S = { attributes: !0, childList: !1, subtree: !1 };
class R {
  constructor(O, B, z) {
    Ce(this, "player");
    Ce(this, "element");
    Ce(this, "targetElement");
    Ce(this, "sequenceIndex", 0);
    Ce(this, "frameState", null);
    Ce(this, "frameDelayFirst", null);
    Ce(this, "frameDelayLast", null);
    Ce(this, "timer");
    Ce(this, "observer");
    ((this.player = O),
      (this.element = B),
      (this.targetElement = z),
      (this.observer = new MutationObserver((N, G) => {
        for (const H of N)
          H.type === "attributes" &&
            H.attributeName === "sequence" &&
            (this.reset(), this.step());
      })));
  }
  onReady() {
    this.step();
  }
  onComplete() {
    this.timer = setTimeout(() => {
      ((this.timer = null), (this.frameDelayLast = null), this.step());
    }, this.frameDelayLast || 0);
  }
  onConnected() {
    this.observer.observe(this.element, S);
  }
  onDisconnected() {
    (this.observer.disconnect(),
      this.timer && (clearTimeout(this.timer), (this.timer = null)));
  }
  reset() {
    (this.player.pause(),
      (this.sequenceIndex = 0),
      (this.frameState = this.frameDelayFirst = this.frameDelayLast = null),
      this.timer && (clearTimeout(this.timer), (this.timer = null)));
  }
  takeStep() {
    const O = this.sequence.split(","),
      B = O[this.sequenceIndex];
    (this.sequenceIndex++,
      this.sequenceIndex >= O.length && (this.sequenceIndex = 0));
    const [z, ...N] = B.split(":");
    return { action: z, params: N };
  }
  handleStep(O, B) {
    if (O === "play")
      (this.frameState &&
        ((this.player.state = this.frameState), (this.frameState = null)),
        B.includes("reverse")
          ? (this.player.goToLastFrame(), (this.player.direction = -1))
          : (this.player.goToFirstFrame(), (this.player.direction = 1)),
        (this.timer = setTimeout(() => {
          ((this.timer = null),
            (this.frameDelayFirst = null),
            this.player.play());
        }, this.frameDelayFirst || 0)));
    else if (O === "frame") {
      let z = 0;
      (B.length &&
        B[0].match(M) &&
        (z = Math.max(0, Math.min(this.player.frames, +B[0]))),
        (this.player.frame = z),
        (this.timer = setTimeout(() => {
          ((this.timer = null), (this.frameDelayFirst = null), this.step());
        }, this.frameDelayFirst || 0)));
    } else if (O === "state") ((this.frameState = B[0]), this.step());
    else if (O === "delay") {
      let z = null;
      for (const N of B) N && N.match(M) && (z = +N);
      (z &&
        z > 0 &&
        (B.includes("first") && B.includes("last")
          ? ((this.frameDelayFirst = z), (this.frameDelayLast = z))
          : B.includes("first")
            ? (this.frameDelayFirst = z)
            : B.includes("last")
              ? (this.frameDelayLast = z)
              : (this.frameDelayFirst = z)),
        this.step());
    } else if (O !== "idle") throw new Error(`Invalid sequence action: ${O}`);
  }
  step() {
    const { action: O, params: B } = this.takeStep();
    O && this.handleStep(O, B);
  }
  get sequence() {
    return this.element.getAttribute("sequence") || "";
  }
}
function $(V) {
  (k.setPlayerFactory((O, B, z) => new C(V, O, B, z)),
    k.defineTrigger("in", T),
    k.defineTrigger("click", D),
    k.defineTrigger("hover", P),
    k.defineTrigger("loop", A),
    k.defineTrigger("loop-on-hover", F),
    k.defineTrigger("morph", x),
    k.defineTrigger("boomerang", w),
    k.defineTrigger("sequence", R),
    k.defineTrigger("morph-two-way", w),
    (customElements.get && customElements.get("lord-icon")) ||
      customElements.define("lord-icon", k));
}
function removeLoader() {
  (document.body.classList.add("loaded"),
    setTimeout(() => {
      (fetch_Data(),
        flip_Link_hover(),
        init(),
        $(lottie.loadAnimation),
        createIntroAnimation(),
        sheryJS());
    }, 150));
}
window.addEventListener("load", () => {
  setTimeout(() => {
    removeLoader();
  }, 500);
});
