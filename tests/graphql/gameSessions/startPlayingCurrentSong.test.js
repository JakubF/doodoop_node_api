import models from '../../../src/models';
import testHelper from '../../testHelper';
import requestHelper from '../../requestHelper';
import { broadcastEvent } from '../../../src/utils/broadcastEvent';

jest.mock('../../../src/utils/broadcastEvent', () => {
  return { broadcastEvent: jest.fn() }
})

const query = `
  mutation getGameSessions($id: Int!) {
    gameSessionsMutations {
      startPlayingCurrentSong(id: $id) {
        name
        id
        status
        link
      }
    }
  }
`;

const makeRequest = async (id) => await requestHelper.sendRequest({ query, variables: { id } });

describe('GameSessions start mutation', () => {
  let record;

  beforeEach(async () => {
    record = await models.GameSession.create({ name: 'name', status: 'pending' }, { transaction: testHelper.getTransaction() });
  });

  describe('when GameSession with given id was not found', () => {
    it('returns an error', async () => {
      const res = await makeRequest((record.id + 1));
      const reloadedRecord = await models.GameSession.findOne({ where: { id: record.id } });
      expect(reloadedRecord.status).toEqual(record.status);
      expect(res.body).toEqual({
        "data": {
          "gameSessionsMutations": { "startPlayingCurrentSong": null }
        },
        "errors": [
          {
            "locations": [{ "column": 7, "line": 4 }],
            "message": `GameSession with id ${record.id + 1} not found.`,
            "path": ["gameSessionsMutations", "startPlayingCurrentSong"]
          }
        ]
      });
    });
  });

  describe('when GameSession with given id was found', () => {
    describe('when gameSession is in progress', () => {
      beforeEach(async () => {
        await record.update({ status: 'in_progress' }, { transaction: testHelper.getTransaction() });
      });

      describe('when there are no round elements for this game session', () => {
        it('returns an error', async () => {
          const res = await makeRequest(record.id);
          expect(res.body).toEqual({
            "data": {
              "gameSessionsMutations": { "startPlayingCurrentSong": null }
            },
            "errors": [
              {
                "locations": [{ "column": 7, "line": 4 }],
                "message": "Missing round element",
                "path": ["gameSessionsMutations", "startPlayingCurrentSong"]
              }
            ]
          });
        });
      });

      describe('when there is a round element for this game session', () => {
        let roundElement;

        beforeEach(async () => {
          roundElement = await models.RoundElement.create({ name: 'name', gameSessionId: record.id, status: 'started' }, { transaction: testHelper.getTransaction() });
        });


        describe('when it\'s started', () => {
          it('broadcasts songStarted event', async () => {
            await makeRequest(record.id);
            expect(broadcastEvent).toHaveBeenCalledTimes(1);
            expect(broadcastEvent).toHaveBeenCalledWith('songStarted', { id: record.id, roundElementId: roundElement.id });
          });

          it('updates round element', async () => {
            const res = await makeRequest(record.id);
            const reloadedRoundElement = await models.RoundElement.findOne({ where: { id: roundElement.id } });
            expect(res.body).toEqual({
              "data": {
                "gameSessionsMutations": {
                  "startPlayingCurrentSong": {
                    "name": roundElement.name,
                    "id": roundElement.id,
                    "status": reloadedRoundElement.status,
                    "link": roundElement.link
                  }
                }
              }
            });
            expect(reloadedRoundElement.id).toEqual(roundElement.id);
            expect(reloadedRoundElement.status).not.toEqual(roundElement.status);
            expect(reloadedRoundElement.status).toEqual('playing');
            expect(reloadedRoundElement.updatedAt.getTime()).toBeGreaterThan(roundElement.updatedAt.getTime());
          });
        });

        describe('when it\'s completed', () => {
          beforeEach(async () => {
            await roundElement.update({ status: 'completed' }, { transaction: testHelper.getTransaction() });
          });

          it('returns an error', async () => {
            const res = await makeRequest(record.id);
            const reloadedRoundElement = await models.RoundElement.findOne({ where: { id: roundElement.id } });
            expect(reloadedRoundElement.status).toEqual(roundElement.status);
            expect(res.body).toEqual({
              "data": {
                "gameSessionsMutations": { "startPlayingCurrentSong": null }
              },
              "errors": [
                {
                  "locations": [{ "column": 7, "line": 4 }],
                  "message": "Missing round element",
                  "path": ["gameSessionsMutations", "startPlayingCurrentSong"]
                }
              ]
            });
          });
        });

        describe('when it\'s pending', () => {
          beforeEach(async () => {
            await roundElement.update({ status: 'pending' }, { transaction: testHelper.getTransaction() });
          });
          
          it('returns an error', async () => {
            const res = await makeRequest(record.id);
            const reloadedRoundElement = await models.RoundElement.findOne({ where: { id: roundElement.id } });
            expect(reloadedRoundElement.status).toEqual(roundElement.status);
            expect(res.body).toEqual({
              "data": {
                "gameSessionsMutations": { "startPlayingCurrentSong": null }
              },
              "errors": [
                {
                  "locations": [{ "column": 7, "line": 4 }],
                  "message": "Round Element is not started",
                  "path": ["gameSessionsMutations", "startPlayingCurrentSong"]
                }
              ]
            });
          });
        });

        describe('when it\'s playing', () => {
          beforeEach(async () => {
            await roundElement.update({ status: 'playing' }, { transaction: testHelper.getTransaction() });
          });
          
          it('returns an error', async () => {
            const res = await makeRequest(record.id);
            const reloadedRoundElement = await models.RoundElement.findOne({ where: { id: roundElement.id } });
            expect(reloadedRoundElement.status).toEqual(roundElement.status);
            expect(res.body).toEqual({
              "data": {
                "gameSessionsMutations": { "startPlayingCurrentSong": null }
              },
              "errors": [
                {
                  "locations": [{ "column": 7, "line": 4 }],
                  "message": "Round Element is not started",
                  "path": ["gameSessionsMutations", "startPlayingCurrentSong"]
                }
              ]
            });
          });
        });
      });
    });


    describe('when gameSession is pending', () => {
      it('returns an error', async () => {
        const res = await makeRequest(record.id);
        expect(res.body).toEqual({
          "data": {
            "gameSessionsMutations": { "startPlayingCurrentSong": null }
          },
          "errors": [
            {
              "locations": [{ "column": 7, "line": 4 }],
              "message": "Game session must be in progress",
              "path": ["gameSessionsMutations", "startPlayingCurrentSong"]
            }
          ]
        });
      });
    });
  });
});