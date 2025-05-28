async function sha256(text) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Usuários autorizados (login:senha em SHA-256)
const usuariosAutorizados = {
  "Designer": "6d42e7b5fcf8ee30523896b3d81a5b80eb0a78699ce944c1b4ad44ac3c87df76", // Lopes@2025
  "Admin": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4", // 1234
  "Teste": "11c8273f9e9a73543fc153692a964b3d859ac7d1b78f681bfa4ec1938db5b845"  // teste@2025
};

async function fazerLogin() {
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("senha").value.trim();

  if (!user || !pass) {
    document.getElementById("erro-login").textContent = "Preencha usuário e senha.";
    return;
  }

  const hash = await sha256(pass);
  if (usuariosAutorizados[user] === hash) {
    sessionStorage.setItem("logado", "sim");
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-content").classList.remove("hidden");
  } else {
    document.getElementById("erro-login").textContent = "Usuário ou senha incorretos.";
  }
}

window.addEventListener("load", () => {
  document.getElementById("botao-login").addEventListener("click", fazerLogin);
  if (sessionStorage.getItem("logado") === "sim") {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-content").classList.remove("hidden");
  }
});

let banco = {};
const linhas = [];

fetch('produtos.json')
  .then(response => response.json())
  .then(data => banco = Object.fromEntries(data.map(p => [p.codigo, p])));

function adicionarProduto() {
  const codigo = document.getElementById("codigo").value;
  const preco = document.getElementById("preco").value;
  const produto = banco[codigo];
  if (!produto) {
    alert("Código não encontrado no banco de dados.");
    return;
  }
  const logo = `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${produto.marca}.jpg`;
  const imagem = `\\\\172.30.217.2\\winthor\\IMAGEM\\${codigo}.jpg`;
  const unicode = `${codigo}\t${produto.nome}\t${preco}\tCÓD. ${codigo}\t${produto.nome}\t${produto.marca}\t${logo}\t${imagem}`;

  linhas.push(unicode);

  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${codigo}</td><td>${produto.nome}</td><td>${preco}</td><td>${produto.departamento}</td><td>${produto.marca}</td><td>${logo}</td><td>${imagem}</td><td>${unicode}</td>`;
  document.getElementById("tabela").appendChild(tr);
}

function baixarTXT() {
  const blob = new Blob([linhas.join("\n")], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tabloide-unicode.txt";
  link.click();
}
