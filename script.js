const PASSWORD = "a";

let dialogTimer = null;
let currentPage = 1;
const itemsPerPage = 9;
const screens = {
  password: document.getElementById("passwordScreen"),
  title: document.getElementById("titleScreen"),
  main: document.getElementById("mainScreen"),
  play: document.getElementById("playScreen"),
  gallery: document.getElementById("galleryScreen")
};

const dialogBox = document.getElementById("dialogBox");
const playDialog = document.getElementById("playDialog");

let pt = Number(localStorage.getItem("pt")) || 0;
let talkCount = Number(localStorage.getItem("talkCount")) || 0;
let unlocked = JSON.parse(localStorage.getItem("unlocked")) || [];

const normalTalks = [
  "今日も来てくれたのね",
  "あなたと話すの、嫌いじゃないわ",
  "ふふっ、何を考えてるの？",
  "次は勝利に何をしましょうか",
  "お腹が空いたわね……",
  "今日は少し機嫌がいいの",
  "閣下はお元気かしら",
  "今日のノルマは済んだ？",
  "そんなに私が気になる？",
  "データが足りないわ",
  "年齢？……秘密よ",
  "実験開始よ"
];

function saveData(){
  localStorage.setItem("pt", pt);
  localStorage.setItem("talkCount", talkCount);
  localStorage.setItem("unlocked", JSON.stringify(unlocked));
}

function updatePt(){
  document.getElementById("ptDisplay").innerText = pt + " pt";
  document.getElementById("galleryPt").innerText = pt + " pt";
}

function showScreen(name){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

document.getElementById("passwordBtn").onclick = () => {
  const value = document.getElementById("passwordInput").value;

  if(value === PASSWORD){
    showScreen("title");
  }else{
    document.getElementById("passwordError").innerText = "パスワードが違います";
  }
};

document.getElementById("startBtn").onclick = () => {
  showScreen("main");
};

document.getElementById("talkBtn").onclick = () => {

  talkCount++;
  localStorage.setItem("talkCount", talkCount);

  dialogBox.classList.remove("hidden");

  if(talkCount === 100){
    dialogBox.innerText = "100回も会いに来るなんて…本当に物好きね。";
  }else{
    dialogBox.innerText = normalTalks[Math.floor(Math.random() * normalTalks.length)];
  }

  // 前のタイマーを削除
  clearTimeout(dialogTimer);

  // 新しいタイマーを設定
  dialogTimer = setTimeout(() => {
    dialogBox.classList.add("hidden");
  }, 3000);
};

document.getElementById("playBtn").onclick = () => {

  document.getElementById("playBg").src = "play.png";
  showScreen("play");

  playDialog.innerText = "いくわよ？じゃーんけーん…";

  document.getElementById("jankenButtons").innerHTML = `
    <button onclick="playJanken('グー')">グー</button>
    <button onclick="playJanken('チョキ')">チョキ</button>
    <button onclick="playJanken('パー')">パー</button>
  `;
};

document.getElementById("backMainBtn").onclick = () => {
  showScreen("main");
};

function playJanken(player){

  const hands = ["グー","チョキ","パー"];
  const aguri = hands[Math.floor(Math.random() * 3)];
  const bg = document.getElementById("playBg");

if(aguri === "グー"){
  bg.src = "play_gu.png";
}else if(aguri === "チョキ"){
  bg.src = "play_choki.png";
}else{
  bg.src = "play_pa.png";
}

  document.getElementById("jankenButtons").innerHTML = `<button>${player}</button>`;

  let result = "";
  let gain = 0;

  if(player === aguri){
    result = "「あら、気が合うわね」";
    gain = 2;
  }else if(
    (player === "グー" && aguri === "チョキ") ||
    (player === "チョキ" && aguri === "パー") ||
    (player === "パー" && aguri === "グー")
  ){
    result = "「あなたの勝ちよ」";
    gain = 5;
  }else{
    result = "「ふふっ、私の勝ち」";
    gain = 1;
  }

  pt += gain;
  updatePt();
  saveData();

  playDialog.innerHTML = `
    あぐり「${aguri}」<br><br>
    ${result}<br>
  〈${gain}pt獲得〉
  `;
}

window.playJanken = playJanken;

document.getElementById("galleryBtn").onclick = () => {
  showScreen("gallery");
  renderGallery();
};

document.getElementById("galleryBackBtn").onclick = () => {
  showScreen("main");
};

function renderGallery(){
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage + 1;
const end = Math.min(start + itemsPerPage - 1, 18);

for(let i = start; i <= end; i++){

    const item = document.createElement("div");
    item.className = "galleryItem";

    const isUnlocked = unlocked.includes(i);
    const cost = i >= 16 ? 100 : 10;

    if(isUnlocked){

      if(i <= 6){
        item.innerHTML = `<img src="ga${i}.png">`;

        item.onclick = () => {
          document.getElementById("imageViewer").classList.remove("hidden");
          document.getElementById("viewerImg").src = `ga${i}.png`;
        };

      }else{
        item.innerHTML = `comming soon`;
      }

    }else{

      item.classList.add("locked");
      item.innerHTML = `No.${i}<br>${cost}pt`;

      const btn = document.createElement("button");
      btn.className = "unlockBtn";
      btn.innerText = "開放";

      btn.onclick = (e) => {
        e.stopPropagation();

        if(pt >= cost){
          pt -= cost;
          unlocked.push(i);
          saveData();
          updatePt();
          renderGallery();
        }else{
          alert("ptが足りません");
        }
      };

      item.appendChild(btn);
    }

    grid.appendChild(item);
  }
  document.getElementById("pageText").innerText =
  currentPage + " / 2";
}

document.getElementById("viewerClose").onclick = () => {
  document.getElementById("imageViewer").classList.add("hidden");
};

updatePt();

document.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });
document.getElementById("prevPageBtn").onclick = () => {
  if(currentPage > 1){
    currentPage--;
    renderGallery();
  }
};

document.getElementById("nextPageBtn").onclick = () => {
  if(currentPage < 2){
    currentPage++;
    renderGallery();
  }
};