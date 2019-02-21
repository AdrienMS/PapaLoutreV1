import { Component, OnInit, OnChanges } from '@angular/core';
import { Directive, Input, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';
import { DomController, PopoverController, NavController, Events } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Chapter } from '../../../models/chapter';
import { Information } from '../../../models/informations';
import { characterSheet, FirebaseDatasCharacters, SearchData, FieldCharacter } from '../../../models/character';
import { Place, PlacePosition, PlaceSection, PlaceInformation } from '../../../models/place';

import { CharactersService } from '../../../services/characters.service';
import { PlacesService } from '../../../services/places.service';
import { ChapterService } from '../../../services/chapter.service';

import { InformationPopoverComponent } from '../information-popover/information-popover.component';
import { FavoritesComponent } from '../favorites/favorites.component';
import { FavoritesListComponent } from '../favorites-list/favorites-list.component';

import { ChapterPage } from '../../../pages/chapter/chapter.page';

@Component({
  selector: 'app-informations-chapter',
  templateUrl: './informations-chapter.component.html',
  styleUrls: ['./informations-chapter.component.scss']
})
export class InformationsChapterComponent implements OnInit, OnChanges {
  @Input("chapter") chapter: Chapter;
  @Input("parent") parent: ChapterPage;
  @Input("isMobile") isMobile: boolean;
  @Input("isOpen") isOpen: boolean;
  private story_id: string;

  private favorites: {name: string, id: string, informations: Information[]}[] = [];

  //informations variables
  private isEdit: boolean[] = [];

  //characters variables
  private characters: FirebaseDatasCharacters[] = [];
  private imgCharacters: string[][] = [];

  //places variables
  private places: Place[] = [];
  private imgPlaces: string[][] = [];

  //date variables
  private dateIsShow: boolean = false;
  private SEShow: boolean[] = [false, false];

  private group: {index: number, isShow: boolean}[];
  
  constructor(
    private charactersService: CharactersService,
    private placesService: PlacesService,
    private chapterService: ChapterService,
    private route: ActivatedRoute,
    private events: Events,
    private popoverController: PopoverController) {
      /*events.subscribe('currentUser', value => {
        this.initialise();
      });*/
    }

  ngOnInit() {
    this.initialise();
  }

  ngOnChanges() {
    this.initialise();
  }

  private initialise() {
    this.story_id = this.route.snapshot.paramMap.get('story_id');
    this.charactersService.getCharactersFromStory(this.story_id).subscribe(res => {
      this.characters = res;
    });
    this.placesService.getPlacesFromStory(this.story_id).subscribe(res => {
      this.places = res;
    });
    this.getFavorites();
    this.initInfos();
  }

  private initInfos() {
    this.group = [];
    this.isEdit = [];
    if (this.chapter.informations != null) {
      this.chapter.informations.forEach((info,index) => {
        this.group.push({index: index, isShow: false});
        this.imgCharacters.push([]);
        this.onSelectCharacterChange(index);
        this.imgPlaces.push([]);
        this.onSelectPlaceChange(index);
        this.isEdit.push(false);
      });
    }
  }

  private getFavorites() {
    this.chapterService.getFavorites().subscribe(res => {
      this.favorites = res;
    },
    err => {
      console.log(err);
    });
  }

  private clickToggle(index: number) {
    if (this.group[index].isShow) {
      this.group[index].isShow = false;
    } else {
      this.group[index].isShow = true;
    }
  }

  //characters functions
  private getCharacterFromId(id: string): FirebaseDatasCharacters {
    for (let i = 0; i < this.characters.length; i += 1) {
      if (this.characters[i].id == id) {
        return this.characters[i];
        break;
      }
    }
    return null;
  }

  private onSelectCharacterChange(index: number) {
    if (this.chapter.informations[index].value != null && this.chapter.informations[index].value != []) {
      this.imgCharacters[index] = [];
      if (this.chapter.informations[index].type == 'characters') {
        this.chapter.informations[index].value.forEach(val => {
          let char = this.getCharacterFromId(val);
          this.imgCharacters[index].push(null);
          let i_to_push = this.imgCharacters[index].length - 1;
          this.charactersService.getImage(char.character[0].items[2].value).subscribe(res => {
            this.imgCharacters[index][i_to_push] = res;
          },
          err => {
            this.imgCharacters[index][i_to_push] = null;
          });
        });
      }
    }
  }

  //places functions
  private getPlaceFromId(id: string): Place {
    for (let i = 0; i < this.places.length; i += 1) {
      if (this.places[i].id == id) {
        return this.places[i];
        break;
      }
    }
    return null;
  }

  private onSelectPlaceChange(index: number) {
    if (this.chapter.informations[index].value != null && this.chapter.informations[index].value != []) {
      this.imgPlaces[index] = [];
      if (this.chapter.informations[index].type == 'places') {
        this.chapter.informations[index].value.forEach(val => {
          let pl = this.getPlaceFromId(val);
          this.imgPlaces[index].push(null);
          let i_to_push = this.imgPlaces[index].length - 1;
          this.placesService.getImage(pl.sections[0].informations[1].value).subscribe(res => {
            this.imgPlaces[index][i_to_push] = res;
          });
        });
      }
    }

  }

  //date functions
  private clickToggleDate(level: number) {
    if (level == 0) {
      if (this.dateIsShow) {
        this.dateIsShow = false;
      } else {
        this.dateIsShow = true;
      }
    } else {
      if (this.SEShow[level - 1]) {
        this.SEShow[level - 1] = false;
      } else {
        this.SEShow[level - 1] = true;
      }
    }
  }

  //informations functions
  private addNewInformation() {
    let info = new Information({
      label: "Information",
      type: "text",
      value: null,
      size: 0,
      canModify: true,
      searchValues: null
    });
    if (this.chapter.informations == null) {
      this.chapter.informations = [];
    }
    this.chapter.informations.push(info);
    this.group.push({index: this.chapter.informations.length - 1, isShow: true});
    this.isEdit.push(true);
  }

  public editInfo(index: number) {
    this.isEdit[index] = true;
    this.group[index].isShow = true;
  }

  private validEdit(index: number) {
    this.isEdit[index] = false;
  }

  private onChangeType(index: number) {
    this.chapter.informations[index].value = null;
  }
  
  public deleteInfo(index: number) {
    this.chapter.informations.splice(index, 1);
  }

  private editData() {
    this.parent.editData();
  }

  public saveToFavorites(chapter: Chapter) {
    let infoToSave: Information[] = [];
    if (chapter.informations != null && chapter.informations.length > 0) {
      chapter.informations.forEach(info => {
        let n_info = new Information({label: info.label, type: info.type, value: null, size: info.size, canModify: info.canModify, searchValues: info.searchValues, id: null});
        infoToSave.push(n_info);
      });
      this.chapterService.saveAsFavorite(infoToSave).subscribe(res => {
        console.log(res);
      },
      err => {
        console.log(err);
      });
    } else {
      console.log("les infos sont vides");
    }
  }

  private deleteFavorite(id: string) {
    this.chapterService.deleteFavorite(id).subscribe(res => {
      console.log(res);
    },
    err => {
      console.log(err);
    });
  }

  public fillInformationsWithFav(infos: Information[]) {
    this.chapter.informations = [];
    infos.forEach(info => {
      this.chapter.informations.push(new Information(info));
    });
    this.initInfos();
  }

  /*public addToFavorites(chapter: Chapter) {
    console.log(chapter);
    this.chapterService.saveAsFavorite(chapter.informations).subscribe(res => {
      console.log(res);
    },
    err => {
      console.log(err);
    });
  }*/

  public async showFavorites(chapter: Chapter) {
    const popover = await this.popoverController.create({
      component: FavoritesListComponent,
      componentProps: {fav: this.favorites, parent: this},
      event: null,
      translucent: true
    });
    return await popover.present();
  }

  async presentPopover(ev: any, index) {
    const popover = await this.popoverController.create({
      component: InformationPopoverComponent,
      componentProps: {index: index, parent: this},
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async presentPopoverFav(ev: any, chapter) {
    const popover = await this.popoverController.create({
      component: FavoritesComponent,
      componentProps: {chapter: chapter, parent: this},
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

}
