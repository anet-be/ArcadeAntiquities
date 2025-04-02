import {getGameNames, getGamePage} from "../../FileHandler";

const gameArray = [...getGameNames()];

if (gameArray.length > 2) {
    showHomeScreen();
} else {
    gameArray.forEach(gameName => {
        let gamePage = getGamePage(gameName);
        if (gamePage === "pacman.html" || gamePage === "space-invader.html") {
            window.location.href = `./${gamePage}`;
        }
    });
}

function showHomeScreen() {
    const homeScreenTitle = document.getElementById("projectTitle");
    const homeScreenMenu = document.querySelector('.menu');

    let projectName = null;
    let projectLink = null;

    gameArray.forEach(gameName => {
        let gamePage = getGamePage(gameName);
        if (gamePage === "pacman.html" || gamePage === "space-invader.html") {
            let updatedName = gameName.replaceAll("_", " ");
            homeScreenMenu.innerHTML += `<div class="game-option"><a href="./${gamePage}">${updatedName}</a></div>`
        } else {
            projectLink = gameName;
            projectName = gameName.replaceAll("_", " ");
        }
    });

    homeScreenTitle.innerText = projectName;

    let selectedIndex = 0;
    const gameOptions = document.querySelectorAll('.game-option');
    gameOptions[selectedIndex].classList.add('selected');

    const backgroundSrc = `../assets/${projectLink}/background.jpg`;
    document.body.style.backgroundImage = `url('${backgroundSrc}')`;

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            gameOptions[selectedIndex].classList.remove('selected');
            selectedIndex = (selectedIndex + 1) % gameOptions.length;
            gameOptions[selectedIndex].classList.add('selected');
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            gameOptions[selectedIndex].classList.remove('selected');
            selectedIndex = (selectedIndex - 1 + gameOptions.length) % gameOptions.length;
            gameOptions[selectedIndex].classList.add('selected');
        } else if (event.key === 'Enter') {
            window.location.href = gameOptions[selectedIndex].querySelector('a').href;
        }
    });
}