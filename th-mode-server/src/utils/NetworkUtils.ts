import {Network} from "../consts/Consts";

export const NetworkUtils = {
    fromString(network: string): Network {
        switch (network.toUpperCase()) {
            case "BSC":
                return Network.BSC;
            case "POLYGON":
                return Network.POLYGON;
            default:
                throw new Error("Invalid network");
        }
    },

    toString(network: Network): string {
        switch (network) {
            case Network.BSC:
                return "BSC";
            case Network.POLYGON:
                return "POLYGON";
            default:
                throw new Error("Invalid network");
        }
    }
}
