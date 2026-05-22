const PASSWORD = "a";

let pt = Number(localStorage.getItem("pt")) || 0;
let talkCount = Number(localStorage.getItem("talkCount")) || 0;

let unlocked = JSON.parse(localStorage.getItem("unlocked")) || [];

const talks = [
  "今日も研究を頑張りましょう♪",
  "ふふ、実験は好きですか？",
  "あなたが来るのを待っていました。",
  "新しい毒薬、完成しましたよ♪",
  "今日は少し眠いですね…"
];

function saveData() {
  localStorage.setItem("pt", pt);
  localStorage.setItem("talkCount", talkCount);
  localStorage.setItem("unlocked", JSON.stringify(unlocked));
}

function updatePt() {
  document.getElementById("pt-text").textContent = pt;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
}

updatePt();

// パスワード
document.getElementById("password-btn").addEventListener("click", () => {

  const value = document.getElementById("password-input").value;

  if (value === PASSWORD) {
    showScreen("title-screen");
  } else {
    document.getElementById("password-error").textContent =
      "パスワードが違います";
  }

});

// タイトル
document.getElementById("start-btn").addEventListener("click", () => {
  showScreen("lab-screen");
});

// 話す
document.getElementById("talk-btn").addEventListener("click", () => {

  talkCount++;

  let text = "";

  if (talkCount === 100) {
    text = "100回も話しかけてくれたんですね…特別ですよ♪";
  } else {
    text = talks[Math.floor(Math.random() * talks.length)];
  }

  document.getElementById("dialog-text").textContent = text;

  saveData();
});

// 実験説明へ
document.getElementById("game-btn").addEventListener("click", () => {
  showScreen("game-info-screen");
});

// ギャラリーへ
document.getElementById("gallery-btn").addEventListener("click", () => {
  createGallery();
  showScreen("gallery-screen");
});

// 戻るボタン
document.querySelectorAll(".back-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    showScreen("lab-screen");
  });
});

// ゲーム
let tapCount = 0;

let timeLeft = 10;

let tapGameActive = false;

let timerInterval = null;

// 実験開始
document.getElementById("game-start-btn").addEventListener("click", () => {

  showScreen("game-screen");

  startTapGame();

});

function startTapGame() {

  tapCount = 0;

  timeLeft = 10;

  tapGameActive = true;

  document.getElementById("tap-count").textContent =
    "0 TAP";

  document.getElementById("timer-text").textContent =
    timeLeft;

  document.getElementById("game-result").textContent =
    "";

  timerInterval = setInterval(() => {

    timeLeft--;

    document.getElementById("timer-text").textContent =
      timeLeft;

    if (timeLeft <= 0) {

      endTapGame();

    }

  }, 1000);

}

// タップ
document.getElementById("tap-area").addEventListener("click", () => {

  if (!tapGameActive) return;

  tapCount++;

  document.getElementById("tap-count").textContent =
    tapCount + " TAP";

});

// 終了
function endTapGame() {

  clearInterval(timerInterval);

  tapGameActive = false;

  let gained = 1;

  let comment = "";

  if (tapCount >= 300) {

    gained = 50;

    comment =
      "すごい…指、大丈夫ですか…？";

  }
  else if (tapCount >= 200) {

    gained = 20;

    comment =
      "かなり優秀ですね♪";

  }
  else if (tapCount >= 100) {

    gained = 10;

    comment =
      "悪くない結果です♪";

  }
  else {

    gained = 1;

    comment =
      "もっと頑張ってくださいね？";

  }

  pt += gained;

  updatePt();

  saveData();

  document.getElementById("game-result").innerHTML =
    `
    ${tapCount} TAP<br>
    ${gained}pt獲得！<br><br>
    ${comment}
    `;

  setTimeout(() => {

    showScreen("lab-screen");

  }, 4000);

}


// ギャラリー
function createGallery() {

  const grid = document.getElementById("gallery-grid");

  grid.innerHTML = "";

  for (let i = 1; i <= 30; i++) {

    const item = document.createElement("div");

    item.className = "gallery-item";

    const img = document.createElement("img");

    img.src = `images/gallery/${i}.jpg`;

    const isUnlocked = unlocked.includes(i);

    const cost = i >= 25 ? 100 : 10;

    if (!isUnlocked) {

      img.classList.add("locked");

      item.innerHTML = `
        <p>???</p>
        <button onclick="unlockImage(${i}, ${cost})">
          ${cost}ptで開放
        </button>
      `;

    } else {

      item.appendChild(img);

    }

    if (isUnlocked) {
      item.prepend(img);
    }

    grid.appendChild(item);

  }

}

function unlockImage(id, cost) {

  if (pt < cost) {
    alert("ptが足りません");
    return;
  }

  pt -= cost;

  unlocked.push(id);

  updatePt();

  saveData();

  createGallery();

}
