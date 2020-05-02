(async () => {
  'use strict';

  const insert = document.getElementById('insert-section');
  const productForm = document.getElementById('product-form');
  const categoryOption = document.getElementById('category');
  const statusOption = document.getElementById('status');

  const name = document.querySelector('input[name=name]');
  const description = document.querySelector('textarea[name=description]');
  const price = document.querySelector('input[name=price]');
  const location = document.querySelector('input[name=location]');
  const image = document.querySelector('input[name=productImage]');

  const errorMessage = document.querySelector('.error-message-section');
  // Populate category field
  const categories = await fetchCategories();
  categories.categories.forEach((category) => {
    categoryOption.innerHTML += `<option value="${category.id}">${category.Title}</option>`;
  });

  // Populate product status  field
  const status = await fetchProductStatus();
  status.productStatus.forEach((status) => {
    statusOption.innerHTML += `<option value="${status.id}">${status.Title}</option>`;
  });

  productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const myFile = image.files[0];
    const formData = new FormData();
    const query = {
      query: `
      mutation($file: Upload!){\n product (
            Name:"${name.value}", 
            Description:"${description.value}",
            Price:${price.value},
            Category:"${categoryOption.value}",
            Status:"${statusOption.value}",
            Image:$file,
            Owner:"${sessionStorage.getItem('userId')}",
            Location:{\n coordinates:[${location.value}]\n }
        )
        {\n id\n Name\n } 
     }`,
    };
    formData.append('operations', JSON.stringify(query));
    formData.append('map', '{"0":["variables.file"]}');
    formData.append('0', myFile);
    const result = await fetchFile(formData);
    console.log('Result of upload:--', result);

    if (result.product) {
      errorMessage.innerHTML = '';
      try {
        window.location = '../index.html';
      } catch (err) {
        new Error(err.message);
      }
    } else {
      errorMessage.innerHTML = 'Make sure all the fields are filled.';
    }
  });
})();
