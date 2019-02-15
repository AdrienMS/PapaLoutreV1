import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';

import { User } from '../../../models/user';

@Component({
  selector: 'app-not-logged-header',
  templateUrl: './not-logged-header.component.html',
  styleUrls: ['./not-logged-header.component.scss']
})
export class NotLoggedHeaderComponent implements OnInit {
  private currentUser: User = null;
  private connected: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.initUser();
  }

  private initUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      this.userService.checkIfConnected(this.currentUser.token).subscribe(
        res => {
          console.log(res);
          if (!res) {
            this.userService.logout();
            this.currentUser = null;
            this.connected = false;
          } else {
            this.connected = true;
          }
        },
        error => {
          this.userService.logout();
          this.currentUser = null;
          this.connected = false;
        }
      )
    }
  }

  public logout() {
    this.userService.logout()
    this.initUser();
  }

}
