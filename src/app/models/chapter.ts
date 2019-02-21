import { Information } from './informations';
import { TimelinePeriod } from './timeline';

export class Chapter extends TimelinePeriod {
    informations: Information[];
    children: Chapter[];
    order: number;
    level: number;
    progression: number;
    write: string;
    i_parents: number[];

    constructor(
        id: string,
        story_id: string,
        name: string,
        description: string,
        type: string,
        start: {format: string, year: number, month: number, day: number},
        end: {format: string, year: number, month: number, day: number},
        informations: {label: string, type: string, value: any, size: number, canModify: boolean, searchValues: string[]}[] = null,
        children: Chapter[] = null,
        order: number,
        level: number,
        progression: number,
        write: string,
        i_parents: number[] = null
    ) {
        super(id, story_id, name, description, type, start, end);
        if (informations == null) {
            this.informations = null;
        } else {
            this.informations = [];
            informations.forEach(information => {
                this.informations.push(new Information(information));
            });
        }
        if (children == null) {
            this.children = null;
        } else {
            this.children = [];
            children.forEach(child => {
                this.children.push(new Chapter(child.id, child.story_id, child.name, child.description, child.type, child.start, child.end, child.informations, child.children, child.order, child.level, child.progression, child.write, child.i_parents));
            });
        }
        this.order = order;
        this.level = level;
        this.progression = progression;
        this.write = write;
        this.i_parents = i_parents;
    }

    public getDataToJSON() {
        let returnDatas = {
            id: this.id,
            story_id: this.story_id,
            name: this.name,
            description: this.description,
            type: this.type,
            start: this.start.getDataToJSON(),
            end: this.end.getDataToJSON(),
            informations: [],
            children: [],
            order: this.order,
            level: this.level,
            progression: this.progression,
            write: this.write,
            i_parents: this.i_parents
        }
        if (this.informations != null) {
            this.informations.forEach(information => {
                returnDatas.informations.push(information.getDatasToJSON());
            });
        }
        if (this.children != null) {
            this.children.forEach(child => {
                returnDatas.children.push(child.getDataToJSON());
            });
        }
        return returnDatas;
    }
}