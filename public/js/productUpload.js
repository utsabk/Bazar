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


  fetchCategories(categoryOption);

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
