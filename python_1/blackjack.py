#BLACKJACK
import random

# Function to create a standard deck of cards
def create_deck():
    suits = ["♠","♥","♣","♦"]
    ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
    deck = [(rank, suit) for suit in suits for rank in ranks]
    random.shuffle(deck)
    return deck

deck = create_deck()

player_hand = [deck.pop(), deck.pop()]
dealer_hand = [deck.pop(), deck.pop()]


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

print("Your hand:", player_hand)
print("Your total:", calculate_total(player_hand))

while True:
    action = input("Do you want to hit or stand (h/s)? ")
    if action == "h":
        player_hand.append(deck.pop())
        print("Your hand:", player_hand)
        total = calculate_total(player_hand)
        print("Your total:", total)
        if total > 21:
            print("You bust! Dealer wins.")
            break
    elif action == "s":
        print("You stand with total:", calculate_total(player_hand))
        break
    else:
        print("Invalid input. Please enter 'h' to hit or 's' to stand.")
