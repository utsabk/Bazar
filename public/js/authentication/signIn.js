(async () => {
  'use strict';

  
  // SignIn form elements
  const signInForm = document.getElementById('loginForm');
  const signInEmail = document.getElementById('signInEmail');
  const signInPassword = document.getElementById('signInPassword');

  

  signInForm.addEventListener('submit', async(event) => {
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

    const result = await fetchGraphql(query);
    console.log('Result of login:--',result)

  });
})();
