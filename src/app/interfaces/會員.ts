import { 性別, 會員欄位 } from 'src/app/enums/會員.enum';
import { 命盤 } from 'src/app/interfaces/命盤';
import { v4 as uuidv4 } from 'uuid';

export class Member {
  [會員欄位.ID]: string;
  [會員欄位.Name]: string;
  [會員欄位.DateOfBirth]: string;
  [會員欄位.Gender]: 性別;
  [會員欄位.Horoscope]: 命盤;

  constructor(data: { name: string; dob: string; gender: 性別 }) {
    this.id = uuidv4();
    this.name = data.name;
    this.dob = data.dob;
    this.gender = data.gender;
    this.horoscope = { 天干: [], 地支: [] };
  }

  isMale(): boolean {
    return this.gender === 性別.Male;
  }

  getDobDate() {
    return new Date(this.dob);
  }

  setHoroscope(data: 命盤) {
    this.horoscope = data;
  }
}
