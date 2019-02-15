export class Character {
    public id: number;
    public author_id: number;
    public history_id: number;
    public name: string;
    public first_name: string;
    public fields: String;
    public links: Text;
    public pos_x: number;
    public pos_y: number;

    public p_fields: Array<string>;

    constructor(id: number = null,
        author_id: number = null,
        history_id: number = null,
        name: string = null,
        first_name: string = null,
        fields: Text = null,
        links: Text = null,
        pos_x: number = null,
        pos_y: number = null) {
        this.id = id;
        this.author_id = author_id;
        this.history_id = history_id;
        this.name = name;
        this.first_name = first_name;
        this.fields = String(fields);
        this.links = links;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
    }
}