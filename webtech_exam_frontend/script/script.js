// user sign up
document.getElementById("registerForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const roomnumber = document.getElementById("roomnumber").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch("http://localhost:5000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, roomnumber }),
  });

  const data = await res.json();

  if (data.success) {
    alert("Registration successful!");
    window.location.hash = "#login";
  } else {
    alert(data.error || "Registration failed");
  }
});


// user login
document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("logemail").value.trim();
  const password = document.getElementById("logpassword").value.trim();

  const res = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!data.success) {
    alert("Invalid email or password");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(data.user));
  alert("Login successful!");
  window.location.hash = "#menu";
});


//menu
const menuData = [
    {id: 1, name: "Jollof", price: 35, category: "Lunch", img: "https://www.primenewsghana.com/images/2021/dec/01/jollof_1.jpg" },
    {id: 2, name: "Kenkey", price: 40, category: "Lunch", img: "https://afrifoodnetwork.com/wp-content/uploads/2023/07/F7A6AB1E-7D9F-4490-97C2-043DC4DC644C.jpeg"},
    { id: 3, name: "Waakye", price: 20, category: "Breakfast", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqg5HKoQj6TL1D6NOHSK1iMSIgpGqFkUoK6A&s" },
    { id: 4, name: "Fruit Juice", price: 8, category: "Drinks", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe4ilpGlMA6orA2ekNoNvXa83ooAka6H5YXA&s" },
    { id: 5, name: "Sandwich", price: 12, category: "Snacks", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6DHqoIPhtlRft2B96FmZ8vHnTdyY0qQXSOQ&s" },
    { id: 6, name: "Pancakes", price: 15, category: "Breakfast", img: "https://hips.hearstapps.com/hmg-prod/images/best-homemade-pancakes-index-640775a2dbad8.jpg?crop=0.6667877686951256xw:1xh;center,top&resize=1200:*"},
    {id: 7, name: "Waffles", price: 15, category: "Breakfast", img: "https://www.allrecipes.com/thmb/DW-mJvxoQgHzZ70kcVwwkKvlbVY=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/ALR-24141-chocolate-waffles-i-VAT-4x3-52053b237749453a80c6d39dd67ac8ba.jpg"},
    {id: 8, name: "Coke", price: 10, category: "Drinks", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3M-xR4PTf-oldWP8s2UWBCDxtZatNqXs1NA&s"},
    {id: 9, name: "Sprite", price: 10, category: "Drinks", img: "https://melcom.com/media/catalog/product/cache/d0e1b0d5c74d14bfa9f7dd43ec52d082/x/8/x807a.jpg"},
    {id: 10, name: "Cookies", price: 12, category: "Snacks", img: "https://www.allrecipes.com/thmb/8xwaWAHtl_QLij6D-G0Z4B1HDVA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/10813-best-chocolate-chip-cookies-mfs-146-4x3-b108aceffa6043a1ac81c3c5a9b034c8.jpg"},
    {id: 11, name: "Beans and Plantain", price: 40, category: "Lunch", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrEIwxVtkZnEm0f_p0PPjcof3ZpCwOptVN9A&s"},
    {id: 12, name: "Banana Bread", price: 12, category: "Snacks", img: "https://eatsdelightful.com/wp-content/uploads/2023/06/sliced-super-moist-chocolate-chip-banana-bread-on-parchment-lined-round-wire-rack-1-scaled.jpg"}
];

function loadMenu(items = menuData) {
    const container = document.getElementById("menu-container");
    container.innerHTML = "";

    items.forEach(item => {
        container.innerHTML += `
            <div class="menu-card">
                <img src="${item.img}" alt="${item.name}">
                <h3>${item.name}</h3>
                <span>GHS ${item.price}</span>
                <button onclick="addToCart(${item.id})">add to Cart</button>
            </div>
        `;
    });
}

loadMenu();

//categories
function loadCategories() {
    const container = document.getElementById("categorybutton");
    container.innerHTML = "";

    const categories = [...new Set(menuData.map(item => item.category))];

    container.innerHTML += `<button onclick="loadMenu()">All</button>`;

    categories.forEach(cat => {
        container.innerHTML += `
            <button onclick="filterCategory('${cat}')">${cat}</button>
        `;
    });
}

function filterCategory(cat) {
    const filtered = menuData.filter(item => item.category === cat);
    loadMenu(filtered);
}

loadCategories();

//adding to cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id) {
    const food = menuData.find(item => item.id === id);
    cart.push(food);

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(food.name + " added to cart!");
}

//cart page
function loadCart() {
    const container = document.getElementById("cartitems");
    const totalText = document.getElementById("total_amount");

    if (!container || !totalText) return;

    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        container.innerHTML += `
            <div class="cart-item">
                <span>${item.name} - GH¢ ${item.price}</span>
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    totalText.textContent = total;
}

function removeItem(i) {
    cart.splice(i, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

loadCart();

//placing order
let orders = JSON.parse(localStorage.getItem("orders")) || [];

document.getElementById("placeorder")?.addEventListener("click", function() {
    if (cart.length === 0) {
        alert("your cart is empty");
        return;
    }

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
        alert("Please log in first.");
        return;
    }

    const newOrder = {
        id: Date.now(),
        items: cart,
        total: cart.reduce((sum, i) => sum + i.price, 0),
        status: "Pending",
        userEmail: user.email,
        date: new Date().toLocaleString()
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("order placed successfully!");
    window.location.hash = "#orders";
});

//order history
function loadOrders() {
    const container = document.getElementById("orders-container");
    if (!container) return;

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    container.innerHTML = "";

    const userOrders = orders.filter(o => o.userEmail === user.email);

    userOrders.forEach(order => {
        container.innerHTML += `
            <div class="order-card">
                <h3>Order #${order.id}</h3>
                <p><strong>Date:</strong> ${order.date}</p>
                <p><strong>Total:</strong> GHS ${order.total}</p>
                <p class="order-status"><strong>Status:</strong> ${order.status}</p>
            </div>
        `;
    });
}

loadOrders();