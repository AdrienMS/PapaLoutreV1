import { FirebaseDatasCharacters } from './character';
import { PlaceLink } from './placeLink';
import { TimelineEvent, TimelinePeriod } from './timeline';
import { Place } from './place';
import { Chapter } from './chapter';
import { Story } from './story';
import { Link } from './link';

export class EIStory {
    user: string;
    chapters: Chapter[];
    characters: FirebaseDatasCharacters[];
    linksCharacter: Link[];
    places: Place[];
    linksPlaces: PlaceLink[];
    story: Story;
    timelineEvent: TimelineEvent[];
    timelinePeriod: TimelinePeriod[];

    constructor(user: string, chapters: Chapter[], characters: FirebaseDatasCharacters[], linksCharacter: Link[], places: Place[], linksPlaces: PlaceLink[], story: Story, timelineEvent: TimelineEvent[], timelinePeriod: TimelinePeriod[]) {
        this.user = user;
        this.chapters = chapters;
        this.characters = characters;
        this.linksCharacter = linksCharacter;
        this.places = places;
        this.linksPlaces = linksPlaces;
        this.story = story;
        this.timelineEvent = timelineEvent;
        this.timelinePeriod = timelinePeriod;
    }

    getDatasToJson() {
        let returnData = {
            user: this.user,
            chapters: [],
            characters: [],
            linksCharacter: [],
            places: [],
            linksPlaces: [],
            story: this.story.getDatasToJson(),
            timelineEvent: [],
            timelinePeriod: []
        }
        if (this.chapters != null) {
            this.chapters.forEach(chap => {
                returnData.chapters.push(chap.getDataToJSON());
            });
        }
        if (this.characters != null) {
            this.characters.forEach(char => {
                returnData.characters.push(char.getDatasToJson());
            });
        }
        if (this.linksCharacter != null) {
            this.linksCharacter.forEach(lc => {
                returnData.linksCharacter.push(lc.getDatasToJson());
            });
        }
        if (this.places != null) {
            this.places.forEach(pl => {
                returnData.places.push(pl.getDatasToJSON());
            });
        }
        if (this.linksPlaces != null) {
            this.linksPlaces.forEach(lp => {
                returnData.linksPlaces.push(lp.getDatasToJSON());
            });
        }
        if (this.timelineEvent != null) {
            this.timelineEvent.forEach(te => {
                returnData.timelineEvent.push(te.getDataToJSON());
            });
        }
        if (this.timelinePeriod != null) {
            this.timelinePeriod.forEach(tp => {
                returnData.timelinePeriod.push(tp.getDataToJSON());
            });
        }
        return returnData;
    }
}