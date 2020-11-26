import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskState } from '../../enums';
import { environment } from '../../environments/environment';
import { Task } from '../../model/Task';
import { TaskStatus } from '../../model/TaskStatus';
import { ssAnimations } from '../../service/animations';
import { TaskService } from '../../service/task-service.service';
import { Util } from '../../service/utility.service';

@Component({
  selector: 'dk-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  animations: [
    ssAnimations.rotateSlideInOut,
    ssAnimations.fadeInOut
  ]
})
export class TaskListComponent {

  /**
   * The list of tasks.
   */
  taskList = new Array<Task>();

  /**
   * The current status of all tasks in the list.
   */
  taskStatus!: TaskStatus;

  /**
   * The dynamic padding-top used by content below the toolbar
   * to accommodate for the sticky toolbar.
   */
  paddingTop = '88px';

  /**
   * Controls when to show the status toolbar row.
   */
  showStatus = false;

  /**
   * Tied to environment.production to control if the getSampleData button is shown.
   */
  isProd = environment.production;

  /**
   * A handle on the toolbar element (read as ElementRef)
   * primarily used to retrieve clientHeight of the element.
   */
  @ViewChild('toolbar', { read: ElementRef }) toolbar!: ElementRef<HTMLElement>;

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) { }

  /**
   * Retrieves sample tasks from the API, and afterwards updates the status.
   */
  getSampleData(): void {
    this.taskService.getSampleData().subscribe(data => {
      this.taskList = data;
      this.updateStatus();
    }, err => {
      this.snackBar.open('Error getting sample data');
    });
  }

  /**
   * Updates the status based on all tasks in the task list,
   * by totalling the hours per task state.
   */
  updateStatus(): void {
    this.taskStatus = new TaskStatus();
    this.taskList.forEach(task => {
      switch (task.state) {
        case TaskState.Planned:
          if (task.estimate) {
            this.taskStatus.plannedEstimate += task.estimate / 60;
          }
          break;
        case TaskState.InProgress:
          if (task.estimate) {
            this.taskStatus.inProgressEstimate += task.estimate / 60;
          }
          break;
        case TaskState.Completed:
          if (task.estimate) {
            this.taskStatus.completedEstimate += task.estimate / 60;
          }
          break;
      }
    });

    // Round hours to the nearest decimal
    this.taskStatus.plannedEstimate = Util.round(this.taskStatus.plannedEstimate, 2);
    this.taskStatus.inProgressEstimate = Util.round(this.taskStatus.inProgressEstimate, 2);
    this.taskStatus.completedEstimate = Util.round(this.taskStatus.completedEstimate, 2);

    // Only show the status once it exists for the first time
    if (!this.showStatus) {
      this.showStatus
        = this.taskStatus.plannedEstimate
        + this.taskStatus.inProgressEstimate
        + this.taskStatus.completedEstimate > 0;
      setTimeout(() => {
        this.setpaddingTop();
      });
    }
  }

  /**
   * Called on window:resize to dynamically adjust the padding of content below
   * the toolbar, based on the current height of the toolbar.
   */
  setpaddingTop(): void {
    const newPaddingTop = (this.toolbar.nativeElement.clientHeight + 24) + 'px';
    if (this.paddingTop !== newPaddingTop) {
      this.paddingTop = newPaddingTop;
    }
  }

  /**
   * Adds a new Task to the task list.
   */
  addTask(): void {
    this.taskList.push(new Task());
  }

  /**
   * Removes the specified task from wherever it is in the list.
   * @param taskToDelete The task to be removed
   */
  removeTask(taskToDelete: Task): void {
    this.taskList.splice(this.taskList.indexOf(taskToDelete), 1);
    this.updateStatus();
  }

}
