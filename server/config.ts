import dotenv from 'dotenv';
dotenv.config({path: './.env'});

const { SERVER_PORT } = process.env
const ROUND_DURATION = 50

export {
  ROUND_DURATION,
  SERVER_PORT,
}