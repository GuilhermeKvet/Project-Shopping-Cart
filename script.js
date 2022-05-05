const ol = document.querySelector('.cart__items');
const containerPrice = document.querySelector('.total-price');

const valuePrice = (total) => {
  const subTotal = document.createElement('span');
  containerPrice.innerText = '';
  subTotal.innerText = (Math.round(total * 100) / 100).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
  containerPrice.appendChild(subTotal);
};

const createPrice = () => {
  const itemsCart = Array.from(document.querySelectorAll('.cart__item'));

  const values = itemsCart.map((value) => {
    const item = value.innerText.split('\n');
    const price = Number(item[item.length - 1].replace('$', ''));
    return price;
  });
  const total = values.reduce((acc, value) => acc + value, 0);
  valuePrice(total);
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add btn btn-primary', 'Adicionar ao carrinho!'));

  return section;
}

const getFetchProducts = async () => {
  const fetchParan = await fetchProducts('computador');
  const section = document.querySelector('.items');
  const elements = fetchParan.results.map((element) =>
    ({ sku: element.id, name: element.title, image: element.thumbnail }));
  elements.forEach((obj) => {
    section.appendChild(createProductItemElement(obj));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  createPrice();
  saveCartItems(ol.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `${sku}

  ${name}

  $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const setItemCart = () => {
  const buttonAddCart = document.querySelectorAll('.item__add');
  buttonAddCart.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const getElementDad = event.target.parentNode;
      const sku = getSkuFromProductItem(getElementDad);
      const { title: name, price: salePrice } = await fetchItem(sku);
      const setObj = createCartItemElement({ sku, name, salePrice });
      ol.appendChild(setObj);
      createPrice();
      saveCartItems(ol.innerHTML);
    });
  });
};

const getItemsLocalStorage = () => {
  const getItems = getSavedCartItems();
  if (getItems) {
    ol.innerHTML = getItems;
    const items = ol.children;
    Array.from(items).forEach((li) =>
      li.addEventListener('click', cartItemClickListener));
  }
  createPrice();
};

const clearCart = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    ol.innerHTML = '';
    containerPrice.innerText = 0;
  });
};

const loading = () => {
  const itemsSections = document.querySelector('.loading');
  const itemsLoading = document.createElement('p'); 
  itemsLoading.innerText = 'carregando...';
  itemsSections.appendChild(itemsLoading);
};

const removeLoading = () => {
  const itemsSections = document.querySelector('.loading');
  itemsSections.parentNode.removeChild(itemsSections);
};

window.onload = async () => {
  loading();
  await getFetchProducts();
  removeLoading();
  getItemsLocalStorage();
  setItemCart();
  clearCart();
};
