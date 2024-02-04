import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
    @Input() Card: CardDTO | undefined;
    checkBoxId?: string;
    @Input() IsOwner!: Boolean;
    @Input() IsFromDetails!: Boolean;

    ngOnInit(): void {
        this.checkBoxId = this.setCheckBoixId()
    }

    setCheckBoixId(): string {
        return this.checkBoxId = 'swapCheckbox' + this.Card?.CardId;
    }

    flipCard() {
        const checkbox = document.getElementById(this.setCheckBoixId()) as HTMLInputElement;
        if (checkbox) {
            checkbox.click()
        }
    }
}
