import type { FeatureCollection, LineString, Point } from "drizzle-postgis";

export type Cuid2 = string;

export interface Pop {
	id: string;
	fac: number;
	name: string;
	active: boolean;
	location: string;
	longitude: number;
	latitude: number;
	provider?: Cuid2 | null;
	connections: Cuid2[];
	exchanges: number[];
}

export interface Exchange {
	id: number;
	name: string;
}

export interface Connection {
	id: Cuid2;
	name: string;
	pops: string[];
	provider: string;
	cable: string | null;
	route: LineString;
}

export interface Provider {
	id: Cuid2;
	name: string;
	color: string;
}

export interface User {
	id: Cuid2;
	githubId: number;
	username: string;
}

export interface Session {
	id: Cuid2;
	secretHash: string;
	userId: Cuid2;
	createdAt: Date;
	lastVerifiedAt: Date | null;
}

// Component props
export interface PopDetailsProps {
	connections: Connection[];
	exchanges: Exchange[];
	providers: Provider[];
	current_pop: Pop;
	logged_in: boolean;

	updatePop: (id: string, provider: string) => void;
	removePop: (id: string) => void;
	addExchange: (pop: string, id: number) => void;
	removeExchange: (pop: string, id: number) => void;
}

export interface ConnectionDetailsProps {
	providers: Provider[];
	current_connection: Connection;
	logged_in: boolean;

	removeConnection: (id: string) => void;
	updateConnection: (input: { id: string; pops?: string[]; provider?: string; cable?: string; route?: string }) => void;
}

export interface MapProps {
	pops: Pop[];
	connections: Connection[];
	providers: Provider[];
	popsJson: FeatureCollection<Point>;
	connectionsJson: FeatureCollection<LineString>;

	selectPop: (id: string) => void;
	deselectPop: () => void;
	selectConnection: (connection: Connection) => void;
	deselectConnection: () => void;
}

export interface CreateProps {
	pops: Pop[];
	providers: Provider[];

	addPop: (id: string, fac: number) => void;
	addConnection: (pop1: string, pop2: string, provider: string, cable: string) => void;
	addProvider: (name: string, color: string) => void;
}

export interface LoginProps {
	submit: (username: string, password: string) => void;
	close: () => void;
}
