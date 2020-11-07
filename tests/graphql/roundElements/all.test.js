import models from '../../../src/models';
import testHelper from '../../testHelper';
import requestHelper from '../../requestHelper';
import { compareGraphqlResults } from '../../graphqlHelper';

const query = `
  query getRoundElements(
    $id: Int,
    $name: String,
    $answer: String,
    $status: String,
    $points: Int,
    $gameSessionId: Int
  ) {
    roundElements(
      id: $id,
      name: $name,
      answer: $answer,
      status: $status,
      points: $points,
      gameSessionId: $gameSessionId
    ) {
      name
      answer
      id
      status
      points
      link
      gameSessionId
      gameSession {
        name
        enterCode
        id
        status
      }
      answers {
        playerId
        id
        value
      }
      winner {
        id
        name
      }
    }
  }
`;

const graphqlMappings = [
  { source: 'name', target: 'name' },
  { source: 'answer', target: 'answer' },
  { source: 'id', target: 'id' },
  { source: 'status', target: 'status' },
  { source: 'gameSessionId', target: 'gameSessionId' },
  { source: 'gameSessionId', target: ['gameSession', 'id'] },
  { source: ['gameSession', 'name'], target: ['gameSession', 'name'] },
  { source: ['gameSession', 'id'], target: ['gameSession', 'id'] },
  { source: ['gameSession', 'status'], target: ['gameSession', 'status'] },
  { source: ['gameSession', 'enterCode'], target: ['gameSession', 'enterCode'] },
  { source: ['answers', 'playerId'], target: ['answers', 'playerId'] },
  { source: ['answers', 'value'], target: ['answers', 'value'] },
  { source: ['answers', 'id'], target: ['answers', 'id'] },
  { source: ['winner', 'id'], target: ['winner', 'id'] },
  { source: ['winner', 'name'], target: ['winner', 'name'] },
];

const makeRequest = async (variables) => await requestHelper.sendRequest({ query, variables });

describe('RoundElements all graphql', () => {
  let roundElements = [], gameSessions = [], answers = [], players = [];

  beforeEach(async () => {
    gameSessions = [];
    gameSessions.push(await models.GameSession.create({ name: 'GS1' }, { transaction: testHelper.getTransaction() }));
    gameSessions.push(await models.GameSession.create({ name: 'GS2' }, { transaction: testHelper.getTransaction() }));
    
    players = [];
    players.push(await models.Player.create({ name: 'Player1' }, { transaction: testHelper.getTransaction() }));
    players.push(await models.Player.create({ name: 'Player2' }, { transaction: testHelper.getTransaction() }));
    players.push(await models.Player.create({ name: 'Player3' }, { transaction: testHelper.getTransaction() }));
    players.push(await models.Player.create({ name: 'Player4' }, { transaction: testHelper.getTransaction() }));

    roundElements = [];
    roundElements.push(await models.RoundElement.create({
      name: 'test 1',
      answer: 'answer 1',
      status: 'pending',
      points: 100,
      gameSessionId: gameSessions[0].id,
    }, {
      transaction: testHelper.getTransaction(),
    }));
    roundElements.push(await models.RoundElement.create({
      name: 'test 2',
      answer: 'answer 2',
      status: 'started',
      points: 200,
      gameSessionId: gameSessions[1].id,
      winnerId: players[1].id,
    }, {
      transaction: testHelper.getTransaction(),
    }));
    roundElements.push(await models.RoundElement.create({
      name: 'test 3',
      answer: 'answer 3',
      status: 'playing',
      points: 300,
      gameSessionId: gameSessions[0].id,
      winnerId: players[3].id,
    }, {
      transaction: testHelper.getTransaction(),
    }));

    answers = [];
    answers.push(await models.Answer.create({ playerId: players[0].id, roundElementId: roundElements[0].id, value: 'Answer11' }, { transaction: testHelper.getTransaction() }));
    answers.push(await models.Answer.create({ playerId: players[1].id, roundElementId: roundElements[0].id, value: 'Answer21' }, { transaction: testHelper.getTransaction() }));
    answers.push(await models.Answer.create({ playerId: players[0].id, roundElementId: roundElements[1].id, value: 'Answer12' }, { transaction: testHelper.getTransaction() }));
    answers.push(await models.Answer.create({ playerId: players[2].id, roundElementId: roundElements[1].id, value: 'Answer32' }, { transaction: testHelper.getTransaction() }));
    answers.push(await models.Answer.create({ playerId: players[3].id, roundElementId: roundElements[1].id, value: 'Answer42' }, { transaction: testHelper.getTransaction() }));
    answers.push(await models.Answer.create({ playerId: players[3].id, roundElementId: roundElements[1].id, value: 'Answer42' }, { transaction: testHelper.getTransaction() }));
    answers.push(await models.Answer.create({ playerId: players[1].id, roundElementId: roundElements[2].id, value: 'Answer23' }, { transaction: testHelper.getTransaction() }));
  });

  describe('without any variables', () => {
    it('returns all records', async () => {
      const response = await makeRequest({});
      compareGraphqlResults(
        [
          { ...roundElements[0].dataValues, winner: null, gameSession: gameSessions[0], answers: [answers[0], answers[1]] },
          { ...roundElements[1].dataValues, winner: players[1], gameSession: gameSessions[1], answers: [answers[2], answers[3], answers[4], answers[5]] },
          { ...roundElements[2].dataValues, winner: players[3], gameSession: gameSessions[0], answers: [answers[6]] },
        ],
        graphqlMappings,
        response.body.data.roundElements
      );
    });
  });
})