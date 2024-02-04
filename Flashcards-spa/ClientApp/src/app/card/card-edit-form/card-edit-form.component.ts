import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DeckService} from "../../deck/deck.service";
import {CardService} from "../card.service";

@Component({
    selector: 'app-card-edit-form',
    templateUrl: `./card-edit-form.component.html`
})

export class CardEditFormComponent {
    @Input() card!: CardDTO;
    cardEditForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private cardService: CardService, private deckService: DeckService,) {
        this.cardEditForm = this.formBuilder.group({
            Front: ["", [Validators.required, Validators.maxLength(120)]],
            Back: ["", [Validators.required, Validators.maxLength(120)]],
        });
    }

    ngOnChanges(): void {
        this.resetForm();
    }

    onSubmit() {
        const card = this.cardEditForm.value;
        this.cardService.update(this.card.CardId, card).subscribe({
                complete: () => {
                    this.deckService.markStale(this.card.DeckId);
                }
            }
        )
    }

    resetForm() {
        this.cardEditForm.patchValue({
            Front: this.card.Front,
            Back: this.card.Back,
        });
    }
}
