const factors = {
  lampada: { LED: 8, Fluorescente: 18, Incandescente: 32 },
  geladeira: { Inverter: 22, Convencional: 38, Antiga: 52 },
  tv: { LED: 8, LCD: 14, Plasma: 24 },
  solar: { Sim: -18, Não: 0 },
};

const form = document.querySelector("#simulador-form");
const totalEl = document.querySelector("#total-consumo");
const nivelEl = document.querySelector("#nivel-eficiencia");
const dicaEl = document.querySelector("#dica-principal");

function calcular() {
  const lampada = document.querySelector("#lampada").value;
  const geladeira = document.querySelector("#geladeira").value;
  const tv = document.querySelector("#tv").value;
  const solar = document.querySelector("#solar").value;

  const total = Math.max(
    0,
    factors.lampada[lampada] +
      factors.geladeira[geladeira] +
      factors.tv[tv] +
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
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calcular();
});

calcular();
