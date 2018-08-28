import { Injectable } from '@angular/core';
import { of as ObservableOf, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CardDeck, Card } from './card.model';

@Injectable()
export class CardService {

  private readonly HS_API_URL = 'https://omgvamp-hearthstone-v1.p.mashape.com';
  private readonly API_KEY = '6c4ZAxHSdqmshyBbZbBsUmsSZiljp1MGz8BjsnzS8CIPmsUKmJ';

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'X-Mashape-Key': this.API_KEY});
  }

  public replaceCardTextLine(text: string) {
    return text ? text.replace(new RegExp("\\\\n", "g"), ", ") : 'No Description';
  }


  public getAllCardDecks(): Observable<CardDeck[]> {
    return this.http.get<CardDeck[]>(`${this.HS_API_URL}/info`, {headers: this.headers});
  }

  public getCardsByDeck(cardDeckGroup: string, cardDeck: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.HS_API_URL}/cards/${cardDeckGroup}/${cardDeck}`, {headers: this.headers});
  }

  public getCardById(cardId: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.HS_API_URL}/cards/${cardId}`, {headers: this.headers});
  }

}
