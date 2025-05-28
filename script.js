// Lista de usuários permitidos
const usuariosAutorizados = [
  { user: "Designer", pass: "Lopes@2025" },
  { user: "Teste", pass: "1234" }
];

// Função de login
document.getElementById("botao-login").addEventListener("click", () => {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  const autorizado = usuariosAutorizados.some(u => u.user === usuario && u.pass === senha);

  if (autorizado) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
  } else {
    document.getElementById("erro-login").innerText = "Usuário ou senha incorretos.";
  }
});

// Dados
let bancoProdutos = [];

fetch("produtos_unicode_completo.json")
  .then(res => res.json())
  .then(data => {
    bancoProdutos = data;
    console.log("Banco carregado:", bancoProdutos.length, "produtos");
  });

function adicionarProduto() {
  const codigo = document.getElementById("codigo").value.trim();
  const preco = document.getElementById("preco").value.trim();

  const produto = bancoProdutos.find(p => p.codigo === codigo);

  if (!produto) {
    alert("Código não encontrado no banco de dados.");
    return;
  }

  const tabela = document.getElementById("tabela");
  const linha = tabela.insertRow();

  const textoUnicode = `${codigo} ${produto.nome} ${preco ? preco : ""} CÓD. ${codigo} ${produto.nome} ${produto.marca} \\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${produto.logo} \\\\172.30.217.2\\winthor\\IMAGEM\\${codigo}.jpg`;

  linha.innerHTML = `
    <td>${codigo}</td>
    <td>${produto.nome}</td>
    <td>${preco}</td>
    <td>${produto.departamento || ""}</td>
    <td>${produto.marca}</td>
    <td>\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${produto.logo}</td>
    <td>\\\\172.30.217.2\\winthor\\IMAGEM\\${codigo}.jpg</td>
    <td>${textoUnicode}</td>
  `;
}

function baixarTXT() {
  const linhas = [];
  const rows = document.querySelectorAll("#tabela tr");
  rows.forEach(row => {
    const cols = row.querySelectorAll("td");
    const texto = cols[7]?.innerText;
    if (texto) linhas.push(texto);
  });

  const blob = new Blob([linhas.join("\n")], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tabloide_unicode.txt";
  link.click();
}
