export class Place {
    id: string;
    story_id: string;
    position: PlacePosition;
    sections: PlaceSection[];

    constructor(id: string, story_id: string, position: {left: number, top: number}, sections: any[]) {
        this.id = id;
        this.story_id = story_id;
        this.position = new PlacePosition(position);
        this.sections = [];
        sections.forEach(section => {
            this.sections.push(new PlaceSection(section));
        });
    }

    public getDatasToJSON() {
        let returnJSON = {id: this.id, story_id: this.story_id, position: this.position.getDatasToJSON(), sections: []};
        this.sections.forEach(section => {
            returnJSON.sections.push(section.getDatasToJSON());
        });
        return returnJSON;
    }
}

export class PlacePosition {
    left: number;
    top: number;

    constructor(position: {left: number, top: number}) {
        if (position["left"] == undefined) {
            this.left = 0;
        } else {
            this.left = position["left"];
        }
        if (position["top"] == undefined) {
            this.top = 0;
        } else {
            this.top = position["top"];
        }
    }

    public getDatasToJSON() {
        let returnJSON = {left: this.left, top: this.top};
        return returnJSON;
    }

}

export class PlaceSection {
    name: string;
    informations: PlaceInformation[];

    constructor(datas: {}) {
        this.name = datas["name"];
        this.informations = [];
        datas["informations"].forEach(information => {
            this.informations.push(new PlaceInformation(information));
        });
    }

    public getDatasToJSON() {
        let returnJSON = {name: this.name, informations: []};
        this.informations.forEach(information => {
            returnJSON.informations.push(information.getDatasToJSON());
        });
        return returnJSON;
    } 
}

export class PlaceInformation {
    label: string;
    type: string;
    value: any;
    size: number;
    canModify: boolean;
    searchValues: any[];

    constructor(information: {}) {
        this.label = information["label"] || null;
        this.type = information["type"] || null;
        this.value = information["value"] || null;
        this.size = information["size"] || null;
        this.canModify = information["canModify"];
        this.searchValues = information["searchValues"] || null;
    }

    public getDatasToJSON() {
        let returnJSON = {label: this.label, type: this.type, value: this.value, size: this.size, canModify: this.canModify, searchValues: this.searchValues};
        return returnJSON;
    }
}