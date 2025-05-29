let produtosJson = [];
let produtosAdicionados = [];

fetch("produtos_unicode_final_completo.json")
  .then(response => response.json())
  .then(data => {
    produtosJson = data;
    console.log("Banco de produtos carregado:", produtosJson.length);
  })
  .catch(error => console.error("Erro ao carregar JSON:", error));

function limparTudo() {
  produtosAdicionados = [];
  document.getElementById("entradaLote").value = "";
  document.getElementById("codigo").value = "";
  document.getElementById("preco").value = "";
  atualizarTabela();
}

function atualizarTabela() {
  const tabela = document.getElementById("tabela");
  tabela.innerHTML = "";
  produtosAdicionados.forEach(p => {
    const tr = document.createElement("tr");
    [
      p.codigo,
      p.nome,
      p.preco,
      p.departamento,
      p.marca,
      p.logoPath,
      p.imagemPath,
      p.linhaFinal
    ].forEach(texto => {
      const td = document.createElement("td");
      td.textContent = texto;
      tr.appendChild(td);
    });
    tabela.appendChild(tr);
  });
}

function normalizarLogo(marca) {
  if (!marca) return "SEM_LOGO";
  let nome = marca.split("-")[0].trim().toUpperCase();
  nome = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove acentos
  nome = nome.replace(/[^\w\s]/gi, "").replace(/\s+/g, "_");
  return `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${nome}.jpg`;
}

function gerarLinhaTXT(p, preco) {
  const precoFinal = preco ? parseFloat(preco).toFixed(2).replace(".", ",") : "0,00";
  const cod2 = `CÓD. ${p.CODIGO}`;
  const departamento = p.DEPARTAMENTO || "MATERIAL";
  const logo = normalizarLogo(p.MARCA);
  const imagem = `\\\\172.30.217.2\\winthor\\IMAGEM\\${p.CODIGO}.jpg`;
  return {
    codigo: p.CODIGO,
    nome: p.DESCRICAO || "",
    preco: precoFinal,
    departamento,
    marca: p.MARCA || "",
    logoPath: logo,
    imagemPath: imagem,
    linhaFinal: `${p.CODIGO}\t${p.DESCRICAO}\t${precoFinal}\t${cod2}\t${departamento}\t${p.DESCRICAO}\t${p.MARCA}\t${logo}\t${imagem}`
  };
}

function adicionarProduto() {
  const codigo = document.getElementById("codigo").value.trim();
  const preco = document.getElementById("preco").value.trim();
  const produto = produtosJson.find(p => String(p.CODIGO) === codigo);
  if (!produto) return alert("Produto não encontrado!");
  produtosAdicionados.push(gerarLinhaTXT(produto, preco));
  atualizarTabela();
}

function adicionarLote() {
  const entrada = document.getElementById("entradaLote").value.trim().split("\n");
  entrada.forEach(linha => {
    const partes = linha.trim().split(" ");
    const codigo = partes[0];
    const produto = produtosJson.find(p => String(p.CODIGO) === codigo);
    if (produto) {
      produtosAdicionados.push(gerarLinhaTXT(produto, "0"));
    }
  });
  atualizarTabela();
}

function baixarTXT() {
  if (produtosAdicionados.length === 0) return alert("Nenhum produto adicionado.");
  const header = "CODIGO\tDESCRIÇÃO\tPRECO\tCODIGO2\tDEPTO\tDESCRICAO\tMARCA\t@FOTOMARCA\t@FOTOPRODUTO";
  const linhas = produtosAdicionados.map(p => p.linhaFinal);
  const conteudo = [header, ...linhas].join("\r\n");
  const blob = new Blob([new TextEncoder("utf-16le").encode(conteudo)], {
    type: "text/plain;charset=utf-16le"
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tabloide_exportado.txt";
  link.click();
}
