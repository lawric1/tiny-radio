import './style.css'

let audio = document.getElementById("audio") as HTMLIFrameElement;

let title = document.getElementById("title") as HTMLParagraphElement;
let backdrop = document.getElementById("backdrop") as HTMLImageElement;
let thumbnail = document.getElementById("thumbnail") as HTMLImageElement;

let previousButton = document.getElementById("previous") as HTMLImageElement;
let nextButton = document.getElementById("next") as HTMLImageElement;
let playButton = document.getElementById("play") as HTMLImageElement;
let menuButton = document.getElementById("menu") as HTMLImageElement;

let menuContainer = document.getElementById("menu-container") as HTMLElement;
let menuList = document.getElementById("menu-list") as HTMLElement;


// idList is a hardcoded list of stations that will be available. 
// The stations are basically youtube live streams.
let stationDB: object[] = [];
let idList: string[] = [
    "6uE8SJFBjZc",
    "kgx4WGK0oNU",
    "jfKfPfyJRdk",
    "vWpeYCEAaCA",
    "d3SV2tKr6BY"
];


let currentStationIndex: number = 0;

let isAudioPlaying: boolean = true;
let isMenuOpen: boolean = false



async function getStationData(): Promise<any> {
    stationDB = await Promise.all(
        idList.map(async (ID: string) => {
            let URL: string = "https://www.youtube.com/watch?v=" + ID;
            let noembedURL: string = "https://noembed.com/embed?url=" + URL;

            let data: any = await fetch(noembedURL).then(response => response.json());
            return data;
        }));
}

function setData(station: any, stationID: string): void {
    let thumbnailURL: string = `https://img.youtube.com/vi/${stationID}/maxresdefault.jpg`;
    let audioURL: string = `https://www.youtube.com/embed/${stationID}?autoplay=1&mute=0`;

    audio.src = audioURL;
    title.innerHTML = station.title;
    backdrop.src = thumbnailURL;
    thumbnail.src = thumbnailURL;
}


// Toggle sound on or off using the youtube "muted" property.
function toggleSound(): void {
    setPlayIcon();

    // State can be "0" (unmuted) or "1" (muted)
    let state: string = audio.src.slice(-1);
    let url: string = audio.src.slice(0, -1);

    if (state === "0") {
        audio.src = url + "1"
    } else {
        audio.src = url + "0"
    }
}


// These next three functions will switch between station by index.
function previousStation(): void {
    resetPlayIcon();

    currentStationIndex = (currentStationIndex - 1) % stationDB.length;
    setData(stationDB[currentStationIndex], idList[currentStationIndex]);
}

function nextStation(): void {
    resetPlayIcon();

    currentStationIndex = (currentStationIndex + 1) % stationDB.length;
    setData(stationDB[currentStationIndex], idList[currentStationIndex]);
}

function goToStation(index: number): void {
    resetPlayIcon();

    currentStationIndex = index;
    setData(stationDB[currentStationIndex], idList[currentStationIndex]);

    toggleMenu();
}


function setPlayIcon(): void {
    isAudioPlaying = !isAudioPlaying;

    isAudioPlaying == true
        ? playButton.src = "\\src\\images\\pause.svg"
        : playButton.src = "\\src\\images\\play.svg";
}

function resetPlayIcon(): void {
    isAudioPlaying = true;
    playButton.src = "\\src\\images\\pause.svg";
}


function toggleMenu(): void {
    isMenuOpen
        ? menuContainer.style.display = "none"
        : menuContainer.style.display = "block";

    isMenuOpen = !isMenuOpen;
}

// Dinamically add cards to menu list and assign an id for each card, 
// the id correponds to the station index.
function setMenuData(): void {
    for (let i = 0; i < stationDB.length; i++) {
        let thumbnailURL: string = "https://img.youtube.com/vi/" + idList[i] + "/maxresdefault.jpg";
        let station: any = stationDB[i];

        menuList.innerHTML += `
            <div class="card">
                <div class="image-container">
                    <img class="card-image" src=${thumbnailURL}>
                </div>
                <div class="text-container">
                    <p>Chiptune</p>
                    <p>${station.title}</p>
                </div>
                <img id="${i}" class="icon" src="\\src\\images\\play.svg"/>
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

menuList.addEventListener('click', function (event) {
    let target = event.target as HTMLElement;

    if (target.className != "icon") {
        return;
    }

    goToStation(Number(target.id));
});

playButton.addEventListener('click', toggleSound);
previousButton.addEventListener('click', previousStation);
nextButton.addEventListener('click', nextStation);

menuButton.addEventListener('click', toggleMenu);



// title is a link to stream
// default volume to 50

// disable keyboard and options
// add genre
// fix path issues on build

// Add hover animations;