import "dotenv/config";

import { getRuntimeEnv } from "./config/env";
import { createServer } from "./server";

const runtimeEnv = getRuntimeEnv();
const app = createServer(runtimeEnv);

app.listen(runtimeEnv.PORT, "0.0.0.0");

