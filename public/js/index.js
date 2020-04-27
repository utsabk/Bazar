'use strict';

const sectionTitle = document.querySelector('.section-title h3');
const productContainer = document.querySelector('.products-cotainer');
const home = document.getElementById('home');

const signInBtn = document.getElementById('SignInBtn');

// Populate navigation bar fetching data from graphql
const navBar = document.getElementById('navBar');
(async () => {
  const categories = await fetchCategories();
  console.log('Inside asyncs', categories);
  categories.categories.forEach((category) => {
    const list = document.createElement('li');
    list.innerHTML += `<ahref="#">${category.Title}</a>`;

    navBar.appendChild(list);

    list.addEventListener('click', () => {
      getProducts(category.id);
    });
  });
})();

// Fetch username if user is signed in
(async () => {
  const userId = sessionStorage.getItem('userId');
  if (userId) {
    const users = await fetchUser(userId);
    signInBtn.innerHTML = users.owner.name;
    signInBtn.href = '#';
  }
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
    populateProductDetails(product);
  });
};

const populateProductDetails = (product) => {
  sectionTitle.innerHTML = 'Product';
  productContainer.innerHTML = '';
  const article = document.createElement('article');
  article.className = 'productItself';
  article.innerHTML = `
    <div class="product-main-img">
      <div class="product-preview">
        <img src="../${product.Image}" alt="" />
      </div>
    </div>

    <div class="product-details">
      <h2 class="product-name">${product.Name}</h2>
      <div>
        <h3 class="product-price">${product.Price}€</h3>
        <span class="product-available">${product.Status.Title}</span>
      </div>
      <p>
      ${product.Description}
      </p>

      <ul class="product-btns">
        <li>
          <a href="#"><i class="fa fa-heart-o"></i> add to wishlist</a>
        </li>
      </ul>

      <ul class="product-links">
        <li>Category:</li>
        <li><a href="#">${product.Category.Title}</a></li>
      </ul>
    </div>
  `;
  productContainer.appendChild(article);
};

const getProducts = async (id) => {
  productContainer.innerHTML = '';
  let myQuery;

  const returnFields = `id\n Name\n Description\n Price\n Status{\n id\n Title\n }\n 
  Category{\n id\n Title\n }\n Image\n Owner{\n id\n name\n }\n Location{\n coordinates\n }\n`;


  if (id) {
    myQuery = {
      query: `{\n products(categoryId:"${id}"){\n ${returnFields}\n }\n }\n `,
    };
  } else {
    myQuery = {
      query: `{\n products{\n ${returnFields}\n }\n }\n `,
    };
  }
  const result = await fetchGraphql(myQuery);
  result.products.forEach((product) => {
    populateProduct(product);
  });
};

window.addEventListener('load', () => {
  getProducts();
});
home.addEventListener('click', () => {
  getProducts();
});
