let graficos = {};

function formatearMoneda(valor) {
    let valorRedondeado = Math.round(valor);
    let valorTexto = valorRedondeado.toString();
    let resultado = "";
    let contador = 0;
    
    for (let i = valorTexto.length - 1; i >= 0; i--) {
        if (contador === 3) {
            resultado = "." + resultado;
            contador = 0;
        }
        resultado = valorTexto[i] + resultado;
        contador = contador + 1;
    }
    
    return "$" + resultado;
}

function calcularInversion() {
    let monto = parseFloat(document.getElementById('inv_monto').value);
    let tasa = parseFloat(document.getElementById('inv_tasa').value);
    let anios = parseFloat(document.getElementById('inv_anios').value);
    let frecuencia = parseFloat(document.getElementById('inv_frecuencia').value);

    if (!monto || !tasa || !anios) {
        document.getElementById('inv_resultado').innerHTML = '<span class="alerta">Por favor, completa todos los campos.</span>';
        return;
    }

    let r = tasa / 100;
    let n = frecuencia;
    let t = anios;
    let valorFinal = monto * Math.pow((1 + r / n), n * t);
    let ganancia = valorFinal - monto;
    let rentabilidad = (ganancia / monto) * 100;

    let resultado = "Inversion inicial: " + formatearMoneda(monto) + "<br>";
    resultado = resultado + "Valor final: " + formatearMoneda(valorFinal) + "<br>";
    resultado = resultado + "Ganancia: " + formatearMoneda(ganancia) + "<br>";
    resultado = resultado + "Rentabilidad: " + rentabilidad.toFixed(2) + "%";
    
    document.getElementById('inv_resultado').innerHTML = resultado;

    let labels = [];
    let datos = [];
    for (let i = 0; i <= anios; i++) {
        labels.push("Año " + i);
        datos.push(monto * Math.pow((1 + r / n), n * i));
    }

    dibujarGrafico('inv_grafico', labels, datos, 'Crecimiento de la inversion', '#60a5fa');
}

function calcularAhorro() {
    let actual = parseFloat(document.getElementById('ah_actual').value);
    let meta = parseFloat(document.getElementById('ah_meta').value);

    if (!actual || !meta) {
        document.getElementById('ah_resultado').innerHTML = '<span class="alerta">Por favor, completa todos los campos.</span>';
        return;
    }

    let porcentaje = (actual / meta) * 100;
    let falta = meta - actual;

    let mensaje = '';
    if (porcentaje >= 100) {
        mensaje = 'Felicidades! Has alcanzado tu meta.';
    } else if (porcentaje >= 75) {
        mensaje = 'Muy bien! Estas cerca de tu objetivo.';
    } else if (porcentaje >= 50) {
        mensaje = 'Vas por buen camino, sigue ahorrando.';
    } else {
        mensaje = 'Aun falta bastante, no te desanimes.';
    }

    let resultado = mensaje + "<br>";
    resultado = resultado + "Progreso: " + porcentaje.toFixed(1) + "%" + "<br>";
    resultado = resultado + "Monto ahorrado: " + formatearMoneda(actual) + "<br>";
    resultado = resultado + "Meta: " + formatearMoneda(meta) + "<br>";
    resultado = resultado + "Falta: " + formatearMoneda(falta);
    
    document.getElementById('ah_resultado').innerHTML = resultado;

    dibujarGraficoDona('ah_grafico', actual, falta, meta);
}

function simularRiesgo() {
    let capital = parseFloat(document.getElementById('r_capital').value);
    let mu = parseFloat(document.getElementById('r_mu').value) / 100;
    let sigma = parseFloat(document.getElementById('r_sigma').value) / 100;
    let anios = parseFloat(document.getElementById('r_anios').value);
    let n = parseInt(document.getElementById('r_n').value);

    if (!capital || !mu || !sigma || !anios || !n) {
        document.getElementById('r_resultado').innerHTML = '<span class="alerta">Por favor, completa todos los campos.</span>';
        return;
    }

    let resultados = [];
    for (let i = 0; i < n; i++) {
        let valorActual = capital;
        for (let j = 0; j < anios; j++) {
            let z = boxMullerTransform();
            let retorno = mu + sigma * z;
            valorActual = valorActual * (1 + retorno);
        }
        resultados.push(valorActual);
    }

    resultados.sort(function(a, b) {
        return a - b;
    });
    
    let var95 = resultados[Math.floor(n * 0.05)];
    let var99 = resultados[Math.floor(n * 0.01)];
    let mediana = resultados[Math.floor(n * 0.5)];
    
    let suma = 0;
    for (let i = 0; i < resultados.length; i++) {
        suma = suma + resultados[i];
    }
    let promedio = suma / n;
    
    let peor = resultados[0];
    let mejor = resultados[n - 1];

    let resultado = "Capital inicial: " + formatearMoneda(capital) + "<br>";
    resultado = resultado + "Valor esperado: " + formatearMoneda(promedio) + "<br>";
    resultado = resultado + "Mediana: " + formatearMoneda(mediana) + "<br>";
    resultado = resultado + "VaR 95%: " + formatearMoneda(var95) + "<br>";
    resultado = resultado + "VaR 99%: " + formatearMoneda(var99) + "<br>";
    resultado = resultado + "Peor escenario: " + formatearMoneda(peor) + "<br>";
    resultado = resultado + "Mejor escenario: " + formatearMoneda(mejor);
    
    document.getElementById('r_resultado').innerHTML = resultado;

    dibujarHistograma('r_grafico', resultados, capital);
}

function calcularProyeccion() {
    let capital = parseFloat(document.getElementById('pr_capital').value);
    let aporte = parseFloat(document.getElementById('pr_aporte').value);
    let tasa = parseFloat(document.getElementById('pr_tasa').value) / 100;
    let anios = parseFloat(document.getElementById('pr_anios').value);

    if (!capital || !aporte || !tasa || !anios) {
        document.getElementById('pr_resultado').innerHTML = '<span class="alerta">Por favor, completa todos los campos.</span>';
        return;
    }

    let meses = anios * 12;
    let tasaMensual = tasa / 12;
    let labels = [];
    let datos = [];
    let valorActual = capital;

    labels.push('Inicio');
    datos.push(valorActual);

    for (let i = 1; i <= meses; i++) {
        valorActual = valorActual * (1 + tasaMensual) + aporte;
        if (i % 12 === 0 || i === meses) {
            labels.push("Año " + Math.floor(i / 12));
            datos.push(valorActual);
        }
    }

    let totalAportado = capital + (aporte * meses);
    let gananciaIntereses = valorActual - totalAportado;

    let resultado = "Capital inicial: " + formatearMoneda(capital) + "<br>";
    resultado = resultado + "Total aportado: " + formatearMoneda(totalAportado) + "<br>";
    resultado = resultado + "Ganancia por intereses: " + formatearMoneda(gananciaIntereses) + "<br>";
    resultado = resultado + "Valor final: " + formatearMoneda(valorActual);
    
    document.getElementById('pr_resultado').innerHTML = resultado;

    dibujarGrafico('pr_grafico', labels, datos, 'Proyeccion con aportes', '#34d399');
}

function dibujarGrafico(canvasId, labels, datos, titulo, color) {
    let ctx = document.getElementById(canvasId);
    
    if (graficos[canvasId]) {
        graficos[canvasId].destroy();
    }

    graficos[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: titulo,
                data: datos,
                backgroundColor: color + '33',
                borderColor: color,
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#e5e7eb' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#a7b0c0' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: {
                    ticks: { color: '#a7b0c0' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });
}

function dibujarGraficoDona(canvasId, actual, falta, meta) {
    let ctx = document.getElementById(canvasId);
    
    if (graficos[canvasId]) {
        graficos[canvasId].destroy();
    }

    let faltaReal = falta;
    if (falta < 0) {
        faltaReal = 0;
    }

    graficos[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ahorrado', 'Falta'],
            datasets: [{
                data: [actual, faltaReal],
                backgroundColor: ['#34d399', '#1e293b'],
                borderColor: ['#34d399', '#334155'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#e5e7eb' }
                }
            }
        }
    });
}

function dibujarHistograma(canvasId, resultados, capital) {
    let ctx = document.getElementById(canvasId);
    
    let bins = 30;
    let min = resultados[0];
    let max = resultados[0];
    
    for (let i = 1; i < resultados.length; i++) {
        if (resultados[i] < min) {
            min = resultados[i];
        }
        if (resultados[i] > max) {
            max = resultados[i];
        }
    }
    
    let binSize = (max - min) / bins;
    
    let histogram = [];
    let labels = [];
    
    for (let i = 0; i < bins; i++) {
        histogram.push(0);
        labels.push(Math.round(min + i * binSize));
    }
    
    for (let i = 0; i < resultados.length; i++) {
        let binIndex = Math.floor((resultados[i] - min) / binSize);
        if (binIndex >= bins) {
            binIndex = bins - 1;
        }
        histogram[binIndex] = histogram[binIndex] + 1;
    }
    
    if (graficos[canvasId]) {
        graficos[canvasId].destroy();
    }

    graficos[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frecuencia de escenarios',
                data: histogram,
                backgroundColor: '#60a5fa88',
                borderColor: '#60a5fa',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#e5e7eb' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#a7b0c0' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: {
                    ticks: { 
                        color: '#a7b0c0',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });
}

function boxMullerTransform() {
    let u1 = Math.random();
    let u2 = Math.random();
    let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0;
}