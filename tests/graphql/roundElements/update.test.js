import models from '../../../src/models';
import testHelper from '../../testHelper';
import requestHelper from '../../requestHelper';

const query = `
  mutation updateRoundElement($id: Int!, $name: String, $answer: String, $link: String, $points: Int) {
    roundElementsMutations {
      update(id: $id, name: $name, answer: $answer, link: $link, points: $points) {
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

describe('RoundElements update mutation', () => {
  let name, answer, link, points, gameSession, record;

  beforeEach(async () => {
    name = 'round element';
    answer = 'song name';
    link = 'https://yt.com/song1';
    points = 100;
    gameSession = await models.GameSession.create({ name: 'game session', status: 'pending' }, { transaction: testHelper.getTransaction() });
    record = await models.RoundElement.create({ name: 'name', status: 'pending', answer: 'answer', link: 'test link', points: 100, gameSessionId: gameSession.id }, { transaction: testHelper.getTransaction() });
  });

  describe('when RoundElement with given id was not found', () => {
    it('returns an error', async () => {
      const res = await makeRequest({ id: (record.id + 1), name, answer, link, points });
      const reloadedRecord = await models.RoundElement.findOne({ where: { id: record.id } });
      expect(reloadedRecord.name).not.toEqual(name);
      expect(res.body).toEqual({
        "data": {
          "roundElementsMutations": { "update": null }
        },
        "errors": [
          {
            "locations": [{ "column": 7, "line": 4 }],
            "message": `Record with id ${record.id + 1} not found.`,
            "path": ["roundElementsMutations", "update"]
          }
        ]
      });
    });
  });

  describe('when RoundElement with given id was found', () => {
    describe('when associated game session is not pending', () => {
      beforeEach(async () => {
        await gameSession.update({ status: 'in_progress' }, { transaction: testHelper.getTransaction() });
      });

      it('returns an error', async () => {
        const res = await makeRequest({ id: record.id, name, answer, link, points });
        const reloadedRecord = await models.RoundElement.findOne({ where: { id: record.id } });
        expect(reloadedRecord.name).not.toEqual(name);
        expect(res.body).toEqual({
          "data": {
            "roundElementsMutations": { "update": null }
          },
          "errors": [
            {
              "locations": [{ "column": 7, "line": 4 }],
              "message": "Only pending games can edited",
              "path": ["roundElementsMutations", "update"]
            }
          ]
        });
      });
    });

    describe('when associated game session is pending', () => {
      describe('name validations', () => {
        describe('when name is longer than 5 and shorter than 50', () => {
          beforeEach(async () => {
            name = 'test game';
          });

          describe('when name is unique', () => {
            it('updates round element', async () => {
              const res = await makeRequest({ id: record.id, name, answer, link, points});
              const reloadedRecord = await models.RoundElement.findOne({ where: { id: record.id } });
              expect(res.body).toEqual({
                "data": {
                  "roundElementsMutations": {
                    "update": {
                      "name": name,
                      "link": link,
                      "id": record.id,
                      "status": 'pending',
                      "points": points,
                      "answer": answer,
                      "gameSessionId": gameSession.id,
                    }
                  }
                }
              });
              expect(reloadedRecord.name).toEqual(name);
              expect(reloadedRecord.link).toEqual(link);
              expect(reloadedRecord.points).toEqual(points);
              expect(reloadedRecord.answer).toEqual(answer);
              expect(reloadedRecord.id).toEqual(record.id);
            });
          });

          describe('when name is not unique', () => {
            describe('when it\'s unique in scope of gameSession', () => {
              beforeEach(async () => {
                await models.RoundElement.create({ name }, { transaction: testHelper.getTransaction() })
              });

              it('updates round element', async () => {
                const res = await makeRequest({ id: record.id, name, answer, link, points });
                const reloadedRecord = await models.RoundElement.findOne({ where: { id: record.id } });
                expect(res.body).toEqual({
                  "data": {
                    "roundElementsMutations": {
                      "update": {
                        "name": name,
                        "link": link,
                        "id": record.id,
                        "status": 'pending',
                        "points": points,
                        "answer": answer,
                        "gameSessionId": gameSession.id,
                      }
                    }
                  }
                });
                expect(reloadedRecord.name).toEqual(name);
                expect(reloadedRecord.link).toEqual(link);
                expect(reloadedRecord.points).toEqual(points);
                expect(reloadedRecord.answer).toEqual(answer);
                expect(reloadedRecord.id).toEqual(record.id);
              });
            });

            describe('when it\'s not unique in scope of gameSession', () => {
              beforeEach(async () => {
                await models.RoundElement.create({ name, gameSessionId: gameSession.id }, { transaction: testHelper.getTransaction() })
              });

              it('returns an error', async () => {
                const res = await makeRequest({ id: record.id, name, answer, link, points});
                const reloadedRecord = await models.RoundElement.findOne({ where: { id: record.id } });
                expect(reloadedRecord.name).not.toEqual(name);
                expect(res.body).toEqual({
                  "data": {
                    "roundElementsMutations": { "update": null }
                  },
                  "errors": [
                    {
                      "locations": [{"column": 7, "line": 4 }],
                      "message": { "name": "name must be unique" },
                      "path": ["roundElementsMutations", "update"]
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
            const res = await makeRequest({ id: record.id, name, answer, link, points});
            const reloadedRecord = await models.RoundElement.findOne({ where: { id: record.id } });
            expect(reloadedRecord.name).not.toEqual(name);
            expect(res.body).toEqual({
              "data": {
                "roundElementsMutations": { "update": null }
              },
              "errors": [
                {
                  "locations": [{ "column": 7, "line": 4 }],
                  "message": { "name": "can't be longer than 50 characters" },
                  "path": ["roundElementsMutations", "update"]
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
            const res = await makeRequest({ id: record.id, name, answer, link, points});
            const reloadedRecord = await models.RoundElement.findOne({ where: { id: record.id } });
            expect(reloadedRecord.name).not.toEqual(name);
            expect(res.body).toEqual({
              "data": {
                "roundElementsMutations": { "update": null }
              },
              "errors": [
                {
                  "locations": [{ "column": 7, "line": 4 }],
                  "message": { "name": "must be at least 5 characters long" },
                  "path": ["roundElementsMutations", "update"]
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
            const res = await makeRequest({ id: record.id, name, answer, link, points});
            const reloadedRecord = await models.RoundElement.findOne({ where: { id: record.id } });
            expect(reloadedRecord.link).not.toEqual(link);
            expect(res.body).toEqual({
              "data": {
                "roundElementsMutations": { "update": null }
              },
              "errors": [
                {
                  "locations": [{ "column": 7, "line": 4 }],
                  "message": { "link": "must be filled" },
                  "path": ["roundElementsMutations", "update"]
                }
              ]
            });
          });
        });

        describe('when link is present', () => {
          it('updates round element', async () => {
            const res = await makeRequest({ id: record.id, name, answer, link, points });
            const reloadedRecord = await models.RoundElement.findOne({ where: { id: record.id } });
            expect(res.body).toEqual({
              "data": {
                "roundElementsMutations": {
                  "update": {
                    "name": name,
                    "link": link,
                    "id": record.id,
                    "status": 'pending',
                    "points": points,
                    "answer": answer,
                    "gameSessionId": gameSession.id,
                  }
                }
              }
            });
            expect(reloadedRecord.name).toEqual(name);
            expect(reloadedRecord.link).toEqual(link);
            expect(reloadedRecord.points).toEqual(points);
            expect(reloadedRecord.answer).toEqual(answer);
            expect(reloadedRecord.id).toEqual(record.id);
          });
        });
      });
    });
  });
});