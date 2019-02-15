import { Directive, Input, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';
import { DomController } from '@ionic/angular';
import 'hammerjs';

@Directive({
  selector: '[absolute-drag]'
})
export class AbsoluteDragDirective {
  @Input('startLeft') startLeft: any;
  @Input('startTop') startTop: any;
  @Output() sendDatas: EventEmitter<any> = new EventEmitter();

  private oldTop: number = 0;
  private oldLeft: number = 0

  private oldDeltaX: number = 0;
  private oldDeltaY: number = 0;

  constructor(public element: ElementRef, public renderer: Renderer, public domCtrl: DomController) {
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
      this.renderer.setElementStyle(this.element.nativeElement, 'position', 'absolute');
      this.renderer.setElementStyle(this.element.nativeElement, 'left', this.startLeft + 'px');
      this.renderer.setElementStyle(this.element.nativeElement, 'top', this.startTop + 'px');
      this.renderer.setElementStyle(this.element.nativeElement, 'width', '150px');
      this.renderer.setElementStyle(this.element.nativeElement, 'height', '150px');

      this.oldTop = this.startTop;
      this.oldLeft = this.startLeft;

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

  handlePan(ev: HammerInput) {

    let diffX = this.oldDeltaX - ev.deltaX;
    let diffY = this.oldDeltaY - ev.deltaY;
    if (diffX < 0) {
      diffX *= -1;
    }
    if (diffY < 0) {
      diffY *= -1;
    }

    this.startLeft = this.oldLeft - (this.oldDeltaX - ev.deltaX);
    this.startTop = this.oldTop - (this.oldDeltaY - ev.deltaY);

    if (diffX > 100) {
      this.startLeft = this.oldLeft;
    }
    if (diffY > 100) {
      this.startTop = this.oldTop;
    }

    if (this.startTop < 0) {
      this.startTop = 0;
    }
    if (this.startLeft < 0) {
      this.startLeft = 0;
    }

    //console.log(ev.deltaX, ev.deltaY, this.oldLeft, this.oldTop, this.startLeft, this.startTop);

    this.domCtrl.write(() => {
        this.renderer.setElementStyle(this.element.nativeElement, 'left', this.startLeft + 'px');
        this.renderer.setElementStyle(this.element.nativeElement, 'top', this.startTop + 'px');
    });
    this.sendDatas.emit({left: this.startLeft, top: this.startTop});

    this.oldLeft = this.startLeft;
    this.oldTop = this.startTop;
    this.oldDeltaX = ev.deltaX;
    this.oldDeltaY = ev.deltaY;
  }

}
