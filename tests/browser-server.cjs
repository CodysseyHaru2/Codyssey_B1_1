// 브라우저 QA 전용. 실제 사이트/공개 배포에 포함하지 않습니다.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const endpoint = "https://api.github.com/users/develsvai/repos";
const scenarios = new Set(["success", "empty", "error", "limited", "loading"]);
const fixture = [
  { name: "TinyPilot-KVM-Docker", description: null, language: "C", stargazers_count: 0, html_url: "https://github.com/develsvai/TinyPilot-KVM-Docker", homepage: null },
  { name: "test-repository-with-a-very-long-name-for-responsive-layout", description: "브라우저 레이아웃 시험용 저장소입니다. 실제 사용자 프로젝트나 GitHub 실 응답이 아닙니다.", language: "JavaScript", stargazers_count: 0, html_url: "https://github.com/", homepage: null },
  { name: "test-missing-values", description: null, language: null, stargazers_count: 0, html_url: "https://github.com/", homepage: null },
  { name: "test-fork", description: "QA 전용 대체 응답", language: null, stargazers_count: 0, html_url: "https://github.com/", homepage: null, fork: true }
];
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml" };
const server = http.createServer((request, response) => {
  const url = new URL(request.url, "http://127.0.0.1:4174");
  const parts = url.pathname.split("/").filter(Boolean);
  const scenario = parts[0] === "cases" && scenarios.has(parts[1]) ? parts[1] : "";
  if (!scenario) { response.writeHead(404); response.end("QA route not found"); return; }
  const relative = parts.slice(2).join("/") || "index.html";
  if (relative === "api/repos") {
    if (scenario === "loading") { response.writeHead(200, { "Content-Type": "application/json" }); response.write("["); return; }
    response.writeHead(scenario === "limited" ? 403 : scenario === "error" ? 500 : 200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    response.end(JSON.stringify(scenario === "empty" ? [] : fixture));
    return;
  }
  if (!["index.html", "css/style.css", "js/main.js", "js/projects.js", "js/contact.js", "images/profile.svg", "images/loom.svg", "images/deepquest.svg", "images/tinypilot.svg"].includes(relative)) {
    response.writeHead(404); response.end("Asset not allowed"); return;
  }
  let body = fs.readFileSync(path.join(root, relative));
  if (relative === "js/projects.js") body = body.toString().replace(endpoint, `http://127.0.0.1:4174/cases/${scenario}/api/repos`);
  response.writeHead(200, { "Content-Type": mime[path.extname(relative)], "Cache-Control": "no-store" });
  response.end(body);
});
server.listen(4174, "127.0.0.1", () => console.log("QA only: http://127.0.0.1:4174/cases/success/ (success/empty/error/limited/loading)"));
