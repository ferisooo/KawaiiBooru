(() => {
  // renderer/app.jsx
  var { useState, useEffect, useRef, useCallback } = React;
  var WV_PRELOAD = new URL("wv-preload.js", window.location.href).href;
  function catColor(c) {
    switch (c) {
      case 1:
        return "#ff8a8a";
      // artist
      case 3:
        return "#d68aff";
      // copyright
      case 4:
        return "#8affc0";
      // character
      case 5:
        return "#ffd36c";
      // meta
      default:
        return "#bcd0ff";
    }
  }
  function fmtCount(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "m";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "k";
    return String(n);
  }
  var NAV_MAIN = [
    { key: "account", label: "My Account", ext: "/profile" },
    { key: "posts", label: "Posts", view: "" },
    { key: "comments", label: "Comments", ext: "/comments" },
    { key: "notes", label: "Notes", ext: "/notes" },
    { key: "artists", label: "Artists", ext: "/artists" },
    { key: "tags", label: "Tags", ext: "/tags" },
    { key: "pools", label: "Pools", ext: "/pools" },
    { key: "wiki", label: "Wiki", ext: "/wiki_pages" },
    { key: "forum", label: "Forum", ext: "/forum_topics" }
  ];
  var NAV_SUB = [
    { key: "listing", label: "Listing", view: "" },
    { key: "upload", label: "Upload", ext: "/uploads/new" },
    { key: "hot", label: "Hot", view: "order:rank" },
    { key: "popular", label: "Popular", mode: "popular" },
    { key: "favorites", label: "Favorites", view: "fav" },
    { key: "favgroups", label: "Fav groups", ext: "/favorite_groups" },
    { key: "saved", label: "Saved searches", ext: "/saved_searches" },
    { key: "changes", label: "Changes", ext: "/post_versions" },
    { key: "help", label: "Help", ext: "/wiki_pages/help:home" }
  ];
  function startParticles() {
    const c = document.getElementById("bg-particles");
    const ctx = c.getContext("2d");
    let w, h;
    const parts = [];
    const COLORS = ["#ff5ecb", "#a16bff", "#6cf6ff", "#ff9be8"];
    function resize() {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) {
      parts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.4 + 0.6,
        sp: Math.random() * 0.4 + 0.15,
        drift: (Math.random() - 0.5) * 0.4,
        color: COLORS[Math.random() * COLORS.length | 0],
        a: Math.random() * 0.5 + 0.2,
        tw: Math.random() * Math.PI * 2
      });
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.sp;
        p.x += p.drift;
        p.tw += 0.04;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      requestAnimationFrame(frame);
    }
    frame();
  }
  function startTrail() {
    const c = document.getElementById("trail-canvas");
    const ctx = c.getContext("2d");
    let w, h;
    let pts = [];
    const COLORS = ["#ff5ecb", "#a16bff", "#6cf6ff", "#ffffff"];
    function resize() {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    function spawn(x, y) {
      for (let i = 0; i < 2; i++) {
        pts.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.4,
          vy: (Math.random() - 0.5) * 1.4 + 0.4,
          life: 1,
          r: Math.random() * 3 + 1.5,
          color: COLORS[Math.random() * COLORS.length | 0]
        });
      }
      if (pts.length > 240) pts.splice(0, pts.length - 240);
    }
    window.__trailSpawn = spawn;
    window.addEventListener("mousemove", (e) => spawn(e.clientX, e.clientY));
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.028;
        if (p.life <= 0) {
          pts.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      requestAnimationFrame(frame);
    }
    frame();
  }
  function startRipples() {
    window.addEventListener("mousedown", (e) => {
      const r = document.createElement("div");
      r.className = "ripple";
      r.style.left = e.clientX + "px";
      r.style.top = e.clientY + "px";
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 620);
    });
  }
  function ProxyImg({ src, style, big }) {
    const [data, setData] = useState(null);
    const [failed, setFailed] = useState(false);
    useEffect(() => {
      let alive = true;
      setData(null);
      setFailed(false);
      if (!src) {
        setFailed(true);
        return;
      }
      window.api.fetchImage(src).then((d) => {
        if (!alive) return;
        d ? setData(d) : setFailed(true);
      });
      return () => {
        alive = false;
      };
    }, [src]);
    if (failed) return /* @__PURE__ */ React.createElement("div", { className: "img-fail", style }, "\u2298");
    if (!data) {
      return /* @__PURE__ */ React.createElement("div", { className: big ? "img-load big" : "img-load", style }, big ? /* @__PURE__ */ React.createElement("div", { className: "spinner" }) : null);
    }
    return /* @__PURE__ */ React.createElement("img", { src: data, alt: "", style, draggable: false });
  }
  function TitleBar() {
    return /* @__PURE__ */ React.createElement("div", { className: "titlebar" }, /* @__PURE__ */ React.createElement("div", { className: "brand" }, /* @__PURE__ */ React.createElement("span", { className: "heart" }, "\u2661"), "KAWAII\xB7BOORU"), /* @__PURE__ */ React.createElement("div", { className: "tb-right" }, /* @__PURE__ */ React.createElement("button", { className: "socials", onClick: () => window.api.openExternal("https://mez.ink/ferisooo") }, "\u2661 mez.ink/ferisooo"), /* @__PURE__ */ React.createElement("div", { className: "win-btns" }, /* @__PURE__ */ React.createElement("button", { className: "win-btn min", onClick: () => window.api.minimize() }, "\u2014"), /* @__PURE__ */ React.createElement("button", { className: "win-btn max", onClick: () => window.api.maximize() }, "\u25A2"), /* @__PURE__ */ React.createElement("button", { className: "win-btn close", onClick: () => window.api.close() }, "\u2715"))));
  }
  function LoginModal({ onClose, onSuccess, onSignup, onProfile }) {
    const [u, setU] = useState("");
    const [k, setK] = useState("");
    const [remember, setRemember] = useState(true);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");
    useEffect(() => {
      window.api.authRemembered().then((r) => {
        if (r) {
          setU(r.login || "");
          setK(r.api_key || "");
        }
      });
    }, []);
    const submit = async () => {
      if (!u.trim() || !k.trim()) {
        setErr("enter your username and API key");
        return;
      }
      setBusy(true);
      setErr("");
      const r = await window.api.authSet({ login: u.trim(), api_key: k.trim(), remember });
      setBusy(false);
      if (r.ok) onSuccess(r);
      else setErr(r.error || "login failed");
    };
    return /* @__PURE__ */ React.createElement("div", { className: "lightbox", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "login-card", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("h3", null, "\u2661 log in to danbooru"), /* @__PURE__ */ React.createElement("p", { className: "login-hint" }, "enter your danbooru username and API key. find your key on danbooru under My Account \u2192 API Key."), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "login-input",
        placeholder: "username",
        value: u,
        onChange: (e) => setU(e.target.value)
      }
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "login-input",
        placeholder: "API key",
        type: "password",
        value: k,
        onChange: (e) => setK(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter") submit();
        }
      }
    ), err ? /* @__PURE__ */ React.createElement("div", { className: "login-err" }, err) : null, /* @__PURE__ */ React.createElement("label", { className: "login-remember", onClick: () => setRemember((v) => !v) }, /* @__PURE__ */ React.createElement("span", { className: "login-check" + (remember ? " on" : "") }, remember ? "\u2713" : ""), "remember me"), /* @__PURE__ */ React.createElement("button", { className: "login-go", disabled: busy, onClick: submit }, busy ? "checking\u2026" : "log in \u2661"), /* @__PURE__ */ React.createElement("button", { className: "login-signup", onClick: onSignup }, "new to danbooru? ", /* @__PURE__ */ React.createElement("span", null, "sign up \u2197")), /* @__PURE__ */ React.createElement("button", { className: "login-key", onClick: onProfile }, "open my danbooru profile \u2197"), /* @__PURE__ */ React.createElement("div", { className: "login-note" }, "stored locally on this PC only \xB7 never sent anywhere else")));
  }
  function SearchBox({ value, setValue, onSearch }) {
    const [sug, setSug] = useState([]);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const debRef = useRef(null);
    const boxRef = useRef(null);
    const lastToken = (v) => {
      const parts = v.split(/\s+/);
      return parts[parts.length - 1];
    };
    useEffect(() => {
      const tok = lastToken(value).trim();
      if (debRef.current) clearTimeout(debRef.current);
      if (!tok) {
        setSug([]);
        setOpen(false);
        return;
      }
      debRef.current = setTimeout(async () => {
        const r = await window.api.autocompleteTags(tok);
        setSug(r);
        setActive(-1);
        setOpen(r.length > 0);
      }, 170);
      return () => {
        if (debRef.current) clearTimeout(debRef.current);
      };
    }, [value]);
    useEffect(() => {
      const h = (e) => {
        if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
      };
      window.addEventListener("mousedown", h);
      return () => window.removeEventListener("mousedown", h);
    }, []);
    const pick = (s) => {
      const parts = value.split(/\s+/);
      parts[parts.length - 1] = s.value;
      setValue(parts.join(" ") + " ");
      setSug([]);
      setOpen(false);
      setActive(-1);
    };
    const onKey = (e) => {
      if (open && sug.length) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActive((a) => Math.min(sug.length - 1, a + 1));
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActive((a) => Math.max(0, a - 1));
          return;
        }
        if (e.key === "Enter" && active >= 0) {
          e.preventDefault();
          pick(sug[active]);
          return;
        }
        if (e.key === "Escape") {
          setOpen(false);
          return;
        }
      }
      if (e.key === "Enter") {
        setOpen(false);
        onSearch();
      }
    };
    return /* @__PURE__ */ React.createElement("div", { className: "search-wrap", ref: boxRef }, /* @__PURE__ */ React.createElement("div", { className: "search-field" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "search-input",
        placeholder: "search tags\u2026  (type to autocomplete)",
        value,
        onChange: (e) => setValue(e.target.value),
        onKeyDown: onKey,
        onFocus: () => {
          if (sug.length) setOpen(true);
        }
      }
    ), open && sug.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "ac-drop" }, sug.map((s, i) => /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "ac-item" + (i === active ? " active" : ""),
        key: s.value + i,
        onMouseEnter: () => setActive(i),
        onMouseDown: (e) => {
          e.preventDefault();
          pick(s);
        }
      },
      /* @__PURE__ */ React.createElement("span", { className: "ac-tag", style: { color: catColor(s.category) } }, s.label.replace(/_/g, " ")),
      /* @__PURE__ */ React.createElement("span", { className: "ac-count" }, fmtCount(s.count))
    )))), /* @__PURE__ */ React.createElement("button", { className: "go-btn", onClick: onSearch }, "search \u2661"));
  }
  function WebPane({ url, title, onExternal, onBack }) {
    const ref = useRef(null);
    const [loading, setLoading] = useState(true);
    const [canBack, setCanBack] = useState(false);
    const [canFwd, setCanFwd] = useState(false);
    useEffect(() => {
      const wv = ref.current;
      if (!wv) return;
      const start = () => setLoading(true);
      const stop = () => {
        setLoading(false);
        try {
          setCanBack(wv.canGoBack());
          setCanFwd(wv.canGoForward());
        } catch (e) {
        }
      };
      const onIpc = (e) => {
        if (e.channel === "kb-mouse" && window.__trailSpawn) {
          try {
            const rect = wv.getBoundingClientRect();
            window.__trailSpawn(rect.left + e.args[0], rect.top + e.args[1]);
          } catch (err) {
          }
        }
      };
      wv.addEventListener("did-start-loading", start);
      wv.addEventListener("did-stop-loading", stop);
      wv.addEventListener("ipc-message", onIpc);
      return () => {
        wv.removeEventListener("did-start-loading", start);
        wv.removeEventListener("did-stop-loading", stop);
        wv.removeEventListener("ipc-message", onIpc);
      };
    }, []);
    const back = () => {
      try {
        ref.current.goBack();
      } catch (e) {
      }
    };
    const fwd = () => {
      try {
        ref.current.goForward();
      } catch (e) {
      }
    };
    const reload = () => {
      try {
        ref.current.reload();
      } catch (e) {
      }
    };
    return /* @__PURE__ */ React.createElement("div", { className: "web-pane" }, /* @__PURE__ */ React.createElement("div", { className: "web-bar" }, /* @__PURE__ */ React.createElement("button", { className: "web-back", onClick: onBack }, "\u2190 gallery"), /* @__PURE__ */ React.createElement("button", { className: "web-btn", disabled: !canBack, onClick: back }, "\u2039"), /* @__PURE__ */ React.createElement("button", { className: "web-btn", disabled: !canFwd, onClick: fwd }, "\u203A"), /* @__PURE__ */ React.createElement("button", { className: "web-btn", onClick: reload }, "\u27F3"), /* @__PURE__ */ React.createElement("span", { className: "web-url" }, loading ? "loading\u2026" : title, " \xB7 danbooru.donmai.us"), /* @__PURE__ */ React.createElement("button", { className: "web-ext", onClick: () => onExternal(url) }, "open in browser \u2197")), /* @__PURE__ */ React.createElement("div", { className: "web-frame-wrap" }, /* @__PURE__ */ React.createElement("webview", { ref, src: url, className: "webframe", partition: "persist:danbooru", preload: WV_PRELOAD, allowpopups: "true" }), loading && /* @__PURE__ */ React.createElement("div", { className: "web-loading" }, /* @__PURE__ */ React.createElement("div", { className: "spinner" }))));
  }
  function Card({ post, index, onOpen }) {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "card",
        style: { animationDelay: index % 30 * 0.04 + "s" },
        onClick: () => onOpen(index)
      },
      /* @__PURE__ */ React.createElement(
        ProxyImg,
        {
          src: post.thumb,
          style: { aspectRatio: post.width && post.height ? `${post.width}/${post.height}` : "auto" }
        }
      ),
      /* @__PURE__ */ React.createElement("div", { className: "card-glow" }),
      /* @__PURE__ */ React.createElement("div", { className: "card-meta" }, /* @__PURE__ */ React.createElement("span", { className: "badge" }, "\u2665 ", post.favs), /* @__PURE__ */ React.createElement("span", { className: "badge cy" }, "\u2605 ", post.score), post.rating !== "g" ? /* @__PURE__ */ React.createElement("span", { className: "badge rt" }, post.rating.toUpperCase()) : null)
    );
  }
  var DB = "https://danbooru.donmai.us";
  function Lightbox({ posts, index, onClose, onNav, onTag, openWeb, loggedIn }) {
    const post = posts[index];
    const [zoom, setZoom] = useState(false);
    const [faved, setFaved] = useState(false);
    const [status, setStatus] = useState("");
    useEffect(() => {
      const k = (e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") onNav(-1);
        if (e.key === "ArrowRight") onNav(1);
      };
      window.addEventListener("keydown", k);
      return () => window.removeEventListener("keydown", k);
    }, [index]);
    useEffect(() => {
      setZoom(false);
      setFaved(false);
      setStatus("");
    }, [index]);
    if (!post) return null;
    const tagList = post.tags.split(" ").filter(Boolean).slice(0, 28);
    const goWeb = (path, title) => {
      openWeb(DB + path, title);
    };
    const doFav = async () => {
      setStatus("saving\u2026");
      const r = await window.api.favorite(post.id, !faved);
      if (r.ok) {
        setFaved((v) => !v);
        setStatus(!faved ? "added to favorites \u2665" : "removed from favorites");
      } else setStatus(r.error || "favorite failed");
    };
    const doDownload = async () => {
      setStatus("downloading\u2026");
      const r = await window.api.download(post.full, `danbooru_${post.id}.${post.ext || "jpg"}`);
      if (r.ok) setStatus("saved \u2665");
      else if (r.canceled) setStatus("");
      else setStatus(r.error || "download failed");
    };
    const OPTIONS = [
      { label: "Resize to window", fn: () => setZoom(false) },
      { label: "View original", fn: () => setZoom(true) },
      { label: "Download", fn: doDownload },
      { label: "Find similar", fn: () => goWeb("/iqdb_queries?post_id=" + post.id, "Find similar"), auth: true },
      { label: faved ? "Unfavorite" : "Favorite", fn: doFav, hot: true, auth: true },
      { label: "Edit", fn: () => goWeb("/posts/" + post.id, "Edit post"), auth: true },
      { label: "Add to pool", fn: () => goWeb("/pool_elements/new?post_id=" + post.id, "Add to pool"), auth: true },
      { label: "Add note", fn: () => goWeb("/posts/" + post.id, "Add note"), auth: true },
      { label: "Add commentary", fn: () => goWeb("/posts/" + post.id + "/artist_commentary/edit", "Commentary"), auth: true },
      { label: "Add to fav group", fn: () => goWeb("/favorite_groups", "Fav groups"), auth: true },
      { label: "Flag", fn: () => goWeb("/post_flags/new?post_id=" + post.id, "Flag post"), auth: true }
    ].filter((o) => loggedIn || !o.auth);
    return /* @__PURE__ */ React.createElement("div", { className: "lightbox", onClick: onClose }, /* @__PURE__ */ React.createElement("button", { className: "lb-close", onClick: onClose }, "\u2715"), /* @__PURE__ */ React.createElement("button", { className: "lb-nav prev", onClick: (e) => {
      e.stopPropagation();
      onNav(-1);
    } }, "\u2039"), /* @__PURE__ */ React.createElement("button", { className: "lb-nav next", onClick: (e) => {
      e.stopPropagation();
      onNav(1);
    } }, "\u203A"), /* @__PURE__ */ React.createElement("div", { className: "lb-inner", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "lb-img-wrap" + (zoom ? " zoom" : ""), onClick: () => setZoom((z) => !z) }, /* @__PURE__ */ React.createElement(ProxyImg, { src: post.full, big: true })), /* @__PURE__ */ React.createElement("div", { className: "lb-side", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("h3", null, post.artist ? post.artist.replace(/_/g, " ") : "unknown artist"), post.characters ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", color: "var(--ink-dim)" } }, post.characters.split(" ").slice(0, 4).join(", ").replace(/_/g, " ")) : null, /* @__PURE__ */ React.createElement("div", { className: "lb-row" }, /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "n" }, post.favs), /* @__PURE__ */ React.createElement("div", { className: "l" }, "favs")), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "n" }, post.score), /* @__PURE__ */ React.createElement("div", { className: "l" }, "score")), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "n" }, post.rating.toUpperCase()), /* @__PURE__ */ React.createElement("div", { className: "l" }, "rating"))), /* @__PURE__ */ React.createElement("div", { className: "lb-label" }, "tags"), /* @__PURE__ */ React.createElement("div", { className: "tag-cloud" }, tagList.map((t) => /* @__PURE__ */ React.createElement("span", { className: "tg", key: t, onClick: () => onTag(t) }, t.replace(/_/g, " ")))), /* @__PURE__ */ React.createElement("div", { className: "lb-label" }, "options"), /* @__PURE__ */ React.createElement("div", { className: "lb-opts" }, OPTIONS.map((o) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: o.label,
        className: "lb-opt" + (o.hot ? " hot" : "") + (o.label === "View original" && zoom ? " active" : "") + (o.label === "Resize to window" && !zoom ? " active" : ""),
        onClick: o.fn
      },
      o.label
    ))), !loggedIn ? /* @__PURE__ */ React.createElement("div", { className: "lb-hint" }, "log in for favorite, edit, flag & more") : null, status ? /* @__PURE__ */ React.createElement("div", { className: "lb-status" }, status) : null, /* @__PURE__ */ React.createElement("button", { className: "lb-link", onClick: () => window.api.openExternal(DB + "/posts/" + post.id) }, "view on danbooru \u2197"))));
  }
  function App() {
    const [input, setInput] = useState("");
    const [tags, setTags] = useState("");
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lightbox, setLightbox] = useState(-1);
    const [account, setAccount] = useState(void 0);
    const [showLogin, setShowLogin] = useState(false);
    const [nsfw, setNsfw] = useState(false);
    const [activeNav, setActiveNav] = useState("posts");
    const [mode, setMode] = useState("");
    const [webUrl, setWebUrl] = useState(null);
    const [webTitle, setWebTitle] = useState("");
    const [returnIndex, setReturnIndex] = useState(-1);
    const scrollRef = useRef(null);
    useEffect(() => {
      window.api.authGet().then((a) => setAccount(a || null));
    }, []);
    const load = useCallback(async (t, p, ns, md) => {
      setLoading(true);
      setError("");
      const res = await window.api.fetchPosts(t, p, 30, ns, md);
      if (res.ok) {
        setPosts(res.posts);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      } else {
        setError(res.error || "Something went wrong");
        setPosts([]);
      }
      setLoading(false);
    }, []);
    useEffect(() => {
      if (account === void 0) return;
      load(tags, page, nsfw, mode);
    }, [tags, page, nsfw, account, mode, load]);
    const search = (val) => {
      const raw = val !== void 0 ? val : input;
      if (val !== void 0) setInput(val);
      const t = raw.trim().toLowerCase().replace(/\s+/g, " ");
      setWebUrl(null);
      setActiveNav(null);
      setMode("");
      setPage(1);
      setTags(t);
    };
    const openFromLightbox = (url, title) => {
      setReturnIndex(lightbox);
      setLightbox(-1);
      setActiveNav(null);
      setWebTitle(title);
      setWebUrl(url);
    };
    const openWebFromModal = (url, title) => {
      setShowLogin(false);
      setReturnIndex(-1);
      setActiveNav(null);
      setWebTitle(title);
      setWebUrl(url);
    };
    const openSignup = () => openWebFromModal("https://danbooru.donmai.us/users/new", "Sign up");
    const openProfile = () => openWebFromModal("https://danbooru.donmai.us/profile", "My Account");
    const backToGallery = () => {
      setWebUrl(null);
      if (returnIndex >= 0 && posts[returnIndex]) {
        setLightbox(returnIndex);
      }
      setReturnIndex(-1);
    };
    const goListing = () => {
      setWebUrl(null);
      setInput("");
      setMode("");
      setPage(1);
      setActiveNav(account ? "listing" : "posts");
      setTags("");
    };
    const navTo = (item) => {
      setReturnIndex(-1);
      if (item.ext) {
        setActiveNav(item.key);
        setWebTitle(item.label);
        setWebUrl("https://danbooru.donmai.us" + item.ext);
        return;
      }
      setWebUrl(null);
      setInput("");
      setActiveNav(item.key);
      setPage(1);
      if (item.mode) {
        setMode(item.mode);
        setTags("");
      } else if (item.view === "fav") {
        setMode("");
        setTags(account ? "ordfav:" + account.name : "");
      } else {
        setMode("");
        setTags(item.view || "");
      }
    };
    const logout = async () => {
      await window.api.authClear();
      setNsfw(false);
      setMode("");
      setWebUrl(null);
      setTags("");
      setInput("");
      setPage(1);
      setActiveNav("posts");
      setAccount(null);
    };
    const onLoginSuccess = (res) => {
      setShowLogin(false);
      setAccount({ name: res.name, level: res.level });
    };
    const navLightbox = (dir) => {
      setLightbox((i) => {
        const next = i + dir;
        if (next < 0 || next >= posts.length) return i;
        return next;
      });
    };
    return /* @__PURE__ */ React.createElement("div", { className: "shell" }, /* @__PURE__ */ React.createElement(TitleBar, null), /* @__PURE__ */ React.createElement("div", { className: "hero" }, /* @__PURE__ */ React.createElement("div", { className: "hero-top" }, /* @__PURE__ */ React.createElement("div", { className: "title-wrap" }, /* @__PURE__ */ React.createElement("h1", { className: "title", onClick: goListing, title: "back to listing" }, "KawaiiBooru"), /* @__PURE__ */ React.createElement("span", { className: "subtitle" }, account ? "\u2665 " + account.name : "gallery"), account && account.level ? /* @__PURE__ */ React.createElement("span", { className: "tier" }, account.level) : null), /* @__PURE__ */ React.createElement("div", { className: "account" }, account ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "acct-btn nsfw" + (nsfw ? " on" : ""),
        onClick: () => {
          setNsfw((v) => !v);
          setPage(1);
        }
      },
      nsfw ? "NSFW on" : "NSFW off"
    ), /* @__PURE__ */ React.createElement("button", { className: "acct-btn out", title: "log out", onClick: logout }, "\u2715")) : /* @__PURE__ */ React.createElement("button", { className: "acct-btn login", onClick: () => setShowLogin(true) }, "\u2661 log in"))), /* @__PURE__ */ React.createElement(SearchBox, { value: input, setValue: setInput, onSearch: () => search() }), account && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "navbar" }, NAV_MAIN.map((it) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: it.key,
        className: "nav-pill" + (it.ext ? " ext" : "") + (!it.ext && activeNav === it.key ? " active" : ""),
        onClick: () => navTo(it)
      },
      it.label,
      it.ext ? " \u2197" : ""
    ))), /* @__PURE__ */ React.createElement("div", { className: "navbar sub" }, NAV_SUB.map((it) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: it.key,
        className: "nav-pill" + (it.ext ? " ext" : "") + (!it.ext && activeNav === it.key ? " active" : ""),
        onClick: () => navTo(it)
      },
      it.label,
      it.ext ? " \u2197" : ""
    ))))), webUrl ? /* @__PURE__ */ React.createElement(WebPane, { url: webUrl, title: webTitle, onExternal: (u) => window.api.openExternal(u), onBack: backToGallery }) : /* @__PURE__ */ React.createElement("div", { className: "gallery-scroll", ref: scrollRef }, loading ? /* @__PURE__ */ React.createElement("div", { className: "state" }, /* @__PURE__ */ React.createElement("div", { className: "spinner" }), /* @__PURE__ */ React.createElement("div", { className: "state-text" }, "summoning pretty pictures\u2026")) : error ? /* @__PURE__ */ React.createElement("div", { className: "state" }, /* @__PURE__ */ React.createElement("div", { className: "state-emoji" }, "\u2299\uFE4F\u2299"), /* @__PURE__ */ React.createElement("div", { className: "state-text" }, error)) : posts.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "state" }, /* @__PURE__ */ React.createElement("div", { className: "state-emoji" }, "(\uFF61\u2022\u0301\uFE3F\u2022\u0300\uFF61)"), /* @__PURE__ */ React.createElement("div", { className: "state-text" }, "nothing here\u2026 try another tag?")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "grid" }, posts.map((p, i) => /* @__PURE__ */ React.createElement(Card, { key: p.id + "-" + i, post: p, index: i, onOpen: setLightbox }))), /* @__PURE__ */ React.createElement("div", { className: "pager" }, /* @__PURE__ */ React.createElement("button", { className: "page-btn", disabled: page <= 1, onClick: () => setPage((p) => Math.max(1, p - 1)) }, "\u2039 prev"), /* @__PURE__ */ React.createElement("span", { className: "page-num" }, page), /* @__PURE__ */ React.createElement("button", { className: "page-btn", onClick: () => setPage((p) => p + 1) }, "next \u203A")))), showLogin && /* @__PURE__ */ React.createElement(LoginModal, { onClose: () => setShowLogin(false), onSuccess: onLoginSuccess, onSignup: openSignup, onProfile: openProfile }), lightbox >= 0 && posts[lightbox] && /* @__PURE__ */ React.createElement(
      Lightbox,
      {
        posts,
        index: lightbox,
        onClose: () => setLightbox(-1),
        onNav: navLightbox,
        onTag: (t) => {
          setLightbox(-1);
          search(t);
        },
        openWeb: openFromLightbox,
        loggedIn: !!account
      }
    ));
  }
  startParticles();
  startTrail();
  startRipples();
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
