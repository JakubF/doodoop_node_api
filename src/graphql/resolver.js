const resolver = (model, mappings) => {
  return (args = {}) => {
    const requestedKeys = Object.keys(args);
    const query = mappings.reduce((accumulator, mapping) => {
      if(requestedKeys.includes(mapping.attribute)) {
        accumulator[mapping.attribute] = { [mapping.operator]: args[mapping.attribute] };
      }
      return accumulator
    }, {});

    if(Object.keys(query).length > 0)
      return model.findAll({ where: query });
    else
      return model.findAll()
  }
};

export default resolver;