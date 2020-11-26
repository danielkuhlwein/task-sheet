import { Directive, ElementRef, Input, OnInit } from '@angular/core';

// source: https://stackoverflow.com/questions/41873893/angular2-autofocus-input-element
@Directive({
  selector: '[dkAutoFocus]'
})
export class AutofocusDirective implements OnInit {

  private focus = true;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    if (this.focus) {
      // Otherwise Angular throws error: Expression has changed after it was checked.
      window.setTimeout(() => {
        this.el.nativeElement.focus();
        // For SSR (server side rendering) this is not safe. Use: https://github.com/angular/angular/issues/15008#issuecomment-285141070)
      });
    }
  }

  @Input() set autofocus(condition: boolean) {
    this.focus = condition !== false;
  }

}