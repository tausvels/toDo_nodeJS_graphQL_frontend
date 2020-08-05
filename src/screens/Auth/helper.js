export const handleSubmit = async (
  event, emailEl, passwordEl, isLoggedIn, login,
  ) => {
  event.preventDefault();
  const email = emailEl.current.value;
  const password = passwordEl.current.value;
  if (email.trim().length === 0 || password.trim().length === 0) {
    return;
  }
  let requestBody = {
    query: `
      query {
        login(email: "${email}", password:"${password}") {
          userId
          email
          token
          tokenExpiration
        }
      }
    `
  };
  if (!isLoggedIn) {
    requestBody = {
      query: `
        mutation {
          createUser(userInput: { email: "${email}", password: "${password}" }) {
            _id
            email
          }
        }
      `
    };
  }
  try {
    const result = await fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {  "Content-Type": "application/json"  }
    });
    if (result.status !== 200 && result.status !== 201) {
      console.log('I have failed'); 
      throw new Error ('Failed')
    }
    const resultBody = await result.json();
    if (resultBody.data.login.token) {
      login(
        resultBody.data.login.token, 
        resultBody.data.login.userId,
        resultBody.data.login.email, 
        resultBody.data.login.tokenExpiration
      );
    }
  } catch (err) {
    console.log(err)
    throw err;
  }
};