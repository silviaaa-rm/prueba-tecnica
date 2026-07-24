const movements = window.MOVEMENTS;

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

document.querySelector("#record-count").textContent =
  `${movements.length} movimientos disponibles entre enero y junio de 2026.`;

document.querySelector("#raw-rows").innerHTML = movements
  .map(
    (movement) => `
      <tr>
        <td>${movement.movement_date}</td>
        <td>${movement.plant}</td>
        <td>${movement.account_name}</td>
        <td>${movement.article_name}</td>
        <td>${movement.equipment_name ?? "Sin equipo"}</td>
        <td class="${movement.amount < 0 ? "negative" : ""}">
          ${currency.format(movement.amount)}
        </td>
      </tr>
    `,
  )
  .join("");

// Empieza aquí. Agrupa, compara y presenta los datos según tu criterio.


// Resumen general
// Cancelación ya con importe negativo
const totalAmount = movements.reduce(
  (sum, movement) => sum + movement.amount,
  0,
);


const cancellations = movements.filter(
  (movement) => movement.is_cancellation,
);


const cancellationAmount = cancellations.reduce(
  (sum, movement) => sum + Math.abs(movement.amount),
  0,
);

// Mostrar 3 indicadores generales
document.querySelector("#net-total").textContent =
  currency.format(totalAmount);

document.querySelector("#movement-total").textContent =
  movements.length;

document.querySelector("#cancellation-total").textContent =
  currency.format(cancellationAmount);

// Cancelaciones
document.querySelector("#cancellation-count").textContent =
  `${cancellations.length} ${
    cancellations.length === 1 ? "movimiento" : "movimientos"
  }`;



const months = [
  ...new Set(
    movements.map((movement) =>
      movement.movement_date.slice(0, 7),
    ),
  ),
].sort();


const plants = [
  ...new Set(
    movements.map((movement) => movement.plant),
  ),
].sort();

// Relacion  cada mes con Nombre
const monthNames = {
  "2026-01": "Enero",
  "2026-02": "Febrero",
  "2026-03": "Marzo",
  "2026-04": "Abril",
  "2026-05": "Mayo",
  "2026-06": "Junio",
};


// Gasto mensual por planta
function getMonthlyAmounts(plant) {
  return months.map((month) => {
   
    const monthMovements = movements.filter(
      (movement) =>
        movement.plant === plant &&
        movement.movement_date.startsWith(month),
    );

    return monthMovements.reduce(
      (sum, movement) => sum + movement.amount,
      0,
    );
  });
}



// Colores
const plantColors = {
  "Planta Centro": "#17d39b",
  "Planta Norte": "#d4789a",
  "Planta Sur": "#a9d16c",
};


// Datos de la gráfica
const chartData = plants.map((plant) => ({

  label: plant,
  data: getMonthlyAmounts(plant),

  backgroundColor: plantColors[plant],
  borderColor: plantColors[plant],
  borderWidth: 1,
  erRadius: 5,
  maxBarThickness: 38,
  barPercentage: 0.8,
  categoryPercentage: 0.75,
}));


// Comparación

const monthlyChart = new Chart(
  document.querySelector("#monthly-chart"),
  {
    type: "bar",

    data: {
     
      labels: months.map(
        (month) => monthNames[month] ?? month,
      ),

      
      datasets: chartData,
    },

    options: {
      
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },

      plugins: {
        legend: {
          position: "bottom",
        },

        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${
                currency.format(context.parsed.y)
              }`,
          },
        },
      },

      scales: {
       
        x: {
          grid: {
            display: false,
          },
        },

      
        y: {
          beginAtZero: true,

          ticks: {
            callback: (value) => currency.format(value),
          },
        },
      },
    },
  },
);


const plantFilter = document.querySelector("#plant-filter");


plantFilter.addEventListener("change", () => {
  const selectedPlant = plantFilter.value;

  monthlyChart.data.datasets.forEach((dataset) => {
  
     
    dataset.hidden =
      selectedPlant !== "all" &&
      dataset.label !== selectedPlant;
  });

  monthlyChart.update();
});
