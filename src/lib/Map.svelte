<script lang="ts">
	import mapboxgl from "mapbox-gl";

	import { onMount } from "svelte";

	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from "$env/static/public";

	import type { Point } from "geojson";
	import type { GeoJSONSource } from "mapbox-gl";

    import type { MapProps } from "$lib/types";

	let { pops, connections, cables, popsJson, connectionsJson, selectPop, deselectPop, selectConnection, deselectConnection }: MapProps = $props();

	let map: mapboxgl.Map;

	export function update() {
		(map.getSource("pops") as GeoJSONSource).setData(popsJson);
		(map.getSource("connections") as GeoJSONSource).setData(connectionsJson);
	}

	onMount(async () =>  {
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
				paint: {
					"line-color": "blue",
					"line-width": 3
				}
			});

			map.addSource("pops", {
				type: "geojson",
				data: popsJson,
				cluster: true,
				clusterMaxZoom: 17,
				clusterRadius: 30
			});

			map.addLayer({
				id: "clusters",
				type: "circle",
				source: "pops",
				filter: ["has", "point_count"],
				paint: {
					"circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
					"circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40]
				}
			});

			map.addLayer({
				id: "cluster_count",
				type: "symbol",
				source: "pops",
				filter: ["has", "point_count"],
				layout: {
					"text-field": ["get", "point_count_abbreviated"],
					"text-size": 12
				}
			});

			map.addLayer({
				id: "pops",
				type: "circle",
				source: "pops",
				filter: ["!", ["has", "point_count"]],
				paint: {
					"circle-color": "#11b4da",
					"circle-radius": 5,
					"circle-stroke-width": 1,
					"circle-stroke-color": "#fff"
				}
			});

			map.on("click", "clusters", (e) => {
				const features = map.queryRenderedFeatures(e.point, {layers: ["clusters"]});
				const clusterId = features[0].properties?.cluster_id;
				const source = map.getSource("pops") as GeoJSONSource;

				source.getClusterExpansionZoom(clusterId, (err, zoom) => {
					  if (err) return;

					  map.easeTo({
						  center: ((features[0].geometry as Point).coordinates as [number, number]),
						  zoom: zoom!
					  });
				  }
				);
			});

			const popPopup = new mapboxgl.Popup({
				closeButton: false,
				closeOnClick: false
			});

			map.on("mouseenter", "pops", (e) => {
				if (e.features === undefined) return;

				const feature = e.features[0];
				const coordinates = (feature.geometry as Point).coordinates.slice();
				const pop = pops.find(p => p.id === feature.properties?.id);

				if (pop === undefined) {
					return;
				}

				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}

				const html = [
					`<p><b>${pop.name}</b></p>`,
					`<p>${pop.id}</p>`
				];

				if (pop.adjacencies.length > 0) {
					html.push(`<br><b>Adjacencies:</b> ${pop.adjacencies.length}`);
				}

				if (pop.exchanges.length > 0) {
					html.push(`<br><b>Exchanges:</b> ${pop.exchanges.length}`);
				}

				popPopup.setLngLat(coordinates as [number, number]).setHTML(html.join("")).addTo(map);
			});

			map.on("mouseleave", "pops", () => {
				popPopup.remove();
			});

            const connectionPopup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            map.on("mouseenter", "connections", (e) => {
                if (e.features === undefined) return;

                const feature = e.features[0];
                const connection = connections.find(c => c.start === feature.properties?.start && c.end === feature.properties?.end);

                if (connection === undefined) {
                    return;
                }

                const html = [
                    `<p><b>${connection.start} - ${connection.end}</b></p>`,
                    `<p><b>Provider:</b> ${connection.provider}</p>`
                ];

                if (connection.cable) {
                    const cable = cables.features.find(cable => cable.properties?.id === connection.cable);
                    html.push(`<b>Cable:</b> ${cable?.properties?.name}`);
                }

                connectionPopup.setLngLat(e.lngLat).setHTML(html.join("")).addTo(map);
            });

            map.on("mouseleave", "connections", () => {
                connectionPopup.remove();
            });

			map.on("click", "pops", (e) => {
				if (e.features === undefined) return;

				const feature = e.features[0];
                const pop = pops.find(p => p.id === feature.properties?.id);
                if (pop) {
                    selectPop(pop);
                }
			});

            map.on("click", "connections", (e) => {
                if (e.features === undefined) return;

                const feature = e.features[0];
                const connection = connections.find(c => c.start === feature.properties?.start && c.end === feature.properties?.end);
                if (connection) {
                    selectConnection(connection);
                }
            });

			map.on("click", (e) => {
				const features = map.queryRenderedFeatures(e.point);
				if (features.find(feature => feature.layer?.id === "pops" || feature.layer?.id === "clusters") === undefined) {
					deselectPop();
				}
                if (features.find(feature => feature.layer?.id === "connections") === undefined) {
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
