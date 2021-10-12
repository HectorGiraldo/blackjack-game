(()=> {
    'use strict'

    let deck = [];
    const   tipos = ['C','D','H','S'],
            especiales = ['A','J','Q','K'];

    let puntosJugadores = [];

    //Referencias del HTML
    const   btnPedir = document.querySelector('#btnPedir'),
            btnDetener = document.querySelector('#btnDetener'),
            btnNuevo = document.querySelector('#btnNuevo'),
            smallPuntos = document.querySelectorAll('small'),
            divCartasJugadores = document.querySelectorAll('.divCartas');

    // SweatAlert
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    //funcion inicializa el deck
    const inicializarJuego = ( numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];

        for ( let i= 0; i< numJugadores; i++ ) {
            puntosJugadores.push(0)
        }

        smallPuntos.forEach( elem => elem.innerText= 0);
        divCartasJugadores.forEach( elem => elem.innerHTML= '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;


    }

    //funcion crea el deck
    const crearDeck = () => {

        deck = []
        for( let i = 2; i<=10; i++) {
            for( let tipo of tipos ) {
                deck.push( i + tipo);
            }

        }

        for ( let tipo of tipos ){
            for( let esp of especiales ){
                deck.push( esp + tipo);
            }
        }
        return _.shuffle(deck);

    }

    //funcion de pedir carta
    const pedirCarta =() => {

        if (deck.length === 0 ) {
            throw 'No hay cartas en el deck';
        }

        return deck.pop();
    }

    //funcion obtiene valor carta
    const valorCarta = (carta) => {

        const valor = carta.substring(0, carta.length -1);
        return (isNaN(valor))?
                ( valor === 'A')? 11 : 10
                : valor * 1

    }

    //funciona para acul=mular puntos ( 0= a primer jugador y ultimo a computadora)
    const acumularPuntos = (carta, turno)=> {

        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        smallPuntos[turno].innerText = `${puntosJugadores[turno]} Puntos`;

        return puntosJugadores[turno];

    }

    const crearCarta = ( carta, turno) => {

        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    const determinarGanador = () => {

        const [ puntosMinimos, puntosComputadora ] = puntosJugadores

        if ( puntosComputadora === puntosMinimos) {
            Toast.fire({
                icon: 'info',
                title: 'Empatados!!!'
            })
        } else if (puntosMinimos > 21 ) {
            Toast.fire({
                icon: 'error',
                title: 'Haz perdido!!!'
            })
        } else if ( puntosComputadora > 21 ) {
            Toast.fire({
                icon: 'success',
                title: 'genial!!!'
            })

        } else {
            Toast.fire({
                icon: 'error',
                title: 'Haz perdido!!!'
            })
        }
    }

    //funcion turno de la computadora 
    const turnoComputadora = ( puntosMinimos ) => {

        let puntosComputadora = 0

        do {

            const carta = pedirCarta();
            puntosComputadora = acumularPuntos( carta, puntosJugadores.length - 1);

            crearCarta( carta, puntosJugadores.length - 1);

            if ( puntosMinimos > 21 ) {
                break;
            }

        } while( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21) );

       determinarGanador();


    }

    //Eventos
    btnPedir.addEventListener('click', ()=> {

       
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos( carta, 0);
        crearCarta( carta, 0);



        if(puntosJugador > 21 ) {

            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);

        } else if ( puntosJugador === 21 ) {
                
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);

        }

    });

    btnDetener.addEventListener('click', ()=> {

        btnDetener.disabled = true;
        btnPedir.disabled = true;
        turnoComputadora( puntosJugadores[0]);

        
    });

    btnNuevo.addEventListener('click', () => {
    
        inicializarJuego();

    });

})()





