import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'app-edit-delete-actions',
    template: `
        <div class="btn-group btn-group-sm" role="group" aria-label="Subject actions">
            <!-- Edit action -->
            <button class="btn text-primary" (click)="emitEdit()">
                <i class="bi bi-pencil-square"></i>
                Edit
            </button>
            <!-- Delete action -->
            <button class="btn text-danger" (click)="emitDelete()">
                <i class="bi bi-trash3"></i>
                Delete
            </button>
        </div>
    `
})

export class EditDeleteActionsComponent {
    @Output() edit = new EventEmitter<void>()
    @Output() delete = new EventEmitter<void>()

    emitEdit() {
        this.edit.emit()
    }

    emitDelete() {
        this.delete.emit()
    }
}
