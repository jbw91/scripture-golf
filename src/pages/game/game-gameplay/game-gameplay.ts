import { Component, Output, EventEmitter } from '@angular/core';
import { AlertOptions, AlertController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Game, Scriptures, SgToast, Sql } from '../../../providers/index';
import { Scripture, Player, Book, Settings } from '../../../models/index';

const GUESSING_STATE_BOOK = 'BOOK';
const GUESSING_STATE_CHAPTER = 'CHAPTER';

@Component({
  selector: 'game-gameplay',
  templateUrl: 'game-gameplay.html'
})
export class GameGameplay {
  @Output() onFinishGame = new EventEmitter<boolean>();
  scriptures: Scripture[];
  books: Book[];
  numPlayers: number;
  numRounds: number;
  sameScriptures: string;
  currScriptureIndex: number;
  currScripture: Scripture;
  currPlayer: Player;
  currRound: number;
  guessedChapters: number[];
  chapterGuess: number;
  showVerse: boolean;
  guessingState: string;
  bookOfMormon: string;
  doctrineAndCovenants: string;
  pearlOfGreatPrice: string;
  oldTestament: string;
  newTestament: string;
  selectOptions: AlertOptions;
  settings: Settings;
  loading: Loading;

  constructor(public scriptureService: Scriptures, public gameCtrl: Game, public toastService: SgToast, public alertCtrl: AlertController, public storage: Sql, public platform: Platform, public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...',
      duration: 1000
    });
    this.loading.present();
    this.selectOptions = {
      enableBackdropDismiss: false
    };
    this.currPlayer = new Player('Player 1', 1);
    this.currScripture = {
      book: '',
      chapter: 0,
      verse: ''
    };
    this.resetRound();
    this.numPlayers = this.gameCtrl.getOptions().numPlayers;
    this.numRounds = this.gameCtrl.getOptions().numRounds;
    this.sameScriptures = this.gameCtrl.getOptions().sameScriptures;
    this.getBooks();
    this.selectScriptures().then((successful) => {
      if (successful) {
        this.loading.dismiss();
        this.startGame();
      }
    });
    this.storage.get('settings').then((data) => {
      if(data) {
        this.settings = JSON.parse(data);
      }
    });
  }

  resetRound() {
    this.guessedChapters = [];
    this.showVerse = true;
    this.guessingState = GUESSING_STATE_BOOK;
    this.bookOfMormon = null;
    this.doctrineAndCovenants = null;
    this.pearlOfGreatPrice = null;
    this.oldTestament = null;
    this.newTestament = null;
    this.chapterGuess = null;
  }

  /* GAME SETUP */

  selectScriptures(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let allScriptures: Scripture[], numScriptures: number;
      this.scriptureService.getScriptures().then((data) => {
        // Ensure scriptures are sufficiently randomized.
        allScriptures = this.shuffle(data);
        if (this.sameScriptures === 'true') {
          numScriptures = this.numRounds;
        }
        else {
          numScriptures = this.numRounds * this.numPlayers;
        }
        this.scriptures = allScriptures.slice(0, numScriptures);
        resolve(true);
      });
    });
  }

  getBooks() {
    this.scriptureService.getBooks().then((data) => {
      this.books = data;
    });
  }

  shuffle(array: Scripture[]): Scripture[] {
    // Shuffle function based on the Fisher-Yates (Knuth) Shuffle.
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  /* GAME METHODS */

  startGame() {
    this.gameCtrl.startGame();
    this.currPlayer = this.gameCtrl.getCurrentPlayer();
    this.currScriptureIndex = 0;
    this.currRound = this.gameCtrl.getCurrentRound();
    this.changeScripture();
  }

  changeScripture() {
    this.currScripture = this.scriptures[this.currScriptureIndex];
  }

  selectionChanged(select: string) {
    if (select !== 'BOM') {
      this.bookOfMormon = null;
    }
    if (select !== 'DC') {
      this.doctrineAndCovenants = null;
    }
    if (select !== 'PGP') {
      this.pearlOfGreatPrice = null;
    }
    if (select !== 'OT') {
      this.oldTestament = null;
    }
    if (select !== 'NT') {
      this.newTestament = null;
    }
  }

  checkBook() {
    if (this.bookOfMormon || this.doctrineAndCovenants || this.pearlOfGreatPrice || this.oldTestament || this.newTestament) {
      let book = this.currScripture.book;
      if (this.bookOfMormon === book || this.doctrineAndCovenants === book || this.pearlOfGreatPrice === book || this.oldTestament === book || this.newTestament === book) {
        // Answer is correct
        this.toastService.showToast('Great job!');
        this.guessingState = GUESSING_STATE_CHAPTER;
      }
      else {
        // Answer is incorrect, add point
        this.toastService.showToast('Sorry. Guess again.');
        this.currPlayer.addPoint(this.currRound);
        this.bookOfMormon = null;
        this.doctrineAndCovenants = null;
        this.pearlOfGreatPrice = null;
        this.oldTestament = null;
        this.newTestament = null;
      }
    }
    else {
      // SHOW TOAST ABOUT PICKING ANSWER
      this.toastService.showToast('Please choose a book to guess');
    }
  }

  checkChapter() {
    if (this.chapterGuess) {
      // TODO: Make this triple-equals when I can use a number input again.
      if (this.chapterGuess == this.currScripture.chapter) {
        // Answer is correct, end current player's turn
        this.toastService.showToast('Correct! Well done!');
        this.endRound();
      }
      else {
        // Answer is incorrect, record guess and add point
        if (~this.guessedChapters.indexOf(this.chapterGuess)) {
          // User already guessed this
          this.toastService.showToast('You already guessed that.');
        }
        else {
          if (this.chapterGuess - this.currScripture.chapter > 0) {
            this.toastService.showToast('Incorrect. Guess lower!');
          }
          else {
            this.toastService.showToast('Incorrect. Guess higher!');
          }
          this.guessedChapters.push(this.chapterGuess);
          this.currPlayer.addPoint(this.currRound);
        }
        this.chapterGuess = null;
      }
    }
    else {
      // SHOW TOAST ABOUT PICKING ANSWER
      this.toastService.showToast('Please guess a number');
    }
  }

  endTurnAlert() {
    if(this.numPlayers > 1) {
      let alert = this.alertCtrl.create({
        title: 'Good Job!',
        subTitle: 'Please pass the phone to the next player.',
        buttons: ['OK'],
        enableBackdropDismiss: false
      });
      alert.present();
    }
    else {
      this.toastService.showToast('Great job! You are correct!');
    }
  }

  nextPlayer() {
    // Set state to next player (and round if applicable)
    this.gameCtrl.nextPlayer();
    // Get the new current player
    this.currPlayer = this.gameCtrl.getCurrentPlayer();
    // Get the new round number if changed
    this.currRound = this.gameCtrl.getCurrentRound();
    // Reset round
    this.resetRound();
    // Get next scripture
    if (this.sameScriptures === 'true') {
      if (this.currPlayer.playerNumber === 1) {
        this.currScriptureIndex++;
      }
    }
    else {
      // If players use same scriptures, only move on to next scripture when starting new round
      this.currScriptureIndex++;
    }
    this.endTurnAlert();
    this.changeScripture();
  }

  endRound() {
    // Persist player to the game controller
    this.gameCtrl.savePlayer(this.currPlayer);
    if (this.currRound === this.numRounds && this.currPlayer === this.gameCtrl.getPlayer(this.numPlayers)) {
      // GAME IS OVER
      this.finishGame();
    }
    else {
      this.nextPlayer();
    }
  }

  toggleVerse() {
    this.showVerse = !this.showVerse;
  }

  finishGame() {
    // End game and emit event
    this.onFinishGame.emit(true);
  }
}
