import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
},
)
export class MigrateService {

  constructor(private readonly http: HttpClient) { }

  public execute(migrate: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/migration/execute`, migrate);
  }

  public executeAsync(migrate: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/migration/executeAsync`, migrate);
  }

  public generate(migrate: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/migration/generate`, migrate);
  }

  public validate(migrate: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/migration/validate`, migrate);
  }

}
