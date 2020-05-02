'use strict';

$(document).ready(async () => {
  const user = await fetchUser(userID);
  console.log('This is a user:-',user);
  if(user.owner.dp){
    $('.profile-image img').attr('src',user.owner.dp);
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

  $('#img').change(async(e) => {
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
    if(result){
        location.reload();
    }
    } else {
      $('#label').text('No file selected');
    }
  });
});
