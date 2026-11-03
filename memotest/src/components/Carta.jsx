import './Carta.css';

function Carta({ carta, estaDescubierta, jugadorPareja, alHacerClic }) {
    // Indicamos con una clase qué jugador encontró la pareja en el duelo.
    const claseJugador = jugadorPareja === undefined ? '' : `pareja-jugador-${jugadorPareja + 1}`;

    return (
        <button
            type="button"
            className={`carta ${estaDescubierta ? 'descubierta' : ''} ${claseJugador}`}
            onClick={alHacerClic}
            aria-label={
                jugadorPareja !== undefined
                    ? `Carta ${carta.contenido}, pareja del jugador ${jugadorPareja + 1}`
                    : estaDescubierta
                        ? `Carta ${carta.contenido}`
                        : 'Carta oculta'
            }
        >
            {/*si esta descubierta mostramos el contenido, sino el reverso*/}
            <span className="carta-reverso">
                {estaDescubierta ? carta.contenido : '?'}
            </span>
        </button>
    );
}

export default Carta;