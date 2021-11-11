/*!jquery.cookie v1.4.1 | MIT*/ ! function (a) {
  "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? a(require("jquery")) : a(jQuery)
}(function (a) {
  function b(a) {
    return h.raw ? a : encodeURIComponent(a)
  }

  function c(a) {
    return h.raw ? a : decodeURIComponent(a)
  }

  function d(a) {
    return b(h.json ? JSON.stringify(a) : String(a))
  }

  function e(a) {
    0 === a.indexOf('"') && (a = a.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
    try {
      return a = decodeURIComponent(a.replace(g, " ")), h.json ? JSON.parse(a) : a
    } catch (b) {}
  }

  function f(b, c) {
    var d = h.raw ? b : e(b);
    return a.isFunction(c) ? c(d) : d
  }
  var g = /\+/g,
    h = a.cookie = function (e, g, i) {
      if (void 0 !== g && !a.isFunction(g)) {
        if (i = a.extend({}, h.defaults, i), "number" == typeof i.expires) {
          var j = i.expires,
            k = i.expires = new Date;
          k.setTime(+k + 864e5 * j)
        }
        return document.cookie = [b(e), "=", d(g), i.expires ? "; expires=" + i.expires.toUTCString() : "", i.path ? "; path=" + i.path : "", i.domain ? "; domain=" + i.domain : "", i.secure ? "; secure" : ""].join("")
      }
      for (var l = e ? void 0 : {}, m = document.cookie ? document.cookie.split("; ") : [], n = 0, o = m.length; o > n; n++) {
        var p = m[n].split("="),
          q = c(p.shift()),
          r = p.join("=");
        if (e && e === q) {
          l = f(r, g);
          break
        }
        e || void 0 === (r = f(r)) || (l[q] = r)
      }
      return l
    };
  h.defaults = {}, a.removeCookie = function (b, c) {
    return void 0 === a.cookie(b) ? !1 : (a.cookie(b, "", a.extend({}, c, {
      expires: -1
    })), !a.cookie(b))
  }
}); /*!jquery.pjax v2.0.1*/
! function (t) {
  function e(e, a, r) {
    return r = m(a, r), this.on("click.pjax", e, function (e) {
      var a = r;
      a.container || (a = t.extend({}, r), a.container = t(this).attr("data-pjax")), n(e, a)
    })
  }

  function n(e, n, a) {
    a = m(n, a);
    var i = e.currentTarget,
      o = t(i);
    if ("A" !== i.tagName.toUpperCase()) throw "$.fn.pjax or $.pjax.click requires an anchor element";
    if (!(e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || location.protocol !== i.protocol || location.hostname !== i.hostname || i.href.indexOf("#") > -1 && h(i) == h(location) || e.isDefaultPrevented())) {
      var c = {
          url: i.href,
          container: o.attr("data-pjax"),
          target: i
        },
        s = t.extend({}, c, a),
        u = t.Event("pjax:click");
      o.trigger(u, [s]), u.isDefaultPrevented() || (r(s), e.preventDefault(), o.trigger("pjax:clicked", [s]))
    }
  }

  function a(e, n, a) {
    a = m(n, a);
    var i = e.currentTarget,
      o = t(i);
    if ("FORM" !== i.tagName.toUpperCase()) throw "$.pjax.submit requires a form element";
    var c = {
      type: (o.attr("method") || "GET").toUpperCase(),
      url: o.attr("action"),
      container: o.attr("data-pjax"),
      target: i
    };
    if ("GET" !== c.type && void 0 !== window.FormData) c.data = new FormData(i), c.processData = !1, c.contentType = !1;
    else {
      if (o.find(":file").length) return;
      c.data = o.serializeArray()
    }
    r(t.extend({}, c, a)), e.preventDefault()
  }

  function r(e) {
    function n(n, a, r) {
      r || (r = {}), r.relatedTarget = e.target;
      var i = t.Event(n, r);
      return c.trigger(i, a), !i.isDefaultPrevented()
    }
    e = t.extend(!0, {}, t.ajaxSettings, r.defaults, e), t.isFunction(e.url) && (e.url = e.url());
    var a = f(e.url).hash,
      i = t.type(e.container);
    if ("string" !== i) throw "expected string value for 'container' option; got " + i;
    var c = e.context = t(e.container);
    if (!c.length) throw "the container selector '" + e.container + "' did not match anything";
    e.data || (e.data = {}), t.isArray(e.data) ? e.data.push({
      name: "_pjax",
      value: e.container
    }) : e.data._pjax = e.container;
    var s;
    e.beforeSend = function (t, r) {
      if ("GET" !== r.type && (r.timeout = 0), t.setRequestHeader("X-PJAX", "true"), t.setRequestHeader("X-PJAX-Container", e.container), !n("pjax:beforeSend", [t, r])) return !1;
      r.timeout > 0 && (s = setTimeout(function () {
        n("pjax:timeout", [t, e]) && t.abort("timeout")
      }, r.timeout), r.timeout = 0);
      var i = f(r.url);
      a && (i.hash = a), e.requestUrl = d(i)
    }, e.complete = function (t, a) {
      s && clearTimeout(s), n("pjax:complete", [t, a, e]), n("pjax:end", [t, e])
    }, e.error = function (t, a, r) {
      var i = g("", t, e),
        c = n("pjax:error", [t, a, r, e]);
      "GET" == e.type && "abort" !== a && c && o(i.url)
    }, e.success = function (i, s, u) {
      var p = r.state,
        d = "function" == typeof t.pjax.defaults.version ? t.pjax.defaults.version() : t.pjax.defaults.version,
        h = u.getResponseHeader("X-PJAX-Version"),
        m = g(i, u, e),
        v = f(m.url);
      if (a && (v.hash = a, m.url = v.href), d && h && d !== h) return void o(m.url);
      if (!m.contents) return void o(m.url);
      r.state = {
        id: e.id || l(),
        url: m.url,
        title: m.title,
        container: e.container,
        fragment: e.fragment,
        timeout: e.timeout
      }, (e.push || e.replace) && window.history.replaceState(r.state, m.title, m.url);
      var x = t.contains(c, document.activeElement);
      if (x) try {
        document.activeElement.blur()
      } catch (t) {}
      m.title && (document.title = m.title), n("pjax:beforeReplace", [m.contents, e], {
        state: r.state,
        previousState: p
      }), c.html(m.contents);
      var j = c.find("input[autofocus], textarea[autofocus]").last()[0];
      j && document.activeElement !== j && j.focus(), y(m.scripts);
      var w = e.scrollTo;
      if (a) {
        var b = decodeURIComponent(a.slice(1)),
          T = document.getElementById(b) || document.getElementsByName(b)[0];
        T && (w = t(T).offset().top)
      }
      "number" == typeof w && t(window).scrollTop(w), n("pjax:success", [i, s, u, e])
    }, r.state || (r.state = {
      id: l(),
      url: window.location.href,
      title: document.title,
      container: e.container,
      fragment: e.fragment,
      timeout: e.timeout
    }, window.history.replaceState(r.state, document.title)), u(r.xhr), r.options = e;
    var h = r.xhr = t.ajax(e);
    return h.readyState > 0 && (e.push && !e.replace && (j(r.state.id, [e.container, p(c)]), window.history.pushState(null, "", e.requestUrl)), n("pjax:start", [h, e]), n("pjax:send", [h, e])), r.xhr
  }

  function i(e, n) {
    var a = {
      url: window.location.href,
      push: !1,
      replace: !0,
      scrollTo: !1
    };
    return r(t.extend(a, m(e, n)))
  }

  function o(t) {
    window.history.replaceState(null, "", r.state.url), window.location.replace(t)
  }

  function c(e) {
    P || u(r.xhr);
    var n, a = r.state,
      i = e.state;
    if (i && i.container) {
      if (P && C == i.url) return;
      if (a) {
        if (a.id === i.id) return;
        n = a.id < i.id ? "forward" : "back"
      }
      var c = D[i.id] || [],
        s = c[0] || i.container,
        l = t(s),
        d = c[1];
      if (l.length) {
        a && w(n, a.id, [s, p(l)]);
        var f = t.Event("pjax:popstate", {
          state: i,
          direction: n
        });
        l.trigger(f);
        var h = {
          id: i.id,
          url: i.url,
          container: s,
          push: !1,
          fragment: i.fragment,
          timeout: i.timeout,
          scrollTo: !1
        };
        if (d) {
          l.trigger("pjax:start", [null, h]), r.state = i, i.title && (document.title = i.title);
          var m = t.Event("pjax:beforeReplace", {
            state: i,
            previousState: a
          });
          l.trigger(m, [d, h]), l.html(d), l.trigger("pjax:end", [null, h])
        } else r(h);
        l[0].offsetHeight
      } else o(location.href)
    }
    P = !1
  }

  function s(e) {
    var n = t.isFunction(e.url) ? e.url() : e.url,
      a = e.type ? e.type.toUpperCase() : "GET",
      r = t("<form>", {
        method: "GET" === a ? "GET" : "POST",
        action: n,
        style: "display:none"
      });
    "GET" !== a && "POST" !== a && r.append(t("<input>", {
      type: "hidden",
      name: "_method",
      value: a.toLowerCase()
    }));
    var i = e.data;
    if ("string" == typeof i) t.each(i.split("&"), function (e, n) {
      var a = n.split("=");
      r.append(t("<input>", {
        type: "hidden",
        name: a[0],
        value: a[1]
      }))
    });
    else if (t.isArray(i)) t.each(i, function (e, n) {
      r.append(t("<input>", {
        type: "hidden",
        name: n.name,
        value: n.value
      }))
    });
    else if ("object" == typeof i) {
      var o;
      for (o in i) r.append(t("<input>", {
        type: "hidden",
        name: o,
        value: i[o]
      }))
    }
    t(document.body).append(r), r.submit()
  }

  function u(e) {
    e && e.readyState < 4 && (e.onreadystatechange = t.noop, e.abort())
  }

  function l() {
    return (new Date).getTime()
  }

  function p(e) {
    var n = e.clone();
    return n.find("script").each(function () {
      this.src || t._data(this, "globalEval", !1)
    }), n.contents()
  }

  function d(t) {
    return t.search = t.search.replace(/([?&])(_pjax|_)=[^&]*/g, "").replace(/^&/, ""), t.href.replace(/\?($|#)/, "$1")
  }

  function f(t) {
    var e = document.createElement("a");
    return e.href = t, e
  }

  function h(t) {
    return t.href.replace(/#.*/, "")
  }

  function m(e, n) {
    return e && n ? (n = t.extend({}, n), n.container = e, n) : t.isPlainObject(e) ? e : {
      container: e
    }
  }

  function v(t, e) {
    return t.filter(e).add(t.find(e))
  }

  function x(e) {
    return t.parseHTML(e, document, !0)
  }

  function g(e, n, a) {
    var r = {},
      i = /<html/i.test(e),
      o = n.getResponseHeader("X-PJAX-URL");
    r.url = o ? d(f(o)) : a.requestUrl;
    var c, s;
    if (i) {
      s = t(x(e.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]));
      var u = e.match(/<head[^>]*>([\s\S.]*)<\/head>/i);
      c = null != u ? t(x(u[0])) : s
    } else c = s = t(x(e));
    if (0 === s.length) return r;
    if (r.title = v(c, "title").last().text(), a.fragment) {
      var l = s;
      "body" !== a.fragment && (l = v(l, a.fragment).first()), l.length && (r.contents = "body" === a.fragment ? l : l.contents(), r.title || (r.title = l.attr("title") || l.data("title")))
    } else i || (r.contents = s);
    return r.contents && (r.contents = r.contents.not(function () {
      return t(this).is("title")
    }), r.contents.find("title").remove(), r.scripts = v(r.contents, "script[src]").remove(), r.contents = r.contents.not(r.scripts)), r.title && (r.title = t.trim(r.title)), r
  }

  function y(e) {
    if (e) {
      var n = t("script[src]");
      e.each(function () {
        var e = this.src,
          a = n.filter(function () {
            return this.src === e
          });
        if (!a.length) {
          var r = document.createElement("script"),
            i = t(this).attr("type");
          i && (r.type = i), r.src = t(this).attr("src"), document.head.appendChild(r)
        }
      })
    }
  }

  function j(t, e) {
    D[t] = e, U.push(t), b(R, 0), b(U, r.defaults.maxCacheLength)
  }

  function w(t, e, n) {
    var a, i;
    D[e] = n, "forward" === t ? (a = U, i = R) : (a = R, i = U), a.push(e), e = i.pop(), e && delete D[e], b(a, r.defaults.maxCacheLength)
  }

  function b(t, e) {
    for (; t.length > e;) delete D[t.shift()]
  }

  function T() {
    return t("meta").filter(function () {
      var e = t(this).attr("http-equiv");
      return e && "X-PJAX-VERSION" === e.toUpperCase()
    }).attr("content")
  }

  function E() {
    t.fn.pjax = e, t.pjax = r, t.pjax.enable = t.noop, t.pjax.disable = S, t.pjax.click = n, t.pjax.submit = a, t.pjax.reload = i, t.pjax.defaults = {
      timeout: 650,
      push: !0,
      replace: !1,
      type: "GET",
      dataType: "html",
      scrollTo: 0,
      maxCacheLength: 20,
      version: T
    }, t(window).on("popstate.pjax", c)
  }

  function S() {
    t.fn.pjax = function () {
      return this
    }, t.pjax = s, t.pjax.enable = E, t.pjax.disable = t.noop, t.pjax.click = t.noop, t.pjax.submit = t.noop, t.pjax.reload = function () {
      window.location.reload()
    }, t(window).off("popstate.pjax", c)
  }
  var P = !0,
    C = window.location.href,
    A = window.history.state;
  A && A.container && (r.state = A), "state" in window.history && (P = !1);
  var D = {},
    R = [],
    U = [];
  t.event.props && t.inArray("state", t.event.props) < 0 ? t.event.props.push("state") : "state" in t.Event.prototype || t.event.addProp("state"), t.support.pjax = window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/), t.support.pjax ? E() : S()
}(jQuery); /*!pace 1.0.2*/
(function () {
  var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X = [].slice,
    Y = {}.hasOwnProperty,
    Z = function (a, b) {
      function c() {
        this.constructor = a
      }
      for (var d in b) Y.call(b, d) && (a[d] = b[d]);
      return c.prototype = b.prototype, a.prototype = new c, a.__super__ = b.prototype, a
    },
    $ = [].indexOf || function (a) {
      for (var b = 0, c = this.length; c > b; b++)
        if (b in this && this[b] === a) return b;
      return -1
    };
  for (u = {
      catchupTime: 100,
      initialRate: .03,
      minTime: 250,
      ghostTime: 100,
      maxProgressPerFrame: 20,
      easeFactor: 1.25,
      startOnPageLoad: !0,
      restartOnPushState: !0,
      restartOnRequestAfter: 500,
      target: "body",
      elements: {
        checkInterval: 100,
        selectors: ["body"]
      },
      eventLag: {
        minSamples: 10,
        sampleCount: 3,
        lagThreshold: 3
      },
      ajax: {
        trackMethods: ["GET"],
        trackWebSockets: !0,
        ignoreURLs: []
      }
    }, C = function () {
      var a;
      return null != (a = "undefined" != typeof performance && null !== performance && "function" == typeof performance.now ? performance.now() : void 0) ? a : +new Date
    }, E = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, t = window.cancelAnimationFrame || window.mozCancelAnimationFrame, null == E && (E = function (a) {
      return setTimeout(a, 50)
    }, t = function (a) {
      return clearTimeout(a)
    }), G = function (a) {
      var b, c;
      return b = C(), (c = function () {
        var d;
        return d = C() - b, d >= 33 ? (b = C(), a(d, function () {
          return E(c)
        })) : setTimeout(c, 33 - d)
      })()
    }, F = function () {
      var a, b, c;
      return c = arguments[0], b = arguments[1], a = 3 <= arguments.length ? X.call(arguments, 2) : [], "function" == typeof c[b] ? c[b].apply(c, a) : c[b]
    }, v = function () {
      var a, b, c, d, e, f, g;
      for (b = arguments[0], d = 2 <= arguments.length ? X.call(arguments, 1) : [], f = 0, g = d.length; g > f; f++)
        if (c = d[f])
          for (a in c) Y.call(c, a) && (e = c[a], null != b[a] && "object" == typeof b[a] && null != e && "object" == typeof e ? v(b[a], e) : b[a] = e);
      return b
    }, q = function (a) {
      var b, c, d, e, f;
      for (c = b = 0, e = 0, f = a.length; f > e; e++) d = a[e], c += Math.abs(d), b++;
      return c / b
    }, x = function (a, b) {
      var c, d, e;
      if (null == a && (a = "options"), null == b && (b = !0), e = document.querySelector("[data-pace-" + a + "]")) {
        if (c = e.getAttribute("data-pace-" + a), !b) return c;
        try {
          return JSON.parse(c)
        } catch (f) {
          return d = f, "undefined" != typeof console && null !== console ? console.error("Error parsing inline pace options", d) : void 0
        }
      }
    }, g = function () {
      function a() {}
      return a.prototype.on = function (a, b, c, d) {
        var e;
        return null == d && (d = !1), null == this.bindings && (this.bindings = {}), null == (e = this.bindings)[a] && (e[a] = []), this.bindings[a].push({
          handler: b,
          ctx: c,
          once: d
        })
      }, a.prototype.once = function (a, b, c) {
        return this.on(a, b, c, !0)
      }, a.prototype.off = function (a, b) {
        var c, d, e;
        if (null != (null != (d = this.bindings) ? d[a] : void 0)) {
          if (null == b) return delete this.bindings[a];
          for (c = 0, e = []; c < this.bindings[a].length;) e.push(this.bindings[a][c].handler === b ? this.bindings[a].splice(c, 1) : c++);
          return e
        }
      }, a.prototype.trigger = function () {
        var a, b, c, d, e, f, g, h, i;
        if (c = arguments[0], a = 2 <= arguments.length ? X.call(arguments, 1) : [], null != (g = this.bindings) ? g[c] : void 0) {
          for (e = 0, i = []; e < this.bindings[c].length;) h = this.bindings[c][e], d = h.handler, b = h.ctx, f = h.once, d.apply(null != b ? b : this, a), i.push(f ? this.bindings[c].splice(e, 1) : e++);
          return i
        }
      }, a
    }(), j = window.Pace || {}, window.Pace = j, v(j, g.prototype), D = j.options = v({}, u, window.paceOptions, x()), U = ["ajax", "document", "eventLag", "elements"], Q = 0, S = U.length; S > Q; Q++) K = U[Q], D[K] === !0 && (D[K] = u[K]);
  i = function (a) {
    function b() {
      return V = b.__super__.constructor.apply(this, arguments)
    }
    return Z(b, a), b
  }(Error), b = function () {
    function a() {
      this.progress = 0
    }
    return a.prototype.getElement = function () {
      var a;
      if (null == this.el) {
        if (a = document.querySelector(D.target), !a) throw new i;
        this.el = document.createElement("div"), this.el.className = "pace pace-active", document.body.className = document.body.className.replace(/pace-done/g, ""), document.body.className += " pace-running", this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>', null != a.firstChild ? a.insertBefore(this.el, a.firstChild) : a.appendChild(this.el)
      }
      return this.el
    }, a.prototype.finish = function () {
      var a;
      return a = this.getElement(), a.className = a.className.replace("pace-active", ""), a.className += " pace-inactive", document.body.className = document.body.className.replace("pace-running", ""), document.body.className += " pace-done"
    }, a.prototype.update = function (a) {
      return this.progress = a, this.render()
    }, a.prototype.destroy = function () {
      try {
        this.getElement().parentNode.removeChild(this.getElement())
      } catch (a) {
        i = a
      }
      return this.el = void 0
    }, a.prototype.render = function () {
      var a, b, c, d, e, f, g;
      if (null == document.querySelector(D.target)) return !1;
      for (a = this.getElement(), d = "translate3d(" + this.progress + "%, 0, 0)", g = ["webkitTransform", "msTransform", "transform"], e = 0, f = g.length; f > e; e++) b = g[e], a.children[0].style[b] = d;
      return (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) && (a.children[0].setAttribute("data-progress-text", "" + (0 | this.progress) + "%"), this.progress >= 100 ? c = "99" : (c = this.progress < 10 ? "0" : "", c += 0 | this.progress), a.children[0].setAttribute("data-progress", "" + c)), this.lastRenderedProgress = this.progress
    }, a.prototype.done = function () {
      return this.progress >= 100
    }, a
  }(), h = function () {
    function a() {
      this.bindings = {}
    }
    return a.prototype.trigger = function (a, b) {
      var c, d, e, f, g;
      if (null != this.bindings[a]) {
        for (f = this.bindings[a], g = [], d = 0, e = f.length; e > d; d++) c = f[d], g.push(c.call(this, b));
        return g
      }
    }, a.prototype.on = function (a, b) {
      var c;
      return null == (c = this.bindings)[a] && (c[a] = []), this.bindings[a].push(b)
    }, a
  }(), P = window.XMLHttpRequest, O = window.XDomainRequest, N = window.WebSocket, w = function (a, b) {
    var c, d, e;
    e = [];
    for (d in b.prototype) try {
      e.push(null == a[d] && "function" != typeof b[d] ? "function" == typeof Object.defineProperty ? Object.defineProperty(a, d, {
        get: function () {
          return b.prototype[d]
        },
        configurable: !0,
        enumerable: !0
      }) : a[d] = b.prototype[d] : void 0)
    } catch (f) {
      c = f
    }
    return e
  }, A = [], j.ignore = function () {
    var a, b, c;
    return b = arguments[0], a = 2 <= arguments.length ? X.call(arguments, 1) : [], A.unshift("ignore"), c = b.apply(null, a), A.shift(), c
  }, j.track = function () {
    var a, b, c;
    return b = arguments[0], a = 2 <= arguments.length ? X.call(arguments, 1) : [], A.unshift("track"), c = b.apply(null, a), A.shift(), c
  }, J = function (a) {
    var b;
    if (null == a && (a = "GET"), "track" === A[0]) return "force";
    if (!A.length && D.ajax) {
      if ("socket" === a && D.ajax.trackWebSockets) return !0;
      if (b = a.toUpperCase(), $.call(D.ajax.trackMethods, b) >= 0) return !0
    }
    return !1
  }, k = function (a) {
    function b() {
      var a, c = this;
      b.__super__.constructor.apply(this, arguments), a = function (a) {
        var b;
        return b = a.open, a.open = function (d, e) {
          return J(d) && c.trigger("request", {
            type: d,
            url: e,
            request: a
          }), b.apply(a, arguments)
        }
      }, window.XMLHttpRequest = function (b) {
        var c;
        return c = new P(b), a(c), c
      };
      try {
        w(window.XMLHttpRequest, P)
      } catch (d) {}
      if (null != O) {
        window.XDomainRequest = function () {
          var b;
          return b = new O, a(b), b
        };
        try {
          w(window.XDomainRequest, O)
        } catch (d) {}
      }
      if (null != N && D.ajax.trackWebSockets) {
        window.WebSocket = function (a, b) {
          var d;
          return d = null != b ? new N(a, b) : new N(a), J("socket") && c.trigger("request", {
            type: "socket",
            url: a,
            protocols: b,
            request: d
          }), d
        };
        try {
          w(window.WebSocket, N)
        } catch (d) {}
      }
    }
    return Z(b, a), b
  }(h), R = null, y = function () {
    return null == R && (R = new k), R
  }, I = function (a) {
    var b, c, d, e;
    for (e = D.ajax.ignoreURLs, c = 0, d = e.length; d > c; c++)
      if (b = e[c], "string" == typeof b) {
        if (-1 !== a.indexOf(b)) return !0
      } else if (b.test(a)) return !0;
    return !1
  }, y().on("request", function (b) {
    var c, d, e, f, g;
    return f = b.type, e = b.request, g = b.url, I(g) ? void 0 : j.running || D.restartOnRequestAfter === !1 && "force" !== J(f) ? void 0 : (d = arguments, c = D.restartOnRequestAfter || 0, "boolean" == typeof c && (c = 0), setTimeout(function () {
      var b, c, g, h, i, k;
      if (b = "socket" === f ? e.readyState < 2 : 0 < (h = e.readyState) && 4 > h) {
        for (j.restart(), i = j.sources, k = [], c = 0, g = i.length; g > c; c++) {
          if (K = i[c], K instanceof a) {
            K.watch.apply(K, d);
            break
          }
          k.push(void 0)
        }
        return k
      }
    }, c))
  }), a = function () {
    function a() {
      var a = this;
      this.elements = [], y().on("request", function () {
        return a.watch.apply(a, arguments)
      })
    }
    return a.prototype.watch = function (a) {
      var b, c, d, e;
      return d = a.type, b = a.request, e = a.url, I(e) ? void 0 : (c = "socket" === d ? new n(b) : new o(b), this.elements.push(c))
    }, a
  }(), o = function () {
    function a(a) {
      var b, c, d, e, f, g, h = this;
      if (this.progress = 0, null != window.ProgressEvent)
        for (c = null, a.addEventListener("progress", function (a) {
            return h.progress = a.lengthComputable ? 100 * a.loaded / a.total : h.progress + (100 - h.progress) / 2
          }, !1), g = ["load", "abort", "timeout", "error"], d = 0, e = g.length; e > d; d++) b = g[d], a.addEventListener(b, function () {
          return h.progress = 100
        }, !1);
      else f = a.onreadystatechange, a.onreadystatechange = function () {
        var b;
        return 0 === (b = a.readyState) || 4 === b ? h.progress = 100 : 3 === a.readyState && (h.progress = 50), "function" == typeof f ? f.apply(null, arguments) : void 0
      }
    }
    return a
  }(), n = function () {
    function a(a) {
      var b, c, d, e, f = this;
      for (this.progress = 0, e = ["error", "open"], c = 0, d = e.length; d > c; c++) b = e[c], a.addEventListener(b, function () {
        return f.progress = 100
      }, !1)
    }
    return a
  }(), d = function () {
    function a(a) {
      var b, c, d, f;
      for (null == a && (a = {}), this.elements = [], null == a.selectors && (a.selectors = []), f = a.selectors, c = 0, d = f.length; d > c; c++) b = f[c], this.elements.push(new e(b))
    }
    return a
  }(), e = function () {
    function a(a) {
      this.selector = a, this.progress = 0, this.check()
    }
    return a.prototype.check = function () {
      var a = this;
      return document.querySelector(this.selector) ? this.done() : setTimeout(function () {
        return a.check()
      }, D.elements.checkInterval)
    }, a.prototype.done = function () {
      return this.progress = 100
    }, a
  }(), c = function () {
    function a() {
      var a, b, c = this;
      this.progress = null != (b = this.states[document.readyState]) ? b : 100, a = document.onreadystatechange, document.onreadystatechange = function () {
        return null != c.states[document.readyState] && (c.progress = c.states[document.readyState]), "function" == typeof a ? a.apply(null, arguments) : void 0
      }
    }
    return a.prototype.states = {
      loading: 0,
      interactive: 50,
      complete: 100
    }, a
  }(), f = function () {
    function a() {
      var a, b, c, d, e, f = this;
      this.progress = 0, a = 0, e = [], d = 0, c = C(), b = setInterval(function () {
        var g;
        return g = C() - c - 50, c = C(), e.push(g), e.length > D.eventLag.sampleCount && e.shift(), a = q(e), ++d >= D.eventLag.minSamples && a < D.eventLag.lagThreshold ? (f.progress = 100, clearInterval(b)) : f.progress = 100 * (3 / (a + 3))
      }, 50)
    }
    return a
  }(), m = function () {
    function a(a) {
      this.source = a, this.last = this.sinceLastUpdate = 0, this.rate = D.initialRate, this.catchup = 0, this.progress = this.lastProgress = 0, null != this.source && (this.progress = F(this.source, "progress"))
    }
    return a.prototype.tick = function (a, b) {
      var c;
      return null == b && (b = F(this.source, "progress")), b >= 100 && (this.done = !0), b === this.last ? this.sinceLastUpdate += a : (this.sinceLastUpdate && (this.rate = (b - this.last) / this.sinceLastUpdate), this.catchup = (b - this.progress) / D.catchupTime, this.sinceLastUpdate = 0, this.last = b), b > this.progress && (this.progress += this.catchup * a), c = 1 - Math.pow(this.progress / 100, D.easeFactor), this.progress += c * this.rate * a, this.progress = Math.min(this.lastProgress + D.maxProgressPerFrame, this.progress), this.progress = Math.max(0, this.progress), this.progress = Math.min(100, this.progress), this.lastProgress = this.progress, this.progress
    }, a
  }(), L = null, H = null, r = null, M = null, p = null, s = null, j.running = !1, z = function () {
    return D.restartOnPushState ? j.restart() : void 0
  }, null != window.history.pushState && (T = window.history.pushState, window.history.pushState = function () {
    return z(), T.apply(window.history, arguments)
  }), null != window.history.replaceState && (W = window.history.replaceState, window.history.replaceState = function () {
    return z(), W.apply(window.history, arguments)
  }), l = {
    ajax: a,
    elements: d,
    document: c,
    eventLag: f
  }, (B = function () {
    var a, c, d, e, f, g, h, i;
    for (j.sources = L = [], g = ["ajax", "elements", "document", "eventLag"], c = 0, e = g.length; e > c; c++) a = g[c], D[a] !== !1 && L.push(new l[a](D[a]));
    for (i = null != (h = D.extraSources) ? h : [], d = 0, f = i.length; f > d; d++) K = i[d], L.push(new K(D));
    return j.bar = r = new b, H = [], M = new m
  })(), j.stop = function () {
    return j.trigger("stop"), j.running = !1, r.destroy(), s = !0, null != p && ("function" == typeof t && t(p), p = null), B()
  }, j.restart = function () {
    return j.trigger("restart"), j.stop(), j.start()
  }, j.go = function () {
    var a;
    return j.running = !0, r.render(), a = C(), s = !1, p = G(function (b, c) {
      var d, e, f, g, h, i, k, l, n, o, p, q, t, u, v, w;
      for (l = 100 - r.progress, e = p = 0, f = !0, i = q = 0, u = L.length; u > q; i = ++q)
        for (K = L[i], o = null != H[i] ? H[i] : H[i] = [], h = null != (w = K.elements) ? w : [K], k = t = 0, v = h.length; v > t; k = ++t) g = h[k], n = null != o[k] ? o[k] : o[k] = new m(g), f &= n.done, n.done || (e++, p += n.tick(b));
      return d = p / e, r.update(M.tick(b, d)), r.done() || f || s ? (r.update(100), j.trigger("done"), setTimeout(function () {
        return r.finish(), j.running = !1, j.trigger("hide")
      }, Math.max(D.ghostTime, Math.max(D.minTime - (C() - a), 0)))) : c()
    })
  }, j.start = function (a) {
    v(D, a), j.running = !0;
    try {
      r.render()
    } catch (b) {
      i = b
    }
    return document.querySelector(".pace") ? (j.trigger("start"), j.go()) : setTimeout(j.start, 50)
  }, "function" == typeof define && define.amd ? define(["pace"], function () {
    return j
  }) : "object" == typeof exports ? module.exports = j : D.startOnPageLoad && j.start()
}).call(this); /*!echo.js v1.7.0 | (c) 2015 @toddmotto | https://github.com/toddmotto/echo*/
! function (t, e) {
  "function" == typeof define && define.amd ? define(function () {
    return e(t)
  }) : "object" == typeof exports ? module.exports = e : t.echo = e(t)
}(this, function (t) {
  "use strict";
  var e, n, o, r, c, a = {},
    u = function () {},
    d = function (t) {
      return null === t.offsetParent
    },
    i = function (t, e) {
      if (d(t)) return !1;
      var n = t.getBoundingClientRect();
      return n.right >= e.l && n.bottom >= e.t && n.left <= e.r && n.top <= e.b
    },
    l = function () {
      (r || !n) && (clearTimeout(n), n = setTimeout(function () {
        a.render(), n = null
      }, o))
    };
  return a.init = function (n) {
    n = n || {};
    var d = n.offset || 0,
      i = n.offsetVertical || d,
      f = n.offsetHorizontal || d,
      s = function (t, e) {
        return parseInt(t || e, 10)
      };
    e = {
      t: s(n.offsetTop, i),
      b: s(n.offsetBottom, i),
      l: s(n.offsetLeft, f),
      r: s(n.offsetRight, f)
    }, o = s(n.throttle, 250), r = n.debounce !== !1, c = !!n.unload, u = n.callback || u, a.render(), document.addEventListener ? (t.addEventListener("scroll", l, !1), t.addEventListener("load", l, !1)) : (t.attachEvent("onscroll", l), t.attachEvent("onload", l))
  }, a.render = function () {
    for (var n, o, r = document.querySelectorAll("img[data-echo], [data-echo-background]"), d = r.length, l = {
        l: 0 - e.l,
        t: 0 - e.t,
        b: (t.innerHeight || document.documentElement.clientHeight) + e.b,
        r: (t.innerWidth || document.documentElement.clientWidth) + e.r
      }, f = 0; d > f; f++) o = r[f], i(o, l) ? (c && o.setAttribute("data-echo-placeholder", o.src), null !== o.getAttribute("data-echo-background") ? o.style.backgroundImage = "url(" + o.getAttribute("data-echo-background") + ")" : o.src = o.getAttribute("data-echo"), c || (o.removeAttribute("data-echo"), o.removeAttribute("data-echo-background")), u(o, "load")) : c && (n = o.getAttribute("data-echo-placeholder")) && (null !== o.getAttribute("data-echo-background") ? o.style.backgroundImage = "url(" + n + ")" : o.src = n, o.removeAttribute("data-echo-placeholder"), u(o, "unload"));
    d || a.detach()
  }, a.detach = function () {
    document.removeEventListener ? t.removeEventListener("scroll", l) : t.detachEvent("onscroll", l), clearTimeout(n)
  }, a
}); /*!Lazy Load 1.9.7 - MIT license - Copyright 2010-2015 Mika Tuupola*/
! function (a, b, c, d) {
  var e = a(b);
  a.fn.lazyload = function (f) {
    function g() {
      var b = 0;
      i.each(function () {
        var c = a(this);
        if (!j.skip_invisible || c.is(":visible"))
          if (a.abovethetop(this, j) || a.leftofbegin(this, j));
          else if (a.belowthefold(this, j) || a.rightoffold(this, j)) {
          if (++b > j.failure_limit) return !1
        } else c.trigger("appear"), b = 0
      })
    }
    var h, i = this,
      j = {
        threshold: 0,
        failure_limit: 0,
        event: "scroll",
        effect: "show",
        container: b,
        data_attribute: "original",
        skip_invisible: !1,
        appear: null,
        load: null,
        placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
      };
    return f && (d !== f.failurelimit && (f.failure_limit = f.failurelimit, delete f.failurelimit), d !== f.effectspeed && (f.effect_speed = f.effectspeed, delete f.effectspeed), a.extend(j, f)), h = j.container === d || j.container === b ? e : a(j.container), 0 === j.event.indexOf("scroll") && h.bind(j.event, function () {
      return g()
    }), this.each(function () {
      var b = this,
        c = a(b);
      b.loaded = !1, (c.attr("src") === d || c.attr("src") === !1) && c.is("img") && c.attr("src", j.placeholder), c.one("appear", function () {
        if (!this.loaded) {
          if (j.appear) {
            var d = i.length;
            j.appear.call(b, d, j)
          }
          a("<img />").bind("load", function () {
            var d = c.attr("data-" + j.data_attribute);
            c.hide(), c.is("img") ? c.attr("src", d) : c.css("background-image", "url('" + d + "')"), c[j.effect](j.effect_speed), b.loaded = !0;
            var e = a.grep(i, function (a) {
              return !a.loaded
            });
            if (i = a(e), j.load) {
              var f = i.length;
              j.load.call(b, f, j)
            }
          }).attr("src", c.attr("data-" + j.data_attribute))
        }
      }), 0 !== j.event.indexOf("scroll") && c.bind(j.event, function () {
        b.loaded || c.trigger("appear")
      })
    }), e.bind("resize", function () {
      g()
    }), /(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion) && e.bind("pageshow", function (b) {
      b.originalEvent && b.originalEvent.persisted && i.each(function () {
        a(this).trigger("appear")
      })
    }), a(c).ready(function () {
      g()
    }), this
  }, a.belowthefold = function (c, f) {
    var g;
    return g = f.container === d || f.container === b ? (b.innerHeight ? b.innerHeight : e.height()) + e.scrollTop() : a(f.container).offset().top + a(f.container).height(), g <= a(c).offset().top - f.threshold
  }, a.rightoffold = function (c, f) {
    var g;
    return g = f.container === d || f.container === b ? e.width() + e.scrollLeft() : a(f.container).offset().left + a(f.container).width(), g <= a(c).offset().left - f.threshold
  }, a.abovethetop = function (c, f) {
    var g;
    return g = f.container === d || f.container === b ? e.scrollTop() : a(f.container).offset().top, g >= a(c).offset().top + f.threshold + a(c).height()
  }, a.leftofbegin = function (c, f) {
    var g;
    return g = f.container === d || f.container === b ? e.scrollLeft() : a(f.container).offset().left, g >= a(c).offset().left + f.threshold + a(c).width()
  }, a.inviewport = function (b, c) {
    return !(a.rightoffold(b, c) || a.leftofbegin(b, c) || a.belowthefold(b, c) || a.abovethetop(b, c))
  }, a.extend(a.expr[":"], {
    "below-the-fold": function (b) {
      return a.belowthefold(b, {
        threshold: 0
      })
    },
    "above-the-top": function (b) {
      return !a.belowthefold(b, {
        threshold: 0
      })
    },
    "right-of-screen": function (b) {
      return a.rightoffold(b, {
        threshold: 0
      })
    },
    "left-of-screen": function (b) {
      return !a.rightoffold(b, {
        threshold: 0
      })
    },
    "in-viewport": function (b) {
      return a.inviewport(b, {
        threshold: 0
      })
    },
    "above-the-fold": function (b) {
      return !a.belowthefold(b, {
        threshold: 0
      })
    },
    "right-of-fold": function (b) {
      return a.rightoffold(b, {
        threshold: 0
      })
    },
    "left-of-fold": function (b) {
      return !a.rightoffold(b, {
        threshold: 0
      })
    }
  })
}(jQuery, window, document); /*!SuperSlide v2.1.1*/
! function (a) {
  a.fn.slide = function (b) {
    return a.fn.slide.defaults = {
      type: "slide",
      effect: "fade",
      autoPlay: !1,
      delayTime: 500,
      interTime: 2500,
      triggerTime: 150,
      defaultIndex: 0,
      titCell: ".hd li",
      mainCell: ".bd",
      targetCell: null,
      trigger: "mouseover",
      scroll: 1,
      vis: 1,
      titOnClassName: "active",
      autoPage: !1,
      prevCell: ".prev",
      nextCell: ".next",
      pageStateCell: ".pageState",
      opp: !1,
      pnLoop: !0,
      easing: "swing",
      startFun: null,
      endFun: null,
      switchLoad: null,
      playStateCell: ".playState",
      mouseOverStop: !0,
      defaultPlay: !0,
      returnDefault: !1
    }, this.each(function () {
      var c = a.extend({}, a.fn.slide.defaults, b),
        d = a(this),
        e = c.effect,
        f = a(c.prevCell, d),
        g = a(c.nextCell, d),
        h = a(c.pageStateCell, d),
        i = a(c.playStateCell, d),
        j = a(c.titCell, d),
        k = j.size(),
        l = a(c.mainCell, d),
        m = l.children().size(),
        n = c.switchLoad,
        o = a(c.targetCell, d),
        p = parseInt(c.defaultIndex),
        q = parseInt(c.delayTime),
        r = parseInt(c.interTime);
      parseInt(c.triggerTime);
      var Q, t = parseInt(c.scroll),
        u = parseInt(c.vis),
        v = "false" == c.autoPlay || 0 == c.autoPlay ? !1 : !0,
        w = "false" == c.opp || 0 == c.opp ? !1 : !0,
        x = "false" == c.autoPage || 0 == c.autoPage ? !1 : !0,
        y = "false" == c.pnLoop || 0 == c.pnLoop ? !1 : !0,
        z = "false" == c.mouseOverStop || 0 == c.mouseOverStop ? !1 : !0,
        A = "false" == c.defaultPlay || 0 == c.defaultPlay ? !1 : !0,
        B = "false" == c.returnDefault || 0 == c.returnDefault ? !1 : !0,
        C = 0,
        D = 0,
        E = 0,
        F = 0,
        G = c.easing,
        H = null,
        I = null,
        J = null,
        K = c.titOnClassName,
        L = j.index(d.find("." + K)),
        M = p = -1 == L ? p : L,
        N = p,
        O = p,
        P = m >= u ? 0 != m % t ? m % t : t : 0,
        R = "leftMarquee" == e || "topMarquee" == e ? !0 : !1,
        S = function () {
          a.isFunction(c.startFun) && c.startFun(p, k, d, a(c.titCell, d), l, o, f, g)
        },
        T = function () {
          a.isFunction(c.endFun) && c.endFun(p, k, d, a(c.titCell, d), l, o, f, g)
        },
        U = function () {
          j.removeClass(K), A && j.eq(N).addClass(K)
        };
      if ("menu" == c.type) return A && j.removeClass(K).eq(p).addClass(K), j.hover(function () {
        Q = a(this).find(c.targetCell);
        var b = j.index(a(this));
        I = setTimeout(function () {
          switch (p = b, j.removeClass(K).eq(p).addClass(K), S(), e) {
            case "fade":
              Q.stop(!0, !0).animate({
                opacity: "show"
              }, q, G, T);
              break;
            case "slideDown":
              Q.stop(!0, !0).animate({
                height: "show"
              }, q, G, T)
          }
        }, c.triggerTime)
      }, function () {
        switch (clearTimeout(I), e) {
          case "fade":
            Q.animate({
              opacity: "hide"
            }, q, G);
            break;
          case "slideDown":
            Q.animate({
              height: "hide"
            }, q, G)
        }
      }), B && d.hover(function () {
        clearTimeout(J)
      }, function () {
        J = setTimeout(U, q)
      }), void 0;
      if (0 == k && (k = m), R && (k = 2), x) {
        if (m >= u)
          if ("leftLoop" == e || "topLoop" == e) k = 0 != m % t ? (0 ^ m / t) + 1 : m / t;
          else {
            var V = m - u;
            k = 1 + parseInt(0 != V % t ? V / t + 1 : V / t), 0 >= k && (k = 1)
          }
        else k = 1;
        j.html("");
        var W = "";
        if (1 == c.autoPage || "true" == c.autoPage)
          for (var X = 0; k > X; X++) W += "<li>" + (X + 1) + "</li>";
        else
          for (var X = 0; k > X; X++) W += c.autoPage.replace("$", X + 1);
        j.html(W);
        var j = j.children()
      }
      if (m >= u) {
        l.children().each(function () {
          a(this).width() > E && (E = a(this).width(), D = a(this).outerWidth(!0)), a(this).height() > F && (F = a(this).height(), C = a(this).outerHeight(!0))
        });
        var Y = l.children(),
          Z = function () {
            for (var a = 0; u > a; a++) Y.eq(a).clone().addClass("clone").appendTo(l);
            for (var a = 0; P > a; a++) Y.eq(m - a - 1).clone().addClass("clone").prependTo(l)
          };
        switch (e) {
          case "fold":
            l.css({
              position: "relative",
              width: D,
              height: C
            }).children().css({
              position: "absolute",
              width: E,
              left: 0,
              top: 0,
              display: "none"
            });
            break;
          case "top":
            l.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:' + u * C + 'px"></div>').css({
              top: -(p * t) * C,
              position: "relative",
              padding: "0",
              margin: "0"
            }).children().css({
              height: F
            });
            break;
          case "left":
            l.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:' + u * D + 'px"></div>').css({
              width: m * D,
              left: -(p * t) * D,
              position: "relative",
              overflow: "hidden",
              padding: "0",
              margin: "0"
            }).children().css({
              "float": "left",
              width: E
            });
            break;
          case "leftLoop":
          case "leftMarquee":
            Z(), l.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:' + u * D + 'px"></div>').css({
              width: (m + u + P) * D,
              position: "relative",
              overflow: "hidden",
              padding: "0",
              margin: "0",
              left: -(P + p * t) * D
            }).children().css({
              "float": "left",
              width: E
            });
            break;
          case "topLoop":
          case "topMarquee":
            Z(), l.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:' + u * C + 'px"></div>').css({
              height: (m + u + P) * C,
              position: "relative",
              padding: "0",
              margin: "0",
              top: -(P + p * t) * C
            }).children().css({
              height: F
            })
        }
      }
      var $ = function (a) {
          var b = a * t;
          return a == k ? b = m : -1 == a && 0 != m % t && (b = -m % t), b
        },
        _ = function (b) {
          var c = function (c) {
            for (var d = c; u + c > d; d++) b.eq(d).find("img[" + n + "]").each(function () {
              var b = a(this);
              if (b.attr("src", b.attr(n)).removeAttr(n), l.find(".clone")[0])
                for (var c = l.children(), d = 0; d < c.size(); d++) c.eq(d).find("img[" + n + "]").each(function () {
                  a(this).attr(n) == b.attr("src") && a(this).attr("src", a(this).attr(n)).removeAttr(n)
                })
            })
          };
          switch (e) {
            case "fade":
            case "fold":
            case "top":
            case "left":
            case "slideDown":
              c(p * t);
              break;
            case "leftLoop":
            case "topLoop":
              c(P + $(O));
              break;
            case "leftMarquee":
            case "topMarquee":
              var d = "leftMarquee" == e ? l.css("left").replace("px", "") : l.css("top").replace("px", ""),
                f = "leftMarquee" == e ? D : C,
                g = P;
              if (0 != d % f) {
                var h = Math.abs(0 ^ d / f);
                g = 1 == p ? P + h : P + h - 1
              }
              c(g)
          }
        },
        ab = function (a) {
          if (!A || M != p || a || R) {
            if (R ? p >= 1 ? p = 1 : 0 >= p && (p = 0) : (O = p, p >= k ? p = 0 : 0 > p && (p = k - 1)), S(), null != n && _(l.children()), o[0] && (Q = o.eq(p), null != n && _(o), "slideDown" == e ? (o.not(Q).stop(!0, !0).slideUp(q), Q.slideDown(q, G, function () {
                l[0] || T()
              })) : (o.not(Q).stop(!0, !0).hide(), Q.animate({
                opacity: "show"
              }, q, function () {
                l[0] || T()
              }))), m >= u) switch (e) {
              case "fade":
                l.children().stop(!0, !0).eq(p).animate({
                  opacity: "show"
                }, q, G, function () {
                  T()
                }).siblings().hide();
                break;
              case "fold":
                l.children().stop(!0, !0).eq(p).animate({
                  opacity: "show"
                }, q, G, function () {
                  T()
                }).siblings().animate({
                  opacity: "hide"
                }, q, G);
                break;
              case "top":
                l.stop(!0, !1).animate({
                  top: -p * t * C
                }, q, G, function () {
                  T()
                });
                break;
              case "left":
                l.stop(!0, !1).animate({
                  left: -p * t * D
                }, q, G, function () {
                  T()
                });
                break;
              case "leftLoop":
                var b = O;
                l.stop(!0, !0).animate({
                  left: -($(O) + P) * D
                }, q, G, function () {
                  -1 >= b ? l.css("left", -(P + (k - 1) * t) * D) : b >= k && l.css("left", -P * D), T()
                });
                break;
              case "topLoop":
                var b = O;
                l.stop(!0, !0).animate({
                  top: -($(O) + P) * C
                }, q, G, function () {
                  -1 >= b ? l.css("top", -(P + (k - 1) * t) * C) : b >= k && l.css("top", -P * C), T()
                });
                break;
              case "leftMarquee":
                var c = l.css("left").replace("px", "");
                0 == p ? l.animate({
                  left: ++c
                }, 0, function () {
                  l.css("left").replace("px", "") >= 0 && l.css("left", -m * D)
                }) : l.animate({
                  left: --c
                }, 0, function () {
                  l.css("left").replace("px", "") <= -(m + P) * D && l.css("left", -P * D)
                });
                break;
              case "topMarquee":
                var d = l.css("top").replace("px", "");
                0 == p ? l.animate({
                  top: ++d
                }, 0, function () {
                  l.css("top").replace("px", "") >= 0 && l.css("top", -m * C)
                }) : l.animate({
                  top: --d
                }, 0, function () {
                  l.css("top").replace("px", "") <= -(m + P) * C && l.css("top", -P * C)
                })
            }
            j.removeClass(K).eq(p).addClass(K), M = p, y || (g.removeClass("nextStop"), f.removeClass("prevStop"), 0 == p && f.addClass("prevStop"), p == k - 1 && g.addClass("nextStop")), h.html("<span>" + (p + 1) + "</span>/" + k)
          }
        };
      A && ab(!0), B && d.hover(function () {
        clearTimeout(J)
      }, function () {
        J = setTimeout(function () {
          p = N, A ? ab() : "slideDown" == e ? Q.slideUp(q, U) : Q.animate({
            opacity: "hide"
          }, q, U), M = p
        }, 300)
      });
      var bb = function (a) {
          H = setInterval(function () {
            w ? p-- : p++, ab()
          }, a ? a : r)
        },
        cb = function (a) {
          H = setInterval(ab, a ? a : r)
        },
        db = function () {
          z || (clearInterval(H), bb())
        },
        eb = function () {
          (y || p != k - 1) && (p++, ab(), R || db())
        },
        fb = function () {
          (y || 0 != p) && (p--, ab(), R || db())
        },
        gb = function () {
          clearInterval(H), R ? cb() : bb(), i.removeClass("pauseState")
        },
        hb = function () {
          clearInterval(H), i.addClass("pauseState")
        };
      if (v ? R ? (w ? p-- : p++, cb(), z && l.hover(hb, gb)) : (bb(), z && d.hover(hb, gb)) : (R && (w ? p-- : p++), i.addClass("pauseState")), i.click(function () {
          i.hasClass("pauseState") ? gb() : hb()
        }), "mouseover" == c.trigger ? j.hover(function () {
          var a = j.index(this);
          I = setTimeout(function () {
            p = a, ab(), db()
          }, c.triggerTime)
        }, function () {
          clearTimeout(I)
        }) : j.click(function () {
          p = j.index(this), ab(), db()
        }), R) {
        if (g.mousedown(eb), f.mousedown(fb), y) {
          var ib, jb = function () {
              ib = setTimeout(function () {
                clearInterval(H), cb(0 ^ r / 10)
              }, 150)
            },
            kb = function () {
              clearTimeout(ib), clearInterval(H), cb()
            };
          g.mousedown(jb), g.mouseup(kb), f.mousedown(jb), f.mouseup(kb)
        }
        "mouseover" == c.trigger && (g.hover(eb, function () {}), f.hover(fb, function () {}))
      } else g.click(eb), f.click(fb)
    })
  }
}(jQuery), jQuery.easing.jswing = jQuery.easing.swing, jQuery.extend(jQuery.easing, {
  def: "easeOutQuad",
  swing: function (a, b, c, d, e) {
    return jQuery.easing[jQuery.easing.def](a, b, c, d, e)
  },
  easeInQuad: function (a, b, c, d, e) {
    return d * (b /= e) * b + c
  },
  easeOutQuad: function (a, b, c, d, e) {
    return -d * (b /= e) * (b - 2) + c
  },
  easeInOutQuad: function (a, b, c, d, e) {
    return (b /= e / 2) < 1 ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c
  },
  easeInCubic: function (a, b, c, d, e) {
    return d * (b /= e) * b * b + c
  },
  easeOutCubic: function (a, b, c, d, e) {
    return d * ((b = b / e - 1) * b * b + 1) + c
  },
  easeInOutCubic: function (a, b, c, d, e) {
    return (b /= e / 2) < 1 ? d / 2 * b * b * b + c : d / 2 * ((b -= 2) * b * b + 2) + c
  },
  easeInQuart: function (a, b, c, d, e) {
    return d * (b /= e) * b * b * b + c
  },
  easeOutQuart: function (a, b, c, d, e) {
    return -d * ((b = b / e - 1) * b * b * b - 1) + c
  },
  easeInOutQuart: function (a, b, c, d, e) {
    return (b /= e / 2) < 1 ? d / 2 * b * b * b * b + c : -d / 2 * ((b -= 2) * b * b * b - 2) + c
  },
  easeInQuint: function (a, b, c, d, e) {
    return d * (b /= e) * b * b * b * b + c
  },
  easeOutQuint: function (a, b, c, d, e) {
    return d * ((b = b / e - 1) * b * b * b * b + 1) + c
  },
  easeInOutQuint: function (a, b, c, d, e) {
    return (b /= e / 2) < 1 ? d / 2 * b * b * b * b * b + c : d / 2 * ((b -= 2) * b * b * b * b + 2) + c
  },
  easeInSine: function (a, b, c, d, e) {
    return -d * Math.cos(b / e * (Math.PI / 2)) + d + c
  },
  easeOutSine: function (a, b, c, d, e) {
    return d * Math.sin(b / e * (Math.PI / 2)) + c
  },
  easeInOutSine: function (a, b, c, d, e) {
    return -d / 2 * (Math.cos(Math.PI * b / e) - 1) + c
  },
  easeInExpo: function (a, b, c, d, e) {
    return 0 == b ? c : d * Math.pow(2, 10 * (b / e - 1)) + c
  },
  easeOutExpo: function (a, b, c, d, e) {
    return b == e ? c + d : d * (-Math.pow(2, -10 * b / e) + 1) + c
  },
  easeInOutExpo: function (a, b, c, d, e) {
    return 0 == b ? c : b == e ? c + d : (b /= e / 2) < 1 ? d / 2 * Math.pow(2, 10 * (b - 1)) + c : d / 2 * (-Math.pow(2, -10 * --b) + 2) + c
  },
  easeInCirc: function (a, b, c, d, e) {
    return -d * (Math.sqrt(1 - (b /= e) * b) - 1) + c
  },
  easeOutCirc: function (a, b, c, d, e) {
    return d * Math.sqrt(1 - (b = b / e - 1) * b) + c
  },
  easeInOutCirc: function (a, b, c, d, e) {
    return (b /= e / 2) < 1 ? -d / 2 * (Math.sqrt(1 - b * b) - 1) + c : d / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + c
  },
  easeInElastic: function (a, b, c, d, e) {
    var f = 1.70158,
      g = 0,
      h = d;
    if (0 == b) return c;
    if (1 == (b /= e)) return c + d;
    if (g || (g = .3 * e), h < Math.abs(d)) {
      h = d;
      var f = g / 4
    } else var f = g / (2 * Math.PI) * Math.asin(d / h);
    return -(h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g)) + c
  },
  easeOutElastic: function (a, b, c, d, e) {
    var f = 1.70158,
      g = 0,
      h = d;
    if (0 == b) return c;
    if (1 == (b /= e)) return c + d;
    if (g || (g = .3 * e), h < Math.abs(d)) {
      h = d;
      var f = g / 4
    } else var f = g / (2 * Math.PI) * Math.asin(d / h);
    return h * Math.pow(2, -10 * b) * Math.sin((b * e - f) * 2 * Math.PI / g) + d + c
  },
  easeInOutElastic: function (a, b, c, d, e) {
    var f = 1.70158,
      g = 0,
      h = d;
    if (0 == b) return c;
    if (2 == (b /= e / 2)) return c + d;
    if (g || (g = e * .3 * 1.5), h < Math.abs(d)) {
      h = d;
      var f = g / 4
    } else var f = g / (2 * Math.PI) * Math.asin(d / h);
    return 1 > b ? -.5 * h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g) + c : .5 * h * Math.pow(2, -10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g) + d + c
  },
  easeInBack: function (a, b, c, d, e, f) {
    return void 0 == f && (f = 1.70158), d * (b /= e) * b * ((f + 1) * b - f) + c
  },
  easeOutBack: function (a, b, c, d, e, f) {
    return void 0 == f && (f = 1.70158), d * ((b = b / e - 1) * b * ((f + 1) * b + f) + 1) + c
  },
  easeInOutBack: function (a, b, c, d, e, f) {
    return void 0 == f && (f = 1.70158), (b /= e / 2) < 1 ? d / 2 * b * b * (((f *= 1.525) + 1) * b - f) + c : d / 2 * ((b -= 2) * b * (((f *= 1.525) + 1) * b + f) + 2) + c
  },
  easeInBounce: function (a, b, c, d, e) {
    return d - jQuery.easing.easeOutBounce(a, e - b, 0, d, e) + c
  },
  easeOutBounce: function (a, b, c, d, e) {
    return (b /= e) < 1 / 2.75 ? d * 7.5625 * b * b + c : 2 / 2.75 > b ? d * (7.5625 * (b -= 1.5 / 2.75) * b + .75) + c : 2.5 / 2.75 > b ? d * (7.5625 * (b -= 2.25 / 2.75) * b + .9375) + c : d * (7.5625 * (b -= 2.625 / 2.75) * b + .984375) + c
  },
  easeInOutBounce: function (a, b, c, d, e) {
    return e / 2 > b ? .5 * jQuery.easing.easeInBounce(a, 2 * b, 0, d, e) + c : .5 * jQuery.easing.easeOutBounce(a, 2 * b - e, 0, d, e) + .5 * d + c
  }
}); /*!HC-Sticky*/
! function (t, e) {
  "use strict";
  if ("object" == typeof module && "object" == typeof module.exports) {
    if (!t.document) throw new Error("HC-Sticky requires a browser to run.");
    module.exports = e(t)
  } else "function" == typeof define && define.amd ? define("hcSticky", [], e(t)) : e(t)
}("undefined" != typeof window ? window : this, function (t) {
  "use strict";
  var e = {
      top: 0,
      bottom: 0,
      bottomEnd: 0,
      innerTop: 0,
      innerSticker: null,
      stickyClass: "sticky",
      stickTo: null,
      followScroll: !0,
      queries: null,
      queryFlow: "down",
      onStart: null,
      onStop: null,
      onBeforeResize: null,
      onResize: null,
      resizeDebounce: 100,
      disable: !1
    },
    o = t.document,
    i = function (n, s) {
      if ("string" == typeof n && (n = o.querySelector(n)), !n) return !1;
      var r = {},
        l = i.Helpers,
        a = n.parentNode;
      "static" === l.getStyle(a, "position") && (a.style.position = "relative");
      var c = function () {
          var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          l.isEmptyObject(t) && r || (r = Object.assign({}, e, r, t))
        },
        f = function () {
          return r.disable
        },
        d = function () {
          if (r.queries) {
            var o = t.innerWidth,
              i = r.queryFlow,
              n = r.queries;
            if (function (t) {
                r = Object.assign({}, e, t || {})
              }(s), "up" === i)
              for (var a in n) o >= a && !l.isEmptyObject(n[a]) && c(n[a]);
            else {
              var f = [];
              for (var d in r.queries) {
                var u = {};
                u[d] = n[d], f.push(u)
              }
              for (var p = f.length - 1; p >= 0; p--) {
                var g = f[p],
                  m = Object.keys(g)[0];
                o <= m && !l.isEmptyObject(g[m]) && c(g[m])
              }
            }
          }
        },
        u = {
          css: {},
          position: null,
          stick: function () {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            l.hasClass(n, r.stickyClass) || (!1 === p.isAttached && p.attach(), u.position = "fixed", n.style.position = "fixed", n.style.left = p.offsetLeft + "px", n.style.width = p.width, void 0 === t.bottom ? n.style.bottom = "auto" : n.style.bottom = t.bottom + "px", void 0 === t.top ? n.style.top = "auto" : n.style.top = t.top + "px", n.classList ? n.classList.add(r.stickyClass) : n.className += " " + r.stickyClass, r.onStart && r.onStart.call(n, r))
          },
          reset: function () {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            if (t.disable = t.disable || !1, "fixed" === u.position || null === u.position || !(void 0 === t.top && void 0 === t.bottom || void 0 !== t.top && (parseInt(l.getStyle(n, "top")) || 0) === t.top || void 0 !== t.bottom && (parseInt(l.getStyle(n, "bottom")) || 0) === t.bottom)) {
              !0 === t.disable ? !0 === p.isAttached && p.detach() : !1 === p.isAttached && p.attach();
              var e = t.position || u.css.position;
              u.position = e, n.style.position = e, n.style.left = !0 === t.disable ? u.css.left : p.positionLeft + "px", n.style.width = "absolute" !== e ? u.css.width : p.width, void 0 === t.bottom ? n.style.bottom = !0 === t.disable ? "" : "auto" : n.style.bottom = t.bottom + "px", void 0 === t.top ? n.style.top = !0 === t.disable ? "" : "auto" : n.style.top = t.top + "px", n.classList ? n.classList.remove(r.stickyClass) : n.className = n.className.replace(new RegExp("(^|\\b)" + r.stickyClass.split(" ").join("|") + "(\\b|$)", "gi"), " "), r.onStop && r.onStop.call(n, r)
            }
          }
        },
        p = {
          el: o.createElement("div"),
          offsetLeft: null,
          positionLeft: null,
          width: null,
          isAttached: !1,
          init: function () {
            for (var t in u.css) p.el.style[t] = u.css[t];
            var e = l.getStyle(n);
            p.offsetLeft = l.offset(n).left - (parseInt(e.marginLeft) || 0), p.positionLeft = l.position(n).left, p.width = l.getStyle(n, "width")
          },
          attach: function () {
            a.insertBefore(p.el, n.nextSibling), p.isAttached = !0
          },
          detach: function () {
            p.el = a.removeChild(p.el), p.isAttached = !1
          }
        },
        g = void 0,
        m = void 0,
        v = void 0,
        h = void 0,
        y = void 0,
        b = void 0,
        S = void 0,
        w = void 0,
        k = void 0,
        x = void 0,
        L = void 0,
        E = void 0,
        T = void 0,
        C = void 0,
        j = void 0,
        z = void 0,
        N = void 0,
        O = void 0,
        R = function () {
          u.css = function (t) {
            var e = l.getCascadedStyle(t),
              o = l.getStyle(t),
              i = {
                height: t.offsetHeight + "px",
                left: e.left,
                right: e.right,
                top: e.top,
                bottom: e.bottom,
                position: o.position,
                display: o.display,
                verticalAlign: o.verticalAlign,
                boxSizing: o.boxSizing,
                marginLeft: e.marginLeft,
                marginRight: e.marginRight,
                marginTop: e.marginTop,
                marginBottom: e.marginBottom,
                paddingLeft: e.paddingLeft,
                paddingRight: e.paddingRight
              };
            return e.float && (i.float = e.float || "none"), e.cssFloat && (i.cssFloat = e.cssFloat || "none"), o.MozBoxSizing && (i.MozBoxSizing = o.MozBoxSizing), i.width = "auto" !== e.width ? e.width : "border-box" === i.boxSizing || "border-box" === i.MozBoxSizing ? t.offsetWidth + "px" : o.width, i
          }(n), p.init(), g = !(!r.stickTo || !("document" === r.stickTo || r.stickTo.nodeType && 9 === r.stickTo.nodeType || "object" == typeof r.stickTo && r.stickTo instanceof("undefined" != typeof HTMLDocument ? HTMLDocument : Document))), m = r.stickTo ? g ? o : "string" == typeof r.stickTo ? o.querySelector(r.stickTo) : r.stickTo : a, j = (O = function () {
            var t = n.offsetHeight + (parseInt(u.css.marginTop) || 0) + (parseInt(u.css.marginBottom) || 0),
              e = (j || 0) - t;
            return e >= -1 && e <= 1 ? j : t
          })(), h = (N = function () {
            return g ? Math.max(o.documentElement.clientHeight, o.body.scrollHeight, o.documentElement.scrollHeight, o.body.offsetHeight, o.documentElement.offsetHeight) : m.offsetHeight
          })(), y = g ? 0 : l.offset(m).top, b = r.stickTo ? g ? 0 : l.offset(a).top : y, S = t.innerHeight, z = n.offsetTop - (parseInt(u.css.marginTop) || 0), v = r.innerSticker ? "string" == typeof r.innerSticker ? o.querySelector(r.innerSticker) : r.innerSticker : null, w = isNaN(r.top) && r.top.indexOf("%") > -1 ? parseFloat(r.top) / 100 * S : r.top, k = isNaN(r.bottom) && r.bottom.indexOf("%") > -1 ? parseFloat(r.bottom) / 100 * S : r.bottom, x = v ? v.offsetTop : r.innerTop ? r.innerTop : 0, L = isNaN(r.bottomEnd) && r.bottomEnd.indexOf("%") > -1 ? parseFloat(r.bottomEnd) / 100 * S : r.bottomEnd, E = y - w + x + z
        },
        H = t.pageYOffset || o.documentElement.scrollTop,
        B = 0,
        I = void 0,
        q = function () {
          j = O(), h = N(), T = y + h - w - L, C = j > S;
          var e = t.pageYOffset || o.documentElement.scrollTop,
            i = l.offset(n).top,
            s = i - e,
            c = void 0;
          I = e < H ? "up" : "down", B = e - H, H = e, e > E ? T + w + (C ? k : 0) - (r.followScroll && C ? 0 : w) <= e + j - x - (j - x > S - (E - x) && r.followScroll && (c = j - S - x) > 0 ? c : 0) ? u.reset({
            position: "absolute",
            bottom: b + a.offsetHeight - T - w
          }) : C && r.followScroll ? "down" === I ? s + j + k <= S ? u.stick({
            bottom: k
          }) : "fixed" === u.position && u.reset({
            position: "absolute",
            top: i - w - E - B + x
          }) : s + x < 0 && "fixed" === u.position ? u.reset({
            position: "absolute",
            top: i - w - E + x - B
          }) : i >= e + w - x && u.stick({
            top: w - x
          }) : u.stick({
            top: w - x
          }) : u.reset({
            disable: !0
          })
        },
        A = !1,
        F = !1,
        M = function () {
          A && (l.event.unbind(t, "scroll", q), A = !1)
        },
        D = function () {
          R(), j >= h ? M() : (q(), A || (l.event.bind(t, "scroll", q), A = !0))
        },
        W = function () {
          n.style.position = "", n.style.left = "", n.style.top = "", n.style.bottom = "", n.style.width = "", n.classList ? n.classList.remove(r.stickyClass) : n.className = n.className.replace(new RegExp("(^|\\b)" + r.stickyClass.split(" ").join("|") + "(\\b|$)", "gi"), " "), u.css = {}, u.position = null, !0 === p.isAttached && p.detach()
        },
        P = function () {
          W(), d(), f() ? M() : D()
        },
        V = function () {
          r.onBeforeResize && r.onBeforeResize.call(n, r), P(), r.onResize && r.onResize.call(n, r)
        },
        Y = r.resizeDebounce ? l.debounce(V, r.resizeDebounce) : V,
        $ = function () {
          F && (l.event.unbind(t, "resize", Y), F = !1), M()
        },
        Q = function () {
          F || (l.event.bind(t, "resize", Y), F = !0), d(), f() ? M() : D()
        };
      this.options = function (t) {
        return t ? r.option || null : Object.assign({}, r)
      }, this.reinit = P, this.update = function (t) {
        c(t), P()
      }, this.attach = Q, this.detach = $, this.destroy = function () {
        $(), W()
      }, c(s), Q(), l.event.bind(t, "load", P)
    };
  if (void 0 !== t.jQuery) {
    var n = t.jQuery;
    n.fn.extend({
      hcSticky: function (t) {
        return this.length ? this.each(function () {
          var e = n.data(this, "hcSticky");
          e ? e.update(t) : (e = new i(this, t), n.data(this, "hcSticky", e))
        }) : this
      }
    })
  }
  return t.hcSticky = t.hcSticky || i, i
}),
function (t) {
  "use strict";
  var e = t.hcSticky,
    o = t.document;
  "function" != typeof Object.assign && Object.defineProperty(Object, "assign", {
    value: function (t, e) {
      if (null == t) throw new TypeError("Cannot convert undefined or null to object");
      for (var o = Object(t), i = 1; i < arguments.length; i++) {
        var n = arguments[i];
        if (null != n)
          for (var s in n) Object.prototype.hasOwnProperty.call(n, s) && (o[s] = n[s])
      }
      return o
    },
    writable: !0,
    configurable: !0
  });
  var i = function () {
      function e(e) {
        var o = t.event;
        return o.target = o.target || o.srcElement || e, o
      }
      var i = o.documentElement,
        n = function () {};
      i.addEventListener ? n = function (t, e, o) {
        t.addEventListener(e, o, !1)
      } : i.attachEvent && (n = function (t, o, i) {
        t[o + i] = i.handleEvent ? function () {
          var o = e(t);
          i.handleEvent.call(i, o)
        } : function () {
          var o = e(t);
          i.call(t, o)
        }, t.attachEvent("on" + o, t[o + i])
      });
      var s = function () {};
      return i.removeEventListener ? s = function (t, e, o) {
        t.removeEventListener(e, o, !1)
      } : i.detachEvent && (s = function (t, e, o) {
        t.detachEvent("on" + e, t[e + o]);
        try {
          delete t[e + o]
        } catch (i) {
          t[e + o] = void 0
        }
      }), {
        bind: n,
        unbind: s
      }
    }(),
    n = function (e, i) {
      return t.getComputedStyle ? i ? o.defaultView.getComputedStyle(e, null).getPropertyValue(i) : o.defaultView.getComputedStyle(e, null) : e.currentStyle ? i ? e.currentStyle[i.replace(/-\w/g, function (t) {
        return t.toUpperCase().replace("-", "")
      })] : e.currentStyle : void 0
    },
    s = function (e) {
      var i = e.getBoundingClientRect(),
        n = t.pageYOffset || o.documentElement.scrollTop,
        s = t.pageXOffset || o.documentElement.scrollLeft;
      return {
        top: i.top + n,
        left: i.left + s
      }
    };
  e.Helpers = {
    isEmptyObject: function (t) {
      for (var e in t) return !1;
      return !0
    },
    debounce: function (t, e, o) {
      var i = void 0;
      return function () {
        var n = this,
          s = arguments,
          r = o && !i;
        clearTimeout(i), i = setTimeout(function () {
          i = null, o || t.apply(n, s)
        }, e), r && t.apply(n, s)
      }
    },
    hasClass: function (t, e) {
      return t.classList ? t.classList.contains(e) : new RegExp("(^| )" + e + "( |$)", "gi").test(t.className)
    },
    offset: s,
    position: function (t) {
      var e = t.offsetParent,
        o = s(e),
        i = s(t),
        r = n(e),
        l = n(t);
      return o.top += parseInt(r.borderTopWidth) || 0, o.left += parseInt(r.borderLeftWidth) || 0, {
        top: i.top - o.top - (parseInt(l.marginTop) || 0),
        left: i.left - o.left - (parseInt(l.marginLeft) || 0)
      }
    },
    getStyle: n,
    getCascadedStyle: function (e) {
      var i = e.cloneNode(!0);
      i.style.display = "none", e.parentNode.insertBefore(i, e.nextSibling);
      var n = void 0;
      i.currentStyle ? n = i.currentStyle : t.getComputedStyle && (n = o.defaultView.getComputedStyle(i, null));
      var s = {};
      for (var r in n) !isNaN(r) || "string" != typeof n[r] && "number" != typeof n[r] || (s[r] = n[r]);
      if (Object.keys(s).length < 3) {
        s = {};
        for (var l in n) isNaN(l) || (s[n[l].replace(/-\w/g, function (t) {
          return t.toUpperCase().replace("-", "")
        })] = n.getPropertyValue(n[l]))
      }
      if (s.margin || "auto" !== s.marginLeft ? s.margin || s.marginLeft !== s.marginRight || s.marginLeft !== s.marginTop || s.marginLeft !== s.marginBottom || (s.margin = s.marginLeft) : s.margin = "auto", !s.margin && "0px" === s.marginLeft && "0px" === s.marginRight) {
        var a = e.offsetLeft - e.parentNode.offsetLeft,
          c = a - (parseInt(s.left) || 0) - (parseInt(s.right) || 0),
          f = e.parentNode.offsetWidth - e.offsetWidth - a - (parseInt(s.right) || 0) + (parseInt(s.left) || 0) - c;
        0 !== f && 1 !== f || (s.margin = "auto")
      }
      return i.parentNode.removeChild(i), i = null, s
    },
    event: i
  }
}(window); /*!滚动条*/
(function (win, dom) {
  function MyScrollBar(o) {
    this.init(o)
  };
  MyScrollBar.prototype.init = function (o) {
    this.bXBar = false;
    this.bYBar = false;
    this.iScrollTop = 0;
    this.iScrollLeft = 0;
    this.bYShow = false;
    this.bXShow = false;
    this.oWrapper = dom.getElementById(o.selId);
    this.oScroll = this.oWrapper.firstElementChild;
    this.setParam(o);
    this.addScrollBar();
    this.initState();
    this.initEvent()
  };
  MyScrollBar.prototype.initState = function () {
    var sWPosition = getStyle(this.oWrapper, 'position');
    if (sWPosition == 'static') {
      setStyle(this.oWrapper, {
        position: 'relative'
      })
    };
    setStyle(this.oScroll, {
      position: 'relative'
    });
    if (this.bYBar) {
      setStyle(this.oYBox, {
        display: this.enterShow ? 'none' : 'block',
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 10,
        width: this.width + 'px',
        height: '100%',
        backgroundColor: this.bgColor
      });
      setStyle(this.oYBar, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: this.barColor,
        borderRadius: this.borderRadius + 'px'
      })
    };
    if (this.bXBar) {
      setStyle(this.oXBox, {
        display: this.enterShow ? 'none' : 'block',
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 10,
        height: this.width + 'px',
        width: '100%',
        backgroundColor: this.bgColor
      });
      setStyle(this.oXBar, {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '100%',
        backgroundColor: this.barColor,
        borderRadius: this.borderRadius + 'px'
      })
    };
    this.setSize()
  };
  MyScrollBar.prototype.initEvent = function () {
    var _this = this;
    var sUserAgent = win.navigator.userAgent.toLowerCase();
    if (sUserAgent.indexOf('firefox') != -1) {
      this.oWrapper.addEventListener('DOMMouseScroll', function (e) {
        if (_this.bYBar && _this.bYShow) {
          e.preventDefault();
          _this.iScrollTop += e.detail > 0 ? 60 : -60;
          _this.iScrollTop = _this.iScrollTop <= 0 ? 0 : _this.iScrollTop >= _this.iScrollH - _this.iWrapperH ? _this.iScrollH - _this.iWrapperH : _this.iScrollTop;
          _this.setTransLate();
          _this.setYTop(_this.iScrollTop / _this.iScrollH * _this.iYBoxH)
        }
      })
    } else {
      this.oWrapper.onmousewheel = function (evt) {
        if (_this.bYBar && _this.bYShow) {
          var e = evt || win.event;
          evt ? e.preventDefault() : e.returnValue = false;
          _this.iScrollTop += e.wheelDelta < 0 ? 60 : -60;
          _this.iScrollTop = _this.iScrollTop <= 0 ? 0 : _this.iScrollTop >= _this.iScrollH - _this.iWrapperH ? _this.iScrollH - _this.iWrapperH : _this.iScrollTop;
          _this.setTransLate();
          _this.setYTop(_this.iScrollTop / _this.iScrollH * _this.iYBoxH)
        }
      }
    };
    var isInWrapper = false;
    this.oWrapper.onmouseenter = function () {
      isInWrapper = true;
      if (_this.enterShow) {
        if (_this.bYBar && _this.bYShow) {
          setStyle(_this.oYBox, {
            display: 'block'
          })
        }
        if (_this.bXBar && _this.bXShow) {
          setStyle(_this.oXBox, {
            display: 'block'
          })
        }
      }
    };
    this.oWrapper.onmouseleave = function () {
      isInWrapper = false;
      if (_this.enterShow) {
        if (_this.bYBar && !bYDown && _this.bYShow) {
          setStyle(_this.oYBox, {
            display: 'none'
          })
        }
        if (_this.bXBar && !bXDown && _this.bXShow) {
          setStyle(_this.oXBox, {
            display: 'none'
          })
        }
      }
    };
    var bYDown = false,
      bXDown = false;
    var bYLeave = true,
      bXLeave = true;
    var iDownPageY = 0,
      iDownPageX = 0;
    var iYBarTop = 0,
      iXBarLeft = 0;
    if (this.bYBar) {
      if (this.enterColor) {
        this.oYBar.onmouseenter = function () {
          bYLeave = false;
          setStyle(this, {
            backgroundColor: _this.enterColor
          })
        };
        this.oYBar.onmouseleave = function () {
          bYLeave = true;
          if (!bYDown) {
            setStyle(this, {
              backgroundColor: _this.barColor
            })
          }
        }
      };
      this.oYBar.onmousedown = function (e) {
        if (_this.bYShow) {
          bYDown = true;
          iDownPageY = e.clientY + dom.documentElement.scrollTop || dom.body.scrollTop;
          iYBarTop = parseInt(getStyle(this, 'top'));
          canSelectText(false)
        }
      };
      dom.addEventListener('mouseup', function () {
        if (bYDown && _this.bYShow) {
          bYDown = false;
          canSelectText(true);
          if (!isInWrapper && _this.enterShow) {
            setStyle(_this.oYBox, {
              display: 'none'
            })
          }
        }
        if (!bYDown && bYLeave) {
          setStyle(_this.oYBar, {
            backgroundColor: _this.barColor
          })
        }
      });
      dom.addEventListener('mousemove', function (e) {
        if (bYDown && _this.bYShow) {
          var iNowPageY = e.clientY + dom.documentElement.scrollTop || dom.body.scrollTop;
          var iNowTop = iYBarTop + iNowPageY - iDownPageY;
          iNowTop = iNowTop <= 0 ? 0 : iNowTop >= _this.iYBoxH - _this.iYBarH ? _this.iYBoxH - _this.iYBarH : iNowTop;
          _this.iScrollTop = iNowTop / _this.iYBoxH * _this.iScrollH;
          _this.setTransLate();
          _this.setYTop(iNowTop)
        }
      });
      this.oYBar.ondrag = function (e) {
        var e = evt || win.event;
        evt ? e.preventDefault() : e.returnValue = false
      }
    };
    if (this.bXBar) {
      if (this.enterColor) {
        this.oXBar.onmouseenter = function () {
          bXLeave = false;
          setStyle(this, {
            backgroundColor: _this.enterColor
          })
        };
        this.oXBar.onmouseleave = function () {
          bXLeave = true;
          if (!bXDown) {
            setStyle(this, {
              backgroundColor: _this.barColor
            })
          }
        }
      };
      this.oXBar.onmousedown = function (e) {
        if (_this.bXShow) {
          bXDown = true;
          iDownPageX = e.clientX + dom.documentElement.scrollLeft || dom.body.scrollLeft;
          iXBarLeft = parseInt(getStyle(this, 'left'));
          canSelectText(false)
        }
      };
      dom.addEventListener('mouseup', function () {
        if (bXDown && _this.bXShow) {
          bXDown = false;
          canSelectText(true);
          if (!isInWrapper && _this.enterShow) {
            setStyle(_this.oXBox, {
              display: 'none'
            })
          }
        }
        if (!bXDown && bXLeave) {
          setStyle(_this.oXBar, {
            backgroundColor: _this.barColor
          })
        }
      });
      dom.addEventListener('mousemove', function (e) {
        if (bXDown && _this.bXShow) {
          var iNowPageX = e.clientX + dom.documentElement.scrollLeft || dom.body.scrollLeft;
          var iNowLeft = iXBarLeft + iNowPageX - iDownPageX;
          iNowLeft = iNowLeft <= 0 ? 0 : iNowLeft >= _this.iXBoxW - _this.iXBarW ? _this.iXBoxW - _this.iXBarW : iNowLeft;
          _this.iScrollLeft = iNowLeft / _this.iXBoxW * _this.iScrollW;
          _this.setTransLate();
          _this.setXLeft(iNowLeft)
        }
      });
      this.oXBar.ondrag = function (e) {
        var e = evt || win.event;
        evt ? e.preventDefault() : e.returnValue = false
      }
    }
  };
  MyScrollBar.prototype.setParam = function (o) {
    this.width = o.width ? o.width : 10;
    this.bgColor = o.bgColor ? o.bgColor : '#eaeaea';
    this.barColor = o.barColor ? o.barColor : '#ccc';
    this.enterColor = o.enterColor || false;
    this.enterShow = o.enterShow === false ? false : true;
    this.hasY = o.hasY === false ? false : true;
    this.hasX = o.hasX === true ? true : false;
    this.borderRadius = o.borderRadius >= 0 ? o.borderRadius : this.width / 2
  };
  MyScrollBar.prototype.addScrollBar = function () {
    this.getSize();
    if (this.iWrapperW <= this.iScrollW && this.hasX) {
      this.bXBar = true;
      this.oXBox = dom.createElement('div');
      this.oXBar = dom.createElement('div');
      this.oXBox.appendChild(this.oXBar);
      this.oWrapper.insertBefore(this.oXBox, this.oScroll)
    };
    if (this.iWrapperH <= this.iScrollH && this.hasY) {
      this.bYBar = true;
      this.oYBox = dom.createElement('div');
      this.oYBar = dom.createElement('div');
      this.oYBox.appendChild(this.oYBar);
      this.oWrapper.insertBefore(this.oYBox, this.oScroll)
    }
  };
  MyScrollBar.prototype.getSize = function () {
    var oWrapperSize = getClientSize(this.oWrapper);
    var oScrollSize = getClientSize(this.oScroll);
    this.iWrapperClientW = oWrapperSize.width;
    this.iWrapperClientH = oWrapperSize.height;
    this.iPaddingT = parseInt(getStyle(this.oWrapper, 'paddingTop'));
    this.iPaddingR = parseInt(getStyle(this.oWrapper, 'paddingRight'));
    this.iPaddingB = parseInt(getStyle(this.oWrapper, 'paddingBottom'));
    this.iPaddingL = parseInt(getStyle(this.oWrapper, 'paddingLeft'));
    this.iWrapperW = oWrapperSize.width - this.iPaddingR - this.iPaddingL;
    this.iWrapperH = oWrapperSize.height - this.iPaddingT - this.iPaddingB;
    this.iScrollW = oScrollSize.width;
    this.iScrollH = oScrollSize.height;
    if (this.bYBar) {
      this.iYBoxH = oWrapperSize.height;
      this.iYBarH = this.iWrapperH / this.iScrollH * this.iYBoxH
    };
    if (this.bXBar) {
      this.iXBoxW = oWrapperSize.width;
      this.iXBarW = this.iWrapperW / this.iScrollW * this.iXBoxW
    }
  };
  MyScrollBar.prototype.setSize = function () {
    this.getSize();
    if (this.bYBar) {
      if (this.iWrapperH >= this.iScrollH) {
        setStyle(this.oYBox, {
          display: 'none'
        });
        this.bYShow = false
      } else {
        if (!this.enterShow) {
          setStyle(this.oYBox, {
            display: 'block'
          })
        };
        setStyle(this.oYBar, {
          height: this.iYBarH + 'px',
          top: 0
        });
        this.bYShow = true
      }
    };
    if (this.bXBar) {
      if (this.iWrapperW >= this.iScrollW) {
        setStyle(this.oXBox, {
          display: 'none'
        });
        this.bXShow = false
      } else {
        if (!this.enterShow) {
          setStyle(this.oXBox, {
            display: 'block'
          })
        };
        setStyle(this.oXBar, {
          width: this.iXBarW + 'px',
          left: 0
        });
        this.bXShow = true
      }
    };
    this.iScrollTop = 0;
    this.iScrollLeft = 0;
    this.setTransLate()
  };
  MyScrollBar.prototype.setTransLate = function (iTime) {
    var sTranslate = 'translate(-' + this.iScrollLeft + 'px, -' + this.iScrollTop + 'px)';
    setStyle(this.oScroll, {
      transition: iTime >= 0 ? iTime + 'ms ease-in-out' : 0 + 'ms',
      transform: sTranslate,
      msTransform: sTranslate,
      mozTransform: sTranslate,
      webkitTransform: sTranslate,
      oTransform: sTranslate
    })
  };
  MyScrollBar.prototype.setYTop = function (iTop, iTime) {
    setStyle(this.oYBar, {
      transition: iTime >= 0 ? iTime + 'ms ease-in-out' : 0 + 'ms',
      top: iTop + 'px'
    })
  };
  MyScrollBar.prototype.setXLeft = function (iLeft, iTime) {
    setStyle(this.oXBar, {
      transition: iTime >= 0 ? iTime + 'ms ease-in-out' : 0 + 'ms',
      left: iLeft + 'px'
    })
  };
  MyScrollBar.prototype.jump = function (o) {
    var oPos = {
      top: 0,
      left: 0
    };
    var iTop = 0;
    var iBottome = this.iScrollH - this.iWrapperClientH + this.iPaddingT + this.iPaddingB > 0 ? this.iScrollH - this.iWrapperClientH + this.iPaddingT + this.iPaddingB : 0;
    var iLeft = 0;
    var iRight = this.iScrollW - this.iWrapperClientW + this.iPaddingL + this.iPaddingR > 0 ? this.iScrollW - this.iWrapperClientW + this.iPaddingL + this.iPaddingR : 0;
    if (o.id) {
      var obj = document.getElementById(o.id);
      oPos = getPosition(obj, this.oScroll);
      if (this.bYBar) {
        oPos.top += this.iPaddingT
      }
      if (this.bXBar) {
        oPos.left += this.iPaddingL
      }
    } else if (o.pos) {
      if (typeof o.pos == 'string') {
        switch (o.pos) {
          case 'top':
            oPos.top = iTop;
            break;
          case 'bottom':
            oPos.top = iBottome;
            break;
          case 'left':
            oPos.left = iLeft;
            break;
          case 'right':
            oPos.left = iRight;
            break;
          default:
            break
        }
      } else if (typeof o.pos == 'object') {
        oPos = o.pos
      }
    };
    oPos.top = oPos.top > iBottome ? iBottome : oPos.top >= 0 ? oPos.top : 0;
    oPos.left = oPos.left > iRight ? iRight : oPos.left >= 0 ? oPos.left : 0;
    this.iScrollTop = oPos.top;
    this.iScrollLeft = oPos.left;
    this.setTransLate(o.time || 0);
    if (this.bYBar) {
      this.setYTop(this.iScrollTop / this.iScrollH * this.iYBoxH, o.time || 0)
    };
    if (this.bXBar) {
      this.setXLeft(this.iScrollLeft / this.iScrollW * this.iXBoxW, o.time || 0)
    }
  };

  function getStyle(obj, name) {
    if (win.getComputedStyle) {
      return getComputedStyle(obj, null)[name]
    } else {
      return obj.currentStyle[name]
    }
  };

  function setStyle(obj, oStyle) {
    for (var i in oStyle) {
      obj.style[i] = oStyle[i]
    }
  };

  function getOffsetSize(obj) {
    var sDisplay = getStyle(obj, "display");
    var res = {};
    if (sDisplay != "none") {
      res.width = obj.offsetWidth;
      res.height = obj.offsetHeight
    } else {
      var oldStyle = {
        position: getStyle(obj, "position"),
        visibility: getStyle(obj, "visibility"),
        display: sDisplay
      };
      var newStyle = {
        position: "absolute",
        visibility: "hidden",
        display: "inline-block"
      };
      setStyle(obj, newStyle);
      res.width = obj.offsetWidth;
      res.height = obj.offsetHeight;
      setStyle(obj, oldStyle)
    };
    return res
  };

  function getClientSize(obj) {
    var iTopW = parseInt(getStyle(obj, 'borderTopWidth'));
    var iRightW = parseInt(getStyle(obj, 'borderRightWidth'));
    var iBottomW = parseInt(getStyle(obj, 'borderBottomWidth'));
    var iLeftW = parseInt(getStyle(obj, 'borderLeftWidth'));
    var oOffset = getOffsetSize(obj);
    return {
      width: oOffset.width <= 0 ? oOffset.width : oOffset.width - iLeftW - iRightW,
      height: oOffset.height <= 0 ? oOffset.height : oOffset.height - iTopW - iBottomW
    }
  };

  function canSelectText(bCan) {
    if (!bCan) {
      dom.body.style.mozUserSelect = 'none';
      dom.body.style.webkitUserSelect = 'none';
      dom.body.style.msUserSelect = 'none';
      dom.body.style.khtmlUserSelect = 'none';
      dom.body.style.userSelect = 'none'
    } else {
      dom.body.style.mozUserSelect = 'text';
      dom.body.style.webkitUserSelect = 'text';
      dom.body.style.msUserSelect = 'text';
      dom.body.style.khtmlUserSelect = 'text';
      dom.body.style.userSelect = 'text'
    }
  };

  function getPosition(obj, goal) {
    var oPos = {
      top: obj.offsetTop,
      left: obj.offsetLeft
    };
    if (obj.parentNode != goal) {
      var obj = getPosition(obj.parentNode, goal);
      oPos.top += obj.top;
      oPos.left += obj.left
    } else {
      return oPos
    }
  };
  if (typeof define === "function" && define.amd) {
    define([], function () {
      return MyScrollBar
    })
  };
  win.MyScrollBar = MyScrollBar
})(window, document); /*!Cookie操作*/
(function () {
  var _plugin_api = {
    write: function (name, value, path, time) {
      var date = new Date();
      date.setTime(date.getTime() + (time * 60 * 1000));
      $.cookie(name, value, {
        path: path,
        expires: date
      });
      return;
    },
    query: function (name) {
      if ($.cookie(name) == null || $.cookie(name) == undefined || $.cookie(name) == '' || $.cookie(name) == "") {
        return false;
      } else {
        return true;
      }
      return;
    },
    read: function (name) {
      var name = $.cookie(name);
      return name;
    },
    empty: function (name) {
      $.cookie(name, '', {
        path: "/",
        expires: -1
      });
      return;
    }
  }
  this.zdyCookie = _plugin_api;
})(); /*!回到顶部*/
function __goTop() {
  $('html,body').animate({
    scrollTop: 0
  }, 'slow');
} /*!跳转到指定div位置*/
function __goDiv(obj) {
  if ($("#" + obj).length > 0) {
    $("html,body").animate({
      scrollTop: $("#" + obj).offset().top - 68
    }, 1000);
  } else {
    showDialogTip({
      error: true,
      tip: "拒绝：找不到这个模块"
    });
  }
}