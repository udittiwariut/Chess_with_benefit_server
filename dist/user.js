"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Users {
    constructor() {
        this.addUser = ({ socketId, userName, roomId, piece }) => {
            const user = { socketId, userName, roomId, piece };
            this.users.push(user);
            return { user };
        };
        this.removeUser = (socketId) => {
            this.users = this.users.filter((user) => socketId != user.socketId);
        };
        this.getUser = (socketId) => this.users.find((user) => user.socketId === socketId);
        this.getRoom = (sockedId) => this.users.find((user) => sockedId === user.socketId);
        this.getUserInRoom = (roomId) => this.users.filter((user) => user.roomId === roomId);
        this.getOpponent = (roomId, socketId) => this.users.filter((user) => user.roomId === roomId && user.socketId != socketId)[0];
        this.users = [];
    }
}
exports.default = new Users();
//# sourceMappingURL=user.js.map