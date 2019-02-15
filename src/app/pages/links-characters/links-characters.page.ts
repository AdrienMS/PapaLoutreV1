import { CharacterPopoverComponent } from './../../components/character-popover/character-popover.component';
import { Component, OnInit, Directive, Input, ElementRef, Renderer, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { ToastController, DomController, Events, NavController, PopoverController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { AbsoluteDragDirective } from '../../directives/absolute-drag.directive';

import { ColorPickerService, Cmyk } from 'ngx-color-picker';

import { CharactersService } from '../../services/characters.service';
import { StoriesService } from '../../services/stories.service';
import { AuthService } from '../../services/auth.service';
import { LinksService } from '../../services/links.service';

import { characterSheet, FieldCharacter, SearchData, FirebaseDatasCharacters} from '../../models/character';
import { User } from '../../models/user'

@Component({
  selector: 'app-links-characters',
  templateUrl: './links-characters.page.html',
  styleUrls: ['./links-characters.page.scss']
})
export class LinksCharactersPage implements OnInit {
  private id: string = null;
  private charactersStory: FirebaseDatasCharacters[];
  private storyInformation = null;
  private imageCharacter: any[] = [];
  private panelSize: number = 3;
  private isSynchronize: boolean = true;
  private isMobile: boolean = false;

  //Toolbox variables
  private toolboxCharacters: any[] = [];
  private treeViewCharacter: any[] = [];
  private isOpen: boolean = true;

  //Draggable variables
  private dragCharacters: any[] = [];
  private moovingCharacter: number = null

  //Links variables
  private links: any[] = [];
  private selectCharacters: any[] = [];
  private selectFirstCharacter;
  private selectSecondCharacter;
  private searchList: any[];
  private searchText: string;
  private linkType: any[] = [];
  private newSearchListType: string[] = [];
  private newSearchListTypeColor: string[] = [];
  private LinksType: any[] = [];
  private sectionsLink: any[] = [];
  private addFieldLinks: any = {};
  private indexModifiedFieldLink: number = null;
  private lineLink: any[] = [];
  private isModifyLink: boolean = false;
  private indexModifiedLink: number = -1;

  //Characters functions
  currentUser: User;
  private screenSize: number;
  private shownGroup = null;
  private sections: characterSheet[] = [
    new characterSheet(),
  ];
  private addField: FieldCharacter = new FieldCharacter();
  private addFieldSectionId: number = null;
  private searchTextCharacter: string[] = [];
  private searchListCharacter: SearchData[] = [];
  private addSectionField: string;
  private isModify: boolean = false;
  private itemToModify_indexSection: number = null;
  private itemToModify_indexItem: number = null;
  thenBlock: TemplateRef<any>|null = null;
  private isModifyCharacter: boolean = false;
  private modifyCharacterId: string = null;
  private characterImages: string[][][] = [];
  private modifyCharacterIndex: number = null;
  private modifySectionIndex: number = null;

  //Global functions
  private isLinkToAddField: boolean = false;

  @ViewChild('toggleBlock')
  toggleBlock: TemplateRef<any>|null = null;
  @ViewChild('fileBlock')
  fileBlock: TemplateRef<any>|null = null;
  @ViewChild('selectBlock')
  selectBlock: TemplateRef<any>|null = null;
  @ViewChild('defaultBlock')
  defaultBlock: TemplateRef<any>|null = null;

  //Initialization functions
  constructor(
    private charactersService: CharactersService,
    private storiesService: StoriesService,
    private authService: AuthService,
    private linksService: LinksService,
    private events: Events,
    private route: ActivatedRoute,
    private navController: NavController,
    private popoverController: PopoverController
    ) {
      this.initialise();
    /*events.subscribe('currentUser', value => {
      this.initialise();
    });*/
    }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('key');
    this.storiesService.getStoryInfoFromKey(this.id).subscribe(
      res => {
        this.storyInformation = res;
        this.events.publish('selectedStory', res);
      },
      err => {
        console.log(err);
      }
    );
    this.screenSize = window.innerWidth;
    this.thenBlock = this.defaultBlock;
    this.initialise();
    window.setInterval(this.doSynchronize, 600000, this);
    //this.openToolsPanel();
  }

  initialise() {
    this.initSections(null);
    this.charactersService.getCharactersFromStory(this.id).subscribe(res => {
      this.charactersStory = res;
      if (this.charactersStory == null) {
        this.charactersStory = [];
      }
      this.initImages();
      this.initImagesCharacter();
      this.initToolbox();
      this.initTreeViewCharacter();
      this.linksService.getLinksType(this.id).subscribe(res => {
        this.LinksType = res;
        if (this.LinksType != undefined && this.LinksType != null && this.LinksType.length > 0) {
          this.searchList = [];
          this.newSearchListTypeColor = [];
          this.newSearchListType = [];
          for (let i = 0; i < this.LinksType.length; i += 1) {
            this.newSearchListType.push(this.LinksType[i][0]);
            this.newSearchListTypeColor.push(this.LinksType[i][1]);
          }
        } else {
          this.newSearchListType = [
            "ami",
            "amour",
            "père",
            "mère",
            "frère",
            "soeur",
            "cousin",
            "tante",
            "oncle"
          ];
          this.newSearchListTypeColor = [
            "#000000",
            "#000000",
            "#000000",
            "#000000",
            "#000000",
            "#000000",
            "#000000",
            "#000000",
            "#000000"
          ];
          this.linksService.setLinksType([
            ["ami", "#000000"],
            ["amour", "#000000"],
            ["père", "#000000"],
            ["mère", "#000000"],
            ["frère", "#000000"],
            ["soeur", "#000000"],
            ["cousin", "#000000"],
            ["tante", "#000000"],
            ["oncle", "#000000"]
          ], this.id, false).subscribe(res => {
          });
        }
        this.initMobileView();
        this.linksService.getLinksFromStory(this.id).subscribe(res => {
          if (res != null) {
            this.initLinks(res);
          }
        });
      });
    });
  }

  initMobileView() {
    if (window.innerWidth <= 800) {
      this.isMobile = true;
      this.panelSize = 0;
      this.isOpen = false;
      let panelButtonBox = document.getElementById("slide_panel");
      panelButtonBox.classList.add("close");
    }
  }

  initImages() {
    for (let i = 0; i < this.charactersStory.length; i += 1) {
      this.imageCharacter.push(null);
    }
  }

  //Toolbox functions
  private initToolbox() {
    this.toolboxCharacters = [];
    for (let i = 0; i < this.charactersStory.length; i += 1) {
      this.charactersService.getImage(this.charactersStory[i].character[0].items[2].value).subscribe(
        res => {
          this.imageCharacter[i] = res;
        },
        err => {
          this.imageCharacter[i] = "assets/imgs/logo.png";
        }
      );
      this.toolboxCharacters.push({
        name: this.charactersStory[i].character[0].items[0].value + " " + this.charactersStory[i].character[0].items[1].value,
        id: this.charactersStory[i].id,
        story_id: this.charactersStory[i].story_id,
        character: this.charactersStory[i].character,
        index_img: i,
        startLeft: this.charactersStory[i].left,
        startTop: this.charactersStory[i].top,
      });
    }
  }

  private initTreeViewCharacter() {
    this.treeViewCharacter = [];
    for (let i = 0; i < this.toolboxCharacters.length; i += 1) {
      let char = this.toolboxCharacters[i].character;
      let index = this.checkData(char[0].items[0].value)
      if (index != null) {
        this.treeViewCharacter[index][1].push(i);
      } else {
        this.treeViewCharacter.push([char[0].items[0].value, [i]]);
      }
    }
    //console.log(this.treeViewCharacter);
  }

  private checkData(data) {
    /*
      treeViewCharacter content :
      [
        [
          data,
          [toolboxCharacters Index, toolboxCharacters Index, ...]
        ],
        ...
      ]
    */
    for (let i = 0; i < this.treeViewCharacter.length; i += 1) {
      if (this.treeViewCharacter[i][0] == data) {
        return i;
      }
    }
    return null;
  }

  private showChildren(index) {
    let block = document.getElementById("children_" + index);
    if (block.classList.contains("show")) {
      block.classList.remove("show");
    } else {
      block.classList.add("show");
    }
  }

  private clickAddTypeLink() {
    this.newSearchListType.push("");
    this.newSearchListTypeColor.push("#000000");
  }

  private deleteTypeLink(index) {
    this.newSearchListType.splice(index, 1);
    this.newSearchListTypeColor.splice(index, 1);
  }

  private clickOnCharacter(index: number) {
    //replace to real values
    let toAdd = {character: this.toolboxCharacters[index], startLeft: 0, startTop: 0, id: this.dragCharacters.length+1};
    this.dragCharacters.push(toAdd);
    this.toolboxCharacters.splice(index, 1);
  }

  private closeToolsPanel() {
    let panelButtonBox = document.getElementById("slide_panel");
    panelButtonBox.classList.add("close");
    this.panelSize = 0;
    this.isOpen = false;
    if (window.innerWidth <= 800) {
      let toolboxMobileBlock = document.getElementById("toolbox_mobile");
      toolboxMobileBlock.style.display = "none";
      let blackScreenBlock = document.getElementById("toolbox_mobile_black_screen");
      blackScreenBlock.style.display = "none";
    } else {
      let toolboxBlock = document.getElementById("toolbox");
      toolboxBlock.style.display = "none";
    }
  }

  private openToolsPanel() {
    console.log(window.innerWidth);
    let panelButtonBox = document.getElementById("slide_panel");
    panelButtonBox.classList.remove("close");
    if (window.innerWidth <= 800) {
      let toolboxMobileBlock = document.getElementById("toolbox_mobile");
      toolboxMobileBlock.style.display = "block";
      this.panelSize = 0;
      let blackScreenBlock = document.getElementById("toolbox_mobile_black_screen");
      blackScreenBlock.style.display = "block";
    } else {
      let toolboxBlock = document.getElementById("toolbox");
      toolboxBlock.style.display = "block";
      this.panelSize = 3;
    }
    this.isOpen = true;
  }

  //Links functions
  private initSelectCharacters() {
    this.selectCharacters = [];
    for (let i = 0; i < this.toolboxCharacters.length; i += 1) {
      this.selectCharacters.push({
        name: this.toolboxCharacters[i].name,
        id: this.toolboxCharacters[i].id
      });
    }
  }

  private initLinks(datas: any[]) {
    this.links = [];
    //let draggable = document.getElementById("links");
    this.lineLink = [];
    for (let i = 0; i < datas.length; i += 1) {
      this.links.push({
        firstCharacter: datas[i].firstCharacter,
        secondCharacter: datas[i].secondCharacter,
        id: datas[i].id,
        informations: datas[i].informations
      });
      this.selectFirstCharacter = datas[i].firstCharacter;
      this.selectSecondCharacter = datas[i].secondCharacter;
      let g_link = this.generateLink();
      this.lineLink.push(this.loadLink(g_link, datas[i].informations));
      /*if (document.getElementById("link_" + datas[i].firstCharacter + "_" + datas[i].secondCharacter) == null) {
        let svg_line = '<div id="link_' + datas[i].firstCharacter + '_' + datas[i].secondCharacter + '">';
        svg_line += this.loadLink(g_link, datas[i].informations["linkType"]);
        svg_line += '</div>';
        draggable.innerHTML += svg_line;
      }*/
    }
  }

  private displayNewLinkWindow() {
    this.initSelectCharacters();
    if (this.selectCharacters.length > 1) {
      let block = document.getElementById("new_link");
      block.classList.add("show");
    } else {
      console.log("vous devez avoir 2 personnages ou plus pour faire un lien");
    }
  }

  private initSearch() {
    let searchBarListBlock = document.getElementById("searchbar_values");
    searchBarListBlock.classList.add("show");
    this.searchList = this.newSearchListType;
  }

  private setFilteredItems() {
    this.searchList = this.newSearchListType;
    let search = [];
    for (let i = 0; i < this.searchList.length; i += 1) {
      if (this.searchList[i].includes(this.searchText)) {
        search.push(this.searchList[i]);
      }
    }
    this.searchList = search;
  }

  private selectType(value: string, index: number) {
    this.linkType = [];
    this.linkType.push(index);
    this.linkType.push(value);
    this.loseFocus();
  }

  private loseFocus() {
    this.searchList = []

    let searchBarListBlock = document.getElementById("searchbar_values");
    searchBarListBlock.classList.remove("show");
  }

  private cancelLink() {
    this.loseFocus();
    this.isModifyLink = false;
    this.searchList = [];
    this.searchText = "";
    this.linkType = [];
    this.sectionsLink = [];
    this.selectFirstCharacter = null;
    this.selectSecondCharacter = null;
    let block = document.getElementById("new_link");
    block.classList.remove("show");
  }

  private saveLink() {
    this.sectionsLink.push({linkType: this.linkType});
    if (this.linkType != null && this.linkType != []) {
      let g_link = this.addLink();
      this.linksService.createLink({
        firstCharacter: this.selectFirstCharacter,
        secondCharacter: this.selectSecondCharacter
      },
      this.sectionsLink,
      this.id).subscribe(res => {
        this.initialise();
      });
    }
    this.cancelLink();
  }

  private saveFromModificationLink() {
    this.sectionsLink.push({linkType: this.linkType});
    if (this.linkType != null && this.linkType != []) {
      this.linksService.createLink({
        firstCharacter: this.selectFirstCharacter,
        secondCharacter: this.selectSecondCharacter
      },
      this.sectionsLink,
      this.id,
      this.links[this.indexModifiedLink].id).subscribe(res => {
        this.initialise();
      });
    }
    this.cancelLink();
  }

  private modifyLinks() {
    for (let i = 0; i < this.links.length; i += 1) {
      this.linksService.createLink({
        firstCharacter: this.links[i].firstCharacter,
        secondCharacter: this.links[i].secondCharacter
      },
      this.links[i].informations,
      this.id,
      this.links[i].id).subscribe(res => {
      });
    }
  }

  private addLink() {

    if (this.selectFirstCharacter == this.selectSecondCharacter) {
      console.log("same character");
      return;
    }
    if (this.isLinked()) {
      console.log("already linked");
      return;
    }

    this.isSynchronize = false;

    let g_link = this.generateLink();

    /*this.links.push({
      firstCharacter: this.selectFirstCharacter,
      secondCharacter: this.selectSecondCharacter,
      pos_top: g_link.pos_top,
      pos_left: g_link.pos_left,
      height: g_link.height,
      width: g_link.width,
      x1: g_link.x1,
      x2: g_link.x2,
      y1: g_link.y1,
      y2: g_link.y2
    });*/

    //let style = 'style="position:absolute;top:'+g_link.pos_top+'px;left:'+g_link.pos_left+'px;z-index:-2"';

    let svg_line = '<div id="link_' + this.selectFirstCharacter + '_' + this.selectSecondCharacter + '">';
    svg_line += this.loadLink(g_link, null);
    this.lineLink.push(this.loadLink(g_link, null));
    /*svg_line += '<svg height="' + g_link.height;
    svg_line += '" width="' + g_link.width;
    svg_line += '" '+style+'><line x1="' + g_link.x1;
    svg_line += '" y1="' + g_link.y1;
    svg_line += '" x2="' + g_link.x2;
    svg_line += '" y2="' + g_link.y2;
    svg_line += '" style="stroke:rgb(255,0,0);stroke-width:2" /></svg></div>';*/
    svg_line += '</div>';
    //let draggable = document.getElementById("links");
    //draggable.innerHTML += svg_line;

    return g_link;
  }

  private isLinked() {
    for (let i = 0; i < this.links.length; i += 1) {
      if (this.links[i].firstCharacter == this.selectFirstCharacter || this.links[i].secondCharacter == this.selectFirstCharacter) {
        if (this.links[i].firstCharacter == this.selectSecondCharacter || this.links[i].secondCharacter == this.selectSecondCharacter) {
          return true;
        }
      }
    }
    return false;
  }

  private haveLink(id) {
    for (let i = 0; i < this.links.length; i += 1) {
      if (this.links[i].firstCharacter == id || this.links[i].secondCharacter == id) {
        return true;
      }
    }
    return false;
  }

  private loadLink(datas, informations) {
    let color = "rgb(0,0,0)";
    if (informations != null) {
      color = this.getColorLink(informations);
      if (color == null) {
        color = "rgb(0,0,0)";
      }
    }

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
    
    //angle = Math.atan(ac / ab) * (180 / Math.PI); // ok if x2&y2 > x1&y1 or x1&y1 > x2&y2
    angle = Math.atan(ac / ab) * (180 / Math.PI);

    /*if (datas.y1 > datas.y2) {
      angle = Math.atan(ac / ab) * (180 / Math.PI);
    } else {
      angle = Math.atan(ab / ac) * (180 / Math.PI);
    }*/
    /*if (ab > ac) {
      angle = Math.atan(ab / ac) * (180 / Math.PI);
    } else {
      angle = Math.atan(ac / ab) * (180 / Math.PI);
    }*/


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

    //this.newSearchListTypeColor
    
    let style = 'style="position:absolute;z-index: 1;top:'+top+'px;left:'+left+'px;transform-origin : 0 0;transform:rotateZ('+angle+'deg);cursor: pointer"';
    let svg_line = '<svg height="1';
    svg_line += '" width="' + bc;
    svg_line += '" '+style+'><line x1="0';
    svg_line += '" y1="0';
    svg_line += '" x2="' + bc;
    svg_line += '" y2="0';
    svg_line += '" style="stroke:' + color + ';stroke-width:2" /></svg>';

    /*let style = 'style="position:absolute;z-index: 1;top:'+datas.pos_top+'px;left:'+datas.pos_left+'px;"';
    let svg_line = '<svg height="' + datas.height;
    svg_line += '" width="' + datas.width;
    svg_line += '" '+style+'><line x1="' + datas.x1;
    svg_line += '" y1="' + datas.y1;
    svg_line += '" x2="' + datas.x2;
    svg_line += '" y2="' + datas.y2;
    svg_line += '" style="stroke:' + color + ';stroke-width:2" /></svg>';*/
    //return svg_line;
    return {
      width: bc,
      top: top,
      left: left,
      angle: angle,
      color: color
    }
  }

  private getColorLink(informations) {
    let type = null;
    for (let i = 0; i < informations.length; i += 1) {
      if (informations[i]["linkType"] != undefined && informations[i]["linkType"] != null) {
        type = informations[i]["linkType"];
        break;
      }
    }
    if (type != null) {
      for (let i = 0; i < this.newSearchListType.length; i += 1) {
        if (i == type[0]) {
          return this.newSearchListTypeColor[i];
        }
      }
    }
    return null;
  }

  private deplaceLink(event, index) {
    this.isSynchronize = false;
    let test = document.getElementById("character_" + this.toolboxCharacters[index].id);
    this.toolboxCharacters[index].startLeft = Number(test.style.getPropertyValue("left").substr(0, test.style.getPropertyValue("left").length - 2));
    this.toolboxCharacters[index].startTop = Number(test.style.getPropertyValue("top").substr(0, test.style.getPropertyValue("top").length - 2));
    if (this.haveLink(this.toolboxCharacters[index].id)) {
      this.lineLink = [];
      for (let i = 0; i < this.links.length; i += 1) {
        /*if (this.links[i].firstCharacter == this.toolboxCharacters[index].id) {
        } else if (this.links[i].secondCharacter == this.toolboxCharacters[index].id) {
          this.selectFirstCharacter = this.links[i].firstCharacter;
          this.selectSecondCharacter = this.toolboxCharacters[index].id;
        }*/
        this.selectFirstCharacter = this.links[i].firstCharacter;
        this.selectSecondCharacter = this.links[i].secondCharacter;

        if (this.selectFirstCharacter != null) {
          let g_link = this.generateLink();
          //let linkBlock = document.getElementById("link_" + this.selectFirstCharacter + "_" + this.selectSecondCharacter);
          /*let style = 'style="position:absolute;top:'+g_link.pos_top+'px;left:'+g_link.pos_left+'px;z-index:-2"';
          let svg_line = '<svg height="' + g_link.height;
          svg_line += '" width="' + g_link.width;
          svg_line += '" '+style+'><line x1="' + g_link.x1;
          svg_line += '" y1="' + g_link.y1;
          svg_line += '" x2="' + g_link.x2;
          svg_line += '" y2="' + g_link.y2;
          svg_line += '" style="stroke:rgb(255,0,0);stroke-width:2" /></svg>';*/
          //let svg_line = this.loadLink(g_link, this.links[i].informations["linkType"]);
          this.lineLink.push(this.loadLink(g_link, this.links[i].informations));
          //linkBlock.innerHTML = svg_line;
          this.selectFirstCharacter = null;
          this.selectSecondCharacter = null;
        }
      }
    }
  }

  private generateLink() {
    let f_character = document.getElementById("character_" + this.selectFirstCharacter);
    let s_character = document.getElementById("character_" + this.selectSecondCharacter);

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

  clickModifySearchTypeLink() {
    /*for (let i = 0; i < this.searchList.length; i += 1) {
      this.newSearchListType.push(this.searchList[i]);
    }*/
    /*let datas = [];
    for (let i = 0; i < this.newSearchListType.length; i += 1) {
      datas.push(this.newSearchListType[i], this.newSearchListTypeColor);
    }

    this.linksService.setLinksType(datas, this.id, true).subscribe(
      res => {
        this.initialise();
      }
    );*/

    let block = document.getElementById("modify_value_link");
    block.classList.add("show");
  }

  cancelTypeLinks() {
    let block = document.getElementById("modify_value_link");
    block.classList.remove("show");
  }

  saveTypeLink() {
    let datas = [];
    for (let i = 0; i < this.newSearchListType.length; i += 1) {
      datas.push([this.newSearchListType[i], this.newSearchListTypeColor[i]]);
    }

    this.linksService.setLinksType(datas, this.id, true).subscribe(
      res => {
        this.initialise();
      }
    );
    this.cancelTypeLinks();
    this.changeTypeLink(datas);
  }

  private changeTypeLink(datas) {
    //console.log(this.linkType);
    for (let i = 0; i < datas.length; i += 1) {
      //console.log(datas[i]);
      for(let j = 0; j < this.links.length; j += 1) {
        for (let k = 0; k < this.links[j].informations.length; k += 1) {
          if (this.links[j].informations[k]["linkType"] != undefined && this.links[j].informations[k]["linkType"][0] == i) {
            if (this.links[j].informations[k]["linkType"][1] != datas[i][0]) {
              this.links[j].informations[k]["linkType"][1] = datas[i][0];
            }
          }
        }
      }
      if (this.linkType[0] == i) {
        this.linkType[1] = datas[i][0];
      }
    }
    this.modifyLinks();
  }

  clickAddField(index) {
    this.indexModifiedFieldLink = index;
    let block = document.getElementById("add_field_link");
    block.classList.add("show");
  }

  clickModifyLink(index: number) {
    this.indexModifiedLink = index;
    this.isModifyLink = true;
    this.sectionsLink = [];
    this.selectFirstCharacter = this.links[index].firstCharacter;
    this.selectSecondCharacter = this.links[index].secondCharacter;
    for (let i = 0; i < this.links[index].informations.length; i += 1) {
      let info = this.links[index].informations[i];
      if (info["linkType"] != undefined) {
        this.linkType = info["linkType"];
      } else {
        this.sectionsLink.push(info);
      }
    }
    this.displayNewLinkWindow();
  }

  clickDeleteFieldLink() {
    
  }

  addFieldToSectionLink() {
    this.sectionsLink.push(this.addFieldLinks);
    this.addFieldLinks = {};
    this.cancelFieldToSectionLink();
  }

  modifyFieldToSectionLink() {
    //this.sectionsLink.push(this.addField);
    this.sectionsLink[this.indexModifiedFieldLink] = this.addFieldLinks;
    this.addFieldLinks = {};
    this.cancelFieldToSectionLink();
  }

  cancelFieldToSectionLink() {
    let block = document.getElementById("add_field_link");
    block.classList.remove("show");
  }

  getStyleLink(index: number) {
    //onsole.log(this.lineLink[index]);
    return {
      'width': this.lineLink[index].width + 'px',
      'top': this.lineLink[index].top + 'px',
      'left': this.lineLink[index].left + 'px',
      'transform': 'rotateZ('+this.lineLink[index].angle+'deg)',
      'background-color': this.lineLink[index].color
    };
  }

  /*
    Character functions
  */
  getImageFromFirebase(name: string, id1: number, id2: number, id3: number) {
      this.charactersService.getImage(name).subscribe(res => {
        this.characterImages[id1][id2][id3] = res;
      },
      err => {
        this.characterImages[id1][id2][id3] = "assets/imgs/logo.png";
      });
  }

  initImagesCharacter() {
    this.characterImages = [];
    for (let i = 0; i < this.charactersStory.length; i += 1) {
      this.characterImages.push([]);
      for (let j = 0; j < this.charactersStory[i].character.length; j += 1) {
        this.characterImages[i].push([]);
        if (this.charactersStory[i].character[j].items != undefined && this.charactersStory[i].character[j].items != null) {
          for (let k = 0; k < this.charactersStory[i].character[j].items.length; k += 1) {
            let data = this.charactersStory[i].character[j].items[k];
            this.characterImages[i][j].push("");
            if (data["type"] === "file") {
              this.getImageFromFirebase(data["value"], i, j, k);
            }
          }
        }
      }
    }
  }

  initSections(datas) {
    if (datas === null) {
      this.sections = [
        new characterSheet(),
      ];
      this.sections[0].name = "Générales"; 
      this.sections[0].items = [new FieldCharacter(), new FieldCharacter(), new FieldCharacter()];
      this.sections[0].items[0].label = "Nom";
      this.sections[0].items[0].type = "text";
      this.sections[0].items[0].value = "";
      this.sections[0].items[0].size = "3";
      this.sections[0].items[0].canModify = false;
  
      this.sections[0].items[1].label = "Prénom";
      this.sections[0].items[1].type = "text";
      this.sections[0].items[1].value = "";
      this.sections[0].items[1].size = "3";
      this.sections[0].items[1].canModify = false;
  
      this.sections[0].items[2].label = "image";
      this.sections[0].items[2].type = "file";
      this.sections[0].items[2].value = "";
      this.sections[0].items[2].size = "3";
      this.sections[0].items[2].canModify = false;
    } else {
      this.sections = [];
      for (let i = 0; i < datas.character.length; i += 1) {
        let data: FieldCharacter[] = [];
        if (datas.character[i].items != undefined && datas.character[i].items != null) {
          for(let j = 0; j < datas.character[i].items.length; j += 1) {
            data.push(new FieldCharacter(
              datas.character[i].items[j].label,
              datas.character[i].items[j].type,
              datas.character[i].items[j].size,
              datas.character[i].items[j].value,
              datas.character[i].items[j].searchValues,
              datas.character[i].items[j].canModify,
            ));
          }
        }
        //datas.characters[i].items = [];
        this.sections.push(new characterSheet(datas.character[i].name, data));
      }
      this.displayCharacterSheet(datas.id, datas.story_id);
    }
    this.toggleGroup(this.sections[0]);
    this.isGroupShown(this.sections[0]);
  }

  public modifyCharacter(datas, index) {
    this.isModifyCharacter = true;
    this.modifyCharacterId = datas.id;
    this.modifyCharacterIndex = index;
    this.initSections(datas);
  }

  checkNumberSearch() {
    let count = 0;
    for (let i = 0; i < this.sections.length; i += 1) {
      for (let j = 0; j < this.sections[i].items.length; j += 1) {
        if (this.sections[i].items[j].type === "search") {
          count += 1;
        }
      }
    }
  }

  expandSearchVariables() {
    let count = 0;
    for (let i = 0; i < this.sections.length; i += 1) {
      if (this.sections[i].items != undefined && this.sections[i].items != null) {
        count += this.sections[i].items.length;
      }
    }
    if (this.searchTextCharacter.length === count && this.searchListCharacter.length === count) {
      return;
    }
    this.searchTextCharacter = [];
    this.searchListCharacter = [];
    for (let i = 0; i < count; i += 1) {
      this.searchTextCharacter.push("");
      this.searchListCharacter.push(new SearchData(null));
    }
  }

  getIndexSearch(sectionIndex: number, itemIndex: number) {
    let count = 0;
    for (let i = 0; i < sectionIndex - 1; i += 1) {
      count += this.sections[i].items.length;
    }
    count += itemIndex;
    return count;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenSize = window.innerWidth;
    if (this.screenSize <= 800) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  toggleGroup(group) {
    if (group === this.shownGroup) {
      this.shownGroup = null;
      return;
    }
    this.shownGroup = group;
  }

  isGroupShown(group) {
    if (this.shownGroup === group) {
      return true;
    }
    return false;
  }

  addFile(event, item, index: number) {
    let fileList: FileList = event.target.files;
    item.value = fileList[0];

    let imageBlock = document.getElementById("field_image_" + index.toString()) as HTMLImageElement;
    imageBlock.src = URL.createObjectURL(fileList[0]);
  }

  save() {
    this.charactersService.createCharacter(this.sections, this.id, 0, 0).subscribe(res => {
      this.hideCharacterSheet();
      this.initImages();
    });
    this.modifyCharacterIndex = null;
  }

  showAddField(section_id) {
    this.addFieldSectionId = section_id;
    this.addField = new FieldCharacter();
    this.addField.canModify = true;
    this.addField.size = "12";
    let addFieldBlock = document.getElementById("add_field");
    addFieldBlock.classList.add("show");
    this.isModify = false;
  }

  addFieldToSection() {
    let datas = new FieldCharacter();
    datas.label = this.addField.label;
    datas.type = this.addField.type;
    datas.value = this.addField.value;
    datas.size = this.addField.size;
    datas.searchValues = this.addField.searchValues;
    datas.canModify = true;

    this.sections[this.addFieldSectionId].items.push(datas);
    this.addFieldSectionId = null;
    let addFieldBlock = document.getElementById("add_field");
    addFieldBlock.classList.remove("show");
    this.expandSearchVariables();
  }

  initSearchCharacter(index: number) {
    let searchBarListBlock = document.getElementById("searchbar_values_" + index.toString());
    searchBarListBlock.classList.add("show");
  }

  setFilteredItemsCharacter(datas: FieldCharacter, index: number) {
    let returnedDatas = [];
    for (let i = 0; i < datas.searchValues.length; i += 1) {
      if (datas.searchValues[i].value.includes(this.searchTextCharacter[index])) {
        returnedDatas.push(datas.searchValues[i]);
      }
    }
    this.searchListCharacter[index] = new SearchData(returnedDatas);
  }

  setFieldType(type: string) {
    if (type === "toggle") {
      this.thenBlock = this.toggleBlock;
    } else if (type === "search") {
      this.thenBlock = this.selectBlock;
    } else if (type === "file") {
      this.thenBlock = this.fileBlock;
    } else {
      this.thenBlock = this.defaultBlock;
    }
    return true;
  }

  loseFocusCharacter(index: number) {
    this.searchListCharacter[index] = new SearchData(null);

    let searchBarListBlock = document.getElementById("searchbar_values_" + index.toString());
    searchBarListBlock.classList.remove("show");
  }

  addToList(item: FieldCharacter, value: string, index: number) {
    if (item.value === null || item.value === "") {
      item.value = [value];
    } else {
      item.value.push(value);
    }
    this.loseFocusCharacter(index);
    this.searchTextCharacter[index] = "";
    
  }

  deleteValue(item: FieldCharacter, index: number) {
    item.value.splice(index, 1);
  }

  addToSearchValue() {
    if (this.addField.searchValues == null) {
      this.addField.searchValues = [];
    }
    this.addField.searchValues.push({value: ""});
  }

  DisplayAddSection(data: string, index: number) {
    let addSectionBlock = document.getElementById("add_section_box");
    addSectionBlock.classList.add("show");
    if (data != null) {
      this.addSectionField = data;
      this.modifySectionIndex = index;
    }
  }

  addSection() {
    if (this.modifySectionIndex != null && this.addSectionField != null && this.addSectionField != "") {
      this.sections[this.modifySectionIndex].name = this.addSectionField;
      this.cancelSection;
    } else if (this.addSectionField != null && this.addSectionField != "") {
      let data = new characterSheet();
      data.name = this.addSectionField;
      data.items = [];
      this.sections.push(data);
    }
    this.cancelSection();
  }

  cancelSection() {
    let addSectionBlock = document.getElementById("add_section_box");
    addSectionBlock.classList.remove("show");
    this.addSectionField = "";
    this.modifySectionIndex = null;
  }

  CancelFieldToSection() {
    this.addFieldSectionId = null;
    let addFieldBlock = document.getElementById("add_field");
    addFieldBlock.classList.remove("show");
  }

  clickModify(item: {label: string, type: string, size: string, value: any, searchValues: any}, index_section: number, index_item: number) {
    this.addField = new FieldCharacter();
    this.addField.label = item.label;
    this.addField.type = item.type;
    this.addField.size = item.size;
    this.addField.value = item.value;
    this.addField.searchValues = item.searchValues;
    
    let addFieldBlock = document.getElementById("add_field");
    addFieldBlock.classList.add("show");
    this.isModify = true;
    this.itemToModify_indexSection = index_section;
    this.itemToModify_indexItem = index_item;
  }

  clickDeleteField(index_section: number, index_item: number) {
    this.sections[index_section].items.splice(index_item, 1);
  }

  modifyFieldToSection() {
    if (this.isLinkToAddField) {
      this.modifyFieldToSectionLink();
    } else {
      this.sections[this.itemToModify_indexSection].items[this.itemToModify_indexItem].label = this.addField.label;
      this.sections[this.itemToModify_indexSection].items[this.itemToModify_indexItem].type = this.addField.type;
      this.sections[this.itemToModify_indexSection].items[this.itemToModify_indexItem].size = this.addField.size;
      this.sections[this.itemToModify_indexSection].items[this.itemToModify_indexItem].value = this.addField.value;
      this.sections[this.itemToModify_indexSection].items[this.itemToModify_indexItem].searchValues = this.addField.searchValues;
    }
  
    this.addField = new FieldCharacter();
    this.CancelFieldToSection();
  }

  displayCharacterSheet(id: string, story_id: string) {
    this.expandSearchVariables();
    let block = document.getElementById("character_sheet");
    block.classList.add("show");
  }

  hideCharacterSheet() {
    let block = document.getElementById("character_sheet");
    block.classList.remove("show");
    this.initSections(null);
    this.modifyCharacterId = null;
    this.isModifyCharacter = false;
    this.modifyCharacterIndex = null;
  }

  applyModifications() {
    let block = document.getElementById("character_" + this.modifyCharacterId);
    let top = Number(block.style.getPropertyValue("top").substr(0, block.style.getPropertyValue("top").length - 2));
    let left = Number(block.style.getPropertyValue("left").substr(0, block.style.getPropertyValue("left").length - 2));
    this.charactersService.createCharacter(this.sections, this.id, top, left, this.modifyCharacterId).subscribe(res => {
      this.hideCharacterSheet();
    });
    this.modifyCharacterIndex = null;
  }

  deleteSection(index) {
    this.sections.splice(index, 1);
    this.initImages();
    this.expandSearchVariables();
  }

  deleteCharacter(index) {
    this.charactersService.deleteCharacter(this.charactersStory[index].id).subscribe(() => {
      this.initialise();
    });
  }

  //Global functions
  async presentPopover(ev: any, character, index) {
    const popover = await this.popoverController.create({
      component: CharacterPopoverComponent,
      componentProps: {character: character, index: index, parent: this},
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  public synchronize() {
    for (let i = 0; i < this.toolboxCharacters.length; i += 1) {
      this.initSections(this.toolboxCharacters[i]);
      this.modifyCharacterId = this.toolboxCharacters[i].id;
      this.applyModifications();
    }
    this.modifyLinks();
    this.modifyCharacterId = null;
    this.isSynchronize = true;
  }

  private doSynchronize(parent: LinksCharactersPage) {
    parent.synchronize();
  }
}
