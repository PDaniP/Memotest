// Este componente muestra el estado de la partida según la modalidad elegida.
function PanelJuego({
  tiempoRestante,
  modoJuego,
  modoDuelo,
  nivelJuego,
  parejasEncontradas,
  totalParejas,
  puntajes,
  fallas,
  jugadorActual,
  victoriasRondas,
}) {
  return (
    <section className="panel-juego" aria-label="Estado de la partida">
      {/* El tiempo se comparte entre los participantes y limita cada partida. */}
      <div className="dato-juego">
        <span className="etiqueta">Tiempo</span>
        <span className="valor">{tiempoRestante} s</span>
      </div>

      {/* Indicamos el nivel y las dimensiones del tablero durante la partida. */}
      <div className="dato-juego">
        <span className="etiqueta">{nivelJuego.nombre}</span>
        <span className="valor">
          {nivelJuego.filas} x {nivelJuego.columnas}
        </span>
      </div>

      {/* En la serie mostramos cuántas rondas ganó cada jugador. */}
      {modoDuelo === "mejor-de-3" && (
        <div className="dato-juego">
          <span className="etiqueta">Rondas ganadas</span>
          <span className="valor">
            {victoriasRondas[0]} - {victoriasRondas[1]}
          </span>
        </div>
      )}

      {modoJuego === "solitario" ? (
        // En solitario se informa el avance hacia el total de parejas.
        <div className="dato-juego">
          <span className="etiqueta">Parejas</span>
          <span className="valor">
            {parejasEncontradas} / {totalParejas}
          </span>
        </div>
      ) : (
        // En el duelo se resaltan los puntajes y el turno que está activo.
        <>
          <div
            className={`dato-juego jugador-uno ${jugadorActual === 0 ? "jugador-activo" : ""}`}
          >
            <span className="etiqueta">Jugador 1</span>
            <span className="valor">{puntajes[0]} parejas</span>
            <span className="etiqueta">Fallas: {fallas[0]}</span>
          </div>
          <div
            className={`dato-juego jugador-dos ${jugadorActual === 1 ? "jugador-activo" : ""}`}
          >
            <span className="etiqueta">Jugador 2</span>
            <span className="valor">{puntajes[1]} parejas</span>
            <span className="etiqueta">Fallas: {fallas[1]}</span>
          </div>
        </>
      )}
    </section>
  );
}

export default PanelJuego;
