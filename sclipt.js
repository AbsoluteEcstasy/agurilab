const password = "a";

let pt = Number(localStorage.getItem("pt")) || 0;
let talkCount = Number(localStorage.getItem("talkCount")) || 0;
let unlocked = JSON.parse(localStorage.getItem("unlocked")) || [];

const talks = [
  "今日は来てくれたのね。",
  "ふふ、退屈してたところ。",
  "あなた、面白い人ね。",
  "また会えたわね。",
  "そんなに見つめないで。"
];

const specialTalk =
  "100回も話しかけるなんて…本当に好きなのね。";

const screens = {
  password: document.getElementById("passwordScreen"),
  title: document.getElementById("titleScreen"),
  main: document.getElementById("mainScreen"),
  play: document.getElementById("playScreen"),
  gallery: document.getElementById("galleryScreen")
};

function showScreen(name){
  Object.values(screens).forEach(s=>{
    s.classList.add("hidden");
  });

  screens[name].classList.remove("hidden");
}

function updatePt(){
  document.getElementById("ptText").textContent = pt;
  document.getElementById("galleryPt").textContent = pt;

  localStorage.setItem("pt", pt);
}

document.getElementById("passwordBtn").onclick = ()=>{
  const value =
    document.getElementById("passwordInput").value;

  if(value === password){
    showScreen("title");
  }else{
    alert("パスワードが違います");
  }
};

document.getElementById("startBtn").onclick = ()=>{
  showScreen("main");
  updatePt();
};

document.getElementById("talkBtn").onclick = ()=>{

  talkCount++;
  localStorage.setItem("talkCount", talkCount);

  const box = document.getElementById("dialogueBox");

  if(talkCount === 100){
    box.textContent = specialTalk;
  }else{
    const random =
      talks[Math.floor(Math.random()*talks.length)];

    box.textContent = random;
  }

  box.classList.remove("hidden");

  setTimeout(()=>{
    box.classList.add("hidden");
  },3000);
};

document.getElementById("playBtn").onclick = ()=>{
  showScreen("play");

  document.getElementById("playDialogue").innerHTML =
    "いくわよ？<br>じゃーんけーん…";

  document.getElementById("handButtons").style.display =
    "flex";
};

function playGame(player){

  document.getElementById("handButtons").style.display =
    "none";

  const hands = ["グー","チョキ","パー"];
  const enemy =
    hands[Math.floor(Math.random()*3)];

  let result = "";
  let gain = 0;

  if(player === enemy){
    result = "あら、気が合うわね";
    gain = 2;
  }
  else if(
    (player==="グー" && enemy==="チョキ") ||
    (player==="チョキ" && enemy==="パー") ||
    (player==="パー" && enemy==="グー")
  ){
    result = "あなたの勝ちよ";
    gain = 5;
  }
  else{
    result = "ふふっ、私の勝ち";
    gain = 1;
  }

  pt += gain;
  updatePt();

  document.getElementById("playDialogue").innerHTML =
    `あぐりは「${enemy}」<br><br>${result}<br>${gain}pt獲得`;
}

window.playGame = playGame;

function backMain(){
  showScreen("main");
}

window.backMain = backMain;

document.getElementById("galleryBtn").onclick = ()=>{
  showScreen("gallery");
  buildGallery();
};

function buildGallery(){

  const grid =
    document.getElementById("galleryGrid");

  grid.innerHTML = "";

  for(let i=1;i<=30;i++){

    const item =
      document.createElement("div");

    item.className = "galleryItem";

    const cost = i >= 25 ? 100 : 10;

    if(unlocked.includes(i)){

      const img =
        document.createElement("img");

      img.src = `ga${i}.png`;

      img.onclick = ()=>{
        openViewer(img.src);
      };

      item.appendChild(img);

    }else{

      item.classList.add("locked");
      item.innerHTML =
        `LOCK<br>${cost}PT`;

      item.onclick = ()=>{

        if(pt >= cost){

          pt -= cost;

          unlocked.push(i);

          localStorage.setItem(
            "unlocked",
            JSON.stringify(unlocked)
          );

          updatePt();

          buildGallery();

        }else{
          alert("PT不足");
        }
      };
    }

    grid.appendChild(item);
  }
}

function openViewer(src){

  const viewer =
    document.getElementById("viewer");

  const img =
    document.getElementById("viewerImg");

  img.src = src;

  viewer.classList.remove("hidden");
}

document.getElementById("viewer").onclick = ()=>{
  document.getElementById("viewer")
    .classList.add("hidden");
};

updatePt();