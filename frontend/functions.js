async function logIn(username, password) {
    const queryParams = `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    const url = `http://localhost:3000/users${queryParams}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const res = await response.json();

        if (!response.ok) {
            alert(res.message)
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        localStorage.setItem("activeUserId", res.id_user)
        alert("Login OK");
        let hostpath = window.location.pathname
        hostpath = hostpath.substring(0, hostpath.lastIndexOf('/'));
        window.location.href = `${hostpath}/chooseteam.html`
        return 1;

    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

async function postUser(username, password){
    const user = {
        username: username,
        password: password,
        players_completed: 0,
        players_failed: 0,
        perfect_elevens: 0
    }
    
    const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    
    let res = await response.json()
    console.log(res)
    localStorage.setItem("activeUserId", res.id_user)
    return res.message
}

async function registerNewUser(username, password, confirmPassword) {
    if (password != confirmPassword) {
        return alert("Passwords are different")
    }
   
    userPost = await postUser(username, password)
    alert(userPost)
    if (userPost == "User registered successfully!"){
        let hostpath = window.location.pathname
        hostpath = hostpath.substring(0, hostpath.lastIndexOf('/'));
        window.location.href = `${hostpath}/chooseteam.html`
        return 1;
    }
    return -1
}