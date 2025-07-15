#BLACKJACK
import random
import time
import os

SAVE_FILE = "chips.txt"

# Age Check
age = input("Welcome to Blackjack! How old are you? ")

if not age.isdigit() or int(age) < 21:
    print("Sorry you must be 21 to play")
    exit()
else:
    print("You're old enough! Let's get started.\n")

#Load or initialize chips
if os.path.exists(SAVE_FILE):
    with open(SAVE_FILE, "r") as f:
        try:
            chips = int(f.read())
        except:
            chips = 100
else:
    chips = 100

wins = 0
losses = 0


# Function to create a standard deck of cards
def create_deck():
    suits = ["♠","♥","♣","♦"]
    ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
    deck = [(rank, suit) for suit in suits for rank in ranks]
    random.shuffle(deck)
    return deck


# Function that calculates the total of the players/dealers hand
def calculate_total(hand):
    total = 0
    aces = 0
    for card in hand:
        rank = card[0]
        if rank in ["J", "Q", "K"]:
            total += 10
        elif rank == "A":
            total += 11
            aces += 1
        else:
            total += int(rank)
    while total > 21 and aces:
        total -= 10
        aces -= 1
    return total

# Function to display cards easier
def display_hand(hand):
    return " ".join([rank + suit for rank, suit in hand])

chips = 100

#MAIN GAME LOOP
while chips > 0:
    print("\n" + "="*40)
    print(" NEW ROUND ")
    print("="*40)
    print(f"You have {chips} chips. ")

    while True:
        bet = input("How much would you like to bet? ")
        if bet.isdigit() and 1 <= int(bet) <= chips:
            bet = int(bet)
            break
        else:
            print(f"Invalid bet. Enter a number between 1 and {chips}.")
    
    deck = create_deck()
    player = [deck.pop(), deck.pop()]
    dealer = [deck.pop(), deck.pop()]
    player_bj = (calculate_total(player) == 21)
    dealer_bj = (calculate_total(dealer) == 21)
    player_bust = False

    print(f"\nYour hand: {display_hand(player)} Total: {calculate_total(player)}")
    

    #show one dealer card, and hide the other
    r, s = dealer[0]
    print(f"Dealer's hand: {r}{s} + [Hidden]")

    if player_bj or dealer_bj:
        if player_bj and not dealer_bj:
            payout = int(1.5 * bet)
            print("Blackjack! You win 3:2 payout!")
            chips += payout
            wins+=1
        elif dealer_bj and not player_bj:
            print("Dealer has Blackjack! You lose.")
            chips -= bet
            losses += 1
        else:
            print('Both have Blackjack! Push.')
        again = input("\nDo you want to try your luck again? (y/n) ")
        if again != 'y':
            break
        

    # Player Turn
    while True:
        action = input("Hit or Stand? (h/s) ").lower()
        if action == "h":
            player.append(deck.pop())
            total = calculate_total(player)
            print(f"\nYour hand: {display_hand(player)} Total: {total}")
            if total > 21:
                print("You bust! Dealer wins.")
                chips-= bet
                losses += 1
                player_bust = True
                break
        elif action == "s":
            print(f"\nYou stand with total: {calculate_total(player)}")
            break
        else:
            print("Invalid input. Please enter 'h' to hit or 's' to stand.")


    # Dealer Turn
    if not player_bust:
        print(f"\nRevealing dealer's hand: {display_hand(dealer)} Total: {calculate_total(dealer)}")
        
        while (dt:= calculate_total(dealer)) <17:
            time.sleep(3)
            new_card = deck.pop()
            dealer.append(deck.pop())
            dealer.append(new_card)
            print(f"Dealer's hits: {new_card[0]}{new_card[1]} Total: {calculate_total(dealer)}")
            

        pt, dt = calculate_total(player), calculate_total(dealer)

        if dt > 21:
            print("Dealer busts! You win!")
            chips+= bet
            wins+=1
        else:
            if dt > pt:
                print("Dealer Wins!")
                chips -= bet
                losses += 1
            elif dt < pt:
                print("You win!")
                chips += bet
                wins += 1
            else:
                print("Push! Its a tie!")
    again = input("\nDo you want to try your luck again? (y/n) ")
    if again != 'y':
        break

    if chips == 0:
        print("\nYou're out of chips!")
        choice = input("Start over with 100 fresh chips (y/n) ").strip().lower()
        if choice == 'y':
            if os.path.exists(SAVE_FILE):
                os.remove(SAVE_FILE)
            continue
        else:
            print("Thanks for playing better luck next time!")
            break
    else:
        print(f"\nYou leave with {chips} chips.")
        break
with open(SAVE_FILE, "w") as f:
    f.write(str(chips))