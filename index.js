var sortWith2OPT = require("./2opt");
var sortWithKNearest = require("./knearest");

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const generateGPX = (sortedArray) => `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
${sortedArray
  .map((p) => {
    const [lat, lon] = p.split(",");
    return `<wpt lat="${+lat}" lon="${+lon}"></wpt>`;
  })
  .join("\n")}
</gpx>`;

const GetGPXFile = (contents, type, interactionsCount = 1) => {
  const coordsArray = contents.split("\n").filter(onlyUnique);

  let sortedArray;

  switch (type) {
    case "2OPT":
      sortedArray = sortWith2OPT(coordsArray, interactionsCount);
      break;

    case "KN":
      sortedArray = sortWithKNearest(coordsArray);
      break;

    default:
      sortedArray = coordsArray.map((coords) => {
        const [lat, lon] = coords.split(",");
        return `${lat},${lon}`;
      });
  }

  return generateGPX(sortedArray);
};

module.exports = GetGPXFile;
