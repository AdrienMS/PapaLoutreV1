import { Component, OnInit, EventEmitter } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

import { LinksCharactersPage } from '../../pages/links-characters/links-characters.page';

@Component({
  selector: 'app-character-popover',
  templateUrl: './character-popover.component.html',
  styleUrls: ['./character-popover.component.scss']
})
export class CharacterPopoverComponent implements OnInit {
  character = null;
  index: number = 0;
  parent: LinksCharactersPage;

  constructor(private navParams: NavParams, private popoverController: PopoverController) { }

  ngOnInit() {
    this.character = this.navParams.get('character');
    this.index = this.navParams.get('index');
    this.parent = this.navParams.get('parent');
  }

  onClickModify() {
    this.parent.modifyCharacter(this.character, this.index);
    this.dismiss();
    //this.parent.emit({datas: this.character, index: this.index});
  }

  onClickDelete() {
    this.parent.deleteCharacter(this.index);
    this.dismiss();
  }

  dismiss() {
    this.popoverController.dismiss();
  }

}
