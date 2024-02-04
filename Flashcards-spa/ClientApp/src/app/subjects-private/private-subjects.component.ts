import {Component} from '@angular/core';
import {map} from "rxjs/operators";
import {SubjectService} from "../subject/subject.service";
import {ModalService} from "../shared/modal/modal.service";

@Component({
    selector: 'app-subjects-private',
    templateUrl: './private-subjects.component.html',
})

export class PrivateSubjectsComponent {
    subjects$ = this.subjectService.getAll()
    subjectNameFilter = ""


    // Filtered subjects
    filteredSubjects$ = this.subjects$.pipe(
        map((res) => res.data?.filter((subject) => {
            return this.subjectService.filterSubjects(subject, this.subjectNameFilter)
        }))
    )

    constructor(private subjectService: SubjectService, private modalService: ModalService) {
    }
    
    // Function to filter subjects
    filterSubjects(subject: SubjectDTO): boolean {
        return subject.Name.toLowerCase().includes(this.subjectNameFilter.toLowerCase())
    }

    showCreateSubjectModal() {
        this.modalService.showCreateSubject()
    }

}
