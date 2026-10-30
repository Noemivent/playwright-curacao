# Plan de pruebas E2E – La Curacao Guatemala

## Application Overview

Tienda en línea pública La Curacao Guatemala (https://www.lacuracaonline.com/guatemala/, Magento). El plan cubre 10 casos E2E de solo navegación: categorías (Línea blanca, Televisores, Celulares), búsqueda (con y sin resultados), detalle de producto, carrito (agregar, cambiar cantidad, eliminar, totales) y llegada a Pago. Fuera de alcance: compras reales, login con credenciales y envío de formularios con datos personales. Notas de estabilidad: el sitio carga JavaScript tarde; el botón 'Realizar pago' necesita reintento con expect(...).toPass(); los botones 'Agregar al carrito' del listado aparecen con retraso. Cada test empieza con carrito vacío (contexto nuevo).

## Test Scenarios

### 1. La Curacao Guatemala

**Seed:** `tests/seed.spec.ts`

#### 1.1. Navegar a la categoría Línea blanca desde el home

**File:** `tests/curacao/navegar-linea-blanca.spec.ts`

**Steps:**
  1. Abrir /guatemala/
    - expect: El título de la página contiene 'La Curacao Guatemala'
  2. Click en el link 'Línea blanca' del menú del home
    - expect: La URL contiene /c/linea-blanca
    - expect: El título contiene 'Línea Blanca'
    - expect: El breadcrumb muestra 'Línea Blanca'

#### 1.2. Navegar a Televisores desde el home

**File:** `tests/curacao/navegar-televisores.spec.ts`

**Steps:**
  1. Abrir /guatemala/
    - expect: El home carga
  2. Click en el link 'Televisores' del home
    - expect: La URL contiene /c/tecnologia/tv-y-video
  3. Abrir la subcategoría /guatemala/c/tecnologia/tv-y-video/televisores
    - expect: El título contiene 'Televisores'
    - expect: El breadcrumb muestra 'Televisores'
    - expect: Se muestra un contador 'N productos' con N > 0
    - expect: Se listan links de producto que terminan en /p

#### 1.3. Navegar a la categoría Celulares desde el home

**File:** `tests/curacao/navegar-celulares.spec.ts`

**Steps:**
  1. Abrir /guatemala/
    - expect: El home carga
  2. Click en el link 'Celulares' del home
    - expect: La URL contiene /c/telefonia/celulares-y-telefonos/celulares
    - expect: El título contiene 'Celulares'
    - expect: Se muestra un contador 'N productos' con N > 0

#### 1.4. Buscar un producto existente (refrigeradora)

**File:** `tests/curacao/buscar-con-resultados.spec.ts`

**Steps:**
  1. Abrir /guatemala/, escribir 'refrigeradora' en el combobox 'Search' y presionar Enter
    - expect: La URL contiene /search/refrigeradora
    - expect: El breadcrumb muestra "Resultados de búsqueda para: 'refrigeradora'"
    - expect: Se muestra 'resultados de "refrigeradora"' y un contador 'N productos' con N > 0
    - expect: El primer producto listado contiene 'Refrigeradora' en su nombre

#### 1.5. Buscar un texto sin resultados

**File:** `tests/curacao/buscar-sin-resultados.spec.ts`

**Steps:**
  1. Abrir /guatemala/, escribir 'xqzwvk123' en el combobox 'Search' y presionar Enter
    - expect: La URL contiene /search/xqzwvk123
    - expect: Se muestra '0 productos'
    - expect: Se muestra el heading 'Tu búsqueda no ha dado resultados.'

#### 1.6. Ver el detalle de un producto de Línea blanca

**File:** `tests/curacao/detalle-producto.spec.ts`

**Steps:**
  1. Abrir /guatemala/c/linea-blanca y hacer click en el primer producto del listado
    - expect: La URL termina en /p
  2. Revisar la página de producto
    - expect: Se muestra un h1 con el nombre del producto
    - expect: Se muestra un precio con formato Q#,###.##
    - expect: Se muestra el botón 'Agregar al carrito'

#### 1.7. Agregar un producto al carrito desde la página de producto

**File:** `tests/curacao/agregar-al-carrito.spec.ts`

**Steps:**
  1. Abrir el primer producto de /guatemala/c/linea-blanca
    - expect: Se muestra la página de detalle
  2. Click en 'Agregar al carrito' (el primero, del producto principal)
    - expect: Aparece el panel con 'Tu producto se agregó al carrito.'
    - expect: Aparece el link 'Ver mi carrito (1)'

#### 1.8. Cambiar la cantidad de un producto en el carrito

**File:** `tests/curacao/cambiar-cantidad-carrito.spec.ts`

**Steps:**
  1. Agregar el primer producto de Línea blanca al carrito y click en 'Ver mi carrito (1)'
    - expect: La URL contiene /checkout/cart/
    - expect: El spinbutton 'Cantidad' vale 1
  2. Guardar el 'Total del pedido', cambiar 'Cantidad' a 2 y presionar Enter
    - expect: El spinbutton 'Cantidad' vale 2 tras recargar el carrito
    - expect: El 'Total del pedido' es el doble del precio unitario
    - expect: El contador del minicarrito muestra 2

#### 1.9. Eliminar un producto del carrito

**File:** `tests/curacao/eliminar-del-carrito.spec.ts`

**Steps:**
  1. Agregar el primer producto de Línea blanca al carrito y click en 'Ver mi carrito (1)'
    - expect: El carrito muestra el producto
  2. Click en el link 'Eliminar' del producto
    - expect: Se muestra 'No tienes ningún producto en tu bolsa.'
    - expect: Se muestra el link para continuar comprando

#### 1.10. Verificar totales del carrito y llegar a Pago

**File:** `tests/curacao/totales-y-pago.spec.ts`

**Steps:**
  1. Agregar el primer producto de Línea blanca al carrito y click en 'Ver mi carrito (1)'
    - expect: El 'Resumen de compra' muestra 'Precio' y 'Total del pedido'
    - expect: El 'Total del pedido' es igual al precio del producto en la tabla (sin envío aún)
  2. Click en 'Realizar pago' (reintentar con expect.toPass porque el JS carga tarde)
    - expect: La URL contiene /checkout/#shipping
    - expect: Se muestra 'Identifícate'
    - expect: No se envía ningún formulario
