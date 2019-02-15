import { Information } from './informations';
import { TimelinePeriod } from './timeline';

export class Plot extends TimelinePeriod {
    informations: Information[];
    is_event: boolean

    constructor(
        id: string,
        story_id: string,
        name: string,
        description: string,
        type: string,
        start: {format: string, year: number, month: number, day: number},
        end: {format: string, year: number, month: number, day: number},
        informations: {label: string, type: string, value: any, size: number, canModify: boolean, searchValues: string[]}[],
        is_event: boolean
    ) {
        super(id, story_id, name, description, type, start, end);
        informations.forEach(information => {
            this.informations.push(new Information(information));
        });
        this.is_event = is_event;
    }

    public getDataToJSON() {
        let returnDatas = {
            id: this.id,
            story_id: this.story_id,
            name: this.name,
            description: this.description,
            start: this.start.getDataToJSON(),
            end: this.end.getDataToJSON(),
            informations: [],
            is_event: this.is_event
        }
        this.informations.forEach(information => {
            returnDatas.informations.push(information.getDatasToJSON());
        });
        return returnDatas;
    }
}