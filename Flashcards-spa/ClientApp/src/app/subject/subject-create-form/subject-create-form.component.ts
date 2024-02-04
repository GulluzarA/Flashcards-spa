import {Component, ElementRef, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {SubjectService} from "../subject.service";

@Component({
    selector: 'app-subject-create-form',
    templateUrl: `./subject-create-form.component.html`
})

export class SubjectCreateFormComponent {
    subjectCreateForm: FormGroup;

    // Constructor initializes the form builder and injects the http client
    constructor(private formbuilder: FormBuilder, private _http: HttpClient, private subjectService: SubjectService) {
        this.subjectCreateForm = formbuilder.nonNullable.group({
            Name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-ZæøåÆØÅ0-9. \-]*$")]],
            Description: ["", [Validators.maxLength(150)]],
            Visibility: ["1", [Validators.required]],
        });
    }

    onSubmit(): void {
        const subject = this.subjectCreateForm.value;
        this.subjectService.create(subject).subscribe()

        setTimeout(() => {
            this.subjectCreateForm.reset();
        }, 500);
    }
}
