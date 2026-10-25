(function () {
  var c = document.getElementById("clock");
  function t() {
    c.textContent = new Date().toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  t();
  setInterval(t, 30000);
  var toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  document.querySelectorAll('a.card[href="tech.html"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      toast.textContent = "This page is coming soon.";
      toast.classList.add("on");
      clearTimeout(toast._t);
      toast._t = setTimeout(function () {
        toast.classList.remove("on");
      }, 2200);
    });
  });
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* smooth, inertial scrolling */
  if (window.Lenis && !reduce) {
    var lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.95 });
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

  /* Apple-style cursor: arrow that turns into a pointing hand over links */
  if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
    var cur = document.createElement("div");
    cur.className = "cur";
    cur.setAttribute("aria-hidden", "true");
    cur.innerHTML =
      '<svg class="arrow" viewBox="0 0 24 24"><path d="M3 2v17l4.5-4.2 3.1 6.7 2.8-1.3-3-6.6h6.1z" fill="#000" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
      '<svg class="hand" viewBox="0 0 24 24"><defs><g id="curhand"><rect x="8.6" y="2.2" width="3.4" height="11" rx="1.7"/><rect x="5.4" y="10.6" width="13" height="10.2" rx="4.4"/><rect x="12" y="9.6" width="3.2" height="5" rx="1.6"/><rect x="14.9" y="10.4" width="3.2" height="5" rx="1.6"/><rect x="3.8" y="12.5" width="4.4" height="6" rx="2.2"/></g></defs><use href="#curhand" fill="#000" stroke="#000" stroke-width="3" stroke-linejoin="round"/><use href="#curhand" fill="#fff"/></svg>';
    document.body.appendChild(cur);
    document.documentElement.classList.add("has-cur");
    var px = 0,
      py = 0,
      pend = false;
    addEventListener(
      "mousemove",
      function (e) {
        px = e.clientX;
        py = e.clientY;
        cur.classList.add("on");
        if (!pend) {
          pend = true;
          requestAnimationFrame(function () {
            cur.style.transform = "translate3d(" + px + "px," + py + "px,0)";
            pend = false;
          });
        }
      },
      { passive: true },
    );
    document.addEventListener("mouseleave", function () {
      cur.classList.remove("on");
    });
    document.addEventListener("mouseover", function (e) {
      cur.classList.toggle(
        "link",
        !!(e.target.closest && e.target.closest("a,button")),
      );
    });
    addEventListener("mousedown", function () {
      cur.classList.add("down");
    });
    addEventListener("mouseup", function () {
      cur.classList.remove("down");
    });
  }

  /* folder pop-ups */
  var pop = document.getElementById("pop"),
    pt = document.getElementById("popt"),
    pm = document.getElementById("popm"),
    last = null;
  function closePop() {
    pop.classList.remove("on");
    pop.setAttribute("aria-hidden", "true");
    if (last) {
      last.focus({ preventScroll: true });
      last = null;
    }
  }
  document.querySelectorAll("button.folder").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      pt.textContent = b.dataset.title;
      pm.textContent = b.dataset.msg;
      pop.classList.add("on");
      pop.setAttribute("aria-hidden", "false");
      last = b;
      pop.querySelector(".x").focus({ preventScroll: true });
    });
  });
  pop.querySelector(".x").addEventListener("click", closePop);
  document.addEventListener("click", function (e) {
    if (pop.classList.contains("on") && !pop.contains(e.target)) closePop();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && pop.classList.contains("on")) closePop();
  });

  if (reduce) return;
  var d = document.querySelector(".desktop"),
    tick = false;
  addEventListener(
    "scroll",
    function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        var p = Math.min(1, Math.max(0, scrollY / innerHeight));
        d.style.setProperty("--p", p);
        tick = false;
      });
    },
    { passive: true },
  );
})();
