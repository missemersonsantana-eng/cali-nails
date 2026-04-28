import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  where,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const servicoSelect = document.getElementById("servico");
const dataInput = document.getElementById("data");
const horariosDiv = document.getElementById("horarios");
const horaSelecionadaInput = document.getElementById("horaSelecionada");

let servicos = [];

async function carregarServicos() {
  const snapshot = await getDocs(collection(db, "servicos"));

  snapshot.forEach(doc => {
    const servico = { id: doc.id, ...doc.data() };
    servicos.push(servico);

    const option = document.createElement("option");
    option.value = doc.id;
    option.textContent = `${servico.nome} - R$ ${servico.preco}`;

    servicoSelect.appendChild(option);
  });
}

carregarServicos();

async function carregarHorarios() {
  const data = dataInput.value;
  const servicoId = servicoSelect.value;

  if (!data || !servicoId) return;

  horariosDiv.innerHTML = "Carregando...";

  const horariosSnap = await getDocs(
    query(collection(db, "horarios"), where("data", "==", data))
  );

  if (horariosSnap.empty) {
    horariosDiv.innerHTML = "Nenhum horário disponível.";
    return;
  }

  const horariosBase = horariosSnap.docs[0].data().horarios;

  const agendamentosSnap = await getDocs(
    query(collection(db, "agendamentos"), where("data", "==", data))
  );

  let ocupados = [];

  agendamentosSnap.forEach(doc => {
    ocupados.push(doc.data().hora);
  });

  horariosDiv.innerHTML = "";

  horariosBase.forEach(hora => {
    const btn = document.createElement("button");
    btn.innerText = hora;

    if (ocupados.includes(hora)) {
      btn.disabled = true;
      btn.style.background = "#ccc";
    } else {
      btn.onclick = () => {
        horaSelecionadaInput.value = hora;

        document.querySelectorAll("#horarios button").forEach(b => {
          b.classList.remove("selecionado");
        });

        btn.classList.add("selecionado");
      };
    }

    horariosDiv.appendChild(btn);
  });
}

dataInput.addEventListener("change", carregarHorarios);
servicoSelect.addEventListener("change", carregarHorarios);

document.getElementById("formAgendamento").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const data = dataInput.value;
  const hora = horaSelecionadaInput.value;
  const servico = servicos.find(s => s.id === servicoSelect.value);

  if (!hora) {
    alert("Selecione um horário!");
    return;
  }

  await addDoc(collection(db, "agendamentos"), {
    nomeCliente: nome,
    data,
    hora,
    servicoNome: servico.nome,
    preco: servico.preco,
    status: "confirmado"
  });

  alert("Agendamento realizado!");
});