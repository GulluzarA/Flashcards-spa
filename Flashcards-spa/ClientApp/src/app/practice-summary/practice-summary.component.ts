import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PracticeSummaryService} from "./practice-summary.service";

@Component({
    selector: 'app-practice-summary',
    templateUrl: './practice-summary.component.html',
})
export class PracticeSummaryComponent {
    routeId: number;
    deck: DeckPracticeDTO;
    amountAnsweredCards: number;
    amountCorrectAnswers: number;
    amountWrongAnswers: number;
    percentageCorrect: number;

    constructor(
        private _router: Router,
        private _practiceSummaryService: PracticeSummaryService,
        private _route: ActivatedRoute,
    ) {
        this.routeId = this.getRouteId();
        this._practiceSummaryService.getPracticeId(this.routeId);
        this.deck = this._practiceSummaryService.getDeck()
        this.amountAnsweredCards = this.totalCards();
        this.amountCorrectAnswers = this.correctAnswers();
        this.amountWrongAnswers = this.wrongAnswers();
        this.percentageCorrect = Math.round(this.amountCorrectAnswers / this.amountAnsweredCards * 100);
    }

    getRouteId(): number {
        return this._route.snapshot.params['id']
    }

    totalCards(): number {
        return this.deck.CorrectAnswers + this.deck.WrongAnswers;
    }

    correctAnswers(): number {
        return this.deck.CorrectAnswers;

    }

    wrongAnswers(): number {
        return this.deck.WrongAnswers;
    }

    improveScore(): void {
        this._router.navigate(['/practice', this.deck.DeckId]);

    }


}
