(async () => {
  'use strict';

  const apiURL = './graphql';

  const insert = document.getElementById('insert-section');
  const productForm = document.getElementById('product-form');
  const categoryOption = document.getElementById('category');
  const statusOption = document.getElementById('status');

  const name = document.querySelector('input[name=name]');
  const description = document.querySelector('textarea[name=description]');
  const price = document.querySelector('input[name=price]');
  const location = document.querySelector('input[name=location]');
  const image = document.querySelector('input[name=productImage]');

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

  fetchCategories(categoryOption);

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

  fetchProductStatus(statusOption);

  productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const myFile = image.files[0];
    const formData = new FormData();
    const query = {
      query: `
      mutation($file: Upload!){
        addProduct (
            Name:"${name.value}", 
            Description:"${description.value}",
            Price:${price.value},
            Category:"${categoryOption.value}",
            Status:"${statusOption.value}",
            Image:$file,
            Location:{
                coordinates:[${location.value}]
            }
        )
        {
            id
            Name
        }
     }
        `,
    };
    formData.append('operations', JSON.stringify(query));
    formData.append('map', '{"0":["variables.file"]}');
    formData.append('0', myFile);
    const result = await fetchFile(formData);
  });
})();
