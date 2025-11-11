import * as readlineSync from "readline-sync";
import OpenAI from "openai";
import "dotenv/config";

type Cell = string | number;
const board: Cell[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const winningConditions: [number, number, number][] = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

const openai = new OpenAI({
	baseURL: process.env.OPENROUTER_URL,
	apiKey: process.env.OPENROUTER_API_KEY,
});

const bots = ["Random Choice Bot (recommended)", "Cloud LLM (high latency)"];
const bot: number = Number(readlineSync.keyInSelect(bots, "Choose bot"));
if (bot === -1) {
	console.log("Exiting program.");
	process.exit(0);
}

const gos = ["First go", "Second go"];
const go: number = Number(readlineSync.keyInSelect(gos, "Choose go"));
if (go === -1) {
	console.log("Exiting program.");
	process.exit(0);
}

type Marker = "X" | "O";
let marker: Marker;
let counterMarker: Marker;
const markers: Marker[] = ["X", "O"];
let choice: number = Number(readlineSync.keyInSelect(markers, "Choose marker"));
if (go === -1) {
	console.log("Exiting program.");
	process.exit(0);
}
if (choice === 0) {
	marker = "X";
	counterMarker = "O";
} else {
	marker = "O";
	counterMarker = "X";
}

let choicesLeft = 9;

type WC = "won" | "lost" | "drew" | "not decided";
let status: WC = "not decided";

function takeUserChoice() {
	printBoard();
	let choice = Number(readlineSync.question("Enter a square: "));
	while (board[choice - 1] !== choice) {
		choice = Number(readlineSync.question("Enter some other square: "));
	}
	board[choice - 1] = marker;
	choicesLeft--;
}

async function takeBotChoice() {
	let botChoice: number;
	switch (bot) {
		case 0:
			botChoice = Math.floor(Math.random() * 10) % 10;
			while (botChoice === 0 || board[botChoice - 1] !== botChoice) {
				botChoice = Math.floor(Math.random() * 10) % 10;
			}
			board[botChoice - 1] = counterMarker;
			choicesLeft--;
			break;
		case 1:
			console.log();
			console.log("Thinking...");
			const res = await openai.chat.completions.create({
				model: "openai/gpt-oss-20b:free",
				messages: [
					{
						role: "user",
						content: `Don't think too much, answer within 1 second. You are given a tic-tac-toe grid with indices numbered 0 through 9 left to right then next line. Choose the next move in order to win. Your marker is ${counterMarker} and user marker is ${marker}. Come up with best move to beat the user. Here is the board cell data stored in the form of an array ${board}. Answer with a simple index position.`,
					},
				],
			});
			botChoice = Number(res.choices[0]?.message.content);
			board[botChoice] = counterMarker;
			choicesLeft--;
			break;
	}
}

function printBoard() {
	console.log();
	console.log(`${board[0]} | ${board[1]} | ${board[2]}`);
	console.log("--|---|--");
	console.log(`${board[3]} | ${board[4]} | ${board[5]}`);
	console.log("--|---|--");
	console.log(`${board[6]} | ${board[7]} | ${board[8]}`);
	console.log();
}

function checkWC(): boolean {
	for (let [a, b, c] of winningConditions) {
		if (board[a] === board[b] && board[b] === board[c]) {
			if (board[a] === marker) {
				status = "won";
			} else {
				status = "lost";
			}
			return true;
		}
	}
	return false;
}

function printStatus(status: WC) {
	console.log(`<<< You ${status} >>>`);
}

async function gameLoop() {
	for (let i: number = 0; i < 5; ++i) {
		go === 0 ? takeUserChoice() : await takeBotChoice();
		if (checkWC()) break;
		if (choicesLeft !== 0) {
			go === 0 ? await takeBotChoice() : takeUserChoice();
		}
		if (checkWC()) break;
	}

	if (status === "not decided") status = "drew";

	printBoard();
	printStatus(status);
}

gameLoop();
