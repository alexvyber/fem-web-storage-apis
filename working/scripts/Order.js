import Menu from "./Menu.js";

const Order = {
	cart: [],

	load: () => {},
	save: () => {
		localStorage.setItem("some-cart", JSON.stringify(Order.cart));
	},

	add: async (id) => {
		const product = await Menu.getProductById(id);
		const results = Order.cart.filter(
			(prodInCart) => prodInCart.product.id == id,
		);
		if (results.length == 1) {
			results[0].quantity++;
		} else {
			Order.cart.push({ product, quantity: 1 });
		}
		Order.render();
	},

	remove: (id) => {
		Order.cart = Order.cart.filter((prodInCart) => prodInCart.product.id != id);
		Order.render();
	},

	place: () => {
		alert(
			"Your order will be ready under the number " +
				parseInt(Math.random() * 100),
		);
		Order.cart = [];
		Order.render();
	},

	importCart: async () => {
		const [handle] = await window.showOpenFilePicker();
		const file = await handle.getFile();
		try {
			const content = JSON.parse(await file.text());
			console.log(content);
			if (content instanceof Array && content.length > 0) {
				Order.cart = content;
			} else {
				alert("File is invalid");
			}
			Order.render();
		} catch (e) {
			console.log(e);
			alert("File is invalid");
		}
	},
	
	exportCart: async () => {
		const handle = await window.showSaveFilePicker({
			types: [
				{
					description: "JSON Cart File",
					accept: {
						"application/json": [".json"],
					},
				},
			],
		});
		const file = await handle.getFile();
		const writable = await handle.createWritable();
		await writable.write(JSON.stringify(Order.cart));
		await writable.close();
	},

	render: () => {
		Order.save();
		if (Order.cart.length == 0) {
			document.querySelector("#order").innerHTML = `
                <p class="empty">Your order is empty</p>
            `;
		} else {
			let html = `
                <h2>Your Order</h2>
                <ul>
            `;
			let total = 0;
			for (let prodInCart of Order.cart) {
				html += `
                    <li>
                        <p class='qty'>${prodInCart.quantity}x</p>
                        <p class='name'>${prodInCart.product.name}</p>
                        <p class='price'>$${prodInCart.product.price.toFixed(2)}</p>
                        <p class='toolbar'>
                            <span class="navlink material-symbols-outlined" onclick="Order.remove(${
															prodInCart.product.id
														})">
                                delete
                            </span>
                        </p>
                    </li>
                `;
				total += prodInCart.quantity * prodInCart.product.price;
			}

			html += `
                        <li>
                            <p class='total'>Total</p>
                            <p class='price-total'>$${total.toFixed(2)}</p>
                        </li>
                    </ul>
                     <button onclick="Order.place()">Place Order</button>
                    `;

			document.querySelector("#order").innerHTML = html;
		}
	},
};

window.Order = Order; // make it "public"
export default Order;
