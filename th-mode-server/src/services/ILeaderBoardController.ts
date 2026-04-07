import {IHeroInfo} from "../consts/Consts";

export default interface ILeaderBoardController {
    readonly currentRaceId: number

    exportData(): Array<IHeroInfo[]>;
}