import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';
import { 命盤結果 } from 'src/app/interfaces/命盤';

export interface 算命測試 {
  天干測試: {
    描述: string;
    命盤: {
      本命: 天干[] | 地支[];
      大運: 天干 | 地支;
      流年: 天干 | 地支;
    };
    預期: 命盤結果;
  };
}
