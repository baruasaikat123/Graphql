const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')
const axios = require('axios')

const app = express()

/* 
    GraphQL comes with a set of default scalar types out of the box:
    Int : A signed 32‐bit integer.
    Float : A signed double-precision floating-point value.
    String : A UTF‐8 character sequence.
    Boolean : true or false .
    ID
    List - []
*/

let message = "This is a sample message"

const schema = buildSchema(`

    type Post{
        userId: Int,
        id: Int,
        title: String,
        body: String
    }

    type User {
        name: String
        age: Int
        college: String
    }

    type Query {
        hello: String!
        welcome(name: String, age: Int!): String
        getUser: User
        getUsers: [User]
        getPosts: [Post]
        getMessage: String
    }

    input UserInput {
        name: String!
        age: Int!
        college: String!
    }

    type Mutation {

        setMessage(newMessage: String): String
        createUser(user: UserInput): User
    }

`)

//resolver
const root = {

    hello: () => {

        return "Hello World"
    },

    welcome: (args) => {
        console.log(args)
        return `welcome ${args.name} and your age is ${args.age}`
    },

    getUser: () => {

        const user = {
            name: "Saikat Barua",
            age: 24,
            college: 'NITC'
        }

        return user
    },

    getUsers: () => {

        const users = [

            {
                name: "Saikat Barua",
                age: 24,
                college: 'NITC'
            },
            {
                name: "Digvijay",
                age: 23,
                college: "NITC"
            }
        ]

        return users
    },

    getPosts: async () => {

        const res = await axios.get('https://jsonplaceholder.typicode.com/posts')
        return res.data
    },

    getMessage: () => {

        return message
    },

    setMessage: (args) => {
        
        message = args.newMessage
        return message
    },

    createUser: (args) => {

        return args.user
    }
}

app.use('/graphql', graphqlHTTP({

    graphiql: true,
    schema: schema,
    rootValue: root,
}))

app.listen(4000, () => console.log(`Server is running on 4000`))