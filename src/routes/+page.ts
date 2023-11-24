import GeoJSON from "geojson";

import { PUBLIC_API_ORIGIN } from "$env/static/public";

import type { Connection, Exchange, Pop } from "$lib/types";
import type { FeatureCollection, LineString, Point } from "geojson";
import type { PageLoadEvent } from "./$types";

export async function load({ fetch }: PageLoadEvent) {
	const origin = PUBLIC_API_ORIGIN;

	const pops: Pop[] = await fetch(`${origin}/pops`).then(a => a.json());
	const exchanges: Exchange[] = await fetch(`${origin}/exchanges`).then(a => a.json());
	const connections: Connection[] = await fetch(`${origin}/connections`).then(a => a.json());

	const connectionsData = connections.map(connection => {
		const start = pops.find(pop => pop.id === connection.start);
		const end = pops.find(pop => pop.id === connection.end);

		if (start === undefined || end === undefined) {
			return;
		}

		let endOffset = 0;
		let startOffset = 0;
		if (end.longitude - start.longitude >= 180) {
			endOffset = -360;
		} else if (start.longitude - end.longitude >= 180) {
			startOffset = -360;
		}

		return {coords: [[start.longitude + startOffset, start.latitude], [end.longitude + endOffset, end.latitude]]};
	});

	const connectionsJson: FeatureCollection<LineString> = GeoJSON.parse(connectionsData, {LineString: "coords"});
	const popsJson: FeatureCollection<Point> = GeoJSON.parse(pops, {Point: ["latitude", "longitude"], include: ["id", "active"]});

	return { origin, pops, exchanges, connections, connectionsJson, popsJson };
}
