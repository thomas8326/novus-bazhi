import { Injectable } from '@angular/core';

import {
  五行相刻對照表,
  五行相生,
  五行相生對照表,
  五行轉換,
  陽列,
} from 'src/app/constants/constants';
import { 五行 } from 'src/app/enums/五行.enum';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';
import { BadProperty, 五行結果, 命盤, 命盤結果, 地支命盤, 天干命盤, 已作用, 流月命盤 } from 'src/app/interfaces/命盤';
import { 算命盤作用 } from 'src/app/services/算命/算命盤作用';

@Injectable({
  providedIn: 'root',
})
export class 算命服務器 {
  private 是否為天干: boolean = false;
  private 天干日柱: 天干 | null = null;
  private badPropertyMapping: BadProperty | null = null;
  private 是否斷氣 = false;

  設定天干日柱(gan: 天干) {
    this.天干日柱 = gan;
  }

  設定劫數對照表(property: BadProperty) {
    this.badPropertyMapping = property;
  }

  算命(目標命盤: 命盤[]) {
    for (const 算命 of 目標命盤) {
      // 未起運無大運
      if (算命.bigFortune.gan) {
        const 暫存天干命盤 = {
          year: 算命.year,
          horoscopeResult: 算命.horoscopeResult.gan,
          myFateSet: 算命.myFateSet.gan,
          bigFortune: 算命.bigFortune.gan,
          yearFortune: 算命.yearFortune.gan,
        };
        const 暫存地支命盤 = {
          year: 算命.year,
          horoscopeResult: 算命.horoscopeResult.zhi,
          myFateSet: 算命.myFateSet.zhi,
          bigFortune: 算命.bigFortune.zhi,
          yearFortune: 算命.yearFortune.zhi,
        };
        this.設定劫數對照表(算命.badPropertyMapping);
        this.設定天干日柱(算命.mainGanFate);
        this.算天干(暫存天干命盤);
        this.算地支(暫存地支命盤);
        this.算流月命盤(暫存天干命盤, 暫存地支命盤, 算命.monthFortune, 算命.year);
      }
    }
  }

  算流月命盤(天干父命盤: 天干命盤, 地支父命盤: 地支命盤, 目標命盤: 流月命盤[], year: number) {
    this.是否斷氣 = false;
    for (const 算命 of 目標命盤) {
      if (算命.bigFortune.gan) {
        const 暫存天干命盤: 天干命盤 = {
          year: year,
          month: 算命.month,
          horoscopeResult: 算命.horoscopeResult.gan,
          myFateSet: 算命.myFateSet.gan,
          bigFortune: 算命.bigFortune.gan,
          yearFortune: 算命.yearFortune.gan,
          monthFortune: 算命.monthFortune.gan
        };
        const 暫存地支命盤: 地支命盤 = {
          year: year,
          month: 算命.month,
          horoscopeResult: 算命.horoscopeResult.zhi,
          myFateSet: 算命.myFateSet.zhi,
          bigFortune: 算命.bigFortune.zhi,
          yearFortune: 算命.yearFortune.zhi,
          monthFortune: 算命.monthFortune.zhi
        };
        this.計算流月天干地支(天干父命盤, 暫存天干命盤, true);
        this.計算流月天干地支(地支父命盤, 暫存地支命盤, false);
      }
    }
  }

  算天干(對象命盤: 天干命盤) {
    this.是否為天干 = true;
    this.開始計算命盤(對象命盤);
  }

  算地支(對象命盤: 地支命盤) {
    this.是否為天干 = false;
    this.開始計算命盤(對象命盤);
  }

  private 開始計算命盤(對象命盤: 天干命盤 | 地支命盤) {
    const { bigFortune, yearFortune, myFateSet, horoscopeResult } = 對象命盤;

    const 算作用 = new 算命盤作用(對象命盤, this.是否為天干);
    算作用.大運流年相合();
    算作用.流年剋大運();
    算作用.大運剋流年();
    算作用.通用計算();


    this.流通(horoscopeResult, myFateSet, { bigFortune, yearFortune });
    horoscopeResult.計算日柱受剋(this.天干日柱);
    horoscopeResult.計算最後評分分數(this.badPropertyMapping, this.天干日柱);
  }

  //'辛', '戊', '壬', '丙' "壬" 戊
  private 流通(
    horoscopeResult: 命盤結果,
    myFateSet: (天干 | 地支)[],
    data: { bigFortune?: 天干 | 地支; yearFortune?: 天干 | 地支; liuYue?: 天干 | 地支 },
  ) {
    const { 陽, 陰 } = this.先分陰陽(horoscopeResult, myFateSet, data);
    const 陽流通陣列 = this.陰或陽五行流通(陽, true);
    const { 陽結果, 新陰 } = this.陽剋陰(陽流通陣列, 陰);

    const 陽五行結果表 = horoscopeResult.先批陽(陽結果);

    const 陰五行結果表 = this.陰或陽五行流通(新陰, false);

    const 流通陣列 = this.五行結果流通(陽五行結果表, 陰五行結果表);

    return horoscopeResult.再流通(流通陣列);
  }

  private 計算流月天干地支(
    父命盤: 天干命盤 | 地支命盤,
    對象命盤: 天干命盤 | 地支命盤,
    是否為天干: boolean,
  ) {
    this.是否為天干 = 是否為天干;
    const { bigFortune, yearFortune, monthFortune, myFateSet, horoscopeResult } = 對象命盤;
    const 設定斷氣 = () => 是否為天干 && (this.是否斷氣 = true);

    // 當流月流年相同時，斷氣結束並且無作用返回
    if (是否為天干 && this.是否斷氣 && yearFortune === monthFortune) {
      this.是否斷氣 = false;
    }

    const 算命盤 = new 算命盤作用(對象命盤, 是否為天干);
    if (this.是否斷氣 && 是否為天干) {
      算命盤.斷氣();
      算命盤.大運流月相合();
      算命盤.流月剋大運();
      算命盤.大運剋流月();
      算命盤.通用計算(true);
    }

    算命盤.流年流月相合();
    算命盤.流月剋流年(設定斷氣);
    算命盤.流年剋流月();
    算命盤.大運流年相合();
    算命盤.通用計算();
    算命盤.大運流年被合走流月加入計算();

    const 流通計算 = 算命盤.流月是否加入計算() ? { bigFortune, yearFortune, liuYue: monthFortune } : { bigFortune, yearFortune }
    this.流通(horoscopeResult, myFateSet, 流通計算);
    horoscopeResult.計算日柱受剋(this.天干日柱);
    horoscopeResult.計算最後評分分數(this.badPropertyMapping, this.天干日柱, 父命盤.horoscopeResult.antiWuHinCount);
  }

  private 陰或陽五行流通(天干地支: (天干 | 地支)[], 是否為陽: boolean) {
    const 五行結果表: 五行結果[] = [
      { 五行: 五行.金, 生剋: '生', 陽陣: [], 陽力: 0, 陰陣: [], 陰力: 0 },
      { 五行: 五行.水, 生剋: '生', 陽陣: [], 陽力: 0, 陰陣: [], 陰力: 0 },
      { 五行: 五行.木, 生剋: '生', 陽陣: [], 陽力: 0, 陰陣: [], 陰力: 0 },
      { 五行: 五行.火, 生剋: '生', 陽陣: [], 陽力: 0, 陰陣: [], 陰力: 0 },
      { 五行: 五行.土, 生剋: '生', 陽陣: [], 陽力: 0, 陰陣: [], 陰力: 0 },
    ];

    五行結果表.forEach((value) => {
      const 結果 = 天干地支.filter((data) => 五行轉換(data) === value.五行);
      if (!結果.length) {
        return;
      }

      if (是否為陽) {
        value.陽陣 = value.陽陣.concat(結果);
        value.陽力 += 結果.length;
      } else {
        value.陰陣 = value.陰陣.concat(結果);
        value.陰力 += 結果.length;
      }
    });



    let result: 五行結果[] = [];
    let 暫存五行結果: 五行結果[] = [];
    const 相剋: 五行結果[] = [];

    for (let i = 0; i < 五行結果表.length; i++) {
      const 相生表: number[] = 五行相生.get(五行結果表[i].五行)!;

      if (this.五行是否會被剋(五行結果表, i)) {
        相剋.push(五行結果表[i]);
      }

      for (let j = 0; j < 相生表.length; j++) {
        if (五行結果表[相生表[j]].陽陣.length || 五行結果表[相生表[j]].陰陣.length) {
          暫存五行結果.push(五行結果表[相生表[j]]);
        } else {
          break;
        }
      }
      result = result.length > 暫存五行結果.length ? result : 暫存五行結果;
      暫存五行結果 = [];
    }

    for (const 剋 of 相剋) {
      if (五行相刻對照表.get(result[result.length - 1].五行) === 剋.五行) {
        剋.生剋 = '剋';
        result.push(剋);
        return result;
      }
      if (五行相刻對照表.get(剋.五行) === result[result.length - 1].五行) {
        result.unshift(剋);
        result[result.length - 1].生剋 = '剋';
        return result;
      }
    }
    return result;
  }

  // TODO: Refactor
  private 五行結果流通(陽五行結果表: 五行結果[], 陰五行結果表: 五行結果[]) {
    if (!陰五行結果表.length) {
      return 陽五行結果表;
    }

    const data =
      陽五行結果表.length > 陰五行結果表.length
        ? { primary: 陽五行結果表, secondary: 陰五行結果表 }
        : { primary: 陰五行結果表, secondary: 陽五行結果表 };

    let 結果索引 = 0;
    let retry = 1;
    while (data.secondary.length !== 0 && retry <= 3) {
      if (結果索引 >= data.secondary.length) {
        結果索引 = 0;
        retry++;
      }

      const currentValue = data.secondary[結果索引];
      const findResult = data.primary.find((結果) => 結果.五行 === currentValue.五行);
      let 有相生 = false;

      if (findResult) {
        findResult.陽陣.push(...currentValue.陽陣);
        findResult.陰陣.push(...currentValue.陰陣);
        有相生 = true;
      } else {
        for (let i = data.primary.length - 1; i >= 0; i--) {
          if (五行相生對照表.get(currentValue.五行) === data.primary[i].五行) {
            data.primary[i].生剋 = '生';
            data.primary.splice(i, 0, currentValue);
            有相生 = true;
            break;
          }
          if (五行相生對照表.get(data.primary[i].五行) === currentValue.五行) {
            currentValue.生剋 = '生';
            data.primary.splice(i + 1, 0, currentValue);
            有相生 = true;
            break;
          }
        }
      }

      if (有相生) {
        data.secondary.splice(結果索引, 1);
        結果索引 = 0;
      } else {
        結果索引++;
      }
    }

    if (data.secondary.length > 1) {
      throw new Error(`這裡有特殊狀況！剩餘結果表: ${data.secondary.join()} 結果: ${data.primary.join()}`);
    }

    if (data.secondary.length === 1) {
      const 剩餘五行結果 = data.secondary[data.secondary.length - 1];
      if (五行相刻對照表.get(data.primary[data.primary.length - 1].五行) === 剩餘五行結果.五行) {
        剩餘五行結果.生剋 = '剋';
        data.primary.push(剩餘五行結果);
        return data.primary;
      }
      if (五行相刻對照表.get(剩餘五行結果.五行) === data.primary[data.primary.length - 1].五行) {
        data.primary.unshift(剩餘五行結果);
        data.primary[data.primary.length - 1].生剋 = '剋';
        return data.primary;
      }
    }

    return data.primary;
  }

  private 陽剋陰(陽結果: 五行結果[], 陰: (天干 | 地支)[]) {
    if (!陽結果.length) {
      return { 陽結果, 新陰: 陰 };
    }

    const firstElement = 陽結果[0];
    const lastElement = 陽結果[陽結果.length - 1];
    const 新陰陣列: (天干 | 地支)[] = [];

    if (lastElement.生剋 === '生') {
      const 最後元素相剋五行 = 五行相刻對照表.get(lastElement.五行);
      const 五行陰結果: 五行結果 = { 五行: 最後元素相剋五行!, 生剋: '剋', 陽陣: [], 陽力: 0, 陰陣: [], 陰力: 0 };

      if (陽結果.find(value => value.五行 === 五行陰結果.五行)) {
        return { 陽結果, 新陰: 陰 };
      }

      for (let i = 0; i < 陰.length; i++) {
        const 陰五行相生元素 = 五行相生對照表.get(五行轉換(陰[i]))!;

        if (最後元素相剋五行 === 五行轉換(陰[i]) && lastElement.陽力 > 五行陰結果.陰力 && 陰五行相生元素 !== firstElement.五行) {
          五行陰結果.陰陣.push(陰[i]);
          五行陰結果.陰力++;
        } else {
          新陰陣列.push(陰[i]);
        }
      }
      五行陰結果.陰力 && 陽結果.push(五行陰結果);
    }

    if (lastElement.生剋 === '剋') {
      const 生 = 陽結果[陽結果.length - 2];
      const 剋 = lastElement;

      for (let i = 0; i < 陰.length; i++) {
        const 生五行力量 = 生.陽力 + 生.陰力;
        const 剋五行力量 = lastElement.陽力 + lastElement.陰力;
        if (生五行力量 > 剋五行力量 && 五行轉換(陰[i]) === 剋.五行) {
          剋.陰陣.push(陰[i]);
          lastElement.陰力++;
        } else {
          新陰陣列.push(陰[i]);
        }
      }
    }

    return { 陽結果, 新陰: 新陰陣列 };
  }

  五行是否會被剋(結果: 五行結果[], index: number) {
    let 前索引 = index - 1;
    let 後索引 = index + 1;

    if (index === 0) {
      前索引 = 結果.length - 1;
    }

    if (index === 結果.length - 1) {
      後索引 = 0;
    }

    const 本身有值 = 結果[index].陽陣.length || 結果[index].陰陣.length;
    const 前後無值 =
      !結果[前索引].陽陣.length && !結果[前索引].陰陣.length && !結果[後索引].陽陣.length && !結果[後索引].陰陣.length;
    return 本身有值 && 前後無值;
  }

  private 先分陰陽(
    horoscopeResult: 命盤結果,
    myFateSet: (天干 | 地支)[],
    data: { bigFortune?: 天干 | 地支; yearFortune?: 天干 | 地支; liuYue?: 天干 | 地支 },
  ) {
    const 陽: (天干 | 地支)[] = [];
    const 陰: (天干 | 地支)[] = [];

    const 新增陰陽 = (target: 天干 | 地支) => {
      const 是否為陽 = 陽列.find((陽本命) => 陽本命 === target);

      if (是否為陽) {
        陽.push(target);
      } else {
        陰.push(target);
      }
    };

    if (data.bigFortune && !this.是否已作用(horoscopeResult.reaction.bigFortune)) 新增陰陽(data.bigFortune);
    if (data.yearFortune && !this.是否已作用(horoscopeResult.reaction.yearFortune)) 新增陰陽(data.yearFortune);
    if (data.liuYue && !this.是否已作用(horoscopeResult.reaction.monthFortune)) 新增陰陽(data.liuYue);

    for (let i = 0; i < myFateSet.length; i++) {
      if (this.是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      if (!this.是否已作用(horoscopeResult.reaction[this.年月日時住轉換(i)])) {
        新增陰陽(myFateSet[i]);
      }
    }

    return { 陽, 陰 };
  }

  private 年月日時住轉換(i: number) {
    switch (i) {
      case 0:
        return 命盤結果屬性.time;
      case 1:
        return 命盤結果屬性.day;
      case 2:
        return 命盤結果屬性.month;
      case 3:
        return 命盤結果屬性.year;
      default:
        throw new Error('輸入錯誤的值');
    }
  }

  private 是否已作用(作用: 已作用) {
    return 作用.match || 作用.anti || 作用.cut;
  }
}
