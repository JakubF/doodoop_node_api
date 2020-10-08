import schema from './queryType';
import queryResolver from '../resolver';
import models from '../../models';
import { Op } from 'sequelize';
import create from '../../services/gameSessions/create';
import update from '../../services/gameSessions/update';
import start from '../../services/gameSessions/start';
import join from '../../services/gameSessions/join';

const mappings = [
  { attribute: 'id', operator: Op.eq },
  { attribute: 'name', operator: Op.iLike },
  { attribute: 'status', operator: Op.eq },
  { attribute: 'enterCode', operator: Op.eq },
];
const includes = [
  { model: models.RoundElement, required: false },
  { model: models.Player, required: false },
];
const resolver = queryResolver(models.GameSession, mappings, includes);
const mutations = {
  create,
  update,
  start,
  join,
};

export {
  resolver,
  schema,
  mappings,
  mutations,
};