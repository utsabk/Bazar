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

  const fetchCategories = async (element) => {
    const query = {
      query: `{
        categories {
        id
        Title
      }
    }`,
    };

    const data = await fetchGraphql(query);
    data.categories.forEach((category) => {
      element.innerHTML += `<option value="${category.id}">${category.Title}</option>`;
    });
  };


  const fetchProductStatus = async (element) => {
    const query = {
      query: `{
        productStatus{
          id
          Title
        }
      }`,
    };

    const data = await fetchGraphql(query);
    data.productStatus.forEach((status) => {
      element.innerHTML += `<option value="${status.id}">${status.Title}</option>`;
    });
  };
