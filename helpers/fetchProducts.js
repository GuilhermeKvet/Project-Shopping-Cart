const fetchProducts = async (iten) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${iten}`;
  try {
    if (!iten) {
      throw new Error('You must provide an url');
    }
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return error.message;
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
