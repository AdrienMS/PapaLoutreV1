import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, ToastController, LoadingController, NavController } from '@ionic/angular';

import { FilePickerDirective, ReadFile, ReadMode } from 'ngx-file-helpers';

import { AuthService } from '../../services/auth.service';
import { ChapterService } from '../../services/chapter.service';
import { CharactersService } from '../../services/characters.service';
import { LinksService } from '../../services/links.service';
import { PlacesService } from '../../services/places.service';
import { StoriesService } from './../../services/stories.service';
import { TimelineService } from '../../services/timeline.service';

import { EIStory } from '../../models/eistory';
import { Story } from '../../models/story';
import { PlaceLink } from '../../models/placeLink';
import { FirebaseDatasCharacters } from '../../models/character';
import { Place } from './../../models/place';
import { Chapter } from './../../models/chapter';
import { User } from './../../models/user';
import { TimelineEvent, TimelinePeriod } from './../../models/timeline';
import { Link } from './../../models/link';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  files: any;
  keys: Array<string> = [];
  backgroundImages: {} = {};
  fileUrl;
  private storyToDownload: string = null;
  private nameStoryToDownload: string = "";

  @ViewChild('filePicker')
  private filePicker: FilePickerDirective;

  public picked: ReadFile;

  createHistoryForm: FormGroup;
  createHistoryError: string;

  private colSize: number = 2;

  validation_messages = {
    'title': [
      { type: 'required', message: 'Il manque un titre' }
    ]
  }

  private listImage: any[] = [];
  displayedImages: {} = {};
  private selectedImg: string = null;

  isModification: boolean = false;
  private historyModificationId: string = null;

  deleteStory = null;

  private fileInput;
  private button;
  private the_return;

  constructor(
		private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public fb: FormBuilder,
    private loadingController: LoadingController,
    private sanitizer: DomSanitizer,
    private auth: AuthService,
    private chapterService: ChapterService,
    private charactersService: CharactersService,
    private linksService: LinksService,
    private placesService: PlacesService,
    private storiesService: StoriesService,
    private timelineService: TimelineService,
    ) {
      this.createHistoryForm = fb.group({
        title: new FormControl('', Validators.compose([Validators.required])),
        description: new FormControl('', null),
        image: new FormControl('', null)
      });
    }

  ngOnInit() {
    this.initialise();
  }

  private initialise() {
    this.storiesService.getStories().subscribe(
      res => {
        console.log(res);
        if (res != undefined && res != null) {
          this.files = res;
          this.keys = Object.keys(this.files);
          this.displayImage();
        } else {
          this.files = null;
        }
        this.defineHeightStories();
      }
    );
    this.fileInput = document.querySelector( ".input-file" ),  
    this.button = document.querySelector( ".input-file-trigger" ),
    this.the_return = document.querySelector(".file-return");
  }

  addImage(event) {
    let fileList: FileList = event.target.files;
    if (!this.storiesService.checkIfThisNameIsPresent(fileList[0].name)) {
      console.log(fileList[0]);
      this.createHistoryForm.value.image = fileList[0];
      this.the_return.innerHTML = fileList[0].name;
    } else {
      //display error
      console.log("image already existing");
    }
    //this.storiesService.createStories(fileList[0]);
  }

  async createHistory() {
    await this.presentLoading();
    let data = this.createHistoryForm.value;
    
    if (!data.title) {
			return;
    }
    
    let credentials = {
			title: data.title,
			description: data.description,
      image: data.image,
      imgName: this.selectedImg
    };
    console.log(credentials);
    
    this.storiesService.createStories(credentials, this.historyModificationId).then(
      res => {
        if (res != null) {
          if (this.isModification) {
            this.toastMessage("Votre histoire à été modifié");
            this.initialise();
          } else {
            this.toastMessage("Votre histoire à été créé");
            this.initialise();
          }
          this.cancel();
        } else {
          this.toastMessage("Un problème est survenu lors de la création");
        }
        this.destroyLoading();
      },
      err => {
        this.destroyLoading();
      }
    );
  }

  async toastMessage(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }
  
  async presentLoading() {
    const loading = await this.loadingController.create({
      translucent: true,
      spinner: "crescent"
    });
    return await loading.present();
  }

  async destroyLoading() {
    this.loadingController.dismiss();
  }

  displayImage() {
    for(let i = 0; i < this.keys.length; i += 1) {
      if (this.files[this.keys[i]].img != null) {
        this.storiesService.getUrlImage(this.files[this.keys[i]].img).subscribe(
          res => {
            this.backgroundImages[this.keys[i]] = res;
          },
          err => {
            console.log(err);
          }
        );
      } else {
        this.backgroundImages[this.keys[i]] = null;
      }
    }
  }

  displayCreateHistory() {
    this.historyModificationId = null;
    this.isModification = false;
    this.createHistoryForm.value.title = null;
    this.createHistoryForm.value.description = null;
    this.createHistoryForm.value.image = null;
    this.createHistoryForm.value.is_private = null;
    this.the_return.innerHTML = null;
    let block = document.getElementById("create_new_story");
    block.classList.add("show");
  }

  cancel() {
    let block = document.getElementById("create_new_story");
    block.classList.remove("show");
  }

  onCLickLabel() {
    this.fileInput.focus();
  }

  displayImageList() {
    this.listImage = this.storiesService.getImagesList();
    this.displayedImages = {};
    console.log(this.listImage);
    for(let i = 0; i < this.listImage.length; i += 1) {
      if (this.listImage[i].name != null) {
        this.storiesService.getUrlImage(this.listImage[i].name).subscribe(
          res => {
            console.log(res);
            this.displayedImages[this.listImage[i].name] = res;
          },
          err => {
            console.log(err);
          }
        );
      }
    }
    let imageListBlock = document.getElementById("image_list");

    imageListBlock.classList.add("show");
  }

  selectImage(name: string) {
    if (this.selectedImg != null) {
      let previousSelected = document.getElementById("container_img_" + this.selectedImg);
      previousSelected.classList.remove("selected");
    }
    let imgBlock = document.getElementById("container_img_" + name);
    imgBlock.classList.add("selected");
    this.selectedImg = name;
  }

  cancelSelectImage() {
    let imageListBlock = document.getElementById("image_list");
    imageListBlock.classList.remove("show");
    this.selectedImg = null;
  }

  confirmSelectImage() {
    this.the_return.innerHTML = this.selectedImg;
    let imageListBlock = document.getElementById("image_list");
    imageListBlock.classList.remove("show");
  }

  clickModify(file) {
    this.displayCreateHistory();
    this.isModification = true;
    this.createHistoryForm.value.title = file.title;
    this.createHistoryForm.value.description = file.description;
    this.createHistoryForm.value.image = file.img;
    this.createHistoryForm.value.is_private = file.is_private;
    this.the_return.innerHTML = file.img;
    this.historyModificationId = file.id;

    console.log(file);
    //this.createHistoryForm.value()
  }

  clickDelete(file) {
    let deleteBlock = document.getElementById("delete_container");
    deleteBlock.classList.add("show");
    this.deleteStory = file;
  }

  async clickConfirmDelete() {
    await this.presentLoading();
    console.log(this.deleteStory);
    this.storiesService.deleteStory(this.deleteStory.id).subscribe(() => {
      this.toastMessage("Votre histoire à été supprimé");
      this.cancelDelete();
      this.destroyLoading();
      this.initialise();
    });
  }

  cancelDelete() {
    let deleteBlock = document.getElementById("delete_container");
    deleteBlock.classList.remove("show");
    this.deleteStory = null;
  }

  checkTitle() {
    console.log("change");
  }

  goToStory(key) {
    console.log(key);
    this.navCtrl.navigateForward("/history-dashboard/" + key);
  }

  @HostListener('window:resize', ['$event'])
  private defineHeightStories() {
    if (window.innerWidth <= 375) {
      this.colSize = 6;
    } else if (window.innerWidth <= 800) {
      this.colSize = 4;
    } else if (window.innerWidth <= 1200) {
      this.colSize = 3;
    } else {
      this.colSize = 2;
    }
    return {
      height: "calc(calc(" + this.colSize + " / var(--ion-grid-columns, 12)) * 100vw)"
    }
  }

  onScroll(event) {
    let block = document.getElementById("header");
    if (event.detail.currentY > 0) {
      block.classList.add("show");
    } else {
      block.classList.remove("show");
    }
  }

  private displayResetPassword() {
    let block = document.getElementById("change_password");
    block.classList.add("show");
  }

  private hideResetPassword() {
    let block = document.getElementById("change_password");
    block.classList.remove("show");
  }

  private confirmResetPassword() {
    this.auth.getCurrentUserInformations().subscribe(user => {
      if (user != null) {
        this.auth.resetPassword(user.email).subscribe(res => {
          if (res) {
            this.hideResetPassword();
            this.navCtrl.navigateForward("/logout");
          } else {
            console.log("error");
          }
        });
      }
    });
  }

  private displayStoryToExport() {
    let block = document.getElementById("download_story");
    block.classList.add("show");
  }

  private hideStoryToExport() {
    let block = document.getElementById("download_story");
    block.classList.remove("show");
    this.storyToDownload = null;
    this.fileUrl = null;
  }

  private async selectStoryToExport(id: string) {
    await this.presentLoading();
    let eistory: EIStory = new EIStory(null, null, null, null, null, null, null, null, null);

    this.auth.getCurrentUserInformations().subscribe(res => {
      let user: User = res;
      eistory.user = user.username;
      this.storiesService.getStoryInfoFromKey(id).subscribe(res => {
        let story: Story = new Story(res.id, res.story_id, res.description, res.img, res.is_private, res.title, res.user_id);
        eistory.story = story;
        this.chapterService.getByStoryId(story.id).subscribe(res => {
          let chapters: Chapter[] = res
          eistory.chapters = chapters;
          this.placesService.getPlacesFromStory(story.id).subscribe(res => {
            let places: Place[] = res;
            eistory.places = places;
            this.placesService.getLinksFromStory(story.id).subscribe(res => {
              let placeLink: PlaceLink[] = res;
              eistory.linksPlaces = placeLink;
              this.charactersService.getCharactersFromStory(story.id).subscribe(res => {
                let characters: FirebaseDatasCharacters[] = [];
                res.forEach(element => {
                  characters.push(new FirebaseDatasCharacters(element.id, element.story_id, element.character, element.top, element.left));
                });
                eistory.characters = characters;
                this.linksService.getLinksFromStory(story.id).subscribe(res => {
                  let characterLinks: Link[] = [];
                  res.forEach(element => {
                    characterLinks.push(new Link(element.id, element.informations, element.firstCharacter, element.secondCharacter, element.story_id));
                  });
                  eistory.linksCharacter = characterLinks;
                  this.timelineService.getEventsFromStory(story.id).subscribe(res => {
                    let timelineEvent: TimelineEvent[] = [];
                    res.forEach(elem => {
                      timelineEvent.push(new TimelineEvent(
                        elem.id,
                        elem.story_id,
                        elem.name,
                        elem.description,
                        elem.type,
                        {format: elem.start.format, year: elem.start.year, month: elem.start.month, day: elem.start.day}
                      ));
                    });
                    eistory.timelineEvent = timelineEvent;
                    this.timelineService.getPeriodsFromStory(story.id).subscribe(res => {
                      let timelinePeriod: TimelinePeriod[] = [];
                      res.forEach(elem => {
                        timelinePeriod.push(new TimelinePeriod(
                          elem.id,
                          elem.story_id,
                          elem.name,
                          elem.description,
                          elem.type,
                          {format: elem.start.format, year: elem.start.year, month: elem.start.month, day: elem.start.day},
                          {format: elem.end.format, year: elem.end.year, month: elem.end.month, day: elem.end.day}
                        ));
                      });
                      eistory.timelinePeriod = timelinePeriod;

                      this.storyToDownload = id;
                      const data = JSON.stringify(eistory.getDatasToJson());
                      const blob = new Blob([data], { type: 'application/json' });

                      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
                      this.nameStoryToDownload = story.title + ".json";
                      this.destroyLoading();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  private importStory(event) {
    let parent: ProfilPage = this;
    var reader = new FileReader();
    reader.onload = function(e) {
      let datas = JSON.parse(reader.result.toString());
      let eistory: EIStory = parent.getJsonToEIStory(datas);
      parent.addImportedStoryToFirebase(eistory, parent);
    };
    reader.readAsText(event.target.files[0]);
  }

  private onReaderLoad(event){
    var obj = JSON.parse(event.target.result);
    //this.addImportedStoryToFirebase(obj);
  }

  private getJsonToEIStory(obj): EIStory {
    let chapters: Chapter[] = [];
    if (obj.chapters != null && obj.chapters != undefined) {
      obj.chapters.forEach(chap => {
        chapters.push(new Chapter(
          chap.id,
          chap.story_id,
          chap.name,
          chap.description,
          chap.type,
          {format: chap.start.format, year: chap.start.year, month: chap.start.month, day: chap.start.day},
          {format: chap.end.format, year: chap.end.year, month: chap.end.month, day: chap.end.day},
          chap.informations,
          chap.children,
          chap.order,
          chap.level,
          chap.progression,
          chap.write,
          chap.i_parents
        ));
      });
    }

    let characters: FirebaseDatasCharacters[] = [];
    if (obj.characters != null && obj.characters != undefined) {
      obj.characters.forEach(char => {
        characters.push(new FirebaseDatasCharacters(char.id, char.story_id, char.character, char.top, char.left));
      });
    }

    let linksCharacter: Link[] = [];
    if (obj.linksCharacter != null && obj.linksCharacter != undefined) {
      obj.linksCharacter.forEach(link => {
        linksCharacter.push(new Link(link.id, link.informations, link.firstCharacter, link.secondCharacter, link.story_id));
      });
    }
  
    let linksPlaces: PlaceLink[] = [];
    if (obj.linksPlaces != null && obj.linksPlaces != undefined) {
      obj.linksPlaces.forEach(lp => {
        linksPlaces.push(new PlaceLink(lp.id, lp.story_id, lp.places_id, lp.informations));
      });
    }

    let places: Place[] = [];
    if (obj.places != null && obj.places != undefined) {
      obj.places.forEach(place => {
        places.push(new Place(place.id, place.story_id, place.position, place.sections));
      });
    }

    let story: Story = new Story(obj.story.id, obj.story.story_id, obj.story.description, obj.story.img, obj.story.is_private, obj.story.title, obj.story.user_id);

    let timelineEvent: TimelineEvent[] = [];
    if (obj.timelineEvent != null && obj.timelineEvent != undefined) {
      obj.timelineEvent.forEach(te => {
        timelineEvent.push(new TimelineEvent(te.id, te.story_id, te.name, te.description, te.type, te.start));
      });
    }

    let timelinePeriod: TimelinePeriod[] = [];
    if (obj.timelinePeriod != null && obj.timelinePeriod != undefined) {
      obj.timelinePeriod.forEach(te => {
        timelinePeriod.push(new TimelinePeriod(te.id, te.story_id, te.name, te.description, te.type, te.start, te.end));
      });
    }

    let user = obj.user;

    let eistory: EIStory = new EIStory(user, chapters, characters, linksCharacter, places, linksPlaces, story, timelineEvent, timelinePeriod);
    return eistory;
  }

  private addImportedStoryToFirebase(eistory: EIStory, parent: ProfilPage) {
    console.log(1);
    parent.storiesService.getStories().subscribe(res => {
      console.log(2);
      let firebaseId = null;
      if (res != null) {
        Object.keys(res).forEach(element => {
          if (res[element].id == eistory.story.id) {
            firebaseId = eistory.story.id;
          }
        });
        console.log(3);
      }
      if (firebaseId != null) {
        console.log("chapter");
        //parent.chapterService.save(eistory.chapters).subscribe();

        console.log("characters");
        eistory.characters.forEach(char => {
          parent.charactersService.createCharacter(char.character, char.story_id, char.top, char.left, char.id).subscribe();
        });

        console.log("linksCharacter");
        eistory.linksCharacter.forEach(lc => {
          parent.linksService.createLink({firstCharacter: lc.firstCharacter, secondCharacter: lc.secondCharacter}, lc.informations, lc.story_id, lc.id).subscribe();
        });

        console.log("place");
        eistory.places.forEach(place => {
          parent.placesService.savePlace(place, place.story_id, place.id).subscribe();
        });

        console.log("linksPlaces");
        eistory.linksPlaces.forEach(lp => {
          parent.placesService.saveLink(lp, lp.story_id, lp.id).subscribe();
        });

        console.log("storiesService");
        parent.storiesService.createStories(eistory.story, eistory.story.id).then(res => console.log(res));

        console.log("timelineEvent");
        eistory.timelineEvent.forEach(te => {
          parent.timelineService.saveEvent(te).subscribe();
        });

        console.log("timelinePeriod");
        eistory.timelinePeriod.forEach(tp => {
          parent.timelineService.savePeriod(tp).subscribe();
        });

        this.initialise();
      } else {
        console.log("non trouvable");
        /*console.log(4);
        parent.storiesService.createStories(eistory.story, null).then(res => {
          console.log(5);
          console.log(res);
          if (res != null) {
            console.log(6);
            let storyID = res;
            
            eistory.chapters.forEach(chap => {
              chap.story_id = storyID;
              chap.id = null;
            });
            parent.chapterService.save(eistory.chapters);

            eistory.characters.forEach(char => {
              char.story_id = storyID;
              parent.charactersService.createCharacter(char.character, char.story_id, char.top, char.left, char.id).subscribe();
            });

            eistory.linksCharacter.forEach(lc => {
              lc.id = null;
              lc.story_id = storyID;
              parent.linksService.createLink({firstCharacter: lc.firstCharacter, secondCharacter: lc.secondCharacter}, lc.informations, lc.story_id, lc.id).subscribe();
            });

            eistory.places.forEach(place => {
              place.story_id = storyID;
              parent.placesService.savePlace(place, place.story_id, place.id).subscribe();
            });

            eistory.linksPlaces.forEach(lp => {
              lp.id = null;
              lp.story_id = storyID;
              parent.placesService.saveLink(lp, lp.story_id, lp.id).subscribe();
            });

            eistory.timelineEvent.forEach(te => {
              te.id = null;
              te.story_id = storyID;
              parent.timelineService.saveEvent(te).subscribe();
            });

            eistory.timelinePeriod.forEach(tp => {
              tp.id = null;
              tp.story_id = storyID;
              parent.timelineService.savePeriod(tp).subscribe();
            });
          }
        });*/
      }
    });
  } 

}