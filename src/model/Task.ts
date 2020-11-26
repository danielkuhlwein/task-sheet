import { TaskState } from '../enums';

export class Task {

  /**
   * The id of the Task.
   */
  id!: number;

  /**
   * The name of the Task. The thing there is to do.
   */
  name: string | undefined;

  /**
   * The description of the Task. More details about the thing to do and/or how to do it.
   */
  description: string | undefined;

  /**
   * The estimate of estimate of Task represented as a number in minutes.
   */
  estimate: number | undefined;

  /**
   * The state of the Task represented by the TaskState enum.
   */
  state = TaskState.Planned;

  constructor() {
    this.id = 1;
  }
}
