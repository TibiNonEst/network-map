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
	const providers: string[] = await fetch(`${origin}/providers`).then(async a => a.json());
	const cables: FeatureCollection = await fetch(`${origin}/cables`).then(async a => a.json());

	const connectionsData = connections.map(connection => {
		const start = pops.find(pop => pop.id === connection.start);
		const end = pops.find(pop => pop.id === connection.end);

		if (start === undefined || end === undefined) {
			return;
		}

		let startCoords = [start.longitude, start.latitude];
		let endCoords = [end.longitude, end.latitude];

		let cable;
		if (connection.cable) {
			cable = cables.features.find(cable => cable.properties?.id === connection.cable);
		}

		const coords: number[][] = [];

		if (cable && cable.geometry.type === "MultiLineString") {
			const segments = connection.segments || [];

			if (segments.length === 0) {
				segments.push(0);
			}

			for (const segment of segments) {
				for (const coord of cable.geometry.coordinates[segment]) {
					coords.push(coord);
				}
			}

			if (Math.abs(coords[0][0] - endCoords[0]) + Math.abs(coords[0][1] - endCoords[1]) <
				Math.abs(coords[coords.length - 1][0] - startCoords[0]) + Math.abs(coords[coords.length - 1][1] - startCoords[1])) {
				const temp = startCoords;
				startCoords = endCoords;
				endCoords = temp;
			}
		}

		if (!cable) {
			coords.unshift(startCoords);
			coords.push(endCoords);
		}

		for (let i = 0; i < coords.length - 1; i++) {
			if (coords[i + 1][0] - coords[i][0] >= 180) {
				coords[i + 1][0] -= 360;
			} else if (coords[i][0] - coords[i + 1][0] >= 180) {
				coords[i][0] -= 360;
			}
		}

		const p_idx = providers.indexOf(connection.provider);

		return { coords, start: start.id, end: end.id, provider: p_idx };
	});

	const popsJson: FeatureCollection<Point> = GeoJSON.parse(pops, { Point: [ "latitude", "longitude" ], include: [ "id", "active" ] });
	const connectionsJson: FeatureCollection<LineString> = GeoJSON.parse(connectionsData, { LineString: "coords", include: [ "start", "end", "provider" ] });

	return { origin, pops, exchanges, connections, providers, cables, popsJson, connectionsJson };
}
