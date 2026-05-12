<template>
  <div class="max-w-sm mx-auto bg-white p-8 rounded-[2rem] shadow-xl border-b-8 border-gray-200 mt-10">
    <h2 class="text-2xl font-black text-center mb-6 text-orange-500 uppercase tracking-tighter">
      Portal Mágico 🚀
    </h2>
    
    <div class="flex gap-2 mb-6 justify-center">
      <button @click="role = 'aluno'" :class="role === 'aluno' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'" class="px-5 py-2 rounded-full font-bold transition-all text-sm">Sou Aluno</button>
      <button @click="role = 'professor'" :class="role === 'professor' ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'" class="px-5 py-2 rounded-full font-bold transition-all text-sm">Sou Professor</button>
    </div>

    <div class="space-y-4">
      <input v-model="form.nome" placeholder="Seu Nome" class="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-400 transition-colors">
      
      <input v-if="role === 'aluno'" v-model="form.idade" type="number" placeholder="Sua Idade" class="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-400">
      
      <input v-else v-model="form.senha" type="password" placeholder="Senha Secreta" class="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-purple-400">

      <button @click="entrar" class="w-full bg-green-400 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-green-500 active:scale-95 transition-all text-lg">
        ENTRAR NO MUNDO ✨
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';

const emit = defineEmits(['logado']);
const role = ref('aluno');
const form = reactive({ nome: '', idade: '', senha: '' });

const entrar = async () => {
  if (!form.nome) return alert("Digite seu nome!");
  try {
    // Tenta login, se falhar (404), tenta cadastrar
    const res = await axios.post('http://localhost:3000/login', { ...form, role: role.value })
      .catch(async () => {
        return await axios.post('http://localhost:3000/cadastro', { ...form, role: role.value });
      });
    
    const userData = { ...form, id: res.data.id || res.data, role: role.value };
    emit('logado', userData);
  } catch (e) {
    alert("Erro na conexão com o servidor!");
  }
};
</script>