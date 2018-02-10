import { SharedModule } from './../shared/shared.module';
import { DataFormComponent } from './data-form.component';
import { NgModule } from '@angular/core';

import { RecaptchaModule } from 'ng-recaptcha';   // importar o RecaptchaModule

@NgModule({
  imports: [
    SharedModule,
    RecaptchaModule.forRoot()     // adicionar o RecaptchaModule em imports
  ],
  declarations: [
    DataFormComponent
  ]
})
export class DataFormModule { }
