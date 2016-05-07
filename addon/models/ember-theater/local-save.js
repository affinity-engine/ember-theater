import DS from 'ember-data';
import Ember from 'ember';
import moment from 'moment';
import { LokiJSModelMixin } from 'ember-lokijs';

const {
  Model,
  attr
} = DS;

const {
  computed,
  get
} = Ember;

const { inject: { service } } = Ember;

export default Model.extend(LokiJSModelMixin, {
  isAutosave: attr('boolean'),
  name: attr('string'),
  statePoints: attr('array'),
  theaterId: attr('string'),

  i18n: service(),

  activeState: computed('statePoints', {
    get() {
      const data = get(this, 'statePoints.lastObject');

      return Ember.Object.create(data);
    }
  }).readOnly(),

  updated: computed('meta.created', 'meta.updated', {
    get() {
      return get(this, 'meta.updated') || get(this, 'meta.created');
    }
  }).readOnly(),

  fullName: computed('name', 'activeState.sceneName', 'updated', {
    get() {
      let name = get(this, 'name') || get(this, 'activeState.sceneName');

      if (get(this, 'isAutosave')) {
        const autoTranslation = get(this, 'i18n').t('ember-theater.local-save.auto');

        name = `${autoTranslation}: ${name}`;
      }

      return `${name}, ${moment(get(this, 'updated')).format('MM/DD/YY h:mm:ss A')}`;
    }
  })
});
