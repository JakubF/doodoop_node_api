import models from '../../../src/models';
import testHelper from '../../testHelper';
import requestHelper from '../../requestHelper';

const query = `
  query getGameSessions($id: Int, $name: String, $status: String, $enterCode: String) {
    gameSessions(id: $id, name: $name, status: $status, enterCode: $enterCode) {
      name
      enterCode
      status
      currentRoundElement {
        name
        link
        status
        id
      }
    }
  }
`;

describe('GameSessions all graphql', () => {
  let gameSessions = [];

  beforeEach(async () => {
    gameSessions = [];
    gameSessions.push(await models.GameSession.create({
      name: 'test 1',
      enterCode: 'AAA111',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }, { transaction: testHelper.getTransaction() }));
    gameSessions.push(await models.GameSession.create({
      name: 'test 2',
      enterCode: 'BBB222',
      status: 'in_progress',
      createdAt: new Date(),
      updatedAt: new Date()
    }, { transaction: testHelper.getTransaction() }));
    gameSessions.push(await models.GameSession.create({
      name: 'test 3',
      enterCode: 'CCC333',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    }, { transaction: testHelper.getTransaction() }));
  });

  describe('without any variables', async () => {
    it('returns all records', async () => {
      const response = await requestHelper.sendRequest({ query });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        "data": {
          "gameSessions": [
            {
              "currentRoundElement": null,
              "enterCode": gameSessions[0].enterCode,
              "name": gameSessions[0].name,
              "status": gameSessions[0].status
            },
            {
              "currentRoundElement": null,
              "enterCode": gameSessions[1].enterCode,
              "name": gameSessions[1].name,
              "status": gameSessions[1].status
            },
            {
              "currentRoundElement": null,
              "enterCode": gameSessions[2].enterCode,
              "name": gameSessions[2].name,
              "status": gameSessions[2].status
            }
          ]
        }
      });
    });
  });

  describe('with id filter', async () => {
    it('returns gameSession with specified id', async () => {
      const response = await requestHelper.sendRequest({ query, variables: { id: gameSessions[1].id } });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        "data": {
          "gameSessions": [
            {
              "currentRoundElement": null,
              "enterCode": gameSessions[1].enterCode,
              "name": gameSessions[1].name,
              "status": gameSessions[1].status
            }
          ]
        }
      });
    });
  });
})