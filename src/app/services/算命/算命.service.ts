import { Injectable } from '@angular/core';

import {
  五行互救對照表,
  五行相刻對照表,
  五行相生,
  五行相生對照表,
  五行轉換,
  相合對照表,
  陰列,
  陽列,
} from 'src/app/constants/constants';
import { 五行 } from 'src/app/enums/五行.enum';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';
import { 五行結果, 命盤, 命盤結果, 地支命盤, 天干命盤 } from 'src/app/interfaces/命盤';

@Injectable({
  providedIn: 'root',
})
export class 算命服務器 {
  private 是否為天干: boolean = false;
  private 是否斷氣 = false;

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
          liuYue: 算命.monthFortune,
        };
        const 暫存地支命盤 = {
          year: 算命.year,
          horoscopeResult: 算命.horoscopeResult.zhi,
          myFateSet: 算命.myFateSet.zhi,
          bigFortune: 算命.bigFortune.zhi,
          yearFortune: 算命.yearFortune.zhi,
          liuYue: 算命.monthFortune,
        };
        this.算天干(暫存天干命盤);
        this.算地支(暫存地支命盤);
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

    if (this.大運流年相合(horoscopeResult, yearFortune, bigFortune)) {
      this.大運流年流月消相同本命(horoscopeResult, myFateSet, bigFortune, yearFortune);
    }

    if (this.大運剋流年(horoscopeResult, bigFortune, yearFortune)) {
      this.本命互相合(horoscopeResult, myFateSet);
      const { 救流年 } = this.大運流年相剋找人救(horoscopeResult, myFateSet, bigFortune, yearFortune);
      const { 已作用集, 大運已作用, 流年已作用 } = this.大運流年流月與本命作用(horoscopeResult, myFateSet, {
        bigFortune,
        yearFortune,
      });
      this.本命互相合(horoscopeResult, myFateSet, 已作用集);

      if (!大運已作用 && !流年已作用 && !救流年) {
        horoscopeResult.reaction.流年已作用 = true;
        horoscopeResult.reaction.流年被剋 = true;
        this.大運流年流月消相同本命(horoscopeResult, myFateSet, yearFortune);
      }
    } else if (this.流年剋大運(horoscopeResult, bigFortune, yearFortune)) {
      this.本命互相合(horoscopeResult, myFateSet);
      const { 救大運 } = this.大運流年相剋找人救(horoscopeResult, myFateSet, bigFortune, yearFortune);
      const { 已作用集, 大運已作用, 流年已作用 } = this.大運流年流月與本命作用(
        horoscopeResult,
        myFateSet,
        { bigFortune, yearFortune },
        { bigFortune: 救大運, yearFortune: true },
      );
      this.本命互相合(horoscopeResult, myFateSet, 已作用集);

      if (!大運已作用 && !流年已作用 && !救大運) {
        horoscopeResult.reaction.大運已作用 = true;
        horoscopeResult.reaction.大運被剋 = true;
        this.大運流年流月消相同本命(horoscopeResult, myFateSet, bigFortune);
      }
    } else {
      this.本命互相合(horoscopeResult, myFateSet);
      const { 已作用集 } = this.大運流年流月與本命作用(horoscopeResult, myFateSet, { bigFortune, yearFortune });
      this.本命互相合(horoscopeResult, myFateSet, 已作用集);
    }
    const 五行流通結果 = this.流通(horoscopeResult, myFateSet, bigFortune, yearFortune);
    horoscopeResult.計算日柱受剋(myFateSet[1], 五行流通結果);
    this.計算流月(對象命盤);
  }

  //'辛', '戊', '壬', '丙' "壬" 戊
  private 流通(
    horoscopeResult: 命盤結果,
    myFateSet: (天干 | 地支)[],
    bigFortune: 天干 | 地支,
    yearFortune: 天干 | 地支,
  ) {
    const { 陽, 陰 } = this.先分陰陽(horoscopeResult, myFateSet, bigFortune, yearFortune);
    const 陽流通陣列 = this.先生後剋(陽);
    const 陽流通陣列補陰 = this.當生陽大於剋陽時補陰(陽流通陣列, 陰);

    const 批陽結果 = horoscopeResult.先批陽(陽流通陣列補陰.陽結果);

    const 流通陣列 = this.五行結果流通(批陽結果, 陰);
    return horoscopeResult.再流通(流通陣列);
  }

  private 大運流年流月與本命作用(
    result: 命盤結果,
    myFateSet: (天干 | 地支)[],
    data: { bigFortune?: 天干 | 地支; yearFortune?: 天干 | 地支; liuYue?: 天干 | 地支 },
    canHelp = { bigFortune: true, yearFortune: true },
  ) {
    let 大運已作用 = result.reaction.大運已作用;
    let 流年已作用 = result.reaction.流年已作用;
    let 流月已作用 = result.reaction.流月已作用;

    const 已作用集 = new Set<天干 | 地支>();

    // 剩餘本命與大運流年流月作用
    for (let i = 0; i < myFateSet.length; i++) {
      const 本命已作用 = result.reaction[this.年月日時住轉換(i)];

      if (this.是否為天干日住(i) || 本命已作用) {
        continue;
      }

      const 大運本命可以合 = !大運已作用 && this.是否相合(myFateSet[i], data.bigFortune);
      if (canHelp?.bigFortune && data.bigFortune && 大運本命可以合) {
        result.reaction[this.年月日時住轉換(i)] = true;
        result.reaction.大運已作用 = true;
        已作用集.add(data.bigFortune);
        大運已作用 = true;
      }

      const 流年本命可以合 = !流年已作用 && this.是否相合(myFateSet[i], data.yearFortune);
      if (canHelp?.yearFortune && data.yearFortune && 流年本命可以合) {
        result.reaction[this.年月日時住轉換(i)] = true;
        result.reaction.流年已作用 = true;
        已作用集.add(data.yearFortune);
        流年已作用 = true;
      }

      if (data.liuYue && !流月已作用 && this.是否相合(myFateSet[i], data.liuYue)) {
        result.reaction[this.年月日時住轉換(i)] = true;
        result.reaction.流月已作用 = true;
        已作用集.add(data.liuYue);
        流月已作用 = true;
      }
    }

    return { 大運已作用, 流年已作用, 流月已作用, 已作用集 };
  }

  private 本命互相合(result: 命盤結果, myFateSet: (天干 | 地支)[], 已作用集?: Set<天干 | 地支>) {
    let prevIndexStack: number[] = [];

    // 本命互相作用
    for (let i = 0; i < myFateSet.length; i++) {
      const 當前已作用 = result.reaction[this.年月日時住轉換(i)];

      if (this.是否為天干日住(i) || 當前已作用) {
        continue;
      }

      if (已作用集?.has(myFateSet[i])) {
        result.reaction[this.年月日時住轉換(i)] = true;
        continue;
      }

      if (prevIndexStack.length === 0) {
        prevIndexStack.push(i);
        continue;
      }

      const prevIndex = prevIndexStack[prevIndexStack.length - 1];
      const 前一個還沒作用 = !result.reaction[this.年月日時住轉換(prevIndex)];
      if (前一個還沒作用 && this.是否相合(myFateSet[i], myFateSet[prevIndex])) {
        result.reaction[this.年月日時住轉換(i)] = true;
        result.reaction[this.年月日時住轉換(prevIndex)] = true;
        prevIndexStack.pop();
      } else {
        prevIndexStack.push(i);
      }
    }
    return prevIndexStack;
  }

  private 計算流月(對象命盤: 天干命盤 | 地支命盤) {
    const { bigFortune, yearFortune, myFateSet } = 對象命盤;
    for (let liuYue of 對象命盤.liuYue) {
      this.計算流月天干地支(liuYue.ganResult, myFateSet, bigFortune, yearFortune, liuYue.gan);
      this.計算流月天干地支(liuYue.zhiResult, myFateSet, bigFortune, yearFortune, liuYue.zhi);
    }
  }

  private 計算流月天干地支(
    result: 命盤結果,
    myFateSet: (天干 | 地支)[],
    bigFortune: 天干 | 地支,
    yearFortune: 天干 | 地支,
    liuYueGanZhi: 天干 | 地支,
  ) {
    // 當流月流年相同時，斷氣結束並且無作用返回
    if (this.是否斷氣 && yearFortune === liuYueGanZhi) {
      this.是否斷氣 = false;
      return;
    }

    const 流年流月合 = this.流年流月相合(result, yearFortune, liuYueGanZhi);
    const 大運流年合 = this.大運流年相合(result, yearFortune, bigFortune);
    // 斷氣 流月大運本命相合 | 流年流月相合 大運+本命 | 大運流年相合 流月+本命
    if (this.是否斷氣 || 流年流月合 || 大運流年合) {
      const data = () => {
        if (this.是否斷氣) {
          result.reaction.流年斷氣 = true;
          return { bigFortune, liuYue: liuYueGanZhi };
        }
        if (大運流年合) {
          return { liuYue: liuYueGanZhi };
        }
        return { bigFortune, yearFortune };
      };
      this.本命互相合(result, myFateSet);
      const { 已作用集 } = this.大運流年流月與本命作用(result, myFateSet, data());
      this.本命互相合(result, myFateSet, 已作用集);
      const 五行流通結果 = this.流通(result, myFateSet, bigFortune, yearFortune);
      result.計算日柱受剋(myFateSet[1], 五行流通結果);
      return;
    }

    const 流月五行 = 五行轉換(yearFortune);
    const 流年五行 = 五行轉換(liuYueGanZhi);

    // 流年剋流月
    if (五行相刻對照表.get(流年五行) === 流月五行) {
      result.新增流年流月相剋評分(liuYueGanZhi, true);
      return;
    }

    // 流月剋流年 -> 斷氣
    if (五行相刻對照表.get(流月五行) === 流年五行) {
      result.新增流年流月相剋評分(liuYueGanZhi, false);
      this.是否斷氣 = true;
      return;
    }
  }

  private 先生後剋(天干地支: (天干 | 地支)[], 是否為陽 = true) {
    const 五行結果表: 五行結果[] = [
      { 五行: 五行.金, 生剋: '生', 陽陣: [], 陰陣: [] },
      { 五行: 五行.水, 生剋: '生', 陽陣: [], 陰陣: [] },
      { 五行: 五行.木, 生剋: '生', 陽陣: [], 陰陣: [] },
      { 五行: 五行.火, 生剋: '生', 陽陣: [], 陰陣: [] },
      { 五行: 五行.土, 生剋: '生', 陽陣: [], 陰陣: [] },
    ];

    五行結果表.forEach((value) => {
      const 結果 = 天干地支.filter((data) => 五行轉換(data) === value.五行);
      if (!結果.length) {
        return;
      }

      if (是否為陽) {
        value.陽陣 = value.陽陣.concat(結果);
      } else {
        value.陰陣 = value.陰陣.concat(結果);
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
  private 五行結果流通(五行結果表: 五行結果[], 陰: (天干 | 地支)[]) {
    if (!陰.length) {
      return 五行結果表;
    }

    const 陰流通陣列 = this.先生後剋(陰, false);

    // 五行結果: [水生木] 陰流通: [土]的情況時應該要反過來把陰流通加到五行結果中
    if (陰.length === 1) {
      const findResult = 五行結果表.find((結果) => 結果.五行 === 陰流通陣列[0].五行);
      if (findResult) {
        findResult.陰陣.push(...陰流通陣列[0].陽陣);
        findResult.陰陣.push(...陰流通陣列[0].陰陣);
      } else {
        for (let i = 0; i < 五行結果表.length; i++) {
          if (五行相生對照表.get(陰流通陣列[0].五行) === 五行結果表[i].五行) {
            五行結果表[i].生剋 = '生';
            五行結果表.splice(i, 0, 陰流通陣列[0]);
            return 五行結果表;
          }
          if (五行相生對照表.get(五行結果表[i].五行) === 陰流通陣列[0].五行) {
            陰流通陣列[0].生剋 = '生';
            五行結果表.splice(i + 1, 0, 陰流通陣列[0]);
            return 五行結果表;
          }
        }

        for (let i = 0; i < 五行結果表.length; i++) {
          if (五行相刻對照表.get(陰流通陣列[0].五行) === 五行結果表[i].五行) {
            五行結果表[i].生剋 = '剋';
            五行結果表.splice(i, 0, 陰流通陣列[0]);
            return 五行結果表;
          }
          if (五行相刻對照表.get(五行結果表[i].五行) === 陰流通陣列[0].五行) {
            陰流通陣列[0].生剋 = '剋';
            五行結果表.splice(i + 1, 0, 陰流通陣列[0]);
            return 五行結果表;
          }
        }
      }
    }

    let 結果索引 = 0;
    let retry = 1;
    while (五行結果表.length !== 0 && retry <= 3) {
      if (結果索引 >= 五行結果表.length) {
        結果索引 = 0;
        retry++;
      }

      const currentValue = 五行結果表[結果索引];
      const findResult = 陰流通陣列.find((結果) => 結果.五行 === currentValue.五行);
      let 有相生 = false;

      if (findResult) {
        findResult.陽陣.push(...currentValue.陽陣);
        findResult.陰陣.push(...currentValue.陰陣);
        有相生 = true;
      } else {
        for (let i = 陰流通陣列.length - 1; i >= 0; i--) {
          if (五行相生對照表.get(currentValue.五行) === 陰流通陣列[i].五行) {
            陰流通陣列[i].生剋 = '生';
            陰流通陣列.splice(i, 0, currentValue);
            有相生 = true;
            break;
          }
          if (五行相生對照表.get(陰流通陣列[i].五行) === currentValue.五行) {
            currentValue.生剋 = '生';
            陰流通陣列.splice(i + 1, 0, currentValue);
            有相生 = true;
            break;
          }
        }
      }

      if (有相生) {
        五行結果表.splice(結果索引, 1);
        結果索引 = 0;
      } else {
        結果索引++;
      }
    }

    if (五行結果表.length > 1) {
      throw new Error(`這裡有特殊狀況！剩餘結果表: ${五行結果表.join()} 結果: ${陰流通陣列.join()}`);
    }

    if (五行結果表.length === 1) {
      const 剩餘五行結果 = 五行結果表[五行結果表.length - 1];
      if (五行相刻對照表.get(陰流通陣列[陰流通陣列.length - 1].五行) === 剩餘五行結果.五行) {
        剩餘五行結果.生剋 = '剋';
        陰流通陣列.push(剩餘五行結果);
        return 陰流通陣列;
      }
      if (五行相刻對照表.get(剩餘五行結果.五行) === 陰流通陣列[陰流通陣列.length - 1].五行) {
        陰流通陣列.unshift(剩餘五行結果);
        陰流通陣列[陰流通陣列.length - 1].生剋 = '剋';
        return 陰流通陣列;
      }
    }

    return 陰流通陣列;
  }

  private 當生陽大於剋陽時補陰(陽結果: 五行結果[], 陰: (天干 | 地支)[]) {
    if (陽結果.length < 2 || 陽結果[陽結果.length - 1].生剋 !== '剋') {
      return { 陽結果, 陰 };
    }

    const 剋 = 陽結果[陽結果.length - 1];
    const 生 = 陽結果[陽結果.length - 2];

    for (let i = 0; i < 陰.length; i++) {
      if (生.陽陣.length <= 剋.陽陣.length) {
        return { 陽結果, 陰 };
      }

      if (五行轉換(陰[i]) === 剋.五行) {
        剋.陰陣 = 剋.陰陣.concat(陰[i]);
        陰.splice(i, 1);
      }
    }

    return { 陽結果, 陰 };
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
    bigFortune: 天干 | 地支,
    yearFortune: 天干 | 地支,
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

    if (!horoscopeResult.reaction.大運已作用) 新增陰陽(bigFortune);
    if (!horoscopeResult.reaction.流年已作用) 新增陰陽(yearFortune);

    for (let i = 0; i < myFateSet.length; i++) {
      if (this.是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      if (!horoscopeResult.reaction[this.年月日時住轉換(i)]) {
        新增陰陽(myFateSet[i]);
      }
    }

    return { 陽, 陰 };
  }

  private 大運流年相合(result: 命盤結果, yearFortune: 天干 | 地支, bigFortune: 天干 | 地支): boolean {
    if (bigFortune && this.是否相合(bigFortune, yearFortune)) {
      result.reaction.大運已作用 = true;
      result.reaction.流年已作用 = true;
      return true;
    }

    return false;
  }

  private 流年流月相合(result: 命盤結果, yearFortune: 天干 | 地支, liuYueGanZhi: 天干 | 地支) {
    if (liuYueGanZhi && this.是否相合(yearFortune, liuYueGanZhi)) {
      result.reaction.流年已作用 = true;
      result.reaction.流月已作用 = true;
      return true;
    }
    return false;
  }

  private 流年剋大運(horoscopeResult: 命盤結果, bigFortune: 天干 | 地支, yearFortune: 天干 | 地支) {
    return !horoscopeResult.reaction.大運已作用 && this.是否相刻(yearFortune, bigFortune);
  }

  private 大運剋流年(horoscopeResult: 命盤結果, bigFortune: 天干 | 地支, yearFortune: 天干 | 地支) {
    return !horoscopeResult.reaction.流年已作用 && this.是否相刻(bigFortune, yearFortune);
  }

  private 大運流年相剋找人救(
    horoscopeResult: 命盤結果,
    myFateSet: (天干 | 地支)[],
    bigFortune: 天干 | 地支,
    yearFortune: 天干 | 地支,
  ) {
    for (let i = 0; i < myFateSet.length; i++) {
      const 已作用 = horoscopeResult.reaction[this.年月日時住轉換(i)];
      if ((this.是否為天干 && i === 1) || 已作用) {
        continue;
      }

      // 救流年
      if (this.是否能救(myFateSet[i], bigFortune, yearFortune)) {
        return { 救大運: false, 救流年: true };
      }

      // 救大運
      if (this.是否能救(myFateSet[i], yearFortune, bigFortune)) {
        return { 救大運: true, 救流年: false };
      }
    }
    return { 救大運: false, 救流年: false };
  }

  private 大運流年流月消相同本命(
    result: 命盤結果,
    myFateSet: (天干 | 地支)[],
    消失目標1: 天干 | 地支,
    消失目標2?: 天干 | 地支,
  ) {
    for (let i = 0; i < myFateSet.length; i++) {
      if (this.是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      if (myFateSet[i] === 消失目標1 || myFateSet[i] === 消失目標2) {
        result.reaction[this.年月日時住轉換(i)] = true;
      }
    }
  }

  private 是否相合(key: 天干 | 地支, value?: 天干 | 地支) {
    return !value ? false : 相合對照表.get(key) === value;
  }

  private 是否相刻(作用主體: 天干 | 地支, 被作用目標: 天干 | 地支) {
    const 不是陰剋陽作用主體 = !this.是否陰作用陽(作用主體, 被作用目標);
    const 作用主體五行 = 五行轉換(作用主體);
    const 被作用目標五行 = 五行轉換(被作用目標);

    return 不是陰剋陽作用主體 && 五行相刻對照表.get(作用主體五行) === 被作用目標五行;
  }

  private 是否能救(本命: 天干 | 地支, 作用主體: 天干 | 地支, 被作用目標: 天干 | 地支) {
    const 本命五行 = 五行轉換(本命);
    const 作用五行 = 五行轉換(作用主體);
    const 被作用五行 = 五行轉換(被作用目標);
    const 作用主體刻被作用主體 = 五行相刻對照表.get(作用五行) === 被作用五行;
    const 不是陰剋陽作用主體 = !this.是否陰作用陽(本命, 作用主體);
    const 不是陰救陽被作用目標 = !this.是否陰作用陽(本命, 被作用目標);
    const 不是同五行陽救陽 = 本命五行 !== 被作用五行;

    return (
      不是陰剋陽作用主體 &&
      不是陰救陽被作用目標 &&
      不是同五行陽救陽 &&
      作用主體刻被作用主體 &&
      五行互救對照表.get(本命五行)?.find((data) => data === 被作用五行)
    );
  }

  private 年月日時住轉換(i: number) {
    switch (i) {
      case 0:
        return 命盤結果屬性.時住已作用;
      case 1:
        return 命盤結果屬性.日住已作用;
      case 2:
        return 命盤結果屬性.月住已作用;
      case 3:
        return 命盤結果屬性.年住已作用;
      default:
        throw new Error('輸入錯誤的值');
    }
  }

  private 是否為天干日住(index: number) {
    return this.是否為天干 && index === 1;
  }

  private 是否陰作用陽(目標: 天干 | 地支, 被剋: 天干 | 地支) {
    return 陰列.find((陰屬性) => 目標 === 陰屬性) && 陽列.find((陽屬性) => 被剋 === 陽屬性);
  }
}
