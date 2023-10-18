interface CheckMate {
	isCheckMate: boolean;
	winner: string;
}
export interface ChessBoardPos {
	newPos: string[][];
	isPromotion: boolean;
	piece?: string;
}

export interface IsCheck {
	isCheck: boolean;
	from: string[];
}

export interface CanMoveIn {
	[key: string]: string;
}

export interface State {
	currentPos: string[][];
	turn: string;
	moves: CanMoveIn;
	retired: {
		w: string[];
		b: string[];
	};
	kingPosition: {
		w: string;
		b: string;
	};
	isCheck: IsCheck;
	checkMate: CheckMate;
}

export interface SessionObj {
	w?: string;
	b?: string;
	state?: State;
	session_expired: boolean;
	redirect: boolean;
	full: boolean;
}

export interface User {
	socketId: string;
	userName: string;
	roomId: string;
	piece: string;
}
