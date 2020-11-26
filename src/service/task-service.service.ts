import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Task } from '../model/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  /**
   * Used as an index to serve newly incremented IDs per newly created Task.
   */
  private mockID = 1;

  /**
   * The fake observable used to return in place of the typical http return.
   */
  private successSubject!: BehaviorSubject<number>;

  constructor(private http: HttpClient) {
    this.successSubject = new BehaviorSubject<number>(this.mockID);
  }

  // GET

  /**
   * Returns sample tasks from the mock API.
   */
  public getSampleData(): Observable<[Task]> {
    return this.http.get<[Task]>(environment.apiURL);
  }

  // SAVE

  /**
   * Persists a task to the db.
   * @param task The task to create
   */
  public createTask(task: Task): Observable<number> {
    this.mockID++;
    return this.successSubject.asObservable();
    return this.http.post<any>(`${environment.apiURL}/0`, task);
  }

  /**
   * Persists changes to an existing task to the db.
   * @param task The task to update
   */
  public updateTask(task: Task): Observable<any> {
    return this.successSubject.asObservable();
    return this.http.put<any>(`${environment.apiURL}/${task.id}`, task);
  }

  /**
   * Marks a task as deleted in the db.
   * @param taskID The ID of the task to be marked as deleted
   */
  public deleteTask(taskID: number): Observable<any> {
    return this.successSubject.asObservable();
    return this.http.delete<any>(`${environment.apiURL}/${taskID}`);
  }

}
