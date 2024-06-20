document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();  // Evita el envío del formulario

    let username = getUsername()
    let password = getPassword()
    let confirmPassword = getConfirmPassword()

    await registerNewUser(username, password, confirmPassword);
});