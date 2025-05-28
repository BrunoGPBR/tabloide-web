let banco = [];

fetch("produtos_unicode_final_completo.json")
  .then(res => res.json())
  .then(json => {
    banco = json;
    console.log(`Banco carregado: ${banco.length} produtos`);
  });

const tabela = document.querySelector("#tabela tbody");

function adicionarProduto(codigoManual = null, precoManual = null) {
  const codigo = codigoManual || document.getElementById("codigo").value.trim();
  const preco = precoManual || document.getElementById("preco").value.trim();
  const item = banco.find(p => p.codigo === codigo);
  if (!item) return;

  const tr = document.createElement("tr");
  const nomeUnicode = `${codigo} ${item.nome} ${preco}`;
  tr.innerHTML = `
    <td>${codigo}</td>
    <td>${item.nome}</td>
    <td>${preco}</td>
    <td>${item.departamento || ""}</td>
    <td>${item.marca}</td>
    <td>@${item.logo}</td>
    <td>@${codigo}.jpg</td>
    <td>${nomeUnicode}</td>
  `;
  tabela.appendChild(tr);
}

function adicionarEmLote() {
  const linhas = document.getElementById("lista").value.trim().split("\n");
  linhas.forEach(linha => {
    const partes = linha.trim().split(/\s+/);
    const codigo = partes[0];
    const preco = ""; // Pode vir de outro campo se desejar
    adicionarProduto(codigo, preco);
  });
}

function exportarTXT() {
  let txt = "";
  [...tabela.rows].forEach(row => {
    const cols = [...row.cells].map(td => td.textContent);
    txt += cols.join("\t") + "\n";
  });

  const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "produtos.txt";
  link.click();
}
