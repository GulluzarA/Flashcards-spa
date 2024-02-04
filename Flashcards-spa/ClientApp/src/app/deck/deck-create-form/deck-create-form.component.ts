import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DeckService} from "../deck.service";
import {SubjectService} from "../../subject/subject.service";

@Component({
    selector: 'app-deck-create-form',
    templateUrl: `./deck-create-form.component.html`
})

export class DeckCreateFormComponent {
    @Input() subjectId!: number;
    deckCreateForm: FormGroup;

    // Constructor initializes the form builder and injects the http client
    constructor(private formbuilder: FormBuilder, private deckService: DeckService, private subjectService: SubjectService) {
        this.deckCreateForm = formbuilder.nonNullable.group({
            Name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            Description: ["", [Validators.maxLength(150)]],
        });
    }

    onSubmit(): void {
        const deck: DeckDTO = this.deckCreateForm.value;
        deck.SubjectId = this.subjectId;
        this.deckService.create(deck).subscribe({
                complete: () => {
                    this.subjectService.markStale()
                }
            }
        );

        setTimeout(() => {
            this.deckCreateForm.reset();
        }, 500);
    }
}
