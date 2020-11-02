import { sequelize, namespace } from '../src/models';

const defaultIt = global.it
let transaction;

beforeEach(async () => {
  transaction = await sequelize.transaction({ autocommit: false });
});

afterEach(async () => {
  await transaction.rollback();
});

global.it = function (title, fn) {
  return defaultIt(title, function () {
    return new Promise((resolve, reject) => {
      sequelize.transaction(t => {
        namespace.set('transaction', transaction);

        return fn().then(() => {
          resolve();
        }).catch(err => {
          reject(err);
        }).finally(() => {
          throw "Rollback";
        });
      }).catch(err => {
        if (err === "Rollback") return;
        reject(err);
        console.log("Error in test:");
        console.log(err);
      });
    });
  });
};

const getTransaction = () => {
  return transaction;
};

export default {
  getTransaction
};