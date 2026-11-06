// Configuração fixa do aluno (Turma e Chamada)
const CONFIG_ALUNO = {
  turma: "9B",
  numeroChamada: 6,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Variavel em memoria para guardar o PIN durante a sessao ativa
let pinSessao = "";

// Dados fictícios padrão dos estudantes do 9º Ano
const dadosBoletimPadrao = [
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

// Array dinâmico que armazenará o estado atual dos dados no navegador
let dadosBoletimAtual = [];

// Função para normalizar as notas antigas/locais para a escala de 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  let notaNum = parseFloat(String(valor).replace(",", "."));

  if (isNaN(notaNum)) {
    return null;
  }

  if (notaNum > 10 && notaNum <= 100) {
    notaNum = notaNum / 10;
  }

  if (notaNum >= 0 && notaNum <= 10) {
    return notaNum;
  }

  return null;
}

// Função para renderizar e calcular o boletim na tela
function renderizarBoletim(listaDisciplinas) {
  const tabelaTbody = document.getElementById("tabela-boletim");
  tabelaTbody.innerHTML = "";

  let somaMedias = 0;
  let contMediasValidas = 0;
  let acumuladorFaltasGeral = 0;
  let disciplinasBomDesempenho = 0;
  let disciplinasAtencao = 0;

  listaDisciplinas.forEach(item => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    let totalFaltasDisciplina = 0;
    if (Array.isArray(item.faltas)) {
      totalFaltasDisciplina = item.faltas.reduce((acc, f) => acc + Number(f || 0), 0);
    } else if (typeof item.faltas === 'number') {
      totalFaltasDisciplina = item.faltas;
    }

    acumuladorFaltasGeral += totalFaltasDisciplina;

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

    const formatarExibicao = (n) => n !== null ? n.toFixed(1).replace(".", ",") : "—";

    const tr = document.createElement("tr");
    
    // Inserção segura no DOM usando textContent para evitar problemas de segurança
    const tdDisc = document.createElement("td");
    const strongDisc = document.createElement("strong");
    strongDisc.textContent = item.disciplina;
    tdDisc.appendChild(strongDisc);

    const tdT1 = document.createElement("td");
    tdT1.textContent = formatarExibicao(n1);

    const tdT2 = document.createElement("td");
    tdT2.textContent = formatarExibicao(n2);

    const tdT3 = document.createElement("td");
    tdT3.textContent = formatarExibicao(n3);

    const tdMedia = document.createElement("td");
    const strongMedia = document.createElement("strong");
    strongMedia.textContent = media !== null ? media.toFixed(1).replace(".", ",") : "—";
    tdMedia.appendChild(strongMedia);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = totalFaltasDisciplina;

    const tdSit = document.createElement("td");
    tdSit.className = classeSituacao;
    tdSit.textContent = situacao;

    tr.appendChild(tdDisc);
    tr.appendChild(tdT1);
    tr.appendChild(tdT2);
    tr.appendChild(tdT3);
    tr.appendChild(tdMedia);
    tr.appendChild(tdFaltas);
    tr.appendChild(tdSit);

    tabelaTbody.appendChild(tr);
  });

  const mediaGeralCalculada = contMediasValidas > 0 ? (somaMedias / contMediasValidas).toFixed(1).replace(".", ",") : "—";
  
  document.getElementById("card-media-geral").textContent = mediaGeralCalculada;
  document.getElementById("card-total-faltas").textContent = acumuladorFaltasGeral;
  document.getElementById("card-bom-desempenho").textContent = disciplinasBomDesempenho;
  document.getElementById("card-atencao").textContent = disciplinasAtencao;
  document.getElementById("card-frequencia").textContent = "92%";
}

// Acesso via API (Endpoint /abrir)
async function efetuarLogin() {
  const inputPin = document.getElementById("input-pin");
  const msgAcesso = document.getElementById("msg-acesso");
  const pinDigitado = inputPin.value.trim();

  if (!pinDigitado) {
    msgAcesso.className = "msg-status erro";
    msgAcesso.textContent = "Por favor, digite o seu PIN.";
    return;
  }

  msgAcesso.className = "msg-status info";
  msgAcesso.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgAcesso.className = "msg-status erro";
      msgAcesso.textContent = "Turma, chamada ou PIN inválidos.";
      return;
    }

    if (resposta.status === 429) {
      msgAcesso.className = "msg-status erro";
      msgAcesso.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      return;
    }

    if (!resposta.ok) {
      msgAcesso.className = "msg-status erro";
      msgAcesso.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      return;
    }

    const resultado = await resposta.json();

    // Guarda PIN estritamente em memória
    pinSessao = pinDigitado;
    inputPin.value = ""; // Limpa o campo para segurança

    // Define quais dados exibir (Regra: DADOS DA API > DADOS LOCAIS)
    if (resultado.dados && Array.isArray(resultado.dados.disciplinas) && resultado.dados.disciplinas.length > 0) {
      dadosBoletimAtual = resultado.dados.disciplinas;
    } else {
      dadosBoletimAtual = JSON.parse(JSON.stringify(dadosBoletimPadrao));
    }

    // Atualiza a visualização
    document.getElementById("area-acesso").classList.add("escondido");
    document.getElementById("conteudo-boletim").classList.remove("escondido");
    renderizarBoletim(dadosBoletimAtual);

  } catch (erro) {
    msgAcesso.className = "msg-status erro";
    msgAcesso.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
}

// Montagem da interface do formulário de edição
function abrirPainelEdicao() {
  const containerCampos = document.getElementById("container-campos-edicao");
  containerCampos.innerHTML = "";
  document.getElementById("msg-edicao").textContent = "";

  dadosBoletimAtual.forEach((item, index) => {
    let f1 = 0, f2 = 0, f3 = 0;
    if (Array.isArray(item.faltas)) {
      f1 = item.faltas[0] !== undefined ? item.faltas[0] : 0;
      f2 = item.faltas[1] !== undefined ? item.faltas[1] : 0;
      f3 = item.faltas[2] !== undefined ? item.faltas[2] : 0;
    }

    const divItem = document.createElement("div");
    divItem.className = "item-edicao-disciplina";

    const h4 = document.createElement("h4");
    h4.textContent = item.disciplina;
    divItem.appendChild(h4);

    const divRow = document.createElement("div");
    divRow.className = "inputs-row";

    const formatValorEdicao = (v) => v !== null && v !== undefined ? String(v) : "";

    divRow.innerHTML = `
      <div class="campo-input-group">
        <label>1º Tri Nota</label>
        <input type="text" id="nota-1-${index}" value="${formatValorEdicao(item.tri1)}" placeholder="0-10">
      </div>
      <div class="campo-input-group">
        <label>2º Tri Nota</label>
        <input type="text" id="nota-2-${index}" value="${formatValorEdicao(item.tri2)}" placeholder="0-10">
      </div>
      <div class="campo-input-group">
        <label>3º Tri Nota</label>
        <input type="text" id="nota-3-${index}" value="${formatValorEdicao(item.tri3)}" placeholder="0-10">
      </div>
      <div class="campo-input-group">
        <label>1º Tri Faltas</label>
        <input type="number" id="falta-1-${index}" value="${f1}" min="0">
      </div>
      <div class="campo-input-group">
        <label>2º Tri Faltas</label>
        <input type="number" id="falta-2-${index}" value="${f2}" min="0">
      </div>
      <div class="campo-input-group">
        <label>3º Tri Faltas</label>
        <input type="number" id="falta-3-${index}" value="${f3}" min="0">
      </div>
    `;

    divItem.appendChild(divRow);
    containerCampos.appendChild(divItem);
  });

  document.getElementById("area-edicao").classList.remove("escondido");
}

function fecharPainelEdicao() {
  document.getElementById("area-edicao").classList.add("escondido");
}

// Validação de notas editadas pelo estudante
function validarNotaDigitada(str) {
  if (str === null || str === undefined || str.trim() === "") {
    return { valido: true, valor: null };
  }
  
  const textoLimpo = str.trim();
  // Não aceita notas maiores que 10 como 75 ou 100 na edição
  if (!/^\d+([.,]\d+)?$/.test(textoLimpo)) {
    return { valido: false };
  }

  const valorNum = parseFloat(textoLimpo.replace(",", "."));
  if (isNaN(valorNum) || valorNum < 0 || valorNum > 10) {
    return { valido: false };
  }

  return { valido: true, valor: valorNum };
}

// Validação de faltas editadas pelo estudante
function validarFaltaDigitada(str) {
  if (str === null || str === undefined || str.trim() === "") {
    return { valido: false };
  }

  const textoLimpo = str.trim();
  if (!/^\d+$/.test(textoLimpo)) {
    return { valido: false };
  }

  const valorNum = parseInt(textoLimpo, 10);
  if (isNaN(valorNum) || valorNum < 0) {
    return { valido: false };
  }

  return { valido: true, valor: valorNum };
}

// Salvar no Backend via API (Endpoint /salvar)
async function salvarAlteracoes() {
  const msgEdicao = document.getElementById("msg-edicao");
  msgEdicao.textContent = "";

  let temErro = false;
  const novasDisciplinas = [];

  // Remove marcações prévias de erro visual
  document.querySelectorAll(".campo-input-group input").forEach(i => i.classList.remove("invalido"));

  dadosBoletimAtual.forEach((item, index) => {
    const elN1 = document.getElementById(`nota-1-${index}`);
    const elN2 = document.getElementById(`nota-2-${index}`);
    const elN3 = document.getElementById(`nota-3-${index}`);
    const elF1 = document.getElementById(`falta-1-${index}`);
    const elF2 = document.getElementById(`falta-2-${index}`);
    const elF3 = document.getElementById(`falta-3-${index}`);

    const resN1 = validarNotaDigitada(elN1.value);
    const resN2 = validarNotaDigitada(elN2.value);
    const resN3 = validarNotaDigitada(elN3.value);

    const resF1 = validarFaltaDigitada(elF1.value);
    const resF2 = validarFaltaDigitada(elF2.value);
    const resF3 = validarFaltaDigitada(elF3.value);

    if (!resN1.valido) { elN1.classList.add("invalido"); temErro = true; }
    if (!resN2.valido) { elN2.classList.add("invalido"); temErro = true; }
    if (!resN3.valido) { elN3.classList.add("invalido"); temErro = true; }

    if (!resF1.valido) { elF1.classList.add("invalido"); temErro = true; }
    if (!resF2.valido) { elF2.classList.add("invalido"); temErro = true; }
    if (!resF3.valido) { elF3.classList.add("invalido"); temErro = true; }

    novasDisciplinas.push({
      disciplina: item.disciplina,
      tri1: resN1.valor,
      tri2: resN2.valor,
      tri3: resN3.valor,
      faltas: [resF1.valor || 0, resF2.valor || 0, resF3.valor || 0]
    });
  });

  if (temErro) {
    msgEdicao.className = "msg-status erro";
    msgEdicao.textContent = "Verifique os campos destacadas em vermelho. Notas devem ser entre 0 e 10 (ou vazio) e faltas números inteiros.";
    return;
  }

  msgEdicao.className = "msg-status info";
  msgEdicao.textContent = "Salvando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novasDisciplinas
        }
      })
    });

    if (!resposta.ok) {
      msgEdicao.className = "msg-status erro";
      msgEdicao.textContent = "Erro ao salvar alterações no servidor. Tente novamente.";
      return;
    }

    // Atualiza estado local e renderização gráfica da tela
    dadosBoletimAtual = novasDisciplinas;
    renderizarBoletim(dadosBoletimAtual);

    msgEdicao.className = "msg-status sucesso";
    msgEdicao.textContent = "Dados salvos com sucesso.";

    setTimeout(() => {
      fecharPainelEdicao();
    }, 1200);

  } catch (erro) {
    msgEdicao.className = "msg-status erro";
    msgEdicao.textContent = "Erro de conexão ao tentar salvar os dados.";
  }
}

// Event Listeners dos componentes interativos
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-entrar").addEventListener("click", efetuarLogin);

  document.getElementById("input-pin").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      efetuarLogin();
    }
  });

  document.getElementById("btn-alterar-dados").addEventListener("click", abrirPainelEdicao);
  document.getElementById("btn-cancelar-edicao").addEventListener("click", fecharPainelEdicao);
  document.getElementById("btn-salvar-dados").addEventListener("click", salvarAlteracoes);
});