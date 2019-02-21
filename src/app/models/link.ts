export class Link {
    id: string;
    informations: any[];
    firstCharacter: string;
    secondCharacter: string;
    story_id: string;

    constructor(id: string, informations: any[], firstCharacter: string, secondCharacter: string, story_id: string) {
        this.id = id;
        this.story_id = story_id;
        this.informations = informations;
        this.firstCharacter = firstCharacter;
        this.secondCharacter = secondCharacter;
    }

    getDatasToJson() {
        return {
            id: this.id,
            story_id: this.story_id,
            informations: this.informations,
            firstCharacter: this.firstCharacter,
            secondCharacter: this.secondCharacter
        }
    }
}