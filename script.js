let produtos = [];
let tabela = document.getElementById("tabela");

// Carregar banco de dados JSON
fetch("produtos_unicode_final_completo.json")
  .then((response) => response.json())
  .then((data) => {
    produtos = data;
  })
  .catch((error) => {
    console.error("Erro ao carregar o JSON:", error);
  });

// Função de login
document.getElementById("botao-login").addEventListener("click", function () {
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("senha").value;

  const validUsers = [
    { usuario: "Designer", senha: "Lopes@2025" },
    { usuario: "teste", senha: "1234" }
  ];

  const autorizado = validUsers.some(
    (credencial) => credencial.usuario === user && credencial.senha === pass
  );

  if (autorizado) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
  } else {
    document.getElementById("erro-login").textContent = "Usuário ou senha incorretos.";
  }
});

// Função para adicionar produto à tabela
function adicionarProduto() {
  const codigo = document.getElementById("codigo").value;
  const preco = document.getElementById("preco").value;

  const produto = produtos.find(p => p.codigo === codigo);

  if (produto) {
    const imagem = `\\\\172.30.217.2\\winthor\\IMAGEM/${codigo}.jpg`;
    const logo = `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS/${produto.logo}`;
    const unicode = `${codigo} - ${produto.nome} - ${preco}`;

    const linha = `
      <tr>
        <td>${codigo}</td>
        <td>${produto.nome}</td>
        <td>${preco}</td>
        <td>${produto.departamento}</td>
        <td>${produto.marca}</td>
        <td>${logo}</td>
        <td>${imagem}</td>
        <td>${unicode}</td>
      </tr>
    `;

    tabela.innerHTML += linha;
  } else {
    alert("Produto não encontrado!");
  }

  document.getElementById("codigo").value = "";
  document.getElementById("preco").value = "";
}

// Função para exportar a tabela como arquivo .txt
function baixarTXT() {
  let texto = "";
  const linhas = tabela.querySelectorAll("tr");

  for (let i = 0; i < linhas.length; i++) {
    const colunas = linhas[i].querySelectorAll("td");
    if (colunas.length > 0) {
      texto += `${colunas[7].innerText}\r\n`; // Texto unicode
    }
  }

  const blob = new Blob(["\ufeff" + texto], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tabloide_unicode.txt";
  a.click();
  URL.revokeObjectURL(url);
}
