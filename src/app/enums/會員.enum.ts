export enum 會員欄位 {
  ID = 'id',
  Name = 'name',
  FacebookAccount = 'facebookAccount',
  Gender = 'gender',
  DateOfBirth = 'dob',
  HandSize = 'handSize',
  FortunetellingType = 'fortunetellingType',
  AtYear = 'atYear',
  Job = 'job',
  HasCondition = 'hasCondition',
  CrystalStyle = 'crystalStyle',
  Horoscope = 'horoscope',
  Completed = 'completed',
  Comment = 'comment',
  CreateTime = 'createTime',
  Phone = 'phone',
  GoldenInRing = 'goldenInRing',
}

export enum ExcelColumn {
  Name = '姓名(真實姓名)',
  FacebookAccount = '臉書名稱',
  Gender = '性別',
  DateOfBirth = '生辰年,月,日,時(統一國曆)',
  HandSize = '手圍',
  FortunetellingType = '選擇精批或詳批',
  AtYear = '選擇批算哪一年的運程',
  Job = '請問您的『工作職業』以及『是否有狀況』要跟Novus說',
  CrystalStyle = '選擇的『隔珠』款式',
  GoldenInRing = '贈送的金飾是否要穿在手鍊上'
}

export enum 性別 {
  Male = '男',
  Female = '女',
}

export enum FortunetellingType {
  detail = '詳批',
  meticulous = '精批',
}
