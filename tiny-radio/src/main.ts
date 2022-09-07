import './style.css'

let audio = <HTMLIFrameElement>document.getElementById("audio");

let title = <HTMLParagraphElement>document.getElementById("title");
let backdrop = <HTMLImageElement>document.getElementById("backdrop");
let bannerImage = <HTMLImageElement>document.getElementById("bannerImage");

let previousButton = <HTMLImageElement>document.getElementById("previous");
let nextButton = <HTMLImageElement>document.getElementById("next");
let playButton = <HTMLImageElement>document.getElementById("play");


let stationDB = ["6uE8SJFBjZc", "HW_vf_aDWws", "jfKfPfyJRdk"];
let idList = ["6uE8SJFBjZc", "HW_vf_aDWws", "jfKfPfyJRdk"];

let playing = true;
let currentStationIndex = 0;



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
    playing = !playing;

    playing == true
        ? playButton.src = "/src/images/pause.svg"
        : playButton.src = "/src/images/play.svg";
}

function resetPlayIcon() {
    playing = true;
    playButton.src = "/src/images/pause.svg"
}



window.addEventListener("load", async () => {
    await getStationData();

    currentStationIndex = Math.floor(Math.random() * stationDB.length);
    setData(stationDB[currentStationIndex], idList[currentStationIndex]);
});


playButton.addEventListener('click', toggleSound);
previousButton.addEventListener('click', previousStation);
nextButton.addEventListener('click', nextStation);


// Design list screen on figma
// ["Genre", "Url"] structure for station data
// title is a link to stream
// default volume to 50

// On load, for each video id, fetch the information with noembed and push it into "Stations" list.
// Pick a random song of the stations list
// When "list icon" is clicked, use the data on stations list to create new cards.