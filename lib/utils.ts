import { type ClassValue, clsx } from 'clsx';
import Nprogress from 'nprogress';
import { twMerge } from 'tailwind-merge';

import { Metric } from '@/types/response/Metric';

var colours: Record<string, string> = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  'indianred ': '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgrey: '#d3d3d3',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370d8',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#d87093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
  accent: 'yellow',
  '': 'white',
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function delay(timeMilis: number) {
  return await new Promise((resolve) => setTimeout(resolve, timeMilis));
}

export async function fixProgressBar() {
  await delay(500);
  Nprogress.done();
}

export function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function fillMetric(
  start: Date,
  numberOfDay: number,
  array: Metric[] | undefined,
  defaultValue: number,
) {
  if (!array) {
    return [];
  }

  let result: { value: number; time: string }[] = [];

  for (let i = numberOfDay - 1; i >= 0; i--) {
    let targetDay = new Date(start);

    targetDay.setDate(targetDay.getDate() + numberOfDay - i);

    if (Math.abs(targetDay.getMonth() - start.getMonth()) >= 2) {
      targetDay.setMonth(start.getMonth() + 1);
    }

    let value = array.find(
      (v) =>
        v.time.getFullYear() === targetDay.getFullYear() &&
        v.time.getMonth() === targetDay.getMonth() &&
        v.time.getDate() === targetDay.getDate(),
    );
    if (value === undefined)
      result.push({
        value: defaultValue,
        time: targetDay.toLocaleDateString(),
      });
    else
      result.push({
        value: value.value,
        time: value.time.toLocaleDateString(),
      });
  }
  return result;
}

export function toForm(data: Record<string, string | number | File>) {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'number') value = '' + value;
    form.append(key, value);
  });
  return form;
}

export function isReachedEnd(element: HTMLElement, offset: number = 100) {
  return (
    Math.abs(
      element.scrollHeight - (element.scrollTop + element.clientHeight),
    ) <= offset
  );
}

export function mapReversed<T, R>(
  array: T[],
  mapper: (data: T, index: number, array: T[]) => R,
) {
  var result = [];
  for (let i = array.length - 1; i >= 0; i--) {
    result.push(mapper(array[i], i, array));
  }

  return result;
}

export function max<T>(array: T[], transformer: (value: T) => number) {
  if (array.length === 0) return null;

  let max = transformer(array[0]);
  let value = array[0];

  for (let i = 1; i < array.length; i++) {
    if (transformer(array[i]) > max) {
      max = transformer(array[i]);
      value = array[i];
    }
  }

  return value;
}

export function getColor(color: string) {
  return colours[color];
}

export function mergeNestArray<T>(items: T[][]) {
  return items.reduce((prev, curr) => prev.concat(curr), []);
}

export function makeArray(size: number) {
  return Array(size).fill(1);
}
