import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';

async function init(){
  const app = express()
  const port = 4000;
  
  const gqlServer  = new ApolloServer({
    typeDefs:`
     type Query {
        hello:String
        say(name:String):String
     }
     type Mutation {
       createUser(firstName:String!,lastName:String!,email:String!,password:String!) : Boolean
     }
    `,//schema
    resolvers:{
     Query :{
     hello : () => `Hey There, I am A Graphql Server`,
     say: (_,{name}:{name:string}) => `Hey , ${name} How are you?`
    },
    Mutation:{
      createUser: async(_,{firstName,lastName,email,password}:{firstName:string;lastName:string,email:string,password:string})  => {
        await prismaClient.user.create({
          data: {
            email,
            firstName,
            lastName,
            password,
            salt:'random_salt',
          },
        });
        return true;  
      }
       }
    } //actual functions to work
  })
  await gqlServer.start()
  
  app.get("/",(req: any,res: any) => {
    res.json({message:"Server is up and running"})
  });
  app.use('/graphql', express.json(), expressMiddleware(gqlServer));
  
  app.listen(port,()=> console.log(`Server running on port:${port}`))
}
init();