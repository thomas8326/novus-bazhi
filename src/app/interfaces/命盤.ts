import { 五行相刻對照表, 五行轉換 } from 'src/app/constants/constants';
import { 五行 } from 'src/app/enums/五行.enum';
import { 流月 } from 'src/app/interfaces/流年';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';

export class 命盤 {
  year: number;
  myFateSet: { gan: 天干[]; zhi: 地支[] };
  horoscopeResult: { gan: 命盤結果; zhi: 命盤結果 };
  bigFortune: { gan: 天干; zhi: 地支 };
  yearFortune: { gan: 天干; zhi: 地支 };
  monthFortune: 流月[];

  constructor(
    year: number,
    myFateSet: { gan: 天干[]; zhi: 地支[] },
    bigFortune: { gan: 天干; zhi: 地支 },
    yearFortune: { gan: 天干; zhi: 地支 },
    monthFortune: 流月[],
  ) {
    this.year = year;
    this.myFateSet = myFateSet;
    this.bigFortune = bigFortune;
    this.yearFortune = yearFortune;
    this.monthFortune = monthFortune;
    this.horoscopeResult = { gan: new 命盤結果(true), zhi: new 命盤結果(false) };
  }
}

export interface 命盤作用 {
  [命盤結果屬性.時住已作用]: boolean;
  [命盤結果屬性.日住已作用]: boolean;
  [命盤結果屬性.月住已作用]: boolean;
  [命盤結果屬性.年住已作用]: boolean;
  [命盤結果屬性.大運已作用]: boolean;
  [命盤結果屬性.大運被剋]?: boolean;
  [命盤結果屬性.流年已作用]: boolean;
  [命盤結果屬性.流年被剋]?: boolean;
  [命盤結果屬性.流年斷氣]?: boolean;
  [命盤結果屬性.流月已作用]?: boolean;
  [命盤結果屬性.流月被剋]?: boolean;
}

export class 命盤結果 {
  reaction: 命盤作用;

  scores: string[] = [];

  yanScore: string = '';

  yinYanScore: string = '';

  chineseDayRestriction: boolean = false;

  private 是否為天干: boolean;

  constructor(是否為天干 = false) {
    this.reaction = {
      時住已作用: false,
      日住已作用: false,
      月住已作用: false,
      年住已作用: false,
      流年已作用: false,
      大運已作用: false,
      流月已作用: false,
      大運被剋: false,
      流年被剋: false,
      流年斷氣: false,
      流月被剋: false,
    };
    this.是否為天干 = 是否為天干;
  }

  新增大運流年相剋評分(被剋對象: 天干 | 地支, 大運剋流年: boolean) {
    const 大運流年五行 = 五行轉換(被剋對象);
    this.scores.push(`${大運剋流年 ? '大運剋流年' : '流年剋大運'} => 剋${大運流年五行}`);
  }

  新增流年流月相剋評分(被剋對象: 天干 | 地支, 流年剋流月: boolean) {
    const 流年流月五行 = 五行轉換(被剋對象);
    this.scores.push(`${流年剋流月 ? '流年剋流月' : '流月剋流年'} => 剋${流年流月五行}`);
  }

  計算日柱受剋(日柱: 天干 | 地支, 五行結果: 五行結果[]) {
    if (!五行結果.length) {
      return;
    }

    const lastElement = 五行結果[五行結果.length - 1];

    // 地支: 只要流通後的結果有剋到地支日柱就算日主受剋
    if (!this.是否為天干) {
      const 地支受剋 = this.scores.filter((score) => score === `剋${五行轉換(日柱)}`);
      if (地支受剋.length > 0) {
        this.scores.push(`地支日主受剋`);
      }
      return;
    }

    if (this.是否為天干 && 五行相刻對照表.get(lastElement.五行) === 五行轉換(日柱)) {
      this.scores.push(`天干日主受剋`);
      return;
    }
  }

  先批陽(五行結果: 五行結果[]) {
    const { 新五行結果, 評分結果 } = this.批陽批陰先生後剋(五行結果);
    this.yanScore = 評分結果;
    return 新五行結果;
  }

  再流通(五行結果: 五行結果[]) {
    const { 新五行結果, 評分結果 } = this.批陽批陰先生後剋(五行結果);
    this.yinYanScore = 評分結果;
    return 新五行結果;
  }

  private 批陽批陰先生後剋(五行結果: 五行結果[]): { 新五行結果: 五行結果[]; 評分結果: string } {
    if (!五行結果.length) {
      return { 新五行結果: [], 評分結果: '' };
    }

    let 評分結果 = '';
    const 新五行結果: 五行結果[] = JSON.parse(JSON.stringify(五行結果));

    const 文字轉換 = (current: 五行結果) => {
      const 陽陣文字 = `${current.陽陣.length ? `[陽: ${current.陽陣.join(',')}] ` : ''}`;
      const 陰陣文字 = `${current.陰陣.length ? `[陰: ${current.陰陣.join(',')}] ` : ''}`;
      const 五行文字 = `(五行: ${current.五行})`;
      return `${陽陣文字}${陰陣文字}${五行文字}`;
    };

    for (let i = 0; i < 新五行結果.length; i++) {
      const current = 新五行結果[i];
      const text = 文字轉換(current);

      if (current.生剋 === '生') {
        評分結果 = i === 0 ? text : `${評分結果} 生 ${text}`;
      }
    }
    const lastIndex = 新五行結果.length - 1;

    if (新五行結果.length >= 2 && 新五行結果[lastIndex].生剋 === '剋') {
      評分結果 = `${評分結果} 剋 ${文字轉換(新五行結果[lastIndex])}`;

      let 陽剋人力量 = 新五行結果[lastIndex - 1].陽陣.length;
      let 陰剋人力量 = 新五行結果[lastIndex - 1].陰陣.length;
      let 陽被剋力量 = 新五行結果[lastIndex].陽陣.length;
      let 陰被剋力量 = 新五行結果[lastIndex].陰陣.length;

      while (陽剋人力量 > 0 && 陽被剋力量 + 陰被剋力量 > 0) {
        this.scores.push(`剋${新五行結果[lastIndex].五行}`);
        陽剋人力量--;
        if (陽被剋力量 > 0) {
          陽被剋力量--;
        } else {
          陰被剋力量--;
        }
      }

      while (陰剋人力量 > 0 && 陰被剋力量 > 0) {
        this.scores.push(`剋${新五行結果[lastIndex].五行}`);
        陰剋人力量--;
        陰被剋力量--;
      }

      const 被剋總和力量 = 陽被剋力量 + 陰被剋力量;

      // 直接拿掉被剋的結果
      if (被剋總和力量 === 0) {
        新五行結果.splice(新五行結果.length - 1, 1);
      } else if (陽被剋力量 > 0 && 陽剋人力量 === 0) {
        // 拿掉陽陣列中的一個值
        const 新五行陽陣 = 新五行結果[lastIndex].陽陣;
        新五行陽陣.splice(新五行陽陣.length - 1, 1);
      } else if (陰被剋力量 > 0 && 陰剋人力量 === 0) {
        // 拿掉陰陣列中的一個值
        const 新五行陰陣 = 新五行結果[lastIndex].陰陣;
        新五行陰陣.splice(新五行陰陣.length - 1, 1);
      }
    }

    return { 新五行結果, 評分結果 };
  }
}

export interface 五行結果 {
  五行: 五行;
  生剋: '生' | '剋';
  陽陣: (天干 | 地支)[];
  陰陣: (天干 | 地支)[];
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
