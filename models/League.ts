import fs from "fs";
import { Player } from "./PlayerInfo";
class League {
  constructor(
    public name: string,
    public country: string,
    public numberOfTeams: number,
    public topScorer: [],
    public topAssistMan: [],
    public topCleanSheet: [],
    public founded: number,
    public format: string,
    public clubs: Club[]
  ) {}
}

class LeagueManager {
  static loadLeagues(
    filePath: string = "./LeaguesSettings/settings.json"
  ): League[] {
    try {
      const rawData = fs.readFileSync(filePath, "utf-8");
      const leaguesData: any[] = JSON.parse(rawData);
      const leagues: League[] = leaguesData.map((data) => {
        const {
          name,
          country,
          numberOfTeams,
          topScorer,
          founded,
          format,
          clubs,
          topAssistMan,
          topCleanSheet,
        } = data;
        return new League(
          name,
          country,
          numberOfTeams,
          topScorer,
          topAssistMan,
          topCleanSheet,
          founded,
          format,
          clubs
        );
      });
      return leagues;
    } catch (error) {
      console.error("Error reading league data:", error);
      return [];
    }
  }
}

class Club {
  constructor(
    public name: string,
    public city: string,
    public stadium: string,
    public manager: string,
    public matchesWon: number,
    public matchesDrawn: number,
    public matchesLost: number,
    public players: Player[]
  ) {}
}

class ClubManager {
  static loadClubs(data: []): Club[] {
    try {
      const clubs: Club[] = data.map((data) => {
        const {
          name,
          city,
          stadium,
          manager,
          matchesWon,
          matchesDrawn,
          matchesLost,
          players,
        } = data;
        return new Club(
          name,
          city,
          stadium,
          manager,
          matchesWon,
          matchesDrawn,
          matchesLost,
          players
        );
      });
      return clubs;
    } catch (error) {
      console.error("Error reading club data:", error);
      return [];
    }
  }
}

export { Club, ClubManager, League, LeagueManager };
