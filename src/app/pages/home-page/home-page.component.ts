import { Component } from '@angular/core';


const log = (... messages:string[]) => {
  console.log(`${messages[0]} %c${messages.slice(1).join(', ')}`,'color:#bada55');
}

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
})


export class HomePageComponent {

  constructor(){
    log('Constructor','Se ejecuta cuando Angular instancia el componente.');
  }

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

}
