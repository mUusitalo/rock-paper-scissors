import dotenv from 'dotenv';
dotenv.config('./.env');

const { SERVER_PORT } = process.env

export default {
  SERVER_PORT
}