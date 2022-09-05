import './style.css'

let audio = <HTMLIFrameElement>document.getElementById("audio");

let title = <HTMLParagraphElement>document.getElementById("title");
let backdrop = <HTMLImageElement>document.getElementById("backdrop");
let bannerImage = <HTMLImageElement>document.getElementById("bannerImage");

let previousButton = <HTMLImageElement>document.getElementById("previous");
let nextButton = <HTMLImageElement>document.getElementById("next");
let playButton = <HTMLImageElement>document.getElementById("play");


let stationDB = ["6uE8SJFBjZc", "HW_vf_aDWws", "jfKfPfyJRdk"]


function toggleSound() {
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
    let videoID: string = audio.src.slice(30, -18)
    let index: number = (stationDB.indexOf(videoID) - 1) % stationDB.length;

    setData(stationDB[index]);
}

function nextStation() {
    let videoID: string = audio.src.slice(30, -18)
    let index: number = (stationDB.indexOf(videoID) + 1) % stationDB.length;

    setData(stationDB[index]);
}


async function setData(videoID: string) {
    let url = "https://www.youtube.com/embed/" + videoID + "?autoplay=1&mute=0";
    let thumbnailURL = "https://img.youtube.com/vi/" + videoID + "/maxresdefault.jpg";

    let data = await fetch("https://noembed.com/embed?url=" + url)
        .then(reponse => reponse.json());

    title.innerHTML = data.title;
    backdrop.src = thumbnailURL;
    bannerImage.src = thumbnailURL;
    audio.src = url;
}


window.addEventListener("load", () => {
    let randomIndex = Math.floor(Math.random() * stationDB.length);
    setData(stationDB[randomIndex]);
});

playButton.addEventListener('click', toggleSound);
previousButton.addEventListener('click', previousStation);
nextButton.addEventListener('click', nextStation);