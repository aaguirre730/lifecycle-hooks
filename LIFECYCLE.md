# Ciclo de Vida de los Componentes en Angular (Component Lifecycle)

El **ciclo de vida** de un componente es la secuencia de pasos que ocurren desde su creación hasta su destrucción. Cada paso representa una parte del proceso de Angular para renderizar componentes y comprobar si hubo cambios a lo largo del tiempo.

* **Hooks de instancia:** Se implementan como **métodos** dentro de la clase del componente.

* **Hooks a nivel de aplicación:** Se implementan como **funciones** que reciben un *callback* (`afterNextRender`, `afterEveryRender`).

> **Nota sobre Detección de Cambios (Change Detection):** Angular recorre el árbol de la aplicación de arriba hacia abajo comprobando los enlaces (*bindings*) de las plantillas. Como este recorrido visita cada componente una sola vez, **evita realizar cambios de estado adicionales en medio del proceso**.

## Tabla Resumen

| Fase | Método / Función | Descripción | 
| ----- | ----- | ----- | 
| **Creación** | `constructor` | Constructor estándar de clases JavaScript. Se ejecuta cuando Angular instancia el componente. | 
| **Detección de Cambios** | `ngOnInit` | Se ejecuta **una vez** después de que Angular inicializa todos los `input` del componente. | 
|  | `ngOnChanges` | Se ejecuta **cada vez** que cambian los `input` del componente. | 
|  | `ngDoCheck` | Se ejecuta **cada vez** que el componente es comprobado por cambios. | 
|  | `ngAfterContentInit` | Se ejecuta **una vez** tras inicializar el contenido proyectado (*content*) del componente. | 
|  | `ngAfterContentChecked` | Se ejecuta **cada vez** que se comprueba el contenido proyectado del componente. | 
|  | `ngAfterViewInit` | Se ejecuta **una vez** tras inicializar la vista (*view* / plantilla) y sus hijos. | 
|  | `ngAfterViewChecked` | Se ejecuta **cada vez** que se comprueba la vista del componente. | 
| **Renderizado** | `afterNextRender` | Se ejecuta **una vez** la próxima vez que todos los componentes se hayan renderizado en el DOM. | 
|  | `afterEveryRender` | Se ejecuta **cada vez** que todos los componentes se hayan renderizado en el DOM. | 
| **Destrucción** | `ngOnDestroy` | Se ejecuta **una vez** justo antes de que el componente sea destruido. | 

## Detalle de los Hooks

### 1. `ngOnInit`

* Se ejecuta **una sola vez**, justo después de que Angular inicializa todos los `input` con sus valores iniciales.

* Ocurre **antes** de que se inicialice la propia plantilla del componente, por lo que es ideal para actualizar el estado interno basándose en los valores iniciales de los `input`.

### 2. `ngOnChanges`

* Se ejecuta cada vez que algún `input` del componente cambia, **antes** de que se compruebe la plantilla del componente.

* Durante la inicialización, el primer `ngOnChanges` se ejecuta **antes** que `ngOnInit`.

#### Inspeccionando cambios (`SimpleChanges`)

Recibe un argumento `SimpleChanges`, que mapea el nombre de cada propiedad `input` a un objeto `SimpleChange` con `previousValue`, `currentValue` y `firstChange`. Puedes tiparlo pasando la clase actual como genérico:

```
import { Component, input, SimpleChanges } from '@angular/core';

@Component({ /* ... */ })
export class UserProfile {
  name = input('');

  ngOnChanges(changes: SimpleChanges<UserProfile>) {
    if (changes.name) {
      console.log(`Anterior: ${changes.name.previousValue}`);
      console.log(`Actual: ${changes.name.currentValue}`);
      console.log(`¿Es el primer cambio?: ${changes.name.firstChange}`);
    }
  }
}

```

> **Importante:** Si un `input` tiene un alias, la clave en `SimpleChanges` seguirá siendo el **nombre de la propiedad en TypeScript**, no el alias.

### 3. `ngOnDestroy` y `DestroyRef`

* `ngOnDestroy` se ejecuta una vez justo antes de destruir el componente (por ejemplo, al ocultarse con `@if` o al navegar a otra ruta).

#### Alternativa moderna: `DestroyRef`

Puedes inyectar `DestroyRef` para registrar callbacks de limpieza sin necesidad de usar el método `ngOnDestroy`. Es muy útil para mantener la lógica de configuración cerca de su limpieza, o para pasarlo a funciones/clases externas.

```
import { Component, DestroyRef, inject } from '@angular/core';

@Component({ /* ... */ })
export class UserProfile {
  constructor() {
    const destroyRef = inject(DestroyRef);

    destroyRef.onDestroy(() => {
      console.log('UserProfile destruido');
    });
  }
}

```

* **Detectar si ya fue destruido:** `DestroyRef` expone la propiedad booleana `destroyRef.destroyed`. Es muy útil en lógica asíncrona o con retrasos para evitar ejecutar código sobre vistas destruidas y prevenir errores como `NG0911: View has already been destroyed`.

### 4. `ngDoCheck`

* Se ejecuta antes de cada comprobación de cambios en la plantilla del componente.

* Permite detectar manualmente cambios de estado que Angular no detecta por sí solo.

* En la inicialización, el primer `ngDoCheck` corre **después** de `ngOnInit`.

*  **Rendimiento:** Se ejecuta con muchísima frecuencia. Evítalo salvo que no haya otra alternativa.

### 5. `ngAfterContentInit` y `ngAfterContentChecked`

Relacionados con los hijos anidados/proyectados dentro del componente (**content**):

* **`ngAfterContentInit`**: Se ejecuta **una vez** tras inicializar el contenido. Útil para leer resultados de *content queries*.

* **`ngAfterContentChecked`**: Se ejecuta **cada vez** que se comprueba el contenido.

*  **Advertencias:**

  * Evita modificar estado que no sea *signal* y que ya haya sido renderizado por un componente ancestro, ya que provocará un `ExpressionChangedAfterItHasBeenCheckedError`.

  * `ngAfterContentChecked` se ejecuta muy frecuentemente; evítalo si es posible por rendimiento.

### 6. `ngAfterViewInit` y `ngAfterViewChecked`

Relacionados con los hijos dentro de la propia plantilla del componente (**view**):

* **`ngAfterViewInit`**: Se ejecuta **una vez** tras inicializar la vista. Útil para leer resultados de *view queries*.

* **`ngAfterViewChecked`**: Se ejecuta **cada vez** que se comprueba la vista.

*  **Advertencias:**

  * Al igual que con *content*, evita modificar estado (no *signal*) ya renderizado para no disparar `ExpressionChangedAfterItHasBeenCheckedError`.

  * `ngAfterViewChecked` tiene un alto impacto en el rendimiento; úsalo solo si es estrictamente necesario.

### 7. `afterNextRender` y `afterEveryRender`

Son funciones independientes (no métodos de clase) a nivel de aplicación que se ejecutan después de que Angular termina de renderizar todos los componentes en el DOM.

* **Contexto:** Deben llamarse dentro de un **contexto de inyección** (normalmente el `constructor`).

* **Uso principal:** Manipulación manual del DOM (APIs nativas del navegador).

* **SSR:** **No se ejecutan** durante el Server-Side Rendering (SSR) ni durante el pre-renderizado en tiempo de compilación.

#### Fases de `after*Render`

Permiten dividir el trabajo en fases para ordenar lecturas y escrituras del DOM y evitar *layout thrashing* (recalculos forzados de diseño). El valor retornado por una fase pasa como parámetro a la siguiente.

Orden de ejecución de las fases:

1. **`earlyRead`**: Leer propiedades/estilos que afectan al layout solo si son estrictamente necesarios para un cálculo posterior. *(Evitar si es posible).*

2. **`write`**: Escribir propiedades/estilos que afectan al layout.

3. **`mixedReadWrite`** *(por defecto)*: Operaciones que leen y escriben a la vez. *(Evitar si es posible; preferir `write` y `read` explícitos).*

4. **`read`**: Leer propiedades geométricas/de layout después de todas las escrituras.

```
import { Component, ElementRef, afterNextRender, inject } from '@angular/core';

@Component({ /* ... */ })
export class UserProfile {
  private prevPadding = 0;
  private elementHeight = 0;

  constructor() {
    const elementRef = inject(ElementRef);
    const nativeElement = elementRef.nativeElement;

    afterNextRender({
      // Fase de escritura
      write: () => {
        const padding = computePadding();
        const changed = padding !== this.prevPadding;
        if (changed) {
          nativeElement.style.padding = padding;
        }
        return changed; // Se pasa a la fase `read`
      },
      // Fase de lectura (después de todas las escrituras)
      read: (didWrite) => {
        if (didWrite) {
          this.elementHeight = nativeElement.getBoundingClientRect().height;
        }
      },
    });
  }
}

```

## Interfaces de Ciclo de Vida

Angular provee interfaces de TypeScript para cada hook (el nombre del método sin el prefijo `ng`, ej. `OnInit`, `OnDestroy`). Implementarlas es opcional, pero recomendado para evitar errores tipográficos:

```
import { Component, OnInit } from '@angular/core';

@Component({ /* ... */ })
export class UserProfile implements OnInit {
  ngOnInit() {
    // Lógica de inicialización
  }
}

```

## Orden de Ejecución

### Durante la inicialización

1. `constructor`

2. **Detección de cambios:**

   * `ngOnChanges`

   * `ngOnInit`

   * `ngDoCheck`

   * `ngAfterContentInit`

   * `ngAfterContentChecked`

   * `ngAfterViewInit`

   * `ngAfterViewChecked`

3. **Renderizado:**

   * `afterNextRender`

   * `afterEveryRender`

### En actualizaciones posteriores

1. **Detección de cambios:**

   * `ngOnChanges`

   * `ngDoCheck`

   * `ngAfterContentChecked`

   * `ngAfterViewChecked`

2. **Renderizado:**

   * `afterEveryRender`

## Orden con Directivas

Cuando aplicas una o más directivas sobre el mismo elemento que un componente (ya sea en la plantilla o mediante `hostDirectives`), **Angular no garantiza ningún orden de ejecución** de un mismo hook entre el componente y sus directivas. Nunca dependas de un orden observado, ya que puede cambiar entre versiones.
