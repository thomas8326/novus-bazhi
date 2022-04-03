import { DaYun } from 'lunar-typescript';
import { 地支對照表, 天干對照表 } from 'src/app/constants/constants';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';
import { 流年 } from 'src/app/interfaces/流年';

export class 大運 {
  年: number;

  天干: 天干;

  地支: 地支;

  流年: 流年[] = [];

  constructor(dayun: DaYun) {
    this.年 = dayun.getStartYear();
    this.天干 = 天干對照表.get(dayun.getGanZhi().charAt(0))!;
    this.地支 = 地支對照表.get(dayun.getGanZhi().charAt(1))!;
    this.流年 = dayun.getLiuNian().map((nian) => new 流年(nian));
  }
}
