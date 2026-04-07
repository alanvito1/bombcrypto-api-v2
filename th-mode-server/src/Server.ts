import express from "express";
import cors from "cors";
import Routes from "./Routes";
import LeaderBoardHandler from "./routers/LeaderBoardHandler";
import Dependencies from "./Dependencies";

const dependencies = new Dependencies();
export const logger = dependencies.logger;
export const envConfig = dependencies.envConfig;
const leaderboardHandler = new LeaderBoardHandler(dependencies);


try {
    const app = express();

    Routes.setupStandardModules(app, logger, envConfig);

    const mainRouter = express.Router();

    app.use(`/th`, mainRouter);

    Routes.setupBasicRoutes(app);
    Routes.setupLeaderBoardRoutes(mainRouter, leaderboardHandler);

    app.listen(envConfig.port, () => {
        logger.info(`Server started at http://localhost:${envConfig.port}`);
    });
} catch (e) {
    logger.error(`Error starting server:`);
    logger.error(e);
}