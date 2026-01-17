import { GameMode, ChallengeCategory } from "./types/lol"

export const challengeWithCompletion: {
  id: string
  gameMode: GameMode
  category: ChallengeCategory
}[] = [
  {
    // Arena Ocean
    id: "602001",
    gameMode: "Arena",
    category: "Imagination",
  },
  {
    // Arena Champion
    id: "602002",
    gameMode: "Arena",
    category: "Imagination",
  },
  {
    // All Random All Champs
    id: "101301",
    gameMode: "Aram",
    category: "Imagination",
  },
  {
    // Perfectionist
    id: "210001",
    gameMode: "Rift",
    category: "Expertise",
  },
  {
    // Same Penta, Different Champ
    id: "210002",
    gameMode: "Rift",
    category: "Expertise",
  },
  {
    // Invincible
    id: "202303",
    gameMode: "Rift",
    category: "Expertise",
  },
  {
    // Protean Override
    id: "120002",
    gameMode: "Rift",
    category: "Veterancy",
  },
  {
    // Master Yourself
    id: "401104",
    gameMode: "Rift",
    category: "Veterancy",
  },
  {
    // Master the Enemy
    id: "401107",
    gameMode: "Rift",
    category: "Veterancy",
  },
  {
    // Jack of all Champs
    id: "401106",
    gameMode: "Rift",
    category: "Veterancy",
  },
]
