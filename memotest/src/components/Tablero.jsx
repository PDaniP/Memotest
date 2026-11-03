import Carta from "./Carta.jsx";

/*el tablero recibira una lista de cartas mediante props,
recorre esa lista y crear un componente carta para cada elemento */

function Tablero({
  cartas,
  columnas,
  cartasDescubiertas,
  jugadorPorPareja,
  alDescubrirCarta,
}) {
  return (
    <section
      className="tablero"
      aria-label="Tablero de cartas"
      style={{ "--columnas-tablero": columnas }}
    >
      {/* El tablero usa las columnas indicadas por el nivel seleccionado. */}
      {/*map() transforma cada elemento del array en una carta*/}
      {cartas.map((carta) => (
        <Carta 
            key={carta.id} 
            carta={carta}
            estaDescubierta={cartasDescubiertas.includes(carta.id)}//includes() comprueba si el identificador de esta carta esta dentro del array cartasDescubiertas
            jugadorPareja={jugadorPorPareja[carta.parejaId]}
            alHacerClic={() => alDescubrirCarta(carta.id)}
         />
      ))}
    </section>
  );
}

export default Tablero;
