import {catchError, map, retry, share, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {inject} from "@angular/core";

type StaleMarker = number | undefined

export abstract class CrudBase<T> {
    private http = inject(HttpClient);
    protected getAllSubject$ = new BehaviorSubject<ApiResponse<T[]>>({complete: false});
    protected getByIdSubject = new BehaviorSubject<ApiResponse<T>>({complete: false});
    protected staleSubject$ = new Subject<StaleMarker>()
    protected refreshSubject$: any

    protected constructor(protected resourceUrl: string) {
        this.refreshSubject$ = this.staleSubject$.pipe(
            tap((id) => {
                // Only fetch if getAllSubject$ is observed
                if (this.getAllSubject$.observed) {
                    this.fetchAll().pipe(
                        tap((res) => {
                            this.getAllSubject$.next(res)
                        })
                    ).subscribe()
                }
                // Only fetch if getByIdSubject is observed and id is marked as stale
                if (id) {
                    this.fetchById(id).pipe(
                        tap((res) => {
                            this.getByIdSubject.next(res)
                        })
                    ).subscribe()
                }
            })
        )
        this.refreshSubject$.subscribe()
    }

    protected makeRequest<S>(resource: string, method: 'get' | "put" | "post" | "delete", entity?: S, parameters?: Record<string, string>): Observable<ApiResponse<S>> {
        // Parameters are not currently in use.
        // A future version might specify public / private subjects by parameter
        if (parameters) {
            resource += "?";
            // Add parameters to url
            for (let key in parameters) {
                resource += key + "=" + parameters[key] + "&";
            }
            // Remove last "&"
            resource = resource.slice(0, -1);
        }

        let apiData: Observable<S>;
        switch (method) {
            case "get":
                apiData = this.http.get<S>(resource).pipe(
                    // Get requests are safe to retry so we define a retry policy
                    retry({count: 2, delay: 1000}),
                )
                break;
            case "put":
                apiData = this.http.put<S>(resource, entity).pipe(
                    tap(() => this.markStale())
                );
                break;
            case "post":
                apiData = this.http.post<S>(resource, entity).pipe(
                    tap(() => this.markStale())
                );
                break;
            case "delete":
                apiData = this.http.delete<S>(resource).pipe(
                    tap(() => this.markStale())
                );
                break;
        }

        return apiData.pipe(
            // The response is mapped to a new object with the complete status and the data
            map((res) => ({complete: true, data: res})),
            // We catch any error and return a new observable with the error
            catchError((e) => {
                console.error(
                    `Error occurred while trying to ${method} ${resource}.\n` +
                    `Error: ${e.message}`
                );
                return of({complete: true, error: {status: e.status, message: e.statusText}});
            }),
            // Share across subscribers to prevent multiple requests
            share()
        );
    }

    markStale(id?: number) {
        this.staleSubject$.next(id);
    }

    getAllUrl() {
        return this.resourceUrl
    }

    fetchAll() {
        let endpoint = this.getAllUrl()
        return this.makeRequest<T[]>(endpoint, "get")
    }


    getAll(url?: string) {
        if (!this.getAllSubject$.observed) {
            this.fetchAll().pipe(
                tap((res) => {
                    this.getAllSubject$.next(res)
                })
            ).subscribe()
        }
        return this.getAllSubject$.asObservable()
    }

    fetchById(id: number) {
        let endpoint = this.resourceUrl + "/" + id;
        return this.makeRequest<T>(endpoint, "get");
    }

    getById(id: number) {
        this.markStale(id)
        return this.getByIdSubject.asObservable()
    }

    create(entity: T) {
        return this.makeRequest<T>(this.resourceUrl, "post", entity);
    }

    update(id: number, entity: T) {
        let endpoint = this.resourceUrl + "/" + id;
        return this.makeRequest<T>(endpoint, "put", entity);
    }

    delete(id: number) {
        let endpoint = this.resourceUrl + "/" + id;
        return this.makeRequest<unknown>(endpoint, "delete");
    }
}
