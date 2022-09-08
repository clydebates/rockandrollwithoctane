import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { Song } from '../../../models/song';

export default class BandsBandSongsRoute extends Route {
  @service catalog;

  async model() {
    const band = this.modelFor('bands.band');
    await this.catalog.fetchRelated(band, 'songs');
    return band;
  }

  resetController(controller) {
    controller.title = '';
    controller.showAddSong = true;
  }
}
