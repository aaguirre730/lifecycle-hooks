import { afterNextRender, afterRender, Component, effect, OnChanges, OnInit, signal } from '@angular/core';


const log = (... messages:string[]) => {
  console.log(`${messages[0]} %c${messages.slice(1).join(', ')}`,'color:#bada55');
}

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
})


export class HomePageComponent implements OnInit, OnChanges {

  tradicionalProperty = 'Alejandro';
  signalTradicionalProperty = signal<string>('Alejandro');

  constructor(){
    log('Constructor','Se ejecuta cuando Angular instancia el componente.');
  }

  changeTradicional() {
    this.tradicionalProperty = 'Alejandro Aguirre';
  }

  changeSignalTradicional() {
    this.signalTradicionalProperty.set('Alejandro Aguirre');
  }

  basicEffect = effect(( onCleanup) => {
    log('effect','Dispara efectos secundarios.');

    onCleanup(() => {
    log('onCleanup','Se ejecuta cuando el efecto se va a destruir.');
    });
  });

  ngOnInit(){
    log('ngOnInit','Se ejecuta una vez después de que Angular inicializa todos los input del componente.');
  }

  ngOnChanges(){
    log('ngOnChanges','Se ejecuta cada vez que cambian los input del componente.');
  }

  ngDoCheck(){
    log('ngDoCheck','Se ejecuta cada vez que el componente es comprobado por cambios.');
  }

  ngAfterContentInit(){
    log('ngAfterContentInit','Se ejecuta una vez tras inicializar el contenido proyectado (content) del componente.');
  }

  ngAfterContentChecked(){
    log('ngAfterContentChecked','Se ejecuta cada vez que se comprueba el contenido proyectado del componente.');
  }

  ngAfterViewInit(){
    log('ngAfterViewInit','Se ejecuta una vez tras inicializar la vista (view / plantilla) y sus hijos.');
  }

  ngAfterViewChecked(){
    log('ngAfterViewChecked','Se ejecuta cada vez que se comprueba la vista del componente.');
  }

  ngOnDestroy(){
    log('ngOnDestroy','Se ejecuta una vez justo antes de que el componente sea destruido.');
  }

  afterNextRenderEffect = afterNextRender(() => {
    log('afterNextRender','Se ejecuta una vez la próxima vez que todos los componentes se hayan renderizado en el DOM.');
  });

  afterRenderEffect = afterRender(() => {
    log('afterRender','Se ejecuta cada vez que todos los componentes se hayan renderizado en el DOM.');
  });

}
