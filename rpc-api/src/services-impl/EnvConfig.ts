import 'dotenv/config'
import {bool, cleanEnv, port, str} from 'envalid';
import {IEnvConfig} from "../Services";
import * as process from "node:process";

export default class EnvConfig implements IEnvConfig {
    constructor() {
        const env = cleanEnv(process.env, {
            IS_TEST: bool({default: false}),
            IS_PROD: bool({default: false}),
            PORT: port({default: 8105}),
        });

        this.isProduction = env.IS_PROD;
        this.port = env.PORT;
    }

    isProduction: boolean;
    port: number;
}