export interface Pop {
	id: string;
	fac: number;
	name: string;
	active: boolean;
	location: string;
	longitude: number;
	latitude: number;
	adjacencies: string[];
	exchanges: number[];
}

export interface Exchange {
	id: number;
	name: string;
}

export interface Connection {
	start: string;
	end: string;
}

export interface AddPop {
	id: string;
	fac: string;
}

export interface RemovePop {
	id: string;
}

export interface ModifyAdjacency {
	pop: string;
	adjacency: string;
}

export interface ModifyExchange {
	pop: string;
	id: number;
}

export interface User {
	username: string;
	password: string;
}
