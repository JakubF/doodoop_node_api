const entityWrapper = async (record, entityFunction) => {
  const entityAttributes = await entityFunction(record);
  return Object.assign({}, record.dataValues, entityAttributes);
}

const entitiesWrapper = async (collection, entityFunction) => {
  const records = Array.isArray(collection) ? collection : [collection];
  return records.map((record) => {
    return entityWrapper(record, entityFunction)
  })
}
export default entitiesWrapper;