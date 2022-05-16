import { Moment } from 'moment';
import { 性別, 會員欄位 } from 'src/app/enums/會員.enum';
import { v4 as uuidv4 } from 'uuid';

export class Member {
  [會員欄位.ID]: string;
  [會員欄位.Name]: string;
  [會員欄位.Phone]: string;
  [會員欄位.DateOfBirth]: string;
  [會員欄位.Gender]: 性別;
  [會員欄位.Completed]: boolean;
  [會員欄位.Comment]: string;
  [會員欄位.CreateTime]: string;

  constructor(data: { id?: string; name: string; dob: string | Moment; gender: 性別; comment: string; phone: string }) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.phone = data.phone;
    this.dob = this.convertISOString(data.dob);
    this.gender = data.gender;
    this.completed = false;
    this.comment = data.comment || '';
    this.createTime = new Date().toISOString();
  }

  isMale(): boolean {
    return this.gender === 性別.Male;
  }

  getDobDate() {
    return new Date(this.dob);
  }

  convertISOString(dob: string | Moment): string {
    if (typeof dob === 'string') {
      return dob;
    }

    return dob.toISOString();
  }
}
