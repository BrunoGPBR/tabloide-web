let produtosJson = [];
let produtosAdicionados = [];

fetch('produtos_unicode_final_completo.json')
  .then(response => response.json())
  .then(data => {
    produtosJson = data;
    console.log("Banco carregado:", produtosJson.length, "produtos");
  })
  .catch(err => console.error("Erro ao carregar JSON:", err));

function limparTabela() {
  produtosAdicionados = [];
  atualizarTabela();
}

function atualizarTabela() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  produtosAdicionados.forEach(produto => {
    const tr = document.createElement("tr");
    [
      produto.codigo,
      produto.nome,
      produto.preco,
      produto.departamento,
      produto.marca,
      produto.logoPath,
      produto.imagemPath,
      produto.textoUnicode
    ].forEach(val => {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function normalizarMarcaParaLogo(marca) {
  if (!marca) return "SEM_LOGO";
  let termo = marca.split("-")[0].trim().toUpperCase();
  termo = termo.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
  return `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${termo}.jpg`;
}

function adicionarProduto(codigo, preco) {
  const produto = produtosJson.find(p => String(p.CODIGO) === String(codigo));
  if (!produto) return;

  const nome = produto.DESCRICAO || "";
  const cod2 = `CÓD. ${produto.CODIGO}`;
  const depto = produto.DEPARTAMENTO || "MATERIAL";
  const marca = produto.MARCA || "";
  const precoFormatado = Number(preco).toFixed(2).replace(".", ",");
  const logoPath = normalizarMarcaParaLogo(marca);
  const imagemPath = `\\\\172.30.217.2\\winthor\\IMAGEM\\${produto.CODIGO}.jpg`;
  const textoUnicode = `${produto.CODIGO}\t${nome}\t${precoFormatado}\t${cod2}\t${depto}\t${nome}\t${marca}\t${logoPath}\t${imagemPath}`;

  produtosAdicionados.push({
    codigo: produto.CODIGO,
    nome,
    preco: precoFormatado,
    departamento: depto,
    marca,
    logoPath,
    imagemPath,
    textoUnicode
  });

  atualizarTabela();
}

function adicionarEmLote() {
  const texto = document.getElementById("listaLote").value.trim();
  const linhas = texto.split("\n");
  linhas.forEach(linha => {
    const partes = linha.trim().split(" ");
    const codigo = partes[0];
    adicionarProduto(codigo, "0");
  });
}

function exportarTXT() {
  if (produtosAdicionados.length === 0) return;

  const header = "CODIGO\tDESCRIÇÃO\tPRECO\tCODIGO2\tDEPTO\tDESCRICAO\tMARCA\t@FOTOMARCA\t@FOTOPRODUTO";
  const linhas = produtosAdicionados.map(p => p.textoUnicode);
  const conteudo = [header, ...linhas].join("\r\n");

  const blob = new Blob([new TextEncoder("utf-16le").encode(conteudo)], {
    type: "text/plain;charset=utf-16le"
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tabloide_exportado.txt";
  link.click();
}
