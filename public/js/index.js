'use strict';

const sectionTitle = document.querySelector('.section-title h3');
const productContainer = document.querySelector('.products-cotainer');
const home = document.getElementById('home');

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
    populateProductDetails(product);
  });
};

const populateProductDetails = (product) => {
  sectionTitle.innerHTML = 'Product';
  productContainer.innerHTML = '';
  const article = document.createElement('article');
  article.className = 'productItself';

  const productImage = document.createElement('div');
  productImage.className = 'product-main-img';
  productImage.innerHTML = `
      <div style="background-image: url('${product.Image}');" class="product-background"></div>
      <div class="product-preview">
        <img src="../${product.Image}" alt="" />
      </div>`;

  const productDetails = document.createElement('div');
  productDetails.className = 'product-details';
  productDetails.innerHTML = `
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
      </ul>  `;

  productContainer.appendChild(article);

  const sellerDetails = document.createElement('article');
  sellerDetails.className = 'seller-details';
  sellerDetails.innerHTML = `
    <h3>Seller Info</h3>
    <div class="seller-chip">
      <img src="../${product.Image}" alt="user" width="96" height="96" />
      <h3>${product.Owner.name}</h3> 
    </div>
    <ul class="more-details">
      <li><i class="fa fa-envelope" aria-hidden="true"></i>${product.Owner.email}</li>
      <li><i class="fa fa-phone" aria-hidden="true"></i>${product.Owner.phone}</li>
    </ul>`;
  productDetails.appendChild(sellerDetails);

  
  // Check product owner and authorization
  if (product.Owner.id != userID && userID ) {
    const askDetailsBtn = document.createElement('button');
    askDetailsBtn.innerHTML = 'Ask for details';
    productDetails.appendChild(askDetailsBtn);

    askDetailsBtn.addEventListener('click', (event) => {
      location.replace('../chat.html');
    });
  }

  // productDetails.innerHTML += sellerDetails.outerHTML + askDetailsBtn.outerHTML;

  //article.innerHTML += productImage.outerHTML + productDetails.outerHTML;

  article.appendChild(productImage);
  article.appendChild(productDetails);
};

const getProducts = async (id) => {
  productContainer.innerHTML = '';
  let myQuery;

  const returnFields = `id\n Name\n Description\n Price\n Status{\n id\n Title\n }\n 
  Category{\n id\n Title\n }\n Image\n Owner{\n id\n name\n email\n phone\n dp\n }\n Location{\n coordinates\n }\n`;

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
  result.products.forEach(async (product) => {
    await populateProduct(product);
  });
};

window.addEventListener('load', () => {
  getProducts();
});
home.addEventListener('click', () => {
  getProducts();
});
