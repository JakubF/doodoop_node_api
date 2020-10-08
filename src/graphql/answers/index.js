import schema from './queryType';
import queryResolver from '../resolver';
import models from '../../models';
import { Op } from 'sequelize';

const mappings = [
  { attribute: 'id', operator: Op.eq },
  { attribute: 'roundElementId', operator: Op.eq },
  { attribute: 'playerId', operator: Op.eq },
];
const includes = [
  { model: models.Player, required: false, as: 'player' },
  { model: models.RoundElement, required: false, as: 'roundElement' },
];
const resolver = queryResolver(models.Player, mappings, includes);

export {
  resolver,
  schema,
  mappings,
};