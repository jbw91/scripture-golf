import { Component, Output, EventEmitter } from '@angular/core';
import { Game } from '../../../providers/index';
import { Player } from '../../../models/index';

@Component({
  selector: 'game-options',
  templateUrl: 'game-options.html'
})
export class GameOptions {
  @Output() onStartGame = new EventEmitter<boolean>();
  numPlayers: number;
  numRounds: number;
  sameScriptures: string;

  constructor(public gameCtrl: Game) {
    this.numPlayers = 1;
    this.numRounds = 1;
    this.sameScriptures = 'true';
  }

  startGame() {
    this.gameCtrl.configure({
      numPlayers: this.numPlayers,
      numRounds: this.numRounds,
      sameScriptures: (this.sameScriptures === 'true') ? 'true' : 'false'
    });
    let players = [];
    for(let i = 1; i <= this.numPlayers; i++) {
      let name = 'Player ' + i;
      if(i === 1) {
        // TODO:
        // if(this.auth.isAuthenticated()) {
        //   // TODO: GET USER NAME
        //   // name = this.user.social.facebook.data.full_name;
        // }
      }
      let p = new Player(name, i);
      players.push(p);
    }
    this.gameCtrl.initPlayers(players);
    this.onStartGame.emit(true);
  }
}
