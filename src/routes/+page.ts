import GeoJSON from "geojson";

import { PUBLIC_API_ORIGIN } from "$env/static/public";

import type { Connection, Exchange, Pop, Provider } from "$lib/types";
import type { FeatureCollection, LineString, Point } from "geojson";
import type { PageLoadEvent } from "./$types";

export async function load({ fetch }: PageLoadEvent) {
	const origin = PUBLIC_API_ORIGIN;

	const pops: Pop[] = await fetch(`${origin}/pops`).then(a => a.json());
	const exchanges: Exchange[] = await fetch(`${origin}/exchanges`).then(a => a.json());
	const connections: Connection[] = await fetch(`${origin}/connections`).then(a => a.json());
	const providers: Provider[] = await fetch(`${origin}/providers`).then(async a => a.json());

	const popsData = pops.map(pop => {
		return { ...pop, provider: pop.provider || -1 }
	});

	const connectionsData = connections.map(connection => {
		const start = pops.find(pop => pop.id === connection.start);
		const end = pops.find(pop => pop.id === connection.end);

		if (start === undefined || end === undefined) {
			return;
		}

		let startCoords = [start.longitude, start.latitude];
		let endCoords = [end.longitude, end.latitude];

		const coords: number[][] = [];

		if (connection.route) {
			// for (const coord of cable.geometry.coordinates) {
			// 	coords.push(coord);
			// }

			if (Math.abs(coords[0][0] - endCoords[0]) + Math.abs(coords[0][1] - endCoords[1]) <
				Math.abs(coords[coords.length - 1][0] - startCoords[0]) + Math.abs(coords[coords.length - 1][1] - startCoords[1])) {
				const temp = startCoords;
				startCoords = endCoords;
				endCoords = temp;
			}
		}

		coords.unshift(startCoords);
		coords.push(endCoords);

		for (let i = 0; i < coords.length - 1; i++) {
			if (coords[i + 1][0] - coords[i][0] >= 180) {
				coords[i + 1][0] -= 360;
			} else if (coords[i][0] - coords[i + 1][0] >= 180) {
				coords[i][0] -= 360;
			}
		}

		const provider = providers.findIndex(provider => provider.name === connection.provider);

		return { coords, start: start.id, end: end.id, provider };
	});

	const popsJson: FeatureCollection<Point> = GeoJSON.parse(popsData, { Point: [ "latitude", "longitude" ], include: [ "id", "active", "provider" ] });
	const connectionsJson: FeatureCollection<LineString> = GeoJSON.parse(connectionsData, { LineString: "coords", include: [ "start", "end", "provider" ] });

	return { origin, pops, exchanges, connections, providers, popsJson, connectionsJson };
}
