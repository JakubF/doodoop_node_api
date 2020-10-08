import schema from './queryType';
import queryResolver from '../resolver';
import models from '../../models';
import { Op } from 'sequelize';

const mappings = [
  { attribute: 'id', operator: Op.eq },
  { attribute: 'name', operator: Op.iLike },
  { attribute: 'answer', operator: Op.iLike },
  { attribute: 'status', operator: Op.eq },
  { attribute: 'points', operator: Op.eq },
  { attribute: 'gameSessionId', operator: Op.eq },
];
const resolver = queryResolver(models.RoundElement, mappings);

export {
  resolver,
  schema,
  mappings,
};