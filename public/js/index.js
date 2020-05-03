'use strict';

const sectionTitle = document.querySelector('.section-title h3');
const productContainer = document.querySelector('.products-cotainer');
const home = document.getElementById('home');

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('input[name=search]');

// Populate navigation bar fetching data from graphql
const navBar = document.getElementById('navBar');
(async () => {
  const categories = await fetchCategories();
  categories.categories.forEach((category) => {
    const list = document.createElement('li');
    list.innerHTML += `<a href="#">${category.Title}</a>`;

    navBar.appendChild(list);

    list.addEventListener('click', () => {
      getProducts(category.id);
    });
  });
})();

const populateProduct = (product) => {
  sectionTitle.innerHTML = 'All Products';
  const article = document.createElement('article');
  article.className = 'product';
  article.innerHTML += `
              <div class="product-img">
                <img src="../${product.Image}" alt="" />
              </div>
              <div class="product-body">
                <h3 class="product-name">
                  <a href="#">${product.Name}</a>
                </h3>
                <p class="product-status">${product.Status.Title}</p>

                <h4 class="product-price">${product.Price}€</h4>

                <button class="quick-view">
					<span> View Item</span>
                </button>
              </div>
      `;
  productContainer.appendChild(article);

  article.addEventListener('click', () => {
    location.replace('../productdetails.html?' + product.id);
    // populateProductDetails(product);
  });
};

const getProducts = async (id) => {
  productContainer.innerHTML = '';
  const result = await fetchProducts(false, id);
  result.products.forEach((product) => {
    populateProduct(product);
  });
};

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = {
    query: `
   {
    search(text:"${searchInput.value}"){
      id
      Name
      Description 
      Price 
      Status{\n id\n Title\n }\n 
      Category{\n id\n Title\n }\n 
      Image\n
      Owner{\n id\n name\n email\n phone\n dp\n }\n 
      Location{\n coordinates\n }\n
    }
  }`,
  };

  try {
    const result = await fetchGraphql(query);
    console.log('This is a result:-', result.search.length);
    if (result.search.length > 0) {
      productContainer.innerHTML = ''; // delete before populating
      result.search.forEach((product) => {
        populateProduct(product);
      });
    }else{
      location.href ='./notfound.html'
    }
  } catch (err) {
    console.log('Error while fetching a search');
  }
});

window.addEventListener('load', () => {
  getProducts();
});
home.addEventListener('click', () => {
  getProducts();
});
