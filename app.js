var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

var canvas = document.getElementById('canvas');
canvas.width = windowWidth;
canvas.height = windowHeight;
// World is black;
canvas.getContext('2d')
    .fillStyle = 'rgba(0, 0, 0)';
canvas.getContext('2d')
    .fillRect(0, 0, windowWidth, windowHeight);

var maxPop = 5000;
var squareSize = 1;

var world = {
    width: windowWidth / squareSize,
    height: windowHeight / squareSize,
    squareSize: squareSize,
    ticks: 0
}

var hawk = {
    x: world.width / 10 * 4,
    y: world.height / 10 * 4,
    dovePart: 10, // 10% dove
    hawkPart: 90 // 90% hawk
};

var dove = {
    x: world.width / 10 * 6,
    y: world.height / 10 * 6,
    dovePart: 90, // 90% dove
    hawkPart: 10 // 10% hawk
};

var creatures = [hawk, dove];

function draw(creatures) {

    // Redraw screen in black with alpha channel for fading
    canvas.getContext('2d')
        .fillStyle = 'rgba(0, 0, 0, .1)';
    canvas.getContext('2d')
        .fillRect(0, 0, windowWidth, windowHeight);

    // Loop through all creatures, draw them
    creatures.map(function (creature) {

        var squareSize = world.squareSize;

        var creatureColor = calcColor(creature);
        canvas.getContext('2d')
            .fillStyle = creatureColor;

        canvas.getContext('2d')
            .fillRect(creature.x * squareSize, creature.y * squareSize, squareSize, squareSize);

    });
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray(array) {
    return array.sort(function () {
        return Math.random() - 0.5
    });
}

function maximizePopulation(newCreatures) {
    var shuffledCreatures = shuffleArray(newCreatures);
    if (shuffledCreatures.length > maxPop) shuffledCreatures.length = maxPop;
    return shuffledCreatures;
}

function minMax(value, min, max) {
    if (value > max) return max;
    if (value < min) return min;
    return value;
}

function breed(parent) {
    var xDirection = randomElement([-1, 0, 1]);
    var yDirection = randomElement([-1, 0, 1]);
    var hawkBonus = Math.round(Math.random() * 10) - 5;
    var doveBonus = Math.round(Math.random() * 10) - 5;
    var hawkPart = minMax(parent.hawkPart + hawkBonus, 0, 100);
    var dovePart = minMax(parent.dovePart + doveBonus, 0, 100);

    var newCreature = {
        x: parent.x + xDirection,
        y: parent.y + yDirection,
        hawkPart: hawkPart,
        dovePart: dovePart
    }

    return newCreature;
}

function calcColor(creature) {
    // Calculate creature color
    var creatureRedColor = Math.round(creature.hawkPart / 100 * 255);
    var creatureGreenColor = Math.round(creature.dovePart / 100 * 255);
    return 'rgb(' + creatureRedColor + ', ' + creatureGreenColor + ', 0)';
}


var tick = function () {

    world.ticks++;

    // Create kids
    var children = creatures.map(function (creature) {
        return breed(creature);
    })

    // Merge with parents
    creatures = maximizePopulation(creatures.concat(children));

    if (world.ticks % 5 === 0) draw(creatures); // draw only every 5 ticks

};

// Call function draw with an interval of ..
setInterval(tick, 0.33);
