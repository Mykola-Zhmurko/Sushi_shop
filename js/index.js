const btnMinus = document.querySelector('[data-action="minus"]');
const btnPlus = document.querySelector('[data-action="plus"]');
const counter = document.querySelector('[data-counter]');
const cartWrapper = document.querySelector('.cart-wrapper');    
const productsContainer = document.querySelector('#products-container');

getProducts()

async function getProducts() {
    const response = await fetch('./js/products.json');
    const productsArray = await response.json();
    renderProducts(productsArray, "response with .json()")
}


function renderProducts(productsArray){
    productsArray.forEach((item)=>{
        const productHTML = `
					<div class="col-md-6">
						<div class="card mb-4" data-id="${item.id}">
							<img class="product-img" src="${item.imgSrc}" alt="">
							<div class="card-body text-center">
								<h4 class="item-title">${item.title}</h4>
								<p><small data-items-in-box class="text-muted">${item.itemsInBox}</small></p>

								<div class="details-wrapper">
									<div class="items counter-wrapper">
										<div class="items__control" data-action="minus">-</div>
										<div class="items__current" data-counter>1</div>
										<div class="items__control" data-action="plus">+</div>
									</div>

									<div class="price">
										<div class="price__weight">${item.weight}</div>
										<div class="price__currency">${item.price}$</div>
									</div>
								</div>

								<button data-cart type="button" class="btn btn-block btn-outline-warning">add to cart</button>

							</div>
						</div>
					</div>
                `;

        productsContainer.insertAdjacentHTML('beforeend', productHTML)

    })
}


window.addEventListener('click', function(event){
    
    let counter;

    if(event.target.dataset.action === 'plus' || event.target.dataset.action === 'minus') {
        const counterWrapper = event.target.closest('.counter-wrapper');
        counter = counterWrapper.querySelector('[data-counter]');
    }
    if(event.target.dataset.action === 'plus'){
        counter.innerText = ++counter.innerText;  
    }

    if(event.target.dataset.action === 'minus'){ 
        if(parseInt(counter.innerText) > 1){
                counter.innerText = --counter.innerText;
            }
            else if(event.target.closest('.cart-wrapper') && parseInt(counter.innerText) === 1){
            event.target.closest('.cart-item').remove();

            toggleCartStatus() 
            
            calcCartPriceAndDelivery()
        }}

    if(event.target.hasAttribute('data-action') && event.target.closest('.cart-wrapper')){
        calcCartPriceAndDelivery()
    }
     
});


window.addEventListener('click', function(event){
    if(event.target.hasAttribute('data-cart')){
        const card = event.target.closest('.card');

        const productInfo = {
            id: card.dataset.id,
            imgSrc: card.querySelector('.product-img').getAttribute('src'),
            title: card.querySelector('.item-title').innerText,
            itemsInBox: card.querySelector('[data-items-in-box]').innerText,
            weight: card.querySelector('.price__weight').innerText,
            price: card.querySelector('.price__currency').innerText,
            counter: card.querySelector('[data-counter]').innerText,
        }

        const itemInCart = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`);

        if(itemInCart){
            const counterElement = itemInCart.querySelector('[data-counter]');
            counterElement.innerText = parseInt(counterElement.innerText) + parseInt(productInfo.counter)
        }else{

        
        const cartItemHTML = `
            <div class="cart-item" data-id="${productInfo.id}">
								<div class="cart-item__top">
									<div class="cart-item__img">
										<img src="${productInfo.imgSrc}" alt="">
									</div>
									<div class="cart-item__desc">
										<div class="cart-item__title">${productInfo.title}</div>
										<div class="cart-item__weight">${productInfo.itemsInBox}, ${productInfo.weight}</div>
        
										<div class="cart-item__details">
											<div class="items items--small counter-wrapper">
												<div class="items__control" data-action="minus">-</div>
												<div class="items__current" data-counter="">${productInfo.counter}</div>
												<div class="items__control" data-action="plus">+</div>
											</div>

											<div class="price">
												<div class="price__currency">${productInfo.price}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
        `; 
        cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML)

        }

        card.querySelector('[data-counter]').innerText= '1'; 


        toggleCartStatus()

        calcCartPriceAndDelivery()
    }
})

function toggleCartStatus(){
    const orderForm = document.getElementById('order-form');
    const cartWrapper = document.querySelector('.cart-wrapper');
    const cartEmptyBadge = document.querySelector('[data-cart-empty]');

    if(cartWrapper.children.length > 0){
    cartEmptyBadge.classList.add('none');
    orderForm.classList.remove('none');
    }else{
    cartEmptyBadge.classList.remove('none');
    orderForm.classList.add('none');
    }
}

function calcCartPriceAndDelivery() {
    const cartWrapper = document.querySelector('.cart-wrapper');
    const priceElements = cartWrapper.querySelectorAll('.price__currency');
    const totalPriceEl = document.querySelector('.total-price');
    const deliveryCost = document.querySelector('.delivery-cost');
    const cartDelivery = document.querySelector('[data-cart-delivery]');
    const info = document.querySelector('.small');
    const delivery = 5;

    
    let priceTotal = 0;

    
    priceElements.forEach(function (item) {
    
    const amountEl = item.closest('.cart-item').querySelector('[data-counter]');

    priceTotal += parseInt(item.innerText) * parseInt(amountEl.innerText);
    });

    if(priceTotal < 50){
        priceTotal = priceTotal + parseInt(delivery)        
    }
    if(priceTotal >= 50){
        priceTotal = priceTotal
    }
    if(priceTotal === parseInt(delivery)){
        priceTotal -= delivery
    }
  
    totalPriceEl.innerText = priceTotal;

    if(priceTotal>0){
        cartDelivery.classList.remove('none');
        info.classList.add('none');
    }else if(priceTotal <= 5){
        cartDelivery.classList.add('none');
        info.classList.remove('none');
    }

    if(priceTotal >= 50){   
        deliveryCost.classList.add('free');
        deliveryCost.innerText = 'free'
    }else{
        deliveryCost.classList.remove('free');
        deliveryCost.innerText = '5$'
    }

}

