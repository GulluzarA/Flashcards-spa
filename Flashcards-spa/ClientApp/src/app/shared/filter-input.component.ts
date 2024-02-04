import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'app-filter-input',
    template: `
        <div class="input-group mt-3">
            <span class="input-group-text">
                <i class="bi bi-funnel"> </i>
                <span>&nbsp;Filter</span>
            </span>
            <input type="text" class="form-control"
                   [placeholder]="placeholder"
                   [(ngModel)]="filterValue"
                   (ngModelChange)="onFilterValueChange()">
            <!-- Reset button-->
            <button class="btn btn-outline-secondary" type="button" (click)="resetFilter()">
                <i class="bi bi-arrow-counterclockwise"></i>
                Reset
            </button>
        </div>
    `
})
export class FilterInputComponent {
    @Input() placeholder: string = "";
    @Output() filterValueChanged = new EventEmitter<string>();
    filterValue: string = "";

    resetFilter() {
        this.filterValue = "";
        this.filterValueChanged.emit(this.filterValue);
    }

    onFilterValueChange() {
        this.filterValueChanged.emit(this.filterValue);
    }
}
