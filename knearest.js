var sphereKnn = require("sphere-knn");

const sortWithKNearest = (coordsArray) => {
  const posArray = coordsArray.map((coords) => {
    const [lat, lon] = coords.split(",");
    return [lat, lon];
  });

  const firstPos = posArray.shift();
  let sortedArray = [firstPos.toString()];
  let startPoint = firstPos;

  while (posArray.length > 0) {
    var point = sphereKnn(posArray)(startPoint[0], startPoint[1], 1, 999999);
    startPoint = point[0];
    sortedArray.push(startPoint.toString());

    var index = posArray.reduce((acc, el, i) => (el.toString() === startPoint.toString() ? acc + i : acc), 0);
    posArray.splice(index, 1);
  }
};

module.export = sortWithKNearest;
