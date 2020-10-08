import schema from './queryType';
import queryResolver from '../resolver';
import models from '../../models';
import { Op } from 'sequelize';
import create from '../../services/roundElements/create';
import update from '../../services/roundElements/update';
import destroy from '../../services/roundElements/destroy';

const mappings = [
  { attribute: 'id', operator: Op.eq },
  { attribute: 'name', operator: Op.iLike },
  { attribute: 'answer', operator: Op.iLike },
  { attribute: 'status', operator: Op.eq },
  { attribute: 'points', operator: Op.eq },
  { attribute: 'gameSessionId', operator: Op.eq },
];
const includes = [
  { model: models.Answer, required: false, as: 'answers' },
];
const resolver = queryResolver(models.RoundElement, mappings, includes);
const mutations = {
  create,
  update,
  destroy,
};

export {
  resolver,
  schema,
  mappings,
  mutations,
};