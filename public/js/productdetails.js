'use strict';

const productContainer = document.querySelector('.products-cotainer');
const productId = location.href.split('?').pop();

(async () => {
  console.log('productId', productId);
  const result = await fetchProduct(productId);
  console.log('This is a product:-', result.product);
  populateProductDetails(result.product);
})();

const populateProductDetails = (product) => {
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
         <div class="spec"
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
          </div> `;

  productContainer.appendChild(article);

  const sellerDetails = document.createElement('article');
  sellerDetails.className = 'seller-details';
  sellerDetails.innerHTML = `
        <h5>Seller Information</h5>
        <div class="seller-chip">
          <img src="../${product.Owner.dp}" alt="user" width="96" height="96" />
          <h3>${product.Owner.name}</h3> 
        </div>`;

  productDetails.appendChild(sellerDetails);

  // Check product owner and authorization
  if (userID) {
    if (product.Owner.id != userID) {
      const askDetailsBtn = document.createElement('button');
      askDetailsBtn.innerHTML = 'Ask for details';
      productDetails.appendChild(askDetailsBtn);

      askDetailsBtn.addEventListener('click', (event) => {
        location.replace('../chat.html?' + product.Owner.id);
      });
    } else {
      const editItem = document.createElement('button');
      editItem.innerHTML = 'Edit this Item';
      productDetails.appendChild(editItem);

      editItem.addEventListener('click', () => {
        console.log('Edit item clicked');
      });
    }
  }
  article.appendChild(productImage);
  article.appendChild(productDetails);
};
