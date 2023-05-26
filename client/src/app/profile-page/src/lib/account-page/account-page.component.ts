import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent {
  private formBuilder: FormBuilder = inject(FormBuilder);
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/i)
          ]
        ],
        password: [
          '',
          [
            Validators.required,
          ],
        ],
      }
    )
  }


  onSubmit(): void {
    console.log('submit form')

  }

}
