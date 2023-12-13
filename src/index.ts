import promptSync from "prompt-sync";

const prompt = promptSync();

const etapaFinal: string = prompt("Etapa final: ");
const receita: Map<string, string[]> = new Map();

let etapasRestantes: string[] = []; // Armazena os ingredientes que possuem etapas que os preparem

// Acidiona os ingredientes da etapa passada por parâmetro
const adicionarIngredientes: (etapa: string) => void = (etapa: string) => {
  while (true) {
    console.clear();

    const respostaIngredientes: string = prompt(
      `Informe, um por um, os ingredientes de ${etapa} (para encerrar, digite 0): `
    );

    if (respostaIngredientes === "0") {
      break;
    } else {
      const ingredientes: string[] = receita.get(etapa) || [];

      ingredientes.push(respostaIngredientes);
      receita.set(etapa, ingredientes);
    }
  }
};

// Verifica os ingredientes de uma etapa atual precisam de outra etapa para prepará-lo
const verificarIngredientes: () => void = () => {
  const etapaAtual: string = etapasRestantes[0];

  for (const ingrediente of receita.get(etapaAtual) || []) {
    // Se o ingrediente atual já estiver na receita como uma etapa própria, ele é ignorado
    if (!receita.has(ingrediente)) {
      console.clear();

      const temEtapaAdicional: boolean = ["sim", "s"].includes(
        prompt(
          `O ingrediente ${ingrediente} precisa de uma etapa para prepará-lo? `
        ).toLowerCase()
      );

      // Se o ingrediente possui uma etapa própria, adiciona os ingredientes dessa etapa
      if (temEtapaAdicional) {
        adicionarIngredientes(ingrediente);
        // Adiciona a etapa adicional à lista de etapas restantes
        etapasRestantes.push(ingrediente);
      }
    }
  }

  // Remove a etapa atual do array de etapas restantes após ela ter sido verificada
  etapasRestantes.shift();
};

// Verifica se a receita é válida
const ehValido: (receita: Map<string, string[]>) => boolean = (
  receita: Map<string, string[]>
): boolean => {
  for (const [etapa, ingredientes] of receita) {
    for (const ingrediente of ingredientes) {
      // Verifica se há um conflito de prioridade na receita
      if (
        receita.has(ingrediente) &&
        receita.get(ingrediente)?.includes(etapa)
      ) {
        // Se houver conflito, exibe uma mensagem de erro e retorna falso
        console.log(
          `IMPOSSÍVEL: ${etapa} usa ${ingrediente} e ${ingrediente} usa ${etapa}`
        );
        return false;
      }
    }
  }

  // Se não houver conflito, exibe "OK" e retorna verdadeiro
  console.log("OK");
  return true;
};

// Inicia o processo de adição de ingredientes para a etapa final
adicionarIngredientes(etapaFinal);
//Adiciona a etapa final da receita à lista de etapas restantes
etapasRestantes.push([...receita.keys()][0]);

// Verifica os ingredientes para as etapas enquanto houver etapas restantes
while (etapasRestantes.length > 0) {
  verificarIngredientes();
}

console.log(receita);

ehValido(receita);
