import DS from 'ember-data';
import Ember from 'ember';
import NormalizePatchMixin from 'ember-theater/mixins/json-serializer-normalize-patch';

const { JSONSerializer } = DS;
const { isPresent } = Ember;

export default JSONSerializer.extend(NormalizePatchMixin, {
  primaryKey: '$loki',

  // Need to overwrite, or else extractMeta will remove the meta object from the payload
  extractMeta() {},

  serialize(snapshot) {
    const record = snapshot.attributes();
    
    if (isPresent(snapshot.id)) {
      record.$loki = parseInt(snapshot.id, 10);
    }

    return record;
  }
});
