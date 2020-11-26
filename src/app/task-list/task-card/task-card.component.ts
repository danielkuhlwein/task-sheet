import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import confetti from 'canvas-confetti';

import { TaskState } from '../../../enums';
import { Task } from '../../../model/Task';
import { ssAnimations } from '../../../service/animations';
import { TaskService } from '../../../service/task-service.service';

@Component({
  selector: 'dk-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  animations: [
    ssAnimations.taskIn,
    ssAnimations.taskOut
  ]
})
export class TaskCardComponent implements OnInit {

  /**
   * The Task model for this TaskCard, as passed in from the parent taskList.
   */
  @Input() task!: Task;

  /**
   * Event fired to parent upon deletion of the task.
   */
  @Output() onDelete = new EventEmitter<Task>();

  /**
   * Event fired to parent upon:
   * 1. save to estimate value
   * 2. change of task state
   * In order to recalculate the status for possible display in the parent.
   */
  @Output() onUpdateStatus = new EventEmitter<boolean>();

  /**
   * A handle on the state button (read as ElementRef)
   * primarily used to retrieve cords for confetti.
   */
  @ViewChild('stateButton', { read: ElementRef }) stateButton!: ElementRef<HTMLElement>;

  /**
   * The form representing the state of the editable fields of this Task
   * and their validators/requirements.
   */
  form!: FormGroup;

  /**
   * The current status of the [@taskOut] animation for this Task Card.
   */
  taskOutAnimationStatus = 'in';

  /**
   * Represents the current status of network requests being sent to the API
   * to persist info about this Task to the db. Controls whether the loading bar
   * indicator at the bottom of the card is displayed or not.
   */
  loading = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) { }

  /**
   * Initializes the form with the values from `task` input and saves the new task.
   */
  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.task.name, [Validators.required, Validators.maxLength(100)]],
      description: [this.task.description, [Validators.required, Validators.maxLength(250)]]
    });
    this.saveNewTask();
  }

  /**
   * Saves this newly created Task object.
   */
  saveNewTask(): void {
    this.loading = true;
    this.taskService.createTask(this.task).subscribe(data => {
      // success!
      setTimeout(() => {
        this.loading = false;
        this.task.id = data;
      }, 150);
    }, err => {
      this.loading = false;
      this.snackBar.open('Error creating task');
      this.delete(true);
    });
  }

  /**
   * Saves the name of the Task object.
   */
  saveName(): void {
    if (this.form.get('name')?.valid) {
      this.loading = true;
      this.task.name = this.form.get('name')?.value.trim();
      this.taskService.updateTask(this.task).subscribe(data => {
        // success!
        setTimeout(() => {
          this.loading = false;
        }, 150);
      }, err => {
        this.loading = false;
        this.snackBar.open('Error saving name');
        this.task.name = undefined; // show form input again
      });
    }
  }

  /**
   * Saves the description of the Task object.
   */
  saveDescription(): void {
    if (this.form.get('description')?.valid) {
      this.loading = true;
      this.task.description = this.form.get('description')?.value.trim();
      this.taskService.updateTask(this.task).subscribe(data => {
        // success!
        setTimeout(() => {
          this.loading = false;
        }, 150);
      }, err => {
        this.loading = false;
        this.snackBar.open('Error saving description');
        this.task.description = undefined; // show form input again
      });
    }
  }

  /**
   * Saves the estimate of the Task object.
   * @param newEstimate the estimate number (representing minutes) to set for the task
   */
  saveEstimate(newEstimate: number): void {
    if (newEstimate) {
      this.loading = true;
      this.task.estimate = newEstimate;
      this.onUpdateStatus.emit(true);
      this.taskService.updateTask(this.task).subscribe(data => {
        // success!
        setTimeout(() => {
          this.loading = false;
        }, 150);
      }, err => {
        this.loading = false;
        this.snackBar.open('Error saving estimate');
        this.task.estimate = undefined; // show form input again
      });
    }
  }

  /**
   * Updates and saves the state of the Task object.
   * Calls the parent to update and potentially show the status.
   * When task is marked `Completed` it will start animating confetti celebration.
   */
  changeState(): void {
    this.loading = true;
    const prevState = this.task.state;
    switch (this.task.state) {
      case TaskState.Planned:
        this.task.state = TaskState.InProgress;
        break;
      case TaskState.InProgress:
        this.task.state = TaskState.Completed;
        this.celebrate();
        break;
      case TaskState.Completed:
        this.task.state = TaskState.Planned;
        break;
    }
    this.onUpdateStatus.emit(true);
    this.taskService.updateTask(this.task).subscribe(data => {
      // success!
      setTimeout(() => {
        this.loading = false;
      }, 150);
    }, err => {
      this.loading = false;
      this.snackBar.open('Error saving state');
      this.task.state = prevState; // switch back to previous state
    });
  }

  /**
   * Displays the confetti celebration animation which is tied to the location
   * of the state button clicked.
   */
  celebrate(): void {
    const bodyRect = document.body.getBoundingClientRect();
    const elemRect = this.stateButton.nativeElement.getBoundingClientRect();
    const offsetTop = elemRect.top - bodyRect.top;
    const offsetLeft = elemRect.left - bodyRect.left;
    confetti({
      origin: {
        y: ((offsetTop + 30) / window.innerHeight),
        x: ((offsetLeft + 52) / window.innerWidth)
      }
    });
  }

  /**
   * Deletes the task.
   * @param localOnly Used to trigger deletion without sending API request,
   * and without displaying animation. (Used to remove a newly added task
   * that failed to be created via the API request).
   */
  delete(localOnly?: boolean): void {
    if (!localOnly) {

      // Wait for animation to complete before removing from parent list
      this.taskOutAnimationStatus = 'out';
      setTimeout(() => {
        this.taskService.deleteTask(this.task.id).subscribe(data => {
          // success!
          this.onDelete.emit(this.task);
        }, err => {
          this.snackBar.open('Error deleting task');
          this.taskOutAnimationStatus = 'in';
        });
      }, 425);
    } else {
      this.onDelete.emit(this.task);
    }
  }

}
