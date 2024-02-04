import {Component, Input} from '@angular/core';
import {SubjectService} from "./subject.service";

@Component({
    selector: 'app-subject-delete-form',
    template: `
        <form (ngSubmit)="onSubmit()">
            <div class="mb-3">
                Are you sure you want to delete this subject?
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
export class SubjectDeleteFormComponent {
    @Input() subjectId!: number;

    constructor(private subjectService: SubjectService) {
    }

    onSubmit() {
        this.subjectService.delete(this.subjectId).subscribe()
    }
}
