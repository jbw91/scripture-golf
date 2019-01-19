import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Sql } from '../sql/sql';
import { Scripture, Book, Settings } from '../../models/index';

@Injectable()
export class Scriptures {

  public scriptures: Scripture[];
  public books: Book[];

  constructor(public http: Http, public storage: Sql) {
    this.scriptures = [];
    this.books = [];
  }

  public initializeScriptures(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // If settings don't exist, initialize them as they are needed for games.
      this.storage.get('settings').then((data) => {
        if(!data) {
          let settings: Settings = {
            bookOfMormon: true,
            doctrineAndCovenants: true,
            pearlOfGreatPrice: true,
            oldTestament: true,
            newTestament: true
          };
          this.storage.set('settings', JSON.stringify(settings));
        }
      });
      this.storage.query(`CREATE TABLE IF NOT EXISTS books(
        key TEXT NOT NULL,
        title TEXT NOT NULL
      )`).then((results) => {
        this.storage.query('SELECT count(*) num FROM scriptures').then((response) => {
          if(response.res.rows.item(0).num > 0) {
            resolve(true);
          }
          else {
            let sql: string[];
            this.http.get('assets/db/books.sql').subscribe((data) => {
              sql = data.text().split('\n');
              for(let statement of sql) {
                if(statement !== '') {
                  this.storage.query(statement);
                }
              }
              resolve(true);
            });
          }
        });
      });

      this.storage.query(`CREATE TABLE IF NOT EXISTS scriptures(
        volume TEXT NOT NULL,
        book TEXT NOT NULL,
        chapter INTEGER NOT NULL,
        verse TEXT NOT NULL
      )`).then((results) => {
        this.storage.query('SELECT count(*) num FROM scriptures').then((response) => {
          if(response.res.rows.item(0).num > 0) {
            resolve(true);
          }
          else {
            let sql: string[];
            this.http.get('assets/db/scriptures.sql').subscribe((data) => {
              sql = data.text().split('\n');
              for(let statement of sql) {
                if(statement !== '') {
                  this.storage.query(statement);
                }
              }
              resolve(true);
            });
          }
        });
      });
    });
  }

  public getScripturesByVolume(volume): Promise<Scripture[]> {
    return new Promise((resolve, reject) => {
      this.storage.query(`SELECT * FROM scriptures WHERE volume='${volume}'`).then((response) => {
        let scriptureList = [];
        for(let i = 0; i < response.res.rows.length; i++) {
          scriptureList.push({
            book: response.res.rows.item(i).book,
            chapter: response.res.rows.item(i).chapter,
            verse: response.res.rows.item(i).verse
          });
        }
        resolve(scriptureList);
      }).catch((err) => {
        reject();
      });
    });
  }

  public getScriptures(): Promise<Scripture[]> {
    return new Promise((resolve, reject) => {
      this.storage.get('settings').then((data: string) => {
        let settings: Settings = JSON.parse(data);
        let promises = [
          this.getScripturesByVolume('BOM'),
          this.getScripturesByVolume('DC'),
          this.getScripturesByVolume('NT'),
          this.getScripturesByVolume('OT'),
          this.getScripturesByVolume('PGP')
        ];

        Promise.all(promises).then((values) => {
          // Add scriptures if they are going to be used
          if(settings.bookOfMormon) {
            this.scriptures = this.scriptures.concat(values[0]);
          }
          if(settings.doctrineAndCovenants) {
            this.scriptures = this.scriptures.concat(values[1]);
          }
          if(settings.newTestament) {
            this.scriptures = this.scriptures.concat(values[2]);
          }
          if(settings.oldTestament) {
            this.scriptures = this.scriptures.concat(values[3]);
          }
          if(settings.pearlOfGreatPrice) {
            this.scriptures = this.scriptures.concat(values[4]);
          }
          resolve(this.scriptures);
        }).catch((err) => {
          console.log(err);
          reject();
        });
      });
    });
  }

  public getBooks(): Promise<Book[]> {
    return new Promise((resolve, reject) => {
      if(this.books.length > 0) {
        resolve(this.books);
      }
      else {
        this.storage.query('SELECT * FROM books').then((response) => {
          for(let i = 0; i < response.res.rows.length; i++) {
            this.books.push({
              key: response.res.rows.item(i).key,
              title: response.res.rows.item(i).title
            });
          }
          resolve(this.books);
        }).catch(() => {
          reject();
        });
      }
    });
  }

  // When there are updates, have methods that are called with the new scripture sets.
}

