import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';
import { 大運 } from 'src/app/interfaces/大運';

export interface 命盤 {
  天干: 天干命盤;
  地支?: 地支命盤;
}

export class 命盤結果 {
  [命盤結果屬性.時住已作用]: boolean = false;

  [命盤結果屬性.日住已作用]: boolean = false;

  [命盤結果屬性.月住已作用]: boolean = false;

  [命盤結果屬性.年住已作用]: boolean = false;

  [命盤結果屬性.大運已作用]: boolean = false;

  [命盤結果屬性.流年已作用]: boolean = false;
}

export interface 天干命盤 {
  命盤結果: 命盤結果;
  本命: 天干[];
  // TODO: remove ? operator
  目前大運?: 大運;
  大運列?: 大運[];
  // TODO: remove these.
  大運: 天干;
  流年: 天干;
}

export interface 地支命盤 {
  命盤結果: 命盤結果;
  本命: 地支[];
  大運: 地支;
  流年: 地支;
}
