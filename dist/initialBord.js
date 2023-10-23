"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const virtualChessPos = () => {
    const IvirtualChess = [];
    for (let i = 0; i < 8; i++) {
        const rank = [];
        for (let y = 0; y < 8; y++) {
            rank.push("");
        }
        IvirtualChess.push(rank);
    }
    for (let i = 0; i < 8; i++) {
        IvirtualChess[1][i] = "pawn-b";
    }
    IvirtualChess[0][0] = "rook-b";
    IvirtualChess[0][1] = "knight-b";
    IvirtualChess[0][2] = "bishop-b";
    IvirtualChess[0][3] = "queen-b";
    IvirtualChess[0][4] = "king-b";
    IvirtualChess[0][5] = "bishop-b";
    IvirtualChess[0][6] = "knight-b";
    IvirtualChess[0][7] = "rook-b";
    for (let i = 0; i < 8; i++) {
        IvirtualChess[6][i] = "pawn-w";
    }
    IvirtualChess[7][0] = "rook-w";
    IvirtualChess[7][1] = "knight-w";
    IvirtualChess[7][2] = "bishop-w";
    IvirtualChess[7][3] = "queen-w";
    IvirtualChess[7][4] = "king-w";
    IvirtualChess[7][5] = "bishop-w";
    IvirtualChess[7][6] = "knight-w";
    IvirtualChess[7][7] = "rook-w";
    return IvirtualChess;
};
exports.default = virtualChessPos;
//# sourceMappingURL=initialBord.js.map