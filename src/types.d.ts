type CardType = {
  id: number;
  title: string;
};

type BoardType = {
  id: number;
  title: string;
  cards: CardType[];
};
