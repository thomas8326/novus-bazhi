import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';

export interface 命盤 {
  本命: 天干[] | 地支[];
  大運: 天干 | 地支;
  流年: 天干 | 地支;
}
