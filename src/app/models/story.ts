export class Story {
    id: string;
    story_id: string;
    description: string;
    img: string;
    is_private: boolean;
    title: string;
    user_id: string;

    constructor(id: string, story_id: string, description: string, img: string, is_private: boolean, title: string, user_id: string) {
        this.id = id;
        this.story_id = story_id;
        this.description = description;
        this.img = img;
        this.is_private = is_private;
        this.title = title;
        this.user_id = user_id;
    }

    getDatasToJson() {
        return {
            id: this.id,
            story_id: this.story_id,
            description: this.description,
            img: this.img,
            is_private: this.is_private,
            title: this.title,
            user_id: this.user_id
        }
    }
}