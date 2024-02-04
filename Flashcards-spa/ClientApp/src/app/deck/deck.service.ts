import {Inject, Injectable} from "@angular/core";
import {CrudBase} from "../shared/crudBase";

@Injectable({providedIn: 'root'})
export class DeckService extends CrudBase<DeckDTO> {
    constructor(@Inject('BASE_URL') baseUrl: string) {
        super(baseUrl + 'api/decks');
    }

    getAll(): any {
        throw new Error("Method not implemented.");
    }
}
