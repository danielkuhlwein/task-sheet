import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list.component';
import { MaterialModule } from '../material.module';
import { TaskListRoutingModule } from './task-list-routing.module';
import { TaskCardComponent } from './task-card/task-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutofocusDirective } from '../../service/autofocus.directive';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TaskListRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    TaskListComponent,
    TaskCardComponent,
    AutofocusDirective
  ]
})
export class TaskListModule { }
