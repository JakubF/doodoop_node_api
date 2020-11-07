import models from '../../../src/models';
import testHelper from '../../testHelper';
import requestHelper from '../../requestHelper';

const query = `
  mutation updateRoundElement($id: Int!) {
    roundElementsMutations {
      destroy(id: $id)
    }
  }
`;

const makeRequest = async (id) => await requestHelper.sendRequest({ query, variables: { id } });

describe('RoundElements destroy mutation', () => {
  let gameSession, record;

  beforeEach(async () => {
    gameSession = await models.GameSession.create({ name: 'game session', status: 'pending' }, { transaction: testHelper.getTransaction() });
    record = await models.RoundElement.create({ name: 'name', status: 'pending', answer: 'answer', link: 'test link', points: 100, gameSessionId: gameSession.id }, { transaction: testHelper.getTransaction() });
  });

  describe('when RoundElement with given id was not found', () => {
    it('returns an error', async () => {
      expect(await models.RoundElement.count()).toEqual(1);
      const res = await makeRequest(record.id + 1);
      expect(await models.RoundElement.count()).toEqual(1);
      expect(res.body).toEqual({
        "data": {
          "roundElementsMutations": { "destroy": null }
        },
        "errors": [
          {
            "locations": [{ "column": 7, "line": 4 }],
            "message": `Record with id ${record.id + 1} not found.`,
            "path": ["roundElementsMutations", "destroy"]
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
        expect(await models.RoundElement.count()).toEqual(1);
        const res = await makeRequest(record.id);
        expect(await models.RoundElement.count()).toEqual(1);
        expect(res.body).toEqual({
          "data": {
            "roundElementsMutations": { "destroy": null }
          },
          "errors": [
            {
              "locations": [{ "column": 7, "line": 4 }],
              "message": "Only pending games can edited",
              "path": ["roundElementsMutations", "destroy"]
            }
          ]
        });
      });
    });

    describe('when associated game session is pending', () => {
      it('removes the round element', async () => {
        expect(await models.RoundElement.count()).toEqual(1);
        const res = await makeRequest(record.id);
        expect(await models.RoundElement.count()).toEqual(0);
        expect(res.body).toEqual({
          "data": {
            "roundElementsMutations": {
              "destroy": true
            }
          }
        });
      });
    });
  });
});