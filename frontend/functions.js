async function getUser(username, password) {
    const queryParams = `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    const url = `http://localhost:3000/users${queryParams}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            alert("Login Failed!")
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        console.log(res);
        alert("Login OK");
        return res;
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
    return res
}

async function logIn(username, password){
    if (userId >= 1) {
        alert("Log In Successful")
        let idActiveUser = userId
        return true
    }
    else if (userId == 0) {
        alert("Incorrect Password")
        return false
    }

    else {
        alert("User not exists") 
        return false
    } 
}

async function registerNewUser(username, password, confirmPassword) {
    if (password != confirmPassword) {
        return alert("Passwords are different")
    }
    else {
        userPost = await postUser(username, password)
        return alert(userPost.message)
    }

}