import { User } from "./types/globalTypes";

class Users {
	public users: User[];
	constructor() {
		this.users = [];
	}

	addUser = ({ socketId, userName, roomId, piece }: User) => {
		const user = { socketId, userName, roomId, piece };
		this.users.push(user);

		return { user };
	};
	removeUser = (socketId: string) => {
		this.users = this.users.filter((user) => socketId != user.socketId);
	};

	getUser = (socketId: string) =>
		this.users.find((user) => user.socketId === socketId);

	getRoom = (sockedId: string) =>
		this.users.find((user) => sockedId === user.socketId);

	getUserInRoom = (roomId: string) =>
		this.users.filter((user) => user.roomId === roomId);

	getOpponent = (roomId: string, socketId: string) =>
		this.users.filter(
			(user) => user.roomId === roomId && user.socketId != socketId
		)[0];
}

export default new Users();
