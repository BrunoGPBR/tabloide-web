let bancoProdutos = [];

fetch('produtos_unicode_final_completo.json')
  .then(response => response.json())
  .then(data => {
    bancoProdutos = data;
    console.log("Banco carregado:", bancoProdutos.length, "produtos");
  })
  .catch(error => {
    console.error("Erro ao carregar o banco de dados:", error);
  });

// Login simples
document.getElementById('botao-login').addEventListener('click', function () {
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  if ((usuario === "Designer" && senha === "Lopes@2025") || (usuario === "Teste" && senha === "1234")) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
  } else {
    document.getElementById('erro-login').innerText = "Usuário ou senha incorretos.";
  }
});

const produtosAdicionados = [];

function adicionarProduto() {
  const codigo = document.getElementById('codigo').value.trim();
  const preco = document.getElementById('preco').value.trim();

  if (!codigo) {
    alert("Informe o código do produto.");
    return;
  }

  const produto = bancoProdutos.find(p => p.codigo == codigo);

  if (!produto) {
    alert("Código não encontrado no banco de dados.");
    return;
  }

  const precoFormatado = preco ? preco.replace(',', '.') : "";
  const textoUnicode = [
    produto.codigo,
    produto.nome,
    precoFormatado,
    `CÓD. ${produto.codigo}`,
    produto.departamento || "",
    produto.descricao || produto.nome || "",
    produto.marca || "",
    produto.logo || "",
    produto.imagem || ""
  ].join('\t');

  produtosAdicionados.push(textoUnicode);

  const linha = document.createElement('tr');
  linha.innerHTML = `
    <td>${produto.codigo}</td>
    <td>${produto.nome}</td>
    <td>${preco}</td>
    <td>${produto.departamento || ""}</td>
    <td>${produto.marca || ""}</td>
    <td>${produto.logo || ""}</td>
    <td>${produto.imagem || ""}</td>
    <td>${textoUnicode}</td>
  `;
  document.getElementById('tabela').appendChild(linha);

  document.getElementById('codigo').value = '';
  document.getElementById('preco').value = '';
}

function baixarTXT() {
  const cabecalho = "CODIGO\tDESCRIÇÃO\tPRECO\tCODIGO2\tDEPTO\tDESCRICAO\tMARCA\t@FOTOMARCA\t@FOTOPRODUTO";
  const conteudo = [cabecalho, ...produtosAdicionados].join('\r\n');

  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'produtos_unicode.txt';
  a.click();

  URL.revokeObjectURL(url);
}
