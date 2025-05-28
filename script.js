let produtosBanco = [];
let produtosSelecionados = [];

fetch('produtos_unicode_final_completo.json')
  .then(response => response.json())
  .then(data => {
    produtosBanco = data;
    console.log(`Banco carregado: ${produtosBanco.length} produtos`);
  });

function adicionarProduto(codigo, preco = '--') {
  const produto = produtosBanco.find(p => p.codigo === codigo);
  if (!produto) return;

  const logo = "@" + produto.logo;
  const imagem = "@" + produto.codigo + ".jpg";  // Geração automática
  const textoUnicode = `${produto.codigo} ${produto.nome} -- CÓD. ${produto.codigo} ${produto.nome} ${produto.marca} ${logo}`;

  const novoProduto = {
    codigo: produto.codigo,
    nome: produto.nome,
    preco: preco,
    departamento: produto.departamento || '',
    marca: produto.marca,
    logo: logo,
    imagem: imagem,
    textoUnicode: textoUnicode
  };

  produtosSelecionados.push(novoProduto);
  atualizarTabela();
}

function adicionarEmLote() {
  const linhas = document.getElementById('entradaLote').value.trim().split('\n');
  linhas.forEach(linha => {
    const partes = linha.trim().split(/\s+/);
    const codigo = partes[0];
    adicionarProduto(codigo);
  });
}

function atualizarTabela() {
  const tabela = document.getElementById('tabelaProdutos');
  tabela.innerHTML = '';

  produtosSelecionados.forEach(produto => {
    const linha = tabela.insertRow();
    linha.insertCell(0).innerText = produto.codigo;
    linha.insertCell(1).innerText = produto.nome;
    linha.insertCell(2).innerText = produto.preco;
    linha.insertCell(3).innerText = produto.departamento;
    linha.insertCell(4).innerText = produto.marca;
    linha.insertCell(5).innerText = produto.logo;
    linha.insertCell(6).innerText = produto.imagem;
    linha.insertCell(7).innerText = produto.textoUnicode;
  });
}

function exportarTXT() {
  const cabecalho = "CODIGO\tDESCRIÇÃO\tPRECO\tCODIGO2\tDEPTO\tDESCRICAO\tMARCA\t@FOTOMARCA\t@FOTOPRODUTO\n";
  const linhas = produtosSelecionados.map(p => {
    return [
      p.codigo,
      p.nome,
      p.preco,
      `CÓD. ${p.codigo}`,
      p.departamento,
      p.nome,
      p.marca,
      `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${p.logo.replace('@', '')}`,
      `\\\\172.30.217.2\\winthor\\IMAGEM\\${p.codigo}.jpg`
    ].join('\t');
  });

  const conteudo = cabecalho + linhas.join('\n');
  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-16le' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tabloide_exportado.txt';
  a.click();
  URL.revokeObjectURL(url);
}

function limparTabela() {
  produtosSelecionados = [];
  atualizarTabela();
}
