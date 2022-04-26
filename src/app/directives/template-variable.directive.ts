import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface TemplateVariableContext<T> {
  ngVar: T | undefined;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngVar]',
})
export class TemplateVariableDirective<T> {
  private context: TemplateVariableContext<T> = { ngVar: undefined };

  constructor(viewContainer: ViewContainerRef, templateRef: TemplateRef<TemplateVariableContext<T>>) {
    viewContainer.createEmbeddedView(templateRef, this.context);
  }

  @Input() set ngVar(value: T) {
    this.context.ngVar = value;
  }
}
