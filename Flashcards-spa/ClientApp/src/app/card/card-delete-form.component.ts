import {Component, Input} from '@angular/core';
import {CardService} from "./card.service";
import {DeckService} from "../deck/deck.service";

@Component({
    selector: 'app-card-delete-form',
    template: `
        <form (ngSubmit)="onSubmit()">
            <div class="mb-3">
                Are you sure you want to delete this card?
            </div>
            <div class="d-flex justify-content-end gap-2">
                <button type="submit" class="btn btn-danger" data-bs-dismiss="modal">
                    Delete
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
        </form>
    `
})
export class CardDeleteFormComponent {
    @Input() card!: CardDTO;

    constructor(
        private cardService: CardService,
        private deckService: DeckService) {
    }

    onSubmit() {
        this.cardService.delete(this.card.CardId).subscribe(
            {
                complete: () => {
                    this.deckService.markStale(this.card.DeckId);
                }
            }
        )
    }
}
