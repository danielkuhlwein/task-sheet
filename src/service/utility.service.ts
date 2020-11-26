import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Util {

  /**
   * A handy little round function that takes precision
   * @param value number to round
   * @param precision the number of decimal places to round to
   * @source https://stackoverflow.com/questions/7342957/how-do-you-round-to-1-decimal-place-in-javascript
   */
  public static round(value: number, precision: number): number {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

}
