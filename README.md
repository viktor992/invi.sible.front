# invi.sible.front

> Visualizaciones embebibles para invi.sible.link

## Deploy

``` bash
# instalación de dependencias
npm install

# se agrega archivo de configuración del proyecto
cd src
cp config.js.example config.js

# si es necesario, modificar el archivo de configuración 
vim config.js
cd ..

# se hace deploy de la aplicación en localhost:8080
npm run dev

# build para producción con minificación
npm run build
```

## Archivo de configuración del proyecto

El archivo de configuración del proyecto (*src/config.js*) debe contener las siguientes propiedades:

 - **serverUrl**: Url del servidor de donde se obtendrán los datos.
 - **countries**: Array de objetos que especifican los campaigns que se
   consultarán al servidor y los nombres asociados a dichos campaigns.

Consulte el archivo *src/config.js.example* para ver una configuración de ejemplo.

## Visualizaciones implementadas

 - **RadarChart**: Accesible desde la ruta */radar-chart*. Pueden pasarse los
   siguientes queryparams:

        width: integer que especifica el ancho del contenedor del gráfico en pixeles.
        height: integer que especifica el  largo del contenedor del gráfico en pixeles.
        size: integer que especifica el área total del contenedor del gráfico en pixeles (podría ser superior o inferior a width x height).
        initialZoom: float que determina la zoom con el que se verá el gráfico inicialmente.
        shownAxes: array que determina qué companies se utilizarán como ejes del gráfico (ej: Google). Por defecto se muestran todas las companies.
        shownItems: array que determina los datos de qué campaigns se mostrarán (especificado a partir del name, ej: Paraguay)
        legendText: texto a mostrar como título de la leyenda.

>Este gráfico muestra los datos del servicio *api/v1/surface/*.

 - **SunburstChart**: Accesible desde la ruta /*sunburst-chart*. Pueden
   pasarse los siguientes queryparams:

        width: integer que especifica el ancho del contenedor del gráfico en pixeles.
        height: integer que especifica el  largo del contenedor del gráfico en pixeles.
        radius: integer que controla el radio de la circunferencia, por ende afecta al tamaño del gráfico y a la separación entre capas.
        initialScale: float que determina la escala (o el zoom) con el que se verá el gráfico inicialmente.
        shownItems: array que determina los datos de qué campaigns se mostrarán (especificado a partir del name, ej: Paraguay)
        layers: array que determina qué campos de la respuesta del servicio consultado se utilizarán como layers (o capas) del gráfico. El orden de aparición de los campos en este array determina el orden de aparición de capas en el gráfico.
        centerLabel: string que determina el texto que se mostrará en el centro del gráfico       
        computeSize: booleano que determina si el tamaño de los nodos de la última capa depende de la cantidad de apariciones. En caso contrario todos los nodos de la última capa tendrán el mismo tamaño.

>Este gráfico muestra los datos del servicio *api/v1/extended/*.

## Demo de gráficos embebidos

Para ver una demostración sobre cómo embeber los gráficos implementados en otras páginas, descargar el archivo *iframes.html* y abrirlo en el navegador.