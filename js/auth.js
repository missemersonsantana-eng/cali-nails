import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 📌 Inputs
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmarSenha");
const msg = document.getElementById("mensagem");

const btnLogin = document.getElementById("btnLogin");
const btnCadastro = document.getElementById("btnCadastro");

// 🔄 Controle de loading
function setLoading(button, isLoading, texto = "Carregando...") {
  if (isLoading) {
    button.disabled = true;
    button.dataset.textoOriginal = button.innerText;
    button.innerText = texto;
  } else {
    button.disabled = false;
    button.innerText = button.dataset.textoOriginal;
  }
}

// 🔐 LOGIN
if (btnLogin) {
  btnLogin.onclick = async () => {
  msg.innerText = "";
  msg.style.color = "red";

  if (!email.value || !senha.value) {
    msg.innerText = "Preencha email e senha.";
    return;
  }

  setLoading(btnLogin, true);

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      senha.value
    );

    const uid = userCredential.user.uid;

    const userDoc = await getDoc(doc(db, "usuarios", uid));

    if (!userDoc.exists()) {
      msg.innerText = "Usuário sem permissão.";
      setLoading(btnLogin, false);
      return;
    }

    const userData = userDoc.data();

    // 🔀 Redirecionamento
    if (userData.tipo === "admin") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "agendamento.html";
    }

  } catch (error) {
    tratarErro(error);
    setLoading(btnLogin, false);
  }
};

// 🆕 CADASTRO COMPLETO
btnCadastro.onclick = async () => {
  msg.innerText = "";
  msg.style.color = "red";

  // ✅ Validações
  if (!nome.value || !email.value || !senha.value || !confirmarSenha.value) {
    msg.innerText = "Preencha todos os campos.";
    return;
  }

  if (senha.value !== confirmarSenha.value) {
    msg.innerText = "As senhas não coincidem.";
    return;
  }

  if (senha.value.length < 6) {
    msg.innerText = "A senha deve ter no mínimo 6 caracteres.";
    return;
  }

  setLoading(btnCadastro, true);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      senha.value
    );

    const uid = userCredential.user.uid;

    // 💾 Salvar usuário no Firestore
    await setDoc(doc(db, "usuarios", uid), {
      nome: nome.value,
      email: email.value,
      tipo: "cliente",
      criadoEm: serverTimestamp()
    });

    msg.style.color = "green";
    msg.innerText = "Conta criada com sucesso! Faça login.";

    // 🧹 Limpar campos
    nome.value = "";
    email.value = "";
    senha.value = "";
    confirmarSenha.value = "";

  } catch (error) {
    tratarErro(error);
  }

  setLoading(btnCadastro, false);
  };
};

// ⚠️ Tratamento de erros amigável
function tratarErro(error) {
  msg.style.color = "red";

  switch (error.code) {
    case "auth/user-not-found":
      msg.innerText = "Usuário não encontrado.";
      break;

    case "auth/wrong-password":
      msg.innerText = "Senha incorreta.";
      break;

    case "auth/email-already-in-use":
      msg.innerText = "Este email já está em uso.";
      break;

    case "auth/invalid-email":
      msg.innerText = "Email inválido.";
      break;

    case "auth/weak-password":
      msg.innerText = "Senha muito fraca.";
      break;

    default:
      msg.innerText = "Erro inesperado. Tente novamente.";
  }
}