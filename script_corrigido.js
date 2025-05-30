let produtos = [];

// Corrige o código removendo decimais e forçando string
function removeDecimalDoCodigo(codigo) {
  if (!codigo) return '';
  return parseInt(codigo.toString().split('.')[0]).toString();
}

// Carregar o banco de dados JSON
fetch('produtos_unicode_final_completo.json')
  .then(response => response.json())
  .then(data => {
    produtos = data;
    console.log(`Banco de dados carregado: ${produtos.length} produtos.`);
  })
  .catch(error => console.error("Erro ao carregar JSON:", error));

// Buscar produto por código
function buscarProduto(codigo) {
  const codLimpo = removeDecimalDoCodigo(codigo);
  return produtos.find(p => removeDecimalDoCodigo(p.CODIGO) === codLimpo);
}

// Adicionar produto manualmente
function adicionarProduto() {
  const codigo = document.getElementById("codigo").value.trim();
  const preco = document.getElementById("preco").value.trim();
  if (!codigo) return alert("Informe o código do produto.");

  const produto = buscarProduto(codigo);
  if (!produto) return alert("Produto não encontrado no banco de dados.");

  produto.preco = preco || "0,00";
  adicionarNaTabela(produto);
}

// ✅ Adicionar lista em lote (corrigido)
function adicionarLote() {
  const texto = document.getElementById("entradaLote").value.trim();
  if (!texto) return;

  const linhas = texto.split('\n');
  linhas.forEach(linha => {
    const partes = linha.trim().split(/\s+/);
    if (partes.length === 0) return;

    const codigo = removeDecimalDoCodigo(partes[0]);
    const produto = buscarProduto(codigo);

    if (produto) {
      produto.preco = "0,00";
      adicionarNaTabela(produto);
    } else {
      console.warn(`Produto não encontrado: ${codigo}`);
    }
  });
}

// Adicionar produto na tabela
function adicionarNaTabela(produto) {
  const tabela = document.getElementById("tabela");
  const linha = tabela.insertRow();

  const precoFormatado = produto.preco?.replace('.', ',') || "0,00";
  const codigo = removeDecimalDoCodigo(produto.CODIGO);
  const nome = produto.NOME || '';
  const depto = produto.DEPTO || 'MATERIAL';
  const marca = produto.MARCA || '';
  
  const marcaLogo = extrairPalavraChaveMarca(marca);
  const caminhoLogo = `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${marcaLogo}.jpg`;
  const caminhoImagem = `\\\\172.30.217.2\\winthor\\IMAGEM\\${codigo}.jpg`;
  const textoUnicode = `${codigo}\t${nome}\t${precoFormatado}\tCÓD. ${codigo}\t${depto}\t${nome}\t${marca}\t${caminhoLogo}\t${caminhoImagem}`;

  linha.insertCell().textContent = codigo;
  linha.insertCell().textContent = nome;
  linha.insertCell().textContent = precoFormatado;
  linha.insertCell().textContent = depto;
  linha.insertCell().textContent = marca;
  linha.insertCell().textContent = caminhoLogo;
  linha.insertCell().textContent = caminhoImagem;
  linha.insertCell().textContent = textoUnicode;

  produto._textoUnicode = textoUnicode;
}

// Extrair palavra-chave da marca para o nome da logo
function extrairPalavraChaveMarca(marca) {
  if (!marca) return 'undefined';
  const palavras = marca.toLowerCase().replace(/[^a-z0-9 ]/gi, '').split(' ');
  return palavras.find(p => p.length > 3) || palavras[0] || 'undefined';
}

// Exportar TXT em formato UTF-16 LE com tabulação
function baixarTXT() {
  const linhas = [];
  const tabela = document.getElementById("tabela");
  for (let i = 0; i < tabela.rows.length; i++) {
    const textoUnicode = tabela.rows[i].cells[7]?.textContent || '';
    if (textoUnicode) linhas.push(textoUnicode);
  }

  const blob = new Blob([`\ufeff${linhas.join('\n')}`], { type: 'text/plain;charset=utf-16le' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "produtos_unicode.txt";
  link.click();
}

// Limpar tudo
function limparTudo() {
  document.getElementById("codigo").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("entradaLote").value = "";
  document.getElementById("tabela").innerHTML = "";
}
