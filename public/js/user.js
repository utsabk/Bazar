'use strict';

$(document).ready(async () => {
  const user = await fetchUser(userID);
  if (user.owner.dp) {
    $('.profile-image img').attr('src', user.owner.dp);
  }
  $('.profile-user-settings h1').text(user.owner.name);

  if (user.owner.email) {
    $('.profile-stat-count #email').text(user.owner.email);
  } else {
    $('.profile-stat-count #email').text('Not provided');
  }
  if (user.owner.phone) {
    $('.profile-stat-count #phone').text(user.owner.phone);
  } else {
    $('.profile-stat-count #phone').text('Not available');
  }

  try {
    const result = await fetchProducts(userID, false);

    $('.profile-stat-count .products').text(result.products.length);

    result.products.forEach((product) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `<img src="../${product.Image}" class="gallery-image" alt="">`;

      $('.gallery').append(item);

      item.addEventListener('click', () => {
        console.log('eye clicked', product);
        location.replace('../productdetails.html?' + product.id);
      });
    });
  } catch (err) {
    throw new Error(err);
  }

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
    $('#uploadModal').css('display', 'block');
    $(':root').css('font-size', '15px');
  });

  // When the user clicks on <span> (x), close the modal
  $('.close').click(() => {
    if ($(event.target).is('#uploadClose')) {
      $('#uploadModal').css('display', 'none');
      $(':root').css('font-size', '10px');
    }
    if ($(event.target).is('#mapClose')) {
      $('#mapModal').css('display', 'none');
    }
  });

  // When the user clicks anywhere outside of the modal, close it
  $(window).click((event) => {
    if ($(event.target).is('#uploadModal')) {
      $('#uploadModal').css('display', 'none');
      $(':root').css('font-size', '10px');
    }
    if ($(event.target).is('#mapModal')) {
      $('#mapModal').css('display', 'none');
    }
  });

  // Populate category field
  const categories = await fetchCategories();
  categories.categories.forEach((category) => {
    $('#category').append(
      `<option value="${category.id}">${category.Title}</option>`
    );
  });

  // Populate product status  field
  const status = await fetchProductStatus();
  status.productStatus.forEach((status) => {
    $('#status').append(
      `<option value="${status.id}">${status.Title}</option>`
    );
  });

  $('#product-form').submit(async (event) => {
    event.preventDefault();
    const myFile = $('#productImage').prop('files')[0];
    const formData = new FormData();
    const query = {
      query: `
    mutation($file: Upload!){\n product (
          Name:"${$("input[name='name']").val()}", 
          Description:"${$("textarea[name='description']").val()}",
          Price:${$("input[name='price']").val()},
          Category:"${$('#category').val()}",
          Status:"${$('#status').val()}",
          Image:$file,
          Owner:"${sessionStorage.getItem('userId')}",
          Location:{\n coordinates:[${$("input[name='location']").val()}]\n }
      )
      {\n id\n Name\n } 
   }`,
    };
    console.log('This is a query', query);

    formData.append('operations', JSON.stringify(query));
    formData.append('map', '{"0":["variables.file"]}');
    formData.append('0', myFile);

    console.log('This is a formdat', formData);
    const result = await fetchFile(formData);
    console.log('Result of upload:--', result);

    if (result.product) {
      $('.error-message-section').html('');
      try {
        $('#uploadModal').css('display', 'none');
        $(':root').css('font-size', '10px');
        location.reload();
      } catch (err) {
        new Error(err.message);
      }
    } else {
      $('.error-message-section').html('Make sure all the fields are filled.');
    }
  });

  //<!--===============================================================================================-->
  /*--- MAP  MODAL  ---*/

  $("input[name='location']").click(() => {
    $('#mapModal').css('display', 'block');

    try {
      // add map
      const map = L.map('mapid').setView([60.16, 24.94], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on('click', (evt) => {
        $("input[name='location']").val(`${evt.latlng.lng}, ${evt.latlng.lat}`);
      });

      // if user position not found
      const error = (e) => {
        console.log(e);
      };

      // options for getCurrentPosition
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      // add user position
      const success = (position) => {
        const marker = L.marker([
          position.coords.latitude,
          position.coords.longitude,
        ])
          .addTo(map)
          .bindPopup('You location.')
          .openPopup();
        map.panTo(marker.getLatLng());//panTo() is just another way of using setView().

      };

      if(!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
      } else {
        navigator.geolocation.getCurrentPosition(success, error, options);
      }
  
    } catch (err) {
      console.log(err.message);
    }
  });
});
