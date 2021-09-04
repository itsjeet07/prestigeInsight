import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TableSorting {
    sortx = true;
    key: any;
    constructor() { }

    compare = (a: { [x: string]: string }, b: { [x: string]: string }): any => {
        // Use toUpperCase() to ignore character casing
        const bandA = a[this.key].toString().toUpperCase();
        const bandB = b[this.key].toString().toUpperCase();

        let comparison = 0;
        if (this.sortx === true) {
            if (bandA > bandB) {
                comparison = 1;
            } else if (bandA < bandB) {
                comparison = -1;
            }
        } else {
            if (bandA < bandB) {
                comparison = 1;
            } else if (bandA > bandB) {
                comparison = -1;
            }
        }
        return comparison;
    };

    Sort = (column: any, tableData: any): any => {
        this.key = column;
        this.sortx = !this.sortx;
        return tableData?.sort(this.compare);
    };
}
