import "./App.css";
import { useState, useEffect } from "react";
import Tablero from "./components/Tablero";
import PanelJuego from "./components/PanelJuego";
import cartas from "./data/cartas";

function App() {
  //calculo la cantidad de pares
  const totalParejas = cartas.length / 2;

  //guardamos los identificadores de las cartas descubiertas, el array inicia la partida vacio
  const [cartasDescubiertas, setCartasDescubiertas] = useState([]);

  //aca guardo las cartas que estoy comparando
  const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);

  //aca guardo las parejas encontradas
  const [parejasEncontradas, setParejasEncontradas] = useState([]);

  //marca si se debe bloquear el tablero
  const [tableroBloqueado, setTableroBloqueado] = useState(false);

  //guarda el tiempo disponible para la partida
  const [tiempoRestante, setTiempoRestante] = useState(90);

  //indica si ya empezo la jugada
  const [partidaIniciada, setPartidaIniciada] = useState(false);

  //se gana cuand se encuentran todos los pares
  const victoria = parejasEncontradas.length === totalParejas;

  //derrora por tiemop
  const derrota = tiempoRestante === 0 && !victoria;

  //partida termina por
  const partidaTerminada = victoria || derrota;
  
  useEffect(() => {
    

    //no iniciamos la partida
    if (!partidaIniciada || partidaTerminada) {
      return;
    }

    //se decuenta 1 seg
    const intervalo = setInterval(() => {
      setTiempoRestante((tiempoAnterior) =>
      Math.max(tiempoAnterior - 1, 0)//para evitar que el contador baje de 0
    );
    }, 1000);

    //limpio el intervalo
    return () => clearInterval(intervalo);
  }, [partidaIniciada, partidaTerminada]);


  //aca recibe el id de la carta seleccionoada, y se crea otro array con las cartas anteriores y el nuevo
  function descubrirCarta(idCarta) {
    //no deja jugar 
    if (partidaTerminada) {
      return;
    }

    if (tableroBloqueado) {
      return;
    }

    //busco los datos de la carta seleccionada
    const cartaSeleccionada = cartas.find(
      (carta) => carta.id === idCarta
    );

    //evito procesar una carta ya descubierta
    if (cartasDescubiertas.includes(idCarta)) {
      return;
    }

    //evitamos seleccionar una carta cuya pareja ya encontramos
    if (parejasEncontradas.includes(cartaSeleccionada.parejaId)){
      return;
    }
    
    //el tiempo empieza con el priemr clik
    if (!partidaIniciada) {
      setPartidaIniciada(true);
    }

    //muestro la carta seleccionada en el tablero
    setCartasDescubiertas((cartasAnteriores) => [
      ...cartasAnteriores,
      idCarta,
    ]);

    //añado la carta a la jugada actual
    const seleccionActualizada = [
      ...cartasSeleccionadas,
      idCarta,
    ];

    setCartasSeleccionadas(seleccionActualizada);

    //si solo elijo una carta espero la otra
    if (seleccionActualizada.length < 2) {
      return;
    }

    //busco los datos de la primera carta seleccionada
    const primeraCarta = cartas.find(
      (carta) => carta.id === seleccionActualizada[0]
    );

      //compruebo los identificadores de parejas de ambas cartas
      if (primeraCarta.parejaId === cartaSeleccionada.parejaId) {
        //si coinciden guardamos la pareja encontrada
        setParejasEncontradas((parejasAnteriores) => [
          ...parejasAnteriores,
          primeraCarta.parejaId,
        ]);

        //terminao la jugada, cartas visibles
        setCartasSeleccionadas([]);
      } else {
        //si no coinciden, bloqueo el tablero
        setTableroBloqueado(true);

        //dejo las dos cartas visibles por un tiempo
        setTimeout(() => {
          setCartasDescubiertas((cartasAnteriores) =>
            cartasAnteriores.filter(
              (id) => !seleccionActualizada.includes(id)
            )
          );

          //limpio la jugada anterior
          setCartasSeleccionadas([]);

          //vuelvo a poder elegir cartas
          setTableroBloqueado(false);
        }, 1000);
    }
  }

//reiniciamos todo para empezar otra partida
function reiniciarPartida(){
  setCartasDescubiertas([]);
  setCartasSeleccionadas([]);
  setParejasEncontradas([]);
  setTableroBloqueado(false);
  setTiempoRestante(90);
  setPartidaIniciada(false);
}
  
  return (
    <main className="app">
      <header className="app-header">
        <h1>Memotest</h1>
      </header>

      <PanelJuego tiempoRestante={tiempoRestante} />

      {partidaTerminada && (
        <section className="resultado-partida" aria-live="polite">
          {victoria ? (
            <>
              <h2>Ganaste</h2>
            </>
          ) : (
            <>
              <h2>Termino el tiempo</h2>
            </>
          )}

          <button
            type="button"
            className="boton-reiniciar"
            onClick={reiniciarPartida}
          >
            Reiniciar partida
          </button>
        </section>
      )}

      <Tablero 
        cartas={cartas}
        cartasDescubiertas={cartasDescubiertas}
        alDescubrirCarta={descubrirCarta}
      />
    </main>
  );
}

export default App;
