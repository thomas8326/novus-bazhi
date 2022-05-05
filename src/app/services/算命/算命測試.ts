import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';
import { 命盤作用 } from 'src/app/interfaces/命盤';

export interface 天干測試 {
  姓名?: string;
  命盤: {
    本命: 天干[];
    大運: 天干;
    流年: 天干;
  };
  預期: 命盤作用;
  評分: string[];
}

export interface 地支測試 {
  姓名?: string;
  命盤: {
    本命: 地支[];
    大運: 地支;
    流年: 地支;
  };
  預期: 命盤作用;
  評分: string[];
}

export interface 算命測試 {
  天干測試: 天干測試[];
  地支測試: 地支測試[];
}
