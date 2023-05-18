import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import fetch from "node-fetch";
import { setContext } from "apollo-link-context";

// * Le decimos a donde se conecte
const httpLink = createHttpLink({
  // uri: "http://localhost:5000/",
  uri: "https://crmgraphql-production-06bf.up.railway.app/",
  fetch
});

// * Le agregamos un header nuevo
const authLink = setContext((_, { headers }) => {

  // ? Leer el storage almacenado
  const token = localStorage.getItem('token'); 

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

// * Lo conectamos a apollo client
const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
});

export default client;
