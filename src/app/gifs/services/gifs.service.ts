import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string='OOkDzn06QuBBoTdnpndeotR9wvGHCUiO';
  private serviceUrl: string='https://api.giphy.com/v1/gifs';
  private _historial: string[]=[];

  public resultados: Gif[]=[];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {

    this._historial=JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados=JSON.parse(localStorage.getItem('gifs')!) || [];
  }

  buscarGifs(query: string) {
    if(!this._historial.includes(query.trim().toLowerCase())) {
      this._historial.unshift(query.trim().toLowerCase());
      this._historial=this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params=new HttpParams()
                .set('api_key', this.apiKey)
                .set('limit', '10')
                .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.serviceUrl}/search`, {params})
    .subscribe( resp => {
      this.resultados=resp.data;
      localStorage.setItem('gifs', JSON.stringify(this.resultados));
    });
  }
}
