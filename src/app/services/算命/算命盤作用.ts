import { 五行互救對照表, 五行相刻對照表, 五行轉換, 相合對照表, 陰列, 陽列 } from 'src/app/constants/constants';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';
import { 地支命盤, 天干命盤 } from 'src/app/interfaces/命盤';
import { 年月日時住轉換 } from 'src/app/utilties/utilties';

export class 算命盤作用 {
    命盤: 天干命盤 | 地支命盤;
    是否為天干: boolean;
    private 作用狀態 = false;

    constructor(命盤: 天干命盤 | 地支命盤, 是否為天干 = false) {
        this.命盤 = 命盤;
        this.是否為天干 = 是否為天干;
    }

    大運流年相合() {
        if (
            this.屬性尚未作用(命盤結果屬性.bigFortune) &&
            this.屬性尚未作用(命盤結果屬性.yearFortune) &&
            this.尚未作用() &&
            this.是否相合(this.命盤.bigFortune, this.命盤.yearFortune)
        ) {
            this.命盤.horoscopeResult.reaction.bigFortune.match = true;
            this.命盤.horoscopeResult.reaction.yearFortune.match = true;
            this.消相同天干地支([this.命盤.bigFortune, this.命盤.yearFortune]);
            this.本命互相合();
            this.大運流年流月與本命作用();
            this.本命互相合();
            this.作用狀態 = true;
        }
    }

    流年流月相合() {
        if (!this.命盤.monthFortune) {
            return;
        }

        if (
            this.屬性尚未作用(命盤結果屬性.yearFortune) &&
            this.屬性尚未作用(命盤結果屬性.monthFortune) &&
            this.尚未作用() &&
            this.是否相合(this.命盤.yearFortune, this.命盤.monthFortune)
        ) {
            this.命盤.horoscopeResult.reaction.monthFortune.match = true;
            this.命盤.horoscopeResult.reaction.yearFortune.match = true;
            this.消相同天干地支([this.命盤.monthFortune, this.命盤.yearFortune]);
            this.本命互相合();
            this.大運流年流月與本命作用();
            this.本命互相合();
            this.作用狀態 = true;
        }
    }

    大運流月相合() {
        if (!this.命盤.monthFortune) {
            return;
        }

        if (
            this.屬性尚未作用(命盤結果屬性.bigFortune) &&
            this.屬性尚未作用(命盤結果屬性.monthFortune) &&
            this.尚未作用() &&
            this.是否相合(this.命盤.bigFortune, this.命盤.monthFortune)
        ) {
            this.命盤.horoscopeResult.reaction.bigFortune.match = true;
            this.命盤.horoscopeResult.reaction.monthFortune.match = true;
            this.消相同天干地支([this.命盤.bigFortune, this.命盤.monthFortune]);
            this.本命互相合();
            this.大運流年流月與本命作用();
            this.本命互相合();
            this.作用狀態 = true;
        }
    }


    流年剋大運() {
        if (
            this.尚未作用() &&
            this.是否相刻(this.命盤.yearFortune, this.命盤.bigFortune)
        ) {
            this.本命互相合(); // 丙丁辛丁 | 甲庚, 丙辛合完後才看丁能不能救
            this.大運流年流月與本命作用({ 大運: false, 流月: false });
            if (this.屬性尚未作用(命盤結果屬性.bigFortune) &&
                this.屬性尚未作用(命盤結果屬性.yearFortune) &&
                !this.相剋找人救(this.命盤.yearFortune, this.命盤.bigFortune)
            ) {
                this.本命互相合();
                this.命盤.horoscopeResult.reaction.bigFortune.anti = true;
                this.命盤.horoscopeResult.新增相剋評分(this.命盤.bigFortune, '流年剋大運');
                this.消相同天干地支([this.命盤.bigFortune], 'anti');
            } else {
                this.大運流年流月與本命作用({ 流月: false });
                this.本命互相合();
            }
            this.作用狀態 = true;
        }
    }

    大運剋流年() {
        if (
            this.尚未作用() &&
            this.是否相刻(this.命盤.bigFortune, this.命盤.yearFortune)
        ) {
            this.本命互相合(); // 丙丁辛丁 | 甲庚, 丙辛合完後才看丁能不能救
            this.大運流年流月與本命作用({ 流月: false });
            if (this.屬性尚未作用(命盤結果屬性.bigFortune) &&
                this.屬性尚未作用(命盤結果屬性.yearFortune) &&
                !this.相剋找人救(this.命盤.bigFortune, this.命盤.yearFortune)
            ) {
                this.本命互相合();
                this.命盤.horoscopeResult.reaction.yearFortune.anti = true;
                this.命盤.horoscopeResult.新增相剋評分(this.命盤.yearFortune, '大運剋流年');
                this.消相同天干地支([this.命盤.yearFortune], 'anti');
            } else {
                this.大運流年流月與本命作用({ 流月: false });
                this.本命互相合();
            }
            this.作用狀態 = true;
        }
    }

    流年剋流月() {
        if (!this.命盤.monthFortune) {
            return;
        }

        if (
            this.尚未作用() &&
            this.屬性尚未作用(命盤結果屬性.monthFortune) &&
            this.屬性尚未作用(命盤結果屬性.yearFortune) &&
            this.是否相刻(this.命盤.yearFortune, this.命盤.monthFortune)
        ) {
            this.命盤.horoscopeResult.reaction.monthFortune.anti = true;
            this.命盤.horoscopeResult.新增相剋評分(this.命盤.monthFortune, '流年剋流月');
            this.消相同天干地支([this.命盤.monthFortune], 'anti');
            this.大運流年相合();
            this.本命互相合();
            this.大運流年流月與本命作用({ 流月: false });
            this.本命互相合();

            this.作用狀態 = true;
        }
    }

    流月剋流年(設定斷氣: () => void) {
        if (!this.命盤.monthFortune) {
            return;
        }

        if (
            this.尚未作用() &&
            this.屬性尚未作用(命盤結果屬性.monthFortune) &&
            this.屬性尚未作用(命盤結果屬性.yearFortune) &&
            this.是否相刻(this.命盤.monthFortune, this.命盤.yearFortune)
        ) {

            this.命盤.horoscopeResult.reaction.yearFortune.anti = true;
            this.命盤.horoscopeResult.新增相剋評分(this.命盤.yearFortune, '流月剋流年');
            this.消相同天干地支([this.命盤.yearFortune], 'anti');
            this.本命互相合(); // 丙丁辛丁 | 甲庚, 丙辛合完後才看丁能不能救
            this.大運流年流月與本命作用({ 流年: false, 流月: false });
            this.本命互相合();
            設定斷氣();
            this.作用狀態 = true;
        }
    }

    斷氣() {
        if (!this.命盤.monthFortune) {
            return;
        }

        this.命盤.horoscopeResult.reaction.yearFortune.cut = true;
    }

    大運剋流月() {
        if (!this.命盤.monthFortune) {
            return;
        }

        if (
            this.尚未作用() &&
            this.是否相刻(this.命盤.bigFortune, this.命盤.monthFortune)
        ) {
            this.本命互相合(); // 丙丁辛丁 | 甲庚, 丙辛合完後才看丁能不能救
            this.大運流年流月與本命作用({ 流年: false });
            if (this.屬性尚未作用(命盤結果屬性.monthFortune) &&
                this.屬性尚未作用(命盤結果屬性.bigFortune) &&
                !this.相剋找人救(this.命盤.bigFortune, this.命盤.monthFortune)
            ) {
                this.本命互相合();
                this.命盤.horoscopeResult.reaction.monthFortune.anti = true;
                this.命盤.horoscopeResult.新增相剋評分(this.命盤.monthFortune, '大運剋流月');
                this.消相同天干地支([this.命盤.monthFortune], 'anti');
            } else {
                this.大運流年流月與本命作用({ 流年: false });
                this.本命互相合();
            }
            this.作用狀態 = true;
        }
    }

    流月剋大運() {
        if (!this.命盤.monthFortune) {
            return;
        }

        if (
            this.尚未作用() &&
            this.是否相刻(this.命盤.monthFortune, this.命盤.bigFortune)
        ) {
            this.本命互相合(); // 丙丁辛丁 | 甲庚, 丙辛合完後才看丁能不能救
            this.大運流年流月與本命作用({ 大運: false });
            if (this.屬性尚未作用(命盤結果屬性.bigFortune) &&
                this.屬性尚未作用(命盤結果屬性.monthFortune) &&
                !this.相剋找人救(this.命盤.monthFortune, this.命盤.bigFortune)
            ) {
                this.本命互相合();
                this.命盤.horoscopeResult.reaction.bigFortune.anti = true;
                this.命盤.horoscopeResult.新增相剋評分(this.命盤.bigFortune, '流月剋大運');
                this.消相同天干地支([this.命盤.bigFortune], 'anti');
            } else {
                this.大運流年流月與本命作用({ 流年: false });
                this.本命互相合();
            }
            this.作用狀態 = true;
        }
    }

    通用計算(加入流月 = false) {
        if (this.尚未作用()) {
            this.本命互相合();
            this.大運流年流月與本命作用({ 流月: 加入流月 });
            this.本命互相合();
            this.大運流年流月與本命作用({ 流月: 加入流月 });
        }
        this.作用狀態 = false;
    }

    大運流年被合走流月加入計算() {
        if (!this.大運流年是否被合走()) {
            return;
        }

        for (let i = this.命盤.myFateSet.length - 1; i >= 0; i--) {
            const 本命已作用 = this.屬性已作用(年月日時住轉換(i));

            if (this.是否為天干日住(i) || 本命已作用) {
                continue;
            }

            const 流月本命可以和 = this.屬性尚未作用(命盤結果屬性.monthFortune) && this.是否相合(this.命盤.myFateSet[i], this.命盤.monthFortune);
            if (流月本命可以和) {
                this.命盤.horoscopeResult.reaction[年月日時住轉換(i)].match = true;
                this.命盤.horoscopeResult.reaction.monthFortune.match = true;
            }
        }
    }

    流月是否加入計算() {
        return this.大運流年是否被合走() || this.命盤.horoscopeResult.reaction.yearFortune.cut
    }

    private 大運流年是否被合走() {
        return this.屬性已合(命盤結果屬性.bigFortune) && this.屬性已合(命盤結果屬性.yearFortune);
    }

    private 本命互相合() {
        let prevIndexStack: number[] = [];

        // 本命互相作用
        for (let i = this.命盤.myFateSet.length - 1; i >= 0; i--) {
            const 當前已作用 = this.屬性已作用(年月日時住轉換(i));

            if (this.是否為天干日住(i) || 當前已作用) {
                continue;
            }


            if (prevIndexStack.length === 0) {
                prevIndexStack.push(i);
                continue;
            }

            const prevIndex = prevIndexStack[prevIndexStack.length - 1];
            const 前一個還沒作用 = !this.屬性已作用(年月日時住轉換(prevIndex));
            if (前一個還沒作用 && this.是否相合(this.命盤.myFateSet[i], this.命盤.myFateSet[prevIndex])) {
                this.命盤.horoscopeResult.reaction[年月日時住轉換(i)].match = true;
                this.命盤.horoscopeResult.reaction[年月日時住轉換(prevIndex)].match = true;
                prevIndexStack.pop();
            } else {
                prevIndexStack.push(i);
            }
        }
        return prevIndexStack;
    }

    private 大運流年流月與本命作用(
        data: Partial<{
            大運: boolean,
            流年: boolean,
            流月: boolean
        }> = {}) {
        const defaultData = { 大運: true, 流年: true, 流月: true };
        const newData = { ...defaultData, ...data };
        const 已作用集 = new Set<天干 | 地支>();

        for (let i = this.命盤.myFateSet.length - 1; i >= 0; i--) {
            const 本命已合 = this.屬性已作用(年月日時住轉換(i));

            if (this.是否為天干日住(i) || 本命已合) {
                continue;
            }

            const 大運本命可以合 = this.屬性尚未作用(命盤結果屬性.bigFortune) && this.是否相合(this.命盤.myFateSet[i], this.命盤.bigFortune);
            if (newData?.大運 && 大運本命可以合) {
                this.命盤.horoscopeResult.reaction[年月日時住轉換(i)].match = true;
                this.命盤.horoscopeResult.reaction.bigFortune.match = true;
                已作用集.add(this.命盤.bigFortune);
            }

            const 流年本命可以合 = this.屬性尚未作用(命盤結果屬性.yearFortune) && this.是否相合(this.命盤.myFateSet[i], this.命盤.yearFortune);
            if (newData?.流年 && 流年本命可以合) {
                this.命盤.horoscopeResult.reaction[年月日時住轉換(i)].match = true;
                this.命盤.horoscopeResult.reaction.yearFortune.match = true;
                已作用集.add(this.命盤.yearFortune);
            }

            const 流月本命可以和 = this.屬性尚未作用(命盤結果屬性.monthFortune) && this.是否相合(this.命盤.myFateSet[i], this.命盤.monthFortune);
            if ((newData?.流月) && 流月本命可以和) {
                this.命盤.horoscopeResult.reaction[年月日時住轉換(i)].match = true;
                this.命盤.horoscopeResult.reaction.monthFortune.match = true;
                已作用集.add(this.命盤.monthFortune!);
            }
        }

        if (已作用集.size != 0) {
            for (let i = this.命盤.myFateSet.length - 1; i >= 0; i--) {
                const 本命已合 = this.屬性已作用(年月日時住轉換(i));

                if (this.是否為天干日住(i) || 本命已合 || !已作用集.has(this.命盤.myFateSet[i])) {
                    continue;
                }

                this.命盤.horoscopeResult.reaction[年月日時住轉換(i)].match = true;
            }
        }
    }

    private 消相同天干地支(
        被消資料: (天干 | 地支)[],
        合或剋: 'match' | 'anti' = 'match'
    ) {
        for (let i = 0; i < this.命盤.myFateSet.length; i++) {
            if (this.是否為天干日住(i) || this.屬性已作用(年月日時住轉換(i))) {
                // 日住不作用
                continue;
            }

            if (被消資料.includes(this.命盤.myFateSet[i])) {
                this.命盤.horoscopeResult.reaction[年月日時住轉換(i)][合或剋] = true;
                合或剋 === 'anti' && this.命盤.horoscopeResult.antiWuHinCount[五行轉換(this.命盤.myFateSet[i])]++;
            }
        }


        if (被消資料.includes(this.命盤.bigFortune) && !this.屬性已作用(命盤結果屬性.bigFortune)) {
            this.命盤.horoscopeResult.reaction.bigFortune[合或剋] = true;
            合或剋 === 'anti' && this.命盤.horoscopeResult.antiWuHinCount[五行轉換(this.命盤.bigFortune)]++;

        }

        if (被消資料.includes(this.命盤.yearFortune) && !this.屬性已作用(命盤結果屬性.yearFortune)) {
            this.命盤.horoscopeResult.reaction.yearFortune[合或剋] = true;
            合或剋 === 'anti' && this.命盤.horoscopeResult.antiWuHinCount[五行轉換(this.命盤.yearFortune)]++;

        }
    }

    private 相剋找人救(剋人: 天干 | 地支, 被剋: 天干 | 地支) {
        for (let i = 0; i < this.命盤.myFateSet.length; i++) {
            const 元素已作用 = this.屬性已作用(年月日時住轉換(i));
            if (this.是否為天干日住(i) || 元素已作用) {
                continue;
            }

            if (this.是否能救(this.命盤.myFateSet[i], 剋人, 被剋)) {
                return true;
            }
        }
        return false;
    }


    private 是否能救(本命: 天干 | 地支, 剋人: 天干 | 地支, 被剋: 天干 | 地支) {
        const 本命五行 = 五行轉換(本命);
        const 剋人五行 = 五行轉換(剋人);
        const 被剋五行 = 五行轉換(被剋);
        const 作用主體刻被作用主體 = 五行相刻對照表.get(剋人五行) === 被剋五行;
        const 不是陰剋陽作用主體 = !this.是否陰作用陽(本命, 剋人);
        const 不是陰救陽被作用目標 = !this.是否陰作用陽(本命, 被剋);

        return (
            不是陰剋陽作用主體 &&
            不是陰救陽被作用目標 &&
            作用主體刻被作用主體 &&
            五行互救對照表.get(本命五行)?.find((data) => data === 被剋五行)
        );
    }

    private 是否為天干日住(index: number) {
        return this.是否為天干 && index === 1;
    }

    private 是否相合(key: 天干 | 地支, value?: 天干 | 地支) {
        return !value ? false : 相合對照表.get(key) === value;
    }

    private 是否相刻(剋人: 天干 | 地支, 被剋: 天干 | 地支) {
        const 不是陰剋陽作用主體 = !this.是否陰作用陽(剋人, 被剋);
        const 剋人五行 = 五行轉換(剋人);
        const 被剋五行 = 五行轉換(被剋);

        return 不是陰剋陽作用主體 && 五行相刻對照表.get(剋人五行) === 被剋五行;
    }

    private 是否陰作用陽(目標: 天干 | 地支, 被剋: 天干 | 地支) {
        return 陰列.find((陰屬性) => 目標 === 陰屬性) && 陽列.find((陽屬性) => 被剋 === 陽屬性);
    }

    private 屬性已合(屬性: 命盤結果屬性) {
        return this.命盤.horoscopeResult.reaction[屬性].match;
    }

    private 屬性已作用(屬性: 命盤結果屬性) {
        return this.命盤.horoscopeResult.reaction[屬性].match || this.命盤.horoscopeResult.reaction[屬性].anti || this.命盤.horoscopeResult.reaction[屬性].cut;
    }

    private 屬性尚未作用(屬性: 命盤結果屬性) {
        return !this.屬性已作用(屬性);
    }

    private 尚未作用() {
        return this.作用狀態 === false;
    }
}
