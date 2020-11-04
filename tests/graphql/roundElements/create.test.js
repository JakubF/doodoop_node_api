import models from '../../../src/models';
import testHelper from '../../testHelper';
import requestHelper from '../../requestHelper';

const query = `
  mutation createRoundElement($gameSessionId: Int!, $name: String!, $answer: String!, $link: String!, $points: Int) {
    roundElementsMutations {
      create(gameSessionId: $gameSessionId, name: $name, answer: $answer, link: $link, points: $points) {
        name
        link
        id
        status
        points
        answer
        gameSessionId
      }
    }
  }
`;

const makeRequest = async (variables) => await requestHelper.sendRequest({ query, variables });

describe('RoundElements create mutation', () => {
  let name, answer, link, points, gameSession;

  beforeEach(async () => {
    name = 'round element';
    answer = 'song name';
    link = 'https://yt.com/song1';
    points = 100;
    gameSession = await models.GameSession.create({ name: 'game session', status: 'pending' }, { transaction: testHelper.getTransaction() });
  });

  describe('when GameSession with given id was not found', () => {
    it('returns an error', async () => {
      expect(await models.RoundElement.count()).toEqual(0);
      const res = await makeRequest({ gameSessionId: (gameSession.id + 1), name, answer, link, points });
      expect(await models.RoundElement.count()).toEqual(0);
      expect(res.body).toEqual({
        "data": {
          "roundElementsMutations": { "create": null }
        },
        "errors": [
          {
            "locations": [{ "column": 7, "line": 4 }],
            "message": `GameSession with id ${gameSession.id + 1} not found.`,
            "path": ["roundElementsMutations", "create"]
          }
        ]
      });
    });
  });

  describe('when GameSession with given id was found', () => {
    describe('when game session is not pending', () => {
      beforeEach(async () => {
        await gameSession.update({ status: 'in_progress' }, { transaction: testHelper.getTransaction() });
      });

      it('returns an error', async () => {
        expect(await models.RoundElement.count()).toEqual(0);
        const res = await makeRequest({ gameSessionId: gameSession.id, name, answer, link, points });
        expect(await models.RoundElement.count()).toEqual(0);
        expect(res.body).toEqual({
          "data": {
            "roundElementsMutations": { "create": null }
          },
          "errors": [
            {
              "locations": [{ "column": 7, "line": 4 }],
              "message": "Only pending games can edited",
              "path": ["roundElementsMutations", "create"]
            }
          ]
        });
      });
    });

    describe('name validations', () => {
      describe('when name is longer than 5 and shorter than 50', () => {
        beforeEach(async () => {
          name = 'test game';
        });

        describe('when name is unique', () => {
          it('creates new round element', async () => {
            expect(await models.RoundElement.count()).toEqual(0);
            const res = await makeRequest({ gameSessionId: gameSession.id, name, answer, link, points});
            expect(await models.RoundElement.count()).toEqual(1);
            const newRoundElement = await models.RoundElement.findOne({ order: [['id', 'ASC']] })
            expect(newRoundElement.status).toEqual('pending');
            expect(res.body).toEqual({
              "data": {
                "roundElementsMutations": {
                  "create": {
                    "name": name,
                    "link": link,
                    "id": newRoundElement.id,
                    "status": 'pending',
                    "points": points,
                    "answer": answer,
                    "gameSessionId": gameSession.id,
                  }
                }
              }
            });
          });
        });

        describe('when name is not unique', () => {
          describe('when it\'s unique in scope of gameSession', () => {
            beforeEach(async () => {
              await models.RoundElement.create({ name }, { transaction: testHelper.getTransaction() })
            });

            it('creates new round element', async () => {
              expect(await models.RoundElement.count()).toEqual(1);
              const res = await makeRequest({ gameSessionId: gameSession.id, name, answer, link, points });
              expect(await models.RoundElement.count()).toEqual(2);
              const newRoundElement = await models.RoundElement.findOne({ order: [['id', 'DESC']] })
              expect(newRoundElement.status).toEqual('pending');
              expect(res.body).toEqual({
                "data": {
                  "roundElementsMutations": {
                    "create": {
                      "name": name,
                      "link": link,
                      "id": newRoundElement.id,
                      "status": 'pending',
                      "points": points,
                      "answer": answer,
                      "gameSessionId": gameSession.id,
                    }
                  }
                }
              });
            });
          });

          describe('when it\'s not unique in scope of gameSession', () => {
            beforeEach(async () => {
              await models.RoundElement.create({ name, gameSessionId: gameSession.id }, { transaction: testHelper.getTransaction() })
            });

            it('returns an error', async () => {
              expect(await models.RoundElement.count()).toEqual(1);
              const res = await makeRequest({ gameSessionId: gameSession.id, name, answer, link, points});
              expect(await models.RoundElement.count()).toEqual(1);
              expect(res.body).toEqual({
                "data": {
                  "roundElementsMutations": { "create": null }
                },
                "errors": [
                  {
                    "locations": [{"column": 7, "line": 4 }],
                    "message": { "name": "name must be unique" },
                    "path": ["roundElementsMutations", "create"]
                  }
                ]
              });
            });
          });
        });
      });

      describe('when name is longer than 50', () => {
        beforeEach(async () => {
          name = '123456789_123456789_123456789_123456789_123456789_1';
        });

        it('returns an error', async () => {
          expect(await models.RoundElement.count()).toEqual(0);
          const res = await makeRequest({ gameSessionId: gameSession.id, name, answer, link, points});
          expect(await models.RoundElement.count()).toEqual(0);
          expect(res.body).toEqual({
            "data": {
              "roundElementsMutations": { "create": null }
            },
            "errors": [
              {
                "locations": [{ "column": 7, "line": 4 }],
                "message": { "name": "can't be longer than 50 characters" },
                "path": ["roundElementsMutations", "create"]
              }
            ]
          });
        });
      });

      describe('when name is shorter than 5', () => {
        beforeEach(async () => {
          name = '1234';
        });

        it('returns an error', async () => {
          expect(await models.RoundElement.count()).toEqual(0);
          const res = await makeRequest({ gameSessionId: gameSession.id, name, answer, link, points});
          expect(await models.RoundElement.count()).toEqual(0);
          expect(res.body).toEqual({
            "data": {
              "roundElementsMutations": { "create": null }
            },
            "errors": [
              {
                "locations": [{ "column": 7, "line": 4 }],
                "message": { "name": "must be at least 5 characters long" },
                "path": ["roundElementsMutations", "create"]
              }
            ]
          });
        });
      });
    });

    describe('link validations', () => {
      describe('when link is an empty string', () => {
        beforeEach(async () => {
          link = '';
        });

        it('returns an error', async () => {
          expect(await models.RoundElement.count()).toEqual(0);
          const res = await makeRequest({ gameSessionId: gameSession.id, name, answer, link, points});
          expect(await models.RoundElement.count()).toEqual(0);
          expect(res.body).toEqual({
            "data": {
              "roundElementsMutations": { "create": null }
            },
            "errors": [
              {
                "locations": [{ "column": 7, "line": 4 }],
                "message": { "link": "must be filled" },
                "path": ["roundElementsMutations", "create"]
              }
            ]
          });
        });
      });

      describe('when link is present', () => {
        it('creates new round element', async () => {
          expect(await models.RoundElement.count()).toEqual(0);
          const res = await makeRequest({ gameSessionId: gameSession.id, name, answer, link, points });
          expect(await models.RoundElement.count()).toEqual(1);
          const newRoundElement = await models.RoundElement.findOne({ order: [['id', 'ASC']] })
          expect(newRoundElement.status).toEqual('pending');
          expect(res.body).toEqual({
            "data": {
              "roundElementsMutations": {
                "create": {
                  "name": name,
                  "link": link,
                  "id": newRoundElement.id,
                  "status": 'pending',
                  "points": points,
                  "answer": answer,
                  "gameSessionId": gameSession.id,
                }
              }
            }
          });
        });
      });
    });
  });
});