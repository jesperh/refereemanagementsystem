declare module interfaces {

    interface Base {
        id:number;
        createdAt:number;
        updatedAt:number;
    }

    interface User extends Base {

        name: string;
        firstname: string;
        lastname: string;
        username: string;
        email: string;
        timesReferee?: number;
        greetings?: string;
        interestReferee?: boolean;
        interestSecurity?: boolean;
        interestMisc?: boolean;
        WorkerTournaments?: WorkerTournament[];
    }

    interface WorkerTournament {
        Worker: interfaces.Worker;
        title: string;
        year: string;
    }

    interface Referee extends Base{
        comments?: string;
        WorkerId: number;
        Worker?: interfaces.Worker;
        CourtId?: number;
        Court: interfaces.Court;
        status: string;
    }

    interface Worker extends Base {
        TournamentId: number;
        Tournament?: Tournament;
        UserId: number;
        User?: interfaces.User;

    }

    interface Court extends Base {
        number: number;
        latitude?: string;
        longitude?: string;
        startTime?: string;
        endTime?: string;
        TournamentId?: number;
        Tournament?: Tournament;
        angle:number;
        Referees?: Referee[];

    }

    interface Tournament extends Base {

    }

    interface NewUser extends User {
        password: string;
    }

    interface OldUser extends User {
        newPassword?: string;
        password?: string;
    }

    interface News {
        id: number;
        title: string;
        body: string;
    }

    export interface UserIdentityInterface {
        email: string;
        id: number;
        username: string;
        role: string;
        interested: boolean;
    }

    export interface ControllerInterface {
        isLoading: boolean;
        serverError: boolean;
    }

    export interface TokenCheckResponseInterface {
        token:string;
        error:string
    }

}