document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("login-screen");
  const mainContent = document.getElementById("main-content");
  const botaoLogin = document.getElementById("botao-login");
  const erroLogin = document.getElementById("erro-login");

  botaoLogin.addEventListener("click", () => {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    const usuariosAutorizados = [
      { user: "Designer", pass: "Lopes@2025" },
      { user: "Teste", pass: "1234" }
    ];

    const autorizado = usuariosAutorizados.some(u => u.user === usuario && u.pass === senha);

    if (autorizado) {
      loginScreen.classList.add("hidden");
      mainContent.classList.remove("hidden");
      carregarProdutos();
    } else {
      erroLogin.textContent = "Usuário ou senha incorretos.";
    }
  });
});

let bancoProdutos = [];

function carregarProdutos() {
  fetch("produtos_unicode_completo.json")
    .then(response => response.json())
    .then(data => {
      bancoProdutos = data;
      console.log("Banco carregado:", bancoProdutos.length, "produtos");
    })
    .catch(error => {
      console.error("Erro ao carregar banco:", error);
    });
}

function adicionarProduto() {
  const codigo = document.getElementById("codigo").value.trim();
  const preco = document.getElementById("preco").value.trim();

  if (!codigo || !preco) {
    alert("Preencha código e preço.");
    return;
  }

  const produto = bancoProdutos.find(p => p.codigo === codigo);

  if (!produto) {
    alert("Produto não encontrado.");
    return;
  }

  const linha = document.createElement("tr");

  const textoUnicode = produto.unicode
    .replace("[PRECO]", preco)
    .replace("[DEPTO]", "GERAL"); // Você pode trocar "GERAL" por outro departamento

  linha.innerHTML = `
    <td>${produto.codigo}</td>
    <td>${produto.nome}</td>
    <td>${preco}</td>
    <td>GERAL</td>
    <td>${produto.marca}</td>
    <td>${produto["@Logo"]}</td>
    <td>${produto["@Imagem"]}</td>
    <td>${textoUnicode}</td>
  `;

  document.getElementById("tabela").appendChild(linha);
}

function baixarTXT() {
  const linhas = Array.from(document.querySelectorAll("#tabela tr"))
    .map(tr => tr.children[7]?.textContent)
    .filter(Boolean)
    .join("\n");

  const blob = new Blob([linhas], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "produtos_unicode.txt";
  a.click();

  URL.revokeObjectURL(url);
}
