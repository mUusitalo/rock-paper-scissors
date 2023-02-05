# rock-paper-scissors 🥌📜✂

This is a tool for hosting an AI bot coding tournament for the simple game of rock-paper-scissors. Despite the simplicity of the game, coding up some bots and hosting a tournament is surprisingly entertaining.

## Intented usage
- Fork the repository
- Bots are created by copying and modifying the example bots (example-node & example-python)
- Bots are submitted to the forked repository through pull requests
- The host changes which bots duel by editing [.env](.env)
- The host runs the competitions locally on their machine

## How do I run it?
- Clone the repository
- Start Docker
- Run `docker compose up` at the root of the repository
- Open up the [frontend](http://localhost:3000) in your browser
- Start the match when both bots are connected

## Rules
- Two bots face each other at a time
- 1000 rounds are played
- The bots have 50 milliseconds to respond per round, otherwise they time out
- Bots get to know the result of the previous round as the next one starts
- Usage of (pseudo)random numbers is not allowed! They will lead to unexciting matches.
- The bots have to be built in a fixed amount of time (1 hour works quite well for experienced competitors)

## Technologies
- The server, frontend, and both bots all run in their own Docker containers
- The containers are orchestrated with Docker compose
- Communication happens through websockets
- The server runs on Node.js and the frontend is React. Both are written in TypeScript.
- Example bots are written in TypeScript and Python
