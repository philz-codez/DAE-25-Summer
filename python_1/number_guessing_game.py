# GUESSING GAME
# This program is a simple guessing game where the user has to guess a number between 1 and 10.
import random

def play_game():
    while True:
        x = random.randint(1, 10)
        c = 10
        print("\nI'm thinking of a number between 1 and 10.")
        guess = int(input('Guess an Integer: '))
        while c > 0:
            if guess == x:
                print("You got it!")
                break
            else:
                print("Nope not it!")
                if guess < x:
                    print("hint: guess higher")
                else:
                    print("hint: guess lower")
                c -= 1
                if c == 0:
                    print("better luck next time")
                    break
                print("You have " + str(c) + " guesses left")
                guess = int(input('Guess an Integer: '))
        j = input("Wanna play again? (Yes/No) ")
        if j != "Yes":
            print("thanks for playing")
            break

start = input("Do you want to play a game?\n")
if start == 'Yes':
    play_game()
else:
    print("See you next time\n")
