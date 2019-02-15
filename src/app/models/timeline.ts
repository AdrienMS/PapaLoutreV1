export class TimelineEvent {
    id: string;
    story_id: string;
    name: string;
    description: string;
    type: string;
    start: TimelineDate;

    constructor(id: string,
        story_id: string,
        name: string,
        description: string,
        type: string,
        start: {format: string, year: number, month: number, day: number}
    ) {
        this.id = id;
        this.story_id = story_id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.start = new TimelineDate(start);
    }

    public getDataToJSON() {
        return {
            id: this.id,
            story_id: this.story_id,
            name: this.name,
            description: this.description,
            start: this.start.getDataToJSON()
        }
    }
}

export class TimelinePeriod extends TimelineEvent{
    end: TimelineDate;

    constructor(
        id: string,
        story_id: string,
        name: string,
        description: string,
        type: string,
        start: {format: string, year: number, month: number, day: number},
        end: {format: string, year: number, month: number, day: number}
    ) {
        super(id, story_id, name, description, type, start);
        this.end = new TimelineDate(end);
    }

    public getDataToJSON() {
        return {
            id: this.id,
            story_id: this.story_id,
            name: this.name,
            description: this.description,
            start: this.start.getDataToJSON(),
            end: this.end.getDataToJSON()
        }
    }
}

export class TimelineDate {
    format: string; // jj/mm/year or mm/year or year
    year: number;
    month: number;
    day: number;

    constructor(data: {format: string, year: number, month: number, day: number}) {
        this.format = data.format;
        this.year = data.year;
        this.month = data.month;
        this.day = data.day;
    }

    public getDataToJSON() {
        return {
            format: this.format,
            year: this.year,
            month: this.month,
            day: this.day
        }
    }
}

export class TimelineOption {
    id: string;
    story_id: string;
    scale: number;
    date_format: string; // jj/mm/year or mm/year or year

    constructor(id: string, story_id: string, scale: number, date_format: string) {
        this.id = id;
        this.story_id = story_id;
        this.scale = scale;
        this.date_format = date_format;
    }

    public getDataToJSON() {
        return {
            id: this.id,
            story_id: this.story_id,
            scale: this.scale,
            date_format: this.date_format
        }
    }
}