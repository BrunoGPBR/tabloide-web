let banco = [];
let usuarios = {
  "Designer": "1234",
  "Admin": "admin123"
};

document.getElementById("botao-login").addEventListener("click", verificarLogin);

function verificarLogin() {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const erroLogin = document.getElementById("erro-login");

  if (usuarios[usuario] && usuarios[usuario] === senha) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
  } else {
    erroLogin.textContent = "Usuário ou senha incorretos.";
  }
}

// Carrega o banco de dados
fetch("produtos_unicode_final_completo.json")
  .then(res => res.json())
  .then(data => {
    banco = data;
    console.log("Banco carregado:", banco.length, "produtos");
  })
  .catch(err => console.error("Erro ao carregar o banco:", err));

function adicionarProduto() {
  const codigosInput = document.getElementById("codigo").value.trim();
  const precoInput = document.getElementById("preco").value.trim();
  const tabela = document.getElementById("tabela");

  const linhas = codigosInput.split("\n").map(l => l.trim()).filter(l => l);

  linhas.forEach(linha => {
    let codigo = "";
    let nome = "";

    if (/^\d+\s+/.test(linha)) {
      const partes = linha.split(/\s+(.+)/);
      codigo = partes[1] ? partes[0] : "";
      nome = partes[1] || "";
    } else {
      codigo = linha;
    }

    const produto = banco.find(p => p.codigo.toString() === codigo);

    if (produto) {
      const preco = precoInput || produto.preco || "";
      const row = document.createElement("tr");

      const codigo2 = `CÓD. ${produto.codigo}`;
      const logo = `\\\\10.1.1.85\\mkt\\Comercial\\@LOGOS PRODUTOS\\${produto.fotoMarca || ""}.jpg`;
      const imagem = `\\\\172.30.217.2\\winthor\\IMAGEM\\${produto.codigo}.jpg`;

      const textoUnicode = [
        produto.codigo,
        produto.nome,
        preco,
        codigo2,
        produto.departamento || "",
        produto.nome,
        produto.fotoMarca || "",
        logo,
        imagem
      ].join("\t");

      row.innerHTML = `
        <td>${produto.codigo}</td>
        <td>${produto.nome}</td>
        <td>${preco}</td>
        <td>${produto.departamento || ""}</td>
        <td>${produto.fotoMarca || ""}</td>
        <td>${logo}</td>
        <td>${imagem}</td>
        <td>${textoUnicode}</td>
      `;

      tabela.appendChild(row);
    }
  });

  // Limpar inputs
  document.getElementById("codigo").value = "";
  document.getElementById("preco").value = "";
}

function baixarTXT() {
  const linhas = Array.from(document.querySelectorAll("#tabela tr"))
    .map(row => {
      const colunas = row.querySelectorAll("td");
      return colunas[colunas.length - 1]?.textContent || "";
    })
    .filter(txt => txt.trim());

  const cabecalho = "CODIGO\tDESCRIÇÃO\tPRECO\tCODIGO2\tDEPTO\tDESCRICAO\tMARCA\t@FOTOMARCA\t@FOTOPRODUTO";
  const conteudo = [cabecalho, ...linhas].join("\n");

  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tabloide_unicode.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
