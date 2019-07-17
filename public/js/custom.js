$(document).ready(function () {
	$('#dtBasicExample').DataTable();
	$('.dataTables_length').addClass('bs-select');
});



jQuery(document).ready(function($) {
	//Search

	$("#q").keyup(function(event) {
		var q = $(this).val();
		console.log(q)
		$.ajax({
			url: '/api/search',
			method: 'POST',
			dataType: 'json',
			data: {q},
		})
		.done(function(products) {
			//console.log(products);
			//console.log(products[0].name);

			$('#search_result').empty();
			for (var i = 0; i < products.length; i++) {
				var html = `
					<div class="col-lg-3 col-md-6 mb-4">
						<div class="card"  style="height: 450px;">
							<div class="view overlay">
                      			<a href="/product/${products[i].slug}">
                        		<img src="${products[i].image}" class="card-img-top" alt="">
                      			</a>
		                      	<a>
		                        	<div class="mask rgba-white-slight"></div>
		                      	</a>
                    		</div>
                    <div class="card-body elegant-color white-text rounded-bottom text-center">
	                    <h5 class="white-text">
	                        Category : ${products[i].category.name}
	                    </h5>
						<hr class="hr-light">
                        <h5>
                        <strong>
                          <a href="/product/${products[i].slug}" class="white-text">${products[i].name}
                            <span class="badge badge-pill danger-color">${products[i].quantity}</span>
                          </a>
                        </strong>
                      </h5>

                      <h4 class="font-weight-bold blue-text">
                        <strong>৳ ${products[i].sellingPrice}</strong>
                      </h4>


                      <p class="card-text white-text mb-4">${products[i].description.substring(0,20)}</p>

                    <hr class="hr-light">

                    <a href="/product/${products[i].slug}" class="white-text d-flex justify-content-end"><h5>Read more <i class="fas fa-angle-double-right"></i></h5></a>
					</div>
                </div>
            </div>
				`;
			$('#search_result').append(html);
			}
		})
		.fail(function() {
			//console.log("error");
		})
		.always(function() {
			//console.log("complete");
		});

	});


	// Add To Cart
	$('#add-to-cart').on('click', function(e) {
		e.preventDefault();
		var product_id = $('#product_id').val();

		if(product_id === ''){
			return false;
		}else{
			$.ajax({
				url: '/cart/add',
				type: 'POST',
				data: {product_id: product_id},
			})
			.done(function(data) {
				$('.badge').html(data);
				$('#code').addClass('alert alert-success').html('Product Added To Cart');
				$("html, body").animate({ scrollTop: 0 }, "slow");
				//console.log("success");
			})
			.fail(function() {
				//console.log("error");
			})
			.always(function() {
				//console.log("complete");
			});

		}
	});


	// Update Cart ---> Add Item
	$('.add_cart').on('click', function(e) {
		e.preventDefault();

		var product_id = $(this).data("productid");

		if(product_id === ''){
			return false;
		}else{
			$.ajax({
				url: '/cart/update/' + product_id + '?action=add',
				type: 'GET',
			})
			.done(function(data) {
				var total = 0;
				data.cart.forEach( function(product, index) {
					var sub = parseFloat(product.qty * product.price).toFixed(2);
					total += +sub;
				});
				if(data.res === 0){
					$('#cartMsg').addClass('alert alert-danger').html('We Have Not Enough Product');
				}else{
					$('#cartMsg').addClass('alert alert-success').html('Cart Updated');
					$(`#${product_id}`).html(data.qty);
					$(`#${data.user}${product_id}`).html('৳'+parseFloat(data.qty * data.price).toFixed(2));
					$('#totalAmount').html('৳'+parseFloat(total).toFixed(2));
				}
				//console.log("success");
			})
			.fail(function() {
				//console.log("error");
			})
			.always(function() {
				//console.log("complete");
			});

		}
	});

	// Update Cart ---> Minus Item
	$('.minus_cart').on('click', function(e) {
		e.preventDefault();

		var product_id = $(this).data("productid");

		if(product_id === ''){
			return false;
		}else{
			$.ajax({
				url: '/cart/update/' + product_id + '?action=remove',
				type: 'GET',
			})
			.done(function(data) {
				var total = 0;
				data.cart.forEach( function(product, index) {
					var sub = parseFloat(product.qty * product.price).toFixed(2);
					total += +sub;
				});
				if(data.res === -1){
					$('#cartMsg').addClass('alert alert-success').html('Can not Decrese Less Than 1');
					return false;
				}else{
					$('#cartMsg').addClass('alert alert-success').html('Cart Updated');
					$(`#${product_id}`).html(data.qty);
					$(`#${data.user}${product_id}`).html('৳'+parseFloat(data.qty * data.price).toFixed(2));
					$('#totalAmount').html('৳'+parseFloat(total).toFixed(2));
				}
				//console.log("success");
			})
			.fail(function() {
				//console.log("error");
			})
			.always(function() {
				//console.log("complete");
			});

		}
	});


	// Update Cart --> Remove From Cart
	$('.remove_cart').on('click', function(e) {
		e.preventDefault();

		var product_id = $(this).data("productid");
		$(this).parents("tr:first").remove();
		if(product_id === ''){
			return false;
		}else{
			$.ajax({
				url: '/cart/update/' + product_id + '?action=clear',
				type: 'GET',
			})
			.done(function(data) {
				var total = 0;
				var cartLength;
				if(data.cart){
					data.cart.forEach( function(product, index) {
						var sub = parseFloat(product.qty * product.price).toFixed(2);
						total += +sub;
					});
					cartLength = data.cart.length;
				}else{
					total = parseFloat(total).toFixed(2);
					cartLength = 0;
				}



				$('.badge').html(cartLength);
				$('#cartMsg').addClass('alert alert-success').html('Cart Updated');
				$('#totalAmount').html('৳'+parseFloat(total).toFixed(2));

				//console.log("success");
			})
			.fail(function() {
				//console.log("error");
			})
			.always(function() {
				//console.log("complete");
			});

		}
	});




});



