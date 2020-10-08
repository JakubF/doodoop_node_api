const resolver = (model, mappings, includes = []) => {
  return (args = {}, rest = undefined) => {
    const requestedKeys = Object.keys(args);
    const query = mappings.reduce((accumulator, mapping) => {
      if(requestedKeys.includes(mapping.attribute)) {
        accumulator[mapping.attribute] = { [mapping.operator]: args[mapping.attribute] };
      }
      return accumulator
    }, {});

    if(Object.keys(query).length > 0)
      return model.findAll({ where: query, include: includes });
    else
      return model.findAll({ include: includes })
  }
};

export default resolver;