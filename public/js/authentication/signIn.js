(async () => {
  'use strict';

  // SignIn form elements
  const signInForm = document.getElementById('loginForm');
  const signInEmail = document.getElementById('signInEmail');
  const signInPassword = document.getElementById('signInPassword');

  signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const query = {
      query: `
        {
            login(
                username:"${signInEmail.value}",
                password:"${signInPassword.value}"
            ){
                id
                name
                email
                token
            }
        }
     `,
    };
    try {
      const result = await fetchGraphql(query);
      console.log('Result of login:--', result);

      sessionStorage.setItem('userId', result.login.id);
      sessionStorage.setItem('token', result.login.token);

      location.replace('../index.html');
    } catch (e) {
      console.log('error', e.message);
    }
  });
})();
