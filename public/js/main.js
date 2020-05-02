'use strict';

const apiURL = './graphql';

// general fetch from graphql API
const fetchGraphql = async (query) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
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
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
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
    query: `{
             owner(id:"${userId}")
            { 
              id\n name\n email\n password\n phone\n dp\n 
            }\n }`,
  };
  const response = await fetchGraphql(query);
  return response;
};

// User Id saved in the session
const userID = sessionStorage.getItem('userId');

// Socket Id saved in the session

const fetchUserName = async (uID) => {
  try {
    const user = await fetchUser(uID);
    return user.owner.name;
  } catch (err) {
    new Error(err.message);
  }
};

// Populate username if user is signed in
(async () => {
  const signInBtn = document.getElementById('SignInBtn');
  const userIcon = document.getElementById('userIcon');
  if (userID) {
    const username = await fetchUserName(userID);
    signInBtn.innerHTML = username;
    signInBtn.href = '../user.html';
    userIcon.className = '';
  }
})();

const fetchProduct = async (id) => {
  const query = {
    query: `{\n product(id:"${id}")
    {\nid\n
       Name\n 
      Description\n 
      Price\n 
      Status{\n id\n Title\n }\n 
      Category{\n id\n Title\n }\n 
      Image\n 
      Owner{\n id\n name\n email\n phone\n dp\n }\n 
      Location{\n coordinates\n }\n
    }
  }`,
  };
  const result = await fetchGraphql(query);
  return result;
};

const fetchProducts = async (userId, categoryId) => {
  let myQuery;

  const returnFields = `id\n Name\n Description\n Price\n Status{\n id\n Title\n }\n 
  Category{\n id\n Title\n }\n Image\n Owner{\n id\n name\n email\n phone\n dp\n }\n Location{\n coordinates\n }\n`;

  if (userId) {
    myQuery = {
      query: `{\n products(userId:"${userId}"){\n ${returnFields}\n }\n }\n `,
    };
  } else if (categoryId) {
    myQuery = {
      query: `{\n products(categoryId:"${categoryId}"){\n ${returnFields}\n }\n }\n `,
    };
  } else {
    myQuery = {
      query: `{\n products{\n ${returnFields}\n }\n }\n `,
    };
  }
  const result = await fetchGraphql(myQuery);
  return result;
};

const timeAgo = (time) => {
  let result;

  const difference = Date.now() - time;

  if (difference < 5 * 1000) {
    return 'just now';
  } else if (difference < 90 * 1000) {
    return 'moments ago';
  }

  //it has minutes
  if ((difference % 1000) * 3600 > 0) {
    if (Math.floor((difference / 1000 / 60) % 60) > 0) {
      let s = Math.floor((difference / 1000 / 60) % 60) == 1 ? '' : 's';
      result = `${Math.floor((difference / 1000 / 60) % 60)} minute${s} `;
    }
  }

  //it has hours
  if ((difference % 1000) * 3600 * 60 > 0) {
    if (Math.floor((difference / 1000 / 60 / 60) % 24) > 0) {
      let s = Math.floor((difference / 1000 / 60 / 60) % 24) == 1 ? '' : 's';
      result =
        `${Math.floor((difference / 1000 / 60 / 60) % 24)} hour${s}${
          result == '' ? '' : ','
        } ` + result;
    }
  }

  //it has days
  if ((difference % 1000) * 3600 * 60 * 24 > 0) {
    if (Math.floor(difference / 1000 / 60 / 60 / 24) > 0) {
      let s = Math.floor(difference / 1000 / 60 / 60 / 24) == 1 ? '' : 's';
      result =
        `${Math.floor(difference / 1000 / 60 / 60 / 24)} day${s}${
          result == '' ? '' : ','
        } ` + result;
    }
  }

  return result + ' ago';
};
