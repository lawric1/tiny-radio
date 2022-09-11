import './style.css'

let audio = <HTMLIFrameElement>document.getElementById("audio");

let title = <HTMLParagraphElement>document.getElementById("title");
let backdrop = <HTMLImageElement>document.getElementById("backdrop");
let thumbnail = <HTMLImageElement>document.getElementById("thumbnail");

let previousButton = <HTMLImageElement>document.getElementById("previous");
let nextButton = <HTMLImageElement>document.getElementById("next");
let playButton = <HTMLImageElement>document.getElementById("play");
let menuButton = <HTMLImageElement>document.getElementById("menu");

let menuContainer = <HTMLImageElement>document.getElementById("menu-container");
let menuList = <HTMLImageElement>document.getElementById("menu-list");


let stationDB: object[] = [];
let idList = ["6uE8SJFBjZc", "kgx4WGK0oNU", "jfKfPfyJRdk", "vWpeYCEAaCA", "d3SV2tKr6BY"];

let currentStationIndex = 0;

let isAudioPlaying = true;
let isMenuOpen = false



async function getStationData() {
    stationDB = await Promise.all(
        idList.map(async (ID) => {
            let URL = "https://www.youtube.com/watch?v=" + ID;
            let noembedURL = "https://noembed.com/embed?url=" + URL;

            let data = await fetch(noembedURL).then(response => response.json());
            return data;
        }));
}

async function setData(station: any, stationID: string) {
    let thumbnailURL = "https://img.youtube.com/vi/" + stationID + "/maxresdefault.jpg";
    let audioURL = "https://www.youtube.com/embed/" + stationID + "?autoplay=1&mute=0";

    audio.src = audioURL;
    title.innerHTML = station.title;
    backdrop.src = thumbnailURL;
    thumbnail.src = thumbnailURL;
}


function toggleSound() {
    console.log("1");
    setPlayIcon();

    // State can be "0" (unmuted) or "1" (muted)
    let state = audio.src.slice(-1);
    let url = audio.src.slice(0, -1);

    if (state === "0") {
        audio.src = url + "1"
    } else {
        audio.src = url + "0"
    }
}

function previousStation() {
    resetPlayIcon();

    currentStationIndex = (currentStationIndex - 1) % stationDB.length;
    setData(stationDB[currentStationIndex], idList[currentStationIndex]);
}

function nextStation() {
    resetPlayIcon();

    currentStationIndex = (currentStationIndex + 1) % stationDB.length;
    setData(stationDB[currentStationIndex], idList[currentStationIndex]);
}

function goToStation(index: number) {
    resetPlayIcon();

    currentStationIndex = index;
    setData(stationDB[currentStationIndex], idList[currentStationIndex]);

    toggleMenu();
}


function setPlayIcon() {
    isAudioPlaying = !isAudioPlaying;

    isAudioPlaying == true
        ? playButton.src = "\\src\\images\\pause.svg"
        : playButton.src = "\\src\\images\\play.svg";
}

function resetPlayIcon() {
    isAudioPlaying = true;
    playButton.src = "\\src\\images\\pause.svg"
}


function toggleMenu() {
    isMenuOpen
        ? menuContainer.style.display = "none"
        : menuContainer.style.display = "block";

    isMenuOpen = !isMenuOpen;
}

function setMenuData() {
    for (let i = 0; i < stationDB.length; i++) {
        let thumbnailURL = "https://img.youtube.com/vi/" + idList[i] + "/maxresdefault.jpg";
        let station: any = stationDB[i]

        menuList.innerHTML += `
            <div class="card">
                <div class="image-container">
                    <img class="card-image" src=${thumbnailURL}>
                </div>
                <div class="text-container">
                    <p>Chiptune</p>
                    <p>${station.title}</p>
                </div>
                <img id=${i} class="icon" src="\\src\\images\\play.svg"/>
            </div>
        `
    }
}


window.addEventListener("load", async () => {
    await getStationData();

    currentStationIndex = Math.floor(Math.random() * stationDB.length);
    setData(stationDB[currentStationIndex], idList[currentStationIndex]);

    setMenuData();
});


playButton.addEventListener('click', toggleSound);
previousButton.addEventListener('click', previousStation);
nextButton.addEventListener('click', nextStation);

menuButton.addEventListener('click', toggleMenu);

document.addEventListener('click', function (event) {
    let target = event.target as HTMLElement;
    let id = Number(target.id);

    if (isNaN(id)) {
        return;
    }

    goToStation(id);
});


// title is a link to stream
// default volume to 50

// disable keyboard and options
// add genre
// Design search screen on figma
// fix path issues on build
// Clickable links on menu

// Add hover animations;