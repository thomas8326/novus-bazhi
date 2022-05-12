import { 性別, 會員欄位 } from 'src/app/enums/會員.enum';
import { v4 as uuidv4 } from 'uuid';

export class Member {
  [會員欄位.ID]: string;
  [會員欄位.Name]: string;
  [會員欄位.DateOfBirth]: string;
  [會員欄位.Gender]: 性別;
  [會員欄位.Completed]: boolean;
  [會員欄位.Comment]: string;

  constructor(data: { id?: string; name: string; dob: string; gender: 性別 }) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.dob = data.dob;
    this.gender = data.gender;
  }

  isMale(): boolean {
    return this.gender === 性別.Male;
  }

  getDobDate() {
    return new Date(this.dob);
  }
}
