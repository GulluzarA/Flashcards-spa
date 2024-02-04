import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {SubjectService} from "../subject/subject.service";

@Component({
    selector: 'app-subjects-public',
    templateUrl: './public-subjects.component.html',
})

export class PublicSubjectsComponent {
    subjects$: Observable<ApiResponse<SubjectDTO[]>> = this.subjectService.getAll()
    subjectNameFilter = ""
    // Filtered subjects
    filteredSubjects$ = this.subjects$.pipe(
        map((res) => res.data?.filter((subject) => {
            return this.subjectService.filterSubjects(subject, this.subjectNameFilter)
        }))
    )

    constructor(private subjectService: SubjectService) {
    }

    // Function to filter subjects
    filterSubjects(subject: SubjectDTO): boolean {
        return subject.Name.toLowerCase().includes(this.subjectNameFilter.toLowerCase())
    }
}
