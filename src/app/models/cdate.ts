export class CDate {
    year: number;
    month: number;
    day: number;

    constructor(year: number, month: number, day: number) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    public getDays(): number {
        return this.getNumberOfDaysOfYear() + this.getNumberDaysOfMonth() + this.month + this.day;
    }

    public isBissextile(year) {
        if ((Math.round(year / 400)) * 400 ==year) {
            return true;
        } else if ((Math.round(year / 4)) * 4 == year) {
            return true;
        }
        return false;
    }

    private getNumberDaysOfMonth() {
        let total = 0;
        for (let i = 1; i < this.month - 1; i += 1) {
            if (i == 4 || i == 6 || i == 10 || i == 12) {
                total += 30;
            } else if (i == 2) {
                if (this.isBissextile(this.year)) {
                    total += 29;
                } else {
                    total += 28;
                }
            } else {
                total += 31;
            }
        }
        return total;
    }
    private getNumberOfDaysOfYear() {
        let total = 0;
        if (this.year > 0) {
            for (let i = 0; i < this.year - 1; i += 1) {
                if (this.isBissextile(i)) {
                    total += 366;
                } else {
                    total += 365;
                }
            }
        } else {
            for (let i = 0; i > this.year - 1; i -= 1) {
                if (this.isBissextile(i)) {
                    total += 366;
                } else {
                    total += 365;
                }
            }
        }
        return total;
    }
}