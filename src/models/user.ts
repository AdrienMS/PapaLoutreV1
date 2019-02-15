export class User {
    public id: number;
    public name: string;
    public email: string;
    public status: number;
    public token: string;

    constructor(id: number = null, name: string = null, email: string = null, status: number = null, token: string = null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.status = status;
        this.token = token;
    }
}