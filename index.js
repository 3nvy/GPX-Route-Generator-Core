var sphereKnn = require("sphere-knn");

const generateGPX = (
  sortedArray
) => `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
${sortedArray
  .map((p) => {
    const [lat, lon] = p.split(",");
    return `<wpt lat="${+lat}" lon="${+lon}"></wpt>`;
  })
  .join("\n")}
</gpx>`;

const GetGPXFile = (contents) => {
  const posArray = contents.split("\n").map((coords) => {
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

    var index = posArray.reduce(
      (acc, el, i) => (el.toString() === startPoint.toString() ? acc + i : acc),
      0
    );
    posArray.splice(index, 1);
  }

  return generateGPX(sortedArray);
};

module.exports = GetGPXFile;
