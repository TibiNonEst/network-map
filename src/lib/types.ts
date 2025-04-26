import type { FeatureCollection, LineString, Point } from "geojson";

import type { Connection, Exchange, Pop, Provider } from "../../../isp-api/src/api";
export type { Connection, Exchange, Pop, Provider };

export interface User {
	username: string;
	password: string;
}

// Component props
export interface PopDetailsProps {
	pops: Pop[];
	exchanges: Exchange[];
	providers: Provider[],
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

	removeConnection: (id: number) => void;
	updateConnection: (id: number, provider: string, cable: string, route: string) => void;
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

	addPop: (id: string, fac: string) => void;
	addConnection: (pop1: string, pop2: string, provider: string, cable: string) => void;
}

export interface LoginProps {
	submit: (username: string, password: string) => void;
	close: () => void;
}
