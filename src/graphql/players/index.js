import schema from './queryType';
import queryResolver from '../resolver';
import models from '../../models';
import { Op } from 'sequelize';

const mappings = [
  { attribute: 'id', operator: Op.eq },
  { attribute: 'name', operator: Op.iLike },
  { attribute: 'gameSessionId', operator: Op.eq },
];
const includes = [
  { model: models.GameSession, required: false, as: 'gameSession' },
];
const resolver = queryResolver(models.Player, mappings, includes);

export {
  resolver,
  schema,
  mappings,
};