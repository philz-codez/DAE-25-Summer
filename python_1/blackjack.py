import random
import time
import os

SAVE_FILE = "chips.txt"

# --- Age Check ---
# Prompt the player for their age and enforce minimum age 21.
age = input("\nWelcome to Blackjack! How old are you? ")
if not age.isdigit() or int(age) < 21:
    if age == "4":
        print("You are the youngest person ever! But you can't play Blackjack.")
    else:
        print("Sorry you must be 21 to play")
    exit()
else:
    print("You're old enough! Let's get started.\n")

# --- Load or initialize chips ---
# Attempt to read the saved chip count from a file,
# or initialize with 100 chips if no valid save exists.
if os.path.exists(SAVE_FILE):
    with open(SAVE_FILE, "r") as f:
        try:
            chips = int(f.read())
        except ValueError:
            chips = 100
else:
    chips = 100

wins = 0
losses = 0

# --- Function: create_deck() ---
# Creates and returns a new shuffled deck of 52 standard playing cards.
# Each card is represented as a tuple: (rank, suit).
def create_deck():
    suits = ["♠","♥","♣","♦"]
    ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
    deck = [(rank, suit) for suit in suits for rank in ranks]
    random.shuffle(deck)
    return deck

# --- Function: calculate_total(hand) ---
# Calculates the total point value of a hand of cards.
# Aces count as 11 unless that causes a bust, then count as 1.
def calculate_total(hand):
    total, aces = 0, 0
    for rank, _ in hand:
        if rank in ["J", "Q", "K"]:
            total += 10
        elif rank == "A":
            total += 11
            aces += 1
        else:
            total += int(rank)
    # Adjust for Aces if total is over 21
    while total > 21 and aces:
        total -= 10
        aces -= 1
    return total

# --- Function: display_hand(hand) ---
# Returns a nicely formatted string of the cards in a hand.
def display_hand(hand):
    return " ".join([rank + suit for rank, suit in hand])

# --- MAIN GAME LOOP ---
play_session = True

while play_session:
    # Check if player has chips; if not, offer to reset chips or quit
    if chips <= 0:
        print("\nYou're out of chips!")
        choice = input("Start over with 100 fresh chips? (y/n) ").strip().lower()
        if choice == 'y':
            chips = 100
            wins = 0
            losses = 0
            if os.path.exists(SAVE_FILE):
                os.remove(SAVE_FILE)  # Delete save file ONLY when resetting after chips run out
        else:
            print("Thanks for playing!")
            break


    print("\n" + "="*40)
    print(" NEW ROUND ")
    print("="*40)
    print(f"You have {chips} chips.")

    # --- Betting phase ---
    # Prompt player to enter a valid bet amount within their chip count
    while True:
        bet = input("How much would you like to bet? ")
        if bet.isdigit() and 1 <= int(bet) <= chips:
            bet = int(bet)
            break
        else:
            print(f"Invalid bet. Enter a number between 1 and {chips}.")

    # --- Deal initial cards ---
    deck = create_deck()
    player = [deck.pop(), deck.pop()]
    dealer = [deck.pop(), deck.pop()]

    # Check for immediate blackjack hands
    player_bj = (calculate_total(player) == 21)
    dealer_bj = (calculate_total(dealer) == 21)
    player_bust = False

    print(f"\nYour hand: {display_hand(player)} Total: {calculate_total(player)}")
    r, s = dealer[0]
    print(f"Dealer's hand: {r}{s} + [Hidden]")

    # --- Immediate blackjack handling ---
    if player_bj or dealer_bj:
        if player_bj and not dealer_bj:
            payout = int(1.5 * bet)
            print("Blackjack! You win 3:2 payout!")
            chips += payout
            wins += 1
        elif dealer_bj and not player_bj:
            print("Dealer has Blackjack! You lose.")
            chips -= bet
            losses += 1
        else:
            print('Both have Blackjack! Push.')

        with open(SAVE_FILE, "w") as f:
            f.write(str(chips))

    else:
        # --- Player turn ---
        # Player chooses to Hit or Stand until bust or stand
        while True:
            action = input("Hit or Stand? (h/s) ").lower()
            if action == "h":
                player.append(deck.pop())
                total = calculate_total(player)
                print(f"\nYour hand: {display_hand(player)} Total: {total}")
                if total > 21:
                    print("You bust! Dealer wins.")
                    chips -= bet
                    losses += 1
                    player_bust = True
                    break
            elif action == "s":
                print(f"\nYou stand with total: {calculate_total(player)}")
                break
            else:
                print("Invalid input. Please enter 'h' to hit or 's' to stand.")

        # --- Dealer turn ---
        # Dealer reveals hand and hits until total is 17 or more
        if not player_bust:
            print(f"\nRevealing dealer's hand: {display_hand(dealer)} Total: {calculate_total(dealer)}")

            while calculate_total(dealer) < 17:
                time.sleep(1)
                new = deck.pop()
                dealer.append(new)
                print(f"Dealer hits: {new[0]}{new[1]} Total: {calculate_total(dealer)}")

            pt, dt = calculate_total(player), calculate_total(dealer)

            # Determine round outcome
            if dt > 21 or pt > dt:
                print("You win!")
                chips += bet
                wins += 1
            elif dt > pt:
                print("Dealer Wins!")
                chips -= bet
                losses += 1
            else:
                print("Push! It's a tie!")

        # Save chip count after round finishes
        with open(SAVE_FILE, "w") as f:
            f.write(str(chips))

    print(f"\nYou leave with {chips} chips.")

    # --- Play again prompt ---
    # Ask the player if they want to continue playing
    again = input("\nDo you want to try your luck again? (y/n) ").strip().lower()
    if again != 'y':
        play_session = False

print(f"Thanks for playing! Final record: {wins} wins and {losses} losses.")
