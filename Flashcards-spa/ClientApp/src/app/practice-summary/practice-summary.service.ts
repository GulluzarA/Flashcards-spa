import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class PracticeSummaryService { 
  private practiceDeckKey!: string;

  getPracticeId(deckId: number) {
    this.practiceDeckKey = "Practice" + deckId
  }

  getDeck(): DeckPracticeDTO {
    return JSON.parse(localStorage.getItem(this.practiceDeckKey)!);
  }
}