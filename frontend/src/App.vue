<template>
  <div class="min-h-screen py-10 px-4 font-sans selection:bg-purple-200">
    <nav v-if="userLogado" class="max-w-md mx-auto flex gap-4 justify-center mb-10 bg-white p-3 rounded-full shadow-lg border-b-4 border-gray-100">
      <button @click="logout" class="text-red-500 font-black text-sm px-4 py-2 hover:bg-red-50 rounded-full transition-all">Sair</button>
    </nav>

    <Login v-if="!userLogado" @logado="onLogado" />
    
    <div v-else>
      <Jogo v-if="userLogado.role === 'aluno'" :user="userLogado" />
      <Dashboard v-if="userLogado.role === 'professor'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue';
import Jogo from './components/Jogo.vue';
import Dashboard from './components/Dashboard.vue';

const userLogado = ref(null);

const onLogado = (user) => {
  userLogado.value = user;
};

const logout = () => {
  userLogado.value = null;
};
</script>