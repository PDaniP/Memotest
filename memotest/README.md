# Memotest

Juego de memoria con cartas de temática espacial. Cada partida dura 90 segundos
y el reloj comienza al descubrir la primera carta.

## Modalidades

- **Solitario:** encontrá todas las parejas antes de que se termine el tiempo.
- **1 contra 1:** dos jugadores comparten el teclado o dispositivo y se turnan.
  Cada pareja encontrada suma un punto y permite conservar el turno; si las
  cartas no coinciden, se suma una falla y el turno pasa al otro jugador. Gana
  quien reúna más parejas cuando se complete el tablero o se termine el tiempo.
  Si ambos jugadores encuentran la misma cantidad de parejas, gana quien tenga
  menos fallas; si también empatan en fallas, la partida termina en empate.
  Antes de empezar, se puede elegir una partida rápida en cualquier nivel o
  una serie al mejor de 3: se juega primero el nivel 1 y luego el nivel 2.
  Quien gane ambas rondas se lleva la serie; si después de dos rondas no hay
  ganador, se juega el nivel 3.

## Dificultad

Antes de cada partida, elegí uno de los tres niveles disponibles en cualquiera
de las modalidades:

- **Nivel 1:** tablero de 3 x 4, con 6 parejas.
- **Nivel 2:** tablero de 4 x 5, con 10 parejas.
- **Nivel 3:** tablero de 5 x 6, con 15 parejas.

## Desarrollo

Desde esta carpeta, ejecutá `npm install` para instalar las dependencias y
`npm run dev` para iniciar la aplicación.

Para comprobar los cambios, ejecutá `npm run lint` y `npm run build`.
