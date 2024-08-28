import { Club, League, LeagueManager } from "./League";

class Match {
  constructor(
    public homeTeam: Club,
    public awayTeam: Club,
    public date: Date,
    public matchDay: number
  ) {}
}

class MatchScheduler {
  // https://github.com/Michi83/League-Schedule-Manager
  // using in case schedule.json

  static generateMatchSchedule(leagues: League[], startDate: Date): Match[] {
    const matches: Match[] = [];

    leagues.forEach((league) => {
      const clubs = league.clubs;
      const totalClubs = clubs.length;
      const totalMatchDays = totalClubs - 1;

      for (let i = 0; i < totalMatchDays; i++) {
        for (let j = 0; j < totalClubs / 2; j++) {
          const homeTeam = clubs[j];
          const awayTeam = clubs[totalClubs - 1 - j];
          const matchDay = i + 1;
          const date = new Date(); // Set the date according to your schedule
          date.setDate(date.getDate() + matchDay * 7); // Assuming matches are a week apart

          if (homeTeam && awayTeam) {
            if (j % 2 === i % 2) {
              matches.push(new Match(homeTeam, awayTeam, date, matchDay));
            } else {
              matches.push(new Match(awayTeam, homeTeam, date, matchDay));
            }
          }
        }
        matches.sort(() => Math.random() - 0.5);
        const lastClub = clubs.pop();
        if (lastClub) {
          clubs.splice(1, 0, lastClub);
        }
      }

      let startDate = matches[matches.length - 1].date;
      matches.reverse().forEach((match, index) => {
        const { homeTeam, awayTeam, matchDay } = match;
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + matchDay * 7); // date not increase correctly

        matches.push(
          new Match(awayTeam, homeTeam, newDate, totalMatchDays + matchDay)
        );
      });
    });
    return matches.sort((a, b) => a.matchDay - b.matchDay);
  }
}

export { Match, MatchScheduler };
