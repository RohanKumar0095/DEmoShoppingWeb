let cart =
JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {

    document.getElementById("cartCount").innerText =
        cart.length;
}

function displayCart() {

    const cartItems =
        document.getElementById("cartItems");

    cartItems.innerHTML = "";

    cart.forEach(item => {

        const li =
            document.createElement("li");

        li.textContent = item;

        cartItems.appendChild(li);
    });
}

function addToCart(product) {

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    displayCart();
}

function clearCart() {

    cart = [];

    localStorage.removeItem("cart");

    updateCartCount();

    displayCart();
}

function searchProducts() {

    let input =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    let cards =
        document.querySelectorAll(".product-card");

    cards.forEach(card => {

        let name =
            card.querySelector("h3")
            .innerText
            .toLowerCase();

        if (name.includes(input)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";
        }
    });
}

const darkModeBtn =
document.getElementById("darkModeBtn");

darkModeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem(
            "theme",
            "dark"
        );

    } else {

        localStorage.setItem(
            "theme",
            "light"
        );
    }
});

window.onload = () => {

    updateCartCount();

    displayCart();

    const theme =
        localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );
    }
};