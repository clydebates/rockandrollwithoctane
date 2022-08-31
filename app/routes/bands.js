import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';

class Band {
  @tracked name;
  constructor({ id, name, songs }) {
    this.id = id;
    this.name = name;
    this.songs = songs;
  }
}

class Song {
  constructor({ title, rating, band }) {
    this.title = title;
    this.rating = rating;
    this.band = band;
  }
}

export default class BandsRoute extends Route {
  model() {
    const blackDog = new Song({
      title: 'Black Dog',
      band: 'Led Zepplin',
      rating: 3,
    });

    const yellowLedbetter = new Song({
      title: 'Yellow Ledbetter',
      band: 'Pearl Jam',
      rating: 1,
    });

    const pretender = new Song({
      title: 'The Prentender',
      band: 'Foo Fighters',
      rating: 3,
    });

    const daughter = new Song({
      title: 'Daughter',
      band: 'Pearl Jam',
      rating: 3,
    });

    const ledZepplin = new Band({
      id: 'led-zepplin',
      name: 'Led Zepplin',
      songs: [blackDog],
    });

    const pearlJam = new Band({
      id: 'pearl-jam',
      name: 'Pearl Jam',
      songs: [yellowLedbetter, daughter],
    });

    const fooFighters = new Band({
      id: 'foo-fighters',
      name: 'Foo Fighters',
      songs: [pretender],
    });

    return [ledZepplin, pearlJam, fooFighters];
  }
}