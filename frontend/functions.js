async function getAllUsers(){
    const response = await fetch("http://localhost:3000/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    
    const users = await response.json()
    return users
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

async function userExists(username, password) {
    const users = await getAllUsers()

    let i = 0;
    while (i < users.length && users[i].username != username) {
        i++;
    }

    if (i == users.length){
        return -1
    } 

    else if (users[i].username == username && users[i].password == password) {
        return users[i].id_user;
    }

    else if (users[i].username == username && users[i].password != password) {
        return 0
    }
    return -1
}

async function logIn(username, password){
    let userId = await userExists(username, password)

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