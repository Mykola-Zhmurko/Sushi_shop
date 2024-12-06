const btnMinus = document.querySelector('[data-action="minus"]');
const btnPlus = document.querySelector('[data-action="plus"]');
const counter = document.querySelector('[data-counter]');
const cartWrapper = document.querySelector('.cart-wrapper');    
const productsContainer = document.querySelector('#products-container');

getProducts()

async function getProducts() {
    const response = await fetch('./js/products.json');//bekommen products von json//await zwingt zu warten bis alle Produkten bekommen werden

    const productsArray = await response.json();//von json bis zu js//hier await ist wie return, wiedergibt ein Massiv      

    renderProducts(productsArray)
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

// + oder - der Anzahl
window.addEventListener('click', function(event){//event ist unser action + or -//mit action bekommen wir value von data-action
    
    let counter;

    if(event.target.dataset.action === 'plus' || event.target.dataset.action === 'minus') {
        const counterWrapper = event.target.closest('.counter-wrapper');//come out Parent from clicked Elem
        counter = counterWrapper.querySelector('[data-counter]');
    }
    if(event.target.dataset.action === 'plus'){//mit action bekommen wir value von data-action
        counter.innerText = ++counter.innerText;  
    }

    if(event.target.dataset.action === 'minus'){ 
        // verkleinen die Anzahl
        if(parseInt(counter.innerText) > 1){
                counter.innerText = --counter.innerText;
            }// überprüfen ob Elem in Korb ist und falls Elem aus Korb entfernen
            else if(event.target.closest('.cart-wrapper') && parseInt(counter.innerText) === 1){
            event.target.closest('.cart-item').remove();

            toggleCartStatus() 
            
            calcCartPriceAndDelivery()//es ist fürs Rechnen bevor Elem aus Korb entfernt wird
        }}
        // überprüfen ob in Korb ist und rechnen wir noch mal
    if(event.target.hasAttribute('data-action') && event.target.closest('.cart-wrapper')){
        calcCartPriceAndDelivery()
    }
     
});


window.addEventListener('click', function(event){
    // console.log(event.target)//wenn einfech event bekommen wir Svoistva des Elems//wenn event.target dann bekommen wir Elem, der in html ist
    if(event.target.hasAttribute('data-cart')){
        const card = event.target.closest('.card');

        const productInfo = {
            id: card.dataset.id,//bekommen id
            imgSrc: card.querySelector('.product-img').getAttribute('src'),//miithilfe queryS finden wir IMG//getAttribute() bekommen wir src value von IMG
            title: card.querySelector('.item-title').innerText,
            itemsInBox: card.querySelector('[data-items-in-box]').innerText,//amount of sushi
            weight: card.querySelector('.price__weight').innerText,
            price: card.querySelector('.price__currency').innerText,
            counter: card.querySelector('[data-counter]').innerText,
        }

        const itemInCart = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`);

        if(itemInCart){//machen Items zusammen, wenn in Korb vorhanden, dann einfach +
            const counterElement = itemInCart.querySelector('[data-counter]');//counter in Korb
            counterElement.innerText = parseInt(counterElement.innerText) + parseInt(productInfo.counter)//verbinden
        }else{

        
            // die Items in Korb
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
        cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML)//fügen Schablon (von oben) in sidebar ein

        }

        card.querySelector('[data-counter]').innerText= '1'; 


        // zeigt Status des Korbes
        toggleCartStatus()
        // rechnen noch mal ob etwas geändert wurde
        calcCartPriceAndDelivery()
    }
})

// Das Zeigen "der Korb ist leer" und 'bestellen'
function toggleCartStatus(){
    const orderForm = document.getElementById('order-form')
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

// // rechnen alles zusammen 
// function calcCartPrice(){
//     const cartItems = document.querySelectorAll('.cart-item');
//     const totalPriceEl = document.querySelectorAll('.total-price');
//     let priceTotal = 0;

//     cartItems.forEach(function (item){
//         const amountEl = item.querySelector('[data-counter]');
//         const priceEl = item.querySelector('.price__currency');
//         const currentPrice = parseInt(amountEl.innerText) * parseInt(priceEl.innerText);
//         priceTotal += currentPrice;
//     })  
//     console.log(priceTotal);

//     totalPriceEl.innerText = priceTotal;
// }       

function calcCartPriceAndDelivery() {
    const cartWrapper = document.querySelector('.cart-wrapper');
    const priceElements = cartWrapper.querySelectorAll('.price__currency');
    const totalPriceEl = document.querySelector('.total-price');
    const deliveryCost = document.querySelector('.delivery-cost');
    const cartDelivery = document.querySelector('[data-cart-delivery]');
    const info = document.querySelector('.small');
    const delivery = 5;

    // Общая стоимость товаров
    let priceTotal = 0;

    // обходим все блоки с ценами в корзине
    priceElements.forEach(function (item) {
    // Находим количество товара
    const amountEl = item.closest('.cart-item').querySelector('[data-counter]');
    // Добавляем стоимость товара в общую стоимость (кол-во * цену)
    priceTotal += parseInt(item.innerText) * parseInt(amountEl.innerText);
    });

    if(priceTotal <= 50){
        priceTotal = priceTotal + parseInt(delivery)        
    }
    if(priceTotal >= 50){
        priceTotal = priceTotal - parseInt(delivery)
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

