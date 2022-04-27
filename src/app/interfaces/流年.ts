import { LiuNian, LiuYue } from 'lunar-typescript';
import { 地支對照表, 天干對照表 } from 'src/app/constants/constants';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';

export class 流年 {
  年: number;

  天干: 天干;

  地支: 地支;

  流月: 流月[];

  constructor(liuNian: LiuNian) {
    this.年 = liuNian.getYear();
    this.天干 = 天干對照表.get(liuNian.getGanZhi().charAt(0))!;
    this.地支 = 地支對照表.get(liuNian.getGanZhi().charAt(1))!;
    this.流月 = liuNian.getLiuYue().map(liuYue => new 流月(liuYue));
  }
}

export class 流月 {
  月: string;
  天干: 天干;
  地支: 地支;

  constructor(liuYue: LiuYue) {
    this.月 = liuYue.getMonthInChinese();
    this.天干 = 天干對照表.get(liuYue.getGanZhi().charAt(0))!;
    this.地支 = 地支對照表.get(liuYue.getGanZhi().charAt(1))!;
  }
}
