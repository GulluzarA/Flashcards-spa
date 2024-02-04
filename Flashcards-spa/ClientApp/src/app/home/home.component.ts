import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    public isAuthenticated?: Observable<boolean>;
    public userName?: Observable<string | null | undefined>;
    public userId?: Observable<string | null | undefined>;

    constructor(private authorizeService: AuthorizeService) { }

    ngOnInit(): void {
        this.isAuthenticated = this.authorizeService.isAuthenticated();
        this.userName = this.authorizeService.getUser().pipe(map(u => u && u.name));
        this.userId = this.authorizeService.getUser().pipe(map(u => u && u.sub));
    }

}