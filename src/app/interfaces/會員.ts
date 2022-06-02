import { Moment } from 'moment';
import { 性別, 會員欄位 } from 'src/app/enums/會員.enum';
import { v4 as uuidv4 } from 'uuid';

export class Member {
  [會員欄位.ID]: string;
  [會員欄位.Name]: string;
  [會員欄位.FacebookAccount]: string;
  [會員欄位.DateOfBirth]: string;
  [會員欄位.Gender]: 性別;
  [會員欄位.CreateTime]: string;
  [會員欄位.HandSize]: string;
  [會員欄位.FortunetellingType]: string;
  [會員欄位.AtYear]: number;
  [會員欄位.Job]: string;
  [會員欄位.HasCondition]: boolean;
  [會員欄位.CrystalStyle]: string;
  [會員欄位.Comment]: string;
  [會員欄位.Completed]: boolean;

  constructor(data: Member) {
    this.id = data?.id || uuidv4();
    this.name = data.name;
    this.facebookAccount = data.facebookAccount;
    this.dob = this.convertISOString(data.dob);
    this.gender = data.gender;
    this.completed = false;
    this.comment = data?.comment || '';
    this.createTime = new Date().toISOString();
    this.handSize = data.handSize || '';
    this.fortunetellingType = data.fortunetellingType;
    this.atYear = data.atYear || new Date().getFullYear();
    this.job = data.job || '';
    this.crystalStyle = data.crystalStyle;
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
