import { 五行相刻對照表, 五行相生對照表, 五行轉換, 陰列 } from 'src/app/constants/constants';
import { 五行 } from 'src/app/enums/五行.enum';
import { 流月 } from 'src/app/interfaces/流年';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';

const REGEX = /([陽陰]:\s)|\s\([金木水火土]\)/g;

export class 命盤 {
  year: number;
  myFateSet: { gan: 天干[]; zhi: 地支[] };
  horoscopeResult: { gan: 命盤結果; zhi: 命盤結果 };
  bigFortune: { gan: 天干; zhi: 地支 };
  yearFortune: { gan: 天干; zhi: 地支 };
  monthFortune: 流月[];
  badPropertyMapping: BadProperty;
  mainGanFate: 天干;
  badPropertyList: { key: string, badProperty: string }[] = [];
  chineseZodiac: string[] = [];

  constructor(data: {
    year: number;
    myFateSet: { gan: 天干[]; zhi: 地支[] };
    bigFortune: { gan: 天干; zhi: 地支 };
    yearFortune: { gan: 天干; zhi: 地支 };
    monthFortune: 流月[];
    chineseZodiac: string[];
  }) {
    this.year = data.year;
    this.myFateSet = data.myFateSet;
    this.bigFortune = data.bigFortune;
    this.yearFortune = data.yearFortune;
    this.monthFortune = data.monthFortune;
    this.horoscopeResult = { gan: new 命盤結果(true), zhi: new 命盤結果(false) };
    const { badPropertyMapping, badPropertyList } = this.創造劫數對照表(data.myFateSet.gan[1]);
    this.badPropertyMapping = badPropertyMapping;
    this.badPropertyList = badPropertyList;
    this.mainGanFate = data.myFateSet.gan[1];
    this.chineseZodiac = data.chineseZodiac;
  }

  private 創造劫數對照表(天干日柱: 天干 | 地支) {
    const badPropertyMapping: BadProperty = {
      [五行.金]: '',
      [五行.木]: '',
      [五行.水]: '',
      [五行.火]: '',
      [五行.土]: '',
    };
    const badPropertyList: { key: 五行, badProperty: string }[] = [];
    const 劫數陣列 = ['比劫', '食傷', '財', '官', '印'];
    let 天干日柱五行 = 五行轉換(天干日柱);
    badPropertyMapping[天干日柱五行] = 劫數陣列[0];
    badPropertyList.push({ key: 天干日柱五行, badProperty: 劫數陣列[0] });

    for (let i = 1; i < 劫數陣列.length; i++) {
      天干日柱五行 = 五行相生對照表.get(天干日柱五行)!;
      badPropertyMapping[天干日柱五行] = 劫數陣列[i];
      badPropertyList.push({ key: 天干日柱五行, badProperty: 劫數陣列[i] });
    }
    return { badPropertyMapping, badPropertyList };
  }
}

export interface 已作用 {
  match: boolean;
  anti: boolean;
  cut: boolean;
}

export class 命盤作用 {
  [命盤結果屬性.time]: 已作用;
  [命盤結果屬性.day]: 已作用;
  [命盤結果屬性.month]: 已作用;
  [命盤結果屬性.year]: 已作用;
  [命盤結果屬性.bigFortune]: 已作用;
  [命盤結果屬性.yearFortune]: 已作用;
  [命盤結果屬性.monthFortune]: 已作用;

  constructor() {
    const init: 已作用 = {
      match: false,
      anti: false,
      cut: false,
    };
    this.time = JSON.parse(JSON.stringify(init));
    this.day = JSON.parse(JSON.stringify(init));
    this.month = JSON.parse(JSON.stringify(init));
    this.year = JSON.parse(JSON.stringify(init));
    this.bigFortune = JSON.parse(JSON.stringify(init));
    this.yearFortune = JSON.parse(JSON.stringify(init));
    this.monthFortune = JSON.parse(JSON.stringify(init));
  }
}

export class 命盤結果 {
  reaction: 命盤作用;

  scores: string[] = [];

  yanScore: string = '';
  noHintYanScore: string = '';

  yinYanScore: string = '';
  noHintYinYanScore: string = '';

  chineseDayRestriction: boolean = false;

  antiWuHinCount: { [key: 五行 | string]: number } = {
    ['日主受剋']: 0,
    [五行.金]: 0,
    [五行.木]: 0,
    [五行.水]: 0,
    [五行.火]: 0,
    [五行.土]: 0,
  }

  private 陽流通: 五行結果[] = [];

  private 陰陽流通: 五行結果[] = [];

  private 是否為天干: boolean;

  constructor(是否為天干 = false) {
    this.reaction = new 命盤作用();
    this.是否為天干 = 是否為天干;
  }

  getYinYanNoHintScore(score: string) {
    return score.replace(REGEX, '');
  }

  新增大運流年相剋評分(被剋對象: 天干 | 地支, 大運剋流年: boolean) {
    const 大運流年五行 = 五行轉換(被剋對象);
    this.scores.push(大運剋流年 ? '大運剋流年' : '流年剋大運');
    this.antiWuHinCount[大運流年五行]++;
  }

  新增流年流月相剋評分(被剋對象: 天干 | 地支, 流年剋流月: boolean) {
    const 流年流月五行 = 五行轉換(被剋對象);
    this.scores.push(流年剋流月 ? '流年剋流月' : '流月剋流年');
    this.antiWuHinCount[流年流月五行]++;
  }

  計算日柱受剋(天干日柱: 天干 | null) {
    if (!天干日柱) {
      return;
    }

    const 天干日柱五行 = 五行轉換(天干日柱);

    // 地支: 只要流通後的結果有剋到地支日柱就算日主受剋
    if (!this.是否為天干) {
      this.antiWuHinCount['日主受剋'] = this.antiWuHinCount[天干日柱五行];
      return;
    }

    if (this.是否為天干 && this.計算天干日主受剋(天干日柱)) {
      this.antiWuHinCount['日主受剋']++;
    }
  }

  先批陽(五行結果: 五行結果[]) {
    const { 新五行結果, 評分結果 } = this.批陽批陰先生後剋(五行結果);
    this.yanScore = 評分結果;
    this.noHintYanScore = this.getYinYanNoHintScore(評分結果);
    this.陽流通 = JSON.parse(JSON.stringify(新五行結果));
    return 新五行結果;
  }

  再流通(五行結果: 五行結果[]) {
    const { 新五行結果, 評分結果 } = this.批陽批陰先生後剋(五行結果);
    this.yinYanScore = 評分結果;
    this.noHintYinYanScore = this.getYinYanNoHintScore(評分結果);
    this.陰陽流通 = JSON.parse(JSON.stringify(新五行結果));
    return 新五行結果;
  }

  計算最後評分分數(mapping: BadProperty | null, mainGanFate: 天干 | null, liuYueResult?: { [key: string]: number }) {
    if (!mapping || !mainGanFate) {
      throw new Error('天干日主為空');
    }

    const pushScore = (key: string, value: number, extraText = '') => {
      if (key === '日主受剋') {
        this.scores.push(`${extraText}日主受剋`);
      } else {
        const antiText = this.剋五行轉換器(key, value); // 雙剋土..etc
        const badPropertyText = this.badProperty(key as 五行, mapping, mainGanFate, extraText);
        this.scores.push(`${antiText}${badPropertyText}`);
      }
    }

    for (const [key, value] of Object.entries(this.antiWuHinCount)) {
      if (liuYueResult) {
        if (liuYueResult[key] > 0 && value === 0) {
          pushScore(key, value, '無');
          continue;
        }

        if (liuYueResult[key] > value && value > 0) {
          pushScore(key, value, '減輕');
          continue;
        }

        if (liuYueResult[key] < value && liuYueResult[key] > 0) {
          pushScore(key, value, '加重');
          continue;
        }
      }

      if (value > 0) {
        pushScore(key, value);
      }
    }
  }

  private 批陽批陰先生後剋(五行結果: 五行結果[]): { 新五行結果: 五行結果[]; 評分結果: string } {
    if (!五行結果.length) {
      return { 新五行結果: [], 評分結果: '' };
    }

    let 評分結果 = '';
    const 新五行結果: 五行結果[] = JSON.parse(JSON.stringify(五行結果));
    const lastIndex = 新五行結果.length - 1;

    const 文字轉換 = (current: 五行結果) => {
      const 陽陣文字 = `${current.陽陣.length ? `[陽: ${current.陽陣.join(',')}] ` : ''}`;
      const 陰陣文字 = `${current.陰陣.length ? `[陰: ${current.陰陣.join(',')}] ` : ''}`;
      const 五行文字 = `(${current.五行})`;
      return `${陽陣文字}${陰陣文字}${五行文字}`;
    };

    for (let i = 0; i < 新五行結果.length; i++) {
      const current = 新五行結果[i];
      const text = 文字轉換(current);

      if (current.生剋 === '生') {
        評分結果 = i === 0 ? text : `${評分結果} 生 ${text}`;
      }
    }

    if (新五行結果.length >= 2 && 新五行結果[lastIndex].生剋 === '剋') {
      評分結果 = `${評分結果} 剋 ${文字轉換(新五行結果[lastIndex])}`;

      let 陽剋人力量 = 新五行結果[lastIndex - 1].陽力;
      let 陰剋人力量 = 新五行結果[lastIndex - 1].陰力;
      let 陽被剋力量 = 新五行結果[lastIndex].陽力;
      let 陰被剋力量 = 新五行結果[lastIndex].陰力;
      const 被剋有陽能救 = 新五行結果[lastIndex].陽陣.length;

      const 陽剋人減一 = () => {
        陽剋人力量--;
        新五行結果[lastIndex - 1].陽力--;
      };
      const 陰剋人減一 = () => {
        陰剋人力量--;
        新五行結果[lastIndex - 1].陰力--;
      };
      const 陽被剋減一 = () => {
        陽被剋力量--;
        新五行結果[lastIndex].陽力--;
        新五行結果[lastIndex].陽陣.shift();
      };
      const 陰被剋減一 = () => {
        陰被剋力量--;
        新五行結果[lastIndex].陰力--;
        新五行結果[lastIndex].陰陣.shift();
      };

      while (陽剋人力量 > 0 && 陽被剋力量 + 陰被剋力量 > 0) {
        const 剋五行 = 新五行結果[lastIndex].五行;
        this.antiWuHinCount[剋五行]++;
        陽剋人減一();
        if (陽被剋力量 > 0) {
          陽被剋減一();
        } else {
          陰被剋減一();
        }
      }

      while (陰剋人力量 > 0 && 陰被剋力量 > 0 && !被剋有陽能救) {
        const 剋五行 = 新五行結果[lastIndex].五行;
        this.antiWuHinCount[剋五行]++;
        陰剋人減一();
        陰被剋減一();
      }

      const 被剋總和力量 = 陽被剋力量 + 陰被剋力量;

      // 直接拿掉被剋的結果
      if (被剋總和力量 === 0) {
        新五行結果.splice(新五行結果.length - 1, 1);
      }
    }

    return { 新五行結果, 評分結果 };
  }


  private 剋五行轉換器(key: string, value: number) {
    switch (value) {
      case 1:
        return `剋${key} `;
      case 2:
        return `雙剋${key} `;
      case 3:
        return `參剋${key} `;
      case 4:
        return `肆剋${key} `;
      case 5:
        return `五剋${key} `;
      default:
        return '';
    }
  }

  private 計算天干日主受剋(天干日柱: 天干 | 地支) {
    if (!this.陽流通?.length) {
      return false;
    }

    let 是否日主受剋 = false;

    const 天干日柱五行 = 五行轉換(天干日柱);
    const 最後元素 = this.陽流通[this.陽流通.length - 1];
    const 存在相同陽元素 = this.陽流通.find((value) => value.五行 === 天干日柱五行);
    const 與最前陽元素相生 = 五行相生對照表.get(天干日柱五行) === this.陽流通[0].五行;
    const 與最後陽元素相剋 = 五行相刻對照表.get(this.陽流通[this.陽流通.length - 1].五行) === 天干日柱五行;

    if (!存在相同陽元素 && !與最前陽元素相生 && 與最後陽元素相剋) {
      是否日主受剋 = 最後元素.陽力 > 0;
    }

    if (!this.陰陽流通?.length) {
      return false;
    }

    const 陰陽最後元素 = this.陰陽流通[this.陰陽流通.length - 1];
    const 存在相同陰陽元素 = this.陰陽流通.find((value) => value.五行 === 天干日柱五行);
    const 與最前陰陽元素相生 = 五行相生對照表.get(天干日柱五行) === this.陰陽流通[0].五行;
    const 與最後陰陽元素相剋 = 五行相刻對照表.get(陰陽最後元素.五行) === 天干日柱五行;

    if (!存在相同陰陽元素 && !與最前陰陽元素相生 && 與最後陰陽元素相剋) {
      是否日主受剋 = 陰陽最後元素.陽力 > 0 || (陰陽最後元素.陰力 > 0 && 陰列.includes(天干日柱));
    }

    return 是否日主受剋;
  }

  private badProperty(目標五行: 五行, mapping: BadProperty, 天干日主: 天干, extraText = '') {
    if ((!this.是否為天干 && 目標五行 === 五行轉換(天干日主))) {
      return '';
    }

    return 目標五行 ? `(${extraText}破${mapping[目標五行]})` : '';
  }
}

export interface 五行結果 {
  五行: 五行;
  生剋: '生' | '剋';
  陽陣: (天干 | 地支)[];
  陰陣: (天干 | 地支)[];
  陽力: number;
  陰力: number;
}

export interface 五行陣列 {
  [五行.金]: (天干 | 地支)[];
  [五行.木]: (天干 | 地支)[];
  [五行.水]: (天干 | 地支)[];
  [五行.火]: (天干 | 地支)[];
  [五行.土]: (天干 | 地支)[];
}

export interface 天干命盤 {
  year: number;
  horoscopeResult: 命盤結果;
  myFateSet: 天干[];
  bigFortune: 天干;
  yearFortune: 天干;
  liuYue: 流月[];
}

export interface 地支命盤 {
  year: number;
  horoscopeResult: 命盤結果;
  myFateSet: 地支[];
  bigFortune: 地支;
  yearFortune: 地支;
  liuYue: 流月[];
}

export interface BadProperty {
  [五行.金]: string;
  [五行.木]: string;
  [五行.水]: string;
  [五行.火]: string;
  [五行.土]: string;
}
