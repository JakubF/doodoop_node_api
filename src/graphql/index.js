const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const graphql = {};

fs
  .readdirSync(__dirname)
  .filter(file => !file.includes('.'))
  .map((dir) => {
    return {
      name: dir,
      data: require(path.join(__dirname, dir, 'index.js')),
    }
  })
  .forEach(resource => {
    graphql[resource.name] = resource.data
  });
export default graphql;