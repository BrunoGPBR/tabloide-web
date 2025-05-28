
async function sha256(text) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const usuariosAutorizados = {
  "Designer": "6d42e7b5fcf8ee30523896b3d81a5b80eb0a78699ce944c1b4ad44ac3c87df76"
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
  const logo = `\\10.1.1.85\mkt\Comercial\@LOGOS PRODUTOS\${produto.marca}.jpg`;
  const imagem = `\\172.30.217.2\winthor\IMAGEM\${codigo}.jpg`;
  const unicode = `${codigo}	${produto.nome}	${preco}	CÓD. ${codigo}	${produto.nome}	${produto.marca}	${logo}	${imagem}`;

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
