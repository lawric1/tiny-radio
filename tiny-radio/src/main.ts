import './style.css'

let audio = <HTMLIFrameElement>document.getElementById("audio");

let title = <HTMLParagraphElement>document.getElementById("title");
let backdrop = <HTMLImageElement>document.getElementById("backdrop");
let bannerImage = <HTMLImageElement>document.getElementById("bannerImage");

let previousButton = <HTMLImageElement>document.getElementById("previous");
let nextButton = <HTMLImageElement>document.getElementById("next");
let playButton = <HTMLImageElement>document.getElementById("play");
let menuButton = <HTMLImageElement>document.getElementById("menu");

let listContainer = <HTMLImageElement>document.getElementById("list-container");
let stationList = <HTMLImageElement>document.getElementById("station-list");


let stationDB: object[] = [];
let idList = ["6uE8SJFBjZc", "HW_vf_aDWws", "jfKfPfyJRdk"];

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
    bannerImage.src = thumbnailURL;
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


function setPlayIcon() {
    isAudioPlaying = !isAudioPlaying;

    isAudioPlaying == true
        ? playButton.src = "/src/images/pause.svg"
        : playButton.src = "/src/images/play.svg";
}

function resetPlayIcon() {
    isAudioPlaying = true;
    playButton.src = "/src/images/pause.svg"
}


function toggleMenu() {
    console.log(isMenuOpen);


    isMenuOpen
        ? listContainer.style.display = "none"
        : listContainer.style.display = "block";

    isMenuOpen = !isMenuOpen;
}

function setMenuData() {
    for (let i = 0; i < stationDB.length; i++) {
        let thumbnailURL = "https://img.youtube.com/vi/" + idList[i] + "/maxresdefault.jpg";
        let station: any = stationDB[i]

        stationList.innerHTML += `
            <div class="card">
                <div class="image-container">
                    <img class="card-image" src=${thumbnailURL}>
                </div>
                <div class="text-container">
                    <p>Chiptune</p>
                    <p>${station.title}</p>
                </div>
                <img id=${i} class="icon" src="/src/images/play.svg" />
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

// Design list screen on figma
// ["Genre", "Url"] structure for station data
// title is a link to stream
// default volume to 50

// Add animations to buttons
// Change font
// disable keyboard and options
// use hyphen to name styles and ids
// fix padding issues in banner title
// add genre