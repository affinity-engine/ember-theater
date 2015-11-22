import DS from 'ember-data';
import Ember from 'ember';
import NormalizePatchMixin from 'ember-theater/mixins/json-serializer-normalize-patch';
import nativeCopy from 'ember-theater/utils/native-copy';

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

    record.meta = nativeCopy(record.meta);

    return record;
  }
});
