import { Component, OnInit } from '@angular/core';
import { ToastController, DomController, Events } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { CharactersService } from '../../services/characters.service';
import { StoriesService } from '../../services/stories.service';
import { AuthService } from '../../services/auth.service';

import { characterSheet, FieldCharacter, SearchData, FirebaseDatasCharacters} from '../../models/character';

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.page.html',
  styleUrls: ['./character-sheet.page.scss'],
})
export class CharacterSheetPage implements OnInit {
  private story_id: string = null;
  private character_id: string = null;
  private storyInformation = null;

  constructor(
    private charactersService: CharactersService,
    private storiesService: StoriesService,
    private authService: AuthService,
    private events: Events,
    private route: ActivatedRoute) {
      events.subscribe('currentUser', value => {
        //this.initialise();
      });
    }

  ngOnInit() {
    this.story_id = this.route.snapshot.paramMap.get('story_id');
    this.character_id = this.route.snapshot.paramMap.get('character_id');
    this.storiesService.getStoryInfoFromKey(this.story_id).subscribe(
      res => {
        this.storyInformation = res;
        this.events.publish('selectedStory', res);
      },
      err => {
        console.log(err);
      }
    );
  }

}
