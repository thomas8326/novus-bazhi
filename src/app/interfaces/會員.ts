import { 性別, 會員欄位 } from 'src/app/enums/會員.enum';
import { v4 as uuidv4 } from 'uuid';

export class Member {
  [會員欄位.UID]: string;
  [會員欄位.Name]: string;
  [會員欄位.DateOfBirth]: string;
  [會員欄位.Gender]: 性別;

  constructor(data: { name: string; dob: string; gender: 性別 }) {
    this.uid = uuidv4();
    this.name = data.name;
    this.dob = data.dob;
    this.gender = data.gender;
  }
}
