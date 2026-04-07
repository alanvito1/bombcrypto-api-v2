import LeaderBoardController from "../services-impl/LeaderBoardController";
import {IDependencies, ILeaderBoardController} from "../Services";
import ILogger from "../services/ILogger";
import {IHeroInfo} from "../consts/Consts";
import {Request, Response} from "express";

export default class LeaderBoardHandler {
    #logger: ILogger;
    #leaderboard: ILeaderBoardController;

    #cachedLeaderBoardResponse: string;

    constructor(dependencies: IDependencies) {
        this.#logger = dependencies.logger.clone('[APP]');
        this.#leaderboard = new LeaderBoardController(
            dependencies.logger,
            dependencies.messenger,
            this.updateNewData.bind(this),
        );
    }

    exportData(req: Request, res: Response) {
        res.sendSuccess(this.#cachedLeaderBoardResponse);
    }


    private updateNewData() {
        const exported = this.#leaderboard.exportData();
        const raceId = this.#leaderboard.currentRaceId;
        const result: IExportDataForModerator = {
            raceId: raceId,
            groupedData: exported
        };
        this.#cachedLeaderBoardResponse = JSON.stringify(result);
    }
}

interface IExportDataForModerator {
    raceId: number;
    groupedData: Array<IHeroInfo[]>
}
