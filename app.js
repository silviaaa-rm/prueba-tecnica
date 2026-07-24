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
