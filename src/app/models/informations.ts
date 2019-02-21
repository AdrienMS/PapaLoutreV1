export class Information {
    label: string;
    type: string;
    value: any;
    size: number;
    canModify: boolean;
    searchValues: string[];
    id: string;

    constructor(information: {}) {
        this.label = information["label"] || null;
        this.type = information["type"] || null;
        this.value = information["value"] || null;
        this.size = information["size"] || null;
        this.canModify = information["canModify"];
        this.searchValues = information["searchValues"] || null;
        this.id = information["id"] || null;
    }

    public getDatasToJSON() {
        return {
            label: this.label,
            type: this.type,
            value: this.value,
            size: this.size,
            canModify: this.canModify,
            searchValues: this.searchValues,
            id: this.id
        }
    }
}