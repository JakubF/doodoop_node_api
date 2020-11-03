import models from '../../../src/models';
import testHelper from '../../testHelper';
import requestHelper from '../../requestHelper';

const query = `
  mutation getGameSessions($name: String!) {
    gameSessionsMutations {
      create(name: $name) {
        name
        enterCode
        id
        status
      }
    }
  }
`;

const makeRequest = async (name) => await requestHelper.sendRequest({ query, variables: { name } });

describe('GameSessions create mutation', () => {
  describe('when name is longer than 5 and shorter than 50', () => {
    let name = 'test game';

    describe('when name is unique', () => {
      it('creates new game session', async () => {
        expect(await models.GameSession.count()).toEqual(0);
        const res = await makeRequest(name);
        expect(await models.GameSession.count()).toEqual(1);
        const newGameSession = await models.GameSession.findOne({ order: [['id', 'ASC']] })
        expect(res.body).toEqual({
          "data": {
            "gameSessionsMutations": {
              "create": {
                "enterCode": newGameSession.enterCode,
                "id": newGameSession.id,
                "name": newGameSession.name,
                "status": newGameSession.status
              }
            }
          }
        });
      })
    });

    describe('when name is not unique', () => {
      beforeEach(async () => {
        await models.GameSession.create({ name }, { transaction: testHelper.getTransaction() })
      });

      it('returns an error', async () => {
        expect(await models.GameSession.count()).toEqual(1);
        const res = await makeRequest(name);
        expect(await models.GameSession.count()).toEqual(1);
        expect(res.body).toEqual({
          "data": {
            "gameSessionsMutations": { "create": null }
          },
          "errors": [
            {
              "locations": [{"column": 7, "line": 4 }],
              "message": { "name": "name must be unique" },
              "path": ["gameSessionsMutations", "create"]
            }
          ]
        });
      });
    });
  });

  describe('when name is longer than 50', () => {
    let name = '123456789_123456789_123456789_123456789_123456789_1';

    it('returns an error', async () => {
      expect(await models.GameSession.count()).toEqual(0);
      const res = await makeRequest(name);
      expect(await models.GameSession.count()).toEqual(0);
      expect(res.body).toEqual({
        "data": {
          "gameSessionsMutations": { "create": null }
        },
        "errors": [
          {
            "locations": [{ "column": 7, "line": 4 }],
            "message": { "name": "can't be longer than 50 characters" },
            "path": ["gameSessionsMutations", "create"]
          }
        ]
      });
    });
  });

  describe('when name is shorter than 5', () => {
    let name = '1234';

    it('returns an error', async () => {
      expect(await models.GameSession.count()).toEqual(0);
      const res = await makeRequest(name);
      expect(await models.GameSession.count()).toEqual(0);
      expect(res.body).toEqual({
        "data": {
          "gameSessionsMutations": { "create": null }
        },
        "errors": [
          {
            "locations": [{ "column": 7, "line": 4 }],
            "message": { "name": "must be at least 5 characters long" },
            "path": ["gameSessionsMutations", "create"]
          }
        ]
      });
    });
  });
});