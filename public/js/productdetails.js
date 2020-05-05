'use strict';

const productContainer = document.querySelector('.products-cotainer');

const updateForm = document.getElementById('product-form');
const nameInput = document.querySelector('input[name=name]');
const descriptionInput = document.querySelector('textarea[name=description]');
const priceInput = document.querySelector('input[name=price]');
const statusOption = document.getElementById('status');
const deleteBtn = document.querySelector('.delete-btn');

const modal = document.getElementById('myModal');
const btn = document.getElementById('myBtn');
const span = document.getElementsByClassName('close')[0];

const productId = location.href.split('?').pop();

(async () => {
  const result = await fetchProduct(productId);
  populateProductDetails(result.product);
})();

const populateProductDetails = (product) => {
  console.log('This is a product coordinates', product.Location.coordinates.length);
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

  const location = document.createElement('section');
  location.id = 'map';

  productDetails.appendChild(sellerDetails);
  productDetails.appendChild(location);

  // Check product owner and authorization
  if (userID) {
    if (product.Owner.id != userID) {
      const askDetailsBtn = document.createElement('button');
      askDetailsBtn.innerHTML = 'Ask for details';
      productDetails.appendChild(askDetailsBtn);

      askDetailsBtn.addEventListener('click', (event) => {
        window.location = '../chat.html?' + product.Owner.id;
      });
    } else {
      const editItem = document.createElement('button');
      editItem.innerHTML = 'Edit this Item';
      productDetails.appendChild(editItem);

      editItem.addEventListener('click', () => {
        modal.style.display = 'block';
        fillModal(product);
      });

      deleteBtn.addEventListener('click', async () => {
        const result = await deleteProduct(product.id);
        console.log('this is a result:-', result);
        try {
          if (result.deleteProduct.id) {
             window.location = '../index.html';
          }
        } catch (err) {
          console.log('User decided to withdraw the delete action');
        }
      });

      updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
          const result = await updateProduct(product.id);
          if (result.modifyProduct.id) {
            modal.style.display = 'none';
            window.location = window.location; //another way of reloading cureent location
          } else {
            alert('Something went wrong');
          }
        } catch (err) {
          console.log(err);
        }
      });
    }
  }
  article.appendChild(productImage);
  article.appendChild(productDetails);

  // When the user clicks on <span> (x), close the modal
  span.onclick = () => {
    modal.style.display = 'none';
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  // <!--===============================================================================================-->

  // Populate product status  field
  (async () => {
    const status = await fetchProductStatus();
    status.productStatus.forEach((status) => {
      statusOption.innerHTML += `<option value="${status.id}">${status.Title}</option>`;
    });
  })();

  const fillModal = (product) => {
    updateForm.scrollIntoView();
    nameInput.value = product.Name;
    descriptionInput.value = product.Description;
    priceInput.value = product.Price;
  };

  const deleteProduct = async (id) => {
    const conf = confirm('Are you sure you want to delete this product?');
    if (!conf) return;
    const query = {
      query: `mutation\n {\n deleteProduct(id: "${id}"){\n id \n} \n}`,
    };
    try {
      const data = await fetchGraphql(query);
      console.log('data', data);
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };

  const updateProduct = async (id) => {
    const query = {
      query: `
      mutation{\n modifyProduct (
            id:"${id}",
            Name:"${nameInput.value}", 
            Description:"${descriptionInput.value}",
            Price:${priceInput.value},
            Status:"${statusOption.value}",
        )
        {\n id\n Name\n } 
     }`,
    };
    try {
      const result = await fetchGraphql(query);
      return result;
    } catch (err) {
      console.log('Err while updating product:-', err);
    }
  };

  // Add map to the productDetails
 
    // add map
    const mymap = L.map('map').setView([60.24, 24.74], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mymap);
    //add zoom control to the topright
    mymap.zoomControl.setPosition('topright');

    if (product.Location.coordinates.length > 0) {
    console.log('coordinates', product.Location.coordinates);
    // Since longitude comes first (not latitude) in a GeoJSON coordinate array saved in Mongoose.
    // we reverse the coordinates before drawing

    const circle = L.circle(product.Location.coordinates.reverse(), {
      color: 'blue',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 1500,
    }).addTo(mymap);
    mymap.setView(circle.getLatLng(), 10);
  }
};
