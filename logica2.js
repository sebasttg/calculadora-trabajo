let valorActual = "0";
        let operadorActual = "";
        let valorAnterior = "";
        let nuevoNumero = true;

        function actualizarPantalla() {
            document.getElementById("pantalla").innerText = valorActual;
        }

        function agregarNumero(numero) {
            if (nuevoNumero) {
                valorActual = numero;
                nuevoNumero = false;
            } else {
                if (valorActual === "0" && numero !== ".") {
                    valorActual = numero;
                } else {
                    valorActual = valorActual + numero;
                }
            }
            actualizarPantalla();
        }

        function agregarOperador(operador) {
            if (valorAnterior !== "" && operadorActual !== "" && !nuevoNumero) {
                calcular();
            }
            
            operadorActual = operador;
            valorAnterior = valorActual;
            nuevoNumero = true;
        }

        function calcular() {
            if (operadorActual === "" || valorAnterior === "") {
                return;
            }

            let num1 = parseFloat(valorAnterior);
            let num2 = parseFloat(valorActual);
            let resultado = 0;

            if (operadorActual === "+") {
                resultado = num1 + num2;
            } else if (operadorActual === "-") {
                resultado = num1 - num2;
            } else if (operadorActual === "*") {
                resultado = num1 * num2;
            } else if (operadorActual === "/") {
                if (num2 === 0) {
                    valorActual = "Error";
                    actualizarPantalla();
                    return;
                }
                resultado = num1 / num2;
            }

            valorActual = resultado.toString();
            operadorActual = "";
            valorAnterior = "";
            nuevoNumero = true;
            actualizarPantalla();
        }

        function limpiar() {
            valorActual = "0";
            operadorActual = "";
            valorAnterior = "";
            nuevoNumero = true;
            actualizarPantalla();
        }

        function calcularRaiz() {
            let num = parseFloat(valorActual);
            if (num < 0) {
                valorActual = "Error";
            } else {
                valorActual = Math.sqrt(num).toString();
            }
            nuevoNumero = true;
            actualizarPantalla();
        }

        function calcularPotencia() {
            let num = parseFloat(valorActual);
            valorActual = (num * num).toString();
            nuevoNumero = true;
            actualizarPantalla();
        }

        function calcularSeno() {
            let num = parseFloat(valorActual);
            let radianes = num * Math.PI / 180;
            valorActual = Math.sin(radianes).toFixed(8);
            nuevoNumero = true;
            actualizarPantalla();
        }

        function calcularCoseno() {
            let num = parseFloat(valorActual);
            let radianes = num * Math.PI / 180;
            valorActual = Math.cos(radianes).toFixed(8);
            nuevoNumero = true;
            actualizarPantalla();
        }

        function calcularTangente() {
            let num = parseFloat(valorActual);
            let radianes = num * Math.PI / 180;
            valorActual = Math.tan(radianes).toFixed(8);
            nuevoNumero = true;
            actualizarPantalla();
        }

        function agregarPi() {
            valorActual = Math.PI.toString();
            nuevoNumero = true;
            actualizarPantalla();
        }
