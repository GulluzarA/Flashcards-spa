import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class ModalService {
    // Generic
    closeModal$ = new Subject<void>

    // Subject
    showCreateSubject$ = new Subject<void>()
    showEditSubject$ = new Subject<SubjectDTO>()
    showDeleteSubject$ = new Subject<number>()

    // Deck
    showCreateDeck$ = new Subject<number>()
    showEditDeck$ = new Subject<DeckDTO>()
    showDeleteDeck$ = new Subject<number>()

    // Card
    showCreateCard$ = new Subject<number>()
    showEditCard$ = new Subject<CardDTO>()
    showDeleteCard$ = new Subject<CardDTO>()

    // Generic
    closeModal() {
        this.closeModal$.next()
    }

    // Subject
    showCreateSubject() {
        this.showCreateSubject$.next()
    }

    showEditSubject(subject: SubjectDTO) {
        this.showEditSubject$.next(subject)
    }

    showDeleteSubject(subjectId: number) {
        this.showDeleteSubject$.next(subjectId)
    }

    // Deck
    showCreateDeck(subjectId: number) {
        this.showCreateDeck$.next(subjectId)
    }

    showEditDeck(Deck: DeckDTO) {
        this.showEditDeck$.next(Deck)
    }

    showDeleteDeck(DeckId: number) {
        this.showDeleteDeck$.next(DeckId)
    }

    // Card
    showCreateCard(deckId: number) {
        this.showCreateCard$.next(deckId)
    }

    showEditCard(Card: CardDTO) {
        this.showEditCard$.next(Card)
    }

    showDeleteCard(card: CardDTO) {
        this.showDeleteCard$.next(card)
    }
}