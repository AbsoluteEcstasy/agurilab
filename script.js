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
const poison = document.getElementById("poison");
const target = document.getElementById("target");

let poisonY = 0;
let speed = 0;
let gameLoop = null;

document.getElementById("game-start-btn").addEventListener("click", startGame);

function startGame() {

  showScreen("game-screen");

  poisonY = 0;

  poison.style.top = "0px";

  speed = Math.random() * 5 + 3;

  document.getElementById("game-result").textContent = "";

  gameLoop = setInterval(() => {

    poisonY += speed;

    poison.style.top = poisonY + "px";

    const targetTop = 470;

    if (poisonY >= targetTop) {

      clearInterval(gameLoop);

      document.getElementById("game-result").textContent =
        "失敗… 0pt";

    }

  }, 16);

}

document.getElementById("stop-btn").addEventListener("click", () => {

  clearInterval(gameLoop);

  const poisonRect = poison.getBoundingClientRect();

  const targetRect = target.getBoundingClientRect();

  const distance =
    targetRect.top - poisonRect.bottom;

  let gained = 0;

  // 当たった
  if (distance < 0) {

    gained = 0;

  }
  // 超ギリギリ
  else if (distance <= 10) {

    gained = 30;

  }
  // かなり近い
  else if (distance <= 35) {

    gained = 10;

  }
  // 普通
  else if (distance <= 80) {

    gained = 2;

  }
  // 遠い
  else {

    gained = 0;

  }

  pt += gained;

  updatePt();

  saveData();

  document.getElementById("game-result").textContent =
    gained + "pt 獲得！";

  setTimeout(() => {

    showScreen("lab-screen");

  }, 1500);

});


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
