'use strict';

const apiURL = './graphql';

// general fetch from graphql API
const fetchGraphql = async (query) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(query),
  };
  try {
    const response = await fetch(apiURL, options);
    const json = await response.json();
    return json.data;
  } catch (e) {
    console.log('Error while fetching GQl', e.message);
    return false;
  }
};

// Fetch with media files
const fetchFile = async (fd) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: fd,
  };
  try {
    const response = await fetch(apiURL, options);
    const json = await response.json();
    return json.data;
  } catch (e) {
    console.log('Error while fetching GQl', e.message);
    return false;
  }
};

const fetchCategories = async () => {
  const query = {
    query: `{\n categories {\n id\n Title\n }\n }`,
  };

  const data = await fetchGraphql(query);

  return data;
};

const fetchProductStatus = async () => {
  const query = {
    query: `{\n productStatus{\n id\n Title\n }\n }`,
  };

  const data = await fetchGraphql(query);
  return data;
};

const fetchUser = async (userId) => {
  const query = {
    query: `{\n owner(id:"${userId}")\n {\n id\n name\n }\n }\n `,
  };
  const response = await fetchGraphql(query);
  return response;
};

// User Id saved in the session
const userID =  sessionStorage.getItem('userId');

const fetchUserName = async(uID)=>{
  try{
    const user = await fetchUser(uID)
    return user.owner.name
  }catch(err){
    new Error(err.message)
  }
}

// Populate username if user is signed in
(async () => {
  const signInBtn = document.getElementById('SignInBtn');
  const userIcon = document.getElementById('userIcon');
  if (userID) {
    const username = await fetchUserName(userID);
    signInBtn.innerHTML = username;
    signInBtn.href = '#';
    userIcon.className = ''
  }
})();
