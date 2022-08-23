import { 命盤結果屬性 } from "src/app/enums/命盤.enum";

export function 年月日時住轉換(i: number) {
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

export function 命盤結果屬性轉換(i: 命盤結果屬性) {
    switch (i) {
        case 命盤結果屬性.time:
            return 0;
        case
            命盤結果屬性.day:
            return 1;
        case
            命盤結果屬性.month:
            return 2;
        case
            命盤結果屬性.year:
            return 3;
        default:
            throw new Error('輸入錯誤的值');
    }
}

