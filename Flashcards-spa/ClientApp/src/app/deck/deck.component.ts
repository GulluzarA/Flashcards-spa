import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-deck',
    template: `
        <a *ngIf="Deck" [routerLink]="['/subjects/decks', Deck.DeckId]" [ngClass]="buttonClass">
            <div class="card-body px-1 h-100 d-flex flex-column justify-content-between">
                <h5 class="card-title">
                    {{ Deck.Name }}
                </h5>
                <div class="card-text">
                    {{ Deck.Cards | count : 'card'}}
                </div>
            </div>
        </a>
    `
})
export class DeckComponent {
    @Input() Deck: DeckDTO | undefined;
    buttonClass?: string

    ngOnInit(): void {
        this.buttonClass = this.calculateButtonClass();
    }

    private calculateButtonClass(): string {
        // Change color based on DeckId
        let deckId = this.Deck?.DeckId ?? 0;

        switch (deckId % 5) {
            case 1:
                return 'btn btn-primary p-0 card-shaped card-sized shadow-sm';
            case 2:
                return 'btn btn-success p-0 card-shaped card-sized shadow-sm';
            case 3:
                return 'btn btn-danger p-0 card-shaped card-sized shadow-sm';
            case 4:
                return 'btn btn-info p-0 card-shaped card-sized shadow-sm';
            default:
                return 'btn btn-warning p-0 card-shaped card-sized shadow-sm';
        }
    }
}
