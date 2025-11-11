"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var readlineSync = require("readline-sync");
var openai_1 = require("openai");
var board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var openai = new openai_1.default({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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",
});
var bot = Number(readlineSync.question("1. Random Choice Bot\n2. LLM"));
var go = Number(readlineSync.question("1. First go\n2. Second go\nEnter your choice: "));
var marker;
var counterMarker;
var choice = Number(readlineSync.question("1. X\n2. O\nEnter your choice: "));
if (choice === 1) {
    marker = "X";
    counterMarker = "O";
}
else {
    marker = "O";
    counterMarker = "X";
}
var choicesLeft = 9;
var status = "not decided";
function printBoard() {
    console.log();
    console.log("".concat(board[0], " | ").concat(board[1], " | ").concat(board[2]));
    console.log("--|---|--");
    console.log("".concat(board[3], " | ").concat(board[4], " | ").concat(board[5]));
    console.log("--|---|--");
    console.log("".concat(board[6], " | ").concat(board[7], " | ").concat(board[8]));
    console.log();
}
function printStatus(status) {
    console.log("<<< You ".concat(status, " >>>"));
}
function takeUserChoice() {
    printBoard();
    var choice = Number(readlineSync.question("Enter a square: "));
    while (board[choice - 1] !== choice) {
        choice = Number(readlineSync.question("Enter some other square: "));
    }
    board[choice - 1] = marker;
    choicesLeft--;
}
function takeBotChoice() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, botChoice, response;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = bot;
                    switch (_a) {
                        case 1: return [3 /*break*/, 1];
                        case 2: return [3 /*break*/, 2];
                    }
                    return [3 /*break*/, 4];
                case 1:
                    botChoice = Math.floor(Math.random() * 10) % 10;
                    while (botChoice === 0 || board[botChoice - 1] !== botChoice) {
                        botChoice = Math.floor(Math.random() * 10) % 10;
                    }
                    board[botChoice - 1] = counterMarker;
                    choicesLeft--;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, openai.chat.completions.create({
                        model: "deepseek/deepseek-chat-v3.1:free",
                        messages: [
                            {
                                role: "user",
                                content: "You are given a tic-tac-toe grid with indices numbered 0 through 9 left to right then next line. Choose the next move in order to win. Your marker is ".concat(counterMarker, " and user marker is ").concat(marker, ". Come up with best move to beat the user. Here is the board cell data stored in the form of an array ").concat(board, ". Answer with a simple index position."),
                            },
                        ],
                    })];
                case 3:
                    response = _c.sent();
                    console.log((_b = response.choices[0]) === null || _b === void 0 ? void 0 : _b.message.content);
                    // botChoice = Number(response);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function checkWC() {
    for (var j = 0; j < 7; j += 3) {
        if (board[j] === board[j + 1] && board[j] === board[j + 2]) {
            if (board[j] === marker)
                status = "won";
            else
                status = "lost";
        }
    }
    for (var j = 0; j < 3; j++) {
        if (board[j] === board[j + 3] && board[j] === board[j + 6]) {
            if (board[j] === marker)
                status = "won";
            else
                status = "lost";
        }
    }
    for (var j = 0; j < 3; j++) {
        if (board[j] === board[j + 4] && board[j] === board[j + 8]) {
            if (board[j] === marker)
                status = "won";
            else
                status = "lost";
        }
    }
    if (status === "won" || status === "lost")
        return true;
    return false;
}
for (var i = 0; i < 5; ++i) {
    go === 1 ? takeUserChoice() : takeBotChoice();
    if (checkWC())
        break;
    if (choicesLeft !== 0) {
        go === 1 ? takeBotChoice() : takeUserChoice();
    }
    if (checkWC())
        break;
}
if (status === "not decided")
    status = "drew";
printBoard();
printStatus(status);
