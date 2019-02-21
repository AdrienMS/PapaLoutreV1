import { Component, OnInit } from '@angular/core';
import { ToastController, DomController, Events, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Place, PlacePosition, PlaceSection, PlaceInformation } from '../../models/place';
import { PlaceLink, PlaceLinkInformation } from '../../models/placeLink';

import { PlacesService } from '../../services/places.service';
import { StoriesService } from '../../services/stories.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements OnInit {
  //global variables
  private places: Place[] = [];
  private links: PlaceLink[] = [];
  private id: string;
  private storyInformation;
  private images: string[];

  //links functions
  private loadLine: any[] = [];

  //synchronise variables
  private isSynchronize: boolean = true;

  constructor(
    private placesService: PlacesService,
    private storiesService: StoriesService,
    private events: Events,
    private route: ActivatedRoute,
    private navCtrl: NavController) {
      this.initialise();
    /*events.subscribe('currentUser', value => {
      this.initialise();
    });*/
  }

  ngOnInit() {
    this.initialise();
  }

  /*Initilise functions*/
  private initialise() {
    this.id = this.route.snapshot.paramMap.get('key');
    this.storiesService.getStoryInfoFromKey(this.id).subscribe(
      res => {
        console.log(res);
        this.storyInformation = res;
        this.events.publish('selectedStory', res);
      },
      err => {
        console.log(err);
      }
    );
    this.placesService.getPlacesFromStory(this.id).subscribe(res => {
      this.places = res;
      console.log(this.places);
      this.placesService.getLinksFromStory(this.id).subscribe(res => {
        console.log(res);
        this.links = res;
        this.init_line();
      });
    });
    this.isSynchronize = true;
  }

  /*Place card functions*/
  private deplaceCard(event: {left: number, top: number, id: string}) {
    this.isSynchronize = false;
    let index = this.getIndexPlaceFromId(event.id);
    if (index != null) {
      this.places[index].position.left = event.left;
      this.places[index].position.top = event.top;
    }
    this.init_line();
  }

  private deletePlace(event) {
    this.placesService.deletePlace(event).subscribe(res => {
      console.log(res);
      this.initialise();
    });
    if (this.links != null) {
      this.links.forEach(link => {
        if (link.places_id[0] == event || link.places_id[1] == event) {
          this.deleteLink(link.id);
        }
      });
    }
  }

  /*Links functions*/
  private init_line() {
    this.loadLine = [];
    if (this.links != null) {
      this.links.forEach(link => {
        let g_line = this.generateLink(link);
        this.loadLine.push(this.loadLink(g_line));
      });
    }
  }

  private generateLink(link: PlaceLink) {
    let f_character = document.getElementById("place_" + link.places_id[0]);
    let s_character = document.getElementById("place_" + link.places_id[1]);

    let f_top = Number(f_character.style.getPropertyValue("top").substr(0, f_character.style.getPropertyValue("top").length - 2));
    let f_left = Number(f_character.style.getPropertyValue("left").substr(0, f_character.style.getPropertyValue("left").length - 2));

    let s_top = Number(s_character.style.getPropertyValue("top").substr(0, s_character.style.getPropertyValue("top").length - 2));
    let s_left = Number(s_character.style.getPropertyValue("left").substr(0, s_character.style.getPropertyValue("left").length - 2));

    let pos_top = 0;
    let pos_left = 0;
    let height = 0
    let width = 0;
    let x1, y1, x2, y2 = 0;

    if (f_top < s_top) {
      pos_top = f_top + 75;
      height = s_top - f_top;
      if (height == 0) {
        height = 1;
      }
      y1 = 0;
      y2 = height;
    } else {
      pos_top = s_top + 75;
      height = f_top - s_top;
      if (height == 0) {
        height = 1;
      }
      y1 = height;
      y2 = 0;
    }

    if (f_left < s_left) {
      pos_left = f_left + 75;
      width = s_left - f_left;
      if (width == 0) {
        width = 1;
      }
      x1 = 0;
      x2 = width;
    } else {
      pos_left = s_left + 75;
      width = f_left - s_left;
      if (width == 0) {
        width = 1;
      }
      x1 = width;
      x2 = 0;
    }

    return {
      pos_top: pos_top,
      pos_left: pos_left,
      height: height,
      width: width,
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2
    }
  }

  private loadLink(datas) {
    let color = this.getColor();

    /*
      We have a triangle like :

      B
      |\
      | \
      |  \
      |___\
      A    C

    */

    //calculate hypothénuse
    let ab = datas.width;
    let ac = datas.height
    let bc = Math.sqrt((Math.pow(ab, 2) + Math.pow(ac, 2)));

    //calculate angle
    let angle = 0;
    
    angle = Math.atan(ac / ab) * (180 / Math.PI);

    let top = 0;
    let left = 0;
    if ((datas.x1 > datas.x2 && datas.y1 > datas.y2) || (datas.x2 > datas.x1 && datas.y2 > datas.y1)) {
      top = datas.pos_top;
      left = datas.pos_left;
    } else {
      top = datas.pos_top + datas.y1;
      left = datas.pos_left + datas.x1;
      angle *= -1;
    }

    if ((datas.x1 > datas.x2 && datas.y2 > datas.y1)) {
      angle -= 180;
    }

    return {
      width: bc,
      top: top,
      left: left,
      angle: angle,
      color: color
    }
  }

  private getColor() {
    return 'rgb(0,0,0)';
  }

  private getStyleLink(index: number) {
    return {
      'width': this.loadLine[index].width + 'px',
      'top': this.loadLine[index].top + 'px',
      'left': this.loadLine[index].left + 'px',
      'transform': 'rotateZ('+this.loadLine[index].angle+'deg)',
      'background-color':this.loadLine[index].color
    };
  }

  private deleteLink(link_id: string) {
    this.placesService.deleteLink(link_id).subscribe(res => {
      this.initialise();
      console.log(res);
    });
  }

  /*Global functions*/
  private getIndexPlaceFromId(id: string): number {
    for(let i = 0; i < this.places.length; i += 1) {
      if (this.places[i].id == id) {
        return i;
      }
    }
    return null;
  }

  /*Synchronise functions*/
  private synchronize() {
    this.places.forEach(place => {
      this.placesService.savePlace(place, place.story_id, place.id).subscribe(res => {
        this.initialise();
      })
    });
  }

}
