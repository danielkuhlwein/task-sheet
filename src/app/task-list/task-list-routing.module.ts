import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskListComponent } from './task-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TaskListComponent
      }
    ],
  },
  {
    path: '**',
    redirectTo: '/errors'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskListRoutingModule { }
