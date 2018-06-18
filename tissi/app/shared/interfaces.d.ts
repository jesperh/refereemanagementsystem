declare module interfaces {

    interface Team {
        name: string;
        id: string;
    }

    interface Game {
        team1: interfaces.Team;
        team2: interfaces.Team;
        team1score: number;
        team2score: number;
        started: boolean;
        id: string;
        ready: boolean;
        start?: string;
    }

    interface ScoreData {
        team1: interfaces.Team;
        team2: interfaces.Team;
        team1score: number;
        team2score: number;
        id: string;
        start: string;
        end:string;
        userId: number;
    }

    interface EventData {
        team1: interfaces.Team;
        team2: interfaces.Team;
        team1score: number;
        team2score: number;
        id: string;
        time: string;
        userId: number;
        event: string;
    }

    interface GameHalfScoreInterface {
        akkas:number;
        pappis:number;
        totalScore: number;
        updateGameTotalScore?(): void;
    }

    interface GameHalfInterface {
        ready:boolean;
        team1score: interfaces.GameHalfScoreInterface;
        team2score: interfaces.GameHalfScoreInterface;
    }
}