// database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase',
}));
