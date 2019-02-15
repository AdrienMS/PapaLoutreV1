import { Component, OnInit, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { NavController, Events, Input, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Place, PlacePosition, PlaceSection, PlaceInformation } from '../../models/place';
import { User } from '../../models/user'

import { AuthService } from '../../services/auth.service';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-place-sheet',
  templateUrl: './place-sheet.page.html',
  styleUrls: ['./place-sheet.page.scss'],
})
export class PlaceSheetPage implements OnInit {
  story_id: string;
  place: Place = new Place(null,null,new PlacePosition({left: 0, top: 0}),[]);

  private is_interval: boolean = false;

  //Sheet variables
  private index_section_show: number = 0;
  private sheet_search_values: any[] = [];
  private sheet_search_text: any[] = [];
  private index_to_search: number[] = [];


  //Sections variables
  private add_section: string;
  private index_modified_section: number = null;

  //Informations variables
  private add_information: PlaceInformation = new PlaceInformation({});
  private index_modified_info: number = null;
  private fieldsSearch: any[] = [];
  private ImagesToLoad: any[] = [];

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private events: Events,
    private toast: ToastController,
    private placesService: PlacesService) {
      this.initialise();
    /*events.subscribe('currentUser', value => {
      this.initialise();
    });*/
  }

  ngOnInit() {
    this.story_id = this.route.snapshot.paramMap.get('story_id');
    this.initialise();
  }

  //initialise functions
  initialise() {
    let place_id = this.route.snapshot.paramMap.get('place_id');
    if (place_id != "new") {
      this.placesService.getPlacesFromIDAndStory(this.story_id, place_id).subscribe(res => {
        this.place = res;
        if (this.place == null) {
          this.initEmptyPlace();
        }
        this.initImagesFromFirebase();
      });
    } else {
      this.initEmptyPlace();
    }
    console.log(this.place);
  }

  private reinitialise(parent: PlaceSheetPage) {
    parent.initialise();
  }

  private initEmptyPlace() {
    let infos: PlaceInformation[] = [];
      infos.push(new PlaceInformation({
        label: "Nom",
        type: "text", 
        value: "",
        size: 10,
        canModify: false
      }));
      infos.push(new PlaceInformation({
        label: "Image",
        type: "file", 
        value: "",
        size: 2,
        canModify: false
      }));

      let sections: PlaceSection[] = [];
      sections.push(new PlaceSection({
        name: "Général",
        informations: infos
      }));
      this.place = new Place(null, this.story_id, new PlacePosition({left: 0, top: 0}), sections);
  }

  //Sheet functions
  private isInformationsShown(index: number) {
    if (this.index_section_show == index) {
      return true;
    }
    return false;
  }

  private toggleInformations(index: number) {
    if (index == this.index_section_show) {
      this.index_section_show = null;
    } else {
      this.index_section_show = index;
    }
  }

  private initSearch(index_section: number, index_info: number) {
    this.index_to_search = [index_section, index_info];
    let values = this.place.sections[index_section].informations[index_info].value;
    this.sheet_search_text = [];
    values.forEach(value => {
      this.sheet_search_text.push(value.value);
    });
  }

  private changeTextValue(index_section: number, index_info: number) {
    this.place.sections[index_section].informations[index_info].value = [];
    this.sheet_search_text.forEach(value => {
      this.place.sections[index_section].informations[index_info].value.push({value: value});
    });
  }

  private addFile(event, item, index_section: number, index_info: number) {
    let fileList: FileList = event.target.files;
    item.value = fileList[0];

    let imageBlock = document.getElementById("field_image_" + index_section + "_" + index_info) as HTMLImageElement;
    imageBlock.src = URL.createObjectURL(fileList[0]);
  }

  private save() {
    this.placesService.savePlace(this.place, this.story_id, null).subscribe(res => {
      this.navController.navigateRoot("place-sheet/" + this.story_id + "/" + res);
    });
  }

  private applyModifications() {
    this.placesService.savePlace(this.place, this.story_id, this.place.id).subscribe(res => {
      this.initialise();
    })
  }

  private cancel() {
    this.navController.navigateBack("places/"+this.story_id);
  }

  //Sections functions
  private addSection() {
    let section: PlaceSection = new PlaceSection({name: this.add_section, informations: []});
    this.place.sections.push(section);
    this.hideAddSection();
  }

  private modifySection() {
    this.place.sections[this.index_modified_section].name = this.add_section;
    this.hideAddSection();
  }

  private deleteSection(index: number) {
    this.place.sections.splice(index, 1);
  }

  private displayAddSection(index: number = null) {
    if (index == null) {
      this.add_section = "";
    } else {
      this.add_section = this.place.sections[index].name;
      this.index_modified_section = index;
    }
    let block = document.getElementById("add_section_box");
    block.classList.add("show");
  }

  private hideAddSection() {
    this.add_section = null;
    this.index_modified_section = null;
    let block = document.getElementById("add_section_box");
    block.classList.remove("show");
  }

  //Informations functions
  private initImagesFromFirebase() {
    this.ImagesToLoad = [];
    this.place.sections.forEach((section, index) => {
      this.ImagesToLoad.push([]);
      section.informations.forEach(info => {
        if (info.type == "file" && info.value != null && info.value != "") {
          this.placesService.getImage(info.value).subscribe(res => {
            this.ImagesToLoad[index].push(res);
            if (this.is_interval) {
              window.clearInterval();
              this.is_interval = false;
            }
          },
          err => {
            this.ImagesToLoad[index].push("assets/imgs/logo.png");
            window.setInterval(this.reinitialise, 5000, this);
            this.is_interval = true;
          });
        } else {
          this.ImagesToLoad[index].push(null);
        }
      });
    });
  }

  private addInformation() {
    if (this.checkFillInfo()) {
      if (this.add_information.type == "search") {
        this.add_information.searchValues = this.fieldsSearch;
        this.fieldsSearch = [];
        this.add_information.value = [];
      }
      console.log(this.add_information);
      this.place.sections[this.index_modified_section].informations.push(this.add_information);
      this.hideAddInformation();
    }
  }

  private modifyInformation() {
    if (this.checkFillInfo()) {
      this.place.sections[this.index_modified_section].informations[this.index_modified_info] = this.add_information;
      this.hideAddInformation();
    }
  }

  private deleteInformation(index_section: number, index_info: number) {
    this.place.sections[index_section].informations.splice(index_info, 1);
  }

  private displayAddInformation(index_section: number, index_information: number = null) {
    if (index_information == null) {
      this.add_information = new PlaceInformation({
        label: "",
        type: "",
        value: "",
        size: 1,
        canModify: true,
        searchValues: []
      });
    } else {
      this.add_information = this.place.sections[index_section].informations[index_information];
      this.index_modified_info = index_information;
    }
    this.index_modified_section = index_section;
    let block = document.getElementById("add_field");
    block.classList.add("show");
  }

  private hideAddInformation() {
    this.add_information = new PlaceInformation({});
    this.index_modified_info = null;
    this.index_modified_section = null;
    let block = document.getElementById("add_field");
    block.classList.remove("show");
  }

  private addFieldToSearch() {
    this.fieldsSearch.push({value: ""});
    //this.add_information.searchValues.push("");
  }

  //Global functions
  private checkFillInfo() {
    if (this.add_information.label == "" || this.add_information.label == null) {
      this.presentToast("Le label est manquant");
      return false;
    }
    if (this.add_information.type == "" || this.add_information.type == null) {
      this.presentToast("Le type est manquant");
      return false;
    }
    return true;
  }

  private async presentToast(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
