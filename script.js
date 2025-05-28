let produtosSelecionados = [];
let bancoDados = [];

fetch('produtos_unicode_final_completo.json')
  .then(response => response.json())
  .then(data => bancoDados = data);

function adicionarProduto() {
  const codigo = document.getElementById("codigo").value.trim();
  const preco = document.getElementById("preco").value.trim();
  if (!codigo) return alert("Informe um código de produto.");

  const produto = bancoDados.find(p => p.codigo == codigo);
  if (!produto) return alert("Produto não encontrado no banco.");

  produto.preco = preco || "--";
  produtosSelecionados.push(produto);
  atualizarTabela();
}

function adicionarEmLote() {
  const texto = document.getElementById("loteInput").value.trim();
  const linhas = texto.split("\n");

  for (let linha of linhas) {
    const partes = linha.trim().split(/\s+/);
    const codigo = partes[0];
    const produto = bancoDados.find(p => p.codigo == codigo);
    if (produto && !produtosSelecionados.some(p => p.codigo == codigo)) {
      produto.preco = "--";
      produtosSelecionados.push(produto);
    }
  }

  atualizarTabela();
}

function atualizarTabela() {
  const tbody = document.getElementById("tabelaProdutos");
  tbody.innerHTML = "";

  for (let p of produtosSelecionados) {
    const linha = `
      <tr>
        <td>${p.codigo}</td>
        <td>${p.nome}</td>
        <td>${p.preco || "--"}</td>
        <td>${p.departamento}</td>
        <td>${p.marca}</td>
        <td>${p.logo}</td>
        <td>${p.imagem}</td>
        <td>${p.codigo}\t${p.nome}\t${p.preco || "--"}\tCÓD. ${p.codigo}\t${p.departamento}\t${p.nome}\t${p.marca}\t${p.logo}\t${p.imagem}</td>
      </tr>
    `;
    tbody.innerHTML += linha;
  }
}

function limparProdutos() {
  produtosSelecionados = [];
  document.getElementById("tabelaProdutos").innerHTML = "";
}

function exportarParaTXT() {
  if (produtosSelecionados.length === 0) return alert("Nenhum produto para exportar.");

  let conteudo = "CODIGO\tDESCRIÇÃO\tPRECO\tCODIGO2\tDEPTO\tDESCRICAO\tMARCA\t@FOTOMARCA\t@FOTOPRODUTO\n";
  
  for (let p of produtosSelecionados) {
    conteudo += `${p.codigo}\t${p.nome}\t${p.preco || "--"}\tCÓD. ${p.codigo}\t${p.departamento}\t${p.nome}\t${p.marca}\t${p.logo}\t${p.imagem}\n`;
  }

  const blob = new Blob([new TextEncoder("utf-16le").encode(conteudo)], {
    type: "text/plain;charset=utf-16le"
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tabloide_unicode.txt";
  a.click();
  window.URL.revokeObjectURL(url);
}
