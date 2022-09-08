import Service from '@ember/service';
import { tracked } from 'tracked-built-ins';
import { Band } from '../models/band';
import { Song } from '../models/song';

function extractRelationships(object) {
    const rels = {};
    for (let relationshipName in object) {
        rels[relationshipName] = object[relationshipName].links.related;
    }

    return rels;
}

export default class CatalogService extends Service {
    storage = {};

    constructor() {
        super(...arguments);
        this.storage.bands = tracked([]);
        this.storage.songs = tracked([]);
    }

    async fetchAll(type) {
        const response = await fetch(`/${type}`);
        const json = await response.json();
        this.loadAll(json);
        let result = type === 'bands' ? this.bands : this.songs;
        return result;
    }

    async fetchRelated(record, relationship) {
        const url = record.relationships[relationship];
        const response = await fetch(url);
        const json = await response.json();
        if (Array.isArray(json.data)) {
            record[relationship] = this.loadAll(json);
        } else {
            record[relationship] = this.load(json);
        }
        return record[relationship];
    }

    loadAll(json) {
        const records = [];
        for (let item of json.data) {
            records.push(this._loadResource(item));
        }
        return records;
    }

    load(response) {
        return this._loadResource(response.data);
    }

    _loadResource(data) {
        let record;
        const { id, type, attributes, relationships } = data;
        const rels = extractRelationships(relationships);
        if (type === 'bands') {
            record = new Band({ id, ...attributes }, rels);
            this.add('band', record);
        } else {
            record = new Song({ id, ...attributes }, rels);
            this.add('song', record);
        }
        return record;
    }

    async create(type, attributes, relationships = {}) {
        const payload = {
            data: {
                type: type === 'band' ? 'bands' : 'songs',
                attributes,
                relationships,
            },
        };

        const response = await fetch(type === 'band' ? '/bands' : '/songs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(payload),
        });

        const json = await response.json();
        return this.load(json);
    }

    async update(type, record, attributes) {
        const payload = {
            data: {
                id: record.id,
                type: type === 'band' ? 'bands' : 'songs',
                attributes,
            },
        };
        
        const url = type === 'band' ? `/bands/${record.id}` : `/songs/${record.id}`;

        await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(payload),
        });
    }

    add(type, record) {
        let collection = type === 'band' ? this.storage.bands : this.storage.songs;
        collection.push(record);
    }

    find(type, filterFn) {
        let collection = type === 'band' ? this.storage.bands : this.storage.songs;
        return collection.find(filterFn);
    }

    get bands() {
        return this.storage.bands;
    }

    get songs() {
        return this.storage.songs;
    }
}
