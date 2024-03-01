const soundsElement = document.getElementById('sounds');
const players = [];

let keyCodes = ['a', 'z', 'e', 'r', 'q', 's', 'd', 'f', 'w', 'x', 'c', 'v'];
// 81 = Q, 87 = W, 69 = E, 82 = R, 65 = A, 83 = S, 68 = D, 70 = F, 90 = Z, 88 = X, 67 = C, 86 = V
// key of 32 = spacebar = ''

stopButton.addEventListener('click', stopAll);

(async () => {
    const sounds = await getSound();
    addSoundsToPage(sounds);
})();

async function getSound() {
    const response = await fetch('./sounds.json');
    const json = await response.json();
    return json;
}

function addSoundsToPage(sounds) {
    sounds.forEach(addSoundToPage);

    listenKeyPress();
}

function addSoundToPage(sound, index) {
    const soundDiv = document.createElement('div');
    soundDiv.className = 'sound';
    const soundTitle = document.createElement('h2');
    soundTitle.textContent = sound.title;
    soundDiv.appendChild(soundTitle);

    const key = document.createElement('img');
    key.setAttribute('src', `keys/${keyCodes[index]}.png`);
    console.log(keyCodes[index]);
    soundDiv.appendChild(key);

    const player = document.createElement('audio');
    player.setAttribute('src', `sounds/${sound.src}`);
    soundDiv.appendChild(player);
    players.push({ player, soundDiv, key });

    soundDiv.addEventListener('mousedown', () => {
        soundPress(soundDiv, player);
    });

    soundDiv.addEventListener('mouseup', () => {
        soundDiv.style.background = '';
    });

    soundsElement.appendChild(soundDiv);
}

function soundPress(div, player) {
    div.style.background = 'red';
    player.currentTime = 0;
    player.play();
}

function listenKeyPress() {
    document.addEventListener('keydown', (event) => {
        if (event.key == ' ') return stopAll();
        const playerIndex = keyCodes.indexOf(event.key);
        const playerAndDiv = players[playerIndex];
        if (playerAndDiv && !playerAndDiv.keydown) {
            playerAndDiv.keydown = true;
            playerAndDiv.key.style.transform = 'scaleY(0.75)';
            soundPress(playerAndDiv.soundDiv, playerAndDiv.player);
        }
    });
    document.addEventListener('keyup', (event) => {
        const playerIndex = keyCodes.indexOf(event.key);
        const playerAndDiv = players[playerIndex];
        if (playerAndDiv) {
            playerAndDiv.soundDiv.style.background = '';
            playerAndDiv.keydown = false;
            playerAndDiv.key.style.transform = '';
        }
    });
}

function stopAll() {
    players.forEach(({ player }) => {
        player.pause();
    });
}
