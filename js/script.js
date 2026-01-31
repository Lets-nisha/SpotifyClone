// 🎵 Final Script with Login/Signup System - FIXED FOR GITHUB PAGES

let currentSong = new Audio();
let songs = [];
let currtFolder = "";
let loggedInUser = localStorage.getItem("spotifyUser");

//  Format seconds → mm:ss
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

//  LOGIN / SIGNUP MODAL HANDLER
const authModal = document.getElementById("authModal");
const authTitle = document.getElementById("modalTitle");
const authAction = document.getElementById("authAction");
const toggleAuth = document.getElementById("toggleAuth");
const toggleText = document.getElementById("toggleText");
const loginBtn = document.querySelector(".loginbtn");
const signupBtn = document.querySelector(".signupbtn");
const logoutBtn = document.querySelector(".logoutbtn");

let isLogin = true;

function openModal(mode = "login") {
  isLogin = mode === "login";
  authTitle.textContent = isLogin ? "Login" : "Sign Up";
  authAction.textContent = isLogin ? "Login" : "Sign Up";
  toggleText.innerHTML = isLogin
    ? `Don't have an account? <span style="color:#1db954;cursor:pointer;" id="toggleAuth">Sign Up</span>`
    : `Already have an account? <span style="color:#1db954;cursor:pointer;" id="toggleAuth">Login</span>`;
  authModal.style.display = "flex";

  // event binding again
  document.getElementById("toggleAuth").onclick = () =>
    openModal(isLogin ? "signup" : "login");
}

// Button Event Listeners
loginBtn.onclick = () => openModal("login");
signupBtn.onclick = () => openModal("signup");
logoutBtn.onclick = () => {
  localStorage.removeItem("spotifyUser");
  loggedInUser = null;
  logoutBtn.style.display = "none";
  loginBtn.style.display = "inline-block";
  signupBtn.style.display = "inline-block";
  // alert("You have logged out!");
};

authAction.onclick = () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  if (!user || !pass) return alert("Please fill all fields");

  if (isLogin) {
    const stored = JSON.parse(localStorage.getItem("spotifyAccounts") || "{}");
    if (stored[user] && stored[user] === pass) {
      localStorage.setItem("spotifyUser", user);
      loggedInUser = user;
      authModal.style.display = "none";
      loginBtn.style.display = "none";
      signupBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      alert(`Welcome back, ${user}!`);
    } else {
      alert("Invalid credentials!");
    }
  } else {
    const stored = JSON.parse(localStorage.getItem("spotifyAccounts") || "{}");
    if (stored[user]) return alert("Username already exists!");
    stored[user] = pass;
    localStorage.setItem("spotifyAccounts", JSON.stringify(stored));
    alert("Signup successful! Please login.");
    openModal("login");
  }
};

 
authModal.addEventListener("click", (e) => {
  if (e.target === authModal) authModal.style.display = "none";
});

 
async function getSongs(folder) {
  currtFolder = folder;
  const res = await fetch(folder);   
  const html = await res.text();

  const div = document.createElement("div");
  div.innerHTML = html;
  const anchors = div.getElementsByTagName("a");

  songs = [];
  for (let a of anchors) {
    if (a.href.endsWith(".mp3")) {
      const fileName = decodeURIComponent(a.href.split("/").pop());
      songs.push(fileName);
    }
  }

  const songUl = document.querySelector(".songList ul");
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML += `
      <li> 
        <img class="invert" src="img/music.svg" alt="">
        <div class="info">
        <div>${song.slice(0, 15)}</div>
        <div>Nisha</div>
        </div>
        <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="img/play.svg" alt="">
        </div>
      </li>`;
  }

  Array.from(songUl.getElementsByTagName("li")).forEach((e, i) => {
    e.addEventListener("click", () => {
      if (!loggedInUser) {
        alert("Please login to play music!");
        openModal("login");
        return;
      }
      playMusic(songs[i]);
    });
  });

  return songs;
}

// ▶ Play selected song 
const playMusic = (track, pause = false) => {
  if (!loggedInUser) {
    alert("Please login to play music!");
    openModal("login");
    return;
  }

  if (!currtFolder) currtFolder = "songs/ncs";
  currentSong.src = `${currtFolder}/${track}`;
  currentSong.currentTime = 0;
  document.querySelector(".circle").style.left = "0%";

  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};


async function displayAlbums(folder = "") {   
  const res = await fetch(`songs/`);   
  const html = await res.text();
  const div = document.createElement("div");
  div.innerHTML = html;
  const anchors = div.getElementsByTagName("a");
  const cardContainer = document.querySelector(".cardContainer");
  cardContainer.innerHTML = "";

  for (let a of anchors) {
    if (a.href.includes("/songs/")) {
      const folderName = a.href.split("/").filter(Boolean).pop();
      try {
        const infoRes = await fetch(`songs/${folderName}/info.json`);  
        if (!infoRes.ok) continue;
        const data = await infoRes.json();

        cardContainer.innerHTML += `
          <div data-folder="songs/${folderName}" class="card">  
            <div class="play">
            <svg version="1.1" width="20px" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 460.114 460.114" style="enable-background:new 0 0 460.114 460.114;" xml:space="preserve">
      <g>
       <g>
         <path d="M393.538,203.629L102.557,5.543c-9.793-6.666-22.468-7.372-32.94-1.832c-10.472,5.538-17.022,16.413-17.022,28.26v396.173
           c0,11.846,6.55,22.721,17.022,28.26c10.471,5.539,23.147,4.834,32.94-1.832l290.981-198.087
           c8.746-5.954,13.98-15.848,13.98-26.428C407.519,219.477,402.285,209.582,393.538,203.629z"/>
       </g>
      </g>
      </svg>
            </div>
            <img src="songs/${folderName}/cover.jpg" alt="${data.title}" />
            <h2>${data.title}</h2>
            <p>${data.description}</p>
          </div>`;
      } catch {}
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach((card) => {
    card.addEventListener("click", async (item) => {
      if (!loggedInUser) {
        alert("Please login to access albums!");
        openModal("login");
        return;
      }
      const folder = item.currentTarget.dataset.folder;   
      songs = await getSongs(folder);
      playMusic(songs[0]);
    });
  });
}

 
async function main() {
  songs = await getSongs("songs/ncs");
  playMusic(songs[0], true);
  displayAlbums();

  if (loggedInUser) {
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  }

  play.addEventListener("click", () => {
    if (!loggedInUser) return openModal("login");
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    const current = secondsToMinutesSeconds(currentSong.currentTime);
    const total = secondsToMinutesSeconds(currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${current} / ${total}`;
    document.querySelector(".circle").style.left = `${
      (currentSong.currentTime / currentSong.duration) * 100
    }%`;
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
}

main();
