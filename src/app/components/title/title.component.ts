import { Component, input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-title',
  imports: [],
  templateUrl: './title.component.html',
})
export class TitleComponent implements OnChanges {

  title = input.required<string>();

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges');
    
    for (const inputName in changes) {
      const inputValues = changes[inputName]
      console.log(`Anterior: ${inputValues.previousValue}`);
      console.log(`Actual: ${inputValues.currentValue}`);
      console.log(`¿Es el primer cambio?: ${inputValues.firstChange}`);
    }
  }

}
