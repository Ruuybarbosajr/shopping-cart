const getSpanPrice = document.querySelector('.total-price');
const getOlMyCart = document.querySelector('.cart__items');

const sumValuers = () => {
	let newValue = 0;
	[...getOlMyCart.children].forEach((li) => {
		newValue += parseFloat(li.innerHTML.slice(li.innerHTML.indexOf('$') + 1));
	});
	getSpanPrice.innerText = `Total: ${newValue.toLocaleString('pt-br', {
		style: 'currency',
		currency: 'BRL',
	})}`;
};

function createProductImageElement(imageSource) {
	const img = document.createElement('img');
	img.className = 'item__image';
	img.src = imageSource;
	return img;
}

function createCustomElement(element, className, innerText) {
	const e = document.createElement(element);
	e.className = className;
	e.innerText = innerText;
	return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
	const section = document.createElement('section');
	const sectionItems = document.querySelector('.items');
	section.className = 'item';
	section.appendChild(createCustomElement('span', 'item__sku', sku));
	section.appendChild(createCustomElement('span', 'item__title', name));
	section.appendChild(createProductImageElement(image));
	section.appendChild(
		createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')
	);
	sectionItems.appendChild(section);
	return section;
}

const addEventOnLi = (parameter) => {
	parameter.addEventListener('click', (event) => {
		event.target.parentNode.removeChild(event.target);
		sumValuers();
	});
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
	const li = document.createElement('li');
	li.className = 'cart__item';
	li.innerText = `SKU: ${sku} 
  NAME: ${name} 
  PRICE: $${salePrice}`;
	addEventOnLi(li);
	return li;
}

const addInOrdenedList = async (nameOfProduct) => {
	getOlMyCart.appendChild(
		createCartItemElement(await fetchItem(nameOfProduct))
	);
	sumValuers();
	saveCartItems(getOlMyCart.innerHTML);
};

const eventListenerOnButtons = () => {
	const buttons = document.querySelectorAll('.item__add');
	buttons.forEach((button) =>
		button.addEventListener('click', () => {
			addInOrdenedList(button.parentElement.firstChild.innerText);
		})
	);
};

const emptyCart = () => {
	const buttonEmpty = document.querySelector('.empty-cart');
	buttonEmpty.addEventListener('click', () => {
		const liS = document.querySelectorAll('.cart__item');
		const spanPrime = getSpanPrice;
		liS.forEach((li) => getOlMyCart.removeChild(li));
		spanPrime.innerHTML = 'Total: R$ 0,00';
		localStorage.clear();
	});
};

const functionLoading = () => {
	divLoading = document.createElement('div');
	divLoading.className = 'loading';
	divLoading.innerHTML = 'Carregado...';
	sectionItem = document.querySelector('.items');
	sectionItem.appendChild(divLoading);
};

window.onload = async () => {
	functionLoading();
	const { results } = await fetchProducts('computador');
	results.forEach(createProductItemElement);
	document.querySelector('.loading').remove();
	getOlMyCart.innerHTML = getSavedCartItems();
	[...getOlMyCart.children].forEach(addEventOnLi);
	sumValuers();
	eventListenerOnButtons();
	emptyCart();
};
