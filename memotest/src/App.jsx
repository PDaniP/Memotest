import "./App.css";
import { useEffect, useRef, useState } from "react";
import Tablero from "./components/Tablero";
import PanelJuego from "./components/PanelJuego";
import cartas from "./data/cartas";

//mezclamos el mazo recibido sin modificar los datos originales.
function mezclarCartas(cartasNivel) {
  const mazoMezclado = [...cartasNivel];

  for (let indice = mazoMezclado.length - 1; indice > 0; indice -= 1) {
    const indiceAleatorio = Math.floor(Math.random() * (indice + 1));
    [mazoMezclado[indice], mazoMezclado[indiceAleatorio]] = [
      mazoMezclado[indiceAleatorio],
      mazoMezclado[indice],
    ];
  }

  return mazoMezclado;
}

function App() {
  //definimos las dimensiones y la cantidad de parejas de cada dificultad
  const niveles = [
    { id: 1, nombre: "Nivel 1", filas: 3, columnas: 4, parejas: 6 },
    { id: 2, nombre: "Nivel 2", filas: 4, columnas: 5, parejas: 10 },
    { id: 3, nombre: "Nivel 3", filas: 5, columnas: 6, parejas: 15 },
  ];

  //guardamos la modalidad, el nivel elegido y las cartas de esa partida
  const [modoJuego, setModoJuego] = useState(null);
  //guardamos el formato del duelo y las rondas ganadas en una serie
  const [modoDuelo, setModoDuelo] = useState(null);
  const [victoriasRondas, setVictoriasRondas] = useState([0, 0]);
  const [nivelJuego, setNivelJuego] = useState(null);
  const [cartasPartida, setCartasPartida] = useState([]);
  const totalParejas = nivelJuego?.parejas ?? 0;

  //conservamos los identificadores de las cartas visibles y de la jugada actual
  const [cartasDescubiertas, setCartasDescubiertas] = useState([]);
  const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);

  // Registramos las parejas encontradas y los puntos de cada jugador.
  const [parejasEncontradas, setParejasEncontradas] = useState([]);
  // Guardamos qué jugador encontró cada pareja para colorear sus cartas.
  const [jugadorPorPareja, setJugadorPorPareja] = useState({});
  const [puntajes, setPuntajes] = useState([0, 0]);

  // Contamos los intentos fallidos de cada jugador para desempatar el duelo.
  const [fallas, setFallas] = useState([0, 0]);

  // Controlamos el turno, el bloqueo temporal y el tiempo de la partida.
  const [jugadorActual, setJugadorActual] = useState(0);
  const [tableroBloqueado, setTableroBloqueado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(90);
  const [partidaIniciada, setPartidaIniciada] = useState(false);
  const timeoutDesempate = useRef(null);

  // Finalizamos cuando se encuentran todas las parejas o se agota el tiempo.
  const victoria = parejasEncontradas.length === totalParejas;
  const derrota = tiempoRestante === 0;
  const partidaTerminada = Boolean(modoJuego) && partidaIniciada && (victoria || derrota);

  // Seleccionamos el modo antes de mostrar las dificultades disponibles.
  function seleccionarModo(modo) {
    clearTimeout(timeoutDesempate.current);
    setModoJuego(modo);
    setModoDuelo(null);
    setVictoriasRondas([0, 0]);
    setNivelJuego(null);
    setCartasPartida([]);
    setCartasDescubiertas([]);
    setCartasSeleccionadas([]);
    setParejasEncontradas([]);
    setJugadorPorPareja({});
    setPuntajes([0, 0]);
    setFallas([0, 0]);
    setJugadorActual(0);
    setTableroBloqueado(false);
    setTiempoRestante(90);
    setPartidaIniciada(false);
  }

  // Iniciamos el formato elegido y preparamos el primer tablero de la serie.
  function seleccionarModoDuelo(modo) {
    setModoDuelo(modo);
    setVictoriasRondas([0, 0]);

    if (modo === "mejor-de-3") {
      seleccionarNivel(niveles[0]);
    }
  }

  // Creamos un mazo con las parejas necesarias e iniciamos el nivel elegido.
  function seleccionarNivel(nivel) {
    clearTimeout(timeoutDesempate.current);
    setNivelJuego(nivel);
    setCartasPartida(mezclarCartas(cartas.slice(0, nivel.parejas * 2)));
    setCartasDescubiertas([]);
    setCartasSeleccionadas([]);
    setParejasEncontradas([]);
    setJugadorPorPareja({});
    setPuntajes([0, 0]);
    setFallas([0, 0]);
    setJugadorActual(0);
    setTableroBloqueado(false);
    setTiempoRestante(90);
    setPartidaIniciada(false);
  }

  // Actualizamos el temporizador solo mientras una partida está activa.
  useEffect(() => {
    if (!partidaIniciada || partidaTerminada) {
      return undefined;
    }

    const intervalo = setInterval(() => {
      setTiempoRestante((tiempoAnterior) => Math.max(tiempoAnterior - 1, 0));
    }, 1000);

    return () => clearInterval(intervalo);
  }, [partidaIniciada, partidaTerminada]);

  // Limpiamos cualquier espera pendiente al desmontar la aplicación.
  useEffect(() => () => clearTimeout(timeoutDesempate.current), []);

  // Procesamos una carta y resolvemos cada intento cuando se elige la segunda.
  function descubrirCarta(idCarta) {
    if (!modoJuego || partidaTerminada || tableroBloqueado) {
      return;
    }

    const cartaSeleccionada = cartasPartida.find((carta) => carta.id === idCarta);

    if (
      cartasDescubiertas.includes(idCarta) ||
      parejasEncontradas.includes(cartaSeleccionada.parejaId)
    ) {
      return;
    }

    // El reloj comienza con la primera carta elegida.
    if (!partidaIniciada) {
      setPartidaIniciada(true);
    }

    setCartasDescubiertas((cartasAnteriores) => [...cartasAnteriores, idCarta]);

    const seleccionActualizada = [...cartasSeleccionadas, idCarta];
    setCartasSeleccionadas(seleccionActualizada);

    if (seleccionActualizada.length < 2) {
      return;
    }

    const primeraCarta = cartasPartida.find(
      (carta) => carta.id === seleccionActualizada[0],
    );

    // Al acertar, sumamos una pareja y el turno queda en el mismo jugador.
    if (primeraCarta.parejaId === cartaSeleccionada.parejaId) {
      setParejasEncontradas((parejasAnteriores) => [
        ...parejasAnteriores,
        primeraCarta.parejaId,
      ]);
      // Asociamos la pareja al jugador que acertó solo en el modo de duelo.
      if (modoJuego === "duelo") {
        setJugadorPorPareja((parejasAnteriores) => ({
          ...parejasAnteriores,
          [primeraCarta.parejaId]: jugadorActual,
        }));
      }
      setPuntajes((puntajesAnteriores) =>
        puntajesAnteriores.map((puntaje, indice) =>
          indice === jugadorActual ? puntaje + 1 : puntaje,
        ),
      );
      setCartasSeleccionadas([]);
      return;
    }

    // Si no coinciden, mostramos ambas cartas y luego pasamos el turno.
    if (modoJuego === "duelo") {
      setFallas((fallasAnteriores) =>
        fallasAnteriores.map((fallasJugador, indice) =>
          indice === jugadorActual ? fallasJugador + 1 : fallasJugador,
        ),
      );
    }

    setTableroBloqueado(true);
    timeoutDesempate.current = setTimeout(() => {
      setCartasDescubiertas((cartasAnteriores) =>
        cartasAnteriores.filter((id) => !seleccionActualizada.includes(id)),
      );
      setCartasSeleccionadas([]);
      setTableroBloqueado(false);

      if (modoJuego === "duelo") {
        setJugadorActual((jugadorAnterior) => (jugadorAnterior === 0 ? 1 : 0));
      }
    }, 1000);
  }

  // Volvemos a la selección de modalidad después de terminar una partida.
  function volverASeleccion() {
    clearTimeout(timeoutDesempate.current);
    setModoJuego(null);
    setModoDuelo(null);
    setVictoriasRondas([0, 0]);
    setNivelJuego(null);
    setCartasPartida([]);
    setCartasDescubiertas([]);
    setCartasSeleccionadas([]);
    setParejasEncontradas([]);
    setJugadorPorPareja({});
    setPuntajes([0, 0]);
    setFallas([0, 0]);
    setJugadorActual(0);
    setTableroBloqueado(false);
    setTiempoRestante(90);
    setPartidaIniciada(false);
  }

  // Resolvemos el duelo por parejas y usamos las fallas para desempatar.
  const resultadoDuelo =
    puntajes[0] !== puntajes[1]
      ? puntajes[0] > puntajes[1]
        ? "Ganó el jugador 1"
        : "Ganó el jugador 2"
      : fallas[0] !== fallas[1]
        ? fallas[0] < fallas[1]
          ? "Ganó el jugador 1 por tener menos fallas"
          : "Ganó el jugador 2 por tener menos fallas"
        : "Empate";

  // Identificamos al ganador de esta ronda con las mismas reglas del duelo rápido.
  const ganadorRonda =
    puntajes[0] !== puntajes[1]
      ? puntajes[0] > puntajes[1]
          ? 0
          : 1
      : fallas[0] !== fallas[1]
          ? fallas[0] < fallas[1]
            ? 0
            : 1
          : null;

  // Sumamos provisionalmente la ronda actual para saber si la serie ya terminó.
  const victoriasActualizadas = victoriasRondas.map((victorias, indice) =>
    partidaTerminada && ganadorRonda === indice ? victorias + 1 : victorias,
  );
  const serieTerminada =
    modoDuelo === "mejor-de-3" &&
    partidaTerminada &&
    (Math.max(...victoriasActualizadas) >= 2 || nivelJuego?.id === 3);
  const ganadorSerie =
    victoriasActualizadas[0] === victoriasActualizadas[1]
      ? null
      : victoriasActualizadas[0] > victoriasActualizadas[1]
          ? 0
          : 1;

  // Preparamos el siguiente nivel y conservamos las victorias acumuladas.
  function avanzarSiguienteRonda() {
    setVictoriasRondas(victoriasActualizadas);
    const siguienteNivel = niveles.find((nivel) => nivel.id === nivelJuego.id + 1);
    seleccionarNivel(siguienteNivel);
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Memotest</h1>
      </header>

      {!modoJuego ? (
        // Permitimos elegir entre una partida individual y un duelo local.
        <section className="seleccion-modo" aria-labelledby="titulo-modos">
          <h2 id="titulo-modos">¿Cómo querés jugar?</h2>
          <p>Elegí una modalidad para comenzar una nueva partida.</p>
          <div className="opciones-modo">
            <button
              type="button"
              className="boton-modo"
              onClick={() => seleccionarModo("solitario")}
            >
              Jugar en solitario
            </button>
            <button
              type="button"
              className="boton-modo"
              onClick={() => seleccionarModo("duelo")}
            >
              Jugar 1 contra 1
            </button>
          </div>
        </section>
      ) : modoJuego === "duelo" && !modoDuelo ? (
        // Permitimos elegir entre un duelo rápido y una serie al mejor de tres.
        <section className="seleccion-modo" aria-labelledby="titulo-modo-duelo">
          <h2 id="titulo-modo-duelo">Elegí el modo de juego</h2>
          <p>Seleccioná cómo quieren competir los dos jugadores.</p>
          <div className="opciones-modo">
            <button
              type="button"
              className="boton-modo"
              onClick={() => seleccionarModoDuelo("rapida")}
            >
              Partida rápida
              <span className="detalle-nivel">Una partida en el nivel que elijan.</span>
            </button>
            <button
              type="button"
              className="boton-modo"
              onClick={() => seleccionarModoDuelo("mejor-de-3")}
            >
              Al mejor de 3
              <span className="detalle-nivel">
                Niveles 1 y 2, y nivel 3 si hace falta.
              </span>
            </button>
          </div>
          <button
            type="button"
            className="boton-volver"
            onClick={() => {
              setModoJuego(null);
              setModoDuelo(null);
            }}
          >
            Volver a elegir modalidad
          </button>
        </section>
      ) : !nivelJuego ? (
        // Ofrecemos las tres dimensiones de tablero para el modo seleccionado.
        <section className="seleccion-modo" aria-labelledby="titulo-niveles">
          <h2 id="titulo-niveles">Elegí la dificultad</h2>
          <p>
            {modoJuego === "solitario"
              ? "Seleccioná el tamaño del tablero para jugar en solitario."
              : "Seleccioná el tamaño del tablero para el duelo."}
          </p>
          <div className="opciones-modo">
            {niveles.map((nivel) => (
              <button
                key={nivel.id}
                type="button"
                className="boton-modo"
                onClick={() => seleccionarNivel(nivel)}
              >
                {nivel.nombre}
                <span className="detalle-nivel">
                  {nivel.filas} x {nivel.columnas} · {nivel.parejas} parejas
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="boton-volver"
            onClick={() => {
              if (modoJuego === "duelo") {
                setModoDuelo(null);
              } else {
                setModoJuego(null);
              }
            }}
          >
            {modoJuego === "duelo" ? "Volver al modo de juego" : "Volver a elegir modalidad"}
          </button>
        </section>
      ) : (
        <>
          {/* Mostramos tiempo, parejas y puntajes según la modalidad elegida. */}
          <PanelJuego
            tiempoRestante={tiempoRestante}
            modoJuego={modoJuego}
            modoDuelo={modoDuelo}
            nivelJuego={nivelJuego}
            parejasEncontradas={parejasEncontradas.length}
            totalParejas={totalParejas}
            puntajes={puntajes}
            fallas={fallas}
            jugadorActual={jugadorActual}
            victoriasRondas={
              partidaTerminada ? victoriasActualizadas : victoriasRondas
            }
          />

          {/* Informamos el resultado y permitimos volver a elegir una modalidad. */}
          {partidaTerminada && (
            <section className="resultado-partida" aria-live="polite">
              {modoJuego === "solitario" ? (
                <h2>{victoria ? "¡Ganaste!" : "Se terminó el tiempo"}</h2>
              ) : modoDuelo === "mejor-de-3" && serieTerminada ? (
                <>
                  <h2>
                    {ganadorSerie === null
                      ? "La serie terminó en empate"
                      : `¡Ganó el jugador ${ganadorSerie + 1} la serie!`}
                  </h2>
                  <p>
                    Rondas ganadas: jugador 1, {victoriasActualizadas[0]} · jugador 2,{" "}
                    {victoriasActualizadas[1]}
                  </p>
                  <p>Resultado de la última ronda: {resultadoDuelo}</p>
                  <p>
                    Parejas en esta ronda: jugador 1, {puntajes[0]} · jugador 2,{" "}
                    {puntajes[1]}
                  </p>
                </>
              ) : (
                <>
                  <h2>
                    {modoDuelo === "mejor-de-3"
                      ? `Terminó el nivel ${nivelJuego.id}`
                      : victoria
                        ? "¡Terminó la partida!"
                        : "Se terminó el tiempo"}
                  </h2>
                  <p>
                    {modoDuelo === "mejor-de-3"
                      ? `Resultado de la ronda: ${resultadoDuelo}`
                      : resultadoDuelo}
                  </p>
                  <p>
                    Jugador 1: {puntajes[0]} parejas · Jugador 2: {puntajes[1]} parejas
                  </p>
                  <p>
                    Fallas: jugador 1, {fallas[0]} · jugador 2, {fallas[1]}
                  </p>
                  {modoDuelo === "mejor-de-3" && (
                    <p>
                      Rondas ganadas: jugador 1, {victoriasActualizadas[0]} · jugador 2,{" "}
                      {victoriasActualizadas[1]}
                    </p>
                  )}
                </>
              )}
              <button
                type="button"
                className="boton-reiniciar"
                onClick={
                  modoDuelo === "mejor-de-3" && !serieTerminada
                    ? avanzarSiguienteRonda
                    : volverASeleccion
                }
              >
                {modoDuelo === "mejor-de-3" && !serieTerminada
                  ? `Continuar al nivel ${nivelJuego.id + 1}`
                  : "Elegir otra modalidad"}
              </button>
            </section>
          )}

          {/* El tablero recibe el mazo mezclado y las cartas que siguen visibles. */}
          <Tablero
            cartas={cartasPartida}
            columnas={nivelJuego.columnas}
            cartasDescubiertas={cartasDescubiertas}
            jugadorPorPareja={modoJuego === "duelo" ? jugadorPorPareja : {}}
            alDescubrirCarta={descubrirCarta}
          />
        </>
      )}
    </main>
  );
}

export default App;
