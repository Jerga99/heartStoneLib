import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../shared/service/loader.service';
import { ToastService } from '../../shared/service/toast.service';
import { CardService } from '../shared/card.service';
import { Storage } from '@ionic/storage';
import { FavoriteCardStore } from '../shared/card-favorite.store';
import { Subscription } from 'rxjs';

import { Card } from '../shared/card.model';

@Component({
  selector: 'app-card-listing',
  templateUrl: './card-listing.page.html',
  styleUrls: ['./card-listing.page.scss'],
})
export class CardListingPage {

  cardDeckGroup: string;
  cardDeck: string;
  cards: Card[] = [];
  copyOfCards: Card[] = [];

  favoriteCards: any = {};

  isLoading: boolean = false;

  favoriteCardSub: Subscription;

  constructor(private route: ActivatedRoute,
              private cardService: CardService,
              private loaderService: LoaderService,
              private toaster: ToastService,
              private storage: Storage,
              private favoriteCardStore: FavoriteCardStore) {

    this.favoriteCardSub = this.favoriteCardStore.favoriteCards.subscribe(
      (favoriteCards: any) => {
        this.favoriteCards = favoriteCards;
      })
  }

  ionViewDidLeave() {
    if (this.favoriteCardSub && !this.favoriteCardSub.closed) {
      this.favoriteCardSub.unsubscribe();
    }
  }

  private getCards() {
    this.loaderService.presentLoading();

    this.cardService.getCardsByDeck(this.cardDeckGroup, this.cardDeck).subscribe(
      (cards: Card[]) => {
        this.cards = cards.map((card: Card) => {
          card.text = this.cardService.replaceCardTextLine(card.text);
          card.favorite = this.isCardFavorite(card.cardId);
          return card;
        });

        this.copyOfCards = Array.from(this.cards);
        this.loaderService.dismissLoading();
      }, () => {
        this.loaderService.dismissLoading();
        this.toaster.presentErrorToast("Uuuppp card could not be loaded, lets let's try to refresh page");
    })
  }

  private isCardFavorite(cardId: string): boolean {
    const card = this.favoriteCards[cardId];

    return card ? true : false;
  }

  ionViewWillEnter() {
    this.cardDeckGroup = this.route.snapshot.paramMap.get('cardDeckGroup');
    this.cardDeck = this.route.snapshot.paramMap.get('cardDeck');

    if (this.cards && this.cards.length === 0) this.getCards();
  }

  doRefresh(event) {
    this.getCards();
    event.target.complete();
  }

  hydrateCards(cards: Card[]) {
    this.cards = cards;
    this.isLoading = false;
  }

  handleSearch() {
    this.isLoading = true;
  }

  favoriteCard(card: Card) {
    this.favoriteCardStore.toggleCard(card);
  }



}
