import { db } from "./firebase.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("formAgendamento");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;

  // Verifica se já existe agendamento
  const q = query(
    collection(db, "agendamentos"),
    where("data", "==", data),
    where("hora", "==", hora)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    alert("Horário já ocupado!");
    return;
  }

  // Salva no banco
  await addDoc(collection(db, "agendamentos"), {
    nome,
    data,
    hora,
    status: "confirmado"
  });

  alert("Agendamento realizado com sucesso!");
});