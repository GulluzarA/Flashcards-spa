import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class PracticeService {
    private practiceDeckKey!: string;

    constructor(private router: Router) {
    }

    getPracticeId(deckId: number) {
        this.practiceDeckKey = "Practice" + deckId
    }

    getDeck(): DeckPracticeDTO {
        return JSON.parse(localStorage.getItem(this.practiceDeckKey)!);
    }

    getCards(): CardDTO[] {
        const deck = JSON.parse(localStorage.getItem(this.practiceDeckKey)!);
        return deck.CardsLeft;
    }

    updatePracticeDeck(deck: DeckPracticeDTO) {
        localStorage.setItem(this.practiceDeckKey, JSON.stringify(deck))
    }

    updateDeckInit(): DeckPracticeDTO {

        let deck = this.getDeck();

        if (deck.FinishedPractice || deck.CardsLeft == null) {
            deck.CardsLeft = deck.Cards!;
            deck.CorrectAnswers = 0;
            deck.WrongAnswers = 0;
            deck.FinishedPractice = false;
        }

        localStorage.setItem(this.practiceDeckKey, JSON.stringify(deck));
        return deck
    }

    getCardInit(): CardDTO {
        const cards = this.getCards();

        let RNGIndex = Math.floor(Math.random() * cards.length);
        return cards[RNGIndex]
    }

    getNewCard(PreviousCard: CardDTO): CardDTO {
        let card;
        const cards = this.getCards();

        if (cards.length > 1) {
            do {
                let RNGIndex = Math.floor(Math.random() * cards.length);
                card = cards[RNGIndex];
            } while (PreviousCard.CardId === card.CardId)
        } else {
            let RNGIndex = Math.floor(Math.random() * cards.length);
            card = cards[RNGIndex];
        }
        return card;
    }

    navigateToPractice(deck: DeckDTO): void {
        const getDeck = localStorage.getItem("Practice" + deck.DeckId);

        if (getDeck !== null) {
            let parseDeck = JSON.parse(getDeck);

            if (parseDeck.FinishedPractice || parseDeck.DeckId !== deck.DeckId) {
                localStorage.setItem("Practice" + deck.DeckId, JSON.stringify(deck))
            }
        } else {
            localStorage.setItem("Practice" + deck.DeckId, JSON.stringify(deck))
        }
        void this.router.navigate(['/practice', deck.DeckId]);
    }

    activeSession(deckId: number): boolean {
        this.getPracticeId(deckId);
        const practiceDeck = this.getDeck();
        return practiceDeck !== null && !practiceDeck.FinishedPractice;
    }
}