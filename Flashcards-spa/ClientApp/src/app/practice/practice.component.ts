import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PracticeService} from "./practice.service";

@Component({
    selector: 'app-practice',
    templateUrl: './practice.component.html',
})
export class PracticeComponent implements OnDestroy {
    routeId: number;
    card: CardDTO;
    Title: string;
    cardsLeft: number;
    summaryNavigate: boolean = false;
    countdownSummarySec: number = 3;
    countdownInterval: any;
    IsOwner: Boolean = false;
    IsFromDetails: Boolean = false;

    constructor(
        private _router: Router,
        private _practiceService: PracticeService,
        private _route: ActivatedRoute,
    ) {
        this.routeId = this.getRouteId();
        this._practiceService.getPracticeId(this.routeId);
        this._practiceService.updateDeckInit();
        this.card = this._practiceService.getCardInit();
        this.Title = this.calculateTitle();
        this.cardsLeft = this.calculateCardsLength();

    }

    // calcualte title
    calculateTitle(): string {
        const deck = this._practiceService.getDeck()
        return this.Title = "Practice - " + deck.Name;
    }

    // calculate length of cards left to practice
    calculateCardsLength(): number {
        const cards = this._practiceService.getCards();
        const cardsLength = cards.length;
        return this.cardsLeft = cardsLength;
    }

    // get current route id parameter
    getRouteId(): number {
        return this._route.snapshot.params['id']
    }

    // clear interval on destroy
    ngOnDestroy(): void {
        clearInterval(this.countdownInterval)
    }

    // get a new card from card list left to practice
    getCard(): CardDTO {
        const checkBox = 'swapCheckbox' + this.card.CardId;
        const card = this._practiceService.getNewCard(this.card!);

        let checkbox = document.getElementById(checkBox) as HTMLInputElement;
        if (checkbox) {
            if (checkbox.checked) {
                checkbox.checked = false
                setTimeout(() => {
                    this.card = card
                }, 150);
                return card
            }
        }

        this.card = card
        return card
    }

    // when practicing again same card, update localstorage deck and get a new card.
    incorrectCard(): void {
        this.getCard()
        let deck = this._practiceService.getDeck()
        deck.WrongAnswers++;
        this._practiceService.updatePracticeDeck(deck);
    }
    // correct answering a card
    correctCard(): void {
        // Get deck array from localstorage
        let deck = this._practiceService.getDeck();

        // Get cards left to practice
        let cardArray = deck.CardsLeft;

        //finds index of current card
        let findCardIndex = cardArray.findIndex((card: CardDTO) => card.CardId === this.card.CardId)

        // Removes correct card from array
        cardArray.splice(findCardIndex, 1);

        // count correct answered cards
        deck.CorrectAnswers++;

        // update card array in localstorage by updating practice deck
        this._practiceService.updatePracticeDeck(deck);

        // get a new card from card array
        this.getCard();

        // calculate length of card array
        this.calculateCardsLength();

        // navigate to summary view when theres no cards left in deck to practice and update practice deck
        if (this.cardsLeft === 0) {
            deck.FinishedPractice = true;
            this._practiceService.updatePracticeDeck(deck);

            this.countdownNavigate()
        }
    }

    //countdown for finish practice view and routing to summary
    countdownNavigate() {
        this.summaryNavigate = true;

        this.countdownInterval = setInterval(() => {
            this.countdownSummarySec--
            if (this.countdownSummarySec === 0) {
                clearInterval(this.countdownInterval);
                void this._router.navigate(['/practice/summary/', this.routeId])
            }
        }, 1000)
    }

    // implementation for finish practice button
    setFinishPractice() {
        let deck = this._practiceService.getDeck()
        deck.FinishedPractice = true;
        this._practiceService.updatePracticeDeck(deck);

        if (deck.Cards?.length == deck.CardsLeft.length) {
            void this._router.navigate(['/practice/summary/', this.routeId])
        } else {
            this.countdownNavigate()
        }
    }
}