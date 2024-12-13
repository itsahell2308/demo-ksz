import cors from "cors";
import bodyParser from "body-parser";

import routes from "./routes";
import connectMongo from "./utils/dbConnection";
import { config, corsOptions } from "./config/config";
import { app, httpServer } from "./utils/socket";

const port = config.port;
const mongo_string = config.mongoDbUrl;

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
routes(app);

httpServer.listen(port, (): void => {
  connectMongo(mongo_string as string).then(() => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});
