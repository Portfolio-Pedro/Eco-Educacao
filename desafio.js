const SUPABASE_URL = 'https://ljmaflnjeglmyxmmblfp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbWFmbG5qZWdsbXl4bW1ibGZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjkzODIsImV4cCI6MjA2NDA0NTM4Mn0.z2aPVzSMVrFRjaTdGQygnLrRQq-OsLcecNurDM0Ody8';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const desafios = [
  { id: 1, titulo: 'Economizar Água', descricao: 'Feche a torneira ao escovar os dentes.' },
  { id: 2, titulo: 'Reduzir Plástico', descricao: 'Use garrafa reutilizável.' },
  { id: 3, titulo: 'Reciclagem', descricao: 'Separe lixo reciclável em casa.' },
];

const tabela = document.querySelector('#desafios-table tbody');
const messageEl = document.getElementById('message'); // se tiver um elemento para mensagens
let user = null;

async function loadUser() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    if (messageEl) messageEl.textContent = 'Você precisa fazer login para ver os desafios.';
    return false;
  }
  user = data.user;
  return true;
}

function carregarDesafios() {
  tabela.innerHTML = '';

  desafios.forEach(desafio => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${desafio.titulo}</td>
      <td>${desafio.descricao}</td>
      <td><button class="complete-btn">Concluir</button></td>
    `;

    const btn = tr.querySelector('button');
    btn.addEventListener('click', () => {
      tr.classList.add('completed');
      btn.remove();
      const td = tr.querySelector('td:last-child');
      td.innerHTML = '<span class="thanks-message">✅ Obrigado por contribuir!</span>';
    });

    tabela.appendChild(tr);
  });
}

async function init() {
  const loggedIn = await loadUser();
  if (!loggedIn) return;
  carregarDesafios();
}

window.onload = init;
