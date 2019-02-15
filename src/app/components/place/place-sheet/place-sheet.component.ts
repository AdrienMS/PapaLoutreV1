import { Component, OnInit } from '@angular/core';
import { Directive, Input, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';
import { DomController, PopoverController, NavController } from '@ionic/angular';
import 'hammerjs';

import { Place, PlacePosition, PlaceInformation } from '../../../models/place';

import { PlacePopoverComponent } from '../place-popover/place-popover.component';

import { PlacesService } from '../../../services/places.service';

@Component({
  selector: 'app-place-sheet',
  templateUrl: './place-sheet.component.html',
  styleUrls: ['./place-sheet.component.scss']
})
export class PlaceSheetComponent implements OnInit {
  @Input('place') place: Place;
  @Output('callBack') callBack: EventEmitter<{left: number, top: number, id: string}> = new EventEmitter();
  @Output('deletePlace') deleteCallBack: EventEmitter<string> = new EventEmitter();

  private oldTop: number = 0;
  private oldLeft: number = 0

  private oldDeltaX: number = 0;
  private oldDeltaY: number = 0;

  private image: string;

  private is_interval: boolean = false;

  constructor(
    public element: ElementRef,
    public renderer: Renderer,
    public domCtrl: DomController,
    private popoverController: PopoverController,
    private navCtrl: NavController,
    private placesService: PlacesService) {
  }

  ngOnInit() {
    console.log(this.place);
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    this.renderer.setElementStyle(this.element.nativeElement, 'left', this.place.position.left + 'px');
    this.renderer.setElementStyle(this.element.nativeElement, 'top', this.place.position.top + 'px');
    this.oldTop = this.place.position.top;
    this.oldLeft = this.place.position.left;
    this.initImages();

    let hammer = new Hammer(this.element.nativeElement, {
      recognizers: [
        [Hammer.Pan, { direction: Hammer.DIRECTION_ALL }],
        [Hammer.Press],
        [Hammer.Tap],
      ],
    });

    hammer.on('pan', (ev) => {
      this.handlePan(ev);
    });
  }

  private initImages() {
    if (this.place.sections[0].informations.length < 2) {
      this.image = "assets/imgs/logo.png";
    } else {
      this.placesService.getImage(this.place.sections[0].informations[1].value).subscribe(res => {
        this.image = res;
        if (this.is_interval) {
          window.clearInterval();
          this.is_interval = false;
          console.log('clear interval');
        }
      },
      err => {
        this.image = "assets/imgs/logo.png";
        window.setInterval(this.initImages, 5000, this);
        this.is_interval = true;
      });
    }
  }

  handlePan(ev: HammerInput) {

    let diffX = this.oldDeltaX - ev.deltaX;
    let diffY = this.oldDeltaY - ev.deltaY;
    if (diffX < 0) {
      diffX *= -1;
    }
    if (diffY < 0) {
      diffY *= -1;
    }

    this.place.position.left = this.oldLeft - (this.oldDeltaX - ev.deltaX);
    this.place.position.top = this.oldTop - (this.oldDeltaY - ev.deltaY);

    if (diffX > 100) {
      this.place.position.left = this.oldLeft;
    }
    if (diffY > 100) {
      this.place.position.top = this.oldTop;
    }

    if (this.place.position.top < 0) {
      this.place.position.top = 0;
    }
    if (this.place.position.left < 0) {
      this.place.position.left = 0;
    }

    this.domCtrl.write(() => {
      this.renderer.setElementStyle(this.element.nativeElement, 'left', this.place.position.left + 'px');
      this.renderer.setElementStyle(this.element.nativeElement, 'top', this.place.position.top + 'px');
    });
    this.callBack.emit({left: this.place.position.left, top: this.place.position.top, id: this.place.id});

    this.oldLeft = this.place.position.left;
    this.oldTop = this.place.position.top;
    this.oldDeltaX = ev.deltaX;
    this.oldDeltaY = ev.deltaY;
  }

  public modifyPlace() {
    this.navCtrl.navigateForward('/place-sheet/'+this.place.story_id+'/'+this.place.id);
  }

  public deletePlace() {
    this.deleteCallBack.emit(this.place.id);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PlacePopoverComponent,
      componentProps: {place: this.place, parent: this},
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

}
