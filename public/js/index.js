'use strict';

const productDiv = document.getElementById('listOfProducts');
const home = document.getElementById('home');
const electronics = document.getElementById('electronics');
const stationary = document.getElementById('stationary');
const sports = document.getElementById('sports');
const fashion = document.getElementById('fashion');
const others = document.getElementById('others');


const signInBtn = document.getElementById('SignInBtn');


// Populate navigation bar fetching data from BACKEND
// const navBar = document.getElementById('navBar');
// (async () => {
//   const categories = await fetchCategories();
//   categories.categories.forEach((category) => {
//     navBar.innerHTML += `
//                     <li>
//                         <a id="${category.id}" href="shop.html">
//                             ${category.Title}
//                         </a>
//                     </li>
//                 `;
//   });
// })();


// Fetch username if user is signed in
(async()=>{
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      const users = await fetchUser(userId)
      signInBtn.innerHTML = users.owner.name;
      signInBtn.href = '#';
    }
})()



const populateProduct = (product) => {
  productDiv.innerHTML += `
      <div class="product">
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
            </div>
      `;
};

const fetchProductByCategoryId = async (id) => {
  productDiv.innerHTML = '';
  const query = {
    query: `
        {
            productsByCategory(id:"${id}"){
                id
                Image
                Name
                Price
                Status{
                    id
                    Title
                }
            }
        }
    `,
  };
  const result = await fetchGraphql(query);
  result.productsByCategory.forEach((aProduct) => {
    populateProduct(aProduct);
  });
};

const getAllProducts = async () => {
  // Delete any products if available
  productDiv.innerHTML = '';
  const query = {
    query: `
          {
              products{
                  id
                  Image
                  Name
                  Price
                  Status{
                      id
                      Title
                  }
              }
          }`,
  };

  const result = await fetchGraphql(query);
  result.products.forEach((aProduct) => {
    populateProduct(aProduct);
  });
};

window.addEventListener('load', getAllProducts);
home.addEventListener('click', getAllProducts);
electronics.addEventListener('click', () => {
  fetchProductByCategoryId('5e9e119b54049654fbc5f2da');
});
stationary.addEventListener('click', () => {
  fetchProductByCategoryId('5e9e11a654049654fbc5f2db');
});
sports.addEventListener('click', () => {
  fetchProductByCategoryId('5e9e11ab54049654fbc5f2dc');
});
fashion.addEventListener('click', () => {
  fetchProductByCategoryId('5e9e11b754049654fbc5f2de');
});
others.addEventListener('click', () => {
  fetchProductByCategoryId('5e9f393c6899885de294ca5e');
});
