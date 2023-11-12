import { getSolution } from './Solver.js';

window.addEventListener('DOMContentLoaded', () => {

    const raft = document.querySelector('#raft');
    const animalStart = document.querySelector('#animal-start');
    const animalEnd = document.querySelector("#animal-end");
    const raftStart = document.querySelector('#raft-start');
    const raftEnd = document.querySelector('#raft-end');
    const raftStartTop = document.querySelector('#raft-start-top');
    const raftStartBottom = document.querySelector('#raft-start-bottom');
    const raftEndTop = document.querySelector('#raft-end-top');
    const raftEndBottom = document.querySelector('#raft-end-bottom');
    const startGrid = document.querySelector('#left-grid');
    const endGrid = document.querySelector('#right-grid');
    const bottomBar = document.querySelector('#bottom-bar');

    const btnStart = document.querySelector('#btn-start');
    const btnSpeedUp = document.querySelector('#btn-speed-up');
    const btnSlowDown = document.querySelector('#btn-slow-down');
    const btnPause = document.querySelector('#btn-pause');
    const btnResume = document.querySelector('#btn-resume');
    const btnGenerate = document.querySelector('#btn-generate-animals');
    const btnSkipStage = document.querySelector('#btn-skip-stage');
    const btnRewindStage = document.querySelector('#btn-rewind-stage');

    const leftBank = [];
    const rightBank = [];

    var numGoat;
    var numLion;
    var animationSpeedFactor = 1; // playback rate
    var ongoingAnimations = [];

    //Resources:
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    // https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
    // Gabriel Paul Tan

    btnGenerate.onclick = function () {
        clearElements();
        generateAnimals();
        createElements(numGoat, numLion);
    }

    btnStart.onclick = function () {
        const states = getSolution(numGoat, numLion);
        console.log(states);

        if (states != null) {
            bottomBar.style.display = 'flex';
            runAllStages(states);
        } else {
            document.getElementById("message-content").innerHTML = 'No Solution Found!';
            $('#myModal').modal('show');
        }
    }

    btnSpeedUp.onclick = function () {
        updateAnimationSpeed(2);
    }

    btnSlowDown.onclick = function () {
        updateAnimationSpeed(0.5);
    }

    btnPause.onclick = function () {
        pauseAnimation();
        btnPause.style.display = 'none';
        btnResume.style.display = 'block';
    }

    btnResume.onclick = function () {
        resumeAnimation();
        btnResume.style.display = 'none';
        btnPause.style.display = 'block';
    }

    // btnSkipStage.onclick = function () {
    //     skipFlag = true;
    //     ongoingAnimations.forEach(animation => {
    //         if (animation.playState == 'running') {
    //             animation.cancel();
    //         }
    //     })
    // }

    // translate happens from the original position
    function move(startElement, endElement, time) {

        // get start and end coordinates
        const startPos = getPosition(startElement);
        const endPos = getPosition(endElement);

        // get distance to travel
        const dist = calcDistance(startPos, endPos);

        // get total distance travelled so far
        const distCurrent = getTranslation(startElement);

        const moveAnimation = [
            { transform: `translate(${dist.x + distCurrent.x}px, ${dist.y + distCurrent.y}px)` }
        ];

        const moveTiming = {
            duration: time,
            fill: 'forwards' // keeps element at end position
        };

        const animation = startElement.animate(moveAnimation, moveTiming);

        animation.updatePlaybackRate(animationSpeedFactor);

        ongoingAnimations.push(animation);

        return animation.finished;
    }

    function getPosition(element) {
        var pos = element.getBoundingClientRect();

        var centerX = (pos.left + pos.width / 2);
        var centerY = (pos.top + pos.height / 2);

        return { x: centerX, y: centerY };
    }

    function calcDistance(start, end) {
        var distX = end.x - start.x;
        var distY = end.y - start.y;

        return { x: distX, y: distY };
    }

    function getTranslation(element) {
        const computedStyle = window.getComputedStyle(element);
        const transformValue = computedStyle.transform;

        // regex to capture X and Y translation in group
        const getValue = transformValue.match(/matrix\(1, 0, 0, 1, (-?\d*\.?\d+), (-?\d*\.?\d+)/);

        if (!getValue) {
            return { x: 0, y: 0 };
        }

        const translateX = parseFloat(getValue[1]);
        const translateY = parseFloat(getValue[2]);

        return { x: translateX, y: translateY };
    }

    // generate random number of animals
    function generateAnimals() {
        numGoat = Math.floor(Math.random() * (8 - 1 + 1) + 1);
        numLion = Math.floor(Math.random() * (numGoat - 1 + 1) + 1); // lions must never start higher than goats
    }

    // generate HTML elements for animals and their containers
    function createElements(nGoat, nLion) {
        const animal = 'A';
        const goat = 'G';
        const lion = 'L';
        const start = 'start';
        const end = 'end';

        for (let i = 0; i < nGoat; i++) {
            const goatStartElement = createAnimalContainer(animal, i + 1, start);
            startGrid.appendChild(goatStartElement);
            const goatElement = createAnimals(goat, i + 1);
            goatStartElement.appendChild(goatElement);

            const goatEndElement = createAnimalContainer(animal, i + 1, end);
            endGrid.appendChild(goatEndElement);

            leftBank.push(goat + (i + 1));
            rightBank.push(null);
        }

        for (let i = 0; i < nLion; i++) {
            const lionStartElement = createAnimalContainer(animal, i + 1 + nGoat, start);
            startGrid.appendChild(lionStartElement);
            const lionElement = createAnimals(lion, i + 1);
            lionStartElement.appendChild(lionElement);

            const lionEndElement = createAnimalContainer(animal, i + 1 + nGoat, end);
            endGrid.appendChild(lionEndElement);

            leftBank.push(lion + (i + 1));
            rightBank.push(null);
        }

        console.log(leftBank)
        console.log(rightBank)
    }

    function createAnimalContainer(animal, index, pos) {
        const animalContainerElement = document.createElement('div');
        animalContainerElement.id = pos == 'start' ? animal + index + '-start' : animal + index + '-end';
        return animalContainerElement;
    }

    function createAnimals(animal, index) {
        const animalElement = document.createElement('div');
        animalElement.className = animal;
        animalElement.id = animal + index;
        animalElement.innerHTML = animal == 'G' ? '&#x1F984' : '&#x1F981';
        return animalElement;
    }

    // get the first available animal in respective array
    // bank refers to current raft position : LEFT or RIGHT
    // also empties the selected animal position in the current bank
    function getStartAnimal(animal, bank) {
        var animalID;

        if (bank == 'L') {
            for (let i = 0; i < leftBank.length; i++) {
                if (leftBank[i] != null && leftBank[i].charAt(0) == animal) {
                    animalID = leftBank[i];
                    leftBank[i] = null; // empty the value
                    return animalID; // return index of selected animal
                }
            }
        } else if (bank == 'R') {
            for (let i = 0; i < rightBank.length; i++) {
                if (rightBank[i] != null && rightBank[i].charAt(0) == animal) {
                    animalID = rightBank[i];
                    rightBank[i] = null; // empty the value
                    return animalID;
                }
            }
        }

        console.log('Impossible move found!');
        return null;
    }

    // get the first available empty space in respective array
    // bank refers to current raft position : LEFT or RIGHT
    // also populates the opposite bank with the corresponding new animal
    function getEndPosition(animal, bank) {
        var animalPos;

        // if currently on right, end position is left
        if (bank == 'R') {
            for (let i = 0; i < leftBank.length; i++) {
                if (leftBank[i] == null) {
                    animalPos = 'A' + (i + 1) + '-start';
                    leftBank[i] = animal; // populate with new animal
                    return animalPos; // return index of selected animal
                }
            }
        } else if (bank == 'L') { // if currently on left, end position is right
            for (let i = 0; i < rightBank.length; i++) {
                if (rightBank[i] == null) {
                    animalPos = 'A' + (i + 1) + '-end';
                    rightBank[i] = animal; // populate with new animal
                    return animalPos;
                }
            }
        }

        console.log('Impossible move found!');
        return null;
    }

    async function runStage(goat, lion, raftPos) {
        var startAnimal1;
        var startAnimal2;

        let currentPromise = Promise.resolve();

        ongoingAnimations = []; // reset ongoing animations

        if (goat + lion == 2) {

            if (goat == 2 && lion == 0) {
                startAnimal1 = 'G';
                startAnimal2 = 'G';
            } else if (goat == 0 && lion == 2) {
                startAnimal1 = 'L';
                startAnimal2 = 'L';
            } else {
                startAnimal1 = 'G';
                startAnimal2 = 'L';
            }

            var animalIndex1 = getStartAnimal(startAnimal1, raftPos); // animal, bank
            var endIndex1 = getEndPosition(animalIndex1, raftPos); // new animal, bank

            var animalIndex2 = getStartAnimal(startAnimal2, raftPos);
            var endIndex2 = getEndPosition(animalIndex2, raftPos);

            var idAnimal1 = '#' + animalIndex1;
            var idAnimal2 = '#' + animalIndex2;
            var idEndPos1 = '#' + endIndex1;
            var idEndPos2 = '#' + endIndex2;

            const a1 = document.querySelector(idAnimal1);
            const a2 = document.querySelector(idAnimal2);
            const a1End = document.querySelector(idEndPos1);
            const a2End = document.querySelector(idEndPos2);

            if (raftPos == 'L') {
                currentPromise = currentPromise
                    .then(() => move(a1, animalStart, 1000))
                    .then(() => move(a1, raftStartTop, 1000))
                    .then(() => move(a2, animalStart, 1000))
                    .then(() => move(a2, raftStartBottom, 1000))
                    .then(() => {
                        return Promise.all([move(a1, raftEndTop, 2000), move(a2, raftEndBottom, 2000), move(raft, raftEnd, 2000)])
                    })
                    .then(() => move(a1, animalEnd, 1000))
                    .then(() => move(a1, a1End, 1000))
                    .then(() => move(a2, animalEnd, 1000))
                    .then(() => move(a2, a2End, 1000));
            } else if (raftPos = 'R') {
                currentPromise = currentPromise
                    .then(() => move(a1, animalEnd, 1000))
                    .then(() => move(a1, raftEndTop, 1000))
                    .then(() => move(a2, animalEnd, 1000))
                    .then(() => move(a2, raftEndBottom, 1000))
                    .then(() => {
                        return Promise.all([move(a1, raftStartTop, 2000), move(a2, raftStartBottom, 2000), move(raft, raftStart, 2000)])
                    })
                    .then(() => move(a1, animalStart, 1000))
                    .then(() => move(a1, a1End, 1000))
                    .then(() => move(a2, animalStart, 1000))
                    .then(() => move(a2, a2End, 1000));
            }

        } else if (goat + lion == 1) {

            if (goat == 1 && lion == 0) {
                startAnimal1 = 'G';
            } else if (goat == 0 && lion == 1) {
                startAnimal1 = 'L';
            }

            var animalIndex1 = getStartAnimal(startAnimal1, raftPos); // animal, bank
            var endIndex1 = getEndPosition(animalIndex1, raftPos); // new animal, bank

            var idAnimal1 = '#' + animalIndex1;
            var idEndPos1 = '#' + endIndex1;

            const a1 = document.querySelector(idAnimal1);
            const a1End = document.querySelector(idEndPos1);

            if (raftPos == 'L') {
                currentPromise = currentPromise
                    .then(() => move(a1, animalStart, 1000))
                    .then(() => move(a1, raftStartTop, 1000))
                    .then(() => {
                        return Promise.all([move(a1, raftEndTop, 2000), move(raft, raftEnd, 2000)])
                    })
                    .then(() => move(a1, animalEnd, 1000))
                    .then(() => move(a1, a1End, 1000));
            } else if (raftPos == 'R') {
                currentPromise = currentPromise
                    .then(() => move(a1, animalEnd, 1000))
                    .then(() => move(a1, raftEndTop, 1000))
                    .then(() => {
                        return Promise.all([move(a1, raftStartTop, 2000), move(raft, raftStart, 2000)])
                    })
                    .then(() => move(a1, animalStart, 1000))
                    .then(() => move(a1, a1End, 1000));
            }
        }

        await currentPromise;
    }

    async function runAllStages(stages) {
        for (let i = 0; i < stages.length - 1; i++) {
            const animal = getSteps(stages[i], stages[i + 1]);

            await runStage(animal.goat, animal.lion, animal.raft);
        }

        document.getElementById("message-content").innerHTML = 'Problem Solved!';
        $('#myModal').modal('show');
    }

    // gets the moves needed between 2 stages
    function getSteps(from, to) {

        var raftPos = from.charAt(0);
        var goatMoved;
        var lionMoved;

        if (raftPos == 'L') {
            goatMoved = parseInt(from.charAt(1)) - parseInt(to.charAt(1));
            lionMoved = parseInt(from.charAt(2)) - parseInt(to.charAt(2));
        } else if (raftPos == 'R') {
            goatMoved = parseInt(from.charAt(3)) - parseInt(to.charAt(3));
            lionMoved = parseInt(from.charAt(4)) - parseInt(to.charAt(4));
        }

        return { goat: goatMoved, lion: lionMoved, raft: raftPos }
    }

    // function to update animation speed
    function updateAnimationSpeed(speedFactor) {

        animationSpeedFactor *= speedFactor;

        ongoingAnimations.forEach(animation => {
            animation.updatePlaybackRate(animationSpeedFactor);
        });
    }

    function pauseAnimation() {
        ongoingAnimations.forEach(animation => {
            if (animation.playState == 'running') {
                animation.pause()
            }
        })
    }

    function resumeAnimation() {
        ongoingAnimations.forEach(animation => {
            if (animation.playState == 'paused') {
                animation.play()
            }
        })
    }

    function clearElements() {
        // remove all child elements - animal container and animals
        startGrid.replaceChildren();
        endGrid.replaceChildren();
    }
});