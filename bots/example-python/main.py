from dataclasses import dataclass
import os
from typing import Literal, get_args
import socketio
from dotenv import load_dotenv
load_dotenv(dotenv_path="../../.env")

HOST, SERVER_PORT = os.environ["HOST"], os.environ["SERVER_PORT"]
SERVER_URL = f"http://{HOST}:{SERVER_PORT}"

Move = Literal["ROCK", "PAPER", "SCISSORS"]
Result = Literal["win", "loss", "draw"]

@dataclass
class RoundResult:
  you: Move
  opponent: Move
  result: Result

sio = socketio.Client()

round_index = 0

@sio.event
def connect():
  print("Connected to server")
  sio.emit("bot", "example-python")

@sio.event
def round(previous_round: RoundResult | None):
  global round_index
  print(previous_round)
  possible_moves = list(get_args(Move))
  move = possible_moves[round_index % len(possible_moves)]
  sio.emit("move", move)
  round_index += 1

print(f"Trying to connect to {SERVER_URL}")
sio.connect(SERVER_URL)
