console.log("index.js");
const canvas = document.getElementById("gameCanvas");
const gameControls = document.getElementById("gameControls");
const menuScreen = document.getElementById("menuScreen");
const menuReturn = document.getElementById("menuReturn");
const victoryScreen = document.getElementById("victoryScreen");
const g = document.getElementById("gameCanvas").getContext("2d");
let currentState;
let timeline = [];
let timelineIndex;
const cellSize = 32;
let playerDirection;
const playerDownImage = new Image();
playerDownImage.src = "32x32/playerDown.png";
const playerLeftImage = new Image();
playerLeftImage.src = "32x32/playerLeft.png";
const playerUpImage = new Image();
playerUpImage.src = "32x32/playerUp.png";
const playerRightImage = new Image();
playerRightImage.src = "32x32/playerRight.png";
const boxImage = new Image();
boxImage.src = "32x32/box.png";
const goalImage = new Image();
goalImage.src = "32x32/goal.png";
const wallImage = new Image();
wallImage.src = "32x32/wall.png";

const maps = [
	{
		name: "1",
		file: "map/92bd79ae0e262b5bc5a16a9467d39a1a.txt",
		tested: true,
	},
	{
		name: "2",
		file: "map/eb1c14cca228b2ff125e3c4c03c4d1da.txt",
		tested: true,
	},
	{
		name: "3",
		file: "map/eb93385f19af69c8cd87944d1c622c62.txt",
		tested: true,
	},
	{
		name: "4",
		file: "map/f2fe5b4097d76611c9cdf7d4e4fce7f5.txt",
		tested: true,
	},
	{
		name: "5",
		file: "map/8e07d18423d80bff982b3ab4b3708a13.txt",
		tested: true,
	},
	{
		name: "6",
		file: "map/22bcec5d67079b84e7a4e1b748f244bb.txt",
		tested: true,
	},
	{
		name: "7",
		file: "map/9e48a39d9e1448dfb65c06111bac6a1c.txt",
		tested: true,
	},
	{
		name: "8",
		file: "map/1024d61f123d9f3e02fafac6bb23160a.txt",
		tested: false,
	},
	{
		name: "9",
		file: "map/659740a51db3fe56b86608acc30e176f.txt",
		tested: false,
	},
	{
		name: "Promo 1",
		file: "map/fcfa87e1bd6d8755a04249d4b612e9db.txt",
		tested: false,
	}
];

const loadImageAsync = (source) => {
	return new Promise((resolve) => {
		const image = new Image();
		image.src = source;
		image.addEventListener("load", () => {
			resolve(image);
		});
	});
};

const readState = (dataString) => {
	const gameState = {
		player: {},
		walls: [],
		boxes: [],
		goals: [],
		width: 0,
		height: 0,
	};
	const lines = dataString.split("\n");
	gameState.height = lines.length;

	for (let y = 0; y < lines.length; y++) {
		if (lines[y].length > gameState.width) {
			gameState.width = lines[y].length;
		}

		for (let x = 0; x < lines[y].length; x++) {
			const c = lines[y][x];

			if (c === " ") {
				// empty space
			}
			else if (c === "P") {
				gameState.player = { x, y };
			}
			else if (c === "#") {
				gameState.walls.push({ x, y });
			}
			else if (c === "B") {
				gameState.boxes.push({ x, y });
			}
			else if (c === "G") {
				gameState.goals.push({ x, y });
			}
			else if (c === "O") {
				gameState.boxes.push({ x, y });
				gameState.goals.push({ x, y });
			}
		}
	}
	return gameState;
};

const cloneState = (gameState) => {
	// oh man i regret using javascript
	return JSON.parse(JSON.stringify(gameState));
};

const sameState = (aState, bState) => {
};

const isVisited = (gameState) => {
	// todo fix possible hash collisions
	const hash = hashState(gameState);
	if (visited[hash]) {
		return true;
	}
	visited[hash] = true;
	return false;
};

const hasBox = (gameState, x, y) => {
	for (let box of gameState.boxes) {
		if (box.x === x && box.y === y) {
			return box;
		}
	};
	return null;
};

const hasWall = (gameState, x, y) => {
	for (let wall of gameState.walls) {
		if (wall.x === x && wall.y === y) {
			return wall;
		}
	};
	return null;
};

const hasSpace = (gameState, x, y) => {
	if (hasBox(gameState, x, y)) {
		return false;
	}
	if (hasWall(gameState, x, y)) {
		return false;
	}
	return true;
};

const isWin = (gameState) => {
	for (let goal of gameState.goals) {
		if (!hasBox(gameState, goal.x, goal.y)) {
			return false;
		}
	}
	return true;
};

const boxStuck = (gameState) => {
	for (let box of gameState.boxes) {
	}
	return false;
};

const isLose = (gameState) => {
	if (boxStuck(gameState)) {
		return true;
	}
	return false;
};

const moveLeft = (gameState) => {
	const clone = cloneState(gameState);
	const { x, y } = clone.player;
	if (hasWall(clone, x - 1, y)) {
		return;
	}

	const box = hasBox(clone, x - 1, y);
	if (box) {
		if (!hasSpace(clone, x - 2, y)) {
			return;
		}
		box.x = box.x - 1;
	}

	clone.player.x = x - 1;
	return clone;
};

const moveRight = (gameState) => {
	const clone = cloneState(gameState);
	const { x, y } = clone.player;
	if (hasWall(clone, x + 1, y)) {
		return;
	}

	const box = hasBox(clone, x + 1, y);
	if (box) {
		if (!hasSpace(clone, x + 2, y)) {
			return;
		}
		box.x = box.x + 1;
	}

	clone.player.x = x + 1;
	return clone;
};

const moveUp = (gameState) => {
	const clone = cloneState(gameState);
	const { x, y } = clone.player;
	if (hasWall(clone, x, y - 1)) {
		return;
	}

	const box = hasBox(clone, x, y - 1);
	if (box) {
		if (!hasSpace(clone, x, y - 2)) {
			return;
		}
		box.y = box.y - 1;
	}

	clone.player.y = y - 1;
	return clone;
};

const moveDown = (gameState) => {
	const clone = cloneState(gameState);
	const { x, y } = clone.player;
	if (hasWall(clone, x, y + 1)) {
		return;
	}

	const box = hasBox(clone, x, y + 1);
	if (box) {
		if (!hasSpace(clone, x, y + 2)) {
			return;
		}
		box.y = box.y + 1;
	}

	clone.player.y = y + 1;
	return clone;
};

const drawState = () => {
	if (!currentState) {
		return;
	}

	const tx = (canvas.clientWidth - currentState.width * cellSize) * 0.5;
	const ty = (canvas.clientHeight - currentState.height * cellSize) * 0.5;
	g.translate(tx, ty);

	currentState.walls.forEach(i => {
		// g.fillStyle = 'grey';
		// g.fillRect(i.x * cellSize, i.y * cellSize, cellSize, cellSize);
		g.drawImage(wallImage, 0, 0, cellSize, cellSize, i.x * cellSize, i.y * cellSize, cellSize, cellSize);
	});
	currentState.goals.forEach(i => {
		// g.fillStyle = 'green';
		// g.fillRect(i.x * cellSize, i.y * cellSize, cellSize, cellSize);
		g.drawImage(goalImage, 0, 0, cellSize, cellSize, i.x * cellSize, i.y * cellSize, cellSize, cellSize);
	});
	currentState.boxes.forEach(i => {
		// g.fillStyle = 'white';
		// g.fillRect(i.x * cellSize, i.y * cellSize, cellSize, cellSize);
		g.drawImage(boxImage, 0, 0, cellSize, cellSize, i.x * cellSize, i.y * cellSize, cellSize, cellSize);
	});
	{
		const p = currentState.player;
		// g.fillStyle = 'gold';
		// g.fillRect(p.x * cellSize, p.y * cellSize, cellSize, cellSize);

		if (playerDirection == "down") {
			g.drawImage(playerDownImage, 0, 0, cellSize, cellSize, p.x * cellSize, p.y * cellSize, cellSize, cellSize);
		}
		else if (playerDirection == "left") {
			g.drawImage(playerLeftImage, 0, 0, cellSize, cellSize, p.x * cellSize, p.y * cellSize, cellSize, cellSize);
		}
		else if (playerDirection == "up") {
			g.drawImage(playerUpImage, 0, 0, cellSize, cellSize, p.x * cellSize, p.y * cellSize, cellSize, cellSize);
		}
		else if (playerDirection == "right") {
			g.drawImage(playerRightImage, 0, 0, cellSize, cellSize, p.x * cellSize, p.y * cellSize, cellSize, cellSize);
		}
	}
};

const renderFrame = () => {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	g.fillStyle = 'black';
	g.fillRect(0, 0, canvas.width, canvas.height);
	drawState();
};

const showControls = () => {
	gameControls.style.opacity = "1.0";
};

const hideControls = () => {
	gameControls.style.opacity = "0.0";
};

const pushTime = (timeItem) => {
	if (!timeItem.state) {
		return;
	}

	timeline = timeline.slice(0, timelineIndex + 1);
	timeline.push(timeItem);
	timelineIndex += 1;
	changeTime();
};

const changeTime = () => {
	const timeItem = timeline[timelineIndex];
	currentState = timeItem.state;
	playerDirection = timeItem.playerDirection;
	renderFrame();

	if (isWin(currentState)) {
		victoryScreen.style.visibility = "visible";
	}
}

const loadMap = async (map) => {
	const response = await fetch("/" + map.file)
	const timeItem = {
		state: readState(await response.text()),
		playerDirection: "down",
	};
	currentState = timeItem.state;
	playerDirection = timeItem.playerDirection;
	timeline = [timeItem];
	timelineIndex = 0;
};

const showMenu = () => {
	menuScreen.style.visibility = "visible";
};

const hideMenu = () => {
	if (!currentState) {
		return;
	}
	menuScreen.style.visibility = "hidden";
};

menuReturn.addEventListener("touchend", () => {
	hideMenu();
});

maps.forEach(map => {
	const element = document.createElement("div");
	element.className = 'menuButton';
	element.addEventListener("touchend", async () => {
		await loadMap(map);
		hideMenu();
		showControls();
		renderFrame();
	});
	const text = document.createTextNode(map.name)
	element.appendChild(text);
	menuScreen.appendChild(element);
});

const attachEvents = async () => {
	document.addEventListener('contextmenu', event => event.preventDefault());
	document.addEventListener("resize", renderFrame);

	document.getElementById("buttonLeft").addEventListener("touchend", () => {
		console.log("buttonLeft");
		pushTime({
			state: moveLeft(currentState),
			playerDirection: "left",
		});
	});
	document.getElementById("buttonRight").addEventListener("touchend", () => {
		console.log("buttonRight");
		pushTime({
			state: moveRight(currentState),
			playerDirection: "right",
		});
	});
	document.getElementById("buttonUp").addEventListener("touchend", () => {
		console.log("buttonUp");
		pushTime({
			state: moveUp(currentState),
			playerDirection: "up",
		});
	});
	document.getElementById("buttonDown").addEventListener("touchend", () => {
		console.log("buttonDown");
		pushTime({
			state: moveDown(currentState),
			playerDirection: "down",
		});
	});

	document.getElementById("buttonMiddle").addEventListener("touchstart", () => {
		showControls();
	});
	document.getElementById("buttonMiddle").addEventListener("touchend", () => {
		hideControls();
	});

	document.getElementById("buttonBackward").addEventListener("touchend", () => {
		console.log("buttonBackward");
		if (timelineIndex == 0) {
			return;
		}

		timelineIndex -= 1;
		changeTime();
	});
	document.getElementById("buttonForward").addEventListener("touchend", () => {
		console.log("buttonForward");
		if (timelineIndex + 1 == timeline.length) {
			return;
		}

		timelineIndex += 1;
		changeTime();
	});

	document.getElementById("buttonReset").addEventListener("touchend", () => {
		console.log("buttonReset");
		timelineIndex = 0;
		changeTime();
	});
	document.getElementById("buttonMenu").addEventListener("touchend", () => {
		console.log("buttonMenu");
		showMenu();
	});

	document.getElementById("victoryScreen").addEventListener("touchend", () => {
		victoryScreen.style.visibility = "hidden";
		menuScreen.style.visibility = "visible";
	});

	window.addEventListener("resize", () => {
		console.log("resize");
		renderFrame();
	});
};

const runAsync = async () => {
	hideControls();
	renderFrame();
	await attachEvents();
};

runAsync();