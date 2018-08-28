import { Component } from '@angular/core';
import { CardService } from '../shared/card.service';

import { CardDeck } from '../shared/card.model';

@Component({
  selector: 'app-card-deck',
  templateUrl: './card-deck.page.html',
  styleUrls: ['./card-deck.page.scss']
})
export class CardDeckPage {

  private readonly ALLOWED_DECKS = ['classes', 'factions', 'qualities', 'types', 'races'];

  public cardDecks: CardDeck[] = [];

  constructor(private cardService: CardService) {
    this.getCardDecks();
  }

  private getCardDecks() {
    this.cardService.getAllCardDecks().subscribe(
      (cardDecks: CardDeck[]) => {
         this.extractAllowedDecks(cardDecks)
      })
  }

  extractAllowedDecks(cardDecks: CardDeck[]) {
    this.ALLOWED_DECKS.forEach((deckName: string) => this.cardDecks.push({name: deckName, types: cardDecks[deckName]}))
  }

  generateUrl(cardDeckGroup: string, cardDeck: string): string {
    return `/tabs/(card:card/${cardDeckGroup}/${cardDeck})`
  }

}
