const express = require('express');
const { ApolloServer, gql, UserInputError, ForbiddenError, AuthenticationError } = require('apollo-server-express');
const db = require('./util/database');
const {GraphQLScalarType} = require('graphql')

const app = express();

const UserModel = require('./Model/UserModel');

const typeDefs = `
    scalar DateTime

    type Query {
        getHello(name: String): String
        getUsers(name: String): [User]
    }

    type Mutation {
        postUser(data: postUserData): User
        updateUser(data: patchUserData): MutationResponse
        deleteUser(id: Int): MutationResponse
    }

    type MutationResponse {
        success: Boolean
        message: String
    }

    type User {
        id: Int
        firstName: String
        lastName: String
        mobile: String
        email: String
        password: String
        enabled: String
        createdAt: DateTime
        updatedAt: DateTime
    }

    input patchUserData {
        id: Int
        firstName: String
        lastName: String
        mobile: String
        email: String
        password: String
        enabled: String
        createdAt: DateTime
        updatedAt: DateTime
    }

    input postUserData {
        firstName: String
        lastName: String
        mobile: String
        email: String
        password: String
    }
`;

const resolvers = {
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.toISOString(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(ast.value) // ast value is always in string format
            }
            return null;
        },
    }),
    Query: {
        getHello: (_, {name}) => {
            return `Hello World ${name}`
        },
        getUsers: async (_, {name}) => {
            return await UserModel.findAll({
                where: {
                    firstName: name
                }
            });
        }
    },
    Mutation: {
        postUser: async (_, {data}) => {
            return await UserModel.create({...data});
        },
        updateUser: async (_, {data}) => {

            // throw new UserInputError('Missing ID for Update');

            const [row] = await UserModel.update( {
                ...data
            }, {
                where: {
                    id: data.id,
                }
            })
            console.log(`AFFECTED: ${row}`)


            return {
                success: true,
                message:"Update Success"
            }
        },
        deleteUser: async (_, {id}) => {
            const row = await UserModel.destroy({
                where: {
                    id: id
                }
            })

            console.log(`AFFECTED: ${row}`)

            return {
                success: true,
                message:"Update Success"
            }
        }
    }
};

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

apolloServer.applyMiddleware({app, path:'/api/test'});

db.sync({

}).then(() => {
    app.listen(5000, () => {
        console.log('Server running on port 5000')
    });    
});

