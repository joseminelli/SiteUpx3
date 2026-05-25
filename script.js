const factors = {
  lampada: { LED: 8, Fluorescente: 18, Incandescente: 32 },
  geladeira: { Inverter: 22, Convencional: 38, Antiga: 52 },
  tv: { LED: 8, LCD: 14, Plasma: 24 },
  solar: { Sim: -18, Não: 0 },
};

const standardHours = { lampada: 4, geladeira: 24, tv: 4 };

const form = document.querySelector("#simulador-form");
const totalEl = document.querySelector("#total-consumo");
const nivelEl = document.querySelector("#nivel-eficiencia");
const dicaEl = document.querySelector("#dica-principal");
const aguaEl = document.querySelector("#total-agua");
const totalCustoEl = document.querySelector("#total-custo");
const custoEletricaEl = document.querySelector("#total-custo-eletrica");
const custoAguaEl = document.querySelector("#total-custo-agua");

const tarifaEletricaInput = document.querySelector("#tarifa-eletrica");
const tarifaAguaInput = document.querySelector("#tarifa-agua");
const custoPorPessoaEl = document.querySelector("#custo-por-pessoa");

let consumoChart = null;

function calcular() {
  const lampada = document.querySelector("#lampada").value;
  const geladeira = document.querySelector("#geladeira").value;
  const tv = document.querySelector("#tv").value;
  const solar = document.querySelector("#solar").value;

  const moradores = parseInt(document.querySelector("#moradores").value, 10) || 1;
  const rawAgua = parseFloat(document.querySelector("#agua").value);

  const perPersonM3 = 4.5; // m³ per person per month (default assumption)
  const agua = (isNaN(rawAgua) || rawAgua <= 0) ? moradores * perPersonM3 : rawAgua;

  const lampHoras = parseFloat(document.querySelector("#lampada-horas").value) || standardHours.lampada;
  const geladeiraHoras = parseFloat(document.querySelector("#geladeira-horas").value) || standardHours.geladeira;
  const tvHoras = parseFloat(document.querySelector("#tv-horas").value) || standardHours.tv;

  const total = Math.max(
    0,
    factors.lampada[lampada] * (lampHoras / standardHours.lampada) +
      factors.geladeira[geladeira] * (geladeiraHoras / standardHours.geladeira) +
      factors.tv[tv] * (tvHoras / standardHours.tv) +
      factors.solar[solar],
  );

  const nivel = total <= 40 ? "A" : total <= 75 ? "B" : "C";
  const dicas = [];

  if (lampada !== "LED") dicas.push("Troque a lâmpada por LED.");
  if (geladeira === "Antiga") dicas.push("Troque a geladeira por uma inverter.");
  if (tv === "Plasma") dicas.push("Substitua a TV plasma por um modelo LED.");
  if (solar === "Não") dicas.push("Considere energia solar para reduzir o gasto.");

  if (!dicas.length) {
    dicas.push("Boa combinação de equipamentos.", "Mantenha hábitos de uso consciente.");
  }

  totalEl.textContent = `${total} kWh/mês`;
  nivelEl.textContent = nivel;
  dicaEl.innerHTML = dicas.map((dica) => `<li>${dica}</li>`).join("");
  const aguaPerPerson = (agua / moradores) || 0;
  aguaEl.textContent = `${agua} m³/mês (${aguaPerPerson.toFixed(2)} m³/pessoa)`;

  // Custos
  const tarifaEletrica = parseFloat(tarifaEletricaInput.value) || 0;
  const tarifaAgua = parseFloat(tarifaAguaInput.value) || 0;
  const custoEletrica = +(total * tarifaEletrica).toFixed(2);
  const custoAgua = +(agua * tarifaAgua).toFixed(2);
  const custoTotal = +(custoEletrica + custoAgua).toFixed(2);

  totalCustoEl.textContent = `R$ ${custoTotal.toFixed(2).replace('.',',')}`;
  custoEletricaEl.textContent = `R$ ${custoEletrica.toFixed(2).replace('.',',')}`;
  custoAguaEl.textContent = `R$ ${custoAgua.toFixed(2).replace('.',',')}`;
  const custoPorPessoa = moradores ? +(custoTotal / moradores).toFixed(2) : 0;
  custoPorPessoaEl.textContent = `R$ ${custoPorPessoa.toFixed(2).replace('.',',')}`;

  // Dados para gráfico (quebra por equipamento)
  const lampKwh = +(factors.lampada[lampada] * (lampHoras / standardHours.lampada)).toFixed(2);
  const geladeiraKwh = +(factors.geladeira[geladeira] * (geladeiraHoras / standardHours.geladeira)).toFixed(2);
  const tvKwh = +(factors.tv[tv] * (tvHoras / standardHours.tv)).toFixed(2);
  // For chart, show solar as a positive reduction bar (don't display negative values)
  const solarReduction = factors.solar[solar] < 0 ? Math.abs(factors.solar[solar]) : 0;

  const labels = ['Lâmpada','Geladeira','TV','Redução solar'];
  const data = [lampKwh, geladeiraKwh, tvKwh, solarReduction];

  // Renderiza/atualiza Chart.js
  const ctx = document.getElementById('consumo-chart').getContext('2d');
  if (consumoChart) {
    consumoChart.data.labels = labels;
    consumoChart.data.datasets[0].data = data;
    consumoChart.update();
  } else {
    consumoChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'kWh/mês',
          data,
          backgroundColor: ['#7ce3c2', '#45d6a8', '#9fe8d7', '#ffd166'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calcular();
});

calcular();
