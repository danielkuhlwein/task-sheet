export class TaskStatus {
  plannedEstimate: number;
  inProgressEstimate: number;
  completedEstimate: number;

  constructor() {
    this.plannedEstimate = 0;
    this.inProgressEstimate = 0;
    this.completedEstimate = 0;
  }
}
