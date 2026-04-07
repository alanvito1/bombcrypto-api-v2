import {IEnvConfig, ILogger} from "./Services";

import ConsoleLogger from "./services-impl/ConsoleLogger";
import EnvConfig from "./services-impl/EnvConfig";

interface IDependencies {
    logger: ILogger;
    envConfig: IEnvConfig;
}

let dependencies: IDependencies;

function initDependencies(): IDependencies {
    const logger = new ConsoleLogger("[DEFAULT]")
    const envConfig = new EnvConfig();

    dependencies = {
        logger,
        envConfig
    };

    return dependencies;
}

export {IDependencies, dependencies, initDependencies}