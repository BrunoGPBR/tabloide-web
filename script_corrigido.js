let bancoDados = {};
let produtosAdicionados = [];

// Carregar JSON
fetch('produtos_unicode_final_completo.json')
  .then(res => res.json())
  .then(json => {
    bancoDados = json;
  });

function adicionarProduto() {
  const codigoInput = document.getElementById("codigo").value.trim();
  const preco = document.getElementById("preco").value.trim();
  const codigo = codigoInput.replace(/\.0$/, "");

  if (!bancoDados[codigo]) {
    alert("Produto não encontrado no banco de dados.");
    return;
  }

  const produto = bancoDados[codigo];
  const nome = produto.nome;
  const marca = produto.marca || "SEM MARCA";
  const depto = produto.departamento || "";
  const imagem = `\\\\10.1.1.85\\mkt\\Comercial\\@FOTOS SITE\\${codigo}.jpg`;
  const logo = `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${produto.logo || marca}.jpg`;

  const linha = `${codigo}\t${nome}\t${preco}\t${codigo}\t${depto}\t${nome}\t${marca}\t${logo}\t${imagem}`;

  produtosAdicionados.push({
    codigo,
    nome,
    preco,
    departamento: depto,
    marca,
    logo,
    imagem,
    linha
  });

  atualizarTabela();
  document.getElementById("codigo").value = "";
  document.getElementById("preco").value = "";
}

function adicionarLote() {
  const entrada = document.getElementById("entradaLote").value.trim().split("\n");

  entrada.forEach(linha => {
    const partes = linha.trim().split(/\s+(.+)/);
    if (partes.length < 2) return;
    const codigo = partes[0].replace(/\.0$/, "");
    const preco = "";
    document.getElementById("codigo").value = codigo;
    document.getElementById("preco").value = preco;
    adicionarProduto();
  });

  document.getElementById("entradaLote").value = "";
}

function atualizarTabela() {
  const tbody = document.getElementById("tabela");
  tbody.innerHTML = "";

  produtosAdicionados.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.nome}</td>
      <td>${p.preco}</td>
      <td>${p.departamento}</td>
      <td>${p.marca}</td>
      <td>${p.logo}</td>
      <td>${p.imagem}</td>
      <td>${p.linha}</td>
    `;
    tbody.appendChild(tr);
  });
}

function baixarTXT() {
  const conteudo = produtosAdicionados.map(p => p.linha).join("\r\n");
  const blob = new Blob([new TextEncoder("utf-16le").encode(conteudo)], {
    type: "text/plain;charset=utf-16le"
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "produtos_unicode.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function limparTudo() {
  produtosAdicionados = [];
  atualizarTabela();
}
