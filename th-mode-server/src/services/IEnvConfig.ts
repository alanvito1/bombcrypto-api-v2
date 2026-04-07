export default interface IEnvConfig {
    port: number;
    isProduction: boolean;
    refreshIntervalMs: number;
    redisConnectionString: string;
    useMockData: boolean;

    clientThModePath: string;
}
