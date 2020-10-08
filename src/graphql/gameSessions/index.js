import schema from './queryType';
import queryResolver from '../resolver';
import models from '../../models';
import { Op } from 'sequelize';
import create from '../../services/gameSessions/create';

const mappings = [
  { attribute: 'id', operator: Op.eq },
  { attribute: 'name', operator: Op.iLike },
  { attribute: 'status', operator: Op.eq },
  { attribute: 'enterCode', operator: Op.eq },
];
const resolver = queryResolver(models.GameSession, mappings);
const mutations = {
  create,
};

export {
  resolver,
  schema,
  mappings,
  mutations,
};