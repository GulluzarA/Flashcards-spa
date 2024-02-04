import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SubjectService} from "./subject.service";
import {takeWhile} from "rxjs/operators";

@Component({
    selector: 'app-subject-edit-form',
    template: `
        <form [formGroup]="subjectEditForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
                <label for="Name" class="form-label">Name</label>
                <input
                        type="text"
                        id="Name"
                        formControlName="Name"
                        autocomplete="off"
                        [ngClass]="subjectEditForm.controls.Name.invalid ? 'is-invalid' : ''"
                        class="form-control"
                />
                <div class="invalid-feedback">
                    <span *ngIf="subjectEditForm.controls.Name.errors?.required">Name is required</span>
                    <span *ngIf="subjectEditForm.controls.Name.errors?.minlength">Name must be at least 3 characters</span>
                    <span *ngIf="subjectEditForm.controls.Name.errors?.maxlength">Name must be shorter than 50 characters</span>
                    <div *ngIf="subjectEditForm.controls.Name.errors?.pattern">Only numbers, letters and these special
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
                        [ngClass]="subjectEditForm.controls.Description.invalid ? 'is-invalid' : ''"
                ></textarea>
                <div class="invalid-feedback">
                    <span *ngIf="subjectEditForm.controls.Description.errors?.maxlength">Description must be shorter than 150 characters</span>
                </div>
            </div>
            <div class="mb-3">
                <label for="Visibility" class="form-label">Visibility</label>
                <select formControlName="Visibility" id="Visibility" class="form-select" aria-label="Select visibility">
                    <option value="" disabled>Select subject visibility</option>
                    <option value="0">Public</option>
                    <option value="1">Private</option>
                </select>
            </div>
            <div class="d-flex justify-content-end gap-2">
                <button type="submit" class="btn btn-primary" data-bs-dismiss="modal"
                        [disabled]="subjectEditForm.invalid">
                    Update
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
        </form>
    `,
})
export class SubjectEditFormComponent {
    @Input() subject!: SubjectDTO;

    subjectEditForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private subjectService: SubjectService) {
        this.subjectEditForm = this.formBuilder.group({
            Name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-ZæøåÆØÅ0-9. \-]*$")]],
            Description: ["", [Validators.maxLength(150)]],
            Visibility: ["", [Validators.required]],
        });
    }

    ngOnChanges(): void {
        this.resetForm();
    }

    onSubmit() {
        const subject = this.subjectEditForm.value;
        this.subjectService.update(this.subject.SubjectId, subject).pipe(
            takeWhile((res) => !res.complete)
        ).subscribe()
    }


    resetForm() {
        this.subjectEditForm.patchValue({
            Name: this.subject.Name,
            Description: this.subject.Description,
            Visibility: this.subject.Visibility,
        });
    }
}
