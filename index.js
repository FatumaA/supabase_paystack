const makePayment = async (event) => {
	event.preventDefault();
	const form = document.getElementById("pay");
	const data = new FormData(form);
	const email = data.get("email");
	const amount = data.get("total");

	await pay(email, amount);
};

const pay = async (email, amount) => {
	const res = await fetch("your-url", {
		method: "POST",
		headers: {
			authorization: "Bearer anonkey",
			"content-type": "application/json",
		},
		body: JSON.stringify({ email: email, amount: amount }),
	});
	const getRes = await res.json();
	console.log(getRes.data?.authorization_url);
	window.location.href = getRes.data?.authorization_url;
};
