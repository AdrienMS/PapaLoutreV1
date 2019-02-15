import { Component, OnInit } from '@angular/core';
import { Directive, Input, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';

import { PlaceLink, PlaceLinkInformation } from '../../../models/placeLink';
import { Place, PlacePosition, PlaceInformation } from '../../../models/place';

@Component({
  selector: 'app-place-link',
  templateUrl: './place-link.component.html',
  styleUrls: ['./place-link.component.scss']
})
export class PlaceLinkComponent implements OnInit {
  @Input('placeLink') placeLink: PlaceLink;

  private line: any;

  constructor() { }

  ngOnInit() {
    this.initialise();
  }

  private initialise() {
    let g_line = this.generateLink();
    this.line = this.loadLink(g_line);
  }

  private generateLink() {
    let f_character = document.getElementById("place_" + this.placeLink.places_id[0]);
    let s_character = document.getElementById("place_" + this.placeLink.places_id[1]);

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

  private getStyleLink() {
    return {
      'width': this.line.width + 'px',
      'top': this.line.top + 'px',
      'left': this.line.left + 'px',
      'transform': 'rotateZ('+this.line.angle+'deg)',
      'background-color':this.line.color
    };
  }

}
