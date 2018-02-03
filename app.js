// npm package to calculate shortest distance (question 5)
const Graph = require('node-dijkstra');

// raw input for OnTrack Retail's scenario A
const input = ["AB5", "BC4", "CD8", "DC8", "DE6", "AD5", "CE2", "EB3", "AE7"];

// create 'map' from unique starting nodes (stations)
const map = {};
input.forEach(route => {
  if (!map.hasOwnProperty(route[0])) {
    map[route[0]] = {};
  }
});
// populate with neighbouring nodes and distances
input.forEach(route => {
  map[route[0]][route[1]] = parseInt(route[2]);
});

const tripDistance = stations => {
  let distance = 0;
  for (let i = 0; i < stations.length - 1; i++) {
    if (map[stations[i]].hasOwnProperty(stations[i + 1])) {
      distance += map[stations[i]][stations[i + 1]];
    } else {
      return null;
    }
  }
  return distance;
};

const tripsPerStops = (start, end, requiredStops) => {
  let tripsOfInterest = 0;

  const takeTrip = (trip) => {
    // trip.length includes origin and is used for recursion depth
    if (trip.length > requiredStops) {
      if (trip[trip.length - 1] === end) {
        tripsOfInterest++;
      }
    } else {
      const station = trip[trip.length - 1];
      // branch to all destinations
      for (let destination in map[station]) {
        if (map[station].hasOwnProperty(destination)) {
          const branchedTrip = trip + destination;
          takeTrip(branchedTrip);
        }
      }
    }
  };

  takeTrip(start);
  return tripsOfInterest;
};

const shortestDistance = (start, end) => {
  // if start and end are the same, make a copy of the start and go from there instead
  if (start === end) {
    map.startCopy = map[start];
    start = 'startCopy';
  }
  // using npm package 'node-dijkstra' to find shortest route
  const graph = new Graph(map);
  const path = graph.path(start, end, {cost: true});
  return path.cost || null;
};

const routesPerMaxDistance = (start, end, maxDistance) => {
  let tripsOfInterest = 0;

  const takeTrip = trip => {
    const distance = tripDistance(trip);
    // has the destination been reached before reaching maximum distance?
    if (trip[trip.length - 1] === end && distance > 0 && distance < maxDistance) {
      tripsOfInterest++; // don't stop recursion - might be other solutions sharing the same beginning
    } if (distance < maxDistance) {
      const station = trip[trip.length - 1];
      // branch to all destinations
      for (let destination in map[station]) {
        if (map[station].hasOwnProperty(destination)) {
          const branchedTrip = trip + destination;
          takeTrip(branchedTrip);
        }
      }
    }
  };

  takeTrip(start);
  return tripsOfInterest;
};

console.log({
  '1': tripDistance('ABC'),
  '2': tripDistance('AEBCD'),
  '3': tripDistance('AED'),
  '4': tripsPerStops('A', 'C', 4),
  '5': shortestDistance('B', 'B'),
  '6': routesPerMaxDistance('C', 'C', 30)
});
