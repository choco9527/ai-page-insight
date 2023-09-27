"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
// const puppeteer = require('puppeteer-core');
var puppeteer = require('puppeteer');
var _require = require('./js/common'),
  sleep = _require.sleep;
var _require2 = require('./js/constans'),
  launchConfig = _require2.launchConfig;
var _require3 = require('./js/helper'),
  HandleCanvas = _require3.HandleCanvas;
require("@babel/core").transform("code", {
  presets: ["@babel/preset-env"]
});
function openBrowser() {
  return _openBrowser.apply(this, arguments);
}
function _openBrowser() {
  _openBrowser = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var options, browser, _yield$browser$pages, _yield$browser$pages2, p1;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log('正在启动 Chrome');
          options = {
            // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // 使用默认的浏览器执行路径
            headless: false,
            // 无头模式
            args: launchConfig,
            defaultViewport: {
              width: 1280,
              height: 800
            },
            // devtools: true,
            ignoreDefaultArgs: ["--enable-automation"]
          };
          if (process.env.CHROME_PATH) {
            options.executablePath = process.env.CHROME_PATH;
          }
          _context2.next = 5;
          return puppeteer.launch(options);
        case 5:
          browser = _context2.sent;
          _context2.next = 8;
          return browser.pages();
        case 8:
          _yield$browser$pages = _context2.sent;
          _yield$browser$pages2 = _slicedToArray(_yield$browser$pages, 1);
          p1 = _yield$browser$pages2[0];
          return _context2.abrupt("return", {
            page: p1,
            browser: browser
          });
        case 12:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _openBrowser.apply(this, arguments);
}
var main = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var dataMap, _yield$openBrowser, page, browser, videoData;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // 最终需要的数据集合
          dataMap = {};
          _context.next = 3;
          return openBrowser();
        case 3:
          _yield$openBrowser = _context.sent;
          page = _yield$openBrowser.page;
          browser = _yield$openBrowser.browser;
          _context.prev = 6;
          _context.next = 9;
          return _openPage(page);
        case 9:
          _context.next = 11;
          return sleep(2000);
        case 11:
          _context.next = 13;
          return _getVideoData(page);
        case 13:
          videoData = _context.sent;
          console.log(videoData);
          // await getTextByOcrSingle(base64Img)
          return _context.abrupt("return", dataMap);
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](6);
          console.warn(_context.t0);
          // await browser.close();
          return _context.abrupt("return", dataMap);
        case 22:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[6, 18]]);
  }));
  return function main() {
    return _ref.apply(this, arguments);
  };
}();

/**
 * 打开页面
 * @param p
 * @returns {Promise<void>}
 */
function _openPage(_x) {
  return _openPage2.apply(this, arguments);
}
/**
 * 获取页面视频
 * @returns {Promise<XPathResult>}
 * @private
 */
function _openPage2() {
  _openPage2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(p) {
    var urls, url;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          urls = ['https://www.bilibili.com/video/BV1zm4y1N7zp/?spm_id_from=333.337.search-card.all.click' //
          ];
          url = urls[0];
          _context3.next = 4;
          return p.setBypassCSP(true);
        case 4:
          _context3.next = 6;
          return p["goto"](url);
        case 6:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _openPage2.apply(this, arguments);
}
function _getVideoData(_x2) {
  return _getVideoData2.apply(this, arguments);
}
function _getVideoData2() {
  _getVideoData2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(page) {
    var videoData;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          console.log('读取视频当前数据');
          _context5.next = 3;
          return page.waitForSelector('.bpx-player-video-wrap');
        case 3:
          console.log('视频加载成功');
          _context5.next = 6;
          return page.evaluate( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
            var CanvasId, HandleCanvas, $canvas, getInfo;
            return _regeneratorRuntime().wrap(function _callee4$(_context4) {
              while (1) switch (_context4.prev = _context4.next) {
                case 0:
                  HandleCanvas = function _HandleCanvas() {
                    var videoSelector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
                    var videoEle = null;
                    var viewWidth = 668;
                    var viewHeight = 376;
                    var selector = videoSelector;
                    var footerHeight = 50;
                    var paddingWidth = 100;
                    function initCanvas(_ref3) {
                      var _ref3$id = _ref3.id,
                        id = _ref3$id === void 0 ? '' : _ref3$id,
                        _ref3$height = _ref3.height,
                        height = _ref3$height === void 0 ? 0 : _ref3$height,
                        _ref3$width = _ref3.width,
                        width = _ref3$width === void 0 ? 0 : _ref3$width;
                      var K = 1;
                      var canvasEle = document.createElement('canvas');
                      canvasEle.id = "".concat(CanvasId, "-").concat(id);
                      canvasEle.style.zIndex = '1100';
                      canvasEle.style.opacity = '1';
                      canvasEle.style.position = 'fixed';
                      canvasEle.style.top = '0';
                      canvasEle.style.left = '0';
                      canvasEle.width = width / K;
                      canvasEle.height = height ? height / K : (viewHeight - footerHeight) / K;
                      document.body.appendChild(canvasEle);
                      return canvasEle;
                    }
                    function createNewCanvas() {
                      var newCanvas = document.getElementById('yyds-origin-canvas');
                      if (!newCanvas) {
                        newCanvas = document.createElement('canvas');
                        newCanvas.id = 'yyds-origin-canvas';
                        newCanvas.style.zIndex = '100';
                        newCanvas.style.position = 'fixed';
                        newCanvas.style.top = '0';
                        newCanvas.style.left = '0';
                        newCanvas.width = viewWidth;
                        newCanvas.height = viewHeight;
                        newCanvas.style.display = 'block';
                        document.body.appendChild(newCanvas);
                      }
                      newCanvas.style.display = newCanvas.style.display === 'none' ? 'block' : 'none';
                      var ctx = newCanvas.getContext('2d');
                      ctx.drawImage(videoEle, 0, 0, newCanvas.width - 2 * paddingWidth, newCanvas.height);
                    }
                    function fresh() {
                      if (!videoEle) {
                        videoEle = document.querySelector(selector ? selector : 'video');
                        return videoEle;
                      }
                    }
                    function drawCaptionImg(_ref4) {
                      var _ref4$height = _ref4.height,
                        height = _ref4$height === void 0 ? 80 : _ref4$height,
                        _ref4$id = _ref4.id,
                        id = _ref4$id === void 0 ? '' : _ref4$id;
                      var cWidth = viewWidth - 2 * paddingWidth;
                      var cHeight = height - footerHeight;
                      var canvasEle = this.initCanvas({
                        id: id,
                        height: cHeight,
                        width: cWidth
                      });
                      fresh();
                      if (videoEle) {
                        var ctx = canvasEle.getContext('2d');
                        ctx.imageSmoothingEnabled = false;
                        ctx.drawImage(videoEle, paddingWidth, viewHeight - height, cWidth, cHeight, 0, 0, cWidth, cHeight);
                      }
                      return canvasEle;
                    }
                    function processImageAndReturnBase64(canvasEle) {
                      var ctx = canvasEle.getContext('2d');
                      var imageData = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
                      var data = imageData.data;
                      var threshold = 200;
                      for (var i = 0; i < data.length; i += 4) {
                        var r = data[i];
                        var g = data[i + 1];
                        var b = data[i + 2];
                        var gray = (r + g + b) / 3;
                        var color = 255;
                        if (gray < threshold || [r, g, b].some(function (val) {
                          return val < 195;
                        })) {
                          color = 0;
                        }
                        data[i] = color;
                        data[i + 1] = color;
                        data[i + 2] = color;
                      }
                      ctx.putImageData(imageData, 0, 0);
                      return canvasEle.toDataURL();
                    }
                    return {
                      initCanvas: initCanvas,
                      createNewCanvas: createNewCanvas,
                      drawCaptionImg: drawCaptionImg,
                      processImageAndReturnBase64: processImageAndReturnBase64
                    };
                  };
                  CanvasId = 'yyds-canvas';
                  $canvas = new HandleCanvas(); // 直接读取视频内容
                  getInfo = function getInfo() {
                    var timeElement = document.querySelector('#bilibili-player .bpx-player-ctrl-time-current');
                    var videoTime = timeElement ? timeElement.textContent : '';
                    var tId = Date.now();
                    var canEl = $canvas.drawCaptionImg({
                      id: tId
                    });
                    var base64Img = $canvas.processImageAndReturnBase64(canEl);
                    var item = {
                      base64Img: base64Img,
                      videoTime: videoTime,
                      id: tId
                    };
                    console.log('读取', item);
                    return item;
                  };
                  return _context4.abrupt("return", Promise.resolve(getInfo()));
                case 5:
                case "end":
                  return _context4.stop();
              }
            }, _callee4);
          })));
        case 6:
          videoData = _context5.sent;
          return _context5.abrupt("return", videoData);
        case 8:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _getVideoData2.apply(this, arguments);
}
main().then(function (data) {
  console.log('最终数据', data); /*！最终数据！*/
});

/**
 *
 * 准确率 容错率
 */
