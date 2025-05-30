let produtos = [];
let produtosAdicionados = [];

fetch('produtos_unicode_final_completo.json')
  .then(response => response.json())
  .then(data => {
    produtos = data;
    console.log("Banco de dados carregado:", produtos.length, "produtos.");
  })
  .catch(error => console.error("Erro ao carregar JSON:", error));

function removerDecimalDoCodigo(codigo) {
  return codigo.toString().replace(/\.0+$/, '');
}

function buscarProduto(codigo) {
  const codigoLimpo = removerDecimalDoCodigo(codigo);
  return produtos.find(p => removerDecimalDoCodigo(p.CODIGO) === codigoLimpo);
}

function adicionarProduto() {
  const codigoInput = document.getElementById('codigo').value.trim();
  const precoInput = document.getElementById('preco').value.trim();

  if (!codigoInput || !precoInput) {
    alert("Preencha o código e o preço.");
    return;
  }

  const produto = buscarProduto(codigoInput);
  if (!produto) {
    alert("Produto não encontrado no banco de dados.");
    return;
  }

  const precoFormatado = precoInput.replace(',', '.');

  const linha = {
    CODIGO: removerDecimalDoCodigo(produto.CODIGO),
    DESCRICAO: produto.DESCRICAO || '',
    PRECO: precoFormatado,
    CODIGO2: produto.CODIGO2 || '',
    DEPTO: produto.DEPTO || '',
    DESCRICAO2: produto.DESCRICAO2 || '',
    MARCA: produto.MARCA || '',
    FOTOMARCA: produto.MARCA ? `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${produto.MARCA}.jpg` : '',
    FOTOPRODUTO: `\\\\10.1.1.85\\mkt\\Comercial\\@IMAGENS PRODUTOS\\${removerDecimalDoCodigo(produto.CODIGO)}.jpg`
  };

  produtosAdicionados.push(linha);
  atualizarTabela();
}

function adicionarLote() {
  const entrada = document.getElementById('entradaLote').value.trim();
  const linhas = entrada.split('\n');

  linhas.forEach(linha => {
    const partes = linha.split('\t');
    const codigo = partes[0].trim();
    const preco = partes.length > 1 ? partes[1].trim() : "0,00";

    document.getElementById('codigo').value = codigo;
    document.getElementById('preco').value = preco;
    adicionarProduto();
  });

  document.getElementById('entradaLote').value = '';
}

function atualizarTabela() {
  const tabela = document.getElementById('tabela');
  tabela.innerHTML = '';

  produtosAdicionados.forEach(prod => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${prod.CODIGO}</td>
      <td>${prod.DESCRICAO}</td>
      <td>${prod.PRECO}</td>
      <td>${prod.DEPTO}</td>
      <td>${prod.MARCA}</td>
      <td>${prod.FOTOMARCA}</td>
      <td>${prod.FOTOPRODUTO}</td>
      <td>${gerarLinhaUnicode(prod)}</td>
    `;
    tabela.appendChild(linha);
  });
}

function gerarLinhaUnicode(prod) {
  return `${prod.CODIGO}\t${prod.DESCRICAO}\t${prod.PRECO}\t${prod.CODIGO2}\t${prod.DEPTO}\t${prod.DESCRICAO2}\t${prod.MARCA}\t${prod.FOTOMARCA}\t${prod.FOTOPRODUTO}`;
}

function baixarTXT() {
  if (produtosAdicionados.length === 0) {
    alert("Nenhum produto adicionado.");
    return;
  }

  let texto = 'CODIGO\tDESCRICAO\tPRECO\tCODIGO2\tDEPTO\tDESCRICAO\tMARCA\t@FOTOMARCA\t@FOTOPRODUTO\n';
  produtosAdicionados.forEach(prod => {
    texto += gerarLinhaUnicode(prod) + '\n';
  });

  const utf16le = new TextEncoder('utf-16le').encode(texto);
  const bom = new Uint8Array([0xFF, 0xFE]);
  const buffer = new Uint8Array(bom.length + utf16le.length);
  buffer.set(bom, 0);
  buffer.set(utf16le, bom.length);

  const blob = new Blob([buffer], { type: 'text/plain;charset=utf-16le' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'produtos_unicode.txt';
  link.click();
}

function limparTudo() {
  produtosAdicionados = [];
  atualizarTabela();
  document.getElementById('codigo').value = '';
  document.getElementById('preco').value = '';
}
