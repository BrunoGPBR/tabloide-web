let produtos = [];
let dadosJson = [];

fetch("produtos_unicode_final_completo.json")
  .then((response) => response.json())
  .then((dados) => {
    dadosJson = dados;
  });

function adicionarProduto() {
  const codigo = document.getElementById("codigo").value.trim();
  const preco = document.getElementById("preco").value.trim().replace(",", ".");

  if (!codigo || !preco) return;

  const produto = dadosJson.find(p => String(p.codigo).replace(".0", "") === codigo);

  if (!produto) {
    alert("Produto não encontrado no banco de dados.");
    return;
  }

  const marca = produto.marca || "SEM MARCA";
  const nome = produto.nome || "SEM NOME";
  const imagem = `\\\\172.30.217.2\\winthor\\IMAGEM\\${codigo}.jpg`;
  const logo = `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${marca}.jpg`;

  const unicode = `${codigo}\t${nome}\t${preco}\t${codigo}\tMATERIAL\t${nome}\t${marca}\t${logo}\t${imagem}`;

  produtos.push({ codigo, nome, preco, marca, imagem, logo, unicode });
  atualizarTabela();
}

function adicionarLote() {
  const lote = prompt("Cole aqui a lista (formato: CÓDIGO TAB NOME)");
  if (!lote) return;

  const linhas = lote.trim().split("\n");
  linhas.forEach(linha => {
    const partes = linha.trim().split("\t");
    const codigo = partes[0];
    const produto = dadosJson.find(p => String(p.codigo).replace(".0", "") === codigo);

    if (produto) {
      const marca = produto.marca || "SEM MARCA";
      const nome = produto.nome || "SEM NOME";
      const imagem = `\\\\172.30.217.2\\winthor\\IMAGEM\\${codigo}.jpg`;
      const logo = `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${marca}.jpg`;
      const unicode = `${codigo}\t${nome}\t\t${codigo}\tMATERIAL\t${nome}\t${marca}\t${logo}\t${imagem}`;
      produtos.push({ codigo, nome, preco: "", marca, imagem, logo, unicode });
    }
  });

  atualizarTabela();
}

function baixarTXT() {
  const BOM = "\uFEFF";
  const conteudo = produtos.map(p => p.unicode).join("\n");
  const blob = new Blob([BOM + conteudo], { type: "text/plain;charset=utf-16le" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "produtos_unicode.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function limparTabela() {
  produtos = [];
  atualizarTabela();
}

function atualizarTabela() {
  const tabela = document.getElementById("tabela");
  tabela.innerHTML = "";

  produtos.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.nome}</td>
      <td>${p.preco}</td>
      <td>MATERIAL</td>
      <td>${p.marca}</td>
      <td>${p.logo}</td>
      <td>${p.imagem}</td>
      <td><textarea readonly style="width: 100%">${p.unicode}</textarea></td>
    `;
    tabela.appendChild(tr);
  });
}
