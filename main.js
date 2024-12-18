let cotizacionOficial = 365;
let cotizacionBlue = 750;

async function obtenerCotizacion() {
    try {
        const res = await fetch('https://api.bluelytics.com.ar/v2/latest');
        const data = await res.json();
        cotizacionOficial = data.oficial.value_sell;
        cotizacionBlue = data.blue.value_sell;

        document.getElementById('dolarOficial').innerText = `${cotizacionOficial} ARS`;
        document.getElementById('dolarBlue').innerText = `${cotizacionBlue} ARS`;
    } catch {
        console.error("Error al obtener cotización.");
    }
}

function cambiarOpcion() {
    const opcion = document.querySelector('input[name="tipoEntrada"]:checked').value;
    document.getElementById('campoLink').classList.toggle('hidden', opcion === 'manual');
    document.getElementById('campoManual').classList.toggle('hidden', opcion === 'link');
    document.getElementById('resultado').classList.add('hidden');
}

async function obtenerPrecio() {
    let precioARS = document.getElementById('precioManual').value;
    precioARS = parseFloat(precioARS.replace(/\./g, '').replace(',', '.'));
    if (isNaN(precioARS) || precioARS <= 0) {
        alert("Ingrese un precio válido.");
        return;
    }
    calcularImpuestos(precioARS);
}

function calcularImpuestos(precioARS) {
    const iva = precioARS * 0.21;
    const precioUSD = precioARS / cotizacionOficial;
    const excedenteUSD = Math.max(precioUSD - 400, 0);
    const aranceles = excedenteUSD * 0.50 * cotizacionOficial;

    const totalFinal = precioARS + iva + aranceles;

    document.getElementById('resultado').innerHTML = `
        <p><strong>Precio Base:</strong> ${precioARS.toFixed(2)} ARS</p>
        <p><strong>IVA (21%):</strong> ${iva.toFixed(2)} ARS</p>
        <p><strong>Aranceles Aproximados:</strong> ${aranceles.toFixed(2)} ARS</p>
        <p class="text-lg font-bold mt-2 text-yellow-500">Total Final: ${totalFinal.toFixed(2)} ARS</p>
    `;
    document.getElementById('resultado').classList.remove('hidden');
}

window.onload = obtenerCotizacion;
