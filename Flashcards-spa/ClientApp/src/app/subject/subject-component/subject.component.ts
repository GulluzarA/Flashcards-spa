import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {DeckService} from "../../deck/deck.service";
import {ModalService} from "../../shared/modal/modal.service";

@Component({
    selector: 'app-subject',
    templateUrl: './subject.component.html',
})

export class SubjectComponent {
    @Input() representation: "Public" | "Private" = "Public";
    @Input() Subject!: SubjectDTO;
    @Input() Author = "unknown user";
    Public: boolean = false;

    constructor(private deckService: DeckService, private _router: Router, private modalService: ModalService) {
    }

    ngOnInit(): void {
        this.Public = this.Subject?.Visibility === 0;
    }

    isYourSubject(): boolean {
        // Example: return this.authService.getUserId() === this.subject.ownerId;
        return this.representation === "Private";
    }

    showEditModal() {
        this.modalService.showEditSubject(this.Subject);
    }

    showDeleteModal() {
        this.modalService.showDeleteSubject(this.Subject.SubjectId);
    }

    showCreateDeckModal() {
        this.modalService.showCreateDeck(this.Subject.SubjectId);
    }
}
