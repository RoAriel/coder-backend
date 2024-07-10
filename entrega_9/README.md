# Implementación de logger

## Consigna

 Basado en nuestro proyecto principal, implementar un logger.

## Aspectos a incluir

+ Definir un sistema de niveles que tenga la siguiente prioridad (de menor a mayor):
    + Fatal
    + Error
    + Warning
    + Info
    + Http
    + Debug

+ Implementar un logger para `desarrollo` y un logger para `producción`.
    + El logger de desarrollo deberá loggear a partir del nivel debug, sólo en consola.
    + El logger del entorno productivo debería loggear sólo a partir de nivel info. 
    Además deberá enviar en un transporte de archivos a partir del nivel de error en un nombre “errors.log”.
+ Agregar logs de valor alto en los puntos importantes de tu servidor (errores, advertencias, etc) y modificar los console.log() habituales que tenemos para que muestren todo a partir de winston.
+ Crear un endpoint /loggerTest que permita probar todos los logs.