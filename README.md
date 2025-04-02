# Sourcery - Use Generative AI for Procurement
Soon to be on Y combinator, I kid, this is a full stack application showcasing how you might use Generative AI to help with procurement processes. 

## See it live and in action 📺
<img src="https://i.imgur.com/f97CRzO.gif"/>

# Startup 🚀
1. Install all the libraries `npm install && cd client && npm install`
2. Update your `WATSONX_AI_APIKEY` and `WATSONX_PROJECT_ID` in the `.example_env` file and rename the file to `.env`
3. Start a Postgres server, I find the easiest way to do this is with the <a href="https://postgresapp.com/">Postgres App</a>
4. Update the `DB_NAME` and `DB_PORT` in the `.env` file 
5. Create a test user by running `node tests/model/testuser.js`
5. Create a test vendor user by running `node tests/model/testvendor.js`
6. Start the app by running `npm run dev` this should start the backend express server and the front end Vite app which should run locally at <a href="http://localhost:5173/">http://localhost:5173/</a>
7. Login using the test user 
UN: user@gmail.com
PW: abc123

</br>
# Other References 🔗 </br>
- ToDo...maybe later

# Who, When, Why?

👨🏾‍💻 Author: Nick Renotte <br />
📅 Version: 1.x<br />
📜 License: This project is licensed under the MIT License </br>
