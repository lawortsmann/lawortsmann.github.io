(function () {
    var stored = null;
    try {
        stored = localStorage.getItem("theme");
    } catch (e) {}
    var initial =
        stored ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light");
    document.documentElement.setAttribute("data-theme", initial);
})();

var SUN_SVG =
    '<svg viewBox="0 0 13 13" width="16" height="16" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">' +
    '<rect x="5" y="4" width="3" height="1"/>' +
    '<rect x="4" y="5" width="5" height="3"/>' +
    '<rect x="5" y="8" width="3" height="1"/>' +
    '<rect x="6" y="1" width="1" height="2"/>' +
    '<rect x="6" y="10" width="1" height="2"/>' +
    '<rect x="1" y="6" width="2" height="1"/>' +
    '<rect x="10" y="6" width="2" height="1"/>' +
    '<rect x="2" y="2" width="1" height="1"/>' +
    '<rect x="3" y="3" width="1" height="1"/>' +
    '<rect x="10" y="2" width="1" height="1"/>' +
    '<rect x="9" y="3" width="1" height="1"/>' +
    '<rect x="2" y="10" width="1" height="1"/>' +
    '<rect x="3" y="9" width="1" height="1"/>' +
    '<rect x="10" y="10" width="1" height="1"/>' +
    '<rect x="9" y="9" width="1" height="1"/>' +
    "</svg>";

var MOON_SVG =
    '<svg viewBox="0 0 17 17" width="16" height="16" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">' +
    '<path d="M6 0h3v1h-3zM4 1h4v1h-4zM2 2h5v1h-5zM1 3h5v1h-5zM1 4h5v1h-5zM1 5h5v1h-5zM0 6h6v1h-6zM0 7h6v1h-6zM0 8h6v1h-6zM16 8h1v1h-1zM0 9h7v1h-7zM15 9h2v1h-2zM0 10h8v1h-8zM14 10h3v1h-3zM1 11h15v1h-15zM1 12h15v1h-15zM1 13h15v1h-15zM2 14h13v1h-13zM4 15h10v1h-10zM6 16h5v1h-5z"/>' +
    "</svg>";

function setThemeToggleLabel() {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    var current = document.documentElement.getAttribute("data-theme");
    btn.innerHTML = current === "dark" ? SUN_SVG : MOON_SVG;
    btn.setAttribute(
        "aria-label",
        current === "dark" ? "Switch to light mode" : "Switch to dark mode",
    );
}

function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
        localStorage.setItem("theme", next);
    } catch (e) {}
    setThemeToggleLabel();
}

document.addEventListener("DOMContentLoaded", function () {
    setThemeToggleLabel();
    var btn = document.getElementById("themeToggle");
    if (btn) btn.addEventListener("click", toggleTheme);

    // The color squares grow on :hover, but touch screens can't hover —
    // grow them while pressed (touch or mouse) and shrink on release, so
    // they're interactive on mobile too.
    var squares = document.querySelectorAll(".color-squares span");
    squares.forEach(function (sq) {
        var grow = function () {
            sq.classList.add("poked");
        };
        var shrink = function () {
            sq.classList.remove("poked");
        };
        sq.addEventListener("pointerdown", grow);
        sq.addEventListener("pointerup", shrink);
        sq.addEventListener("pointerleave", shrink);
        sq.addEventListener("pointercancel", shrink);
    });
});
