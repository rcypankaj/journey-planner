/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoicmN5cGFua2FqIiwiYSI6ImNsaHlxZGpndDAyNmgzaG53ejNwd3I4bTkifQ.XFndIG2XrNF5V_ZqME1k1A";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/rcypankaj/clhywjtbc028z01qu3wng3x5b",
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement("div");
    el.className = "marker";

    // Add marker
    new mapboxgl.Marker({ element: el, anchor: "bottom" })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
  });
};
