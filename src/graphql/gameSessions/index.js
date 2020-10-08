import schema from './queryType';
import queryResolver from '../resolver';
import models from '../../models';
import { Op } from 'sequelize';
import gameSessionEntity from '../../entities/gameSession';
import { entitiesWrapper } from '../../utils/entityWrapper';
import create from '../../services/gameSessions/create';
import update from '../../services/gameSessions/update';
import start from '../../services/gameSessions/start';
import join from '../../services/gameSessions/join';
import startNextSong from '../../services/gameSessions/startNextSong';

const mappings = [
  { attribute: 'id', operator: Op.eq },
  { attribute: 'name', operator: Op.iLike },
  { attribute: 'status', operator: Op.eq },
  { attribute: 'enterCode', operator: Op.eq },
];
const includes = [
  { model: models.RoundElement, required: false, as: 'roundElements' },
  { model: models.Player, required: false, as: 'players' },
];
const baseResolver = queryResolver(models.GameSession, mappings, includes);
const resolver = async (args, context) => {
  const results = await baseResolver(args, context);
  return entitiesWrapper(results, gameSessionEntity);
};
const mutations = {
  create,
  update,
  start,
  join,
  startNextSong,
};

export {
  resolver,
  schema,
  mappings,
  mutations,
};