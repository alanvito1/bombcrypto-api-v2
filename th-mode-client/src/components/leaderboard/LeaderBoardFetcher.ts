import {IFetchedData} from "./LeaderBoardData";
import {sendGetRequest} from "../../utils/NetworkUtils";
import {sleep} from "../../utils/MiscUtils";
import Urls from "../../consts/Urls";

const FETCH_INTERVAL = 5000;
const COUNT_DOWN_INTERVAL = 500;
const IDLE_INTERVAL = 100;
const LOG_TAG = 'LeaderBoardFetcher';

export default class LeaderBoardFetcher {
    private _isAlive: boolean = true;
    private _isRunning: boolean = false;
    private _countdownTimer: number = FETCH_INTERVAL;
    private _lastCountdownTime: number = 0;

    constructor(
        private readonly _onDataFetched: (data: IFetchedData) => void,
        private readonly _onTimeCountDown: (timeLeft: number) => void
    ) {
        this.loop().then();
    }

    start() {
        this._isRunning = true;
    }

    stop() {
        this._isRunning = false;
    }

    destroy() {
        this._isAlive = false;
        this._isRunning = false;
    }

    private log(message: string) {
        console.log(`[${LOG_TAG}] ${message}`);
    }

    // Helper method to start countdown
    private async startCountdown() {
        this._countdownTimer = FETCH_INTERVAL;
        this._lastCountdownTime = Date.now();
        await this.updateCountdown();
    }

    // Updates the countdown timer and returns true when countdown finishes
    private async updateCountdown(): Promise<boolean> {
        while (this._countdownTimer > 0 && this._isRunning && this._isAlive) {
            const currentTime = Date.now();
            const elapsedTime = currentTime - this._lastCountdownTime;

            if (elapsedTime >= COUNT_DOWN_INTERVAL) {
                this._countdownTimer -= elapsedTime;
                this._lastCountdownTime = currentTime;

                // Prevent negative values
                if (this._countdownTimer < 0) this._countdownTimer = 0;

                // Update UI with the countdown value
                this._onTimeCountDown?.(Math.ceil(this._countdownTimer / 1000));

                await sleep(COUNT_DOWN_INTERVAL);
            } else {
                await sleep(IDLE_INTERVAL);
            }
        }

        return this._countdownTimer <= 0;
    }

    private async loop() {
        // Initial countdown setup
        await this.startCountdown();

        while (this._isAlive) {
            try {
                if (!this._isRunning) {
                    // When stopped, just show max time but don't count down
                    this._onTimeCountDown?.(Math.ceil(FETCH_INTERVAL / 1000));
                    await sleep(IDLE_INTERVAL);
                    continue;
                }

                const fetchedData = await sendGetRequest<IFetchedData>(Urls.ThFetchThModeLeaderBoard, true);

                if (!this._isRunning) {
                    continue; // Skip processing if stopped during API call
                }

                if (!fetchedData) {
                    // Reset countdown when fetch fails and start it again
                    await this.startCountdown();
                    continue;
                }

                // Process data and update UI
                this._onDataFetched?.(fetchedData);

                // Start a new countdown
                await this.startCountdown();

            } catch (error) {
                // Reset countdown when error occurs and start it again
                await this.startCountdown();
            }
        }
    }
}