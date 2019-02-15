import { Component, OnInit, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { NavController, Events, Input } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { StoriesService } from './../../services/stories.service';
import { CharactersService } from '../../services/characters.service';

import { AuthService } from '../../services/auth.service';
import { characterSheet, FieldCharacter, SearchData, FirebaseDatasCharacters} from '../../models/character';
import { User } from '../../models/user'

@Component({
  selector: 'app-characters',
  templateUrl: './characters.page.html',
  styleUrls: ['./characters.page.scss'],
})
export class CharactersPage implements OnInit {
  id: string = null;
  storyInformation = null;
  currentUser: User;
  private charactersStory: FirebaseDatasCharacters[];
  private screenSize: number;
  private shownGroup = null;
  private sections: characterSheet[] = [
    new characterSheet(),
  ];
  private addField: FieldCharacter = new FieldCharacter();
  private addFieldSectionId: number = null;
  private searchText: string[] = [];
  private searchList: SearchData[] = [];
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

  @ViewChild('toggleBlock')
  toggleBlock: TemplateRef<any>|null = null;
  @ViewChild('fileBlock')
  fileBlock: TemplateRef<any>|null = null;
  @ViewChild('selectBlock')
  selectBlock: TemplateRef<any>|null = null;
  @ViewChild('defaultBlock')
  defaultBlock: TemplateRef<any>|null = null;

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private charactersService: CharactersService,
    private storiesService: StoriesService,
    private events: Events
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
  }

  initialise() {
    this.initSections(null);
    this.charactersService.getCharactersFromStory(this.id).subscribe(res => {
      this.charactersStory = res;
      if (this.charactersStory == null) {
        this.charactersStory = [];
      }
      this.initImages();
    });
  }

  getImageFromFirebase(name: string, id1: number, id2: number, id3: number) {
      this.charactersService.getImage(name).subscribe(res => {
        this.characterImages[id1][id2][id3] = res;
      },
      err => {
        console.log(err);
        this.characterImages[id1][id2][id3] = "assets/imgs/logo.png";
      });
  }

  initImages() {
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
      //console.log(datas);
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

  modifyCharacter(datas, index) {
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
    if (this.searchText.length === count && this.searchList.length === count) {
      return;
    }
    this.searchText = [];
    this.searchList = [];
    for (let i = 0; i < count; i += 1) {
      this.searchText.push("");
      this.searchList.push(new SearchData(null));
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
    /*this.charactersService.createCharacter(this.sections, this.id).subscribe(res => {
      this.hideCharacterSheet();
      this.initImages();
    });*/
    this.modifyCharacterIndex = null;
  }

  showAddField(section_id) {
    this.addFieldSectionId = section_id;
    this.addField = new FieldCharacter();
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

    this.sections[this.addFieldSectionId].items.push(datas);
    this.addFieldSectionId = null;
    let addFieldBlock = document.getElementById("add_field");
    addFieldBlock.classList.remove("show");
    this.expandSearchVariables();
  }

  initSearch(index: number) {
    let searchBarListBlock = document.getElementById("searchbar_values_" + index.toString());
    searchBarListBlock.classList.add("show");
  }

  setFilteredItems(datas: FieldCharacter, index: number) {
    let returnedDatas = [];
    for (let i = 0; i < datas.searchValues.length; i += 1) {
      if (datas.searchValues[i].value.includes(this.searchText[index])) {
        returnedDatas.push(datas.searchValues[i]);
      }
    }
    this.searchList[index] = new SearchData(returnedDatas);
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

  loseFocus(index: number) {
    this.searchList[index] = new SearchData(null);

    let searchBarListBlock = document.getElementById("searchbar_values_" + index.toString());
    searchBarListBlock.classList.remove("show");
  }

  addToList(item: FieldCharacter, value: string, index: number) {
    if (item.value === null || item.value === "") {
      item.value = [value];
    } else {
      item.value.push(value);
    }
    this.loseFocus(index);
    this.searchText[index] = "";
    
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
    }else if (this.addSectionField != null && this.addSectionField != "") {
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

  modifyFieldToSection() {
    this.sections[this.itemToModify_indexSection].items[this.itemToModify_indexItem].label = this.addField.label;
    this.sections[this.itemToModify_indexSection].items[this.itemToModify_indexItem].type = this.addField.type;
    this.sections[this.itemToModify_indexSection].items[this.itemToModify_indexItem].size = this.addField.size;
    this.sections[this.itemToModify_indexSection].items[this.itemToModify_indexItem].value = this.addField.value;
    this.sections[this.itemToModify_indexSection].items[this.itemToModify_indexItem].searchValues = this.addField.searchValues;

    this.addField = null;
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
    /*this.charactersService.createCharacter(this.sections, this.id, this.modifyCharacterId).subscribe(res => {
      this.hideCharacterSheet();
    });*/
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
}
