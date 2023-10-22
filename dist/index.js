"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = __importDefault(require("node:http"));
const socket_io_1 = __importDefault(require("socket.io"));
const cors_1 = __importDefault(require("cors"));
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_1 = __importDefault(require("./user"));
const MAX_NUM_OF_PLAYER = 2;
const DEFAULT_EXPIRATION = 60 * 5;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const server = new node_http_1.default.Server(app);
const redis = (0, redis_1.createClient)({
    password: process.env.REDIS_PASSWORD,
    username: "default",
    socket: {
        host: process.env.REDIS_PUBLIC_ENDPOINT,
        port: parseInt(process.env.REDIS_PORT),
    },
});
redis.connect().then(() => {
    console.log("REDIS IS CONNECTED");
});
const io = new socket_io_1.default.Server(server, {
    cors: {
        origin: "*",
    },
});
// app.get("/keys", async () => {
// 	const keys = await redis.keys("*");
// 	console.log(keys);
// });
// app.get("/flus", async () => {
// 	const keys = await redis.flushAll();
// 	console.log(keys);
// });
app.get("/server-health", async (req, res) => {
    return res.status(200).json({
        status: "ok",
    });
});
app.get("/:roomId", async (req, res) => {
    const roomId = req.params.roomId;
    const player = req.query.player;
    let resObj = {
        session_expired: false,
        redirect: false,
        full: false,
    };
    const session = await redis.get(roomId).catch((err) => {
        res.json({
            error: err,
        });
        throw new Error(err);
    });
    if (session === null) {
        resObj.session_expired = true;
        return res.json(resObj);
    }
    const sessionObj = JSON.parse(session.toString());
    if (!sessionObj[player.toString()]) {
        resObj.redirect = true;
        return res.json(resObj);
    }
    resObj.state = sessionObj.state;
    return res.json(resObj);
});
app.post("/create-session", async (req, res) => {
    try {
        const roomId = req.body.roomId;
        const playerInfo = req.body.playerInfo;
        const initialState = req.body.initialState;
        redis
            .set(roomId, JSON.stringify({ ...initialState, ...playerInfo }))
            .then(() => {
            res.json({
                status: true,
            });
        });
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
app.post("/join-session", async (req, res) => {
    try {
        const roomId = req.body.roomId;
        const playerInfo = req.body.playerInfo;
        const initialStateString = await redis.get(roomId);
        const initialStateParsed = await JSON.parse(initialStateString);
        redis
            .set(roomId, JSON.stringify({ ...initialStateParsed, ...playerInfo }))
            .then(() => {
            res.json({
                status: true,
            });
        });
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
io.on("connection", (socket) => {
    socket.setMaxListeners(100);
    socket.on("join-room", (roomId, name, piece) => {
        socket.join(roomId);
        user_1.default.addUser({ socketId: socket.id, userName: name, roomId, piece });
        const userInRoom = user_1.default.getUserInRoom(roomId);
        console.log(userInRoom);
        if (userInRoom.length === 2) {
            io.in(roomId).emit("both-player-joined", userInRoom);
            socket.to(roomId).emit("make-offer", socket.id);
        }
    });
    socket.on("new-pos", async (virtualChessObj, roomId) => {
        socket.broadcast.to(roomId).emit("updated-pos", virtualChessObj);
        const stateString = await redis.get(roomId);
        const stateParsed = await JSON.parse(stateString);
        redis.set(roomId, JSON.stringify({ ...stateParsed, state: virtualChessObj }));
    });
    socket.on("send-offer-from-client", (to, offer) => {
        io.to(to).emit("send-offer-from-server", socket.id, offer);
    });
    socket.on("send-ans-from-client", (to, ans) => {
        io.to(to).emit("send-ans-from-server", socket.id, ans);
    });
    socket.on("ice-candidate-client", (to, iceCandidate) => {
        io.to(to).emit("ice-candidate-server", iceCandidate);
    });
    socket.on("negotiation-req-from-client", (to, offer) => {
        io.to(to).emit("negotiation-req-from-server", socket.id, offer);
    });
    socket.on("negotiation-done-from-client", (to, ans) => {
        io.to(to).emit("negotiation-done-from-server", socket.id, ans);
    });
    socket.on("call-cut", (to) => {
        io.to(to).emit("cut-call-remote");
    });
    socket.on("call-accepted", (to) => {
        io.to(to).emit("call-accepted-remote");
    });
    socket.on("disconnect", function () {
        const userObj = user_1.default.getRoom(socket.id);
        if (userObj) {
            user_1.default.removeUser(socket.id);
            redis.expire(userObj.roomId, 60 * 5);
            socket.removeAllListeners();
            socket.to(userObj.roomId).emit("user-disconnected", userObj);
        }
    });
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log("SERVER IS LISTENING ON PORT" + " " + PORT);
});
//# sourceMappingURL=index.js.map