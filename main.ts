import * as readlineSync from "readline-sync";

type Cell = string | number;
const board: Cell[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const go: number = Number(
	readlineSync.question("1. First go\n2. Second go\nEnter your choice: ")
);

type Marker = "X" | "O";
let marker: Marker;
let counterMarker: Marker;

let choice: number = Number(
	readlineSync.question("1. X\n2. O\nEnter your choice: ")
);
if (choice === 1) {
	marker = "X";
	counterMarker = "O";
} else {
	marker = "O";
	counterMarker = "X";
}

let choicesLeft = 9;

type WC = "won" | "lost" | "drew" | "not decided";
let status: WC = "not decided";

function printBoard() {
	console.log();
	console.log(`${board[0]} | ${board[1]} | ${board[2]}`);
	console.log("--|---|--");
	console.log(`${board[3]} | ${board[4]} | ${board[5]}`);
	console.log("--|---|--");
	console.log(`${board[6]} | ${board[7]} | ${board[8]}`);
	console.log();
}

function printStatus(status: WC) {
	console.log(`<<< You ${status} >>>`);
}

function takeUserChoice() {
	printBoard();
	let choice = Number(readlineSync.question("Enter a square: "));
	while (board[choice - 1] !== choice) {
		choice = Number(readlineSync.question("Enter some other square: "));
	}
	board[choice - 1] = marker;
	choicesLeft--;
}

function takeBotChoice() {
	let botChoice = Math.floor(Math.random() * 10) % 10;
	while (botChoice === 0 || board[botChoice - 1] !== botChoice) {
		botChoice = Math.floor(Math.random() * 10) % 10;
	}
	board[botChoice - 1] = counterMarker;
	choicesLeft--;
}

function checkWC(): boolean {
	for (let j: number = 0; j < 7; j += 3) {
		if (board[j] === board[j + 1] && board[j] === board[j + 2]) {
			if (board[j] === marker) status = "won";
			else status = "lost";
		}
	}
	for (let j: number = 0; j < 3; j++) {
		if (board[j] === board[j + 3] && board[j] === board[j + 6]) {
			if (board[j] === marker) status = "won";
			else status = "lost";
		}
	}
	for (let j: number = 0; j < 3; j++) {
		if (board[j] === board[j + 4] && board[j] === board[j + 8]) {
			if (board[j] === marker) status = "won";
			else status = "lost";
		}
	}
	if (status === "won" || status === "lost") return true;
	return false;
}

for (let i: number = 0; i < 5; ++i) {
	go === 1 ? takeUserChoice() : takeBotChoice();
	if (checkWC()) break;
	if (choicesLeft !== 0) {
		go === 1 ? takeBotChoice() : takeUserChoice();
	}
	if (checkWC()) break;
}

if (status === "not decided") status = "drew";

printBoard();
printStatus(status);
