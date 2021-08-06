const busStops = [
  [-71.093729, 42.359244],
  [-71.094915, 42.360175],
  [-71.0958, 42.360698],
  [-71.099558, 42.362953],
  [-71.103476, 42.365248],
  [-71.106067, 42.366806],
  [-71.108717, 42.368355],
  [-71.110799, 42.369192],
  [-71.113095, 42.370218],
  [-71.115476, 42.372085],
  [-71.117585, 42.373016],
  [-71.118625, 42.374863],
];

mapboxgl.accessToken = 'pk.eyJ1IjoiYm9ib3BvcDc4NyIsImEiOiJja3J6Z2g1N2MxOXZxMndtaXE2b2U2bTJlIn0.wXwq5Wxs0afIik_mj_fcNA';

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-71.0873216701205, 42.354642574314255],
  zoom: 12.8,
});

let counter = 0;
let isRunning = false;
let marker = new mapboxgl.Marker({
  "color": "#3bc22d"
})
  .setLngLat([-71.093729, 42.359244])
  .addTo(map);
let interval;

function restart() {
  if(isRunning) {
    return;
  }
  counter = 0;
  move();
}

function move() {
  isRunning = true;
  interval = setInterval(() => {
    if(counter >= busStops.length) {
      isRunning = false;
      return;
    }
    marker.setLngLat(busStops[counter]);
    counter++;
  }, 1000);
}

let liveMarkers = [];

async function run() {
  const locations = await getBusLocations();
  console.log("Updated at", new Date());
  console.log(locations);
  for(let i = 0; i < liveMarkers.length; i++) {
    liveMarkers[i].remove();
  }
  liveMarkers = new Array(locations.length);
  for(let i = 0; i < locations.length; i++) {
    let location = [];
    location.push(locations[i].attributes.longitude, locations[i].attributes.latitude);
    let popup = new mapboxgl.Popup()
      .setText("")
    liveMarkers[i] = new mapboxgl.Marker({
      "color": "#c92a02"
    })
      .setLngLat(location)
      .addTo(map);
  }

  setTimeout(run, 20000);
}

async function getBusLocations() {
  const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip'
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

run();

if (typeof module !== 'undefined') {
  module.exports = { move };
}