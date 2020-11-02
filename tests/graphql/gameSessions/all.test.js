import request from 'supertest';
import app from '../../../src/server';
import models from '../../../src/models';
import testHelper from '../../testHelper';

describe('GameSessions all graphql', () => {
  beforeEach(() => {
    models.GameSession.create({ name: 'test 1', enterCode: 'AAA111', status: 'pending', createdAt: new Date(), updatedAt: new Date() }, { transaction: testHelper.getTransaction() })
  });

  it('returns all records', async () => {
    models.GameSession.create({ name: 'test 2', enterCode: 'BBB222', status: 'pending', createdAt: new Date(), updatedAt: new Date() })
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
          query getGameSessions {
            gameSessions {
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
        `,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      "data": {
        "gameSessions": [
          {
            "currentRoundElement": null,
            "enterCode": "AAA111",
            "name": "test 1",
            "status": "pending"
          },
          {
            "currentRoundElement": null,
            "enterCode": "BBB222",
            "name": "test 2",
            "status": "pending"
          }
        ]
      }
    });
  })
})