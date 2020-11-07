export const dig = (object, ...keys) => {
  let currentValue = object;

  keys.forEach((key) => {
    if (!currentValue)
      return;

    const newValue = currentValue[key];
    if (typeof newValue === 'undefined' || newValue === null)
      return currentValue = undefined;

    currentValue = newValue;
  });

  return currentValue;
};

export const compareGraphqlResults = (records, mappings, response) => {
  response.forEach((node, index) => {
    const record = records[index];
    
    mappings.forEach(mapping => {
      let sourceValue, responseValue;

      if (Array.isArray(mapping.source)) {
        sourceValue = dig(record, ...mapping.source);
        responseValue = dig(node, ...mapping.target);
      } else {
        sourceValue = record[mapping.source];
        responseValue = node[mapping.target];
      }
      expect(responseValue, `Expected attribute ${mapping.source} at index ${index} to equal returned value at ${mapping.target}.`).toEqual(sourceValue);
    });
  });
};