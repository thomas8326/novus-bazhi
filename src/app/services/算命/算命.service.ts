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
import { 五行結果, 命盤, 命盤結果, 地支命盤, 天干命盤, 已作用 } from 'src/app/interfaces/命盤';

@Injectable({
  providedIn: 'root',
})
export class 算命服務器 {
  private 是否為天干: boolean = false;
  private 天干日柱: 天干 | null = null;
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
        this.天干日柱 = 暫存天干命盤.myFateSet[1];
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
      horoscopeResult.reaction.bigFortune.match = true;
      horoscopeResult.reaction.yearFortune.match = true;
      this.大運流年流月消相同本命(horoscopeResult, myFateSet, { bigFortune, yearFortune });
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
        horoscopeResult.reaction.yearFortune.anti = true;
        horoscopeResult.新增大運流年相剋評分(yearFortune, true);
        this.大運流年流月消相同本命(horoscopeResult, myFateSet, { yearFortune }, true);
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
        horoscopeResult.reaction.bigFortune.anti = true;
        horoscopeResult.新增大運流年相剋評分(bigFortune, false);
        this.大運流年流月消相同本命(horoscopeResult, myFateSet, { bigFortune }, true);
      }
    } else {
      this.本命互相合(horoscopeResult, myFateSet);
      const { 已作用集 } = this.大運流年流月與本命作用(horoscopeResult, myFateSet, { bigFortune, yearFortune });
      this.本命互相合(horoscopeResult, myFateSet, 已作用集);
    }
    this.流通(horoscopeResult, myFateSet, { bigFortune, yearFortune });
    horoscopeResult.計算日柱受剋(this.天干日柱);
    this.計算流月(對象命盤);
  }

  //'辛', '戊', '壬', '丙' "壬" 戊
  private 流通(
    horoscopeResult: 命盤結果,
    myFateSet: (天干 | 地支)[],
    data: { bigFortune?: 天干 | 地支; yearFortune?: 天干 | 地支; liuYue?: 天干 | 地支 },
  ) {
    const { 陽, 陰 } = this.先分陰陽(horoscopeResult, myFateSet, data);
    const 陽流通陣列 = this.陰或陽五行流通(陽);
    const { 陽結果, 新陰 } = this.陽剋陰(陽流通陣列, 陰);

    const 批陽結果 = horoscopeResult.先批陽(陽結果);

    const 流通陣列 = this.五行結果流通(批陽結果, 新陰!);

    return horoscopeResult.再流通(流通陣列);
  }

  // TODO: update return name
  private 大運流年流月與本命作用(
    result: 命盤結果,
    myFateSet: (天干 | 地支)[],
    data: { bigFortune?: 天干 | 地支; yearFortune?: 天干 | 地支; liuYue?: 天干 | 地支 },
    canHelp = { bigFortune: true, yearFortune: true },
  ) {
    let 大運已作用 = this.是否已作用(result.reaction.bigFortune);
    let 流年已作用 = this.是否已作用(result.reaction.yearFortune);
    let 流月已作用 = this.是否已作用(result.reaction.monthFortune);
    const 已作用集 = new Set<天干 | 地支>();

    if (!Object.keys(data).length) {
      return { 大運已作用, 流年已作用, 流月已作用, 已作用集 };
    }

    // 剩餘本命與大運流年流月作用
    for (let i = 0; i < myFateSet.length; i++) {
      const 本命已合 = this.是否已作用(result.reaction[this.年月日時住轉換(i)]);

      if (this.是否為天干日住(i) || 本命已合) {
        continue;
      }

      const 大運本命可以合 = !大運已作用 && this.是否相合(myFateSet[i], data.bigFortune);
      if (canHelp?.bigFortune && data.bigFortune && 大運本命可以合) {
        result.reaction[this.年月日時住轉換(i)].match = true;
        result.reaction.bigFortune.match = true;
        已作用集.add(data.bigFortune);
        大運已作用 = true;
      }

      const 流年本命可以合 = !流年已作用 && this.是否相合(myFateSet[i], data.yearFortune);
      if (canHelp?.yearFortune && data.yearFortune && 流年本命可以合) {
        result.reaction[this.年月日時住轉換(i)].match = true;
        result.reaction.yearFortune.match = true;
        已作用集.add(data.yearFortune);
        流年已作用 = true;
      }

      if (data.liuYue && !流月已作用 && this.是否相合(myFateSet[i], data.liuYue)) {
        result.reaction[this.年月日時住轉換(i)].match = true;
        result.reaction.monthFortune.match = true;
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
      const 當前已作用 = this.是否已作用(result.reaction[this.年月日時住轉換(i)]);

      if (this.是否為天干日住(i) || 當前已作用) {
        continue;
      }

      if (已作用集?.has(myFateSet[i])) {
        result.reaction[this.年月日時住轉換(i)].match = true;
        continue;
      }

      if (prevIndexStack.length === 0) {
        prevIndexStack.push(i);
        continue;
      }

      const prevIndex = prevIndexStack[prevIndexStack.length - 1];
      const 前一個還沒作用 = !this.是否已作用(result.reaction[this.年月日時住轉換(prevIndex)]);
      if (前一個還沒作用 && this.是否相合(myFateSet[i], myFateSet[prevIndex])) {
        result.reaction[this.年月日時住轉換(i)].match = true;
        result.reaction[this.年月日時住轉換(prevIndex)].match = true;
        prevIndexStack.pop();
      } else {
        prevIndexStack.push(i);
      }
    }
    return prevIndexStack;
  }

  private 計算流月(對象命盤: 天干命盤 | 地支命盤) {
    const { bigFortune, yearFortune, myFateSet, horoscopeResult } = 對象命盤;
    this.是否斷氣 = false;
    for (let liuYue of 對象命盤.liuYue) {
      const liuYueGanZhi = this.是否為天干 ? liuYue.gan : liuYue.zhi;
      const liuYueGanZhiResult = this.是否為天干 ? liuYue.ganResult : liuYue.zhiResult;
      this.計算流月天干地支(horoscopeResult, liuYueGanZhiResult, myFateSet, bigFortune, yearFortune, liuYueGanZhi);
    }
  }

  private 計算流月天干地支(
    parentResult: 命盤結果,
    result: 命盤結果,
    myFateSet: (天干 | 地支)[],
    bigFortune: 天干 | 地支,
    yearFortune: 天干 | 地支,
    liuYueGanZhi: 天干 | 地支,
  ) {
    let 消刻 = false;

    // 當流月流年相同時，斷氣結束並且無作用返回
    if (this.是否斷氣 && yearFortune === liuYueGanZhi) {
      this.是否斷氣 = false;
      return;
    }

    // 斷氣 => 流月大運本命相合
    // 流年流月相合 & 流月剋流年 => 大運+本命
    // 大運流年相合 => 流月+本命
    const createData = () => {
      const 流年流月合 = this.流年流月相合(result, yearFortune, liuYueGanZhi);
      const 流月剋流年 = this.流月剋流年(result, liuYueGanZhi, yearFortune);
      const 流年剋流月 = this.流年剋流月(result, yearFortune, liuYueGanZhi);
      const 大運流年合 = parentResult.reaction.bigFortune.match && parentResult.reaction.yearFortune.match;
      if (this.是否斷氣) {
        result.reaction.yearFortune.cut = true;
        return { 大運流年流月: { bigFortune, liuYue: liuYueGanZhi }, 被消: {} };
      }
      if (流年流月合) {
        if (bigFortune === yearFortune || bigFortune === liuYueGanZhi) result.reaction.bigFortune.match = true;
        result.reaction.yearFortune.match = true;
        result.reaction.monthFortune.match = true;
        return { 大運流年流月: { bigFortune }, 被消: { yearFortune, liuYue: liuYueGanZhi } };
      }
      if (流月剋流年) {
        if (bigFortune === yearFortune) result.reaction.bigFortune.anti = true;
        result.reaction.yearFortune.anti = true;
        result.新增流年流月相剋評分(yearFortune, false);
        this.是否斷氣 = this.是否為天干; // 只有天干會斷氣
        消刻 = true;
        return { 大運流年流月: { bigFortune }, 被消: { yearFortune } };
      }
      if (流年剋流月) {
        if (bigFortune === liuYueGanZhi) result.reaction.bigFortune.anti = true;
        result.reaction.monthFortune.anti = true;
        result.新增流年流月相剋評分(liuYueGanZhi, false);
        消刻 = true;

        if (this.大運流年相合(result, bigFortune, yearFortune)) {
          result.reaction.bigFortune.match = true;
          result.reaction.yearFortune.match = true;
          this.大運流年流月消相同本命(result, myFateSet, { bigFortune, yearFortune });
        }
        return { 大運流年流月: { bigFortune, yearFortune }, 被消: { liuYue: liuYueGanZhi } };
      }
      if (大運流年合) {
        if (liuYueGanZhi === bigFortune || liuYueGanZhi === yearFortune) result.reaction.monthFortune.match = true;
        result.reaction = JSON.parse(JSON.stringify(parentResult.reaction));
        return { 大運流年流月: { liuYue: liuYueGanZhi }, 被消: {} };
      }

      return null;
    };
    const data = createData();

    if (data) {
      this.大運流年流月消相同本命(result, myFateSet, data.被消, 消刻);
      this.本命互相合(result, myFateSet);
      const { 已作用集 } = this.大運流年流月與本命作用(result, myFateSet, data.大運流年流月);
      this.本命互相合(result, myFateSet, 已作用集);
      this.流通(result, myFateSet, data.大運流年流月);
      result.計算日柱受剋(this.天干日柱);
    }
  }

  private 陰或陽五行流通(天干地支: (天干 | 地支)[], 是否為陽 = true) {
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
  private 五行結果流通(五行結果表: 五行結果[], 陰: (天干 | 地支)[]) {
    if (!陰.length) {
      return 五行結果表;
    }

    const 陰流通陣列 = this.陰或陽五行流通(陰, false);
    const data =
      五行結果表.length > 陰流通陣列.length
        ? { primary: 五行結果表, secondary: 陰流通陣列 }
        : { primary: 陰流通陣列, secondary: 五行結果表 };

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

    const lastElement = 陽結果[陽結果.length - 1];
    const 新陰陣列: (天干 | 地支)[] = [];

    if (lastElement.生剋 === '生') {
      const 最後元素相剋五行 = 五行相刻對照表.get(lastElement.五行);
      const 五行陰結果: 五行結果 = { 五行: 最後元素相剋五行!, 生剋: '剋', 陽陣: [], 陽力: 0, 陰陣: [], 陰力: 0 };
      for (let i = 0; i < 陰.length; i++) {
        if (最後元素相剋五行 === 五行轉換(陰[i]) && lastElement.陽力 > 五行陰結果.陰力) {
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

  private 大運流年相合(result: 命盤結果, yearFortune: 天干 | 地支, bigFortune: 天干 | 地支): boolean {
    return !result.reaction.bigFortune.match && !result.reaction.bigFortune.match && this.是否相合(bigFortune, yearFortune);
  }

  private 流年流月相合(result: 命盤結果, yearFortune: 天干 | 地支, liuYueGanZhi: 天干 | 地支) {
    return !result.reaction.monthFortune.match && !result.reaction.yearFortune.match && this.是否相合(yearFortune, liuYueGanZhi);
  }

  private 流年剋大運(horoscopeResult: 命盤結果, bigFortune: 天干 | 地支, yearFortune: 天干 | 地支) {
    return !horoscopeResult.reaction.bigFortune.anti && this.是否相刻(yearFortune, bigFortune);
  }

  private 大運剋流年(horoscopeResult: 命盤結果, bigFortune: 天干 | 地支, yearFortune: 天干 | 地支) {
    return !horoscopeResult.reaction.yearFortune.anti && this.是否相刻(bigFortune, yearFortune);
  }

  private 流年剋流月(horoscopeResult: 命盤結果, yearFortune: 天干 | 地支, liuYue: 天干 | 地支) {
    return !horoscopeResult.reaction.monthFortune.anti && this.是否相刻(yearFortune, liuYue);
  }

  private 流月剋流年(horoscopeResult: 命盤結果, liuYue: 天干 | 地支, yearFortune: 天干 | 地支) {
    return !horoscopeResult.reaction.yearFortune.anti && this.是否相刻(liuYue, yearFortune);
  }

  private 大運流年相剋找人救(
    horoscopeResult: 命盤結果,
    myFateSet: (天干 | 地支)[],
    bigFortune: 天干 | 地支,
    yearFortune: 天干 | 地支,
  ) {
    for (let i = 0; i < myFateSet.length; i++) {
      const 元素已作用 = this.是否已作用(horoscopeResult.reaction[this.年月日時住轉換(i)]);
      if (this.是否為天干日住(i) || 元素已作用) {
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
    被消資料: { bigFortune?: 天干 | 地支; yearFortune?: 天干 | 地支; liuYue?: 天干 | 地支 },
    是否消剋 = false,
  ) {
    for (let i = 0; i < myFateSet.length; i++) {
      if (this.是否為天干日住(i) || this.是否已作用(result.reaction[this.年月日時住轉換(i)])) {
        // 日住不作用
        continue;
      }

      if (myFateSet[i] === 被消資料.bigFortune || myFateSet[i] === 被消資料.yearFortune || myFateSet[i] === 被消資料.liuYue) {
        if (是否消剋) {
          result.reaction[this.年月日時住轉換(i)].anti = true;
        } else {
          result.reaction[this.年月日時住轉換(i)].match = true;
        }
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

  private 是否為天干日住(index: number) {
    return this.是否為天干 && index === 1;
  }

  private 是否陰作用陽(目標: 天干 | 地支, 被剋: 天干 | 地支) {
    return 陰列.find((陰屬性) => 目標 === 陰屬性) && 陽列.find((陽屬性) => 被剋 === 陽屬性);
  }

  private 是否已作用(作用: 已作用) {
    return 作用.match || 作用.anti || 作用.cut;
  }
}
