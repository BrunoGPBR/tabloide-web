let bancoProdutos = {};
let produtosSelecionados = [];

const logins = {
  "Designer": "Lopes@2025"
};

fetch('produtos_unicode_completo.json')
  .then(res => res.json())
  .then(data => {
    bancoProdutos = data;
    console.log("Banco carregado:", Object.keys(bancoProdutos).length, "produtos");
  });

document.getElementById("botao-login").addEventListener("click", () => {
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("senha").value;

  if (logins[user] === pass) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
  } else {
    document.getElementById("erro-login").innerText = "Usuário ou senha incorretos.";
  }
});

function adicionarProduto() {
  const codigo = document.getElementById("codigo").value.trim();
  const preco = document.getElementById("preco").value.trim();

  if (!codigo) return alert("Informe o código do produto.");

  const produto = bancoProdutos[codigo];
  if (!produto) return alert("Código não encontrado no banco de dados.");

  produtosSelecionados.push({ ...produto, preco });
  atualizarTabela();
  document.getElementById("codigo").value = "";
  document.getElementById("preco").value = "";
}

function atualizarTabela() {
  const tabela = document.getElementById("tabela");
  tabela.innerHTML = "";
  produtosSelecionados.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.nome}</td>
      <td>${p.preco || ""}</td>
      <td>${p.departamento || ""}</td>
      <td>${p.marca || ""}</td>
      <td>${p.logo || ""}</td>
      <td>${p.imagem || ""}</td>
      <td>${gerarTextoUnicode(p)}</td>
    `;
    tabela.appendChild(tr);
  });
}

function gerarTextoUnicode(p) {
  const codigo2 = `CÓD. ${p.codigo}`;
  const campos = [
    p.codigo,
    p.nome,
    p.preco || "",
    codigo2,
    p.departamento || "",
    p.nome,
    p.marca || "",
    p.logo || "",
    p.imagem || ""
  ];
  return campos.join("\t");
}

function baixarTXT() {
  if (produtosSelecionados.length === 0) return alert("Nenhum produto adicionado.");

  let conteudo = "CODIGO\tDESCRIÇÃO\tPRECO\tCODIGO2\tDEPTO\tDESCRICAO\tMARCA\t@FOTOMARCA\t@FOTOPRODUTO\n";
  produtosSelecionados.forEach(p => {
    conteudo += gerarTextoUnicode(p) + "\n";
  });

  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "tabloide.txt";
  a.click();
  URL.revokeObjectURL(url);
}

// Função extra para colar múltiplos códigos + nomes
function colarProdutosLote(texto) {
  const linhas = texto.trim().split("\n");
  linhas.forEach(linha => {
    const partes = linha.trim().split(/\s+(.+)/);
    const codigo = partes[0];
    const produto = bancoProdutos[codigo];
    if (produto && !produtosSelecionados.find(p => p.codigo === codigo)) {
      produtosSelecionados.push({ ...produto, preco: "" });
    }
  });
  atualizarTabela();
}

// Opcional: adicionar campo textarea para colar vários produtos
window.colarProdutos = () => {
  const texto = prompt("Cole aqui os códigos e nomes (ex: 12345 Nome do Produto):");
  if (texto) colarProdutosLote(texto);
};
