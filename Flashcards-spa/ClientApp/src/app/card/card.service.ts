import {Inject, Injectable} from "@angular/core";
import {CrudBase} from "../shared/crudBase";

@Injectable({providedIn: 'root'})
export class CardService extends CrudBase<DeckDTO> {
    constructor(@Inject('BASE_URL') baseUrl: string) {
        super(baseUrl + 'api/cards');
    }

    getAll(): any {
        throw new Error("Method not implemented.");
    }
}
