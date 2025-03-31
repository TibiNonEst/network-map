import type { FeatureCollection, LineString, MultiLineString, Point } from "geojson";

import type { Connection, Exchange, Pop, Providers } from "../../../isp-api/src/api";
export type { Connection, Exchange, Pop, Providers };

export interface User {
	username: string;
	password: string;
}

// Component props
export interface PopDetailsProps {
	pops: Pop[];
	exchanges: Exchange[];
	providers: string[],
	current_pop: Pop;
	logged_in: boolean;

	updatePop: (id: string, provider: Providers) => void;
	removePop: (id: string) => void;
	addExchange: (pop: string, id: number) => void;
	removeExchange: (pop: string, id: number) => void;
}

export interface ConnectionDetailsProps {
	cables: FeatureCollection<MultiLineString>;
	current_connection: Connection;
	logged_in: boolean;

	removeConnection: (start: string, end: string) => void;
}

export interface MapProps {
	pops: Pop[];
	connections: Connection[];
	cables: FeatureCollection<MultiLineString>;
	popsJson: FeatureCollection<Point>;
	connectionsJson: FeatureCollection<LineString>;

	selectPop: (id: string) => void;
	deselectPop: () => void;
	selectConnection: (connection: Connection) => void;
	deselectConnection: () => void;
}

export interface CreateProps {
	pops: Pop[];
	providers: string[];
	cables: FeatureCollection<MultiLineString>;

	addPop: (id: string, fac: string) => void;
	addConnection: (pop1: string, pop2: string, provider: string, cable: string, segments: number[]) => void;
}

export interface LoginProps {
	submit: (username: string, password: string) => void;
	close: () => void;
}
