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

function initThemeAndSquares() {
  setThemeToggleLabel();
  var btn = document.getElementById("themeToggle");
  if (btn) btn.addEventListener("click", toggleTheme);

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
}

function initTypewriter() {
  var texts = [
    "I am *Luke Wortsmann*.",
    "I currently live in *Chicago*.",
    "I studied *Physics* at the University of Illinois Urbana-Champaign.",
    "I am a Quantitative Researcher, Data Scientist, and *Software Engineer*.",
  ];
  var typingContainers = [
    document.getElementById("typingText1"),
    document.getElementById("typingText2"),
    document.getElementById("typingText3"),
    document.getElementById("typingText4"),
  ];
  var typingSpeed = 30;
  var delayBetweenTexts = 300;

  function typeWriter(text, container, delay) {
    var i = 0;
    var highlighting = false;
    setTimeout(function () {
      var typingInterval = setInterval(function () {
        if (i < text.length) {
          if (text.charAt(i) == "*") {
            if (highlighting) {
              highlighting = false;
            } else {
              var span = document.createElement("span");
              span.className = "highlight";
              container.appendChild(span);
              highlighting = true;
            }
          } else {
            var textNode = document.createTextNode(text.charAt(i));
            if (highlighting) {
              container.lastChild.appendChild(textNode);
            } else {
              container.appendChild(textNode);
            }
          }
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, typingSpeed);
    }, delay);
  }

  texts.forEach((text, index) => {
    typeWriter(text, typingContainers[index], delayBetweenTexts * index);
  });

  var flashPalette = [
    "#21201e",
    "#b12c3b",
    "#db9931",
    "#6f4e37",
    "#325941",
    "#3e4ca1",
    "#d3d7d1",
    "#d66132",
    "#4d0300",
    "#3f6f42",
  ];
  var squares = document.querySelectorAll(".color-squares span");
  var cycleSpeed = 90;
  var lockStart = 400;

  var typingDone = 0;
  texts.forEach(function (text, index) {
    typingDone = Math.max(
      typingDone,
      delayBetweenTexts * index + text.length * typingSpeed,
    );
  });

  var locked = new Array(squares.length).fill(false);
  var step = 0;
  var cycleInterval = setInterval(function () {
    step++;
    var taken = [];
    squares.forEach(function (sq, i) {
      if (locked[i]) taken.push(flashPalette[i]);
    });
    var available = flashPalette.filter(function (c) {
      return taken.indexOf(c) === -1;
    });
    var k = 0;
    squares.forEach(function (sq, i) {
      if (locked[i]) return;
      sq.style.backgroundColor = available[(step + k) % available.length];
      k++;
    });
  }, cycleSpeed);

  var lockGap = (typingDone - lockStart) / squares.length;
  squares.forEach(function (sq, i) {
    setTimeout(
      function () {
        locked[i] = true;
        sq.style.backgroundColor = "";
      },
      lockStart + lockGap * (i + 1),
    );
  });

  setTimeout(function () {
    clearInterval(cycleInterval);
    squares.forEach(function (sq) {
      sq.style.backgroundColor = "";
    });
  }, typingDone + cycleSpeed);
}

function initAttractor() {
  var canvas = document.getElementById("attractor");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var W = canvas.width;
  var H = canvas.height;

  var u = 0.918;

  var X0 = -15,
    X1 = 12,
    Y0 = -7,
    Y1 = 11;

  var NUM = 2048 + 512;
  var RAMP = 30;
  var MAX_FRAMES = 32;
  var TRAIL = 12;
  var BASE_ALPHA = 0.3;

  var minX = X0 - 0.5 * (X1 - X0);
  var maxX = X1;
  var minY = Y0 - 0.5 * (Y1 - Y0);
  var maxY = Y1;

  var margin = 12;
  var scale = Math.min(
    (W - 2 * margin) / (maxX - minX || 1),
    (H - 2 * margin) / (maxY - minY || 1),
  );
  var offX = W - margin - scale * maxX;
  var offY = H - margin - scale * maxY;

  ctx.lineWidth = 1;

  var NP = MAX_FRAMES + 1;
  var ptsX = new Float64Array(NUM * NP);
  var ptsY = new Float64Array(NUM * NP);
  var start = new Int32Array(NUM);

  for (var k = 0; k < NUM; k++) {
    var px = X0 + Math.random() * (X1 - X0);
    var py = Y0 + Math.random() * (Y1 - Y0);
    start[k] = (Math.random() * RAMP) | 0;
    var len = MAX_FRAMES - start[k];
    for (var n = 0; n <= len; n++) {
      ptsX[k * NP + n] = offX + px * scale;
      ptsY[k * NP + n] = offY + py * scale;
      if (n < len) {
        var t = 0.4 - 6 / (1 + px * px + py * py);
        var st = Math.sin(t),
          ct = Math.cos(t);
        var nx = 1 + u * (px * ct - py * st);
        py = u * (px * st + py * ct);
        px = nx;
      }
    }
  }

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.beginPath();
    for (var rk = 0; rk < NUM; rk++) {
      var rlen = MAX_FRAMES - start[rk];
      for (var rj = 0; rj < rlen; rj++) {
        var rb = rk * NP + rj;
        ctx.moveTo(ptsX[rb], ptsY[rb]);
        ctx.lineTo(ptsX[rb + 1], ptsY[rb + 1]);
      }
    }
    ctx.stroke();
    return;
  }

  var FRAME_DELAY = 70;
  var F = 0;

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (var segAge = 0; segAge < MAX_FRAMES; segAge++) {
      ctx.strokeStyle =
        "rgba(0, 0, 0, " + BASE_ALPHA * Math.max(0, 1 - segAge / TRAIL) + ")";
      ctx.beginPath();
      for (var p = 0; p < NUM; p++) {
        var a = F - start[p];
        if (a < 0) continue;
        var j = a - 1 - segAge;
        if (j < 0) continue;
        var b = p * NP + j;
        ctx.moveTo(ptsX[b], ptsY[b]);
        ctx.lineTo(ptsX[b + 1], ptsY[b + 1]);
      }
      ctx.stroke();
    }
    F++;
    if (F <= MAX_FRAMES) {
      setTimeout(function () {
        requestAnimationFrame(frame);
      }, FRAME_DELAY);
    }
  }
  requestAnimationFrame(frame);
}

function initCvGate() {
  var downloadLink = document.getElementById("downloadLink");
  if (!downloadLink) return;

  function showPasswordInput() {
    document.getElementById("downloadLink").style.display = "none";
    document.getElementById("passwordInput").style.display = "block";
    document.getElementById("resumePassword").focus();
  }

  function checkPassword() {
    var correctPassword = "8130";
    var userPassword = document.getElementById("resumePassword").value;
    if (userPassword === correctPassword) {
      document.getElementById("passwordInput").style.display = "none";
      document.getElementById("downloadLink").style.display = "block";
      document.getElementById("resumePassword").value = "";
      window.open("lw_resume.pdf");
    } else {
      alert("Incorrect password.");
      document.getElementById("resumePassword").value = "";
    }
  }

  downloadLink.addEventListener("click", showPasswordInput);
  document
    .getElementById("resumePassword")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        checkPassword();
      }
    });
  document
    .getElementById("submitPassword")
    .addEventListener("click", checkPassword);
}

document.addEventListener("DOMContentLoaded", function () {
  initThemeAndSquares();
  if (document.getElementById("typingText1")) initTypewriter();
  if (document.getElementById("attractor")) initAttractor();
  if (document.getElementById("downloadLink")) initCvGate();
});
