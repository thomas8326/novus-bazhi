import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  private readonly endPoint: string = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  get<T>(url: string, params?: HttpParams, headers?: HttpHeaders, responseType?: any): Observable<T> {
    const options = {
      headers,
      params,
      responseType,
    };

    return this.http.get<T>(`${this.endPoint}/${url}`, options);
  }

  post<T>(url: string, body: any, params?: HttpParams) {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params,
    };
    return this.http.post<T>(`${this.endPoint}/${url}`, body, option);
  }

  put<T>(url: string, body: any, params?: HttpParams, responseType?: any): Observable<T> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params,
      responseType: responseType as 'json',
    };
    return this.http.put<T>(`${this.endPoint}/${url}`, body, options);
  }

  patch<T>(url: string, body: any, params?: HttpParams): Observable<T> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params,
    };
    return this.http.patch<T>(`${this.endPoint}/${url}`, body, options);
  }

  delete(url: string, params?: HttpParams) {
    const responseType: 'arraybuffer' | 'blob' | 'json' | 'text' = 'text';
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: params,
      responseType,
    };

    return this.http.delete(`${this.endPoint}/${url}`, option);
  }
}
