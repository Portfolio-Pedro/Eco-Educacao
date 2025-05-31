console.log('login.js carregado');

const SUPABASE_URL = 'https://ljmaflnjeglmyxmmblfp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbWFmbG5qZWdsbXl4bW1ibGZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjkzODIsImV4cCI6MjA2NDA0NTM4Mn0.z2aPVzSMVrFRjaTdGQygnLrRQq-OsLcecNurDM0Ody8'; 

const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verifica se já está logado
(async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    window.location.href = 'desafios.html';
  }
})();

const form = document.getElementById('login-form');
const messageEl = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Formulário submetido');
  messageEl.textContent = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    messageEl.textContent = 'Preencha email e senha';
    return;
  }

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({ email, password });

        if (signUpError) {
          messageEl.textContent = `Erro ao registrar: ${signUpError.message}`;
          return;
        }

        messageEl.textContent = 'Registrado com sucesso! Verifique seu email.';
        return;
      }

      messageEl.textContent = `Erro ao entrar: ${error.message}`;
      return;
    }

    messageEl.textContent = 'Login realizado! Redirecionando...';
    setTimeout(() => {
      window.location.href = 'desafios.html';
    }, 1200);

  } catch (err) {
    messageEl.textContent = 'Erro inesperado.';
    console.error(err);
  }
});
