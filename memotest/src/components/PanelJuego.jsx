/*En este componete muestro informacion general de la partida*/

function PanelJuego({ tiempoRestante }) {

    return (
        <section className="panel-juego">
            <div className="dato-juego">
                <span className="etiqueta">Tiempo</span>
                <span className="valor">{tiempoRestante} s</span>
            </div>

            <div className="dato-juego">
                
                <span className="etiqueta">Parejas</span>
                <span className="valor">0 / 3</span>
            </div>
            {/*los valores 90 y 0/3 son temporarles */}
        </section>
    );
}

export default PanelJuego;