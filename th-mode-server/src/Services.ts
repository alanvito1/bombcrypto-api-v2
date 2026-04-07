import ILogger from "./services/ILogger";
import IEnvConfig from "./services/IEnvConfig";
import IMessengerService from "./services/IMessengerService";

export {ILogger, IEnvConfig, IMessengerService};

export {default as ILeaderBoardController} from "./services/ILeaderBoardController";

export interface IDependencies {
    logger: ILogger;
    envConfig: IEnvConfig;
    messenger: IMessengerService;

    isProduction(): boolean;
}
