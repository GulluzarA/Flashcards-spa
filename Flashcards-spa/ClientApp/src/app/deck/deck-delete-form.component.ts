import {Component, Input} from '@angular/core';
import {DeckService} from "./deck.service";
import {SubjectService} from "../subject/subject.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-deck-delete-form',
    template: `
        <form (ngSubmit)="onSubmit()">
            <div class="mb-3">
                Are you sure you want to delete this deck?
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
export class DeckDeleteFormComponent {
    @Input() deckId!: number;

    constructor(private deckService: DeckService, private subjectService: SubjectService, private router: Router) {
    }
    onSubmit() {
        this.deckService.delete(this.deckId).subscribe(
            {
                complete: () => {
                    this.subjectService.markStale();
                    this.deckService.markStale();
                    void this.router.navigate(['/subjects/private']);
                }
            }
        )
    }
}
