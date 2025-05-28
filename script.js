let produtos = [];
let produtosAdicionados = [];

fetch('produtos_unicode_final_completo.json')
  .then(response => response.json())
  .then(data => {
    produtos = data;
  });

function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function buscarProdutoPorCodigo(codigo) {
  return produtos.find(p => p.codigo === codigo);
}

function adicionarProduto() {
  const codigo = document.getElementById("codigo").value.trim();
  const preco = document.getElementById("preco").value.trim().replace(",", ".");

  if (!codigo || !preco) return alert("Preencha todos os campos.");

  const produto = buscarProdutoPorCodigo(codigo);
  if (!produto) return alert("Produto não encontrado.");

  const texto = gerarLinhaUnicode(produto, preco);
  produtosAdicionados.push({ ...produto, preco, texto });
  atualizarTabela();
}

function adicionarEmLote() {
  const input = document.getElementById("listaProdutos").value.trim();
  const linhas = input.split("\n");

  linhas.forEach(linha => {
    const partes = linha.trim().split(/\s+/);
    const codigo = partes[0];
    const preco = partes[partes.length - 1];
    const produto = buscarProdutoPorCodigo(codigo);
    if (produto) {
      const texto = gerarLinhaUnicode(produto, preco);
      produtosAdicionados.push({ ...produto, preco, texto });
    }
  });

  atualizarTabela();
}

function atualizarTabela() {
  const tabela = document.getElementById("tabela");
  tabela.innerHTML = "";
  produtosAdicionados.forEach(p => {
    const row = tabela.insertRow();
    row.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.nome}</td>
      <td>${p.preco}</td>
      <td>${p.departamento || ""}</td>
      <td>${p.marca}</td>
      <td>${p.logo}</td>
      <td>${p.foto}</td>
      <td>${p.texto}</td>
    `;
  });
}

function gerarLinhaUnicode(produto, preco) {
  const codigo = produto.codigo;
  const descricao = produto.nome;
  const precoFormatado = parseFloat(preco).toFixed(2).replace(".", ",");
  const cod2 = ""; // campo reservado
  const depto = ""; // campo reservado
  const marca = produto.marca;
  const logo = `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${produto.logoArquivo}`;
  const imagem = `\\\\172.30.217.2\\winthor\\IMAGEM\\${codigo}.jpg`;

  produto.logo = logo;
  produto.foto = imagem;

  return `${codigo}\t${descricao}\t${precoFormatado}\t${cod2}\t${depto}\t${descricao}\t${marca}\t${logo}\t${imagem}`;
}

function baixarTXT() {
  const linhas = produtosAdicionados.map(p => p.texto).join("\n");
  const blob = new Blob([linhas], { type: 'text/plain;charset=utf-16le' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'produtos_unicode.txt';
  link.click();
}
