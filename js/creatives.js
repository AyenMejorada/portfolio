(function () {
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches,
    lenis = null;
  var c = document.getElementById("clock");
  function tick() {
    c.textContent = new Date().toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  tick();
  setInterval(tick, 30000);

  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.95 });
    var raf = function (t) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var el = document.querySelector(a.getAttribute("href"));
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { duration: 1.5 });
        }
      });
    });
  }

  var rv = document.querySelectorAll(".rv");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06 },
    );
    rv.forEach(function (el) {
      io.observe(el);
    });
  } else
    rv.forEach(function (el) {
      el.classList.add("in");
    });

  /* jump scroller: highlights the section in view */
  var jl = [].slice.call(document.querySelectorAll("#jump a")),
    secs = jl.map(function (a) {
      return document.getElementById(a.dataset.s);
    });
  function spy() {
    var y = innerHeight * 0.35,
      on = -1;
    secs.forEach(function (s, i) {
      if (s.getBoundingClientRect().top <= y) on = i;
    });
    jl.forEach(function (a, i) {
      a.classList.toggle("on", i === on);
      if (i === on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  addEventListener("scroll", spy, { passive: true });
  addEventListener("resize", spy);
  spy();

  /* quick look viewer */
  var imgs = [].slice.call(document.querySelectorAll(".g img")),
    lb = document.getElementById("lb"),
    li = document.getElementById("lbi"),
    lt = document.getElementById("lbt"),
    cur = 0,
    opener = null;
  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    li.src = imgs[cur].src;
    li.alt = imgs[cur].alt;
    lt.textContent =
      imgs[cur].alt + " (" + (cur + 1) + " of " + imgs.length + ")";
  }
  function openLb(i, b) {
    opener = b;
    show(i);
    lb.classList.add("on");
    lb.setAttribute("aria-hidden", "false");
    if (lenis) lenis.stop();
    else document.body.style.overflow = "hidden";
    lb.querySelector(".x").focus({ preventScroll: true });
  }
  function closeLb() {
    lb.classList.remove("on");
    lb.setAttribute("aria-hidden", "true");
    if (lenis) lenis.start();
    else document.body.style.overflow = "";
    if (opener) opener.focus({ preventScroll: true });
  }
  imgs.forEach(function (im, i) {
    im.parentNode.addEventListener("click", function () {
      openLb(i, this);
    });
  });
  lb.querySelector(".x").addEventListener("click", closeLb);
  lb.querySelector(".prev").addEventListener("click", function () {
    show(cur - 1);
  });
  lb.querySelector(".next").addEventListener("click", function () {
    show(cur + 1);
  });
  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLb();
  });
  addEventListener("keydown", function (e) {
    if (!lb.classList.contains("on")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "ArrowLeft") show(cur - 1);
  });

  /* branding kit pop-up with left/right slides */
  var kb = document.getElementById("kb"),
    kbi = document.getElementById("kbi"),
    kbt = document.getElementById("kbt"),
    kbb = document.getElementById("kbb"),
    kbc = document.getElementById("kbc"),
    kprev = kb.querySelector(".prev"),
    knext = kb.querySelector(".next"),
    kslides = [],
    kcur = 0,
    kopener = null;
  function kshow(i) {
    kcur = (i + kslides.length) % kslides.length;
    kbi.src = kslides[kcur].src;
    kbi.alt = kslides[kcur].alt;
    kbi.parentNode.style.aspectRatio =
      kslides[kcur].getAttribute("width") +
      " / " +
      kslides[kcur].getAttribute("height");
    kbc.innerHTML = "";
    if (kslides.length > 1) {
      var cap = document.createElement("span"),
        num = document.createElement("span");
      cap.textContent = kslides[kcur].alt;
      num.textContent = kcur + 1 + " of " + kslides.length;
      kbc.appendChild(cap);
      kbc.appendChild(num);
    }
  }
  function openKb(btn) {
    var note = document.getElementById(btn.getAttribute("data-note")),
      cover = btn.querySelector(".kcover, .uimg"),
      extra = [].slice.call(note.querySelectorAll(".kslides img"));
    kopener = btn;
    kslides = extra.length ? extra : [cover];
    kb.classList.toggle("multi", kslides.length > 1);
    kshow(0);
    kbt.textContent = note.querySelector("h3").textContent;
    var copy = note.cloneNode(true),
      ks = copy.querySelector(".kslides");
    if (ks) ks.remove();
    kbb.innerHTML = copy.innerHTML;
    if (btn.classList.contains("ux")) {
      var v = document.createElement("a");
      v.className = "kvisit";
      v.innerHTML =
        (note.getAttribute("data-label") || "View website") +
        '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3L3 13"/></svg>';
      v.href = note.getAttribute("data-url") || "#";
      v.target = "_blank";
      v.rel = "noopener";
      kbb.appendChild(v);
    }
    kb.querySelector(".kbwin").scrollTop = 0;
    kb.classList.add("on");
    kb.setAttribute("aria-hidden", "false");
    if (lenis) lenis.stop();
    else document.body.style.overflow = "hidden";
    kb.querySelector(".x").focus({ preventScroll: true });
  }
  function closeKb() {
    kb.classList.remove("on");
    kb.setAttribute("aria-hidden", "true");
    if (lenis) lenis.start();
    else document.body.style.overflow = "";
    if (kopener) kopener.focus({ preventScroll: true });
  }
  [].forEach.call(document.querySelectorAll(".kit, .ux"), function (b) {
    b.addEventListener("click", function () {
      openKb(b);
    });
  });
  kb.querySelector(".x").addEventListener("click", closeKb);
  kprev.addEventListener("click", function () {
    kshow(kcur - 1);
  });
  knext.addEventListener("click", function () {
    kshow(kcur + 1);
  });
  kb.addEventListener("click", function (e) {
    if (e.target === kb) closeKb();
  });
  var tx = null;
  kb.querySelector(".lbimg").addEventListener(
    "touchstart",
    function (e) {
      tx = e.touches[0].clientX;
    },
    { passive: true },
  );
  kb.querySelector(".lbimg").addEventListener("touchend", function (e) {
    if (tx === null || kslides.length < 2) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) kshow(kcur + (dx < 0 ? 1 : -1));
    tx = null;
  });
  addEventListener("keydown", function (e) {
    if (!kb.classList.contains("on")) return;
    if (e.key === "Escape") closeKb();
    if (kslides.length < 2) return;
    if (e.key === "ArrowRight") kshow(kcur + 1);
    if (e.key === "ArrowLeft") kshow(kcur - 1);
  });

  /* Apple-style cursor */
  if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
    var cu = document.createElement("div");
    cu.className = "cur";
    cu.setAttribute("aria-hidden", "true");
    cu.innerHTML =
      '<svg class="arrow" viewBox="0 0 24 24"><path d="M3 2v17l4.5-4.2 3.1 6.7 2.8-1.3-3-6.6h6.1z" fill="#000" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg><svg class="hand" viewBox="0 0 24 24"><defs><g id="curhand"><rect x="8.6" y="2.2" width="3.4" height="11" rx="1.7"/><rect x="5.4" y="10.6" width="13" height="10.2" rx="4.4"/><rect x="12" y="9.6" width="3.2" height="5" rx="1.6"/><rect x="14.9" y="10.4" width="3.2" height="5" rx="1.6"/><rect x="3.8" y="12.5" width="4.4" height="6" rx="2.2"/></g></defs><use href="#curhand" fill="#000" stroke="#000" stroke-width="3" stroke-linejoin="round"/><use href="#curhand" fill="#fff"/></svg>';
    document.body.appendChild(cu);
    document.documentElement.classList.add("has-cur");
    var px = 0,
      py = 0,
      pend = false;
    addEventListener(
      "mousemove",
      function (e) {
        px = e.clientX;
        py = e.clientY;
        cu.classList.add("on");
        if (!pend) {
          pend = true;
          requestAnimationFrame(function () {
            cu.style.transform = "translate3d(" + px + "px," + py + "px,0)";
            pend = false;
          });
        }
      },
      { passive: true },
    );
    document.addEventListener("mouseleave", function () {
      cu.classList.remove("on");
    });
    document.addEventListener("mouseover", function (e) {
      cu.classList.toggle(
        "link",
        !!(e.target.closest && e.target.closest("a,button")),
      );
    });
    addEventListener("mousedown", function () {
      cu.classList.add("down");
    });
    addEventListener("mouseup", function () {
      cu.classList.remove("down");
    });
  }
})();
