import * as fs from "fs";
import express, { Express, Request, Response, Application } from "express";
import { Player, PlayerData } from "./models/PlayerInfo";
import { League, LeagueManager } from "./models/League";
import { Match, MatchScheduler } from "./models/Match";

import cors from "cors";

const result = LeagueManager.loadLeagues();

const app: Application = express();
const userId = "test";
const port = 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req: Request, res: Response) => {
  return res.send("Welcome to Express & TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

app.get("/getPlayers", (req: Request, res: Response) => {
  const players: Player[] = PlayerData.readPlayers(userId);
  if (players.length <= 0) {
    const done: boolean = PlayerData.generatePlayers(21, userId);
    if (done) {
      const players: Player[] = PlayerData.readPlayers(userId);
      res.status(200).send(players);
    }
    return res.sendStatus(500);
  }
  return res.status(200).send(players);
});

app.get("/generatePlayers", (req: Request, res: Response) => {
  const done: boolean = PlayerData.generatePlayers(21, userId);
  const players: Player[] = PlayerData.readPlayers(userId);
  return done ? res.status(200).send(players) : res.sendStatus(404);
});

app.get("/league/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const league: League | undefined = result.find(
    (league) => league.name === id
  );
  if (id && league) {
    return res.status(200).json(league);
  } else {
    return res.sendStatus(404);
  }
});

app.get("/generateCalendar", (req: Request, res: Response) => {
  const matchSchedule: Match[] = MatchScheduler.generateMatchSchedule(
    result,
    new Date("08/22/2023")
  );
  if (matchSchedule) {
    if (!fs.existsSync(`./SaveData/${userId}`)) {
      fs.mkdirSync(`./SaveData/${userId}`);
    }
    fs.writeFileSync(
      `./SaveData/${userId}/Calendar.json`,
      JSON.stringify(matchSchedule)
    );
    return res.sendStatus(200);
  }
  return res.sendStatus(404);
});

app.get("/getCalendar", (req: Request, res: Response) => {
  if (!fs.existsSync(`./SaveData/${userId}`)) {
    fs.mkdirSync(`./SaveData/${userId}`);
  }
  if (!fs.existsSync(`./SaveData/${userId}/Calendar.json`)) {
    const matchSchedule: Match[] = MatchScheduler.generateMatchSchedule(
      result,
      new Date("08/22/2023")
    );
    console.log(matchSchedule);
    fs.writeFileSync(
      `./SaveData/${userId}/Calendar.json`,
      JSON.stringify(matchSchedule)
    );
  }
  const jsonData: string = fs.readFileSync(
    `./SaveData/${userId}/Calendar.json`,
    "utf-8"
  );
  const calendar: Match[] = JSON.parse(jsonData);
  return res.status(200).send(calendar);
});
