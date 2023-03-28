const productContainer = document.querySelector("#product-container");
const categorySelect = document.querySelector("#category-select");
const productDetail = document.querySelector("#product-detail");

fetch("https://dummyjson.com/products")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    // Update UI when products is fetched
    updateProductContainerUI(data.products);

    // Get categories
    const productCategories = data.products.reduce(
      (categories, product) =>
        categories.includes(product.category)
          ? categories
          : [...categories, product.category],
      ["all"]
    );

    categorySelect.innerHTML = productCategories.reduce(
      (markup, category) =>
        markup + `<option value="${category}">${category}</option>`,
      ""
    );

    categorySelect.addEventListener("change", (event) => {
      const filteredProducts = data.products.filter(
        (product) =>
          product.category === event.target.value ||
          event.target.value === "all"
      );

      // Update UI
      updateProductContainerUI(filteredProducts);
    });

    // Product buttons
    const infoButtons = document.querySelectorAll(".info-btn");
    infoButtons.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        console.log(event.target.dataset.id);
        const product = data.products.find(
          (product) => product.id === Number(event.target.dataset.id)
        );

        // Update UI
        productDetail.innerHTML = generateProductDetailMarkup(product);
      });
    });
  })
  .catch((error) => {
    console.log(error);
  });

function generateProductMarkup(product) {
  return `
    <div class="col-12 col-md-6 col-xl-3">
    <div class="card">
      <img
        src="${product.thumbnail}"
        class="card-img-top"
        alt="${product.title}"
      />
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">
          ${product.description}
        </p>
        <button class="btn btn-primary w-100 info-btn" data-id="${product.id}">Show info</button>
      </div>
    </div>
  </div>
  `;
}

function updateProductContainerUI(products) {
  productContainer.innerHTML = products.reduce(
    (markup, product) => markup + generateProductMarkup(product),
    ""
  );
}

function generateProductDetailMarkup(product) {
  return `
    <!-- Product images -->
    <div class="col-12 col-lg-6">
      <div class="row mb-3">
        <img
          src="${product.thumbnail}"
          alt="${product.title}"
          class="product-thumbnail"
        />
      </div>
      <div class="row product-images">
      ${product.images.slice(0, 3).reduce(
        (markup, image) =>
          markup +
          `
      <div class="col-4">
          <img
            src=${image}
            alt=""
            class="product-img"
          />
        </div>`,
        ""
      )}
      </div>
    </div>

    <!-- Product info -->
    <div class="col-12 col-lg-6">
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <h4>${product.price}$</h4>
      <p>Rating: <strong>${product.rating}</strong></p>
    </div>
    `;
}
