from asyncio import sleep
from dataclasses import dataclass
import os
import time
from typing import Literal, get_args
import socketio

SERVER_URL = f"http://server:3001"

Move = Literal["ROCK", "PAPER", "SCISSORS"]
Result = Literal["win", "loss", "draw"]

@dataclass
class RoundResult:
  you: Move
  opponent: Move
  result: Result

sio = socketio.Client(reconnection=True, reconnection_attempts=0)

round_index = 0

@sio.event
def connect():
    print("Connected to server")
    sio.emit("bot", "example-python")

# previous_moves_opponent = []
# previous_moves_us = []

# def create_move(round_index: int):
    
#     if len(previous_moves_us) == 0:
#         return "ROCK"
#     # Random index picker
#     random_prev_round_arr = [1, 3, 7, 3, 6, 4]
    
#     max_rounds = len(previous_moves_us)
#     nof_rounds_backwards = random_prev_round_arr[random_idx]
#     how_many_rounds_backwards = min(max_rounds, nof_rounds_backwards)
#     move = previous_moves_us[-how_many_rounds_backwards]
#     # Increment number
    
#     if random_idx == len(random_prev_round_arr) - 1:
#         random_idx = 0
#     else:
#         random_idx += 1
#     print(random_idx)
#     return move

def create_move(previous_round: RoundResult | None, round_index: int):
    if round_index == 0:
        return "ROCK"
    else:
        if previous_round["opponent"] == "ROCK" and round_index % 7:
            return "ROCK"
        if previous_round["you"] == "SCISSORS" and previous_round["opponent"] == "PAPER":
            return "SCISSORS"
        
        if round_index % 3 == 0:
            return "PAPER"
        elif round_index % 3 == 2:
            return "ROCK"
        elif round_index % 3 == 1:
            return "SCISSORS"

@sio.event
def round(previous_round: RoundResult | None):
    global round_index

    print(previous_round)
    possible_moves = list(get_args(Move))
    move = create_move(previous_round, round_index)
    # move = possible_moves[round_index % len(possible_moves)]
    sio.emit("move", move)
    round_index += 1

print(f"Trying to connect to {SERVER_URL}")

connected = False
while not connected:
    try:
        sio.connect(SERVER_URL)
        print("Socket established")
        connected = True
    except Exception as ex:
        print("Failed to establish initial connnection to server:", type(ex).__name__)
        time.sleep(2)

