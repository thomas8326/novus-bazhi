import { 五行轉換 } from 'src/app/constants/constants';
import { 五行 } from 'src/app/enums/五行.enum';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';

export interface 命盤 {
  天干: 天干命盤[];
  地支: 地支命盤[];
}

export interface 命盤作用 {
  [命盤結果屬性.時住已作用]: boolean;

  [命盤結果屬性.日住已作用]: boolean;

  [命盤結果屬性.月住已作用]: boolean;

  [命盤結果屬性.年住已作用]: boolean;

  [命盤結果屬性.大運已作用]: boolean;

  [命盤結果屬性.流年已作用]: boolean;
}

export class 命盤結果 {
  作用: 命盤作用;

  評分: string[] = [];

  剋五行: string[] = [];

  批陽: 五行結果[] = [];

  流通: 五行結果[] = [];

  日柱受剋: boolean = false;

  constructor() {
    this.作用 = {
      時住已作用: false,
      日住已作用: false,
      月住已作用: false,
      年住已作用: false,
      流年已作用: false,
      大運已作用: false,
    };
  }

  新增大運流年相剋評分(被剋對象: 天干 | 地支, 大運剋流年: boolean) {
    const 大運流年五行 = 五行轉換(被剋對象);
    this.剋五行.push(大運流年五行);
    this.評分.push(`${大運剋流年 ? '大運剋流年' : '流年剋大運'} => 剋${大運流年五行}`);
  }

  新增日柱受剋() {
    this.評分.push(`日主受剋`);
    this.日柱受剋 = true;
  }

  先批陽(五行結果: 五行結果[]) {
    this.批陽 = 五行結果;
    return this.批陽批陰先生後剋(五行結果);
  }

  再流通(五行結果: 五行結果[]) {
    this.流通 = 五行結果;
    return this.批陽批陰先生後剋(五行結果);
  }

  private 批陽批陰先生後剋(五行結果: 五行結果[]) {
    if (!五行結果.length) {
      return [];
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
        評分結果 = i === 0 ? text : `${評分結果} <生>=> ${text}`;
      }
    }
    const lastIndex = 新五行結果.length - 1;

    if (新五行結果.length >= 2 && 新五行結果[lastIndex].生剋 === '剋') {
      評分結果 = `${評分結果} <剋>=> ${文字轉換(新五行結果[lastIndex])}`;

      let 陽剋人力量 = 新五行結果[lastIndex - 1].陽陣.length;
      let 陰剋人力量 = 新五行結果[lastIndex - 1].陰陣.length;
      let 陽被剋力量 = 新五行結果[lastIndex].陽陣.length;
      let 陰被剋力量 = 新五行結果[lastIndex].陰陣.length;

      while (陽剋人力量 > 0 && 陽被剋力量 + 陰被剋力量 > 0) {
        this.剋五行.push(新五行結果[lastIndex].五行);
        陽剋人力量--;
        if (陽被剋力量 > 0) {
          陽被剋力量--;
        } else {
          陰被剋力量--;
        }
      }

      while (陰剋人力量 > 0 && 陰被剋力量 > 0) {
        this.剋五行.push(新五行結果[lastIndex].五行);
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

    this.評分.push(評分結果);

    return 新五行結果;
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
  命盤結果: 命盤結果;
  本命: 天干[];
  大運: 天干;
  流年: 天干;
}

export interface 地支命盤 {
  year: number;
  命盤結果: 命盤結果;
  本命: 地支[];
  大運: 地支;
  流年: 地支;
}
