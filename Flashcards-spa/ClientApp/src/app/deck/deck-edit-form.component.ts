import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DeckService} from "./deck.service";

@Component({
    selector: 'app-deck-edit-form',
    template: `
        <form [formGroup]="deckEditForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
                <label for="Name" class="form-label">Name</label>
                <input
                        type="text"
                        id="Name"
                        formControlName="Name"
                        autocomplete="off"
                        [ngClass]="deckEditForm.controls.Name.invalid ? 'is-invalid' : ''"
                        class="form-control"
                />
                <div class="invalid-feedback">
                    <span *ngIf="deckEditForm.controls.Name.errors?.required">Name is required</span>
                    <span *ngIf="deckEditForm.controls.Name.errors?.minlength">Name must be at least 3 characters</span>
                    <span *ngIf="deckEditForm.controls.Name.errors?.maxlength">Name must be shorter than 50 characters</span>
                    <div *ngIf="deckEditForm.controls.Name.errors?.pattern">Only numbers, letters and these special
                        characters: . -
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="Description" class="form-label">Description</label>
                <textarea
                        rows="3"
                        type="text"
                        id="Description"
                        formControlName="Description"
                        autocomplete="off"
                        class="form-control"
                        style="resize: none"
                        [ngClass]="deckEditForm.controls.Description.invalid ? 'is-invalid' : ''"
                ></textarea>
                <div class="invalid-feedback">
                    <span *ngIf="deckEditForm.controls.Description.errors?.maxlength">Description must be shorter than 150 characters</span>
                </div>
            </div>
            <div class="d-flex justify-content-end gap-2">
                <button type="submit" class="btn btn-primary" data-bs-dismiss="modal"
                        [disabled]="deckEditForm.invalid">
                    Update
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
        </form>
    `,
})
export class DeckEditFormComponent {
    @Input() deck!: DeckDTO;
    deckEditForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private deckService: DeckService) {
        this.deckEditForm = this.formBuilder.group({
            Name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-ZæøåÆØÅ0-9. \-]*$")]],
            Description: ["", [Validators.maxLength(150)]],
        });
    }

    ngOnChanges(): void {
        this.resetForm();
    }

    onSubmit() {
        const deck = this.deckEditForm.value;
        this.deckService.update(this.deck.DeckId, deck).subscribe({
            complete: () => {
                this.deckService.markStale(this.deck.DeckId);
            }
        });
    }

    resetForm() {
        this.deckEditForm.patchValue({
            Name: this.deck.Name,
            Description: this.deck.Description,
        });
    }
}
