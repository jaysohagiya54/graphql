import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init(){
  const app = express()
  const port = 4000;
  
  const gqlServer  = new ApolloServer({
    typeDefs:`
     type Query{
        hello:String
        say(name:String):String
     }
    `,//schema
    resolvers:{
     Query :{
     hello : () => `Hey There, I am A Graphql Server`,
     say: (_,{name}:{name:string}) => `Hey , ${name} How are you?`
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