import './Carta.css';

function Carta({ carta, estaDescubierta, alHacerClic }) {

    return (
        <button
            type="button"
            className={`carta ${estaDescubierta ? 'descubierta' : ''}`}
            onClick={alHacerClic}
            aria-label={estaDescubierta ? `Carta ${carta.contenido}` : 'Carta oculta'}
        >
            {/*si esta descubierta mostramos el contenido, sino el reverso*/}
            <span className="carta-reverso">
                {estaDescubierta ? carta.contenido : '?'}
            </span>
        </button>
    );
}

export default Carta;