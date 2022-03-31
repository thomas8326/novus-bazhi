import { 五行 } from 'src/app/enums/五行.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';

export const 天干對照表: Map<string, 天干> = new Map([
  ['甲', 天干.甲],
  ['乙', 天干.乙],
  ['丙', 天干.丙],
  ['丁', 天干.丁],
  ['戊', 天干.戊],
  ['己', 天干.己],
  ['庚', 天干.庚],
  ['辛', 天干.辛],
  ['壬', 天干.壬],
  ['癸', 天干.癸],
]);

export const 地支對照表: Map<string, 地支> = new Map([
  ['子', 地支.子],
  ['丑', 地支.丑],
  ['寅', 地支.寅],
  ['卯', 地支.卯],
  ['辰', 地支.辰],
  ['巳', 地支.巳],
  ['午', 地支.午],
  ['未', 地支.未],
  ['申', 地支.申],
  ['酉', 地支.酉],
  ['戌', 地支.戌],
  ['亥', 地支.亥],
]);

export const 陽列: (天干 | 地支)[] = [
  地支.寅,
  地支.午,
  地支.辰,
  地支.戌,
  地支.申,
  地支.子,
  天干.甲,
  天干.丙,
  天干.戊,
  天干.庚,
  天干.壬,
];

export const 陰列: (天干 | 地支)[] = [
  地支.卯,
  地支.巳,
  地支.丑,
  地支.未,
  地支.酉,
  地支.亥,
  天干.乙,
  天干.丁,
  天干.己,
  天干.辛,
  天干.癸,
];

export const 相合對照表: Map<天干 | 地支, 天干 | 地支> = new Map();
相合對照表.set(天干.甲, 天干.己);
相合對照表.set(天干.乙, 天干.庚);
相合對照表.set(天干.丙, 天干.辛);
相合對照表.set(天干.丁, 天干.壬);
相合對照表.set(天干.戊, 天干.癸);
相合對照表.set(天干.己, 天干.甲);
相合對照表.set(天干.庚, 天干.乙);
相合對照表.set(天干.辛, 天干.丙);
相合對照表.set(天干.壬, 天干.丁);
相合對照表.set(天干.癸, 天干.戊);
相合對照表.set(地支.子, 地支.丑);
相合對照表.set(地支.寅, 地支.亥);
相合對照表.set(地支.卯, 地支.戌);
相合對照表.set(地支.辰, 地支.酉);
相合對照表.set(地支.巳, 地支.申);
相合對照表.set(地支.午, 地支.未);
相合對照表.set(地支.丑, 地支.子);
相合對照表.set(地支.亥, 地支.寅);
相合對照表.set(地支.戌, 地支.卯);
相合對照表.set(地支.酉, 地支.辰);
相合對照表.set(地支.申, 地支.巳);
相合對照表.set(地支.未, 地支.午);

export const 五行相刻對照表: Map<五行, 五行> = new Map();
五行相刻對照表.set(五行.木, 五行.土);
五行相刻對照表.set(五行.土, 五行.水);
五行相刻對照表.set(五行.水, 五行.火);
五行相刻對照表.set(五行.火, 五行.金);
五行相刻對照表.set(五行.金, 五行.木);

export const 五行互救對照表: Map<五行, 五行[]> = new Map();
五行互救對照表.set(五行.木, [五行.水, 五行.火, 五行.木]);
五行互救對照表.set(五行.土, [五行.火, 五行.金, 五行.土]);
五行互救對照表.set(五行.水, [五行.金, 五行.木, 五行.水]);
五行互救對照表.set(五行.火, [五行.木, 五行.土, 五行.火]);
五行互救對照表.set(五行.金, [五行.土, 五行.水, 五行.金]);

export const 五行相生對照表: Map<五行, 五行> = new Map();
五行相生對照表.set(五行.木, 五行.火);
五行相生對照表.set(五行.火, 五行.土);
五行相生對照表.set(五行.土, 五行.金);
五行相生對照表.set(五行.金, 五行.水);
五行相生對照表.set(五行.水, 五行.木);

export const 五行轉換 = (天干地支: 天干 | 地支) => {
  switch (天干地支) {
    case 天干.甲:
    case 天干.乙:
    case 地支.寅:
    case 地支.卯:
      return 五行.木;
    case 天干.丙:
    case 天干.丁:
    case 地支.午:
    case 地支.巳:
      return 五行.火;
    case 天干.戊:
    case 天干.己:
    case 地支.辰:
    case 地支.戌:
    case 地支.丑:
    case 地支.未:
      return 五行.土;
    case 天干.庚:
    case 天干.辛:
    case 地支.申:
    case 地支.酉:
      return 五行.金;
    case 天干.壬:
    case 天干.癸:
    case 地支.子:
    case 地支.亥:
      return 五行.水;
  }
};
