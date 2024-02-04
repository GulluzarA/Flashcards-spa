import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DeckService} from "../../deck/deck.service";
import {CardService} from "../card.service";

@Component({
    selector: 'app-card-create-form',
    templateUrl: `./card-create-form.component.html`
})

export class CardCreateFormComponent {
    @Input() deckId!: number;
    cardCreateForm: FormGroup;

    // Constructor initializes the form builder and injects the http client
    constructor(private formbuilder: FormBuilder, private cardService: CardService, private deckService: DeckService,) {
        this.cardCreateForm = this.formbuilder.nonNullable.group({
            Front: ["", [Validators.required, Validators.maxLength(120)]],
            Back: ["", [Validators.required, Validators.maxLength(120)]],
        });
    }

    onSubmit(): void {
        let card = this.cardCreateForm.value;
        card.DeckId = this.deckId;
        this.cardService.create(card).subscribe(
            {
                complete: () => {
                    this.deckService.markStale(this.deckId);
                }
            }
        )

        setTimeout(() => {
            this.cardCreateForm.reset();
        }, 500);
    }
}
