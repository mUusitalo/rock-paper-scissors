import dotenv from 'dotenv';
dotenv.config({path: './.env'});

const { SERVER_PORT } = process.env

export {
  SERVER_PORT
}