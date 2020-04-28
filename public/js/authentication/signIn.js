(async () => {
  'use strict';

  // SignIn form elements
  const signInForm = document.getElementById('loginForm');
  const signInEmail = document.getElementById('signInEmail');
  const signInPassword = document.getElementById('signInPassword');
  const errorMessgae = document.querySelector('.login100-form-errorMessage');
  
  signInForm.addEventListener('submit', async (event) => {
    sessionStorage.clear();
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
      if(result.login){
        sessionStorage.setItem('userId', result.login.id);
        sessionStorage.setItem('token', result.login.token);
        location.replace('../index.html');
      }else{
        errorMessgae.innerHTML = "Username or password do not match"
      }

    } catch (e) {
      console.log('error', e.message);
    }
  });
})();
