import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class BandsBandSongsController extends Controller {
  @service catalog;

  @tracked showAddSong = true;
  @tracked title = '';

  @action
  updateTitle(event) {
    this.title = event.target.value;
  }

  @action
  async saveSong() {
    this.catalog.create('song', { title: this.title }, {band: {
      data: {
        id: this.model.id,
        type: 'bands'
      }
    }});

    this.model.songs = this.catalog.songs;
    this.title = '';
    this.showAddSong = true;
  }

  @action
  async updateRating(song, rating) {
    song.rating = rating;
    this.catalog.update('song', song, {rating});
  }

  @action
  cancel() {
    this.title = '';
    this.showAddSong = true;
  }
}
