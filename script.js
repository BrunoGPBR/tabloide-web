let produtos = [];
fetch('produtos_unicode_final_completo.json')
  .then(response => response.json())
  .then(data => {
    produtos = data;
  })
  .catch(error => {
    alert("Erro ao carregar o banco de dados: " + error);
  });

const tabela = document.getElementById("tabela");

function buscarProduto(codigo) {
  return produtos.find(p => p.codigo.toString() === codigo.toString());
}

function adicionarProduto(codigoManual = null, precoManual = null) {
  const codigo = codigoManual || document.getElementById("codigo").value.trim();
  const preco = precoManual || document.getElementById("preco").value.trim() || "0,00";

  const produto = buscarProduto(codigo);

  if (!produto) {
    alert("Produto não encontrado no banco de dados.");
    return;
  }

  const linha = document.createElement("tr");

  const caminhoLogo = `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${produto.logo}`;
  const caminhoImagem = `\\\\172.30.217.2\\winthor\\IMAGEM\\${codigo}.jpg`;

  const textoUnicode = [
    codigo,
    produto.nome,
    preco,
    `CÓD. ${codigo}`,
    produto.departamento || "MATERIAL",
    produto.nome,
    produto.marca,
    caminhoLogo,
    caminhoImagem
  ].join("\t");

  const colunas = [
    codigo,
    produto.nome,
    preco,
    produto.departamento || "MATERIAL",
    produto.marca,
    caminhoLogo,
    caminhoImagem,
    textoUnicode
  ];

  colunas.forEach(conteudo => {
    const td = document.createElement("td");
    td.textContent = conteudo;
    linha.appendChild(td);
  });

  tabela.appendChild(linha);

  // Limpar campos
  if (!codigoManual) document.getElementById("codigo").value = "";
  if (!precoManual) document.getElementById("preco").value = "";
}

function adicionarLote() {
  const lista = document.getElementById("entradaLote").value.trim().split("\n");

  lista.forEach(linha => {
    const partes = linha.trim().split(/\s+/);
    const codigo = partes[0];
    adicionarProduto(codigo, "0,00");
  });
}

function baixarTXT() {
  const linhas = [];
  const headers = ["CODIGO", "DESCRIÇÃO", "PRECO", "CODIGO2", "DEPTO", "DESCRICAO", "MARCA", "@FOTOMARCA", "@FOTOPRODUTO"];
  linhas.push(headers.join("\t"));

  tabela.querySelectorAll("tr").forEach(tr => {
    const tds = tr.querySelectorAll("td");
    if (tds.length === 8) {
      const textoUnicode = tds[7].textContent;
      linhas.push(textoUnicode);
    }
  });

  const blob = new Blob([`\ufeff${linhas.join("\n")}`], { type: "text/plain;charset=utf-16le" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "produtos_unicode.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function limparTudo() {
  tabela.innerHTML = "";
  document.getElementById("entradaLote").value = "";
  document.getElementById("codigo").value = "";
  document.getElementById("preco").value = "";
}
