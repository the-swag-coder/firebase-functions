import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {FireBaseService, IUser} from './services/fire-base.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public form: FormGroup;

  public userList: IUser[] = [];
  public userDetails: IUser;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private fireBaseService: FireBaseService
  ) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.fireBaseService.getUsers().subscribe((res: any[]) => {
      this.userList = res.map((user) => {
        return {
          id: user.id,
          name: user.data.name,
          email: user.data.email
        };
      });
    });
  }

  openModal(content: TemplateRef<any>, userId: string): void {
    this.userDetails = this.userList.find((user: IUser) => user.id === userId);

    this.formInit(this.userDetails);
    this.modalService.open(content, {backdrop: 'static', centered: true});
  }

  formInit(data: IUser): void {
    this.form = this.fb.group({
      name: [data ? data.name : '', Validators.required],
      email: [data ? data.email : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ])
      ]
    });
  }

  addUser(): void {
    this.fireBaseService.addUser(this.form.value).subscribe(() => {
      this.getUsers();
    });
  }

  updateUser(userId: string): void {
    this.fireBaseService.updateUser(userId, this.form.value).subscribe(() => {
      this.getUsers();
    });
  }

  deleteUser(userId: string): void {
    this.fireBaseService.deleteUser(userId).subscribe(() => {
      this.getUsers();
    });
  }

}
