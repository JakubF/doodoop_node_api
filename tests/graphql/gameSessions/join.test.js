import models from '../../../src/models';
import testHelper from '../../testHelper';
import requestHelper from '../../requestHelper';

const query = `
  mutation getGameSessions($enterCode: String!, $name: String!) {
    gameSessionsMutations {
      join(enterCode: $enterCode, name: $name) {
        name
        id
        points
      }
    }
  }
`;

const makeRequest = async (enterCode, name) => await requestHelper.sendRequest({ query, variables: { enterCode, name } });

describe('GameSessions join mutation', () => {
  let record;

  beforeEach(async () => {
    record = await models.GameSession.create({ enterCode: 'ABC123' }, { transaction: testHelper.getTransaction() });
  });

  describe('when GameSession with given enterCode was not found', () => {
    let enterCode = 'CB2137';

    it('returns an error', async () => {
      expect(await models.Player.count()).toEqual(0);
      const res = await makeRequest(enterCode, 'test name');
      expect(await models.Player.count()).toEqual(0);
      expect(res.body).toEqual({
        "data": {
          "gameSessionsMutations": { "join": null }
        },
        "errors": [
          {
            "locations": [{ "column": 7, "line": 4 }],
            "message": `GameSession with enterCode ${enterCode} not found.`,
            "path": ["gameSessionsMutations", "join"]
          }
        ]
      });
    });
  });

  describe('when GameSession with given enterCode was found', () => {
    describe('when gameSession is in progress', () => {
      beforeEach(async () => {
        await record.update({ status: 'in_progress' }, { transaction: testHelper.getTransaction() });
        await models.RoundElement.create({ status: 'in_progress', gameSessionId: record.id }, { transaction: testHelper.getTransaction() })
      });

      it('returns an error', async () => {
        expect(await models.Player.count()).toEqual(0);
        const res = await makeRequest(record.enterCode, 'test name');
        expect(await models.Player.count()).toEqual(0);
        expect(res.body).toEqual({
          "data": {
            "gameSessionsMutations": { "join": null }
          },
          "errors": [
            {
              "locations": [{ "column": 7, "line": 4 }],
              "message": 'Only pending games can be joined',
              "path": ["gameSessionsMutations", "join"]
            }
          ]
        });
      });
    });


    describe('when gameSession is pending', () => {
      describe('when player name is shorter than 4 characters', () => {
        it('returns an error', async () => {
          expect(await models.Player.count()).toEqual(0);
          const res = await makeRequest(record.enterCode, 'Max');
          expect(await models.Player.count()).toEqual(0);
          expect(res.body).toEqual({
            "data": {
              "gameSessionsMutations": { "join": null }
            },
            "errors": [
              {
                "locations": [{ "column": 7, "line": 4 }],
                "message": { "name": "must be at least 4 characters long" },
                "path": ["gameSessionsMutations", "join"]
              }
            ]
          });
        });
      });

      describe('when player name is longer than 15 characters', () => {
        it('returns an error', async () => {
          expect(await models.Player.count()).toEqual(0);
          const res = await makeRequest(record.enterCode, 'Jakub Flaasinski');
          expect(await models.Player.count()).toEqual(0);
          expect(res.body).toEqual({
            "data": {
              "gameSessionsMutations": { "join": null }
            },
            "errors": [
              {
                "locations": [{ "column": 7, "line": 4 }],
                "message": { "name": "can't be longer than 15 characters" },
                "path": ["gameSessionsMutations", "join"]
              }
            ]
          });
        });
      });

      describe('when player name is longer than 4 but shorter than 15 characters', () => {
        let name = 'Jakub';

        describe('when player with given name already exists', () => {
          let player;

          beforeEach(async () => {
            player = await models.Player.create({ name, gameSessionId: record.id }, { transaction: testHelper.getTransaction() })
          });

          it('returns current player', async () => {
            expect(await models.Player.count()).toEqual(1);
            const res = await makeRequest(record.enterCode, name);
            expect(await models.Player.count()).toEqual(1);
            const reloadedPlayer = await models.Player.findOne({ where: { id: player.id } })
            expect(res.body).toEqual({
              "data": {
                "gameSessionsMutations": {
                  "join": {
                    "points": reloadedPlayer.points,
                    "id": reloadedPlayer.id,
                    "name": reloadedPlayer.name,
                  }
                }
              }
            });
            expect(reloadedPlayer.name).toEqual(player.name);
            expect(reloadedPlayer.points).toEqual(player.points);
          });
        });

        describe('when player with given name doesn\'t exists', () => {
          let name = 'Jakub';

          it('creates new player', async () => {
            expect(await models.Player.count()).toEqual(0);
            const res = await makeRequest(record.enterCode, name);
            expect(await models.Player.count()).toEqual(1);
            const newPlayer = await models.Player.findOne({ order: [['id', 'ASC']] })
            expect(res.body).toEqual({
              "data": {
                "gameSessionsMutations": {
                  "join": {
                    "points": newPlayer.points,
                    "id": newPlayer.id,
                    "name": newPlayer.name,
                  }
                }
              }
            });
            expect(newPlayer.name).toEqual(name);
            expect(newPlayer.points).toEqual(0);
          });
        });
      });
    });
  });
});