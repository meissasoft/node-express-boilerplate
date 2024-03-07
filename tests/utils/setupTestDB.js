import { connect, connection, disconnect } from 'mongoose';
import { mongoose as _mongoose } from '../../src/config/config';

const setupTestDB = () => {
  beforeAll(async () => {
    await connect(_mongoose.url, _mongoose.options);
  });

  beforeEach(async () => {
    await Promise.all(Object.values(connection.collections).map(async (collection) => collection.deleteMany()));
  });

  afterAll(async () => {
    await disconnect();
  });
};

export default setupTestDB;
