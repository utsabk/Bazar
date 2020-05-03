'use strict';

$(document).ready(async () => {
  const user = await fetchUser(userID);
  console.log('This is a user:-', user);
  if (user.owner.dp) {
    $('.profile-image img').attr('src', user.owner.dp);
  }
  $('.profile-user-settings h1').text(user.owner.name);

  const result = await fetchProducts(userID, false);
  console.log(result);
  $('.profile-stat-count .products').text(result.products.length);

  result.products.forEach((product) => {
    if (product.Owner.email) {
      $('.profile-stat-count #email').text(product.Owner.email);
    } else {
      $('.profile-stat-count #email').text('Not provided');
    }
    if (product.Owner.phone) {
      $('.profile-stat-count #phone').text(product.Owner.phone);
    } else {
      $('.profile-stat-count #phone').text('Not available');
    }

    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="../${product.Image}" class="gallery-image" alt="">`;

    $('.gallery').append(item);

    item.addEventListener('click', () => {
      console.log('eye clicked', product);
      location.replace('../productdetails.html?' + product.id);
    });
  });

  $('.btn.profile-edit-btn').click(() => {
    console.log('trash clicked');
  });

  $('#img').change(async (e) => {
    if (e.target.files.length) {
      const myFile = $('#img').prop('files')[0];
      const formData = new FormData();
      const query = {
        query: `
      mutation($file: Upload!){\n
         uploadImage (
          id:"${userID}", 
          image:$file 
        )
     }`,
      };
      formData.append('operations', JSON.stringify(query));
      formData.append('map', '{"0":["variables.file"]}');
      formData.append('0', myFile);
      const result = await fetchFile(formData);
      if (result) {
        location.reload();
      }
    } else {
      $('#label').text('No file selected');
    }
  });

  //<!--===============================================================================================-->

  $('.header-middle #sell').click(() => {
    $('#myModal').css('display', 'block');
    $(':root').css('font-size', '15px');
  });

  // When the user clicks on <span> (x), close the modal
  $('.close').click(() => {
    $('#myModal').css('display', 'none');
    $(':root').css('font-size', '10px');
  });

  // When the user clicks anywhere outside of the modal, close it
  $(window).click((event) => {
    if ($(event.target).is('#myModal')) {
      $('#myModal').css('display', 'none');
      $(':root').css('font-size', '10px');
    }
  });

  // Populate category field
  const categories = await fetchCategories();
  categories.categories.forEach((category) => {
    $('#category').append(`<option value="${category.id}">${category.Title}</option>`);
  });

  // Populate product status  field
  const status = await fetchProductStatus();
  status.productStatus.forEach((status) => {
    $('#status').append(`<option value="${status.id}">${status.Title}</option>`);
  });

$('#product-form').submit(async(event)=>{
  event.preventDefault();
  const myFile = $('#productImage').prop('files')[0];
  const formData = new FormData();
  const query = {
    query: `
    mutation($file: Upload!){\n product (
          Name:"${$("input[name='name']").val()}", 
          Description:"${$("textarea[name='description']").val()}",
          Price:${$("input[name='price']").val()},
          Category:"${$("#category").val()}",
          Status:"${$("#status").val()}",
          Image:$file,
          Owner:"${sessionStorage.getItem('userId')}",
          Location:{\n coordinates:[${$("input[name='location']").val()}]\n }
      )
      {\n id\n Name\n } 
   }`,
  };
  console.log('This is a query',query);

  formData.append('operations', JSON.stringify(query));
  formData.append('map', '{"0":["variables.file"]}');
  formData.append('0', myFile);

  console.log('This is a formdat',formData);
  const result = await fetchFile(formData);
  console.log('Result of upload:--', result);

  if (result.product) {
    $('.error-message-section').html('');
    try {
      $('#myModal').css('display', 'none');
      $(':root').css('font-size', '10px');
      location.reload();
    } catch (err) {
      new Error(err.message);
    }
  } else {
    $('.error-message-section').html('Make sure all the fields are filled.');
  }

});

});
