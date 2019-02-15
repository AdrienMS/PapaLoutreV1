export class PlaceLink {
    id: string;
    story_id: string;
    places_id: string[];
    informations: PlaceLinkInformation[];

    constructor(id: string, story_id, places_id, informations: any[]) {
        this.id = id;
        this.story_id = story_id;
        this.places_id = places_id;
        this.informations = [];
        informations.forEach(information => {
            this.informations.push(new PlaceLinkInformation(information));
        });
    }

    getDatasToJSON() {
        let returnJSON = {id: this.id, story_id: this.story_id, places_id: this.places_id, informations: []};
        this.informations.forEach(information => {
            returnJSON.informations.push(information.getDatasToJSON());
        });
        return returnJSON;
    }
}

export class PlaceLinkInformation {
    label: string;
    type: string;
    value: any;
    size: number;
    canModify: boolean;
    searchValues: string[];

    constructor(information: {}) {
        this.label = information["label"] || null;
        this.type = information["type"] || null;
        this.value = information["value"] || null;
        this.size = information["size"] || null;
        this.canModify = information["canModify"];
        this.searchValues = information["searchValues"] || null;
    }

    getDatasToJSON() {
        return {
            label: this.label,
            type: this.type,
            value: this.value,
            size: this.size,
            canModify: this.canModify,
            searchValues: this.searchValues
        }
    }
}