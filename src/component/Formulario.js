import React,{ useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Axios from 'axios';
import ProTypes from 'prop-types';
import Error from './Error';
import useMoneda from '../hooks/useMoneda';
import useCriptomoneda from '../hooks/useCriptomoneda';



const Boton = styled.input`
    margin-top:  10px;
    font-weight: bold;
    font-size: 2opx;
    padding: 10px;
    background-color: #66a2fe;
    border: nonel;
    width: 100%;
    border-radius: 10px;
    color: #FFF;
    transition: background-color .3s ease;

    &:hover{
        background-color: #326ac0;
        cursor: pointer;

    }
`;

const Formulario = ({ guardarMoneda, guardarCriptomoneda }) => {

    // State del lista de criptomonedas
    const [ listacripto , guardarCriptomonedas ] = useState([]);
    const [ error, guardarError ] = useState(false);

    const MONEDAS = [
        { codigo: 'DOP', nombre: 'Peso Dominicano'},
        { codigo: 'USD', nombre: 'Dolar de Estados Unidos'},
        { codigo: 'MXN', nombre: 'Peso  Mexicano'},
        { codigo: 'EUR', nombre: 'Euro'},
        { codigo: 'GBP', nombre: 'Libra Esterlina'}  
    ]
    
    // Utilizar useMoneda
    const [ moneda, SelectMoneda ] = useMoneda('Elige tu moneda','',MONEDAS);
    
    // Utilizar useCriptomoneda
    const [ criptomoneda, SelectCripto ] = useCriptomoneda('Elige tu Critpmoneda','',listacripto);



    // Ejecutar llamado a la API
    useEffect(()=>{
        const  consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

            const resultado = await Axios.get(url);

            guardarCriptomonedas(resultado.data.Data);
        }
        consultarAPI()
    },[]);

    // cuando el usuario hace submit
    const cotizarMoneda  = e => {
        e.preventDefault();

        // validar si amnbos campos estan lleno
        if(moneda === '' || criptomoneda === ''){
            guardarError(true);
            return;
        }
        
        // pasar los datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);

        
    }

    return ( 
        <form
            onSubmit={cotizarMoneda}
        >

            {error ? <Error mensaje='Todos los campos son obligatorios'/> : null}
            
            <SelectMoneda />

            <SelectCripto />


            <Boton 
                type='submit'
                value='Calcular'
            />
        </form>
     );
}
 
Formulario.proTypes = {
    guardarMoneda: ProTypes.func.isRequired,
    guardarCriptomoneda: ProTypes.func.isRequired
}
export default Formulario;