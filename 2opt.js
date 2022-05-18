let path = [];
let paths = [];
let points = [];
let swaps = [];
let insertions = [];
let pathDistances = [];
let distanceMatrix;
let N;

const generateDistanceMatrix = () => {
  distanceMatrix = new Array(N);
  for (let i = 0; i < N; i++) {
    distanceMatrix[i] = new Array(N);
  }

  for (let i = 0; i < N; i++) {
    for (let j = i; j < N; j++) {
      distanceMatrix[i][j] = calcCrow(points[i].x, points[i].y, points[j].x, points[j].y);
      distanceMatrix[j][i] = distanceMatrix[i][j];
    }
  }
};

const calcCrow = (lat1, lon1, lat2, lon2) => {
  let R = 6371; // km
  let dLat = toRad(lat2 - lat1);
  let dLon = toRad(lon2 - lon1);
  let l1 = toRad(lat1);
  let l2 = toRad(lat2);

  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(l1) * Math.cos(l2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d;
};

// Converts numeric degrees to radians
const toRad = (Value) => {
  return (Value * Math.PI) / 180;
};

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

const generateRandomPath = () => {
  let path = [];
  for (let i = 0; i < N; i++) {
    path[i] = i;
  }
  path = shuffle(path);
  return path;
};

const swapEdges = (path, first, second) => {
  return path.slice(0, first + 1).concat(
    path
      .slice(first + 1, second + 1)
      .reverse()
      .concat(path.slice(second + 1))
  );
};

const getPathDistance = (path) => {
  let d = distanceMatrix[path[0]][path[path.length - 1]];
  for (let i = 1; i < path.length; i++) {
    d += distanceMatrix[path[i - 1]][path[i]];
  }
  return d;
};

const twoOpt = (count) => {
  for (let i = 0; i < path.length - 2; i++) {
    for (let j = i + 2; j < path.length - 1; j++) {
      if (
        distanceMatrix[path[i]][path[i + 1]] + distanceMatrix[path[j]][path[j + 1]] >
        distanceMatrix[path[i]][path[j]] + distanceMatrix[path[j + 1]][path[i + 1]]
      ) {
        swaps.push({
          i: count,
          firstEdge0: points[path[i]],
          firstEdge1: points[path[i + 1]],
          secondEdge0: points[path[j]],
          secondEdge1: points[path[j + 1]],
        });

        path = swapEdges(path, i, j);
        paths.push(path);
        return getPathDistance(path);
      }
    }
    // check the edge from last point to first point
    if (
      distanceMatrix[path[i]][path[i + 1]] + distanceMatrix[path[j]][path[0]] >
      distanceMatrix[path[i]][path[j]] + distanceMatrix[path[0]][path[i + 1]]
    ) {
      swaps.push({
        i: count,
        firstEdge0: points[path[i]],
        firstEdge1: points[path[i + 1]],
        secondEdge0: points[path[j]],
        secondEdge1: points[path[0]],
      });

      path = swapEdges(path, i, j);
      paths.push(path);
      return getPathDistance(path);
    }
  }
  return getPathDistance(path);
};

const iterativeTwoOpt = () => {
  path = generateRandomPath();

  let bestDistance = 0;
  let count = 0;
  while (bestDistance != twoOpt(count)) {
    bestDistance = getPathDistance(path);
    pathDistances.push(bestDistance);
    count += 1;
  }

  return [bestDistance, [...path]];
};

const sortWith2OPT = (coordsArray, interactionsCount) => {
  points = coordsArray.map((coords) => {
    const [lat, lon] = coords.split(",");
    return { x: +lat, y: +lon };
  });

  N = points.length;
  generateDistanceMatrix();

  let shortestPath;

  for (let i = 0; i < interactionsCount; i++) {
    path = [];
    paths = [];
    swaps = [];
    insertions = [];
    pathDistances = [];

    let generatedPath = iterativeTwoOpt();

    if (!shortestPath) shortestPath = generatedPath;
    else if (shortestPath[0] > generatedPath[0]) shortestPath = generatedPath;
  }

  return shortestPath[1].map((i) => `${points[i].x}, ${points[i].y}`);
};

module.exports = sortWith2OPT;
