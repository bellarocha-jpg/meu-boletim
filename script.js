// Dados fictícios dos estudantes do 9º Ano
const dadosBoletim = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// Função para normalizar as notas para a escala de 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Converte texto com vírgula para número com ponto
  let notaNum = parseFloat(String(valor).replace(",", "."));

  if (isNaN(notaNum)) {
    return null;
  }

  // Se a nota for maior que 10 e menor/igual a 100, divide por 10
  if (notaNum > 10 && notaNum <= 100) {
    notaNum = notaNum / 10;
  }

  // Garante que está no intervalo válido de 0 a 10
  if (notaNum >= 0 && notaNum <= 10) {
    return notaNum;
  }

  return null;
}

// Função para renderizar e calcular o boletim
function carregarBoletim() {
  const tabelaTbody = document.getElementById("tabela-boletim");
  tabelaTbody.innerHTML = "";

  let somaMedias = 0;
  let contMediasValidas = 0;
  let acumuladorFaltasGeral = 0;
  let disciplinasBomDesempenho = 0;
  let disciplinasAtencao = 0;

  // Percorre cada disciplina no array
  dadosBoletim.forEach(item => {
    // Normalização das notas de cada trimestre
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Cálculo das faltas da disciplina
    const totalFaltasDisciplina = item.faltas.reduce((acc, f) => acc + f, 0);
    acumuladorFaltasGeral += totalFaltasDisciplina;

    // Cálculo da média ignorando trimestres sem nota
    const notasValidas = [n1, n2, n3].filter(n => n !== null);
    let media = null;
    let situacao = "Nota ainda não disponível";
    let classeSituacao = "situacao-indisponivel";

    if (notasValidas.length > 0) {
      const somaNotas = notasValidas.reduce((acc, n) => acc + n, 0);
      media = somaNotas / notasValidas.length;
      somaMedias += media;
      contMediasValidas++;

      if (media >= 6.0) {
        situacao = "Bom desempenho";
        classeSituacao = "situacao-bom";
        disciplinasBomDesempenho++;
      } else {
        situacao = "Atenção";
        classeSituacao = "situacao-atencao";
        disciplinasAtencao++;
      }
    }

    // Formatação visual dos trimestres
    const formatarExibicao = (n) => n !== null ? n.toFixed(1).replace(".", ",") : "—";

    // Criação da linha da tabela na tela (DOM)
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${formatarExibicao(n1)}</td>
      <td>${formatarExibicao(n2)}</td>
      <td>${formatarExibicao(n3)}</td>
      <td><strong>${media !== null ? media.toFixed(1).replace(".", ",") : "—"}</strong></td>
      <td>${totalFaltasDisciplina}</td>
      <td class="${classeSituacao}">${situacao}</td>
    `;
    tabelaTbody.appendChild(tr);
  });

  // Atualiza os Cards de Resumo
  const mediaGeralCalculada = contMediasValidas > 0 ? (somaMedias / contMediasValidas).toFixed(1).replace(".", ",") : "—";
  
  document.getElementById("card-media-geral").textContent = mediaGeralCalculada;
  document.getElementById("card-total-faltas").textContent = acumuladorFaltasGeral;
  document.getElementById("card-bom-desempenho").textContent = disciplinasBomDesempenho;
  document.getElementById("card-atencao").textContent = disciplinasAtencao;

  // Nota: A frequência abaixo de 92% é apenas fictícia e demonstrativa nesta etapa.
  document.getElementById("card-frequencia").textContent = "92%";
}

// Executa a função quando o documento estiver carregado
document.addEventListener("DOMContentLoaded", carregarBoletim);