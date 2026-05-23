const PASSWORD = "a";

let playCount = Number(localStorage.getItem("playCount")) || 0;

let winStreak = 0;
let loseStreak = 0;
let drawStreak = 0;

let achievements =
JSON.parse(localStorage.getItem("achievements")) || [];

const achievementData = [

{
  id:"talk1",
  name:"初めての会話",
  desc:"初めてあぐりと会話した"
},

{
  id:"play1",
  name:"初めてのじゃんけん",
  desc:"初めてあぐりと遊んだ"
},

{
  id:"gallery1",
  name:"初めてのイラスト",
  desc:"初めてギャラリーを開放した"
},

{
  id:"talk100",
  name:"おしゃべり好き",
  desc:"あぐりと100回話した"
},

{
  id:"play100",
  name:"じゃんけん好き",
  desc:"あぐりと100回遊んだ"
},

{
  id:"galleryAll",
  name:"イラストコレクター",
  desc:"ギャラリーを全開放した"
},

{
  id:"win5",
  name:"豪運",
  desc:"じゃんけんで5連勝した"
},

{
  id:"lose5",
  name:"逆に豪運",
  desc:"じゃんけんで5連敗した"
},

{
  id:"draw5",
  name:"以心伝心",
  desc:"じゃんけんで5連続あいこになった"
}

];

function unlockAchievement(id){

  if(achievements.includes(id)) return;

  achievements.push(id);

  localStorage.setItem(
    "achievements",
    JSON.stringify(achievements)
  );

  const achievement =
    achievementData.find(a => a.id === id);

  const popup =
    document.getElementById("achievementPopup");

  popup.innerHTML =
    `実績「${achievement.name}」を獲得しました！`;

  popup.classList.remove("hidden");

  setTimeout(() => {
    popup.classList.add("hidden");
  }, 3000);

  renderAchievements();
}

document.getElementById("achievementBtn").onclick = () => {

  showScreen("achievement");

  renderAchievements();
};

document.getElementById("achievementBackBtn").onclick = () => {

  showScreen("main");
};

function renderAchievements(){

  const list =
    document.getElementById("achievementList");

  list.innerHTML = "";

  achievementData.forEach(a => {

    const item = document.createElement("div");

    item.className = "achievementItem";

    if(achievements.includes(a.id)){

      item.innerHTML = a.name;

      item.onclick = () => {
        alert(a.desc);
      };

    }else{

      item.classList.add("achievementLocked");

      item.innerHTML = "？？？";
    }

    list.appendChild(item);
  });
}

unlockAchievement("talk1");

if(talkCount >= 100){
  unlockAchievement("talk100");
}

unlockAchievement("gallery1");

if(unlocked.length >= 18){
  unlockAchievement("galleryAll");
}

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
  "今日は少し機嫌がいいの",
  "閣下はお元気かしら",
  "今日のノルマは済んだ？",
  "そんなに私が気になる？",
  "データが足りないわ",
  "年齢？……秘密よ",
  "さあ、実験開始よ"
];

const morningTalks = [
  "おはよう。今日もよろしく頼むわ",
  "朝から来るなんて、熱心ね",
  "ふふっ、眠そうな顔"
];

const noonTalks = [
  "データの整理をしてくるわ",
  "午後も頑張りましょう",
  "勝利の様子でも見に行こうかしら"
];

const eveningTalks = [
  "今日もお疲れ様",
  "明日は何から始めようかしら……",
  "夕焼けが綺麗ね。ピンク色だけど"
];

const nightTalks = [
  "夜は少し素直になれる気がするの",
  "静かな時間ね。悪くないわ",
  "ええ、また明日。"
];

const lateNightTalks = [
  "あら、まだ起きてたの？",
  "夜更かしは美容の敵よ",
  "眠れないの？……仕方ないわね"
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
    dialogBox.innerText = "100回も会いに来るなんて…本当に物好きね";
  }else{
   const hour = new Date().getHours();

let timeTalks = [];

if(hour >= 5 && hour <= 10){

  // 朝 5:00~10:59
  timeTalks = morningTalks;

}else if(hour >= 11 && hour <= 15){

  // 昼 11:00~15:59
  timeTalks = noonTalks;

}else if(hour >= 16 && hour <= 18){

  // 夕 16:00~18:59
  timeTalks = eveningTalks;

}else if(hour >= 19 && hour <= 22){

  // 夜 19:00~22:59
  timeTalks = nightTalks;

}else{

  // 深夜 23:00~4:59
  timeTalks = lateNightTalks;
}

// 通常＋時間帯セリフを合体
const mixedTalks = [
  ...normalTalks,
  ...timeTalks
];

// ランダム表示
dialogBox.innerText =
  mixedTalks[Math.floor(Math.random() * mixedTalks.length)];
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

  playCount++;
  localStorage.setItem("playCount", playCount);

  unlockAchievement("play1");

  if(playCount >= 100){
    unlockAchievement("play100");
  }

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

  result = "あら、気が合うわね";
  gain = 2;

  drawStreak++;
  winStreak = 0;
  loseStreak = 0;

  if(drawStreak >= 5){
    unlockAchievement("draw5");
  }
  }else if(
    (player === "グー" && aguri === "チョキ") ||
    (player === "チョキ" && aguri === "パー") ||
    (player === "パー" && aguri === "グー")
  ){
    result = "あなたの勝ちよ";
gain = 5;

winStreak++;
loseStreak = 0;
drawStreak = 0;

if(winStreak >= 5){
  unlockAchievement("win5");
}
  }else{
   result = "ふふっ、私の勝ち";
gain = 1;

loseStreak++;
winStreak = 0;
drawStreak = 0;

if(loseStreak >= 5){
  unlockAchievement("lose5");
}
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