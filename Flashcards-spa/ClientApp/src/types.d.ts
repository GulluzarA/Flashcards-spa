export {}

declare global {
    interface ApiResponse<T> {
        complete: boolean;
        error?: { status: string; message: string };
        data?: T;
    }

    interface SubjectDTO {
        SubjectId: number;
        Name: string;
        Description?: string;
        Visibility: SubjectVisibility;
        OwnerId?: string;
        Decks?: DeckDTO[];
    }

    interface DeckDTO {
        DeckId: number;
        Name: string;
        Description?: string;
        SubjectId: number;
        Cards?: CardDTO[];
        CardCount: number;
    }

    interface DeckPracticeDTO extends DeckDTO{
        CardsLeft: CardDTO[];
        CorrectAnswers: number;
        WrongAnswers: number;
        FinishedPractice: boolean;
    }

    interface CardDTO {
        CardId: number;
        Front: string;
        Back: string;
        DeckId: number;
    }

    enum SubjectVisibility {
        "Private",
        "Public"
    }
}
