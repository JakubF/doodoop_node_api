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
      start(id: $id) {
        name
        enterCode
        id
        status
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
          "gameSessionsMutations": { "start": null }
        },
        "errors": [
          {
            "locations": [{ "column": 7, "line": 4 }],
            "message": `Record with id ${record.id + 1} not found.`,
            "path": ["gameSessionsMutations", "start"]
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

      it('returns gameSession without updating it', async () => {
        const res = await makeRequest(record.id);
        const reloadedRecord = await models.GameSession.findOne({ where: { id: record.id } });
        expect(res.body).toEqual({
          "data": {
            "gameSessionsMutations": {
              "start": {
                "enterCode": record.enterCode,
                "id": record.id,
                "name": record.name,
                "status": record.status
              }
            }
          }
        });
        expect(reloadedRecord.id).toEqual(record.id);
        expect(reloadedRecord.status).toEqual(record.status);
      });
    });


    describe('when gameSession is pending', () => {
      it('updates game session', async () => {
        const res = await makeRequest(record.id);
        const reloadedRecord = await models.GameSession.findOne({ where: { id: record.id } });
        expect(res.body).toEqual({
          "data": {
            "gameSessionsMutations": {
              "start": {
                "enterCode": record.enterCode,
                "id": record.id,
                "name": record.name,
                "status": reloadedRecord.status
              }
            }
          }
        });
        expect(reloadedRecord.id).toEqual(record.id);
        expect(reloadedRecord.status).not.toEqual(record.status);
        expect(reloadedRecord.status).toEqual('in_progress');
        expect(reloadedRecord.updatedAt.getTime()).toBeGreaterThan(record.updatedAt.getTime());
      })
    });
  });
});