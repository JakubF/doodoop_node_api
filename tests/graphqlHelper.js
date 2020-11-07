const digOrReturnOnArray = (object, ...keys) => {
  let currentValue = object;
  let depth = 0;

  keys.forEach((key) => {
    if (!currentValue || Array.isArray(currentValue))
      return;

    const newValue = currentValue[key];
    if (typeof newValue === 'undefined' || newValue === null)
      return currentValue = undefined;

    depth++;
    currentValue = newValue;
  });

  return [currentValue, keys.slice(depth)];
};

const compareNestedAttributes = (index, record, node, mapping) => {
  let [currentSourceValue, sourceReminder] = digOrReturnOnArray(record, ...mapping.source);
  let [currentTargetValue, targetReminder] = digOrReturnOnArray(node, ...mapping.target);

  if (Array.isArray(currentSourceValue)) {
    expect(currentTargetValue).toBeInstanceOf(Array);
    expect(currentTargetValue.length, `Index ${index}. Number of returned items at ${mapping.target} must be equal to number of source items at ${mapping.source}.`).toEqual(currentSourceValue.length)
    currentSourceValue.forEach((sourceObject, nestedIndex) => {
      const sourceObjectValue = digOrReturnOnArray(sourceObject, ...sourceReminder);
      const targetObjectValue = digOrReturnOnArray(currentTargetValue[nestedIndex], ...targetReminder);
      const errorMessage = `Nested array index: ${nestedIndex}. Expected attribute ${mapping.source} at index ${index} to equal returned value at ${mapping.target}.`;
      expect(targetObjectValue, errorMessage).toEqual(sourceObjectValue);
    });
  } else {
    const errorMessage = `Expected attribute ${mapping.source} at index ${index} to equal returned value at ${mapping.target}.`;
    expect(currentTargetValue).not.toBe(Array);
    expect(currentTargetValue, errorMessage).toEqual(currentSourceValue);
  }
};

export const compareGraphqlResults = (records, mappings, response) => {
  response.forEach((node, index) => {
    const record = records[index];
    
    mappings.forEach(mapping => {
      let sourceValue, responseValue;
      const errorMessage = `Expected attribute ${mapping.source} at index ${index} to equal returned value at ${mapping.target}.`;

      if (Array.isArray(mapping.source)) {
        compareNestedAttributes(index, record, node, mapping);
      } else {
        sourceValue = record[mapping.source];
        if (Array.isArray(mapping.target))
          responseValue = digOrReturnOnArray(node, ...mapping.target)[0];
        else
          responseValue = node[mapping.target];

        expect(responseValue, errorMessage).toEqual(sourceValue);
      }
    });
  });
};