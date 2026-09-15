"use strict";

(() => {
  const grid = document.querySelector("#projects-grid");
  const status = document.querySelector("#project-status");
  const endpoint = "https://api.github.com/users/develsvai/repos";
  const state = { phase: "idle", repos: [], error: "", missing: [] };

  // 이력서와 기존 소개 페이지의 설명. 실제 API 이름이 일치할 때만 결합합니다.
  const featured = {
    loom: { rank: 0, category: "WORKFLOW MEMORY", image: "loom", alt: "Loom의 제안·계약·Agent·로컬 기록 경계를 나타낸 구조 요약도", description: "AI가 제안한 작업을 사람이 승인하고, 계약·실행·검증·결과를 로컬에 보존하는 Workflow Memory Runtime.", tags: ["Task 계약", "Agent 어댑터", "Core + Wiki", "오프라인 패키징"] },
    deepquest: { rank: 1, category: "DISTRIBUTED AI PIPELINE", image: "deepquest", alt: "DeepQuest의 Queue·Worker·AI와 관측 및 확장 경계를 나타낸 구조 요약도", description: "AI 처리 서비스를 Queue·Worker로 분리하고, backlog 기반 확장과 실제 완료 처리량을 함께 검증한 분산 AI 파이프라인.", tags: ["비동기 처리", "KEDA", "Redis", "Prometheus / Grafana"] },
    "tinypilot-kvm-docker": { rank: 2, category: "EDGE KVM", image: "tinypilot", alt: "TinyPilot의 영상·USB HID·컨테이너 경계를 나타낸 구조 요약도. 실제 장비 제어 화면이 아닙니다", description: "Raspberry Pi의 영상·HID 장치를 컨테이너와 원격 네트워크에 연결한 복구용 Edge KVM. 장치 경계, 컨테이너 경량화, 불변 이미지와 복구를 다룹니다.", tags: ["Docker", "USB / HID", "이미지 경량화", "복구"] }
  };

  const detailFor = (name) => Object.hasOwn(featured, name.toLowerCase()) ? featured[name.toLowerCase()] : undefined;
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const publicURL = (value) => {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase();
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return "";
      if (!host.includes(".") || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".ts.net")) return "";
      // 장비 제어·내부망 링크를 공개 버튼으로 만들지 않습니다.
      if (/^[\d.]+$/.test(host) || host.includes(":")) return "";
      return url.href;
    } catch { return ""; }
  };

  const cardHTML = (repo) => {
    const { name, description, language, stargazers_count: stars, html_url: repoURL, homepage, fork } = repo;
    const detail = detailFor(name);
    const image = detail ? `<img class="project-image" src="images/${detail.image}.svg" alt="${escapeHTML(detail.alt)}" width="640" height="360" loading="lazy">` : "";
    const tags = detail ? `<div class="project-tags">${detail.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div>` : "";
    const link = publicURL(repoURL);
    const site = publicURL(homepage);
    const starLabel = Number.isSafeInteger(stars) && stars >= 0 ? `${stars}` : "정보 없음";
    return `<article class="project-card">
      ${image}<div class="project-content">
        <p class="project-category">${detail?.category ?? (fork ? "PUBLIC REPOSITORY / FORK" : "PUBLIC REPOSITORY")}</p>
        <h3>${escapeHTML(name)}</h3>
        <p class="project-description">${escapeHTML(detail?.description ?? (description || "저장소에서 자세한 내용을 확인할 수 있습니다."))}</p>
        ${tags}<div class="project-meta"><span>${escapeHTML(language || "언어 정보 없음")}</span><span aria-label="GitHub 스타 ${escapeHTML(starLabel)}">☆ ${escapeHTML(starLabel)}</span></div>
        <div class="project-links">${link ? `<a href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">저장소 보기 <span class="sr-only">(새 창)</span>↗</a>` : "<span>저장소 링크 없음</span>"}${site ? `<a href="${escapeHTML(site)}" target="_blank" rel="noopener noreferrer">사이트 보기 <span class="sr-only">(새 창)</span>↗</a>` : ""}</div>
      </div></article>`;
  };

  const render = () => {
    grid.setAttribute("aria-busy", String(state.phase === "loading"));
    status.classList.toggle("is-loading", state.phase === "loading");
    grid.innerHTML = state.phase === "success" ? state.repos.map(cardHTML).join("") : "";
    status.replaceChildren();
    const message = document.createElement("p");
    if (state.phase === "loading") message.textContent = "GitHub 프로젝트를 불러오는 중입니다…";
    if (state.phase === "empty") message.textContent = "표시할 프로젝트가 없습니다.";
    if (state.phase === "error") message.textContent = state.error;
    if (state.phase === "success") message.textContent = `GitHub 공개 저장소 ${state.repos.length}개${state.missing.length ? ` · ${state.missing.join("·")}는 현재 공개 응답에 없어 카드에 포함하지 않았습니다.` : " · 실제 저장소 정보로 표시합니다."}`;
    status.append(message);
    if (state.phase === "error") {
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "button button-secondary";
      retry.textContent = "다시 시도";
      retry.addEventListener("click", loadProjects);
      status.append(retry);
    }
  };

  const loadProjects = async () => {
    if (state.phase === "loading") return;
    state.phase = "loading";
    state.error = "";
    render();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const all = [];
      let page = 1;
      let more = true;
      while (more) {
        const response = await fetch(`${endpoint}?per_page=100&sort=pushed&page=${page}`, { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } });
        if (!response.ok) {
          const error = new Error("GitHub 응답 오류");
          error.status = response.status;
          throw error;
        }
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("올바르지 않은 응답");
        all.push(...data);
        more = data.length === 100;
        page += 1;
      }
      const names = new Set();
      state.repos = all.filter((repo) => {
        if (!repo || typeof repo.name !== "string" || !repo.name.trim() || repo.private) return false;
        const name = repo.name.toLowerCase();
        if (names.has(name)) return false;
        names.add(name);
        return true;
      }).sort((a, b) => (detailFor(a.name)?.rank ?? 3) - (detailFor(b.name)?.rank ?? 3));
      state.missing = ["Loom", "DeepQuest", "TinyPilot-KVM-Docker"].filter((name) => !names.has(name.toLowerCase()));
      state.phase = state.repos.length ? "success" : "empty";
    } catch (error) {
      state.repos = [];
      state.phase = "error";
      state.error = error.status === 403 || error.status === 429
        ? "요청 제한으로 프로젝트를 불러올 수 없습니다. 잠시 후 다시 시도해주세요."
        : "프로젝트를 불러올 수 없습니다. 네트워크 상태를 확인하고 다시 시도해주세요.";
    } finally {
      clearTimeout(timeout);
      render();
    }
  };

  loadProjects();
})();
