export class History {
    public id: number;
    public author_id: number;
    public name: string;
    public description: Text;

    constructor(id: number = null, author_id: number = null, name: string = null, description: Text = null) {
        this.id = id;
        this.author_id = author_id;
        this.name = name;
        this.description = description;
    }
}