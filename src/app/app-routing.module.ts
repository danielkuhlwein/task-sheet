import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'tasks',
    loadChildren: () => import('./task-list/task-list.module').then(m => m.TaskListModule)
  },
  {
    path: 'errors',
    loadChildren: () => import('./errors/errors.module').then(m => m.ErrorsModule)
  },
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'errors'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
