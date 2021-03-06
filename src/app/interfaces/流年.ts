import { LiuNian, LiuYue } from 'lunar-typescript';
import { 地支對照表, 天干對照表 } from 'src/app/constants/constants';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';
import { 命盤結果 } from 'src/app/interfaces/命盤';

export class 流年 {
  年: number;

  天干: 天干;

  地支: 地支;

  流月: 流月[];

  constructor(liuNian: LiuNian) {
    this.年 = liuNian.getYear();
    this.天干 = 天干對照表.get(liuNian.getGanZhi().charAt(0))!;
    this.地支 = 地支對照表.get(liuNian.getGanZhi().charAt(1))!;
    this.流月 = liuNian.getLiuYue().map((liuYue) => new 流月(liuYue));
  }
}

export class 流月 {
  chineseMonth: string;
  month: string;
  gan: 天干;
  zhi: 地支;
  ganResult: 命盤結果;
  zhiResult: 命盤結果;

  constructor(liuYue: LiuYue) {
    this.month = liuYue.getIndex() + 2 > 12 ? '1' : (liuYue.getIndex() + 2).toString();
    this.chineseMonth = liuYue.getMonthInChinese()

    this.gan = 天干對照表.get(liuYue.getGanZhi().charAt(0))!;
    this.zhi = 地支對照表.get(liuYue.getGanZhi().charAt(1))!;
    this.ganResult = new 命盤結果(true);
    this.zhiResult = new 命盤結果(false);
  }
}
