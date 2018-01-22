const { makeExecutableSchema } = require('graphql-tools')
const { graphql }              = require('graphql')
const fetch                    = require('node-fetch')


const typeDefs = `
  type Post {
    id: Int!
    title: String
    body: String
    author: User
  }

  type User {
    id: Int!
    username: String
    email: String
    posts: [Post]
  }

  type Query {
    posts: [Post]
    post (id: Int!): Post
    users: [User]
    user: User
  }

  schema {
    query: Query
  }
`

const endpoint = 'https://jsonplaceholder.typicode.com'
const toJSON = res => res.json()

const post = (root, { id }) => fetch(`${endpoint}/posts/${id}`).then(toJSON)
const posts = () => fetch(`${endpoint}/posts`).then(toJSON)

const user = (root, { id }) => fetch(`${endpoint}/users/${id}`).then(toJSON)
const users = () => fetch(`${endpoint}/users`).then(toJSON)

const author    = ({ userId }) => fetch(`${endpoint}/users/${userId}`).then(toJSON)
const userPosts = ({ id }) => fetch(`${endpoint}/users/${id}/posts`).then(toJSON)


const resolvers = {
  Query: {
    post,
    posts,
    user,
    users,
  },
  Post: {
    author,
  },
  User: {
    posts: userPosts,
  }
}


const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})


const query = '{ post(id : 1) { id, title, author { id, username} }  }'

graphql(schema, query).then(result => {
  // Prints
  // {
  //   data: { helloWorld: "Hello!" }
  // }
  console.log("%j", result)
})

