import models from '../../../src/models';
import testHelper from '../../testHelper';
import requestHelper from '../../requestHelper';

const query = `
  mutation getGameSessions($id: Int!, $name: String!) {
    gameSessionsMutations {
      update(id: $id, name: $name) {
        name
        enterCode
        id
        status
      }
    }
  }
`;

const makeRequest = async (variables) => await requestHelper.sendRequest({ query, variables });

describe('GameSessions update mutation', () => {
  let record;
  
  beforeEach(async () => {
    record = await models.GameSession.create({ name: 'old name' }, { transaction: testHelper.getTransaction() });
  });

  describe('when name is longer than 5 and shorter than 50', () => {
    let name = 'test game';

    describe('when GameSession with given id was not found', () => {
      it('returns an error', async () => {
        const res = await makeRequest({ name, id: (record.id + 1) });
        const reloadedRecord = await models.GameSession.findOne({ id: record.id });
        expect(reloadedRecord.name).not.toEqual(name);
        expect(res.body).toEqual({
          "data": {
            "gameSessionsMutations": { "update": null }
          },
          "errors": [
            {
              "locations": [{ "column": 7, "line": 4 }],
              "message": `Record with id ${record.id + 1} not found.`,
              "path": ["gameSessionsMutations", "update"]
            }
          ]
        });
      });
    });

    describe('when GameSession with given id was found', () => {
      describe('when name is unique', () => {
        it('updates game session', async () => {
          const res = await makeRequest({ name, id: record.id });
          const reloadedRecord = await models.GameSession.findOne({ id: record.id });
          expect(res.body).toEqual({
            "data": {
              "gameSessionsMutations": {
                "update": {
                  "enterCode": record.enterCode,
                  "id": record.id,
                  "name": name,
                  "status": record.status
                }
              }
            }
          });
          expect(reloadedRecord.id).toEqual(record.id);
          expect(reloadedRecord.status).toEqual(record.status);
          expect(reloadedRecord.enterCode).toEqual(record.enterCode);
          expect(reloadedRecord.createdAt).toEqual(record.createdAt);
          expect(reloadedRecord.updatedAt.getTime()).toBeGreaterThan(record.updatedAt.getTime());
          expect(reloadedRecord.name).toEqual(name);
        })
      });

      describe('when name is not unique', () => {
        beforeEach(async () => {
          await models.GameSession.create({ name }, { transaction: testHelper.getTransaction() })
        });

        it('returns an error', async () => {
          const res = await makeRequest({ name, id: record.id });
          expect(res.body).toEqual({
            "data": {
              "gameSessionsMutations": { "update": null }
            },
            "errors": [
              {
                "locations": [{"column": 7, "line": 4 }],
                "message": { "name": "name must be unique" },
                "path": ["gameSessionsMutations", "update"]
              }
            ]
          });
        });
      });
    });
  });

  describe('when name is longer than 50', () => {
    let name = '123456789_123456789_123456789_123456789_123456789_1';

    it('returns an error', async () => {
      const res = await makeRequest({ name, id: record.id });
      const reloadedRecord = await models.GameSession.findOne({ id: record.id });
      expect(reloadedRecord.name).not.toEqual(name);
      expect(res.body).toEqual({
        "data": {
          "gameSessionsMutations": { "update": null }
        },
        "errors": [
          {
            "locations": [{ "column": 7, "line": 4 }],
            "message": { "name": "can't be longer than 50 characters" },
            "path": ["gameSessionsMutations", "update"]
          }
        ]
      });
    });
  });

  describe('when name is shorter than 5', () => {
    let name = '1234';

    it('returns an error', async () => {
      const res = await makeRequest({ name, id: record.id });
      const reloadedRecord = await models.GameSession.findOne({ id: record.id });
      expect(reloadedRecord.name).not.toEqual(name);
      expect(res.body).toEqual({
        "data": {
          "gameSessionsMutations": { "update": null }
        },
        "errors": [
          {
            "locations": [{ "column": 7, "line": 4 }],
            "message": { "name": "must be at least 5 characters long" },
            "path": ["gameSessionsMutations", "update"]
          }
        ]
      });
    });
  });
});