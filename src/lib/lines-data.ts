// Данные линий метро «Города Знаний» (синхронизировано со схемой на главной)

export type LineStation = { name: string; programs: string[] };
export type MetroLine = {
  id: string;
  name: string;
  color: string;
  age: string;
  stations: LineStation[];
  legend: string[];
};

export const METRO_LINES: MetroLine[] = ;

export function getLine(id: string): MetroLine | undefined {
  return METRO_LINES.find((l) => l.id === id);
}
