import {commandOptions, RedisClientType} from "redis";
import ILogger from "../services/ILogger";
import getRedisClient from "./Redis";
import IMessengerService from "../services/IMessengerService";
import IEnvConfig from "../services/IEnvConfig";

const STREAM_CONSUMER_GROUP = 'th-mode-server';
const STREAM_CONSUMER = 'th-mode-server';
const BLOCK_TIME = 200;
type CALL_BACK = (data: any) => void;
type ON_CONSUMED = (streamKey: string, dataKey: string) => void;

export default class MessengerService implements IMessengerService {
    private readonly _redis: RedisClientType;
    readonly #logger: ILogger;
    readonly #streamListeners = new Map<string, CALL_BACK[]>();
    readonly #consumerGroup: string;
    readonly #consumerId: string;

    constructor(
        logger: ILogger,
        envConfig: IEnvConfig,
        options?: IOptions
    ) {
        this.#consumerGroup = options?.consumerGroup ?? STREAM_CONSUMER_GROUP;
        this.#consumerId = options?.consumerId ?? STREAM_CONSUMER;
        this.#logger = logger.clone('[MSG]');
        this._redis = getRedisClient(envConfig.redisConnectionString);
    }

    async send(streamKey: string, message: any): Promise<boolean> {
        try {
            const res = await this._redis.xAdd(streamKey, '*', {data: JSON.stringify(message)});
            return res !== null;
        } catch (e) {
            this.#logger.error(e);
            return false;
        }
    }

    listen(streamKey: string, callback: CALL_BACK): void {
        if (!this.#streamListeners.has(streamKey)) {
            this.#streamListeners.set(streamKey, [callback]);
            this.createStreamListener(streamKey).then();
        } else {
            this.#streamListeners.get(streamKey)!!.push(callback);
        }
    }

    private async createStreamListener(streamKey: string) {
        const loop = true;

        const options: IStreamReadOptions = {
            currentId: await this.getLatestId(streamKey),
        }

        while (loop) {
            try {
                await this.awaitNewNonGroupMessages(streamKey, options);
            } catch (e) {
                this.#logger.error(e);
            }
        }
    }

    private async awaitNewNonGroupMessages(streamKey: string, options: IStreamReadOptions) {
        const readMaxCount = 100;

        const dataArr = await this._redis.xRead(
            commandOptions({
                isolated: true
            }), [{
                key: streamKey,
                id: options.currentId
            }], {
                COUNT: readMaxCount,
                BLOCK: BLOCK_TIME
            }
        );

        if (dataArr) {
            await this.consumeData(dataArr, options, null);
        }
    }

    private async consumeData(dataArr: XReadReply[], options: IStreamReadOptions, onConsumed: ON_CONSUMED | null) {
        for (let data of dataArr) {
            for (let messageItem of data.messages) {
                options.currentId = messageItem.id;
                const dataValue = JSON.parse(messageItem.message.data);
                const consumers = this.#streamListeners.get(data.name);
                if (!consumers) {
                    continue;
                }
                for (const consumer of consumers) {
                    consumer(dataValue);
                }
            }
        }
    }

    private async getLatestId(streamKey: string) {
        try {
            const streamInfo = await this._redis.xInfoStream(streamKey);
            return streamInfo ? streamInfo.lastGeneratedId : '0-0';
        } catch (e) {
            this.#logger.error(e);
            return '0-0';
        }
    }
}

export interface IOptions {
    consumerGroup?: string,
    consumerId?: string
}

interface XReadReply {
    name: string,
    messages: {
        id: string;
        message: {
            [key: string]: string
        }
    }[]
}

interface IStreamReadOptions {
    currentId: string;
}