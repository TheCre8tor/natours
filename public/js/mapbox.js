export const displayMap = locations => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGhlY3JlOHRvciIsImEiOiJja25qdWw1ejgwNHVlMm9wb3E5NTltNHozIn0.7TvATW4HrvaQ-OELOXqKSA';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/thecre8tor/cknlbn4qb2qxb17qzod6dq6hv',
        center: [-118.113491, 34.111745],
        scrollZoom: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(location => {
        // Create Marker
        const element = document.createElement('div');
        element.className = 'marker';

        // Add the Marker
        new mapboxgl.Marker({
            element: element,
            anchor: 'bottom'
        })
            .setLngLat(location.coordinates)
            .addTo(map);

        // Add information popup
        new mapboxgl.Popup({ offset: 30 }).setLngLat(location.coordinates).setHTML(`<p>Day ${location.day}: ${location.description}</p>`).addTo(map);

        // Extends the map bounds to include current location
        bounds.extend(location.coordinates);
    });

    // Fit the bounds to the map
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            right: 100,
            bottom: 150,
            left: 100
        }
    });
};
