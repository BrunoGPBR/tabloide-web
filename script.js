let bancoProdutos = [];
let produtosAdicionados = [];

fetch('produtos_unicode_final_completo.json')
  .then(response => response.json())
  .then(data => {
    bancoProdutos = data;
    console.log("Banco carregado:", bancoProdutos.length, "produtos");
  })
  .catch(error => {
    console.error("Erro ao carregar o banco de dados:", error);
  });

const usuarios = {
  Designer: "1234",
  Admin: "admin123"
};

document.getElementById("botao-login").addEventListener("click", () => {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const erroLogin = document.getElementById("erro-login");

  if (usuarios[usuario] && usuarios[usuario] === senha) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
  } else {
    erroLogin.textContent = "Usuário ou senha incorretos.";
  }
});

function normalizarMarca(marca) {
  if (!marca) return "";
  let nomesPossiveis = ["VONDER", "3M", "HERC", "ATLAS", "DELTA", "CIVITT", "ASTRA", "TRAMONTINA", "HTH", "CORTAG", "LONAX", "ACQUAFLEX", "VENTI-DELTA", "OUROLUX", "FAMASTIL", "ZAGONEL"];
  for (let nome of nomesPossiveis) {
    if (marca.toUpperCase().includes(nome)) return nome;
  }
  return marca;
}

function adicionarProduto() {
  const input = document.getElementById("codigo");
  const precoInput = document.getElementById("preco");
  const tabela = document.getElementById("tabela");
  const linhas = input.value.trim().split('\n');

  linhas.forEach(linha => {
    const partes = linha.trim().split(/\s(.+)/);
    if (partes.length < 2) return;
    const codigo = partes[0];
    const produto = bancoProdutos.find(p => String(p.CODIGO) === codigo);

    if (!produto || produtosAdicionados.find(p => p.codigo === codigo)) return;

    const nome = produto.NOME?.trim() || partes[1].trim();
    const preco = precoInput.value.trim();
    const departamento = produto.DEPTO || "";
    const marcaOriginal = produto.MARCA || "";
    const marca = normalizarMarca(marcaOriginal);
    const codigo2 = `CÓD. ${codigo}`;
    const desc = nome;
    const unicode = `${codigo}\t${desc}\t${preco}\t${codigo2}\t${departamento}\t${desc}\t${marca}\t\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${marca}.jpg\t\\\\172.30.217.2\\winthor\\IMAGEM\\${codigo}.jpg`;

    const linhaTabela = `
      <tr>
        <td>${codigo}</td>
        <td>${nome}</td>
        <td>${preco}</td>
        <td>${departamento}</td>
        <td>${marca}</td>
        <td>\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${marca}.jpg</td>
        <td>\\\\172.30.217.2\\winthor\\IMAGEM\\${codigo}.jpg</td>
        <td>${unicode}</td>
      </tr>
    `;
    tabela.insertAdjacentHTML("beforeend", linhaTabela);

    produtosAdicionados.push({ codigo, unicode });
  });

  input.value = "";
  precoInput.value = "";
}

function baixarTXT() {
  if (produtosAdicionados.length === 0) {
    alert("Nenhum produto adicionado.");
    return;
  }

  let conteudo = "CODIGO\tDESCRIÇÃO\tPRECO\tCODIGO2\tDEPTO\tDESCRICAO\tMARCA\t@FOTOMARCA\t@FOTOPRODUTO\n";
  conteudo += produtosAdicionados.map(p => p.unicode).join("\n");

  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "produtos_unicode.txt";
  link.click();
}
