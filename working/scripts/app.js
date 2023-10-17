import Menu from "./Menu.js";
import Order from "./Order.js";
import Router from "./Router.js";

(async function () {
	if (!(navigator.storage && navigator.storage.persist)) return;

	let isPersisted = await navigator.storage.persisted();
	if (!isPersisted) {
		const result = await navigator.storage.persist();
	}
	console.log("🚀 ~ isPersisted:", isPersisted);
})();

(async () => {
	const q = await navigator.storage.estimate();
	console.log("🚀 ~ q:", q);

	console.log(
		"🚀 ~ q.quota:",
		q.quota,
		`${(q.quota / 1024 / 1024).toFixed(2)} MB`,
	);
	console.log("🚀 ~ q.usage:", q.usage, `${(q.usage / 1024).toFixed(2)} KB`);
	// track('')
})();

window.addEventListener("DOMContentLoaded", () => {
	Router.init();
	Menu.load();
	Order.render();
});
