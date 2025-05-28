let bancoDados = [];
let produtosSelecionados = [];

fetch('produtos_unicode_completo.json')
  .then(response => response.json())
  .then(data => {
    bancoDados = data;
    console.log(`Banco carregado: ${bancoDados.length} produtos`);
  });

function adicionarProduto() {
  const codigo = document.getElementById('codigo').value.trim();
  const preco = document.getElementById('preco').value.trim();

  if (!codigo) return;

  const produto = bancoDados.find(p => p.codigo === codigo);
  if (!produto) {
    alert("Código não encontrado no banco de dados.");
    return;
  }

  produto.preco = preco || produto.preco || "";

  produtosSelecionados.push(produto);
  atualizarTabela();
}

function colarLista() {
  const lista = document.getElementById("lista-codigos").value.trim();
  const linhas = lista.split('\n');

  for (const linha of linhas) {
    const partes = linha.trim().split(/\t+/);
    const codigo = partes[0]?.trim();
    const preco = ""; // O usuário poderá editar depois, se quiser.

    if (codigo) {
      const produto = bancoDados.find(p => p.codigo === codigo);
      if (produto && !produtosSelecionados.find(p => p.codigo === codigo)) {
        produto.preco = preco;
        produtosSelecionados.push(produto);
      }
    }
  }

  atualizarTabela();
}

function atualizarTabela() {
  const tabela = document.getElementById("tabela");
  tabela.innerHTML = "";

  for (const p of produtosSelecionados) {
    const linha = `
      <tr>
        <td>${p.codigo}</td>
        <td>${p.nome}</td>
        <td>${p.preco || ""}</td>
        <td>${p.departamento || ""}</td>
        <td>${p.marca || ""}</td>
        <td>${p.logo || ""}</td>
        <td>${p.imagem || ""}</td>
        <td>${`${p.codigo} - ${p.nome} -`}</td>
      </tr>`;
    tabela.innerHTML += linha;
  }
}

function baixarTXT() {
  let txt = "CODIGO\tDESCRIÇÃO\tPRECO\tCODIGO2\tDEPTO\tDESCRICAO\tMARCA\t@FOTOMARCA\t@FOTOPRODUTO\n";

  for (const p of produtosSelecionados) {
    const linha = [
      p.codigo,
      p.nome,
      p.preco || "",
      `CÓD. ${p.codigo}`,
      p.departamento || "",
      p.nome,
      p.marca || "",
      p.logo || "",
      p.imagem || ""
    ].join('\t');

    txt += linha + '\n';
  }

  const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "produtos_unicode_exportado.txt";
  a.click();
}
