import {Component} from '@angular/core';
import {AuthorizeService} from '../../../api-authorization/authorize.service';
import {DeckService} from "../deck.service";
import {ActivatedRoute} from "@angular/router";
import {SubjectService} from "../../subject/subject.service";
import {ModalService} from "../../shared/modal/modal.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {PracticeService} from "../../practice/practice.service";

@Component({
    selector: 'app-deck-details',
    templateUrl: './deck-details.component.html',
})

export class DeckDetailsComponent {
    public userName$: Observable<string | null | undefined>
    public userId$: Observable<string | null | undefined>
    public deck$: Observable<ApiResponse<DeckDTO>>
    public subject$?: Observable<ApiResponse<SubjectDTO>>
    public ownerId?: string | null | undefined;
    public isOwner?: boolean
    public activeSession?: boolean

    constructor(
        private deckService: DeckService,
        private subjectService: SubjectService,
        private authorizeService: AuthorizeService,
        private route: ActivatedRoute,
        private modalService: ModalService,
        private practiceService: PracticeService) {

        this.userName$ = this.authorizeService.getUser().pipe(map(user => user && user.name));
        this.userId$ = this.authorizeService.getUser().pipe(map(user => user && user.sub));

        // Get deck
        this.deck$ = this.deckService.getById(this.getRouteId()).pipe(
            map((res) => {
                if (res.data) {
                    // Get subject
                    this.subject$ = this.subjectService.getById(res.data.SubjectId).pipe(
                        map((res) => {
                            if (res.data) {
                                // Set owner id
                                this.ownerId = res.data.OwnerId
                                // Check if user is owner
                                this.userId$.subscribe(userId => {
                                    if (userId === this.ownerId) {
                                        // Set isOwner
                                        this.isOwner = true
                                    }
                                })
                            }
                            return res
                        })
                    )
                }
                return res
            })
        )

        this.activeSession = this.practiceService.activeSession(this.getRouteId())
    }

    getRouteId(): number {
        return this.route.snapshot.params['id']
    }

    navigateToPractice(deck: DeckDTO): void {
        this.practiceService.navigateToPractice(deck);
    }

    showEditDeckModal(deck: DeckDTO) {
        this.modalService.showEditDeck(deck);
    }

    showDeleteDeckModal(deckId: number) {
        this.modalService.showDeleteDeck(deckId);
    }

    showCreateCardModal(deckId: number) {
        this.modalService.showCreateCard(deckId);
    }

    showEditCardModal(card: CardDTO) {
        this.modalService.showEditCard(card);
    }

    showDeleteCardModal(card: CardDTO) {
        this.modalService.showDeleteCard(card);
    }
}