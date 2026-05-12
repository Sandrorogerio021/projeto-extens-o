<template>
  <div class="max-w-md mx-auto p-4 text-center">
    <!-- Cabeçalho de Pontuação -->
    <div class="flex justify-between items-center mb-6 bg-blue-600 text-white p-5 rounded-3xl shadow-xl border-b-4 border-blue-800">
      <div class="text-left">
        <p class="text-xs opacity-80 uppercase font-black">Explorador</p>
        <p class="text-xl font-bold">{{ user.nome }}</p>
      </div>
      <div class="bg-white text-blue-600 px-4 py-2 rounded-2xl font-black text-2xl shadow-inner">
        {{ pontos }}
      </div>
    </div>

    <!-- Card Principal do Desafio -->
    <div class="card-infantil min-h-[400px] flex flex-col justify-center items-center gap-8">
      <div class="space-y-2">
        <span class="bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-xs font-black uppercase">
          Nível: {{ desafio.tipo === 'math' ? 'Raciocínio' : 'Observação' }}
        </span>
        <h2 class="text-3xl font-black text-gray-800 leading-tight">
          {{ desafio.pergunta }}
        </h2>
      </div>

      <!-- Renderização Dinâmica de Opções: Matemática -->
      <div v-if="desafio.tipo === 'math'" class="grid grid-cols-2 gap-4 w-full">
        <button v-for="opc in desafio.opcoes" :key="opc" @click="verificar(opc)"
          class="bg-orange-400 hover:bg-orange-500 text-white text-3xl font-black py-6 rounded-3xl shadow-lg transform active:scale-95 transition-all border-b-4 border-orange-600">
          {{ opc }}
        </button>
      </div>

      <!-- Renderização Dinâmica de Opções: Formas Geométricas -->
      <div v-else class="grid grid-cols-2 gap-4 w-full">
        <button v-for="forma in desafio.opcoes" :key="forma.nome" @click="verificar(forma.nome)"
          class="flex flex-col items-center justify-center p-6 bg-gray-50 border-4 border-gray-100 rounded-[2rem] hover:border-blue-400 hover:bg-blue-50 transition-all transform active:scale-95 group">
          <component :is="forma.icon" :size="64" :color="forma.cor" stroke-width="3" class="group-hover:scale-110 transition-transform" />
          <span class="mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">{{ forma.nome }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Square, Circle, Triangle, Star, Hexagon, Octagon } from 'lucide-vue-next';
import confetti from 'canvas-confetti';
import axios from 'axios';

const props = defineProps(['user']);
const pontos = ref(0);
const desafio = ref({});

// URL do seu servidor oficial no Render
const API_URL = 'https://portal-magico.onrender.com';

// Biblioteca Estendida de Formas
const bibliotecaFormas = [
  { nome: 'Quadrado', icon: Square, cor: '#FF6B6B' },
  { nome: 'Círculo', icon: Circle, cor: '#4D96FF' },
  { nome: 'Triângulo', icon: Triangle, cor: '#FFD93D' },
  { nome: 'Estrela', icon: Star, cor: '#6BCB77' },
  { nome: 'Hexágono', icon: Hexagon, cor: '#A259FF' },
  { nome: 'Octógono', icon: Octagon, cor: '#FF9F43' }
];

const gerarDesafio = () => {
  const tipoSorteado = Math.random() > 0.5 ? 'math' : 'shapes';

  if (tipoSorteado === 'math') {
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 10);
    const resultadoCorreto = n1 + n2;
    
    const opcoes = new Set([resultadoCorreto]);
    while (opcoes.size < 4) {
      const erro = Math.max(0, resultadoCorreto + (Math.floor(Math.random() * 5) - 2));
      opcoes.add(erro);
    }

    desafio.value = {
      tipo: 'math',
      pergunta: `Quanto é ${n1} + ${n2}?`,
      correta: resultadoCorreto,
      opcoes: Array.from(opcoes).sort(() => Math.random() - 0.5)
    };
  } else {
    const selecionadas = [...bibliotecaFormas]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    
    const alvo = selecionadas[Math.floor(Math.random() * selecionadas.length)];

    desafio.value = {
      tipo: 'shapes',
      pergunta: `Onde está o ${alvo.nome}?`,
      correta: alvo.nome,
      opcoes: selecionadas
    };
  }
};

const verificar = async (valor) => {
  const acertou = valor === desafio.value.correta;
  
  if (acertou) {
    pontos.value += 10;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4D96FF', '#6BCB77', '#FFD93D']
    });
  }

  // Envia os dados para o Render
  try {
    await axios.post(`${API_URL}/respostas`, {
      aluno_id: props.user.id,
      pergunta: desafio.value.pergunta,
      resposta_dada: String(valor),
      correta: acertou
    });
  } catch (e) {
    console.error("Erro ao salvar resposta no Render:", e);
  }

  gerarDesafio();
};

onMounted(gerarDesafio);
</script>