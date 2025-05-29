let produtos = [];
let produtosSelecionados = [];

async function carregarProdutos() {
  const resposta = await fetch("produtos_unicode_final_completo.json");
  produtos = await resposta.json();
}

function normalizarCodigo(codigo) {
  return String(codigo).replace(/\.0$/, "").trim();
}

function adicionarProduto() {
  const codigo = document.getElementById("codigo").value.trim();
  const preco = document.getElementById("preco").value.trim();
  adicionarProdutoManual(codigo, preco);
  document.getElementById("codigo").value = "";
  document.getElementById("preco").value = "";
}

function adicionarProdutoManual(codigo, preco) {
  const produto = produtos.find(p => String(p.codigo) === String(codigo));
  if (!produto) {
    alert(`Produto ${codigo} não encontrado no banco.`);
    return;
  }

  const codigoLimpo = normalizarCodigo(produto.codigo);
  const logoLimpo = normalizarCodigo(produto.logo);

  const linha = {
    codigo: codigoLimpo,
    nome: produto.nome,
    preco,
    departamento: produto.departamento || "",
    marca: produto.marca || "",
    logo: `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${logoLimpo}.jpg`,
    imagem: `\\\\172.30.217.2\\winthor\\IMAGEM\\${codigoLimpo}.jpg`
  };

  produtosSelecionados.push(linha);
  atualizarTabela();
}

function adicionarLote() {
  const input = prompt("Cole os produtos (formato: CÓDIGO TAB NOME):");
  if (!input) return;

  const linhas = input.trim().split("\n");
  linhas.forEach(linha => {
    const partes = linha.trim().split(/\s+/);
    const codigo = partes[0];
    const preco = "0,00";
    adicionarProdutoManual(codigo, preco);
  });
}

function atualizarTabela() {
  const tabela = document.getElementById("tabela");
  tabela.innerHTML = "";

  produtosSelecionados.forEach(prod => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prod.codigo}</td>
      <td>${prod.nome}</td>
      <td>${prod.preco}</td>
      <td>${prod.departamento}</td>
      <td>${prod.marca}</td>
      <td>${prod.logo}</td>
      <td>${prod.imagem}</td>
      <td>${gerarLinhaUnicode(prod)}</td>
    `;
    tabela.appendChild(tr);
  });
}

function gerarLinhaUnicode(prod) {
  return [
    prod.codigo,
    prod.nome,
    prod.preco,
    prod.codigo,
    prod.departamento,
    prod.nome,
    prod.marca,
    prod.logo,
    prod.imagem
  ].join("\t");
}

function baixarTXT() {
  if (produtosSelecionados.length === 0) {
    alert("Nenhum produto adicionado!");
    return;
  }

  const conteudo = produtosSelecionados.map(gerarLinhaUnicode).join("\r\n");
  const blob = new Blob(["\ufeff" + conteudo], { type: "text/plain;charset=utf-16le" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "produtos_unicode.txt";
  a.click();
  URL.revokeObjectURL(url);
}

function limparTudo() {
  produtosSelecionados = [];
  atualizarTabela();
}

carregarProdutos();
