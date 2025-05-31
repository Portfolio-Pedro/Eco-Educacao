window.onload = function() {

const SUPABASE_URL = 'https://ljmaflnjeglmyxmmblfp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbWFmbG5qZWdsbXl4bW1ibGZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjkzODIsImV4cCI6MjA2NDA0NTM4Mn0.z2aPVzSMVrFRjaTdGQygnLrRQq-OsLcecNurDM0Ody8'; 

 const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const tabelaBody = document.querySelector('#ranking-alunos tbody');
const loadingMsg = document.getElementById('loading-message');
const errorMsg = document.getElementById('error-message');

async function carregarRankingAlunos() {
  try {
    loadingMsg.style.display = 'block';
    errorMsg.style.display = 'none';
    tabelaBody.innerHTML = '';

    const { data, error } = await supabaseClient
      .from('profiles')
      .select(`
        id,
        name,
        school_id,
        school(name),
        completed_challenges!inner(
          challenge_id,
          challenges(points)
        )
      `);

    if (error) throw error;

    const ranking = data.map(aluno => {
      const pontos = aluno.completed_challenges.reduce((sum, cc) => sum + (cc.challenges?.points || 0), 0);
      return {
        id: aluno.id,
        name: aluno.name,
        school: aluno.school?.name || 'Sem sala',
        points: pontos,
      };
    });

    ranking.sort((a, b) => b.points - a.points);

    ranking.forEach((aluno, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${aluno.name}</td>
        <td>${aluno.school}</td>
        <td>${aluno.points}</td>
      `;
      tabelaBody.appendChild(tr);
    });

    loadingMsg.style.display = 'none';

  } catch (error) {
    loadingMsg.style.display = 'none';
    errorMsg.style.display = 'block';
    errorMsg.textContent = 'Erro ao carregar ranking: ' + error.message;
    console.error(error);
  }
}

window.addEventListener('load', carregarRankingAlunos);

};