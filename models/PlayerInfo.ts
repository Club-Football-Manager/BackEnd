import fs from "fs";
import { faker } from "@faker-js/faker";

class Skill {
  constructor(
    public passing: string,
    public shooting: string,
    public tackling: string,
    public saving: string,
    public agility: string,
    public strength: string,
    public penaltyTaking: string,
    public jumping: string
  ) {}
}

class Player {
  constructor(
    // Id is generated into the Football Engine
    // public id: string,
    public image: string,
    public name: string,
    public position: string,
    public rating: string,
    public skill: Skill,
    public currentPOS: number[],
    public fitness: number,
    public injured: boolean
  ) {}

  static generateRandomPosition(): string {
    // const positions = ["Forward", "Midfielder", "Defender", "Goalkeeper"];
    // Right positions are there
    const positions = [
      "GK",
      "CB",
      "RB",
      "LB",
      "CDM",
      "CM",
      "CAM",
      "RM",
      "LM",
      "RW",
      "LW",
      "ST",
    ];
    return positions[Math.floor(Math.random() * positions.length)];
  }

  static generateRandomPlayer(): Player {
    return new Player(
      //   faker.string.alphanumeric({ length: 8 }),
      "",
      `${faker.person.firstName()} ${faker.person.lastName()}`,
      Player.generateRandomPosition(),
      faker.number.int({ min: 80, max: 99 }).toString(),
      new Skill(
        faker.number.int({ min: 80, max: 99 }).toString(),
        faker.number.int({ min: 80, max: 99 }).toString(),
        faker.number.int({ min: 80, max: 99 }).toString(),
        faker.number.int({ min: 80, max: 99 }).toString(),
        faker.number.int({ min: 80, max: 99 }).toString(),
        faker.number.int({ min: 80, max: 99 }).toString(),
        faker.number.int({ min: 80, max: 99 }).toString(),
        faker.number.int({ min: 80, max: 99 }).toString()
      ),
      [
        // currentPOS need to be based of the position of the player, it depands on formation and if the team play at home or away
        faker.number.int({ min: 0, max: 100 }),
        faker.number.int({ min: 0, max: 100 }),
      ],
      faker.number.int({ min: 80, max: 100 }),
      false
    );
  }
}

class PlayerData {
  static generatePlayers(count: number, userId: string): boolean {
    try {
      const players: Player[] = [];
      for (let i = 0; i < count; i++) {
        players.push(Player.generateRandomPlayer());
      }
      const jsonData = JSON.stringify(players, null, 2);
      if (!fs.existsSync(`./SaveData/${userId}`)) {
        fs.mkdirSync(`./SaveData/${userId}`);
      }
      fs.writeFileSync(`./SaveData/${userId}/Team.json`, jsonData);
      return true;
    } catch (error) {
      console.error("Error generating player data:", error);
      return false;
    }
  }

  static readPlayers(userId: string): Player[] {
    try {
      if (!fs.existsSync(`./SaveData/${userId}`)) {
        fs.mkdirSync(`./SaveData/${userId}`);
      }
      const jsonData = fs.readFileSync(
        `./SaveData/${userId}/Team.json`,
        "utf-8"
      );
      const players: Player[] = JSON.parse(jsonData);
      return players;
    } catch (error) {
      console.error("Error reading player data:", error);
      return [];
    }
  }
}

export { Player, PlayerData };
