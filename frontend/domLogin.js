document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();  // Evita el envío del formulario

    let username = getUsername()
    let password = getPassword()

    await logIn(username, password);
});