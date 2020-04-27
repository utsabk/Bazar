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

  const fetchFile = async (fd) => {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
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


  const fetchUser = async(userId)=>{
    const query = {
      query: `{\n owner(id:"${userId}")\n {\n id\n name\n }\n }\n `,
    };
    const response = await fetchGraphql(query);
    return response
  }