"use strict";

(() => {
  const root = document.documentElement;
  const header = document.querySelector("#site-header");
  const nav = document.querySelector("#site-nav");
  const menuButton = document.querySelector("#menu-toggle");
  const themeButton = document.querySelector("#theme-toggle");
  const topButton = document.querySelector("#back-to-top");
  const brand = document.querySelector(".brand");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopMenu = window.matchMedia("(min-width: 768px)");
  const settings = { themeKey: "portfolio-theme", navAt: 60, topAt: 300, revealAt: 0.2 };
  const state = { theme: "light", menuOpen: false, scrollY: window.scrollY };

  const icons = {
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>'
  };

  const readTheme = () => {
    try {
      return window.localStorage.getItem(settings.themeKey) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  };

  const renderTheme = (persist = false) => {
    root.setAttribute("data-theme", state.theme);
    const nextAction = state.theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환";
    themeButton.setAttribute("aria-label", nextAction);
    themeButton.setAttribute("title", nextAction);
    themeButton.innerHTML = state.theme === "dark" ? icons.sun : icons.moon;
    if (persist) {
      try {
        window.localStorage.setItem(settings.themeKey, state.theme);
      } catch {
        // 저장소가 차단돼도 현재 화면의 테마는 정상적으로 전환합니다.
      }
    }
  };

  const renderMenu = () => {
    nav.classList.toggle("active", state.menuOpen);
    menuButton.setAttribute("aria-expanded", String(state.menuOpen));
    menuButton.setAttribute("aria-label", state.menuOpen ? "메뉴 닫기" : "메뉴 열기");
  };

  const closeMenu = () => {
    state.menuOpen = false;
    renderMenu();
  };

  themeButton.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    renderTheme(true);
  });

  menuButton.addEventListener("click", () => {
    state.menuOpen = !state.menuOpen;
    renderMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.menuOpen) {
      closeMenu();
      menuButton.focus();
    }
  });

  desktopMenu.addEventListener("change", () => {
    if (desktopMenu.matches) closeMenu();
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      window.history.replaceState(null, "", hash);
    });
  });

  const renderScroll = () => {
    header.classList.toggle("scrolled", state.scrollY >= settings.navAt);
    topButton.hidden = state.scrollY < settings.topAt;
  };

  let scrollScheduled = false;
  window.addEventListener("scroll", () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    window.requestAnimationFrame(() => {
      state.scrollY = window.scrollY;
      renderScroll();
      scrollScheduled = false;
    });
  }, { passive: true });

  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
    brand.focus({ preventScroll: true });
  });

  const revealTargets = [...document.querySelectorAll(".reveal")];
  let observer;
  const showAll = () => {
    root.classList.remove("motion-enabled");
    revealTargets.forEach((target) => target.classList.add("visible"));
    observer?.disconnect();
  };

  const initializeReveal = () => {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }
    observer?.disconnect();
    observer = new window.IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
        if (isIntersecting && intersectionRatio >= settings.revealAt) {
          target.classList.add("visible");
          observer.unobserve(target);
        }
      });
    }, { threshold: settings.revealAt });
    revealTargets.forEach((target) => observer.observe(target));
    root.classList.add("motion-enabled");
  };

  reducedMotion.addEventListener("change", initializeReveal);
  state.theme = readTheme();
  renderTheme();
  renderMenu();
  renderScroll();
  initializeReveal();
})();
