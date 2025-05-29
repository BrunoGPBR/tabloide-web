
let bancoProdutos = [];
let produtosSelecionados = [];

fetch("produtos_unicode_final_completo_corrigido.json")
  .then((res) => res.json())
  .then((data) => {
    bancoProdutos = data;
    console.log("Banco carregado:", bancoProdutos.length, "produtos");
  });

function adicionarProduto() {
  const codigo = document.getElementById("codigo").value.trim();
  const preco = document.getElementById("preco").value.trim();

  const produto = bancoProdutos.find(p => p.codigo === codigo);
  if (!produto) {
    alert("Produto não encontrado!");
    return;
  }

  const dep = "MATERIAL";
  const marca = String(produto.marca).replace(".0", "");
  const nome = produto.nome;
  const logo = `\\10.1.1.85\mkt\Comercial\@LOGOS PRODUTOS\${produto.logo.replace(".0.jpg", ".jpg")}`;
  const imagem = `\\172.30.217.2\winthor\IMAGEM\${produto.codigo}.jpg`;
  const textoUnicode = `${produto.codigo} ${produto.nome}`;

  produtosSelecionados.push({ codigo, nome, preco, departamento: dep, marca, logo, imagem, textoUnicode });
  atualizarTabela();
}

function adicionarLote() {
  const linhas = document.getElementById("entradaLote").value.trim().split("\n");

  linhas.forEach(linha => {
    const partes = linha.trim().split(" ");
    const codigo = partes[0];
    const preco = "0,00";

    const produto = bancoProdutos.find(p => p.codigo === codigo);
    if (!produto) return;

    const dep = "MATERIAL";
    const marca = String(produto.marca).replace(".0", "");
    const nome = produto.nome;
    const logo = `\\10.1.1.85\mkt\Comercial\@LOGOS PRODUTOS\${produto.logo.replace(".0.jpg", ".jpg")}`;
    const imagem = `\\172.30.217.2\winthor\IMAGEM\${produto.codigo}.jpg`;
    const textoUnicode = `${produto.codigo} ${produto.nome}`;

    produtosSelecionados.push({ codigo, nome, preco, departamento: dep, marca, logo, imagem, textoUnicode });
  });

  atualizarTabela();
}

function atualizarTabela() {
  const tbody = document.getElementById("tabela");
  tbody.innerHTML = "";

  produtosSelecionados.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.nome}</td>
      <td>${p.preco}</td>
      <td>${p.departamento}</td>
      <td>${p.marca}</td>
      <td>${p.logo}</td>
      <td>${p.imagem}</td>
      <td>${p.textoUnicode}</td>
    `;
    tbody.appendChild(tr);
  });
}

function baixarTXT() {
  const header = "CODIGO\tDESCRIÇÃO\tPRECO\tCODIGO2\tDEPTO\tDESCRICAO\tMARCA\t@FOTOMARCA\t@FOTOPRODUTO\n";
  const linhas = produtosSelecionados.map(p => 
    `${p.codigo}\t${p.nome}\t${p.preco}\tCÓD. ${p.codigo}\t${p.departamento}\t${p.nome}\t${p.marca}\t${p.logo}\t${p.imagem}`
  );
  const conteudo = header + linhas.join("\n");

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
