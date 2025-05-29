let produtos = [];
const tabela = document.getElementById("tabela");

fetch("produtos_unicode_final_completo.json")
  .then(response => response.json())
  .then(data => produtos = data)
  .catch(() => alert("Erro ao carregar o banco de dados."));

function limparTudo() {
  tabela.innerHTML = "";
}

function adicionarLote() {
  const linhas = document.getElementById("entradaLote").value.trim().split("\n");
  linhas.forEach(linha => {
    const codigo = linha.split(/\s+/)[0];
    adicionarLinhaPorCodigo(codigo);
  });
}

function adicionarProduto() {
  const codigo = document.getElementById("codigo").value.trim();
  const preco = document.getElementById("preco").value.trim();
  adicionarLinhaPorCodigo(codigo, preco);
}

function adicionarLinhaPorCodigo(codigo, precoManual = "") {
  const produto = produtos.find(p => p.CODIGO == codigo);
  if (!produto) {
    alert("Produto não encontrado no banco de dados.");
    return;
  }

  const preco = precoManual || "0,00";
  const logo = `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${produto.MARCA?.split(" - ")[0]}.jpg`;
  const imagem = `\\\\172.30.217.2\\winthor\\IMAGEM\\${produto.CODIGO}.jpg`;
  const linha = [
    produto.CODIGO,
    produto.DESCRICAO,
    preco,
    produto.DEPTO || "MATERIAL",
    produto.MARCA,
    logo,
    imagem,
    `${produto.CODIGO}\t${produto.DESCRICAO}\t${preco}\tCÓD. ${produto.CODIGO}\t${produto.DEPTO || "MATERIAL"}\t${produto.DESCRICAO}\t${produto.MARCA}\t${logo}\t${imagem}`
  ];

  const tr = document.createElement("tr");
  linha.forEach(valor => {
    const td = document.createElement("td");
    td.textContent = valor;
    tr.appendChild(td);
  });
  tabela.appendChild(tr);
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

  const textoFinal = `\ufeff${linhas.join("\r\n")}`;
  const encoder = new TextEncoder("utf-16le");
  const buffer = encoder.encode(textoFinal);
  const blob = new Blob([buffer], { type: "text/plain;charset=utf-16le" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "produtos_unicode.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
