export function getAuthForm() {
	return `
	<form class="mui-form" id="form--auth">
	<div class="mui-textfield mui-textfield--float-label">
		<input type="email" id="email-input" required minlength="5" maxlength="50">
		<label for="email-input">Email</label>
	</div>
	<div class="mui-textfield mui-textfield--float-label">
		<input type="password" id="password-input" required minlength="8" maxlength="20">
		<label for="password-input">Password</label>
	</div>
	<button type="submit" 
	class="mui-btn mui-btn--primary mui-btn--raised">Log in</button>
</form>
	`
}

export function authWithEmailAndPassword(email, password) {
	const API_KEY = 'AIzaSyCFButfT7f_EsIJ1D_x4bN4X8JiqS90S-o'
	return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
		method: 'POST',
		body: JSON.stringify({ email, password, returnSecureToken: true }),
		headers: {
			'Content-Type': 'application/json'
		}

	})
		.then(response => response.json())
		.then(data => data.idToken)
}