import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appKeyEvent]'
})
export class KeyEventDirective {

  @Output() enter = new EventEmitter();

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.enter.emit();
    }
  }
}
