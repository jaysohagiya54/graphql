import express from 'express'
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from './graphql/index'
import UserService from "./services/user";

async function init(){
  const app = express()
  const port = 4000;
  
  const gqlServer = await createApolloGraphqlServer();
  app.get("/",(req: any,res: any) => {
    res.json({message:"Server is up and running"})
  });
  app.use(
    "/graphql",express.json(),
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req }) => {
        // @ts-ignore
        const token = req.headers["token"];

        try {
          const user = UserService.decodeJWTToken(token as string);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );
  
  app.listen(port,()=> console.log(`Server running on port:${port}`))
}
init();
