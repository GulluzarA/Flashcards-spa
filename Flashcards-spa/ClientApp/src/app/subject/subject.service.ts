import {Inject, Injectable} from "@angular/core";
import {CrudBase} from "../shared/crudBase";

@Injectable({providedIn: 'root'})
export class SubjectService extends CrudBase<SubjectDTO> {
    constructor(@Inject('BASE_URL') baseUrl: string) {
        super(baseUrl + 'api/subjects');
    }

    override getAllUrl() {
        let endpoint = this.resourceUrl
        let currentLocation = window.location.pathname;
        if (currentLocation === "/subjects/public") {
            endpoint += '/public';
        } else {
            endpoint += '/private';
        }
        
        return endpoint
    }

    filterSubjects(subject: SubjectDTO, filter: string): boolean {
        // Simple solution
        return subject.Name.toLowerCase().includes(filter.toLowerCase())
    }
}
