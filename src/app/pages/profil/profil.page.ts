import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertController, ToastController, LoadingController, NavController } from '@ionic/angular';

import { StoriesService } from './../../services/stories.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  files: any;
  keys: Array<string> = [];
  backgroundImages: {} = {};

  createHistoryForm: FormGroup;
  createHistoryError: string;

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
    private storiesService: StoriesService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public fb: FormBuilder,
    private loadingController: LoadingController
    ) {
      this.createHistoryForm = fb.group({
        title: new FormControl('', Validators.compose([Validators.required])),
        description: new FormControl('', null),
        image: new FormControl('', null)
      });
    }

  ngOnInit() {
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
    
    this.storiesService.createStories(credentials, this.historyModificationId).then(
      res => {
        if (res) {
          if (this.isModification) {
            this.toastMessage("Votre histoire à été modifié");
          } else {
            this.toastMessage("Votre histoire à été créé");
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
    for(let i = 0; i < this.listImage.length; i += 1) {
      if (this.listImage[i].name != null) {
        this.storiesService.getUrlImage(this.listImage[i].name).subscribe(
          res => {
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

}
