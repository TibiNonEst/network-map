<script lang="ts">
	import mapboxgl from "mapbox-gl";

	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from "$env/static/public";
	import { onMount } from "svelte";

	import type { MapProps } from "$lib/types";
	import type { Point } from "drizzle-postgis";
	import type { ExpressionSpecification, GeoJSONSource } from "mapbox-gl";

	let { pops, connections, providers, popsJson, connectionsJson, selectPop, deselectPop, selectConnection, deselectConnection }: MapProps = $props();

	let map: mapboxgl.Map;

	let providerMap = $derived(providers.flatMap((provider, idx) => [idx, provider.color]));
	let providerColors: ExpressionSpecification = $derived(["step", ["get", "provider"], "#6D28D9", ...providerMap]);

	export function update() {
		(map.getSource("pops") as GeoJSONSource).setData(popsJson);
		(map.getSource("connections") as GeoJSONSource).setData(connectionsJson);
		map.setPaintProperty("pops", "circle-color", providerColors);
		map.setPaintProperty("connections", "line-color", providerColors);
	}

	onMount(async () => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

		map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/standard",
			center: [-74, 42.5],
			minZoom: 2,
			zoom: 6
		});

		map.on("load", () => {
			map.addSource("connections", {
				type: "geojson",
				data: connectionsJson
			});

			map.addLayer({
				id: "connections",
				type: "line",
				source: "connections",
				filter: ["has", "provider"],
				paint: {
					"line-color": providerColors,
					"line-width": 3
				}
			});

			map.addSource("pops", {
				type: "geojson",
				data: popsJson,
				cluster: true,
				clusterMaxZoom: 17,
				clusterRadius: 15
			});

			map.addLayer({
				id: "clusters",
				type: "circle",
				source: "pops",
				filter: ["has", "point_count"],
				paint: {
					"circle-color": "#6D28D9",
					"circle-radius": 20
				}
			});

			map.addLayer({
				id: "cluster_count",
				type: "symbol",
				source: "pops",
				filter: ["has", "point_count"],
				layout: {
					"text-field": ["get", "point_count_abbreviated"],
					"text-size": 14
				},
				paint: {
					"text-color": "white"
				}
			});

			map.addLayer({
				id: "pops",
				type: "circle",
				source: "pops",
				filter: ["!", ["has", "point_count"]],
				paint: {
					"circle-color": providerColors,
					"circle-radius": 5,
					"circle-stroke-width": 1,
					"circle-stroke-color": "white"
				}
			});

			map.on("click", "clusters", (e) => {
				const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
				const clusterId = features[0].properties?.cluster_id;
				const source = map.getSource("pops") as GeoJSONSource;

				source.getClusterExpansionZoom(clusterId, (err, zoom) => {
					if (err) return;

					map.easeTo({
						center: (features[0].geometry as Point).coordinates as [number, number],
						zoom: zoom!
					});
				});
			});

			const popPopup = new mapboxgl.Popup({
				closeButton: false,
				closeOnClick: false
			});

			const connectionPopup = new mapboxgl.Popup({
				closeButton: false,
				closeOnClick: false
			});

			map.on("mouseenter", "pops", (e) => {
				if (e.features === undefined) return;

				const feature = e.features[0];
				const coordinates = (feature.geometry as Point).coordinates.slice();
				const pop = pops.find((p) => p.id === feature.properties?.id);

				if (pop === undefined) {
					return;
				}

				if (connectionPopup.isOpen()) {
					connectionPopup.remove();
				}

				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}

				const html = [`<p><b>${pop.name}</b></p>`, `<p>${pop.id}</p>`];

				if (pop.connections.length > 0) {
					html.push(`<br><b>Connections:</b> ${pop.connections.length}`);
				}

				if (pop.exchanges.length > 0) {
					html.push(`<br><b>Exchanges:</b> ${pop.exchanges.length}`);
				}

				popPopup
					.setLngLat(coordinates as [number, number])
					.setHTML(html.join(""))
					.addTo(map);
			});

			map.on("mouseleave", "pops", () => {
				popPopup.remove();
			});

			map.on("mouseenter", "connections", (e) => {
				if (e.features === undefined) return;

				const feature = e.features[0];
				const connection = connections.find((c) => c.id === feature.properties?.id);

				if (connection === undefined || popPopup.isOpen()) {
					return;
				}

				const html = [`<p><b>${connection.name}</b></p>`];

				if (connection.provider) {
					const provider = providers.find((provider) => provider.id === connection.provider)?.name;
					html.push(`<p><b>Provider:</b> ${provider}</p>`);
				}

				if (connection.cable) {
					html.push(`<b>Cable:</b> ${connection.cable}`);
				}

				connectionPopup.setLngLat(e.lngLat).setHTML(html.join("")).addTo(map);
			});

			map.on("mouseleave", "connections", () => {
				connectionPopup.remove();
			});

			map.on("click", (e) => {
				const features = map.queryRenderedFeatures(e.point);
				const f_pop = features.find((feature) => feature.layer?.id === "pops");
				const f_connection = features.find((feature) => feature.layer?.id === "connections");

				if (f_pop !== undefined) {
					const pop = pops.find((p) => p.id === f_pop.properties?.id);
					if (pop) {
						selectPop(pop.id);
					}
				} else if (f_connection !== undefined) {
					const connection = connections.find((c) => c.id === f_connection.properties?.id);
					if (connection) {
						selectConnection(connection);
					}
				}

				if (f_pop === undefined) {
					deselectPop();
				}
				if (f_connection === undefined) {
					deselectConnection();
				}
			});

			for (const layer of ["clusters", "pops", "connections"]) {
				map.on("mouseenter", layer, () => {
					map.getCanvas().style.cursor = "pointer";
				});
				map.on("mouseleave", layer, () => {
					map.getCanvas().style.cursor = "";
				});
			}
		});
	});
</script>

<div id="map"></div>

<style lang="scss">
	#map {
		height: 100vh;
	}
</style>
