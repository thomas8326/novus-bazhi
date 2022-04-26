import { NgModule } from '@angular/core';

import { TemplateVariableDirective } from './template-variable.directive';

@NgModule({
  declarations: [TemplateVariableDirective],
  exports: [TemplateVariableDirective],
  imports: [],
  providers: [],
})
export class DirectivesModule {}
