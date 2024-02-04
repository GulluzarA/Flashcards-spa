import {Component, ElementRef, ViewChild} from '@angular/core';
import * as bootstrap from 'bootstrap';
import {ModalService} from "./modal.service";
import {BehaviorSubject} from "rxjs";
import {tap} from "rxjs/operators"

type possibleData = {
    subjectId?: number;
    subject?: SubjectDTO
    deckId?: number;
    deck?: DeckDTO
    card?: CardDTO
}

type ComponentMap = {
    // Subject
    CreateSubject: { name: "Create subject", data?: Partial<possibleData> }
    EditSubject: { name: "Edit subject", data?: possibleData }
    DeleteSubject: { name: "Delete subject", data?: possibleData }
    // Deck
    CreateDeck: { name: "Create deck", data?: possibleData }
    EditDeck: { name: "Edit deck", data?: possibleData }
    DeleteDeck: { name: "Delete deck", data?: possibleData }
    // Card
    CreateCard: { name: "Create card", data?: possibleData }
    EditCard: { name: "Edit card", data?: possibleData }
    DeleteCard: { name: "Delete card", data?: possibleData }
    // Default
    Default: { name: "Default", data?: possibleData }
}

type ComponentNames = {
    [K in keyof ComponentMap]: ComponentMap[K]["name"];
}

@Component({
    selector: 'app-modal',
    template: `
        <div #modal class="modal fade" tabindex="-1" aria-labelledby="#modalTitle">
            <div class="modal-dialog modal-fullscreen-sm-down modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="modalTitle">
                            {{currentComponent$.value.name}}
                        </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div *ngIf="currentComponent$.value as current">
                        <div [ngSwitch]="current.name" class="modal-body">
                            <!-- Subjects -->
                            <app-subject-create-form *ngSwitchCase="componentNames.CreateSubject"/>
                            <app-subject-edit-form *ngSwitchCase="componentNames.EditSubject"
                                                   [subject]="current.data?.subject!"/>
                            <app-subject-delete-form *ngSwitchCase="componentNames.DeleteSubject"
                                                     [subjectId]="current.data?.subjectId!"/>
                            <!-- Decks -->
                            <app-deck-create-form *ngSwitchCase="componentNames.CreateDeck"
                                                  [subjectId]="current.data?.subjectId!"/>
                            <app-deck-edit-form *ngSwitchCase="componentNames.EditDeck" [deck]="current.data?.deck!"/>
                            <app-deck-delete-form *ngSwitchCase="componentNames.DeleteDeck"
                                                  [deckId]="current.data?.deckId!"/>
                            <!-- Cards -->
                            <app-card-create-form *ngSwitchCase="componentNames.CreateCard"
                                                  [deckId]="current.data?.deckId!"/>
                            <app-card-edit-form *ngSwitchCase="componentNames.EditCard" [card]="current.data?.card!"/>
                            <app-card-delete-form *ngSwitchCase="componentNames.DeleteCard"
                                                  [card]="current.data?.card!"/>
                            <!-- Default -->
                            <div *ngSwitchDefault>
                                Default modal component
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ModalComponent {
    @ViewChild('modal') modal?: ElementRef<HTMLElement>;
    modalInstance?: bootstrap.Modal;

    protected readonly componentNames: ComponentNames = {
        // Subject
        CreateSubject: "Create subject",
        EditSubject: "Edit subject",
        DeleteSubject: "Delete subject",
        // Deck
        CreateDeck: "Create deck",
        EditDeck: "Edit deck",
        DeleteDeck: "Delete deck",
        // Card
        CreateCard: "Create card",
        EditCard: "Edit card",
        DeleteCard: "Delete card",
        // Default
        Default: "Default"
    };

    currentComponent$ = new BehaviorSubject<ComponentMap[keyof ComponentMap]>({name: "Default"})
    componentHasChanged$ = this.currentComponent$.asObservable()

    constructor(protected modalService: ModalService) {
        // Show the modal when the component has changed
        this.componentHasChanged$.pipe(
            tap(() => this.showModal())
        ).subscribe()

        // Close modal
        modalService.closeModal$.subscribe(() => {
            this.modalInstance?.hide()
        })

        // Show create subject
        modalService.showCreateSubject$.subscribe(() => {
            this.currentComponent$.next({name: this.componentNames.CreateSubject})
        })

        // Show edit subject
        modalService.showEditSubject$.subscribe((subject) => {
            this.currentComponent$.next({name: this.componentNames.EditSubject, data: {subject: subject}})
        })

        // Show delete subject
        modalService.showDeleteSubject$.subscribe((subjectId) => {
            this.currentComponent$.next({name: this.componentNames.DeleteSubject, data: {subjectId: subjectId}})
        })

        // Show create deck
        modalService.showCreateDeck$.subscribe((subjectId) => {
            this.currentComponent$.next({name: this.componentNames.CreateDeck, data: {subjectId: subjectId}})
        })

        // Show edit deck
        modalService.showEditDeck$.subscribe((deck) => {
            this.currentComponent$.next({name: this.componentNames.EditDeck, data: {deck: deck}})
        })

        // Show delete deck
        modalService.showDeleteDeck$.subscribe((deckId) => {
            this.currentComponent$.next({name: this.componentNames.DeleteDeck, data: {deckId: deckId}})
        })

        // Show create card
        modalService.showCreateCard$.subscribe((deckId) => {
            this.currentComponent$.next({name: this.componentNames.CreateCard, data: {deckId: deckId}})
        })

        // Show edit card
        modalService.showEditCard$.subscribe((card) => {
            this.currentComponent$.next({name: this.componentNames.EditCard, data: {card: card}})
        })

        // Show delete card
        modalService.showDeleteCard$.subscribe((card) => {
            this.currentComponent$.next({name: this.componentNames.DeleteCard, data: {card: card}})
        })
    }

    ngOnInit() {
        // Listen for modal to be visible
        this.modal?.nativeElement.addEventListener('shown.bs.modal', () => {
            this.focusFirstInput()
        })
    }

    ngAfterViewInit() {
        this.modalInstance = new bootstrap.Modal(this.modal?.nativeElement!);
    }

    ngOnDestroy() {
        // Remove event listener when component is destroyed
        this.modal?.nativeElement.removeEventListener('shown.bs.modal', () => {
            this.focusFirstInput()
        })
    }

    showModal() {
        this.modalInstance?.show();
        this.focusFirstInput()
    }

    focusFirstInput() {
        // Set timeout to wait for modal to be show before focusing on the first input
        setTimeout(() => {
            const firstInput = this.modal?.nativeElement.querySelector('input');
            firstInput?.focus();
        }, 500);
    }
}
