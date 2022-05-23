import { NgModule } from '@angular/core';

import { TemplateVariableDirective } from './template-variable.directive';
import { KeyEventDirective } from './key-event.directive';

@NgModule({
  declarations: [TemplateVariableDirective, KeyEventDirective],
  exports: [TemplateVariableDirective, KeyEventDirective],
  imports: [],
  providers: [],
})
export class DirectivesModule { }
