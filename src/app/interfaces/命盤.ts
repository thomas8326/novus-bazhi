import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';

export interface 命盤 {
  天干: 天干命盤;
  地支: 地支命盤;
}

export interface 命盤結果 {
  [命盤結果屬性.時住已合]: boolean;
  [命盤結果屬性.日住已合]: boolean;
  [命盤結果屬性.月住已合]: boolean;
  [命盤結果屬性.年住已合]: boolean;
  [命盤結果屬性.大運已合]: boolean;
  [命盤結果屬性.流年已合]: boolean;
}

export interface 天干命盤 {
  命盤結果: 命盤結果;
  本命: 天干[];
  大運: 天干;
  流年: 天干;
  已合: 天干[][];
}

export interface 地支命盤 {
  命盤結果: 命盤結果;
  本命: 地支[];
  大運: 地支;
  流年: 地支;
  已合: 地支[][];
}
