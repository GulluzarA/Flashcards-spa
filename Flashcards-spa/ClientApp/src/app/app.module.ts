import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import {HomeComponent} from './home/home.component';
import {CounterComponent} from './counter/counter.component';
import {ApiAuthorizationModule} from 'src/api-authorization/api-authorization.module';
import {AuthorizeGuard} from 'src/api-authorization/authorize.guard';
import {AuthorizeInterceptor} from 'src/api-authorization/authorize.interceptor';
import {PublicSubjectsComponent} from "./subjects-public/public-subjects.component";
import {CardComponent} from "./card/card.component";
import {DeckComponent} from "./deck/deck.component";
import {PrivateSubjectsComponent} from "./subjects-private/private-subjects.component";
import {CountPipe} from "./shared/count.pipe";
import {PracticeComponent} from "./practice/practice.component";
import {PracticeSummaryComponent} from "./practice-summary/practice-summary.component";
import {FilterInputComponent} from "./shared/filter-input.component";
import {ModalComponent} from "./shared/modal/modal.component";
import {SubjectCreateFormComponent} from "./subject/subject-create-form/subject-create-form.component";
import {DeckCreateFormComponent} from "./deck/deck-create-form/deck-create-form.component";
import {SubjectEditFormComponent} from "./subject/subject-edit-form.component";
import {SubjectDeleteFormComponent} from "./subject/subject-delete-form.component";
import {SubjectComponent} from "./subject/subject-component/subject.component";
import {DeckDetailsComponent} from "./deck/deck-details/deck-details.component";
import {DeckDeleteFormComponent} from "./deck/deck-delete-form.component";
import {EditDeleteActionsComponent} from "./shared/edit-delete-actions/edit-delete-actions.component";
import {DeckEditFormComponent} from "./deck/deck-edit-form.component";
import {CardDeleteFormComponent} from "./card/card-delete-form.component";
import {CardCreateFormComponent} from "./card/card-create-form/card-create-form.component";
import {CardEditFormComponent} from "./card/card-edit-form/card-edit-form.component";

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        CounterComponent,
        FilterInputComponent,
        PrivateSubjectsComponent,
        PublicSubjectsComponent,
        SubjectComponent,
        EditDeleteActionsComponent,
        SubjectCreateFormComponent,
        SubjectEditFormComponent,
        SubjectDeleteFormComponent,
        DeckComponent,
        DeckDetailsComponent,
        DeckCreateFormComponent,
        DeckEditFormComponent,
        DeckDeleteFormComponent,
        CardComponent,
        CardCreateFormComponent,
        CardEditFormComponent,
        CardDeleteFormComponent,
        CountPipe,
        PracticeComponent,
        PracticeSummaryComponent,
        ModalComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
        HttpClientModule,
        FormsModule,
        ApiAuthorizationModule,
        RouterModule.forRoot([
            {path: '', component: HomeComponent, pathMatch: 'full'},
            {path: 'counter', component: CounterComponent},
            {path: 'subjects/private', component: PrivateSubjectsComponent, canActivate: [AuthorizeGuard]},
            {path: 'subjects/public', component: PublicSubjectsComponent},
            {path: 'subjects/decks/:id', component: DeckDetailsComponent},
            {path: 'practice/summary/:id', component: PracticeSummaryComponent},
            {path: 'practice/:id', component: PracticeComponent},
        ]),
        ReactiveFormsModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
