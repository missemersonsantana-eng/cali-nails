import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const tabela = document.getElementById("tabelaAgendamentos");
const totalEl = document.getElementById("totalAgendamentos");
const faturamentoEl = document.getElementById("faturamento");

async function carregarDashboard() {
  const snapshot = await getDocs(collection(db, "agendamentos"));

  tabela.innerHTML = "";

  let total = 0;
  let faturamento = 0;

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    total++;

    if (data.status === "confirmado") {
      faturamento += data.preco || 0;
    }

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${data.nomeCliente}</td>
      <td>${data.data}</td>
      <td>${data.hora}</td>
      <td>${data.servicoNome}</td>
      <td><span class="status ${data.status}">${data.status}
      </span></td>
      <td>
        <button class="cancelar" data-id="${docSnap.id}">
          Cancelar
        </button>
      </td>
    `;

    tabela.appendChild(tr);
  });

  totalEl.innerText = total;
  faturamentoEl.innerText = "R$ " + faturamento;

  ativarBotoes();
}

function ativarBotoes() {
  document.querySelectorAll(".cancelar").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute("data-id");

      await updateDoc(doc(db, "agendamentos", id), {
        status: "cancelado"
      });

      carregarDashboard();
    };
  });
}

carregarDashboard();