import { load } from "@angular/core/src/render3";

export class characterSheet {
    name: string;
    items: FieldCharacter[];

    constructor(name: string = null, items: FieldCharacter[] = null) {
        this.name = name;
        this.items = items;
    }

    getDatasToJson() {
        let returnJSON = {name: this.name, items: []};
        //this.items = [];
        for (let i = 0; i < this.items.length; i += 1) {
            returnJSON.items.push(this.items[i].getDatasToJSON());
        }
        return returnJSON;
    }
}

export class FieldCharacter {
    label: string;
    type: string;
    size: string;
    value: any = null;
    searchValues: { value: string }[] = null;
    canModify: boolean = true;
    loadImage: any = null;

    constructor(
        label: string = null,
        type: string = null,
        size: string = null,
        value: any = null,
        searchValues: {value: string}[] = null,
        canModify: boolean = null,
        loadImage = null
        ) {
        this.label = label;
        this.type = type;
        this.size = size;
        this.value = value;
        this.searchValues = searchValues;
        this.canModify = canModify;
        this.loadImage = loadImage;
    }
  
    getDatasToJSON() {
        /*if (this.type != "file" ) {
            return {
                label: this.label,
                type: this.type,
                size: this.size,
                value: this.value,
                searchValues: this.searchValues,
                canModify: this.canModify
            }
        } else if (this.value != "" && this.value != null) {*/
            return {
                label: this.label,
                type: this.type,
                size: this.size,
                value: this.value,
                searchValues: this.searchValues,
                canModify: this.canModify
            }
        //}
    }
}

export class SearchData {
    items: any;
  
    constructor(items) {
      this.items = items;
    }
  
    filterItems(searchTerm){
      return this.items.filter((item) => {
        return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });    
    }
}

export class FirebaseDatasCharacters {
    id: string;
    story_id: string;
    character: characterSheet[];
    top: number;
    left: number;
}