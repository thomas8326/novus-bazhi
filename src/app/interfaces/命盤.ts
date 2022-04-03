import { 五行轉換 } from 'src/app/constants/constants';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';

export interface 命盤 {
  天干: 天干命盤;
  地支?: 地支命盤;
}

export interface 命盤作用 {
  [命盤結果屬性.時住已作用]: boolean;

  [命盤結果屬性.日住已作用]: boolean;

  [命盤結果屬性.月住已作用]: boolean;

  [命盤結果屬性.年住已作用]: boolean;

  [命盤結果屬性.大運已作用]: boolean;

  [命盤結果屬性.流年已作用]: boolean;
}

export class 命盤結果 {
  作用: 命盤作用;

  評分: string[] = [];

  constructor() {
    this.作用 = {
      時住已作用: false,
      日住已作用: false,
      月住已作用: false,
      年住已作用: false,
      流年已作用: false,
      大運已作用: false,
    };
  }

  新增剋五行評分(大運流年: 天干 | 地支) {
    const 大運流年五行 = 五行轉換(大運流年);
    this.評分.push(`剋${大運流年五行}`);
  }
}

export interface 天干命盤 {
  命盤結果: 命盤結果;
  本命: 天干[];
  大運: 天干;
  流年: 天干;
}

export interface 地支命盤 {
  命盤結果: 命盤結果;
  本命: 地支[];
  大運: 地支;
  流年: 地支;
}
