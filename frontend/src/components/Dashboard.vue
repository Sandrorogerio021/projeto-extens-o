<template>
  <div class="max-w-5xl mx-auto bg-white p-8 rounded-[2rem] shadow-2xl border-b-8 border-gray-200">
    <div class="flex justify-between items-center mb-10">
      <h2 class="text-3xl font-black text-purple-700 tracking-tight">Relatório de Evolução 🍎</h2>
      <button @click="atualizar" class="bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition-all">🔄 Atualizar</button>
    </div>

    <div class="grid gap-4">
      <div v-for="r in dados" :key="r.id" class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border-l-8 transition-all hover:translate-x-2" 
        :class="r.correta ? 'border-green-400' : 'border-red-400'">
        <div>
          <p class="font-black text-gray-800 text-lg">{{ r.nome }} <span class="font-normal text-sm text-gray-400">({{ r.idade }} anos)</span></p>
          <p class="text-gray-500 font-medium">{{ r.pergunta }}</p>
        </div>
        <div class="text-right">
          <p class="font-bold" :class="r.correta ? 'text-green-600' : 'text-red-600'">
            {{ r.correta ? 'Acertou!' : 'Errou' }}
          </p>
          <p class="text-xs text-gray-400">Respondeu: {{ r.resposta_dada }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const dados = ref([]);
const atualizar = async () => {
  const res = await axios.get('http://localhost:3000/admin/relatorio');
  dados.value = res.data;
};

onMounted(atualizar);
</script>